export class Config {
  public url : string = "https://nifty.azurewebsites.net/chrome";
  public querySelector: string = "div #contact > div > div > div > b";
  public getColor(peratio: number): string
  {
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
