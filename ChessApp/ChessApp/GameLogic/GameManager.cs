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

        public async Task ProccessConnection(User u, GameOptions o, string socketId)
        {
            if (o.isHost)
            {
                Game g = new Game();
                g.host = u;
                g.id = o.gameKey;
                g.hostCS = socketId;
                g.board = new Figure[8, 8];
                for (int i = 0; i < 8; i++)
                    for (int j = 0; j < 0; j++)
                        g.board[i,j] = new Figure();
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
                    Games[o.gameKey].guest = u;
                    Games[o.gameKey].guestCS = socketId;
                }
            }
            //var exists = GameManager.Instance.Games.ContainsKey(socketId);

            //if (!exists)
            //GameManager.Instance.Games.TryAdd(game.id, game);
            

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
            try
            {
                //send games to clients
                foreach (var g in Games)
                {
                    var arr = new object[1];
                    arr[0] = JsonConvert.SerializeObject(g.Value);
                    if (g.Value.hostCS != null)
                        await Startup.gameHandler.InvokeClientMethodAsync(g.Value.hostCS, "sendGame", arr);
                    if(g.Value.guestCS != null)
                        await Startup.gameHandler.InvokeClientMethodAsync(g.Value.guestCS, "sendGame", arr);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
        
    }
}
