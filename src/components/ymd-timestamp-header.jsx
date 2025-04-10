import PropTypes from 'prop-types';
import React from 'react';
import '../css/diff-container.css';
import { getUTCDateFormat, getShortUTCDateFormat, jsonResponse } from '../js/utils.js';
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
    errorHandledCallback: PropTypes.func,
    getTimestampsCallback: PropTypes.func,
    timestampA: PropTypes.string,
    timestampB: PropTypes.string,
    conf: PropTypes.object,
    url: PropTypes.string
  };

  constructor (props) {
    super(props);
    const { timestampA, timestampB } = this.props;

    this.timestampSelectLeft = React.createRef();
    this.timestampSelectRight = React.createRef();

    this.state = {
      timestampA,
      timestampB,
      leftYear: timestampA?.substring(0, 4) ?? '',
      rightYear: timestampB?.substring(0, 4) ?? '',
      leftMonth: timestampA?.substring(4, 6) ?? '',
      rightMonth: timestampB?.substring(4, 6) ?? ''
    };
  }

  componentDidMount () {
    if (!this.state.showError) {
      if (this.state.leftSnaps || this.state.rightSnaps) {
        this._areRequestedTimestampsSelected();
      } else {
        this._fetchCDXData();
      }
      if (!this.state.sparkline) {
        this._fetchSparklineData();
      }
    }
  }

  _handleRightTimestampChange = (event) => {
    this.setState({ timestampB: event.target.value });
    this._updateSnaps('right');
  };

  _handleLeftTimestampChange = (event) => {
    this.setState({ timestampA: event.target.value });
    this._updateSnaps('left');
  };

  _updateSnaps = (side) => {
    const snapsKey = side === 'left' ? 'leftSnaps' : 'rightSnaps';
    const otherSnapsKey = side === 'left' ? 'rightSnaps' : 'leftSnaps';
    const selectedDigest = this.state[snapsKey][this['timestampSelect' + (side === 'left' ? 'Left' : 'Right')].current.selectedIndex - 1][1];
    const filteredSnaps = this.state[otherSnapsKey].filter(hash => hash[1] !== selectedDigest);
    this.setState({ [otherSnapsKey]: filteredSnaps });
  };

  render () {
    const showDiffBtn = !isEmpty(this.state.timestampA) && !isEmpty(this.state.timestampB);
    const Loader = () => isNil(this.props.loader) ? <Loading/> : this.props.loader;
    if (this.state.showError) {
      return <div></div>;
    }
    if (!this.state.leftSnaps && !this.state.rightSnaps) {
      return <div className="loading"><Loader/></div>;
    }
    if (this.state.yearOptions || this.state.leftSnaps || this.state.rightSnaps) {
      return (
        <div className="timestamp-header-view">
          <div>
            {this.state.headerInfo}
            <div id="timestamp-left">Please select a capture</div>
            <div id="timestamp-right">Please select a capture</div>
            <br/>
          </div>
          <div className="wayback-ymd-timestamp">
            <div className="wayback-timestamps">
              <select className="form-control input-sm mr-sm-1" id="year-select-left"
                onChange={this._handleYearChange} title="Years and available captures"
                value={this.state.leftYear}>
                <option value="" disabled>Year</option>
                {this.state.yearOptions}
              </select>
              <select className="form-control input-sm mr-sm-1 month-select month-select-left"
                onChange={this._handleMonthChange} title="Months and available captures"
                value={this.state.leftMonth}>
                <option value="" disabled>Month</option>
                {  this.state.leftMonthOptions}
              </select>
              { !isEmpty(this.state.leftSnaps) &&
                <select className="form-control input-sm mr-sm-1 timestamp-select"
                  ref={this.timestampSelectLeft}
                  onChange={this._handleLeftTimestampChange}
                  value={this.state.timestampA}
                  defaultValue="">
                  <option value="" disabled>Available captures</option>
                  {this.state.leftSnaps.map((item, index) => (
                    <option key={index} value={item[0]}>{getUTCDateFormat(item[0])}</option>
                  ))}
                </select>
              }
            </div>
            <div className="wayback-ymd-buttons">
              {showDiffBtn && <button className="btn btn-default btn-sm" onClick={this._showDiffs}>Show differences</button> }
            </div>
            <div className="wayback-timestamps">
              { !isEmpty(this.state.rightSnaps) &&
              <select className="form-control input-sm mr-sm-1 timestamp-select"
                ref={this.timestampSelectRight}
                onChange={this._handleRightTimestampChange}
                value={this.state.timestampB}
                defaultValue="">
                <option value="" disabled>Available captures</option>
                {this.state.rightSnaps.map((item, index) => (
                  <option key={index} value={item[0]}>{getUTCDateFormat(item[0])}</option>
                ))}
              </select>
              }
              <select className="form-control input-sm mr-sm-1 month-select month-select-right"
                onChange={this._handleMonthChange} title="Months and available captures"
                value={this.state.rightMonth}>
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
          <div>
            {this.state.timestampA &&
              <a href={this.props.conf.snapshotsPrefix + this.state.timestampA + '/' + this.props.url}
                id="timestamp-left" target="_blank" rel="noopener noreferrer"> Open in new window</a>
            }
            {this.state.timestampB &&
              <a href={this.props.conf.snapshotsPrefix + this.state.timestampB + '/' + this.props.url}
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

  _areRequestedTimestampsSelected = () => {
    if (!isNaN(this.state.timestampA)) {
      const lastLeftFromCDX = this.state.leftSnaps.slice(-1)[0];
      if (this.state.timestampA > lastLeftFromCDX) {
        this.setState({
          leftSnaps: [...this.state.leftSnaps, [this.state.timestampA, '0']]
        });
      }
    }
    if (!isNaN(this.state.timestampB)) {
      const lastRightFromCDX = this.state.rightSnaps.slice(-1)[0];
      if (this.state.timestampB > lastRightFromCDX) {
        this.setState({
          rightSnaps: [...this.state.rightSnaps, [this.state.timestampB, '1']],
        });
      }
    }
  };

  /**
   * Note that the timestamp does not have YYYYMM and also its integer and not
   * string. So, it could be 7040920 and we need to make it '07040920' (DDHHMMSS)
   */
  fetchYearMonthCaptures = (year1, month1) => {
    const { conf, url } = this.props;
    const requestUrl = new URL(conf.calendarURL, window.location.origin);
    requestUrl.searchParams.append('url', url);
    requestUrl.searchParams.append('date', year1 + month1);
    requestUrl.searchParams.append('digest', 1);

    return fetch(requestUrl)
      .then(jsonResponse)
      .then(data => data['items'])
      .then(data => data.map(item => [year1 + month1 + String(item[0]).padStart(8, '0'), item[2]]))
      .catch(error => { this._errorHandled(error.message); });
  };

  _getMonth = (currentMonth, timestamp) => {
    if (currentMonth !== '') {
      return currentMonth;
    } else if (timestamp) {
      return timestamp.substring(4, 6);
    }
    return '';
  };

  /**
   * On component init get current month from timestamp because the months selects
   * aren't rendered yet.
   */
  _fetchCDXData = () => {
    const leftMonth = this._getMonth(this.state.leftMonth, this.state.timestampA);
    const rightMonth = this._getMonth(this.state.rightMonth, this.state.timestampB);

    const leftFetchPromise = leftMonth !== '' ? this.fetchYearMonthCaptures(this.state.leftYear, leftMonth) : null;
    const rightFetchPromise = rightMonth !== '' ? this.fetchYearMonthCaptures(this.state.rightYear, rightMonth) : null;

    Promise.allSettled([leftFetchPromise, rightFetchPromise])
      .then(([leftResult, rightResult]) => {
        const leftSnaps = leftResult?.value || [];
        const rightSnaps = rightResult?.value || [];

        if (leftSnaps.length > 0 || rightSnaps.length > 0) {
          this.props.getTimestampsCallback(this.state.timestampA, this.state.timestampB);
          this.setState({ leftSnaps, rightSnaps });
        }
      })
      .catch(error => { this._errorHandled(error.message); });
  };

  _errorHandled = (error) => {
    this.props.errorHandledCallback(error);
    this.setState({ showError: true });
  };

  /** Each item has [key, value, counter] **/
  _showOptions = (data) => {
    const limit = parseInt(this.props.conf.limit);
    return (
      data &&
      data.slice(0).reverse().map((item, index) => {
        let key = '', val = '', cnt = 0;
        if (item.length == 3) {
          key = item[0];
          val = item[1];
          cnt = item[2];
        } else {
          key = item[0];
          val = item[0];
          cnt = item[1];
        }
        const count = Math.min(cnt, limit);
        return <option key={index} value={key}>{`${val} (${count})`}</option>;
      })
    );
  };

  _showDiffs = () => {
    this.props.getTimestampsCallback(this.state.timestampA, this.state.timestampB);
  };

  _getHeaderInfo = (firstTimestamp, lastTimestamp, count) => {
    const first = getShortUTCDateFormat(firstTimestamp);
    const last = getShortUTCDateFormat(lastTimestamp);
    return (<p id='explanation-middle'>Compare any two captures of {this.props.url} from our collection
      of {count.toLocaleString()} dating from {first} to {last}.</p>);
  };

  _fetchSparklineData = () => {
    const url = new URL(this.props.conf.sparklineURL, window.location.origin);
    url.searchParams.append('url', this.props.url);
    url.searchParams.append('collection', 'web');
    url.searchParams.append('output', 'json');
    fetch(url)
      .then(jsonResponse)
      .then((data) => {
        if (data) {
          this._prepareSparklineData(data);
        } else {
          this._errorHandled('404');
        }
      })
      .catch(error => { this._errorHandled(error.message); });
  };

  _prepareSparklineData = (data) => {
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
      sparkline: snapshots,
      yearOptions: this._showOptions(yearSum),
      headerInfo: this._getHeaderInfo(data.first_ts, data.last_ts, allSum)
    }, () => {
      this._showMonths(this.state.leftYear, this.state.rightYear);
    });
  };

  _showMonths = (leftYear, rightYear) => {
    if (!isNil(leftYear)) {
      const leftMonths = this.state.sparkline[leftYear].filter(val => val > 0).map((val, idx) => [String(idx+1).padStart(2, '0'), monthNames[idx+1], val]);
      this.setState({ leftMonthOptions: this._showOptions(leftMonths) });
    }
    if (!isNil(rightYear)) {
      const rightMonths = this.state.sparkline[rightYear].filter(val => val > 0).map((val, idx) => [String(idx+1).padStart(2, '0'), monthNames[idx+1], val]);
      this.setState({ rightMonthOptions: this._showOptions(rightMonths) });
    }
  };

  _handleMonthChange = (e) => {
    if (e.target.className.includes('left')) {
      this.setState({
        leftMonth: e.target.value,
        leftSnaps: null,
        timestampA: null
      }, () => {
        this._fetchCDXData();
      });
    } else {
      this.setState({
        rightMonth: e.target.value,
        rightSnaps: null,
        timestampB: null
      }, () => {
        this._fetchCDXData();
      });
    }
  };

  _handleYearChange = (e) => {
    if (e.target.id === 'year-select-left') {
      this.setState({
        leftMonth: '',
        leftYear: e.target.value,
        leftSnaps: null,
      });
      this._showMonths(e.target.value, null);
    } else {
      this.setState({
        rightMonth: '',
        rightYear: e.target.value,
        rightSnaps: null,
      });
      this._showMonths(null, e.target.value);
    }
  };
}
