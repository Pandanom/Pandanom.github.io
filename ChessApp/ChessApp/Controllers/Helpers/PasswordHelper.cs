using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChessApp.Controllers.Helpers
{
    public class PasswordHelper
    {
        const string _salt = "5@lt";
        public int GetHash(string str)
        {
            var stringWithSalt = _salt + str + _salt;
            return stringWithSalt.GetHashCode();
        }

    }
}
