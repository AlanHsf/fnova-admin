import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import NG_ZORRO from './service/ng-zorro';
import { MemberListComponent } from './member-list/member-list.component';
import { ApplicationComponent } from './member-list/application/application.component';
import { PipesModule } from "../../pipes/pipes.module";
import { Objkeyarr } from './pipes/objkeyarr';
import { CommonPageModule } from '../common/common.module';
import { EditTestComponent } from './member-list/edit-test/edit-test.component';
import { EditTestFieldsComponent } from './member-list/edit-test/edit-test-fields/edit-test-fields.component';

export const routes: Routes = [
  {
    path: "merber-list",
    component: MemberListComponent,
    pathMatch: "full",
  }
];

@NgModule({
  declarations: [MemberListComponent, ApplicationComponent, EditTestComponent, EditTestFieldsComponent, Objkeyarr],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    [...NG_ZORRO],
    PipesModule,
    CommonPageModule,
    RouterModule.forChild(routes),

  ]
})
export class NCNQXModule { }
