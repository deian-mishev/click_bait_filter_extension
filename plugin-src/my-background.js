import { getToken, setToken, getGuid } from "./utils";
import { PORT, API, URL } from './constants';

const SERVER_ADDRESS = `${URL}:${PORT}/${API}`;
const GUID = getGuid();

// REQUESTING SEGMENTATION FROM BACKEND
const filterScenes = (tabId, changeInfo, tab) => {
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "POST",
    `${SERVER_ADDRESS}/pageSegmentation`,
    true
  );

  xhttp.withCredentials = true;
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      setToken(xhttp);
      chrome.tabs.sendMessage(tabId, {
        links: JSON.parse(xhttp.response), type: 'pageSegmentation'
      });
    } else if (this.readyState == 4 && this.status == 400) {
      localStorage.removeItem(GUID)
    }
  };

  if (changeInfo.status === 'complete' && tab.url.indexOf('http') === 0) {
    xhttp.send(JSON.stringify({
      tabId,
      page: tab.url
    }));
  } else if (!changeInfo.favIconUrl && changeInfo.status !== 'complete') {
    xhttp.send(JSON.stringify({
      tabId
    }));
  }
};

const callback = (x
) => {
  if (x.type === "main_frame" && x.initiator) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", `${SERVER_ADDRESS}/click`, true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send(JSON.stringify(
      {
        link: x.url,
        domain: x.initiator
      }));
  }
};

chrome.webRequest.onBeforeRequest.addListener(callback, {
  urls: [
    "http://*/*",
    "https://*/*"
  ]
});

chrome.tabs.onActiveChanged.addListener(filterScenes);
chrome.tabs.onUpdated.addListener(filterScenes);