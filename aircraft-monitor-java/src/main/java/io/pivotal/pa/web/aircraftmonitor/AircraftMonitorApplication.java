package io.pivotal.pa.web.aircraftmonitor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.jdbc.core.JdbcTemplate;
import java.sql.Timestamp;
import java.sql.ResultSet;
import java.util.List;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

@CrossOrigin
@SpringBootApplication
@RestController
public class AircraftMonitorApplication {

	private static Logger LOG = Logger.getLogger(AircraftMonitorApplication.class.getName());

    // live data
    @Autowired
    private RedisTemplate redisTemplate = null;

    // historical data
    @Autowired
    private JdbcTemplate jdbcTemplate = null;
    
    private long messages = 1;
	
	public static void main(String[] args) {
		SpringApplication.run(AircraftMonitorApplication.class, args);
	}

/*
    @RequestMapping("/ups")
    public String getUserProvidedServiceInfo() {
        String vcap = System.getenv("VCAP_SERVICES");
        // SECURITY DO NOT LOG LOG.log(Level.WARNING, "VCAP_SERVICES content: " + vcap);


        // now we parse the json in VCAP_SERVICES
        LOG.log(Level.WARNING, "Using GSON to parse the json...");
        JsonElement root = new JsonParser().parse(vcap);
        JsonObject ups = null;
        if (root != null) {
            if (root.getAsJsonObject().has("user-provided")) {
                ups = root.getAsJsonObject().get("user-provided").getAsJsonArray().get(0).getAsJsonObject();
                LOG.log(Level.WARNING, "instance name: " + ups.get("name").getAsString());
            }
            else {
                LOG.log(Level.SEVERE, "ERROR: no redis instance found in VCAP_SERVICES");
            }
        }

        if (ups != null) {
            JsonObject creds = ups.get("credentials").getAsJsonObject();
            return ups.get("name").getAsString() + " / " + creds.get("uri").getAsString() + " / " + creds.get("user").getAsString();
        }
        else return "not found!";
    }

    @RequestMapping("/")
    public RedisInstanceInfo getInfo() {
        LOG.log(Level.WARNING, "Getting Redis Instance Info in Spring controller...");
        // first we need to get the value of VCAP_SERVICES, the environment variable
        // where connection info is stored
        String vcap = System.getenv("VCAP_SERVICES");
        // SECURITY DO NOT LOG LOG.log(Level.WARNING, "VCAP_SERVICES content: " + vcap);


        // now we parse the json in VCAP_SERVICES
        LOG.log(Level.WARNING, "Using GSON to parse the json...");
        JsonElement root = new JsonParser().parse(vcap);
        JsonObject redis = null;
        if (root != null) {
            if (root.getAsJsonObject().has("p.redis")) {
                redis = root.getAsJsonObject().get("p.redis").getAsJsonArray().get(0).getAsJsonObject();
                LOG.log(Level.WARNING, "instance name: " + redis.get("name").getAsString());
            }
            else if (root.getAsJsonObject().has("p-redis")) {
                redis = root.getAsJsonObject().get("p-redis").getAsJsonArray().get(0).getAsJsonObject();
                LOG.log(Level.WARNING, "instance name: " + redis.get("name").getAsString());
            }
            else if (root.getAsJsonObject().has("rediscloud")) {
                redis = root.getAsJsonObject().get("rediscloud").getAsJsonArray().get(0).getAsJsonObject();
                LOG.log(Level.WARNING, "instance name: " + redis.get("name").getAsString());
            }
            else {
                LOG.log(Level.SEVERE, "ERROR: no redis instance found in VCAP_SERVICES");
            }
        }

        // then we pull out the credentials block and produce the output
        if (redis != null) {
            JsonObject creds = redis.get("credentials").getAsJsonObject();
            RedisInstanceInfo info = new RedisInstanceInfo();
            info.setHost(creds.get("hostname").getAsString());
            info.setPort(creds.get("port").getAsInt());
            info.setPassword(creds.get("password").getAsString());

            // the object will be json serialized automatically by Spring web - we just need to return it
            return info;
        }
        else return new RedisInstanceInfo();
    }

    @RequestMapping("/set")
    public String setKey(@RequestParam("kn") String key, @RequestParam("kv") String val) {
        LOG.log(Level.WARNING, "Called the key set method, going to set key: " + key + " to val: " + val);

        if (jedis == null || !jedis.isConnected()) {
            jedis = RedisConnection.getJedisConnection();
        }
		jedis.set(key, val);

        return "Set key: " + key + " to value: " + val;
    }

    @RequestMapping("/get")
    String getKey(@RequestParam("kn") String key) {
        LOG.log(Level.WARNING, "Called the key get method, going to return val for key: " + key);

        if (jedis == null || !jedis.isConnected()) {
            jedis = RedisConnection.getJedisConnection();
        }

        return jedis.get(key);
	}
	*/

	@Bean
	public CommandLineRunner intialiseRedisTemplate(RedisTemplate redisTemplate) {
		return (args) -> {
			redisTemplate.setValueSerializer(new StringRedisSerializer());
			redisTemplate.setKeySerializer(new StringRedisSerializer());
		};
    }
    
    @RequestMapping("/tracks/{craftid}/latest")
    String latestPosition(String craftid) {
        List<PositionData> results = jdbcTemplate.query(
            "select jsondata from geohistory.tracks where craftid=? order by gpsdatetime desc limit 1", 
            new Object[]{craftid},
            (rs, rowNum) -> 
              PositionData.fromJSON(new JsonObject(rs.getObject("jsondata")))
        );
        if (results.size() > 0) {
            return results.get(0).toString();
        }
        return "";
    }

    @RequestMapping("/data/aircraft.json")
    String liveView() {
        LOG.log(Level.WARNING, "Called the live method, going to return current set of valid keys");


        String list = (String)redisTemplate.execute(new RedisCallback<String>() {
            public String doInRedis(RedisConnection connection) throws DataAccessException {
                String list = "[";
                boolean first = true;
                try (Cursor<byte[]> cursor = connection.scan(ScanOptions.scanOptions().match("*").build())) {
                    while (cursor.hasNext()) {
                        String key = new String(cursor.next(), "UTF-8");
                        String value = (String)redisTemplate.opsForValue().get(key);
                        if (null != value) {
                            if (first) {
                                first = false;
                            } else {
                                list += ",";
                            }
                            list += value;
                            messages++;
                        }
                    }
                } catch (IOException e) {
                    System.out.println("Oh oh");
                }
                list += "]";
                return list;
            }
        });

        return "{\"now\":" + System.currentTimeMillis()/1000.0d + ", \"messages\":" + messages + " ,\"aircraft\":" + list + " }";
    }

    @RequestMapping("/view/*")
    String viewFolder() {
        // expose the public_html folder contents under /view/
        return "";
    }










/*
    @RequestMapping("/clear")
    String clear() {
        LOG.log(Level.WARNING, "Called the clear method, going to remove all current keys");

        if (jedis == null || !jedis.isConnected()) {
            jedis = RedisConnection.getJedisConnection();
        }

        return jedis.flushDB();
	}
*/
}

