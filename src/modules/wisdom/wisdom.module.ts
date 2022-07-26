import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgxEchartsModule } from "ngx-echarts";
import { AgGridModule } from "ag-grid-angular";
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from "ng-zorro-antd/modal";

import { DashboardParkComponent } from './dashboard-park/dashboard-park.component'
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component'
import { MonitorPalyComponent } from './monitor-paly/monitor-paly.component'
import { SelectRouterComponent } from './select-router/select-router.component'
import { DashboardTradeComponent } from './dashboard-trade/dashboard-trade.component'
import { DashboardSecurityComponent } from './dashboard-security/dashboard-security.component'
import { HomeComponent } from './home/home.component'
import { ImportWorkerComponent } from './import-worker/import-worker.component'

export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    pathMatch: "full",
  },
  {
    path: "dashboard-park",
    component: DashboardParkComponent,
    pathMatch: "full",
  },
  {
    path: "dashboard-home",
    component: DashboardHomeComponent,
    pathMatch: "full",
  },
  {
    path: "monitor-paly",
    component: MonitorPalyComponent,
    pathMatch: "full",
  },
  {
    path: "select",
    component: SelectRouterComponent,
    pathMatch: "full",
  },
  {
    path: "dashboard-trade",
    component: DashboardTradeComponent,
    pathMatch: "full",
  },
  {
    path: "dashboard-security",
    component: DashboardSecurityComponent,
    pathMatch: "full",
  },
  {
    path: "import-worker",
    component: ImportWorkerComponent,
    pathMatch: "full",
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NzIconModule,
    NgxEchartsModule,
    NzMessageModule,
    AgGridModule,
    NzModalModule
  ],
  declarations: [
    DashboardParkComponent,
    DashboardHomeComponent,
    MonitorPalyComponent,
    SelectRouterComponent,
    DashboardTradeComponent,
    DashboardSecurityComponent,
    HomeComponent,
    ImportWorkerComponent
  ]
})
export class WisdomModule { }
