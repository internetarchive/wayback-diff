import React from 'react';
import DiffItem from './diff-item.jsx';
import List from './list.jsx';

/**
 * Display a plaintext diff with additions and removals inline.
 *
 * @class HighlightedTextDiff
 * @extends {React.Component}
 * @param {Object} props
 * @param {DiffData} props.diffData
 * @param {string} props.className
 */
export default class HighlightedTextDiff extends React.Component {
  render () {
    return (
      <List
        data={this.props.diffData.diff}
        component={DiffItem}
        className={this.props.className}
      />
    );
  }
}
