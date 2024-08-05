import React from 'react';
import D3Sunburst from './d3-sunburst.jsx';
import scaleCluster from 'd3-scale-cluster';
import '../../css/diffgraph.css';
import { similarityWithDistance, checkResponse, fetchWithTimeout, getUTCDateFormat }
  from '../../js/utils.js';
import { getSize, decodeCompressedJson, decodeUncompressedJson } from './sunburst-container-utils.js';
import ErrorMessage from '../errors.jsx';
import PropTypes from 'prop-types';
import Loading from '../loading.jsx';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';

const barStyle1 = { backgroundColor: 'rgb(241, 231, 119)', height: '4px' };
const barStyle2 = { backgroundColor: 'rgb(197, 213, 108)', height: '6px' };
const barStyle3 = { backgroundColor: 'rgb(159, 197, 99)', height: '8px' };
const barStyle4 = { backgroundColor: 'rgb(141, 184, 101)', height: '10px' };
const barStyle5 = { backgroundColor: 'rgb(107, 151, 117)', height: '12px' };

export default class SunburstContainer extends React.Component {
  static displayName = 'SunburstContainer';

  static propTypes = {
    timestamp: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    conf: PropTypes.object.isRequired,
    loader: PropTypes.element
  };

  constructor (props) {
    super(props);
    this.state = {
      isUpdate: 0,
      isPending: false,
      simhashData: null
    };
    this._clusters = [];
  }

  componentDidUpdate () {
    if (this.state.isUpdate < 2) {
      getSize();
      this.setState({ isUpdate: this.state.isUpdate + 1 });
    }
  }

  render () {
    const { url, conf } = this.props;

    if (this.state.error) {
      return (
        <ErrorMessage url={url} code={this.state.error} timestamp={this.state.timestamp
          ? this.state.timestamp
          : this.props.timestamp}
        conf={conf} errorHandledCallback={this.errorHandled}/>);
    }
    if (this.state.simhashData) {
      return (
        <div className="sunburst-container">
          {this.state.isPending &&
            <p>The Simhash data for {url} and year {this.state.timestamp.substring(0, 4)} are
            still being generated. For more results please try again in a moment.</p>}
          <div>This diagram illustrates the differences of <a
            href={`/web/*/${url}`}>{url}</a> capture <a href={conf.snapshotsPrefix + this.state.timestamp + '/' + url}>
            {getUTCDateFormat(this.state.timestamp)}</a> compared to{' '}
          {this.state.countCaptures} other captures of the same URL for {this.state.timestamp.substring(0, 4)}.</div>
          <D3Sunburst urlPrefix={conf.urlPrefix} url={url} simhashData={this.state.simhashData}/>
          <div style={{ clear: 'both' }}>
            <div className="heat-map-legend">
              <div className="heat-map-legend-caption">Variation</div>
              <div className="heat-map-legend-summary">
                <div className="heat-map-legend-summary-min-caption">Low</div>
                <div className="heat-map-legend-summary-graphics">
                  <div className="heat-map-legend-bar" style={ barStyle1 }/>
                  <div className="heat-map-legend-bar" style={ barStyle2 }/>
                  <div className="heat-map-legend-bar" style={ barStyle3 }/>
                  <div className="heat-map-legend-bar" style={ barStyle4 }/>
                  <div className="heat-map-legend-bar" style={ barStyle5 }/>
                </div>
                <div className="heat-map-legend-summary-max-caption">High</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // TODO Must move this outside here.
    const Loader = () => isNil(this.props.loader) ? <Loading/> : this.props.loader;
    if (this.state.timestamp) {
      this._fetchTimestampSimhashData();
    } else {
      this._validateTimestamp();
    }
    return <div className="loading"><Loader/></div>;
  }

  _validateTimestamp () {
    const { url, conf, timestamp } = this.props;
    const reqUrl = new URL(conf.cdxServer, window.location.origin);
    reqUrl.searchParams.append('url', url);
    reqUrl.searchParams.append('closest', timestamp);
    reqUrl.searchParams.append('filter', '!mimetype:warc/revisit');
    reqUrl.searchParams.append('sort', 'closest');
    reqUrl.searchParams.append('limit', '1');
    reqUrl.searchParams.append('fl', 'timestamp');
    let promise = fetchWithTimeout(reqUrl);

    promise.then(checkResponse)
      .then(response => response.json())
      .then(data => {
        const ts = data.toString();
        const newTimestamp = timestamp !== ts ? ts : timestamp;
        const newUrl = `${conf.diffgraphPrefix}${ts}/${url}`;
        window.history.pushState({}, '', newUrl);
        this.setState({ timestamp: newTimestamp });
      })
      .catch(error => {
        if (error.message === 'Unexpected end of JSON input') {
          this.errorHandled('NO_CAPTURES');
        } else {
          this.errorHandled(error.message);
        }
      });
  }

  errorHandled (errorCode) {
    this.setState({ error: errorCode });
  }

  _fetchTimestampSimhashData () {
    const { url, conf } = this.props;
    const fetchUrl = conf.waybackDiscoverDiff + '/simhash?url=' + encodeURIComponent(url) + '&timestamp=' + this.state.timestamp;
    fetchWithTimeout(fetchUrl).then(checkResponse)
      .then(response => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.status) {
          throw Error(jsonResponse.message);
        }
        this._fetchSimhashData(
          decodeUncompressedJson(jsonResponse, this.state.timestamp)
        );
      })
      .catch(error => { this.errorHandled(error.message); });
  }

  _fetchSimhashData (timestampJson) {
    const { url, conf } = this.props;
    let fetchUrl = conf.waybackDiscoverDiff + '/simhash?url=' + encodeURIComponent(url) + '&year=' + this.state.timestamp.substring(0, 4);
    if (conf.compressedSimhash) {
      fetchUrl += '&compress=1';
    }
    fetchWithTimeout(fetchUrl).then(checkResponse)
      .then(response => response.json())
      .then((jsonResponse) => {
        this.setState({ isPending: jsonResponse.status === 'PENDING' });
        const json = conf.compressedSimhash ? decodeCompressedJson(jsonResponse) : decodeUncompressedJson(jsonResponse);
        const data = this._calcDistanceAndScales(json, timestampJson);
        if (!isEmpty(data)) {
          this._createLevels(data, timestampJson);
        }
      })
      .catch(error => { this.errorHandled(error.message); });
  }

  /*
  _calcDistanceAndScales receives two JSONs. The first contains all the
  timestamps for the selected year and webpage and their simhash values and
  the second one the selected timestamp and its simhash value.

  It returns a JSON variable containing all the timestamps for
  the selected year and webpage and their similarity index to
  the selected timestamp. Also, it generates the clusters which will be
  used to insert the timestamps into the diagram.
   */
  _calcDistanceAndScales (json, timestamp) {
    const tempSimilarity = json.map(item => {
      const similarity = similarityWithDistance(timestamp[1], item[1]);
      item[1] = similarity * 100;
      return similarity !== 0 ? similarity * 100 : null;
    }).filter(Boolean);

    if (tempSimilarity.length === 0) {
      this.errorHandled('NO_DIFFERENT_CAPTURES');
      return;
    }
    this.setState({ countCaptures: tempSimilarity.length });
    this._clusters = scaleCluster().domain(tempSimilarity)
      .range([1, 2, 3, 4, 5])
      .clusters();
    // Ensure there are at least 5 clusters
    while (this._clusters.length < 5) {
      this._clusters.push(101);
    }
    return json;
  }

  /* This function receives the JSON fetched from wayback-discover-diff
  and produces the data tree required for the Sunburst diagram.

  It separates the snapshots into 5 or less "difference steps"
  depending on the minimum and maximum percentage of difference
  between the selected snapshot and the rest of the snapshots
  for the same year. */
  _createLevels (json, timestamp) {
    let firstLevel = [];
    let secondLevel = [];
    let thirdLevel = [];
    let fourthLevel = [];
    let fifthLevel = [];

    const colors = ['#dddddd', '#f1e777', '#c5d56c', '#8db865', '#6b9775', '#4d7a83'];

    for (let i = 0; i < json.length; i++) {
      if (json[i][1] !== 0) {
        if (json[i][1] <= this._clusters[0]) {
          firstLevel.push({
            name: getUTCDateFormat(json[i][0]),
            timestamp: json[i][0],
            similarity: json[i][1],
            clr: colors[1],
            children: []
          });
        } else if (json[i][1] <= this._clusters[1]) {
          secondLevel.push({
            name: getUTCDateFormat(json[i][0]),
            timestamp: json[i][0],
            similarity: json[i][1],
            clr: colors[2],
            children: []
          });
        } else if (json[i][1] <= this._clusters[2]) {
          thirdLevel.push({
            name: getUTCDateFormat(json[i][0]),
            timestamp: json[i][0],
            similarity: json[i][1],
            clr: colors[3],
            children: []
          });
        } else if (json[i][1] <= this._clusters[3]) {
          fourthLevel.push({
            name: getUTCDateFormat(json[i][0]),
            timestamp: json[i][0],
            similarity: json[i][1],
            clr: colors[4],
            children: []
          });
        } else if (json[i][1] <= this._clusters[4]) {
          fifthLevel.push({
            name: getUTCDateFormat(json[i][0]),
            timestamp: json[i][0],
            similarity: json[i][1],
            clr: colors[5],
            children: []
          });
        }
      }
    }

    let levelCounter = 4;
    while (firstLevel.length === 0 && levelCounter > 0) {
      firstLevel = secondLevel;
      secondLevel = thirdLevel;
      thirdLevel = fourthLevel;
      fourthLevel = fifthLevel;
      fifthLevel = [];
      levelCounter = levelCounter - 1;
    }
    levelCounter = 3;
    while (secondLevel.length === 0 && levelCounter > 0) {
      secondLevel = thirdLevel;
      thirdLevel = fourthLevel;
      fourthLevel = fifthLevel;
      fifthLevel = [];
      levelCounter = levelCounter - 1;
    }
    levelCounter = 2;
    while (thirdLevel.length === 0 && levelCounter > 0) {
      thirdLevel = fourthLevel;
      fourthLevel = fifthLevel;
      fifthLevel = [];
      levelCounter = levelCounter - 1;
    }
    if (fourthLevel.length === 0) {
      fourthLevel = fifthLevel;
      fifthLevel = [];
    }

    firstLevel = sortBy(firstLevel, [function (o) { return o.timestamp; }]);
    secondLevel = sortBy(secondLevel, [function (o) { return o.timestamp; }]);
    thirdLevel = sortBy(thirdLevel, [function (o) { return o.timestamp; }]);
    fourthLevel = sortBy(fourthLevel, [function (o) { return o.timestamp; }]);
    fifthLevel = sortBy(fifthLevel, [function (o) { return o.timestamp; }]);

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

    for (let i = 0; i < fifthLevel.length; i++) {
      const mod = i % fourthLevel.length;
      fourthLevel[mod].children.push(fifthLevel[i]);
      fourthLevel[mod].bigness = '';
    }
    for (let i = 0; i < fourthLevel.length; i++) {
      const mod = i % thirdLevel.length;
      thirdLevel[mod].children.push(fourthLevel[i]);
      thirdLevel[mod].bigness = '';
    }
    for (let i = 0; i < thirdLevel.length; i++) {
      const mod = i % secondLevel.length;
      secondLevel[mod].children.push(thirdLevel[i]);
      secondLevel[mod].bigness = '';
    }
    for (let i = 0; i < secondLevel.length; i++) {
      const mod = i % firstLevel.length;
      firstLevel[mod].children.push(secondLevel[i]);
      firstLevel[mod].bigness = '';
    }

    this.setState({
      simhashData: {
        name: getUTCDateFormat(timestamp[0]),
        timestamp: timestamp[0],
        clr: colors[0],
        children: firstLevel,
        similarity: -1
      }
    });
  }
}
