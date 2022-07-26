import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';

import { Routes, RouterModule } from '@angular/router';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';

import { StudentDetailComponent } from './student-detail/student-detail.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
  // { path: 'student/:storeid', component: StudentComponent, pathMatch: 'full' },
  { path: 'student/detail', component: StudentDetailComponent, pathMatch: 'full' },
]


@NgModule({
  declarations: [DashboardComponent, StudentDetailComponent],
  imports: [
    CommonModule,
    NzTableModule,
    NzCardModule,
    NzGridModule,
    NzCollapseModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class XiaofangModule { }
