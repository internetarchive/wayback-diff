import React from 'react';

/**
 * Display an error message depending on props
 *
 * @class ErrorMessage
 * @extends {React.Component}
 */
export default class ErrorMessage extends React.Component {

  render () {
    console.warn(this.props.code);
    if (this.props.code === '404') {
      return (
        <div className='alert alert-warning' role='alert'>The Wayback Machine doesn't have {this.props.url} archived.</div>
      );
    }
    return (
      <div className='alert alert-warning' role='alert'>Communication with the Wayback Machine
          is not possible at the moment. Please try again later.</div>
    );
  }
}
