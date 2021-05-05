import { showhideDom, addStyleString, showTopology, getUrl } from "./utils";

let valueLow;
let valueHigh;
let linksToFilter;
let runtimeLinks = {};
let tempspace = [];
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
      tempspace = [];
      const pageNodes = document.querySelectorAll('a');
      for (let index = 0; index < pageNodes.length; index++) {
        const currentNode = pageNodes[index].href;
        const urlData = getUrl(currentNode);
        if (urlData) {
          const joined_url = urlData.join('');
          if (!tempspace.includes(joined_url)) {
            runtimeLinks.push({ name: currentNode });
            tempspace.push(joined_url);
          }
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
      if (linksToFilter && !!linksToFilter.length) {
        const keys = [];
        const temp = {};
        for (const link of linksToFilter) {
          keys.push(link.name);
          temp[link.name] = link.score;
        }
        linksToFilter = temp;

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

        for (let i = 0; i < keys.length; i++) {
          const element = keys[i];
          if (!groups[linksToFilter[element]]) groups[linksToFilter[element]] = [];
          groups[linksToFilter[element]].push(element)
        }

        const groupInd = Object.keys(groups).sort((a, b) => a - b);
        const step = 50 / groupInd.length;

        for (let i = 0; i < groupInd.length; i++) {
          const group = groups[groupInd[i]];
          const low = 50 - (step * i);
          const high = 50 - (step * (i + 1));
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