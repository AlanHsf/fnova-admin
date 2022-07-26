import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxEchartsModule } from "ngx-echarts";

import { MailComponent } from './mail/mail.component';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ReplyComponent } from './mail/reply/reply.component';
export const routes: Routes = [
  {
    path: "mail",
    component: MailComponent,
    pathMatch: "full",
  }, {
    path: 'reply',
    component: ReplyComponent,
    pathMatch: 'full'
  }
];
@NgModule({
  declarations: [MailComponent, ReplyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzPageHeaderModule,
    NzInputModule,
    NzSpinModule,
    NzTableModule,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
    NzBadgeModule,
    NzMessageModule,
    RouterModule,
    NgxEchartsModule,
    RouterModule.forChild(routes)
  ]
})
export class NcsyModule { }
