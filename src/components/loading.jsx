import React from 'react';

export default class Loading extends React.Component {
  render () {
    return (
      <div className="loading">
        <img src={this.props.waybackLoaderPath}/>
      </div>
    );
  }
}
