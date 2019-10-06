import { getGuid, getCookies, extractHostname } from "./utils";

let rangeValue;
let linksToFilter;
let urlNodes;
let eHide = [];
let eShow = [];
const groups = {}

const GUID = getGuid();

const clearAllCover = () => {
  const paras = document.getElementsByClassName(GUID);

  while (paras[0]) {
    paras[0].removeEventListener('customClick', function (event) {
      event.stopPropagation();
      event.preventDefault();
    }, false)
    paras[0].parentNode.removeChild(paras[0]);
  }
}

const showhideDom = () => {
  clearAllCover();


  if (rangeValue !== 0) {
    for (let index = 0; index < eHide.length; index++) {

      let element = eHide[index];
      element = element.parentNode;
      element.style.position = 'relative';
      const cover = document.createElement("DIV");
      const blockedUrl = chrome.runtime.getURL('blocked.png');

      cover.style.backgroundImage = `url(${blockedUrl})`;
      cover.style.backgroundColor = 'white';
      cover.style.backgroundRepeat = 'no-repeat';
      cover.style.backgroundPosition = 'center center';
      cover.style.backgroundSize = 'contain';
      cover.style.width = '100%';
      cover.style.height = '100%';
      cover.style.position = 'absolute';
      cover.style.top = '0px';
      cover.style.left = '0px';
      cover.style.opacity = '0.9';
      cover.style.zIndex = '999999';
      cover.addEventListener('customClick', function (event) {
        event.stopPropagation();
        event.preventDefault();
      }, false)

      cover.className = GUID;
      element.appendChild(cover);

      const groupInd = Object.keys(groups)
      const step = 100 / groupInd.length;

      for (let index = 0; index < groupInd.length; index++) {
        const group = groups[index];

        // const lowerRange = step * index;
        // const upperRange = step * index + 1;

        // for (let j = 0; j < eShow.length; j++) {
        //   const element = eShow[j];
        //   if (group.includes(element.href)) {

        //   }
        // }
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
      // Store links to filter for page
      // and filter according to range change
      linksToFilter = request.links;
      urlNodes = document.querySelectorAll('a');
      // More like show potentially
      for (let index = 0; index < urlNodes.length; index++) {
        const element = urlNodes[index];
        !linksToFilter[element.href] ? eHide.push(element) : eShow.push(element);
      }

      const keys = Object.keys(linksToFilter);

      keys.sort(function (a, b) { return linksToFilter[a] < linksToFilter[b] ? 1 : -1 });

      for (let i = 0; i < keys.length; i++) {
        const element = keys[i];
        if (!groups[linksToFilter[element]]) groups[linksToFilter[element]] = [];
        groups[linksToFilter[element]].push(element)
      }

      showhideDom();
      sendResponse(linksToFilter);
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