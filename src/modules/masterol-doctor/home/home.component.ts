import { Component, OnInit } from '@angular/core';
import * as Parse from "parse";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }
  company: string = 'ddPAWeIInO';
  plans: Array<any> = [];
  info: Array<any> = [];

  ngOnInit(): void {
    this.getData();
  }
  async getData(type?) {
    let plan = new Parse.Query("RecruitStudent");
    plan.equalTo("company", this.company);
    // info.include("department")
    this.plans = await plan.find();
    let info = new Parse.Query("InfoCollection");
    info.equalTo("company", this.company);
    // info.include("department")
    this.info = await info.find();
    // wait-audit
    // success-audit
    //  pass-audit

  }

}
