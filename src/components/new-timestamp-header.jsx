import React from 'react';
import '../css/diff-container.css';
import { handleRelativeURL, fetch_with_timeout, checkResponse, getTwoDigitInt, getKeyByValue, selectHasValue } from '../js/utils.js';
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
  _monthNames = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May',
    6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
  };
  _leftMonthIndex = -1;
  _rightMonthIndex = -1;
  _visibilityState = ['visible', 'hidden'];

  constructor (props) {
    super(props);

    let leftYear = (this.props.timestampA === undefined) ? null : this.props.timestampA.substring(0, 4);
    let rightYear = (this.props.timestampB === undefined) ? null : this.props.timestampB.substring(0, 4);

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

    this._handleYearChange = this._handleYearChange.bind(this);

  }

  componentDidMount () {
    this._isMountedNow = true;
  }

  componentDidUpdate () {
    if (this.state.cdxData) {
      if (!this.state.sparkline) {
        this._fetchSparklineData();
      }
      this._selectValues();
    }
    if (this.state.leftMonthOptions || this.state.rightMonthOptions){
      this._selectValues();
    } else if (this.state.yearOptions) {
      this._showMonths();
    }
  }

  componentWillUnmount () {
    this._isMountedNow = false;
    this.ABORT_CONTROLLER.abort();
  }

  _handleRightTimestampChange () {
    this._showElement('restart-btn');
    const selectedDigest = this.state.rightSnaps[document.getElementById('timestamp-select-right').selectedIndex][1];
    let allowedSnapshots = this.state.leftSnaps;
    allowedSnapshots = allowedSnapshots.filter(hash => hash[1] !== selectedDigest);
    this.setState({
      leftSnapElements: this._prepareOptionElements(allowedSnapshots)
    });
  }

  _handleLeftTimestampChange () {
    this._showElement('restart-btn');
    const selectedDigest = this.state.leftSnaps[document.getElementById('timestamp-select-left').selectedIndex][1];
    let allowedSnapshots = this.state.rightSnaps;
    allowedSnapshots = allowedSnapshots.filter(hash => hash[1] !== selectedDigest);
    this.setState({
      rightSnapElements: this._prepareOptionElements(allowedSnapshots)
    });
  }

  render () {
    const Loader = () => this.props.loader;

    if (!this.state.showError) {
      if (this.state.showSteps) {
        if (this.state.cdxData) {
          if (this._shouldValidateTimestamp) {
            this._checkTimestamps();
          }
          return (
            <div className="timestamp-header-view">
              {this._showTimestampSelector()}
              {this._showOpenLinks()}
            </div>
          );
        } else if ((this.state.leftMonthOptions && this.state.rightMonthOptions) || this.state.yearOptions) {
          if (this._shouldValidateTimestamp) {
            this._checkTimestamps();
          }
          return (
            <div className="timestamp-header-view">
              {this._showTimestampSelector()}
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
            {this._showTimestampSelector()}
            {this._showOpenLinks()}
          </div>
        );
      }
      this._fetchCDXData();
      return (
        <Loader/>
      );
    }
  }

  _checkTimestamps () {
    this._shouldValidateTimestamp = false;
    var fetchedTimestamps = {a: '', b: ''};
    if (this.state.timestampA && this.state.timestampB) {
      this._validateTimestamp(this.state.timestampA, fetchedTimestamps, 'a')
        .then(() => {return this._validateTimestamp(this.state.timestampB, fetchedTimestamps, 'b');})
        .then(() => {
          if (this._redirectToValidatedTimestamps) {
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(error => {this._errorHandled(error.message);});
    } else if (this.state.timestampA) {
      this._validateTimestamp(this.state.timestampA, fetchedTimestamps, 'a')
        .then(() => {
          if (this._redirectToValidatedTimestamps) {
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(error => {this._errorHandled(error.message);});
    } else if (this.state.timestampB) {
      this._validateTimestamp(this.state.timestampB, fetchedTimestamps, 'b')
        .then(() => {
          if (this._redirectToValidatedTimestamps) {
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(error => {this._errorHandled(error.message);});
    }
  }

  _validateTimestamp (timestamp, fetchedTimestamps, position) {
    if (this.props.fetchSnapshotCallback) {
      return this._handleTimestampValidationFetch(this.props.fetchSnapshotCallback(timestamp), timestamp, fetchedTimestamps, position);
    }
    const url = handleRelativeURL(this.props.conf.snapshotsPrefix) + timestamp + '/' + encodeURIComponent(this.props.url);
    return this._handleTimestampValidationFetch(fetch_with_timeout(fetch(url, {redirect: 'follow'})), timestamp, fetchedTimestamps, position);
  }

  _handleTimestampValidationFetch (promise, timestamp, fetchedTimestamps, position) {
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

  _setNewURL (fetchedTimestampA, fetchedTimestampB) {
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
    let leftFetchPromise;
    let rightFetchPromise;
    this._saveMonthsIndex();
    if (this.props.fetchCDXCallback) {
      leftFetchPromise = this._handleFetch(this.props.fetchCDXCallback());
    } else {
      let url;
      if (this._leftMonthIndex !== -1 && !isNaN(this._leftMonthIndex)) {
        url = `${handleRelativeURL(this.props.conf.cdxServer)}search?&url=${encodeURIComponent(this.props.url)}&status=200&fl=timestamp,digest&output=json&from=${this.state.leftYear}${getTwoDigitInt(this._leftMonthIndex)}&to=${this.state.leftYear}${getTwoDigitInt(this._leftMonthIndex)}&limit=${this.props.conf.limit}`;
        leftFetchPromise = this._handleFetch(fetch_with_timeout(fetch(url, {signal: this.ABORT_CONTROLLER.signal})));
      }
      if (this._rightMonthIndex !== -1 && !isNaN(this._rightMonthIndex)) {
        url = `${handleRelativeURL(this.props.conf.cdxServer)}search?&url=${encodeURIComponent(this.props.url)}&status=200&fl=timestamp,digest&output=json&from=${this.state.rightYear}${getTwoDigitInt(this._rightMonthIndex)}&to=${this.state.rightYear}${getTwoDigitInt(this._rightMonthIndex)}&limit=${this.props.conf.limit}`;
        rightFetchPromise = this._handleFetch(fetch_with_timeout(fetch(url, {signal: this.ABORT_CONTROLLER.signal})));
      }
    }
    this._exportCDXData(leftFetchPromise, rightFetchPromise);
  }

  _handleFetch (promise) {
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

  _exportCDXData (leftFetchPromise, rightFetchPromise) {
    if (leftFetchPromise) {
      leftFetchPromise
        .then((data) => {
          if (data && data.length > 0) {
            if (rightFetchPromise) {
              let leftData = data;
              rightFetchPromise
                .then((data) => {
                  if (data && data.length > 0) {
                    this._prepareCDXData(leftData, data);
                  } else {
                    this.props.errorHandledCallback('404');
                    this.setState({showError: true});
                  }
                });
            } else {
              this._prepareCDXData(data, null);
            }
          } else {
            this.props.errorHandledCallback('404');
            this.setState({showError: true});
          }
        })
        .catch(error => {this._errorHandled(error.message);});
    } else if (rightFetchPromise) {
      rightFetchPromise
        .then((data) => {
          if (data && data.length > 0) {
            this._prepareCDXData(null, data);
          } else {
            this.props.errorHandledCallback('404');
            this.setState({showError: true});
          }
        });
    }

  }

  _errorHandled (error) {
    if (this._isMountedNow) {
      this.props.errorHandledCallback(error);
      this.setState({showError: true});
    }
  }

  _prepareCDXData (leftData, data) {
    if (data) {
      data.shift();
    }
    if (leftData) {
      leftData.shift();
    }
    this.setState({
      cdxData: true,
      leftSnaps: leftData,
      rightSnaps: data,
      leftSnapElements: this._prepareOptionElements(leftData),
      rightSnapElements: this._prepareOptionElements(data)
    });
  }

  _prepareOptionElements (data) {
    if (data) {
      let initialSnapshots = [];
      for (let i = 0; i < data.length; i++) {
        let utcTime = this._getUTCDateFormat(data[i][0]);
        initialSnapshots.push(<option key={i} value={data[i][0]}>{utcTime}</option>);
      }
      return initialSnapshots;
    }
  }

  _prepareSparklineOptionElements (data) {
    if (data) {
      let options = [];
      for (let i = data.length-1; i > 0; i--) {
        let count = data[i][1];
        if (count > parseInt(this.props.conf.limit)) {
          count = this.props.conf.limit;
        }
        options.push(<option key={i} value={data[i][0]}>{`${data[i][0]} (${count})`}</option>);
      }
      return options;
    }
  }

  _getUTCDateFormat (date) {
    let year = parseInt(date.substring(0, 4), 10);
    let month = parseInt(date.substring(4, 6), 10) - 1;
    let day = parseInt(date.substring(6, 8), 10);
    let hour = parseInt(date.substring(8, 10), 10);
    let minutes = parseInt(date.substring(10, 12), 10);
    let seconds = parseInt(date.substring(12, 14), 10);

    let niceTime = new Date(Date.UTC(year, month, day, hour, minutes, seconds));
    return (niceTime.toUTCString());
  }

  _getShortUTCDateFormat (date) {
    let year = parseInt(date.substring(0, 4), 10);
    let month = parseInt(date.substring(4, 6), 10) - 1;
    let day = parseInt(date.substring(6, 8), 10);
    var shortTime = new Date(Date.UTC(year, month, day));
    shortTime = shortTime.toUTCString();
    shortTime = shortTime.split(' ');
    let retTime = shortTime[0] + ' ' + shortTime[1] + ' ' + shortTime[2] + ' ' + shortTime[3];
    return (retTime);
  }

  _getYear (date) {
    return parseInt(date.substring(0, 4), 10);
  }

  _restartPressed () {
    this._hideElement('restart-btn');
    this.setState({
      leftSnapElements: this._prepareOptionElements(this.state.leftSnaps),
      rightSnapElements: this._prepareOptionElements(this.state.rightSnaps)
    });
  }

  _showTimestampSelector () {
    return (
      <div className="timestamp-container-view">
        <select className="form-control" id="year-select-left" onChange={this._handleYearChange}>
          <optgroup label="Years and available captures"/>
          {this.state.yearOptions}
        </select>
        <select className="form-control" id="month-select-left" style={{visibility: this._visibilityState[+(this.props.timestampA == null)]}} onChange={this._getTimestamps}>
          <optgroup label="Months and available captures"/>
          {this.state.leftMonthOptions}
        </select>
        <select className="form-control" id="timestamp-select-left" style={{visibility: this._visibilityState[+(this.props.timestampA == null)]}} onChange={this._handleLeftTimestampChange}>
          <optgroup label="Available captures"/>
          {this.state.leftSnapElements}
        </select>
        <button className="btn btn-default navbar-btn" id="show-diff-btn" style={{visibility:'hidden'}} onClick={this._showDiffs}>Show differences
        </button>
        <button className="btn btn-default navbar-btn" id="restart-btn" style={{visibility:'hidden'}} onClick={this._restartPressed}>Restart</button>
        <select className="form-control" id="timestamp-select-right" style={{visibility: this._visibilityState[+(this.props.timestampB == null)]}} onChange={this._handleRightTimestampChange}>
          <optgroup label="Available captures"/>
          {this.state.rightSnapElements}
        </select>
        <select className="form-control" id="month-select-right" style={{visibility: this._visibilityState[+(this.props.timestampB == null)]}} onChange={this._getTimestamps}>
          <optgroup label="Months and available captures"/>
          {this.state.rightMonthOptions}
        </select>
        <select className="form-control" id="year-select-right" onChange={this._handleYearChange}>
          <optgroup label="Years and available captures"/>
          {this.state.yearOptions}
        </select>
      </div>
    );
  }

  _showOpenLinks () {
    if (!this.state.showSteps) {
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

  _showDiffs () {

    let loaders = document.getElementsByClassName('waybackDiffIframeLoader');

    while (loaders.length > 0) {
      loaders[0].parentNode.removeChild(loaders[0]);
    }

    let timestampAelement = document.getElementById('timestamp-select-left');
    let timestampA = '';
    if (timestampAelement.style.visibility !== 'hidden') {
      timestampA = timestampAelement.value;
    }
    let timestampBelement = document.getElementById('timestamp-select-right');
    let timestampB = '';
    if (timestampBelement.style.visibility !== 'hidden') {
      timestampB = timestampBelement.value;
    }
    this.props.changeTimestampsCallback(timestampA, timestampB);
    this.setState({showDiff: true});
  }

  _selectValues () {
    if (this.state.timestampA) {
      document.getElementById('timestamp-select-left').value = this.state.timestampA;
    }
    if (this.state.timestampB) {
      document.getElementById('timestamp-select-right').value = this.state.timestampB;
    }
    let monthLeft = document.getElementById('month-select-left');
    let monthRight = document.getElementById('month-select-right');

    if (selectHasValue(monthLeft.id, this._monthNames[this._leftMonthIndex])) {
      monthLeft.value = this._monthNames[this._leftMonthIndex];
    } else {
      monthLeft.selectedIndex = 0;
    }
    if (selectHasValue(monthRight.id, this._monthNames[this._rightMonthIndex])) {
      monthRight.value = this._monthNames[this._rightMonthIndex];
    } else {
      monthRight.selectedIndex = 0;
    }

    document.getElementById('year-select-left').value = this.state.leftYear;
    document.getElementById('year-select-right').value = this.state.rightYear;

  }

  _getHeaderInfo (firstTimestamp, lastTimestamp, count) {
    let first = this._getShortUTCDateFormat(firstTimestamp);
    let last = this._getShortUTCDateFormat(lastTimestamp);
    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    return (<p id='explanation-middle'> Compare any two captures of {this.props.url} from our collection
      of {numberWithCommas(count)} dating from {first} to {last}.</p>);
  }

  _fetchSparklineData () {
    let url = handleRelativeURL(this.props.conf.sparklineURL);
    url += `?url=${encodeURIComponent(this.props.url)}&collection=web&output=json`;
    let fetchPromise = this._handleFetch(fetch_with_timeout(fetch(url, {signal: this.ABORT_CONTROLLER.signal})));
    this._exportSparklineData(fetchPromise);
  }

  _exportSparklineData (promise) {
    promise
      .then((data) => {
        if (data) {
          this._prepareSparklineData(data);
        } else {
          this.props.errorHandledCallback('404');
          this.setState({showError: true});
        }
      })
      .catch(error => {this._errorHandled(error.message);});
  }

  _prepareSparklineData (data) {

    const snapshots = data['years'];
    let yearSum = new Array(snapshots.length);
    let j = 0;
    for (let year in snapshots) {
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
    let leftYear = document.getElementById('year-select-left').value;
    let rightYear = document.getElementById('year-select-right').value;

    let leftMonths = this.state.sparkline[leftYear];
    let rightMonths = this.state.sparkline[rightYear];

    let leftMonthsData = this._getMonthData(leftMonths);
    let rightMonthsData = this._getMonthData(rightMonths);

    this.setState({
      leftYear: leftYear,
      rightYear: rightYear,
      leftMonthOptions: this._prepareSparklineOptionElements(leftMonthsData),
      rightMonthOptions: this._prepareSparklineOptionElements(rightMonthsData)
    });
  }

  _getMonthData (data) {
    if (data) {
      let monthData = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i] > 0) {
          monthData.push([this._monthNames[i + 1], data[i]]);
        }
      }
      return monthData;
    }
  }

  _getTimestamps (e) {
    this._fetchCDXData();
    let elemToShow;
    if (e.target.id === 'month-select-left'){
      elemToShow = 'timestamp-select-left';
    } else {
      elemToShow = 'timestamp-select-right';
    }
    document.getElementById(elemToShow).selectedIndex = '0';
    this._showElement(elemToShow);
    this._showElement('show-diff-btn');
    this.setState({
      timestampA: null,
      timestampB: null
    });
  }


  _showElement (elementID) {
    let restartButton = document.getElementById(elementID);
    if (restartButton.style.visibility === 'hidden') {
      restartButton.style.visibility = 'visible';
    }
  }

  _hideElement (elementID) {
    let restartButton = document.getElementById(elementID);
    if (restartButton.style.visibility !== 'hidden') {
      restartButton.style.visibility = 'hidden';
    }
  }

  _handleYearChange (e) {
    let elemToHide;
    if (e.target.id === 'year-select-left'){
      elemToHide = 'timestamp-select-left';
      this._leftMonthIndex = 0;
    } else {
      elemToHide = 'timestamp-select-right';
      this._rightMonthIndex = 0;
    }
    this._hideElement(elemToHide);
    this._hideElement('show-diff-btn');
    let elemToShow;
    if (e.target.id === 'year-select-left'){
      elemToShow = 'month-select-left';
    } else {
      elemToShow = 'month-select-right';
    }
    this._showElement(elemToShow);
    this._showMonths();
  }

  _saveMonthsIndex () {
    if (document.getElementById('month-select-left')) {
      const monthLeft = document.getElementById('month-select-left').value;
      const monthRight = document.getElementById('month-select-right').value;
      this._leftMonthIndex = parseInt(getKeyByValue(this._monthNames, monthLeft));
      this._rightMonthIndex = parseInt(getKeyByValue(this._monthNames, monthRight));
    } else {
      if (this.props.timestampA) {
        this._leftMonthIndex = parseInt(this.props.timestampA.substring(4, 6));
      }
      if (this.props.timestampB) {
        this._rightMonthIndex = parseInt(this.props.timestampB.substring(4, 6));
      }
    }
  }
}
