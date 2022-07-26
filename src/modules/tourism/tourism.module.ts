import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommentReplyComponent } from './comment-manage/comment-reply/comment-reply.component';
import { CommentorderComponent } from './comment-manage/comment-order/comment-order.component';
import { OrderDetailsComponent } from './comment-manage/comment-order/order-details/order-details.component';
import { RoomorderDetailsComponent } from './comment-manage/comment-reply/roomorder-details/roomorder-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import NG_ZORRO from './service/ng-zorro';
import { NgxEchartsModule } from "ngx-echarts";
import { VillageDashboardComponent } from './dashboard/village-dashboard/village-dashboard.component';
import { FrpmComponent } from './comment-manage/frpm/frpm.component';
import { ShopDashboardComponent } from './shop-dashboard/shop-dashboard.component';
import { OrderComponent } from './order/order.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
// toursim/roomComments
export const routes: Routes = [
	{
		path: "home",
		component: DashboardComponent,
		pathMatch: "full",
	},
	{
		path: "village-home",
		component: VillageDashboardComponent,
		pathMatch: "full",
	},
	{
		path: "roomComments",
		component: CommentReplyComponent,
		pathMatch: "full",
	},
	{
		path: "orderComments",
		component: CommentorderComponent,
		pathMatch: "full",
	},
	{
		path: "OrderDetailsComponents",
		component: OrderDetailsComponent,
	},
	{
		path: "DetailsComponents",
		component: RoomorderDetailsComponent,
	},
	{
		path: "profile",
		component: FrpmComponent,
	},
	{
		path: "shop-dashboard",
		component: ShopDashboardComponent,
	},
	{
		path: "order",
		component: OrderComponent,
		pathMatch: "full",
	}
	,

];

@NgModule({
	declarations: [
		CommentReplyComponent,
		CommentorderComponent,
		OrderDetailsComponent,
		RoomorderDetailsComponent,
		DashboardComponent,
		VillageDashboardComponent,
		ShopDashboardComponent,
		OrderComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		NzSelectModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		NgxEchartsModule,
		NzModalModule,
		NzInputModule,
		[...NG_ZORRO],
	]
})
export class TourismModule { }
