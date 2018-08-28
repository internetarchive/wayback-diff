import React from 'react';
import '../css/diff-container.css';


/**
 * Display a footer explaining the colors showing in the diffs
 *
 * @class DiffFooter
 * @extends {React.Component}
 */
export default class DiffFooter extends React.Component {


  render () {
    // console.log('diff-Footer render');
    return (
      <div>
        <p id={'diff-footer'}><red-diff-footer>Red</red-diff-footer> indicates content deletion. <green-diff-footer>Green</green-diff-footer> indicates content addition
        </p>
      </div>
    );
  }

}