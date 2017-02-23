class peDetails {
  constructor(value: string) {
    this.Value = value;
  }
  Value: string;
}

class Config {
  public url : string = "aHR0cHM6Ly9jcmF5dGhlb24uY29tL2NoYXJ0cy9uaWZ0eV9wZV9yYXRpb19wYl92YWx1ZV9kaXZpZGVuZF95aWVsZF9jaGFydC5waHA";
  public querySelector: string = "div #contact > div > div > div > b";
  public getColor(pe: string): string
  {
    let peratio = parseInt(pe);
    if(peratio == 0)
    {
      return "transparent";
    }
    else if(peratio < 16)
    {
      return "DarkGreen";
    }
    else if(peratio < 20)
    {
      return "LightGreen";
    }
    else if(peratio < 22)
    {
      return "SlateGrey";
    }
    else if(peratio < 24)
    {
      return "MediumOrchid";
    }
    else if(peratio < 28)
    {
      return "Red";
    }
    else return "DarkRed";
  }
}

let config = new Config();


var xhttp = new XMLHttpRequest();
xhttp.open("GET", atob(config.url));

xhttp.onreadystatechange = function () {
  if (xhttp.readyState == 4) {
    // innerText does not let the attacker inject HTML elements.
    let div = document.createElement("div");
    div.innerHTML = xhttp.responseText;
    let peRatio = div.querySelector(config.querySelector);
    chrome.browserAction.setBadgeText({ text: peRatio.textContent });
    chrome.browserAction.setBadgeBackgroundColor({ color: config.getColor(peRatio.textContent)});
  }
}
xhttp.send();
