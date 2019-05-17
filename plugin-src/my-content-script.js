import depSample from "./dependency-sample";

console.log(depSample());

document.onclick = function(e) {
  if (e.target.nodeName === "A") {
    var href = e.target.getAttribute("href"),
      selfhost = window.location.hostname;
    if (href.indexOf(selfhost) !== -1) {
      e.stopPropagation();
      e.preventDefault();
      chrome.runtime.sendMessage({
        link: href
      });
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action && request.action === "trimPage") {
    console.info("To filter:", request.urls);
    sendResponse("wasFine");
  }
});
