import React from 'react';
import D3Sunburst from './d3-sunburst.jsx';
import {similarity} from '../js/utils.js';
import '../css/diffgraph.css';
import { handleRelativeURL, checkResponse, fetch_with_timeout } from '../js/utils.js';
import ErrorMessage from './errors.jsx';
import PropTypes from 'prop-types';
import { getUTCDateFormat } from '../js/utils';

/**
 * Container of d3 Sunburst diagram
 *
 * @class SunburstContainer
 * @extends {React.Component}
 */

export default class SunburstContainer extends React.Component {

  ROOT_LABEL_STYLE = {
    fontSize: '12px',
    transform: 'rotate(0,0,0)'
  };

  constructor(props) {
    super(props);

    this.state = {
      simhashData: null
    };
  }

  render () {
    if (this.state.error){
      return(
        <ErrorMessage url={this.props.url} code={this.state.error} year={this.state.timestamp.substring(0, 4)}
          conf={this.props.conf} errorHandledCallback={this.errorHandled}/>);
    }
    if (this.state.simhashData) {
      return (
        <div className="sunburst-container">
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
      let url = handleRelativeURL(this.props.conf.waybackAvailabilityAPI) + '?url=' + encodeURIComponent(this.props.url) + '&timestamp=' + this.props.timestamp;
      promise = fetch_with_timeout(fetch(url, {redirect: 'follow'}));
    }
    promise.then(response => {return checkResponse(response).json();})
      .then(data => {
        let fetchedTimestamp = data.archived_snapshots.closest.timestamp;
        if (this.props.timestamp !== fetchedTimestamp) {

          window.history.pushState({}, '', this.props.conf.diffgraphPrefix + fetchedTimestamp + '/' + this.props.url);
          this.setState({timestamp: fetchedTimestamp});
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
        if (jsonResponse['simhash'] === 'None') {
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


  _decodeJson(json){
    var Base64 = (function () {

      var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

      var Base64 = function () {};

      var _decode = function (value) {

        var result = 0;
        for (var i = 0, len = value.length; i < len; i++) {
          result *= 64;
          result += ALPHA.indexOf(value[i]);
        }

        return result;
      };

      Base64.prototype = {
        constructor: Base64,
        decode: _decode
      };

      return Base64;

    })();
    let base64 = new Base64();
    if(json.length) {
      for (var i = 0; i < json.length; i++) {
        json[i][1] = json[i][1].toString().replace(/=/, '');
        json[i][1] = base64.decode(json[i][1]);
      }
      return json;
    }

    json.simhash = json.simhash.toString().replace(/=/, '');
    json.simhash = base64.decode(json.simhash);

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
    const rootLabel =
      <tspan dx="-22%">
        <tspan>{rootUTCDateArray[0]} {rootUTCDateArray[1]} {rootUTCDateArray[2]} {rootUTCDateArray[3]}</tspan>
        <tspan dx="-33%" dy="1.3em">{rootUTCDateArray[4]} {rootUTCDateArray[5]} {rootUTCDateArray[6]}</tspan>
      </tspan>;

    var data = {label:rootLabel, labelStyle: this.ROOT_LABEL_STYLE, name:rootUTCDate, timestamp: timestamp[0], clr: colors[0], children:firstLevel, similarity: -1};
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
