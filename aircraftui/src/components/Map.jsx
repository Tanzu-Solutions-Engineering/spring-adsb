import React from 'react';

//open layers and styles
import {fromLonLat} from 'ol/proj';
import Map from 'ol/Map';
import Icon from 'ol/style/Icon';
//import Style from 'ol/style/Style';
import Tile from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
//import Circle from 'ol/geom/Circle';
import VectorLayer from 'ol/layer/Vector';
import { Vector, OSM } from 'ol/source';
import { Fill, RegularShape, Stroke, Style } from 'ol/style.js';
import Select from 'ol/interaction/Select.js';

//import withTracksContext from './Tracks/withTracksContext';

import TracksContext from './Tracks/context';
import { getBaseMarker, /*svgPathToSvg,*/ svgPathToURI } from '../libs/markers';

require('ol/ol.css');

//var ol = require('ol');
var stroke = new Stroke({ color: 'black', width: 2 });
var fill = new Fill({ color: 'blue' });

var trackStyle = new Style({
  stroke: new Stroke({
    color: '#000000',
    width: 2
  })
});

//var selectedFill = new Fill({ color: 'red' });
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
/*
var selectedStyle = new Style({
  image: new RegularShape({
    fill: selectedFill,
    stroke: stroke,
    points: 3,
    radius: 10,
    rotation: Math.PI / 4,
    angle: 0
  })
});
*/
class OpenMap extends React.Component {
  constructor(props) {
    super(props);
    this.styleHolder = {}; // temp, always safe to recreate, no need for setState
    this.tracks = {}; // indexed by flight id
  }

  async componentDidMount() {
    var defaultFeature = new Feature({
      geometry: new Point(fromLonLat([-74.006, 40.7127]))
      //geometry: new Circle(new Point(0, 0),15),
      //id: 'first'
    });
    defaultFeature.setStyle(style);

    // create feature layer and vector source
    var tracksLayer = new VectorLayer({
      source: new Vector({
        features: []
      })
    });
    
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
        tracksLayer,
        featuresLayer
      ],
      view: new View({
        center: fromLonLat([-2,53.4]), //-11718716.28195593, 4869217.172379018], //Boulder
        zoom: 4,
        //projection: 'EPSG:4326'
      })
    });

    //map.on('click', this.handleMapClick.bind(this));
    var select = new Select();

    map.addInteraction(select);
    var that = this;
    select.on('select', function (e) {
      var fts = e.target.getFeatures();
      if (fts.getLength() > 0) {
        that.context.state.onSelect(fts.item(0).get('name'));
      }
      fts.clear(); // clear selection to prevent a duplication of the feature on the map layer
    })

    // save map and layer references to local state
    this.setState({
      map: map,
      featuresLayer: featuresLayer,
      defaultFeature: defaultFeature,
      select: select,
      tracksLayer: tracksLayer
    });
  }

  // pass new features from props into the OpenLayers layer object
  componentDidUpdate(prevProps, prevState) {
    //console.log("Map componentDidUpdate");
    //console.log(JSON.stringify(this.context));
    
    //console.log("Map componentDidUpdate. Items: " + this.context.state.data.aircraft.length + ". Now: " + this.context.state.data.now);
    var items = [];
    var tracks = [];
    var flightsCovered = [];
    for (var i = 0; i < this.context.state.data.aircraft.length; i++) {
      var ac = this.context.state.data.aircraft[i];
      flightsCovered.push(ac.flight);
      //console.log("Creating feature for: " + ac.flight);
      var item = this.createFeature(ac);
      items.push(item);
      // add to tracks
      var actracks = this.tracks[ac.flight];
      if (undefined === actracks) {
        actracks = {segments:[],features:[]};
        this.tracks[ac.flight] = actracks;
      }
      var lastSegment = (actracks.segments.length === 0) ? null : actracks.segments[actracks.segments.length - 1];

      var lastpos;
      var thispos = fromLonLat([ac.lon, ac.lat]);
      actracks.segments.push(thispos);
      if (null == lastSegment) {
        lastpos = thispos; // use current pos
      } else {
        lastpos = lastSegment;
      }

      var geom = new LineString([lastpos, fromLonLat([ac.lon, ac.lat])]);
      var feature = new Feature(geom);
      feature.setStyle(trackStyle);
      actracks.features.push(feature);
      if (undefined !== this.context.state.selected) {
        //console.log("Something selected: " + this.context.state.selected)
        if (this.context.state.selected === ac.flight) {
          //console.log("Setting selected tracks layer");
          if (!this.context.state.showAllTracks) {
            tracks = tracks.concat(actracks.features);
          }
        }
      }
      if (this.context.state.showAllTracks) {
        tracks = tracks.concat(actracks.features);
      }
    }
    this.state.tracksLayer.setSource(
      new Vector({
        features: tracks
      })
    );
    this.state.featuresLayer.setSource(
      new Vector({
        features: items
      })
    );
    // Cleanup of flights we can no longer see
    for (var key in Object.keys(this.tracks)) {
      if (!flightsCovered.includes(key)) {
        delete this.tracks[key];
      }
    }
    
  }

  createFeature(ac) {
    var OutlineADSBColor = '#000000';
    var col = (this.context.state.selected === ac.flight) ? '#ff3333' : '#22dd22'; //this.getMarkerColor();
    var opacity = 1.0; //(this.position_from_mlat ? 0.75 : 1.0);
    var outline = OutlineADSBColor; //(this.position_from_mlat ? OutlineMlatColor : OutlineADSBColor);
    // Determine icon and style for this feature
    var baseMarker = getBaseMarker(ac.category,ac.model);
    var weight = 1; //(( (this.context.state.selected === ac.flight) ? 2 : 1) / baseMarker.scale).toFixed(1);
    var rotation = (ac.track === null ? 0 : ac.track);
    var svgKey = col + '!' + outline + '!' + baseMarker.key + '!' + weight;
    var styleKey = opacity + '!' + rotation;

    var styleHolder = this.styleHolder[ac.flight];
    if (null == styleHolder) {
      styleHolder = {};
      this.styleHolder[ac.flight] = styleHolder;
    }
    if (styleHolder.markerStyle === null || styleHolder.markerIcon === null || styleHolder.markerSvgKey !== svgKey) {
      // Create styles and new icon
      var icon = new Icon({
        anchor: baseMarker.anchor,
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        scale: baseMarker.scale,
        imgSize: baseMarker.size,
        src: svgPathToURI(baseMarker.path, baseMarker.size, outline, weight, col),
        rotation: (baseMarker.noRotate ? 0 : rotation * Math.PI / 180.0),
        opacity: opacity,
        rotateWithView: (baseMarker.noRotate ? false : true)
      });

      if (baseMarker.noRotate) {
        // the base marker won't be rotated
        styleHolder.markerStaticIcon = icon;
        styleHolder.markerStaticStyle = new Style({
          image: styleHolder.markerStaticIcon
        });

        // create an arrow that we will rotate around the base marker
        // to indicate heading

        var offset = baseMarker.markerRadius * baseMarker.scale + 6;
        var size = offset * 2;

        var arrowPath = "M " + offset + ",0 m 4,4 -8,0 4,-4 z";
        styleHolder.markerIcon = new Icon({
          anchor: [offset, offset],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          scale: 1.0,
          imgSize: [size, size],
          src: svgPathToURI(arrowPath, [size, size], outline, 1, outline),
          rotation: rotation * Math.PI / 180.0,
          opacity: opacity,
          rotateWithView: true
        });
        styleHolder.markerStyle = new Style({
          image: this.markerIcon
        });
      } else {
        styleHolder.markerIcon = icon;
        styleHolder.markerStyle = new Style({
          image: styleHolder.markerIcon
        });
        styleHolder.markerStaticIcon = null;
        styleHolder.markerStaticStyle = new Style({});
      }

      styleHolder.markerStyleKey = styleKey;
      styleHolder.markerSvgKey = svgKey;

      if (undefined !== styleHolder.marker) {
        styleHolder.marker.setStyle(styleHolder.markerStyle);
        styleHolder.markerStatic.setStyle(styleHolder.markerStaticStyle);
      }
    }

    if (styleHolder.markerStyleKey !== styleKey) {
      //console.log(this.icao + " new rotation");
      styleHolder.markerIcon.setRotation(rotation * Math.PI / 180.0);
      styleHolder.markerIcon.setOpacity(opacity);
      if (styleHolder.staticIcon) {
        styleHolder.staticIcon.setOpacity(opacity);
      }
      styleHolder.markerStyleKey = styleKey;
    }

    // Create feature and associate style
    // TODO alter, don't recreate
    var item = new Feature({
      geometry: new Point(fromLonLat([ac.lon, ac.lat])),
      //point: new Point(fromLonLat([ac.lon, ac.lat])),
      name: ac.flight
    });
    item.setStyle(styleHolder.markerStyle);
    /*
    if (this.context.state.selected === ac.flight) {
      item.setStyle(selectedStyle);
    } else {
      item.setStyle(style);
    }
    */
    return item;
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
    //console.log("Map render");
    return (
      <div ref="mapContainer" className="mapContainer"> </div>
    );
  }

}
OpenMap.contextType = TracksContext;

//export default withTracksContext(OpenMap);
export default OpenMap;