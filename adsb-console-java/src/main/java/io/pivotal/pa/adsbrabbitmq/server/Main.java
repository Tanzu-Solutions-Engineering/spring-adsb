package io.pivotal.pa.adsbrabbitmq.server;

import io.pivotal.pa.decoder.Dump1090Source;
import io.pivotal.pa.positiondata.PositionDataService;
import io.pivotal.pa.adsbrabbitmq.services.RabbitMQPositionDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {

    private static final Logger LOG = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) throws Exception {

        if (args.length < 3) {
            System.err.println("Expected 3 arguments: Use Main <DUMP1090URL> <RabbitMQURI> <GroundStationName>");
            System.exit(1);
        }

        PositionDataService dataService = new RabbitMQPositionDataService(args[1], args[2]);
        Dump1090Source dataServer = new Dump1090Source(args[0], dataService);
        dataServer.start();

        LOG.info("ADS-B to RabbitMQ connector started. Press enter to quit.");
        System.in.read();

        dataServer.stop();

    }

}
