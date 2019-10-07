package io.pivotal.pa.rabbitmq.adsbcapture;

import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.stereotype.Component;

import java.io.PrintWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

@Component
public class LiveQueueToFile {

    private Logger LOG = Logger.getLogger(LiveQueueToFile.class.getName());

    private PrintWriter pw = null;

    public LiveQueueToFile() {
        super();
        try {
            pw = new PrintWriter(new FileWriter(new File(new File("~"),"adsb-capture.json")));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @StreamListener(Sink.INPUT)
    public void recievedMessage(PositionData positionData) {
        System.out.println("LiveQueueToFile Thread "  
            + Thread.currentThread().getName() + ": Received position: "
            + positionData.getFlight() + " @ Lat: " + positionData.getLat()  
            + ", Lon: " + positionData.getLon()
            + " -> Heading " + positionData.getTrack() + " Degrees"
        );

        // Note ADS-B messages provide co-ordinates in the WGS-84 (GPS) Datum, 
        // not the EPSG:900913 Datum used by online mapping tools

        // Now send the data to file
        // One JSON message per file line

        try {
            pw.println(positionData.toString());
            pw.flush();
        } catch (Exception e) {
            LOG.log(Level.SEVERE, 
                "Exception writing ADS-B aircraft data to Redis", e);
        }

    } // End receivedMessage

} // End LiveQueueToRedis