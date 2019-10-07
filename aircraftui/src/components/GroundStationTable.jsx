import React from 'react';

import TracksContext from './Tracks/context';

import Table from 'react-bootstrap/Table';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class GroundStationTable extends React.Component {
  render() {
    var gsArray = [];
    var keys = Object.keys(this.context.state.groundStations);
    for (var idx in keys) {
      var key = keys[idx];
      //console.log("Key: " + key);
      gsArray.push(this.context.state.groundStations[key]);
    }
    return (
      <div className="ground-stations">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Aircraft count</th>
            </tr>
          </thead>
          <tbody>
            {gsArray.map((gs) => (
              <tr key={gs.name}>
                <td>{gs.name}</td>
                <td>{gs.count}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
}
GroundStationTable.contextType = TracksContext;
export default GroundStationTable;
