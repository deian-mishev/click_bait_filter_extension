/**
 * Neither this file or any dependency (like style.css) should trigger
 * the plugin reload. This way the popup will not close clearing it state
 */
import "./style.css";

const myRange = document.getElementById('myRange');

chrome.storage.sync.get(["myRangeValue"], function (result) {
    noUiSlider = noUiSlider.create(myRange, {
        connect: true,
        range: {
            min: 0,
            max: 100
        },
        start: [result.myRangeValue || 0, 50],
        pips: { mode: 'count', values: 5, density: 2 }
    });

    const pips = myRange.querySelectorAll('.noUi-value');

    function clickOnPip() {
        const value = Number(this.getAttribute('data-value'));
        myRange.noUiSlider.set(value);
    }

    for (var i = 0; i < pips.length; i++) {

        // For this example. Do this in CSS!
        pips[i].style.cursor = 'pointer';
        pips[i].addEventListener('click', clickOnPip);
    }

    myRange.noUiSlider.on('change', function (values) {
        const val = parseInt(values[0]);
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.storage.sync.set({ myRangeValue: val });
            chrome.tabs.sendMessage(tabs[0].id,
                {
                    type: "rangeChange", value: val
                }
                , null);
        })
    });
});

