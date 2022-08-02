import React from 'react';
import PropTypes from 'prop-types';
import DiffView from './diff-view.jsx';
import '../css/diff-container.css';
import YmdTimestampHeader from './ymd-timestamp-header.jsx';
import DiffFooter from './footer.jsx';
import { isUrl, checkResponse, fetchWithTimeout } from '../js/utils.js';
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
    this.errorHandled = this.errorHandled.bind(this);
    this.getTimestamps = this.getTimestamps.bind(this);
    this.prepareDiffView = this.prepareDiffView.bind(this);
  }

  getTimestamps (timestampA, timestampB) {
    if (timestampA || timestampB) {
      if (timestampA && timestampB == null) {
        timestampB = '';
        this.setState({
          fetchedRaw: null,
          error: null,
          showDiff: true,
          timestampA: timestampA
        });
      } else if (timestampB && timestampA == null) {
        timestampA = '';
        this.setState({
          fetchedRaw: null,
          error: null,
          showDiff: true,
          timestampB: timestampB
        });
      } else {
        this.setState({
          fetchedRaw: null,
          error: null,
          showDiff: true,
          timestampA: timestampA,
          timestampB: timestampB
        });
      }
      if (timestampA !== this.state.timestampA || timestampB !== this.state.timestampB) {
        window.history.pushState({}, '', this.props.conf.urlPrefix + timestampA + '/' + timestampB + '/' + this.props.url);
      }
    }
  }

  errorHandled (errorCode) {
    this.setState({ error: errorCode });
  }

  render () {
    if (!isUrl(this.props.url)) {
      return this._invalidURL();
    }
    if (this.state.error) {
      return (
        <ErrorMessage url={this.props.url} timestamp={this.state.timestampA} code={this.state.error}/>);
    }
    if (!this.state.timestampA && !this.state.timestampB) {
      if (this.props.noTimestamps) {
        return (
          <div className="diffcontainer-view">
            <YmdTimestampHeader {...this.props} getTimestampsCallback={this.getTimestamps}
              isInitial={true} errorHandledCallback={this.errorHandled}/>
            {this._showNoTimestamps()}
          </div>);
      }
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader isInitial={true} {...this.props}
            errorHandledCallback={this.errorHandled}
            getTimestampsCallback={this.getTimestamps}/>
        </div>
      );
    }
    if (this.state.timestampA && this.state.timestampB) {
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader isInitial={false}
            {...this.props} getTimestampsCallback={this.getTimestamps}
            errorHandledCallback={this.errorHandled}/>
          {this.state.showDiff && this.prepareDiffView()}
          <DiffFooter/>
        </div>);
    }
    if (this.state.timestampA) {
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader {...this.props} getTimestampsCallback={this.getTimestamps}
            isInitial={false} errorHandledCallback={this.errorHandled}/>
          {this.state.showDiff && this._showOneSnapshot(true, this.state.timestampA)}
        </div>);
    }
    if (this.state.timestampB) {
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader isInitial={false} {...this.props}
            errorHandledCallback={this.errorHandled}
            getTimestampsCallback={this.getTimestamps}/>
          {this.state.showDiff && this._showOneSnapshot(false, this.state.timestampB)}
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
    if (this.state.fetchedRaw) {
      if (isLeft) {
        return (
          <div className={'side-by-side-render'}>
            <iframe height={window.innerHeight} onLoad={() => { this._handleHeight(); }}
              srcDoc={this.state.fetchedRaw}
              ref={(frame) => { this._oneFrame = frame; }}
            />
            <NoSnapshotURL/>
          </div>
        );
      }
      return (
        <div className={'side-by-side-render'}>
          <NoSnapshotURL/>
          <iframe height={window.innerHeight} onLoad={() => { this._handleHeight(); }}
            srcDoc={this.state.fetchedRaw}
            ref={(frame) => { this._oneFrame = frame; }}
          />
        </div>
      );
    }
    if (this.props.fetchSnapshotCallback) {
      this._handleSnapshotFetch(this.props.fetchSnapshotCallback(timestamp));
    } else {
      const url = new URL(this.props.conf.snapshotsPrefix + timestamp + '/' + encodeURIComponent(this.props.url),
        window.location.origin);
      this._handleSnapshotFetch(fetchWithTimeout(url.toString()));
    }

    const Loader = () => isNil(this.props.loader) ? <Loading/> : this.props.loader;
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

  prepareDiffView () {
    if (!this.state.error) {
      const urlA = new URL(this.props.conf.snapshotsPrefix + this.state.timestampA + '/' + encodeURIComponent(this.props.url),
        window.location.origin);
      const urlB = new URL(this.props.conf.snapshotsPrefix + this.state.timestampB + '/' + encodeURIComponent(this.props.url),
        window.location.origin);
      const webMonURL = new URL(this.props.conf.webMonitoringProcessingURL,
        window.location.origin);
      return (<DiffView webMonitoringProcessingURL={webMonURL.toString()}
        page={{ url: encodeURIComponent(this.props.url) }}
        diffType={'SIDE_BY_SIDE_RENDERED'} a={urlA} b={urlB}
        loader={this.props.loader} errorHandledCallback={this.errorHandled}/>);
    }
  }

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

  _invalidURL () {
    return (<div className="alert alert-danger" role="alert"><b>Oh snap!</b> Invalid URL {this.props.url}</div>);
  }
}

DiffContainer.propTypes = {
  url: PropTypes.string.isRequired,
  timestampA: PropTypes.string,
  timestampB: PropTypes.string,
  conf: PropTypes.object.isRequired,
  loader: PropTypes.element,
  fetchCDXCallback: PropTypes.func,
  fetchSnapshotCallback: PropTypes.func,

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
