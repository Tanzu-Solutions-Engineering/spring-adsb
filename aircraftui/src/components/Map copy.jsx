import React from 'react';

//open layers and styles
//require('ol/css/ol.css');
import {fromLonLat} from 'ol/proj';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import View from 'ol/View';
import Point from 'ol/geom/Point';
//import Circle from 'ol/geom/Circle';
import VectorLayer from 'ol/layer/Vector';
import { Vector, OSM } from 'ol/source';
import { Fill, RegularShape, Stroke, Style } from 'ol/style.js';

//var ol = require('ol');
var stroke = new Stroke({ color: 'black', width: 2 });
var fill = new Fill({ color: 'red' });
var style = new Style({
  image: new RegularShape({
    fill: fill,
    stroke: stroke,
    points: 3,
    radius: 10,
    rotation: Math.PI / 4,
    angle: 0
  })
});
class OpenMap extends React.Component {

  async componentDidMount() {
    var defaultFeature = new Feature({
      geometry: new Point(fromLonLat([-74.006, 40.7127]))
      //geometry: new Circle(new Point(0, 0),15),
      //id: 'first'
    });
    defaultFeature.setStyle(style);

    // create feature layer and vector source
    
    var featuresLayer = new VectorLayer({
      source: new Vector({
        features: [defaultFeature]
      })
    });

    // create map object with feature layer
    var map = new Map({
      target: this.refs.mapContainer,
      layers: [
        //default OSM layer
        new Tile({
          source: new OSM()
        }),
        featuresLayer
      ],
      view: new View({
        center: fromLonLat([0,49]), //-11718716.28195593, 4869217.172379018], //Boulder
        zoom: 4,
        //projection: 'EPSG:4326'
      })
    });

    //map.on('click', this.handleMapClick.bind(this));

    // save map and layer references to local state
    this.setState({
      map: map,
      featuresLayer: featuresLayer,
      defaultFeature: defaultFeature,
      aircraft: []
    });
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
        var items = [];
        for (var i = 0; i < json.aircraft.length; i++) {
          var ac = json.aircraft[i];
          //console.log("Creating feature for: " + ac.flight);
          var item = new Feature({
            geometry: new Point(fromLonLat([ac.lon, ac.lat])),
            //point: new Point(fromLonLat([ac.lon, ac.lat])),
            name: ac.flight
          });
          item.setStyle(style);
          items.push(item);
        }
        //console.log("Adding all features to the items state array a.");

        //var fl = new Vector({ features: items });
        //this.state.featuresLayer.addFeatures(this.state.items);
        this.setState({
          aircraft: items, data: json,
          //featuresLayer: fl
        }); // TODO remove all first
      })
      .catch((err) => {
        console.log("Error reported fetching aircraft json data...");
        console.log(err);
      });
  }

  // pass new features from props into the OpenLayers layer object
  componentDidUpdate(prevProps, prevState) {
    this.state.featuresLayer.setSource(
      new Vector({
        features: [
          //this.state.defaultFeature, 
          ...this.state.aircraft]
      })
    );
  }
/*
  handleMapClick(event) {

    // create WKT writer
    var wktWriter = new ol.format.WKT();

    // derive map coordinate (references map from Wrapper Component state)
    var clickedCoordinate = this.state.map.getCoordinateFromPixel(event.pixel);

    // create Point geometry from clicked coordinate
    var clickedPointGeom = new ol.geom.Point(clickedCoordinate);

    // write Point geometry to WKT with wktWriter
    var clickedPointWkt = wktWriter.writeGeometry(clickedPointGeom);

    // place Flux Action call to notify Store map coordinate was clicked
    //Actions.setRoutingCoord(clickedPointWkt);

  }*/

  render() {
    return (
      <div ref="mapContainer" className="vw-100 vh-100"> </div>
    );
  }

}

export default OpenMap;