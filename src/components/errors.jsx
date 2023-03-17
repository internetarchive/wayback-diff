import PropTypes from 'prop-types';
import React from 'react';
import { checkResponse, fetchWithTimeout } from '../js/utils';

/**
 * Display an error message depending on props
 *
 * @class ErrorMessage
 * @extends {React.Component}
 */
export default class ErrorMessage extends React.PureComponent {
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
  }

  render () {
    let msg = '';
    let simhash = false;
    let year = '';
    if (this.props.timestamp !== undefined) {
      year = this.props.timestamp.substring(0, 4);
    }

    switch (this.props.code) {
    case '404':
      msg = `The Wayback Machine has not archived ${this.props.url}.`;
      simhash = false;
      break;
    case '422':
      // https://github.com/edgi-govdata-archiving/web-monitoring-diff/blob/be748a7f0bbdd4251f680e22d3e433d1be93f858/web_monitoring_diff/server/server.py#L568
      msg = `The captures of ${this.props.url} cannot be compared. Note that we support only HTML capture comparison.`;
      simhash = false;
      break;
    case 'CAPTURE_NOT_FOUND':
      msg = `There are no data available for ${this.props.url} at ${this.props.timestamp}.`;
      simhash = true;
      break;
    case 'NOT_CAPTURED':
      msg = `The Wayback Machine has no similarity data for ${this.props.url} and year ${year}.`;
      simhash = true;
      break;
    case 'NO_CAPTURES':
      msg = `The Wayback Machine has not archived ${this.props.url} for year ${year}.`;
      simhash = false;
      break;
    case 'NO_DIFFERENT_CAPTURES':
      msg = `There aren't any different captures for ${this.props.url} for year ${year} to display their similarity.`;
      simhash = false;
      break;
    // Occurs when AJAX fetch for CDX is canceled.
    case '_this4.errorHandled is not a function': // Chrome
    case 'NetworkError when attempting to fetch resource.': // FF
    case 'Load failed': // Safari
      msg = `The capture of ${this.props.url} at ${this.props.timestamp} cannot be used for comparisons. Its possible it is a redirect.`;
      simhash = false;
      break;
    default:
      msg = 'We are sorry but there is a problem comparing these captures. Please try two different ones.';
      simhash = false;
    }

    return (
      <>
        <div className='alert alert-warning' role='alert'>{ msg }</div>
        { simhash &&
          <button className="btn btn-sm" id="calcButton"
            onClick={ this._calculateSimhash }>Calculate now</button>
        }
        <button className="btn btn-sm" onClick={() => window.history.back()}>&laquo; Go back</button>
      </>
    );
  }

  _calculateSimhash () {
    const url = `${this.props.conf.waybackDiscoverDiff}/calculate-simhash?url=${encodeURIComponent(this.props.url)}&year=${this.props.timestamp.substring(0, 4)}`;
    fetchWithTimeout(url).then(checkResponse)
      .then(() => { setTimeout(function () { window.location.reload(true) }, 10000); })
      .catch(error => { this._errorHandled(error.message); });
  }

  _errorHandled (error) {
    this.props.errorHandledCallback(error);
  }
}
