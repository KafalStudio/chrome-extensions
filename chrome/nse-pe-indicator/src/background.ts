
import {Config} from "./Config";

let config = new Config();


var xhttp = new XMLHttpRequest();
xhttp.open("GET", atob(config.url));

xhttp.onreadystatechange = function () {
  if (xhttp.readyState == 4) {
    var peDetails : any[] = JSON.parse(xhttp.responseText);
    var peRatio:number = peDetails.filter(pe => pe.RowKey == 'nseLoader')[0].PE;
    chrome.browserAction.setBadgeText({ text: peRatio.toString() });
    chrome.browserAction.setBadgeBackgroundColor({ color: config.getColor(peRatio)});
  }
}
xhttp.send();
