import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { AgGridModule } from "ag-grid-angular";
import { ComponentModule } from "../component/component.module";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzBadgeModule } from "ng-zorro-antd/badge";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzPopoverModule } from "ng-zorro-antd/popover";

import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzListModule } from "ng-zorro-antd/list";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzModalModule } from "ng-zorro-antd/modal";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";

import { CommonPageModule } from "../common/common.module";
import { PipesModule } from "../../pipes/pipes.module";

// import { BrowserModule } from "@angular/platform-browser";
import { HomeDashboardComponent } from "./home-dashboard/home-dashboard.component";
import { ImportStockComponent } from "./import-stock/import-stock.component";
import { CreatStockComponent } from "./creatStock/creatStock.component";
import { StockDetailComponent } from "./stock-detail/stock-detail.component";
import { WithdrawDetailComponent } from "./withdraw-detail/withdraw-detail.component";
import { OrderDetailComponent } from "./order-detail/order-detail.component";

export const routes: Routes = [
  {
    path: "home-dashboard",
    component: HomeDashboardComponent,
    pathMatch: "full",
  },
  {
    path: "import-stock",
    component: ImportStockComponent,
    pathMatch: "full",
  },
  {
    path: "creat-stock",
    component: CreatStockComponent,
    pathMatch: "full",
  },
  {
    path: "stock-detail",
    component: StockDetailComponent,
    pathMatch: "full",
  },
  {
    path: "withdraw-detail",
    component: WithdrawDetailComponent,
    pathMatch: "full",
  },
  {
    path: "order-detail",
    component: OrderDetailComponent,
    pathMatch: "full",
  },
];

@NgModule({
  declarations: [
    HomeDashboardComponent,
    ImportStockComponent,
    CreatStockComponent,
    StockDetailComponent,
    WithdrawDetailComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    FormsModule,
    RouterModule.forChild(routes),
    NzLayoutModule,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzBadgeModule,
    NzPageHeaderModule,
    NzToolTipModule,
    NzPopoverModule,
    NzCardModule,
    NzTagModule,
    NzSwitchModule,
    NzAvatarModule,
    NzFormModule,
    NzDrawerModule,
    NzGridModule,
    NzInputModule,
    NzSelectModule,
    NzTableModule,
    NzDividerModule,
    NzListModule,
    NzCheckboxModule,
    NzPipesModule,
    NzDropDownModule,
    NzProgressModule,
    MatTabsModule,
    MatExpansionModule,
    MatCardModule,
    DragDropModule,
    NzModalModule,
    // 通用数据组件
    CommonPageModule,
    AgGridModule,
  ],
  exports: [],
})
export class JiudakaModule {}
