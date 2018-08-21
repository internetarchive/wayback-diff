/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

// If on dev uncomment this lines
// import ReactDOM from 'react-dom';
// import DiffContainer from './components/diff-container.jsx';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Loading from './components/loading.jsx';
//
// let webMonitoringProcessingURL= 'http://localhost:8888';
//
// ReactDOM.render(<Router>
//   <Switch>
//     <Route path="/diff/([^/]*)/([^/]*)/(.+)" render={({match}) =>
//       <DiffContainer site={match.params[2]} timestampA={match.params[0]}
//         webMonitoringProcessingURL={webMonitoringProcessingURL} limit={'1000'}
//         loader={<Loading waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'}/>}
//         timestampB={match.params[1]} fetchCallback = {null} />
//     }/>
//     <Route path="/diff/:timestampA//:site" render={({match}) =>
//       <DiffContainer site={match.params.site} timestampA={match.params.timestampA}
//         webMonitoringProcessingURL={webMonitoringProcessingURL} limit={'1000'}
//         noSnapshotURL={'https://users.it.teithe.gr/~it133996/noSnapshot.html'}
//         loader={<Loading waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'}/>}/>
//     }/>
//     <Route path="/diff//:timestampB/:site" render={({match}) =>
//       <DiffContainer site={match.params.site} timestampB={match.params.timestampB}
//         webMonitoringProcessingURL={webMonitoringProcessingURL} limit={'1000'}
//         noSnapshotURL={'https://users.it.teithe.gr/~it133996/noSnapshot.html'}
//         loader={<Loading waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'}/>}/>
//     }/>
//     <Route path="/diff/:site" render={({match}) =>
//       <DiffContainer site={match.params.site} fetchCallback = {null}
//         webMonitoringProcessingURL={webMonitoringProcessingURL} limit={'1000'}
//         loader={<Loading waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'}/>}
//       />} />
//   </Switch>
// </Router>, document.getElementById('wayback-diff'));


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
