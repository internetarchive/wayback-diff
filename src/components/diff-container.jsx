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

/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 */
export default class DiffContainer extends React.Component {

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
              <TimestampHeader isInitial = {false} fetchCallback = {this.props.fetchCallback} diffMethodSelectorCallback = {this.handleMethodChange}/>
              {this.exportParams(location.pathname)}
            </div>
          }/>
          <Route exact path = '/diff/:site' render={ () =>
            <div className="diffcontainer-view">
              <TimestampHeader isInitial={true} fetchCallback = {this.props.fetchCallback} diffMethodSelectorCallback = {this.handleMethodChange}/>
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
        let timestampA = path[path.length-3];
        let timestampB = path[path.length-2];
        let urlA = 'http://web.archive.org/web/' + timestampA + '/' + site;
        let urlB = 'http://web.archive.org/web/' + timestampB + '/' + site;

        this.checkURL(urlA, timestampA, urlB, timestampB);

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

  checkURL (urlA, timestampA, urlB, timestampB) {

    fetch(urlA, {redirect: 'follow'})
      .then(response => {
        urlA = response.url;
        let fetchedTimestampA = urlA.split('/')[4];
        fetch(urlB, {redirect: 'follow'})
          .then(response => {
            urlB = response.url;
            let fetchedTimestampB = urlB.split('/')[4];

            if (timestampA !== fetchedTimestampA || timestampB !== fetchedTimestampB) {
              let tempURL = urlA.split('/');
              var url = '';
              for(var i = 7; i <= (tempURL.length-1); i++){
                url = url + tempURL[i];
              }
              window.location.href = '/diff/' + fetchedTimestampA + '/' + fetchedTimestampB + '/' + url;
            }
          });
      });
  }
}