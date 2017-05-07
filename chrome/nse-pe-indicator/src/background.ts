
import { Config } from "./Config";
import { PeDetails } from "./peDetails";

let config = new Config();

checkIfUpgrading(execute);

function execute() {
  hookHandler();

  setDefault(() => {
    sendRequest();
  });
}

function checkIfUpgrading(callback: () => void) {
  chrome.storage.local.get(function (items) {
    if (items && (!items[config.versionSetting] || (items[config.versionSetting] != config.currentVersion))) {
      //outdated Version
      Upgrade(callback);
    } else {
      //looks alright
      callback();
    }
  });
}

function Upgrade(callback: () => void) {
  chrome.storage.local.clear(() => {
    chrome.storage.local.set({ "lastVersion": config.currentVersion }, () => {
      callback();
    });
  });
}

function hookHandler() {
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (changes[config.todaysPeSetting]) {
      let peratio: PeDetails = changes[config.todaysPeSetting].newValue;
      setBadge(peratio.PE);
    }
  });
}

function setDefault(callback: () => void) {
  chrome.storage.local.get(function (items) {
    if (items && items[config.todaysPeSetting]) {
      //Set default value      
      var peratio: PeDetails = items[config.todaysPeSetting];
      setBadge(peratio.PE);
      if (!IsDataCurrent(peratio)) {
        callback();
      }
    }
    else {
      callback();
    }
  });
}

function IsDataCurrent(peRatio: PeDetails): boolean {
  var lastTradingDay = new Date(config.getToday());
  if (lastTradingDay.getDay() == 6) {
    lastTradingDay.setDate(lastTradingDay.getDate() - 1);
  }
  else if (lastTradingDay.getDay() == 0) {
    lastTradingDay.setDate(lastTradingDay.getDate() - 2);
  }
  return new Date(peRatio.Date).getTime() == lastTradingDay.getTime();
}


function sendRequest() {

  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", config.backupUrl);

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4) {
      var peDetails: PeDetails[] = JSON.parse(xhttp.responseText);
      var nseLoader = peDetails.filter(pe => pe.RowKey == 'nseLoader')[0];
      var peRatio = nseLoader.PE;
      chrome.storage.local.set(
        {
          "pe": nseLoader
        }, function () {
          if (chrome.runtime.lastError) {
            console.log("Error while saving pe data" + chrome.runtime.lastError);
          }
        });

      updateHistoricalPe(nseLoader);
      // setBadge(peRatio);
    }
  }
  xhttp.send();
}

function updateHistoricalPe(nseLoader: PeDetails) {
  chrome.storage.local.get(items => {
    if (items && items[config.historicalPeSetting]) {
      var historicalPe: [number, number][] = items[config.historicalPeSetting];
      var epoch = config.getEpoch(nseLoader.Date);
      if (historicalPe.map(a => a[0]).indexOf(epoch) == -1) {
        historicalPe.push([epoch, nseLoader.PE]);
        insertPeIntoHistoricalPe(historicalPe.sort((a, b) => a[0] - b[0]));
      }
    }
  });
}

function insertPeIntoHistoricalPe(historicalPe: [number, number][]) {

  chrome.storage.local.set({ "historicalPe": historicalPe }, function () {
    if (chrome.runtime.lastError) {
      console.log("Error while updating historical PE" + chrome.runtime.lastError);
    }
  });

}

function setBadge(peratio: number) {
  if (peratio == 0) {
    return;
  }
  chrome.browserAction.setBadgeText({ text: peratio.toString() });
  chrome.browserAction.setBadgeBackgroundColor({ color: config.getColor(peratio) });
}

