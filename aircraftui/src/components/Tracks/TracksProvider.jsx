import React, { Component } from 'react';

import TracksContext from './context';

import findICAORange from '../../libs/flags.js';

var registrationFromHex = require('../../libs/registrations.js');

//const airlines = require('airline-codes');
var airlinesJSON = require('airline-codes/airlines.json');
var Backbone = require('backbone');
var airlines = new Backbone.Collection(airlinesJSON);

class TracksProvider extends Component {
  constructor(props) {
    super(props);
    console.log("TracksProvider cstr");
    this.onRefocus = this.onRefocus.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.state = {
      data: {aircraft:[],now:0},
      groundStations: {},
      selected: null,
      selectedInfo: null,
      onSelect: this.onSelect,
      onRefocus: this.onRefocus,
      paused: false,
      togglePause: this.togglePause
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

  onRefocus() {
    console.log("onRefocus");
    // TODO in future restrict queries to a location with bounds
  }
  onSelect(flight) {
    console.log("Selected: " + flight);

    var flightInfo;
    for (var i = 0;i < this.state.data.aircraft.length;i++) {
      var ac = this.state.data.aircraft[i];
      if (ac.flight == flight) {
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
  togglePause() {
    this.setState({paused: !this.state.paused});
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
