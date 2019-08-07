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
using StackExchange.Redis;

namespace aircraft_monitor_dotne
{
  [Produces("application/json")]
  [Route("data/aircraft.json")]
  [ApiController]
  public class AircraftController : ControllerBase
  {
    private IDistributedCache _cache;
    private IConnectionMultiplexer _conn;
    public AircraftController(IDistributedCache cache, IConnectionMultiplexer conn)
    {
      _cache = cache;
      _conn = conn;
    }

    [HttpGet]
    public ActionResult Get() {
      IDatabase db = _conn.GetDatabase();

      // TODO string key2 = db.StringGet("ConnectionMultiplexerKey2");

      ViewData["aircraft"] = "{}";

      return View();

      //return "{}"; // TODO replace with Redis lookup
      // await redis response and return JSON for it
    }
  }
}