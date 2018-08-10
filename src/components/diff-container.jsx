import React from 'react';
import DiffView from './diff-view.jsx';
import '../css/diff-container.css';
import TimestampHeader from './timestamp-header.jsx';

/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 */
export default class DiffContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {timestampsValidated: false};

    this.prepareDiffView = this.prepareDiffView.bind(this);

  }

  render () {

    if (this.props.timestampA && this.props.timestampB) {
      return (
        <div className="diffcontainer-view">
          <TimestampHeader site = {this.props.site} timestampA={this.props.timestampA}
            timestampB={this.props.timestampB} isInitial = {false} waybackLoaderPath={this.props.waybackLoaderPath}
            fetchCallback = {this.props.fetchCallback}/>
          {this.prepareDiffView()}
        </div>);
    }
    return(
      <div className="diffcontainer-view">
        <TimestampHeader isInitial={true} timestampA={this.props.timestampA}
          timestampB={this.props.timestampB} site = {this.props.site} waybackLoaderPath={this.props.waybackLoaderPath}
          fetchCallback = {this.props.fetchCallback}/>
      </div>
    );
  }

  prepareDiffView(){
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
}