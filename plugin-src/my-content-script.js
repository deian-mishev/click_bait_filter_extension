import { getGuid, showhideDom, addStyleString } from "./utils";

let valueLow;
let valueHigh;
let linksToFilter;
let eHide = [];
let eShow = [];
const groups = {}

const GUID = getGuid();

chrome.storage.sync.get(["myRangeValueLow", "myRangeValueHigh"], function (result) {
  valueLow = result.myRangeValueLow ? parseInt(result.myRangeValueLow) : 0;
  valueHigh = result.myRangeValueHigh ? parseInt(result.myRangeValueHigh) : 100;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'rangeChange':
      // Filter according to range change
      valueLow = parseInt(request.valueLow);
      valueHigh = parseInt(request.valueHigh);
      showhideDom(valueLow, valueHigh, eHide, eShow, groups, linksToFilter);
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
      const urlNodes = document.querySelectorAll('a');
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
      const step = 100 / groupInd.length;

      for (let i = 0; i < groupInd.length; i++) {
        const group = groups[groupInd[i]];
        group[GUID] = {
          lowerRange: step * i,
          upperRange: step * (i + 1)
        }
      }

      sendResponse(linksToFilter);
      showhideDom(valueLow, valueHigh, eHide, eShow, groups, linksToFilter);
      break;
    default:
  }
});