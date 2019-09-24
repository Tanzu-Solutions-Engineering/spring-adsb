import React, {
  Component
}
  from "react";
import Table from 'react-bootstrap/Table';

class AircraftTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: null
    }
  }
  componentDidMount() {
    this.refreshData(); 
  }
  refreshData() {
    console.log("In refresh data");
    fetch('http://aircraft-monitor-central.cfapps.io/data/aircraft.json')
      .then(async (response) =>  {
        var json = await response.json();
        //console.log("Got data: " + JSON.stringify(json));
        this.setState({ data: json })
      })
      .catch((err) => {
        console.log("Error reported fetching aircraft json data...");
        console.log(err);
      });
  }
  render() {
    const { data } = this.state;
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
        { !data ? <tr><td colSpan='5'>Loading...</td></tr> :
          data.aircraft.map((item) => (
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
export default AircraftTable;
