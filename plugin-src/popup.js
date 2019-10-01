/**
 * Neither this file or any dependency (like style.css) should trigger
 * the plugin reload. This way the popup will not close clearing it state
 */
import "./style.css";

const myRange = document.getElementById("myRange");

chrome.storage.sync.get(["myRangeValue"], function (result) {
    myRange.value = result.myRangeValue;
});

const sendMessage = (e) => (chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.storage.sync.set({ myRangeValue: e.target.value });
    chrome.tabs.sendMessage(tabs[0].id,
        { type: "rangeChange", value: e.target.value, action: 'gkXhYFWNhLV7ggym' }
        , null);
}));

myRange.addEventListener("change", sendMessage);
