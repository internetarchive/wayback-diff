import React from 'react';
import DiffView from './diff-view';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import qs from 'qs';
import Loading from './loading';
import '../css/diff-container.css';

/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 */
export default class DiffContainer extends React.Component {

  constructor(props) {
    super(props);

    let pr = process.env;
    let diffMethodsSupported = [];

    Object.keys(pr).map(function(key) {
      if (key.startsWith('REACT_APP_DIFFING_METHOD')) {
        diffMethodsSupported.push(pr[key]);
      }
    });

    this.state = {diffMethods: diffMethodsSupported,
      selectedMethod:diffMethodsSupported[0],
      firstTime:true};

    this.handleChange = this.handleChange.bind(this);

    this.handleLeftTimestampChange = this.handleLeftTimestampChange.bind(this);

    this.handleRightTimestampChange = this.handleRightTimestampChange.bind(this);

    this.clearPressed = this.clearPressed.bind(this);

    this.renderPressed = this.renderPressed.bind(this);
  }

  handleChange(event){
    this.setState({selectedMethod: event.target.value});
  }

  handleRightTimestampChange(){
    const selectedDigest = this.state.cdxData[document.getElementById('timestamp-select-right').selectedIndex][1];
    let allowedSnapshots = this.state.cdxData;
    allowedSnapshots = allowedSnapshots.filter(hash => hash[1] !== selectedDigest);
    this.setState({
      leftSnaps: allowedSnapshots,
      leftSnapElements : this.prepareOptionElements(allowedSnapshots)
    });
  }

  handleLeftTimestampChange(){
    const selectedDigest = this.state.cdxData[document.getElementById('timestamp-select-left').selectedIndex][1];
    let allowedSnapshots = this.state.cdxData;
    allowedSnapshots = allowedSnapshots.filter(hash => hash[1] !== selectedDigest);
    this.setState({
      rightSnaps: allowedSnapshots,
      rightSnapElements : this.prepareOptionElements(allowedSnapshots)
    });
  }

  render () {
    if (this.state.cdxData) {
      return (
        <div>
          <select id="timestamp-select-left" onChange={this.handleLeftTimestampChange}>
            {this.state.leftSnapElements}
          </select>
          <div id="center-buttons">
            <button id="clear-btn" onClick={this.clearPressed}>Clear</button>
            <button id="render-btn" onClick={this.renderPressed}>Show differences</button>
          </div>
          <select id="timestamp-select-right" onChange={this.handleRightTimestampChange}>
            {this.state.rightSnapElements}
          </select>
        </div>
      );
    }
    return (
      <div>
        <select className="diff-select" onChange={this.handleChange}>
          {this.state.diffMethods.map(function (val, index) {
            return <option key = {index} value = {val}>{val}</option>;
          })}
        </select>
        <Router>
          <Switch>
            <Route exact path = '/diff/:site' render={({location}) =>
              <div className="diffcontainer-view">
                <Loading/>
                {this.widgetRender(location.pathname)}
              </div>
            }/>
            <Route path = '/diff/:timestampA/:timestampB/:site' render={({location}) =>
              <div className="diffcontainer-view">
                {this.exportParams(location.pathname)}
              </div>
            }
            />
            <Route exact path = '/:diffType' render={({match, history}) =>
              <div className="diffcontainer-view">
                              Diffing Method:
                {this.exportQueryParams(history.location.search, match.params)}
              </div>
            }
            />
          </Switch>
        </Router>
      </div>
    );
  }

  exportParams(path){

    if (/[0-9]{14}\/[0-9]{14}\/.+/.test(path)) {

      let site = path.substring(36);
      let urlA = 'https://web.archive.org/web/' + path.substring(6,20) + '/' + site;
      let urlB = 'https://web.archive.org/web/' + path.substring(21,35) + '/' + site;

      return <DiffView page = {{url: site}}
        diffType={this.state.selectedMethod} a={urlA} b={urlB} />;
    }
  }

  exportQueryParams(query, matchP){
    query = query.substring(1);
    var qParams=qs.parse(query);
    return <DiffView page = {{url: qParams['url']}} diffType={matchP.diffType} a={qParams['a']} b={qParams['b']} />;
  }

  widgetRender (pathname) {
    pathname = pathname.substring(6);
    let url = `https://web.archive.org/cdx/search?url=${pathname}/&status=200&fl=timestamp,digest&output=json`;
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        this.prepareData(data);
      });
  }

  prepareData(data){
    data.shift();
    this.setState({
      cdxData: data,
      leftSnaps : data,
      rightSnaps : data,
      leftSnapElements : this.prepareOptionElements(data),
      rightSnapElements : this.prepareOptionElements(data)
    });
  }

  prepareOptionElements(data){
    var initialSnapshots = [];
    for (let i = 0; i < data.length; i++){
      initialSnapshots.push(<option key = {i} value = {data[i][0]}>{data[i][0]}</option>);
    }
    return initialSnapshots;
  }

  clearPressed () {
    let initialData = this.state.cdxData;
    this.setState({
      leftSnaps : initialData,
      rightSnaps : initialData,
      leftSnapElements : this.prepareOptionElements(initialData),
      rightSnapElements : this.prepareOptionElements(initialData)
    });
  }

  renderPressed () {
    let timestampA = document.getElementById('timestamp-select-left').value;
    let timestampB = document.getElementById('timestamp-select-right').value;
    let url = window.location.href.split('/');

    window.location.href= `./${timestampA}/${timestampB}/${url[url.length-1]}`;
  }
}