import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CustomBaseService {
  department: string;
  departs: any[];
  company: string;
  pCompany: string;
  subCompany: string;
  companyInfo: any;
  departInfo: any;
  constructor() {}
  async init() {
    this.department = localStorage.getItem("department");
    this.company = localStorage.getItem("company");
    if (!this.department) {
      this.departs = await this.getDeparts();
      this.department = this.departs[0].id;
      this.subCompany = this.departs[0].get("subCompany");
    } else {
      this.pCompany = this.departs[0].get("company").id;
    }
    this.companyInfo = await this.getCompany();
  }
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
}
