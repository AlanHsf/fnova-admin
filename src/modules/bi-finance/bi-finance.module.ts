import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxEchartsModule } from "ngx-echarts";

import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { WritedataComponent } from "./writedata/writedata.component";
import { ReportComponent } from "./report/report.component";
import { CockpitDashboardComponent } from "./cockpit-dashboard/cockpit-dashboard.component";
import { Routes, RouterModule } from "@angular/router";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzStepsModule } from "ng-zorro-antd/steps";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { AgGridModule } from "ag-grid-angular";
import { NzLayoutModule } from "ng-zorro-antd/layout";

export const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    pathMatch: "full"
  }, // 模版选择
  {
    path: "enterdata",
    component: WritedataComponent,
    pathMatch: "full"
  }, // 数据录入
  { path: "report", component: ReportComponent, pathMatch: "full" }, // 报表生成
  {
    path: "cockpit",
    component: CockpitDashboardComponent,
    pathMatch: "full"
  } // 驾驶舱
];

@NgModule({
  declarations: [
    DashboardComponent,
    WritedataComponent,
    ReportComponent,
    CockpitDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgxEchartsModule, NzModalModule, NzTabsModule, NzButtonModule, NzDrawerModule,
    NzIconModule, NzInputModule, NzSelectModule, NzGridModule,
    NzPageHeaderModule, NzCardModule, NzStepsModule, NzLayoutModule,
    AgGridModule.withComponents([])
  ]
})
export class BiFinanceModule { }
