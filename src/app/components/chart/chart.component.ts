import {Component, OnInit} from '@angular/core';
import {DataServiceService} from 'src/app/services/data-service.service';
import {GlobalDataSummary} from 'src/app/models/globalDataModel';
import {CountryDataModel} from 'src/app/models/countryDataModel';
import {GoogleChartInterface} from 'ng2-google-charts/google-charts-interfaces';
import {merge} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  globalData: GlobalDataSummary[];
  countries: string[] = ['US', 'Brazil', 'Canada', 'China', 'India', 'Iran', 'Italy', 'Japan', 'Malaysia', 'Mexico', 'Philippines', 'Russia', 'Singapore', 'Thailand', 'United Kingdom', 'Vietnam'];
  totalConfirmed = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData: CountryDataModel[];
  selectedCountry: string;
  casesData;
  deathsData;
  loading = true;
  chartInterface: GoogleChartInterface;
  deathsSelected = false;
  chartType: boolean;
  deathRateChange: string;
  mortalityRate: string;
  lastUpdated: string;
  tryDayBefore = false;

  constructor(private service: DataServiceService) {
  }

  ngOnInit(): void {

    merge(
      this.service.getCasesData().pipe(
        map(result => {
          this.casesData = result;
        })
      ),
      this.service.getDeathsData().pipe(
        map(result => {
          this.deathsData = result;
        })
      ),
      this.service.getGlobalData(this.getDate(this.tryDayBefore)).pipe(
        map(result => {
            this.globalData = result;
          },
        ))
    ).subscribe(
      res => {
        if (!this.globalData) {
          this.tryDayBefore = true;
          this.ngOnInit();
        }
        this.loading = false;
        this.updateValues('US');
      },
      err => {
        // This is a hack, logic still has to be fixed
        if (!this.globalData) {
          this.tryDayBefore = true;
          this.ngOnInit();
        }
        this.loading = false;
        this.updateValues('US');
      }
    );
  }

  getDate(usePriorDate: boolean): string {
    const today = new Date();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day;

    if (usePriorDate) {
      const newDate = new Date(today);
      newDate.setDate(newDate.getDate() - 1);
      day = ('0' + (newDate.getDate())).slice(-2);
    } else {
      day = ('0' + (today.getDate())).slice(-2);
    }

    const date = month + '-' + day + '-' + today.getFullYear();
    this.lastUpdated = date;
    return date;
  }

  triggerSelected() {
    this.deathsSelected = !this.deathsSelected;
    this.updateValues(this.selectedCountry);
  }

  updateChartType(): string {
    return this.chartType ? 'LineChart' : 'ColumnChart';
  }

  triggerChartType() {
    this.chartType = !this.chartType;
    this.updateValues(this.selectedCountry);
  }

  updateChartForCases() {
    const dataTable = [];
    dataTable.push(['Date', 'Cases']);
    this.selectedCountryData.forEach(cs => {
      dataTable.push([cs.date, cs.cases]);
    });

    this.chartInterface = {
      chartType: this.updateChartType(),
      dataTable,
      options: {
        colors: ['#a80000'],
        legend: 'none',
        height: 400,
        animation: {
          duration: 1000,
          easing: 'out',
        },
        chartArea: {
          width: '70%',
          height: '70%',
          // backgroundColor: 'black',
          opacity: '50%'
        },
        hAxis: {
          gridlines: {
            color: 'transparent'
          },
          textStyle: {
            color: 'black'
          }
        },
        vAxis: {
          textStyle: {
            color: 'black'
          }
        }
      },
    };
  }

  updateChartForDeaths() {
    const dataTable = [];
    dataTable.push(['Date', 'Deaths']);
    this.selectedCountryData.forEach(cs => {
      dataTable.push([cs.date, cs.cases]);
    });

    this.chartInterface = {
      chartType: this.updateChartType(),
      dataTable,
      options: {
        colors: ['#d60000']
        ,
        legend: 'none',
        height: 400,
        animation: {
          duration: 1000,
          easing: 'out',
        },
        chartArea: {
          width: '70%',
          height: '70%'
          // backgroundColor: 'grey'
        },
        hAxis: {
          gridlines: {
            color: 'transparent'
          }
        }
      },
    };
  }

  updateValues(country: string) {
    this.totalConfirmed = 0;
    this.totalDeaths = 0;
    this.totalRecovered = 0;

    this.selectedCountry = country;

    if (this.globalData) {
      this.globalData.forEach(cs => {
        if (cs.country === country) {
          this.totalDeaths += cs.deaths;
          this.totalRecovered += cs.recovered;
          this.totalConfirmed += cs.confirmed;
        }
      });
    }

    this.mortalityRate = ((this.totalDeaths / this.totalConfirmed) * 100).toFixed(0).toString();

    if (this.deathsSelected) {
      this.selectedCountryData = this.deathsData[country];
      this.updateChartForDeaths();
    } else {
      if (this.casesData) {
        this.selectedCountryData = this.casesData[country];
        this.updateChartForCases();
      }
    }
  }

}
