using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ChessApp.Models;
using ChessApp.Controllers.Helpers;
using System.Net.Http;

namespace ChessApp.Controllers
{
    [Route("api/Users")]
    public class SampleDataController : Controller
    {
        UserDataProvider _userData = new UserDataProvider();
        PasswordHelper _ph = new PasswordHelper();
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet("[action]")]
        public IEnumerable<User> GetUsers()
        {
            return _userData.GetUsers();
        }

        [HttpPost("[action]")]
        public IActionResult CreateUser([FromBody]UserNew u)
        {
            User tAdd = new User();
            tAdd.email = u.email;
            tAdd.login = u.login;
            tAdd.password = _ph.GetHash(u.password);
            tAdd.userId = 0;
            tAdd.score = 1000;
            var nUser = _userData.AddUser(tAdd);
            if (nUser.userId != 0)
                return Ok(nUser);
            return Ok(new User());
        }

        [HttpPost("[action]")]
        public IActionResult LogIn([FromBody]UserLogin u)
        {
            var users = _userData.GetUsers();
            foreach (var us in users)
            {
                if (us.email == u.email && us.password == _ph.GetHash(u.password))
                {
                    return Ok(us);
                }
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAcc(int id)
        {
            if(_userData.DeleteUser(id))
                return Ok("User " + id + " deleted successfully");
            return Ok();
        }


        public class UserNew
        {     
            public string email { get; set; }
            public string password { get; set; }
            public string login { get; set; }
        }

        public class UserLogin
        {
            public string email { get; set; }
            public string password { get; set; }
        }
    }
}
