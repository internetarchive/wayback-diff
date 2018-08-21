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


export function loadJSON(path) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', path, false);
  xobj.send(null);
  if (xobj.readyState === 4 && xobj.status === '200') {
    return(xobj.responseText);
  }


}