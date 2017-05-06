
import { Config } from "./Config";

let config = new Config();

execute();

function execute() {
  hookHandler();
  setDefault();
  sendRequest();
}

function hookHandler() {
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (changes["pe"]) {
      let peratio: number = changes["pe"].newValue;
      setBadge(peratio);
    }
  });
}

function setDefault() {
  chrome.storage.local.get(function (items) {
    if (items && items["pe"]) {
      var peratio: number = items["pe"];
      setBadge(peratio);
    }
  });
}

function sendRequest() {

  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", config.backupUrl);

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4) {
      var peDetails: any[] = JSON.parse(xhttp.responseText);
      var peRatio: number = peDetails.filter(pe => pe.RowKey == 'nseLoader')[0].PE;
      chrome.storage.local.set({ "pe": peRatio }, function () {
        if (chrome.runtime.lastError) {
          console.log("Error while saving pe data" + chrome.runtime.lastError);
        }
      })
      // setBadge(peRatio);
    }
  }
  xhttp.send();
}

function setBadge(peratio: number) {
  if (peratio == 0) {
    return;
  }
  chrome.browserAction.setBadgeText({ text: peratio.toString() });
  chrome.browserAction.setBadgeBackgroundColor({ color: config.getColor(peratio) });
}
