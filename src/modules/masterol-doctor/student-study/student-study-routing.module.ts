import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { DetailComponent } from './detail/detail.component';
// import { TestComponent } from './test/test.component';
import { StudentStudyComponent } from './student-study.component';
import { StudyNavComponent } from './study-nav/study-nav.component';
import { CatComponent } from './detail/cat/cat.component';
import { OutlineComponent } from './detail/outline/outline.component';
import { StageComponent } from './detail/stage/stage.component';
import { SynthesizeComponent } from './detail/synthesize/synthesize.component';
import { TeacherComponent } from './detail/teacher/teacher.component';
// import { AnswerComponent } from './test/answer/answer.component';
// import { ResultComponent } from './test/result/result.component';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {NavbarModule} from '../navbar/navbar.module'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { QRCodeModule } from 'angular2-qrcode';
import { NzSpinModule } from 'ng-zorro-antd/spin';
// import { EditQRCodeComponent } from 'src/modules/common/edit-qrcode/edit-qrcode.component';
// import { NavbarComponent } from '../navbar/navbar.component';
export const routes: Routes = [
  {
    path: 'student-study', component: StudentStudyComponent, children: [
      {
        path: 'detail',
        component: DetailComponent
      },
      // {
      //   // path: 'test/:id',
      //   path: 'test',
      //   component: TestComponent,
      // },
      {
        path: '',
        redirectTo: 'detail',
        pathMatch: 'full'
      },
      {
        path: '**',
        component: DetailComponent
      }

    ]
  }

]


@NgModule({
  declarations: [
    StudentStudyComponent, DetailComponent,
    StudyNavComponent, CatComponent, OutlineComponent, StageComponent, SynthesizeComponent, TeacherComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,FormsModule,
    NavbarModule,QRCodeModule,
    NzGridModule, NzProgressModule, NzMenuModule, NzCollapseModule,NzTableModule,NzListModule,NzTabsModule,NzStatisticModule,NzCheckboxModule,NzRadioModule,NzIconModule,NzModalModule,NzButtonModule,NzDatePickerModule,NzDrawerModule,NzSpinModule
  ],
  exports: [RouterModule]
})
export class StudentStudyRoutingModule { }
