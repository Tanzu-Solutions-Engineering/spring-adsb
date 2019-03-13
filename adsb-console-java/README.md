# Java dump1090 application to send ADS-B traffic as JSON to a RabbitMQ endpoint

This application is intended to be ran as a standalone application on a desktop, laptop, or
Raspberry Pi where the dump1090 ADS-B radio application is running. This app uses the
http://localhost:8081/data/aircraft.json URL to fetch the current live view of aircraft
in the vicinity, and then sends this data to a central RabbitMQ server.

This application has been configured to send data to RabbitMQ authenticating using a uri 
specified in the Main.java class.

There are two versions of this app:-
- `./runit.sh` will read the local dump1090 data and write it to System.out, not a remote RabbitMQ
- `./runitmq.sh` will read the local dump1090 data and write it to a remote RabbitMQ server queue called `adsbposition`
- `./runitmqreceiver.sh` is a test app to connect to the remote RabbitMQ server and read the contents of the `adsbposition` queue

WARNING: Running the mqreceiver script is for test purposes only. Running it in a live environment will 'steal' messages,
and cause those messages to not be processed in a normal chain on the remote RabbitMQ Server (i.e. they will never appear
in the Redis 'live' view in the aircraft-monitor application).

## Dependencies

You will need to clone the https://github.com/???/sdr-java repository in to the same folder as this adsb-console application.

TODO fix the above URL

TODO verify dependency steps are still needed? E.g. amqp client JAR file, or if the 'master' dependency shade script has
taken care of everything

TODO abstract out the connection URL and place on the command line as an option

## Compiling

Use maven via `mvn verify` to build the application in to a JAR file

## Running the app

1. Ensure a radio is connected, and that dump1090 is running locally (I use the mutability version at https://github.com/mutability/dump1090 )
1. Test this is working by going to https://localhost:8081/gmap.html to view the data
1. Run the `./runitmq.sh` script

## Copyright and Licensing

All code and material is copyright Pivotal Inc all rights reserved, and licensed under the Apache 2 license unless
otherwise stated.

The contents of the src/main/resources/public_html folder are from the mutability version of the dump1090 application available at https://github.com/mutability/dump1090 and are licensed under the GPL V2 License. These files are copied verbatim and have not been modified.

## Support statement

This is demo-ware and not intended to be used in production apps.

## Bug reporting

Please use the GitHub issues tracker to log all bugs against this project, and to ask for help.

## Author

This app was created by Adam Fowler - afowler at pivotal dot io.

