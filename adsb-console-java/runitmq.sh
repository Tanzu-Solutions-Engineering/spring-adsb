#!/bin/sh
echo "AMQP_URL must be defined. Currently: $AMQP_URL"
java -cp target/adsb-console-1.0-SNAPSHOT.jar io.pivotal.pa.adsbrabbitmq.server.Main http://127.0.0.1:8081/data/aircraft.json $AMQP_URL "Adam Fowler's Receiver"
# :../sdr-java/connectors/adsb/target/sdr-java-adsb-connector-1.0-SNAPSHOT.jar
