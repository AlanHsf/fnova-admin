import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


import { AuthGuard } from './services/auth.guard';

import NG_ZORRO from './services/ng-zorro';

import { AnswerComponent } from './pages/answer/answer.component';
import { LoginComponent } from './pages/login/login.component';
import { RuleComponent } from './pages/rule/rule.component';
import { StartComponent } from './pages/start/start.component';
import { SkCountDownComponent } from './component/countdown/sk-countdown.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "/english/login",
    pathMatch: "full"
  }
];
let ExamRoute = {
  path: 'english',
  data: {
    title: 'englishTest',
    icon: "project",
    nzOpen: true,
  },
  children: [
    {
      path: "login",
      component: LoginComponent,
    },
    {
      path: "rule",
      component: RuleComponent,
      canActivate: [AuthGuard],
    },
    {
      path: "start",
      component: StartComponent,
      canActivate: [AuthGuard],
    },
    {
      path: "answer",
      component: AnswerComponent,
      canActivate: [AuthGuard],
    },
  ]
}
routes.push(ExamRoute)
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    FormsModule,
    CommonModule,
    ...NG_ZORRO
  ],
  declarations: [
    LoginComponent,
    StartComponent,
    AnswerComponent,
    RuleComponent,
    SkCountDownComponent
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
