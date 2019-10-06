export const getToken = () => {
  const guid = getGuid()
  const token = localStorage.getItem(guid);
  return token || guid;
};

export const setToken = (a) => {
  const b = a.getResponseHeader('Authorization');
  if (b && b.indexOf('Bearer') === 0) {
    const token = b.replace('Bearer ', '');
    localStorage.setItem(getGuid(), token)
  }
};

export const getGuid = () => {
  var nav = window.navigator;
  var guid = nav.mimeTypes.length;
  guid += nav.userAgent.replace(/\D+/g, "");
  guid += nav.plugins.length;
  return guid;
}

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
