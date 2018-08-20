import React from 'react';
import Loading from './loading.jsx';
import '../css/diff-container.css';

/**
 * Display a timestamp selector
 *
 * @class TimestampHeader
 * @extends {React.Component}
 */
export default class TimestampHeader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cdxData: false,
      showDiff: false,
      showNotFound: false
    };

    this.handleLeftTimestampChange = this.handleLeftTimestampChange.bind(this);

    this.handleRightTimestampChange = this.handleRightTimestampChange.bind(this);

    this.restartPressed = this.restartPressed.bind(this);

    this.showDiffs = this.showDiffs.bind(this);

  }

  handleRightTimestampChange(){
    const selectedDigest = this.state.cdxData[document.getElementById('timestamp-select-right').selectedIndex][1];
    let allowedSnapshots = this.state.cdxData;
    allowedSnapshots = allowedSnapshots.filter(hash => hash[1] !== selectedDigest);
    this.setState({
      leftSnaps: allowedSnapshots,
      leftSnapElements : this.prepareOptionElements(allowedSnapshots)
    });
  }

  handleLeftTimestampChange(){
    const selectedDigest = this.state.cdxData[document.getElementById('timestamp-select-left').selectedIndex][1];
    let allowedSnapshots = this.state.cdxData;
    allowedSnapshots = allowedSnapshots.filter(hash => hash[1] !== selectedDigest);
    this.setState({
      rightSnaps: allowedSnapshots,
      rightSnapElements : this.prepareOptionElements(allowedSnapshots)
    });
  }

  render () {
    if (this.state.showNotFound){
      return(
        <div>
          {this.notFound()}
        </div>);
    }
    if (this.state.showDiff) {
      return(
        <div className="timestamp-header-view">
          {this.showInfo()}
          {this.showTimestampSelector()}
          {this.exportParams()}
        </div>
      );
    }
    if (this.state.cdxData) {
      return (
        <div className="timestamp-header-view">
          {this.showInfo()}
          {this.showTimestampSelector()}
          {this.showOpenLinks()}
        </div>
      );
    }
    return (<div>
      <Loading waybackLoaderPath={this.props.waybackLoaderPath}/>
      {this.widgetRender()}
    </div>
    );
  }

  exportParams(){
    let timestampA = document.getElementById('timestamp-select-left').value;
    let timestampB = document.getElementById('timestamp-select-right').value;
    window.location.href = `/diff/${timestampA}/${timestampB}/${this.props.site}`;
  }

  widgetRender () {
    if (this.props.fetchCallback) {
      this.props.fetchCallback().then((data => {
        this.prepareData(data);
        if (!this.props.isInitial) {
          this.selectValues();
        }
      }));
    } else {
      var url;
      if (this.props.limit){
        url = `http://web.archive.org/cdx/search?url=${this.props.site}/&status=200&limit=${this.props.limit}&fl=timestamp,digest&output=json`;
      } else {
        url = `http://web.archive.org/cdx/search?url=${this.props.site}/&status=200&fl=timestamp,digest&output=json`;
      }
      fetch(url)
        .then(response => response.json())
        .then((data) => {
          if (data && data.length > 0 ){
            if (data.length === 2) {
              let timestamp = data[1][0];
              window.location.href = `/diff/${timestamp}//${this.props.site}`;
            }
            this.prepareData(data);
            if (!this.props.isInitial) {
              this.selectValues();
            }
          } else {
            this.props.snapshotsNotFoundCallback();
            this.setState({showNotFound:true});

          }
        });
    }
  }

  prepareData(data){
    data.shift();
    this.setState({
      cdxData: data,
      leftSnaps : data,
      rightSnaps : data,
      leftSnapElements : this.prepareOptionElements(data),
      rightSnapElements : this.prepareOptionElements(data),
      headerInfo: this.getHeaderInfo(data)
    });
  }

  prepareOptionElements(data){
    var initialSnapshots = [];
    if (data.length > 0) {
      var yearGroup = this.getYear(data[0][0]);
      initialSnapshots.push(<optgroup key={-1} label={yearGroup}/>);
    }
    for (let i = 0; i < data.length; i++){
      let utcTime = this.getUTCDateFormat(data[i][0]);
      var year = this.getYear(data[i][0]);
      if (year > yearGroup) {
        yearGroup = year;
        initialSnapshots.push(<optgroup key={-i+2} label={yearGroup}/>);
      }
      initialSnapshots.push(<option key = {i} value = {data[i][0]}>{utcTime}</option>);
    }
    return initialSnapshots;
  }

  getUTCDateFormat (date){
    let year = parseInt(date.substring(0,4), 10);
    let month = parseInt(date.substring(4,6), 10) - 1;
    let day = parseInt(date.substring(6,8), 10);
    let hour = parseInt(date.substring(8,10), 10);
    let minutes = parseInt(date.substring(10,12), 10);
    let seconds = parseInt(date.substring(12,14), 10);

    let niceTime = new Date(Date.UTC(year, month, day, hour, minutes, seconds));
    return (niceTime.toUTCString());
  }

  getShortUTCDateFormat (date){
    let year = parseInt(date.substring(0,4), 10);
    let month = parseInt(date.substring(4,6), 10) - 1;
    let day = parseInt(date.substring(6,8), 10);
    var shortTime = new Date(Date.UTC(year, month, day));
    shortTime = shortTime.toUTCString();
    shortTime = shortTime.split(' ');
    let retTime = shortTime[0] + ' ' + shortTime[1] + ' ' + shortTime[2];
    return (retTime);
  }

  getYear (date) {
    return parseInt(date.substring(0,4), 10);
  }

  restartPressed () {
    let initialData = this.state.cdxData;
    this.setState({
      leftSnaps : initialData,
      rightSnaps : initialData,
      leftSnapElements : this.prepareOptionElements(initialData),
      rightSnapElements : this.prepareOptionElements(initialData)
    });
  }

  showTimestampSelector () {
    return (
      <div className="timestamp-container-view">
        <select className="form-control" id="timestamp-select-left" onChange={this.handleLeftTimestampChange}>
          {this.state.leftSnapElements}
        </select>
        <button className="btn btn-default navbar-btn" id="show-diff-btn" onClick={this.showDiffs}>Show differences</button>
        <button className="btn btn-default navbar-btn" id="restart-btn" onClick={this.restartPressed}>Restart</button>
        <select className="form-control" id="timestamp-select-right" onChange={this.handleRightTimestampChange}>
          {this.state.rightSnapElements}
        </select>
      </div>
    );
  }

  showInfo(){
    return (
      <div>
        {this.state.headerInfo}
        <p id="timestamp-p-left">Please select a capture</p>
        <p id="timestamp-p-right">Please select a capture</p>
        <br/>
      </div>
    );
  }

  showOpenLinks(){
    if(!this.props.isInitial) {
      if (this.props.timestampA) {
        var aLeft = (<a href={'/web/' + this.props.timestampA + '/' + this.props.site}
          id="timestamp-a-left" target="_blank" rel="noopener"> Open in new window</a>);
      }
      if (this.props.timestampB) {
        var aRight = (<a href={'/web/' + this.props.timestampB + '/' + this.props.site}
          id="timestamp-a-right" target="_blank" rel="noopener">
          Open in new window</a>);
      }
      let div = (
        <div>
          {aLeft}
          {aRight}
          <br/>
        </div>
      );
      return div;
    }
  }

  notFound () {
    return (<div className="alert alert-warning" role="alert">The Wayback Machine doesn't have {this.props.site} archived.</div>);
  }

  showDiffs () {
    this.setState({showDiff: true});
  }

  selectValues () {
    document.getElementById('timestamp-select-left').value = this.props.timestampA;
    document.getElementById('timestamp-select-right').value = this.props.timestampB;
  }

  getHeaderInfo (data) {
    if (data) {
      let first = this.getShortUTCDateFormat(data[0][0]);
      let last = this.getShortUTCDateFormat(data[data.length-1][0]);

      return (<p id='explanation-middle'> Compare any two captures from our collection of {data.length}, dating from {first} to {last}.</p>);
    }
  }
}