import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";
import { GroupTopicComponent } from "./group-topic/group-topic.component";
interface Topic {
  title?: string;
  index?: number;
  options?: any[];
  answer?: string;
  analy?: string;
  score?: number;
  type?: string;
}

@Component({
  selector: "manual-import",
  templateUrl: "./manual-import.component.html",
  styleUrls: ["./manual-import.component.scss"],
})
export class ManualImportComponent implements OnInit {
  @ViewChild("groupTopic") groupView: GroupTopicComponent;
  pageType: string; // 默认  编辑 edit
  department: any;
  departs: any = [];
  departInfo: any;
  pCompany: any;
  company: any;
  topicComp: any; // 存储题目时存的company
  surveyArr: any[];
  survey: any; // 题库
  surveyId: string;
  tTypeArr: any; // 题型数组
  tType: any; // 题型
  difcultArr: any[] = [
    { label: "简单", value: "easy" },
    { label: "普通", value: "normal" },
    { label: "困难", value: "hard" },
  ]; // 困难度数组
  currentDif: object; // 当前难度
  queValue!: string; // 组合题题干内容
  que: any; // 无父级题题目
  subQueValue!: string; // 输入文本
  subQueData!: Topic[]; // 组合题中小题json输入区中输出的数据
  tTypeVisible: boolean = false; // 更改题型时显示弹窗
  surveyVisible: boolean = false; // 更改题库时显示弹窗
  haveSub: boolean; // 是否有子级题目
  tempSubQue: any[]; // 编辑页面下原小题数组，用于删除小题对比
  constructor(
    private activRoute: ActivatedRoute,
    public cdRef: ChangeDetectorRef,
    private router: Router,
    private message: NzMessageService
  ) { }
  inits: boolean = false;
  ngOnInit(): void {
    this.department = localStorage.getItem("department");
    this.company = localStorage.getItem("company");
    let surveys;
    let type;
    this.activRoute.paramMap.subscribe(async (params) => {
      if (!this.department) {
        await this.getDeparts();
      } else {
        await this.getDepartInfo();
      }
      type = params.get("type");
      let tTypeId = params.get("tTypeId");
      let surveyId = params.get("surveyId");
      let topicId = params.get("topicId");
      if (type && type == "edit") {
        console.log(type);
        // 指定题目编辑
        this.pageType = "edit";
        surveys = await this.getSurveys();
        if (surveys && surveys.length && !this.inits) {
          console.log("init");
          surveys.forEach((survey) => {
            if (survey.id == surveyId) {
              this.initPage(surveys, survey, tTypeId, topicId);
              this.inits = true;

            }
          });
        }
      } else {
        this.addInit();
      }
    });
  }
  async addInit() {
    this.subQueData = [];
    let surveys: any = await this.getSurveys();
    console.log(surveys);
    if (surveys && surveys.length && !this.inits) {
      console.log("init");
      this.initPage(surveys, surveys[0]);
      this.inits = true;
    }
  }
  /*
  1. initPage
  初始化选择项
  初始化项 ：
  edit: 路由接收值
  init: 默认数组第一项
  changeType(传参)
  2.数据显示
  添加:
  组合题：大题对象 小题json转数组
  编辑:
  组合题：
  显示小题：列表形式呈现，点击列表显示基本题型页面修改该小题
  3.录入
  直接添加:   大题查重  无重复 extend 有重复返回false  小题 extend
  编辑: query  修改 大题不查重 query save   小题 objectId查重  有修改 无 添加
  */

  async initPage(surveys, survey, tTypeId?, topicId?) {
    console.log("initpage");
    let data = await this.changeType("survey", survey);
    if (data) {
      // let tTypeArr = await this.getTopicTypes();
      console.log(tTypeId, this.tTypeArr);
      // this.tTypeArr = tTypeArr;
      if (tTypeId && this.tTypeArr && this.tTypeArr.length) {
        this.tTypeArr.forEach((tType) => {
          if (tType.id == tTypeId) {
            let TargetClass = new Parse.Query("SurveyItem");
            TargetClass.get(topicId).then((topic) => {
              console.log(topic);
              let t = topic.toJSON();
              this.que = t;
              this.changeType("tType", tType);
              console.log(this.que);
              let dif = topic.get("difficulty");
              this.difcultArr.forEach((difcult) => {
                if (difcult.value == dif) {
                  this.changeType("difficulty", difcult);
                  this.getTopics(topic.id);
                }
              });
            });
          }
        });
      } else {
        this.changeType("tType", this.tTypeArr[1]);
        this.changeType("difficulty", this.difcultArr[1]);
      }
    }
  }
  async getDeparts() {
    let queryD = new Parse.Query("Department");
    queryD.equalTo("company", this.company);
    queryD.descending("num");
    let res = await queryD.find();
    if (res && res.length) {
      this.departs = res;
      this.departInfo = this.departs[0];
      let depart = this.departInfo;
      this.department = depart.id;
    }
  }
  async getDepartInfo() {
    let queryD = new Parse.Query("Department");
    queryD.get(this.department);
    let res = await queryD.first();
    if (res && res.id) {
      this.departInfo = res;
      this.pCompany = res.get("company").id;
    }
  }
  getSurveys() {
    return new Promise((resolve, rejects) => {
      let TargetClass = new Parse.Query("Survey");
      TargetClass.equalTo("company", this.pCompany);
      if (this.department) {
        TargetClass.equalTo("departments", {
          __type: "Pointer",
          className: "Department",
          objectId: this.department,
        });
      }
      TargetClass.include("department");
      TargetClass.find().then(target => {
        console.log("target:" + target.length);
        if (target && target.length) {
          this.surveyArr = target;
          resolve(target)
        }
      })
    })
  }
  async getTopics(pTopicId) {
    this.subQueData = [];
    this.tempSubQue = [];
    this.tTypeArr = [];
    let TargetClass = new Parse.Query("SurveyItem");
    TargetClass.equalTo("parent", pTopicId);
    TargetClass.ascending("index");
    let target: any = await TargetClass.find();
    console.log("target:", target);
    if (target && target.length) {
      target.forEach((topic) => {
        topic = topic.toJSON();
        this.subQueData.push(topic);

        if (this.pageType == "edit") {
          this.tempSubQue.push(topic.objectId);
        }
      });
      console.log(target, this.subQueData);
    }
    return target;
  }
  tTypeName;
  // 改变题库、题型
  async changeType(type, e?) {
    switch (type) {
      case "depart":
        if (!e) {
          return;
        }
        this.department = e;
        let index = this.departs.findIndex((item) => item.id == e);
        this.departInfo = this.departs[index];
        this.survey = null;
        this.surveyId = null;
        this.getSurveys();
        this.tType = null;
        this.currentDif = null;
        return e;
      case "survey":
        if (!e) {
          return;
        }
        this.tType = null;
        this.currentDif = null;
        this.surveyId = e.id;
        this.survey = e;
        let comp = e.get("department") && e.get("department").get("subCompany");
        this.topicComp = comp.id;
        await this.getTopicTypes();
        return e;
      case "tType":
        console.log("tType");
        console.log(e);
        this.tType = null;
        this.tType = e;
        this.cdRef.detectChanges();
        this.subQueData = [];
        if (e && e.get("name")) {
          if (this.pageType != "edit") {
            this.que = {
              title: "",
              score: null,
              answer: null,
            };
          }
          switch (e.get("name")) {
            case "完形填空":
              this.haveSub = true;
              this.que["type"] = "complex";
              break;
            case "短文完成":
              this.haveSub = true;
              this.que["type"] = "complex";
              break;
            case "情景对话题":
              this.haveSub = true;
              this.que["type"] = "complex";
              break;
            case "阅读理解题":
              this.haveSub = true;
              this.que["type"] = "complex";
              break;
            case "翻译（选择题）":
              this.haveSub = true;
              this.que["type"] = "complex";
              break;
            case "作文":
              this.haveSub = false;
              this.que["type"] = "text";
              break;
            case "翻译":
              this.haveSub = false;
              this.que["type"] = "text";
              break;
            case "词汇词法题":
              if (this.pageType != "edit") {
                this.que["analy"] = "";
                this.que["options"] = [
                  {
                    label: "A",
                    check: false,
                    value: null,
                    grade: 0,
                  },
                  {
                    label: "B",
                    check: false,
                    grade: 0,
                  },
                ];
              }
              this.haveSub = false;
              break;
            default:
              this.haveSub = false;
              break;
          }
        }
        break;
      case "difficulty":
        this.currentDif = e;
        this.que["difficulty"] = e.value
        console.log(this.currentDif);
        break;
      default:
        break;
    }
  }
  addSubQue() { }
  async getTopicTypes(department = this.department) {
    this.tTypeArr = [];
    let TargetClass = new Parse.Query("Knowledge");
    TargetClass.equalTo("department", department);
    TargetClass.equalTo("parent", undefined);
    TargetClass.ascending("index");
    let target: any = await TargetClass.find();
    console.log("target:", target);
    if (target && target.length) {
      target.forEach((tar) => {
        tar = tar.toJSON();
        this.tTypeArr = target;
      });
    } else {
      this.tTypeArr = [];
    }
    return target;
  }

  letterArr: any[] = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
  ];

  queChange(e) {
    console.log(e);
    this.que = e;
  }
  subQueChange(e) {
    console.log(e);
    this.subQueData = e;
  }
  async saveLine() {
    console.log(this.que, this.subQueData);

    if (this.haveSub) {
      if (!this.que["score"] || this.que["score"] == "") {
        this.message.error("请填写总分值");
        return;
      }
      if (
        !this.que["title"] ||
        this.que["title"] == "" ||
        this.que["title"].trim() == ""
      ) {
        this.message.error("请填写大题题干");
        return;
      }
      if (!this.subQueData || !this.subQueData.length) {
        this.message.error("请填写小题内容");
        return;
      }
    } else {
      if (
        !this.que["title"] ||
        this.que["title"] == "" ||
        this.que["title"].trim() == ""
      ) {
        this.message.error("请填写题干");
        return;
      }
      if (!this.que["score"] || this.que["score"] == "") {
        this.message.error("请填写分值");
        return;
      }
    }
    console.log(this.queValue, this.que["title"]);
    console.log(this.haveSub);
    let pId;
    console.log(this.que);

    let pTopic: any = await this.getSurveyItem("parent", this.que);
    if (pTopic && pTopic.id) {
      if (this.haveSub) {
        pId = pTopic.id;
        console.log(pId);
        let subQueArr = [];
        subQueArr = [...this.subQueData];
        console.log(this.subQueData);
        console.log(subQueArr.constructor);
        var copyArray: Array<Topic> = this.copy(this.subQueData);
        let cIdArr = [];
        copyArray.forEach((subQue, index) => {
          if (subQue["objectId"]) {
            cIdArr.push(subQue["objectId"]);
          }
          console.log(subQue);
          this.getSurveyItem("child", subQue, pTopic.id);
          if (index + 1 == copyArray.length) {
            if (this.pageType == "edit") {
              // 编辑页面 删除delIdArr
              let delIdArr = this.tempSubQue.filter(
                (item) => !cIdArr.includes(item)
              );
              console.log(delIdArr);
              if (delIdArr && delIdArr.length) {
                this.deleteSubQue(delIdArr);
              }
            }
            console.log("8888", this.groupView);
            this.message.success("题目录入成功");
            if (this.pageType == "edit") {
              this.router.navigate([
                "english/question-manage",
                { rid: "OaPPM8MmLq" },
              ]);
            }
            // 清空题目内容 重置题型数据
            this.reset()
          }
        });
      } else {
        this.message.success("题目录入成功");
        if (this.pageType == "edit") {
          this.router.navigate([
            "english/question-manage",
            { rid: "OaPPM8MmLq" },
          ]);
        }
        this.que = {
          title: null,
          answer: null,
          score: null,
        };


        if (
          this.tType.get("name") == "翻译（选择题）" ||
          this.tType.get("name") == "阅读理解题" ||
          this.tType.get("name") == "情景对话题" ||
          this.tType.get("name") == "完形填空" ||
          this.tType.get("name") == "短文完成"
        ) {
          this.que.type == "complex";
        }
        if (this.tType.get("name") == "词汇词法题") {
          this.que = {
            title: null,
            answer: null,
            analy: null,
            score: null,
            options: [
              {
                label: "A",
                check: false,
                value: null,
                grade: 0,
              },
              {
                label: "B",
                check: false,
                value: null,
                grade: 0,
              },
            ],
          };
        }
        this.reset()
      }
    } else {
      // 该题库内已有题干相同的父级题目
      this.message.error("该题库内已有题干相同的题目");
    }
  }
  reset() {
    this.subQueValue = "";
    this.subQueData = [];
    let type = this.checkType()
    this.que.title = null
    this.que.answer = null
    this.que.score = null
    this.que.type = type
    // this.groupView.initEditor()
    this.groupView.editor.txt.clear()

  }
  checkType() {
    let name = this.tType.get("name")
    switch (name) {
      case "完形填空":
        this.haveSub = true;
        return "complex";
      case "短文完成":
        this.haveSub = true;
        return "complex";
      case "情景对话题":
        this.haveSub = true;
        return "complex";
      case "阅读理解题":
        this.haveSub = true;
        return "complex";
      case "翻译（选择题）":
        this.haveSub = true;
        return "complex";
      case "作文":
        this.haveSub = false;
        return "text";
      case "翻译":
        this.haveSub = false;
        return "text";
      case "词汇词法题":
        if (this.pageType != "edit") {
          this.que["analy"] = "";
          this.que["options"] = [
            {
              label: "A",
              check: false,
              value: null,
              grade: 0,
            },
            {
              label: "B",
              check: false,
              grade: 0,
            },
          ];
        }
        this.haveSub = false;
        return "select-single"
      default:
        this.haveSub = false;
        break;
    }
  }
  // 数组拷贝
  copy(obj) {
    var newobj;
    if (Array.isArray(obj)) {
      newobj = [];
    } else {
      newobj = {};
    }
    // var newobj = obj.constructor === Array ? [] : {};
    if (typeof obj != "object") {
      return;
    }
    for (var i in obj) {
      newobj[i] = typeof obj[i] === "object" ? this.copy(obj[i]) : obj[i];
    }
    return newobj;
  }
  async deleteSubQue(delIdArr) {
    for (let index = 0; index < delIdArr.length; index++) {
      const delId = delIdArr[index];
      let Item = new Parse.Query("SurveyItem");
      let sItem = await Item.get(delId);
      sItem
        .destroy()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          this.message.error("操作失败");
        });
    }
  }
  // 处理题目选项
  disposeOpt(item) {
    return new Promise((resolve, reject) => {
      if (item["options"] && item["options"].length) {
        for (let index = 0; index < item["options"].length; index++) {
          const option = item["options"][index];
          if (option["label"] == item["answer"]) {
            option["check"] = true;
            option["grade"] = item["score"];
          } else {
            option["check"] = false;
            option["grade"] = 0;
          }
          if (index + 1 == item["options"].length) {
            resolve(item["options"]);
          }
        }
      } else {
        resolve(false);
      }
    });
  }

  onBack(): void {
    console.log("onBack");
    window.history.back();
  }




  getSurveyItem(type, item, pTopicId?) {
    return new Promise(async (resolve, reject) => {
      let SurveyItem;
      let surveyItem;
      switch (this.pageType) {
        // 编辑页面
        case "edit":
          // 新增小题
          if (!item.objectId && type != "parent") {
            SurveyItem = Parse.Object.extend("SurveyItem");
            surveyItem = new SurveyItem();
            surveyItem.set("company", {
              __type: "Pointer",
              className: "Company",
              objectId: this.topicComp,
            });
            surveyItem.set("survey", {
              __type: "Pointer",
              className: "Survey",
              objectId: this.surveyId,
            });
            surveyItem.set("difficulty", this.currentDif["value"]);
            surveyItem.set("knowledge", [this.tType.toPointer()]);
            surveyItem.set("isEnabled", true);
            surveyItem.set("parent", {
              __type: "Pointer",
              className: "SurveyItem",
              objectId: pTopicId,
            });
            // surveyItem.set("name", this.tType.get('name'))
            item["score"] = +item["score"];
            let options: any = await this.disposeOpt(item);
            if (options && options.length) {
              surveyItem.set("type", "select-single");
            } else {
              surveyItem.set("type", "text");
            }
            surveyItem.set(item);
            let res = await surveyItem.save();
            if (res && res.id) {
              resolve(res);
            } else {
              reject("操作失败");
            }
          } else {
            // 大题/原有小题
            SurveyItem = new Parse.Query("SurveyItem");
            SurveyItem.equalTo("objectId", item.objectId);
            if (type != "parent") {
              SurveyItem.equalTo("parent", pTopicId);
            }
            surveyItem = await SurveyItem.first();
            // let options: any = await this.disposeOpt(item)
            // if (options && options.length) {
            //   surveyItem.set("type", 'select-single');
            // }
            // else {
            //   surveyItem.set("type", 'complex');
            // }
            delete item.objectId;
            delete item.knowledge;
            delete item.survey;
            delete item.company;
            if (type != "parent") {
              delete item.parent;
            }
            console.log(item);
            surveyItem.set(item);
            let res = await surveyItem.save();
            if (res && res.id) {
              resolve(res);
            }
          }
          break;
        default:
          // if (type == 'parent') {
          //   SurveyItem = new Parse.Query("SurveyItem");
          //   SurveyItem.equalTo("title", item['title']);
          //   SurveyItem.equalTo("survey", this.surveyId);
          //   SurveyItem.containedIn("knowledge", [this.tType]);
          //   surveyItem = await SurveyItem.first();
          // }
          // if (surveyItem && surveyItem.id) {
          //   resolve(false);
          // }
          SurveyItem = Parse.Object.extend("SurveyItem");
          surveyItem = new SurveyItem();
          surveyItem.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: this.topicComp,
          });
          surveyItem.set("survey", {
            __type: "Pointer",
            className: "Survey",
            objectId: this.surveyId,
          });
          surveyItem.set("difficulty", this.currentDif["value"]);
          surveyItem.set("knowledge", [this.tType.toPointer()]);
          surveyItem.set("isEnabled", true);
          // surveyItem.set("name", this.tType.get('name'))
          if (type != "parent") {
            surveyItem.set("parent", {
              __type: "Pointer",
              className: "SurveyItem",
              objectId: pTopicId,
            });
          } else {
            console.log(item.type);
            if (item.type == "complex") {
              surveyItem.set("type", "complex");
            } else {
              surveyItem.set("type", "text");
            }
          }
          console.log(item);
          let options: any = await this.disposeOpt(item);
          if (options && options.length) {
            surveyItem.set("type", "select-single");
          }
          delete item.type;
          item["score"] = +item["score"];
          surveyItem.set(item);
          let res = await surveyItem.save();
          resolve(res);
          break;
      }
    });

  }
}











