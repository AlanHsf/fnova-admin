import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NovaFileManagerComponent } from './manager/manager.component';

// Ant Components
import { NzMessageModule } from 'ng-zorro-antd/message';
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
import { NzPopoverModule } from "ng-zorro-antd/popover";
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
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSliderModule } from 'ng-zorro-antd/slider';

// OfficeModule
import { OfficeModule } from "../office/office.module"

const routes: Routes = [{
  path:"manager/:companyId",component:NovaFileManagerComponent
},
{
  path:"manager",component:NovaFileManagerComponent
}];

@NgModule({
  declarations: [NovaFileManagerComponent],
  imports: [
    CommonModule,FormsModule,
    RouterModule.forChild(routes),
    NzLayoutModule,
    NzMessageModule,
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
    NzPopoverModule,
    NzPaginationModule,
    NzAvatarModule,
    NzStatisticModule,
    NzTableModule,
    NzTagModule,
    NzFormModule,
    NzDrawerModule,
    NzDividerModule,
    NzPipesModule,
    NzCardModule,
    NzListModule,
    NzSliderModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzMenuModule,
    NzDropDownModule,
    NzProgressModule,
    DragDropModule,
    NzCascaderModule,
    NzInputNumberModule,
    NzPopconfirmModule,
    NzEmptyModule,
    // Office
    OfficeModule
  ],
  exports:[NovaFileManagerComponent]
})
export class CloudModule { }
