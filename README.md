# ADSB Position Demo

This folder contains several items that together make a demo allowing you to track civilian aircraft and send that data
in to RabbitMQ for processing, collation, and later central display.

There are several software products within this code base:-

- mutability-dump1090 - not included - download from https://github.com/mutability/dump1090 - provides the low level C code for running a Software Defined Radio. This is designed to be ran on a Raspberry Pi, but this version works well on a Mac
- adsb-console - A standalone Java app, designed to be run on the receiver (Raspberry Pi or Laptop) that sends data to a remote RabbitMQ instance
- adsb-live-processor - Spring Boot app that Listens to a RabbitMQ exchange for new aircraft positions, and updates a Live (60 second TTL) record in Redis per aircraft
- aircraft-monitor - Spring Boot web app that provides a rest endpoint (/data/aircraft.json) which pulls data from Redis on request, and a web front end (/gmap.html) to show collated aircraft position information

## How can I add my own data to the global view?

Every Pivot can run their own receiver and contribute to the global map! If you're interested in this, follow the below steps

First, contact Adam Fowler in the UK Platform Architect team <afowler@pivotal.io> for a key so you can send data to RabbitMQ.

### Install receiver software

Now, install and compile dump1090:-

```sh
git clone https://github.com/mutability/dump1090
mv dump1090 mutability-dump1090
cd mutability-dump1090
make
cd ..
```

Now plugin your Software Defined Radio stick - I like the ??? which you can get for $20 on amazon - And run the receiver:-

```sh
./runreceiver.sh
```

To test view the internal (your base station only) map view: http://localhost:8081/gmap.html

You should see aircraft information in the console, and in the map view

### Compile and run the Java RabbitMQ app

You now need to compile and run the adsb-console-java project.

```sh
cd adsb-console-java
mvn package
export AMQP_URL=amqp://SOMEURL-PROVIDED-BY-ADAMFOWLER
./runitmq.sh
```

You should see messages about aircraft appear on the console.

### View your aircraft online

Your aircraft, along with aircraft from all global receivers, will now be visible on the central map here: http://aircraft-monitor-central.cfapps.pivotal.io/gmap.html

### Running live-processor and aircraft-monitor yourself

DON'T DO THIS!!!

If you run a local copy then you will 'steal' messages from the central exchange unless you change the name of your queue in the adsb-live-processor RabbitMQ template configuration.

Running this app without modification will mean the global view will not list all aircraft, breaking the demo!!! So please DO NOT DO THIS!

Still wanna do it? Well...

1. Create your own Small Redis cloud 'smallredis' and Cloud AMQP 'surveil-amqp' services
1. Reconfigure your local adsb-console app to use this RabbitMQ URL, not the one provided by Adam Fowler
1. Edit adsb-live-processor/src/resources/application.properties and change the 'group' setting to adsbposition.MYOWNQUEUENAME and save the file
1. Run mvn package
1. Run cf push for the app. This stands up three copies of the processor (just to prove it can - doesn't require three copies, one will suffice)
1. Edit aircraft-monitor-java/manifest.yml To specify the app name of your choice (If pushing to EMEA, don't use the default!!!)
1. Perform cf push on this app
1. Bind both services to live-processor, and the smallredis service to aircraft-monitor, and re-configure the services
1. You will now see your own data, you anti-social person you, not wanting to share. Tsk Tsk ;o)

## What is happening under the hood?

The basic outline is:-

1. Each aircraft transmits ADSB messages at varying rates and signal strengths on 1090 MHz. This uses the same transmission tech as Digital TV, allowing it to be receiver by cheap software defined radio TV sticks (ONLY IF their frequency range stretches to 1090 MHz)
2. A receiver hears the signal, and decodes the raw data, creating a full (including partial messages) output on the console, and exposing a JSON endpoint with the latest data on http://localhost:8081/data/aircraft.json
3. The adsb-console app reads this local URL once a second. It drops data that has already been sent, and drops partial information data (data without a flight code or longitude and latitude), and sends the remaining data to a RabbitMQ message exchange
4. The adsb-live-processor app instance each listen to the same queue attached to this exchange, ensuring each message is processed only once whilst maintaining HA, and updates the aircraft's live view (a Redis object with the key as the flight code, and value as a JSON object). Each object has a time to live of 60 seconds, so aircraft that land or drop out of range of all receivers will vanish out of Redis after 60 seconds. Hence the name 'live view'.
5. The aircraft monitor app has a Spring based rest endpoint (at /data/aircraft.json for ease of memory) that scans Redis for all aircraft keys, and produces a combined JSON output
6. The web page of the aircraft monitoring app (at /gmap.html again for each of memory), queries this JSON endpoint once a second, and displays the global view on a map for you

## Sub project status

|Processor|Java status|C# status|Notes|
|----|----|----|----|
adsb-console|Working, instance per base station (local)|Needs REST retrieval code and testing|Reads ADSB JSON and sends to RabbitMQ
adsb-live-processor|Working, multi instance|Updated, needs testing|Takes live feed and sends to Redis
aircraft-monitor|Working|Not started|Aircraft REST endpoint and map display web app

## License and Copyright

All code and material is copyright Pivotal Inc all rights reserved, and licensed under the Apache 2 license unless
otherwise stated.

aircraft-monitor-java contains the web front end from mutability-dump1090 within its src/main/resources/static folder which is from the mutability version of the dump1090 application available at https://github.com/mutability/dump1090 and are licensed under the GPL V2 License. These files are copied verbatim and have not been modified, except the config.js file which is designed for user editable configuration.

## Support

This app is provided as-is, without support. If you're using the internal pivotal demo app, then please email afowler@pivotal.io with all relevant information and I'll endeavour to give you pointers.

## General TODOs

- Get dotnet version working fully with externalised configuration for adsb-live-processor-dotnet using Steeltoe

