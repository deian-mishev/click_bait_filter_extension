import { guid, getCookies, extractHostname } from "./utils";

// REQUESTING SEGMENTATION FROM BACKEND
let lastRequested;
const filterScenes = (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.indexOf('http') !== -1) {
    const tempRequested = extractHostname(tab.url);
    if (lastRequested === tempRequested) return;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        chrome.tabs.sendMessage(tabId, {
          action: 'gkXhYFWNhLV7ggym', url: xhttp.responseText
        }, function (response) {
          console.log(response);
        });
      }
    };
    xhttp.open(
      "GET",
      "http://localhost:3001/pageSegmentation/" + tempRequested,
      true
    );
    xhttp.withCredentials = true;
    lastRequested = tempRequested;
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
  }
};

chrome.tabs.onActiveChanged.addListener(filterScenes);
chrome.tabs.onUpdated.addListener(filterScenes);

//ADDING SEGMENTATION TO THE USER PROFILE
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== "SIGN_CONNECT" && msg.action === 'gkXhYFWNhLV7ggym') {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        sendResponse();
      }
    };
    msg.action = guid();
    xhttp.open("POST", "http://localhost:3001/link", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(msg));
  }
});


// chrome.tabs.onCreated.addListener(() => {
//   console.log("onCreated");
// });

// chrome.tabs.onUpdated.addListener(() => {
//   console.log("onUpdated");
// });

// chrome.tabs.onMoved.addListener(() => {
//   console.log("onMoved");
// });

// chrome.tabs.onSelectionChanged.addListener(() => {
//   console.log("onSelectionChanged");
// });

// chrome.tabs.onActiveChanged.addListener(() => {
//   console.log("onActiveChanged");
// });

// chrome.tabs.onActivated.addListener(() => {
//   console.log("onActivated");
// });

// chrome.tabs.onHighlightChanged.addListener(() => {
//   console.log("onHighlightChanged");
// });

// chrome.tabs.onDetached.addListener(() => {
//   console.log("onDetached");
// });

// chrome.tabs.onAttached.addListener(() => {
//   console.log("onAttached");
// });

// chrome.tabs.onRemoved.addListener(() => {
//   console.log("onRemoved");
// });

// chrome.tabs.onReplaced.addListener(() => {
//   console.log("onReplaced");
// });

// chrome.windows.onCreated.addListener(() => {
//   console.log("windows_onCreated");
// });

// chrome.windows.onRemoved.addListener(() => {
//   console.log("windows_onRemoved");
// });

// chrome.windows.onFocusChanged.addListener(() => {
//   console.log("windows_onFocusChanged");
// });

// chrome.windows.onFocusChanged.addListener(filterScenes);

// chrome.runtime.onConnect.addListener(function () {
//   console.log("I started up!");
//   chrome.storage.sync.get(["uuid"], function (result) { });
// });

// chrome.storage.sync.get(["key"], function(result) {
//   console.log("Value currently is " + result.key);
// });

// chrome.browserAction.onClicked.addListener(function() {});

// chrome.storage.sync.set({ key: "asa" }, function(a) {
//   console.log("Value is set to asa");
// });
