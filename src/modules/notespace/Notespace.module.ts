import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {DragDropModule} from '@angular/cdk/drag-drop';

import { CommonModule } from '@angular/common';
import { NotespaceComponent } from './Notespace.component';
import { NoteLoginComponent } from './note-login/note-login.component';
import { NoteEditComponent } from './note-edit/note-edit.component';
import { NoteCenterComponent } from './note-center/note-center.component';
import { NotePersonalComponent } from './note-personal/note-personal.component';
// import { EditImageComponent } from '../common/edit-image/edit-image.component';

import { RouterModule, Routes } from '@angular/router';

import {CommonPageModule} from '../common/common.module';


import { AuthGuard } from './auth.guard';

import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import {NzIconModule} from "ng-zorro-antd/icon";
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
export const routes: Routes = [
  
  {
    path: "note-login",
    component: NoteLoginComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: "note-personal",
    component : NotePersonalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "note-edit",
    component : NoteEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "note-center",
    component: NoteCenterComponent,
    canActivate: [AuthGuard]
  }
  ,{ path: "", redirectTo: "note-login",
  canActivate: [AuthGuard],
   pathMatch: "full" },

];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    //通用组件
    CommonPageModule,

    NzGridModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzMenuModule,
    NzTableModule,
    NzMessageModule,
    NzTabsModule,
    NzAvatarModule,
    NzSelectModule,
    NzCardModule,
    NzIconModule,
    NzPopoverModule,
    NzButtonModule,
    NzUploadModule,
  ],
  declarations: [NotespaceComponent,NoteLoginComponent,NoteCenterComponent,NoteEditComponent,NotePersonalComponent, ]// EditImageComponent
})
export class NotespaceModule { }
