import React, {
  Component
}
  from "react";
import Table from 'react-bootstrap/Table';

import withTracksContext from './Tracks/withTracksContext';

class AircraftTable extends Component {
  render() {
    const { data } = this.props.context.state;

    const sortedData = !data ? null : [...data.aircraft].sort((a, b) => {
      console.log("Comparing a: " + JSON.stringify(a.flight) + " to b: " + JSON.stringify(b.flight));
      if (a.flight > b.flight) {
        return 1;
      }
      return -1;
    });

    return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Flight</th>
          <th>Track</th>
          <th>Speed</th>
          <th>Alt</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
          {!sortedData ? <tr><td colSpan='5'>Loading...</td></tr> :
            sortedData.map((item) => (
            <tr key={item.flight}>
              <td>{item.flight}</td>
              <td>{item.track}</td>
              <td>{item.speed}</td>
              <td>{item.altitude}</td>
              <td>{Math.floor(item.seen)}</td>
            </tr>
          ))
        }
      </tbody>
    </Table>)
  }
}
export default withTracksContext(AircraftTable);
