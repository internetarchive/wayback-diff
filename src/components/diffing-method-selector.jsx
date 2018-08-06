import React from 'react';
import {supportedDiffTypes} from '../js/supported-diffing-methods.js';
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

    this.state = {diffMethods: supportedDiffTypes,
      selectedMethod:supportedDiffTypes[0]};
    this.props.diffMethodSelectorCallback(supportedDiffTypes[0]);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    this.setState({selectedMethod: event.target.value.split(',')});
    this.props.diffMethodSelectorCallback(event.target.value.split(','));
  }

  render () {
    return (
      <select id="diff-select" onChange={this.handleChange}>
        {this.state.diffMethods.map(function (val, index) {
          return <option key = {index} value = {val}>{val[1]}</option>;
        })}
      </select>
    );
  }

}