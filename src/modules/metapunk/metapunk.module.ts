import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { AxieDashboardOverviewComponent } from './axie/dashboard-overview/dashboard-overview.component';
// import { SPSDashboardOverviewComponent } from './sps/dashboard-overview/dashboard-overview.component';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule} from 'ng-zorro-antd/tooltip';

import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule } from '@angular/material/expansion';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {CommonPageModule} from '../common/common.module';
import { PipesModule } from '../../pipes/pipes.module'
import { FormsModule } from '@angular/forms';

import { MetapunkSPSModule } from './metapunk.sps.module';
// import { MetapunkSPSManagerModule } from './metapunk.sps.manager.module';

export const routes: Routes = [
  {
    path: 'axie/dashboard', component: AxieDashboardOverviewComponent,
    runGuardsAndResolvers: 'always'
  },
  // {
  //   path: 'sps/dashboard', component: SPSDashboardOverviewComponent,
  //   runGuardsAndResolvers: 'always'
  // }
  // {
  //   path: 'sps/dashboard', component: SPSDashboardOverviewComponent,
  //   runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: 'sps/battlebot', component: BattlebotComponent,
  //   runGuardsAndResolvers: 'always'
  // }
]

@NgModule({
  declarations: [AxieDashboardOverviewComponent
    // ,SPSDashboardOverviewComponent
  ],
  imports: [
    CommonModule,PipesModule,FormsModule,
    RouterModule.forChild(routes),
    NzLayoutModule,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzBadgeModule,
    NzPageHeaderModule,NzToolTipModule,NzStepsModule,
    NzPopoverModule,NzCardModule,NzTagModule,NzSkeletonModule,
    NzModalModule,NzAlertModule,
    NzSwitchModule,NzAvatarModule,NzFormModule,
    NzDrawerModule,NzGridModule,NzInputModule,
    NzSelectModule,NzTableModule,NzDividerModule,
    NzListModule,NzCheckboxModule,NzPipesModule,
    NzDropDownModule,NzProgressModule,
    MatTabsModule,MatExpansionModule,MatCardModule,
    DragDropModule,
    // 通用数据组件
    CommonPageModule,
    // 子模块
    MetapunkSPSModule,// MetapunkSPSManagerModule
  ]
})
export class MetapunkModule { }
