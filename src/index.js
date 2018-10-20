/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

// If on dev uncomment this lines
// import ReactDOM from 'react-dom';
// import DiffContainer from './components/diff-container.jsx';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Loading from './components/loading.jsx';
// import SunburstContainer from './components/sunburst-container.jsx';
//
// let conf = require('./conf.json');
//
// ReactDOM.render(
//   <Router>
//     <Switch>
//       <Route path='/diff/([0-9]{14})/([0-9]{14})/(.+)' render={({match, location}) =>
//         <DiffContainer url={match.params[2] + location.search} timestampA={match.params[0]}
//           loader={<Loading waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'} />}
//           timestampB={match.params[1]} fetchCDXCallback={null} conf={conf} fetchSnapshotCallback={null} />
//       } />
//       <Route path='/diff/([0-9]{14})//(.+)' render={({match, location}) =>
//         <DiffContainer url={match.params[1] + location.search} timestampA={match.params[0]}
//           loader={<Loading waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'} />}
//           fetchCDXCallback={null} conf={conf} fetchSnapshotCallback={null}/>
//       } />
//       <Route path='/diff//([0-9]{14})/(.+)' render={({match, location}) =>
//         <DiffContainer url={match.params[1] + location.search} timestampB={match.params[0]}
//           loader={<Loading waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'} />}
//           fetchCDXCallback={null} conf={conf} fetchSnapshotCallback={null}/>
//       } />
//
//       <Route path='/diff///(.+)' render={({match, location}) =>
//         <DiffContainer url={match.params[0] + location.search} conf={conf} noTimestamps={true} fetchCDXCallback={null}
//           loader={<Loading waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'} />}/>
//       } />
//       <Route path='/diff/(.+)' render={({match, location}) =>
//         <DiffContainer url={match.params[0] + location.search} fetchCDXCallback={null}
//           loader={<Loading waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'} />} conf={conf}/>}
//       />
//       <Route path='/diffgraph/([0-9]{14})/(.+)' render={({match, location}) =>
//         <SunburstContainer url={match.params[1] + location.search} timestamp={match.params[0]}
//           loader={<Loading waybackLoaderPath={'https://users.it.teithe.gr/~it133996/wayback-loader.svg'} />}
//           conf={conf} fetchSnapshotCallback={null}/>}
//       />
//     </Switch>
//   </Router>, document.getElementById('wayback-diff'));

// function fetchData () {
//   var pathname = window.location.pathname;
//   if (pathname[pathname.length - 1] === '/') {
//     pathname = pathname.substring(0, pathname.length - 2);
//   }
//   let domain = pathname.split('/').pop();
//   let url = `${this.conf.cdxServer}search?url=${domain}/&status=200&fl=timestamp,digest&output=json`;
//   return fetch(url);
// }

// function fetchSnapshot (timestamp) {
//   var pathname = window.location.pathname;
//   if (pathname[pathname.length - 1] === '/') {
//     pathname = pathname.substring(0, pathname.length - 2);
//   }
//   pathname = pathname.split('/');
//   let domain = pathname.pop();
//   let url = this.conf.snapshotsPrefix + timestamp + '/' + domain;
//   console.log('------------This is working! ' + url);
//   return fetch(url);
// }

//  If using as a component in an other project uncomment the following line
export DiffContainer from './components/diff-container.jsx';
export SunburstContainer from './components/sunburst-container.jsx';
