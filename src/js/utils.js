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

// export function hammingWeight(l) {
//   var c;
//   for(c = 0; l; c++) {
//     l &= l-1;
//   }
//   return c;
// }

export function similarity(simhash1, simhash2) {
  if (Number.isInteger(simhash1) && Number.isInteger(simhash2)) {
    return weight((simhash1 & simhash2)) / weight((simhash1 | simhash2));
  }

  if (simhash1 instanceof Uint8Array && simhash2 instanceof Uint8Array) {
    let andArray = [];
    let orArray = [];
    for (let i = 0; i < simhash1.length; i++) {
      andArray.push(simhash1[i] & simhash2[i]);
      orArray.push(simhash1[i] | simhash2[i]);
    }
    return weightOfUint8Array(andArray) / weightOfUint8Array(orArray);
  }
}

/**
 * Hamming weight of number
 *
 * @private
 * @param x {number}
 * @returns {number}
 */
function weightOfInt (x) {
  let sum = 0;
  while (x !== 0) {
    sum++;
    x &= x - 1;
  }
  return sum;
}

/**
 * Hamming weight of uint8array
 *
 * @private
 * @param x
 * @returns {number}
 */
function weightOfUint8Array (x) {
  return x.reduce((acc, i) => weightOfInt(i) + acc, 0);
}

/**
 * Hamming Weight
 * https://en.wikipedia.org/wiki/Hamming_weight
 *
 * @param x
 * @returns {number}
 */
export function weight (x) {
  if (Number.isInteger(x)) {
    return weightOfInt(x);
  }

  if (x instanceof Uint8Array) {
    return weightOfUint8Array(x);
  }

  throw new Error('Unsupported type');
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
