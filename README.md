# Wayback-diff

## **[Wayback-diff](https://github.com/ftsalamp/wayback-diff)**

This project uses a lot of code from the [web-monitoring-ui](https://github.com/edgi-govdata-archiving/web-monitoring-ui) project. It aims to query the web-monitoring-processing server directly and then render the changes depending on the parameters given.

# Instalation

Install node dependencies with `yarn`

`yarn install`

# Usage

In order for this app to run, the responding web-monitoring-processing server must have a CORS mechanism implemented.
You can find my implementation of a CORS-enabled web-monitoring-processing server [here](https://github.com/ftsalamp/web-monitoring-processing/tree/cors).

Run the server with the command `yarn start`

There are two types of URL calls:
 
**1)**
> http://localhost:port(default 3000)/diff/WEBSITE

Example request: http://localhost:3000/diff/iskme.org

**2)**
> http://localhost:port(default 3000)/diff/TIMESTAMP_A/TIMESTAMP_B/WEBSITE

Example request: http://localhost:3000/diff/20170223193029/20171212125810/archive.org

# Running as a React app
You must render a DiffContainer component. It receives one prop. The fetchCallback which is a callback function that will be used to fetch the snapshots available from the CDX server.

- If null is passed as the fetchCallback prop a default fallback method is going to be used instead.

- The callback function should return a fetch Promise.

In the **index.js** file the following code should be included:

```Javascript
import ReactDOM from 'react-dom';
import DiffContainer from './components/diff-container.jsx';
var path = window.location.pathname;
let webMonitoringProcessingURL= 'http://localhost';
let webMonitoringProcessingPort= '8888';
path = path.split('/');
let site = path[path.length-1];
if (path.length === 3) {
  ReactDOM.render(<DiffContainer site={site} fetchCallback = {null}
    webMonitoringProcessingURL={webMonitoringProcessingURL}
    webMonitoringProcessingPort={webMonitoringProcessingPort}/>, document.getElementById('wayback-diff'));
} else {
  let timestampA = path[path.length-3];
  let timestampB = path[path.length-2];
  ReactDOM.render(<DiffContainer site={site} timestampA={timestampA} timestampB={timestampB}
    webMonitoringProcessingURL={webMonitoringProcessingURL}
    webMonitoringProcessingPort={webMonitoringProcessingPort}
    fetchCallback = {null} />, document.getElementById('wayback-diff'));
}
```

# Use it as a component in an other project

## Add code

In order to use this app as a component in an other React app you should include in the **index.js** file the following code:

```Javascript
export DiffContainer from './components/diff-container.jsx';
```

## Build the project

Run

`build:dev`

## Install the library

To install the component library, inside your new project directory you should run:

```
yarn add file:[PATH_TO]/wayback-diff
```

If you are installing this component as a library from this Github repository:

```
yarn add https://github.com/ftsalamp/wayback-diff
```

where [PATH_TO] equals with the path where you have wayback-diff saved.

## Import the component

In the file you want to use the wayback-diff component use the following code to import it:

```
import {DiffContainer} from 'wayback-diff';
```

## Use the component

After importing the component you might use it like any other React component:

```
<DiffContainer site={site} timestampA={timestampA}
                      webMonitoringProcessingURL={this.webMonitoringProcessingURL}
                      webMonitoringProcessingPort={this.webMonitoringProcessingPort}
                      timestampB={timestampB} fetchCallback = {null}
```
