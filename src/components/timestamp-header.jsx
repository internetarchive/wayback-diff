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
      showDiff: false
    };

    this.handleLeftTimestampChange = this.handleLeftTimestampChange.bind(this);

    this.handleRightTimestampChange = this.handleRightTimestampChange.bind(this);

    this.clearPressed = this.clearPressed.bind(this);

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
    if (this.state.showDiff) {
      return(
        <div className="diffcontainer-view">
          {this.showTimestampSelector()}
          {this.exportParams(window.location.pathname)}
        </div>
      );
    }
    if (this.state.cdxData) {
      return (
        <div className="diffcontainer-view">
          {this.showTimestampSelector()}
        </div>
      );
    }
    return (<div>
      <Loading/>
      {this.widgetRender(window.location.href)}
    </div>
    );
  }

  exportParams(path){

    let timestampA = document.getElementById('timestamp-select-left').value;
    let timestampB = document.getElementById('timestamp-select-right').value;
    let site = path.split('/').pop();
    // let selectedMethod = document.getElementById('diff-select').value;
    //
    // let urlA = 'https://web.archive.org/web/' + timestampA + '/' + site;
    // let urlB = 'https://web.archive.org/web/' + timestampB + '/' + site;

    // window.history.pushState({'html':document.html,'pageTitle':document.pageTitle}, '', `http://localhost:3000/diff/${timestampA}/${timestampB}/${site}`);
    window.location.href = `/diff/${timestampA}/${timestampB}/${site}`;
    // return <DiffView page = {{url: site}}
    //   diffType={selectedMethod} a={urlA} b={urlB} />;
  }

  widgetRender (pathname) {
    if (this.props.fetchCallback) {
      this.props.fetchCallback().then((data => {
        this.prepareData(data);
        if (!this.props.isInitial) {
          this.selectValues(pathname);
        }
      }));
    } else {
      if (pathname[pathname.length-1] === '/') {
        pathname = pathname.substring(0,pathname.length-2);
      }
      let domain = pathname.split('/').pop();
      let url = `https://web.archive.org/cdx/search?url=${domain}/&status=200&fl=timestamp,digest&output=json`;
      fetch(url)
        .then(response => response.json())
        .then((data) => {
          this.prepareData(data);
          if (!this.props.isInitial) {
            this.selectValues(pathname);
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
      rightSnapElements : this.prepareOptionElements(data)
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

  getYear (date) {
    return parseInt(date.substring(0,4), 10);
  }

  clearPressed () {
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
      <div>
        <select id="timestamp-select-left" onChange={this.handleLeftTimestampChange}>
          {this.state.leftSnapElements}
        </select>
        <select id="timestamp-select-right" onChange={this.handleRightTimestampChange}>
          {this.state.rightSnapElements}
        </select>
        <div id="center-buttons">
          <button id="clear-btn" onClick={this.clearPressed}>Clear</button>
          <button id="show-diff-btn" onClick={this.showDiffs}>Show differences</button>
        </div>
      </div>
    );
  }

  showDiffs () {
    this.setState({showDiff: true});
    // this.redirNewURL();
  }

  redirNewURL () {
    let timestampA = (document.getElementById('timestamp-select-left')).value;
    let timestampB = (document.getElementById('timestamp-select-right')).value;
    let site = window.location.pathname;
    site = site.split('/').pop();

    this.context.history.push({
      pathname: `/diff/${timestampA}/${timestampB}/${site}`,
      state: {email: this.state.email}
    });

  }

  selectValues (pathname) {
    pathname = pathname.split('/');
    let firstTimestamp = pathname[pathname.length - 3];
    let secondTimestamp = pathname[pathname.length - 2];

    document.getElementById('timestamp-select-left').value = firstTimestamp;
    document.getElementById('timestamp-select-right').value = secondTimestamp;
  }
}