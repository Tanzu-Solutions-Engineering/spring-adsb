import React, { Component } from 'react';

import TracksContext from './context';

class TracksProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {aircraft:[]}
    };
    console.log("TracksProvider cstr");
    this.onRefocus = this.onRefocus.bind(this);
  }
  componentDidMount() {
    try {
      setInterval(async () => {
        this.refreshData();
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  }

  refreshData() {
    //console.log("In refresh data");
    fetch('http://aircraft-monitor-central.cfapps.io/data/aircraft.json')
      .then(async (response) => {
        var json = await response.json();
        //console.log("Adding all features to the items state array a.");

        //var fl = new Vector({ features: items });
        //this.state.featuresLayer.addFeatures(this.state.items);
        this.setState({
          data: json,
          //featuresLayer: fl
        }); // TODO remove all first
      })
      .catch((err) => {
        console.log("Error reported fetching aircraft json data...");
        console.log(err);
      });
  }

  onRefocus() {
    console.log("onRefocus");
    // TODO in future restrict queries to a location with bounds
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
