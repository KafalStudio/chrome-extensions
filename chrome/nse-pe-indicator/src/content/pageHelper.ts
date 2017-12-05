export class pageHelper {
  pageUrl: URL;

  constructor(){
    this.pageUrl = new URL(document.URL);
  }

  isPortfolioPage() : boolean{
    return this.pageUrl.pathname.indexOf("bestportfolio/wealth-management-tool/investments") > 0;
  }

}
