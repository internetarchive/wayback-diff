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
        <p id={'diff-footer'}><yellow-diff-footer>Yellow</yellow-diff-footer> indicates content deletion. <blue-diff-footer>Blue</blue-diff-footer> indicates content addition
        </p>
      </div>
    );
  }

}