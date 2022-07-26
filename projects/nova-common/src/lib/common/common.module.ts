import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgxEchartsModule } from "ngx-echarts";



import { AgGridModule } from "ag-grid-angular";
import { EditorModule } from "@tinymce/tinymce-angular";
import { NgxAmapModule } from "ngx-amap";
// edit-component

import { EditObjectComponent } from "./edit-object/edit-object.component";
import { EditFileManagerComponent } from "./edit-filemanager/edit-filemanager.component";




// Ant Components
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzTimePickerModule } from "ng-zorro-antd/time-picker";
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AgGridModule,
    NzLayoutModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzRadioModule,
    NzTabsModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzCheckboxModule,
    NzSwitchModule,
    NzNotificationModule,
    NzModalModule,
    NzIconModule,
    NzPageHeaderModule,
    NzPaginationModule,
    NzStatisticModule,
    NzTableModule,
    NzTagModule,
    NzFormModule,
    NzDrawerModule,
    NzDividerModule,
    NzPipesModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzMenuModule,
    NzDropDownModule,
    NzProgressModule,
    NzCascaderModule,
    NzInputNumberModule,
    NzPopconfirmModule,
    NgxEchartsModule,
    NzEmptyModule,
    DragDropModule,
    EditorModule,
    QRCodeModule,
    NgxAmapModule.forRoot({
      apiKey: "8884994c8ccd064cd192fe3d04ab9d4e"
    }),
  ],
  exports: [


  ]

})
export class CommonPageModule { }
