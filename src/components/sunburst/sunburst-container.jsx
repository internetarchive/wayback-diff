import React from 'react';
import D3Sunburst from './d3-sunburst.jsx';
import scaleCluster from 'd3-scale-cluster';
import '../../css/diffgraph.css';
import { similarityWithDistance, checkResponse, getUTCDateFormat }
  from '../../js/utils.js';
import { decodeCompressedJson, decodeUncompressedJson } from './sunburst-container-utils.js';
import ErrorMessage from '../errors.jsx';
import PropTypes from 'prop-types';
import Loading from '../loading.jsx';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';

const barStyle1 = { backgroundColor: 'rgb(241, 231, 119)', height: '4px' };
const barStyle2 = { backgroundColor: 'rgb(197, 213, 108)', height: '6px' };
const barStyle3 = { backgroundColor: 'rgb(159, 197, 99)', height: '8px' };
const barStyle4 = { backgroundColor: 'rgb(141, 184, 101)', height: '10px' };
const barStyle5 = { backgroundColor: 'rgb(107, 151, 117)', height: '12px' };

const HeatMapLegend = () => (
  <div className="heat-map-legend">
    <div className="heat-map-legend-caption">Variation</div>
    <div className="heat-map-legend-summary">
      <div className="heat-map-legend-summary-min-caption">Low</div>
      <div className="heat-map-legend-summary-graphics">
        {[barStyle1, barStyle2, barStyle3, barStyle4, barStyle5].map((style, index) => (
          <div key={index} className="heat-map-legend-bar" style={style} />
        ))}
      </div>
      <div className="heat-map-legend-summary-max-caption">High</div>
    </div>
  </div>
);

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
      timestamp: this.props.timestamp,
      isPending: false,
      simhashData: null
    };
    this._clusters = [];
  }

  componentDidMount () {
    if (this.state.timestamp) {
      this._fetchTimestampSimhashData();
    } else {
      this._validateTimestamp();
    }
  }

  render () {
    const { url, conf, loader } = this.props;
    const { countCaptures, error, simhashData, timestamp } = this.state;
    const Loader = () => isNil(loader) ? <Loading/> : loader;

    if (error) {
      return (
        <ErrorMessage url={url} code={error} timestamp={timestamp ? timestamp : this.props.timestamp}
          conf={conf} errorHandledCallback={this.errorHandled}/>);
    }
    if (simhashData) {
      const year = this.state.timestamp.substring(0, 4);
      return (
        <div className="sunburst-container">
          {this.state.isPending &&
            <p>The Simhash data for {url} and year {year} are
            still being generated. For more results please try again in a moment.</p>}
          <div>This diagram illustrates the differences of <a
            href={`/web/*/${url}`}>{url}</a> capture <a href={conf.snapshotsPrefix + timestamp + '/' + url}>
            {getUTCDateFormat(timestamp)}</a> compared to{' '}
          {countCaptures} other captures of the same URL for {year}.</div>
          <D3Sunburst urlPrefix={conf.urlPrefix} url={url} simhashData={simhashData}/>
          <div style={{ clear: 'both' }}>
            <HeatMapLegend />
          </div>
        </div>
      );
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

    fetch(reqUrl)
      .then(checkResponse)
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
    console.log('_fetchTimestampSimhashData');
    const { url, conf } = this.props;
    const { timestamp } = this.state;
    const fetchUrl = conf.waybackDiscoverDiff + '/simhash?url=' + encodeURIComponent(url) + '&timestamp=' + timestamp;
    fetch(fetchUrl).then(checkResponse)
      .then(response => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.status) {
          throw Error(jsonResponse.message);
        }
        this._fetchSimhashData(
          decodeUncompressedJson(jsonResponse, timestamp)
        );
      })
      .catch(error => { this.errorHandled(error.message); });
  }

  _fetchSimhashData (timestampJson) {
    console.log('_fetchSimhashData');
    const { url, conf } = this.props;
    const { timestamp } = this.state;
    let fetchUrl = conf.waybackDiscoverDiff + '/simhash?url=' + encodeURIComponent(url) + '&year=' + timestamp.substring(0, 4);
    if (conf.compressedSimhash) {
      fetchUrl += '&compress=1';
    }
    fetch(fetchUrl).then(checkResponse)
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
    const { conf } = this.props;
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

    firstLevel = take(sortBy(firstLevel, [function (o) { return o.timestamp; }]), conf.maxSunburstLevelLength);
    secondLevel = take(sortBy(secondLevel, [function (o) { return o.timestamp; }]), conf.maxSunburstLevelLength);
    thirdLevel = take(sortBy(thirdLevel, [function (o) { return o.timestamp; }]), conf.maxSunburstLevelLength);
    fourthLevel = take(sortBy(fourthLevel, [function (o) { return o.timestamp; }]), conf.maxSunburstLevelLength);
    fifthLevel = take(sortBy(fifthLevel, [function (o) { return o.timestamp; }]), conf.maxSunburstLevelLength);

    function assignChildrenToParent(parentLevel, childLevel) {
      for (let i = 0; i < childLevel.length; i++) {
        const mod = i % parentLevel.length;
        parentLevel[mod].children.push(childLevel[i]);
        parentLevel[mod].bigness = '';
      }
    }

    assignChildrenToParent(fourthLevel, fifthLevel);
    assignChildrenToParent(thirdLevel, fourthLevel);
    assignChildrenToParent(secondLevel, thirdLevel);
    assignChildrenToParent(firstLevel, secondLevel);

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
