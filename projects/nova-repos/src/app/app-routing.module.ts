import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinderComponent } from './finder/finder.component'

const routes: Routes = [
  {
    path: 'finder',
    component: FinderComponent
  },
  { path: '',   component: FinderComponent, pathMatch: 'full' },
  { path: '**', component: FinderComponent }
];

@NgModule({
  declarations:[FinderComponent],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
