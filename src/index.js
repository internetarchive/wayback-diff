/* eslint-disable no-unused-vars */
import React, { StrictMode } from 'react';
/* eslint-enable no-unused-vars */

import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import DiffContainer from './components/diff-container.jsx';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SunburstContainer from './components/sunburst/sunburst-container.jsx';

const conf = require('./conf.json');
const root = createRoot(document.getElementById('wayback-diff'));

root.render(
  <StrictMode>
    <Router>
      <Switch>
        <Route path='/diff/([0-9]{14})/([0-9]{14})/(.+)' render={({ match, location }) =>
          <DiffContainer url={match.params[2] + location.search} timestampA={match.params[0]}
            loader={null}
            timestampB={match.params[1]} conf={conf} />
        } />
        <Route path='/diff/([0-9]{14})//(.+)' render={({ match, location }) =>
          <DiffContainer url={match.params[1] + location.search} timestampA={match.params[0]}
            loader={null}
            conf={conf} />
        } />
        <Route path='/diff//([0-9]{14})/(.+)' render={({ match, location }) =>
          <DiffContainer url={match.params[1] + location.search} timestampB={match.params[0]}
            loader={null}
            conf={conf} />
        } />

        <Route path='/diff///(.+)' render={({ match, location }) =>
          <DiffContainer url={match.params[0] + location.search} conf={conf} noTimestamps={true}
            loader={null}/>
        } />
        <Route path='/diff/(.+)' render={({ match, location }) =>
          <DiffContainer url={match.params[0] + location.search}
            loader={null} conf={conf}/>}
        />
        <Route path='/diffgraph/([0-9]{14})/(.+)' render={({ match, location }) =>
          <SunburstContainer url={match.params[1] + location.search} timestamp={match.params[0]}
            loader={null}
            conf={conf} />}
        />
      </Switch>
    </Router>
  </StrictMode>);
