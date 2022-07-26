import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";

@Component({
  selector: 'app-sign-config',
  templateUrl: './sign-config.component.html',
  styleUrls: ['./sign-config.component.scss']
})
export class SignConfigComponent implements OnInit {

  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService
  ) { }

  async ngOnInit() {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.company = localStorage.getItem("company");
      this.department = localStorage.getItem("department");
      console.log(this.department, this.company);

      if (!this.department) {
        this.departs = await this.getDeparts();
        this.department = this.departs[0].id;
        this.subCompany = this.departs[0].get("subCompany");
      }
      console.log(this.pCompany);
      console.log(this.compInfo);
      let queryR = new Parse.Query("Company");
      this.cmsConfing = await queryR.get(this.company);
      console.log(this.cmsConfing);
      if (!this.cmsConfing.get("cmsconfig") || this.cmsConfing.get("cmsconfig") == undefined) {
        this.cmsConfing.set("cmsconfig", {
          "fieldConf": {
            "batch": { "name": "学员批次", "sort": 1, "require": true, "isEnabled": true },
            "studentID": { "name": "学员学号", "sort": 2, "require": true, "isEnabled": true },
            "name": { "name": "学员姓名", "sort": 3, "require": true, "isEnabled": true },
            "sex": {
              "name": "学员性别",
              "sort": 4,
              "options": [
                "男",
                "女"
              ], "require": true, "isEnabled": true
            },
            "idcard": { "name": "身份证号", "sort": 5, "require": true, "isEnabled": true },
            "mobile": { "name": "手机号码", "sort": 6, "require": true, "isEnabled": true },
            "email": { "name": "电子邮箱", "sort": 7, "require": true, "isEnabled": true },
            "polity": { "name": "政治面貌", "sort": 8, "require": true, "isEnabled": true },
            "serviceLength": { "name": "服务年限", "sort": 9, "require": true, "isEnabled": true },
            "schoolMajor": { "name": "前置学位专业", "sort": 10, "require": true, "isEnabled": true },
            "education": {
              "name": "学历",
              "sort": 11,
              "options": [
                "不限",
                "初中",
                "高中",
                "专科",
                "本科",
                "硕士",
                "博士"
              ], "require": true, "isEnabled": true
            },
            "identyType": {
              "name": "身份类型",
              "sort": 12,
              "options": [
                "学员",
                "招生老师",
                "学习中心负责人"
              ], "require": true, "isEnabled": true
            },
            "studentType": {
              "name": "学员状态",
              "sort": 13,
              "options": [
                "已审核，待缴费入册",
                "已完成缴费入册",
                "在籍学员",
                "退学",
                "转学",
                "休学",
                "毕业"
              ], "require": true, "isEnabled": true
            },
            "department": { "name": "报考院校", "sort": 14, "require": true, "isEnabled": true },
            "center": { "name": "学习中心", "sort": 15, "require": true, "isEnabled": true },
            "SchoolMajor": { "name": "我的专业", "sort": 16, "require": true, "isEnabled": true },
            "schoolClass": { "name": "我的班级", "sort": 17, "require": true, "isEnabled": true }
          }
        })
        let res = await this.cmsConfing.save()
        console.log(res);
        this.fieldConf = res.get("cmsconfig")["fieldConf"]
      } else {
        this.fieldConf = this.cmsConfing.get("cmsconfig")["fieldConf"]
        console.log(this.fieldConf)
      }
      this.status = "";

      this.fieldKeys = Object.keys(this.fieldConf);
      console.log(this.fieldKeys)
      let that = this;
      // 对象key按照sort排序
      this.fieldKeys.sort(function (a, b) {
        return that.fieldConf[a]["sort"] - that.fieldConf[b]["sort"];
      });
    });

  }

  type: string; // 路由参数  school院校配置 recruit招生计划配置
  compInfo: any;
  fieldKeys: any = {};
  status: string = ""; // 是否处在编辑状态
  departInfo: any;
  department: string;
  departs: any;
  company: string;
  pCompany: string;
  subCompany: string;
  cmsConfing: any;
  recruit: any;
  recruitInfo: any;
  schema: any; // profile devSchema
  /* 编辑字段 */
  fullname: string;
  bgImg: string;
  compConfig: any;

  pageConf: any = {};
  fieldConf: any = {}
  // 页面弹窗提示内容
  msgConf: any = {};

  changeStatus(type) {
    this.status = type;
  }

  drop(event: CdkDragDrop<string[]>): void {
    console.log(event);
    moveItemInArray(this.fieldKeys, event.previousIndex, event.currentIndex);
    console.log(this.fieldKeys, this.fieldConf);
  }

  async cancelSave() {
    this.status = "";
  }

  async save() {
    let state;
    let config;
    this.fieldKeys.forEach((key, index) => {
      this.fieldConf[key].sort = index + 1;
    });
    config = this.cmsConfing.get("cmsconfig");
    config["fieldConf"] = this.fieldConf;

    this.cmsConfing.set("cmsconfig", config);
    console.log(config, this.cmsConfing);
    state = await this.saveRecruit();

    if (state) {
      this.status = "";
      this.message.success("保存成功");
    }
  }
  async saveRecruit() {
    let recruit = await this.cmsConfing.save();
    if (recruit && recruit.id) {
      console.log(recruit);
      return true;
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


}