import { pageHelper } from "./pageHelper";

console.log("Capturing moneycontrol");
console.log(document.baseURI);
console.log(document.URL);


class moneycontrol {
  processDiv(arg0: HTMLDivElement) {
    let stockId = arg0.id.substr(6);
    if (stockId) {
      console.log(stockId);
    }
    var tdElement = <HTMLTableDataCellElement>arg0.parentElement;
    var rowElement = <HTMLTableRowElement>tdElement.parentElement;
    var childToAdd = document.createElement("div");
    childToAdd.innerText = "PE Ratio";
    // tdElement.insertAdjacentElement("afterend", childToAdd);
    var datacell = rowElement.insertCell(1);
    datacell.appendChild(childToAdd);
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


