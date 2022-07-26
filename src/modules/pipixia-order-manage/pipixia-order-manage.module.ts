import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { VehicleOrderComponent } from './vehicle-order/vehicle-order.component';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { RefundComponent } from './refund/refund.component';
import { SharedComponentModule } from 'src/shared-component/shared-component.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

export const routes: Routes = [
  { path: 'order', component: VehicleOrderComponent, pathMatch: 'full' },
  { path: 'refund', component: RefundComponent, pathMatch: 'full' },
]
@NgModule({
  declarations: [VehicleOrderComponent, RefundComponent],
  imports: [
    CommonModule,
    NzNoAnimationModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedComponentModule,
    ReactiveFormsModule,
    NzMenuModule,
    NzTableModule,
    NzButtonModule,
    NzDropDownModule,
    NzInputModule,
    NzSelectModule,
    NzCollapseModule,
    NzIconModule,
    NzTypographyModule,
    NzModalModule,
    NzFormModule,
    NzDescriptionsModule,
    NzInputNumberModule,
    NzTimePickerModule,
    NzDatePickerModule,
    NzToolTipModule
  ],
  exports: []
})
export class PipixiaOrderManageModule { }
