import { getGuid } from "./utils";

let rangeValue;
let linksToFilter;
let urlNodes;
let eHide = [];
let eShow = [];
let step = null;
const groups = {}

const GUID = getGuid();

const getCoverElement = () => {
  const cover = document.createElement("DIV");
  const blockedUrl = chrome.runtime.getURL('blocked.png');

  cover.style.backgroundImage = `url(${blockedUrl})`;
  cover.style.backgroundRepeat = 'no-repeat';
  cover.style.backgroundPosition = 'center center';
  cover.style.backgroundSize = 'contain';
  cover.style.width = '100%';
  cover.style.height = '100%';
  cover.style.position = 'absolute';
  cover.style.top = '0px';
  cover.style.left = '0px';

  cover.className = GUID;

  return cover;
}

const addcover = (element) => {
  element.childNodes.length == 0 && (element.style.position = 'relative');
  const cover = getCoverElement();
  element.appendChild(cover);
}

const addStyleString = (str) => {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}

const stopIt = (event) => {
  event.stopPropagation();
  event.preventDefault();
}

const clearAllCover = () => {
  const paras = document.getElementsByClassName(GUID);
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }

  for (let index = 0; index < eShow.length; index++) {
    const element = eShow[index];
    removeFilter(element);
    element.removeEventListener('click', stopIt, false);
  }

  for (let index = 0; index < eHide.length; index++) {
    const element = eHide[index];
    removeFilter(element);
    element.removeEventListener('click', stopIt, false);
  }
}

const applyFilter = (el, value) => {
  value = value ? value : 1;
  const multPx = value * (3 - 1) + 1;
  const multGs = value * (90 - 70) + 70;
  el.style.filter = `blur(${multPx}px) grayscale(${multGs}%)`;
  el.classList.add('someCrasyClass');
}

const removeFilter = (el) => {
  el.style.filter = null;
  el.classList.remove('someCrasyClass');
}

const showhideDom = () => {
  clearAllCover();

  if (rangeValue !== 0) {
    for (let index = 0; index < eHide.length; index++) {

      let element = eHide[index];

      element.addEventListener('click', stopIt, false);
      const diff = rangeValue / 100;
      diff = diff !== 0 ? diff : 0.1;
      applyFilter(element, diff);
      addcover(element);
    }

    for (let j = 0; j < eShow.length; j++) {
      const element = eShow[j];
      const group = groups[linksToFilter[element.href]];
      const meta = group[GUID];

      if (rangeValue >= meta.upperRange) {

        const diff = Math.abs(meta.upperRange - rangeValue) / 90;
        let roundedDecimal = parseFloat(diff.toFixed(1));
        roundedDecimal = roundedDecimal !== 0.0 ? roundedDecimal : 0.1;
        element.addEventListener('click', stopIt, false);
        applyFilter(element, roundedDecimal);
        addcover(element);
      }
    }
  }
  else {
    clearAllCover();
  }
}

chrome.storage.sync.get(["myRangeValue"], function (result) {
  rangeValue = result.myRangeValue ? parseInt(result.myRangeValue) : 50;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'rangeChange':
      // Filter according to range change
      rangeValue = parseInt(request.value);
      showhideDom();
      sendResponse(request);
      break;
    case 'pageSegmentation':
      addStyleString(
        `.someCrasyClass { 
        pointer-events: none;
        user-select: none;
      }`);
      eShow = [];
      eHide = [];
      // Store links to filter for page
      // and filter according to range change
      linksToFilter = request.links;
      urlNodes = document.querySelectorAll('a');
      // More like show potentially
      for (let index = 0; index < urlNodes.length; index++) {
        const element = urlNodes[index];
        if (!linksToFilter[element.href]) {
          eHide.push(element);
        } else {
          eShow.push(element);
        }
      }

      const keys = Object.keys(linksToFilter);

      keys.sort(function (a, b) { return linksToFilter[a] < linksToFilter[b] ? 1 : -1 });

      for (let i = 0; i < keys.length; i++) {
        const element = keys[i];
        if (!groups[linksToFilter[element]]) groups[linksToFilter[element]] = [];
        groups[linksToFilter[element]].push(element)
      }

      const groupInd = Object.keys(groups)
      step = 100 / groupInd.length;

      for (let i = 0; i < groupInd.length; i++) {
        const group = groups[groupInd[i]];
        group[GUID] = {
          lowerRange: step * i,
          upperRange: step * (i + 1)
        }
      }


      sendResponse(linksToFilter);
      showhideDom();
      break;
    default:
  }
});

// document.onclick = function (e) {
//   if (e.target.nodeName === "A") {
//     var href = e.target.getAttribute("href"),
//       selfhost = window.location.hostname;
//     if (href.indexOf(selfhost) !== -1) {
//       e.stopPropagation();
//       e.preventDefault();
//       chrome.runtime.sendMessage({
//         link: href,
//         domain: document.URL
//       });
//     }
//   }
// };