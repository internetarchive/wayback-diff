# Wayback-diff

This React project is a fork of [EDGI](https://envirodatagov.org/)'s [web-monitoring-ui](https://github.com/edgi-govdata-archiving/web-monitoring-ui) project to enable analysts to quickly assess changes to monitored government websites.
It works with EDGI's [web-monitoring-processing](https://github.com/edgi-govdata-archiving/web-monitoring-processing) server and the Internet Archive's [Wayback Machine](https://web.archive.org) to render the differences between two captures of the same web page.

In addition, this project contains a `Sunburst` component to illustrate the differences of a web page capture
compared to other captures for the same year at the Wayback Machine.

##### Table of Contents  
[Installation and Requirements](#inst)  
[Usage](#usage)<br />
[Build the project](#build)

<a id="inst" />

## Installation and Requirements

Install node dependencies with: `yarn install`

[web-monitoring-processing](https://github.com/edgi-govdata-archiving/web-monitoring-processing) server must be running with CORS mechanism enabled.

This component uses Bootstrap 3, so make sure to include it in your entry point HTML document.

You need to have a CORS-enabled browser for this component to work stand alone.

<a id="usage" />

## Usage

Run the server with: `yarn start`

There are three types of URL calls:
 
**1)**
> http://localhost:port(default 3000)/diff/WEBSITE

Example request: http://localhost:3000/diff/iskme.org

**2)**
> http://localhost:port(default 3000)/diff/TIMESTAMP_A/TIMESTAMP_B/WEBSITE

Example request: http://localhost:3000/diff/20170223193029/20171212125810/archive.org

**3)**
> http://localhost:port(default 3000)/diagram/WEBPAGE/YEAR/TIMESTAMP/

Example request: http://localhost:3000/diagram/iskme.org/2018/20180813072115

### Running as a React app
You must render a DiffContainer component. It can receive up to seven props. See props for more info.

In the **index.js** file the following code should be included:

```Javascript
import ReactDOM from 'react-dom';
import DiffContainer from './components/diff-container.jsx';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


var conf = require('./conf.json');

ReactDOM.render(
  <Router>
  <Switch>
    <Route path='/diff/([0-9]{14})/([0-9]{14})/(.+)' render={({match, location}) =>
      <DiffContainer url={match.params[2] + location.search} timestampA={match.params[0]}
        loader={LOADER_COMPONENT}
        timestampB={match.params[1]} fetchCDXCallback={null} conf={conf} fetchSnapshotCallback={null} />
    } />
    <Route path='/diff/([0-9]{14})//(.+)' render={({match, location}) =>
      <DiffContainer url={match.params[1] + location.search} timestampA={match.params[0]}
        loader={LOADER_COMPONENT}
        fetchCDXCallback={null} conf={conf} fetchSnapshotCallback={null}/>
    } />
    <Route path='/diff//([0-9]{14})/(.+)' render={({match, location}) =>
      <DiffContainer url={match.params[1] + location.search} timestampB={match.params[0]}
        loader={LOADER_COMPONENT}
        fetchCDXCallback={null} conf={conf} fetchSnapshotCallback={null}/>
    } />
    <Route path='/diff///(.+)' render={({match, location}) =>
      <DiffContainer url={match.params[0] + location.search} conf={conf} noTimestamps={true}
      fetchCDXCallback={null} loader={LOADER_COMPONENT}/>
    } />
    <Route path='/diff/(.+)' render={({match, location}) =>
      <DiffContainer url={match.params[0] + location.search} fetchCDXCallback={null}
        loader={LOADER_COMPONENT} conf={conf}/>}
    />
    <Route path='/diffgraph/([0-9]{14})/(.+)' render={({match, location}) =>
      <SunburstContainer url={match.params[1] + location.search} timestamp={match.params[0]}
        loader={LOADER_COMPONENT}
        conf={conf} fetchSnapshotCallback={null}/>} />
    </Switch>
  </Router>, document.getElementById('wayback-diff'));
```

### Use it as a component in an other project

In order to use this app as a component in another React app you should include the following in
[index.js](https://github.com/internetarchive/wayback-diff/blob/master/src/index.js):

```Javascript
export DiffContainer from './components/diff-container.jsx';
export SunburstContainer from './components/sunburst-container.jsx';
```

#### Props 

##### DiffContainer can receive up to eight props. All of them are optional. 

The **conf** prop receives a JSON file that contains the configuration of the wayback-diff component.

The **fetchCDXCallback** prop is a callback function used to fetch the snapshots available from the CDX server.

The **fetchSnapshotCallback** prop is a callback function that is used to fetch the snapshots from the Wayback Machine.

- If null is passed to either one of the fetchCallback props a default fallback method is going to be used instead.

- The callback function should return a fetch Promise.

  If you use this prop, the **limit** conf option does not have any effect.

The **loader** prop is a React Component that displays when loading. If this is not set or it is null, a default loader is used instead.

The **timestampA** and **timestampB** props are the timestamps extracted from the URL.

The **url** prop is the webpage for which the snapshots are shown.

The **noTimestamps** prop which should only be set to true in the ```/diff///WEBPAGE``` path schema.


##### SunburstContainer can receive up to five props. All of them are optional. 

The **loader** prop is a React Component that displays when loading. If this is not set or it is null, a default loader is used instead.

The **timestamp** which is the timestamp whose simhash is compared to others.

The **url** which is the webpage for which the the simhashes to be compared.

The **conf** which is a JSON file that contains the configuration of the wayback-diff component.

The **fetchSnapshotCallback** which is a callback function used to fetch the snapshots from the Wayback Machine. This is used to validate the timestamp in the URL.

- If null is passed to either one of the fetchCallback props a default fallback method is going to be used instead.

- The callback function should return a fetch Promise.


##### conf.json

The configuration file should have the following format:

```
{
  "webMonitoringProcessingURL": "http://localhost:8888",
  "limit": "1000",
  "snapshotsPrefix": "http://web.archive.org/web/",
  "urlPrefix": "/diff/",
  "diffgraphPrefix": "/diffgraph/",
  "cdxServer": "http://web.archive.org/cdx/",
  "sparklineURL": "http://web.archive.org/__wb/sparkline",
  "iframeLoader": "https://web.archive.org/static/bower_components/wayback-search-js/dist/feb463f3270afee4352651aac697d7e5.gif",
  "waybackDiscoverDiff": "http://localhost:4000",
  "maxSunburstLevelLength": "70",
  "compressedSimhash": true
}
```

<a id="build"/>

## Build the project

Run `yarn build:dev`

### Install the library

To install the component library, inside your new project directory you should run:

```
yarn add file:[PATH_TO]/wayback-diff
```

where [PATH_TO] equals with the path where you have wayback-diff saved.


If you are installing this component as a library from this Github repository:

```
yarn add https://github.com/ftsalamp/wayback-diff
```

### Import the component

In the file you want to use the wayback-diff component use the following code to import it:

```Javascript
import {DiffContainer, SunburstContainer} from 'wayback-diff';
```

### Use the component

After importing the component you might use it like any other React component:

```Javascript
  <Router>
    <Switch>
      <Route path='/diff/([0-9]{14})/([0-9]{14})/(.+)' render={({match, location}) =>
        <DiffContainer url={match.params[2] + location.search} timestampA={match.params[0]}
          loader={LOADER_COMPONENT}
          timestampB={match.params[1]} fetchCDXCallback={null} conf={this.conf} fetchSnapshotCallback={null} />
        } />
      <Route path='/diff/([0-9]{14})//(.+)' render={({match, location}) =>
        <DiffContainer url={match.params[1] + location.search} timestampA={match.params[0]}
          loader={LOADER_COMPONENT}
          fetchCDXCallback={null} conf={this.conf} fetchSnapshotCallback={null}/>
        } />
      <Route path='/diff//([0-9]{14})/(.+)' render={({match, location}) =>
        <DiffContainer url={match.params[1] + location.search} timestampB={match.params[0]}
          loader={LOADER_COMPONENT}
          fetchCDXCallback={null} conf={this.conf} fetchSnapshotCallback={null}/>
      } />
      <Route path='/diff///(.+)' render={({match, location}) =>
        <DiffContainer url={match.params[0] + location.search} conf={this.conf} noTimestamps={true} fetchCDXCallback={null}
          loader={LOADER_COMPONENT}/>
      } />
      <Route path='/diff/(.+)' render={({match, location}) =>
        <DiffContainer url={match.params[0] + location.search} fetchCDXCallback={null}
          loader={LOADER_COMPONENT} conf={this.conf}/>}
      />
      <Route path='/diffgraph/([0-9]{14})/(.+)' render={({match, location}) =>
        <SunburstContainer url={match.params[1] + location.search} timestamp={match.params[0]}
          loader={LOADER_COMPONENT}
          conf={this.conf} fetchSnapshotCallback={null}/>} 
      />
    </Switch>
  </Router>
}/>
```

### Example project

If you need an example on how to use the component check out [this repository](https://github.com/ftsalamp/wayback-diff-test)
