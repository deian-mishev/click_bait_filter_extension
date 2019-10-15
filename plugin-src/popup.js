/**
 * Neither this file or any dependency (like style.css) should trigger
 * the plugin reload. This way the popup will not close clearing it state
 */
import "./style.css";

const myRange = document.getElementById('myRange');

chrome.storage.sync.get(["myRangeValueLow", "myRangeValueHigh"], function (result) {
    noUiSlider = noUiSlider.create(myRange, {
        connect: true,
        range: {
            min: 0,
            max: 100
        },
        start: [result.myRangeValueLow, result.myRangeValueHigh],
        pips: { mode: 'count', values: 5, density: 2 }
    });

    myRange.noUiSlider.on('change', function (values) {
        const valueLow = parseInt(values[0]);
        const valueHigh = parseInt(values[1]);
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.storage.sync.set({ myRangeValueLow: valueLow, myRangeValueHigh: valueHigh });
            chrome.tabs.sendMessage(tabs[0].id,
                {
                    type: "rangeChange", valueLow: valueLow, valueHigh: valueHigh
                }
                , null);
        })
    });
});

