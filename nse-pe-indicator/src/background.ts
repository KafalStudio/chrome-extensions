class peDetails {
  constructor(value:string){
    this.Value = value;
  }
  Value: string;
}

class Config{
  public bgColor:string = "blue"
}

let pe = new peDetails("24.3");
chrome.browserAction.setBadgeText({
  text : pe.Value
});
let config = new Config();
chrome.browserAction.setBadgeBackgroundColor({
  color:config.bgColor
});
