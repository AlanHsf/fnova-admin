import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { MaterialModule } from '@angular/material';
// import { IonicPageModule } from 'ionic-angular';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgxEchartsModule } from "ngx-echarts";

import { Routes, RouterModule } from "@angular/router";

// Child Page Components
import { CommonListPage } from "./common-list/common-list-page";

// Import Shared Module
import { PipesModule } from "../../pipes/pipes.module";

import { AgGridModule } from "ag-grid-angular";

// Providers

// DataTable Depand CDK Table
// import {CdkTableModule} from '@angular/cdk/table';
// import {MatTableModule} from '@angular/material';
// End of DataTable



// Editor Components
import { EditorModule } from "@tinymce/tinymce-angular";

// AMap Components
import { NgxAmapModule } from "ngx-amap";

// File Components
// import { EditImageComponent } from "./edit-image/edit-image.component";
import { EditVideoComponent } from "./edit-video/edit-video.component"
import { EditFileManagerComponent } from "./edit-filemanager/edit-filemanager.component"
import { EditIconfontComponent } from "./edit-iconfont/edit-iconfont.component"

// Edit Components
import { EditProfileMatchComponent } from "./edit-profile-match/edit-profile-match.component";
import { EditModuleRouteComponent } from "./edit-module-route/edit-module-route.component";
import { EditQRCodeComponent } from "./edit-qrcode/edit-qrcode.component";
import { EditObjectComponent } from "./edit-object/edit-object.component";
import { EditSchemaFieldsComponent } from "./edit-schema-fields/edit-schema-fields.component";
import { EditRouteFieldsComponent } from "./edit-route-fields/edit-route-fields.component";
import { EditSpecComponent } from "./edit-spec/edit-spec.component";
import { EditUrlComponent } from "./edit-url/edit-url.component";
import { EditIncomeOptionsComponent } from './edit-income-options/edit-income-options.component';
import { EditUpgradeRuleComponent } from './edit-upgrade-rule/edit-upgrade-rule.component';
import { EditIncomeRatioComponent } from './edit-income-ratio/edit-income-ratio.component';
import { EditStaffRatioComponent } from './edit-staff-ratio/edit-staff-ratio.component';
import { EditServeRuleComponent } from './edit-serve-rule/edit-serve-rule.component';
import { EditOrganizationComponent } from './edit-organization/edit-organization.component';
import { EditExtractingQuestionComponent } from './edit-extracting-question/edit-extracting-question.component';
import {EditVipPriceComponent} from "./edit-vip-price/edit-vip-price.component"

// Ant Components
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzTimePickerModule } from "ng-zorro-antd/time-picker";
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

//
import { CommonListItemComponent } from "./common-list-item/common-list-item.component";
import { EditSurveyOptionsComponent } from "./edit-survey-options/edit-survey-options.component";
import { FrameShopComponent } from "./frame-shop/frame-shop.component";
import { ShoporderComponent } from "./shoporder/shoporder.component";
import { RoleManageComponent } from "./role-manage/role-manage.component";

// import { ClassDetailModule } from "../../components/class-detail/class-detail.module"
// import { SchemaStatusComponent } from '../schema-status/schema-status';

import { QRCodeModule } from 'angular2-qrcode';

// Edit Note Space
import { EditNotespaceComponent } from './edit-notespace/edit-notespace.component';
import { NoteMaterialModule } from './edit-notespace/note-material.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';

import { SystemNoticeComponent } from "./notice/system-notice/system-notice.component";
import { DevRouteComponent } from "./devRoute/devRoute.component";
import { EditDiytabsComponent } from "./edit-diytabs/edit-diytabs.component";
import { EditCompanyComponent } from "./edit-company/edit-company.component";
import { EditObjectEditorComponent } from './edit-know-desc/edit-object-editor.component';
import { EditKnowDescComponent } from "./edit-know-desc/edit-know-desc.component";
import { PlatformAppComponent } from "./platform-app/platform-app.component";
import { ShopDashboardComponent } from "./shop-dashboard/shop-dashboard.component";
import { AccountLogComponent } from './account-log/account-log.component';
import { CompanyDetailsComponent } from './edit-company/company-details/company-details.component';
import { GoodsOrderComponent } from './goods-order/goods-order.component';


// Nova Module
import { OfficeModule } from '../../../projects/nova-office/src/modules/office/office.module';
import { CloudModule } from '../../../projects/nova-office/src/modules/cloud/cloud.module';

export const routes: Routes = [
  {
    path: "manage/:schemaName",
    component: CommonListPage,
    runGuardsAndResolvers: "always"
  },
  {
    path: "notespace",
    component: EditNotespaceComponent,
    runGuardsAndResolvers: "always"
  },
  // IFRAME 接入商城管理后台相关组件
  {
    path: "frame/shop/:shopRoute",
    component: FrameShopComponent,
    runGuardsAndResolvers: "always"
  },
  {
    path: "frame/shop",
    component: FrameShopComponent,
    runGuardsAndResolvers: "always"
  },
  {
    path: "system-notice",
    component: SystemNoticeComponent,
  },
  {
    path: "devRoute",
    component: DevRouteComponent,
    runGuardsAndResolvers: "always"
  },
  {
    path: "editdiytabs",
    component: EditDiytabsComponent,
    runGuardsAndResolvers: "always"
  },
  {
    path: "edit-company",
    component: EditCompanyComponent,
    runGuardsAndResolvers: "always"
  },
  {
    path: "shop-dashboard",
    component: ShopDashboardComponent,
    runGuardsAndResolvers: "always"
  },{
    path: "platfrom-app",
    component: PlatformAppComponent,
    runGuardsAndResolvers: "always"
  }
  ,{
    path: "edit-url",
    component: EditUrlComponent,
    runGuardsAndResolvers: "always"
  },
  {
    path: "shoporder",
    component: ShoporderComponent,
    runGuardsAndResolvers: "always"
  },
  {
    path: "goods-order",
    component: GoodsOrderComponent,
    runGuardsAndResolvers: "always"
  },
  {
    path: "accountLog",
    component: AccountLogComponent,
    runGuardsAndResolvers: "always"
  },
  {
    path: "company-details",
    component: CompanyDetailsComponent,
    runGuardsAndResolvers: "always"
  },
  {
    path: "role-manage",
    component: RoleManageComponent,
    runGuardsAndResolvers: "always"
  },
];

@NgModule({
  declarations: [
    CommonListPage,
    CommonListItemComponent,
    EditSurveyOptionsComponent,
    EditObjectComponent,
    EditProfileMatchComponent,
    EditModuleRouteComponent,
    EditSchemaFieldsComponent,
    EditQRCodeComponent,
    FrameShopComponent,
    EditNotespaceComponent,
    EditVideoComponent,
    EditFileManagerComponent,
    EditIconfontComponent,
    EditIncomeOptionsComponent,
    EditUpgradeRuleComponent,
    EditIncomeRatioComponent,
    EditRouteFieldsComponent,
    EditStaffRatioComponent,
    EditServeRuleComponent,
    EditOrganizationComponent,
    EditVipPriceComponent,
    EditExtractingQuestionComponent,
    SystemNoticeComponent,
    DevRouteComponent,
    EditDiytabsComponent,
    EditCompanyComponent,
    EditObjectEditorComponent,
    EditKnowDescComponent,
    PlatformAppComponent,
    ShopDashboardComponent,
    EditSpecComponent,
    EditUrlComponent,
    ShoporderComponent,
    AccountLogComponent,
    CompanyDetailsComponent,
    RoleManageComponent,
    GoodsOrderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AgGridModule,
    NzLayoutModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzRadioModule,
    NzTabsModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzCheckboxModule,
    NzSwitchModule,
    NzNotificationModule,
    NzModalModule,
    NzIconModule,
    NzPageHeaderModule,
    NzPaginationModule,
    NzStatisticModule,
    NzTableModule,
    NzTagModule,
    NzFormModule,
    NzDrawerModule,
    NzDividerModule,
    NzPipesModule,
    NoteMaterialModule,
    NzCardModule,
    NzListModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzMenuModule,
    NzDropDownModule,
    NzProgressModule,
    NzCascaderModule,
    NzInputNumberModule,
    NzPopconfirmModule,
    NgxEchartsModule,
    NzEmptyModule,
    DragDropModule,
    EditorModule,
    OfficeModule,
    CloudModule,
    QRCodeModule,
    NgxAmapModule.forRoot({
      apiKey: "8884994c8ccd064cd192fe3d04ab9d4e"
    }),
    // MaterialModule,
    // DataTable
    // CdkTableModule,
    // MatTableModule,
    // Import Custom Shared Module
    PipesModule,
    // ClassDetailModule,
    RouterModule.forChild(routes),

  ],
  exports: [
    CommonListPage,
    EditObjectComponent,
    EditProfileMatchComponent,
    EditModuleRouteComponent,
    EditSchemaFieldsComponent,
    EditQRCodeComponent,
    EditNotespaceComponent,
    EditRouteFieldsComponent,
    EditExtractingQuestionComponent,
    EditFileManagerComponent,
    EditCompanyComponent,
    EditObjectEditorComponent,
    EditKnowDescComponent,
    EditSpecComponent,
    EditVipPriceComponent,
    ShopDashboardComponent,
    PlatformAppComponent,
    EditUrlComponent,
    CloudModule,

  ]

})
export class CommonPageModule { }
