import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OpsuserComponent } from './opsuser/opsuser.component';
import { MemberComponent } from './member/member.component';
import { FormsModule } from '@angular/forms';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { SharedComponentModule } from 'src/shared-component/shared-component.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
const routes: Routes = [
  { path: 'opsuser', component: OpsuserComponent },
  { path: 'member', component: MemberComponent },
]

@NgModule({
  declarations: [OpsuserComponent, MemberComponent],
  imports: [
    CommonModule,
    FormsModule,
    NzNoAnimationModule,
    RouterModule.forChild(routes),
    SharedComponentModule,
    NzTableModule,
    NzModalModule,
    NzDropDownModule,
    NzButtonModule,
    NzIconModule,
    NzTypographyModule
  ]
})
export class PipixiaMemberManageModule { }
