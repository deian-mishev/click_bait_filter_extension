import { guid, getCookies, extractHostname } from "./utils";

const guidId = guid();
// REQUESTING SEGMENTATION FROM BACKEND
const filterScenes = (tabId, changeInfo, tab) => {
  // Case page is loading)
  const xhttp = new XMLHttpRequest();
  if (changeInfo.status === 'complete' && tab.url.indexOf('http') === 0) {
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        chrome.tabs.sendMessage(tabId, {
          links: JSON.parse(xhttp.response), type: 'pageSegmentation'
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
      page: tab.url,
      token: localStorage.getItem('jwtToken')
    }));
  } else if (!changeInfo.favIconUrl && changeInfo.status !== 'complete') {
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        chrome.tabs.sendMessage(tabId, {
          links: JSON.parse(xhttp.response), type: 'pageSegmentation'
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
      token: localStorage.getItem('jwtToken')
    }));
  }
};

chrome.tabs.onActiveChanged.addListener(filterScenes);
chrome.tabs.onUpdated.addListener(filterScenes);

//ADDING SEGMENTATION TO THE USER PROFILE
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== "SIGN_CONNECT") {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        sendResponse();
      }
    };
    msg.token = localStorage.getItem('jwtToken');
    xhttp.open("POST", "http://localhost:3001/link", true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(msg));
  }
});