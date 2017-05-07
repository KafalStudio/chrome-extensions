declare var Highcharts: any;

export class Config {
  public currentVersion = "0.1";
  public url: string = "https://nifty.azurewebsites.net/chrome";
  public backupUrl: string = "https://nifty.azurewebsites.net/api/pe";
  public historicalPeUrl: string = "https://nifty.azurewebsites.net/api/hpe";
  public chartElement: string = "nifty_pe_chart";

  public historicalPeSetting: string = "historicalPe";
  public todaysPeSetting: string = "pe";
  public lastFullDownloadTimeSetting: string = 'lastFullDownload';
  public initializationTodaySetting: string = "initialized";
  public versionSetting: string = "lastVersion";

  // https://equityfriend.com/administrator/components/com_stockdatlod/tables/incoming/pe/dataPE.txt

  public querySelector: string = "div #contact > div > div > div > b";

  public getColor(peratio: number): string {
    if (peratio == 0) {
      return "transparent";
    }
    else if (peratio < 16) {
      return "DarkGreen";
    }
    else if (peratio < 20) {
      return "LightGreen";
    }
    else if (peratio < 22) {
      return "SlateGrey";
    }
    else if (peratio < 24) {
      return "MediumOrchid";
    }
    else if (peratio < 28) {
      return "Red";
    }
    else return "DarkRed";
  }

  public getHighChartOptions() {
    return {
      chart: {
        renderTo: this.chartElement,
        type: "line"
      },

      plotOptions: {
        series: {
        }
      },

      navigator: {
        enabled: true
      },

      scrollbar: {
        enabled: false
      },

      credits: {
        enabled: false
      },

      rangeSelector: {
        enabled: false
      },

      title: {
        text: 'PE Ratio'
      },
      subtitle: {
        text: 'NIFTY'
      },
      xAxis: {
        type: 'datetime',
      },

      yAxis: [{ // Primary yAxis
        labels: {
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        title: {
          text: 'Nifty Pe',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },

        plotLines: [{
          color: 'green', // Color value
          dashStyle: 'shortdot', // Style of the plot line. Default to solid
          value: 20, // Value of where the line will appear
          width: 2 // Width of the line    
        },
        {
          color: 'red', // Color value
          dashStyle: 'shortdot', // Style of the plot line. Default to solid
          value: 24, // Value of where the line will appear
          width: 2 // Width of the line    
        }],
        plotBands: [{
          label: {
            text: "Green Zone",
            y: -10
          },
          from: 0, // Start of the plot band
          to: 20 // End of the plot band
        },
        {
          label: {
            text: "Neutral Zone",
            y: 0
          },
          from: 21,
          to: 24
        },
        {
          label: {
            text: "Red Zone",
            y: 0
          },
          from: 24,
          to: 28
        }]

      }],

      series: [{
        name: 'Nifty PE Ratio',
        tooltip: {
          valueDecimals: 2
        },
        zoneAxis: "y",
        zones: [
          {
            value: 16,
            color: 'darkgreen',
          },
          {
            value: 20,
            color: 'lightgreen',
          },
          {
            value: 22,
            color: 'slategrey',
          },
          {
            value: 24,
            color: 'mediumorchid',
          },
          {
            value: 26,
            color: 'Red',
          },
          {
            color: 'DarkRed',
          }],

        data: null,
      }]
    };
  }

  public getToday(): number {
    var today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    today.setTime(today.getTime() - today.getTimezoneOffset() * 60000);
    return today.getTime();
  }

  public IsLastDownloadAtLeastADayOld(lastDlDate: Date): boolean {
    lastDlDate.setHours(lastDlDate.getHours() + 24);
    return new Date() > lastDlDate;
  }

  public isDataTooOld(lastDlDate: Date): boolean {
    lastDlDate.setDate(lastDlDate.getDate() + 14);
    return new Date(this.getToday()) > lastDlDate;
  }

  public IsWeekend(date: Date): boolean {
    return date.getDay() % 6 == 0;
  }


  public getEpoch(date: string) {
    var dt = new Date(date);
    dt.setTime(dt.getTime() - dt.getTimezoneOffset() * 60000);
    return dt.getTime();
  }
}


