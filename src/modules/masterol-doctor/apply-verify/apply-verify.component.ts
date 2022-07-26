import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";

@Component({
  selector: 'app-apply-verify',
  templateUrl: './apply-verify.component.html',
  styleUrls: ['./apply-verify.component.scss']
})
export class ApplyVerifyComponent implements OnInit {
  files:any;
  tableHead: Array<any> = [
    "报考院校",
    "姓名",
    "性别",
    "国家或地区",
    "证件号码",
    "移动电话",
    "通过审核",
    "操作"
  ];
  company: string = 'ddPAWeIInO';
  filterData: Array<any> = [];
  regData: Array<any> = [];
  inputValue: String;
  searchType: any = "school";
  pageSize: Number = 10;
  pageIndex: Number = 1;
  showEditFile: Boolean = false;
  overlyTableData: any;
  constructor(private http: HttpClient,private message: NzMessageService) { }

  ngOnInit() {
    this.getData();
  }

  async getData(type?) {
    let info = new Parse.Query("InfoCollection");
    info.equalTo("company", this.company);
    if (type) {
      info.equalTo("isVerify", type);
    }
    info.include("subCompany")
    let regData: any = await info.find();
    this.regData = regData.map((item) => {
      let data = item.toJSON();
      data.isVerify == 'success-audit' ? data.checked = true : data.checked = false;
      data.school = data.subCompany.name;
      return data
    });
    this.filterData = this.regData;
    console.log(this.regData, this.company);

    // wait-audit
    // success-audit
    //  pass-audit

  }

  /* 数据筛选 */
  async getFilterData(type: string) {
    this.inputValue = "";
    switch (type) {
      case "all":
        await this.getData();
        break;
      case "paidIn":
        await this.getData("success-audit");
        break;
      case "wait":
        await this.getData("wait-audit");
        break;
    }
  }
  searchTypeChange(e) {
    this.searchType = e;
  }

  searchStudent() {
    if (!this.inputValue) {
      this.getData()
      return;
    }
    this.filterData = []
    console.log(this.searchType, this.inputValue);
    if(this.searchType == 'school'){
      this.regData.map((item: any) => {
        if (item[this.searchType] && item[this.searchType].indexOf(this.inputValue) > -1) {
          this.filterData.push(item)
        }
      });
    }else {
      this.regData.map((item: any) => {
        if (item.info[this.searchType] && item.info[this.searchType].indexOf(this.inputValue) > -1) {
          this.filterData.push(item)
        }
      });
    }
    
    console.log(this.filterData);
  }

  async toggleSwitch(data) {
    let InfoCollection = new Parse.Query('InfoCollection');
    InfoCollection.equalTo("objectId", data.objectId);
    let info = await InfoCollection.first();
    if (info && info.id) {
      if (data.checked == true) {
        info.set('isVerify', 'pass-audit')
        data.checked = false;

      } else {
        data.checked = true;
        info.set('isVerify', 'success-audit')
      }
      info.save().then(res => console.log(res)
      )
    }

  }

  showModal(data) {
    this.overlyTableData = data;
    console.log(this.overlyTableData)
    this.showEditFile = true;
  }
  handleCancel() {
    this.showEditFile = false;
  }
 
 
}
