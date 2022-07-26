import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { VehicleInfoComponent } from './vehicle-info/vehicle-info.component';
import { NzNoAnimationModule} from 'ng-zorro-antd/core/no-animation';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';
import { VehicleMonitorComponent } from './vehicle-monitor/vehicle-monitor.component';
import { VehicleAlarmComponent } from './vehicle-alarm/vehicle-alarm.component';
import { VehicleControlComponent } from './vehicle-control/vehicle-control.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import {NgxEchartsModule} from 'ngx-echarts';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
const routes: Routes = [
  { path: 'info', component: VehicleInfoComponent, pathMatch: 'full' },
  { path: 'monitor', component: VehicleMonitorComponent, pathMatch: 'full' },
  { path: 'alarm', component: VehicleAlarmComponent, pathMatch: 'full' },
  { path: 'control', component: VehicleControlComponent, pathMatch: 'full' }
]

@NgModule({
  declarations: [VehicleInfoComponent, VehicleMonitorComponent, VehicleAlarmComponent, VehicleControlComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzNoAnimationModule,
    FormsModule,
    NzTableModule,
    NzModalModule,
    NzTabsModule,
    NzDatePickerModule,
    NzSelectModule,
    NzInputNumberModule,
    FormsModule,
    NgxEchartsModule,
    NzMenuModule,
    NzButtonModule,
    NzDropDownModule,
    NzInputModule,
    NzSelectModule,
    NzCollapseModule,
    NzIconModule,
    NzTagModule,
    NzTypographyModule,
    NzToolTipModule
  ],
})
export class PipixiaVehicleManageModule { }
