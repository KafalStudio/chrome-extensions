import { pageHelper } from "./pageHelper";

console.log("Capturing moneycontrol");
console.log(document.baseURI);
console.log(document.URL);


class moneycontrol {

  processDiv(arg0: HTMLDivElement) {
    let stockId = arg0.id.substr(6);
    if (stockId) {
      console.log(stockId);
    } else {
      return;
    }
    var tdElement = <HTMLTableDataCellElement>arg0.parentElement;
    var rowElement = <HTMLTableRowElement>tdElement.parentElement;
    var childToAdd = document.createElement("div");
    childToAdd.innerText = "PE Ratio";
    // tdElement.insertAdjacentElement("afterend", childToAdd);
    var datacell = rowElement.insertCell(1);
    datacell.appendChild(childToAdd);
    // also change column span
    var detCell = <HTMLTableDataCellElement>document.getElementById("det_1_" + stockId);
    detCell.colSpan = detCell.colSpan + 1;

    this.pullStockDetailAndUpdate(childToAdd, stockId);
  }

  pullStockDetailAndUpdate(element: HTMLDivElement, stockId: string) {

    var uri = `http://appfeeds.moneycontrol.com/jsonapi/stocks/overview&format=json&sc_id=${stockId}&ex=N&type=consolidated`;

    fetch(uri).then(res => res.json()).then(res => res["NSE"]["p_e"]).then(pe => {
      if (pe) {
        return pe;
      }
      else {
        return fetch(`http://appfeeds.moneycontrol.com/jsonapi/stocks/overview&format=json&sc_id=${stockId}&ex=B&type=consolidated`)
          .then(res => res.json()).then(res => res["BSE"]["p_e"])
      }

    }).then(pe => {
      element.innerText = pe || "";
    }).catch(err => {
      console.log(err);
    });


    // take care of undefined and when stock is only BSE listed ex=B
  }

  start() {

    let helper: pageHelper = new pageHelper();

    if (!helper.isPortfolioPage()) return;

    var tbl = <HTMLTableElement>(document.getElementsByClassName("portTble")[0]);
    if (tbl) {

      var header = (<HTMLTableRowElement>tbl.rows[0]).insertCell(1);
      var peRatio = document.createElement("strong");
      peRatio.innerText = "PE Ratio";
      header.appendChild(peRatio);


      [].forEach.call(document.getElementsByClassName("stkName"), (el) => {
        this.processDiv(el);
      });
    }
  }

}

new moneycontrol().start();


