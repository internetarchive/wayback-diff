import React from 'react';
import DiffView from './diff-view.jsx';
import '../css/diff-container.css';
import TimestampHeader from './timestamp-header.jsx';
import DiffFooter from './footer.jsx';
import { Redirect } from 'react-router-dom';
import {isStrUrl} from '../js/utils.js';
/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 */
export default class DiffContainer extends React.Component {
  timestampsValidated = false;
  redirectToValidatedTimestamps = false;
  constructor (props) {
    super(props);
    this.state = {
      fetchedRaw: null,
      showNotFound: false
    };
    this._oneFrame = null;
    this.snapshotsNotFound = this.snapshotsNotFound.bind(this);
    this.prepareDiffView = this.prepareDiffView.bind(this);
  }

  snapshotsNotFound () {
    this.setState({showNotFound: true});
  }


  render () {
    if (this.urlIsInvalid()) {
      return this.invalidURL();
    }
    if (this.redirectToValidatedTimestamps) {
      return(this.renderRedirect());
    }
    if (!this.timestampsValidated) {
      {this.checkTimestamps(this.props.timestampA, this.props.timestampB);}
    }
    if (this.props.timestampA && this.props.timestampB) {
      return (
        <div className="diffcontainer-view">
          <TimestampHeader isInitial={false}
            {...this.props}
            snapshotsNotFoundCallback={this.snapshotsNotFound}/>
          {this.prepareDiffView()}
          <DiffFooter/>
        </div>);
    }
    if (this.props.timestampA) {
      return (
        <div className="diffcontainer-view">
          <TimestampHeader {...this.props}
            isInitial={false} snapshotsNotFoundCallback={this.snapshotsNotFound}/>
          {this.showLeftSnapshot()}
        </div>);
    }
    if (this.props.timestampB) {
      return (
        <div className="diffcontainer-view">
          <TimestampHeader isInitial={false} {...this.props}
            snapshotsNotFoundCallback={this.snapshotsNotFound}/>
          {this.showRightSnapshot()}
        </div>);
    }
    return (
      <div className="diffcontainer-view">
        <TimestampHeader isInitial={true} {...this.props}
          snapshotsNotFoundCallback={this.snapshotsNotFound}/>
      </div>
    );
  }

  renderRedirect () {
    this.redirectToValidatedTimestamps = false;
    return (<Redirect to={this.state.newURL} />);
  }

  showLeftSnapshot () {
    if(this.state.fetchedRaw){
      let urlB = this.props.conf.noSnapshotURL;
      return(
        <div className={'side-by-side-render'}>
          <iframe height={window.innerHeight} onLoad={()=>{this.handleHeight();}}
            srcDoc={this.state.fetchedRaw} scrolling={'no'}
            ref={frame => this._oneFrame = frame}
          />
          {React.createElement('iframe', { src: urlB})}
        </div>
      );
    }
    let urlA = this.props.conf.snapshotsPrefix + this.props.timestampA + '/' + this.props.site;
    fetch(urlA)
      .then(response => {
        return response.text();
      }).then((responseText) => {
        this.setState({fetchedRaw: responseText});
      });
    const Loader = () => this.props.loader;
    return <Loader/>;
  }

  prepareDiffView(){
    if (!this.state.showNotFound){
      let urlA = this.props.conf.snapshotsPrefix + this.props.timestampA + '/' + this.props.site;
      let urlB = this.props.conf.snapshotsPrefix + this.props.timestampB + '/' + this.props.site;

      return(<DiffView webMonitoringProcessingURL={this.props.conf.webMonitoringProcessingURL}
        page={{url: this.props.site}} diffType={'SIDE_BY_SIDE_RENDERED'} a={urlA} b={urlB}
        loader={this.props.loader} iframeLoader={this.props.conf.iframeLoader}/>);
    }
  }

  checkTimestamps (urlA, urlB) {
    if (urlA){
      urlA = this.props.conf.snapshotsPrefix + this.props.timestampA + '/' + this.props.site;
    }
    fetch(urlA, {redirect: 'follow'})
      .then(response => {
        urlA = response.url;
        let fetchedTimestampA = urlA.split('/')[4];
        if (urlB) {
          urlB = this.props.conf.snapshotsPrefix + this.props.timestampB + '/' + this.props.site;
          fetch(urlB, {redirect: 'follow'})
            .then(response => {
              urlB = response.url;
              let fetchedTimestampB = urlB.split('/')[4];

              if (this.props.timestampA !== fetchedTimestampA || this.props.timestampB !== fetchedTimestampB) {
                let tempURL = urlA.split('/');
                var url = '';
                for (var i = 7; i <= (tempURL.length - 1); i++) {
                  url = url + tempURL[i];
                }
                this.timestampsValidated = true;
                this.redirectToValidatedTimestamps = true;
                this.setState({newURL: this.props.conf.urlPrefix + fetchedTimestampA + '/' + fetchedTimestampB + '/' + this.props.site});
              }
            });
        }
        this.timestampsValidated = true;
      });
  }

  showRightSnapshot () {
    if(this.state.fetchedRaw){
      let urlA = this.props.conf.noSnapshotURL;
      return(
        <div className={'side-by-side-render'}>
          {React.createElement('iframe', { src: urlA})}
          <iframe height={window.innerHeight} onLoad={()=>{this.handleHeight();}}
            srcDoc={this.state.fetchedRaw} scrolling={'no'}
            ref={frame => this._oneFrame = frame}
          />
        </div>
      );
    }
    let urlB = this.props.conf.snapshotsPrefix + this.props.timestampB + '/' + this.props.site;
    fetch(urlB)
      .then(response => {
        return response.text();
      }).then((responseText) => {
        this.setState({fetchedRaw: responseText});
      });
    const Loader = () => this.props.loader;
    return <Loader/>;
  }

  handleHeight () {
    let offsetHeight = this._oneFrame.contentDocument.scrollingElement.offsetHeight;
    if (offsetHeight > 0.1 * this._oneFrame.height) {
      this._oneFrame.height = offsetHeight;
    } else {
      this._oneFrame.height = 0.5 * this._oneFrame.height;
    }
  }

  urlIsInvalid () {
    return (!isStrUrl(this.props.site));
  }

  invalidURL () {
    return (<div className="alert alert-danger" role="alert"><b>Oh snap!</b> Invalid URL {this.props.site}</div>);
  }
}