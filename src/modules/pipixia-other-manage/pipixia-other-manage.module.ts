import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { FormsModule } from '@angular/forms';
import { VehicleHardwareComponent } from './vehicle-hardware/vehicle-hardware.component';
import { VehicleFenceComponent } from './vehicle-fence/vehicle-fence.component';
const routes: Routes = [
  { path: 'hardware', component: VehicleHardwareComponent, pathMatch: 'full' },
  { path: 'fence', component: VehicleFenceComponent, pathMatch: 'full' },
]
@NgModule({
  declarations: [VehicleHardwareComponent, VehicleFenceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzNoAnimationModule,
    FormsModule,
  ]
})
export class PipixiaOtherManageModule { }
