import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { ProjectGanttComponent } from './project-gantt/project-gantt.component';
import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

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
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule } from '@angular/material/expansion';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {CommonPageModule} from '../common/common.module';
import { PipesModule } from '../../pipes/pipes.module'
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  {
    path: 'dashboard', component: DashboardOverviewComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'gantt/:projectId', component: ProjectGanttComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'gantt', component: ProjectGanttComponent,
    runGuardsAndResolvers: 'always',
  }
]

@NgModule({
  declarations: [ProjectGanttComponent,DashboardOverviewComponent],
  imports: [
    CommonModule,PipesModule,FormsModule,
    RouterModule.forChild(routes),
    NzLayoutModule,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzBadgeModule,
    NzPageHeaderModule,
    NzPopoverModule,NzCardModule,NzTagModule,
    NzSwitchModule,NzAvatarModule,NzFormModule,
    NzDrawerModule,NzGridModule,NzInputModule,
    NzSelectModule,NzTableModule,NzDividerModule,
    NzListModule,NzCheckboxModule,
    NzDropDownModule,
    MatTabsModule,MatExpansionModule,MatCardModule,
    DragDropModule,
    // 通用数据组件
    CommonPageModule
  ]
})
export class ProjectModule { }
