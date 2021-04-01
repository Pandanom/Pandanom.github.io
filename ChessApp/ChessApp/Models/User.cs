using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChessApp.Models
{
    public class User
    {
        public int userId { get; set; }
        public string email { get; set; }
        public int password { get; set; }
        public string login { get; set; }
        public int score { get; set; }
    }
}
