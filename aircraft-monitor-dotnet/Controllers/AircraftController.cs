using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Text;
using StackExchange.Redis;
using Newtonsoft.Json.Linq;

namespace aircraft_monitor_dotnet
{
  
  [Produces("application/json")]
  [Route("data/aircraft.json")]
  [ApiController]
  public class AircraftController : ControllerBase
  {
    private IDistributedCache _cache;
    private IConnectionMultiplexer _conn;

    private int messages = 0;
    public AircraftController(IDistributedCache cache, IConnectionMultiplexer conn)
    {
      _cache = cache;
      _conn = conn;
    }

    private static readonly DateTime Jan1st1970 = new DateTime
    (1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    private static long CurrentTimeMillis()
    {
      return (long)(DateTime.UtcNow - Jan1st1970).TotalMilliseconds;
    }

    [HttpGet]
    public IActionResult Get() {
      IDatabase db = _conn.GetDatabase();
      var server = _conn.GetServer(_conn.GetEndPoints()[0]);
      String list = "[";
      bool first = true;
      foreach (var key in server.Keys(pattern: "*"))
      {
        Console.WriteLine(key);
        RedisValue value = db.StringGet(key);
        if (!value.IsNullOrEmpty) {
          if (first) {
            first = false;
          } else {
            list += ",";
          }
        }
        list += value;
        messages++;
      }
      list += "]";
      string full = "{\"now\":" + CurrentTimeMillis() / 1000.0d + ", \"messages\":" + messages + " ,\"aircraft\":" + list + " }";

      // TODO string key2 = db.StringGet("ConnectionMultiplexerKey2");

      //JArray o = JArray.Parse(list);
      JObject o = JObject.Parse(full);
      return Ok(o);
      /*
      return new HttpResponseMessage()
      {
      Content = new StringContent(
            list,
            Encoding.UTF8,
            "application/json"
        )
      };
      */

//      ViewData["aircraft"] = list;

//      return View();

      //return "{}"; // TODO replace with Redis lookup
      // await redis response and return JSON for it
    }
  }
}