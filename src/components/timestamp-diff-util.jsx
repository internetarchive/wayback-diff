import _ from 'lodash';
import * as xpath from 'simple-xpath-position';

const urlRegex = new RegExp(/\/\/web\.archive\.org\/web\/\d{14}/gm);
var ins, del;

export function getTimestampCleanDiff(insertions, deletions) {

  let domIns = new DOMParser().parseFromString(insertions, 'text/xml');
  let domDel = new DOMParser().parseFromString(deletions, 'text/xml');

  ins = domIns.getElementsByTagName('ins');
  del = domDel.getElementsByTagName('del');
  let foundIns = [];
  let foundDel = [];

  console.log(ins);
  console.log(del);

  for(let i=0; i<del.length; i++) {
    if (_.isEqual(del[i].className, 'wm-diff') && del[i].childNodes.length > 0) {
      del[i].childNodes.forEach(function (child) {
        const result = checkTimestampInLink(child);
        addNotNill(foundDel, result);
      });
    }
  }

  for(let i=0; i<ins.length; i++) {
    if (_.isEqual(ins[i].className, 'wm-diff') && ins[i].childNodes.length > 0) {
      ins[i].childNodes.forEach(function (child) {
        const result = checkTimestampInLink(child);
        addNotNill(foundIns, result);
      });
    }
  }

  let k = 0;
  while (k < foundDel.length) {
    let j = 0;
    while (j< foundIns.length) {
      if (_.isEqual(foundDel[k][1], foundIns[j][1])){
        const dirtyDelXpath= xpath.fromNode(foundDel[k][0]);
        const dirtyInsXpath  = xpath.fromNode(foundIns[j][0]);
        let delxpath = removeDiffXPATH(dirtyDelXpath, 'del');
        let insxpath = removeDiffXPATH(dirtyInsXpath, 'ins');
        if (_.isEqual(delxpath, insxpath)){
          deleteNodes(foundIns[j][0], foundDel[k][0]);
          k++;
          continue;
        }
      }
      j++;
    }
    k++;
  }
  console.log(ins);
  console.log(del);
  return [new XMLSerializer().serializeToString(domIns), new XMLSerializer().serializeToString(domIns)];
}

function checkTimestampInLink (element) {
  let link;
  if (!_.isNil(element.src))
    link = element.src;
  else if (!_.isNil(element.href))
    link = element.href;
  if (!_.isNil(link)) {
    if (link.match(urlRegex)) {
      return element;
    }
    element.childNodes.forEach(function (e) {
      checkTimestampInLink(e);
    });
  }
}

function deleteNodes (nodeIns, nodeDel) {
  removeMarkup(nodeIns, 'ins');
  removeMarkup(nodeDel, 'del');
}

function removeMarkup (node, tagName) {
  if (node.tagName === tagName && node.className === 'wm-diff') {
    node.outerHTML = node.innerHTML;
  } else {
    removeMarkup(node.parentElement, tagName);
  }
}

function addNotNill (array, element) {
  if (!_.isNil(element)) {
    array.push([element, getURL(element)]);
  }
}

function getURL (element) {
  if (!_.isNil(element.src))
    return removeWBM(element.src);
  return removeWBM(element.href);
}

function removeWBM (url){
  let urlArray = url.split('/');
  urlArray = urlArray.slice(6);
  return urlArray.join('/');
}
function removeDiffXPATH (xpath, mode){
  let xpathArray = xpath.split('/');
  for (let i = 0; i < xpathArray.length; i++) {
    if (xpathArray[i].includes(mode+'[')){
      xpathArray.splice(i);
      return xpathArray.join('/');
    }
  }
}
