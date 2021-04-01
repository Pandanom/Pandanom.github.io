using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChessApp.Models
{
    public class Game
    {
        public string id { get; set; }
        public string chat { get; set; }
        public string history { get; set; }
        public User host { get; set; }
        public User guest { get; set; }
        public string hostCS { get; set; }
        public string guestCS { get; set; }
        public Figure[][] board {get;set;}
        public GameOptions options { get; set;}
        public int moveCount { get; set; }
        public bool gameEnd { get; set; }
    }
}
