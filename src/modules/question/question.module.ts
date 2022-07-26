import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxEchartsModule } from "ngx-echarts";

import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { QuestionResultComponent } from "./question-result/question-result.component";
import { DetailComponent } from "./detail/detail.component";
import { ApproveComponent } from "./approve/approve.component"
import { ResultDetailComponent } from "./result-detail/result-detail.component";
import { DashboardSatisficingComponent } from "./dashboard-satisficing/dashboard-satisficing.component";
import { ActivityLogComponent } from "./activity-log/activity-log.component";
import { ImportWorkerComponent } from "./import-worker/import-worker.component";
import { DoubleGenerationComponent } from "./double-generation/double-generation.component";
import { Routes, RouterModule } from "@angular/router";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzFormModule } from "ng-zorro-antd/form";
import { AgGridModule } from "ag-grid-angular";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { VaccinationRecordComponent } from './vaccination-record/vaccination-record.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDropDownModule} from 'ng-zorro-antd/dropdown';
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { SurveyStatisticComponent } from './survey-statistic/survey-statistic.component';
export const routes: Routes = [
  { path: "dashboard", component: DashboardComponent, pathMatch: "full" },
  { path: "detail", component: DetailComponent, pathMatch: "full" },
  { path: "approve", component: ApproveComponent, pathMatch: "full" },

  {
    path: "dashboardSatisficing",
    component: DashboardSatisficingComponent,
    pathMatch: "full",
  },
  {
    path: "question-result",
    component: QuestionResultComponent,
    pathMatch: "full",
  },
  {
    path: "result-detail",
    component: ResultDetailComponent,
    pathMatch: "full",
  },
  {
    path: "activity-log",
    component: ActivityLogComponent,
    pathMatch: "full",
  },
  {
    path: "import-work",
    component: ImportWorkerComponent,
    pathMatch: "full",
  },
  {
    path: "double-generation",
    component: DoubleGenerationComponent,
    pathMatch: "full",
  },
  {
    path: "vaccination-record",
    component: VaccinationRecordComponent,
    pathMatch: "full",
  },
  {
    path: "survey-statistic",
    component: SurveyStatisticComponent,
    pathMatch: "full",
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    DetailComponent,
    ApproveComponent,
    DashboardSatisficingComponent,
    QuestionResultComponent,
    ResultDetailComponent,
    ActivityLogComponent,
    ImportWorkerComponent,
    DoubleGenerationComponent,
    VaccinationRecordComponent,
    SurveyStatisticComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgxEchartsModule,
    NzTabsModule,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    NzTableModule,
    NzGridModule,
    NzPageHeaderModule,
    NzFormModule,
    NzModalModule,
    NzInputModule,
    NzCheckboxModule,
    NzIconModule,
    NzSwitchModule,
    NzPaginationModule,
    NzSelectModule,
    NzDatePickerModule,
    NzDropDownModule,
    NzSpinModule,
    AgGridModule.withComponents([]),
  ],
})
export class QuestionModule {}
