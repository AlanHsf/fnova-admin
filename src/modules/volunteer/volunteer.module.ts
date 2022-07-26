import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolunteerDetailComponent } from './volunteer-detail/volunteer-detail.component';

import { Routes, RouterModule } from '@angular/router';

import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';

import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { DashboardOverviewComponent } from '../dashboard-overview/dashboard-overview.component';
import { PipesModule } from '../../pipes/pipes.module'

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
  { path: 'dashboard/overview', component: DashboardOverviewComponent, pathMatch: 'full' },
  { path: 'volunteer/detail', component: VolunteerDetailComponent, pathMatch: 'full' },
]


@NgModule({
  declarations: [VolunteerDetailComponent, DashboardComponent, DashboardOverviewComponent],
  imports: [
    CommonModule,
    NzFormModule,NzSwitchModule,NzGridModule,NzAvatarModule,
    NzNoAnimationModule,NzButtonModule,NzSelectModule,
    NzDrawerModule,NzDividerModule,NzTableModule,NzInputModule,
    NzListModule,NzCardModule,NzTabsModule,
    NzCheckboxModule,
    FormsModule,
    PipesModule,
    RouterModule.forChild(routes)
  ]
})
export class VolunteerModule { }
