package io.pivotal.pa.adsbconsole.server;

import io.pivotal.pa.decoder.Dump1090Source;
import io.pivotal.pa.positiondata.PositionDataService;
import io.pivotal.pa.adsbconsole.services.ConsolePositionDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {

    private static final Logger LOG = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) throws Exception {

        PositionDataService dataService = new ConsolePositionDataService();
        Dump1090Source dataServer = new Dump1090Source("http://127.0.0.1:8081/data/aircraft.json", dataService);
        dataServer.start();

        LOG.info("ADS-B to Console connector started. Press enter to quit.");
        System.in.read();

        dataServer.stop();

    }

}
