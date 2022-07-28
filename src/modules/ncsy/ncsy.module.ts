import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxEchartsModule } from "ngx-echarts";


// antd
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
//自定义组件页面
import { ReplyComponent } from './mail/reply/reply.component';
import { MailComponent } from './mail/mail.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountlogDetailComponent } from './account-info/accountlog-detail/accountlog-detail.component';
export const routes: Routes = [
  {
    path: "mail",
    component: MailComponent,
    pathMatch: "full",
  }, {
    path: 'reply',
    component: ReplyComponent,
    pathMatch: 'full'
  },
  {
    path: 'profile-info',
    component: ProfileInfoComponent,
    pathMatch: 'full'
  },
  {
    path: 'account-info',
    component: AccountInfoComponent,
    pathMatch: 'full'
  }
  ,
  {
    path: 'accountlog-detail',
    component: AccountlogDetailComponent,
    pathMatch: 'full'
  }
];
@NgModule({
  declarations: [
      MailComponent,
      ReplyComponent,
      ProfileInfoComponent,
      AccountInfoComponent,
      AccountlogDetailComponent
    ],
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
    NzSpaceModule,
    NzDescriptionsModule,
    NzSelectModule,
    NzTabsModule,
    RouterModule.forChild(routes)
  ]
})
export class NcsyModule { }
