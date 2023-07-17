import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Test1Component } from './test1/test1.component';
import { HomeComponent } from './home/home.component';
import { ListUserComponent } from './user/list/list-user.component';
import { SimpleComponent } from './simple/simple.component';
import { Exercise1Component } from './exercise1/exercise1.component';
import { Exercise2Component } from './exercise2/exercise2.component';
import { ReportVehicleSpeedViolationComponent } from './report-vehicle-speed-violation/report-vehicle-speed-violation.component';

const routes: Routes = [
  { path: 'test1', component: Test1Component },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'list-user', component: ListUserComponent },
  { path: 'report-vehicle-speed-violation', component: ReportVehicleSpeedViolationComponent },
  { path: 'simple', component: SimpleComponent },
  { path: 'exercise1', component: Exercise1Component },
  { path: 'exercise2', component: Exercise2Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
