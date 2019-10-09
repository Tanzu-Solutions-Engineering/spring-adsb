package io.pivotal.pa.rabbitmq.adsbhistoryprocessor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;
import java.sql.Timestamp;

import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

import java.text.SimpleDateFormat;
import java.text.DateFormat;
import java.util.TimeZone;
import java.util.Date;

@Component
public class HistoryQueueToPostgres {

    private Logger LOG = Logger.getLogger(HistoryQueueToPostgres.class.getName());
    private DateFormat format;
    public HistoryQueueToPostgres() {
        super();
        format = new SimpleDateFormat("yyyy-MM-dd");
        format.setTimeZone(TimeZone.getTimeZone("UTC"));
    }

    @Autowired
    private JdbcTemplate jdbcTemplate = null;

    @StreamListener(Sink.INPUT)
    public void recievedMessage(PositionData positionData) {
        System.out.println("HistoryQueueToPostgres Thread "  
            + Thread.currentThread().getName() + ": Received position: "
            + positionData.getFlight() + " @ Lat: " + positionData.getLat()  
            + ", Lon: " + positionData.getLon()
            + " -> Heading " + positionData.getTrack() + " Degrees"
        );

        // Note ADS-B messages provide co-ordinates in the WGS-84 (GPS) Datum, 
        // not the EPSG:900913 Datum used by online mapping tools

        // Insert in to greenplum, with column indexes for geometry (point), vehicle (flight) ID, full timestamp, and today's date. Store JSON natively in case it is required
        try {
            jdbcTemplate.update(
                /*
                "INSERT INTO geohistory.tracks (craftid,gpsdatetime,gpsdate,position,jsondata) VALUES (?,?,?,ST_SetSRID(ST_MakePoint(?,?),4326),to_json(?))",
                positionData.getFlight(),
                positionData.getTimestamp(),
                format.format(new Date(positionData.getTimestamp())),
                positionData.getLon(),
                positionData.getLat(),
                positionData.toString()
                */
                    "INSERT INTO geohistory.tracks (craftid,gpsdatetime,gpsdate,lon,lat,jsondata) VALUES (?,?,?,?,?,cast(? as json))",
                    positionData.getFlight(), new Timestamp(positionData.getTimestamp()),
                    format.format(new Date(positionData.getTimestamp())), positionData.getLon(), positionData.getLat(),
                    positionData.toString()
            );
        } catch (Exception e) {
            LOG.log(Level.SEVERE, 
                "Exception writing ADS-B aircraft data to Postgres", e);
        }

    } // End receivedMessage

} // End HistoryQueueToPostgres