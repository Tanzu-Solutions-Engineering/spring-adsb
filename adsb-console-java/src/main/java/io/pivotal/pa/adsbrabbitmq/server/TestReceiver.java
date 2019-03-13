package io.pivotal.pa.adsbrabbitmq.server;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TestReceiver {

    private static final Logger LOG = LoggerFactory.getLogger(Main.class);

    //private final static String QUEUE_NAME = "adsbposition.live";

    public static void main(String[] args) throws Exception {

        ConnectionFactory factory = new ConnectionFactory();
        factory.setUri(args[0]);
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        //channel.queueDeclare(QUEUE_NAME, false, false, false, null);

    channel.exchangeDeclare("adsb-fan-exchange", "fanout");
    String queueName = channel.queueDeclare().getQueue();
    channel.queueBind(queueName, "adsb-fan-exchange", "");

        System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println(" [x] Received '" + message + "'");
        };
        channel.basicConsume(queueName, true, deliverCallback, consumerTag -> { });
    }

}