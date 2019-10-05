import React from 'react';
import SideNav, { NavItem, NavIcon, NavText }  from '@trendmicro/react-sidenav';

import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import AircraftTable from './AircraftTable';
import GroundStationTable from './GroundStationTable';
import SelectedInfo from './SelectedInfo';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TracksContext from './Tracks/context';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';

import About from './About';

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
    var that = this;
    const popover = (
      <Popover id="popover-basic" className='about-area'>
        <Popover.Title as="h3">Application Details</Popover.Title>
        <Popover.Content>
          <About />
        </Popover.Content>
      </Popover>
    );

    return (
      <SideNav
        expanded={expanded}
        onToggle={this.onToggle}
        onSelect={this.onSelect}
        className={"trackercs " + (expanded? "trackernav":"")}
      >
        <SideNav.Toggle />
        <NavHeader expanded={expanded}>
          <NavTitle>Tracker&nbsp;&nbsp;
            <span>
              <OverlayTrigger trigger="click" placement="below" overlay={popover}>
                <Button variant="outline-light">
                  <FontAwesomeIcon icon="info-circle" className="infolink" />
                </Button>
              </OverlayTrigger>
            </span>
          </NavTitle>
          <NavSubTitle>Detailed Information</NavSubTitle>
        </NavHeader>

        {expanded &&
          <NavInfoPane className="nav-info-max">
            <SelectedInfo />
            <Tabs defaultActiveKey='aircraft'>
              <Tab eventKey='aircraft' title="Aircraft">
                <AircraftTable />
              </Tab>
              <Tab eventKey='stations' title="Stations">
                <GroundStationTable />
              </Tab>
            </Tabs>
          </NavInfoPane>
        }
        <SideNav.Nav>
          { !expanded && 
          <NavItem>
            <NavIcon>
              <FontAwesomeIcon icon="plane" style={{ fontSize: '1.75em' }} />
              <div className="icon-overlay">{this.context.state.data?this.context.state.data.aircraft.length:0}</div>
            </NavIcon>
            <NavText></NavText>
          </NavItem>
          }
          {!expanded && 
          <NavItem>
            <NavIcon>
              <FontAwesomeIcon icon="wifi" style={{ fontSize: '1.75em' }} />
              <div className="icon-overlay">{this.context.state.groundStations ? Object.keys(this.context.state.groundStations).length : 0}</div>
            </NavIcon>
            <NavText> </NavText>
          </NavItem>
          }
          <NavItem active={this.context.state.paused} onClick={(evt) => { that.context.state.togglePause(); }}>
            <NavIcon>
              <FontAwesomeIcon icon="pause" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
              Click to {this.context.state.paused ? "unpause": "pause"}
            </NavText>
          </NavItem>

          <NavItem active={this.context.state.showAllTracks} onClick={(evt) => { that.context.state.toggleAllTracks(); }}>
            <NavIcon>
              <FontAwesomeIcon icon="route" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
              Click to {this.context.state.showAllTracks ? "show selected track" : "show all tracks"}
            </NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    )
  }
}
Sidebar.contextType = TracksContext;
export default withRouter(Sidebar);
// 