import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from "ag-grid-angular";
import { NgxEchartsModule } from "ngx-echarts";

import { Routes, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzTimePickerModule } from "ng-zorro-antd/time-picker";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { NzCascaderModule } from "ng-zorro-antd/cascader";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzUploadModule } from "ng-zorro-antd/upload";
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { NzListModule } from "ng-zorro-antd/list";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzStepsModule } from "ng-zorro-antd/steps";
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { CommonPageModule } from '../common/common.module';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angular2-qrcode';

// 自定义组件
import { ImportProfileComponent } from './import-profile/import-profile.component'
import { SaveImagesComponent } from './save-images/save-images.component'
import { ImportSchoolMajorComponent } from './import-school-major/import-school-major.component';
import { ImportScoreComponent } from './import-score/import-score.component';
import { AgGridComponent } from './ag-grid/ag-grid.component';
import { ScoreManagerComponent } from './score-manager/score-manager.component';
import { CreditDownloadComponent } from './credit-download/credit-download.component';
import { PaperDownloadComponent } from './paper-download/paper-download.component';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';
import { ImportStudentidComponent } from './import-studentid/import-studentid.component';
import { PaperReportComponent } from './paper-report/paper-report.component';
import { ReportManagerComponent } from './report-manager/report-manager.component';
import { ImportEnglishScoreComponent } from './import-english-score/import-english-score.component';
import { ImportEnglishComponent } from './import-english/import-english.component';
import { EnglishReportComponent } from './english-report/english-report.component';
import { GradeManagerComponent } from './grade-manager/grade-manager.component';
import { ImportGraduationComponent } from './import-graduation/import-graduation.component';
import { RecordDashboardComponent } from './records/record-dashboard/record-dashboard.component';
import { RecordDetailComponent } from './records/record-detail/record-detail.component';
import { SurveyinfoComponent } from './examination/surveyinfo/surveyinfo.component';
import { SurveyDetailComponent } from './examination/survey-detail/survey-detail.component';
import { SimulationScoreComponent } from './examination/simulation-score/simulation-score.component';
import { SimulationDetailComponent } from './examination/simulation-detail/simulation-detail.component';
import { PrintDetailComponent } from './examination/print-detail/print-detail.component';
import { ChangeApplyComponent } from './change-apply/change-apply.component';
import { EnglishDownloadComponent } from './english-download/english-download.component';
import { CorrectListComponent } from './examination/correct-list/correct-list.component';
import { CorrectComponent } from './examination/correct/correct.component';
import { ExportProfileComponent } from './export-profile/export-profile.component';
import { SignConfigComponent } from './sign-config/sign-config.component';
import { DegreeRegisterComponent } from './degree-register/degree-register.component';
import { FailManagerComponent } from './fail-manager/fail-manager.component';
import { GraduationExaminationComponent } from './graduation-examination/graduation-examination.component';
import { ImportSchoolExamComponent } from './import-school-exam/import-school-exam.component';
import { SchoolExamManagerComponent } from './school-exam-manager/school-exam-manager.component';
import { RegInfoComponent } from './data-statistics/reg-info/reg-info.component';



export const routes: Routes = [
  {
    path: "import-profile",
    component: ImportProfileComponent,
    pathMatch: "full",
  },
  {
    path: "image-manage",
    component: SaveImagesComponent,
    pathMatch: "full",
  },
  {
    path: "import-school-major",
    component: ImportSchoolMajorComponent,
    pathMatch: 'full',
  },
  {
    path: "import-score",
    component: ImportScoreComponent,
    pathMatch: 'full',
  },
  {
    path: "score-manager",
    component: ScoreManagerComponent,
    pathMatch: 'full',
  },
  {
    path: "credit-download",
    component: CreditDownloadComponent,
    pathMatch: 'full',
  },
  {
    path: "paper-download",
    component: PaperDownloadComponent,
    pathMatch: 'full',
  },
  {
    path: "home-dashboard",
    component: HomeDashboardComponent,
    pathMatch: 'full',
  },
  {
    path: "import-studentid",
    component: ImportStudentidComponent,
    pathMatch: 'full',
  },
  {
    path: "paper-report",
    component: PaperReportComponent,
    pathMatch: 'full',
  },
  {
    path: "report-manager",
    component: ReportManagerComponent,
    pathMatch: 'full',
  },
  {
    path: "import-english-score",
    component: ImportEnglishScoreComponent,
    pathMatch: 'full',
  },
  {
    path: "import-english",
    component: ImportEnglishComponent,
    pathMatch: 'full',
  },
  {
    path: "english-report",
    component: EnglishReportComponent,
    pathMatch: 'full',
  },
  {
    path: "grade-manager",
    component: GradeManagerComponent,
    pathMatch: 'full',
  },
  {
    path: "import-graduation",
    component: ImportGraduationComponent,
    pathMatch: 'full',
  },
  {
    path: "record-dashboard",
    component: RecordDashboardComponent,
    pathMatch: 'full',
  },
  {
    path: "record-detail",
    component: RecordDetailComponent,
    pathMatch: 'full',
  },
  {
    path: "survey-info",
    component: SurveyinfoComponent,
    pathMatch: 'full',
  },
  {
    path: "survey-detail",
    component: SurveyDetailComponent,
    pathMatch: 'full',
  },
  {
    path: "simulation-score",
    component: SimulationScoreComponent,
    pathMatch: 'full',
  },
  {
    path: "simulation-detail",
    component: SimulationDetailComponent,
    pathMatch: 'full',
  },
  {
    path: "print-detail",
    component: PrintDetailComponent,
    pathMatch: 'full',
  },
  {
    path: "change-apply",
    component: ChangeApplyComponent,
    pathMatch: 'full',
  },
  {
    path: "english-download",
    component: EnglishDownloadComponent,
    pathMatch: 'full',
  },
  {
    path: "correct-list",
    component: CorrectListComponent,
    pathMatch: 'full',
  },
  {
    path: "correct",
    component: CorrectComponent,
    pathMatch: 'full',
  },
  {
    path: "export-profile",
    component: ExportProfileComponent,
    pathMatch: 'full',
  },
  {
    path: "sign-config",
    component: SignConfigComponent,
    pathMatch: 'full',
  },
  {
    path: "degree-register",
    component: DegreeRegisterComponent,
    pathMatch: 'full',
  },
  {
    path: "fail-manager",
    component: FailManagerComponent,
    pathMatch: 'full',
  },
  {
    path: "graduation-examination",
    component: GraduationExaminationComponent,
    pathMatch: 'full',
  },
  {
    path: "import-school-exam",
    component: ImportSchoolExamComponent,
    pathMatch: 'full',
  },
  {
    path: "school-exam-manager",
    component: SchoolExamManagerComponent,
    pathMatch: 'full',
  },
]

@NgModule({
  declarations: [
    ImportProfileComponent,
    SaveImagesComponent,
    ImportSchoolMajorComponent,
    ImportScoreComponent,
    AgGridComponent,
    ScoreManagerComponent,
    CreditDownloadComponent,
    PaperDownloadComponent,
    HomeDashboardComponent,
    PaperReportComponent,
    ImportStudentidComponent,
    ReportManagerComponent,
    ImportEnglishScoreComponent,
    ImportEnglishComponent,
    EnglishReportComponent,
    GradeManagerComponent,
    ImportGraduationComponent,
    RecordDashboardComponent,
    RecordDetailComponent,
    SurveyinfoComponent,
    SurveyDetailComponent,
    SimulationScoreComponent,
    SimulationDetailComponent,
    PrintDetailComponent,
    ChangeApplyComponent,
    EnglishDownloadComponent,
    CorrectListComponent,
    CorrectComponent,
    ExportProfileComponent,
    SignConfigComponent,
    DegreeRegisterComponent,
    FailManagerComponent,
    GraduationExaminationComponent,
    ImportSchoolExamComponent,
    SchoolExamManagerComponent,
    RegInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NzMessageModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzModalModule,
    NzSpinModule,
    NzLayoutModule,
    NzNotificationModule,
    NzPageHeaderModule,
    NzTagModule,
    NzTimePickerModule,
    NzBreadCrumbModule,
    NzPipesModule,
    NzCascaderModule,
    NzInputNumberModule,
    NzTableModule,
    NzUploadModule,
    NzPopconfirmModule,
    NzAlertModule,
    NzCollapseModule,
    NzListModule,
    NzStatisticModule,
    NzGridModule,
    NzDividerModule,
    NzMenuModule,
    NzTabsModule,
    NzSelectModule,
    NzSwitchModule,
    NzProgressModule,
    NzCheckboxModule,
    NzRadioModule,
    NzDatePickerModule,
    NzDrawerModule,
    NzDropDownModule,
    NzCardModule,
    NzStepsModule,
    NzPaginationModule,
    NzToolTipModule,
    AgGridModule,
    NgxEchartsModule,
    CommonPageModule
  ],
  exports: []
})
export class SelfStudyModule { }
