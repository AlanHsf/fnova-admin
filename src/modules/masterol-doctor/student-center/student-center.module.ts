import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { RouterModule, Routes } from '@angular/router';
import { StudentStudyComponent } from '../student-study/student-study.component';
import { FormsModule } from '@angular/forms';
// import { EditImageComponent } from "../edit-image/edit-image.component";
// import { StudentCenterRoutingModule } from './student-center-routing/student-center-routing.module';

export const routes: Routes = [
  // { path: '', redirectTo: 'student-study', pathMatch: 'full' },
  { path: 'student-study', component: StudentStudyComponent, pathMatch: 'full' },   
]
@NgModule({
  declarations: [StudentStudyComponent, ],// EditImageComponent
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    CommonModule,
    // StudentCenterRoutingModule,
    NzGridModule,
    NzDividerModule,
    NzMenuModule,
    NzTabsModule,
    NzLayoutModule
  ],
  exports: []// EditImageComponent
})
export class StudentCenterModule {}
