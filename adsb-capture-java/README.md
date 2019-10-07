# RabbitMQ ADS-B JSON to JSON File processor

This MQ only app shows how to monitor a queue with one or more identical processing app instances to process each message just once.

The app takes a JSON representation of an ADS-B message. These messages are transmitted by aircraft to show their
position, speed, identity and other basic 'surveillance' information. Note that the term surveillance applies
to monitoring the location of aircraft - it is the 'S' in ADS-B - and not to aircraft carrying out surveillance.

This app, unlike the live processor app, will take a copy of each ADSB message (with another copy going to the live processor, if running),
and persist it to a file. This is by default ~/adsb-capture.json. This is a file where each line consists of a JSON message (It is NOT a JSON array).

This app allows capturing of all flight data whilst monitoring. A sister app, adsb-replay, takes the file and for each message in turn
rewrites its time index as if the aircraft was now in flight, replaying them in order with the correct delay in order to replay
a set of flights. This is useful for off public network real world data testing.

## Building

Type `mvn verify` to build and test.

## Deployment

Type `cf push` to push the app to Pivotal Cloud Foundry (PCF). Note: Assumes dependent services are already running. See manifest.yml
for the required service binding names.

## Testing

Use `cf logs adsb-capture` to observe the processing of ADS-B messages in MQ and writing to Redis as JSON key values.

## Copyright and Licensing

All code and material is copyright Pivotal Inc all rights reserved, and licensed under the Apache 2 license unless
otherwise stated.

## Support statement

This is demo-ware and not intended to be used in production apps.

## Bug reporting

Please use the GitHub issues tracker to log all bugs against this project, and to ask for help.

## Author

This app was created by Adam Fowler - afowler at pivotal dot io.
