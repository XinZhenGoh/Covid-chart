import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ChartComponent} from './components/chart/chart.component';


const routes: Routes = [
  {path: '', component: ChartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
