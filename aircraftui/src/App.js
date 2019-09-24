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
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
//import { fas } from '@fortawesome/free-solid-svg-icons'
import { faHome } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faHome);

function App() {
  return (
    <div className="App fullwidth">
      <Router>
        <Route render={({ location, history }) => (
          <React.Fragment>
            <MapPage />
          </React.Fragment>
        )} />
      </Router>
    </div>
  );
}

export default App;
