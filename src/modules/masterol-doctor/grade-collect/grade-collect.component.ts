import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as Parse from 'parse'
interface DataItem {
  user: string;
  school: string;
  major: string;
  class: string;
  shouldCredit: any;
  getCredit:any
}
@Component({
  selector: 'app-grade-collect',
  templateUrl: './grade-collect.component.html',
  styleUrls: ['./grade-collect.component.scss']
})

export class GradeCollectComponent implements OnInit {
  records: any;
  articles: any = [];
  listOfData: DataItem[] = [];
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
      title: '应获总学分',
      compare: (a: DataItem, b: DataItem) => a.shouldCredit - b.shouldCredit,
      priority: false
    },
    {
      title: '已获总学分',
      compare: (a: DataItem, b: DataItem) => a.getCredit - b.getCredit,
      priority: false,
      // sort: (a, b) => a.get('index') > b.get('index') ? 1 : -1
    },
    {
      title: '操作',
      compare: null,
      priority: false
    }
  ];
  constructor(private activeRouter: ActivatedRoute,private http:HttpClient, private router: Router) { }
  company:any
  department:any;
  showSchool:boolean = true;
  isSchool:boolean = true
  async ngOnInit() {
    if(localStorage.getItem('department')) {
      this.department = localStorage.getItem('department')
      this.showSchool = false
      let Department = new Parse.Query("Department")
      await Department.get(this.department).then(res => {
        if(res && res.get('school')) {
          this.changeSchool(res.get('school')[0].id)
          this.isSchool = false
        } else {
          this.changeSchool(res.id)
        }
      })
    }
    
    await this.getCompany(this.department).then(res => {
      this.searchAll()
      if(this.showSchool) {
        this.getSchool()
      }
    })
    
  }
  async getCompany(did) {
    if(did) {
      let Department = new Parse.Query('Department')
      let department = await Department.get(did)
      if(department && department.id) {
        this.company = department.get('company').id
      }
    } else {
      this.company = localStorage.getItem('company')
    }
  }
  school:any;
  schools:any;
  getSchool() {
    let Department = new Parse.Query('Department')
    if(this.company == 'pPZbxElQQo') {
      Department.equalTo('category', 'erVPCmBAgt')
    }
    Department.equalTo('company', this.company)
    Department.find().then(res => {
      this.schools = res
    })
  }
  major:any;
  majors
  async changeSchool(ev) {
    if(!ev) {
      this.major = null,
      this.majors = []
      this.searchAll()
      return
    }
    let SchoolMajor = new Parse.Query('SchoolMajor')
    SchoolMajor.include('plan')
    this.school = ev
    SchoolMajor.equalTo('school', ev)
    let schoolMajors = await SchoolMajor.find()
    if(schoolMajors && schoolMajors.length > 0) {
      this.majors = schoolMajors
    }
  }
  async changeMajors(ev) {
    if(ev && ev.id) {
      this.major = ev.id
    }
  }
  searchStudent() { 
  }

  searchAll(csql?) {
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let sql
    if(localStorage.getItem('department')) {
      console.log(localStorage.getItem('department'))
      let department = localStorage.getItem('department')
      if(!this.isSchool) {
        // 只查该助学中心的数据
        sql = csql ? csql :`select 
    "PInfo"."uid" as "uid",
    "PInfo"."user" as "user",
    "PInfo"."school" as "school",
    "PInfo"."major" as "major",
    "PInfo"."class" as "class",
    "PInfo"."shouldCredit" as "shouldCredit",
    "getCredit"."tcredit" as "getCredit"
  from 
  (select
    "profile"."objectId" as "uid",
    "profile"."name" as "user",
    "department"."name" as "school",
    "schoolMajor"."name" as "major",
    "schoolMajor"."objectId" as "mid",
    "schoolMajor"."plan" as "plan",
    "schoolMajor"."totalCredit" as "shouldCredit",
    "schoolClass"."name" as "class"
  from "Profile" as "profile"
  left join "Department" as "department" on "department"."objectId" = "profile"."department" 
  left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
  left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
  where "profile"."company" = '${this.company}' and "profile"."center" = '${department}')  as "PInfo"
  left join 
  (SELECT 
    max("Credit"."uid") as "uid",
    sum(
    case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
      > 60 then "Credit"."credit" else 0 end) as "tcredit"
  from
  (SELECT 
    "R"."uid" as "uid",
    "R"."lid" as "lid",
    "R"."test" as "sid",
    "R"."user" as "user",
    "R"."credit" as "credit",
    round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
  from 
  (SELECT
          max("profile"."name")  as "user",
          max("profile"."objectId")  as "uid",
          max("lesson"."objectId") as "lid",
       max("lesson"."credit") as "credit",
       max("lesson"."lessonTest") as "test",
          sum("record"."time") as "totalTime",
          sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
       from "LessonRecord" as "record"
        left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
        left join "Department" as "Department" on "Department"."objectId" = "record"."department"
        left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
        left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
      where "record"."company" = '${this.company}'
        group by "record"."user", "record"."lesson") as "R"
  left join 
  (select
     count(1) as "total",
     max("LessonArticle"."objectId") as "laid",
    max("LessonArticle"."lesson") as "lid"
   from "LessonArticle"
   left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
   where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
   group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
   ) as "Credit"
    left join (select 
     "surveylog"."profile" as "uid",
     "surveylog"."survey" as "sid",
     (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
   from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
   group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
        `
      } else {
        sql = csql ? csql :`select 
    "PInfo"."uid" as "uid",
    "PInfo"."user" as "user",
    "PInfo"."school" as "school",
    "PInfo"."major" as "major",
    "PInfo"."class" as "class",
    "PInfo"."shouldCredit" as "shouldCredit",
    "getCredit"."tcredit" as "getCredit"
  from 
  (select
    "profile"."objectId" as "uid",
    "profile"."name" as "user",
    "department"."name" as "school",
    "schoolMajor"."name" as "major",
    "schoolMajor"."objectId" as "mid",
    "schoolMajor"."plan" as "plan",
    "schoolMajor"."totalCredit" as "shouldCredit",
    "schoolClass"."name" as "class"
  from "Profile" as "profile"
  left join "Department" as "department" on "department"."objectId" = "profile"."department" 
  left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
  left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
  where "profile"."company" = '${this.company}' and "profile"."department" = '${department}' )  as "PInfo"
  left join 
  (SELECT 
    max("Credit"."uid") as "uid",
    sum(
    case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
      > 60 then "Credit"."credit" else 0 end) as "tcredit"
  from
  (SELECT 
    "R"."uid" as "uid",
    "R"."lid" as "lid",
    "R"."test" as "sid",
    "R"."user" as "user",
    "R"."credit" as "credit",
    round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
  from 
  (SELECT
          max("profile"."name")  as "user",
          max("profile"."objectId")  as "uid",
          max("lesson"."objectId") as "lid",
       max("lesson"."credit") as "credit",
       max("lesson"."lessonTest") as "test",
          sum("record"."time") as "totalTime",
          sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
       from "LessonRecord" as "record"
        left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
        left join "Department" as "Department" on "Department"."objectId" = "record"."department"
        left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
        left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
      where "record"."company" = '${this.company}'
        group by "record"."user", "record"."lesson") as "R"
  left join 
  (select
     count(1) as "total",
     max("LessonArticle"."objectId") as "laid",
    max("LessonArticle"."lesson") as "lid"
   from "LessonArticle"
   left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
   where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
   group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
   ) as "Credit"
    left join (select 
     "surveylog"."profile" as "uid",
     "surveylog"."survey" as "sid",
     (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
   from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
   group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
        `
      } 
    } else {
      sql = csql ? csql :`select 
    "PInfo"."uid" as "uid",
    "PInfo"."user" as "user",
    "PInfo"."school" as "school",
    "PInfo"."major" as "major",
    "PInfo"."class" as "class",
    "PInfo"."shouldCredit" as "shouldCredit",
    "getCredit"."tcredit" as "getCredit"
  from 
  (select
    "profile"."objectId" as "uid",
    "profile"."name" as "user",
    "department"."name" as "school",
    "schoolMajor"."name" as "major",
    "schoolMajor"."objectId" as "mid",
    "schoolMajor"."plan" as "plan",
    "schoolMajor"."totalCredit" as "shouldCredit",
    "schoolClass"."name" as "class"
  from "Profile" as "profile"
  left join "Department" as "department" on "department"."objectId" = "profile"."department" 
  left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
  left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
  where "profile"."company" = '${this.company}') as "PInfo"
  left join 
  (SELECT 
    max("Credit"."uid") as "uid",
    sum(
    case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
      > 60 then "Credit"."credit" else 0 end) as "tcredit"
  from
  (SELECT 
    "R"."uid" as "uid",
    "R"."lid" as "lid",
    "R"."test" as "sid",
    "R"."user" as "user",
    "R"."credit" as "credit",
    round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
  from 
  (SELECT
          max("profile"."name")  as "user",
          max("profile"."objectId")  as "uid",
          max("lesson"."objectId") as "lid",
       max("lesson"."credit") as "credit",
       max("lesson"."lessonTest") as "test",
          sum("record"."time") as "totalTime",
          sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
       from "LessonRecord" as "record"
        left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
        left join "Department" as "Department" on "Department"."objectId" = "record"."department"
        left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
        left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
      where "record"."company" = '${this.company}'
        group by "record"."user", "record"."lesson") as "R"
  left join 
  (select
     count(1) as "total",
     max("LessonArticle"."objectId") as "laid",
    max("LessonArticle"."lesson") as "lid"
   from "LessonArticle"
   left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
   where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
   group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
   ) as "Credit"
    left join (select 
     "surveylog"."profile" as "uid",
     "surveylog"."survey" as "sid",
     (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
   from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
   group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
        `
    }
    
    this.http.post(baseurl, {sql: sql}).subscribe(res => {
      if(res["code"] == 200 && res["data"] ) {
        this.listOfData = res["data"]
      }
    })
  }

  
  toDetail(uid) {
    this.router.navigate(['/masterol-doctor/grade-detail',{uid:uid}])
  }

  student:any;
  // 查询
  search(){
    if(!this.school) {
      alert('请输入完整信息')
    }
    if(this.student && (!this.major || !this.school)) {
       alert('请输入完整信息')
    }
    let sql
    if(localStorage.getItem('department')){
      let department = localStorage.getItem('department')
      if(!this.isSchool) {
        // 助学中心
        if(this.school && !this.major ) {
          sql = `select 
          "PInfo"."uid" as "uid",
          "PInfo"."user" as "user",
          "PInfo"."school" as "school",
          "PInfo"."major" as "major",
          "PInfo"."class" as "class",
          "PInfo"."shouldCredit" as "shouldCredit",
          "getCredit"."tcredit" as "getCredit"
        from 
        (select
          "profile"."objectId" as "uid",
          "profile"."name" as "user",
          "department"."name" as "school",
          "schoolMajor"."name" as "major",
          "schoolMajor"."objectId" as "mid",
          "schoolMajor"."plan" as "plan",
          "schoolMajor"."totalCredit" as "shouldCredit",
          "schoolClass"."name" as "class"
        from "Profile" as "profile"
        left join "Department" as "department" on "department"."objectId" = "profile"."department" 
        left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
        left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
        where  "profile"."company" = '${this.company}' and "profile"."center" = '${department}') as "PInfo"
        left join 
        (SELECT 
          max("Credit"."uid") as "uid",
          sum(
          case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
            > 60 then "Credit"."credit" else 0 end) as "tcredit"
        from
        (SELECT 
          "R"."uid" as "uid",
          "R"."lid" as "lid",
          "R"."test" as "sid",
          "R"."user" as "user",
          "R"."credit" as "credit",
          round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
        from 
        (SELECT
                max("profile"."name")  as "user",
                max("profile"."objectId")  as "uid",
                max("lesson"."objectId") as "lid",
             max("lesson"."credit") as "credit",
             max("lesson"."lessonTest") as "test",
                sum("record"."time") as "totalTime",
                sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
             from "LessonRecord" as "record"
              left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
              left join "Department" as "Department" on "Department"."objectId" = "record"."department"
              left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
              left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
              left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
            where "record"."company" = '${this.company}'
              group by "record"."user", "record"."lesson") as "R"
        left join 
        (select
           count(1) as "total",
           max("LessonArticle"."objectId") as "laid",
          max("LessonArticle"."lesson") as "lid"
         from "LessonArticle"
         left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
         where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
         group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
         ) as "Credit"
          left join (select 
           "surveylog"."profile" as "uid",
           "surveylog"."survey" as "sid",
           (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
         from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
         group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
         `
         }
        if(this.school && this.major && !this.student) {
        sql = `select 
        "PInfo"."uid" as "uid",
        "PInfo"."user" as "user",
        "PInfo"."school" as "school",
        "PInfo"."major" as "major",
        "PInfo"."class" as "class",
        "PInfo"."shouldCredit" as "shouldCredit",
        "getCredit"."tcredit" as "getCredit"
      from 
      (select
        "profile"."objectId" as "uid",
        "profile"."name" as "user",
        "department"."name" as "school",
        "schoolMajor"."name" as "major",
        "schoolMajor"."objectId" as "mid",
        "schoolMajor"."plan" as "plan",
        "schoolMajor"."totalCredit" as "shouldCredit",
        "schoolClass"."name" as "class"
      from "Profile" as "profile"
      left join "Department" as "department" on "department"."objectId" = "profile"."department" 
      left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
      left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
      where  "profile"."company" = '${this.company}') and "profile"."center" '${localStorage.getItem("department")})' and "profile"."SchoolMajor" = '${this.major.id}' as "PInfo"
      left join 
      (SELECT 
        max("Credit"."uid") as "uid",
        sum(
        case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
          > 60 then "Credit"."credit" else 0 end) as "tcredit"
      from
      (SELECT 
        "R"."uid" as "uid",
        "R"."lid" as "lid",
        "R"."test" as "sid",
        "R"."user" as "user",
        "R"."credit" as "credit",
        round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
      from 
      (SELECT
              max("profile"."name")  as "user",
              max("profile"."objectId")  as "uid",
              max("lesson"."objectId") as "lid",
            max("lesson"."credit") as "credit",
            max("lesson"."lessonTest") as "test",
              sum("record"."time") as "totalTime",
              sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
            from "LessonRecord" as "record"
            left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
            left join "Department" as "Department" on "Department"."objectId" = "record"."department"
            left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
            left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
            left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
          where "record"."company" = '${this.company}'
            group by "record"."user", "record"."lesson") as "R"
      left join 
      (select
          count(1) as "total",
          max("LessonArticle"."objectId") as "laid",
        max("LessonArticle"."lesson") as "lid"
        from "LessonArticle"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
        where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
        group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
        ) as "Credit"
        left join (select 
          "surveylog"."profile" as "uid",
          "surveylog"."survey" as "sid",
          (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
        from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
        group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
        `
        }
        if(this.school && this.major && this.student) {
        sql = `select 
        "PInfo"."uid" as "uid",
        "PInfo"."user" as "user",
        "PInfo"."school" as "school",
        "PInfo"."major" as "major",
        "PInfo"."class" as "class",
        "PInfo"."shouldCredit" as "shouldCredit",
        "getCredit"."tcredit" as "getCredit"
      from 
      (select
        "profile"."objectId" as "uid",
        "profile"."name" as "user",
        "department"."name" as "school",
        "schoolMajor"."name" as "major",
        "schoolMajor"."objectId" as "mid",
        "schoolMajor"."plan" as "plan",
        "schoolMajor"."totalCredit" as "shouldCredit",
        "schoolClass"."name" as "class"
      from "Profile" as "profile"
      left join "Department" as "department" on "department"."objectId" = "profile"."department" 
      left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
      left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
      where  "profile"."company" = '${this.company}' and "profile"."center" = '${localStorage.getItem("department")}' and "profile"."SchoolMajor" = '${this.major.id}' and "profile"."name" = '${this.student}') as "PInfo"
      left join 
      (SELECT 
        max("Credit"."uid") as "uid",
        sum(
        case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
          > 60 then "Credit"."credit" else 0 end) as "tcredit"
      from
      (SELECT 
        "R"."uid" as "uid",
        "R"."lid" as "lid",
        "R"."test" as "sid",
        "R"."user" as "user",
        "R"."credit" as "credit",
        round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
      from 
      (SELECT
              max("profile"."name")  as "user",
              max("profile"."objectId")  as "uid",
              max("lesson"."objectId") as "lid",
            max("lesson"."credit") as "credit",
            max("lesson"."lessonTest") as "test",
              sum("record"."time") as "totalTime",
              sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
            from "LessonRecord" as "record"
            left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
            left join "Department" as "Department" on "Department"."objectId" = "record"."department"
            left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
            left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
            left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
          where "record"."company" = '${this.company}'
            group by "record"."user", "record"."lesson") as "R"
      left join 
      (select
          count(1) as "total",
          max("LessonArticle"."objectId") as "laid",
        max("LessonArticle"."lesson") as "lid"
        from "LessonArticle"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
        where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
        group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
        ) as "Credit"
        left join (select 
          "surveylog"."profile" as "uid",
          "surveylog"."survey" as "sid",
          (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
        from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
        group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
        `
        }
      } else{
        // 学校
        if(this.school && !this.major ) {
          sql = `select 
          "PInfo"."uid" as "uid",
          "PInfo"."user" as "user",
          "PInfo"."school" as "school",
          "PInfo"."major" as "major",
          "PInfo"."class" as "class",
          "PInfo"."shouldCredit" as "shouldCredit",
          "getCredit"."tcredit" as "getCredit"
        from 
        (select
          "profile"."objectId" as "uid",
          "profile"."name" as "user",
          "department"."name" as "school",
          "schoolMajor"."name" as "major",
          "schoolMajor"."objectId" as "mid",
          "schoolMajor"."plan" as "plan",
          "schoolMajor"."totalCredit" as "shouldCredit",
          "schoolClass"."name" as "class"
        from "Profile" as "profile"
        left join "Department" as "department" on "department"."objectId" = "profile"."department" 
        left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
        left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
        where  "profile"."company" = '${this.company}' and "profile"."department" = '${this.school}') as "PInfo"
        left join 
        (SELECT 
          max("Credit"."uid") as "uid",
          sum(
          case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
            > 60 then "Credit"."credit" else 0 end) as "tcredit"
        from
        (SELECT 
          "R"."uid" as "uid",
          "R"."lid" as "lid",
          "R"."test" as "sid",
          "R"."user" as "user",
          "R"."credit" as "credit",
          round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
        from 
        (SELECT
                max("profile"."name")  as "user",
                max("profile"."objectId")  as "uid",
                max("lesson"."objectId") as "lid",
             max("lesson"."credit") as "credit",
             max("lesson"."lessonTest") as "test",
                sum("record"."time") as "totalTime",
                sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
             from "LessonRecord" as "record"
              left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
              left join "Department" as "Department" on "Department"."objectId" = "record"."department"
              left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
              left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
              left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
            where "record"."company" = '${this.company}'
              group by "record"."user", "record"."lesson") as "R"
        left join 
        (select
           count(1) as "total",
           max("LessonArticle"."objectId") as "laid",
          max("LessonArticle"."lesson") as "lid"
         from "LessonArticle"
         left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
         where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
         group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
         ) as "Credit"
          left join (select 
           "surveylog"."profile" as "uid",
           "surveylog"."survey" as "sid",
           (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
         from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
         group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
         `
         }
        if(this.school && this.major && !this.student) {
        sql = `select 
        "PInfo"."uid" as "uid",
        "PInfo"."user" as "user",
        "PInfo"."school" as "school",
        "PInfo"."major" as "major",
        "PInfo"."class" as "class",
        "PInfo"."shouldCredit" as "shouldCredit",
        "getCredit"."tcredit" as "getCredit"
      from 
      (select
        "profile"."objectId" as "uid",
        "profile"."name" as "user",
        "department"."name" as "school",
        "schoolMajor"."name" as "major",
        "schoolMajor"."objectId" as "mid",
        "schoolMajor"."plan" as "plan",
        "schoolMajor"."totalCredit" as "shouldCredit",
        "schoolClass"."name" as "class"
      from "Profile" as "profile"
      left join "Department" as "department" on "department"."objectId" = "profile"."department" 
      left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
      left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
      where  "profile"."company" = '${this.company}' and "profile"."department" = '${this.school}' and "profile"."SchoolMajor" = '${this.major.id}') as "PInfo"
      left join 
      (SELECT 
        max("Credit"."uid") as "uid",
        sum(
        case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
          > 60 then "Credit"."credit" else 0 end) as "tcredit"
      from
      (SELECT 
        "R"."uid" as "uid",
        "R"."lid" as "lid",
        "R"."test" as "sid",
        "R"."user" as "user",
        "R"."credit" as "credit",
        round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
      from 
      (SELECT
              max("profile"."name")  as "user",
              max("profile"."objectId")  as "uid",
              max("lesson"."objectId") as "lid",
            max("lesson"."credit") as "credit",
            max("lesson"."lessonTest") as "test",
              sum("record"."time") as "totalTime",
              sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
            from "LessonRecord" as "record"
            left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
            left join "Department" as "Department" on "Department"."objectId" = "record"."department"
            left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
            left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
            left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
          where "record"."company" = '${this.company}'
            group by "record"."user", "record"."lesson") as "R"
      left join 
      (select
          count(1) as "total",
          max("LessonArticle"."objectId") as "laid",
        max("LessonArticle"."lesson") as "lid"
        from "LessonArticle"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
        where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
        group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
        ) as "Credit"
        left join (select 
          "surveylog"."profile" as "uid",
          "surveylog"."survey" as "sid",
          (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
        from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
        group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
        `
        }
        if(this.school && this.major && this.student) {
        sql = `select 
        "PInfo"."uid" as "uid",
        "PInfo"."user" as "user",
        "PInfo"."school" as "school",
        "PInfo"."major" as "major",
        "PInfo"."class" as "class",
        "PInfo"."shouldCredit" as "shouldCredit",
        "getCredit"."tcredit" as "getCredit"
      from 
      (select
        "profile"."objectId" as "uid",
        "profile"."name" as "user",
        "department"."name" as "school",
        "schoolMajor"."name" as "major",
        "schoolMajor"."objectId" as "mid",
        "schoolMajor"."plan" as "plan",
        "schoolMajor"."totalCredit" as "shouldCredit",
        "schoolClass"."name" as "class"
      from "Profile" as "profile"
      left join "Department" as "department" on "department"."objectId" = "profile"."department" 
      left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
      left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
      where  "profile"."company" = '${this.company}' and "profile"."department" = '${this.school}' and "profile"."SchoolMajor" = '${this.major.id}' and "profile"."name" = '${this.student}') as "PInfo"
      left join 
      (SELECT 
        max("Credit"."uid") as "uid",
        sum(
        case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
          > 60 then "Credit"."credit" else 0 end) as "tcredit"
      from
      (SELECT 
        "R"."uid" as "uid",
        "R"."lid" as "lid",
        "R"."test" as "sid",
        "R"."user" as "user",
        "R"."credit" as "credit",
        round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
      from 
      (SELECT
              max("profile"."name")  as "user",
              max("profile"."objectId")  as "uid",
              max("lesson"."objectId") as "lid",
            max("lesson"."credit") as "credit",
            max("lesson"."lessonTest") as "test",
              sum("record"."time") as "totalTime",
              sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
            from "LessonRecord" as "record"
            left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
            left join "Department" as "Department" on "Department"."objectId" = "record"."department"
            left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
            left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
            left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
          where "record"."company" = '${this.company}'
            group by "record"."user", "record"."lesson") as "R"
      left join 
      (select
          count(1) as "total",
          max("LessonArticle"."objectId") as "laid",
        max("LessonArticle"."lesson") as "lid"
        from "LessonArticle"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
        where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
        group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
        ) as "Credit"
        left join (select 
          "surveylog"."profile" as "uid",
          "surveylog"."survey" as "sid",
          (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
        from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
        group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
        `
        }
      }
    } else {
      // 总部
      if(this.school && !this.major ) {
        sql = `select 
        "PInfo"."uid" as "uid",
        "PInfo"."user" as "user",
        "PInfo"."school" as "school",
        "PInfo"."major" as "major",
        "PInfo"."class" as "class",
        "PInfo"."shouldCredit" as "shouldCredit",
        "getCredit"."tcredit" as "getCredit"
      from 
      (select
        "profile"."objectId" as "uid",
        "profile"."name" as "user",
        "department"."name" as "school",
        "schoolMajor"."name" as "major",
        "schoolMajor"."objectId" as "mid",
        "schoolMajor"."plan" as "plan",
        "schoolMajor"."totalCredit" as "shouldCredit",
        "schoolClass"."name" as "class"
      from "Profile" as "profile"
      left join "Department" as "department" on "department"."objectId" = "profile"."department" 
      left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
      left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
      where  "profile"."company" = '${this.company}') and "profile"."department" = '${this.school}' as "PInfo"
      left join 
      (SELECT 
        max("Credit"."uid") as "uid",
        sum(
        case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
          > 60 then "Credit"."credit" else 0 end) as "tcredit"
      from
      (SELECT 
        "R"."uid" as "uid",
        "R"."lid" as "lid",
        "R"."test" as "sid",
        "R"."user" as "user",
        "R"."credit" as "credit",
        round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
      from 
      (SELECT
              max("profile"."name")  as "user",
              max("profile"."objectId")  as "uid",
              max("lesson"."objectId") as "lid",
           max("lesson"."credit") as "credit",
           max("lesson"."lessonTest") as "test",
              sum("record"."time") as "totalTime",
              sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
           from "LessonRecord" as "record"
            left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
            left join "Department" as "Department" on "Department"."objectId" = "record"."department"
            left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
            left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
            left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
          where "record"."company" = '${this.company}'
            group by "record"."user", "record"."lesson") as "R"
      left join 
      (select
         count(1) as "total",
         max("LessonArticle"."objectId") as "laid",
        max("LessonArticle"."lesson") as "lid"
       from "LessonArticle"
       left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
       where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
       group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
       ) as "Credit"
        left join (select 
         "surveylog"."profile" as "uid",
         "surveylog"."survey" as "sid",
         (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
       from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
       group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
       `
       }
      if(this.school && this.major && !this.student) {
      sql = `select 
      "PInfo"."uid" as "uid",
      "PInfo"."user" as "user",
      "PInfo"."school" as "school",
      "PInfo"."major" as "major",
      "PInfo"."class" as "class",
      "PInfo"."shouldCredit" as "shouldCredit",
      "getCredit"."tcredit" as "getCredit"
    from 
    (select
      "profile"."objectId" as "uid",
      "profile"."name" as "user",
      "department"."name" as "school",
      "schoolMajor"."name" as "major",
      "schoolMajor"."objectId" as "mid",
      "schoolMajor"."plan" as "plan",
      "schoolMajor"."totalCredit" as "shouldCredit",
      "schoolClass"."name" as "class"
    from "Profile" as "profile"
    left join "Department" as "department" on "department"."objectId" = "profile"."department" 
    left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
    left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
    where  "profile"."company" = '${this.company}') and "profile"."department" = '${this.school}' and "profile"."SchoolMajor" = '${this.major.id}' as "PInfo"
    left join 
    (SELECT 
      max("Credit"."uid") as "uid",
      sum(
      case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
        > 60 then "Credit"."credit" else 0 end) as "tcredit"
    from
    (SELECT 
      "R"."uid" as "uid",
      "R"."lid" as "lid",
      "R"."test" as "sid",
      "R"."user" as "user",
      "R"."credit" as "credit",
      round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
    from 
    (SELECT
            max("profile"."name")  as "user",
            max("profile"."objectId")  as "uid",
            max("lesson"."objectId") as "lid",
          max("lesson"."credit") as "credit",
          max("lesson"."lessonTest") as "test",
            sum("record"."time") as "totalTime",
            sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
          from "LessonRecord" as "record"
          left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
          left join "Department" as "Department" on "Department"."objectId" = "record"."department"
          left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
          left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
          left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
        where "record"."company" = '${this.company}'
          group by "record"."user", "record"."lesson") as "R"
    left join 
    (select
        count(1) as "total",
        max("LessonArticle"."objectId") as "laid",
      max("LessonArticle"."lesson") as "lid"
      from "LessonArticle"
      left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
      where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
      group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
      ) as "Credit"
      left join (select 
        "surveylog"."profile" as "uid",
        "surveylog"."survey" as "sid",
        (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
      from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
      group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
      `
      }
      if(this.school && this.major && this.student) {
      sql = `select 
      "PInfo"."uid" as "uid",
      "PInfo"."user" as "user",
      "PInfo"."school" as "school",
      "PInfo"."major" as "major",
      "PInfo"."class" as "class",
      "PInfo"."shouldCredit" as "shouldCredit",
      "getCredit"."tcredit" as "getCredit"
    from 
    (select
      "profile"."objectId" as "uid",
      "profile"."name" as "user",
      "department"."name" as "school",
      "schoolMajor"."name" as "major",
      "schoolMajor"."objectId" as "mid",
      "schoolMajor"."plan" as "plan",
      "schoolMajor"."totalCredit" as "shouldCredit",
      "schoolClass"."name" as "class"
    from "Profile" as "profile"
    left join "Department" as "department" on "department"."objectId" = "profile"."department" 
    left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
    left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
    where  "profile"."company" = '${this.company}') and "profile"."department" = '${this.school}' and "profile"."SchoolMajor" = '${this.major.id}' and "profile"."name" = '${this.student}' as "PInfo"
    left join 
    (SELECT 
      max("Credit"."uid") as "uid",
      sum(
      case when ("Credit"."videograde" * 0.4) + (case when "TestGread"."totalScore" is not null then ("TestGread"."totalScore" * 0.6) else 0 end) 
        > 60 then "Credit"."credit" else 0 end) as "tcredit"
    from
    (SELECT 
      "R"."uid" as "uid",
      "R"."lid" as "lid",
      "R"."test" as "sid",
      "R"."user" as "user",
      "R"."credit" as "credit",
      round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
    from 
    (SELECT
            max("profile"."name")  as "user",
            max("profile"."objectId")  as "uid",
            max("lesson"."objectId") as "lid",
          max("lesson"."credit") as "credit",
          max("lesson"."lessonTest") as "test",
            sum("record"."time") as "totalTime",
            sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
          from "LessonRecord" as "record"
          left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
          left join "Department" as "Department" on "Department"."objectId" = "record"."department"
          left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
          left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
          left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
        where "record"."company" = '${this.company}'
          group by "record"."user", "record"."lesson") as "R"
    left join 
    (select
        count(1) as "total",
        max("LessonArticle"."objectId") as "laid",
      max("LessonArticle"."lesson") as "lid"
      from "LessonArticle"
      left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
      where "LessonArticle"."parent" is not null and "LessonArticle"."company" = '${this.company}'
      group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
      ) as "Credit"
      left join (select 
        "surveylog"."profile" as "uid",
        "surveylog"."survey" as "sid",
        (case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
      from "SurveyLog" as "surveylog" where "surveylog"."company" = '${this.company}') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid"
      group by "Credit"."uid") as "getCredit" on "getCredit"."uid" = "PInfo"."uid"
      `
      }
    }
   this.searchAll(sql)
  }
}
