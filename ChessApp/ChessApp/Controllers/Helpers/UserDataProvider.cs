using ChessApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChessApp.Controllers.Helpers
{
    public class UserDataProvider
    {
        static List<User> _users = new List<User>();
        DataManager<User> _userManager = new DataManager<User>();
        PasswordHelper _ph = new PasswordHelper(); 

        void UpdateUsers()
        {
            _userManager.SetData(_users);
        }

        public List<User> GetUsers()
        {
            if (_users.Count == 0)
                _users = new List<User>(_userManager.GetData());
            return _users;
        }

        public void EditUser(User user)
        {
            foreach(var u in _users)
                if(u.userId == user.userId)
                {
                    u.email = user.email;
                    u.login = user.login;
                    u.password = user.password;
                    u.score = user.score;
                }
        }

        public User GetUser(int id)
        {
            foreach (var u in _users)
                if (u.userId == id)
                    return u;
            return null;
        }

        public User AddUser(User user)
        {
            int id = 1;
            foreach (var u in GetUsers())
            {
                id = id > u.userId ? id : u.userId;
                if (u.email == user.email)
                    return user;
            }
            user.userId = id + 1;
            _users.Add(user);
            UpdateUsers();
            return user;
        }

        public void CreateDummy()
        {
            var rng = new Random();
            for (int i = 0; i < 20; i++)
            {
                User u = new User();
                u.email = String.Format("User{0}@gmail.com", i + 1);
                u.login = String.Format("User{0}{1}", i + 1, rng.Next(1000));
                u.password = _ph.GetHash(u.login);
                u.score = rng.Next(2000);
                AddUser(u);
            }
        }

        public bool DeleteUser(int id)
        {
            for (int i = 0; i < _users.Count; i++)
            {
                if (_users[i].userId == id)
                {
                    _users.RemoveAt(i);
                    UpdateUsers();
                    return true;
                }
            }
            return false;
        }

    }
}
