import { Output, ViewChild, ElementRef } from "@angular/core";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectorRef,
} from "@angular/core";
import { EventManager } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService, NzModalRef } from "ng-zorro-antd/modal";
import * as Parse from "parse";
import { HttpClient } from "@angular/common/http";
import { NzMessageService } from "ng-zorro-antd/message";
@Component({
  selector: "test-answer",
  templateUrl: "./answer.component.html",
  styleUrls: ["./answer.component.scss"],
})
export class AnswerComponent implements OnInit {
  // 通过@Input接受父组件传进的值、方法
  @Input() content: number;
  @Input() testId: string;
  @Output() getStatus = new EventEmitter<number>(); // 用 EventEmitter 和 output 装饰器配合使用 <string>指定类型变量
  type: string; // 试卷抽题方式
  examId: string; // 考试id
  // 答题状态  complete 已答题  uncomplete 未答题
  complete: boolean = true;
  uncomplete: boolean = false;
  allAnswer: boolean = false;
  // 试卷信息
  test: any = [];
  // // 单选题集合
  // singleTopic: any = [];
  radioValue: "";
  slog: any; // 答题后记录待导出
  label: any = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  totalScore: number = 0;
  right: number = 0;
  wrong: number = 0;
  empty: number = 0;
  // 试卷题目数组
  testItem: any = [];
  time: any;
  startTime: any;
  deadline: any = null;
  multiScore: any;
  singleScore: any;
  multiRight: any;
  singleRight: any;
  sComplete: string = "answer";
  // 简答题答案集合
  textAnswerArray: any = {};
  profile: any;
  video: HTMLElement;
  surveyInfo: Parse.Object<Parse.Attributes>;
  allTopic: { singleTopic: any[]; textTopic: any[] };
  shortMap: any = {};
  testMap: any = {};
  loadComplete: boolean;
  confirmModal?: NzModalRef;
  timeOutModal?: NzModalRef;
  survey: any; //题库
  department: string;
  company: any;
  @ViewChild("video") videoObj: any;
  errCount: number = 0;
  // random 随机抽题
  options: any; // 抽题规则
  userId: string;




  /* 考试数据*/

  beginTime: any;// 考试开始时间
  constructor(
    private router: Router,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private eventManager: EventManager,
    private http: HttpClient,
    private message: NzMessageService,
    private eleRef: ElementRef,
    private cdRef: ChangeDetectorRef
  ) { }

  //   1、启用的考试 Exam
  //   2、这一次的考试 抽题规则 Exam => options
  //   3、本次考试的所使用的题库 Survey
  nowTime: any;
  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      // let isFullscreen = document.fullscreenElement;
      // if (!isFullscreen) { //进入全屏,多重短路表达式
      //   document.documentElement.requestFullscreen()
      // }
      this.userId = Parse.User.current().id;
      this.company = localStorage.getItem("company");
      this.department = localStorage.getItem("department");
      this.testId = params.get("sid");
      this.examId = params.get("eid");
      // 需要答完题目 才能交卷
      this.allAnswer = true;
      // let profileId = localStorage.getItem("profile");
      // this.profile = await this.getProfile(profileId);
      (this.profile as any) = JSON.parse(localStorage.getItem("profile"));
      if (!this.profile || !this.profile.schoolClass) {
        this.message.create("info", "未分配考场，无法进入考试");
        window.history.go(-1);
        return;
      }
      this.profile.school = this.profile.department["objectId"];
      let log = await this.getSurveyLog(this.profile.objectId);
      if (log && log.id) {
        this.message.error("请勿重复答题");
        this.message.error("请勿重复答题");
        this.router.navigate(["/english/start"]);
        return;
      }

      if (!localStorage.getItem("testTime")) {
        let time = new Date().getTime();
        localStorage.setItem("testTime", String(time));
      }
      let timer = localStorage.getItem("timer");
      if (!timer) {
        timer = this.profile.schoolClass.beginTime.iso;
        this.beginTime = timer
        localStorage.setItem("timer", String(new Date().getTime()));
        localStorage.setItem("startTime", String(new Date().getTime()));
      }

      // 获取考试抽题规则
      if (this.examId) {
        await this.getExam();
      }
      // this.initCamera();
      // this.windowCaptrue();
    });
    this.totalScore = 0;
    // this.eventManager.addGlobalEventListener("window", "keyup.f11", (value) => {
    //   value.returnValue = false;
    //   return false;
    // });

    // this.eventManager.addGlobalEventListener("window", "keyup.esc", (value) => {
    //   value.returnValue = false;
    //   return false;
    // });
  }

  async getSurveyLog(profileId) {
    let SurveyLog = new Parse.Query("SurveyLog");
    SurveyLog.equalTo("profile", profileId);
    SurveyLog.equalTo("exam", this.examId);
    let log = await SurveyLog.first();
    if (log && log.id) {
      return log;
    } else {
      return false;
    }
  }
  tipMinute: number = 53;
  tipTime: any;
  tipModal: boolean = false;
  async getExam() {
    let Exam = new Parse.Query("Exam");
    Exam.include("survey");
    let exam = await Exam.get(this.examId);
    if (exam && exam.id) {
      this.surveyInfo = exam;
      this.time = exam.get("time");
      // 开始倒计时
      this.beginCountDown()


      this.survey = this.loadSurvey(exam.get("survey"));
      this.type = exam.get("type");
      if (this.survey) {
        let options = exam.get("options");
        this.options = exam.get("options");
        if (this.type == "random" && options && options.length > 0) {
          await this.getKonwLedges(options);
          await this.getRandomItems();
          console.log(
            this.testMap,
            this.shortMap,
            this.test,
            this.options.length
          );
          if (this.test && this.test.length == this.options.length) {
            this.getItems2();
            console.log(this.test);
            this.loadComplete = true;
            this.topicClassify();
          }

          /* 保存答卷记录 */
          // this.setSlog()
        } else {
          let knows = await this.getKonwLedges();
          this.getOrderItems(knows);
        }
      }
    }
  }




  // 获取与考生语种相应的题库
  loadSurvey(surveys) {
    let survey;
    surveys.forEach((item) => {
      if (item.get("scate") == this.profile.langCode) {
        survey = item;
      }
    });
    return survey;
  }
  // 获取题型
  async getKonwLedges(options?) {
    this.knowledges = [];
    if (options) {
      for (let index = 0; index < options.length; index++) {
        let option = options[index];
        let knowledge = option.knowledge;
        let Knowledge = new Parse.Query("Knowledge");
        Knowledge.equalTo("objectId", knowledge);
        let know = await Knowledge.first();
        if (know && know.id) {
          this.knowledges.push(know);
        }
        if (index + 1 == options.length) {
          return this.knowledges;
        }
      }
    } else {
      let Knowledge = new Parse.Query("Knowledge");
      Knowledge.equalTo("company", this.company);
      Knowledge.equalTo("parent", undefined);
      let knowledges = await Knowledge.find();
      if (knowledges && knowledges.length) {
        this.knowledges = knowledges;
        return knowledges;
      } else {
        return [];
      }
    }
  }
  novaSelect(sql) {
    let baseurl = localStorage.getItem("NOVA_SERVERURL")
      ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select"
      : "https://server.fmode.cn/api/novaql/select";
    return new Promise((resolve) => {
      this.http.post(baseurl, { sql: sql }).subscribe(async (res: any) => {
        resolve(res);
      });
    });
  }
  async getRandomItems() {
    let options = this.options;
    // 题库 this.survey
    let sid = this.survey.id;
    let test: any = [];
    let count = 0;
    console.log(options);

    for (let index = 0; index < options.length; index++) {
      let Items = [];
      let option = options[index];
      let knowledge = option.knowledge;
      let easyCount = Number(option.complexity["easy"]);
      let normalCount = Number(option.complexity["normal"]);
      let diffCount = Number(option.complexity["difficulty"]);
      let sql1 = `select * from
      (select
          "objectId", "isEnabled","title","type","survey","options","answer","parent","name",
          "difficulty","isDeleted",
          jsonb_array_elements("SurveyItem"."knowledge")::json->>'objectId' as "kid"
      from "SurveyItem" where "SurveyItem"."parent" is null  ) as "SurveyItem" left join
      (select "name" as "kname","objectId" as "kid2" from "Knowledge") as "knowledge" on "SurveyItem"."kid" = "kid2"
      where "kid" = '${knowledge}'  and  "difficulty" = 'easy' and "isDeleted" is not true and "isEnabled" is true and "SurveyItem"."survey"='${sid}'   order by random() limit ${easyCount}`;
      let sql2 = `select * from
            (select
                "objectId", "isEnabled","title","type","survey","options","answer","parent","name",
                "difficulty","isDeleted",
                jsonb_array_elements("SurveyItem"."knowledge")::json->>'objectId' as "kid"
            from "SurveyItem" where "SurveyItem"."parent" is null ) as "SurveyItem" left join
            (select "name" as "kname","objectId" as "kid2" from "Knowledge") as "knowledge" on "SurveyItem"."kid" = "kid2"
            where "kid" = '${knowledge}'  and  "difficulty" = 'normal' and "isDeleted" is not true and "isEnabled" is true and "SurveyItem"."survey"='${sid}' order by random() limit ${normalCount}`;
      let sql3 = `select * from
            (select
                "objectId", "isEnabled","title","type","survey","options","answer","parent","name",
                "difficulty","isDeleted",
                jsonb_array_elements("SurveyItem"."knowledge")::json->>'objectId' as "kid"
            from "SurveyItem" where "SurveyItem"."parent" is null ) as "SurveyItem" left join
            (select "name" as "kname","objectId" as "kid2" from "Knowledge") as "knowledge" on "SurveyItem"."kid" = "kid2"
            where "kid" = '${knowledge}'  and  "difficulty" = 'hard' and "isDeleted" is not true and "isEnabled" is true and "SurveyItem"."survey"='${sid}' order by random() limit ${diffCount}`;
      // 简单题
      if (easyCount) {
        let res1: any = await this.novaSelect(sql1);
        let data: any = res1.data;
        count += data.length;
        for (let i = 0; i < data.length; i++) {
          let SurveyItem = new Parse.Query("SurveyItem");
          SurveyItem.equalTo("parent", data[i].objectId);
          SurveyItem.ascending("index");
          let topics = await SurveyItem.find();
          if (topics && topics.length > 0) {
            count += topics.length;
            let childrenitem = topics.map((s) => {
              if (s.get("type") == "text") {
                this.shortMap[s.id] = "";
              } else {
                this.testMap[s.id] = "";
              }
              return s.toJSON();
            });
            data[i]["childrenitem"] = childrenitem;
          }
          if (data[i].type == "text") {
            this.shortMap[data[i].objectId] = "";
            Items.push(data[i]);
            this.test[index] = {
              id: knowledge,
              SurveyItem: Items,
              type: "text",
            };
          } else {
            this.testMap[data[i].objectId] = "";
            Items.push(data[i]);
            this.test[index] = {
              id: knowledge,
              SurveyItem: Items,
              type: "select-single",
            };
          }
        }
      }
      // 正常题
      if (normalCount) {
        let res2: any = await this.novaSelect(sql2);
        let data: any = res2.data;
        count += data.length;
        for (let i = 0; i < data.length; i++) {
          let SurveyItem = new Parse.Query("SurveyItem");
          SurveyItem.equalTo("parent", data[i].objectId);
          SurveyItem.ascending("index");
          let surveys = await SurveyItem.find();
          count += surveys.length;
          if (surveys && surveys.length > 0) {
            let childrenitem = surveys.map((s) => {
              if (s.get("type") == "text") {
                this.shortMap[s.id] = "";
              } else {
                this.testMap[s.id] = "";
              }
              return s.toJSON();
            });
            data[i]["childrenitem"] = childrenitem;
          }
          if (data[i].type == "text") {
            this.shortMap[data[i].objectId] = "";
            Items.push(data[i]);
            this.test[index] = {
              id: knowledge,
              SurveyItem: Items,
              type: "text",
            };
          } else {
            this.testMap[data[i].objectId] = "";
            Items.push(data[i]);
            this.test[index] = {
              id: knowledge,
              SurveyItem: Items,
              type: "select-single",
            };
          }
        }
      }
      if (diffCount) {
        let res3: any = await this.novaSelect(sql3);
        let data: any = res3.data;
        count += data.length;
        for (let i = 0; i < data.length; i++) {
          let SurveyItem = new Parse.Query("SurveyItem");
          SurveyItem.equalTo("parent", data[i].objectId);
          SurveyItem.ascending("index");
          let sItems = await SurveyItem.find();
          count += sItems.length;
          if (sItems && sItems.length > 0) {
            let childrenitem = sItems.map((s) => {
              if (s.get("type") == "text") {
                this.shortMap[s.id] = "";
              } else {
                this.testMap[s.id] = "";
              }
              return s.toJSON();
            });
            data[i]["childrenitem"] = childrenitem;
          }
          if (data[i].type == "text") {
            this.shortMap[data[i].objectId] = "";
            Items.push(data[i]);
            this.test[index] = {
              id: knowledge,
              SurveyItem: Items,
              type: "text",
            };
          } else {
            this.testMap[data[i].objectId] = "";
            Items.push(data[i]);
            this.test[index] = {
              id: knowledge,
              SurveyItem: Items,
              type: "select-single",
            };
          }
        }
      }
    }
  }

  // 一整套题，没有抽题规则
  getOrderItems(knows) {
    if (knows && knows.length) {
      let kls = knows.map((item) => {
        return item.toJSON();
      });
      this.getItem(kls);
    } else {
      this.message.info("该院校账套未添加题型");
    }
  }
  radioChange() {
    // console.log(this.testMap);
    // if(Object.keys(this.testMap).length == (this.num -1)) {
    //   this.uncomplete = false;
    //   this.complete = true;
    // }
  }
  textChange() {
    // if(Object.keys(this.testMap).length == (this.num -1)) {
    //   this.uncomplete = false;
    //   this.complete = true;
    // }
  }

  checkboxChange(e: Array<string>, index: number, item) {
    this.testMap[item.objectId] = e;
  }



  /* 续考 Begin */
  /* 添加续考功能
    * 抽题完成，生成SurveyLog
    * 保存字段
    *  company: 主公司id
    *  department departmentId
    *  departments  departmentId
    *  profile：考生档案
    *  user: 用户id
    *  exam: 当前考试
    *  survey 题库id
    *  examId 准考证号
    *  shortAnswer 简答题 {}
    *  answer 选择题 {}
    *  beginTime 进入考试时间
    * 添加字段  是否提交 status  haveCommit
  */
  async setSlog() {
    let queryL = Parse.Object.extend("SurveyLog")
    let log = new queryL();
    console.log(this.shortMap, this.testMap,)
    log.set("shortAnswer", this.shortMap);
    log.set("answer", this.testMap);
    log.set("singleScore", 0);
    log.set("company", {
      __type: "Pointer",
      className: "Company",
      objectId: this.profile.company.objectId,
    });
    log.set("user", {
      __type: "Pointer",
      className: "_User",
      objectId: this.userId,
    });
    log.set("department", {
      __type: "Pointer",
      className: "Department",
      objectId: this.profile.school,
    });
    log.set("departments", [
      {
        __type: "Pointer",
        className: "Department",
        objectId: this.profile.school,
      },
    ]);
    log.set("profile", {
      __type: "Pointer",
      className: "Profile",
      objectId: this.profile.objectId,
    });
    log.set("survey", {
      __type: "Pointer",
      className: "Survey",
      objectId: this.testId,
    });
    log.set("exam", {
      __type: "Pointer",
      className: "Exam",
      objectId: this.examId,
    });
    log.set("examId", this.profile.workid);
    log.set("submitted", false);
    let start = localStorage.getItem("startTime");
    let startNum = Number(start);
    let startTime = new Date(startNum);
    log.set("beginTime", startTime);
    let res = await log.save()
    console.log(res);

  }





  /* ******** CountDown Begin ******** */

  /* 获取倒计时时间 deadline =>考场结束时间  */
  beginCountDown() {
    this.deadline = new Date(this.profile.schoolClass.endTime.iso);
    console.log(this.deadline);
  }
  /* 倒计时时间变化 */
  timeUpdate(event) {
    switch (true) {
      // 截止时间剩余5分钟  弹窗提示
      case event.h == 0 && event.m == 5 && event.s == 0:
        console.log('show tipModal');
        this.tipModal = true;
        break;
      default:
        break;
    }
  }
  /* 超时自动提交答题 */
  timeOut() {
    console.log('timeout');
    if (this.surveyInfo.get("authCommit")) {
      this.message.warning("已超时，自动提交答题！！！");
      this.message.warning("已超时，自动提交答题！！！");
      this.message.warning("已超时，自动提交答题！！！");
      this.saveLog("timeOut");
    }
  }

  /* ******** CountDown End ******** */




























  exportData: any;
  saveLoading: boolean = false;
  repeatModal: boolean = false;
  async saveLog(timeOut?) {
    let now: any = new Date().getTime()
    let time = 1000 * 60 * 40;
    let begin = new Date(this.beginTime).getTime()
    console.log(now - begin < time);
    if (now - begin < time) {
      console.log(now - begin < time);
      this.message.warning("考试开始四十分钟后才可交卷")
      return
    }
    let log = await this.getSurveyLog(this.profile.objectId);
    if (log && log.id) {
      this.repeatModal = true;
      return;
    }
    this.saveLoading = true;
    this.exportData = {};
    try {
      let singleTopic = this.allTopic.singleTopic; /* 所有单选题 */
      let testMap = this.testMap; /* 单选题选择的答案 */
      let shortMap = this.shortMap; /* 填空题填写的答案 */
      /* 将所有单选题正确答案提取出来 */
      console.log(singleTopic, testMap, shortMap);
      let singCorrectMap = {};
      for (let index = 0; index < singleTopic.length; index++) {
        let sItem = singleTopic[index];
        if (
          (!testMap[sItem.objectId] || testMap[sItem.objectId] == "") &&
          !timeOut
        ) {
          this.saveLoading = false;
          this.message.error("请先作答完题目，再进行交卷");
          return;
        }
        if (sItem.options && sItem.options.length) {
          sItem.options.forEach((o) => {
            if (o.check) {
              let sinMap = {
                value: o.value,
                score: o.grade,
              };
              singCorrectMap[sItem.objectId] = sinMap;
            }
          });
        }
      }
      let correctNum = 0;
      let score = 0;
      for (let tKey in testMap) {
        let sitem = singCorrectMap[tKey];
        if (sitem && sitem.value && sitem.value == testMap[tKey]) {
          if (sitem.score) {
            score += Number(singCorrectMap[tKey].score);
          }
          correctNum++;
        }
        // for (let sKey in singCorrectMap) {
        //   if (tKey == sKey && testMap[tKey] == singCorrectMap[sKey].value) {
        //     console.log(singCorrectMap, singCorrectMap[sKey]);
        //     if (singCorrectMap[sKey].score) {
        //       score += Number(singCorrectMap[sKey].score);
        //     }
        //     correctNum++;
        //   }
        // }
      }
      console.log("答对个数：%s", correctNum);
      console.log("得分：%s", score);
      let SurveyLog = Parse.Object.extend("SurveyLog");
      let surveyLog = new SurveyLog();
      console.log(shortMap, Object.keys(shortMap), testMap);
      this.exportData = {
        shortAnswer: shortMap,
        answer: testMap,
        singleScore: score,
      };
      if (Object.keys(shortMap).length == 0) {
        console.log("grade", Object.keys(shortMap) == []);
        shortMap = null;
        surveyLog.set("grade", score);
        this.exportData["grade"] = score;
      } else {
        for (let sKey in shortMap) {
          if ((!shortMap[sKey] || shortMap[sKey] == "") && !timeOut) {
            this.message.error("请先作答完题目，再进行交卷");
            this.saveLoading = false;
            return;
          }
        }
      }

      surveyLog.set("shortAnswer", shortMap);
      surveyLog.set("answer", testMap);
      surveyLog.set("singleScore", score);
      surveyLog.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: this.profile.company.objectId,
      });
      surveyLog.set("user", {
        __type: "Pointer",
        className: "_User",
        objectId: this.userId,
      });
      surveyLog.set("department", {
        __type: "Pointer",
        className: "Department",
        objectId: this.profile.school,
      });
      surveyLog.set("departments", [
        {
          __type: "Pointer",
          className: "Department",
          objectId: this.profile.school,
        },
      ]);
      surveyLog.set("profile", {
        __type: "Pointer",
        className: "Profile",
        objectId: this.profile.objectId,
      });
      surveyLog.set("survey", {
        __type: "Pointer",
        className: "Survey",
        objectId: this.testId,
      });
      surveyLog.set("exam", {
        __type: "Pointer",
        className: "Exam",
        objectId: this.examId,
      });
      surveyLog.set("examId", this.profile.workid);
      let start = localStorage.getItem("startTime");
      let timer = localStorage.getItem("timer");
      let startNum = Number(start);
      let startTime = new Date(startNum);
      let endTime = new Date();
      surveyLog.set("beginTime", startTime);
      surveyLog.set("endTime", endTime);
      await surveyLog
        .save()
        .then((log) => {
          localStorage.removeItem("startTime");
          localStorage.removeItem("timer");
          console.log(log);
          this.saveLoading = false;
          this.sComplete = "success";
          this.slog = log;
          this.errCount = 0;

          // this.exitFullScreen(el);
          // setTimeout(()=>{
          // Parse.User.logOut();
          //   this.router.navigate(["/english/login",{did:this.profile.department["objectId"]}]);
          // },3000)
        })
        .catch((err) => {
          console.log(err, this.errCount);
          if (this.errCount > 2) {
            localStorage.removeItem("startTime");
            localStorage.removeItem("timer");
            this.sComplete = "fail";
          } else {
            this.saveLoading = false;
            this.errCount++;
            this.message.error("答卷提交失败，请稍后重试");
          }
        });
    } catch (error) {
      console.log(error);
      if (this.errCount > 2) {
        localStorage.removeItem("startTime");
        localStorage.removeItem("timer");
        this.sComplete = "fail";
      } else {
        this.saveLoading = false;
        this.errCount += 1;
        this.message.error("答卷提交失败，请稍后重试");
      }
    }
    // this.router.navigate(["/english/login"]);
  }

  /* 获取题目 */
  async getSurveyItems() {
    let options = this.options;
    // 题库 this.survey
    let baseurl = localStorage.getItem("NOVA_SERVERURL")
      ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select"
      : "https://server.fmode.cn/api/novaql/select";
    let sid = this.survey.id;
  }

  async getKnow(kid, i) {
    let Know = new Parse.Query("Knowledge");
    Know.equalTo("objectId", kid);
    let know = await Know.first();
    if (know && know.id) {
      this.knowledges[i] = know;
    }
  }
  knowledges: any;
  /* 获取题目 */
  num = 1;
  //   整套出题
  async getItem(knowledges) {
    let test = [];
    for (let i = 0; i < knowledges.length; i++) {
      let type;
      let SurveyItem = new Parse.Query("SurveyItem");
      SurveyItem.equalTo("survey", this.testId);
      SurveyItem.containedIn("knowledge", [
        {
          __type: "Pointer",
          className: "Knowledge",
          objectId: `${knowledges[i].objectId}`,
        },
      ]);
      let res = await SurveyItem.find();
      let sItem = [];
      for (let j = 0; j < res.length; j++) {
        let item = res[j].toJSON();
        if (!item.parent) {
          let cItem = new Parse.Query("SurveyItem");
          cItem.equalTo("parent", item.objectId);
          cItem.equalTo("survey", this.testId);
          cItem.ascending("index");
          let children = await cItem.find();
          if (children && children.length > 0) {
            let childrenitem = children.map((s) => {
              let m = s.toJSON();
              if (m.type == "select-single") {
                m.options = this.shuffle(m.options);
                type = "select-single";
              } else {
                type = "text";
              }
              m.num = this.num;
              this.num++;
              return m;
            });
            item.childrenitem = childrenitem;
          } else {
            item.childrenitem = [];
            if (item.type == "select-single") {
              item.options = this.shuffle(item.options);
              type = "select-single";
            } else {
              type = "text";
            }
            item.num = this.num;
            this.num++;
          }
          sItem.push(item);
        }
      }
      test.push({
        name: knowledges[i].name,
        id: knowledges[i].objectId,
        SurveyItem: sItem,
        type: type,
      });
    }
    console.log(test, this.num);
    this.test = test;
    this.loadComplete = true;
    this.topicClassify();
  }
  showNum(s) {
    return s.num ? s.num + "、" : "";
  }
  async getItems2() {
    let num = 1;
    // let num2 = 0;
    // for (let index = 0; index < this.test.length; index++) {
    //   let know =  this.test[index];
    //   know.SurveyItem.length;
    // }
    // test 循环不同题型
    for (let tIndex = 0; tIndex < this.test.length; tIndex++) {
      let tItem = this.test[tIndex];
      if (tItem.SurveyItem && tItem.SurveyItem.length) {
        // SurveyItem 循环不同题目
        for (let sIndex = 0; sIndex < tItem.SurveyItem.length; sIndex++) {
          let sItem = tItem.SurveyItem[sIndex];
          // childrenitem 循环子级题目
          if (sItem.childrenitem && sItem.childrenitem.length) {
            let cItems = sItem.childrenitem;
            for (let cIndex = 0; cIndex < cItems.length; cIndex++) {
              let cItem = cItems[cIndex];
              if (cItem.type == "select-single") {
                //&&
                if (sItem.kname != "情景对话题") {
                  cItem.options = this.shuffle(cItem.options);
                }
              } else {
                sItem.type = "text";
              }
              cItems[cIndex]["num"] = num;
              cItems[cIndex]["showNumber"] = num + "、";
              num++;
              sItem.type = "select-single";
            }
          } else {
            // 无childrenitem 直接给题目赋值序号
            if (sItem.type == "select-single") {
              sItem.options = this.shuffle(sItem.options);
              sItem.type = "select-single";
            } else {
              sItem.type = "text";
            }
            sItem["num"] = num;
            sItem["showNumber"] = num + "、";
            num++;
          }
        }
      }
    }

    // if (num != this.allTopic.singleTopic.length) {
    //   this.cdRef.detectChanges()
    //   this.getItems2()
    // }
  }

  /* 选项打乱 */
  shuffle(array) {
    let j, x, i;
    if (array && array.length) {
      for (i = array.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
      }
    }
    return array;
  }

  topicClassify() {
    let singleTopic = [];
    let textTopic = [];
    for (let i = 0; i < this.test.length; i++) {
      let item = this.test[i];
      // item.type == "select-single" || item.type == "complex"
      if (item.type != "text") {
        for (let j = 0; j < item.SurveyItem.length; j++) {
          if (item.SurveyItem[j] && item.SurveyItem[j].childrenitem) {
            item.SurveyItem[j].childrenitem.forEach((s) => {
              singleTopic.push(s);
            });
          } else {
            singleTopic.push(item.SurveyItem[j]);
          }
        }
      } else if (item.type == "text") {
        for (let t = 0; t < item.SurveyItem.length; t++) {
          textTopic.push(item.SurveyItem[t]);
        }
      }
    }
    let allTopic = {
      singleTopic: singleTopic,
      textTopic: textTopic,
    };
    this.allTopic = allTopic;
    console.log(this.allTopic);
  }

  showName(i, k) {
    if ((k || k.get("name")) == "情景对话题") {
      if (i == 0) {
        return "Dialogue One";
      }

      if (i == 1) {
        return "Dialogue Two";
      }
      if (i == 2) {
        return "Dialogue three";
      }
    }

    if ((k || k.get("name")) == "阅读理解") {
      if (i == 0) {
        return "Passage One";
      }

      if (i == 1) {
        return "Passage  Two";
      }
      if (i == 2) {
        return "Passage three";
      }
      if (i == 3) {
        return "Passage Four";
      }
    }
  }

  /* 鼠标离开事件 */
  mouseOut() {
    //  alert("请勿离开考试页面");
    console.log("move");
  }

  initCamera() {
    console.log("initCamera");

    let opt: any = {
      video: true,
      audio: false,
    };
    // navigator.mediaDevices
    //   .getUserMedia(opt)
    //   .then(function (mediaStream) {
    //     var video = document.querySelector("video");
    //     console.log(video, this.videoObj);
    //     video.srcObject = mediaStream;
    //     video.controls = false;
    //     video.onloadedmetadata = function (e) {
    //       video.play();
    //     };
    //   })
    //   .catch(function (err) {
    //     console.log(err.name + ": " + err.message);
    //   });
  }

  /* 窗口捕获 */
  async windowCaptrue() { }

  showConfirm(el): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: "提示",
      nzContent: "确认提交答卷？",
      nzOnOk: () => {
        this.saveLog();
      },
      nzOnCancel: () => {
        this.saveLoading = false;
      },
    });
  }

  pageModal: boolean = false;
  toPage() {
    localStorage.removeItem("startTime");
    localStorage.removeItem("timer");
    Parse.User.logOut();
    localStorage.removeItem("profile");
    this.router.navigate([
      "/english/login",
      { did: this.profile.department["objectId"] },
    ]);
  }

  /* ------------- 提交答卷 ----------------- */

  exportHref: string;
  exprotDown: string;
  /* 导出记录 题目objectId 答案 答题人信息*/
  async exportLog(e?) {
    let slog = this.slog;
    let topics = [];
    this.allTopic["singleTopic"].forEach((single) => {
      let answer = "";
      single.options.forEach((option) => {
        if (option.label == single.answer) {
          answer = option.value;
        }
      });
      topics.push({
        num: single.num,
        objectId: single.objectId,
        label: single.answer,
        answer: answer,
        score: single.score,
      });
    });
    this.allTopic["textTopic"].forEach((text) => {
      topics.push({
        num: text.num,
        objectId: text.objectId,
        answer: text.answer,
        score: text.score,
      });
    });
    this.exportData["department"] = this.department;
    this.exportData["user"] = this.userId;
    this.exportData["profile"] = this.profile.objectId;
    this.exportData["topics"] = topics;
    let data = JSON.stringify(this.exportData);
    const a = document.createElement("a");
    let blob = new Blob([data]);
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = `${this.profile.name}${this.profile.idcard}.json`;
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);

    // await this.fileService.download(`${this.profile.name}${this.profile.idcard}.json`).subscribe( blob => {

    // })
    // var aLink = document.createElement('a');
    // var blob = new Blob([data]);
    // var evt = document.createEvent("HTMLEvents");
    // evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
    // aLink.download = `${this.profile.name}${this.profile.idcard}.json`;
    // aLink.href = URL.createObjectURL(blob);
    // aLink.dispatchEvent(evt);

    // let link = this.eleRef.nativeElement.querySelector(idname)
    // let link = document.getElementById(idname);
    // console.log(link);
    // let data = JSON.stringify(this.exportData)
    // let blob = new Blob([data]); //  创建 blob 对象
    // link.setAttribute("href", URL.createObjectURL(blob)); //  创建一个 URL 对象并传给 a 的 href
    // link.setAttribute("download", `${this.profile.name}${this.profile.idcard}.json`);
  }
  /* 退出全屏  */
  exitFullScreen(el) {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document["msExitFullscreen"]) {
        document["msExitFullscreen"]();
      } else if (document["mozCancelFullScreen"]) {
        document["mozCancelFullScreen"]();
      } else if (document["webkitCancelFullScreen"]) {
        document["webkitCancelFullScreen"]();
      }
    }
    // document.exitFullscreen() || document['msExitFullscreen']() || document['mozCancelFullScreen']() || document['webkitCancelFullScreen']();
    this.router.navigate(["/english/login", { did: this.department }]);
  }
  /* ------------- 提交答卷 END ----------------- */

  /* 确认码 */
  pageVerify: boolean = true;
  code: string = "";
  codes: Array<string> = ["", "", "", "", "", ""];
  isLoad: boolean = false;
  // inputNumOnly(event) {
  //   if (!(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39)) {
  //     if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
  //       event.returnValue = false;
  //     }
  //     if (event.value && event.value.length >= 6) {
  //       event.returnValue = false;
  //     }
  //   }
  // }
  keyupHandler(e, index) {
    let keyCode = e.keyCode;
    let keyi = e.code;
    let key = e.key;
    if (
      (48 <= keyCode && keyCode <= 57) ||
      (96 <= keyCode && keyCode <= 105) ||
      key == "Backspace" ||
      key == "Enter"
    ) {
      if (
        (48 <= keyCode && keyCode <= 57) ||
        (96 <= keyCode && keyCode <= 105)
      ) {
        this.codes[index] = key;
        if (this.codes[index] && this.codes[index].length > 1) {
          this.codes[index] = this.codes[index].slice(0, 1);
        }
        if (index == 0) {
          this.eleRef.nativeElement.querySelector("#code1").focus();
        }
        if (index == 1) {
          this.eleRef.nativeElement.querySelector("#code2").focus();
        }
        if (index == 2) {
          this.eleRef.nativeElement.querySelector("#code3").focus();
        }
        if (index == 3) {
          this.eleRef.nativeElement.querySelector("#code4").focus();
        }
        if (index == 4) {
          this.eleRef.nativeElement.querySelector("#code5").focus();
        }
        if (index == 5) {
          this.eleRef.nativeElement.querySelector("#code5").focus();
        }
      }
      if (key == "Backspace") {
        if (index == 0) {
          this.eleRef.nativeElement.querySelector("#code0").focus();
        }
        if (index == 1) {
          this.eleRef.nativeElement.querySelector("#code0").focus();
        }
        if (index == 2) {
          this.eleRef.nativeElement.querySelector("#code1").focus();
        }
        if (index == 3) {
          this.eleRef.nativeElement.querySelector("#code2").focus();
        }
        if (index == 4) {
          this.eleRef.nativeElement.querySelector("#code3").focus();
        }
        if (index == 5) {
          this.eleRef.nativeElement.querySelector("#code4").focus();
        }
      }
      if (key == "Enter" && index == 5) {
        this.isLoad = true;
        this.getVerify();
      }
    } else {
      this.codes[index] = "";
      return false;
    }
    console.log(this.codes);
    // if (this.code.length === 6) {
    //   document.getElementById("btn-submit-form").style.display = "block";
    // }
  }
  async getVerify() {
    let codes = this.codes.join("");
    if (
      this.surveyInfo.get("verifyCode") &&
      this.surveyInfo.get("verifyCode") == codes
    ) {
      await this.saveExamSign();
      this.isLoad = false;
      this.pageVerify = false;
      this.message.success("确认码校验成功");
    } else {
      this.message.error("确认码校验错误，请重新输入");
      this.codes.forEach((code, index) => (this.codes[index] = ""));
      this.isLoad = false;
      this.eleRef.nativeElement.querySelector("#code0").focus();
    }
  }
  async saveExamSign() {
    let ExamSign = Parse.Object.extend("ExamSign");
    let examSign = new ExamSign();
    examSign.set({
      company: {
        __type: "Pointer",
        className: "Company",
        objectId: this.profile.company.objectId,
      },
      department: {
        __type: "Pointer",
        className: "Department",
        objectId: this.profile.school,
      },
      sclass: {
        __type: "Pointer",
        className: "SchoolClass",
        objectId: this.profile.schoolClass.objectId,
      },
      exam: {
        __type: "Pointer",
        className: "Exam",
        objectId: this.surveyInfo.id,
      },
      profile: {
        __type: "Pointer",
        className: "Profile",
        objectId: this.profile.objectId,
      },
    });
    if (this.slog && this.slog.id) {
      examSign.set("surveyLog", {
        __type: "Pointer",
        className: "SurveyLog",
        objectId: this.slog.id,
      });
    }
    let sign = await examSign.save();
    if (sign && sign.id) {
      return true;
    } else {
      return false;
    }
  }
}
