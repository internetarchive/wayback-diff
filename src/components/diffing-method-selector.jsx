import React from 'react';
import '../css/diff-container.css';

/**
 * Display a diffing method selector
 *
 * @class TimestampHeader
 * @extends {React.Component}
 */
export default class DiffingMethodSelector extends React.Component {

  constructor(props) {
    super(props);

    let pr = process.env;
    let diffMethodsSupported = [];

    Object.keys(pr).map(function(key) {
      if (key.startsWith('REACT_APP_DIFFING_METHOD')) {
        diffMethodsSupported.push(pr[key]);
      }
    });

    this.state = {diffMethods: diffMethodsSupported,
      selectedMethod:diffMethodsSupported[0]};
    this.props.parentHandle(diffMethodsSupported[0]);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    this.setState({selectedMethod: event.target.value});
    this.props.parentHandle(event.target.value);
  }

  render () {
    return (
      <select id="diff-select" onChange={this.handleChange}>
        {this.state.diffMethods.map(function (val, index) {
          return <option key = {index} value = {val}>{val}</option>;
        })}
      </select>
    );
  }

}