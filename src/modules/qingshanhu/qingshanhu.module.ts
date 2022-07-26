import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxEchartsModule } from "ngx-echarts";

import { CommonModule } from "@angular/common";
import { CheckInResultComponent } from "./check-in-result/check-in-result.component";
import { Routes, RouterModule } from "@angular/router";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzFormModule } from "ng-zorro-antd/form";
import { AgGridModule } from "ag-grid-angular";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzNotificationModule } from "ng-zorro-antd/notification";
// import { MaterialModule } from '@angular/material';
// import { IonicPageModule } from 'ionic-angular';
import { HttpClientModule } from "@angular/common/http";



// Import Shared Module
import { PipesModule } from "../../pipes/pipes.module";


// Editor Components
import { EditorModule } from "@tinymce/tinymce-angular";

// AMap Components
import { NgxAmapModule } from "ngx-amap";

// File Components
// import { EditImageComponent } from "./edit-image/edit-image.component";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzTimePickerModule } from "ng-zorro-antd/time-picker";
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';


import { QRCodeModule } from 'angular2-qrcode';

// Edit Note Space
import { NzListModule } from 'ng-zorro-antd/list';


export const routes: Routes = [
  {
    path: "checkInResult",
    component: CheckInResultComponent,
    pathMatch: "full",
  }
];

@NgModule({
  declarations: [CheckInResultComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NzListModule,
    NzInputNumberModule,
    NzCascaderModule,
    QRCodeModule,
    NzDatePickerModule,
    NzPopconfirmModule,
    NzBreadCrumbModule,
    NzMenuModule,
    DragDropModule,
    NzPipesModule,
    NzDividerModule,
    NzProgressModule,
    NzDropDownModule,
    NzTimePickerModule,
    NzDrawerModule,
    NzStatisticModule,
    HttpClientModule,
    PipesModule,
    EditorModule,
    NzLayoutModule,
    NzSelectModule,
    NzRadioModule,
    NgxEchartsModule,
    NzTabsModule,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    NzTableModule,
    NzGridModule,
    NzPageHeaderModule,
    NzFormModule,
    NzModalModule,
    NzInputModule,
    NzCheckboxModule,
    NzIconModule,
    NzSwitchModule,
    NzNotificationModule,
    AgGridModule.withComponents([]),
  ]
})
export class QingshanhuModule { }
