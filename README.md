# Wayback-diff

## **[Wayback-diff](https://github.com/ftsalamp/wayback-diff)**

This project uses a lot of code from the [web-monitoring-ui](https://github.com/edgi-govdata-archiving/web-monitoring-ui) project. It aims to query the web-monitoring-processing server directly and then render the changes depending on the parameters given.

# Installation

Install node dependencies with `yarn`

`yarn install`

# Usage

In order for this app to run, the responding web-monitoring-processing server must have a CORS mechanism implemented.
You can find my implementation of a CORS-enabled web-monitoring-processing server [here](https://github.com/ftsalamp/web-monitoring-processing/tree/cors).

You also need to have a CORS-enabled browser for this component to work.

Run the server with the command `yarn start`

There are two types of URL calls:
 
**1)**
> http://localhost:port(default 3000)/diff/WEBSITE

Example request: http://localhost:3000/diff/iskme.org

**2)**
> http://localhost:port(default 3000)/diff/TIMESTAMP_A/TIMESTAMP_B/WEBSITE

Example request: http://localhost:3000/diff/20170223193029/20171212125810/archive.org

# Running as a React app
You must render a DiffContainer component. It can receive up to seven props. See props for more info.

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

# Props 
DiffContainer can receive up to seven props. All of them are optional. 

The **fetchCallback** which is a callback function that will be used to fetch the snapshots available from the CDX server.

- If null is passed as the fetchCallback prop a default fallback method is going to be used instead.

- The callback function should return a fetch Promise.

  If you use this prop, the **limit** prop does not have any effect.

The **waybackLoaderPath** which indicates the URL where the image that will be shown when loading is.

The **timestampA** and **timestampB** which are the timestamps extracted from the URL.

The **webMonitoringProcessingURL** and **webMonitoringProcessingPort** which contain the URL and the port of the wm-diffing-server that will be used from this component.

The **limit** which sets a limit on how many snapshots the CDX server should reply with.

## Build the project

Run

`yarn build:dev`

## Install the library

To install the component library, inside your new project directory you should run:

```
yarn add file:[PATH_TO]/wayback-diff
```

where [PATH_TO] equals with the path where you have wayback-diff saved.


If you are installing this component as a library from this Github repository:

```
yarn add https://github.com/ftsalamp/wayback-diff
```

## Import the component

In the file you want to use the wayback-diff component use the following code to import it:

```Javascript
import {DiffContainer} from 'wayback-diff';
```

## Use the component

After importing the component you might use it like any other React component:

```Javascript
<DiffContainer site={site} timestampA={timestampA}
                      webMonitoringProcessingURL={this.webMonitoringProcessingURL}
                      webMonitoringProcessingPort={this.webMonitoringProcessingPort}
                      timestampB={timestampB} fetchCallback = {null} limit={'1000'}
                      waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'} />
```

# Example project

If you need an example on how to use the component check [this repository out](https://github.com/ftsalamp/wayback-diff-test)
