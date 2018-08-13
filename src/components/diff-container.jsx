import React from 'react';
import DiffView from './diff-view.jsx';
import '../css/diff-container.css';
import TimestampHeader from './timestamp-header.jsx';
import DiffFooter from './footer.jsx';
import Loading from './loading.jsx';

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
      timestampsValidated: false,
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
            srcdoc={this.state.fetchedRaw} scrolling={'no'}
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

      if (this.state.timestampsValidated){
        return(<DiffView webMonitoringProcessingURL={this.props.webMonitoringProcessingURL}
          webMonitoringProcessingPort={this.props.webMonitoringProcessingPort} page={{url: this.props.site}}
          diffType={'SIDE_BY_SIDE_RENDERED'} a={urlA} b={urlB} waybackLoaderPath={this.props.waybackLoaderPath}/>);
      } else {
        this.checkTimestamps(urlA, urlB);
      }
    }
  }

  checkTimestamps (urlA, urlB) {
    fetch(urlA, {redirect: 'follow'})
      .then(response => {
        urlA = response.url;
        let fetchedTimestampA = urlA.split('/')[4];
        fetch(urlB, {redirect: 'follow'})
          .then(response => {
            urlB = response.url;
            let fetchedTimestampB = urlB.split('/')[4];

            if (this.props.timestampA !== fetchedTimestampA || this.props.timestampB !== fetchedTimestampB) {
              let tempURL = urlA.split('/');
              var url = '';
              for(var i = 7; i <= (tempURL.length-1); i++){
                url = url + tempURL[i];
              }
              window.location.href = '/diff/' + fetchedTimestampA + '/' + fetchedTimestampB + '/' + url;
            } else {
              this.setState({timestampsValidated: true});
            }
          });
      });
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
            srcdoc={this.state.fetchedRaw} scrolling={'no'}
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
    this._oneFrame.height = this._oneFrame.contentDocument.scrollingElement.offsetHeight;
  }

  urlIsInvalid () {
    const regex = /^([a-z][a-z0-9+\-.]*)\.([a-z0-9+\-/.]+)/;
    return (!regex.test(this.props.site));
  }

  invalidURL () {
    return (<p style={{textAlign: 'center'}}>Invalid URL {this.props.site}</p>);
  }
}