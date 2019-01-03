export function  buildValue(hoveredCell) {
  const {radius, angle, angle0} = hoveredCell;
  const truedAngle = (angle + angle0) / 2;
  const temp = {
    x: radius * Math.cos(truedAngle),
    y: radius * Math.sin(truedAngle)
  };

  return temp;
}

export function getSize () {

  const w = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

  const h = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
  let size;
  if (h<w){
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
    rootInfoDiv.setAttribute('style', `width:${size*0.4}px; height:${size*0.22}px; font-size: ${size*0.004}em;`);
  }
}

export function getDistance (hoveredCell) {
  if (hoveredCell.similarity !== -1){
    return (`Differences: ${Math.round(hoveredCell.similarity * 100)}%`);
  }
}
