import { guid, getCookies, extractHostname } from "./utils";

let lastRequested;
const onFocusChange = function() {
  chrome.tabs.getSelected(null, function(tab) {
    const tempRequested = extractHostname(tab.url);
    if (lastRequested === tempRequested) return;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        chrome.tabs.query({ active: true, currentWindow: true }, function(
          tabs
        ) {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: "trimPage", urls: xhttp.responseText },
              function(response) {
                console.log(response);
              }
            );
          }
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
  });
};

chrome.windows.onFocusChanged.addListener(onFocusChange);

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.type !== "SIGN_CONNECT") {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        sendResponse();
        console.log(xhttp.responseText);
      }
    };

    console.log(msg.link);
    xhttp.open("POST", "http://localhost:3001/link", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(msg));
  }
});

chrome.runtime.onConnect.addListener(function() {
  console.log("I started up!");
  chrome.storage.sync.get(["uuid"], function(result) {});
});

// chrome.storage.sync.get(["key"], function(result) {
//   console.log("Value currently is " + result.key);
// });

// chrome.browserAction.onClicked.addListener(function() {});

// chrome.storage.sync.set({ key: "asa" }, function(a) {
//   console.log("Value is set to asa");
// });
