import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterToolsComponent } from './filter-tools/filter-tools.component';
import { FormsModule } from '@angular/forms';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";


@NgModule({
  //  声明
  declarations: [FilterToolsComponent],
  imports: [
    CommonModule,
    NzNoAnimationModule,
    FormsModule,
    NzInputModule,
    NzSelectModule,
    NzCollapseModule,
    NzTimePickerModule,
    NzDatePickerModule
  ],
  // 共享组建 出口
  exports: [FilterToolsComponent]
})
export class SharedComponentModule { }
