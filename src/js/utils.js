import max from 'lodash/max';
import zip from 'lodash/zip';


export function similarityWithTanimoto (simhash1, simhash2) {
  if (Number.isInteger(simhash1) && Number.isInteger(simhash2)) {
    return weight((simhash1 & simhash2)) / weight((simhash1 | simhash2));
  }
  if (simhash1 instanceof Uint8Array && simhash2 instanceof Uint8Array) {
    const andArray = [];
    const orArray = [];
    for (let i = 0; i < simhash1.length; i++) {
      andArray.push(simhash1[i] & simhash2[i]);
      orArray.push(simhash1[i] | simhash2[i]);
    }
    return weightOfUint8Array(andArray) / weightOfUint8Array(orArray);
  }
}

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

function distanceOfUint8Array (x, y) {
  return zip(x, y)
    .map(([i, j]) => weightOfInt(i ^ j))
    .reduce((acc, w) => acc + w, 0);
}

export function similarityWithDistance (simhash1, simhash2) {
  if (Number.isInteger(simhash1) && Number.isInteger(simhash2)) {
    // We divide with 32 because it is the output of distanceOfInts with input
    // Number.MAX_SAFE_INTEGER
    return distanceOfInts(simhash1, simhash2) / 32;
  }
  const simhash1Size = 8 * atob(simhash1).length;
  const simhash2Size = 8 * atob(simhash2).length;
  const maxSize = max([simhash1Size, simhash2Size]);
  const distance = distanceOfUint8Array(b64ToArray(simhash1), b64ToArray(simhash2));
  return distance / maxSize;
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
function weight (x) {
  if (Number.isInteger(x)) {
    return weightOfInt(x);
  }
  if (x instanceof Uint8Array) {
    return weightOfUint8Array(x);
  }
  throw new Error('Unsupported type');
}

export function checkResponse (response) {
  if (response && !response.ok) throw Error(response.status);
  return response;
}

export function jsonResponse (response) {
  if (response && !response.ok) throw Error(response.status);
  return response.json();
}

export function fetchWithTimeout (url, params) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('timeout'));
    }, 45000);
    fetch(url, params).then(resolve, reject);
  });
}

export function getKeyByValue (obj, value) {
  return Object.keys(obj).find(key => obj[key] === value);
}

export function getUTCDateFormat (date) {
  const year = parseInt(date.substring(0, 4), 10);
  const month = parseInt(date.substring(4, 6), 10) - 1;
  const day = parseInt(date.substring(6, 8), 10);
  const hour = parseInt(date.substring(8, 10), 10);
  const minutes = parseInt(date.substring(10, 12), 10);
  const seconds = parseInt(date.substring(12, 14), 10);

  const niceTime = new Date(Date.UTC(year, month, day, hour, minutes, seconds));
  return (niceTime.toUTCString());
}

/** Input: "20190504221015" Output: "Sat, 04 May 2019" */
export function getShortUTCDateFormat (timestamp) {
  const year = parseInt(timestamp.substring(0, 4), 10);
  const month = parseInt(timestamp.substring(4, 6), 10) - 1;
  const day = parseInt(timestamp.substring(6, 8), 10);
  const utcDateTime = new Date(Date.UTC(year, month, day));
  return utcDateTime.toUTCString().split(' ').slice(0, 4).join(' ');
}

export function getYear (ts) {
  return parseInt(ts.substring(0, 4), 10);
}

export function b64ToArray (b64Data) {
  const byteCharacters = atob(b64Data);
  return Uint8Array.from(byteCharacters, char => char.charCodeAt(0));
}
