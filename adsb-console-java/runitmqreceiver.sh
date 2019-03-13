#!/bin/sh
java -cp target/adsb-console-1.0-SNAPSHOT.jar:../sdr-java/connectors/adsb/target/sdr-java-adsb-connector-1.0-SNAPSHOT.jar io.pivotal.pa.adsbrabbitmq.server.TestReceiver $AMQP_URL
