using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using System;
using System.Text;
using System.Threading.Tasks;

namespace Redis.Models
{
  public class AircraftData
  {
    internal static async Task InitializeCache(IServiceProvider serviceProvider)
    {
      if (serviceProvider == null)
      {
        throw new ArgumentNullException("serviceProvider");
      }
      using (var serviceScope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
      {
        var cache = serviceScope.ServiceProvider.GetService<IDistributedCache>();
        var conn = serviceScope.ServiceProvider.GetService<IConnectionMultiplexer>();
      }
    }
  }
}
