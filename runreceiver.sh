#!/bin/sh
echo "Script assumes mutability-dump1090 is cloned in the same folder as this script, and already built"
echo "You can clone mutability-dump1090 from: https://github.com/mutability/dump1090"
echo "(Don't forget to rename the folder!)"
echo "Edit this script with the GPS (WGS84) position of your base station"
echo "Test the local receiver by visiting: http://localhost:8081/gmap.html"
./mutability-dump1090/dump1090 --interactive --net --lat 53.23 --lon -1.37 --modeac --mlat --write-json /run/dump1090/data
