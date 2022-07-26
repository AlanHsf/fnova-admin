import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ScrollingModule } from '@angular/cdk/scrolling';


export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
]

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    NzListModule,NzModalModule,NzPopoverModule,NzCardModule,NzPageHeaderModule,
    NzTagModule,NzGridModule,NzTabsModule,NzRadioModule,
    RouterModule.forChild(routes),
    NzNoAnimationModule,
    FormsModule,
    ScrollingModule
  ]
})
export class OrganizationModule { }
