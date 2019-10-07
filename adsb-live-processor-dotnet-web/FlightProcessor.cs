using System;
using System.Text;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using StackExchange.Redis;
using SurveillanceProcessor;

namespace adsb_live_processor_dotnet_web
{
    public class FlightProcessor
    {
        private  IConnection _rabbitMqConnection;
        private readonly IConnectionFactory _rabbitMqConnectionFactory;
        private readonly ConnectionMultiplexer _redisConnection;
        private readonly ILogger _logger;
        private IModel _channel;
        private EventingBasicConsumer _consumer;

        public FlightProcessor(
            IConnectionFactory rabbitMqConnectionFactory, 
            ConnectionMultiplexer redisConnection, 
            ILogger<FlightProcessor> logger)
        {
//            _rabbitMqConnection = rabbitMqConnection;
            _rabbitMqConnectionFactory = rabbitMqConnectionFactory;
            _redisConnection = redisConnection;
            _logger = logger;
        }

        public void Start()
        {
            _rabbitMqConnection = _rabbitMqConnectionFactory.CreateConnection();
            _channel = _rabbitMqConnection.CreateModel();
            var queueOk = _channel.QueueDeclare(queue: "adsbposition.live",
                durable: false,
                exclusive: false,
                autoDelete: false,
                arguments: null);
            _channel.ExchangeDeclare(exchange: "adsb-fan-exchange", type: "topic", durable: true, autoDelete: false);
            _channel.QueueBind(queue: "adsbposition.live", exchange: "adsb-fan-exchange",routingKey: "");

            _channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);
            _consumer = new EventingBasicConsumer(_channel);
            _consumer.Received += (model, ea) =>
            {
                var body = ea.Body;
                var message = Encoding.UTF8.GetString(body);
                _logger.LogInformation($" [x] Received {message}");

                // parse json to get the aircraft ID (flight json property)
                var pos = JsonConvert.DeserializeObject<PositionData>(message);

                // Now send to Redis
                var db = _redisConnection.GetDatabase();
                db.StringSet(pos.flight, message);
                var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                var timeSpan = epoch.Add(TimeSpan.FromSeconds(60 + (pos.timestamp / 1000.0)));
                db.KeyExpire(pos.flight, timeSpan);

                _logger.LogInformation(" [x] Done");

                _channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            };
            _channel.BasicConsume(queue: "adsbposition.live",
                autoAck: false,
                consumer: _consumer);
        }
    }
}