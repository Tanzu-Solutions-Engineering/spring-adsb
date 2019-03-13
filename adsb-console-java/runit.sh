#!/bin/sh
java -cp target/adsb-console-1.0-SNAPSHOT.jar:../sdr-java/connectors/adsb/target/sdr-java-adsb-connector-1.0-SNAPSHOT.jar io.pivotal.pa.adsbconsole.server.Main http://127.0.0.1:8081/data/aircraft.json $AMQP_URL 

