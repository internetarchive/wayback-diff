import _ from 'lodash';
import * as xpath from 'simple-xpath-position';

var ins, del;
const absoluteUrlRegex = new RegExp(/\/\/web\.archive\.org\/web\/\d{14}/gm);
const relativeUrlRegex = new RegExp(window.location.origin+ '/web/\\d{14}', 'gm');
export function getTimestampCleanDiff(insertions, deletions) {

  let domIns = document.createElement( 'html' );
  let domDel = document.createElement( 'html' );

  domIns.innerHTML = insertions;
  domDel.innerHTML = deletions;

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
  let j = 0;
  while (k < foundDel.length) {
    while (j< foundIns.length && k < foundDel.length) {
      if (_.isEqual(foundDel[k][1], foundIns[j][1])){
        try {
          const dirtyDelXpath = xpath.fromNode(foundDel[k][0], domDel);
          const dirtyInsXpath = xpath.fromNode(foundIns[j][0], domIns);
          let delxpath = removeDiffXPATH(dirtyDelXpath, 'del');
          let insxpath = removeDiffXPATH(dirtyInsXpath, 'ins');
          if (_.isEqual(delxpath, insxpath)) {
            deleteNodes(foundIns[j][0], foundDel[k][0]);
            k++;
          }
        } catch (e) {
          console.warn('Element might already be removed. Skipping..');
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
  return {insertions: domIns.outerHTML, deletions: domDel.outerHTML};
}

function getLinkFromElement (hasLink) {
  if (!_.isNil(hasLink.src))
    return hasLink.src;
  if (!_.isNil(hasLink.href))
    return hasLink.href;
  return hasLink.action;
}

function checkTimestampInLink (element) {
  let link = getLinkFromElement(element);
  if (_.isNil(link)) {
    link = getLinkFromElement(element.parentNode.parentNode);
  }
  if (!_.isNil(link)) {
    if (link.match(absoluteUrlRegex)) {
      return element;
    }
    if (link.match(relativeUrlRegex)) {
      return element;
    }

    element.childNodes.forEach(function (e) {
      checkTimestampInLink(e);
    });
  }
}

function deleteNodes (nodeIns, nodeDel) {
  removeMarkup(nodeIns, 'INS');
  removeMarkup(nodeDel, 'DEL');
}

function removeMarkup (node, tagName) {
  if (node.tagName === tagName && node.className === 'wm-diff') {
    node.outerHTML = node.innerHTML;
  } else {
    let parentNode = node.parentNode;
    removeMarkup(parentNode, tagName);
  }
}

function addNotNill (array, element) {
  if (!_.isNil(element)) {
    let url = getCleanURL(element);
    if (_.isNil(url)) {
      url = getCleanURL(element.parentNode.parentNode);
    }
    if (!_.isNil(url)) {
      array.push([element, url]);
    }
  }
}

function getCleanURL (element) {
  if (!_.isNil(element.src))
    return removeWBM(element.src);
  if (!_.isNil(element.href))
    return removeWBM(element.href);
  if (!_.isNil(element.action))
    return removeWBM(element.action);
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
