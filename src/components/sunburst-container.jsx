import React from 'react';
import { Redirect } from 'react-router-dom';
import D3Sunburst from './d3-sunburst.jsx';
import {hammingDistance} from '../js/utils.js';
import '../css/diffgraph.css';
import { handleRelativeURL, checkResponse, fetch_with_timeout } from '../js/utils.js';
import ErrorMessage from './errors.jsx';
import PropTypes from 'prop-types';

/**
 * Container of d3 Sunburst diagram
 *
 * @class SunburstContainer
 * @extends {React.Component}
 */

export default class SunburstContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      simhashData: null
    };
  }

  render () {
    if (this.state.showError){
      return(
        <ErrorMessage url={this.props.url} code={this._errorCode}/>);
    }
    if (this._redirectToValidatedTimestamp){
      return this._renderRedirect();
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
    if (this.state.timestampValidated) {
      this._fetchTimestampSimhashData();
    } else {
      this._validateTimestamp();
    }
    return (<Loader/>);
  }

  _renderRedirect () {
    this._redirectToValidatedTimestamp = false;
    return (<Redirect to={this.state.newURL} />);
  }

  _validateTimestamp() {
    let promise;
    if (this.props.fetchSnapshotCallback) {
      promise = this.props.fetchSnapshotCallback(this.props.timestamp);
    } else {
      let url = handleRelativeURL(this.props.conf.snapshotsPrefix) + this.props.timestamp + '/' + encodeURIComponent(this.props.url);
      promise = fetch_with_timeout(fetch(url, {redirect: 'follow'}));
    }
    promise.then(response => {return checkResponse(response);})
      .then(response => {
        let url = response.url;
        let fetchedTimestamp = url.split('/')[4];
        if (this.props.timestamp !== fetchedTimestamp) {
          this._redirectToValidatedTimestamp = true;
          this.setState({newURL: this.props.conf.diffgraphPrefix + fetchedTimestamp + '/' + this.props.url,
            timestampValidated: true});
        }
        this.setState({timestampValidated: true});
      })
      .catch(error => {this.errorHandled(error.message);});
  }

  errorHandled (errorCode) {
    this._errorCode = errorCode;
    this.setState({showError: true});
  }

  _fetchTimestampSimhashData () {
    const url = `${this.props.conf.waybackDiscoverDiff}/simhash?url=${encodeURIComponent(this.props.url)}&timestamp=${this.props.timestamp}`;
    fetch_with_timeout(fetch(url)).then(response => {return checkResponse(response);})
      .then(response => response.json())
      .then((jsonResponse) => {
        var json = this._decodeJson(jsonResponse);
        this._fetchSimhashData(json);
      })
      .catch(error => {this.errorHandled(error.message);});
  }

  _fetchSimhashData (timestamp) {
    const url = `${this.props.conf.waybackDiscoverDiff}/simhash?url=${encodeURIComponent(this.props.url)}&year=${this.props.timestamp.substring(0, 4)}`;
    fetch_with_timeout(fetch(url)).then(response => {return checkResponse(response);})
      .then(response => response.json())
      .then((jsonResponse) => {
        var json = this._decodeJson(jsonResponse);
        let data = this._calcDistance(json, timestamp);
        this._createLevels(data, timestamp);
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

    return [this.props.timestamp, json.simhash];
  }

  _calcDistance(json, timestamp){
    this._minDistance = 64;
    for (var i = 0; i<json.length; i++){
      json[i][1] = hammingDistance(timestamp[0][1], json[i][1]);
      if (this._minDistance > json[i][1] && json[i][1] !== 0) {
        this._minDistance = json[i][1];
      }
    }
    return json;
  }

  _createLevels(json, timestamp) {
    var firstLevel = [];
    var secondLevel = [];
    var thirdLevel = [];
    var fourthLevel = [];
    var fifthLevel = [];

    const colors = ['#dddddd', '#f1e777', '#c5d56c', '#8db865', '#6b9775', '#4d7a83'];

    for (var i = 0; i<json.length; i++){
      if (json[i][1] !== 0) {
        if (json[i][1] <= this._minDistance) {
          firstLevel.push({name: json[i][0], bigness: 10, hamDist: json[i][1], clr: colors[1], children: []});
        } else if (json[i][1] <= this._minDistance + 2) {
          secondLevel.push({name: json[i][0], bigness: 10, hamDist: json[i][1], clr: colors[2], children: []});
        } else if (json[i][1] <= this._minDistance + 4) {
          thirdLevel.push({name: json[i][0], bigness: 10, hamDist: json[i][1], clr: colors[3], children: []});
        } else if (json[i][1] <= this._minDistance + 6) {
          fourthLevel.push({name: json[i][0], bigness: 10, hamDist: json[i][1], clr: colors[4], children: []});
        } else {
          fifthLevel.push({name: json[i][0], bigness: 10, hamDist: json[i][1], clr: colors[5], children: []});
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

    var data = {name:timestamp[0], clr: colors[0], children:firstLevel};
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
