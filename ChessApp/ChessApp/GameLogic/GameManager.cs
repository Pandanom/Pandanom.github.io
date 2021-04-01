using ChessApp.Controllers.Helpers;
using ChessApp.Models;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ChessApp.GameLogic
{
    public class GameManager
    {
        private const int brdSize = 8;
        
        private static GameManager instance;
        private static readonly object padLock = new object();
        Task timer;
        CancellationToken token;
        public ConcurrentDictionary<string, Game> Games { get; set; }

        public static GameManager Instance
        {
            get
            {
                lock (padLock)
                {
                    return instance ?? (instance = new GameManager());
                }
            }
        }

        private string Number2String(int number, bool isCaps)
        {
            char c = (char)((isCaps ? 65 : 97) + (number - 1));
            return c.ToString();

        }

        public async Task TryMove(User u, string gK, string xy1xy2)
        {
            if (xy1xy2.Length < 4)
                return;
            int x1 = 0, y1 = 0, x2 = 0, y2 = 0;
            if (!int.TryParse(xy1xy2[0].ToString(), out x1)
                || !int.TryParse(xy1xy2[1].ToString(), out y1)
                || !int.TryParse(xy1xy2[2].ToString(), out x2)
                || !int.TryParse(xy1xy2[3].ToString(), out y2))
                return;

            var g = this.Games[gK];
            if (g == null || g.gameEnd)
                return;
            Side uSide = Side.none;
            if (u.userId == g.host.userId)
                uSide = g.options.direction == GameDirection.hostWhite ? Side.white : Side.black;
            else if (u.userId == g.guest.userId)
                uSide = g.options.direction != GameDirection.hostWhite ? Side.white : Side.black;
            else
                return;
            
            var f = g.board[x1][y1];
            var nf = g.board[x2][y2];
            if (f.side != uSide || nf.side == uSide || g.moveCount%2 != (int)uSide)
                return;

            g.board[x2][y2] = f;
            g.board[x1][y1] = new Figure { side = Side.none, type = FigureType.empty };

            g.moveCount++;

            var arr = new object[1];
            arr[0] = "Success";//JsonConvert.SerializeObject(true);
            var xy1 = Number2String(y1 + 1, true) + (x1 + 1).ToString();     
            var xy2 = Number2String(y2 + 1, true) + (x2 + 1).ToString();
            var kill = nf.type != FigureType.empty ? "X" : "";
            g.history += GetLogMove(string.Format("{0} moved {1} {2} =>{4} {3}", u.login, f.type.ToString(), xy1, xy2, kill));

            if(nf.type == FigureType.king)
            {
                g.history += GetLogMove(string.Format("{0} killed enemy king, game over", u.login));
                g.gameEnd = true;
                if (g.options.isRaiting)
                {
                    UserDataProvider userData = new UserDataProvider();
                    var host = userData.GetUser(g.host.userId);
                    var guest = userData.GetUser(g.guest.userId);

                    if (host != null && guest != null)
                    {
                        host.score += u.userId == host.userId ? 25 : -25;
                        guest.score += u.userId == guest.userId ? 25 : -25;
                        userData.EditUser(host);
                        userData.EditUser(guest);
                    }
                }
            }
            await Startup.gameHandler.InvokeClientMethodAsync(g.hostCS, "sendMoveResp", arr);
        }

        private Figure[][] SetFgrsOnStart()
        {
            Figure[][] board = new Figure[brdSize][];
            for (int i = 0; i < brdSize; i++)
            {
                board[i] = new Figure[brdSize];
                for (int j = 0; j < brdSize; j++)
                    if(i> 1 || i < brdSize - 2)
                        board[i][j] = new Figure();
            }

            for (int j = 0; j < brdSize; j++)
            {
                board[1][j] = new Figure { type = FigureType.pawn, side = Side.white};
                board[brdSize - 2][j] = new Figure { type = FigureType.pawn, side = Side.black };
            }
            //rook
            board[0][0] = new Figure { type = FigureType.rook, side = Side.white };
            board[brdSize - 1][0] = new Figure { type = FigureType.rook, side = Side.black };

            //knight
            board[0][1] = new Figure { type = FigureType.knight, side = Side.white };
            board[brdSize - 1][1] = new Figure { type = FigureType.knight, side = Side.black };

            //bishop
            board[0][2] = new Figure { type = FigureType.bishop, side = Side.white };
            board[brdSize - 1][2] = new Figure { type = FigureType.bishop, side = Side.black };

            //queen
            board[0][3] = new Figure { type = FigureType.queen, side = Side.white };
            board[brdSize - 1][3] = new Figure { type = FigureType.queen, side = Side.black };

            //king
            board[0][4] = new Figure { type = FigureType.king, side = Side.white };
            board[brdSize - 1][4] = new Figure { type = FigureType.king, side = Side.black };

            //rook
            board[0][brdSize - 1] = new Figure { type = FigureType.rook, side = Side.white };
            board[brdSize - 1][brdSize - 1] = new Figure { type = FigureType.rook, side = Side.black };

            //knight
            board[0][brdSize - 2] = new Figure { type = FigureType.knight, side = Side.white };
            board[brdSize - 1][brdSize - 2] = new Figure { type = FigureType.knight, side = Side.black };

            //bishop
            board[0][brdSize - 3] = new Figure { type = FigureType.bishop, side = Side.white };
            board[brdSize - 1][brdSize - 3] = new Figure { type = FigureType.bishop, side = Side.black };

            return board;
        }

        public string GetLogMove(string msg)
        {
            string time = DateTime.Now.ToString("t");
            return string.Format("[{0}]{1}\n", time, msg);
        }

        public async Task ProccessConnection(User u, GameOptions o, string socketId)
        {
            if (o.isHost)
            {
                Game g = new Game();
                g.gameEnd = false;
                g.host = u;
                g.id = o.gameKey;
                g.hostCS = socketId;
                g.board = SetFgrsOnStart();
                g.options = o;               
                g.history = GetLogMove(string.Format("{0} connected successfuly!", u.login));
                g.moveCount = 0;
                Games[o.gameKey] = g;                
            }
            else
            {
                if (!Games.ContainsKey(o.gameKey))
                {
                    object[] mess = new object[1];
                    mess[0] = "Game with this id does not exist";
                    await Startup.gameHandler.InvokeClientMethodAsync(socketId, "sendmess", mess);
                }
                else
                {
                    if (u.userId == Games[o.gameKey].host.userId)
                    {
                        Games[o.gameKey].hostCS = socketId;
                        Games[o.gameKey].history += GetLogMove(string.Format("{0} connected successfuly!", u.login));
                    }
                    else
                    {
                        Games[o.gameKey].guest = u;
                        Games[o.gameKey].guestCS = socketId;
                        Games[o.gameKey].history += GetLogMove(string.Format("{0} connected successfuly!", u.login));

                    }
                }
            }

        }

        public async Task ProccessMessage(User user, string gameId, string message)
        {
            if (Games.ContainsKey(gameId))
            {
                Games[gameId].chat += message;
            }
        }

        public void Initilize()
        {

            Games = new ConcurrentDictionary<string, Game>();
            token = new CancellationToken(false);
            timer = Task.Run(async () => {
                while (!token.IsCancellationRequested)
                {
                    await Callback();
                    await Task.Delay(200, token);
                }
            },token);
        }

        private async Task Callback()
        {
            foreach (var g in Games)
            {
                try
                {
                    //send games to clients

                    var arr = new object[1];
                    arr[0] = JsonConvert.SerializeObject(g.Value);
                    if (g.Value.hostCS != null)
                        await Startup.gameHandler.InvokeClientMethodAsync(g.Value.hostCS, "sendGame", arr);
                    if (g.Value.guestCS != null)
                        await Startup.gameHandler.InvokeClientMethodAsync(g.Value.guestCS, "sendGame", arr);                  
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
        }
        
    }
}
