import PropTypes from 'prop-types';
import React from 'react';
import isNil from 'lodash/isNil';
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
    const Loader = () => isNil(this.props.loader) ? <Loading/> : this.props.loader;
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
