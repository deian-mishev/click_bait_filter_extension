document.onclick = function(e) {
  if (e.target.nodeName === "A") {
    var href = e.target.getAttribute("href"),
      selfhost = window.location.hostname;
    if (href.indexOf(selfhost) !== -1) {
      e.stopPropagation();
      e.preventDefault();
      chrome.runtime.sendMessage({
        link: href,
        action: "gkXhYFWNhLV7ggym"
      });
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action && request.action === "gkXhYFWNhLV7ggym") {
    // document.body.innerHTML = "Was Fine To filter: " +  request.url;
    sendResponse("Was Fine To filter: " +  request.url);
  }
});