import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { FormsModule } from '@angular/forms';
import {A11yModule} from '@angular/cdk/a11y';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import { CommonPageModule } from "../common/common.module";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzRadioModule } from "ng-zorro-antd/radio";
// import { EditImageComponent } from "src/modules/common/edit-image/edit-image.component";
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ShareRankingComponent } from './share-ranking/share-ranking.component';
import { ShareHoldersComponent } from './share-holders/share-holders.component';
import { HttpClientModule } from "@angular/common/http";
import { StaffRankingComponent} from './staff-ranking/staff-ranking.component';
import { ActivitySettingComponent } from './activity-setting/activity-setting.component';
import { SendMsgComponent } from './send-msg/send-msg.component'
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
  { path: 'share-ranking',component:ShareRankingComponent,pathMatch:'full'},
  {path:'share-holder',component:ShareHoldersComponent,pathMatch:'full'},
  {path:'staff-ranking',component:StaffRankingComponent,pathMatch:'full'},
  {path:'activity-setting',component:ActivitySettingComponent,pathMatch:'full'},
  {path:'send-msg',component:SendMsgComponent,pathMatch:'full'}
]
// 标题栏

@NgModule({
  entryComponents: [],// EditImageComponent
  declarations: [DashboardComponent, ShareRankingComponent, ShareHoldersComponent,StaffRankingComponent, ActivitySettingComponent, SendMsgComponent],
  // exports: [EditImageComponent], 
  imports: [
    CommonModule,
    CommonPageModule,
    NzModalModule,
    NzTabsModule,
    NzTableModule,
    NzRadioModule,
    RouterModule.forChild(routes),
    NzSliderModule,
    NzCarouselModule,
    FormsModule,
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    NzCollapseModule,
    NgxEchartsModule,
    HttpClientModule,
    NzButtonModule,
    NzMessageModule
    // ApolloModule,
    // HttpLinkModule
  ],
  providers: [],
})
export class XiyuanModule { }
