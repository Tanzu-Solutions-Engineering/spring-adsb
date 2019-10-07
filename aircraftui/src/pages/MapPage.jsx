import React, {
  Component
} from "react";
//import Container from "react-bootstrap/Container";
//import Row from "react-bootstrap/Row";
//import Col from "react-bootstrap/Col";

import Map from '../components/Map';
import Sidebar from '../components/Sidebar';

class UserHome extends Component {
  render() {
    return (
      <div className="">
        <Sidebar />
        <Map />
      </div>
    );
  }
}
export default UserHome;