import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NgxEchartsModule } from "ngx-echarts";
import { CommonPageModule } from "../common/common.module";
// import { CommonPageModule } from '../../../projects/common/src/public-api';

import { AgGridModule } from "ag-grid-angular";
import { DragDropModule } from "@angular/cdk/drag-drop";
/* antd */
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
import { NzStepsModule } from "ng-zorro-antd/steps";
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
// Editor Components
import { EditorModule } from "@tinymce/tinymce-angular";
import { PipesModule } from "../../pipes/pipes.module";
//自定义组件
import { LoginComponent } from "./exam/login/login.component";
import { ExaminationComponent } from "./examination/examination.component";
import { StartComponent } from "./exam/start/start.component";
import { TestComponent } from "./test/test.component";
import { AnswerComponent } from "./exam/answer/answer.component";
import { ResultComponent } from "./test/result/result.component";
import { HomeComponent } from "./home/home.component";
import { CorrectComponent } from "./correct-list/correct/correct.component";
import { CorrectListComponent } from "./correct-list/correct-list.component";
import { RuleComponent } from "./exam/rule/rule.component";
import { AuthGuard } from "./auth.guard";
import { StudentManageComponent } from "./student-manage/student-manage.component";
import { GradeAnalyComponent } from "./grade/grade-analy/grade-analy.component";
import { SurveyLogsComponent } from "./correct-list/surveylogs/surveylogs.component";
import { RecruitListComponent } from "./recruit-list/recruit-list.component";
import { CheckStudentComponent } from "./check-student/check-student.component";
import { PayRecordComponent } from "./pay-record/pay-record.component";
import { AgGridComponent } from "./ag-grid/ag-grid.component";
import { ImportAPIGCacheComponent } from "./import/import-APIGCache/import-APIGCache.component";
import { CateProfileComponent } from "./cate-profile/cate-profile.component";
import { SchoolClassComponent } from "./school-class/school-class.component";
import { PrintClassComponent } from "./print-class/print-class.component";
import { StudentPayComponent } from "./recruit-list/student-pay/student-pay.component";
import { ACompleteDataComponent } from "./a-complete-data/a-complete-data.component";
import { GiveMarkerComponent } from "./correct-list/give-marker/give-marker.component";
import { RepeatCheckComponent } from "./a-complete-data/repeat-check/repeat-check.component";
import { ApplyConfigComponent } from "./apply-config/apply-config.component";
import { CreatExamComponent } from "./exam/creat-exam/creat-exam.component";
import { StepComponent } from "./exam/steps/step/step.component";
import { StepsComponent } from "./exam/steps/steps.component";
import { QuestionManageComponent } from "./topics/question-manage/question-manage.component";
import { ImportQuestionBankComponent } from "./topics/import-question-bank/import-question-bank.component";
import { BulkImportComponent } from "./topics/import-question-bank/bulk-import/bulk-import.component";
import { ManualImportComponent } from "./topics/import-question-bank/manual-import/manual-import.component";
import { SelectTopicComponent } from "./topics/import-question-bank/manual-import/select-topic/select-topic.component";
import { GroupTopicComponent } from "./topics/import-question-bank/manual-import/group-topic/group-topic.component";
import { TextTopicComponent } from "./topics/import-question-bank/manual-import/text-topic/text-topic.component";
import { GradeListComponent } from "./grade/grade-list/grade-list.component";
import { SurveylogDetailComponent } from "./grade/surveylog-detail/surveylog-detail.component";
import { PrintSurveylogComponent } from "./grade/surveylog-detail/print-surveylog/print-surveylog.component";
import { GradePasscertComponent } from './grade/grade-passcert/grade-passcert.component';
import { BatchExcelImportComponent } from './batch-excel-import/batch-excel-import.component';
import { ImportStudentComponent } from "./import/import-student/import-student.component";
import { ImportDepartAreaComponent } from "./import/import-depart-area/import-depart-area.component";
import { ImportExamRoomComponent } from "./import/import-exam-room/import-exam-room.component";
import { ImportGradeComponent } from "./import/import-grade/import-grade.component";
import { ImportTeacherComponent } from "./import/import-teacher/import-teacher.component";
import { ImportMajorComponent } from "./import/import-major/import-major.component";
import { ExamcardTplComponent } from './examcard-tpl/examcard-tpl.component';
import { RefundLogComponent } from './refund-log/refund-log.component';
import { EngcardTplComponent } from "./examcard-tpl/cardtpl/cardtpl.component";
import { SkCountDownComponent } from './component/countdown/sk-countdown.component';
import { ImportCategoryComponent } from './import/import-category/import-category.component';
import { HtmlPipe } from "src/pipes/html.pipe";
import { QRCodeModule } from "angular2-qrcode";
import { ImportBasicProfileComponent } from './import/import-basic-profile/import-basic-profile.component';
import { RecordListComponent } from './pay-record/record-list/record-list.component';
import { CheckStudentListComponent } from './check-student/check-student-list/check-student-list.component';
import { ImportSchoolComponent } from './import/import-school/import-school.component';
import { ImportSchoolMajorComponent } from './import/import-school-major/import-school-major.component';
import { LessonOrderComponent } from './lesson-order/lesson-order.component';
import { QuestionImportComponent } from './question-import/question-import.component';

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  //登陆考试
  {
    path: "login",
    component: LoginComponent,
  },
  // 开始考试界面
  {
    path: "start",
    component: StartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "examination",
    component: ExaminationComponent,
  },
  {
    path: "import-apig",
    component: ImportAPIGCacheComponent,
  },
  {
    path: "test",
    component: TestComponent,
  },
  {
    path: "answer",
    component: AnswerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "result",
    component: ResultComponent,
  },
  {
    path: "import-student",
    component: ImportStudentComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "correct",
    component: CorrectComponent,
  },
  {
    path: "correct-list",
    component: CorrectListComponent,
  },
  {
    path: "surveylogs",
    component: SurveyLogsComponent,
  },
  {
    path: "give-marker",
    component: GiveMarkerComponent,
  },
  {
    path: "rule",
    component: RuleComponent,
  },
  {
    path: "import-exam-room",
    component: ImportExamRoomComponent,
  },
  {
    path: "student-manage",
    component: StudentManageComponent,
  },
  {
    path: "import-question-bank",
    component: ImportQuestionBankComponent,
  },
  {
    path: "manual-import-topic",
    component: ManualImportComponent,
  },
  {
    path: "grade-analy",
    component: GradeAnalyComponent,
  },
  {
    path: "import-teacher",
    component: ImportTeacherComponent,
  },
  {
    path: "question-manage",
    component: QuestionManageComponent,
  },
  {
    path: "import-grade",
    component: ImportGradeComponent,
  },
  {
    path: "pay-recruit",
    component: RecruitListComponent,
  },
  {
    path: "check-student",
    component: CheckStudentComponent,
  },
  {
    path: "check-student-list",
    component: CheckStudentListComponent,
  },
  {
    path: "pay-record",
    component: PayRecordComponent,
  },
  {
    path: "record-list",
    component: RecordListComponent,
  },
  {
    path: "cate-profile",
    component: CateProfileComponent,
  },
  {
    path: "school-class",
    component: SchoolClassComponent,
  },
  {
    path: "print-class",
    component: PrintClassComponent,
  },
  {
    path: "student-pay",
    component: StudentPayComponent,
  },
  {
    path: "complete-data",
    component: ACompleteDataComponent,
  },
  {
    path: "grade-list",
    component: GradeListComponent,
  },
  {
    path: "apply-config",
    component: ApplyConfigComponent,
  },
  {
    path: "surveylog-detail",
    component: SurveylogDetailComponent,
  },
  {
    path: "print-surveylog",
    component: PrintSurveylogComponent,
  },
  {
    path: "creat-exam",
    component: CreatExamComponent,
  },
  {
    path: "grade-passcert",
    component: GradePasscertComponent,
  },
  {
    path: "batch-excel-import",
    component: BatchExcelImportComponent,
  },
  {
    path: "import-depart-area",
    component: ImportDepartAreaComponent,
  },
  {
    path: "import-major",
    component: ImportMajorComponent,
  },
  {
    path: "import-basic-profile",
    component: ImportBasicProfileComponent,
  },
  {
    path: "examcard-tpl",
    component: ExamcardTplComponent,
  },
  {
    path: "refund-log",
    component: RefundLogComponent,
  },
  {
    path: "import-category",
    component: ImportCategoryComponent,
  },
  {
    path: "import-school",
    component: ImportSchoolComponent,
  },
  {
    path: "import-school-major",
    component: ImportSchoolMajorComponent,
  },
  {
    path: "lesson-order",
    component: LessonOrderComponent,
  },
  {
    path: "question-import",
    component: QuestionImportComponent
  }

];

// english-test
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzModalModule,
    FormsModule,
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
    NzMessageModule,
    NzSelectModule,
    NzSwitchModule,
    NzProgressModule,
    NzCheckboxModule,
    NzRadioModule,
    NzDatePickerModule,
    NzDrawerModule,
    NzDropDownModule,
    NzCardModule,
    AgGridModule,
    NzSpinModule,
    NgxEchartsModule,
    NzPaginationModule,
    NzStepsModule,
    CommonPageModule,
    EditorModule,
    DragDropModule,
    NzToolTipModule,
    QRCodeModule,
    NzModalModule,
    PipesModule
  ],
  declarations: [
    LoginComponent,
    ExaminationComponent,
    StartComponent,
    TestComponent,
    AnswerComponent,
    ResultComponent,
    ImportStudentComponent,
    HomeComponent,
    CorrectComponent,
    CorrectListComponent,
    RuleComponent,
    ImportExamRoomComponent,
    StudentManageComponent,
    ImportQuestionBankComponent,
    GradeAnalyComponent,
    ImportTeacherComponent,
    SurveyLogsComponent,
    QuestionManageComponent,
    ImportGradeComponent,
    BulkImportComponent,
    ManualImportComponent,
    SelectTopicComponent,
    GroupTopicComponent,
    RecruitListComponent,
    CheckStudentComponent,
    PayRecordComponent,
    AgGridComponent,
    ImportAPIGCacheComponent,
    CateProfileComponent,
    SchoolClassComponent,
    PrintClassComponent,
    StudentPayComponent,
    ACompleteDataComponent,
    GiveMarkerComponent,
    GradeListComponent,
    RepeatCheckComponent,
    TextTopicComponent,
    ApplyConfigComponent,
    SurveylogDetailComponent,
    PrintSurveylogComponent,
    CreatExamComponent,
    StepComponent,
    StepsComponent,
    GradePasscertComponent,
    BatchExcelImportComponent,
    ImportDepartAreaComponent,
    ImportMajorComponent,
    ExamcardTplComponent,
    EngcardTplComponent,
    RefundLogComponent,
    SkCountDownComponent,
    ImportCategoryComponent,
    ExamcardTplComponent,
    ImportBasicProfileComponent,
    HtmlPipe,
    RecordListComponent,
    CheckStudentListComponent,
    ImportSchoolComponent,
    ImportSchoolMajorComponent,
    LessonOrderComponent,
    QuestionImportComponent
  ],
})
export class EnglishTestModule { }
