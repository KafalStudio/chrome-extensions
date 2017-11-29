import { userOptions, getDefaults } from "./userOptions";
import { Options } from "./options";
export class ConfigureDownload {
  shouldOverrideDownloadLocation: boolean;
  configure() {

    //Add hooks to the downloader
    this.addHook();

    //Listen for any property change
    chrome.storage.onChanged.addListener((changes, area) => {
      var newValue = changes["option_shouldOverrideDownloadLocation"];
      if (newValue) {
        this.shouldOverrideDownloadLocation = newValue.newValue;
      }
    });

    var def:userOptions = getDefaults();
    //set default value
    chrome.storage.sync.get(def, (opts: userOptions) => {
      if (opts.option_shouldOverrideDownloadLocation) {
        this.shouldOverrideDownloadLocation = opts.option_shouldOverrideDownloadLocation;
      }
    });
  }
  addHook() {
    console.log("adding hook to downloader");
    chrome.downloads.onDeterminingFilename.addListener((item, suggestion) => {

      var folder = this.determineFolderName(item);
      var ob = {
        filename: (folder ? folder : "") + item.filename,
        conflictAction: "prompt"
      };
      if (this.shouldOverrideDownloadLocation) {
        suggestion(ob);
      }
      else{
        console.log("Skipping suggestion");
      }
    });
  }

  determineFolderName(item: chrome.downloads.DownloadItem): string {
    var loc = this.getLocation(item.url);
    if (loc.hostname.indexOf("screener") !== -1) {
      return "screener/";
    }
    return undefined;
  }

  getLocation(href: string) {
    var l = document.createElement("a");
    l.href = href;
    return l;
  };

}
