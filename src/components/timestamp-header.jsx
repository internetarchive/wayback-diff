import PropTypes from 'prop-types';
import React from 'react';
import '../css/diff-container.css';
import {
  fetchWithTimeout, checkResponse, getUTCDateFormat, getShortUTCDateFormat, getYear
} from '../js/utils.js';
/**
 * Display a timestamp selector
 *
 * @class TimestampHeader
 * @extends {React.Component}
 */
export default class TimestampHeader extends React.Component {
  _isMountedNow = false;
  _shouldValidateTimestamp = true;

  static propTypes = {
    loader: PropTypes.object,
    url: PropTypes.object,
    timestampA: PropTypes.string,
    timestampB: PropTypes.string,
    conf: PropTypes.object,
    changeTimestampsCallback: PropTypes.func,
    errorHandledCallback: PropTypes.func,
    isInitial: PropTypes.bool
  };

  constructor (props) {
    super(props);

    this._abortController = new window.AbortController();

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

  componentDidMount () {
    this._isMountedNow = true;
  }

  componentWillUnmount () {
    this._isMountedNow = false;
    this._abortController.abort();
  }

  _handleRightTimestampChange () {
    const selectedDigest = this.state.cdxData[document.getElementById('timestamp-select-right').selectedIndex][1];
    const allowedSnapshots = this.state.cdxData.filter(hash => hash[1] !== selectedDigest);
    this.setState({
      leftSnaps: allowedSnapshots,
      leftSnapElements: this._prepareOptionElements(allowedSnapshots)
    });
  }

  _handleLeftTimestampChange () {
    const selectedDigest = this.state.cdxData[document.getElementById('timestamp-select-left').selectedIndex][1];
    const allowedSnapshots = this.state.cdxData.filter(hash => hash[1] !== selectedDigest);
    this.setState({
      rightSnaps: allowedSnapshots,
      rightSnapElements: this._prepareOptionElements(allowedSnapshots)
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
    const fetchedTimestamps = { a: '', b: '' };
    if (this.state.timestampA && this.state.timestampB) {
      this._validateTimestamp(this.state.timestampA, fetchedTimestamps, 'a')
        .then(() => { return this._validateTimestamp(this.state.timestampB, fetchedTimestamps, 'b'); })
        .then(() => {
          if (this._redirectToValidatedTimestamps) {
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(error => { this._errorHandled(error.message); });
    } else if (this.state.timestampA) {
      this._validateTimestamp(this.state.timestampA, fetchedTimestamps, 'a')
        .then(() => {
          if (this._redirectToValidatedTimestamps) {
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(error => { this._errorHandled(error.message); });
    } else if (this.state.timestampB) {
      this._validateTimestamp(this.state.timestampB, fetchedTimestamps, 'b')
        .then(() => {
          if (this._redirectToValidatedTimestamps) {
            this._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(error => { this._errorHandled(error.message); });
    }
  }

  _validateTimestamp (timestamp, fetchedTimestamps, position) {
    const url = new URL(this.props.conf.snapshotsPrefix + timestamp + '/' + encodeURIComponent(this.props.url),
      window.location.origin);
    return this._handleTimestampValidationFetch(fetchWithTimeout(url, { redirect: 'follow' }), timestamp, fetchedTimestamps, position);
  }

  _handleTimestampValidationFetch (promise, timestamp, fetchedTimestamps, position) {
    return promise
      .then(response => { return checkResponse(response); })
      .then(response => {
        fetchedTimestamps[position] = response.url.split('/')[4];
        if (timestamp !== fetchedTimestamps[position]) {
          this._redirectToValidatedTimestamps = true;
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
    this.setState({ timestampA: fetchedTimestampA, timestampB: fetchedTimestampB });
    document.getElementById('timestamp-select-left').value = fetchedTimestampA;
    document.getElementById('timestamp-select-right').value = fetchedTimestampB;
  }

  _fetchCDXData () {
    const url = new URL(this.props.conf.cdxServer, window.location.origin);
    url.searchParams.append('url', this.props.url);
    url.searchParams.append('fl', 'timestamp,digest');
    url.searchParams.append('output', 'json');
    url.searchParams.append('sort', 'reverse');
    if (this.props.conf.limit) {
      url.searchParams.append('limit', this.props.conf.limit);
    }
    this._handleFetch(fetchWithTimeout(url, { signal: this._abortController.signal }));
  }

  _handleFetch (promise) {
    promise
      .then(function (response) {
        if (response) {
          if (!response.ok) {
            throw Error(response.status);
          }
          return response.json();
        }
      })
      .then((data) => {
        if (data && data.length > 0) {
          this._prepareData(data);
          if (!this.props.isInitial) {
            this._selectValues();
          }
        } else {
          this.props.errorHandledCallback('404');
          this.setState({ showError: true });
        }
      })
      .catch(error => { this._errorHandled(error.message); });
  }

  _errorHandled (error) {
    if (this._isMountedNow) {
      this.props.errorHandledCallback(error);
      this.setState({ showError: true });
    }
  }

  _prepareData (data) {
    data.shift();
    this.setState({
      cdxData: data,
      leftSnaps: data,
      rightSnaps: data,
      leftSnapElements: this._prepareOptionElements(data),
      rightSnapElements: this._prepareOptionElements(data),
      headerInfo: this._getHeaderInfo(data)
    });
  }

  _prepareOptionElements (data) {
    const initialSnapshots = [];
    if (data.length > 0) {
      let yearGroup = getYear(data[0][0]);
      initialSnapshots.push(<optgroup key={-1} label={yearGroup}/>);
      for (let i = 0; i < data.length; i++) {
        const utcTime = getUTCDateFormat(data[i][0]);
        const year = getYear(data[i][0]);
        if (year < yearGroup) {
          yearGroup = year;
          initialSnapshots.push(<optgroup key={-i + 2} label={yearGroup}/>);
        }
        initialSnapshots.push(<option key = {i} value = {data[i][0]}>{utcTime}</option>);
      }
    }
    return initialSnapshots;
  }

  _restartPressed () {
    this.setState({
      leftSnaps: this.state.cdxData,
      rightSnaps: this.state.cdxData,
      leftSnapElements: this._prepareOptionElements(this.state.cdxData),
      rightSnapElements: this._prepareOptionElements(this.sate.cdxData)
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

  _showOpenLinks () {
    if (!this.props.isInitial) {
      return (
        <div>
          {this.props.timestampA &&
            <a href={this.props.conf.snapshotsPrefix + this.state.timestampA + '/' + this.props.url}
              id="timestamp-left" target="_blank" rel="noopener noreferrer"> Open in new window</a>
          }
          {this.props.timestampB &&
            <a href={this.props.conf.snapshotsPrefix + this.state.timestampB + '/' + this.props.url}
              id="timestamp-right" target="_blank" rel="noopener noreferrer"> Open in new window</a>
          }
          <br/>
        </div>
      );
    }
  }

  _notFound () {
    return (<div className="alert alert-warning" role="alert">
      The Wayback Machine has not archived {this.props.url}.
    </div>);
  }

  _showDiffs () {
    const loaders = document.getElementsByClassName('waybackDiffIframeLoader');
    while (loaders.length > 0) {
      loaders[0].parentNode.removeChild(loaders[0]);
    }
    this.props.changeTimestampsCallback(
      document.getElementById('timestamp-select-left').value,
      document.getElementById('timestamp-select-right').value
    );
    this.setState({ showDiff: true });
  }

  _selectValues () {
    if (!(!this.state.timestampA && !this.state.timestampB && !this.props.isInitial)) {
      document.getElementById('timestamp-select-left').value = this.state.timestampA;
      document.getElementById('timestamp-select-right').value = this.state.timestampB;
    }
  }

  _getHeaderInfo (data) {
    if (data) {
      const first = getShortUTCDateFormat(data[0][0]);
      const last = getShortUTCDateFormat(data[data.length - 1][0]);
      const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      };
      return (<p id='explanation-middle'> Compare any two captures of {this.props.url} from our collection of {numberWithCommas(data.length)} dating from {first} to {last}.</p>);
    }
  }
}
