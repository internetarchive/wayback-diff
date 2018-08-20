const urlRegex = new RegExp(/[\w\.]{2,256}\.[a-z]{2,4}/gi);

function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}

function looksLikeUrl(str) {
  return !!str.match(urlRegex);
}

function startsWith(str, start) {
  return str.indexOf(start) === 0;
}

export default function isStrUrl(str = '') {
  const processedValue = str.toLocaleLowerCase();
  return (
    startsWith(processedValue, 'ftp://') ||
    startsWith(processedValue, 'http://') ||
    startsWith(processedValue, 'https://') ||
    looksLikeUrl(processedValue) && !hasWhiteSpace(processedValue)
  ) && !startsWith(processedValue, 'site:');
}
