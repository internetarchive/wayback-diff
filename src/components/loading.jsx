import waybackLoaderPath from '../img/wayback-loader.svg';
import React from 'react';

export default class Loading extends React.Component {
  render () {
    return (
      <div className="loading">
        <img src={waybackLoaderPath} />
      </div>
    );
  }
}
