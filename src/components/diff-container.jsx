import React from 'react';
import DiffView from './diff-view.jsx';
import '../css/diff-container.css';
import TimestampHeader from './timestamp-header.jsx';
import DiffFooter from './footer.jsx';
import Loading from './loading.jsx';
import { Redirect } from 'react-router-dom';
import isStrUrl from '../js/utils.js';
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
          <TimestampHeader site={this.props.site} timestampA={this.props.timestampA} limit={this.props.limit}
            timestampB={this.props.timestampB} isInitial={false}
            waybackLoaderPath={this.props.waybackLoaderPath}
            fetchCallback={this.props.fetchCallback}
            snapshotsNotFoundCallback={this.snapshotsNotFound}/>
          {this.prepareDiffView()}
          <DiffFooter/>
        </div>);
    }
    if (this.props.timestampA) {
      return (
        <div className="diffcontainer-view">
          <TimestampHeader site={this.props.site} timestampA={this.props.timestampA} limit={this.props.limit}
            isInitial={false} waybackLoaderPath={this.props.waybackLoaderPath}
            fetchCallback={this.props.fetchCallback} snapshotsNotFoundCallback={this.snapshotsNotFound}/>
          {this.showLeftSnapshot()}
        </div>);
    }
    if (this.props.timestampB) {
      return (
        <div className="diffcontainer-view">
          <TimestampHeader site={this.props.site} limit={this.props.limit}
            timestampB={this.props.timestampB} isInitial={false}
            waybackLoaderPath={this.props.waybackLoaderPath}
            fetchCallback={this.props.fetchCallback} snapshotsNotFoundCallback={this.snapshotsNotFound}/>
          {this.showRightSnapshot()}
        </div>);
    }
    return (
      <div className="diffcontainer-view">
        <TimestampHeader isInitial={true} limit={this.props.limit}
          site={this.props.site} waybackLoaderPath={this.props.waybackLoaderPath}
          fetchCallback={this.props.fetchCallback} snapshotsNotFoundCallback={this.snapshotsNotFound}/>
      </div>
    );
  }

  renderRedirect () {
    this.redirectToValidatedTimestamps = false;
    return (<Redirect to={this.state.newURL} />);
  }

  showLeftSnapshot () {
    if(this.state.fetchedRaw){
      var urlB;
      if(this.props.noSnapshotURL) {
        urlB = this.props.noSnapshotURL;
      } else {
        urlB= 'https://users.it.teithe.gr/~it133996/noSnapshot.html';
      }
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
    let urlA = 'http://web.archive.org/web/' + this.props.timestampA + '/' + this.props.site;
    fetch(urlA)
      .then(response => {
        return response.text();
      }).then((responseText) => {
        this.setState({fetchedRaw: responseText});
      });
    return(<Loading/>);
  }

  prepareDiffView(){
    if (!this.state.showNotFound){
      let urlA = 'http://web.archive.org/web/' + this.props.timestampA + '/' + this.props.site;
      let urlB = 'http://web.archive.org/web/' + this.props.timestampB + '/' + this.props.site;

      return(<DiffView webMonitoringProcessingURL={this.props.webMonitoringProcessingURL}
        page={{url: this.props.site}} diffType={'SIDE_BY_SIDE_RENDERED'} a={urlA} b={urlB}
        waybackLoaderPath={this.props.waybackLoaderPath}/>);
    }
  }

  checkTimestamps (urlA, urlB) {
    if (urlA){
      urlA = 'http://web.archive.org/web/' + this.props.timestampA + '/' + this.props.site;
    }
    fetch(urlA, {redirect: 'follow'})
      .then(response => {
        urlA = response.url;
        let fetchedTimestampA = urlA.split('/')[4];
        if (urlB) {
          urlB = 'http://web.archive.org/web/' + this.props.timestampB + '/' + this.props.site;
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
                this.setState({newURL: '/diff/' + fetchedTimestampA + '/' + fetchedTimestampB + '/' + this.props.site});
              }
            });
        }
        this.timestampsValidated = true;
      });
  }

  redirectToValTimestamps(){
    return (<Redirect push to='/target' />);
  }

  showRightSnapshot () {
    if(this.state.fetchedRaw){
      var urlA;
      if(this.props.noSnapshotURL) {
        urlA = this.props.noSnapshotURL;
      } else {
        urlA= 'https://users.it.teithe.gr/~it133996/noSnapshot.html';
      }
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
    let urlB = 'http://web.archive.org/web/' + this.props.timestampB + '/' + this.props.site;
    fetch(urlB)
      .then(response => {
        return response.text();
      }).then((responseText) => {
        this.setState({fetchedRaw: responseText});
      });
    return(<Loading/>);
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