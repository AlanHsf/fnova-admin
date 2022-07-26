
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import * as Parse from "parse";
@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
  id: String = ""
  isLoading: boolean = true;
  companyInfo: any = {};
  route: any;
  currentTime: Date;
  configSpace: String = "";
  wechat: String = "";
  superadmin: String = "";
  configQiniu: String = "";
  jpush: String = "";

  constructor(private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((params) => {
      this.id = params.get("id")
      console.log(this.id);
      this.getCompanys()
    })
  }
  async getCompanys() {
    let Company = new Parse.Query("Company");
    Company.equalTo('objectId', this.id);
    Company.include('superadmin')
    let company = await Company.first()
    if (company && company.id) {
      this.companyInfo = company.toJSON()
      this.isLoading = false
    }
  }
  async handleOk() {
    let company = new Parse.Query("Company");
    let companyid = await company.get(this.companyInfo.id)
    await companyid.save();
  }
}
