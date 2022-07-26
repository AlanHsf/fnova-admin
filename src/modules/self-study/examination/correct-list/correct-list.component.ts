import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";

@Component({
  selector: 'app-correct-list',
  templateUrl: './correct-list.component.html',
  styleUrls: ['./correct-list.component.scss']
})
export class CorrectListComponent implements OnInit {
  department: any;
  company: any;
  pCompany: any;
  recruit: any;
  examId: any;
  exam: any;
  surveys: any;
  survey: any;
  sId: string;
  logList: any = [];
  markerId: string;
  /* 表格 */
  listOfColumn = [
    {
      title: "序号",
      compare: null,
      priority: false,
    },
    {
      title: "考试试卷",
      compare: null,
      priority: false,
    },
    {
      title: "姓名",
      compare: null,
      priority: false,
    },
    {
      title: "身份证号",
      compare: null,
      priority: false,
    },
    {
      title: "课程",
      compare: null,
      priority: false,
    },
    {
      title: "章节",
      compare: null,
      priority: false,
    },
    {
      title: "操作",
      compare: null,
      priority: false,
    },
  ];
  listOfData: any = [];
  pageSize: number = 20;
  pageIndex: number = 1;
  filterLen: number = 0;
  isLoading: boolean = false;
  constructor(
    private route: Router,
    private activRoute: ActivatedRoute,
    private http: HttpClient,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    if (localStorage.getItem("department")) {
      this.department = localStorage.getItem("department");
    }
    this.company = localStorage.getItem("company");
    this.activRoute.paramMap.subscribe(async (params) => {
      let Company = new Parse.Query("Company");
      if (this.company && this.department) {
        let comp = await Company.get(this.company);
        this.pCompany = comp.get("company");
      }
      console.log(params);
      this.examId = params.get("PobjectId");
      let user = Parse.User.current();
      let queryUser = new Parse.Query("_User");
      queryUser.include("roles");
      let data = await queryUser.get(user.id || user["objectId"]);
      if (data && data.get("roles")) {
        let roles = user.get("roles");
        console.log(roles);
        if (roles && roles.length) {
          for (let index = 0; index < roles.length; index++) {
            let role = roles[index];
            if (role.get("otherName") == "阅卷老师") {
              this.markerId = user.id;
            }
          }
        }
      }
      this.getSlogs();
      console.log(this.department, this.company);
    });
  }

  /* ---------- 数据初始化 ---------- */

  async getSlogs() {
    this.isLoading = true;
    let baseurl: string = "https://server.fmode.cn/api/novaql/select";
    let sql = `select "survey"."title" as "stitle","survey"."objectId" as "sid",
    "pro"."name" as "name","pro"."idcard" as "idcard","pro"."lang" as "lang","log".*,
    "lesson"."lesTitle", "art"."artTitle", "lesson2"."les2Title"
    from "SurveyLog" as "log" 
    join (select * from (select distinct "objectId","title" from "Survey" where "company" = '1ErpDVc1u6') as "sur" 
              join (select distinct "survey" from "SurveyItem" where "type" = 'text') as "surItem" 
                    on "sur"."objectId" = "surItem"."survey"  ) as "survey" 
    on "survey"."objectId"="log"."survey"
    join (select * from "Profile" where "isDeleted" is not true) as "pro" on "pro"."objectId"="log"."profile"
    left join (select "objectId","title" as "lesTitle" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson" on "lesson"."objectId"="log"."examId"
    left join (select "objectId","lesson","title" as "artTitle" from "LessonArticle" where "parent" is null) as "art" on "art"."objectId"="log"."examId"
    left join (select "objectId","title" as "les2Title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson2" on "lesson2"."objectId"="art"."lesson"
    where "shortAnswer" is not null and "status" is not true and "log"."company" = '1ErpDVc1u6' `;

    let department = this.department ? this.department : '' ;
    if(department){
      sql += `and "log"."departments" @> '[{ "objectId": "${department}"}]' `;
    }
    if (this.markerId) {
      sql += `and "log"."marker" = '${this.markerId}'`;
    }
    sql += ` order by "log"."createdAt" asc limit ${this.pageSize} offset  (${this.pageIndex - 1
      } * ${this.pageSize}) `;
    console.log(sql);

    this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
      console.log(res);
      this.listOfData = res.data;
      this.isLoading = false;
    });
    let countSQL = `select count(*)
    from "SurveyLog" as "log" 
    join (select * from (select distinct "objectId","title" from "Survey" where "company" = '1ErpDVc1u6') as "sur" 
              join (select distinct "survey" from "SurveyItem" where "type" = 'text') as "surItem" 
                    on "sur"."objectId" = "surItem"."survey"  ) as "survey" 
    on "survey"."objectId"="log"."survey"
    join (select * from "Profile" where "isDeleted" is not true) as "pro" on "pro"."objectId"="log"."profile"
    where "shortAnswer" is not null and "status" is not true and "log"."company" = '1ErpDVc1u6' `;
    if(department){
      countSQL += `and "log"."departments" @> '[{ "objectId": "${department}"}]' `;
    }
    if (this.markerId) {
      countSQL += `and "log"."marker" = '${this.markerId}'`;
    }
    this.http
      .post(baseurl, {
        sql: countSQL,
      })
      .subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          this.filterLen = res.data[0].count;
        } else {
          this.message.error("网络繁忙，请稍后重试");
        }
      });
  }
  /* ---------- end ---------- */

  /* ---------- 条件筛选 ---------- */

  /* ---------- end ---------- */

  /* 批阅试卷 */
  perusal(data) {
    console.log(data);
    this.route.navigate([
      "/self-study/correct",
      { id: data.objectId, sid: data.sid },
    ]);
  }

  // 分页选择
  pageChange(e) {
    this.isLoading = true
    this.getSlogs()
  }
}