import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { Dashboard2019Component } from './dashboard-2019/dashboard-2019.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PipesModule } from '../../pipes/pipes.module'

import {ScrollingModule} from '@angular/cdk/scrolling';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
  { path: 'dashboard-2019', component: Dashboard2019Component, pathMatch: 'full' },
]

@NgModule({
  declarations: [
    DashboardComponent,
    Dashboard2019Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NzNoAnimationModule,
    NzDrawerModule,
    NzCardModule,
    NzGridModule,NzTagModule,NzToolTipModule,
    NzResultModule,NzButtonModule,NzModalModule,
    NzSpinModule,NzInputModule,NzListModule,
    PipesModule,
    ScrollingModule
  ]
})
export class HR360Module { }
