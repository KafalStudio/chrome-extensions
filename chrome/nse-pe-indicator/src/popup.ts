
declare var $: any;

import { Observable } from "rxjs";
import { Config } from "./Config";

sendRequest();


function sendRequest() {

  var api = "https://nifty.azurewebsites.net/api/hpe";

  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", api);

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4) {
      document.getElementById("nifty_pe_chart").innerHTML = "";
      var data = JSON.parse(xhttp.responseText) as [[number, number]];
      createChart(data);
    }
  }
  xhttp.send();

  // https://equityfriend.com/administrator/components/com_stockdatlod/tables/incoming/pe/dataPE.txt

}


function createChart(data) {

  var options = new Config().getHighChartOptions();

  options.series[0].data = data;
  $("#nifty_pe_chart").highcharts("StockChart", options);
}

