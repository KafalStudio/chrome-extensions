
declare var $: any;

import { Observable } from "rxjs";
import { Config } from "./Config";

hookPostInitialize(postInitialize);

createChartFromCache(markInitializationComplete);

function postInitialize() {
  continueProcessing(OnCacheMiss);
}

function OnCacheMiss() {
  pullDataFromRemote((data) => {
    cacheData(data);

    document.getElementById("nifty_pe_chart").innerHTML = "";

    createChart(data);
  });
}

function continueProcessing(cacheMisscallback: () => void) {
  chrome.storage.local.get(function (items) {
    if (!items || !items["historicalPe"]) {
      cacheMisscallback();
    }
    else {
      if (items['lastFullDownload']) {
        if (isDataTooOld(new Date(items['lastFullDownload']))) {
          cacheMisscallback();
        }
        var historicalPe: [number, number][] = items["historicalPe"];
        if (!IsLastTradingDayPeAvailable(historicalPe) && IsLastDownloadAtLeastADayOld(new Date(items['lastFullDownload']))) {
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
  var lastTradingDay = new Date(getToday());
  if(lastTradingDay.getDay() == 6)
  {
     lastTradingDay.setDate(lastTradingDay.getDate() - 1);
  }
  else if(lastTradingDay.getDay() == 0){
    lastTradingDay.setDate(lastTradingDay.getDate() - 2);
  }
  return historicalPe.map(a => a[0]).indexOf(lastTradingDay.getTime()) > 0;
}

function IsLastDownloadAtLeastADayOld(lastDlDate: Date): boolean {
  lastDlDate.setHours(lastDlDate.getHours() + 24);
  return new Date() > lastDlDate;
}

function isDataTooOld(lastDlDate: Date): boolean {
  lastDlDate.setDate(lastDlDate.getDate() + 14);
  return new Date(getToday()) > lastDlDate;
}

function IsWeekend(date:Date) : boolean {
  return date.getDay()%6==0;
}

function hookPostInitialize(callback: () => void): void {
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (changes["initialized"]) {
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
    if (items && items["historicalPe"]) {
      var historicalPe: [[number, number]] = items["historicalPe"];
      createChart(historicalPe);
    }
    postCacheLookup();
  });
}

function pullDataFromRemote(success: (data: [number, number][]) => void) {

  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", new Config().historicalPeUrl);

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4) {
      var data = JSON.parse(xhttp.responseText) as [[number, number]];
      success(data);
    }
  }
  xhttp.send();
}

function createChart(data) {
  var options = new Config().getHighChartOptions();
  options.series[0].data = transformData(data);
  $("#nifty_pe_chart").highcharts("StockChart", options);
}

function transformData(data: [number, number][]): [number, number][] {
  return data.filter(a => !isNaN(a[0])).sort((a, b) => a[0] - b[0]);
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

function getToday(): number {
  var today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  today.setTime(today.getTime() - today.getTimezoneOffset() * 60000);
  return today.getTime();
}

