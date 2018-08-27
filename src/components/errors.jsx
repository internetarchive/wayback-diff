import React from 'react'

/**
 * Display an error message depending on props
 *
 * @class ErrorMessage
 * @extends {React.Component}
 */
export default class ErrorMessage extends React.Component {

  render () {
    if (this.props.code === '404') {
      return (
        <div className='alert alert-warning' role='alert'>The Wayback Machine doesn't have {this.props.site} archived.</div>
      )
    }
  }
}
