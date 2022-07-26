import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";
@Component({
  selector: "app-give-marker",
  templateUrl: "./give-marker.component.html",
  styleUrls: ["./give-marker.component.scss"],
})
export class GiveMarkerComponent implements OnInit {
  constructor(
    private route: Router,
    private activRoute: ActivatedRoute,
    private http: HttpClient,
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef
  ) {}
  company: any;
  department: any;
  recruit: any;
  exam: any;
  surveys: any;
  sId: any;
  logList: any = [];
  markers: any;
  baseurl: string = "https://server.fmode.cn/api/novaql/select";

  /* 表格 */
  isLoading: boolean = true;
  logOfColumn: any = [
    // {
    //   title: '学生姓名',
    //   compare: null,
    //   priority: false
    // },
    // {
    //   title: '身份证号',
    //   compare: null,
    //   priority: false
    // },
    // {
    //   title: '语种',
    //   compare: null,
    //   priority: false
    // },
    {
      title: "序号",
      compare: null,
      priority: false,
    },
    {
      title: "阅卷人",
      compare: null,
      priority: false,
    },
  ];
  markOfColumn: any = [
    {
      title: "名称",
      compare: null,
      priority: false,
    },
  ];
  pageSize: number = 20;
  pageIndex: number = 1;
  filterLen: number = 0;
  pageSize2: number = 10;
  pageIndex2: number = 1;
  filterLen2: number = 0;
  checked: boolean = false;
  indeterminate: boolean = false;
  checked2: boolean = false;
  indeterminate2: boolean = false;
  setOfChecked = new Set<any>();
  setOfCheckedMark = new Set<any>();
  /* 模态框 */
  ModalVisible: boolean = false;
  modalLoading: boolean = false;
  markLoading: boolean = false;
  ngOnInit(): void {
    if (localStorage.getItem("department")) {
      this.department = localStorage.getItem("department");
    }
    this.company = localStorage.getItem("company");
    this.activRoute.paramMap.subscribe((params) => {
      let examId = params.get("examId");
      console.log(examId);
      this.getExamSurveys(examId);
      this.getMarkers();
    });
  }
  /* ---------- 基础数据检查 数据初始化 ---------- */
  // examId  考试id
  async getExamSurveys(examId) {
    let Exam = new Parse.Query("Exam");
    Exam.include("survey");
    Exam.equalTo("objectId", examId);
    let exam = await Exam.first();
    console.log(exam);
    if (exam && exam.id) {
      this.exam = exam;
      this.surveys = exam.get("survey");
      this.sId = exam.get("survey")[0].id;
      this.getSlog();
    }
  }
  // sId  试卷id
  async getSlog(sId = this.sId) {
    let SurveyLog = new Parse.Query("SurveyLog");
    SurveyLog.equalTo("survey", sId);
    SurveyLog.exists("shortAnswer");
    SurveyLog.notEqualTo("status", true);
    SurveyLog.include("survey");
    SurveyLog.include("marker");
    if (this.department) {
      SurveyLog.equalTo("department", this.department);
    }
    SurveyLog.ascending("createdAt");
    // SurveyLog.skip((this.pageIndex - 1) * this.pageSize);
    SurveyLog.limit(100000);
    let logs = await SurveyLog.find();
    if (logs) {
      this.logList = logs;
      console.log(logs);
      console.log(this.logList);
      this.isLoading = false;
    } else {
      this.message.error("网络繁忙，请稍后重试");
    }

    let sCount = new Parse.Query("SurveyLog");
    sCount.equalTo("survey", sId);
    sCount.exists("shortAnswer");
    sCount.notEqualTo("status", true);
    if (this.department) {
      sCount.equalTo("department", this.department);
    }
    this.filterLen = await sCount.count();

    // let baseurl = this.baseurl;
    // let compSql = '';
    // let sql = `select "survey"."title" as "stitle",
    // "pro"."name" as "name","pro"."idcard" as "idcard","pro"."lang" as "lang","log".*
    // from "SurveyLog" as "log"
    // left join "Survey" as "survey" on "survey"."objectId"="log"."survey"
    // left join "Profile" as "pro" on "pro"."objectId"="log"."profile"
    // where  "shortAnswer" is not null and "status" is not true `;
    // if (this.department) {
    //   sql += `and "log"."department"='${this.department}' `
    // }
    // if (sId) {
    //   sql += `and "survey"."objectId" = '${sId}'`
    // }
    // compSql = sql + ` order by "log"."createdAt" asc limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize}) `
    // this.http
    //   .post(baseurl, { sql: compSql })
    //   .subscribe(async (res: any) => {
    //     console.log(res);
    //     if (res.code == 200) {
    //       for (let index = 0; index < 2009; index++) {
    //         for (let lIndex = 0; lIndex < res.data.length; lIndex++) {
    //           let log = Object.assign({}, res.data[lIndex]);
    //           log.name += `${index}`
    //           this.logList = [
    //             ...this.logList,
    //             log
    //           ]
    //         }
    //       }
    //       console.log(this.logList);
    //       // this.logList = res.data;
    //       this.isLoading = false;
    //     } else {
    //       this.message.error("网络繁忙，请稍后重试")
    //     }
    //   })
    // let countSQL = `select count(*)
    //   from "SurveyLog" as "log"
    //   left join "Survey" as "survey" on "survey"."objectId"="log"."survey"
    //   left join "Profile" as "pro" on "pro"."objectId"="log"."profile"
    //   where "shortAnswer" is not null and "status" is not true `;
    // if (this.department) {
    //   countSQL += `and "log"."department"='${this.department}' `
    // }
    // if (sId) {
    //   countSQL += `and "survey"."objectId" = '${sId}'`
    // }
    // this.http
    //   .post(baseurl, {
    //     sql: countSQL
    //   })
    //   .subscribe(async (res: any) => {
    //     console.log(res);
    //     if (res.code == 200) {
    //       this.filterLen = res.data[0].count
    //     } else {
    //       this.message.error("网络繁忙，请稍后重试")
    //     }
    //   })
  }

  getMarkers() {
    this.markLoading = true;
    let baseurl = this.baseurl;
    let countSQL = `select count(*)  from "_User" as "user"
    LEFT join "_Role" as "role" on  position("role"."objectId" in "user"."roles"::text )>0
    where "role"."company"='${this.company}'  AND "role"."otherName"='阅卷老师' `;
    this.http
      .post(baseurl, {
        sql: countSQL,
      })
      .subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          this.filterLen2 = +res.data[0].count;
        } else {
          this.message.error("网络繁忙，请稍后重试");
        }
      });
    let sql = `select "user"."objectId","user"."username","user"."mobile","user"."nickname","user"."cates"  from "_User" as "user"
      LEFT join "_Role" as "role" on  position("role"."objectId" in "user"."roles"::text )>0
      where "role"."company"='${this.company}'  AND "role"."otherName"='阅卷老师' `;
    // sql += ` order by "user"."nickname" asc limit ${this.pageSize2} offset  (${
    //   this.pageIndex2 - 1
    // } * ${this.pageSize2}) `;
    this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
      console.log(res);
      if (res.code == 200) {
        this.cdRef.detectChanges();
        this.markers = res.data;
        console.log(this.markers);
        this.markLoading = false;
      } else {
        this.message.error("网络繁忙，请稍后重试");
      }
    });
  }
  /* ---------- end ---------- */

  /* ---------- 条件筛选 ---------- */
  async surveyChange(ev) {
    console.log(ev);
    this.getSlog(ev);
  }
  async changeSchool(ev) {
    if (!ev) {
      return;
    }
  }

  /* 表格 type ==> log 试卷记录/marker 阅卷老师 */
  onItemChecked(data: any, checked: boolean, type: string): void {
    console.log(data, checked);
    switch (type) {
      case "log":
        if (checked) {
          if (!this.setOfChecked.has(data)) {
            this.setOfChecked.add(data);
          }
        } else {
          if (this.setOfChecked.has(data)) {
            this.setOfChecked.delete(data);
          }
        }
        console.log(this.setOfChecked);
        break;
      case "marker":
        if (checked) {
          if (!this.setOfCheckedMark.has(data)) {
            this.setOfCheckedMark.add(data);
          }
        } else {
          if (this.setOfCheckedMark.has(data)) {
            this.setOfCheckedMark.delete(data);
          }
        }
        console.log(this.setOfCheckedMark);
        break;
      default:
        break;
    }
  }

  onAllChecked(checked: boolean, type: string): void {
    console.log(checked);
    switch (type) {
      case "log":
        if (checked) {
          this.setOfChecked = new Set(this.logList);
        } else {
          this.setOfChecked.clear();
        }
        console.log(this.setOfChecked);
        break;
      case "marker":
        if (checked) {
          this.setOfCheckedMark = new Set(this.markers);
        } else {
          this.setOfCheckedMark.clear();
        }
        console.log(this.setOfCheckedMark);
        break;
      default:
        break;
    }
  }

  pageChange(e, type) {
    switch (type) {
      case "slog":
        break;
      case "marker":
        break;
      default:
        break;
    }
  }
  /* 表格 end */
  /* ---------- end ---------- */

  /* 操作 */

  async dispatch() {
    this.ModalVisible = true;
    await this.getMarkers();
  }
  async saveMarker() {
    this.modalLoading = true;
    let logCount = this.setOfChecked.size;
    let markCount = this.setOfCheckedMark.size;
    let logs = Array.from(this.setOfChecked);
    let markers = Array.from(this.setOfCheckedMark);
    let map = {}; // {markId:[...logs]}
    let index = 0;
    let part = Math.ceil(logCount / markCount);
    // for (var i = 0; i < logCount; i += part) {
    //   map[markers[index].nickname] = logs.slice(i, i + part);
    //   index += 1;
    // }
    this.logList = [];
    let ErrorList = [];
    let logList = [];
    console.log(part, map, Object.keys(map).length, logs);
    console.log(`开始分配答卷，共${logCount}条`);
    // (i + 1) % markCount 取模为0即为对应的倍数。
    // 例：markCount 10 index:0-9  i:0->index:1 ... 9->10 10->10 13 ->1
    for (var i = 0; i < logCount; i++) {
      let num = (i + 1) % markCount;
      console.log(i, num);
      logs[i].set("marker", {
        __type: "Pointer",
        className: "_User",
        objectId: markers[num].objectId,
      });
      logList.push(logs[i]);
    }
    console.log(logList);
    this.compLog(logList);
  }
  async compLog(logList = this.logList) {
    for (let index = 0; index < logList.length; index += 100) {
      let saveList = [];
      if (index + 100 < logList.length) {
        saveList = logList.slice(index, index + 100);
        console.log(saveList);
      } else {
        saveList = logList.slice(index, logList.length);
        console.log(saveList);
      }
      await Promise.all(
        saveList.map((sitem, tIndex) => {
          sitem.save();
          // this.updateProfile(sitem.createdAt)
        })
      );
      console.log(`已分配:${index}/${logList.length}`);
    }
    this.isLoading = true;
    // console.log(`错误数据，共${ErrorList.length}条`);
    // console.log(ErrorList);
    this.getSlog();
    this.setOfChecked = new Set();
    this.setOfCheckedMark = new Set();
    this.checked = false;
    this.modalLoading = false;
    this.ModalVisible = false;
  }
  setMarker(markId, logId) {
    return new Promise((resolve, reject) => {
      let SurveyLog = new Parse.Query("SurveyLog");
      SurveyLog.get(logId).then((log) => {
        console.log(log);
        if (log && log.id) {
          log.set("marker", {
            __type: "Pointer",
            className: "_User",
            objectId: markId,
          });
          resolve(log);
          // log.save()
        }
      });
    });
  }
}
