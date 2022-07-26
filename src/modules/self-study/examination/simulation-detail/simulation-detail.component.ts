import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { fi_FI } from "ng-zorro-antd/i18n";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";

@Component({
  selector: 'app-simulation-detail',
  templateUrl: './simulation-detail.component.html',
  styleUrls: ['./simulation-detail.component.scss']
})
export class SimulationDetailComponent implements OnInit {
  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient
  ) { }
  log: any;
  survey: any;
  profile: any;
  knows: any[] = [];
  topics: any;
  detail: any = {};
  label: any = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  showAnaly: boolean = true; // 显示题目解析
  department: string;
  answerMap: any;// 答题记录
  topicArr: any = [];// 组题顺序
  logId;
  ngOnInit(): void {
    this.department = localStorage.getItem("department");
    console.log(this.department);
    this.activRoute.paramMap.subscribe(async (params) => {
      this.logId = params.get("id");
      console.log(this.logId)
      this.initData(this.logId);
    });
  }
  async initData(id) {
    let queryS = new Parse.Query("SurveyLog");
    queryS.include("survey");
    queryS.include("profile");
    let log = await queryS.get(id);
    console.log(log)
    if (log && log.id) {
      if (!this.department) {
        this.department = log.get("department")?.id;
      }
      // 模拟测试的数据, 答案
      this.log = log;
      this.survey = log.get("survey");
      this.profile = log.get("profile");
      // 获取题型,得分
      await this.getSurveyAnswer()
      // await this.queryKnows();
      // 获取该试卷中的题目及选项
      this.getSurveyDetail(log.get("survey").id);
      console.log(this.log, this.survey, this.profile, this.knows);
    }
  }
  /* 答题记录 */
  async getSurveyAnswer() {
    let queryA = new Parse.Query("SurveyAnswer");
    queryA.equalTo("profile", this.profile.id);
    let surveyAnswer = await queryA.first();
    console.log(surveyAnswer)
    if (surveyAnswer && surveyAnswer.id) {
      let answerMap = surveyAnswer.get("answerMap")
      this.topicArr = surveyAnswer.get("topicArr")
      answerMap.klist.map(async k => {
        let know = await this.queryKnow(k.kid);
        k.kname = know.get("name")
        return k
      })
      this.answerMap = answerMap;
      console.log(this.answerMap);

    }
  }

  async getSurveyDetail(logId) {
    console.log(logId)
    let sql = `select * from "SurveyItem" where "survey" = '${logId}' and "isDeleted" is not true order by "index" `
    console.log(sql);
    let topics = await this.novaSql(sql);
    console.log(topics);
    this.topics = topics;
  }

  async queryKnow(id) {
    let queryK = new Parse.Query("Knowledge");
    let know = await queryK.get(id);
    if (know && know.id) {
      return know;
    }
  }
  async queryKnows() {
    let queryK = new Parse.Query("Knowledge");
    queryK.equalTo("department", this.department);
    let knows = await queryK.find();
    if (knows && knows.length) {
      this.knows = knows;
    }
  }
  async getTopics(log) {
    console.log(new Date().getSeconds());
    let topicIdArr = [];
    let topics = [];
    let answer = log.get("answer");
    let shortAnswer = log.get("shortAnswer") || {};
    console.log(answer);
    console.log(shortAnswer);
    console.log(log);

    let selectIdArr = Object.keys(answer);
    console.log(selectIdArr);

    let textIdArr = Object.keys(shortAnswer);
    console.log(textIdArr);

    if (selectIdArr?.length) {
      selectIdArr.forEach((tId) => {
        topicIdArr.push(tId);
      });
    }
    if (shortAnswer?.length) {
      textIdArr.forEach((tId) => {
        topicIdArr.push(tId);
      });
    }
    let checkArr = new Set(topicIdArr);
    console.log(checkArr, topicIdArr.length);
    /*
      parse查询所有题目走完循环需要6秒  改用sql查询
      无父级
        未存入数组 存入
      有父级
        遍历数组 查找对应父级
          查找到 存入child
          未查找到 父级存入数组 存入child
    */
    console.log(topicIdArr);
    let idArr = topicIdArr.map((item) => `'${item}'`).toString();
    let sql = `select * from "SurveyItem" where "objectId" in (${idArr})`;
    console.log(sql);
    console.log(new Date().getSeconds());
    let sqlData = await this.novaSql(sql);
    console.log(new Date().getSeconds());
    console.log(sqlData);
    let topicMap = {};
    if (sqlData?.length) {
      for (let index = 0; index < sqlData.length; index++) {
        let item = sqlData[index];
        topicMap[item.objectId] = item;
      }
      for (let index = 0; index < sqlData.length; index++) {
        let topic = sqlData[index];
        let tIndex;
        if (
          !topic.parent &&
          topics.findIndex((item) => item.objectId == topic.objectId) < 0
        ) {
          topics.push(topic);
        } else if (topic.parent) {
          tIndex = topics.findIndex((item) => item.objectId == topic.parent);
          if (tIndex >= 0) {
            if (topics[tIndex].child) {
              topics[tIndex].child.push(topic);
            } else {
              topics[tIndex].child = [];
              topics[tIndex].child.push(topic);
            }
          } else {
            topics.push(topicMap[topic.parent]);
            tIndex = topics.findIndex((item) => item.objectId == topic.parent);
            topics[tIndex].child = [];
            topics[tIndex].child.push(topic);
            // let tIndex2 = topics.findIndex((item) => item.objectId == topic.parent);
            // topics[tIndex2].child = [];
            // topics[tIndex2].child.push(topic);
          }
        }
        if (index + 1 == sqlData.length) {
          console.log(topics);
          console.log(new Date().getSeconds());
          return topics;
        }
      }
    }
    // for (let index = 0; index < topicIdArr.length; index++) {
    //   let id = topicIdArr[index];
    //   let topic = await this.queryTopic(id);
    //   let tIndex;
    //   if (
    //     !topic.get("parent") &&
    //     topics.findIndex((item) => item.id == topic.id) < 0
    //   ) {
    //     topics.push(topic);
    //   } else if (topic.get("parent")) {
    //     tIndex = topics.findIndex((item) => item.id == topic.get("parent").id);
    //     if (tIndex >= 0) {
    //       if (topics[tIndex].child) {
    //         topics[tIndex].child.push(topic);
    //       } else {
    //         topics[tIndex].child = [];
    //         topics[tIndex].child.push(topic);
    //       }
    //     } else {
    //       topics.push(topic.get("parent"));
    //       topics[topics.length - 1].child = [];
    //       topics[topics.length - 1].child.push(topic);
    //     }
    //   }
    //   if (index + 1 == topicIdArr.length) {
    //     console.log(topics);
    //     console.log(new Date().getSeconds());

    //     return topics;
    //   }
    // }
  }
  async queryTopic(id) {
    let queryT = new Parse.Query("SurveyItem");
    queryT.include("parent");
    queryT.exclude("company", "survey");
    let topic = await queryT.get(id);
    if (topic && topic.id) {
      return topic;
    }
  }
  novaSql(sql): Promise<any> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL")
        ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select"
        : "https://server.fmode.cn/api/novaql/select";
      this.http.post(baseurl, { sql: sql }).subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          resolve(res.data);
        } else {
          this.message.info("网络繁忙，数据获取失败");
          reject(res);
        }
      });
    });
  }

  checkCort(topic, type?) {
    let options = topic.options;
    let selectVal = this.log.get("answer")[topic.objectId];
    if (type && type == 'multiple') {
      let answer = [];
      for (let index = 0; index < options.length; index++) {
        if (options[index].check) {
          answer.push(options[index].value)
        }
      }
      console.log(selectVal, answer)
      if (JSON.stringify(selectVal) === JSON.stringify(answer)) {
        return true;
      } else {
        return false;
      }
    } else {
      for (let index = 0; index < options.length; index++) {
        let option = options[index];
        if (option.value == selectVal) {
          if (option.check) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }
  checkScore(topic,objectId){
    if(!topic || !topic[objectId]){
      return '待批阅'
    }else{
      return topic[objectId]
    }
  }
  getCortVal(topic) {
    let options = topic.options;
    let answer = [];
    for (let index = 0; index < options.length; index++) {
      if (options[index].check) {
        answer.push(options[index].value)
      }
    }
    return answer
  }
}