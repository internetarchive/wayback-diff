import PropTypes from 'prop-types';
import React from 'react';
import '../css/diff-container.css';
import {
  fetchWithTimeout, twoDigits, getKeyByValue, selectHasValue,
  getUTCDateFormat, getShortUTCDateFormat
} from '../js/utils.js';
import Loading from './loading.jsx';
import isNil from 'lodash/isNil';

const monthNames = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
};

/**
 * Display a timestamp selector
 *
 * @class YmdTimestampHeader
 * @extends {React.Component}
 */
export default class YmdTimestampHeader extends React.Component {
  static propTypes = {
    loader: PropTypes.object,
    fetchSnapshotCallback: PropTypes.func,
    fetchCDXCallback: PropTypes.func,
    errorHandledCallback: PropTypes.func,
    getTimestampsCallback: PropTypes.func,
    timestampA: PropTypes.string,
    timestampB: PropTypes.string,
    conf: PropTypes.object,
    url: PropTypes.string,
    isInitial: PropTypes.bool
  };

  _leftMonthIndex = -1;

  _rightMonthIndex = -1;

  _leftTimestampIndex = -1;

  _rightTimestampIndex = -1;

  _visibilityState = ['visible', 'hidden'];

  constructor (props) {
    super(props);

    this._abortController = new window.AbortController();

    const leftYear = (this.props.timestampA === undefined) ? null : this.props.timestampA.substring(0, 4);
    const rightYear = (this.props.timestampB === undefined) ? null : this.props.timestampB.substring(0, 4);

    this.state = {
      timestampA: this.props.timestampA,
      timestampB: this.props.timestampB,
      leftYear: leftYear,
      rightYear: rightYear,
      showSteps: this.props.isInitial,
      showRestartBtn: false,
      showDiffBtn: false,
      timestampAttempt: 0,
      isMounted: false,
      shouldValidateTimestamp: true
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
    this.setState({ isMounted: true });
  }

  componentDidUpdate () {
    if (this.state.cdxData) {
      if (this.state.shouldValidateTimestamp) {
        this._checkTimestamps();
      }
      if (!this.state.sparkline && !this.state.showLoader) {
        this._fetchSparklineData();
      }
      if (!this.state.showLoader) {
        this._selectValues();
        if (this.state.sparkline && !this.state.leftMonthOptions && !this.state.rightMonthOptions) {
          if (this._leftMonthIndex !== -1 || this._rightMonthIndex !== -1) {
            this._showMonths();
          }
        }
      }
    }
  }

  componentWillUnmount () {
    this.setState({ isMounted: false });
    this._abortController.abort();
  }

  _handleRightTimestampChange () {
    this._rightTimestampIndex = document.getElementById('timestamp-select-right').selectedIndex;
    if (this._isShowing('timestamp-select-left')) {
      this.setState({
        showRestartBtn: true,
        showDiffBtn: true
      });
      const selectedDigest = this.state.rightSnaps[this._rightTimestampIndex - 1][1];
      let allowedSnapshots = this.state.leftSnaps;
      allowedSnapshots = allowedSnapshots.filter(hash => hash[1] !== selectedDigest);
      this.setState({
        leftSnapElements: this._prepareOptionElements(allowedSnapshots)
      });
    }
  }

  _handleLeftTimestampChange () {
    this._leftTimestampIndex = document.getElementById('timestamp-select-left').selectedIndex;
    if (this._isShowing('timestamp-select-right')) {
      this.setState({
        showRestartBtn: true,
        showDiffBtn: true
      });
      const selectedDigest = this.state.leftSnaps[this._leftTimestampIndex - 1][1];
      let allowedSnapshots = this.state.rightSnaps;
      allowedSnapshots = allowedSnapshots.filter(hash => hash[1] !== selectedDigest);
      this.setState({
        rightSnapElements: this._prepareOptionElements(allowedSnapshots)
      });
    }
  }

  render () {
    const Loader = () => isNil(this.props.loader) ? <Loading/> : this.props.loader;
    if (this.state.showLoader && !this.state.showError) {
      return <div className="loading"><Loader/></div>;
    }
    if (!this.state.showError && this.state.timestampAttempt < 2) {
      if (this.state.showSteps) {
        if (this.state.yearOptions) {
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
        this._areRequestedTimestampsSelected();
        return (
          <div className="timestamp-header-view">
            {this._showInfo()}
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

  _areRequestedTimestampsSelected () {
    if (this.state.finishedValidating) {
      const leftTimestamp = parseInt(this.state.timestampA);
      const rightTimestamp = parseInt(this.state.timestampB);
      let lastLeftFromCDX, lastRightFromCDX, newLeft, newRight;

      if (isNaN(leftTimestamp)) {
        newLeft = null;
      } else {
        lastLeftFromCDX = parseInt(this.state.leftSnaps[this.state.leftSnaps.length - 1][0]);
        if (leftTimestamp > lastLeftFromCDX) {
          newLeft = this._prepareOptionElements([[this.state.timestampA, 0]]);
        }
      }

      if (isNaN(rightTimestamp)) {
        newRight = null;
      } else {
        lastRightFromCDX = parseInt(this.state.rightSnaps[this.state.rightSnaps.length - 1][0]);
        if (rightTimestamp > lastRightFromCDX) {
          newRight = this._prepareOptionElements([[this.state.timestampB, 0]]);
        }
      }

      if (newLeft && newRight) {
        this.setState({
          leftSnapElements: [...this.state.leftSnapElements, newLeft],
          rightSnapElements: [...this.state.rightSnapElements, newRight],
          leftSnaps: [...this.state.leftSnaps, [this.state.timestampA, '0']],
          rightSnaps: [...this.state.rightSnaps, [this.state.timestampB, '1']],
          finishedValidating: false
        });
        this._leftTimestampIndex = this.state.leftSnapElements.length + 1;
        this._rightTimestampIndex = this.state.rightSnapElements.length + 1;
      } else if (newLeft) {
        this.setState({
          leftSnapElements: [...this.state.leftSnapElements, newLeft],
          leftSnaps: [...this.state.leftSnaps, [this.state.timestampA, '0']],
          finishedValidating: false
        });
        this._leftTimestampIndex = this.state.leftSnapElements.length + 1;
      } else if (newRight) {
        this.setState({
          rightSnapElements: [...this.state.rightSnapElements, newRight],
          rightSnaps: [...this.state.rightSnaps, [this.state.timestampB, '1']],
          finishedValidating: false
        });
        this._rightTimestampIndex = this.state.rightSnapElements.length + 1;
      }
    }
  }

  _checkTimestamps (side = null) {
    this.setState({ shouldValidateTimestamp: false });
    const fetchedTimestamps = { a: '', b: '' };
    if (this.state.timestampA && this.state.timestampB) {
      this._validateTimestamp(this.state.timestampA, fetchedTimestamps, 'a')
        .then(() => { return this._validateTimestamp(this.state.timestampB, fetchedTimestamps, 'b'); })
        .then(() => {
          if (this._redirectToValidatedTimestamps) {
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          } else {
            this.setState({ finishedValidating: true });
          }
        }).catch(error => { this._errorHandled(error.message); });
    } else if (this.state.timestampA) {
      this._validateTimestamp(this.state.timestampA, fetchedTimestamps, 'a')
        .then(() => {
          if (this._redirectToValidatedTimestamps) {
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          } else {
            this.setState({ finishedValidating: true });
          }
        }).catch(error => { this._errorHandled(error.message); });
    } else if (this.state.timestampB) {
      this._validateTimestamp(this.state.timestampB, fetchedTimestamps, 'b')
        .then(() => {
          if (this._redirectToValidatedTimestamps) {
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          } else {
            this.setState({ finishedValidating: true });
          }
        }).catch(error => { this._errorHandled(error.message); });
    } else {
      if (side === 'left') {
        this.setState({ leftSnapElements: null, leftSnaps: null });
      } else if (side === 'right') {
        this.setState({ rightSnapElements: null, rightSnaps: null });
      }
      this.setState({ finishedValidating: true, showLoader: false });
    }
  }

  _validateTimestamp (timestamp, fetchedTimestamps, position) {
    if (this.props.fetchSnapshotCallback) {
      return this._handleTimestampValidationFetch(this.props.fetchSnapshotCallback(timestamp), timestamp, fetchedTimestamps, position);
    }
    const url = new URL(this.props.conf.cdxServer, window.location.origin);
    url.searchParams.append('url', this.props.url);
    url.searchParams.append('closest', timestamp);
    url.searchParams.append('filter', '!mimetype:warc/revisit');
    url.searchParams.append('format', 'json');
    url.searchParams.append('sort', 'closest');
    url.searchParams.append('limit', '1');
    url.searchParams.append('fl', 'timestamp');
    return this._handleTimestampValidationFetch(fetchWithTimeout(url, { signal: this._abortController.signal }), timestamp, fetchedTimestamps, position);
  }

  _handleTimestampValidationFetch (promise, timestamp, fetchedTimestamps, position) {
    return this._handleFetch(promise)
      .then(data => {
        if (data) {
          fetchedTimestamps[position] = `${data}`;
          if (timestamp !== fetchedTimestamps[position]) {
            this._redirectToValidatedTimestamps = true;
          }
        } else {
          this._errorHandled('404');
        }
      })
      .catch(error => { this.errorHandled(error.message); });
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
    this.setState({
      timestampA: fetchedTimestampA,
      timestampB: fetchedTimestampB,
      finishedValidating: true,
      timestampAttempt: this.state.timestampAttempt + 1,
      showLoader: false
    });
    if (this.state.leftSnaps) {
      this._leftTimestampIndex = this.state.leftSnaps.indexOf(fetchedTimestampA);
    }
    if (this.state.rightSnaps) {
      this._rightTimestampIndex = this.state.rightSnaps.indexOf(fetchedTimestampB);
    }
  }

  /**
   * Fetch captures for a specific YYYYMM.
   */
  createCDXRequest (dt) {
    const url = new URL(this.props.conf.cdxServer, window.location.origin);
    url.searchParams.append('url', this.props.url);
    url.searchParams.append('fl', 'timestamp,digest');
    url.searchParams.append('output', 'json');
    url.searchParams.append('from', dt);
    url.searchParams.append('to', dt);
    url.searchParams.append('limit', this.props.conf.limit);
    return url;
  }

  _fetchCDXData () {
    this.setState({ showLoader: true });
    let leftFetchPromise;
    let rightFetchPromise;
    this._saveMonthsIndex();
    if (this.props.fetchCDXCallback) {
      leftFetchPromise = this._handleFetch(this.props.fetchCDXCallback());
    } else {
      if (this._leftMonthIndex !== -1 && !isNaN(this._leftMonthIndex)) {
        const url = this.createCDXRequest(
          this.state.leftYear + twoDigits(this._leftMonthIndex)
        );
        leftFetchPromise = this._handleFetch(fetchWithTimeout(url, { signal: this._abortController.signal }));
      }
      if (this._rightMonthIndex !== -1 && !isNaN(this._rightMonthIndex)) {
        const url = this.createCDXRequest(
          this.state.rightYear + twoDigits(this._rightMonthIndex)
        );
        rightFetchPromise = this._handleFetch(fetchWithTimeout(url, { signal: this._abortController.signal }));
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
              const leftData = data;
              rightFetchPromise
                .then((data) => {
                  if (data && data.length > 0) {
                    this._prepareCDXData(leftData, data);
                  } else {
                    this._checkTimestamps('right');
                  }
                });
            } else {
              this._prepareCDXData(data, null);
            }
          } else {
            this._checkTimestamps('left');
          }
        })
        .catch(error => { this._errorHandled(error.message); });
    } else if (rightFetchPromise) {
      rightFetchPromise
        .then((data) => {
          if (data && data.length > 0) {
            this._prepareCDXData(null, data);
          } else {
            this._checkTimestamps('right');
          }
        });
    }
  }

  _errorHandled (error) {
    if (this.state.isMounted) {
      this.props.errorHandledCallback(error);
      this.setState({ showError: true });
    }
  }

  _prepareCDXData (leftData, data) {
    if (data) {
      data.shift();
    }
    if (leftData) {
      leftData.shift();
    }
    this.props.getTimestampsCallback(this.state.timestampA, this.state.timestampB);
    this.setState({
      cdxData: true,
      leftSnaps: leftData,
      rightSnaps: data,
      leftSnapElements: this._prepareOptionElements(leftData),
      rightSnapElements: this._prepareOptionElements(data),
      showLoader: false
    });
  }

  _prepareOptionElements (data) {
    return (
      data &&
      data.map((item, index) => {
        return <option key={index} value={item[0]}>{getUTCDateFormat(item[0])}</option>;
      })
    );
  }

  _monthOptions (data) {
    const limit = parseInt(this.props.conf.limit);
    return (
      data &&
      data.slice(0).reverse().map((item, index) => {
        const count = Math.min(item[1], limit);
        return <option key={index} value={item[0]}>{`${item[0]} (${count})`}</option>;
      })
    );
  }

  _restartPressed () {
    this.setState({
      showRestartBtn: false,
      leftSnapElements: this._prepareOptionElements(this.state.leftSnaps),
      rightSnapElements: this._prepareOptionElements(this.state.rightSnaps)
    });
  }

  _showTimestampSelector () {
    return (
      <div className="wayback-ymd-timestamp">
        <div className="wayback-timestamps">
          <select className="form-control input-sm mr-sm-1" id="year-select-left"
            onChange={this._handleYearChange} title="Years and available captures"
            defaultValue="">
            <option value="" disabled>Year</option>
            {this.state.yearOptions}
          </select>
          <select className="form-control input-sm mr-sm-1" id="month-select-left"
            style={{ visibility: this._visibilityState[+(this._leftMonthIndex === -1)] }}
            onChange={this._getTimestamps} title="Months and available captures"
            defaultValue="">
            <option value="" disabled>Month</option>
            {this.state.leftMonthOptions}
          </select>
          <select className="form-control input-sm mr-sm-1" id="timestamp-select-left"
            style={{ visibility: this._visibilityState[+!this.state.leftSnapElements] }}
            onChange={this._handleLeftTimestampChange}
            defaultValue="">
            <option value="" disabled>Available captures</option>
            {this.state.leftSnapElements}
          </select>
        </div>
        <div className="wayback-ymd-buttons">
          {(this.state.showDiffBtn ? <button className="btn btn-default btn-sm" onClick={this._showDiffs}>Show differences</button> : null)}
          {(this.state.showRestartBtn ? <button className="btn btn-default btn-sm" onClick={this._restartPressed}>Restart</button> : null)}
        </div>
        <div className="wayback-timestamps">
          <select className="form-control input-sm mr-sm-1" id="timestamp-select-right"
            style={{ visibility: this._visibilityState[+!this.state.rightSnapElements] }}
            onChange={this._handleRightTimestampChange}
            defaultValue="">
            <option value="" disabled>Available captures</option>
            {this.state.rightSnapElements}
          </select>
          <select className="form-control input-sm mr-sm-1" id="month-select-right"
            style={{ visibility: this._visibilityState[+(this._rightMonthIndex === -1)] }}
            onChange={this._getTimestamps} title="Months and available captures"
            defaultValue="">
            <option value="" disabled>Month</option>
            {this.state.rightMonthOptions}
          </select>
          <select className="form-control input-sm mr-sm-1" id="year-select-right"
            onChange={this._handleYearChange} title="Years and available captures"
            defaultValue="">
            <option value="" disabled>Year</option>
            {this.state.yearOptions}
          </select>
        </div>
      </div>
    );
  }

  _showOpenLinks () {
    if (!this.state.showSteps || this.state.showDiff) {
      return (
        <div>
          {(this.state.timestampA
            ? <a href={this.props.conf.snapshotsPrefix + this.state.timestampA + '/' + this.props.url}
              id="timestamp-left" target="_blank" rel="noopener noreferrer"> Open in new window</a>
            : null)}
          {(this.state.timestampB
            ? <a href={this.props.conf.snapshotsPrefix + this.state.timestampB + '/' + this.props.url}
              id="timestamp-right" target="_blank" rel="noopener noreferrer">Open in new window</a>
            : null)}
          <br/>
        </div>
      );
    }
  }

  _showDiffs () {
    const timestampAelement = document.getElementById('timestamp-select-left');
    let timestampA = '';
    if (timestampAelement.style.visibility !== 'hidden') {
      timestampA = timestampAelement.value;
    }
    const timestampBelement = document.getElementById('timestamp-select-right');
    let timestampB = '';
    if (timestampBelement.style.visibility !== 'hidden') {
      timestampB = timestampBelement.value;
    }
    this.props.getTimestampsCallback(timestampA, timestampB);
    this.setState({
      showDiff: true,
      timestampA: timestampA,
      timestampB: timestampB
    });
  }

  _selectValues () {
    if (this._isShowing('timestamp-select-left')) {
      if (this._leftTimestampIndex !== -1) {
        document.getElementById('timestamp-select-left').selectedIndex = this._leftTimestampIndex;
      } else if (this.state.timestampA) {
        document.getElementById('timestamp-select-left').value = this.state.timestampA;
      }
    }
    if (this._isShowing('timestamp-select-right')) {
      if (this._rightTimestampIndex !== -1) {
        document.getElementById('timestamp-select-right').selectedIndex = this._rightTimestampIndex;
      } else if (this.state.timestampB) {
        document.getElementById('timestamp-select-right').value = this.state.timestampB;
      }
    }
    const monthLeft = document.getElementById('month-select-left');
    const monthRight = document.getElementById('month-select-right');

    if (selectHasValue(monthLeft.id, monthNames[this._leftMonthIndex])) {
      monthLeft.value = monthNames[this._leftMonthIndex];
    } else {
      monthLeft.selectedIndex = 0;
    }
    if (selectHasValue(monthRight.id, monthNames[this._rightMonthIndex])) {
      monthRight.value = monthNames[this._rightMonthIndex];
    } else {
      monthRight.selectedIndex = 0;
    }
    document.getElementById('year-select-left').value = this.state.leftYear;
    document.getElementById('year-select-right').value = this.state.rightYear;
  }

  _getHeaderInfo (firstTimestamp, lastTimestamp, count) {
    const first = getShortUTCDateFormat(firstTimestamp);
    const last = getShortUTCDateFormat(lastTimestamp);
    return (<p id='explanation-middle'> Compare any two captures of {this.props.url} from our collection
      of {count.toLocaleString()} dating from {first} to {last}.</p>);
  }

  _fetchSparklineData () {
    this.setState({ showLoader: true });
    const url = new URL(this.props.conf.sparklineURL, window.location.origin);
    url.searchParams.append('url', this.props.url);
    url.searchParams.append('collection', 'web');
    url.searchParams.append('output', 'json');
    const fetchPromise = this._handleFetch(fetchWithTimeout(url, { signal: this._abortController.signal }));
    this._exportSparklineData(fetchPromise);
  }

  _exportSparklineData (promise) {
    promise
      .then((data) => {
        if (data) {
          this._prepareSparklineData(data);
        } else {
          this._errorHandled('404');
        }
      })
      .catch(error => { this._errorHandled(error.message); });
  }

  _prepareSparklineData (data) {
    const snapshots = data.years;
    const yearSum = new Array(snapshots.length);
    let j = 0;
    let allSum = 0;
    for (const year in snapshots) {
      yearSum[j] = [year, 0];
      for (let i = 0; i < snapshots[year].length; i++) {
        yearSum[j][1] = yearSum[j][1] + snapshots[year][i];
        allSum = allSum + snapshots[year][i];
      }
      j++;
    }

    this.setState({
      showLoader: false,
      sparkline: snapshots,
      yearOptions: this._monthOptions(yearSum),
      headerInfo: this._getHeaderInfo(data.first_ts, data.last_ts, allSum)
    });
  }

  _showMonths () {
    const leftYear = document.getElementById('year-select-left').value;
    const rightYear = document.getElementById('year-select-right').value;

    const leftMonths = this.state.sparkline[leftYear];
    const rightMonths = this.state.sparkline[rightYear];

    const leftMonthsData = this._getMonthData(leftMonths);
    const rightMonthsData = this._getMonthData(rightMonths);

    this.setState({
      leftYear: leftYear,
      rightYear: rightYear,
      leftMonthOptions: this._monthOptions(leftMonthsData),
      rightMonthOptions: this._monthOptions(rightMonthsData)
    });
  }

  _getMonthData (data) {
    return (
      data &&
      data.filter(item => item > 0).map((item, index) => {
        return [monthNames[index + 1], item];
      })
    );
  }

  _getTimestamps (e) {
    this._fetchCDXData();
    let elemToShow;
    if (e.target.id === 'month-select-left') {
      elemToShow = 'timestamp-select-left';
      this._leftTimestampIndex = 0;
    } else {
      elemToShow = 'timestamp-select-right';
      this._rightTimestampIndex = 0;
    }
    document.getElementById(elemToShow).selectedIndex = '0';
    this._showElement(elemToShow);
    this.setState({
      showDiffBtn: true,
      timestampA: null,
      timestampB: null
    });
  }

  // TODO must drop getElementById usage, its not proper for ReactJS.
  _showElement (elementID) {
    const element = document.getElementById(elementID);
    if (element.style.visibility === 'hidden') {
      element.style.visibility = 'visible';
    } else if (element.style.display === 'none') {
      element.style.display = 'block';
    }
  }

  _isShowing (elementID) {
    const element = document.getElementById(elementID);
    return (element && element.style.visibility === 'visible');
  }

  _hideElement (elementID) {
    const element = document.getElementById(elementID);
    if (element.style.visibility !== 'hidden') {
      element.style.visibility = 'hidden';
    }
  }

  _hideAndCollapseElement (elementID) {
    const element = document.getElementById(elementID);
    if (element.style.display !== 'none') {
      element.style.display = 'none';
    }
  }

  _showInfo () {
    return (
      <div>
        {this.state.headerInfo}
        <div id="timestamp-left">Please select a capture</div>
        <div id="timestamp-right">Please select a capture</div>
        <br/>
      </div>
    );
  }

  _handleYearChange (e) {
    if (e.target.id === 'year-select-left') {
      this._hideElement('timestamp-select-left');
      this._leftMonthIndex = 0;
    } else {
      this._hideElement('timestamp-select-right');
      this._rightMonthIndex = 0;
    }
    this.setState({
      showDiffBtn: false
    });
    if (e.target.id === 'year-select-left') {
      this._showElement('month-select-left');
    } else {
      this._showElement('month-select-right');
    }
    this._showMonths();
  }

  _saveMonthsIndex () {
    if (this._isShowing('month-select-left')) {
      const monthLeft = document.getElementById('month-select-left').value;
      this._leftMonthIndex = parseInt(getKeyByValue(monthNames, monthLeft));
    } else if (this.state.timestampA) {
      this._leftMonthIndex = parseInt(this.state.timestampA.substring(4, 6));
    }
    if (this._isShowing('month-select-right')) {
      const monthRight = document.getElementById('month-select-right').value;
      this._rightMonthIndex = parseInt(getKeyByValue(monthNames, monthRight));
    } else if (this.state.timestampB) {
      this._rightMonthIndex = parseInt(this.state.timestampB.substring(4, 6));
    }
  }
}
