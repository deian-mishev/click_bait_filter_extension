/**
 * Neither this file or any dependency (like style.css) should trigger
 * the plugin reload. This way the popup will not close clearing it state
 */
import "./style.css";

const clickbait = chrome.runtime.getURL('clickbait.png');
const logo = document.getElementById('logo');
logo.src = clickbait;

chrome.storage.sync.get(["myRangeValueLow", "myRangeValueHigh", "registerChange", "showTopology"], function (result) {
    const isEnabledReg = result && result.registerChange !== undefined ? result.registerChange : false;
    const isEnabledTop = result && result.showTopology !== undefined ? result.showTopology : false;

    const myRange = document.getElementById('clickbait_range');

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
    toggleSlider.checked = isEnabledReg ? true : false;
    toggleSlider.addEventListener('change', (event) => {
        chrome.runtime.sendMessage({ type: "registerChange", value: event.target.checked }, null);
    });

    var sliderBack = document.getElementById('slider-back');
    function changeTopology(val) {
        toggleSlider.disabled = val;
        if (val) {
            sliderBack.classList.add('slider-disabled');
            myRange.setAttribute('disabled', true);
        } else {
            sliderBack.classList.remove('slider-disabled');
            myRange.removeAttribute('disabled');
        }
    }

    var topologySlider = document.getElementById('topology-toggle');
    topologySlider.checked = isEnabledTop ? true : false;
    topologySlider.addEventListener('change', (event) => {
        chrome.runtime.sendMessage({ type: "showTopology", value: event.target.checked }, null);
        changeTopology(event.target.checked)
    });

    changeTopology(isEnabledTop);

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.type) {
            case 'switch_toggler':
                toggleSlider.checked = request.value;
                break;
            case 'switch_topology':
                topologySlider.checked = request.value;
                changeTopology(request.value)
                break;
            default:
        }
        sendResponse(request);
    });
});