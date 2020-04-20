import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit {

  @Input('totalConfirmed')
  totalConfirmed;
  @Input('totalDeaths')
  totalDeaths;
  @Input('totalRecovered')
  totalRecovered;
  @Input('mortalityRate')
  mortalityRate = null;
  @Input('deathRateChange')
  deathRateChange = null;
  @Input('lastUpdated')
  lastUpdated = null;

  constructor() { }

  ngOnInit(): void {
  }

}
