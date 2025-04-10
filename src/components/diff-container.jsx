import React from 'react';
import PropTypes from 'prop-types';
import DiffView from './diff-view.jsx';
import '../css/diff-container.css';
import YmdTimestampHeader from './ymd-timestamp-header.jsx';
import DiffFooter from './footer.jsx';
import { checkResponse, fetchWithTimeout } from '../js/utils.js';
import NoSnapshotURL from './no-snapshot-url.jsx';
import ErrorMessage from './errors.jsx';
import Loading from './loading.jsx';
import isNil from 'lodash/isNil';

/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 */
export default class DiffContainer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showDiff: false,
      timestampA: this.props.timestampA,
      timestampB: this.props.timestampB
    };
    this._oneFrame = null;
  }

  getTimestamps = (timestampA, timestampB) => {
    if (timestampA !== undefined || timestampB !== undefined) {
      this.setState({
        fetchedRaw: null,
        error: null,
        showDiff: true,
        timestampA: timestampA || '',
        timestampB: timestampB || ''
      });

      if (timestampA !== this.state.timestampA || timestampB !== this.state.timestampB) {
        const url = this.props.conf.urlPrefix + (timestampA || '') + '/' + (timestampB || '') + '/' + this.props.url;
        window.history.pushState({}, '', url);
      }
    }
  };

  errorHandled = (errorCode) => {
    this.setState({ error: errorCode });
  };

  render () {
    const { url, noTimestamps, conf, loader } = this.props;
    const { timestampA, timestampB, showDiff, error } = this.state;

    if (error) {
      return (<ErrorMessage url={url} timestamp={timestampA} code={error} />);
    }
    if (!timestampA && !timestampB) {
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader {...this.props} getTimestampsCallback={this.getTimestamps}
            errorHandledCallback={this.errorHandled}/>
          {noTimestamps && this._showNoTimestamps()}
        </div>
      );
    }
    if (timestampA && timestampB) {
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader
            {...this.props} getTimestampsCallback={this.getTimestamps}
            errorHandledCallback={this.errorHandled}/>
          {showDiff && this.prepareDiffView()}
          <DiffFooter/>
        </div>);
    }
    if (timestampA) {
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader {...this.props} getTimestampsCallback={this.getTimestamps}
            errorHandledCallback={this.errorHandled}/>
          {showDiff && this._showOneSnapshot(true, timestampA)}
        </div>);
    }
    if (timestampB) {
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader {...this.props}
            errorHandledCallback={this.errorHandled}
            getTimestampsCallback={this.getTimestamps}/>
          {showDiff && this._showOneSnapshot(false, timestampB)}
        </div>);
    }
  }

  _showNoTimestamps () {
    return (
      <div className={'side-by-side-render'}>
        <NoSnapshotURL/>
        <NoSnapshotURL/>
      </div>
    );
  }

  _showOneSnapshot (isLeft, timestamp) {
    const { fetchedRaw } = this.state;
    const { conf, url, loader } = this.props;

    if (fetchedRaw) {
      const iframeProps = {
        height: window.innerHeight,
        onLoad: () => this._handleHeight,
        srcDoc: fetchedRaw,
        ref: (frame) => { this._oneFrame = frame; }
      };
      return (
        <div className={'side-by-side-render'}>
          {isLeft ? <iframe {...iframeProps} /> : <NoSnapshotURL/>}
          {isLeft ? <NoSnapshotURL/> : <iframe {...iframeProps} />}
        </div>
      );
    }
    const captureUrl = new URL(conf.snapshotsPrefix + timestamp + '/' + encodeURIComponent(url), window.location.origin);
    this._handleSnapshotFetch(fetchWithTimeout(captureUrl.toString()));

    const Loader = () => isNil(loader) ? <Loading/> : loader;
    return <div className="loading"><Loader/></div>;
  }

  _handleSnapshotFetch (promise) {
    promise
      .then(checkResponse)
      .then(response => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          return response.text();
        } else {
          return '<iframe src=' + response.url + ' style="width: 98%; position: absolute; height: 98%;" />';
        }
      })
      .then((responseText) => {
        this.setState({ fetchedRaw: responseText });
      })
      .catch(error => { this.errorHandled(error.message); });
  }

  prepareDiffView = () => {
    const { timestampA, timestampB } = this.state;
    const { conf, url, loader } = this.props;
    if (!this.state.error) {
      const urlA = new URL(conf.snapshotsPrefix + timestampA + '/' + encodeURIComponent(url), window.location.origin);
      const urlB = new URL(conf.snapshotsPrefix + timestampB + '/' + encodeURIComponent(url), window.location.origin);
      const webMonURL = new URL(conf.webMonitoringProcessingURL, window.location.origin);
      return (<DiffView webMonitoringProcessingURL={webMonURL.toString()}
        page={{ url: encodeURIComponent(url) }}
        diffType={'SIDE_BY_SIDE_RENDERED'} a={urlA} b={urlB}
        loader={loader} errorHandledCallback={this.errorHandled}/>);
    }
  };

  _handleHeight () {
    const offsetHeight = this._oneFrame.contentDocument.documentElement.scrollHeight;
    const offsetWidth = this._oneFrame.contentDocument.documentElement.scrollWidth;
    if (offsetHeight > 0.1 * this._oneFrame.height) {
      this._oneFrame.height = offsetHeight + (offsetHeight * 0.01);
    } else {
      this._oneFrame.height = 0.5 * this._oneFrame.height;
    }
    if (offsetWidth > this._oneFrame.clientWidth) {
      this._oneFrame.width = offsetWidth;
    }
  }
}

DiffContainer.propTypes = {
  url: PropTypes.string.isRequired,
  timestampA: PropTypes.string,
  timestampB: PropTypes.string,
  conf: PropTypes.object.isRequired,
  loader: PropTypes.element,

  noTimestamps: (props, propName, componentName) => {
    // Disable linting that prompts changing "boolean" to 'boolean' because it will always return false.
    /* eslint-disable quotes */
    if (props.noTimestamps && !(typeof props.noTimestamps === "boolean")) {
      return new Error(`noTimestamps specified in '${componentName} should be boolean'.`);
    }
    /* eslint-enable quotes */
    if (!(props.noTimestamps || props.timestampA || props.timestampB)) {
      return new Error(`At least one of props 'timestampA' or 'timestampB' or noTimestamps must be specified in '${componentName}'.`);
    }
  }
};
