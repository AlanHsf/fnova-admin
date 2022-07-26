import * as Parse from "parse";
Parse.initialize("nova");
(Parse as any).serverURL = "https://server.fmode.cn/parse";

import { HttpClientModule,HttpHeaders } from "@angular/common/http";

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
