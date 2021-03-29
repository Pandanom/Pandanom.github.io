using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChessApp.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public int Password { get; set; }
        public string Login { get; set; }
        public int Score { get; set; }
    }
}
