/**
 * Neither this file or any dependency (like style.css) should trigger
 * the plugin reload. This way the popup will not close clearing it state
 */
import "./style.css";

const myRange = document.getElementById('myRange');
const clickbait = chrome.runtime.getURL('clickbait.png');
const logo = document.getElementById('logo');
logo.src = clickbait;

chrome.storage.sync.get(["myRangeValueLow", "myRangeValueHigh", "registerChange"], function (result) {
    let isEnabled = result && result.registerChange !== undefined ? result.registerChange ? 1 : 0 : 0;
    noUiSlider.create(myRange, {
        connect: true,
        range: {
            min: 0,
            max: 100
        },
        behaviour: 'tap-drag',
        direction: 'rtl',
        orientation: 'vertical',
        start: [result.myRangeValueLow || 0, result.myRangeValueHigh || 100],
        pips: { mode: 'count', values: 5, density: 2 }
    });

    myRange.noUiSlider.on('change', function (values) {
        const valueLow = parseInt(values[0]);
        const valueHigh = parseInt(values[1]);
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.storage.sync.set({ myRangeValueLow: valueLow, myRangeValueHigh: valueHigh }, function () {
                chrome.tabs.sendMessage(tabs[0].id,
                    {
                        type: "rangeChange", valueLow: valueLow, valueHigh: valueHigh
                    }
                    , null);
            });
        })
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

    const dateValues = [
        document.getElementById('event-start'),
        document.getElementById('event-end')
    ];

    myRange.noUiSlider.on('update', function (values, handle) {
        dateValues[handle].innerHTML = values[handle];
    });

    const icon = chrome.runtime.getURL('Icon-128.png');
    const els = document.getElementsByClassName('noUi-handle');

    for (let index = 0; index < els.length; index++) {
        els[index].style.backgroundImage = "url(" + icon + ")";
    }

    var toggleSlider = document.getElementById('slider-toggle');

    noUiSlider.create(toggleSlider, {
        start: isEnabled,
        range: {
            'min': [0, 1],
            'max': 1
        }
    });

    toggleSlider.noUiSlider.on('update', function (values, handle) {
        if (parseInt(values[handle]) === 1) {
            toggleSlider.classList.remove('off');
        } else {
            toggleSlider.classList.add('off');
        }
    });

    toggleSlider.noUiSlider.on('change', function (values, handle) {
        chrome.runtime.sendMessage({ type: "registerChange", value: parseInt(values[handle]) }, null);
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.type) {
            case 'switch_toggler':
                const value = request.value;
                toggleSlider.noUiSlider.set(value);
                sendResponse(request);
                break;
            default:
        }
    });
});