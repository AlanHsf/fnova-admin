import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from "@angular/common/http";

import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy }, // PathLocationStrategy为路径模式 HashLocationStrategy为#号模式
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
