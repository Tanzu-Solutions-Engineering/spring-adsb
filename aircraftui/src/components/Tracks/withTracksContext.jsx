import React from 'react';
import TracksContext from './context';

export function withTracksContext(Component) {
  return function WrapperComponent(props) {
    return (
      <TracksContext.Consumer>
        {state => <Component {...props} context={state} />}
      </TracksContext.Consumer>
    );
  };
}

export default withTracksContext;