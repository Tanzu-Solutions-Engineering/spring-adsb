package io.pivotal.pa.adsbrabbitmq.services;

import io.pivotal.pa.positiondata.PositionData;
import io.pivotal.pa.positiondata.PositionDataService;
import org.json.simple.JSONObject;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.AMQP;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.PropertyAccessor;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class RabbitMQPositionDataService implements PositionDataService {

    private long tsLastMeasure;
    private long numberOfEventsReceived;

    Connection connection;
    Channel channel;

    String gsName;

    public RabbitMQPositionDataService(String host,String groundStationName) {
        gsName = groundStationName;
        getPositionData(System.currentTimeMillis(), null, null, null);
        tsLastMeasure = System.currentTimeMillis();

      ConnectionFactory factory = new ConnectionFactory();
      try {
        System.out.println("AMQP URL: " + host);
        factory.setUri(host);
        connection = factory.newConnection();
        channel = connection.createChannel();
        channel.exchangeDeclare("adsb-fan-exchange","fanout");
        //channel.queueDeclare("adsbposition", false, false, false, null);
      } catch (Exception e) {
          e.printStackTrace();
      }

    }

    @Override
    public void positionDataReceived(PositionData positionData) {
        logPositionDataReceived();

        // Write data to Console
        //Map dataMap = positionData.toMap();
        //System.out.print("ObjectType: " + dataMap.get("objectType").toString());
        //System.out.print(", ObjectId: " + dataMap.get("objectId").toString());
        //System.out.print(", longitude: " + dataMap.get("longitude").toString());
        //System.out.print(", latitude: " + dataMap.get("latitude").toString());
        //System.out.println(", heading: " + dataMap.get("heading").toString());

        //String message = "Hello World!";
        try {
            positionData.setGroundStationName(gsName);
          //channel.basicPublish("", "adsbposition", null, message.getBytes("UTF-8"));
          ObjectMapper objectMapper = new ObjectMapper();
          objectMapper.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
          String json = objectMapper.writeValueAsString(positionData);
          AMQP.BasicProperties.Builder builder = new AMQP.BasicProperties.Builder();
          // TODO set timestamp to source ADS-B message timestamp
          builder.contentType("application/json");
          AMQP.BasicProperties props = builder.build();
          //channel.basicPublish("", "adsbposition", props, json.getBytes("UTF-8"));
          channel.basicPublish("adsb-fan-exchange", "", props, json.getBytes("UTF-8")); // any (and all) queue name on this exchange
          System.out.println(" [x] Sent '" + json + "'");
        } catch (Exception e) {
            e.printStackTrace();
        }

        // TODO json support
        /*
        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(positionData);
        AMQP.BasicProperties props = new AMQP.BasicProperties();
        props.setContentType("application/json");
        Message jsonMessage = MessageBuilder
          .withBody(json.getBytes())
          .andProperties(MessagePropertiesBuilder
            .newInstance()
            .setContentType("application/json")
            .build()
          )
          .build();
        */
    }

    public List<JSONObject> getPositionData(Long minTimestamp, Long maxTimestamp, String objectId, PositionData.ObjectType objectType) {
        // this service doesn't fetch data from a DB yet
        return null;
    }


    private void logPositionDataReceived() {
        System.out.print(".");
        numberOfEventsReceived++;
        if (numberOfEventsReceived >= 50) {
            double diffSeconds = (System.currentTimeMillis() - tsLastMeasure) / 1000;
            if (diffSeconds > 0) {
                System.out.printf(" -> %.1f position events per second.\r\n", (numberOfEventsReceived / diffSeconds));
            }
            tsLastMeasure = System.currentTimeMillis();
            numberOfEventsReceived = 0;
        }
    }

}
