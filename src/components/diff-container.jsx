import React from 'react';
import DiffView from './diff-view.jsx';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import qs from 'qs';
import '../css/diff-container.css';
import TimestampHeader from './timestamp-header.jsx';
import DiffingMethodSelector from './diffing-method-selector.jsx';

/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 */
export class DiffContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    this.handleMethodChange = this.handleMethodChange.bind(this);
    this.exportParams = this.exportParams.bind(this);

  }

  handleMethodChange(method) {
    this.setState({selectedMethod: method});
  }

  render () {
    return (
      <Router>
        <Switch>
          <Route exact path = '/diff/:timestampA/:timestampB/:site' render={({location}) =>
            <div className="diffcontainer-view">
              <TimestampHeader isInitial = {false}/>
              <DiffingMethodSelector parentHandle = {this.handleMethodChange}/>
              {this.exportParams(location.pathname)}
            </div>
          }/>
          <Route exact path = '/diff/:site' render={ () =>
            <div className="diffcontainer-view">
              <TimestampHeader isInitial={true}/>
              <DiffingMethodSelector parentHandle = {this.handleMethodChange}/>
            </div>
          }/>
        </Switch>
      </Router>
    );
  }

  exportParams(path){

    if(this.state.selectedMethod !== undefined) {

      if (/[0-9]{14}\/[0-9]{14}\/.+/.test(path)) {
        path = path.split('/');
        let site = path[path.length-1];
        let urlA = 'https://web.archive.org/web/' + path[path.length-3] + '/' + site;
        let urlB = 'https://web.archive.org/web/' + path[path.length-2] + '/' + site;

        return <DiffView page={{url: site}}
          diffType={this.state.selectedMethod[0]} a={urlA} b={urlB}/>;
      }
    }
}

  exportQueryParams(query, matchP){
    query = query.substring(1);
    var qParams=qs.parse(query);
    return <DiffView page = {{url: qParams['url']}} diffType={matchP.diffType} a={qParams['a']} b={qParams['b']} />;
  }

}