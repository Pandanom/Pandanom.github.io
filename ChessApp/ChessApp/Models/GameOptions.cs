using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChessApp.Models
{
    public class GameOptions
    {
        public GameDirection direction { get; set; }
        public bool isRaiting { get; set; }
        public string gameKey { get; set; }
        public bool isHost { get; set; }
    }

    public enum GameDirection : int
    {
        hostBlack = 1,
        hostWhite = 0
    }
}
