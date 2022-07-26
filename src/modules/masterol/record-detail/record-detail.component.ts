import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Parse from 'parse'

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.scss']
})
export class RecordDetailComponent implements OnInit {
  records: any;
  articles: any = [];
  listOfColumn = [
    {
      title: '学生',
      compare: null,
      priority: false
    },
    {
      title: '学校',
      compare: null,
      priority: false
    },
    {
      title: '专业',
      compare: null,
      priority: false
    },
    {
      title: '班级',
      compare: null,
      priority: false
    },
    {
      title: '课程',
      compare: null,
      priority: false
    },
    {
      title: '章节',
      compare: null,
      priority: false,
      sort: (a, b) => a.get('index') > b.get('index') ? 1 : -1
    },

    {
      title: '状态',
      compare: null,
      priority: false
    },

    {
      title: '学习时长',
      compare: null,
      priority: false
    }
    ,
    {
      title: '学习时间',
      compare: null,
      priority: false
    }
  ];
  constructor(private activeRouter: ActivatedRoute,private http:HttpClient) { }

  ngOnInit(): void {
    this.activeRouter.paramMap.subscribe( params => {
      console.log(params);
      let uid = params['params'].uid;
      let lid = params['params'].lid;
      if (uid && lid) {
        //  this.getArticle(uid, lid)
         this.getRecord(uid,lid)
      }
    })

  }
  
  async getRecord(uid, lid) {
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let sql = `SELECT * from
    (select 
        max("article"."objectId") as "aid",
        max("article"."index") as "index",
        max("article"."title") as "title",
        max("lesson"."title") as "lessonName",
        max("profile"."name") as "userName",
        max("major"."name") as "majorName",
        max("class"."name") as "className",
        max("Department"."name") as "schoolName"
       from "LessonArticle" as "article"
       left join "Profile" as "profile" on "profile"."objectId" = '${uid}'
       left join "Department" on "profile"."department" = "Department"."objectId"
       left join "SchoolMajor" as "major" on "profile"."SchoolMajor" = "major"."objectId"
       left join "SchoolClass" as "class" on "profile"."schoolClass" = "class"."objectId"
       left join "Lesson" as "lesson" on "lesson"."objectId" = '${lid}'
       where "article"."lesson"  = '${lid}' and "article"."parent" is not null  
       group by "article"."objectId" order by "article"."index") as  "LA"
    left join (SELECT
      "LR"."lessonArticle" as "aid",
      "LR"."time" as "time",
      "LR"."status" as "status",
      "LR"."updatedAt" as "updatedAt"
    from "LessonRecord" as "LR"
    where "LR"."user" = '${uid}' AND "LR"."lesson" = '${lid}') as "LRCount"
    on "LA"."aid" = "LRCount"."aid"`
    this.http.post(baseurl, { sql: sql }).subscribe(res => {
      let data = res['data'];
      this.records = data;
      console.log(data );
    })
    // let records = []
    // let querySecrecord = new Parse.Query("LessonRecord");
    // querySecrecord.equalTo("user", uid);
    // querySecrecord.equalTo("lesson", lid);
    // querySecrecord.equalTo("lessonArticle", articleId);
    // querySecrecord.include("user");
    // querySecrecord.include("department");
    // querySecrecord.include("major");
    // querySecrecord.include("class");
    // querySecrecord.include("lesson");
    // let record = await querySecrecord.first()
    // if (record && record.id) {
    //   return record.toJSON()
    // }




  }

  getTime(value) {
    return Number(value).toFixed(2)
  }

}
