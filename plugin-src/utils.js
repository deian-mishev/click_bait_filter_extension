const convertLetterToNumber = (str) => str.toLowerCase().charCodeAt(0) - 96;

export const getGuid = () => {
  var nav = window.navigator;
  var guid = nav.mimeTypes.length;
  guid += nav.userAgent.replace(/\D+/g, "");
  guid += nav.plugins.length;
  guid += convertLetterToNumber(chrome.i18n.getMessage("@@extension_id"))
  return guid;
}

const GUID = getGuid();

export const getToken = (callback) => {
  chrome.storage.sync.get([GUID], function (result) {
    const res = result && result[GUID] ? result[GUID] : GUID;
    callback(res);
  })
};

export const setToken = (a, callback) => {
  const b = a.getResponseHeader('Authorization');
  if (b && b.indexOf('Bearer') === 0) {
    const token = b.replace('Bearer ', '');
    chrome.storage.sync.set({ [GUID]: token }, callback);
  } else {
    callback();
  }
};

export const getCookies = function () {
  var pairs = document.cookie.split(";");
  var cookies = {};
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");
    cookies[(pair[0] + "").trim()] = unescape(pair[1]);
  }
  return cookies;
};

const getCoverElement = (high) => {
  const cover = document.createElement("DIV");
  let blockedUrl
    = chrome.runtime.getURL('Icon-128.png');
  cover.style.backgroundImage = `url(${blockedUrl})`;
  cover.style.backgroundRepeat = 'no-repeat';
  cover.style.backgroundPosition = 'center center';
  cover.style.backgroundSize = 'contain';
  cover.style.width = '100%';
  cover.style.height = '100%';
  cover.style.position = 'absolute';
  cover.style.opacity = 0.5;
  cover.style.top = '0px';
  cover.style.left = '0px';
  cover.className = GUID;

  return cover;
}

const addcover = (element, above) => {
  element.childNodes.length == 0 && (element.style.position = 'relative');
  const cover = getCoverElement(above);
  element.appendChild(cover);
}

export const addStyleString = (str) => {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}

const stopIt = (event) => {
  event.stopPropagation();
  event.preventDefault();
}

export const clearAllCover = (eHide, eShow) => {
  const paras = document.getElementsByClassName(GUID);
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }

  for (let index = 0; index < eShow.length; index++) {
    const element = eShow[index];
    removeFilter(element);
    element.removeEventListener('click', stopIt, false);
  }

  for (let index = 0; index < eHide.length; index++) {
    const element = eHide[index];
    removeFilter(element);
    element.removeEventListener('click', stopIt, false);
  }
}

const addTopologyStyle = (el, value) => {
  const rest = 1 - value;
  const red = Math.floor(rest * (255 + 1));
  const green = Math.floor(value * (255 + 1));
  const color = `rgb(${red}, ${green}, 0)`;
  el.style.filter = `drop-shadow(2px 2px 10px ${color})`;
}

export const showTopology = (eHide, eShow, groups, linksToFilter) => {
  clearAllCover(eHide, eShow);

  for (let index = 0; index < eHide.length; index++) {
    let element = eHide[index];
    addTopologyStyle(element, 0);
  }

  for (let j = 0; j < eShow.length; j++) {
    const element = eShow[j];
    const group = groups[linksToFilter[element.href]];
    const meta = group['clickbait_locator'];

    addTopologyStyle(element, meta.upperRange / 100);
  }
}

const applyFilter = (el, value, selector) => {
  value = value ? value : 1;

  if (!selector) {
    const multPx = value * (2 - 1) + 1;
    const multGs = value * (95 - 50) + 50;
    el.classList.add('clickbait-filter-locator');
    el.style.filter = `grayscale(${multGs}%)`;
  } else {
    const multPx = value * (1 - 10) + 10;
    el.style.filter = `drop-shadow(2px 2px ${multPx}px #13b71a)`;
  }
}

const removeFilter = (el) => {
  el.classList.remove('clickbait-filter-locator');
  el.style.filter = null;
}

export const showhideDom = (valueLow, valueHigh, eHide, eShow, groups, linksToFilter) => {
  clearAllCover(eHide, eShow);

  if (valueLow !== 0) {
    for (let index = 0; index < eHide.length; index++) {

      let element = eHide[index];

      element.addEventListener('click', stopIt, false);
      const diff = valueLow / 100;
      diff = diff !== 0 ? diff : 0.1;
      applyFilter(element, diff);
      addcover(element);
    }
  }

  for (let j = 0; j < eShow.length; j++) {
    const element = eShow[j];
    const group = groups[linksToFilter[element.href]];
    const meta = group['clickbait_locator'];

    if (valueLow >= meta.upperRange) {

      const diff = Math.abs(meta.upperRange - valueLow) / 90;
      let roundedDecimal = parseFloat(diff.toFixed(1));
      roundedDecimal = roundedDecimal !== 0.0 ? roundedDecimal : 0.1;
      element.addEventListener('click', stopIt, false);
      applyFilter(element, roundedDecimal);
      addcover(element);
    } else if (valueHigh <= meta.lowerRange) {
      const diff = Math.abs(valueHigh - meta.lowerRange) / 90;
      let roundedDecimal = parseFloat(diff.toFixed(1));
      roundedDecimal = roundedDecimal !== 0.0 ? roundedDecimal : 0.1;
      applyFilter(element, roundedDecimal, true);
    }
  }
}
