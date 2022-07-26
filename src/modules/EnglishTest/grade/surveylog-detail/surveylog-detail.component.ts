import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";
@Component({
  selector: "surveylog-detail",
  templateUrl: "./surveylog-detail.component.html",
  styleUrls: ["./surveylog-detail.component.scss"],
})
export class SurveylogDetailComponent {
  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient
  ) { }
  log: any;
  survey: any;
  exam: any;
  profile: any;
  knows: any[] = [];
  topics: any;
  detail: any = {};
  label: any = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  showAnaly: boolean = true; // 显示题目解析
  department: string;
  answerMap: any;// 答题记录
  topicArr: any = [];// 组题顺序
  ngOnInit(): void {
    this.department = localStorage.getItem("department");
    console.log(this.department);
    this.activRoute.paramMap.subscribe(async (params) => {
      let logId = params.get("id");
      this.initData(logId);
    });
  }
  async initData(id) {
    let queryS = new Parse.Query("SurveyLog");
    queryS.include("survey");
    queryS.include("profile");
    queryS.include("exam");
    let log = await queryS.get(id);
    if (log && log.id) {
      if (!this.department) {
        this.department = log.get("department")?.id;
      }
      this.log = log;
      this.survey = log.get("survey");
      this.exam = log.get("exam");
      this.profile = log.get("profile");
      await this.getSurveyAnswer(log.get("exam")?.id)
      await this.queryKnows();
      this.getSurveyDetail(log);
      console.log(this.log, this.survey, this.exam, this.profile, this.knows);
    }
  }
  /* 答题记录 */
  async getSurveyAnswer(examId) {
    let queryA = new Parse.Query("SurveyAnswer");
    queryA.equalTo("exam", examId);
    queryA.equalTo("profile", this.profile.id);
    let surveyAnswer = await queryA.first();
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
  // async getSurveyDetailold(log) {
  //   let detail = [];
  //   /* 获取题型 */
  //   let rule = this.exam.get("options");
  //   let knows = this.knows;
  //   this.knows = [];
  //   for (let index = 0; index < rule.length; index++) {
  //     let option = rule[index];
  //     let kIndex = knows.findIndex((know) => know.id == option.knowledge);
  //     if (kIndex >= 0) {
  //       this.knows.push(knows[kIndex]);
  //     }
  //     // let know = await this.queryKnow(option.knowledge);
  //     // this.knows.push(know);
  //   }
  //   /* 获取所有题目 */
  //   let topics = await this.getTopics(log);
  //   /* 组合答卷 */
  //   for (let dex = 0; dex < topics.length; dex++) {
  //     let topic = topics[dex];
  //     if (topic.child) {
  //       topic.child.sort((a, b) => a.index - b.index);
  //     }
  //   }
  //   let num = 1;
  //   for (let index = 0; index < this.knows.length; index++) {
  //     let know = this.knows[index];
  //     for (let tIndex = 0; tIndex < topics.length; tIndex++) {
  //       let topic = topics[tIndex];
  //       if (topic.knowledge[0].objectId == know.id) {
  //         if (!know.topics) {
  //           know.topics = [];
  //         }
  //         if (!topic.child) {
  //           topic.num = num;
  //           num += 1;
  //         } else {
  //           topic.child.forEach((child) => {
  //             child.num = num;
  //             num += 1;
  //           });
  //         }

  //         // detail[index].topics.forEach((i,rank) =>{
  //         // if (!i.child) {
  //         //   detail[index].topics[rank].index = num;
  //         //   num += 1;
  //         //   console.log(detail[index].topics[rank]);              
  //         // } else {
  //         //   i.child.forEach((child,only) => {
  //         //     console.log(child);
  //         //     console.log(detail[index].topics[rank].child[only]);

  //         //     detail[index].topics[rank].child[only].index = num;
  //         //   num += 1;
  //         //   console.log(detail[index].topics[rank].child[only].objectId);              
  //         // });
  //         // }
  //         // })

  //         know.topics.push(topic);
  //       }
  //       if (tIndex + 1 == topics.length) {
  //         detail.push(know);
  //         console.log(know);
  //       }
  //     }

  //     if (index + 1 == this.knows.length) {
  //       this.detail = detail;
  //     }
  //   }
  // }

  async getSurveyDetail(log) {
    // 获取所有题目
    let tempArr = []

    console.log(this.topicArr);
    let topicArr = this.topicArr
    topicArr.forEach((k, index) => {
      if (k.length) {
        k.forEach(t => {
          tempArr.push(t)
        });
      }
    })

    let idArr = tempArr.map((item) => `'${item}'`).toString();
    // let sql = `select * from "SurveyItem" where "objectId" in (${idArr})`;
    let sql = `with recursive rel_tree as (
      (select "sItem".* from "SurveyItem" as "sItem"
      where "sItem"."parent" is null   and "sItem"."objectId" in (${idArr}) order by "sItem"."parent" desc )
      union all
      select  c.*  from "SurveyItem" c  join rel_tree p on c."parent" = p."objectId"
    ) select * from rel_tree`
    console.log(sql);
    let topics = await this.novaSql(sql);
    console.log(topics);
    let topicMap = {}
    // 组装父子题目  
    topics.forEach(topic => {
      topicMap[topic.objectId] = topic
      if (topicMap[topic['parent']]) {
        if (!topicMap[topic['parent']]['child']) topicMap[topic['parent']]['child'] = []
        topicMap[topic['parent']]['child'].push(topic)
        topicMap[topic['parent']]['child'].sort((a, b) => {
          return a.index - b.index
        })
      }
    })
    let detail = []
    let num = 1
    // 题目组装进题型
    topicArr.forEach((k, index) => {
      if (k.length) {
        k.forEach((t, i) => {
          let tIndex = this.knows.findIndex(know => know.id == topicMap[t].knowledge[0].objectId)
          let knowsT = this.knows[tIndex]
          detail[index] = knowsT
          if (!detail[index]['topics']) detail[index]['topics'] = []
          if (!topicMap[t].child) {
            topicMap[t].index = num
            num += 1;
          } else {
            topicMap[t].child.forEach((element, a) => {
              topicMap[t].child[a].index = num
              num += 1;
            });
          }
          detail[index].topics.push(topicMap[t])
        })
      }
    })

    detail.length = topicArr.length
    this.detail = detail;
    console.log(this.detail);
    return

    // /* 获取所有题目 */
    // let topics = await this.getTopics(log);
    // /* 组合答卷 */
    // for (let dex = 0; dex < topics.length; dex++) {
    //   let topic = topics[dex];
    //   if (topic.child) {
    //     topic.child.sort((a, b) => a.index - b.index);
    //   }
    // }
    // let num = 1;
    // for (let index = 0; index < this.knows.length; index++) {
    //   let know = this.knows[index];
    //   for (let tIndex = 0; tIndex < topics.length; tIndex++) {
    //     let topic = topics[tIndex];
    //     if (topic.knowledge[0].objectId == know.id) {
    //       if (!know.topics) {
    //         know.topics = [];
    //       }
    //       if (!topic.child) {
    //         topic.num = num;
    //         num += 1;
    //       } else {
    //         topic.child.forEach((child) => {
    //           child.num = num;
    //           num += 1;
    //         });
    //       }
    //       know.topics.push(topic);
    //     }
    //     if (tIndex + 1 == topics.length) {
    //       detail.push(know);
    //     }
    //   }

    //   if (index + 1 == this.knows.length) {
    //     this.detail = detail;
    //   }
    // }
    // for (let index = 0; index < topics.length; index++) {
    //   let topic = topics[index];
    //   let know = topic.get("knowledge")[0];
    //   if (!detail[know.id]) {
    //     detail[know.id] = [];
    //   }
    //   detail[know.id].push(topic);
    //   if (index + 1 == topics.length) {
    //     this.detail = detail;
    //     console.log(this.detail);
    //   }
    // }
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

  checkCort(topic) {
    let options = topic.options;
    let selectVal = this.log.get("answer")[topic.objectId];
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
  getCortVal(topic) {
    let options = topic.options;
    for (let index = 0; index < options.length; index++) {
      let option = options[index];
      if (option.check) {
        return option.value;
      }
    }
  }
}
