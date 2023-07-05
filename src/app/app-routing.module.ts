import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Test1Component } from './test1/test1.component';
import { HomeComponent } from './home/home.component';
import { ListUserComponent } from './user/list/list-user.component';
import { SimpleComponent } from './simple/simple.component';
import { Exercise1Component } from './exercise1/exercise1.component';
import { Exercise2Component } from './exercise2/exercise2.component';

const routes: Routes = [
  { path: 'test1', component: Test1Component },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'list-user', component: ListUserComponent },
  { path: 'simple', component: SimpleComponent },
  { path: 'exercise1', component: Exercise1Component },
  { path: 'exercise2', component: Exercise2Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
