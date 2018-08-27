import React from 'react';
import DiffView from './diff-view.jsx';
import '../css/diff-container.css';
import TimestampHeader from './timestamp-header.jsx';
import DiffFooter from './footer.jsx';
import { Redirect } from 'react-router-dom';
import {isStrUrl} from '../js/utils.js';
import NoSnapshotURL from './no-snapshot-url.jsx';
import ErrorMessage from './errors.jsx';

/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 */
export default class DiffContainer extends React.Component {
  _timestampsValidated = false;
  _redirectToValidatedTimestamps = false;
  _errorCode = '';
  constructor (props) {
    super(props);
    this.state = {
      fetchedRaw: null,
      showError: false
    };
    this._oneFrame = null;
    this.errorHandled = this.errorHandled.bind(this);
    this.prepareDiffView = this.prepareDiffView.bind(this);
  }

  errorHandled (errorCode) {
    this.errorCode = errorCode;
    this.setState({showError: true});
  }

  render () {
    if (this._urlIsInvalid()) {
      return this._invalidURL();
    }
    if (this._redirectToValidatedTimestamps) {
      return(this._renderRedirect());
    }
    if (this.state.showError){
      return(
        <ErrorMessage site ={this.props.site} code ={'404'}/>);
    }
    if (!this.props.timestampA && !this.props.timestampB) {
      return (
        <div className="diffcontainer-view">
          <TimestampHeader isInitial={true} {...this.props}
            errorHandledCallback={this.errorHandled}/>
        </div>
      );
    }
    if (!this._timestampsValidated) {
      {this._checkTimestamps(this.props.timestampA, this.props.timestampB);}
    }
    if (this.props.timestampA && this.props.timestampB) {
      return (
        <div className="diffcontainer-view">
          <TimestampHeader isInitial={false}
            {...this.props}
            errorHandledCallback={this.errorHandled}/>
          {this.prepareDiffView()}
          <DiffFooter/>
        </div>);
    }
    if (this.props.timestampA) {
      return (
        <div className="diffcontainer-view">
          <TimestampHeader {...this.props}
            isInitial={false} errorHandledCallback={this.errorHandled}/>
          {this._showOneSnapshot(true, this.props.timestampA)}
        </div>);
    }
    if (this.props.timestampB) {
      return (
        <div className="diffcontainer-view">
          <TimestampHeader isInitial={false} {...this.props}
            errorHandledCallback={this.errorHandled}/>
          {this._showOneSnapshot(false, this.props.timestampB)}
        </div>);
    }
  }

  _renderRedirect () {
    this._redirectToValidatedTimestamps = false;
    return (<Redirect to={this.state.newURL} />);
  }

  _showOneSnapshot (isLeft, timestamp) {
    if(this.state.fetchedRaw){
      if (isLeft){
        return(
          <div className={'side-by-side-render'}>
            <iframe height={window.innerHeight} onLoad={()=>{this._handleHeight();}}
              srcDoc={this.state.fetchedRaw} scrolling={'no'}
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
            srcDoc={this.state.fetchedRaw} scrolling={'no'}
            ref={frame => this._oneFrame = frame}
          />
        </div>
      );
    }
    let url = this.props.conf.snapshotsPrefix + timestamp + '/' + this.props.site;
    fetch(url)
      .then(response => {return this._checkResponse(response);})
      .then(response => {return response.text();})
      .then((responseText) => {
        this.setState({fetchedRaw: responseText});
      })
      .catch(error => {this.errorHandled(error.message);});
    const Loader = () => this.props.loader;
    return <Loader/>;
  }

  prepareDiffView(){
    if (!this.state.showError){
      let urlA = this.props.conf.snapshotsPrefix + this.props.timestampA + '/' + encodeURIComponent(this.props.site);
      let urlB = this.props.conf.snapshotsPrefix + this.props.timestampB + '/' + encodeURIComponent(this.props.site);

      return(<DiffView webMonitoringProcessingURL={this.props.conf.webMonitoringProcessingURL}
        page={{url: encodeURIComponent(this.props.site)}} diffType={'SIDE_BY_SIDE_RENDERED'} a={urlA} b={urlB}
        loader={this.props.loader} iframeLoader={this.props.conf.iframeLoader}/>);
    }
  }

  _checkTimestamps () {
    var urlA, urlB, fetchedTimestampB;
    if (this.props.timestampA){
      urlA = this.props.conf.snapshotsPrefix + this.props.timestampA + '/' + this.props.site;
    }
    fetch(urlA, {redirect: 'follow'})
      .then(response => {return this._checkResponse(response);})
      .then(response => {
        if (response) {
          urlA = response.url;
          let fetchedTimestampA = urlA.split('/')[4];
          if (this.props.timestampA !== fetchedTimestampA) {
            this.redirectToValidatedTimestamps = true;
          }
          if (this.props.timestampB) {
            urlB = this.props.conf.snapshotsPrefix + this.props.timestampB + '/' + this.props.site;
            fetch(urlB, {redirect: 'follow'})
              .then(response => {return this._checkResponse(response);})
              .then(response => {
                urlB = response.url;
                fetchedTimestampB = urlB.split('/')[4];
                if (this.props.timestampB !== fetchedTimestampB) {
                  this.redirectToValidatedTimestamps = true;
                }
              });
          }
          this.timestampsValidated = true;
          console.log('checkTimestamps--setState');
          this.setState({newURL: '/diff/' + fetchedTimestampA + '/' + fetchedTimestampB + '/' + this.props.site});
        }
      })
      .catch(error => {this.errorHandled(error.message);});
  }

  _handleHeight () {
    let offsetHeight = this._oneFrame.contentDocument.scrollingElement.offsetHeight;
    if (offsetHeight > 0.1 * this._oneFrame.height) {
      this._oneFrame.height = offsetHeight;
    } else {
      this._oneFrame.height = 0.5 * this._oneFrame.height;
    }
  }

  _urlIsInvalid () {
    return (!isStrUrl(this.props.site));
  }

  _invalidURL () {
    return (<div className="alert alert-danger" role="alert"><b>Oh snap!</b> Invalid URL {this.props.site}</div>);
  }

  _checkResponse(response) {
    if (response) {
      if (!response.ok) {
        throw Error(response.status);
      }
      return response;
    }
  }
}