import _ from 'lodash';

/*eslint-disable no-useless-escape*/
const urlRegex = new RegExp(/[\w\.]{2,256}\.[a-z]{2,4}/gi);
/*eslint-enable no-useless-escape*/


function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}

function looksLikeUrl(str) {
  return !!str.match(urlRegex);
}

function startsWith(str, start) {
  return str.indexOf(start) === 0;
}

/*eslint-disable no-mixed-operators*/
export function isStrUrl(str = '') {
  const processedValue = str.toLocaleLowerCase();
  return (
    startsWith(processedValue, 'ftp://') ||
    startsWith(processedValue, 'http://') ||
    startsWith(processedValue, 'https://') ||
    looksLikeUrl(processedValue) && !hasWhiteSpace(processedValue)
  ) && !startsWith(processedValue, 'site:');
}
/*eslint-enable no-mixed-operators*/

export function handleRelativeURL (url) {
  const regex =  new RegExp(/^http.*/gm);
  if (url.match(regex)) {
    return url;
  }
  if (window.location.port === '80' || window.location.port === '') {
    return `${window.location.protocol}//${window.location.hostname}${url}`;
  }
  return `${window.location.protocol}//${window.location.hostname}:${window.location.port}${url}`;
}

export function hammingWeight(l) {
  var c;
  for(c = 0; l; c++) {
    l &= l-1;
  }
  return c;
}

// export function similarity(simhash1, simhash2) {
//   return hammingWeight((simhash1 & simhash2)) / hammingWeight((simhash1 | simhash2));
// }

/**
 * Hamming distance between ints
 *
 * @param x {number}
 * @param y {number}
 * @returns {number}
 */
function distanceOfInts (x, y) {
  return weightOfInt(x ^ y);
}

/**
 * Hamming distance between Uint8Array
 *
 * @param x {number}
 * @param y {number}
 * @returns {number}
 */
function distanceOfUint8Array (x, y) {
  return _.zip(x, y)
    .map(([i, j]) => weightOfInt(i ^ j))
    .reduce((acc, w) => acc + w, 0);
}

/**
 * Hamming Distance
 * https://en.wikipedia.org/wiki/Hamming_distance
 *
 * @param x
 * @param y
 * @returns {number}
 */

export function similarity(x, y) {
  if (Number.isInteger(x) && Number.isInteger(y)) {
    return distanceOfInts(x, y);
  }

  if (x instanceof Uint8Array && y instanceof Uint8Array) {
    return distanceOfUint8Array(x, y);
  }

  throw new Error(`Unsupported types: ${typeof x} ${typeof y}`);
}

function weightOfInt (x) {
  let sum = 0;
  while (x !== 0) {
    sum++;
    x &= x - 1;
  }
  return sum;
}


export function checkResponse(response) {
  if (response) {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  }
}

export function fetch_with_timeout(promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('timeout'));
    }, 45000);
    promise.then(resolve, reject);
  });
}

export function getTwoDigitInt(n){
  if (typeof n === 'string'){
    return n;
  }
  return n > 9 ? '' + n: '0' + n;
}

export function getKeyByValue (obj, value) {
  return Object.keys(obj).find(key => obj[key] === value);
}

export function selectHasValue(select, value) {
  let obj = document.getElementById(select);

  if (obj !== null) {
    return (obj.innerHTML.indexOf('value="' + value + '"') > -1);
  } else {
    return false;
  }
}

export function getUTCDateFormat (date) {
  let year = parseInt(date.substring(0, 4), 10);
  let month = parseInt(date.substring(4, 6), 10) - 1;
  let day = parseInt(date.substring(6, 8), 10);
  let hour = parseInt(date.substring(8, 10), 10);
  let minutes = parseInt(date.substring(10, 12), 10);
  let seconds = parseInt(date.substring(12, 14), 10);

  let niceTime = new Date(Date.UTC(year, month, day, hour, minutes, seconds));
  return (niceTime.toUTCString());
}

export function b64ToArray (b64Data) {
  const byteCharacters = atob(b64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Uint8Array(byteNumbers);
}
