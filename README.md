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
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loading from './components/loading.jsx';


var conf = require('./conf.json');

ReactDOM.render(<Router>
  <Switch>
    <Route path="/diff/([^/]*)/([^/]*)/(.+)" render={({match}) =>
      <DiffContainer site={match.params[2]} timestampA={match.params[0]}
        loader={<Loading waybackLoaderPath={'PATH_TO_LOADER_IMAGE'}/>}
        timestampB={match.params[1]} fetchCallback = {null} conf={conf}/>
    }/>
    <Route path="/diff/:timestampA//:site" render={({match}) =>
      <DiffContainer site={match.params.site} timestampA={match.params.timestampA}
        conf={conf}
        loader={<Loading waybackLoaderPath={'PATH_TO_LOADER_IMAGE'}/>}/>
    }/>
    <Route path="/diff//:timestampB/:site" render={({match}) =>
      <DiffContainer site={match.params.site} timestampB={match.params.timestampB}
        conf={conf}
        loader={<Loading waybackLoaderPath={'PATH_TO_LOADER_IMAGE'}/>}/>
    }/>
    <Route path="/diff/:site" render={({match}) =>
      <DiffContainer site={match.params.site} fetchCallback = {null}
        conf={conf}
        loader={<Loading waybackLoaderPath={'PATH_TO_LOADER_IMAGE'}/>}
        conf={conf}/>}
    />
  </Switch>
</Router>, document.getElementById('wayback-diff'));
```

# Use it as a component in an other project

## Add code

In order to use this app as a component in an other React app you should include in the **index.js** file the following code:

```Javascript
export DiffContainer from './components/diff-container.jsx';
```

# Props 
DiffContainer can receive up to seven props. All of them are optional. 

The **conf** prop that receives a JSON file that contains the configuration of the wayback-diff component.

The **fetchCallback** which is a callback function that will be used to fetch the snapshots available from the CDX server.

- If null is passed as the fetchCallback prop a default fallback method is going to be used instead.

- The callback function should return a fetch Promise.

  If you use this prop, the **limit** conf option does not have any effect.

The **loader** which is a React Component that will be shown when loading is.

The **timestampA** and **timestampB** which are the timestamps extracted from the URL.

The **site** which is the webpage for which the snapshots are shown.

# conf.json

The configuration file should have the following format:

```
{
  "webMonitoringProcessingURL": "http://localhost:8888",
  "limit": "1000",
  "noSnapshotURL": "URL_TO_noSnapshotURL",
  "snapshotsPrefix": "http://web.archive.org/web/",
  "urlPrefix": "/diff/",
  "cdxServer": "http://web.archive.org/cdx/",
  "iframeLoader": "https://web.archive.org/static/bower_components/wayback-search-js/dist/feb463f3270afee4352651aac697d7e5.gif"
}
```

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
 <DiffContainer site={match.params[2]} timestampA={match.params[0]}
                    loader={<Loading waybackLoaderPath={'PATH_TO_LOADER_IMAGE'}/>}
                    timestampB={match.params[1]} fetchCallback = {null} conf={this.conf}/>
}/>
```

# Example project

If you need an example on how to use the component check [this repository out](https://github.com/ftsalamp/wayback-diff-test)
