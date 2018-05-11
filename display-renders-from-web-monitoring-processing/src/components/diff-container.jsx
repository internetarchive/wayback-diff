import React from 'react';
import DiffView from './diff-view';
import {
    BrowserRouter as Router,
    Route
  } from 'react-router-dom'
import qs from 'qs'

/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 * @param {DiffContainerProps} props
 */
export default class DiffContainer extends React.Component {
    constructor (props) {
        super(props);
    }
  render () {

    return (
        <Router>
        <Route path = '/:diffType' render={({match, history}) =>
          <div className="diffcontainer-view">
              {this.exportQueryParams(history.location.search, match.params)}
        </div>
          }
        />
      </Router>
    );
  }

  exportQueryParams(query, matchP){
        query = query.substring(1);
        var qParams=qs.parse(query);
        return <DiffView page = {{url: qParams["url"]}} diffType={matchP.diffType} a={qParams["a"]} b={qParams["b"]} />
  }
}