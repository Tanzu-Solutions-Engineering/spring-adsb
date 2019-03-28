package io.pivotal.pa.decoder;

import io.pivotal.pa.positiondata.PositionData;
import org.json.simple.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class FlightData {

    private String flight;
    private long altitude;
    private double lon;
    private long track;
    private double lat;
    private long speed;
    private long timestamp;
    private String squawk;
    private double seen;
    private double seen_pos;
    private long messages;
    private String category;
    private long vert_rate;
    private double rssi;

    private String hex;

    public static final String BLANK = "";

    public static FlightData fromJSON(JSONObject json) {
        FlightData data = new FlightData();

        // Data without flightId is unusable.
        Object flightId = json.get("flight");
        if (flightId == null || BLANK.equals(flightId.toString().trim())) {
            return data;
        }

        data.flight = flightId.toString().trim();
        data.hex = (String) json.get("hex");
        data.squawk = (String) json.get("squawk");
        data.category = (String) json.get("category");
        Object obj = json.get("lon");
        if (null == obj) {
            data.lon = 0.0d;
        } else {
          data.lon = (double)obj;
        }
        obj = json.get("altitude");
        if (null == obj) {
            data.altitude = 0;
        } else {
            if (obj.toString().equals("grnd")) {
                data.altitude = -1;
            } else {
try {
                data.altitude = (long)obj;
} catch (ClassCastException cce) {
data.altitude = -1;
}
            }
        }
        obj = json.get("track");
        if (null == obj) {
            data.track = 0;
        } else {
try {
          data.track = (long)obj;
} catch (ClassCastException cce) {
data.track= -1;
}
        }
        obj = json.get("messages");
        if (null == obj) {
            data.messages = 1;
        } else {
          data.messages = (long)obj;
        }
        obj = json.get("lat");
        if (null == obj) {
            data.lat = 0.0d;
        } else {
          data.lat = (double)obj;
        }
        obj = json.get("speed");
        if (null == obj) {
            data.speed = 0;
        } else {
          data.speed = (long)obj;
        }
        obj = json.get("vert_rate");
        if (null == obj) {
            data.vert_rate = 0;
        } else {
          data.vert_rate = (long)obj;
        }
        obj = json.get("timestamp");
        if (null == obj) {
            data.timestamp = 0;
        } else {
          data.timestamp = (long)obj;
        }
        obj = json.get("seen");
        if (null == obj) {
            data.seen = 0;
        } else {
          data.seen = (double)obj;
        }
        obj = json.get("seen_pos");
        if (null == obj) {
            data.seen_pos = 0;
        } else {
          data.seen_pos = (double)obj;
        }
        obj = json.get("rssi");
        if (null == obj) {
            data.rssi = 0;
        } else {
          data.rssi = (double)obj;
        }
        return data;
    }

    public boolean isComplete() {
        return !BLANK.equals(flight)
                && lon != 0.0
                && lat != 0.0;
    }

    public String toString() {
        StringBuilder result = new StringBuilder();
        result.append("{")
                .append("\"flight\":\"").append(flight).append("\",")
                .append("\"altitude\":").append(altitude).append(",")
                .append("\"hex\":\"").append(hex).append("\",")
                .append("\"lon\":").append(lon).append(",")
                .append("\"track\":").append(track).append(",")
                .append("\"lat\":").append(lat).append(",")
                .append("\"speed\":").append(speed).append(",")
                .append("\"timestamp\":").append(timestamp).append(",")
                .append("\"category\":\"").append(category).append("\",")
                .append("\"squawk\":\"").append(squawk).append("\",")
                .append("\"rssi\":").append(rssi).append(",")
                .append("\"messages\":").append(messages).append(",")
                .append("\"seen\":").append(seen).append(",")
                .append("\"seen_pos\":").append(seen_pos).append(",")
                .append("\"vert_rate\":").append(vert_rate)
                .append("}");
        return result.toString();
    }


    public Map toMap() {
        Map<String, Object> result = new HashMap<>();
        result.put("flight", flight);
        result.put("lon", lon);
        result.put("lat", lat);
        result.put("track", track);
        result.put("timestamp", timestamp);
        result.put("seen", seen);
        result.put("seen_pos", seen_pos);
        result.put("altitude", altitude);
        result.put("category", category);
        result.put("messages", messages);
        result.put("vert_rate", vert_rate);
        result.put("rssi", rssi);
        result.put("squawk", squawk);
        result.put("hex", hex);
        result.put("speed", speed);
        return result;
    }

    public PositionData toPositionData() {
        PositionData positionData = new PositionData()
                .withType(PositionData.ObjectType.AIRCRAFT)
                .withObjectId(flight)
                .withLongitude(lon)
                .withLatitude(lat)
                .withHeading(track)
                .withTimestamp(timestamp);
        positionData.setAltitude(altitude);
        positionData.setCategory(category);
        positionData.setHex(hex);
        positionData.setMessages(messages);
        positionData.setRssi(rssi);

        positionData.setSeen(seen);
        positionData.setSeen_pos(seen_pos);

        positionData.setSpeed(speed);
        positionData.setSquawk(squawk);
        positionData.setVert_rate(vert_rate);
        return positionData;
    }

    public Map toMapWithoutTimestamp() {
        Map result = this.toMap();
        result.remove("timestamp");
        return result;
    }

    public boolean equals(FlightData other) {
        if (other == null) {
            return false;
        }
        //return this.toMapWithoutTimestamp().equals(other.toMapWithoutTimestamp());
        return this.flight.equals(other.flight) && this.lat==other.lat && this.lon==other.lon && this.altitude==other.altitude
          && this.track==other.track;
    }

    public String getFlightId() {
        return flight;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

}
