
declare var $: any;

import { Observable } from "rxjs";
import { Config } from "./Config";

let config = new Config()


waitAndExecute(function () {
  hookPostInitialize(postInitialize);
  createChartFromCache(markInitializationComplete);
}, () => {
  document.getElementById(config.chartElement).innerHTML = "Oops, try after a minute or so";
});

function postInitialize() {
  continueProcessing(OnCacheMiss);
}

function OnCacheMiss() {
  pullDataFromRemote((data) => {
    cacheData(data);
    createChart(data);
  });
}

function waitAndExecute(success: () => void, prematureExecutionEventHandler?: () => void) {
  chrome.storage.local.get(function (items) {
    if (!items || !items[config.versionSetting] || items[config.versionSetting] == config.currentVersion) {
      //First time user
      success();
    } else {
      //Wait for background to complete upgrade
      if (prematureExecutionEventHandler) {
        prematureExecutionEventHandler();
      }
    }
  });
}

function continueProcessing(cacheMisscallback: () => void) {
  chrome.storage.local.get(function (items) {
    if (!items || !items[config.historicalPeSetting]) {
      cacheMisscallback();
    }
    else {
      if (items[config.lastFullDownloadTimeSetting]) {
        if (config.isDataTooOld(new Date(items[config.lastFullDownloadTimeSetting]))) {
          cacheMisscallback();
        }
        var historicalPe: [number, number][] = items[config.historicalPeSetting];
        if (!IsLastTradingDayPeAvailable(historicalPe)
          && config.IsLastDownloadAtLeastADayOld(new Date(items[config.lastFullDownloadTimeSetting]))) {
          cacheMisscallback();
        }
      }
      else {
        cacheMisscallback();
      }
    }
  });
}

function IsLastTradingDayPeAvailable(historicalPe: [number, number][]): boolean {
  var lastTradingDay = new Date(config.getToday());
  if (lastTradingDay.getDay() == 6) {
    lastTradingDay.setDate(lastTradingDay.getDate() - 1);
  }
  else if (lastTradingDay.getDay() == 0) {
    lastTradingDay.setDate(lastTradingDay.getDate() - 2);
  }
  return historicalPe.map(a => a[0]).indexOf(lastTradingDay.getTime()) > 0;
}


function hookPostInitialize(callback: () => void): void {
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (changes[config.initializationTodaySetting]) {
      callback();
    }
  });
}
function markInitializationComplete() {
  chrome.storage.local.set({ "initialized": new Date().getTime() }, function () {
    if (chrome.runtime.lastError) {
      console.log("Error while saving pe data" + chrome.runtime.lastError);
    }
  });
}

function createChartFromCache(postCacheLookup: () => void): void {
  chrome.storage.local.get(function (items) {
    if (items && items[config.historicalPeSetting]) {
      var historicalPe: [[number, number]] = items[config.historicalPeSetting];
      createChart(historicalPe);
    }
    postCacheLookup();
  });
}

function pullDataFromRemote(success: (data: [number, number][]) => void) {

  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", config.historicalPeUrl);

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4) {
      var data = JSON.parse(xhttp.responseText) as [[number, number]];
      success(data);
    }
  }
  xhttp.send();
}

function createChart(data) {
  var options = config.getHighChartOptions();
  options.series[0].data = transformData(data);
  $("#" + config.chartElement).highcharts("StockChart", options);
}

function transformData(data: [number, number][]): [number, number][] {
  return data.filter(a => !isNaN(a[0]) && !isNaN(a[1])).sort((a, b) => a[0] - b[0]);
}

function cacheData(data) {
  data = transformData(data);
  chrome.storage.local.set({ "historicalPe": data }, function () {
    if (chrome.runtime.lastError) {
      console.log("Error while saving historical data" + chrome.runtime.lastError);
    }
  });

  chrome.storage.local.set({ "lastFullDownload": new Date().getTime() }, function () {
    if (chrome.runtime.lastError) {
      console.log("Error while saving lastFullDownload " + chrome.runtime.lastError);
    }
  });
}

