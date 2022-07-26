import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import NG_ZORRO from './services/ng-zorro';
import { StudentStudyRoutingModule } from './pages/student-study/student-study-routing.module'
// import {ComponentModule} from '../../../../src/modules/component/component.module'
// import {NavbarComponent} from './component/navbar/navbar.component'
import { CommonPageModule } from '../../../../src/modules/common/common.module'
import { StudentMessageComponent } from './pages/student-message/student-message.component';

import { StudentLoginComponent } from './pages/student-login/student-login.component';
import { StudentCenterComponent } from './pages/student-center/student-center.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';
import { StudentQuestionComponent } from './pages/student-question/student-question.component';
import { MessageDetailComponent } from './pages/student-message/message-detail/message-detail/message-detail.component'
import { ArticleDetailComponent } from './pages/student-center/article-detail/article-detail.component'
import { TestComponent } from './pages/student-study/test/test.component'
import { AnswerComponent } from './pages/student-study/test/answer/answer.component'
import { ResultComponent } from './pages/student-study/test/result/result.component'

const routes: Routes = [
	{
		path: "",
		redirectTo: "/self-study/student-login",
		pathMatch: "full"
	}
];
let ExamRoute = {
	path: 'self-study',
	data: {
		title: 'self-study',
		icon: "project",
		nzOpen: true,
	},
	children: [
		{
			path: "student-login",
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
			canActivate: [AuthGuard],
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
			path: "article-detail",
			component: ArticleDetailComponent,
			canActivate: [AuthGuard],
		},
		{
			path: "student-test",
			component: TestComponent,
			canActivate: [AuthGuard],
		},
		{
			path: "answer-test",
			component: AnswerComponent,
			canActivate: [AuthGuard],
		},
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
	path: 'self-study', loadChildren: () => import('./pages/student-study/student-study-routing.module').then(mod => mod.StudentStudyRoutingModule),
	data: {
		title: 'study',
		icon: "project",
		nzOpen: true,
	}
}

let CommonRoute = {
	path: 'common', loadChildren: () => import('../../../../src/modules/common/common.module').then(mod => mod.CommonPageModule),
	data: {
		title: 'common',
		icon: "project",
		nzOpen: true,
	}
}
routes.push(ExamRoute, studyRoute)

console.log(routes)
@NgModule({
	imports: [
		...NG_ZORRO,

		StudentStudyRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		CommonPageModule,
		RouterModule.forRoot(routes),
		// ComponentModule

	],
	declarations: [
		StudentLoginComponent,
		StudentCenterComponent,
		StudentProfileComponent,
		StudentQuestionComponent,
		StudentMessageComponent,
		TestComponent,
		AnswerComponent,
		MessageDetailComponent,
		ArticleDetailComponent,
		ResultComponent
	],
	exports: [RouterModule, CommonPageModule]
})
export class AppRoutingModule { }
