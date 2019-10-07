import React from 'react';
//import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  //Switch,
  Route
}
from 'react-router-dom';

import MapPage from './pages/MapPage';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faHome, faPause, faLongArrowAltUp, faLongArrowAltDown, faEquals, faPlane, faPlaneArrival, faPlaneDeparture, faWifi, faRoute, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import TracksProvider from './components/Tracks/TracksProvider';

library.add(fab, faHome);
library.add(fas, faPause);
library.add(fas, faLongArrowAltUp);
library.add(fas, faLongArrowAltDown);
library.add(fas, faEquals);
library.add(fas, faPlane);
library.add(fas, faPlaneArrival);
library.add(fas, faPlaneDeparture);
library.add(fas, faWifi);
library.add(fas, faRoute);
library.add(fas, faInfoCircle);

function App() {
  return (
    <div className="App fullwidth">
      <TracksProvider>
       <Router>
        <Route exact path='/'  render={({ location, history }) => (
          <React.Fragment>
            <MapPage />
          </React.Fragment>
        )} />
       </Router>
      </TracksProvider >
    </div>
  );
}

export default App;
