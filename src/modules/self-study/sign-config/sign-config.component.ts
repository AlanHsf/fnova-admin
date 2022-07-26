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
            "identyType": {
              "name": "专业类别",
              "sort": 1,
              "options": [
                "二学历",
                "衔接",
                "试点"
              ], "require": true, "isEnabled": true
            },
            "SchoolMajor": { "name": "报考专业", "sort": 2, "require": true, "isEnabled": true },
            "name": { "name": "姓名", "sort": 3, "require": true, "isEnabled": true },
            "sex": {
              "name": "学员性别",
              "sort": 4,
              "options": [
                "男",
                "女"
              ], "require": true, "isEnabled": true
            },
            "idcard": { "name": "身份证号", "sort": 5, "require": true, "isEnabled": true },
            "nation": { "name": "民族", "sort": 6, "require": true, "isEnabled": true },
            "nativePlace": { "name": "籍贯", "sort": 7, "require": true, "isEnabled": true },
            "state": {
              "name": "户籍",
              "sort": 8,
              "options": [
                "城镇",
                "农村"
              ], "require": true, "isEnabled": true
            },
            "polity": {
              "name": "政治面貌",
              "sort": 9,
              "options": [
                "党员",
                "团员",
                "其他"
              ], "require": true, "isEnabled": true
            },
            "education": {
              "name": "报考层次",
              "sort": 10,
              "options": [
                "专科",
                "本科"
              ], "require": true, "isEnabled": true
            },
            "positionPart": {
              "name": "前置学历",
              "sort": 11,
              "options": [
                "初中及初中以下",
                "高中(职高)",
                "中专(中校)",
                "大专(专科)",
                "本科",
                "本科以上"
              ], "require": true, "isEnabled": true
            },
            "position": {
              "name": "职业",
              "sort": 12,
              "options": [
                "学生",
                "事业单位负责人",
                "企业负责人",
                "待业、失业及无业人员",
                "经济业务人员",
                "教学人员",
                "文学艺术工作人员",
                "其他专业技术人员",
                "行政办公人员",
                "不便分类的其他从业人员",
                "其他办事人员和有关人员"
              ], "require": true, "isEnabled": true
            },
            "mobile": { "name": "联系方式", "sort": 13, "require": true, "isEnabled": true },
            "school": {
              "name": "报读院校", 
              "sort": 14, 
              "options": [
                "福州外语外贸学院",
                "福建师范大学",
                "华侨大学",
                "福州大学"
              ], "require": false, "isEnabled": true
            },
            "batch": {
              "name": "批次",
              "sort": 15,
              "options": [
                "202210",
              ], "require": true, "isEnabled": true
            },
            "classType": { "name": "班级", "sort": 16, "require": false, "isEnabled": true },
            "address": { "name": "身份证地址", "sort": 17, "require": false, "isEnabled": true },
            "email": { "name": "邮箱", "sort": 18, "require": false, "isEnabled": true }
          }
        })
        let res = await this.cmsConfing.save()
        console.log(res);
        this.fieldConf = res.get("cmsconfig")["fieldConf"]
        this.batchValue = this.fieldConf.batch.options[0]
      } else {
        this.fieldConf = this.cmsConfing.get("cmsconfig")["fieldConf"]
        this.batchValue = this.fieldConf.batch.options[0]
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
  batchValue;
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
    this.fieldConf.batch.options[0] = this.batchValue

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