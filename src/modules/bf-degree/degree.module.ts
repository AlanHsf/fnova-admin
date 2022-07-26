
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { AgGridModule } from "ag-grid-angular";
import { ComponentModule } from "../component/component.module";

// import { BrowserModule } from "@angular/platform-browser";

import { QRCodeModule } from "angular2-qrcode";


// antd
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzTimePickerModule } from "ng-zorro-antd/time-picker";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { NzCascaderModule } from "ng-zorro-antd/cascader";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzUploadModule } from "ng-zorro-antd/upload";
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { NzListModule } from "ng-zorro-antd/list";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzMessageModule } from "ng-zorro-antd/message";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzCardModule } from "ng-zorro-antd/card";

// Component

import { LiveManageComponent } from "./live-manage/live-manage.component";
import { LiveMembersComponent } from "./live-members/live-members.component";
import { LiveRoomComponent } from "./live-room/live-room.component";
import { CommonPageModule } from "../common/common.module";
import { ClassDetailComponent } from "./class-detail/class-detail.component";
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamEditComponent } from './exam-edit/exam-edit.component';

export const routes: Routes = [
  { path: "class-detail", component: ClassDetailComponent },
  { path: "live-room", component: LiveRoomComponent },
  { path: "live-members", component: LiveMembersComponent,},
  {
    path:"live-manage",
    component:LiveManageComponent,
    pathMatch:"full"
  },
  { path: "exam-list", component: ExamListComponent},
  { path: "exam-edit", component: ExamEditComponent,}

];
@NgModule({
  declarations: [
    LiveManageComponent,
    LiveRoomComponent,
    LiveMembersComponent,
    ClassDetailComponent,
    ExamListComponent,
    ExamEditComponent
  ],
  imports: [
    
    CommonModule,
    NzGridModule,
    NzDividerModule,
    NzMenuModule,
    NzTabsModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule,
    QRCodeModule,  
    NzUploadModule,
    NzPopconfirmModule,
    NzAlertModule,
    NzGridModule,
    NzCollapseModule,
    NzTableModule,
    NzListModule,
    NzTabsModule,
    NzStatisticModule,
    NzCheckboxModule,
    NzRadioModule,
    NzIconModule,
    NzModalModule,
    NzButtonModule,
    NzDatePickerModule,
    NzDrawerModule,
    NzSelectModule,
    AgGridModule,
    NzDropDownModule,
    NzSwitchModule,
    NzProgressModule,
    NzLayoutModule,
    DragDropModule,
    NzNotificationModule,
    NzPageHeaderModule,
    NzTagModule,
    NzTimePickerModule,
    NzPipesModule,
    NzBreadCrumbModule,
    NzCascaderModule,
    NzInputNumberModule,
    NzCardModule,
    ComponentModule,
    CommonPageModule,
    RouterModule.forChild(routes),
  ],
  exports:[
    
        // EditDocumentComponent
    ]
})
export class DegreeModule {}
