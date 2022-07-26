import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxEchartsModule } from "ngx-echarts";
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
// 页面组件
import { DashboardComponent } from './dashboard/dashboard.component'
import { StoreListComponent } from './store-list/store-list.component'
import { WithdrawalComponent } from './withdrawal/withdrawal.component'
import { AccountLogComponent } from './account-log/account-log.component';
import { CommentsComponent } from './comments/comments.component';
import { DetailsComponent } from './comments/details/details.component';


export const routes: Routes = [
	{
		path: "dashboard",
		component: DashboardComponent,
		pathMatch: "full",
	},
	{
		path: "store-card",
		component: StoreListComponent,
		pathMatch: "full",
	},
	{
		path: "Withdrawal",
		component: WithdrawalComponent,
		pathMatch: "full",
	},
	{
		path: "account-log",
		component: AccountLogComponent,
		pathMatch: "full",
	},
	{
		path: "Comments",
		component: CommentsComponent,
		pathMatch: "full",
	},
	{
		path: "Details",
		component: DetailsComponent,
		pathMatch: "full",
	}
];

@NgModule({
	declarations: [DashboardComponent, CommentsComponent,StoreListComponent, WithdrawalComponent, AccountLogComponent, CommentsComponent, DetailsComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxEchartsModule,
		NzEmptyModule,
		NzCardModule,
		NzPaginationModule,
		NzGridModule,
		NzDividerModule,
		NzBadgeModule,
		NzDatePickerModule,
		NzPageHeaderModule,
		NzTableModule,
		NzSwitchModule,
		NzModalModule,
		NzSelectModule,
		NzInputModule,
		NzButtonModule,
		NzIconModule,
		NzPopconfirmModule,
		RouterModule.forChild(routes),
	]
})
export class BzzbModule { }
