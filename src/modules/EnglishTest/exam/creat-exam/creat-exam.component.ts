import { Component, OnInit } from "@angular/core";
import { NzTabsCanDeactivateFn } from "ng-zorro-antd/tabs";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";

@Component({
  selector: "app-creat-exam",
  templateUrl: "./creat-exam.component.html",
  styleUrls: ["./creat-exam.component.scss"],
})
export class CreatExamComponent implements OnInit {
  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService
  ) {}
  tabIndex: number = 0;
  department: string;
  departs: any;
  company: string;
  pCompany: string;
  subCompany: string;
  compInfo: any;
  departInfo: any;
  surveyId: any;
  survey: any;
  surveys: any;
  step: number = 0;
  /*  canDeactivate 控制 tab 切换。 */
  canDeactivate: NzTabsCanDeactivateFn = (
    fromIndex: number,
    toIndex: number
  ) => {
    console.log(fromIndex, toIndex);
    switch (fromIndex) {
      case 0:
        console.log(this.tabIndex);
        if (this.tabIndex == 1) {
          return toIndex === 1;
        }
        return false;
      case 1:
        return Promise.resolve(toIndex === 0);
      case 2:
        // return this.confirm();
        return false;
      default:
        return true;
    }
  };
  tabChange(e) {
    // this.tabIndex = e;
    console.log(e);
  }
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.company = localStorage.getItem("company");
      this.department = localStorage.getItem("department");
      console.log(this.department, this.company);
      if (!this.department) {
        this.departs = await this.getDeparts();
        // this.department = this.departs[0].id;
        // this.subCompany = this.departs[0].get("subCompany");
        // this.compInfo = await this.getCompany();
      } else {
        this.compInfo = await this.getCompany();
        this.pCompany = this.compInfo.get("company").id;
      }
      console.log(this.pCompany);
      console.log(this.compInfo);
      // await this.getDepartment();
    });
  }
  confirm() {}
  async getCompany() {
    let queryC = new Parse.Query("Company");
    queryC.get(this.subCompany || this.company);
    let comp = await queryC.first();
    if (comp && comp.id) {
      return comp;
    }
  }
  async getDeparts() {
    let queryD = new Parse.Query("Department");
    queryD.equalTo("company", this.company);
    let res = await queryD.find();
    if (res && res.length) {
      return res;
    }
  }
  async getDepartment() {
    let queryD = new Parse.Query("Department");
    queryD.get(this.department);
    let res = await queryD.first();
    if (res && res.id) {
      console.log(res);
      this.departInfo = res;
    }
  }
  async getSurveys() {
    let queryS = new Parse.Query("Survey");
    queryS.equalTo("department", this.department);
    let res = await queryS.find();
    if (res && res.length) {
      this.surveys = res;
    }
  }

  async changeSchool(e) {
    this.department = e;
    let index = this.departs.findIndex((item) => item.id == e);
    this.subCompany = this.departs[index].get("subCompany");
    this.compInfo = await this.getCompany();
    this.getDepartment();
    this.getSurveys();
  }
  async changeSurvey(e) {
    this.surveyId = e;
    let index = this.surveys.findIndex((item) => item.id == e);
    this.survey = this.surveys[index];
  }

  toStep(index) {
    this.step = index;
    this.tabIndex = 1;
  }
}
