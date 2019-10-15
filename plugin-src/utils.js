export const getGuid = () => {
  var nav = window.navigator;
  var guid = nav.mimeTypes.length;
  guid += nav.userAgent.replace(/\D+/g, "");
  guid += nav.plugins.length;
  return guid;
}

const GUID = getGuid();

export const getToken = () => {
  const token = localStorage.getItem(GUID);
  return token || GUID;
};

export const setToken = (a) => {
  const b = a.getResponseHeader('Authorization');
  if (b && b.indexOf('Bearer') === 0) {
    const token = b.replace('Bearer ', '');
    localStorage.setItem(GUID, token)
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

export const extractHostname = url => {
  var hostname;
  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  hostname = hostname.split(":")[0];
  hostname = hostname.split("?")[0];
  return hostname;
};

const getCoverElement = (high) => {
  const cover = document.createElement("DIV");
  let blockedUrl
    = chrome.runtime.getURL(high ? 'blocked_green.png' : 'blocked_red.png');
  cover.style.backgroundImage = `url(${blockedUrl})`;
  cover.style.backgroundRepeat = 'no-repeat';
  cover.style.backgroundPosition = 'center center';
  cover.style.backgroundSize = 'contain';
  cover.style.width = '100%';
  cover.style.height = '100%';
  cover.style.position = 'absolute';
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

const clearAllCover = (eHide, eShow) => {
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

const applyFilter = (el, value) => {
  value = value ? value : 1;
  const multPx = value * (3 - 1) + 1;
  const multGs = value * (90 - 70) + 70;
  el.style.filter = `blur(${multPx}px) grayscale(${multGs}%)`;
  el.classList.add('someCrasyClass');
}

const removeFilter = (el) => {
  el.style.filter = null;
  el.classList.remove('someCrasyClass');
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
    const meta = group[GUID];

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
      element.addEventListener('click', stopIt, false);
      applyFilter(element, roundedDecimal);
      addcover(element, true);
    }
  }
}
