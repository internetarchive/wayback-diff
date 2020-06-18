import _ from 'lodash';
import { getTwoDigitInt } from '../../js/utils';

export function buildValue (hoveredCell) {
  const { radius, angle, angle0 } = hoveredCell;
  const truedAngle = (angle + angle0) / 2;
  return {
    x: radius * Math.cos(truedAngle),
    y: radius * Math.sin(truedAngle)
  };
}

export function getSize () {
  const w = window.innerWidth || document.documentElement.clientWidth ||
    document.body.clientWidth;

  const h = window.innerHeight || document.documentElement.clientHeight ||
    document.body.clientHeight;
  let size;
  if (h < w) {
    size = h*0.45;
  } else {
    size = w*0.45;
  }
  _showRootInfo(size);
  return size;
}

function _showRootInfo (size) {
  let rootInfoDiv = document.getElementById('root-cell-tooltip');
  if (rootInfoDiv) {
    rootInfoDiv.setAttribute('style', `top:${size*0.4}px; width:${size*0.4}px; height:${size*0.22}px; font-size: ${size*0.004}em;`);
  }
}

export function getDistance (hoveredCell) {
  if (hoveredCell.similarity !== -1){
    return (`Differences: ${_.round(hoveredCell.similarity, 2)}%`);
  }
}

/*
The _decodeCompressedJson function assumes the task of decoding the simhash
value received from wayback-discover-diff in base64 into a number.
This function handles both a JSON array and a single JSON value.
 */

export function decodeCompressedJson(json){
  let newJson = [];
  const year = json.captures[0][0];
  for (let i = 1; i < json.captures[0].length; i++) {
    let month = json.captures[0][i][0];
    for (let j = 1; j < json.captures[0][i].length; j++) {
      let day = json.captures[0][i][j][0];
      for (let y = 1; y < json.captures[0][i][j].length; y++) {
        let time = json.captures[0][i][j][y][0];
        let simhashIndex = json.captures[0][i][j][y][1];
        let simhash = json.hashes[simhashIndex];
        let timestamp = `${year}${getTwoDigitInt(month)}${getTwoDigitInt(day)}${time}`;
        newJson.push([timestamp, simhash]);
      }
    }
  }
  return newJson;
}

export function decodeUncompressedJson(json, initTimestamp = null){
  if(json.captures) {
    return json.captures;
  }
  return [initTimestamp, json.simhash];
}
