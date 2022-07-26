import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { AgGridModule } from "ag-grid-angular";

// import { BrowserModule } from "@angular/platform-browser";

import { AuthGuard } from "./auth.guard";

import { StudentProfileComponent } from "./student-profile/student-profile.component";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NavbarModule } from "./navbar/navbar.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { NgxEchartsModule } from "ngx-echarts";
import { QRCodeModule } from "angular2-qrcode";

// antd

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
import { NzFormModule } from "ng-zorro-antd/form";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzMessageModule } from "ng-zorro-antd/message";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzStepsModule } from 'ng-zorro-antd/steps';
// Component

import { StudentCenterComponent } from "./student-center/student-center.component";
import { EditDocumentComponent } from "./edit-document/edit-document.component";
import { EditFileComponent } from "./edit-file/edit-file.component";
import { EditImageComponent } from "./edit-image/edit-image.component";
import { EditFileManagerComponent } from "./edit-filemanager/edit-filemanager.component";
import { TestComponent } from "./student-study/test/test.component";
import { AnswerComponent } from "./student-study/test/answer/answer.component";
import { ResultComponent } from "./student-study/test/result/result.component";
import { ScoreSearchComponent } from "./score-search/score-search.component";
import { ImportResultComponent } from "./import-result/import-result.component";
import { ImportStudentComponent } from "./import-student/import-student.component";
import { RecordDashboardComponent } from "./record-dashboard/record-dashboard.component";
import { CorrectsPapersComponent } from "./corrects-papers/corrects-papers.component";
import { SurveyComponent } from "./survey/survey.component";
import { PayManageComponent } from "./pay-manage/pay-manage.component";
import { AuditComponent } from "./audit/audit.component";
import { CommonPageModule } from "../common/common.module";
import { RecordDetailComponent } from "./record-detail/record-detail.component";
import { GradeCollectComponent } from "./grade-collect/grade-collect.component";
import { GradeDetailComponent } from "./grade-detail/grade-detail.component";
import { RoleComponent } from "./role/role.component";
import { StudentStudyComponent } from "./student-study/student-study.component";
// import { NavbarComponent } from './navbar/navbar.component';
// import { StudyNavComponent } from './student-study/study-nav/study-nav.component';
import { StudentStudyRoutingModule } from "./student-study/student-study-routing.module";
import { StudentLoginComponent } from "./student-login/student-login.component";
import { DashboardComponent } from "./dashboard/dashboard.component"; // 后台
import { HomeDashboardComponent } from "./home-dashboard/home-dashboard.component"; // 后台
import { ImportProfileComponent } from "./import-profile/import-profile.component"
import { ExamGradeComponent } from "./exam-grade/exam-grade.component"
// import { StudentStudyComponent } from '../student-study/student-study.component';
import { LiveManageComponent } from "./live-manage/live-manage.component"
import { LiveComponent } from "./live/live.component"
import { LiveRoomComponent } from "./live-room/live-room.component";
import { ApplyVerifyComponent } from './apply-verify/apply-verify.component';
import { HomeComponent } from './home/home.component';
import { ApplyPlanComponent } from './apply-plan/apply-plan.component'

export const routes: Routes = [
  { path: "", redirectTo: "student-center", pathMatch: "full" },
  {
    path: "student-center",
    component: StudentCenterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "student-profile",
    component: StudentProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: "student-login", component: StudentLoginComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    pathMatch: "full",
  },
  {
    path: "home-dashboard",
    component: HomeDashboardComponent,
    pathMatch: "full",
  },
  {
    path: "import-result",
    component: ImportResultComponent,
    pathMatch: "full",
  },
  {
    path: "import-student",
    component: ImportStudentComponent,
    pathMatch: "full",
  },
  {
    path: "score-search",
    component: ScoreSearchComponent,
    pathMatch: "full",
  },
  {
    path: "record-dashboard",
    component: RecordDashboardComponent,
    pathMatch: "full",
  },
  {
    path: "record-detail",
    component: RecordDetailComponent,
    pathMatch: "full",
  },
  {
    path: "corrects-papers",
    component: CorrectsPapersComponent,
    pathMatch: "full",
  },
  {
    path: "grade-collect",
    component: GradeCollectComponent,
    pathMatch: "full",
  },
  {
    path: "survey",
    component: SurveyComponent,
    pathMatch: "full",
  },
  {
    path: "grade-detail",
    component: GradeDetailComponent,
    pathMatch: "full",
  },
  {
    path: "exam-grade",
    component: ExamGradeComponent,
    pathMatch: "full",
  },{
    path:"live-manage",
    component:LiveManageComponent,
    pathMatch:"full"
  },
  {
    path: "student-study/:id",
    loadChildren: () =>
      import("./student-study/student-study-routing.module").then(
        (m) => m.StudentStudyRoutingModule
      ),
    canActivate: [AuthGuard],
  },
  { path: "student-test", component: TestComponent },
  { path: "role", component: RoleComponent },
  { path: "pay-manage", component: PayManageComponent },
  { path: "audit", component: AuditComponent },
  { path: "import-profile", component: ImportProfileComponent },
  { path: "live", component: LiveComponent },
  { path: "live-room", component: LiveRoomComponent },
  { path: "apply-verify", component: ApplyVerifyComponent },
  { path: "home", component: HomeComponent },
  { path: "apply-plan", component: ApplyPlanComponent },

];
@NgModule({
  declarations: [
    StudentCenterComponent,
    StudentProfileComponent,
    StudentLoginComponent,
    EditDocumentComponent,
    EditFileComponent,
    EditImageComponent,
    TestComponent,
    AnswerComponent,
    ResultComponent,
    HomeDashboardComponent,
    RecordDashboardComponent,
    ScoreSearchComponent,
    ImportResultComponent,
    ImportStudentComponent,
    RecordDetailComponent,
    CorrectsPapersComponent,
    SurveyComponent,
    GradeCollectComponent,
    GradeDetailComponent,
    RoleComponent,
    PayManageComponent,
    AuditComponent,
    EditFileManagerComponent,
    ImportProfileComponent,
    ExamGradeComponent,
    LiveManageComponent,
    LiveComponent,
    LiveRoomComponent,
    ApplyVerifyComponent,
    HomeComponent,
    ApplyPlanComponent
  ],
  imports: [
    // BrowserModule,
    RouterModule.forChild(routes),
    StudentStudyRoutingModule,
    DashboardModule,
    CommonModule,
    NzGridModule,
    NzDividerModule,
    NzMenuModule,
    NzTabsModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NavbarModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule,
    NzSpinModule,
    NgxEchartsModule,
    QRCodeModule,
    NzUploadModule,
    NzPopconfirmModule,
    NzAlertModule,
    NzGridModule,
    NzCollapseModule,
    NzTableModule,
    NzListModule,
    NzTabsModule,
    NzStatisticModule,
    NzCheckboxModule,
    NzRadioModule,
    NzIconModule,
    NzModalModule,
    NzButtonModule,
    NzDatePickerModule,
    NzDrawerModule,
    NzSpinModule,
    NzSelectModule,
    AgGridModule,
    NzDropDownModule,
    CommonPageModule,
    NzSwitchModule,
    NzProgressModule,
    NzLayoutModule,
    DragDropModule,
    NzNotificationModule,
    NzPageHeaderModule,
    NzTagModule,
    NzTimePickerModule,
    NzPipesModule,
    NzBreadCrumbModule,
    NzCascaderModule,
    NzInputNumberModule,
    NzCardModule,
    NzStepsModule
  ],
})
export class MasterolDoctorModule { }
