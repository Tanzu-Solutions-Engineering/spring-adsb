package io.pivotal.pa.rabbitmq.adsbliveprocessor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.util.logging.Logger;

@SpringBootApplication
@EnableBinding(Sink.class)
public class ADSBLiveProcessorApplication {

	private static Logger LOG = Logger.getLogger(ADSBLiveProcessorApplication.class.getName());
	
	public static void main(String[] args) {
		SpringApplication.run(ADSBLiveProcessorApplication.class, args);
	}

	@Bean
	public CommandLineRunner intialiseRedisTemplate(RedisTemplate redisTemplate) {
		return (args) -> {
			redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<PositionData>(PositionData.class));
			redisTemplate.setKeySerializer(new StringRedisSerializer());
		};
	}

}

