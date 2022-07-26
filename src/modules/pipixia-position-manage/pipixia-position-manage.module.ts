import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { VehicleDistributedComponent } from './vehicle-distributed/vehicle-distributed.component';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { FormsModule } from '@angular/forms';
import { VehicleTrackComponent } from './vehicle-track/vehicle-track.component';
import { VehicleFenceComponent } from './vehicle-fence/vehicle-fence.component';
import { EditFenceComponent } from './edit-fence/edit-fence.component';
import { UpdataFenceComponent } from './updata-fence/updata-fence.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
const routes: Routes = [
  { path: 'distributed', component: VehicleDistributedComponent, pathMatch: 'full' },
  { path: 'track', component: VehicleTrackComponent, pathMatch: 'full' },
  { path: 'fence', component: VehicleFenceComponent, pathMatch: 'full' },
  { path: 'edit', component: EditFenceComponent, pathMatch: 'full' },
  { path: 'updata', component: UpdataFenceComponent, pathMatch: 'full' },

]
@NgModule({
  declarations: [VehicleDistributedComponent, VehicleTrackComponent, VehicleFenceComponent, EditFenceComponent, UpdataFenceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzNoAnimationModule,
    FormsModule,
    NzMenuModule,
    NzTableModule,
    NzButtonModule,
    NzDropDownModule,
    NzInputModule,
    NzSelectModule,
    NzCollapseModule,
    NzIconModule,
    NzModalModule,
    NzDatePickerModule
  ]
})
export class PipixiaPositionManageModule { }
