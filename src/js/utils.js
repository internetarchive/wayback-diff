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

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Calculates binary hamming distance of two base 16 integers.
 */
export function hammingDistance(x, y) {
  var a1 = parseInt(x, 16);
  var a2 = parseInt(y, 16);
  var v1 = a1 ^ a2;
  var v2 = (a1 ^ a2) >> 32;

  v1 = v1 - ((v1 >> 1) & 0x55555555);
  v2 = v2 - ((v2 >> 1) & 0x55555555);
  v1 = (v1 & 0x33333333) + ((v1 >> 2) & 0x33333333);
  v2 = (v2 & 0x33333333) + ((v2 >> 2) & 0x33333333);
  var c1 = ((v1 + (v1 >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
  var c2 = ((v2 + (v2 >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;

  return c1 + c2;
}
