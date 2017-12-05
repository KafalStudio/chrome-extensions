import { userOptions, getDefaults } from "./userOptions";
import { IdConstants } from "./settingsConstants";
export class Options {

  hookEvents() {
    this.restoreOptions();
    document.getElementById(IdConstants.btnSave).addEventListener("click", () => {
      this.saveOptions();
    }
    );

    document.getElementById(IdConstants.btnClearAll).addEventListener("click", () => {
      this.clearAll();
    }
    );
  }

  restoreOptions() {
    var opts = getDefaults();
    chrome.storage.sync.get(opts, (items: userOptions) => {
      (<HTMLButtonElement>document.getElementById(IdConstants.btnSave)).disabled = false;
      this.setSettingOnPage(IdConstants.shouldOverrideDownloadLocation, items.option_shouldOverrideDownloadLocation);
      this.setSettingOnPage(IdConstants.enableMoneycontrol, items.option_enableMoneycontrol);
      
    });
  }


  saveOptions() {
    var shouldOverrideDownloadLocation = this.getSettingValueFromPage(IdConstants.shouldOverrideDownloadLocation);
    var enableMoneycontrol = this.getSettingValueFromPage(IdConstants.enableMoneycontrol);
    

    var opts: userOptions = {
      option_shouldOverrideDownloadLocation: shouldOverrideDownloadLocation,
      option_enableMoneycontrol : enableMoneycontrol
    }

    chrome.storage.sync.set(opts, this.done);
  }

  done() {
    var status = document.getElementById("status");
    status.textContent = "Done";
    setTimeout(function () {
      status.textContent = "";
    }, 750);
  }

  clearAll() {
    chrome.storage.sync.clear(() => {
      this.done();
      this.restoreOptions();
    });
  }

  setSettingOnPage(id: string, value: boolean) {
    if (value) {
      (<HTMLInputElement>document.getElementById(id)).checked = value;
    }
    else {
      (<HTMLInputElement>document.getElementById(id)).checked = (<HTMLInputElement>document.getElementById(id)).defaultChecked;
    }
  }

  getSettingValueFromPage(id: string): boolean {
    return (<HTMLInputElement>document.getElementById(id)).checked;
  }
}

new Options().hookEvents();
