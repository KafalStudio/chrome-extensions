import { userOptions, getDefaults } from "./userOptions";
export class Options {

  hookEvents() {
    this.restoreOptions();
    document.getElementById("btnSave").addEventListener("click", () => {
      this.saveOptions();
    }
    );

    document.getElementById("btnClearAll").addEventListener("click", () => {
      this.clearAll();
    }
    );
  }

  restoreOptions() {
    var opts = getDefaults();
    chrome.storage.sync.get(opts, (items: userOptions) => {
      (<HTMLButtonElement>document.getElementById("btnSave")).disabled = false;
      this.setSettingOnPage('shouldOverrideDownloadLocation', items.option_shouldOverrideDownloadLocation);
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

  saveOptions() {
    var shouldOverrideDownloadLocation = this.getSettingValueFromPage("shouldOverrideDownloadLocation");

    var opts: userOptions = {
      option_shouldOverrideDownloadLocation: shouldOverrideDownloadLocation
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
}

new Options().hookEvents();
