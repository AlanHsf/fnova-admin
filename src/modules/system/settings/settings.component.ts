import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse'



@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  constructor() { }
  
  company: ParseObject;
  wxsdk: any = {
      appId:null,
      mchId:null,
      mchKey:null,
      returnUrl:null,
      company:null,
  }
  configQiniu: any = {
    
  }

  async ngOnInit() {
    let company = localStorage.getItem("company");
    let query = new Parse.Query("Company")
    this.company = await query.get(company);

    this.configQiniu = this.company.get("configQiniu")
    this.wxsdk = this.company.get("wxsdk")
  }
  save() {
    console.log(this.company)
    this.company.set("configQiniu", this.configQiniu);
    this.company.set("wxsdk", this.wxsdk);
    console.log(this.wxsdk);
    console.log(this.company)
    this.company.save().then(res => {
      console.log(res)
      this.company = res
    })
  }
}
