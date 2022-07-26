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
import { L } from "src/typing";
import { AuthService } from "../../services/auth.service";
import { screenService } from "../../services/screen.service";
// import electron from "electron";
// import {countdown} from "../../services/countdown.service";

// @countdown
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
  type: string; // 考试抽题方式
  // 答题状态  complete 已答题  uncomplete 未答题
  complete: boolean = true;
  uncomplete: boolean = false;
  allAnswer: boolean = false;
  // 试卷信息
  test: any = [];
  // // 单选题集合
  // singleTopic: any = [];
  radioValue: "";
  surveyLog: any;// 答卷记录
  slog: any; // 答题后记录待导出
  label: any = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  totalScore: number = 0;
  right: number = 0;
  wrong: number = 0;
  empty: number = 0;
  // 试卷题目数组
  testItem: any = [];
  multiScore: any;
  singleScore: any;
  multiRight: any;
  singleRight: any;
  sComplete: string = "answer";
  // 简答题答案集合
  textAnswerArray: any = {};
  video: HTMLElement;
  exam: Parse.Object<Parse.Attributes>;
  allTopic: { singleTopic: any[]; textTopic: any[] };
  shortMap: any = {};
  testMap: any = {};
  loadComplete: boolean;
  isElectron: string = "false";//exe

  @ViewChild("video") videoObj: any;
  errCount: number = 0;

  // userId: string;
  pageType: string;// recover 续考
  scoreMap: any = {
    total: '',
    select: '',
    text: '',
    klist: []
  }
  kidArr: Array<string> = []

  /* 考试数据*/

  /* 基础数据 */
  profile: any;
  department: string;
  company: any;
  examId: string; // 考试id
  survey: any; //题库


  /* 考试初始化 答题集合 */
  surveyAnswer: any;// 考试答题记录表
  topicArr: any = [];// 题组结构  抽题 =》 题型、题目 [[]]
  answerMap: any = {
    "total": 0,
    "select": 0,
    "text": 0
  };// 题组记录集合  各题型分数记录
  answerLog: any = {
    "select": {},
    "text": {}
  };// 答题记录集合
  options: any; // 抽题规则


  /* 考试时间 */
  duration: any;// exam => time   考试时长
  deadline: any = null;// 截止时间  countdown
  beginTime: any;// 考试开始时间


  /* 模态框 */
  confirmModal?: NzModalRef;
  timeOutModal?: NzModalRef;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private eventManager: EventManager,
    private http: HttpClient,
    private message: NzMessageService,
    private eleRef: ElementRef,
    private cdRef: ChangeDetectorRef,
    private authServ: AuthService,
    private elementRef: ElementRef,
    private screenServ: screenService
  ) { }

  //   1、启用的考试 Exam
  //   2、这一次的考试 抽题规则 Exam => options
  //   3、本次考试的所使用的题库 Survey
  nowTime: any;
  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.isElectron = localStorage.getItem("isElectron");
      if (this.isElectron == 'true') {
        this.screenServ.initElectronRender()
      }
      // this.sComplete = 'success'
      // this.loadComplete = true;
      // return

      // let isFullscreen = document.fullscreenElement;
      // if (!isFullscreen) { //进入全屏,多重短路表达式
      //   document.documentElement.requestFullscreen()
      // }
      // this.userId = Parse.User.current().id;
      this.company = localStorage.getItem("company");
      this.department = localStorage.getItem("department");
      this.testId = params.get("sid");
      this.examId = params.get("eid");
      this.pageType = params.get("type");
      if (this.examId) {
        // 需要答完题目 才能交卷
        this.allAnswer = true;
        // let profileId = localStorage.getItem("profile");
        // this.profile = await this.getProfile(profileId);
        (this.profile as any) = JSON.parse(localStorage.getItem("profile"));
        this.profile.school = this.profile.department["objectId"];
        // 考试权限判断
        let auth = await this.authControl()
        if (auth) {
          // 开始倒计时
          this.beginCountDown()
          // 获取考试及考试抽题规则
          await this.initExam()
        }

      }
      // this.initCamera();
      // this.windowCaptrue();
    });
    this.totalScore = 0;
  }

  async checkAnswerMap() {
    let SurveyAnswer = new Parse.Query("SurveyAnswer");
    SurveyAnswer.equalTo("profile", this.profile.objectId);
    SurveyAnswer.equalTo("exam", this.examId);
    let answer = await SurveyAnswer.first();
    if (answer && answer.id) {
      return answer;
    }
  }
  async setAnswerMap() {
    let startTime = new Date();
    let saveA = Parse.Object.extend("SurveyAnswer")
    let answer = new saveA();
    answer.set("company", {
      __type: "Pointer",
      className: "Company",
      objectId: this.profile.department["company"].objectId,
    });
    answer.set("profile", {
      __type: "Pointer",
      className: "Profile",
      objectId: this.profile.objectId,
    });
    answer.set("exam", {
      __type: "Pointer",
      className: "Exam",
      objectId: this.examId,
    });
    answer.set("answerMap", this.answerMap);
    answer.set("answerLog", this.answerLog);
    answer.set("topicArr", this.topicArr);
    let res = await answer.save()
    console.log(res);
    return res;

  }


  async initExam() {
    let exam = await this.getExam();
    this.exam = exam;
    this.duration = exam.get("time");
    this.options = exam.get("options");// 获取考试抽题规则
    this.survey = this.loadSurvey(exam.get("survey"));
    this.type = exam.get("type");
    console.log(this.exam);
    if (this.survey) {
      // 如果题库有抽题规则  替换考试抽题规则
      if (this.survey.get("options")?.length) this.options = this.survey.get("options")
      console.log(this.survey);
      console.log(this.type, this.options);
      await this.getKonwLedges(this.options);
      // 开始抽题
      // surveyAnswer 如果 surveyAnswer 存在  续考
      let surveyAnswer = await this.checkAnswerMap()
      switch (true) {
        /* 随机抽题  续考情况下根据答卷记录存储的题目id进行抽题 */
        case this.type == 'random' && !surveyAnswer:
          console.log(this.survey);
          await this.getRandomItems();
          console.log(this.test);
          if (this.test && this.test.length == this.options.length) {
            this.optionRandomOrder(this.type);
            this.topicClassify();
            this.loadComplete = true;
          }

          break;
        // 顺序抽题
        case this.type == "complete" && !surveyAnswer:
          await this.getOrderItems();
          await this.optionRandomOrder(this.type);
          this.topicClassify();
          console.log(this.test);
          break;
        // 续考
        case !!surveyAnswer:
          this.surveyAnswer = surveyAnswer;
          let answerMap = surveyAnswer.get("answerMap");
          let answerLog = surveyAnswer.get("answerLog");
          let topicArr = surveyAnswer.get("topicArr");
          this.answerMap = this.deepClone(answerMap)
          this.answerLog = this.deepClone(answerLog)
          this.topicArr = this.deepClone(topicArr)
          await this.getTopicsByTopicLog()

          await this.optionRandomOrder(this.type);
          await this.topicClassify();
          this.loadComplete = true;
          console.log(this.test);
          break;
        default:
          break;
      }
    }
  }

  // 检查是否已加入考场
  async authControl() {
    if (!this.profile || !this.profile.schoolClass) {
      this.message.create("info", "未分配考场，无法进入考试");
      window.history.go(-1);
      return false;
    }
    let log = await this.getSurveyLog(this.profile.objectId)
    if (log && log.id) {
      this.message.create("info", "已提交答卷，请勿重复考试");
      window.history.go(-1);
      return false
    }
    return true;
  }


  // 检查是否已提交过答卷
  async checklog() {
    let checked = await this.checkSurveyLog(this.profile.objectId);
    return true;
  }
  async checkSurveyLog(profileId) {
    let log = await this.getSurveyLog(profileId)
    if (log.get("submitted")) {
      return false
    } else {
      this.surveyLog = log;
      return true
    }
  }
  async getSurveyLog(profileId) {
    let SurveyLog = new Parse.Query("SurveyLog");
    SurveyLog.equalTo("profile", profileId);
    SurveyLog.equalTo("exam", this.examId);
    let log = await SurveyLog.first();
    if (log && log.id) {
      return log;
    }
  }

  async getExam() {
    let Exam = new Parse.Query("Exam");
    Exam.include("survey");
    let exam = await Exam.get(this.examId);
    if (exam && exam.id) {
      return exam;
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
  knowsMap: any = {}
  async getKonwLedges(options?) {
    this.knowledges = [];
    if (options) {
      for (let index = 0; index < options.length; index++) {
        let knowledge = options[index].knowledge;
        let Knowledge = new Parse.Query("Knowledge");
        let know = await Knowledge.get(knowledge);
        if (know && know.id) {
          this.knowledges.push(know);
          this.kidArr.push(know.id)
          this.knowsMap[know.id] = know.get("type")
          /* scoreMap相关 */
          // this.scoreMap['klist'].push({
          //   kid: know.id,
          //   grade: 0,
          //   tlist: []
          // })
          /* scoreMap相关 */
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
  topicLog: any = []
  /* 随机抽题 */
  getRandomItems() {
    return new Promise(async (resolve, reject) => {
      let options = this.options;// 抽题规则
      // 题库 this.survey
      let sid = this.survey.id;
      let count = 0;// 题目数量
      this.answerMap['klist'] = []
      for (let index = 0; index < options.length; index++) {
        let option = options[index];
        let knowledge = option.knowledge;
        let diffkeys = Object.keys(option.complexity)// ['easy','normal','difficulty']
        /* 题组记录集合组装1 题型 */
        this.answerMap['klist'].push({
          kid: knowledge,
          grade: 0,
          tlist: []
        })
        let topics = []// 题型下所有题目
        /* ------ end ------ */
        for (let i = 0; i < diffkeys.length; i++) {
          let key = diffkeys[i];
          if (option.complexity[key]) {
            let sql = `with recursive rel_tree as (
            (select "sitem".* from
                (select *,jsonb_array_elements("knowledge")::json->>'objectId' as "kId" from "SurveyItem"  where "parent" is null ) as "sitem"
              LEFT JOIN "Knowledge" as "know" on "sitem"."kId" = "know"."objectId"
              where  "know"."objectId" = '${knowledge}'  and "sitem"."difficulty" ='${key}'
              and "sitem"."isDeleted" is not true and "sitem"."isEnabled" is true and "sitem"."survey"='${sid}'
              order by random() desc limit ${option.complexity[key]})
            union all
            select  c.* ,jsonb_array_elements("c"."knowledge")::json->>'objectId' as kid2
            from "SurveyItem" c  join rel_tree p on c."parent" = p."objectId"
          ) select * from rel_tree`;
            let sqlData: any = await this.novaSelect(sql);
            topics = topics.concat(sqlData.data);
          }
        }
        count += topics.length;
        if (topics.length) {
          let { tlist, returnTopics } = await this.compTopic(topics, index)// 按父子结构组合题目并存好答题记录集合
          topics = returnTopics;
          this.answerMap['klist'][index]['tlist'] = tlist
          /* 组卷 */
          this.test[index] = {
            id: knowledge,
            SurveyItem: topics,
            type: topics[0].type,
          }
        }
      }
      let surveyAnswer = await this.setAnswerMap()
      this.surveyAnswer = surveyAnswer;
      this.answerMap = this.deepClone(surveyAnswer.get("answerMap"))
      this.answerLog = this.deepClone(surveyAnswer.get("answerLog"))
      resolve(true)
    })

  }

  deepClone(target) {
    let result;
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === 'object') {
      // 如果是一个数组的话
      if (Array.isArray(target)) {
        result = []; // 将result赋值为一个数组，并且执行遍历
        for (let i in target) {
          // 递归克隆数组中的每一项
          result.push(this.deepClone(target[i]))
        }
        // 判断如果当前的值是null的话；直接赋值为null
      } else if (target === null) {
        result = null;
        // 判断如果当前的值是一个RegExp对象的话，直接赋值
      } else if (target.constructor === RegExp) {
        result = target;
      } else {
        // 否则是普通对象，直接for in循环，递归赋值对象的所有值
        result = {};
        for (let i in target) {
          result[i] = this.deepClone(target[i]);
        }
      }
      // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
      result = target;
    }
    // 返回最终结果
    return result;
  }
  topicMap: any = {}
  // 组合题目
  async compTopic(topics, index?) {
    let topicMap = {}
    let returnTopics = []
    let answerLog = this.answerLog
    let tlist = []
    topics.forEach((topic, i) => {
      // sql查询时已确保父级题目在前 所以可直接判断parent是否存在
      /* 题组记录集合组装2 父级题目 */
      if (!topic['parent']) {
        if (index != undefined) {// 随机抽题
          // 抽题记录  只存父级题目
          if (!this.topicArr[index]) this.topicArr[index] = []
          this.topicArr[index].push(topic.objectId)
          tlist.push({
            tid: topic.objectId,
            child: []
          })
        }
        // else {// 整套抽题
        //   this.topicArr[i].push(topic.objectId)
        //   tlist.push({
        //     tid: topic.objectId,
        //     child: []
        //   })
        // }
      } else {
        if (topic['parent']) {
          // 找到topic的parent的位置
          let tIndex = tlist.findIndex(t => t.tid == topic['parent'])
          tlist[tIndex].child.push({ tid: topic.objectId })

        }
      }
      /* ------ end ------ */



      /* 组装父子题目  将题目id存入答题记录对象、题组记录对象 还原答题记录 */
      // 1、组装父子题目
      topicMap[topic.objectId] = topic
      this.topicMap[topic.objectId] = topic
      if (topicMap[topic['parent']]) {
        if (!topicMap[topic['parent']]['childrenitem']) topicMap[topic['parent']]['childrenitem'] = []
        topicMap[topic['parent']]['childrenitem'].push(topic)
        // 子级题目排序
        topicMap[topic['parent']]['childrenitem'].sort((a, b) => {
          return a.index - b.index
        })
      }
      // 2、将题目id存入答题记录对象
      if (topic.type == "text") {
        this.answerLog['text'][topic.objectId] = answerLog['text'][topic.objectId] || "";
      } else {
        if ((!topic.parent && topic.type != 'complex') || topicMap[topic.parent]) {// 非简答题：非组合题父级题目/子级题目
          this.answerLog['select'][topic.objectId] = answerLog['select'][topic.objectId] || "";
        }
      }
      // 3、将topicMap中parent不存在的题目都返回出去 就是一个父子结构的题目数组
      if (!topic.parent) {
        returnTopics.push(topicMap[topic.objectId])
      }
    })


    return {
      tlist,
      returnTopics
    }
  }
  /* 续考 根据答卷记录还原题目及答题内容 */
  async getTopicsByTopicLog() {
    let answerMap = this.answerMap
    let answerLog = this.answerLog
    let topicArr = this.topicArr
    // let topicIdArr = this.surveyLog.get("topicLog")
    // let answer = this.surveyLog.get("answer")
    // let shortAnswer = this.surveyLog.get("shortAnswer")
    let tempArr = []
    // topicIdArr.forEach((arr, index) => {
    //   arr.forEach(topicId => {
    //     tempArr.push(topicId)
    //   });
    // });
    topicArr.forEach((k, index) => {
      if (k.length) {
        k.forEach(t => {
          tempArr.push(t)
        });
      }
    })
    let sqlParams = (tempArr.map(item => `'${item}'`).toString());
    let sql = `with recursive rel_tree as (
      (select "sItem".* from "SurveyItem" as "sItem"
      where "sItem"."parent" is null   and "sItem"."objectId" in (${sqlParams}) order by "sItem"."parent" desc )
      union all
      select  c.*  from "SurveyItem" c  join rel_tree p on c."parent" = p."objectId"
    ) select * from rel_tree `
    // 获取所有题目
    let topics: Array<any> = [];
    topics = (await this.novaSelect(sql))['data']
    console.log(topics);
    let topicMap = {}

    // 组装父子题目  将题目id存入答题记录对象 还原答题记录
    topics.forEach(topic => {
      if (topic.type == "text") {
        this.answerLog['text'][topic.objectId] = answerLog['text'][topic.objectId] || "";
      } else {
        if ((!topic.parent && topic.type != 'complex') || topicMap[topic.parent]) {
          this.answerLog['select'][topic.objectId] = answerLog['select'][topic.objectId] || "";
        }
      }
      topicMap[topic.objectId] = topic
      this.topicMap[topic.objectId] = topic
      if (topicMap[topic['parent']]) {
        if (!topicMap[topic['parent']]['childrenitem']) topicMap[topic['parent']]['childrenitem'] = []
        topicMap[topic['parent']]['childrenitem'].push(topic)
        topicMap[topic['parent']]['childrenitem'].sort((a, b) => {
          return a.index - b.index
        })
      }
    })

    /* 组装试卷题型及对应题目 */
    // topicIdArr.forEach((arr, index) => {
    //   arr.forEach(topicId => {
    //     let topic = topicMap[topicId]
    //     if (!this.test[index]) this.test[index] = {
    //       id: topic.knowledge[0].objectId,
    //       type: topic.type,
    //     };
    //     if (!this.test[index].SurveyItem) this.test[index].SurveyItem = []
    //     this.test[index].SurveyItem.push(topicMap[topicId])
    //   });
    // });

    topicArr.forEach((k, index) => {
      if (k.length) {
        k.forEach(t => {
          let topic = topicMap[t]
          if (!this.test[index]) this.test[index] = {
            id: topic.knowledge[0].objectId,
            type: topic.type,
          };
          if (!this.test[index].SurveyItem) this.test[index].SurveyItem = []
          this.test[index].SurveyItem.push(topicMap[t])
        })
      }
    })

  }

  // 一整套题，没有抽题规则
  async getOrderItems() {
    //   整套出题
    // 题库 this.survey
    let sid = this.survey.id;
    /* 题组记录集合组装1 题型 */
    this.answerMap['klist'] = []
    let topics = []// 题目数组
    let sql = `with recursive rel_tree as (
      (select * from "SurveyItem" as "sitem"
        where "parent" is null and "sitem"."isDeleted" is not true and "sitem"."isEnabled" is true and "sitem"."survey"='${sid}'
        order by "sitem"."index" asc )
      union all
      select  c.*  from "SurveyItem" c  join rel_tree p on c."parent" = p."objectId"
    ) select * from rel_tree`;
    let sqlData: any = await this.novaSelect(sql);
    if (sqlData.data.length) {
      topics = topics.concat(sqlData.data);
      console.log(topics);
      let count = topics.length;// 题目数量
      await this.compTopic2(topics)// 按父子结构组合题目并存好答题记录集合
      console.log(this.test);
      let surveyAnswer = await this.setAnswerMap()
      this.surveyAnswer = surveyAnswer;
      this.answerMap = this.deepClone(surveyAnswer.get("answerMap"))
      this.answerLog = this.deepClone(surveyAnswer.get("answerLog"))
      this.loadComplete = true;
    }

  }
  /* 组合答题记录answerMap、answerLog 组题记录 topicArr 试卷 test */
  compTopic2(topics) {
    return new Promise((resolve, reject) => {
      let answerLog = this.answerLog
      this.knowledges.forEach((knowledge, index) => {
        let tlist = []
        let topicMap = {}
        topics.forEach((topic, i) => {
          /* 1、题目与题型对应 */
          if (topic.knowledge[0].objectId == knowledge.id) {
            /* 2、组题记录组装   topicArr:[[tid...]]
            * sql查询时已确保父级题目在前 所以可直接判断parent是否存在
            */
            if (!topic['parent']) {
              if (!this.topicArr[index]) this.topicArr[index] = []
              this.topicArr[index].push(topic.objectId)
            }
            // 3、将题目id存入答题记录对象 answerLog
            if (topic.type == "text") {
              this.answerLog['text'][topic.objectId] = answerLog['text'][topic.objectId] || "";
            } else {
              if ((!topic.parent && topic.type != 'complex') || topicMap[topic.parent]) {// 非简答题：非组合题父级题目/子级题目
                this.answerLog['select'][topic.objectId] = answerLog['select'][topic.objectId] || "";
              }
            }
            /* 4、组装父子题目  将题目id存入答题记录对象并组卷 */
            this.topicMap[topic.objectId] = topic;// 所有题目map对象

            // 4.1、组装父子题目
            if (!topic['parent']) {
              topicMap[topic.objectId] = topic;
            }
            if (topicMap[topic['parent']]) {
              if (!topicMap[topic['parent']]['childrenitem']) topicMap[topic['parent']]['childrenitem'] = []
              topicMap[topic['parent']]['childrenitem'].push(topic)
              // 4.2、子级题目排序
              topicMap[topic['parent']]['childrenitem'].sort((a, b) => {
                return a.index - b.index
              })
            }
            if (!topic['parent']) {
              /* 4.3 整套抽题 父级题目依照index进行排序 */
              tlist.push(topicMap[topic.objectId])
              /* 5、答题记录 */
              if (!this.answerMap['klist'][index]) {
                this.answerMap['klist'][index] = {
                  kid: knowledge.id,
                  grade: 0,
                  tlist: []
                }
              }
              this.answerMap['klist'][index]['tlist'].push({
                tid: topic.objectId,
                child: []
              })
            } else {
              let tIndex = this.answerMap['klist'][index]['tlist'].findIndex(t => t.tid == topic['parent'])
              this.answerMap['klist'][index]['tlist'][tIndex].child.push({ tid: topic.objectId })
            }
          }
        })
        /* 组卷2 test */
        if (!this.test[index]) {
          this.test[index] = {
            id: knowledge.id,
            SurveyItem: [],
            type: tlist[0].type,
          }
        }
        this.test[index].SurveyItem = tlist
        console.log(this.test[index].SurveyItem);
        if (index + 1 == this.knowledges.length) {
          console.log(this.test);
          resolve(true)
        }
      })

    })
  }


  /* ****** 答题触发事件 BEGIN ****** */
  radioChange(topic) {
    let selectScore = this.computeScore()
    let scoreMap = this.answerMap
    scoreMap.total = selectScore
    scoreMap.select = selectScore
    let knowId = topic.knowledge[0].objectId
    let topicId = topic.objectId
    let option = topic.options.filter(option => {
      return option.check == true
    })[0];
    let answer = option.value
    let score = +option.grade
    let kIndex = this.kidArr.indexOf(knowId)
    scoreMap['klist'][kIndex]['tlist'].map(t => {
      if (t.tid == topicId) {
        t.answer = answer
        t.reply = this.answerLog['select'][topicId]
        t.score = score
        if (t.grade) {
          scoreMap['klist'][kIndex].grade -= score
          t.grade = 0
        } else {
          if (answer == this.answerLog['select'][topicId]) {
            t.grade = score
            scoreMap['klist'][kIndex].grade += score
          } else {
            t.grade = 0
          }
        }
      }
      if (t.tid == topic.parent) {
        t.child.forEach((c, cIndex) => {
          if (c.tid == topicId) {
            t.child[cIndex].answer = answer
            t.child[cIndex].reply = this.answerLog['select'][topicId]
            t.child[cIndex].score = score
            if (t.child[cIndex].grade) {
              scoreMap['klist'][kIndex].grade -= score
              t.child[cIndex].grade = 0
            } else {
              if (answer == this.answerLog['select'][topicId]) {
                t.child[cIndex].grade = score
                scoreMap['klist'][kIndex].grade += score
              } else {
                t.child[cIndex].grade = 0
              }
            }
          }
        })
      }
      return t
    });
    this.answerMap = scoreMap;
  }
  textChange(topic) {
    let topicId = topic.objectId
    let knowId = topic.knowledge[0].objectId
    let kIndex = this.kidArr.indexOf(knowId)
    let score = +topic.score;
    this.answerMap['klist'][kIndex]['tlist'].map(t => {
      if (t.tid == topicId) {
        t.answer = topic.answer
        t.reply = this.answerLog['text'][topicId]
        t.score = score
        t.grade = 0
      }
      return t
    });

  }

  checkboxChange(e: Array<string>, index: number, item) {
    // this.testMap[item.objectId] = e;
  }

  setScoreMap() {
    let scoreMap = this.surveyLog.get("scoreMap")
    if (!scoreMap) scoreMap = {}
    return scoreMap;
  }
  /* ****** 答题触发事件 END ****** */

  /* ****** 答题记录、算分 BEGIN ****** */
  realOldLog = null
  async checkAnswer() {
    let flag = true
    let map = this.answerLog;
    // 解决this.surveyAnswer.get("answerLog") 同步更新问题
    let oldmap = this.realOldLog || this.surveyAnswer.get("answerLog")
    this.realOldLog = JSON.parse(JSON.stringify(oldmap))
    console.log(this.answerLog)
    console.log(this.realOldLog)
    for (let key in map['select']) {
      let newvalue = map['select'][key];
      let oldvalue = oldmap['select'][key]
      if (newvalue != oldvalue && flag) {
        flag = false
        break;
      }
    }
    for (let key in map['text']) {
      let newvalue = map['text'][key];
      let oldvalue = oldmap['text'][key]
      if (newvalue != oldvalue && flag) {
        flag = false
        break;
      }
    }
    if (!flag) {
      console.log(this.answerMap, map);
      this.surveyAnswer.set("answerMap", this.answerMap)
      this.surveyAnswer.set("answerLog", map)
      this.surveyAnswer = await this.surveyAnswer.save()
      this.realOldLog = JSON.parse(JSON.stringify(map))
      console.log(this.surveyAnswer);
    }
  }
  computeScore() {
    let singleTopic = this.allTopic.singleTopic; /* 所有单选题 */
    let testMap = this.testMap; /* 单选题选择的答案 */
    let shortMap = this.shortMap; /* 填空题填写的答案 */
    let answerLog = this.answerLog; /* 答题集合 */
    /* 将所有单选题正确答案提取出来 */
    let singCorrectMap = {};
    for (let index = 0; index < singleTopic.length; index++) {
      let sItem = singleTopic[index];
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
    let correctNum = 0;// 正确个数
    let score = 0;// 客观题（选择题）得分
    for (let tKey in answerLog['select']) {
      let sitem = singCorrectMap[tKey];
      if (sitem && sitem.value && sitem.value == answerLog['select'][tKey]) {
        if (sitem.score) {
          score += Number(singCorrectMap[tKey].score);
        }
        correctNum++;
      }
    }
    console.log("答对个数：%s", correctNum);
    console.log("得分：%s", score);
    return score

  }



  /* ****** 答题记录、算分 END ****** */
  async setSlog() {
    let subjectiveScore = 0;
    let objectiveScore = 0;
    this.answerMap['klist'].forEach(k => {
      if (this.knowsMap[k.kid]) {
        switch (this.knowsMap[k.kid]) {
          case 'subjective':
            subjectiveScore += k.grade
            break;
          case 'objective':
            objectiveScore += k.grade
            break;
          default:
            break;
        }
      }
    })
    let score = this.answerMap.total
    let saveL = Parse.Object.extend("SurveyLog")
    let log = new saveL();
    if(this.answerLog["text"] != ""){
      log.set("shortAnswer", this.answerLog["text"]);
    }
    log.set("answer", this.answerLog["select"]);
    log.set("subjectiveScore", subjectiveScore)
    log.set("objectiveScore", objectiveScore)
    log.set("singleScore", score);
    log.set("company", {
      __type: "Pointer",
      className: "Company",
      objectId: this.profile.department["company"].objectId,
    });
    // log.set("user", {
    //   __type: "Pointer",
    //   className: "_User",
    //   objectId: this.userId,
    // });
    log.set("department", {
      __type: "Pointer",
      className: "Department",
      objectId: this.profile.department.objectId,
    });
    log.set("departments", [
      {
        __type: "Pointer",
        className: "Department",
        objectId: this.profile.department.objectId,
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
    log.set("beginTime", this.surveyAnswer.get("createdAt"));// 开始考试时间  待检测
    // log.set("scoreMap", this.scoreMap);
    // log.set("topicLog", this.topicLog);
    console.log(this.answerLog);
    if (!this.answerLog['text'] || !Object.keys(this.answerLog['text']).length) {
      console.log('grade');
      log.set("grade", score);
    }
    let endTime = new Date();
    log.set("endTime", endTime);
    log.set("submitted", true);
    let res = await log.save()
    console.log(res);
    return res;

  }







  /* ******** CountDown Begin ******** */
  // 倒计时提示时间  分钟
  tipTime: number = 5;
  // 倒计时提示弹窗
  tipModal: boolean = false;
  /* 获取倒计时时间 deadline =>考场结束时间  */
  beginCountDown() {
    this.beginTime = this.profile.schoolClass.beginTime.iso;
    this.deadline = new Date(this.profile.schoolClass.endTime.iso);
    console.log(this.deadline);
  }
  /* 倒计时时间变化 */
  timeUpdate(event) {
    let format = event.format;
    switch (true) {
      // 截止时间剩余5分钟  弹窗提示
      case format.h == 0 && format.m == this.tipTime && format.s == 0:
        console.log('show tipModal');
        this.tipModal = true;
        break;

      default:
        break;
    }
  }
  /* 倒计时定时触发 timer timingTrigger */
  timingTrigger(event) {
    // console.log(event)
    // 每十秒(传入 timer 10) 检查答题记录
    this.checkAnswer()

  }
  /* 超时自动提交答题 */
  timeOut() {
    console.log('timeout');
    // if (this.exam.get("authCommit")) {
    this.message.warning("已超时，自动提交答题！！！");
    this.message.warning("已超时，自动提交答题！！！");
    this.message.warning("已超时，自动提交答题！！！");
    this.saveLog("timeOut");
    // }
  }

  /* ******** CountDown End ******** */
  /* 锚点定位 */
  anchor(num) {
    num = '#select' + num
    let divEle = this.elementRef.nativeElement.querySelector(num);
    divEle.scrollIntoView(true);
  }



  exportData: any;
  saveLoading: boolean = false;
  repeatModal: boolean = false;
  async saveLog(timeOut?) {
    let log = await this.getSurveyLog(this.profile.objectId);
    if (log && log.id) {
      this.repeatModal = true;
      return;
    }
    /* 是否到交卷时间 */
    console.log(this.exam.get("submitTimeAuth"));

    if (this.exam.get("submitTimeAuth")) {
      let noChecked = this.checkTime(this.exam.get("submitTimeAuth"))
      console.log(noChecked);

      if (noChecked) {
        this.message.warning(`距考试结束不超过${this.exam.get("submitTimeAuth")}分钟才可交卷`)
        return
      }
    }


    // let log = await this.getSurveyLog(this.profile.objectId);
    // if (log && log.id) {
    //   this.repeatModal = true;
    //   return;
    // }
    /* 是否作答完题目 */
    // function isBigEnough(element, index, array) {
    //   return (element >= 10);
    // }

    let checkedEmpty = await this.checkEmpty()
    if (!checkedEmpty && !timeOut) {
      this.message.error("请先作答完题目，再进行交卷");
      return;
    }
    this.saveLoading = true;
    await this.checkAnswer();
    log = await this.setSlog()
    this.exportData = {};
    if (log && log.id) {
      let score = this.answerMap.total;
      this.exportData = {
        shortAnswer: this.answerLog['text'],
        answer: this.answerLog['select'],
        singleScore: score,
        grade: score,
      };
      console.log(log);
      this.saveLoading = false;
      this.sComplete = "success";
      this.slog = log;
      this.errCount = 0;
    } else {
      if (this.errCount > 2) {
        this.sComplete = "fail";
      } else {
        this.saveLoading = false;
        this.errCount++;
        this.message.error("答卷提交失败，请稍后重试");
      }
    }
  }
  checkEmpty() {
    return new Promise((resolve, reject) => {
      // (selectComplete = Object.keys(this.answerLog['select']).filter(key => this.topicMap[key].type != 'complex')).every(key => this.answerLog['select'][key] != '')
      let selectComplete = Object.keys(this.answerLog['select']).every(key => this.answerLog['select'][key] != '')
      let textComplete = Object.keys(this.answerLog['text']).every(key => this.answerLog['text'][key].trim() != '')
      resolve(selectComplete && textComplete)
    })
  }
  checkTime(second) {
    let now: any = new Date().getTime()
    let time = 1000 * 60 * second;
    let end = this.deadline.getTime()
    let nochecked = end - now > time;
    return nochecked
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

  showNum(s) {
    return s.num ? s.num + "、" : "";
  }
  // 选项乱序
  async optionRandomOrder(type) {
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
                if (sItem.kname != "情景对话题" && type == 'random') {
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
              if (type == 'random') {
                sItem.options = this.shuffle(sItem.options);
              }
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
    this.authServ.logOut();
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
    // this.exportData["user"] = this.userId;
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
    // if (this.code.length === 6) {
    //   document.getElementById("btn-submit-form").style.display = "block";
    // }
  }
  async getVerify() {
    let codes = this.codes.join("");
    if (
      this.exam.get("verifyCode") &&
      this.exam.get("verifyCode") == codes
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
        objectId: this.profile.department.objectId,
      },
      sclass: {
        __type: "Pointer",
        className: "SchoolClass",
        objectId: this.profile.schoolClass.objectId,
      },
      exam: {
        __type: "Pointer",
        className: "Exam",
        objectId: this.exam.id,
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




  closeWin() {
    this.screenServ.closeWin()
    // electron.ipcRenderer.sendSync('close-window')
  }
}
