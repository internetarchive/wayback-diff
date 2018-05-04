import PropTypes from 'prop-types';
import React from 'react';
import DiffView from './diff-view';
import {
    BrowserRouter as Router,
    Route,
    Link
  } from 'react-router-dom'

/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 * @param {DiffContainerProps} props
 */
export default class DiffContainer extends React.Component {
  constructor (props) {
    super (props);
  }

  render () {

    return (
        <Router>
        <Route path = '/:a/:b/:diffType/:page' render={({match}) =>
          <div className="diffcontainer-view">
          <DiffView page = {{url: match.params.page}} diffType={match.params.diffType} a={match.params.a} b={match.params.b} />
        </div>
          }
        />
      </Router>
    );
  }
}