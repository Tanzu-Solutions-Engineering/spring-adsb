package io.pivotal.pa.rabbitmq.adsbcapture;

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
