import React, {
  Component
}
  from "react";
import Table from 'react-bootstrap/Table';

//import withTracksContext from './Tracks/withTracksContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TracksContext from './Tracks/context';

class AircraftTable extends Component {
  render() {
    //console.log("Table render");
    const { data } = this.context.state;

    const sortedData = !data ? null : [...data.aircraft].sort((a, b) => {
      //console.log("Comparing a: " + JSON.stringify(a.flight) + " to b: " + JSON.stringify(b.flight));
      //console.log("Airline: " + a.airline);
      var alow = a.airline.toLowerCase();
      var blow = b.airline.toLowerCase();
      if (alow > blow) {
        return 1;
      }
      if (alow == blow) {
        if (a.flight > b. flight) {
          return 1;
        }
        return -1;
      }
      return -1;
    });

    var that = this;

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
      <tbody className="overflow-scroll">
          {!sortedData ? <tr><td colSpan='5'>Loading...</td></tr> :
            sortedData.map((item) => (
            <tr key={item.flight} className={(item.flight == this.context.state.selected) ? "selected-flight" : ""}>
                <td key={item.flight} onClick={(evt) => { that.context.state.onSelect(item.flight); }}>{item.airline} <span className="flight-code">{item.flight}</span></td>
              <td>{item.track}</td>
              <td>{item.speed}</td>
              <td>{item.altitude} &nbsp;
                {item.vert_rate > 0 ? 
                    (item.altitude < 5000 ?
                      <FontAwesomeIcon icon="plane-departure" style={{ fontSize: '1.25em', color: "blue" }} />
                      :
                        <FontAwesomeIcon icon="long-arrow-alt-up" style={{ fontSize: '1.25em', color: "blue" }} />
                    )
                  : (item.vert_rate < 0 ?
                      (item.altitude < 5000 ?
                        <FontAwesomeIcon icon="plane-arrival" style={{ fontSize: '1.25em', color: "green" }} />
                        :
                        <FontAwesomeIcon icon="long-arrow-alt-down" style={{ fontSize: '1.25em', color: "green" }} />
                      )
                      :
                      <FontAwesomeIcon icon="equals" style={{ fontSize: '1.25em'}} />
                  )
                }
              </td>
              <td>{Math.floor(item.seen)}</td>
            </tr>
          ))
        }
      </tbody>
    </Table>)
  }
}
AircraftTable.contextType = TracksContext;

export default AircraftTable;
