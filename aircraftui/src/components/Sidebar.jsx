import React from 'react';
import SideNav from '@trendmicro/react-sidenav';// { NavItem, NavIcon, NavText } 
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import AircraftTable from './AircraftTable';

const NavHeader = styled.div`
    display: ${props => (props.expanded ? 'block' : 'none')};
    white-space: nowrap;
    background-color: #db3d44;
    color: #fff;
    > * {
        color: inherit;
        background-color: inherit;
    }
`;
// height: 20px + 10px + 10px = 40px
const NavTitle = styled.div`
    font-size: 2em;
    line-height: 20px;
    padding: 10px 0;
`;

// height: 20px + 4px = 24px;
const NavSubTitle = styled.div`
    font-size: 1em;
    line-height: 20px;
    padding-bottom: 4px;
`;
const NavInfoPane = styled.div`
    float: left;
    width: 100%;
    padding: 10px 20px;
    background-color: #eee;
`;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true, selected: this.props.location.pathname
    };
    console.log("Current page: " + this.props.location);
  }
  onToggle = (expanded) => {
    this.setState({ expanded: expanded });
  };
  onSelect = (eventKey, event) => {
    //console.log("onSelect: " + eventKey);
    event.preventDefault();
    //console.log(eventKey);
    this.setState({ selected: eventKey });
    this.props.history.push(eventKey);
  }
  render() {
    const { expanded } = this.state;

    return (
      <SideNav
        expanded={expanded}
        onToggle={this.onToggle}
        onSelect={this.onSelect}
        className={expanded? "trackernav":""}
      >
        <SideNav.Toggle />
        <NavHeader expanded={expanded}>
          <NavTitle>Tracker</NavTitle>
          <NavSubTitle>Detailed Information</NavSubTitle>
        </NavHeader>

        {expanded &&
          <NavInfoPane>
            <AircraftTable />
          </NavInfoPane>
        }
        <SideNav.Nav>
        </SideNav.Nav>
      </SideNav>
    )
  }
}
export default withRouter(Sidebar);