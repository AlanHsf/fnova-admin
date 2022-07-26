import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard.component";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzMessageModule } from "ng-zorro-antd/message";
import { RouterModule } from "@angular/router";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NgxEchartsModule } from "ngx-echarts";
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    FormsModule,
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzGridModule,
    NzDividerModule,
    NzInputModule,
    RouterModule,
    NzButtonModule,
    NzMenuModule,
    NgxEchartsModule,
    NzSelectModule,
    NzTabsModule,
    NzMessageModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule {}
