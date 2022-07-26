import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { RouterModule, Routes } from "@angular/router";
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AgGridModule } from "ag-grid-angular";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { PrintComponent } from './print/print.component'
import { ImportWorkerComponent } from './import-worker/import-worker.component'
import { ExportComponent } from './export/export.component'

export const routes: Routes = [
  {
    path: "food/print",
    component: PrintComponent,
    pathMatch: "full",
  },
  {
    path: "food/import-worker",
    component: ImportWorkerComponent,
    pathMatch: "full",
  },
  {
    path: "food/export",
    component: ExportComponent,
    pathMatch: "full",
  },
];

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    NzInputModule,
    NzSpinModule,
    NzSelectModule,
    NzDatePickerModule,
    FormsModule,
    NzCheckboxModule,
    AgGridModule,
    NzModalModule,
    NzFormModule,
    RouterModule.forChild(routes),
    NzSwitchModule
  ],
  declarations: [
    PrintComponent,
    ImportWorkerComponent,
    ExportComponent
  ]
})
export class MealModule { }
