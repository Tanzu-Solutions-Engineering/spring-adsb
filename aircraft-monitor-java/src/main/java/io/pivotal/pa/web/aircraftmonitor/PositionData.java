package io.pivotal.pa.web.aircraftmonitor;

import org.json.simple.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class PositionData {

    public enum ObjectType { AIRCRAFT, SHIP }

    private String flight;
    private double lon;
    private double lat;
    private double track;
    private double speed;
    private String hex;
    private String squawk;
    private double seen;
    private double seen_pos;
    private long messages;
    private String category;
    private long timestamp;
    private long altitude;
    private long vert_rate;
    private double rssi;
    private ObjectType type;
    private String groundStationName;

    public static final String BLANK = "";

    public static PositionData fromJSON(JSONObject json) {
        PositionData data = new PositionData();

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
            try {
                data.lon = (double) obj;
            } catch (Exception e) {
                data.lon = -1;
            }
        }
        obj = json.get("altitude");
        if (null == obj) {
            data.altitude = 0;
        } else {
            if (obj.toString().equals("grnd")) {
                data.altitude = -1;
            } else {
                try {
                    data.altitude = (long) obj;
                } catch (Exception e) {
                    data.altitude = -1;
                }
            }
        }
        obj = json.get("track");
        if (null == obj) {
            data.track = 0;
        } else {
            try {
                data.track = (long) obj;
            } catch (Exception e) {
                data.altitude = -1;
            }
        }
        obj = json.get("messages");
        if (null == obj) {
            data.messages = 1;
        } else {
            try {
                data.messages = (long) obj;
            } catch (Exception e) {
                data.messages = -1;
            }
        }
        obj = json.get("lat");
        if (null == obj) {
            data.lat = 0.0d;
        } else {
            try {
                data.lat = (double) obj;
            } catch (Exception e) {
                data.lat = -1;
            }
        }
        obj = json.get("speed");
        if (null == obj) {
            data.speed = 0;
        } else {
            try {
                data.speed = (long) obj;
            } catch (Exception e) {
                data.speed = -1;
            }
        }
        obj = json.get("vert_rate");
        if (null == obj) {
            data.vert_rate = 0;
        } else {
            try {
                data.vert_rate = (long) obj;
            } catch (Exception e) {
                data.vert_rate = -1;
            }
        }
        obj = json.get("timestamp");
        if (null == obj) {
            data.timestamp = 0;
        } else {
            try {
                data.timestamp = (long) obj;
            } catch (Exception e) {
                data.timestamp = -1;
            }
        }
        obj = json.get("seen");
        if (null == obj) {
            data.seen = 0;
        } else {
            try {
                data.seen = (double) obj;
            } catch (Exception e) {
                data.seen = -1;
            }
        }
        obj = json.get("seen_pos");
        if (null == obj) {
            data.seen_pos = 0;
        } else {
            try {
                data.seen_pos = (double) obj;
            } catch (Exception e) {
                data.seen_pos = -1;
            }
        }
        obj = json.get("rssi");
        if (null == obj) {
            data.rssi = 0;
        } else {
            try {
                data.rssi = (double) obj;
            } catch (Exception e) {
                data.rssi = -1;
            }
        }
        return data;
    }

    /**
     * @param groundStationName the groundStationName to set
     */
    public void setGroundStationName(String groundStationName) {
        this.groundStationName = groundStationName;
    }

    /**
     * @return the groundStationName
     */
    public String getGroundStationName() {
        return groundStationName;
    }

    public PositionData withType(ObjectType type) {
        this.type = type;
        return this;
    }

    public PositionData withObjectId(String objectId) {
        this.flight = objectId;
        return this;
    }

    public PositionData withLongitude(double longitude) {
        this.lon = longitude;
        return this;
    }

    public PositionData withLatitude(double latitude) {
        this.lat = latitude;
        return this;
    }

    public PositionData withHeading(double heading) {
        this.track = heading;
        return this;
    }

    public PositionData withTimestamp(long timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    public Map toMap() {
        Map result = new HashMap<>();
        result.put("objectType", type.toString());
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

    /**
     * @return the altitude
     */
    public long getAltitude() {
        return altitude;
    }

    /**
     * @return the category
     */
    public String getCategory() {
        return category;
    }

    /**
     * @return the flight
     */
    public String getFlight() {
        return flight;
    }

    /**
     * @return the hex
     */
    public String getHex() {
        return hex;
    }

    /**
     * @return the lat
     */
    public double getLat() {
        return lat;
    }

    /**
     * @return the lon
     */
    public double getLon() {
        return lon;
    }
    /**
     * @return the messages
     */
    public long getMessages() {
        return messages;
    }
    /**
     * @return the rssi
     */
    public double getRssi() {
        return rssi;
    }
    /**
     * @return the seen
     */
    public double getSeen() {
        return seen;
    }
    /**
     * @return the seen_pos
     */
    public double getSeen_pos() {
        return seen_pos;
    }
    /**
     * @return the speed
     */
    public double getSpeed() {
        return speed;
    }
    /**
     * @return the squawk
     */
    public String getSquawk() {
        return squawk;
    }
    /**
     * @return the timestamp
     */
    public long getTimestamp() {
        return timestamp;
    }
    /**
     * @return the track
     */
    public double getTrack() {
        return track;
    }
    /**
     * @return the type
     */
    public ObjectType getType() {
        return type;
    }
    /**
     * @return the vert_rate
     */
    public long getVert_rate() {
        return vert_rate;
    }
    /**
     * @param altitude the altitude to set
     */
    public void setAltitude(long altitude) {
        this.altitude = altitude;
    }
    /**
     * @param category the category to set
     */
    public void setCategory(String category) {
        this.category = category;
    }
    /**
     * @param flight the flight to set
     */
    public void setFlight(String flight) {
        this.flight = flight;
    }
    /**
     * @param hex the hex to set
     */
    public void setHex(String hex) {
        this.hex = hex;
    }
    /**
     * @param lat the lat to set
     */
    public void setLat(double lat) {
        this.lat = lat;
    }
    /**
     * @param lon the lon to set
     */
    public void setLon(double lon) {
        this.lon = lon;
    }
    /**
     * @param messages the messages to set
     */
    public void setMessages(long messages) {
        this.messages = messages;
    }
    /**
     * @param rssi the rssi to set
     */
    public void setRssi(double rssi) {
        this.rssi = rssi;
    }
    /**
     * @param seen the seen to set
     */
    public void setSeen(double seen) {
        this.seen = seen;
    }
    /**
     * @param seen_pos the seen_pos to set
     */
    public void setSeen_pos(double seen_pos) {
        this.seen_pos = seen_pos;
    }
    /**
     * @param speed the speed to set
     */
    public void setSpeed(double speed) {
        this.speed = speed;
    }
    /**
     * @param squawk the squawk to set
     */
    public void setSquawk(String squawk) {
        this.squawk = squawk;
    }
    /**
     * @param timestamp the timestamp to set
     */
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
    /**
     * @param track the track to set
     */
    public void setTrack(double track) {
        this.track = track;
    }
    /**
     * @param type the type to set
     */
    public void setType(ObjectType type) {
        this.type = type;
    }
    /**
     * @param vert_rate the vert_rate to set
     */
    public void setVert_rate(long vert_rate) {
        this.vert_rate = vert_rate;
    }

}
