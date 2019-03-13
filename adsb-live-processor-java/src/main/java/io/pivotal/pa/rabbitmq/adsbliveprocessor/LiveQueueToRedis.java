package io.pivotal.pa.rabbitmq.adsbliveprocessor;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.PropertyAccessor;

import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

@Component
public class LiveQueueToRedis {

    private Logger LOG = Logger.getLogger(LiveQueueToRedis.class.getName());

    @Autowired
    private RedisTemplate redisTemplate = null;
 /*
    //@RabbitListener(queues="adsbposition.live")
    @RabbitListener(bindings = @QueueBinding(
        value = @Queue(value = "adsbposition.live", durable = "false"),
        exchange = @Exchange(value = "adsb-single-exchange", durable = "false", ignoreDeclarationExceptions = "true"),
        key = "")
    )
    */
    @StreamListener(Sink.INPUT)
    public void recievedMessage(PositionData positionData) {
        System.out.println("LiveQueueToRedis Thread " + Thread.currentThread().getName() + ": Received position: " + positionData.getFlight() + " @ Lat: " + positionData.getLat()
                + ", Lon: " + positionData.getLon() + " -> Heading " + positionData.getTrack() + " Degrees");
        // Note ADS-B messages provide co-ordinates in the WGS-84 (GPS) Datum, not the EPSG:900913 Datum used by online mapping tools

        // now send data to Redis for the aircraft as latest position, and with a TTL of
        // 60 seconds past the timestamp of the message itself

        //ObjectMapper objectMapper = new ObjectMapper();
        //objectMapper.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
        try {
            //String val = objectMapper.writeValueAsString(positionData);
            redisTemplate.opsForValue().set(positionData.getFlight(), positionData);
            redisTemplate.expire(positionData.getFlight(), 60, TimeUnit.SECONDS);
            //jedis.set(positionData.getFlight(), val);
            // jedis.expire(positionData.getObjectId(), 60);
            //jedis.expireAt(positionData.getFlight(), );
        } catch (Exception e) {
            LOG.log(Level.SEVERE, "Exception writing ADS-B aircraft data to Redis", e);
        }

    }

}