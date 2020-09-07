import React from 'react';

/**
 * Display a message that no url is given so no snapshot is displayed
 *
 * @class NoSnapshotURL
 * @extends {React.Component}
 */
export default class NoSnapshotURL extends React.Component {
  render () {
    return (
      <h1>No capture is selected, please pick one from the list.</h1>
    );
  }
}
