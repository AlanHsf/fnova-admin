import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


import { DashboradComponent } from  './dashborad/dashborad.component'

export const routes: Routes = [
  {
    path: 'dashboard', component: DashboradComponent,
    runGuardsAndResolvers: 'always'
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

  ]
})
export class MetaYoungModule { }
