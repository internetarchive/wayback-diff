import PropTypes from 'prop-types';
import React from 'react';
import { checkResponse, fetchWithTimeout, getUTCDateFormat } from '../js/utils';

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
    this._reloadPage = this._reloadPage.bind(this);
  }

  render () {
    let msg = '';
    let back = false;
    let simhash = false;
    let year = '';
    if (this.props.timestamp !== undefined) {
      year = this.props.timestamp.substring(0, 4);
    }
    switch (this.props.code) {
    case '404':
      msg = `The Wayback Machine has not archived ${this.props.url}.`;
      back = true;
      simhash = false;
      break;
    case 'CAPTURE_NOT_FOUND':
      msg = `There are no data available for ${this.props.url} and timestamp ${getUTCDateFormat(this.props.timestamp)}.`;
      back = true;
      simhash = true;
      break;
    case 'NOT_CAPTURED':
      msg = `The Wayback Machine has no similarity data for ${this.props.url} and year ${year}.`;
      back = true;
      simhash = true;
      break;
    case 'NO_CAPTURES':
      msg = `The Wayback Machine has not archived ${this.props.url} for year ${year}.`;
      back = true;
      simhash = false;
      break;
    case 'NO_DIFFERENT_CAPTURES':
      msg = `There aren't any different captures for ${this.props.url} for year ${year} to display their similarity.`;
      back = true;
      simhash = false;
      break;
    default:
      msg = 'The Wayback Machine is not available at the moment. Please try again later.';
      back = true;
      simhash = false;
    }

    return (
      <>
        <div className='alert alert-warning' role='alert'>{ msg }</div>
        { simhash
          ? <button className="btn btn-sm" id="calcButton"
            onClick={ this._calculateSimhash }>Calculate now</button>
          : null }
        { back
          ? <button className="btn btn-sm" onClick={() => window.history.back()}>&laquo; Go back</button>
          : null }
      </>
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
