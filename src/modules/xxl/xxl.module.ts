import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxEchartsModule } from "ngx-echarts";

// antd
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
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
;
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

// component
import { QuoteComponent } from './quote/quote.component';
import { InformationComponent } from './information/information.component';
import { MaterialComponent } from './material/material.component';
import { AuditComponent } from './audit/audit.component';
import { DetailComponent } from './audit/detail/detail.component'
import { ManagementComponent } from './management/management.component';
import { ConstructionDetailComponent } from './construction-complaint/construction-detail/construction-detail.component';
import { ConstructionComplaintComponent } from './construction-complaint/construction-complaint.component';
import { OrderReviewComponent } from './order-review/order-review.component';
import { OrderDetailComponent } from './order-review/order-detail/order-detail.component';
import { ManagementdetailsComponent } from './management/details/details.component';

export const routes: Routes = [
  {
    path: "information",
    component: InformationComponent,
    pathMatch: "full",
  },
  {
    path: "material",
    component: MaterialComponent,
    pathMatch: "full",
  },
  {
    path: "quote",
    component: QuoteComponent,
    pathMatch: "full",
  },
  {
    path: "audit",
    component: AuditComponent,
    pathMatch: "full",
  },
  {
    path: "detail",
    component: DetailComponent,
    pathMatch: "full",
  },
  {
    path: "details",
    component: ManagementdetailsComponent,
    pathMatch: "full",
  },
  {
    path: "management",
    component: ManagementComponent,
    pathMatch: "full",
  },
  {
    path: "construction",
    component: ConstructionComplaintComponent,
    pathMatch: "full",
  },
  {
    path: "constructiondetail",
    component: ConstructionDetailComponent,
    pathMatch: "full",
  },
  {
    path: "orderreview",
    component: OrderReviewComponent,
    pathMatch: "full",
  },
  {
    path: "orderdetail",
    component: OrderDetailComponent,
    pathMatch: "full",
  },
  
]
@NgModule({
  declarations: [
    InformationComponent,
    MaterialComponent,
    QuoteComponent,
    AuditComponent,
    DetailComponent,
    ManagementComponent,
    ConstructionDetailComponent,
    ConstructionComplaintComponent,
    OrderReviewComponent,
    OrderDetailComponent,
    ManagementdetailsComponent
  ],
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
    NzTimePickerModule,
    NzSelectModule,
    NzButtonModule,
    NzFormModule,
    NzModalModule,
    NzInputNumberModule,
    NzMessageModule,
    NzInputModule,
    NzIconModule,
    NzModalModule,
    NzCarouselModule,
    RouterModule.forChild(routes),
  ]
})
export class XxlModule { }
