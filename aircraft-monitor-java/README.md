# Aircraft Monitor Web App using Spring Boot

This web application monitors a Redis database that holds a 'live' view of aircraft movements sourced from ADS-B information.

This app is based upon the dump1090 program's gmap.html web page but uses a rest endpoint (/live) to show the current
list of live aircraft. Old messages from aircraft that are out of area are cleared out automatically by Redis using
a time to live (TTL) on their keys, expiring location information older than 60 seconds from transmission time.

## Building

Type `mvn verify` to build and test.

## Deployment

Type `cf push` to push the app to Pivotal Cloud Foundry (PCF). Note: Assumes dependent services are already running. See manifest.yml
for the required service binding names.

## Testing

Visit the https://HOSTNAME/data/aircraft endpoint to see a JSON array (will be empty to start with).

## Endpoints

- "/gmap.html" - *** START HERE *** - Provides a web page that updates every second with the latest aircraft data (uses the /data/aircraft.json endpoint)
- "/data/aircraft.json" - Provides a JSON array (could be an empty array) showing all currently visible aircraft
- "/" - Shows VCAP_SERVICES information INCLUDING USERNAME AND PASSWORD FOR REDIS
- "/ups" - Shows summary connection information for Redis
- "/clear" - Removes ALL keys from the CURRENT Redis database (i.e. the one bound)
- "/get?kn=NAME" - Fetches the value of the named key (E.g. use the aircraft's ID as the keyname)
- "/set?kn=NAME&kv=VALUE" - Sets the value of the named key, without a 60 second TTL (use /clear to clear it) - useful for testing without radio reception

## Copyright and Licensing

All code and material is copyright Pivotal Inc all rights reserved, and licensed under the Apache 2 license unless
otherwise stated.

The contents of the src/main/resources/static folder are from the mutability version of the dump1090 application available at https://github.com/mutability/dump1090 and are licensed under the GPL V2 License. These files are copied verbatim and have not been modified.

## Support statement

This is demo-ware and not intended to be used in production apps.

## Bug reporting

Please use the GitHub issues tracker to log all bugs against this project, and to ask for help.

## Author

This app was created by Adam Fowler - afowler at pivotal dot io.
