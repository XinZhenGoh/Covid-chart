import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {GlobalDataSummary} from '../models/globalDataModel';
import {CountryDataModel} from '../models/countryDataModel';
import {main} from '@angular/compiler-cli/src/main';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private globalDataUrlFirst = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/`;
  // private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports` + '/04-04-2020.csv';
  private globalCasesDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  private globalDeathDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv`;
  private fixedBufferValue = 40;

  constructor(private http: HttpClient) {
  }

  getCasesData() {
    return this.http.get(this.globalCasesDataUrl, {responseType: 'text'})
      .pipe(map(result => {
          return this.parseData(result);
        },
      ));
  }

  getDeathsData() {
    return this.http.get(this.globalDeathDataUrl, {responseType: 'text'})
      .pipe(map(result => {
        return this.parseData(result);
      }));
  }

  getGlobalData(date: string) {
    const getUrl = this.http.get(this.globalDataUrlFirst + date + '.csv', {responseType: 'text'});

    return getUrl.pipe(
      map(result => {
        return this.simplifyData(result);
      })
    );
  }

  simplifyData(result: any): GlobalDataSummary[] {
    const data: GlobalDataSummary[] = [];
    const rows = result.split('\n');
    // delete label row
    rows.splice(0, 1);
    rows.forEach(row => {
      const cols = row.split(',');
      data.push({
        country: cols[3],
        confirmed: +cols[7],
        deaths: +cols[8],
        recovered: +cols[9]
      });

    });
    return data;
  }

  parseData(param: any): any {
    const rows = param.split('\n');
    const mainData = {};
    const header = rows[0];
    const dates = header.split(',');
    dates.splice(0, this.fixedBufferValue);
    // delete header row
    rows.splice(0, 1);
    rows.forEach(row => {
      const cols = row.split(',');
      // country
      const con = cols[1];
      // if(mainData[con]){
      //   console.log("EXISTS" + con);
      //   mainData[con].
      // }
      if (cols[0] === '') {
        cols.splice(0, this.fixedBufferValue);
        mainData[con] = [];
        cols.forEach((value, index) => {
          const temp: CountryDataModel = {
            cases: +value,
            country: con,
            date: new Date(Date.parse(dates[index]))
          };

          mainData[con].push(temp);
        });
      }
    });
    return mainData;
  }
}
