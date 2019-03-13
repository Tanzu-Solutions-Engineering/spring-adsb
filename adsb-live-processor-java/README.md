# RabbitMQ ADS-B JSON to Redis Live View processor

This MQ only app shows how to monitor a queue with one or more identical processing app instances to process each message just once.

The app takes a JSON representation of an ADS-B message. These messages are transmitted by aircraft to show their
position, speed, identity and other basic 'surveillance' information. Note that the term surveillance applies
to monitoring the location of aircraft - it is the 'S' in ADS-B - and not to aircraft carrying out surveillance.

This app puts a key in to Redis for each aircraft identifier with a time to live (TTL) of 60 seconds. This ensures that
if the aircraft isn't seen for 60 seconds, that it drops out of the Redis database. This creates effectively a 'live
view' in Redis. Any scan of Redis aircraft keys will guarantee all aircraft transmissions were sent in the last 60 seconds.

Note: Time to Live (TTL) uses the transmit timestamp plus 60 seconds rather than 60 seconds past this
processor seeing the json message on MQ. TTL therefore isn't reliant upon processing speed.

A separate standalone Java app is responsible for acquiring the ADS-B message and placing it on the MQ queue.

This app uses Java Spring Boot, and shows how to use Pivotal Cloud Foundry (PCF) to monitor a process rather than web endpoint 
for the PCF health check.

## Building

Type `mvn verify` to build and test.

## Deployment

Type `cf push` to push the app to Pivotal Cloud Foundry (PCF). Note: Assumes dependent services are already running. See manifest.yml
for the required service binding names.

## Testing

Use `cf logs mq-adsb-processor` to observe the processing of ADS-B messages in MQ and writing to Redis as JSON key values.

## Copyright and Licensing

All code and material is copyright Pivotal Inc all rights reserved, and licensed under the Apache 2 license unless
otherwise stated.

## Support statement

This is demo-ware and not intended to be used in production apps.

## Bug reporting

Please use the GitHub issues tracker to log all bugs against this project, and to ask for help.

## Author

This app was created by Adam Fowler - afowler at pivotal dot io.
