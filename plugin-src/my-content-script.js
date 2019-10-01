document.onclick = function (e) {
  if (e.target.nodeName === "A") {
    var href = e.target.getAttribute("href"),
      selfhost = window.location.hostname;
    if (href.indexOf(selfhost) !== -1) {
      e.stopPropagation();
      e.preventDefault();
      chrome.runtime.sendMessage({
        link: href,
        domain: document.URL,
        action: "gkXhYFWNhLV7ggym"
      });
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // document.body.innerHTML = "Was Fine To filter: " + linksToFilter
  if (request.action && request.action === "gkXhYFWNhLV7ggym") {
    switch (request.type) {
      case 'rangeChange':
        // Filter according to range change
        sendResponse(request);
        debugger;
        console.log(request)
        break;
      case 'pageSegmentation':
        // Store links to filter for page
        // and filter according to range change
        const linksToFilter = JSON.stringify(request.links);
        sendResponse(linksToFilter);
        console.log(linksToFilter)
        break;
      default:
    }
  }
});