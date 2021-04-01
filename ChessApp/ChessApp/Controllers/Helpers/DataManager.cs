using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ChessApp.Controllers.Helpers
{
    public class DataManager<T>
    {
        string _filePath = typeof(T).Name + ".json";
        public IEnumerable<T> GetData() {          
            List <T> ret = new List<T>();
            if (File.Exists(_filePath))
            {
                var txt = File.ReadAllText(_filePath);
                ret = JsonConvert.DeserializeObject<List<T>>(txt);
            }
            return ret;
        }

        public void SetData(IEnumerable<T> data)
        {
            string json = JsonConvert.SerializeObject(data);
            File.WriteAllText(typeof(T).Name + ".json", json);
        }
   
    }
}
