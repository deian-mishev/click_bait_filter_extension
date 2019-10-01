import { guid, getCookies, extractHostname } from "./utils";

// REQUESTING SEGMENTATION FROM BACKEND
const filterScenes = (tabId, changeInfo, tab) => {
  // Case page is loading
  const xhttp = new XMLHttpRequest();
  if (changeInfo.status === 'loading' && tab.url.indexOf('http') === 0) {
    const tempRequested = extractHostname(tab.url);
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        chrome.tabs.sendMessage(tabId, {
          action: 'gkXhYFWNhLV7ggym', links: JSON.parse(xhttp.response), type: 'pageSegmentation'
        });
      }
    };
    xhttp.open(
      "POST",
      "http://localhost:3001/pageSegmentation",
      true
    );
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      tabId,
      page: tempRequested,
      action: guid()
    }));
  } else if (!changeInfo.favIconUrl && changeInfo.status !== 'complete') {
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        chrome.tabs.sendMessage(tabId, {
          action: 'gkXhYFWNhLV7ggym', links: JSON.parse(xhttp.response), type: 'pageSegmentation'
        });
      }
    };
    xhttp.open(
      "POST",
      "http://localhost:3001/pageSegmentation",
      true
    );
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      tabId,
      action: guid()
    }));
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

// chrome.windows.onFocusChanged.addListener(filterScenes);

// chrome.tabs.onCreated.addListener((x, y, z, m) => {
//   console.log("onCreated");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.tabs.onUpdated.addListener((x, y, z, m) => {
//   console.log("onUpdated");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.tabs.onMoved.addListener((x, y, z, m) => {
//   console.log("onMoved");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.tabs.onSelectionChanged.addListener((x, y, z, m) => {
//   console.log("onSelectionChanged");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.tabs.onActiveChanged.addListener((x, y, z, m) => {
//   console.log("onActiveChanged");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.tabs.onActivated.addListener((x, y, z, m) => {
//   console.log("onActivated");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.tabs.onHighlightChanged.addListener((x, y, z, m) => {
//   console.log("onHighlightChanged");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.tabs.onDetached.addListener((x, y, z, m) => {
//   console.log("onDetached");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.tabs.onAttached.addListener((x, y, z, m) => {
//   console.log("onAttached");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.tabs.onRemoved.addListener((x, y, z, m) => {
//   console.log("onRemoved");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.tabs.onReplaced.addListener((x, y, z, m) => {
//   console.log("onReplaced");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.windows.onCreated.addListener(() => {
//   console.log("windows_onCreated");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.windows.onRemoved.addListener((x, y, z, m) => {
//   console.log("windows_onRemoved");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });

// chrome.windows.onFocusChanged.addListener((x, y, z, m) => {
//   console.log("windows_onFocusChanged");
//   console.log(x, y, z, m);
//   console.log("------------------------");
// });


// chrome.runtime.onConnect.addListener(function () {
//   console.log("I started up!");
//   chrome.storage.sync.get(["uuid"], function (result) { });
// });
