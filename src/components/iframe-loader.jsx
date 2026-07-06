import PropTypes from 'prop-types';
import React from 'react';
import Loading from './loading.jsx';

export default class IframeLoader extends React.PureComponent {
  static propTypes = {
    loader: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = { loaderStyle: null };
  }

  render () {
    const Loader = () => this.props.loader == null ? <Loading/> : this.props.loader;
    return (
      <div style={this.state.loaderStyle}>
        {this.state.loaderStyle && <Loader/>}
      </div>
    );
  }

  setLoaderStyle (style) {
    this.setState({ loaderStyle: style });
  }
}
