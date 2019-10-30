package io.pivotal.pa.rabbitmq.adsbhistoryprocessor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.context.annotation.Bean;

import java.util.logging.Logger;

@SpringBootApplication
@EnableBinding(Sink.class)
public class ADSBHistoryProcessorApplication {

	private static Logger LOG = Logger.getLogger(ADSBHistoryProcessorApplication.class.getName());
	
	public static void main(String[] args) {
		SpringApplication.run(ADSBHistoryProcessorApplication.class, args);
	}

	// TODO greenplum/postgresql bean


}

