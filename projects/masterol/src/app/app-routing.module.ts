import { CommonModule } from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import NG_ZORRO from './services/ng-zorro';
import {StudentStudyRoutingModule} from './pages/student-study/student-study-routing.module'

// import {NavbarComponent} from './component/navbar/navbar.component'

import { StudentLoginComponent } from './pages/student-login/student-login.component';
import { StudentCenterComponent } from './pages/student-center/student-center.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';
import { StudentQuestionComponent } from './pages/student-question/student-question.component';
import { StudentMessageComponent } from './pages/student-message/student-message.component';
import { MessageDetailComponent } from './pages/student-message/message-detail/message-detail/message-detail.component'
import { PrintCertificateComponent } from './pages/student-center/print-certificate/print-certificate.component'

const routes: Routes = [
  {
    path: "",
    redirectTo: "/masterol/student-login",
    pathMatch: "full"
  }
];
let ExamRoute = {
  path: 'masterol',
  data: {
    title: 'masterol',
    icon: "project",
    nzOpen: true,
  },
  children: [
    {
      path: "student-login",
      component: StudentLoginComponent,
    },
    {
      path: "student-login-xbsfdx",
      component: StudentLoginComponent,
    },
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
    {
      path: "student-question",
      component: StudentQuestionComponent,
    },
    {
      path: "student-message",
      component: StudentMessageComponent,
      canActivate: [AuthGuard],
      
    },
    {
      path: "message-detail",
      component: MessageDetailComponent,
      canActivate: [AuthGuard],
    },
    {
      path: "print-certificate",
      component: PrintCertificateComponent,
      canActivate: [AuthGuard],
    }
    // ,{
    //     path: "student-study/:id",
    //     loadChildren: () =>
    //       import("./pages/student-study/student-study-routing.module").then(
    //         (m) => m.StudentStudyRoutingModule
    //       ),
    //     canActivate: [AuthGuard],
    // }
  ]
}
let studyRoute = {
  path: 'masterol', loadChildren: () => import('./pages/student-study/student-study-routing.module').then(mod => mod.StudentStudyRoutingModule),
  data: {
    title: 'study',
    icon: "project",
    nzOpen: true,
  }
}
routes.push(studyRoute, ExamRoute)

console.log(routes)
@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    ...NG_ZORRO,
    RouterModule.forRoot(routes),
    StudentStudyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  declarations: [
    StudentLoginComponent,
    StudentCenterComponent,
    StudentProfileComponent,
    StudentQuestionComponent,
    StudentMessageComponent,
    MessageDetailComponent,
    PrintCertificateComponent
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
