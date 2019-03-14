import _ from 'lodash';
import * as xpath from 'simple-xpath-position';

const absoluteUrlRegex = new RegExp(/\/\/web\.archive\.org\/web\/\d{14}/gm);
const relativeUrlRegex = new RegExp(window.location.origin+ '/web/\\d{14}', 'gm');
export function getTimestampCleanDiff(insertions, deletions) {

  let domIns = document.createElement( 'html' );
  let domDel = document.createElement( 'html' );

  domIns.innerHTML = insertions;
  domDel.innerHTML = deletions;

  let ins = domIns.getElementsByTagName('ins');
  let del = domDel.getElementsByTagName('del');
  let foundIns = [];
  let foundDel = [];

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

  let k = foundDel.length - 1;
  let j = foundIns.length - 1;
  if (foundDel.length > 0 && foundIns.length > 0) {
    while (k >= 0) {
      j = foundIns.length - 1;
      while (j >= 0) {
        if (_.isEqual(foundDel[k][1], foundIns[j][1])) {
          try {
            const dirtyDelXpath = xpath.fromNode(foundDel[k][0], domDel);
            const dirtyInsXpath = xpath.fromNode(foundIns[j][0], domIns);
            let delxpath = removeDiffXPATH(dirtyDelXpath, 'del');
            let insxpath = removeDiffXPATH(dirtyInsXpath, 'ins');
            if (_.isEqual(delxpath, insxpath)) {
              deleteNodes(foundIns[j][0], foundDel[k][0]);
              j--;
            }
          } catch (e) {
            console.warn('Element might already be removed. Skipping..');
            break;
          }
        }
        j--;
      }
      k--;
      j = foundIns.length - 1;
    }
  }

  if (del.length > 0 && ins.length > 0) {
    k = del.length - 1;
    while (k >= 0) {
      if (isNotAResource(del[k])) {
        j = ins.length - 1;
        while (j >= 0) {
          if (isNotAResource(ins[j])) {
            if (_.isEqual(del[k].innerHTML, ins[j].innerHTML)) {
              try {
                let dirtyDelXpath = xpath.fromNode(del[k], domDel);
                let dirtyInsXpath = xpath.fromNode(ins[j], domIns);
                let delxpath = removeDiffXPATH(dirtyDelXpath, 'del');
                let insxpath = removeDiffXPATH(dirtyInsXpath, 'ins');
                if (_.isEqual(delxpath, insxpath)) {
                  deleteNodes(ins[j], del[k]);
                  break;
                } else {
                  j--;
                }
              } catch (e) {
                console.warn('Element might already be removed. Skipping..');
                break;
              }
            }
          }
          j--;
        }
      }
      k--;
      j = ins.length - 1;
    }
  }
  return {insertions: domIns.outerHTML, deletions: domDel.outerHTML};
}

function getLinkFromElement (hasLink) {
  if (!_.isNil(hasLink.src))
    return hasLink.src;
  if (!_.isNil(hasLink.href))
    return hasLink.href;
  return hasLink.action;
}

function isNotAResource (element) {
  return (!element.src && !element.href && !element.action);
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
  removeMarkup(nodeIns);
  removeMarkup(nodeDel);
}

function removeMarkup (node) {
  if (node.className === 'wm-diff') {
    node.outerHTML = node.innerHTML;
  } else {
    let parentNode = node.parentNode;
    removeMarkup(parentNode);
  }
}

function addNotNill (array, element) {
  if (!_.isNil(element)) {
    let url = getWBMCleanURL(element);
    if (_.isNil(url)) {
      url = getWBMCleanURL(element.parentNode.parentNode);
    }
    if (!_.isNil(url)) {
      array.push([element, normalizeURL(url)]);
    }
  }
}

function getWBMCleanURL (element) {
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

function normalizeURL (url) {
  let lowercaseString = url.toLowerCase();
  if (lowercaseString.startsWith('/www.')){
    return '/' + lowercaseString.slice(5);
  }
  return lowercaseString;
}
