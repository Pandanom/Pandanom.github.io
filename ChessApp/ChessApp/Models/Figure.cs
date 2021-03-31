using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChessApp.Models
{
    public class Figure
    {
        public FigureType type { get; set; } = FigureType.empty;
        public Side side { get; set; } = Side.none;
    }

    public enum FigureType : int
    {
        pawn = 0,
        bishop = 1,
        knight = 2,
        rook = 3,
        queen = 4,
        king = 5,
        empty = 6
    }

    public enum Side : int
    {
        white = 0,
        black = 1,
        none = 2
    }
}
