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

    this.handleMethodChange = this.handleMethodChange.bind(this);
    this.prepareDiffView = this.prepareDiffView.bind(this);

  }

  handleMethodChange(method) {
    this.setState({selectedMethod: method});
  }

  render () {

    if (this.props.timestampA && this.props.timestampB) {
      return (
        <div className="diffcontainer-view">
          <TimestampHeader site = {this.props.site} timestampA={this.props.timestampA}
            timestampB={this.props.timestampB} isInitial = {false}
            fetchCallback = {this.props.fetchCallback} diffMethodSelectorCallback = {this.handleMethodChange}/>
          {this.prepareDiffView()}
        </div>);
    }
    return(
      <div className="diffcontainer-view">
        <TimestampHeader isInitial={true} timestampA={this.props.timestampA}
          timestampB={this.props.timestampB} site = {this.props.site}
          fetchCallback = {this.props.fetchCallback} diffMethodSelectorCallback = {this.handleMethodChange}/>
      </div>
    );

    // return (
    //   <Router>
    //     <Switch>
    //       <Route exact path = '/diff/:timestampA/:timestampB/:site' render={({location}) =>
    //
    //       }/>
    //       <Route exact path = '/diff/:site' render={ () =>
    //
    //       }/>
    //     </Switch>
    //   </Router>
    // );
  }

  prepareDiffView(){

    if(this.state.selectedMethod !== undefined) {

      // if (/[0-9]{14}\/[0-9]{14}\/.+/.test(path)) {
      // path = path.split('/');
      // let site = path[path.length-1];
      // let timestampA = path[path.length-3];
      // let timestampB = path[path.length-2];
      let urlA = 'http://web.archive.org/web/' + this.props.timestampA + '/' + this.props.site;
      let urlB = 'http://web.archive.org/web/' + this.props.timestampB + '/' + this.props.site;

      if (this.state.timestampsValidated){
        return(<DiffView page={{url: this.props.site}}
          diffType={this.state.selectedMethod[0]} a={urlA} b={urlB}/>);

      }
      this.checkURL(urlA, urlB);
    }
    // }
  }

  checkURL (urlA, urlB) {

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