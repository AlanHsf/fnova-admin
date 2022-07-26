import * as Parse from "parse";
Parse.initialize("nova");
(Parse as any).serverURL = "https://test.fmode.cn/parse";

// Parse.initialize("pipixia");
// (Parse as any).serverURL = "https://server.ncppx.com/parse";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HttpHeaders } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData, CommonModule, DatePipe } from "@angular/common";
import { AgGridModule } from "ag-grid-angular";
import { Routes } from '@angular/router'
// Component Module

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { QRCodeModule } from 'angular2-qrcode';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { NZ_I18N, zh_CN } from "ng-zorro-antd/i18n";
import zh from "@angular/common/locales/zh";

import { SettingsComponent } from '../modules/system/settings/settings.component';

// import { MaterialModule } from './app-material.module';

// Diy Shared Module
// import { ChamberSharedModule } from 'src/common/chamber-shared/chamber-shared.module';

// 组件
registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent, SettingsComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    // ApolloModule,
    // HttpLinkModule,
    // Components Module
    NzLayoutModule,
    NzPageHeaderModule,
    NzMenuModule,
    NzButtonModule,
    NzMessageModule,
    NzIconModule,
    NzSelectModule,
    NzModalModule,
    NzTagModule,
    QRCodeModule,
    AgGridModule.withComponents([]),
    RouterModule.forChild([
      {
        path: "setting",
        component: SettingsComponent,
        pathMatch: "full"
      }
    ])

  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  // , DatePipe,
  // https://server.fmode.cn/api/novaql
  //   {
  //   provide: APOLLO_OPTIONS,
  //   useFactory: (httpLink: HttpLink) => {
  //     return {
  //       cache: new InMemoryCache(),
  //       link: httpLink.create({
  //         headers:new HttpHeaders({
  //           // 'Access-Control-Allow-Origin': '*' ,
  //           // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
  //           // 'Access-Control-Allow-Headers': 'X-Parse-Master-Key, X-Parse-REST-API-Key, X-Parse-Javascript-Key, X-Parse-Application-Id, X-Parse-Client-Version, X-Parse-Session-Token, X-Requested-With, X-Parse-Revocable-Session, X-Parse-Request-Id, Content-Type, Pragma, Cache-Control, Access-Control-Allow-Methods'
  //         }),
  //         uri: 'https://server.fmode.cn/pgraph/graphql',
  //         withCredentials: false,
  //       }),
  //     };
  //   },
  //   deps: [HttpLink],
  // }
  bootstrap: [AppComponent]
})
export class AppModule { }
