import isNil from 'lodash/isNil';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import { fromNode } from 'simple-xpath-position';

const absoluteUrlRegex = new RegExp(/\/\/web\.archive\.org\/web\/\d{14}/gm);
const relativeUrlRegex = new RegExp(window.location.origin + '/web/\\d{14}', 'gm');

/**
 * This function will parse all of the markup added by web-monitoring-processing in order to remove any false positive
 * markup information (for example when comparing links to the same destination but with different timestamps
 */
export function getTimestampCleanDiff (insertions, deletions) {
  // Create new HTML DOM elements to add web-monitoring-processing's responses to
  const domIns = document.createElement('html');
  const domDel = document.createElement('html');
  domIns.innerHTML = insertions;
  domDel.innerHTML = deletions;
  let ins = domIns.getElementsByTagName('ins');
  let del = domDel.getElementsByTagName('del');
  const foundIns = [];
  const foundDel = [];

  // Get all of web-monitoring-processing's del elements that link to a
  // resource and have at least one child, meaning that they highlight content
  for (let i = 0, len = del.length; i < len; i++) {
    if (isEqual(del[i].className, 'wm-diff') && del[i].childNodes.length > 0) {
      del[i].childNodes.forEach(function (child) {
        const result = checkTimestampInLink(child);
        // constant result might be nil, so we wouldn't want to add nill values to the array
        addNotNill(foundDel, result);
      });
    }
  }
  // Get all of web-monitoring-processing's ins elements that link to a
  // resource and have at least one child, meaning that they highlight content.
  for (let i = 0, len = ins.length; i < len; i++) {
    if (isEqual(ins[i].className, 'wm-diff') && ins[i].childNodes.length > 0) {
      ins[i].childNodes.forEach(function (child) {
        const result = checkTimestampInLink(child);
        addNotNill(foundIns, result);
      });
    }
  }

  let k = foundDel.length - 1;
  let j = foundIns.length - 1;
  // If there are ins and del elements that link to a resource added from
  // web-monitoring-processing
  if (foundDel.length > 0 && foundIns.length > 0) {
    while (k >= 0) {
      j = foundIns.length - 1;
      while (j >= 0) {
        // If their linked resource is the same
        if (isEqual(foundDel[k][1], foundIns[j][1])) {
          try {
            const dirtyDelXpath = fromNode(foundDel[k][0], domDel);
            const dirtyInsXpath = fromNode(foundIns[j][0], domIns);
            const delxpath = removeDiffXPATH(dirtyDelXpath, 'del');
            const insxpath = removeDiffXPATH(dirtyInsXpath, 'ins');
            if (isEqual(delxpath, insxpath)) {
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

  del = filter(del, isNotAResource);
  ins = filter(ins, isNotAResource);

  if (del.length > 0 && ins.length > 0) {
    k = del.length - 1;
    while (k >= 0) {
      // If this element is not something that should have concerned us at the previous loop
      j = ins.length - 1;
      while (j >= 0) {
        // If their contents are identical
        if (isEqual(del[k].innerHTML, ins[j].innerHTML)) {
          try {
            const dirtyDelXpath = fromNode(del[k], domDel);
            const dirtyInsXpath = fromNode(ins[j], domIns);
            const delxpath = removeDiffXPATH(dirtyDelXpath, 'del');
            const insxpath = removeDiffXPATH(dirtyInsXpath, 'ins');
            if (isEqual(delxpath, insxpath)) {
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
        j--;
      }
      k--;
      j = ins.length - 1;
    }
  }
  return { insertions: domIns.outerHTML, deletions: domDel.outerHTML };
}

export function getLinkFromElement (hasLink) {
  if (!isNil(hasLink.src)) {
    return hasLink.src;
  }
  if (!isNil(hasLink.href)) {
    return hasLink.href;
  }
  return hasLink.action;
}

export function isNotAResource (element) {
  return (!element.src && !element.href && !element.action);
}

export function checkTimestampInLink (element) {
  let link = getLinkFromElement(element);
  if (isNil(link)) {
    link = getLinkFromElement(element.parentNode.parentNode);
  }
  if (!isNil(link)) {
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
    removeMarkup(node.parentNode);
  }
}

function addNotNill (array, element) {
  if (!isNil(element)) {
    let url = getWBMCleanURL(element);
    if (isNil(url)) {
      url = getWBMCleanURL(element.parentNode.parentNode);
    }
    if (!isNil(url)) {
      array.push([element, normalizeURL(url)]);
    }
  }
}

export function getWBMCleanURL (element) {
  if (!isNil(element.src)) {
    return removeWBM(element.src);
  }
  if (!isNil(element.href)) {
    return removeWBM(element.href);
  }
  if (!isNil(element.action)) {
    return removeWBM(element.action);
  }
}

// Remove http://web.archive.org/web/20190325071045/ prefix
export function removeWBM (url) {
  return url.split('/').slice(7).join('/');
}

// mode can be 'ins' or 'del'
// Example input xpath: '/body[1]/div[2]/p[2]/a[1]/ins[1]'
// Example output xpath: '/body[1]/div[2]/p[2]/a[1]'
export function removeDiffXPATH (xpath, mode) {
  const loc = xpath.indexOf('/' + mode + '[');
  if (loc >= -1) {
    return xpath.substring(0, loc);
  }
}

export function normalizeURL (url) {
  if (url.toLowerCase().startsWith('/www.')) {
    return '/' + url.slice(5);
  }
  return url;
}
