This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify


## TODOs

### For before S1P

- DONE Basic POC
 - DONE Basic layout, hidden component to the right, map main to the left
 - DONE Show aircraft positions from JSON URL
 - DONE Have an aircraft info section on the right showing the same data as a table
 - DONE Refresh JSON map every second
- WIP More Aircraft Info
 - DONE Abstract out aircraft rest call to another component, and use withAircraftInfo
 - DONE cache: reload needed on fetch - BUG figure out why context update isn't updating components
 - DONE more user friendly aircraft codes (airline not codes)
 - DONE Make aircraft clickable, with data highlighted in table and map
 - DONE Tabbed sidebar (aircraft table, ground stations, ...)
 - DONE Selected info component on LHS table (invisible if none selected) akin to current selection area
 - DONE Aircraft flight code decoded
 - DONE National flags on table
 - DONE Visible aircraft summary when side nav is closed
 - DONE Ground station summary when side nav is closed
 - DONE Ground station details table
 - Proper aircraft map icons
 - WIP Ascent / Descent and altitude indications and colours
  - DONE Table
  - Map
 - Aircraft category decoded
 - Provide links to other info providers
 - Make table scrollable
- DONE Testing
 - DONE Pause button for rest requests for testing?
 - DONE Don't fire off another rest request unless previous has completed
- Demo prep
 - Demo info popup - Include popup architecture png image, with steps noted, and tech icons used (redis, rabbit, etc.)
 - Pivotal info popup - Nav link in large / minimised views
 - Include link to rest api endpoint
 - Include own link to PWS info page
 - Pivotal corporate colour scheme
 - Show more map controls (layers, track toggle, zoom buttons etc.)

### For post S1P

- Offline
 - Demo data for offline demonstrations
  - Base mapping layer (SVG countries?)
  - Air
  - Sea
  - Land
  - Overlays (if any)
- Niceties
 - Position estimate until re-appears in signal
 - Ground station names and locations
 - Aircraft tracks
 - Minimised side bar to show aircraft numbers, ground stations numbers, other links
 - Ground station list
 - Hover over groundstation highlights all aircraft from that station
  - Requires selectedFlight and selectedGS methods in provider to share context
 - Special squawk code highlighting
- Alternative UI
 - RADAR screen dark mode
 - Aircraft speed trails
 - Aircraft labels
 - Save UI settings between page loads
- Future proofing
 - Support for Sea (AIS) data
 - Support for different land components (tank, jeep, person)

### For backend developments
- Websockets / streaming
 - track provider to try websockets, if fails fall back to rest (Spring will likely support websockets, .NET won't)
