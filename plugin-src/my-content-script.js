import depSample from "./dependency-sample";

console.log(depSample());

document.onmousemove = function(e) {
  console.log("Test Change...");
};

window.onload = () => {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      console.log(xhttp.responseText);
    }
  };
  xhttp.open("GET", "http://localhost:3001/pageSegmentation", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(window.location.origin);
};

document.onclick = function(e) {
  const x = e.pageX;
  const y = e.pageY;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      console.log(xhttp.responseText);
    }
  };
  xhttp.open("POST", "http://localhost:3001/position", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  const tempBuild = { x, y };
  xhttp.send(JSON.stringify(tempBuild));
};
