import { Component, OnInit } from "@angular/core";
import { Input, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "repeat-check",
  templateUrl: "./repeat-check.component.html",
  styleUrls: ["./repeat-check.component.scss"],
})
export class RepeatCheckComponent implements OnInit {
  @Input() department: string;
  @Input() company: string;
  @Input() pCompany: string;
  constructor(private http: HttpClient, private message: NzMessageService) {}
  baseurl: string = "https://server.fmode.cn/api/novaql/select";
  surveys: any;
  topics: any;
  knows: any;
  knowId: string;
  surveyId: string;
  topicLen: number; // 每次查询的题目数量
  similarNum: string = "0.9"; // 文本相似度
  count: number = 0; // 排查进度
  pageSize: number = 100; // 每次排查数量
  pageIndex: number = 1;
  similarCount: number = 0; // 有相似题干的题目数量
  ngOnInit(): void {
    console.log(this.company, this.department);

    this.getSurveys();
  }
  async getSurveys() {
    let sql = `select * from "Survey" where "company"='${this.pCompany}' and "department"='${this.department}'  `;
    this.surveys = await this.novaSql(sql);
  }
  async getKnows() {
    let sql = `select * from "Knowledge" where "company"='${this.company}' and "department"='${this.department}'`;
    this.knows = await this.novaSql(sql);
  }
  async getTopics() {
    let sql = `select "SurveyItem"."title","SurveyItem"."objectId" from "SurveyItem" where "survey"='${this.surveyId}' and "parent" is  null
    and "knowledge" @> '[{"objectId":"${this.knowId}"}]' `;
    // order by "createdAt" asc limit ${this.pageSize} offset  (${
    //   this.pageIndex - 1
    // } * ${this.pageSize})
    console.log(sql);
    this.topics = await this.novaSql(sql);
    return this.topics;
  }
  novaSql(sql) {
    let baseurl = this.baseurl;
    return new Promise((resolve, reject) => {
      this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
        let code: any = res.code;
        let data: any = res.data;
        console.log(data);
        if (code == 200) {
          resolve(data);
        } else {
          this.message.error("请求失败");
          reject(res);
        }
      });
    });
  }
  async typeChange(e, type) {
    switch (type) {
      case "survey":
        this.surveyId = e;
        await this.getKnows();
        break;

      default:
        break;
    }
  }
  async getTopicRepet() {
    let count = 0;
    this.count = 0;
    this.similarCount = 0;
    this.topicLen = 0;
    this.topics = [];
    let topics = await this.getTopics();
    let topicLen = topics.length;
    console.log(topicLen);
    this.topicLen = topicLen;
    // let splitArr = topics.slice(this.pageIndex - 1, this.pageSize);
    // for (let index = 0; index < splitArr.length; index++) {
    //   let t1 = splitArr[index];
    //   for (let index = 0; index < topics.length; index++) {
    //     let t2 = topics[index];
    //     await this.simi(t1, t2, count);
    //   }
    //   count += 1;
    //   console.log(count);
    //   await this.getCount(count, topicLen);
    // }

    //   for (let index = 0; index < topicLen; index += 100) {
    //     let tmpList = [];
    //     if (index + 100 < topicLen) {
    //       tmpList = topics.slice(index, index + 100);
    //     } else {
    //       tmpList = topics.slice(index, topicLen);
    //     }
    //     tmpList.forEach((item1) => {
    //       let simResult = stringSimilarity.findBestMatch(
    //         item1.title,
    //         topics.map((it3) => it3.title)
    //       );
    //       let ratings = simResult.ratings;
    //       let ratList = ratings.filter((ritem) => ritem.rating > 0.8);
    //       if (ratList.length > 0) {
    //         this.simMap[item1.objectId] = ratList;
    //       }
    //     });
    //     console.log(index);
    //   }
    //   console.log(this.simMap);
    //   console.log(topics.length);
    //   console.log(Object.keys(this.simMap).length);
  }
  async simi(t1, t2, count) {
    if (t1.objectId != t2.objectId) {
      let num = this.similarFun(t1.title, t2.title);
      if (num >= +this.similarNum) {
        if (!t1.similarArr) {
          t1.similarArr = [];
        }
        this.similarCount += 1;
        t1.similarArr.push(t2);
        console.log(count);
      }
    }
  }
  async getCount(count, topicLen) {
    let count2 = ((count / topicLen) * 100).toFixed(2);
    this.count = +count2;
  }
  similarFun(s, t, f?) {
    if (!s || !t) {
      return 0;
    }
    var l = s.length > t.length ? s.length : t.length;
    var n = s.length;
    var m = t.length;
    var d = [];
    f = f || 3;
    var min = function (a, b, c) {
      return a < b ? (a < c ? a : c) : b < c ? b : c;
    };
    var i, j, si, tj, cost;
    if (n === 0) return m;
    if (m === 0) return n;
    for (i = 0; i <= n; i++) {
      d[i] = [];
      d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
      d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
      si = s.charAt(i - 1);
      for (j = 1; j <= m; j++) {
        tj = t.charAt(j - 1);
        if (si === tj) {
          cost = 0;
        } else {
          cost = 1;
        }
        d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      }
    }
    let res = 1 - d[n][m] / l;
    return res.toFixed(f);
  }
}
