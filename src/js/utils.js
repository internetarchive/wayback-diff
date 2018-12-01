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

export function similarity(simhash1, simhash2) {
  return hammingWeight((simhash1 & simhash2)) / hammingWeight((simhash1 | simhash2));
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
