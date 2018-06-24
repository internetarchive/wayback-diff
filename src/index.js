/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import ReactDOM from 'react-dom';
import { DiffContainer } from './components/diff-container.jsx';

export default function ShowDiffContainer(element, callbck){
  ReactDOM.render(<DiffContainer fetchCallback = {callbck} />, element);
}

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

ShowDiffContainer(document.getElementById('wayback-diff'), null);