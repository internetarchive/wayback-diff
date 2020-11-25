import React from 'react';

// This is the simplest possible loading component. We can override this with
// a component displaying a spinner in the app using Diff
export default class Loading extends React.Component {
  render () {
    return (
      <span>Loading...</span>
    );
  }
}
