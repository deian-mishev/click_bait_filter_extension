import { getToken, setToken, getGuid } from "./utils";
import { PORT, API, URL } from './constants';

const SERVER_ADDRESS = `${URL}:${PORT}/${API}`;
const GUID = getGuid();
let isEnabled;
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

  const callb = function (a) {
    xhttp.setRequestHeader('Authorization', 'Bearer ' + a);
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        setToken(xhttp, function () {
          chrome.tabs.sendMessage(tabId, {
            links: JSON.parse(xhttp.response), type: 'pageSegmentation'
          });
        });
      } else if (this.readyState == 4 && this.status == 400) {
        chrome.storage.sync.remove(GUID)
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
  }
  getToken(callb);
};

const callback = (x
) => {
  if (x.type === "main_frame" && x.initiator) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", `${SERVER_ADDRESS}/click`, true);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-type", "application/json");
    const callb = function (a) {
      xhttp.setRequestHeader('Authorization', 'Bearer ' + a);
      xhttp.send(JSON.stringify(
        {
          link: x.url,
          domain: x.initiator
        }));
    }
    getToken(callb)
  }
};

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'switch_toggler') {
    isEnabled = isEnabled === 1 ? 0 : 1;
    setEnabled(isEnabled);
    var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
    var hour = time[1] % 12 || 12;               // The prettyprinted hour.
    var period = time[1] < 12 ? 'a.m.' : 'p.m.';
    new Notification(hour + time[2] + ' ' + period, {
      icon: 'Icon-48.png',
      body: `You just ${isEnabled === 1 ? 'ACTIVATED' : 'DEACTIVATED'} click registy!`
    });
    var views = chrome.extension.getViews({ type: "popup" });
    if (views.length > 0) {
      chrome.runtime.sendMessage({ type: "switch_toggler", value: isEnabled }, null);
    }
  }
});

const setEnabled = (enabled) => {
  chrome.storage.sync.set({ "registerChange": enabled }, function () {
    if (enabled === 1) {
      chrome.webRequest.onBeforeRequest.addListener(callback, {
        urls: [
          "http://*/*",
          "https://*/*"
        ]
      });
    } else {
      chrome.webRequest.onBeforeRequest.removeListener(callback, {
        urls: [
          "http://*/*",
          "https://*/*"
        ]
      });
    }
  })
}

chrome.storage.sync.get(["registerChange"], function (result) {
  isEnabled = result && result.registerChange !== undefined ? result.registerChange : 0;
  setEnabled(isEnabled);
});

chrome.tabs.onActiveChanged.addListener(filterScenes);
chrome.tabs.onUpdated.addListener(filterScenes);


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'registerChange':
      const value = request.value;
      setEnabled(value);
      sendResponse(request);
      break;
    default:
  }
});