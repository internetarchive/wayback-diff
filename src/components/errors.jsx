import PropTypes from 'prop-types';
import React from 'react';
import { checkResponse, fetchWithTimeout, getUTCDateFormat } from '../js/utils';

/**
 * Display an error message depending on props
 *
 * @class ErrorMessage
 * @extends {React.Component}
 */
export default class ErrorMessage extends React.Component {
  static propTypes = {
    code: PropTypes.string,
    url: PropTypes.string,
    timestamp: PropTypes.string,
    conf: PropTypes.object,
    errorHandledCallback: PropTypes.func
  };

  constructor (props) {
    super(props);
    this._calculateSimhash = this._calculateSimhash.bind(this);
    this._errorHandled = this._errorHandled.bind(this);
    this._reloadPage = this._reloadPage.bind(this);
  }

  render () {
    console.warn(this.props.code);
    if (this.props.code === '404') {
      return (
        <div className='alert alert-warning' role='alert'>
          The Wayback Machine has not archived {this.props.url}.
        </div>
      );
    } else if (this.props.code === 'CAPTURE_NOT_FOUND') {
      return (
        <div>
          <div className='alert alert-warning' role='alert'>
            There are no data available for {this.props.url} and timestamp {getUTCDateFormat(this.props.timestamp)}.
          </div>
          <button className="btn btn-sm" id="calcButton" onClick={this._calculateSimhash}>Calculate now</button>
        </div>
      );
    } else if (this.props.code === 'NOT_CAPTURED') {
      return (
        <div>
          <div className='alert alert-warning' role='alert'>
            The Wayback Machine has no similarity data for {this.props.url} and year {this.props.timestamp.substring(0, 4)}.
          </div>
          <button className="btn btn-sm" id="calcButton" onClick={this._calculateSimhash}>Calculate now</button>
        </div>
      );
    } else if (this.props.code === 'NO_CAPTURES') {
      return (
        <div className='alert alert-warning' role='alert'>
          The Wayback Machine has not archived {this.props.url} for year {this.props.timestamp.substring(0, 4)}.
        </div>
      );
    }
    return (
      <div className='alert alert-warning' role='alert'>
        The Wayback Machine is not available at the moment. Please try again later.
      </div>
    );
  }

  _calculateSimhash () {
    const url = `${this.props.conf.waybackDiscoverDiff}/calculate-simhash?url=${encodeURIComponent(this.props.url)}&year=${this.props.timestamp.substring(0, 4)}`;
    fetchWithTimeout(url).then(response => { return checkResponse(response); })
      .then(() => { setTimeout(this._reloadPage, 10000); })
      .catch(error => { this._errorHandled(error.message); });
  }

  _errorHandled (error) {
    this.props.errorHandledCallback(error);
  }

  _reloadPage () {
    window.location.reload(true);
  }
}
