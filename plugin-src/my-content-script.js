import { showhideDom, addStyleString, showTopology } from "./utils";

let valueLow;
let valueHigh;
let linksToFilter;
let runtimeLinks = [];
let eHide = [];
let eShow = [];
const groups = {}

chrome.storage.sync.get(["myRangeValueLow", "myRangeValueHigh"], function (result) {
  if (result.myRangeValueHigh === undefined || result.myRangeValueLow === undefined) {
    valueLow = 0;
    valueHigh = 100;
    chrome.storage.sync.set({ myRangeValueLow: valueLow, myRangeValueHigh: valueHigh });
  } else {
    valueLow = parseInt(result.myRangeValueLow);
    valueHigh = parseInt(result.myRangeValueHigh);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'pageLinksGather':
      runtimeLinks = [];
      const pageNodes = document.querySelectorAll('a');
      for (let index = 0; index < pageNodes.length; index++) {
        const currentNode = pageNodes[index].href;
        if (runtimeLinks.indexOf(currentNode) === -1) {
          runtimeLinks.push(pageNodes[index].href);
        }
      }
      sendResponse(runtimeLinks);
      break;
    case 'showTopology':
      // chrome.storage.sync.set({ myRangeValueLow: valueLow, myRangeValueHigh: valueHigh });
      if (request.value) {
        showTopology(eHide, eShow, groups, linksToFilter);
      } else {
        showhideDom(valueLow, valueHigh, eHide, eShow, groups, linksToFilter);
      }
      sendResponse(request);
      break;
    case 'rangeChange':
      // Filter according to range change
      valueLow = parseInt(request.valueLow);
      valueHigh = parseInt(request.valueHigh);
      showhideDom(valueLow, valueHigh, eHide, eShow, groups, linksToFilter);
      sendResponse(request);
      break;
    case 'pageSegmentation':
      addStyleString(
        `.clickbait-filter-locator { 
        pointer-events: none;
        user-select: none;
      }`);
      eShow = [];
      eHide = [];
      // Store links to filter for page
      // and filter according to range change
      linksToFilter = request.links;
      if (linksToFilter) {

        const urlNodes = document.querySelectorAll('a');
        // More like show potentially
        for (let index = 0; index < urlNodes.length; index++) {
          const element = urlNodes[index];
          if (!linksToFilter[element.href]) {
            // Decided to not mess arround with anything 
            // not crunched by the model
            // eHide.push(element);
          } else {
            eShow.push(element);
          }
        }

        const keys = Object.keys(linksToFilter);
        keys.sort(function (a, b) { return linksToFilter[a] > linksToFilter[b] ? 1 : -1 });

        for (let i = 0; i < keys.length; i++) {
          const element = keys[i];
          if (!groups[linksToFilter[element]]) groups[linksToFilter[element]] = [];
          groups[linksToFilter[element]].push(element)
        }


        const groupInd = Object.keys(groups)
        const step = 100 / groupInd.length;

        for (let i = 0; i < groupInd.length; i++) {
          const group = groups[groupInd[i]];
          const low = 100 - (step * i);
          const high = 100 - (step * (i + 1));
          group['clickbait_locator'] = {
            lowerRange: low,
            upperRange: high,
            // mid: Math.floor(Math.abs(high - low) / 2) + low
          }
        }

        chrome.storage.sync.get(["showTopology"], function (result) {
          if (result.showTopology === undefined || !result.showTopology) {
            showhideDom(valueLow, valueHigh, eHide, eShow, groups, linksToFilter);
          } else {
            showTopology(eHide, eShow, groups, linksToFilter);
          }
        });
      }


      sendResponse(linksToFilter);
      break;
    default:
  }
});