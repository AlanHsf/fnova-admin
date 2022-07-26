import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
// antd

import { NzIconModule } from 'ng-zorro-antd/icon';
import { QRCodeModule } from "angular2-qrcode";

import { AppRoutingModule } from './app-routing.module';
// import {StudentStudyRoutingModule} from './pages/student-study/student-study-routing.module'
import { AppComponent } from './app.component';

// 组件

import * as Parse from "parse";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

Parse.initialize("nova");
(Parse as any).serverURL = "https://server.fmode.cn/parse";


export const routes: Routes = [
  {
    path: "student-study/:id",
    loadChildren: () =>
      import("./pages/student-study/student-study-routing.module").then(
        (m) => m.StudentStudyRoutingModule
      ),
    // canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NzIconModule,
    QRCodeModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
