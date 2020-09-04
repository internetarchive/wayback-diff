import React from 'react';
import _ from 'lodash';
import Loading from './loading.jsx';

export default class IframeLoader extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = { loaderStyle: null };
  }

  render () {
    const Loader = () => _.isNil(this.props.loader) ? <Loading/> : this.props.loader;
    return (
      <div style={this.state.loaderStyle}>
        {this.state.loaderStyle ? <Loader/> : null}
      </div>
    );
  }

  setLoaderStyle (style) {
    this.setState({ loaderStyle: style });
  }
}
