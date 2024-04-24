import PropTypes from 'prop-types';
import React from 'react';
import '../css/diff-container.css';
import {
  fetchWithTimeout, twoDigits, getKeyByValue, selectHasValue,
  getUTCDateFormat, getShortUTCDateFormat, checkResponse
} from '../js/utils.js';
import Loading from './loading.jsx';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';

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
    url: PropTypes.string
  };

  _leftMonthIndex = -1;
  _rightMonthIndex = -1;

  constructor (props) {
    super(props);

    this._abortController = new window.AbortController();

    const { timestampA, timestampB } = this.props;
    const leftYear = timestampA ? timestampA.substring(0, 4) : '';
    const rightYear = timestampB ? timestampB.substring(0, 4) : '';

    this.timestampSelectLeft = React.createRef();
    this.timestampSelectRight = React.createRef();
    this.monthSelectLeft = React.createRef();
    this.monthSelectRight = React.createRef();

    this.state = {
      timestampA,
      timestampB,
      leftYear,
      rightYear,
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
    this._handleYearChange = this._handleYearChange.bind(this);
    this.handleLeftMonthChange = this.handleLeftMonthChange.bind(this);
    this.handleRightMonthChange = this.handleRightMonthChange.bind(this);
  }

  componentDidMount () {
    this.setState({ isMounted: true });
    if (!this.state.showError && this.state.timestampAttempt < 2) {
      if (this.state.cdxData) {
        this._areRequestedTimestampsSelected();
      } else {
        this._fetchCDXData();
      }
    }
  }

  componentDidUpdate () {
    if (!this.state.sparkline && !this.state.showLoader) {
      this._fetchSparklineData();
    }
    if (this.state.cdxData && this.state.shouldValidateTimestamp) {
      this._checkTimestamps();
    }

    if (this.state.cdxData && !this.state.showLoader) {
      this._selectValues();
      if (this.state.sparkline && !this.state.leftMonthOptions && !this.state.rightMonthOptions) {
        if (this._leftMonthIndex !== -1 || this._rightMonthIndex !== -1) {
          this._showMonths();
        }
      }
    }
  }

  componentWillUnmount () {
    this.setState({ isMounted: false });
    this._abortController.abort();
  }

  _handleRightTimestampChange () {
    if (!isEmpty(this.state.leftSnapElements)) {
      const selectedDigest = this.state.rightSnaps[this.timestampSelectRight.current.selectedIndex - 1][1];
      const allowedSnapshots = this.state.leftSnaps.filter(hash => hash[1] !== selectedDigest);
      this.setState({
        showRestartBtn: true,
        showDiffBtn: true,
        leftSnapElements: this._prepareOptionElements(allowedSnapshots)
      });
    }
  }

  _handleLeftTimestampChange () {
    if (!isEmpty(this.state.rightSnapElements)) {
      const selectedDigest = this.state.leftSnaps[this.timestampSelectLeft.current.selectedIndex - 1][1];
      const allowedSnapshots = this.state.rightSnaps.filter(hash => hash[1] !== selectedDigest);
      this.setState({
        showRestartBtn: true,
        showDiffBtn: true,
        rightSnapElements: this._prepareOptionElements(allowedSnapshots)
      });
    }
  }

  render () {
    const { loader, conf, url } = this.props;
    const Loader = () => isNil(loader) ? <Loading/> : loader;
    if (this.state.showLoader && !this.state.showError) {
      return <div className="loading"><Loader/></div>;
    }
    if (!this.state.showError && this.state.timestampAttempt < 2) {
      if (this.state.yearOptions || this.state.cdxData) {
        return (
          <div className="timestamp-header-view">
            {this._showInfo()}
            {this._showTimestampSelector()}
            <div>
              {this.state.timestampA &&
                <a href={conf.snapshotsPrefix + this.state.timestampA + '/' + url}
                  id="timestamp-left" target="_blank" rel="noopener noreferrer"> Open in new window</a>
              }
              {this.state.timestampB &&
                <a href={conf.snapshotsPrefix + this.state.timestampB + '/' + url}
                  id="timestamp-right" target="_blank" rel="noopener noreferrer">Open in new window</a>
              }
              <br />
            </div>
          </div>
        );
      }
      return (
        <Loader/>
      );
    }
  }

  _areRequestedTimestampsSelected () {
    if (this.state.finishedValidating) {
      if (!isNaN(this.state.timestampA)) {
        const lastLeftFromCDX = this.state.leftSnaps.slice(-1)[0];
        if (this.state.timestampA > lastLeftFromCDX) {
          const newLeft = this._prepareOptionElements([[this.state.timestampA, 0]]);
          this.setState({
            leftSnapElements: [...this.state.leftSnapElements, newLeft],
            leftSnaps: [...this.state.leftSnaps, [this.state.timestampA, '0']],
            finishedValidating: false
          });
        }
      }
      if (!isNaN(this.state.timestampB)) {
        const lastRightFromCDX = this.state.rightSnaps.slice(-1)[0];
        if (this.state.timestampB > lastRightFromCDX) {
          const newRight = this._prepareOptionElements([[this.state.timestampB, 0]]);
          this.setState({
            rightSnapElements: [...this.state.rightSnapElements, newRight],
            rightSnaps: [...this.state.rightSnaps, [this.state.timestampB, '1']],
            finishedValidating: false
          });
        }
      }
    }
  }

  _checkTimestamps (side = null) {
    this.setState({ shouldValidateTimestamp: false });
    const fetchedTimestamps = { a: '', b: '' };

    const validateAndSetState = (timestamp, key) => {
      return this._validateTimestamp(timestamp, fetchedTimestamps, key)
        .then(() => {
          if (this._redirectToValidatedTimestamps) {
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          } else {
            this.setState({ finishedValidating: true });
          }
        })
        .catch(error => {
          this._errorHandled(error.message);
        });
    };

    if (this.state.timestampA && this.state.timestampB) {
      Promise.all([
        validateAndSetState(this.state.timestampA, 'a'),
        validateAndSetState(this.state.timestampB, 'b')
      ]).finally(() => {
        this.setState({ finishedValidating: true });
      });
    } else if (this.state.timestampA) {
      validateAndSetState(this.state.timestampA, 'a').finally(() => {
        this.setState({ finishedValidating: true });
      });
    } else if (this.state.timestampB) {
      validateAndSetState(this.state.timestampB, 'b').finally(() => {
        this.setState({ finishedValidating: true });
      });
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
    const { fetchSnapshotCallback, conf } = this.props;

    if (fetchSnapshotCallback) {
      return this._handleTimestampValidationFetch(
        fetchSnapshotCallback(timestamp), timestamp, fetchedTimestamps, position
      );
    }
    const url = new URL(conf.cdxServer, window.location.origin);
    url.searchParams.append('url', url);
    url.searchParams.append('closest', timestamp);
    url.searchParams.append('filter', '!mimetype:warc/revisit');
    url.searchParams.append('format', 'json');
    url.searchParams.append('sort', 'closest');
    url.searchParams.append('limit', '1');
    url.searchParams.append('fl', 'timestamp');
    return this._handleTimestampValidationFetch(
      fetchWithTimeout(url, { signal: this._abortController.signal }), timestamp, fetchedTimestamps, position
    );
  }

  _handleTimestampValidationFetch (promise, timestamp, fetchedTimestamps, position) {
    return promise
      .then(checkResponse)
      .then(response => response.json())
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
    const { conf, url } = this.props;
    this._redirectToValidatedTimestamps = false;
    if (fetchedTimestampA === undefined) {
      fetchedTimestampA = '';
    }
    if (fetchedTimestampB === undefined) {
      fetchedTimestampB = '';
    }
    window.history.pushState({}, '', conf.urlPrefix + fetchedTimestampA + '/' + fetchedTimestampB + '/' + url);
    this.setState({
      timestampA: fetchedTimestampA,
      timestampB: fetchedTimestampB,
      finishedValidating: true,
      timestampAttempt: this.state.timestampAttempt + 1,
      showLoader: false
    });
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
    return fetchWithTimeout(url, { signal: this._abortController.signal })
      .then(checkResponse)
      .then(response => response.json());
  }

  _fetchCDXData () {
    this.setState({ showLoader: true });
    let leftFetchPromise;
    let rightFetchPromise;
    this._saveMonthsIndex();
    if (this.props.fetchCDXCallback) {
      leftFetchPromise = this.props.fetchCDXCallback()
        .then(checkResponse)
        .then(response => response.json());
    } else {
      if (this._leftMonthIndex !== -1 && !isNaN(this._leftMonthIndex)) {
        leftFetchPromise = this.createCDXRequest(
          this.state.leftYear + twoDigits(this._leftMonthIndex)
        );
      }
      if (this._rightMonthIndex !== -1 && !isNaN(this._rightMonthIndex)) {
        rightFetchPromise = this.createCDXRequest(
          this.state.rightYear + twoDigits(this._rightMonthIndex)
        );
      }
    }

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
            value={this.state.leftYear}>
            <option value="" disabled>Year</option>
            {this.state.yearOptions}
          </select>
          <select className="form-control input-sm mr-sm-1 month-select"
            ref={this.monthSelectLeft}
            onChange={this.handleLeftMonthChange} title="Months and available captures"
            defaultValue="">
            <option value="" disabled>Month</option>
            {this.state.leftMonthOptions}
          </select>
          { !isEmpty(this.state.leftSnapElements) &&
            <select className="form-control input-sm mr-sm-1 timestamp-select"
              ref={this.timestampSelectLeft}
              onChange={this._handleLeftTimestampChange}
              defaultValue="">
              <option value="" disabled>Available captures</option>
              {this.state.leftSnapElements}
            </select>
          }
        </div>
        <div className="wayback-ymd-buttons">
          {this.state.showDiffBtn && <button className="btn btn-default btn-sm" onClick={this._showDiffs}>Show differences</button> }
          {this.state.showRestartBtn && <button className="btn btn-default btn-sm" onClick={this._restartPressed}>Restart</button> }
        </div>
        <div className="wayback-timestamps">
          { !isEmpty(this.state.rightSnapElements) &&
            <select className="form-control input-sm mr-sm-1 timestamp-select"
              ref={this.timestampSelectRight}
              onChange={this._handleRightTimestampChange}
              defaultValue="">
              <option value="" disabled>Available captures</option>
              {this.state.rightSnapElements}
            </select>
          }
          <select className="form-control input-sm mr-sm-1 month-select"
            ref={this.monthSelectRight}
            onChange={this.handleRightMonthChange} title="Months and available captures"
            defaultValue="">
            <option value="" disabled>Month</option>
            {this.state.rightMonthOptions}
          </select>
          <select className="form-control input-sm mr-sm-1" id="year-select-right"
            onChange={this._handleYearChange} title="Years and available captures"
            value={this.state.rightYear}>
            <option value="" disabled>Year</option>
            {this.state.yearOptions}
          </select>
        </div>
      </div>
    );
  }

  _showDiffs () {
    const timestampA = this.timestampSelectLeft.current.value;
    const timestampB = this.timestampSelectRight.current.value;

    this.props.getTimestampsCallback(timestampA, timestampB);
    this.setState({
      timestampA,
      timestampB
    });
  }

  _selectValues () {
    if (!isEmpty(this.state.leftSnapElements) && this.state.timestampA) {
      this.timestampSelectLeft.current.value = this.state.timestampA;
    }
    if (!isEmpty(this.state.rightSnapElements) && this.state.timestampB) {
      this.timestampSelectRight.current.value = this.state.timestampB;
    }
    const monthLeft = this.monthSelectLeft.current;
    const monthRight = this.monthSelectRight.current;

    // TODO maybe we could delete selectHasValue
    if (selectHasValue(monthLeft, monthNames[this._leftMonthIndex])) {
      monthLeft.value = monthNames[this._leftMonthIndex];
    } else {
      monthLeft.selectedIndex = 0;
    }
    if (selectHasValue(monthRight, monthNames[this._rightMonthIndex])) {
      monthRight.value = monthNames[this._rightMonthIndex];
    } else {
      monthRight.selectedIndex = 0;
    }
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
    fetchWithTimeout(url, { signal: this._abortController.signal })
      .then(checkResponse)
      .then(response => response.json())
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

  _showMonths (leftYear, rightYear) {
    if (isNil(leftYear)) {
      leftYear = this.state.leftYear;
    }
    if (isNil(rightYear)) {
      rightYear = this.state.rightYear;
    }
    const leftMonthsData = this._getMonthData(this.state.sparkline[leftYear]);
    const rightMonthsData = this._getMonthData(this.state.sparkline[rightYear]);
    this.setState({
      leftMonthOptions: this._monthOptions(leftMonthsData),
      rightMonthOptions: this._monthOptions(rightMonthsData)
    });
  }

  _getMonthData (data) {
    if(!isEmpty(data)) {
      const out = [];
      for (let i=0; i<=11; i++) {
        if (data[i] > 0) {
          out.push([monthNames[i+1], data[i]]);
        }
      }
      return out;
    }
  }

  handleLeftMonthChange (e) {
    this._fetchCDXData();
    this.setState({
      showDiffBtn: true,
      timestampA: null,
      timestampB: null
    });
  }

  handleRightMonthChange (e) {
    this._fetchCDXData();
    this.setState({
      showDiffBtn: true,
      timestampA: null,
      timestampB: null
    });
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
      this._leftMonthIndex = 0;
      this.setState({
        leftYear: e.target.value,
        leftSnapElements: null,
        showDiffBtn: false
      });
      this._showMonths(e.target.value, null);
    } else {
      this._rightMonthIndex = 0;
      this.setState({
        rightYear: e.target.value,
        rightSnapElements: null,
        showDiffBtn: false
      });
      this._showMonths(null, e.target.value);
    }
  }

  // TODO maybe there is some redundancy here.
  _saveMonthsIndex () {
    if (this._leftMonthIndex !== -1) {
      const monthLeft = this.monthSelectLeft.current.value;
      this._leftMonthIndex = parseInt(getKeyByValue(monthNames, monthLeft));
    } else if (this.state.timestampA) {
      this._leftMonthIndex = parseInt(this.state.timestampA.substring(4, 6));
    }
    if (this._rightMonthIndex !== -1) {
      const monthRight = this.monthSelectRight.current.value;
      this._rightMonthIndex = parseInt(getKeyByValue(monthNames, monthRight));
    } else if (this.state.timestampB) {
      this._rightMonthIndex = parseInt(this.state.timestampB.substring(4, 6));
    }
  }
}
