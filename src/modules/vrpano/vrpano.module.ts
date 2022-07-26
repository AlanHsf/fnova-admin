import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { LoginComponent } from './login/login.component';
import { EditorComponent } from './editor/editor.component';
import { PreviewComponent } from './preview/preview.component';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'preview', component: PreviewComponent,
  },
  {
    path: 'editor', component: EditorComponent,
  }

]

@NgModule({
  declarations: [
    LoginComponent,
    EditorComponent,
    PreviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NzInputModule,NzButtonModule,NzIconModule
  ]
})
export class VrpanoModule { }
