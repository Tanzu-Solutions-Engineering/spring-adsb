using System;
using StackExchange.Redis;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Threading;
using Newtonsoft.Json;
using Steeltoe.Extensions.Configuration.CloudFoundry;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;

namespace SurveillanceProcessor
{
    class SurveillanceProcessor 
    {
        static void Main(string[] args)
        {
      // Arrange
      var services = new ServiceCollection();

      // Act and Assert
      var builder = new ConfigurationBuilder().AddCloudFoundry();
      var config = builder.Build();
      CloudFoundryServiceCollectionExtensions.ConfigureCloudFoundryOptions(services, config);



      var serviceProvider = services.BuildServiceProvider();
      var app = serviceProvider.GetService<IOptions<CloudFoundryApplicationOptions>>();
      var service = serviceProvider.GetService<IOptions<CloudFoundryServicesOptions>>();
      foreach (var sk in service.Value.Services) {
          Console.Out.WriteLine("Service available: " + sk);
      }
      Service[] redisOptionsArray = service.Value.Services["p.redis"];
      var redisUri = "";
      if (redisOptionsArray.Length > 0) {
          var creds = redisOptionsArray[0].Credentials;
          //foreach (var key in creds.Keys) {
          //    Console.Out.WriteLine(key + " = " + creds[key].Value);
          //}
          redisUri = creds["host"].Value + ":" + creds["port"].Value + ",password=" + creds["password"].Value;
      }
      Service[] rabbitOptionsArray = service.Value.Services["cloudamqp"];
      var rabbitUri = "";
      if (rabbitOptionsArray.Length > 0) {
          var creds = rabbitOptionsArray[0].Credentials;
          //foreach (var key in creds.Keys) {
          //    Console.Out.WriteLine(key + " = " + creds[key].Value);
          //}
          rabbitUri = creds["uri"].Value;
      }

            ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(
                redisUri);
        var factory = new ConnectionFactory() { Uri = new Uri(
            rabbitUri
            , UriKind.Absolute) };
        using(var connection = factory.CreateConnection())
        using(var channel = connection.CreateModel())
        {
            QueueDeclareOk queueOk = channel.QueueDeclare(queue: "adsbposition.live",
                                 durable: false,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);
            channel.ExchangeDeclare(exchange: "adsb-fan-exchange", type: "fanout", durable: false, autoDelete: false);
            channel.QueueBind(queue: "adsbposition.live", exchange: "adsb-fan-exchange",routingKey: "");

            channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

            Console.WriteLine(" [*] Waiting for messages.");

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var body = ea.Body;
                var message = Encoding.UTF8.GetString(body);
                Console.WriteLine(" [x] Received {0}", message);

                //int dots = message.Split('.').Length - 1;
                //Thread.Sleep(dots * 1000);

                // parse json to get the aircraft ID (flight json property)
                PositionData pos = JsonConvert.DeserializeObject<PositionData>(message);

                // Now send to Redis
                IDatabase db = redis.GetDatabase();
                db.StringSet(pos.flight, message);
                var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                var timeSpan = epoch.Add(TimeSpan.FromSeconds(60 + (pos.timestamp / 1000.0)));
                db.KeyExpire(pos.flight, timeSpan);

                Console.WriteLine(" [x] Done");

                channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            };
            channel.BasicConsume(queue: "adsbposition.live",
                                 autoAck: false,
                                 consumer: consumer);

            Console.WriteLine(" Press [enter] to exit.");
            Console.ReadLine();
        }
        }

        private static string GetMessage(string[] args)
        {
            return ((args.Length > 0) ? string.Join(" ", args) : "Hello World!");
        }
    }
}
