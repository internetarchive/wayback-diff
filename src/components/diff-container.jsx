import React from 'react';
import PropTypes from 'prop-types';
import DiffView from './diff-view.jsx';
import '../css/diff-container.css';
import YmdTimestampHeader from './ymd-timestamp-header.jsx';
import DiffFooter from './footer.jsx';
import {isStrUrl, handleRelativeURL, checkResponse, fetch_with_timeout} from '../js/utils.js';
import NoSnapshotURL from './no-snapshot-url.jsx';
import ErrorMessage from './errors.jsx';

/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 */
export default class DiffContainer extends React.Component {
  _errorCode = '';
  constructor (props) {
    super(props);
    this.state = {
      fetchedRaw: null,
      showError: false,
      timestampA: this.props.timestampA,
      timestampB: this.props.timestampB
    };
    this._oneFrame = null;
    this.errorHandled = this.errorHandled.bind(this);
    this.changeTimestamps = this.changeTimestamps.bind(this);
    this.prepareDiffView = this.prepareDiffView.bind(this);
  }

  changeTimestamps(timestampA, timestampB){
    window.history.pushState({}, '', this.props.conf.urlPrefix + timestampA + '/' + timestampB + '/' + this.props.url);
    this.setState({
      fetchedRaw: null,
      showError: false,
      timestampA: timestampA,
      timestampB: timestampB});
  }

  errorHandled (errorCode) {
    this._errorCode = errorCode;
    this.setState({showError: true});
  }

  render () {
    if (this._urlIsInvalid()) {
      return this._invalidURL();
    }
    if (this.state.showError){
      return(
        <ErrorMessage url={this.props.url} code={this._errorCode}/>);
    }
    if (!this.state.timestampA && !this.state.timestampB) {
      if (this.props.noTimestamps){
        return (
          <div className="diffcontainer-view">
            <YmdTimestampHeader {...this.props} changeTimestampsCallback={this.changeTimestamps}
              isInitial={true} errorHandledCallback={this.errorHandled}/>
            {this._showNoTimestamps()}
          </div>);
      }
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader isInitial={true} {...this.props}
            errorHandledCallback={this.errorHandled}
            changeTimestampsCallback={this.changeTimestamps}/>
        </div>
      );
    }
    if (this.state.timestampA && this.state.timestampB) {
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader isInitial={false}
            {...this.props} changeTimestampsCallback={this.changeTimestamps}
            errorHandledCallback={this.errorHandled}/>
          {this.prepareDiffView()}
          <DiffFooter/>
        </div>);
    }
    if (this.state.timestampA) {
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader {...this.props} changeTimestampsCallback={this.changeTimestamps}
            isInitial={false} errorHandledCallback={this.errorHandled}/>
          {this._showOneSnapshot(true, this.state.timestampA)}
        </div>);
    }
    if (this.state.timestampB) {
      return (
        <div className="diffcontainer-view">
          <YmdTimestampHeader isInitial={false} {...this.props}
            errorHandledCallback={this.errorHandled}
            changeTimestampsCallback={this.changeTimestamps}/>
          {this._showOneSnapshot(false, this.state.timestampB)}
        </div>);
    }
  }

  _showNoTimestamps() {
    return(
      <div className={'side-by-side-render'}>
        <NoSnapshotURL/>
        <NoSnapshotURL/>
      </div>
    );
  }

  _showOneSnapshot (isLeft, timestamp) {
    this._timestampsValidated = true;
    if(this.state.fetchedRaw){
      if (isLeft){
        return(
          <div className={'side-by-side-render'}>
            <iframe height={window.innerHeight} onLoad={()=>{this._handleHeight();}}
              srcDoc={this.state.fetchedRaw}
              ref={frame => this._oneFrame = frame}
            />
            <NoSnapshotURL/>
          </div>
        );
      }
      return(
        <div className={'side-by-side-render'}>
          <NoSnapshotURL/>
          <iframe height={window.innerHeight} onLoad={()=>{this._handleHeight();}}
            srcDoc={this.state.fetchedRaw}
            ref={frame => this._oneFrame = frame}
          />
        </div>
      );
    }
    if (this.props.fetchSnapshotCallback){
      this._handleSnapshotFetch(this.props.fetchSnapshotCallback(timestamp));
    }else {
      const url = handleRelativeURL(this.props.conf.snapshotsPrefix) + timestamp + '/' + encodeURIComponent(this.props.url);
      this._handleSnapshotFetch(fetch_with_timeout(fetch(url)));
    }

    const Loader = () => this.props.loader;
    return <Loader/>;
  }

  _handleSnapshotFetch(promise){
    promise
      .then(response => {return checkResponse(response);})
      .then(response => {
        var contentType = response.headers.get('content-type');
        if(contentType && contentType.includes('text/html')) {
          return response.text();
        } else {
          return '<iframe src='+response.url+' style="width: 98%; position: absolute; height: 98%;" />';
        }
      })
      .then((responseText) => {
        this.setState({fetchedRaw: responseText});
      })
      .catch(error => {this.errorHandled(error.message);});
  }

  prepareDiffView(){
    if (!this.state.showError){
      let urlA = handleRelativeURL(this.props.conf.snapshotsPrefix) + this.state.timestampA + '/' + encodeURIComponent(this.props.url);
      let urlB = handleRelativeURL(this.props.conf.snapshotsPrefix) + this.state.timestampB + '/' + encodeURIComponent(this.props.url);

      return(<DiffView webMonitoringProcessingURL={handleRelativeURL(this.props.conf.webMonitoringProcessingURL)}
        page={{url: encodeURIComponent(this.props.url)}} diffType={'SIDE_BY_SIDE_RENDERED'} a={urlA} b={urlB}
        loader={this.props.loader} iframeLoader={this.props.conf.iframeLoader} errorHandledCallback={this.errorHandled}/>);
    }
  }

  _handleHeight () {
    let offsetHeight = this._oneFrame.contentDocument.documentElement.scrollHeight;
    let offsetWidth = this._oneFrame.contentDocument.documentElement.scrollWidth;
    if (offsetHeight > 0.1 * this._oneFrame.height) {
      this._oneFrame.height = offsetHeight + (offsetHeight * 0.01);
    } else {
      this._oneFrame.height = 0.5 * this._oneFrame.height;
    }
    if (offsetWidth > this._oneFrame.clientWidth) {
      this._oneFrame.width = offsetWidth;
    }
  }

  _urlIsInvalid () {
    return (!isStrUrl(this.props.url));
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
    if (props.noTimestamps && !props.noTimestamps.isPrototypeOf(Boolean)){
      return new Error(`noTimestamps specified in '${componentName} should be boolean'.`);
    } else if (!(props.noTimestamps in window || props.timestampA in window || props.timestampB in window)) {
      return new Error(`At least one of props 'timestampA' or 'timestampB' or noTimestamps must be specified in '${componentName}'.`);
    }
  }
};
