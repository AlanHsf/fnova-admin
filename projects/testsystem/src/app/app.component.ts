import * as Parse from "parse";
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'testsystem';
  config:any = {}
  constructor(){
    this.initServerConfig();
  }

  initServerConfig(){
     // 加载基础服务器配置
     let sURL = localStorage.getItem("PARSE_SERVERURL");
     let novaURL = localStorage.getItem("NOVA_SERVERURL");
     let appId = localStorage.getItem("PARSE_APPID");
     if (sURL) { this.config.serverURL = sURL }
     if (appId) { this.config.appId = appId }
     if (novaURL) { this.config.novaURL = novaURL }

     if (this.config && this.config.appId && this.config.appId != "") {
         // Parse.initialize(this.config.appId);
         (Parse as any).applicationId = this.config.appId;
         if (this.config.serverURL) {
             (Parse as any).serverURL = this.config.serverURL;
         }
         if (this.config && this.config.masterKey) {
             (Parse as any).masterKey = this.config.masterKey;
         }
     }
  }
}
