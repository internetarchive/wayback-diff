import React from 'react';
import D3Sunburst from './d3-sunburst.jsx';
import '../../css/diffgraph.css';
import { similarity, handleRelativeURL, checkResponse, fetch_with_timeout, getUTCDateFormat } from '../../js/utils.js';
import {getSize} from './sunburst-container-utils.js';
import ErrorMessage from '../errors.jsx';
import PropTypes from 'prop-types';
import SMBase64 from 'smbase64';

/**
 * Container of d3 Sunburst diagram
 *
 * @class SunburstContainer
 * @extends {React.Component}
 */

export default class SunburstContainer extends React.Component {

  rootLabel;
  constructor(props) {
    super(props);
    this.isUpdate = 0;
    this.state = {
      simhashData: null
    };
  }

  componentDidUpdate (){
    if (this.isUpdate < 2) {
      getSize();
      this.isUpdate ++;
    }
  }

  render () {
    if (this.state.error){
      return(
        <ErrorMessage url={this.props.url} code={this.state.error} year={this.state.timestamp ? this.state.timestamp.substring(0, 4) : this.props.timestamp.substring(0, 4)}
          conf={this.props.conf} errorHandledCallback={this.errorHandled}/>);
    }
    if (this.state.simhashData) {
      return (
        <div className="sunburst-container">
          {/*<div id="root-cell-tooltip">{this.rootLabel}</div>*/}
          <D3Sunburst urlPrefix={this.props.conf.urlPrefix} url={this.props.url} simhashData={this.state.simhashData}/>
          <div className="heat-map-legend">
            <div className="heat-map-legend-caption">Variation</div>
            <div className="heat-map-legend-summary">
              <div className="heat-map-legend-summary-min-caption">Low</div>
              <div className="heat-map-legend-summary-graphics">
                <div className="heat-map-legend-bar" style={{backgroundColor: 'rgb(241, 231, 119)', height: '4px'}}/>
                <div className="heat-map-legend-bar" style={{backgroundColor: 'rgb(197, 213, 108)', height: '5px'}}/>
                <div className="heat-map-legend-bar" style={{backgroundColor: 'rgb(159, 197, 99)', height: '6px'}}/>
                <div className="heat-map-legend-bar" style={{backgroundColor: 'rgb(141, 184, 101)', height: '7px'}}/>
                <div className="heat-map-legend-bar" style={{backgroundColor: 'rgb(107, 151, 117)', height: '8px'}}/>
              </div>
              <div className="heat-map-legend-summary-max-caption">High</div>
            </div>
          </div>
          <br/>
          <div>This diagram illustrates the differences of capture <a href={this.props.conf.snapshotsPrefix + this.state.timestamp + '/' + this.props.url}>{getUTCDateFormat(this.state.timestamp)}</a> of {this.props.url} compared to other {this.state.timestamp.substring(0, 4)} captures.</div>
        </div>
      );
    }
    const Loader = () => this.props.loader;
    if (this.state.timestamp) {
      this._fetchTimestampSimhashData();
    } else {
      this._validateTimestamp();
    }
    return (<Loader/>);
  }

  _validateTimestamp() {
    let promise;
    if (this.props.fetchSnapshotCallback) {
      promise = this.props.fetchSnapshotCallback(this.props.timestamp);
    } else {
      const url = handleRelativeURL(this.props.conf.cdxServer) + 'search?url=' + encodeURIComponent(this.props.url) + '&closest=' + this.props.timestamp + '&filter=!mimetype:warc/revisit&format=json&sort=closest&limit=1&fl=timestamp';
      promise = fetch_with_timeout(fetch(url));
    }
    promise.then(response => {return checkResponse(response).json();})
      .then(data => {
        if (this.props.timestamp !== `${data}`) {
          window.history.pushState({}, '', this.props.conf.diffgraphPrefix + data + '/' + this.props.url);
          this.setState({timestamp: `${data}`});
        } else {
          this.setState({timestamp: this.props.timestamp});
        }
      })
      .catch(error => {this.errorHandled(error.message);});
  }

  errorHandled (errorCode) {
    this.setState({error: errorCode});
  }

  _fetchTimestampSimhashData () {
    const url = `${this.props.conf.waybackDiscoverDiff}/simhash?url=${encodeURIComponent(this.props.url)}&timestamp=${this.state.timestamp}`;
    fetch_with_timeout(fetch(url)).then(response => {return checkResponse(response);})
      .then(response => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.length === 0) {
          throw Error('NoSimhash');
        }
        const json = this._decodeJson(jsonResponse);
        this._fetchSimhashData(json);
      })
      .catch(error => {this.errorHandled(error.message);});
  }

  _fetchSimhashData (timestampJson) {
    const url = `${this.props.conf.waybackDiscoverDiff}/simhash?url=${encodeURIComponent(this.props.url)}&year=${this.state.timestamp.substring(0, 4)}`;
    fetch_with_timeout(fetch(url)).then(response => {return checkResponse(response);})
      .then(response => response.json())
      .then((jsonResponse) => {
        var json = this._decodeJson(jsonResponse);
        let data = this._calcDistance(json, timestampJson);
        this._createLevels(data, timestampJson);
      })
      .catch(error => {this.errorHandled(error.message);});
  }

  /*
  The _decodeJson function assumes the task of decoding the simhash
  value received from wayback-discover-diff in base64 into a number.
  This function handles both a JSON array and a single JSON value.
   */

  _decodeJson(json){
    let base64 = new SMBase64();
    if(json.length) {
      for (var i = 0; i < json.length; i++) {
        json[i][1] = json[i][1].toString().replace(/=/, '');
        json[i][1] = base64.toNumber(json[i][1]);
      }
      return json;
    }

    json.simhash = json.simhash.toString().replace(/=/, '');
    json.simhash = base64.toNumber(json.simhash);

    return [this.state.timestamp, json.simhash];
  }

  /*
  _calcDistance receives two JSONs. The first variable contains
  all the timestamps for the selected year and webpage and their
  simhash values and the second one the selected timestamp and
  its simhash value.

  It returns a JSON variable containing all the timestamps for
  the selected year and webpage and their similarity index to
  the selected timestamp. Also, it saves the highest and the
  lowest similarity index into instance variables.
   */

  _calcDistance(json, timestamp){
    this._mostSimilar = 0;
    this._lessSimilar = 1;
    for (var i = 0; i<json.length; i++){
      json[i][1] = similarity(timestamp[1], json[i][1]);
      if (this._lessSimilar > json[i][1]) {
        this._lessSimilar = json[i][1];
      }
      if (this._mostSimilar< json[i][1]) {
        this._mostSimilar = json[i][1];
      }
    }
    return json;
  }

  /*
  This function receives the JSON fetched from wayback-discover-diff
  and produces the data tree required for the Sunburst diagram.

  It separates the snapshots into 5 or less "difference steps"
  depending on the minimum and maximum percentage of difference
  between the selected snapshot and the rest of the snapshots
  for the same year.
   */

  _createLevels(json, timestamp) {
    var firstLevel = [];
    var secondLevel = [];
    var thirdLevel = [];
    var fourthLevel = [];
    var fifthLevel = [];
    let step = 0.1;

    const colors = ['#dddddd', '#f1e777', '#c5d56c', '#8db865', '#6b9775', '#4d7a83'];

    let diffLevels = (this._mostSimilar - this._lessSimilar);

    if (diffLevels > 0.2) {
      step = diffLevels/5;
    }


    for (var i = 0; i<json.length; i++){
      if (json[i][1] !== 1) {
        if (json[i][1] <= this._lessSimilar + step) {
          fifthLevel.push({name: getUTCDateFormat(json[i][0]), timestamp: json[i][0], bigness: 10, similarity: 1 - json[i][1], clr: colors[5], children: []});
        } else if (json[i][1] <= this._lessSimilar + 2 * step) {
          fourthLevel.push({name: getUTCDateFormat(json[i][0]), timestamp: json[i][0], bigness: 10, similarity: 1 - json[i][1], clr: colors[4], children: []});
        } else if (json[i][1] <= this._lessSimilar + 3*step) {
          thirdLevel.push({name: getUTCDateFormat(json[i][0]), timestamp: json[i][0], bigness: 10, similarity: 1 - json[i][1], clr: colors[3], children: []});
        } else if (json[i][1] <= this._lessSimilar + 4*step) {
          secondLevel.push({name: getUTCDateFormat(json[i][0]), timestamp: json[i][0], bigness: 10, similarity: 1 - json[i][1], clr: colors[2], children: []});
        } else {
          firstLevel.push({name: getUTCDateFormat(json[i][0]), timestamp: json[i][0], bigness: 10, similarity: 1 - json[i][1], clr: colors[1], children: []});
        }
      }
    }

    while (firstLevel.length === 0) {
      firstLevel = secondLevel;
      secondLevel = thirdLevel;
      thirdLevel = fourthLevel;
      fourthLevel= fifthLevel;
      fifthLevel = [];
    }
    while (secondLevel.length === 0) {
      secondLevel = thirdLevel;
      thirdLevel = fourthLevel;
      fourthLevel= fifthLevel;
      fifthLevel = [];
    }
    while (thirdLevel.length === 0) {
      thirdLevel = fourthLevel;
      fourthLevel = fifthLevel;
      fifthLevel = [];
    }
    if (fourthLevel.length === 0){
      fourthLevel= fifthLevel;
      fifthLevel = [];
    }

    firstLevel.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} );
    secondLevel.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} );
    thirdLevel.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} );
    fourthLevel.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} );
    fifthLevel.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} );

    if (firstLevel.length > this.props.conf.maxSunburstLevelLength) {
      firstLevel.length = this.props.conf.maxSunburstLevelLength;
    }
    if (secondLevel.length > this.props.conf.maxSunburstLevelLength) {
      secondLevel.length = this.props.conf.maxSunburstLevelLength;
    }
    if (thirdLevel.length > this.props.conf.maxSunburstLevelLength) {
      thirdLevel.length = this.props.conf.maxSunburstLevelLength;
    }
    if (fourthLevel.length > this.props.conf.maxSunburstLevelLength) {
      fourthLevel.length = this.props.conf.maxSunburstLevelLength;
    }
    if (fifthLevel.length > this.props.conf.maxSunburstLevelLength) {
      fifthLevel.length = this.props.conf.maxSunburstLevelLength;
    }

    for (i = 0; i<fifthLevel.length; i++) {
      let mod = i % fourthLevel.length;
      fourthLevel[mod].children.push(fifthLevel[i]);
      fourthLevel[mod].bigness = '';
    }
    for (i = 0; i<fourthLevel.length; i++) {
      let mod = i%thirdLevel.length;
      thirdLevel[mod].children.push(fourthLevel[i]);
      thirdLevel[mod].bigness = '';
    }
    for (i = 0; i<thirdLevel.length; i++) {
      let mod = i%secondLevel.length;
      secondLevel[mod].children.push(thirdLevel[i]);
      secondLevel[mod].bigness = '';
    }
    for (i = 0; i<secondLevel.length; i++) {
      let mod = i%firstLevel.length;
      firstLevel[mod].children.push(secondLevel[i]);
      firstLevel[mod].bigness = '';
    }

    const rootUTCDate = getUTCDateFormat(timestamp[0]);
    const rootUTCDateArray = rootUTCDate.split(' ');
    this.rootLabel = <div>
      {rootUTCDateArray[0]} {rootUTCDateArray[1]} {rootUTCDateArray[2]} {rootUTCDateArray[3]}<br/>
      {rootUTCDateArray[4]} {rootUTCDateArray[5]} {rootUTCDateArray[6]}
    </div>;

    var data = {name:rootUTCDate, timestamp: timestamp[0], clr: colors[0], children:firstLevel, similarity: -1};
    this.setState({simhashData: data});
  }
}

SunburstContainer.propTypes = {

  timestamp: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  conf: PropTypes.object.isRequired,
  fetchSnapshotCallback: PropTypes.func,
  loader: PropTypes.element
};
