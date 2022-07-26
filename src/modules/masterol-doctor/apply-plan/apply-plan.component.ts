import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";

@Component({
  selector: 'app-apply-plan',
  templateUrl: './apply-plan.component.html',
  styleUrls: ['./apply-plan.component.scss']
})
export class ApplyPlanComponent implements OnInit {

  tableHead: Array<any> = [
    "招生标题",
    "招生人数",
    "招生院校",
    "是否开启",
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
  constructor(private http: HttpClient, private message: NzMessageService) { }

  ngOnInit() {
    this.getData();
    this.getDepartments()
  }

  async getData(type?) {
    let info = new Parse.Query("RecruitStudent");
    info.equalTo("company", this.company);
    info.include("department")
    let regData: any = await info.find();
    this.regData = regData.map((item) => {
      let data = item.toJSON();
      data.isOpen == true ? data.checked = true : data.checked = false;
      if (data.department) {
        data.school = data.department.name;
      }
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
    this.regData.map((item: any) => {
      if (item[this.searchType] && item[this.searchType].indexOf(this.inputValue) > -1) {
        this.filterData.push(item)
      }
    });
    console.log(this.filterData);
  }

  async toggleSwitch(data) {
    let InfoCollection = new Parse.Query('RecruitStudent');
    InfoCollection.equalTo("objectId", data.objectId);
    let info = await InfoCollection.first();
    if (info && info.id) {
      info.set('isOpen', !data.checked)
      data.checked = !data.checked;
      info.save().then(res => console.log(res)
      )
    }

  }
  modalType: any;
  modalData: any;
  action(type, data?) {
    console.log(type);
    
    this.modalType = type;
    data ? this.modalData = data : this.modalData = { count: 0, title: '',  checked: false }
    this.showEditFile = true;
  }

  departments: any;
  departmentId: any;
  async getDepartments() {
    this.departments = []
    let Departments = new Parse.Query("Department");
    Departments.equalTo("company", this.company);
    this.departments = await Departments.find();
    this.departmentId = this.departments[0].id
  }
  chooseDepartment(id) {
    console.log(id);
    this.departmentId = id;

    // this.department = id
  }
  changeMdata() {
    this.modalData.checked = !this.modalData.checked;
    console.log(this.modalData.checked);

  }
  handleCancel() {
    this.showEditFile = false;
  }
  async handleOk(id) {
    console.log(this.modalData);
    let Plan;
    let plan;
    switch (this.modalType) {
      case "edit":
        Plan = new Parse.Query('RecruitStudent');
        Plan.equalTo("objectId", id);
        plan = await Plan.first();
        if (plan && plan.id) {
          plan.set('title', this.modalData.title)
          plan.set('count', this.modalData.count)
          plan.set('department', {
            __type: "Pointer",
            className: "Department",
            "objectId": this.departmentId
          })
          plan.set('isOpen', this.modalData.checked)
          plan.save().then(res => {
            this.showEditFile = false;
            this.message.success('修改成功');
            this.getData()
            // this.cdRef.detectChanges();
          });
        }
        break;
      case "delete":
        Plan = new Parse.Query('RecruitStudent');
        Plan.equalTo("objectId", id);
        plan = await Plan.first();
        if (plan && plan.id) {
          plan.destroy().then(res => {
            this.showEditFile = false;
            this.message.success('删除成功');
            this.getData()
            // this.cdRef.detectChanges();
          });
        }
        break;
      case "add":
        Plan = Parse.Object.extend('RecruitStudent');
        plan = new Plan();
        plan.set('title', this.modalData.title)
        plan.set('count', this.modalData.count)
        plan.set('department', {
          __type: "Pointer",
          className: "Department",
          "objectId": this.departmentId
        })
        plan.set('isOpen', this.modalData.checked)
        plan.set('company',
          {__type: "Pointer", className: "Company", objectId: this.company}
        )
        plan.save().then(res => {
          this.showEditFile = false;
          this.message.success('添加成功');
          this.getData()
          // this.cdRef.detectChanges();
        });
        break;
    }



  }
}
