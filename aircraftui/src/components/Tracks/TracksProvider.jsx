import React, { Component } from 'react';

import TracksContext from './context';

import findICAORange from '../../libs/flags.js';
import {lookupModel} from '../../libs/typenames.js';

var registrationFromHex = require('../../libs/registrations.js');

//const airlines = require('airline-codes');
var airlinesJSON = require('airline-codes/airlines.json');
var Backbone = require('backbone');
var airlines = new Backbone.Collection(airlinesJSON);

// From https://books.google.co.uk/books?id=XJ5pAwAAQBAJ&pg=PA48&lpg=PA48&dq=ADS-B+aircraft+%22category%22+A2+A0+A5&source=bl&ots=9u9C2i7C8b&sig=ACfU3U1goNKeoSZnyXRhb08-K5f6Nzl9_g&hl=en&sa=X&ved=2ahUKEwjR8_OhqP_kAhVVuHEKHWN2BegQ6AEwAnoECAkQAQ#v=onepage&q=ADS-B%20aircraft%20%22category%22%20A2%20A0%20A5&f=false
var categories = {
  "": "Unknown",
  "A0": "No information (Set A)",
  "A1": "Light (< 15 500 lbs)",
  "A2": "Small (15 500 - 75 000 lbs)",
  "A3": "Large (75 000 - 300 000 lbs)",
  "A4": "High vortex Large",
  "A5": "Heavy (> 300 000 lbs)",
  "A6": "High performance (> 5g and > 400 kts)",
  "A7": "Rotorcraft",
  "B0": "No information (Set B)",
  "B1": "Glider",
  "B2": "Lighter than air",
  "B3": "Parachutist",
  "B4": "Ultralight / hang-glider / paraglider",
  "B5": "Reserved",
  "B6": "UAV",
  "B7": "Space vehicle",
  "C0": "No information (Set C)",
  "C1": "Surface vehicle - Emergency",
  "C2": "Surface vehicle - Service",
  "C3": "Fixed or Tethered obstruction",
  "C4": "Reserved",
  "C5": "Reserved",
  "C6": "Reserved"
};

class TracksProvider extends Component {
  constructor(props) {
    super(props);
    console.log("TracksProvider cstr");
    this.onRefocus = this.onRefocus.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.toggleAllTracks = this.toggleAllTracks.bind(this);
    this.state = {
      data: {aircraft:[],now:0},
      groundStations: {},
      selected: null,
      selectedInfo: null,
      onSelect: this.onSelect,
      onRefocus: this.onRefocus,
      paused: false,
      togglePause: this.togglePause,
      toggleAllTracks: this.toggleAllTracks,
      showAllTracks: false // memory hungry
    };
  }
  componentDidMount() {
    this.schedule();
  }

  schedule() {
    try {
      setTimeout(async () => {
        this.refreshData();
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  }

  refreshData() {
    if (!this.state.paused) {
    //console.log("In refresh data");
    fetch('http://aircraft-monitor-central.cfapps.io/data/aircraft.json',{cache: 'reload'})
      .then(async (response) => {
        var json = await response.json();
        //console.log("--------------");
        //console.log("Tracks updated. Data time now: " + json.now);
        //console.log("Adding all features to the items state array a.");

        // annotate json aircraft with airline name
        var gs = {};
        for (var i = 0; i < json.aircraft.length;i++) {
          var ac = json.aircraft[i];
          var al = airlines.where({ icao: ac.flight.substring(0, 3) }, true);
          json.aircraft[i].airline = al ? al.get('name') : "Unknown airline";
          if (undefined === gs[ac.groundStationName]) {
            gs[ac.groundStationName] = {name: ac.groundStationName, count: 1};
          } else {
            gs[ac.groundStationName].count++;
          }
          // Decode category
          ac.categoryDesc = categories[ac.category];
          // TODO only fetch this if not already cached
          await this.airframeLookup(ac);
        }
        //console.log(JSON.stringify(json.aircraft[0]));

        //var fl = new Vector({ features: items });
        //this.state.featuresLayer.addFeatures(this.state.items);
        this.setState({
          data: json,
          now: json.now,
          groundStations: gs
          //featuresLayer: fl
        }); // TODO remove all first

        //console.log("Tracks selected currently: " + this.state.selected);
      }).then(() => {
        this.schedule();
      })
      .catch((err) => {
        console.log("Error reported fetching aircraft json data...");
        console.log(err);
        this.schedule();
      });
    } else {
      this.schedule();
    }
  }

  async airframeLookup(ac) {
    return this.fetchAirframeDetails(ac.hex).then((airframeInfo) => {
      if (null != airframeInfo) {
        console.log("Got flight info for: " + ac.flight + " : " + JSON.stringify(airframeInfo));
        if (undefined !== airframeInfo.t) {
          ac.model = airframeInfo.t;
          ac.modelInfo = lookupModel(ac.model);
        }
        if (undefined !== airframeInfo.r) {
          ac.registration = airframeInfo.r;
        }
      }
    });
  }

  onRefocus() {
    console.log("onRefocus");
    // TODO in future restrict queries to a location with bounds
  }
  onSelect(flight) {
    console.log("Selected: " + flight);

    var flightInfo;
    for (var i = 0;i < this.state.data.aircraft.length;i++) {
      var ac = this.state.data.aircraft[i];
      if (ac.flight === flight) {
        flightInfo = ac;
      }
    }
    var icaoRange;
    var registration;
    if (flightInfo) {
      console.log("Hex value: " + flightInfo.hex);
      icaoRange = findICAORange(flightInfo.hex);
      console.log("ICAO info: " + JSON.stringify(icaoRange));
      registration = registrationFromHex(flightInfo.hex);
    }
    var selectedInfo = {
      icaoRange: icaoRange,
      registration: registration
    };
    this.setState({selected: flight, selectedInfo: selectedInfo});
  }
  async fetchAirframeDetails(flightCode) {
    return this.airframeRequest(flightCode.toUpperCase(),1).catch( (err) => {
      //console.log("Had a problem fetching airframe data", err);
    });
  }
  async airframeRequest(icao,level) {
    var startCode = icao.substring(0,level);
    var remainder = icao.substring(level);
    return fetch("/db/" + startCode + ".json").then( async (resp) => {
      var text = await resp.text();
      if (!text.startsWith('{')) {
        return null;
      }
      try {
        var json = JSON.parse(text);
        return json;
      } catch (exc) {
        // ignore - likely HTML, return null
        return null;
      }
    }).then( (data) => {
      // guard wrong data type
      if (null == data) {
        return null;
      }
      // fetch aiframe full info
      if (remainder in data) {
        return data[remainder];
      }
      if ("children" in data) {
        var next = icao.substring(level + 1);
        if (-1 !== data.children.indexOf(next)) {
          return this.airframeRequest(icao,level + 1);
        }
      }
      return null;
    });
  }
  togglePause() {
    this.setState({ paused: !this.state.paused });
  }
  toggleAllTracks() {
    this.setState({ showAllTracks: !this.state.showAllTracks });
  }
  render() {
    return (
      <TracksContext.Provider
        value={{
          state: this.state,
          onRefocus: this.onRefocus
        }}
      >
        {this.props.children}
      </TracksContext.Provider>
    );
  }
}

export default TracksProvider;
