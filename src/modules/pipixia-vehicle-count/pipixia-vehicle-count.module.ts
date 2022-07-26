import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import {NgxEchartsModule} from 'ngx-echarts';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { VehicleIndexComponent } from './vehicle-index/vehicle-index.component';
import { GovIndexComponent } from './gov-index/gov-index.component';
const routes: Routes = [
  { path: 'index', component: VehicleIndexComponent, pathMatch: 'full' },

  
  { path: 'gov-index', component: GovIndexComponent, pathMatch: 'full'}
]
@NgModule({
  declarations: [VehicleIndexComponent, GovIndexComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzNoAnimationModule,
    NzTableModule,NzModalModule,NzTabsModule,NzDatePickerModule,NzSelectModule,NzInputNumberModule,
    FormsModule,
    NgxEchartsModule,
    NzMenuModule,
    NzTableModule,
    NzButtonModule,
    NzDropDownModule,
    NzInputModule,
    NzSelectModule,
    NzCollapseModule,
    NzIconModule,
    NzTypographyModule,
    NzToolTipModule
  ]

})
export class PipixiaVehicleCountModule { }
