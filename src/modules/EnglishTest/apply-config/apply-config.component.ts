import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";

@Component({
  selector: "app-apply-config",
  templateUrl: "./apply-config.component.html",
  styleUrls: ["./apply-config.component.scss"],
})
export class ApplyConfigComponent implements OnInit {
  currentTab: number = 0;
  async onTabChange(e) {
    console.log(e);
    this.status = "";
    this.compInfo = await this.getCompany();
    await this.getDepartment();
    await this.getRecruitStudent();
    // this.currentTab = e.index;
  }
  type: string; // 路由参数  school院校配置 recruit招生计划配置
  department: string;
  departs: any;
  company: string;
  pCompany: string;
  subCompany: string;
  compInfo: any;
  departInfo: any;
  recruits: any;
  recruit: any;
  recruitInfo: any;
  status: string = ""; // 是否处在编辑状态
  schema: any; // profile devSchema
  /* 编辑字段 */
  fullname: string;
  bgImg: string;
  compConfig: any;
  gradeSpec: any = {
    singleScore: false,
    textScore: false,
    totalScore: false,
  }; // 是否显示具体得分 singleScore  textScore  totalScore
  // 页面配置 标题、按钮显示
  pageConf: any = {};
  // 字段配置  报名字段、考生信息字段配置
  fieldConf: any = {
    name: { name: "姓名", sort: 1, require: true, isEnabled: true },
    sex: {
      name: "性别",
      sort: 2,
      options: ["男", "女"],
      require: true,
      isEnabled: true,
    },
    polity: {
      name: "政治面貌",
      sort: 3,
      options: ["中共党员", "共青团员", "群众", "民主党派成员"],
      require: true,
      isEnabled: true,
    },
    nation: { name: "民族", sort: 4, require: true, isEnabled: true },
    cardtype: {
      name: "证件类型",
      sort: 5,
      options: ["中华人民共和国身份证"],
      require: true,
      isEnabled: true,
    },
    email: { name: "电子邮箱", sort: 6, require: true, isEnabled: false },
    idcard: { name: "证件号码", sort: 7, require: true, isEnabled: true },
    area: { name: "省市区", sort: 8, require: true, isEnabled: true },
    school: { name: "毕业院校", sort: 9, require: true, isEnabled: false },
    address: { name: "通讯地址", sort: 10, require: true, isEnabled: true },
    SchoolMajor: { name: "所属专业", sort: 11, require: true, isEnabled: true },
    postcode: { name: "邮政编码", sort: 12, require: true, isEnabled: false },
    mobile: { name: "联系电话", sort: 13, require: true, isEnabled: true },
    eduType: { name: "层次", sort: 14, require: true, isEnabled: false },
    education: { name: "学制", sort: 15, require: true, isEnabled: false },
    studentID: { name: "学号", sort: 16, require: true, isEnabled: false },
    tel: { name: "其他联系方式", sort: 17, require: true, isEnabled: false },
    cates: {
      name: "考点",
      type: "test",
      sort: 18,
      require: true,
      isEnabled: false,
    },
    cates2: {
      name: "函授站",
      type: "",
      sort: 19,
      require: true,
      isEnabled: false,
    },
    lang: {
      name: "语种",
      sort: 20,
      options: [
        { code: "01", name: "英语" },
        { code: "02", name: "俄语" },
        { code: "03", name: "日语" },
        { code: "04", name: "德语" },
        { code: "05", name: "法语" },
        { code: "06", name: "阿拉伯语" },
      ],
      require: true,
      isEnabled: true,
    },
  };
  // 页面弹窗提示内容
  msgConf: any = {};
  // 准考证号生成规则配置
  ruleConf: any = {
    examNumConf: [
      {
        type: "String",
        field: "uniacid",
        className: "Company",
        isEnabled: true,
      },
      { type: "date", value: "YY", isEnabled: true },
      {
        type: "String",
        field: "batch",
        className: "RecruitStudent",
        isEnabled: true,
      },
      {
        type: "String",
        field: "langCode",
        className: "Profile",
        isEnabled: true,
      },
      {
        type: "Pointer",
        field: "schoolClass",
        className: "Profile",
        pointField: "testNumber",
        isEnabled: true,
      },
      {
        type: "String",
        field: "cardnum",
        className: "Profile",
        isEnabled: true,
      },
    ],
  };
  fieldKeys: any;

  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      console.log(params.get("type"));
      this.type = params.get("type");
      this.company = localStorage.getItem("company");
      this.department = localStorage.getItem("department");
      console.log(this.department, this.company);

      if (!this.department) {
        this.departs = await this.getDeparts();
        this.department = this.departs[0].id;
        this.subCompany = this.departs[0].get("subCompany");
        this.compInfo = await this.getCompany();
      } else {
        this.compInfo = await this.getCompany();
        this.pCompany = this.compInfo.get("company").id;
      }

      this.schema = await this.getSchema("Profile");
      console.log(this.pCompany);

      console.log(this.compInfo);
      await this.getDepartment();
      if (this.type == "recruit") {
        this.recruits = await this.getRecruits();
        // 默认选中开启的招生计划
        let index = this.recruits.findIndex((item) => {
          item.get("isOpen") == true 
          console.log(item);
          if(!item.get("config") || item.get("config") == undefined){
            item.set("config", {
              "msgConf": {},
              "pageConf": {
                "payBtn": true,
                "regBtn": true,
                "regTitle": "",
                "letterBtn": true,
                "loginTitle": "",
                "loginSubTitle": "",
                "achievementBtn": false,
                "printSchoolTitle":""
              },
              "ruleConf": {
                "examNumConf": [
                  {
                    "type": "String",
                    "field": "uniacid",
                    "className": "Company",
                    "isEnabled": true
                  },
                  {
                    "type": "date",
                    "value": "YYYY",
                    "isEnabled": true
                  },
                  {
                    "type": "String",
                    "field": "batch",
                    "className": "RecruitStudent",
                    "isEnabled": true
                  },
                  {
                    "type": "String",
                    "field": "langCode",
                    "className": "Profile",
                    "isEnabled": true
                  },
                  {
                    "type": "Pointer",
                    "field": "schoolClass",
                    "className": "Profile",
                    "isEnabled": true,
                    "pointField": "testNumber"
                  },
                  {
                    "type": "String",
                    "field": "cardnum",
                    "className": "Profile",
                    "isEnabled": true
                  }
                ]
              },
              "fieldConf": {
                "sex": {
                  "name": "性别",
                  "sort": 2,
                  "options": [
                    "男",
                    "女"
                  ],
                  "require": true,
                  "isEnabled": true
                },
                "tel": {
                  "name": "其他联系方式",
                  "sort": 17,
                  "require": true,
                  "isEnabled": false
                },
                "area": {
                  "name": "省市区",
                  "sort": 8,
                  "require": true,
                  "isEnabled": false
                },
                "lang": {
                  "name": "语种",
                  "sort": 11,
                  "options": [
                    {
                      "code": "01",
                      "name": "英语"
                    },
                    {
                      "code": "02",
                      "name": "俄语"
                    },
                    {
                      "code": "03",
                      "name": "日语"
                    },
                    {
                      "code": "04",
                      "name": "德语"
                    },
                    {
                      "code": "05",
                      "name": "法语"
                    }
                  ],
                  "require": true,
                  "isEnabled": true
                },
                "name": {
                  "name": "姓名",
                  "sort": 1,
                  "require": true,
                  "isEnabled": true
                },
                "email": {
                  "name": "电子邮箱",
                  "sort": 6,
                  "require": true,
                  "isEnabled": false
                },
                "idcard": {
                  "name": "证件号码",
                  "sort": 7,
                  "require": true,
                  "isEnabled": true
                },
                "mobile": {
                  "name": "联系电话",
                  "sort": 18,
                  "require": true,
                  "isEnabled": true
                },
                "nation": {
                  "name": "民族",
                  "sort": 4,
                  "require": false,
                  "isEnabled": false
                },
                "polity": {
                  "name": "政治面貌",
                  "sort": 3,
                  "options": [
                    "中共党员",
                    "共青团员",
                    "群众",
                    "民主党派成员"
                  ],
                  "require": false,
                  "isEnabled": false
                },
                "school": {
                  "name": "毕业院校",
                  "sort": 9,
                  "require": true,
                  "isEnabled": false
                },
                "address": {
                  "name": "通讯地址",
                  "sort": 12,
                  "require": true,
                  "isEnabled": false
                },
                "eduType": {
                  "name": "层次",
                  "sort": 14,
                  "require": true,
                  "isEnabled": false
                },
                "cardtype": {
                  "name": "证件类型",
                  "sort": 5,
                  "options": [
                    "中华人民共和国身份证"
                  ],
                  "require": true,
                  "isEnabled": false
                },
                "postcode": {
                  "name": "邮政编码",
                  "sort": 13,
                  "require": true,
                  "isEnabled": false
                },
                "education": {
                  "name": "学制",
                  "sort": 15,
                  "require": true,
                  "isEnabled": false
                },
                "studentID": {
                  "name": "学号",
                  "sort": 16,
                  "require": true,
                  "isEnabled": false
                },
                "SchoolMajor": {
                  "name": "所属专业",
                  "sort": 10,
                  "require": true,
                  "isEnabled": true
                }
              }
            })
            item.save()
            .then((res) => {
              console.log(res);
            })
            .catch(err =>{
              console.log(err);
            })
          }     
          
        });
        if (index >= 0) {
          await this.getRecruitStudent(this.recruits[index].id);
        } else {
          await this.getRecruitStudent(this.recruits[0].id);
        }
      }
    });
  }
  async changeSchool(e) {
    this.department = e;
    let index = this.departs.findIndex((item) => item.id == e);
    this.subCompany = this.departs[index].get("subCompany");
    this.compInfo = await this.getCompany();
    this.getDepartment();
    this.getRecruitStudent();
  }
  async changeRecruit(e) {
    if (e) {
      this.getRecruitStudent(e);
    }
  }
  changFormat(rule, value) {
    this.ruleConf["examNumConf"].filter((item) => {
      if (item == rule) {
        item.value = value;
      }
    });
    console.log(this.ruleConf["examNumConf"]);
  }
  changeField(e, schema?, field?) {
    console.log(e);
    switch (schema) {
      case "comp":
        this.compInfo.set(field, e);
        break;
      case "depart":
        this.departInfo.set(field, e);
        break;
      case "recruit":
        break;
      default:
        console.log(e);
        break;
    }
    // this.compInfo.get(field)&&this.compInfo.get(field) = e;
  }
  drop(event: CdkDragDrop<string[]>): void {
    console.log(event);
    moveItemInArray(this.fieldKeys, event.previousIndex, event.currentIndex);
    console.log(this.fieldKeys, this.fieldConf);
  }
  changeStatus(type) {
    this.status = type;
  }
  async cancelSave() {
    this.status = "";
    this.compInfo = await this.getCompany();
    await this.getDepartment();
    await this.getRecruitStudent();
  }
  async save(type) {
    let state;
    let config;
    switch (type) {
      case "excel":
        this.compInfo.set("config", this.compConfig);
        state = await this.saveComp();
        break;
      case "login":
        state = await this.saveDepart();
        config = this.recruitInfo.get("config");
        config["pageConf"] = this.pageConf;
        this.recruitInfo.set("config", config);
        state = await this.saveRecruit();
        break;
      case "register":
        // this.saveComp();
        this.fieldKeys.forEach((key, index) => {
          this.fieldConf[key].sort = index + 1;
        });
        config = this.recruitInfo.get("config");
        config["fieldConf"] = this.fieldConf;
        config["pageConf"] = this.pageConf;
        config["msgConf"] = this.msgConf;
        
        this.recruitInfo.set("config", config);
        console.log(config, this.recruitInfo);
        state = await this.saveRecruit();

        break;
      case "grade":
        this.compInfo.set("config", this.compConfig);
        state = await this.saveComp();
        break;
      case "examNum":
        config = this.recruitInfo.get("config");
        config["ruleConf"] = this.ruleConf;
        this.recruitInfo.set("config", config);
        state = await this.saveRecruit();
        break;
      default:
        break;
    }
    if (state) {
      this.status = "";
      this.message.success("保存成功");
    }
  }
  async saveComp() {
    let comp = await this.compInfo.save();
    if (comp && comp.id) {
      console.log(comp);
      return true;
    }
  }
  async saveDepart() {
    let depart = await this.departInfo.save();
    if (depart && depart.id) {
      console.log(depart);
      return true;
    }
  }
  async saveRecruit() {
    let recruit = await this.recruitInfo.save();
    if (recruit && recruit.id) {
      console.log(recruit);
      return true;
    }
  }
  async getSchema(schemaName) {
    let queryS = new Parse.Query("DevSchema");
    queryS.equalTo("schemaName", schemaName);
    let schema = await queryS.first();
    if (schema && schema.id) {
      return schema;
    }
  }
  async getCompany() {
    let queryC = new Parse.Query("Company");
    queryC.get(this.subCompany || this.company);
    let comp = await queryC.first();
    let returnData;
    if (comp && comp.id) {
      if (!comp.get("config")) {
        comp.set("config", {});
        let res = await comp.save();
        if (res && res.id) {
          returnData = res;
        }
      } else {
        returnData = comp;
      }
      this.compConfig = returnData.get("config");
      console.log(this.compConfig);
      
      console.log(this.compConfig);
      if (!this.compConfig["gradeSpec"]) {
        this.compConfig["gradeSpec"] = this.gradeSpec;
      }
      return returnData;
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
      this.bgImg = res.get("bgImg");
      this.departInfo = res;
    }
  }
  async getRecruits() {
    let queryR = new Parse.Query("RecruitStudent");
    queryR.equalTo("department", this.department);
    let res = await queryR.find();
    if (res && res.length) {
      return res;
    }
  }
  async getRecruitStudent(id?) {
    let res;
    let queryR = new Parse.Query("RecruitStudent");
    if (id) {
      res = await queryR.get(id);
    } else {
      queryR.equalTo("department", this.department);
      res = await queryR.first();
    }
    if (res && res.id) {
      this.recruit = res.id;
      this.recruitInfo = res;
      console.log(this.recruitInfo);
      if (res.get("config") && res.get("config")["fieldConf"]) {
        this.fieldConf = res.get("config")["fieldConf"];
      }
      if (res.get("config") && res.get("config")["pageConf"]) {
        this.pageConf = res.get("config")["pageConf"];
      }
      if (res.get("config") && res.get("config")["msgConf"]) {
        this.msgConf = res.get("config")["msgConf"];
      }
      console.log(res.get("config"));
      console.log(res);
      if(res.get("config") && res.get("config")["ruleConf"]){
        let ruleConf2 = res.get("config")["ruleConf"];
        if (ruleConf2) {
          if (!ruleConf2["examNumConf"]) {
            // 无准考证号生成规则，使用默认值
            let examRule = this.ruleConf["examNumConf"];
            this.ruleConf = ruleConf2;
            this.ruleConf["examNumConf"] = examRule;
          } else {
            this.ruleConf = ruleConf2;
          }
        }
      }
      
      console.log(this.ruleConf);
      this.fieldKeys = Object.keys(this.fieldConf);
      let that = this;
      // 对象key按照sort排序
      this.fieldKeys.sort(function (a, b) {
        return that.fieldConf[a]["sort"] - that.fieldConf[b]["sort"];
      });
    }
  }
}
