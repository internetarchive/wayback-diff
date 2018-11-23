import React from 'react';
import '../css/diff-container.css';
import {handleRelativeURL, fetch_with_timeout, checkResponse, getTwoDigitInt} from '../js/utils.js';
/**
 * Display a timestamp selector
 *
 * @class NewTimestampHeader
 * @extends {React.Component}
 */
export default class NewTimestampHeader extends React.Component {

  ABORT_CONTROLLER = new window.AbortController();
  _isMountedNow = false;
  _shouldValidateTimestamp = true;
  _monthNames = ['January','February','March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  constructor(props) {
    super(props);

    let leftYear = (this.props.timestampA === undefined) ? null : this.props.timestampA.substring(0,4);
    let rightYear = (this.props.timestampB === undefined) ? null : this.props.timestampB.substring(0,4);

    this.state = {
      cdxData: false,
      showDiff: false,
      showError: false,
      timestampA: this.props.timestampA,
      timestampB: this.props.timestampB,
      leftYear: leftYear,
      rightYear: rightYear,
      showSteps: this.props.isInitial
    };

    this._handleLeftTimestampChange = this._handleLeftTimestampChange.bind(this);

    this._handleRightTimestampChange = this._handleRightTimestampChange.bind(this);

    this._restartPressed = this._restartPressed.bind(this);

    this._showDiffs = this._showDiffs.bind(this);

    this._errorHandled = this._errorHandled.bind(this);

    this._showMonths = this._showMonths.bind(this);

    this._getTimestamps = this._getTimestamps.bind(this);

    this._goToYear = this._goToYear.bind(this);

    this._goToMonth = this._goToMonth.bind(this);

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
      if (this.state.showSteps) {
        if (this.state.yearOptions) {
          if (this._shouldValidateTimestamp) {
            this._checkTimestamps();
          }
          return (
            <div className="timestamp-header-view">
              {this._showYearInfo()}
              {this._showYearSelector()}
            </div>
          );
        }
        if (this.state.leftMonthOptions && this.state.rightMonthOptions) {
          if (this._shouldValidateTimestamp) {
            this._checkTimestamps();
          }
          return (
            <div className="timestamp-header-view">
              {this._showMonthInfo()}
              {this._showMonthSelector()}
            </div>
          );
        }
        else if (this.state.cdxData) {
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
        this._fetchSparklineData();
        return (
          <Loader/>
        );
      }
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
      let leftMonth = (this.props.timestampA === undefined) ? null : this.props.timestampA.substring(4,6);
      let rightMonth = (this.props.timestampB === undefined) ? null : this.props.timestampB.substring(4,6);
      this._fetchCDXData(leftMonth,rightMonth);
      return (
        <Loader/>
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

  _fetchCDXData (monthLeft, monthRight) {
    let leftFetchPromise;
    let rightFetchPromise;
    if (this.props.fetchCDXCallback) {
      leftFetchPromise = this._handleFetch(this.props.fetchCDXCallback());
    } else {
      let url;
      if (monthLeft) {
        url = `${handleRelativeURL(this.props.conf.cdxServer)}search?
      &url=${encodeURIComponent(this.props.url)}&status=200
      &fl=timestamp,digest&output=json&sort=reverse
      &from=${this.state.leftYear}${getTwoDigitInt(monthLeft)}&to=${this.state.leftYear}${getTwoDigitInt(monthLeft)}`;
        leftFetchPromise = this._handleFetch(fetch_with_timeout(fetch(url, {signal: this.ABORT_CONTROLLER.signal})));
      }
      if (monthRight) {
        url = `${handleRelativeURL(this.props.conf.cdxServer)}search?
        &url=${encodeURIComponent(this.props.url)}&status=200
        &fl=timestamp,digest&output=json&sort=reverse
        &from=${this.state.rightYear}${getTwoDigitInt(monthRight)}&to=${this.state.rightYear}${getTwoDigitInt(monthRight)}`;
        rightFetchPromise = this._handleFetch(fetch_with_timeout(fetch(url, {signal: this.ABORT_CONTROLLER.signal})));
      }
    }
    this._exportCDXData(leftFetchPromise, rightFetchPromise);
  }

  _handleFetch(promise) {
    return promise
      .then(function (response) {
        if (response) {
          if (!response.ok) {
            throw Error(response.status);
          }
          return response.json();
        }
      });
  }

  _exportCDXData(leftFetchPromise, rightFetchPromise){
    if (leftFetchPromise) {
      leftFetchPromise
        .then((data) => {
          if (data && data.length > 0 ) {
            if (rightFetchPromise) {
              let leftData = data;
              rightFetchPromise
                .then((data) => {
                  if (data && data.length > 0) {
                    this._prepareCDXData(leftData, data);
                    if (!this.state.showSteps) {
                      this._selectValues();
                    }
                  }
                  else {
                    this.props.errorHandledCallback('404');
                    this.setState({showError: true});
                  }
                });
            } else {
              this._prepareCDXData(data, null);
              if (!this.state.showSteps) {
                this._selectValues();
              }
            }
          } else {
            this.props.errorHandledCallback('404');
            this.setState({showError:true});
          }
        })
        .catch(error => {this._errorHandled(error.message);});
    } else if (rightFetchPromise) {
      rightFetchPromise
        .then((data) => {
          if (data && data.length > 0) {
            this._prepareCDXData(null, data);
            if (!this.state.showSteps) {
              this._selectValues();
            }
          }
          else {
            this.props.errorHandledCallback('404');
            this.setState({showError: true});
          }
        });
    }

  }

  _errorHandled(error) {
    if (this._isMountedNow) {
      this.props.errorHandledCallback(error);
      this.setState({showError: true});
    }
  }
  _prepareCDXData(leftData, data){
    if (data) {
      data.shift();
    }
    if (leftData) {
      leftData.shift();
    }
    this.setState({
      leftMonthOptions: null,
      rightMonthOptions: null,
      yearOptions: null,
      cdxData: true,
      leftSnaps : leftData,
      rightSnaps : data,
      leftSnapElements : this._prepareOptionElements(leftData),
      rightSnapElements : this._prepareOptionElements(data)
    });
  }

  _prepareOptionElements(data) {
    if (data) {
      let initialSnapshots = [];
      for (let i = 0; i < data.length; i++) {
        let utcTime = this._getUTCDateFormat(data[i][0]);
        initialSnapshots.push(<option key={i} value={data[i][0]}>{utcTime}</option>);
      }
      return initialSnapshots;
    }
  }

  _prepareSparklineOptionElements(data){
    let options = [];
    for (let i = 0; i < data.length; i++){
      options.push(<option key = {i} value = {data[i][0]}>{`${data[i][0]} (${data[i][1]})`}</option>);
    }
    return options;
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
        <button className="btn btn-default navbar-btn" id="show-diff-btn" onClick={this._goToMonth}>Back</button>
        <button className="btn btn-default navbar-btn" id="restart-btn" onClick={this._restartPressed}>Restart</button>
        <select className="form-control" id="timestamp-select-right" onChange={this._handleRightTimestampChange}>
          {this.state.rightSnapElements}
        </select>
      </div>
    );
  }

  _showYearSelector () {
    return (
      <div className="timestamp-container-view">
        <select className="form-control" id="timestamp-select-left">
          {this.state.yearOptions}
        </select>
        <button className="btn btn-default navbar-btn" id="show-diff-btn" onClick={this._showMonths}>Select month</button>
        <select className="form-control" id="timestamp-select-right">
          {this.state.yearOptions}
        </select>
      </div>
    );
  }
  _showMonthSelector () {
    return (
      <div className="timestamp-container-view">
        <select className="form-control" id="timestamp-select-left">
          {this.state.leftMonthOptions}
        </select>
        <button className="btn btn-default navbar-btn" id="show-diff-btn" onClick={this._getTimestamps}>Select timestamp</button>
        <button className="btn btn-default navbar-btn" id="back-diff-btn" onClick={this._goToYear}>Back</button>
        <select className="form-control" id="timestamp-select-right">
          {this.state.rightMonthOptions}
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

  _showYearInfo(){
    return (
      <div>
        {this.state.headerInfo}
        <div id="timestamp-left">Please select year:</div>
        <div id="timestamp-right">Please select year:</div>
        <br/>
      </div>
    );
  }

  _showMonthInfo(){
    return (
      <div>
        {this.state.headerInfo}
        <div id="timestamp-left">You selected {this.state.leftYear}. Please select month:</div>
        <div id="timestamp-right">You selected {this.state.rightYear}. Please select month:</div>
        <br/>
      </div>
    );
  }

  _showOpenLinks(){
    if(!this.state.showSteps) {
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
    if (!(!this.state.timestampA && !this.state.timestampB && !this.state.showSteps)){
      document.getElementById('timestamp-select-left').value = this.state.timestampA;
      document.getElementById('timestamp-select-right').value = this.state.timestampB;
    }

  }

  _getHeaderInfo (firstTimestamp, lastTimestamp, count) {
    let first = this._getShortUTCDateFormat(firstTimestamp);
    let last = this._getShortUTCDateFormat(lastTimestamp);
    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    return (<p id='explanation-middle'> Compare any two captures of {this.props.url} from our collection of {numberWithCommas(count)} dating from {first} to {last}.</p>);
  }

  _fetchSparklineData () {
    let url = handleRelativeURL(this.props.conf.sparklineURL);
    url += `?url=${encodeURIComponent(this.props.url)}&collection=web&output=json`;
    let fetchPromise = this._handleFetch(fetch_with_timeout(fetch(url, { signal: this.ABORT_CONTROLLER.signal })));
    this._exportSparklineData(fetchPromise);
  }

  _exportSparklineData (promise) {
    promise
      .then((data) => {
        if (data){
          this._prepareSparklineData(data);
        } else {
          this.props.errorHandledCallback('404');
          this.setState({showError:true});
        }
      })
      .catch(error => {this._errorHandled(error.message);});
  }

  _prepareSparklineData (data) {

    const snapshots = data['years'];
    let yearSum = new Array(snapshots.length);
    let j = 0;

    for (var year in snapshots) {
      yearSum[j] = [year, 0];
      for (let i = 0; i < snapshots[year].length; i++) {
        yearSum[j][1] = yearSum[j][1] + snapshots[year][i];
      }
      j++;
    }

    this.setState({
      sparkline: snapshots,
      yearOptions: this._prepareSparklineOptionElements(yearSum)
    });
  }

  _showMonths () {
    let leftYear = document.getElementById('timestamp-select-left').value;
    let rightYear = document.getElementById('timestamp-select-right').value;

    let leftMonths = this.state.sparkline[leftYear];
    let rightMonths = this.state.sparkline[rightYear];

    let leftMonthsData = new Array(leftMonths.length);
    let rightMonthsData = new Array(rightMonths.length);

    for (let month = 0; month < leftMonths.length; month ++) {
      leftMonthsData[month] = [this._monthNames[month], leftMonths[month]];
    }

    for (let month = 0; month < rightMonths.length; month ++) {
      rightMonthsData[month] = [this._monthNames[month], rightMonths[month]];
    }

    this.setState({
      yearOptions: null,
      leftYear: leftYear,
      rightYear: rightYear,
      leftMonthOptions: this._prepareSparklineOptionElements(leftMonthsData),
      rightMonthOptions: this._prepareSparklineOptionElements(rightMonthsData)
    });
  }

  _getTimestamps () {
    let monthLeft = document.getElementById('timestamp-select-left').selectedIndex + 1;
    let monthRight = document.getElementById('timestamp-select-right').selectedIndex + 1;
    this._fetchCDXData(monthLeft, monthRight);
  }

  _goToYear () {
    this.setState({
      leftMonthOptions: null,
      rightMonthOptions: null
    });
  }

  _goToMonth () {
    this.setState({
      cdxData: null,
      showSteps: true
    });
  }
}
