import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzButtonModule } from "ng-zorro-antd/button";



import { ComponentComponent } from './component.component';
import { EditDocumentComponent } from '../masterol/edit-document/edit-document.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzButtonModule
  ],
  declarations: [ComponentComponent, EditDocumentComponent],
  exports: [
    EditDocumentComponent,ComponentComponent
  ]
})
export class ComponentModule { }
