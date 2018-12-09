import React from 'react';
import { checkResponse, fetch_with_timeout } from '../js/utils';

/**
 * Display an error message depending on props
 *
 * @class ErrorMessage
 * @extends {React.Component}
 */
export default class ErrorMessage extends React.Component {

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
        <div className='alert alert-warning' role='alert'>The Wayback Machine doesn't have {this.props.url} archived.</div>
      );
    } else if (this.props.code === 'NoSimhash') {
      return (
        <div>
          <div className='alert alert-warning' role='alert'>The Wayback Machine doesn't have Simhash data for {this.props.url} and year {this.props.year}.</div>
          <button className="btn btn-sm" id="calcButton" onClick={this._calculateSimhash}>Calculate now</button>
        </div>
      );
    }
    return (
      <div className='alert alert-warning' role='alert'>Communication with the Wayback Machine
          is not possible at the moment. Please try again later.</div>
    );
  }

  _calculateSimhash () {
    const url = `${this.props.conf.waybackDiscoverDiff}/calculate-simhash?url=${encodeURIComponent(this.props.url)}&year=${this.props.year}`;
    fetch_with_timeout(fetch(url)).then(response => {return checkResponse(response);})
      .then(() => {setTimeout(this._reloadPage, 10000);})
      .catch(error => {this._errorHandled(error.message);});
  }

  _errorHandled (error) {
    this.props.errorHandledCallback(error);
  }

  _reloadPage () {
    window.location.reload(true);
  }
}
