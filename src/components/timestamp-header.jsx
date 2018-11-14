import React from 'react';
import '../css/diff-container.css';
import {handleRelativeURL, fetch_with_timeout, checkResponse} from '../js/utils.js';
/**
 * Display a timestamp selector
 *
 * @class TimestampHeader
 * @extends {React.Component}
 */
export default class TimestampHeader extends React.Component {

  ABORT_CONTROLLER = new window.AbortController();
  _isMountedNow = false;
  _shouldValidateTimestamp = true;

  constructor(props) {
    super(props);

    this.state = {
      cdxData: false,
      showDiff: false,
      showError: false,
      timestampA: this.props.timestampA,
      timestampB: this.props.timestampB
    };

    this._handleLeftTimestampChange = this._handleLeftTimestampChange.bind(this);

    this._handleRightTimestampChange = this._handleRightTimestampChange.bind(this);

    this._restartPressed = this._restartPressed.bind(this);

    this._showDiffs = this._showDiffs.bind(this);

    this._errorHandled = this._errorHandled.bind(this);

  }

  componentDidMount() {
    this._isMountedNow = true;
  }

  componentWillUnmount(){
    this._isMountedNow = false;
    this.ABORT_CONTROLLER.abort();
  }

  _handleRightTimestampChange(){
    const selectedDigest = this.state.cdxData[document.getElementById('timestamp-select-right').selectedIndex][1];
    let allowedSnapshots = this.state.cdxData;
    allowedSnapshots = allowedSnapshots.filter(hash => hash[1] !== selectedDigest);
    this.setState({
      leftSnaps: allowedSnapshots,
      leftSnapElements : this._prepareOptionElements(allowedSnapshots)
    });
  }

  _handleLeftTimestampChange(){
    const selectedDigest = this.state.cdxData[document.getElementById('timestamp-select-left').selectedIndex][1];
    let allowedSnapshots = this.state.cdxData;
    allowedSnapshots = allowedSnapshots.filter(hash => hash[1] !== selectedDigest);
    this.setState({
      rightSnaps: allowedSnapshots,
      rightSnapElements : this._prepareOptionElements(allowedSnapshots)
    });
  }

  render () {
    const Loader = () => this.props.loader;

    if (!this.state.showError) {
      if (this.state.cdxData) {
        if (this._shouldValidateTimestamp) {
          this._checkTimestamps();
        }
        return (
          <div className="timestamp-header-view">
            {this._showInfo()}
            {this._showTimestampSelector()}
            {this._showOpenLinks()}
          </div>
        );
      }
      return (<div>
        {this._fetchCDXData()}
        <Loader/>
      </div>
      );
    }
  }

  _checkTimestamps () {
    this._shouldValidateTimestamp = false;
    var fetchedTimestamps = { a: '', b: '' };
    if (this.state.timestampA && this.state.timestampB) {
      this._validateTimestamp(this.state.timestampA, fetchedTimestamps, 'a')
        .then(() => {return this._validateTimestamp(this.state.timestampB, fetchedTimestamps, 'b');})
        .then(()=> {
          if (this._redirectToValidatedTimestamps){
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(error => {this._errorHandled(error.message);});
    } else if (this.state.timestampA) {
      this._validateTimestamp(this.state.timestampA, fetchedTimestamps, 'a')
        .then(()=> {
          if (this._redirectToValidatedTimestamps){
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(error => {this._errorHandled(error.message);});
    } else if (this.state.timestampB) {
      this._validateTimestamp(this.state.timestampB, fetchedTimestamps, 'b')
        .then(()=> {
          if (this._redirectToValidatedTimestamps){
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(error => {this._errorHandled(error.message);});
    }
  }

  _validateTimestamp(timestamp, fetchedTimestamps, position){
    if (this.props.fetchSnapshotCallback) {
      return this._handleTimestampValidationFetch(this.props.fetchSnapshotCallback(timestamp), timestamp, fetchedTimestamps, position);
    }
    const url = handleRelativeURL(this.props.conf.snapshotsPrefix) + timestamp + '/' + encodeURIComponent(this.props.url);
    return this._handleTimestampValidationFetch(fetch_with_timeout(fetch(url, {redirect: 'follow'})), timestamp, fetchedTimestamps, position);
  }

  _handleTimestampValidationFetch(promise, timestamp, fetchedTimestamps, position){
    return promise
      .then(response => {return checkResponse(response);})
      .then(response => {
        let url = response.url;
        fetchedTimestamps[position] = url.split('/')[4];
        if (timestamp !== fetchedTimestamps[position]) {
          this._redirectToValidatedTimestamps = true;
        }
      })
      .catch(error => {this.errorHandled(error.message);});
  }

  _setNewURL(fetchedTimestampA, fetchedTimestampB){
    this._redirectToValidatedTimestamps = false;
    if (fetchedTimestampA === undefined) {
      fetchedTimestampA = '';
    }
    if (fetchedTimestampB === undefined) {
      fetchedTimestampB = '';
    }
    window.history.pushState({}, '', this.props.conf.urlPrefix + fetchedTimestampA + '/' + fetchedTimestampB + '/' + this.props.url);
    this.setState({timestampA: fetchedTimestampA, timestampB: fetchedTimestampB});
    document.getElementById('timestamp-select-left').value = fetchedTimestampA;
    document.getElementById('timestamp-select-right').value = fetchedTimestampB;
  }

  _fetchCDXData () {
    if (this.props.fetchCDXCallback) {
      this._handleFetch(this.props.fetchCDXCallback());
    } else {
      let url = handleRelativeURL(this.props.conf.cdxServer);
      if (this.props.conf.limit){
        url += `search?url=${encodeURIComponent(this.props.url)}&status=200&limit=${this.props.conf.limit}&fl=timestamp,digest&output=json&sort=reverse`;
      } else {
        url += `search?url=${encodeURIComponent(this.props.url)}&status=200&fl=timestamp,digest&output=json&sort=reverse`;
      }
      this._handleFetch(fetch_with_timeout(fetch(url, { signal: this.ABORT_CONTROLLER.signal })));

    }
  }

  _handleFetch(promise){
    promise
      .then(function(response) {
        if (response) {
          if (!response.ok) {
            throw Error(response.status);
          }
          return response.json();
        }
      })
      .then((data) => {
        if (data && data.length > 0 ){
          this._prepareData(data);
          if (!this.props.isInitial) {
            this._selectValues();
          }
        } else {
          this.props.errorHandledCallback('404');
          this.setState({showError:true});

        }
      })
      .catch(error => {this._errorHandled(error.message);});
  }

  _errorHandled(error) {
    if (this._isMountedNow) {
      this.props.errorHandledCallback(error);
      this.setState({showError: true});
    }
  }
  _prepareData(data){
    data.shift();
    this.setState({
      cdxData: data,
      leftSnaps : data,
      rightSnaps : data,
      leftSnapElements : this._prepareOptionElements(data),
      rightSnapElements : this._prepareOptionElements(data),
      headerInfo: this._getHeaderInfo(data)
    });
  }

  _prepareOptionElements(data){
    var initialSnapshots = [];
    if (data.length > 0) {
      var yearGroup = this._getYear(data[0][0]);
      initialSnapshots.push(<optgroup key={-1} label={yearGroup}/>);
    }
    for (let i = 0; i < data.length; i++){
      let utcTime = this._getUTCDateFormat(data[i][0]);
      var year = this._getYear(data[i][0]);
      if (year < yearGroup) {
        yearGroup = year;
        initialSnapshots.push(<optgroup key={-i+2} label={yearGroup}/>);
      }
      initialSnapshots.push(<option key = {i} value = {data[i][0]}>{utcTime}</option>);
    }
    return initialSnapshots;
  }

  _getUTCDateFormat (date){
    let year = parseInt(date.substring(0,4), 10);
    let month = parseInt(date.substring(4,6), 10) - 1;
    let day = parseInt(date.substring(6,8), 10);
    let hour = parseInt(date.substring(8,10), 10);
    let minutes = parseInt(date.substring(10,12), 10);
    let seconds = parseInt(date.substring(12,14), 10);

    let niceTime = new Date(Date.UTC(year, month, day, hour, minutes, seconds));
    return (niceTime.toUTCString());
  }

  _getShortUTCDateFormat (date){
    let year = parseInt(date.substring(0,4), 10);
    let month = parseInt(date.substring(4,6), 10) - 1;
    let day = parseInt(date.substring(6,8), 10);
    var shortTime = new Date(Date.UTC(year, month, day));
    shortTime = shortTime.toUTCString();
    shortTime = shortTime.split(' ');
    let retTime = shortTime[0] + ' ' + shortTime[1] + ' ' + shortTime[2] + ' ' + shortTime[3];
    return (retTime);
  }

  _getYear (date) {
    return parseInt(date.substring(0,4), 10);
  }

  _restartPressed () {
    let initialData = this.state.cdxData;
    this.setState({
      leftSnaps : initialData,
      rightSnaps : initialData,
      leftSnapElements : this._prepareOptionElements(initialData),
      rightSnapElements : this._prepareOptionElements(initialData)
    });
  }

  _showTimestampSelector () {
    return (
      <div className="timestamp-container-view">
        <select className="form-control" id="timestamp-select-left" onChange={this._handleLeftTimestampChange}>
          {this.state.leftSnapElements}
        </select>
        <button className="btn btn-default navbar-btn" id="show-diff-btn" onClick={this._showDiffs}>Show differences</button>
        <button className="btn btn-default navbar-btn" id="restart-btn" onClick={this._restartPressed}>Restart</button>
        <select className="form-control" id="timestamp-select-right" onChange={this._handleRightTimestampChange}>
          {this.state.rightSnapElements}
        </select>
      </div>
    );
  }

  _showInfo(){
    return (
      <div>
        {this.state.headerInfo}
        <div id="timestamp-left">Please select a capture</div>
        <div id="timestamp-right">Please select a capture</div>
        <br/>
      </div>
    );
  }

  _showOpenLinks(){
    if(!this.props.isInitial) {
      if (this.props.timestampA) {
        var aLeft = (<a href={this.props.conf.snapshotsPrefix + this.state.timestampA + '/' + this.props.url}
          id="timestamp-left" target="_blank" rel="noopener"> Open in new window</a>);
      }
      if (this.props.timestampB) {
        var aRight = (<a href={this.props.conf.snapshotsPrefix + this.state.timestampB + '/' + this.props.url}
          id="timestamp-right" target="_blank" rel="noopener">
          Open in new window</a>);
      }
      let div = (
        <div>
          {aLeft}
          {aRight}
          <br/>
        </div>
      );
      return div;
    }
  }

  _notFound () {
    return (<div className="alert alert-warning" role="alert">The Wayback Machine doesn't have {this.props.url} archived.</div>);
  }

  _showDiffs () {

    let loaders = document.getElementsByClassName('waybackDiffIframeLoader');

    while(loaders.length > 0) {
      loaders[0].parentNode.removeChild(loaders[0]);
    }

    let timestampA = document.getElementById('timestamp-select-left').value;
    let timestampB = document.getElementById('timestamp-select-right').value;
    this.props.changeTimestampsCallback(timestampA, timestampB);
    this.setState({showDiff: true});
  }

  _selectValues () {
    if (!(!this.state.timestampA && !this.state.timestampB && !this.props.isInitial)){
      document.getElementById('timestamp-select-left').value = this.state.timestampA;
      document.getElementById('timestamp-select-right').value = this.state.timestampB;
    }

  }

  _getHeaderInfo (data) {
    if (data) {
      let first = this._getShortUTCDateFormat(data[0][0]);
      let last = this._getShortUTCDateFormat(data[data.length-1][0]);
      const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      };
      return (<p id='explanation-middle'> Compare any two captures of {this.props.url} from our collection of {numberWithCommas(data.length)} dating from {first} to {last}.</p>);
    }
  }
}
