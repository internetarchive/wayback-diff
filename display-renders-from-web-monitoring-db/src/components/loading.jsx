import infinityLoaderPath from '../img/infinity-loader.svg';
import React from 'react';

export default class Loading extends React.Component {
  render () {
    return (
      <div className="loading">
        <object type="image/svg+xml" data={infinityLoaderPath} />
      </div>
    );
  }
}
