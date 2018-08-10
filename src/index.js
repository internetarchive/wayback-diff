/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

// If on dev uncomment this lines
// import ReactDOM from 'react-dom';
// import DiffContainer from './components/diff-container.jsx';
//
// var path = window.location.pathname;
// let webMonitoringProcessingURL= 'http://localhost';
// let webMonitoringProcessingPort= '8888';
// path = path.split('/');
//
// let site = path[path.length-1];
// if (path.length === 3) {
//   ReactDOM.render(<DiffContainer site={site} fetchCallback = {null} limit={'1000'}
//     webMonitoringProcessingURL={webMonitoringProcessingURL} waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'}
//     webMonitoringProcessingPort={webMonitoringProcessingPort}/>, document.getElementById('wayback-diff'));
// } else {
//   let timestampA = path[path.length-3];
//   let timestampB = path[path.length-2];
//
//   ReactDOM.render(<DiffContainer site={site} timestampA={timestampA} timestampB={timestampB} limit={'1000'}
//     webMonitoringProcessingURL={webMonitoringProcessingURL} waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'}
//     webMonitoringProcessingPort={webMonitoringProcessingPort}
//     fetchCallback = {null} />, document.getElementById('wayback-diff'));
// }

// function fetchData() {
//   var pathname = window.location.pathname;
//   if (pathname[pathname.length-1] === '/') {
//     pathname = pathname.substring(0,pathname.length-2);
//   }
//   let domain = pathname.split('/').pop();
//   let url = `https://web.archive.org/cdx/search?url=${domain}/&status=200&fl=timestamp,digest&output=json`;
//   return fetch(url)
//     .then(response => response.json());
// }

//If using as a component in an other project uncomment the following line
export DiffContainer from './components/diff-container.jsx';
