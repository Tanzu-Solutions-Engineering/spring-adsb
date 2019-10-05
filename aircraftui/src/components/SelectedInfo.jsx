import React from 'react';

import TracksContext from './Tracks/context';

import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SelectedInfo extends React.Component {
  render() {
    if (!this.context.state.selected) {
      return null;
    }
    // get selected flight info
    var selectedItem;
    if (undefined !== this.context.state.data && undefined !== this.context.state.data.aircraft) {
      for (var i = 0;i < this.context.state.data.aircraft.length;i++) {
        var ac = this.context.state.data.aircraft[i];
        if (ac.flight === this.context.state.selected) {
          selectedItem = ac;
        }
      }
    }
    if (undefined === selectedItem) {
      return null;
    }
    return (
      <div className="aircraft-selected">
        <h4>Selection details<span className="extradar">&nbsp;&nbsp;
          <a target="_fa" href={"//flightaware.com/live/modes/" + selectedItem.hex + "/redirect"}>FA</a>
          |
          <a target="_fr" href={"http://fr24.com/" + selectedItem.flight}>FR24</a>
          |
          <a target="_fs" href={"http://www.flightstats.com/go/FlightStatus/flightStatusByFlight.do?flightNumber=" + selectedItem.flight}>FS</a>
          |
          <a target="_pf" href={'https://planefinder.net/flight/' + selectedItem.flight}>PF</a>
    </span></h4>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Airline</th>
            <th>Flight</th>
            <th>Reg</th>
            <th>Category</th>
            <th>Model</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{selectedItem.airline}</td>
            <td>{selectedItem.flight}</td>
              <td><img 
                alt={undefined !== this.context.state.selectedInfo ? this.context.state.selectedInfo.icaoRange.country : "Unknown country of origin"}
                src={"/flags-tiny/" + (undefined !== this.context.state.selectedInfo ? this.context.state.selectedInfo.icaoRange.flag_image : "blank.png")} /> {"" !== this.context.state.selectedInfo.registration ? this.context.state.selectedInfo.registration : this.context.state.selectedItem.registration} {this.context.state.selectedItem&&this.context.state.selectedItem.registration ? this.context.state.selectedItem.registration : ""}</td>
              <td>{selectedItem.categoryDesc} {selectedItem.category}</td>
              <td>{selectedItem.model ? selectedItem.modelInfo ? selectedItem.modelInfo.name : selectedItem.model : selectedItem.type}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>Position</th>
            <th>Track</th>
            <th>Speed</th>
            <th>Alt</th>
            <th>Vert Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
              <td>Lon: {selectedItem.lon}, Lat: {selectedItem.lat}</td>
            <td>{selectedItem.track}</td>
            <td>{selectedItem.speed}</td>
              <td>{selectedItem.altitude} &nbsp;
                {selectedItem.vert_rate > 0 ?
                  (selectedItem.altitude < 5000 ?
                    <FontAwesomeIcon icon="plane-departure" style={{ fontSize: '1.25em', color: "blue" }} />
                    :
                    <FontAwesomeIcon icon="long-arrow-alt-up" style={{ fontSize: '1.25em', color: "blue" }} />
                  )
                  : (selectedItem.vert_rate < 0 ?
                    (selectedItem.altitude < 5000 ?
                      <FontAwesomeIcon icon="plane-arrival" style={{ fontSize: '1.25em', color: "green" }} />
                      :
                      <FontAwesomeIcon icon="long-arrow-alt-down" style={{ fontSize: '1.25em', color: "green" }} />
                    )
                    :
                    <FontAwesomeIcon icon="equals" style={{ fontSize: '1.25em' }} />
                  )
                }</td>
              <td>{selectedItem.vert_rate}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>Ground station</th>
            <th>Squawk</th>
            <th>Signal</th>
              <th>Age</th>
            <th>Messages</th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selectedItem.groundStationName}</td>
              <td>{selectedItem.squawk}</td>
              <td>{selectedItem.rssi}</td>
              <td>{Math.floor(selectedItem.seen)}</td>
              <td>{selectedItem.messages}</td>
            </tr>
          </tbody>
        </Table>
        </div>
        )
  }
}
SelectedInfo.contextType = TracksContext;

export default SelectedInfo;
