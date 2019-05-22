package io.pivotal.pa.rabbitmq.adsbliveprocessor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

@Component
public class LiveQueueToRedis {

    private Logger LOG = Logger.getLogger(LiveQueueToRedis.class.getName());

    @Autowired
    private RedisTemplate redisTemplate = null;

    @StreamListener(Sink.INPUT)
    public void recievedMessage(PositionData positionData) {
        System.out.println("LiveQueueToRedis Thread "  
            + Thread.currentThread().getName() + ": Received position: "
            + positionData.getFlight() + " @ Lat: " + positionData.getLat()  
            + ", Lon: " + positionData.getLon()
            + " -> Heading " + positionData.getTrack() + " Degrees"
        );

        // Note ADS-B messages provide co-ordinates in the WGS-84 (GPS) Datum, 
        // not the EPSG:900913 Datum used by online mapping tools

        // now send data to Redis for the aircraft as latest position, and 
        // with a TTL of 60 seconds past the timestamp of the message itself
        try {
            redisTemplate.opsForValue().set(positionData.getFlight(), 
                positionData);
            redisTemplate.expire(positionData.getFlight(),60,TimeUnit.SECONDS);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, 
                "Exception writing ADS-B aircraft data to Redis", e);
        }

    } // End receivedMessage

} // End LiveQueueToRedis