import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
interface DataItem {
  user: string;
  school: string;
  major: string;
  class: string;
  lesson: string;
  totalTime:any
}
@Component({
  selector: 'app-record-dashboard',
  templateUrl: './record-dashboard.component.html',
  styleUrls: ['./record-dashboard.component.scss']
})
export class RecordDashboardComponent implements OnInit {
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
      title: '课程名称',
      compare: null,
      priority: false
    },
    
    {
      title: '学习状态',
      compare: null,
      priority: false
    },
    {
      title: '学习进度',
      compare: null,
      priority: false
    },
    {
      title: '学习时长',
      compare: (a: DataItem, b: DataItem) => a.totalTime - b.totalTime,
      priority: false
    },
    {
      title: '操作',
      compare: null,
      priority: false
    }
  ];
  listOfData: DataItem[] = [];
  constructor(private http: HttpClient,private router: Router ) {  }
  company:any
  department:any;
  isShcool:boolean = true;
  async ngOnInit() {
    if(localStorage.getItem('department')) {
      this.department = localStorage.getItem('department')
      let Department = new Parse.Query("Department")
     await Department.get(this.department).then(res => {``
        this.showSchool = false
        if(res && res.get('school')) {
          console.log(res.get('school')[0].id)
          this.isShcool = false
          this.changeSchool(res.get('school')[0].id)
        } else {
          this.changeSchool(res.id)
        }
      })
    }
    await this.getCompany(this.department).then(res => {
      console.log(this.company)
      this.searchAll()
      this.getSchool()
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
  schools:any // 所有学校
  school:any // 选择的学校
  majors:any // 选择学校的所有专业
  major: any // 选择的专业
  classes: any // 对应专业下面的所有班级
  class:any // 选择需要查看的班级
  lessons:any = [] // 对应专业的所有课程
  lesson:any // 选择的课程
  showSchool:boolean = true
  getSchool() {
    let Department = new Parse.Query('Department')
    if(this.company == 'pPZbxElQQo') {
      Department.equalTo('category', 'erVPCmBAgt')
    }
    Department.equalTo('company', this.company)
    Department.find().then(res => {
      console.log(res)
      this.schools = res
    })
  }
  searchAll(csql?) { // 优化 是否有参数csql 来判断，有csql就不需要走if 判断
    // let 
    let sql
    if(localStorage.getItem('department')) {
      let department = localStorage.getItem('department') 
      if(!this.isShcool) {
        // 代理中心
        sql = csql ? csql : `select
    "PInfo"."uid" as "uid",
    "PInfo"."mid" as "mid",
    "PInfo"."lid" as "lid",
    "PInfo"."user" as "user",
    "PInfo"."school" as "school",
    "PInfo"."major" as "major",
    "PInfo"."class" as "class",
    "PInfo"."title" as "title",
    "LRInfo"."totalTime" as "totalTime",
    "LRInfo"."downCount" as "downCount",
    "LRInfo"."total" as "total"
  from 
    (select 
      "PR"."pid" as "uid",
      "PR"."mid" as "mid",
      "PR"."name" as "user",
      "PR"."school" as "school",
      "PR"."major" as "major",
      "PR"."class" as "class",
      "M"."title" as "title",
      "M"."objectId" as "lid"
    from
      (select
        "profile"."objectId" as "pid",
        "profile"."name" as "name",
        "department"."name" as "school",
        "schoolMajor"."name" as "major",
        "schoolMajor"."objectId" as "mid",
        "schoolMajor"."plan" as "plan",
        "schoolClass"."name" as "class"
      from "Profile" as "profile"
      left join "Department" as "department" on "department"."objectId" = "profile"."department" 
      left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
      left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
      where "profile"."company" = 'pPZbxElQQo' and "profile"."center" = '${department}') as "PR"
  left join
  (select 
    max("majors"."majorid") as "majorid",
    max("majors"."planid") as "planid",
    max("majors"."name") as "name",
    max("lessons"."objectId") as "objectId",
    max("lessons"."title") as "title",
    max("lessons"."teacher") as "teacher"
  from
  (select 
    "schoolMajor"."objectId" as "majorid",
     "schoolMajor"."plan" as "planid",
    "schoolMajor"."name" as "name"
  from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
  left join (
    select 
      "lessonObjectId"."planid" as "planid",
      "lessonObjectId"."objectId" as "objectId" ,
        "lesson"."title" as "title" ,
      "teacher"."name" as "teacher" 
    from
       (select 
           "lessons"."lesson"::json->>'objectId' as "objectId",
        "lessons"."planid" as "planid"
        from (
        select 
             jsonb_array_elements("plan"."lessons") as "lesson",
          "plan"."objectId" as "planid"
             from "SchoolPlan" as "plan"
       left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
    left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
    left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
  ) as "lessons" on "lessons"."planid" = "majors"."planid"
  group by "majorid", "objectId"
  order by "majorid") as "M" on  "PR"."mid" = "M"."majorid") as "PInfo"
  left join (
    SELECT 
    "R"."user" as "user",
    "R"."uid" as "uid",
    "R"."lid" as "lid",
    "R"."totalTime" as "totalTime",
    "R"."downCount" as "downCount",
    "totalCount"."total" as "total"
  from 
  (SELECT
          max("profile"."name")  as "user",
          max("profile"."objectId")  as "uid",
          max("lesson"."objectId") as "lid",
          sum("record"."time") as "totalTime",
          sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
       from "LessonRecord" as "record"
        left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
        left join "Department" as "Department" on "Department"."objectId" = "record"."department"
        left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
        left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
      where "record"."company" = 'pPZbxElQQo'
        group by "record"."user", "record"."lesson") as "R"
  left join 
  (select
     count(1) as "total",
     max("LessonArticle"."objectId") as "laid",
    max("LessonArticle"."lesson") as "lid"
   from "LessonArticle"
   left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
   where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
   group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
        ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`

      } else{
        //  学校
        sql = csql ? csql : `select
    "PInfo"."uid" as "uid",
    "PInfo"."mid" as "mid",
    "PInfo"."lid" as "lid",
    "PInfo"."user" as "user",
    "PInfo"."school" as "school",
    "PInfo"."major" as "major",
    "PInfo"."class" as "class",
    "PInfo"."title" as "title",
    "LRInfo"."totalTime" as "totalTime",
    "LRInfo"."downCount" as "downCount",
    "LRInfo"."total" as "total"
  from 
    (select 
      "PR"."pid" as "uid",
      "PR"."mid" as "mid",
      "PR"."name" as "user",
      "PR"."school" as "school",
      "PR"."major" as "major",
      "PR"."class" as "class",
      "M"."title" as "title",
      "M"."objectId" as "lid"
    from
      (select
        "profile"."objectId" as "pid",
        "profile"."name" as "name",
        "department"."name" as "school",
        "schoolMajor"."name" as "major",
        "schoolMajor"."objectId" as "mid",
        "schoolMajor"."plan" as "plan",
        "schoolClass"."name" as "class"
      from "Profile" as "profile"
      left join "Department" as "department" on "department"."objectId" = "profile"."department" 
      left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
      left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
      where "profile"."company" = 'pPZbxElQQo' and "profile"."department" = '${department}') as "PR"
  left join
  (select 
    max("majors"."majorid") as "majorid",
    max("majors"."planid") as "planid",
    max("majors"."name") as "name",
    max("lessons"."objectId") as "objectId",
    max("lessons"."title") as "title",
    max("lessons"."teacher") as "teacher"
  from
  (select 
    "schoolMajor"."objectId" as "majorid",
     "schoolMajor"."plan" as "planid",
    "schoolMajor"."name" as "name"
  from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
  left join (
    select 
      "lessonObjectId"."planid" as "planid",
      "lessonObjectId"."objectId" as "objectId" ,
        "lesson"."title" as "title" ,
      "teacher"."name" as "teacher" 
    from
       (select 
           "lessons"."lesson"::json->>'objectId' as "objectId",
        "lessons"."planid" as "planid"
        from (
        select 
             jsonb_array_elements("plan"."lessons") as "lesson",
          "plan"."objectId" as "planid"
             from "SchoolPlan" as "plan"
       left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
    left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
    left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
  ) as "lessons" on "lessons"."planid" = "majors"."planid"
  group by "majorid", "objectId"
  order by "majorid") as "M" on  "PR"."mid" = "M"."majorid") as "PInfo"
  left join (
    SELECT 
    "R"."user" as "user",
    "R"."uid" as "uid",
    "R"."lid" as "lid",
    "R"."totalTime" as "totalTime",
    "R"."downCount" as "downCount",
    "totalCount"."total" as "total"
  from 
  (SELECT
          max("profile"."name")  as "user",
          max("profile"."objectId")  as "uid",
          max("lesson"."objectId") as "lid",
          sum("record"."time") as "totalTime",
          sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
       from "LessonRecord" as "record"
        left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
        left join "Department" as "Department" on "Department"."objectId" = "record"."department"
        left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
        left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
      where "record"."company" = 'pPZbxElQQo'
        group by "record"."user", "record"."lesson") as "R"
  left join 
  (select
     count(1) as "total",
     max("LessonArticle"."objectId") as "laid",
    max("LessonArticle"."lesson") as "lid"
   from "LessonArticle"
   left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
   where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
   group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
        ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`
      }
    } else{
      // 总部
      sql = csql ? csql : `select
    "PInfo"."uid" as "uid",
    "PInfo"."mid" as "mid",
    "PInfo"."lid" as "lid",
    "PInfo"."user" as "user",
    "PInfo"."school" as "school",
    "PInfo"."major" as "major",
    "PInfo"."class" as "class",
    "PInfo"."title" as "title",
    "LRInfo"."totalTime" as "totalTime",
    "LRInfo"."downCount" as "downCount",
    "LRInfo"."total" as "total"
  from 
    (select 
      "PR"."pid" as "uid",
      "PR"."mid" as "mid",
      "PR"."name" as "user",
      "PR"."school" as "school",
      "PR"."major" as "major",
      "PR"."class" as "class",
      "M"."title" as "title",
      "M"."objectId" as "lid"
    from
      (select
        "profile"."objectId" as "pid",
        "profile"."name" as "name",
        "department"."name" as "school",
        "schoolMajor"."name" as "major",
        "schoolMajor"."objectId" as "mid",
        "schoolMajor"."plan" as "plan",
        "schoolClass"."name" as "class"
      from "Profile" as "profile"
      left join "Department" as "department" on "department"."objectId" = "profile"."department" 
      left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
      left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
      where "profile"."company" = 'pPZbxElQQo') as "PR"
  left join
  (select 
    max("majors"."majorid") as "majorid",
    max("majors"."planid") as "planid",
    max("majors"."name") as "name",
    max("lessons"."objectId") as "objectId",
    max("lessons"."title") as "title",
    max("lessons"."teacher") as "teacher"
  from
  (select 
    "schoolMajor"."objectId" as "majorid",
     "schoolMajor"."plan" as "planid",
    "schoolMajor"."name" as "name"
  from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
  left join (
    select 
      "lessonObjectId"."planid" as "planid",
      "lessonObjectId"."objectId" as "objectId" ,
        "lesson"."title" as "title" ,
      "teacher"."name" as "teacher" 
    from
       (select 
           "lessons"."lesson"::json->>'objectId' as "objectId",
        "lessons"."planid" as "planid"
        from (
        select 
             jsonb_array_elements("plan"."lessons") as "lesson",
          "plan"."objectId" as "planid"
             from "SchoolPlan" as "plan"
       left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
    left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
    left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
  ) as "lessons" on "lessons"."planid" = "majors"."planid"
  group by "majorid", "objectId"
  order by "majorid") as "M" on  "PR"."mid" = "M"."majorid") as "PInfo"
  left join (
    SELECT 
    "R"."user" as "user",
    "R"."uid" as "uid",
    "R"."lid" as "lid",
    "R"."totalTime" as "totalTime",
    "R"."downCount" as "downCount",
    "totalCount"."total" as "total"
  from 
  (SELECT
          max("profile"."name")  as "user",
          max("profile"."objectId")  as "uid",
          max("lesson"."objectId") as "lid",
          sum("record"."time") as "totalTime",
          sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
       from "LessonRecord" as "record"
        left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
        left join "Department" as "Department" on "Department"."objectId" = "record"."department"
        left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
        left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
      where "record"."company" = 'pPZbxElQQo'
        group by "record"."user", "record"."lesson") as "R"
  left join 
  (select
     count(1) as "total",
     max("LessonArticle"."objectId") as "laid",
    max("LessonArticle"."lesson") as "lid"
   from "LessonArticle"
   left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
   where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
   group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
        ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`
    }
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    this.http.post(baseurl, {sql: sql}).subscribe(res => {
        console.log(res)
        if(res["code"] == 200 && res["data"] ) {
          this.listOfData = res["data"]
        }
      })
  }
  async changeSchool(ev) {
    if(!ev) {
      this.major = null,
      this.lesson = null,
      this.majors = []
      this.lessons = []
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
  changeMajors(ev) {
    console.log(ev)
    if(ev && ev.id) {
      this.major = ev.id
    } else {
      this.lesson = []
      this.lessons = []
      return
    }
    let lessons = ev.get('plan').get('lessons')
    if(lessons && lessons.length > 0) {
      lessons.forEach(lesson => {
        let Lesson = new Parse.Query('Lesson')
        Lesson.get(lesson.id).then(res => {
          if(res && res.id) {
            this.lessons.push(res)
          }
        }) 
      });
    }
  }
  changeLesson(ev) {
    if(ev && ev.id) {
      this.lesson = ev.id
    }
  }
  student:any
  
  // 查询
  search() {
    if((this.student && (!this.school || !this.lesson || !this.major)) || !this.school) {
      alert("请输入完整信息")
      return
    }
    let sql
    if(localStorage.getItem('department')) {
      let department = localStorage.getItem('department')
      if(!this.isShcool) {
        // 代理中心
        if(this.school && !this.lesson && !this.major) {
          sql = `select
         "PInfo"."uid" as "uid",
         "PInfo"."mid" as "mid",
         "PInfo"."lid" as "lid",
         "PInfo"."user" as "user",
         "PInfo"."school" as "school",
         "PInfo"."major" as "major",
         "PInfo"."class" as "class",
         "PInfo"."title" as "title",
         "LRInfo"."totalTime" as "totalTime",
         "LRInfo"."downCount" as "downCount",
         "LRInfo"."total" as "total"
       from 
         (select 
           "PR"."pid" as "uid",
           "PR"."mid" as "mid",
           "PR"."name" as "user",
           "PR"."school" as "school",
           "PR"."major" as "major",
           "PR"."class" as "class",
           "M"."title" as "title",
           "M"."objectId" as "lid"
         from
           (select
             "profile"."objectId" as "pid",
             "profile"."name" as "name",
             "department"."name" as "school",
             "schoolMajor"."name" as "major",
             "schoolMajor"."objectId" as "mid",
             "schoolMajor"."plan" as "plan",
             "schoolClass"."name" as "class"
           from "Profile" as "profile"
           left join "Department" as "department" on "department"."objectId" = "profile"."department" 
           left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
           left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
           where "profile"."company" = 'pPZbxElQQo' and "profile"."center" = '${department}' ) as "PR"
       left join
       (select 
         max("majors"."majorid") as "majorid",
         max("majors"."planid") as "planid",
         max("majors"."name") as "name",
         max("lessons"."objectId") as "objectId",
         max("lessons"."title") as "title",
         max("lessons"."teacher") as "teacher"
       from
       (select 
         "schoolMajor"."objectId" as "majorid",
          "schoolMajor"."plan" as "planid",
         "schoolMajor"."name" as "name"
       from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
       left join (
         select 
           "lessonObjectId"."planid" as "planid",
           "lessonObjectId"."objectId" as "objectId" ,
             "lesson"."title" as "title" ,
           "teacher"."name" as "teacher" 
         from
            (select 
                "lessons"."lesson"::json->>'objectId' as "objectId",
             "lessons"."planid" as "planid"
             from (
             select 
                  jsonb_array_elements("plan"."lessons") as "lesson",
               "plan"."objectId" as "planid"
                  from "SchoolPlan" as "plan"
            left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
         left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
         left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
       ) as "lessons" on "lessons"."planid" = "majors"."planid"
       group by "majorid", "objectId"
       order by "majorid") as "M" on  "PR"."mid" = "M"."majorid") as "PInfo"
       left join (
         SELECT 
         "R"."user" as "user",
         "R"."uid" as "uid",
         "R"."lid" as "lid",
         "R"."totalTime" as "totalTime",
         "R"."downCount" as "downCount",
         "totalCount"."total" as "total"
       from 
       (SELECT
               max("profile"."name")  as "user",
               max("profile"."objectId")  as "uid",
               max("lesson"."objectId") as "lid",
               sum("record"."time") as "totalTime",
               sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
            from "LessonRecord" as "record"
             left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
             left join "Department" as "Department" on "Department"."objectId" = "record"."department"
             left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
             left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
             left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
           where "record"."company" = 'pPZbxElQQo'
             group by "record"."user", "record"."lesson") as "R"
       left join 
       (select
          count(1) as "total",
          max("LessonArticle"."objectId") as "laid",
         max("LessonArticle"."lesson") as "lid"
        from "LessonArticle"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
        where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
        group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
             ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`  
        }      
        if( this.major && this.school && !this.lesson) {
              sql = `select
            "PInfo"."uid" as "uid",
            "PInfo"."mid" as "mid",
            "PInfo"."lid" as "lid",
            "PInfo"."user" as "user",
            "PInfo"."school" as "school",
            "PInfo"."major" as "major",
            "PInfo"."class" as "class",
            "PInfo"."title" as "title",
            "LRInfo"."totalTime" as "totalTime",
            "LRInfo"."downCount" as "downCount",
            "LRInfo"."total" as "total"
          from 
            (select 
              "PR"."pid" as "uid",
              "PR"."mid" as "mid",
              "PR"."name" as "user",
              "PR"."school" as "school",
              "PR"."major" as "major",
              "PR"."class" as "class",
              "M"."title" as "title",
              "M"."objectId" as "lid"
            from
              (select
                "profile"."objectId" as "pid",
                "profile"."name" as "name",
                "department"."name" as "school",
                "schoolMajor"."name" as "major",
                "schoolMajor"."objectId" as "mid",
                "schoolMajor"."plan" as "plan",
                "schoolClass"."name" as "class"
              from "Profile" as "profile"
              left join "Department" as "department" on "department"."objectId" = "profile"."department" 
              left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
              left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
              where "profile"."company" = 'pPZbxElQQo' and "profile"."center" = '${department}' and "profile"."SchoolMajor" = '${this.major.id}') as "PR"
          left join
          (select 
            max("majors"."majorid") as "majorid",
            max("majors"."planid") as "planid",
            max("majors"."name") as "name",
            max("lessons"."objectId") as "objectId",
            max("lessons"."title") as "title",
            max("lessons"."teacher") as "teacher"
          from
          (select 
            "schoolMajor"."objectId" as "majorid",
              "schoolMajor"."plan" as "planid",
            "schoolMajor"."name" as "name"
          from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
          left join (
            select 
              "lessonObjectId"."planid" as "planid",
              "lessonObjectId"."objectId" as "objectId" ,
                "lesson"."title" as "title" ,
              "teacher"."name" as "teacher" 
            from
                (select 
                    "lessons"."lesson"::json->>'objectId' as "objectId",
                "lessons"."planid" as "planid"
                from (
                select 
                      jsonb_array_elements("plan"."lessons") as "lesson",
                  "plan"."objectId" as "planid"
                      from "SchoolPlan" as "plan"
                left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
            left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
            left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
          ) as "lessons" on "lessons"."planid" = "majors"."planid"
          group by "majorid", "objectId"
          order by "majorid") as "M" on  "PR"."mid" = "M"."majorid") as "PInfo"
          left join (
            SELECT 
            "R"."user" as "user",
            "R"."uid" as "uid",
            "R"."lid" as "lid",
            "R"."totalTime" as "totalTime",
            "R"."downCount" as "downCount",
            "totalCount"."total" as "total"
          from 
          (SELECT
                  max("profile"."name")  as "user",
                  max("profile"."objectId")  as "uid",
                  max("lesson"."objectId") as "lid",
                  sum("record"."time") as "totalTime",
                  sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
                from "LessonRecord" as "record"
                left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
                left join "Department" as "Department" on "Department"."objectId" = "record"."department"
                left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
                left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
                left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
              where "record"."company" = 'pPZbxElQQo'
                group by "record"."user", "record"."lesson") as "R"
          left join 
          (select
              count(1) as "total",
              max("LessonArticle"."objectId") as "laid",
            max("LessonArticle"."lesson") as "lid"
            from "LessonArticle"
            left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
            where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
            group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
                ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`  
        }
       
        if( this.major && this.school && this.lesson && !this.student) {
          sql = `select
        "PInfo"."uid" as "uid",
        "PInfo"."mid" as "mid",
        "PInfo"."lid" as "lid",
        "PInfo"."user" as "user",
        "PInfo"."school" as "school",
        "PInfo"."major" as "major",
        "PInfo"."class" as "class",
        "PInfo"."title" as "title",
        "LRInfo"."totalTime" as "totalTime",
        "LRInfo"."downCount" as "downCount",
        "LRInfo"."total" as "total"
      from 
        (select 
          "PR"."pid" as "uid",
          "PR"."mid" as "mid",
          "PR"."name" as "user",
          "PR"."school" as "school",
          "PR"."major" as "major",
          "PR"."class" as "class",
          "M"."title" as "title",
          "M"."objectId" as "lid"
        from
          (select
            "profile"."objectId" as "pid",
            "profile"."name" as "name",
            "department"."name" as "school",
            "schoolMajor"."name" as "major",
            "schoolMajor"."objectId" as "mid",
            "schoolMajor"."plan" as "plan",
            "schoolClass"."name" as "class"
          from "Profile" as "profile"
          left join "Department" as "department" on "department"."objectId" = "profile"."department" 
          left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
          left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
          where "profile"."company" = 'pPZbxElQQo' and "profile"."center" = '${department}'
          and "profile"."SchoolMajor" = '${this.major.id}') as "PR"
      left join
      (select 
        max("majors"."majorid") as "majorid",
        max("majors"."planid") as "planid",
        max("majors"."name") as "name",
        max("lessons"."objectId") as "objectId",
        max("lessons"."title") as "title",
        max("lessons"."teacher") as "teacher"
      from
      (select 
        "schoolMajor"."objectId" as "majorid",
          "schoolMajor"."plan" as "planid",
        "schoolMajor"."name" as "name"
      from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
      left join (
        select 
          "lessonObjectId"."planid" as "planid",
          "lessonObjectId"."objectId" as "objectId" ,
            "lesson"."title" as "title" ,
          "teacher"."name" as "teacher" 
        from
            (select 
                "lessons"."lesson"::json->>'objectId' as "objectId",
            "lessons"."planid" as "planid"
            from (
            select 
                  jsonb_array_elements("plan"."lessons") as "lesson",
              "plan"."objectId" as "planid"
                  from "SchoolPlan" as "plan"
            left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
        left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
        left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
      ) as "lessons" on "lessons"."planid" = "majors"."planid"
      group by "majorid", "objectId"
      order by "majorid") as "M" on  "PR"."mid" = "M"."majorid"
      where "M"."objectId" = '${this.lesson}'
      ) as "PInfo"
      left join (
        SELECT 
        "R"."user" as "user",
        "R"."uid" as "uid",
        "R"."lid" as "lid",
        "R"."totalTime" as "totalTime",
        "R"."downCount" as "downCount",
        "totalCount"."total" as "total"
      from 
      (SELECT
              max("profile"."name")  as "user",
              max("profile"."objectId")  as "uid",
              max("lesson"."objectId") as "lid",
              sum("record"."time") as "totalTime",
              sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
            from "LessonRecord" as "record"
            left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
            left join "Department" as "Department" on "Department"."objectId" = "record"."department"
            left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
            left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
            left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
          where "record"."company" = 'pPZbxElQQo'
            group by "record"."user", "record"."lesson") as "R"
      left join 
      (select
          count(1) as "total",
          max("LessonArticle"."objectId") as "laid",
        max("LessonArticle"."lesson") as "lid"
        from "LessonArticle"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
        where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
        group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
            ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`  
        }
        if(this.school && this.major && this.lesson && this.student ) {
          sql = `select
        "PInfo"."uid" as "uid",
        "PInfo"."mid" as "mid",
        "PInfo"."lid" as "lid",
        "PInfo"."user" as "user",
        "PInfo"."school" as "school",
        "PInfo"."major" as "major",
        "PInfo"."class" as "class",
        "PInfo"."title" as "title",
        "LRInfo"."totalTime" as "totalTime",
        "LRInfo"."downCount" as "downCount",
        "LRInfo"."total" as "total"
      from 
        (select 
          "PR"."pid" as "uid",
          "PR"."mid" as "mid",
          "PR"."name" as "user",
          "PR"."school" as "school",
          "PR"."major" as "major",
          "PR"."class" as "class",
          "M"."title" as "title",
          "M"."objectId" as "lid"
        from
          (select
            "profile"."objectId" as "pid",
            "profile"."name" as "name",
            "department"."name" as "school",
            "schoolMajor"."name" as "major",
            "schoolMajor"."objectId" as "mid",
            "schoolMajor"."plan" as "plan",
            "schoolClass"."name" as "class"
          from "Profile" as "profile"
          left join "Department" as "department" on "department"."objectId" = "profile"."department" 
          left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
          left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
          where "profile"."name" = '${this.student}' and "profile"."company" = 'pPZbxElQQo' and "profile"."center" = '${department}'
          and "profile"."SchoolMajor" = '${this.major.id}') as "PR"
      left join
      (select 
        max("majors"."majorid") as "majorid",
        max("majors"."planid") as "planid",
        max("majors"."name") as "name",
        max("lessons"."objectId") as "objectId",
        max("lessons"."title") as "title",
        max("lessons"."teacher") as "teacher"
      from
      (select 
        "schoolMajor"."objectId" as "majorid",
          "schoolMajor"."plan" as "planid",
        "schoolMajor"."name" as "name"
      from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
      left join (
        select 
          "lessonObjectId"."planid" as "planid",
          "lessonObjectId"."objectId" as "objectId" ,
            "lesson"."title" as "title" ,
          "teacher"."name" as "teacher" 
        from
            (select 
                "lessons"."lesson"::json->>'objectId' as "objectId",
            "lessons"."planid" as "planid"
            from (
            select 
                  jsonb_array_elements("plan"."lessons") as "lesson",
              "plan"."objectId" as "planid"
                  from "SchoolPlan" as "plan"
            left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
        left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
        left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
      ) as "lessons" on "lessons"."planid" = "majors"."planid"
      group by "majorid", "objectId"
      order by "majorid") as "M" on  "PR"."mid" = "M"."majorid"
      where "M"."objectId" = '${this.lesson}'
      ) as "PInfo"
      left join (
        SELECT 
        "R"."user" as "user",
        "R"."uid" as "uid",
        "R"."lid" as "lid",
        "R"."totalTime" as "totalTime",
        "R"."downCount" as "downCount",
        "totalCount"."total" as "total"
      from 
      (SELECT
              max("profile"."name")  as "user",
              max("profile"."objectId")  as "uid",
              max("lesson"."objectId") as "lid",
              sum("record"."time") as "totalTime",
              sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
            from "LessonRecord" as "record"
            left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
            left join "Department" as "Department" on "Department"."objectId" = "record"."department"
            left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
            left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
            left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
          where "record"."company" = 'pPZbxElQQo'
            group by "record"."user", "record"."lesson") as "R"
      left join 
      (select
          count(1) as "total",
          max("LessonArticle"."objectId") as "laid",
        max("LessonArticle"."lesson") as "lid"
        from "LessonArticle"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
        where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
        group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
            ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`
  
        }
      } else {
        // 学校
        if(this.school && !this.lesson && !this.major) {
          sql = `select
         "PInfo"."uid" as "uid",
         "PInfo"."mid" as "mid",
         "PInfo"."lid" as "lid",
         "PInfo"."user" as "user",
         "PInfo"."school" as "school",
         "PInfo"."major" as "major",
         "PInfo"."class" as "class",
         "PInfo"."title" as "title",
         "LRInfo"."totalTime" as "totalTime",
         "LRInfo"."downCount" as "downCount",
         "LRInfo"."total" as "total"
       from 
         (select 
           "PR"."pid" as "uid",
           "PR"."mid" as "mid",
           "PR"."name" as "user",
           "PR"."school" as "school",
           "PR"."major" as "major",
           "PR"."class" as "class",
           "M"."title" as "title",
           "M"."objectId" as "lid"
         from
           (select
             "profile"."objectId" as "pid",
             "profile"."name" as "name",
             "department"."name" as "school",
             "schoolMajor"."name" as "major",
             "schoolMajor"."objectId" as "mid",
             "schoolMajor"."plan" as "plan",
             "schoolClass"."name" as "class"
           from "Profile" as "profile"
           left join "Department" as "department" on "department"."objectId" = "profile"."department" 
           left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
           left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
           where "profile"."company" = 'pPZbxElQQo' and "profile"."department" = '${this.school}' ) as "PR"
       left join
       (select 
         max("majors"."majorid") as "majorid",
         max("majors"."planid") as "planid",
         max("majors"."name") as "name",
         max("lessons"."objectId") as "objectId",
         max("lessons"."title") as "title",
         max("lessons"."teacher") as "teacher"
       from
       (select 
         "schoolMajor"."objectId" as "majorid",
          "schoolMajor"."plan" as "planid",
         "schoolMajor"."name" as "name"
       from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
       left join (
         select 
           "lessonObjectId"."planid" as "planid",
           "lessonObjectId"."objectId" as "objectId" ,
             "lesson"."title" as "title" ,
           "teacher"."name" as "teacher" 
         from
            (select 
                "lessons"."lesson"::json->>'objectId' as "objectId",
             "lessons"."planid" as "planid"
             from (
             select 
                  jsonb_array_elements("plan"."lessons") as "lesson",
               "plan"."objectId" as "planid"
                  from "SchoolPlan" as "plan"
            left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
         left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
         left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
       ) as "lessons" on "lessons"."planid" = "majors"."planid"
       group by "majorid", "objectId"
       order by "majorid") as "M" on  "PR"."mid" = "M"."majorid") as "PInfo"
       left join (
         SELECT 
         "R"."user" as "user",
         "R"."uid" as "uid",
         "R"."lid" as "lid",
         "R"."totalTime" as "totalTime",
         "R"."downCount" as "downCount",
         "totalCount"."total" as "total"
       from 
       (SELECT
               max("profile"."name")  as "user",
               max("profile"."objectId")  as "uid",
               max("lesson"."objectId") as "lid",
               sum("record"."time") as "totalTime",
               sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
            from "LessonRecord" as "record"
             left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
             left join "Department" as "Department" on "Department"."objectId" = "record"."department"
             left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
             left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
             left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
           where "record"."company" = 'pPZbxElQQo'
             group by "record"."user", "record"."lesson") as "R"
       left join 
       (select
          count(1) as "total",
          max("LessonArticle"."objectId") as "laid",
         max("LessonArticle"."lesson") as "lid"
        from "LessonArticle"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
        where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
        group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
             ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`  
        }      
        if( this.major && this.school && !this.lesson) {
            sql = `select
          "PInfo"."uid" as "uid",
          "PInfo"."mid" as "mid",
          "PInfo"."lid" as "lid",
          "PInfo"."user" as "user",
          "PInfo"."school" as "school",
          "PInfo"."major" as "major",
          "PInfo"."class" as "class",
          "PInfo"."title" as "title",
          "LRInfo"."totalTime" as "totalTime",
          "LRInfo"."downCount" as "downCount",
          "LRInfo"."total" as "total"
        from 
          (select 
            "PR"."pid" as "uid",
            "PR"."mid" as "mid",
            "PR"."name" as "user",
            "PR"."school" as "school",
            "PR"."major" as "major",
            "PR"."class" as "class",
            "M"."title" as "title",
            "M"."objectId" as "lid"
          from
            (select
              "profile"."objectId" as "pid",
              "profile"."name" as "name",
              "department"."name" as "school",
              "schoolMajor"."name" as "major",
              "schoolMajor"."objectId" as "mid",
              "schoolMajor"."plan" as "plan",
              "schoolClass"."name" as "class"
            from "Profile" as "profile"
            left join "Department" as "department" on "department"."objectId" = "profile"."department" 
            left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
            left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
            where "profile"."company" = 'pPZbxElQQo' and "profile"."department" = '${this.school}' and "profile"."SchoolMajor" = '${this.major.id}') as "PR"
        left join
        (select 
          max("majors"."majorid") as "majorid",
          max("majors"."planid") as "planid",
          max("majors"."name") as "name",
          max("lessons"."objectId") as "objectId",
          max("lessons"."title") as "title",
          max("lessons"."teacher") as "teacher"
        from
        (select 
          "schoolMajor"."objectId" as "majorid",
            "schoolMajor"."plan" as "planid",
          "schoolMajor"."name" as "name"
        from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
        left join (
          select 
            "lessonObjectId"."planid" as "planid",
            "lessonObjectId"."objectId" as "objectId" ,
              "lesson"."title" as "title" ,
            "teacher"."name" as "teacher" 
          from
              (select 
                  "lessons"."lesson"::json->>'objectId' as "objectId",
              "lessons"."planid" as "planid"
              from (
              select 
                    jsonb_array_elements("plan"."lessons") as "lesson",
                "plan"."objectId" as "planid"
                    from "SchoolPlan" as "plan"
              left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
          left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
          left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
        ) as "lessons" on "lessons"."planid" = "majors"."planid"
        group by "majorid", "objectId"
        order by "majorid") as "M" on  "PR"."mid" = "M"."majorid") as "PInfo"
        left join (
          SELECT 
          "R"."user" as "user",
          "R"."uid" as "uid",
          "R"."lid" as "lid",
          "R"."totalTime" as "totalTime",
          "R"."downCount" as "downCount",
          "totalCount"."total" as "total"
        from 
        (SELECT
                max("profile"."name")  as "user",
                max("profile"."objectId")  as "uid",
                max("lesson"."objectId") as "lid",
                sum("record"."time") as "totalTime",
                sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
              from "LessonRecord" as "record"
              left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
              left join "Department" as "Department" on "Department"."objectId" = "record"."department"
              left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
              left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
              left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
            where "record"."company" = 'pPZbxElQQo'
              group by "record"."user", "record"."lesson") as "R"
        left join 
        (select
            count(1) as "total",
            max("LessonArticle"."objectId") as "laid",
          max("LessonArticle"."lesson") as "lid"
          from "LessonArticle"
          left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
          where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
          group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
              ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`  
        }
       
        if( this.major && this.school && this.lesson && !this.student) {
          sql = `select
        "PInfo"."uid" as "uid",
        "PInfo"."mid" as "mid",
        "PInfo"."lid" as "lid",
        "PInfo"."user" as "user",
        "PInfo"."school" as "school",
        "PInfo"."major" as "major",
        "PInfo"."class" as "class",
        "PInfo"."title" as "title",
        "LRInfo"."totalTime" as "totalTime",
        "LRInfo"."downCount" as "downCount",
        "LRInfo"."total" as "total"
      from 
        (select 
          "PR"."pid" as "uid",
          "PR"."mid" as "mid",
          "PR"."name" as "user",
          "PR"."school" as "school",
          "PR"."major" as "major",
          "PR"."class" as "class",
          "M"."title" as "title",
          "M"."objectId" as "lid"
        from
          (select
            "profile"."objectId" as "pid",
            "profile"."name" as "name",
            "department"."name" as "school",
            "schoolMajor"."name" as "major",
            "schoolMajor"."objectId" as "mid",
            "schoolMajor"."plan" as "plan",
            "schoolClass"."name" as "class"
          from "Profile" as "profile"
          left join "Department" as "department" on "department"."objectId" = "profile"."department" 
          left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
          left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
          where "profile"."company" = 'pPZbxElQQo' and "profile"."department" = '${this.school}'
          and "profile"."SchoolMajor" = '${this.major.id}') as "PR"
      left join
      (select 
        max("majors"."majorid") as "majorid",
        max("majors"."planid") as "planid",
        max("majors"."name") as "name",
        max("lessons"."objectId") as "objectId",
        max("lessons"."title") as "title",
        max("lessons"."teacher") as "teacher"
      from
      (select 
        "schoolMajor"."objectId" as "majorid",
          "schoolMajor"."plan" as "planid",
        "schoolMajor"."name" as "name"
      from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
      left join (
        select 
          "lessonObjectId"."planid" as "planid",
          "lessonObjectId"."objectId" as "objectId" ,
            "lesson"."title" as "title" ,
          "teacher"."name" as "teacher" 
        from
            (select 
                "lessons"."lesson"::json->>'objectId' as "objectId",
            "lessons"."planid" as "planid"
            from (
            select 
                  jsonb_array_elements("plan"."lessons") as "lesson",
              "plan"."objectId" as "planid"
                  from "SchoolPlan" as "plan"
            left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
        left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
        left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
      ) as "lessons" on "lessons"."planid" = "majors"."planid"
      group by "majorid", "objectId"
      order by "majorid") as "M" on  "PR"."mid" = "M"."majorid"
      where "M"."objectId" = '${this.lesson}'
      ) as "PInfo"
      left join (
        SELECT 
        "R"."user" as "user",
        "R"."uid" as "uid",
        "R"."lid" as "lid",
        "R"."totalTime" as "totalTime",
        "R"."downCount" as "downCount",
        "totalCount"."total" as "total"
      from 
      (SELECT
              max("profile"."name")  as "user",
              max("profile"."objectId")  as "uid",
              max("lesson"."objectId") as "lid",
              sum("record"."time") as "totalTime",
              sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
            from "LessonRecord" as "record"
            left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
            left join "Department" as "Department" on "Department"."objectId" = "record"."department"
            left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
            left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
            left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
          where "record"."company" = 'pPZbxElQQo'
            group by "record"."user", "record"."lesson") as "R"
      left join 
      (select
          count(1) as "total",
          max("LessonArticle"."objectId") as "laid",
        max("LessonArticle"."lesson") as "lid"
        from "LessonArticle"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
        where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
        group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
            ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`  
        }
        if(this.school && this.major && this.lesson && this.student ) {
          sql = `select
        "PInfo"."uid" as "uid",
        "PInfo"."mid" as "mid",
        "PInfo"."lid" as "lid",
        "PInfo"."user" as "user",
        "PInfo"."school" as "school",
        "PInfo"."major" as "major",
        "PInfo"."class" as "class",
        "PInfo"."title" as "title",
        "LRInfo"."totalTime" as "totalTime",
        "LRInfo"."downCount" as "downCount",
        "LRInfo"."total" as "total"
      from 
        (select 
          "PR"."pid" as "uid",
          "PR"."mid" as "mid",
          "PR"."name" as "user",
          "PR"."school" as "school",
          "PR"."major" as "major",
          "PR"."class" as "class",
          "M"."title" as "title",
          "M"."objectId" as "lid"
        from
          (select
            "profile"."objectId" as "pid",
            "profile"."name" as "name",
            "department"."name" as "school",
            "schoolMajor"."name" as "major",
            "schoolMajor"."objectId" as "mid",
            "schoolMajor"."plan" as "plan",
            "schoolClass"."name" as "class"
          from "Profile" as "profile"
          left join "Department" as "department" on "department"."objectId" = "profile"."department" 
          left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
          left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
          where "profile"."name" = '${this.student}' and "profile"."company" = 'pPZbxElQQo' and "profile"."department" = '${this.school}'
          and "profile"."SchoolMajor" = '${this.major.id}') as "PR"
      left join
      (select 
        max("majors"."majorid") as "majorid",
        max("majors"."planid") as "planid",
        max("majors"."name") as "name",
        max("lessons"."objectId") as "objectId",
        max("lessons"."title") as "title",
        max("lessons"."teacher") as "teacher"
      from
      (select 
        "schoolMajor"."objectId" as "majorid",
          "schoolMajor"."plan" as "planid",
        "schoolMajor"."name" as "name"
      from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
      left join (
        select 
          "lessonObjectId"."planid" as "planid",
          "lessonObjectId"."objectId" as "objectId" ,
            "lesson"."title" as "title" ,
          "teacher"."name" as "teacher" 
        from
            (select 
                "lessons"."lesson"::json->>'objectId' as "objectId",
            "lessons"."planid" as "planid"
            from (
            select 
                  jsonb_array_elements("plan"."lessons") as "lesson",
              "plan"."objectId" as "planid"
                  from "SchoolPlan" as "plan"
            left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
        left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
        left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
      ) as "lessons" on "lessons"."planid" = "majors"."planid"
      group by "majorid", "objectId"
      order by "majorid") as "M" on  "PR"."mid" = "M"."majorid"
      where "M"."objectId" = '${this.lesson}'
      ) as "PInfo"
      left join (
        SELECT 
        "R"."user" as "user",
        "R"."uid" as "uid",
        "R"."lid" as "lid",
        "R"."totalTime" as "totalTime",
        "R"."downCount" as "downCount",
        "totalCount"."total" as "total"
      from 
      (SELECT
              max("profile"."name")  as "user",
              max("profile"."objectId")  as "uid",
              max("lesson"."objectId") as "lid",
              sum("record"."time") as "totalTime",
              sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
            from "LessonRecord" as "record"
            left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
            left join "Department" as "Department" on "Department"."objectId" = "record"."department"
            left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
            left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
            left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
          where "record"."company" = 'pPZbxElQQo'
            group by "record"."user", "record"."lesson") as "R"
      left join 
      (select
          count(1) as "total",
          max("LessonArticle"."objectId") as "laid",
        max("LessonArticle"."lesson") as "lid"
        from "LessonArticle"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
        where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
        group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
            ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`
  
        }
      }
    } else {
      // 总部
      if(this.school && !this.lesson && !this.major) {
      sql = `select
     "PInfo"."uid" as "uid",
     "PInfo"."mid" as "mid",
     "PInfo"."lid" as "lid",
     "PInfo"."user" as "user",
     "PInfo"."school" as "school",
     "PInfo"."major" as "major",
     "PInfo"."class" as "class",
     "PInfo"."title" as "title",
     "LRInfo"."totalTime" as "totalTime",
     "LRInfo"."downCount" as "downCount",
     "LRInfo"."total" as "total"
   from 
     (select 
       "PR"."pid" as "uid",
       "PR"."mid" as "mid",
       "PR"."name" as "user",
       "PR"."school" as "school",
       "PR"."major" as "major",
       "PR"."class" as "class",
       "M"."title" as "title",
       "M"."objectId" as "lid"
     from
       (select
         "profile"."objectId" as "pid",
         "profile"."name" as "name",
         "department"."name" as "school",
         "schoolMajor"."name" as "major",
         "schoolMajor"."objectId" as "mid",
         "schoolMajor"."plan" as "plan",
         "schoolClass"."name" as "class"
       from "Profile" as "profile"
       left join "Department" as "department" on "department"."objectId" = "profile"."department" 
       left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
       left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
       where "profile"."company" = 'pPZbxElQQo' and "profile"."department" = '${this.school}' ) as "PR"
   left join
   (select 
     max("majors"."majorid") as "majorid",
     max("majors"."planid") as "planid",
     max("majors"."name") as "name",
     max("lessons"."objectId") as "objectId",
     max("lessons"."title") as "title",
     max("lessons"."teacher") as "teacher"
   from
   (select 
     "schoolMajor"."objectId" as "majorid",
      "schoolMajor"."plan" as "planid",
     "schoolMajor"."name" as "name"
   from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
   left join (
     select 
       "lessonObjectId"."planid" as "planid",
       "lessonObjectId"."objectId" as "objectId" ,
         "lesson"."title" as "title" ,
       "teacher"."name" as "teacher" 
     from
        (select 
            "lessons"."lesson"::json->>'objectId' as "objectId",
         "lessons"."planid" as "planid"
         from (
         select 
              jsonb_array_elements("plan"."lessons") as "lesson",
           "plan"."objectId" as "planid"
              from "SchoolPlan" as "plan"
        left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
     left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
     left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
   ) as "lessons" on "lessons"."planid" = "majors"."planid"
   group by "majorid", "objectId"
   order by "majorid") as "M" on  "PR"."mid" = "M"."majorid") as "PInfo"
   left join (
     SELECT 
     "R"."user" as "user",
     "R"."uid" as "uid",
     "R"."lid" as "lid",
     "R"."totalTime" as "totalTime",
     "R"."downCount" as "downCount",
     "totalCount"."total" as "total"
   from 
   (SELECT
           max("profile"."name")  as "user",
           max("profile"."objectId")  as "uid",
           max("lesson"."objectId") as "lid",
           sum("record"."time") as "totalTime",
           sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
        from "LessonRecord" as "record"
         left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
         left join "Department" as "Department" on "Department"."objectId" = "record"."department"
         left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
         left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
         left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
       where "record"."company" = 'pPZbxElQQo'
         group by "record"."user", "record"."lesson") as "R"
   left join 
   (select
      count(1) as "total",
      max("LessonArticle"."objectId") as "laid",
     max("LessonArticle"."lesson") as "lid"
    from "LessonArticle"
    left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
    where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
    group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
         ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`  
      }      
      if( this.major && this.school && !this.lesson) {
          sql = `select
        "PInfo"."uid" as "uid",
        "PInfo"."mid" as "mid",
        "PInfo"."lid" as "lid",
        "PInfo"."user" as "user",
        "PInfo"."school" as "school",
        "PInfo"."major" as "major",
        "PInfo"."class" as "class",
        "PInfo"."title" as "title",
        "LRInfo"."totalTime" as "totalTime",
        "LRInfo"."downCount" as "downCount",
        "LRInfo"."total" as "total"
      from 
        (select 
          "PR"."pid" as "uid",
          "PR"."mid" as "mid",
          "PR"."name" as "user",
          "PR"."school" as "school",
          "PR"."major" as "major",
          "PR"."class" as "class",
          "M"."title" as "title",
          "M"."objectId" as "lid"
        from
          (select
            "profile"."objectId" as "pid",
            "profile"."name" as "name",
            "department"."name" as "school",
            "schoolMajor"."name" as "major",
            "schoolMajor"."objectId" as "mid",
            "schoolMajor"."plan" as "plan",
            "schoolClass"."name" as "class"
          from "Profile" as "profile"
          left join "Department" as "department" on "department"."objectId" = "profile"."department" 
          left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
          left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
          where "profile"."company" = 'pPZbxElQQo' and "profile"."department" = '${this.school}' and "profile"."SchoolMajor" = '${this.major.id}') as "PR"
      left join
      (select 
        max("majors"."majorid") as "majorid",
        max("majors"."planid") as "planid",
        max("majors"."name") as "name",
        max("lessons"."objectId") as "objectId",
        max("lessons"."title") as "title",
        max("lessons"."teacher") as "teacher"
      from
      (select 
        "schoolMajor"."objectId" as "majorid",
          "schoolMajor"."plan" as "planid",
        "schoolMajor"."name" as "name"
      from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
      left join (
        select 
          "lessonObjectId"."planid" as "planid",
          "lessonObjectId"."objectId" as "objectId" ,
            "lesson"."title" as "title" ,
          "teacher"."name" as "teacher" 
        from
            (select 
                "lessons"."lesson"::json->>'objectId' as "objectId",
            "lessons"."planid" as "planid"
            from (
            select 
                  jsonb_array_elements("plan"."lessons") as "lesson",
              "plan"."objectId" as "planid"
                  from "SchoolPlan" as "plan"
            left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
        left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
        left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
      ) as "lessons" on "lessons"."planid" = "majors"."planid"
      group by "majorid", "objectId"
      order by "majorid") as "M" on  "PR"."mid" = "M"."majorid") as "PInfo"
      left join (
        SELECT 
        "R"."user" as "user",
        "R"."uid" as "uid",
        "R"."lid" as "lid",
        "R"."totalTime" as "totalTime",
        "R"."downCount" as "downCount",
        "totalCount"."total" as "total"
      from 
      (SELECT
              max("profile"."name")  as "user",
              max("profile"."objectId")  as "uid",
              max("lesson"."objectId") as "lid",
              sum("record"."time") as "totalTime",
              sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
            from "LessonRecord" as "record"
            left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
            left join "Department" as "Department" on "Department"."objectId" = "record"."department"
            left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
            left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
            left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
          where "record"."company" = 'pPZbxElQQo'
            group by "record"."user", "record"."lesson") as "R"
      left join 
      (select
          count(1) as "total",
          max("LessonArticle"."objectId") as "laid",
        max("LessonArticle"."lesson") as "lid"
        from "LessonArticle"
        left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
        where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
        group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
            ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`  
      }
   
      if( this.major && this.school && this.lesson && !this.student) {
        sql = `select
      "PInfo"."uid" as "uid",
      "PInfo"."mid" as "mid",
      "PInfo"."lid" as "lid",
      "PInfo"."user" as "user",
      "PInfo"."school" as "school",
      "PInfo"."major" as "major",
      "PInfo"."class" as "class",
      "PInfo"."title" as "title",
      "LRInfo"."totalTime" as "totalTime",
      "LRInfo"."downCount" as "downCount",
      "LRInfo"."total" as "total"
    from 
      (select 
        "PR"."pid" as "uid",
        "PR"."mid" as "mid",
        "PR"."name" as "user",
        "PR"."school" as "school",
        "PR"."major" as "major",
        "PR"."class" as "class",
        "M"."title" as "title",
        "M"."objectId" as "lid"
      from
        (select
          "profile"."objectId" as "pid",
          "profile"."name" as "name",
          "department"."name" as "school",
          "schoolMajor"."name" as "major",
          "schoolMajor"."objectId" as "mid",
          "schoolMajor"."plan" as "plan",
          "schoolClass"."name" as "class"
        from "Profile" as "profile"
        left join "Department" as "department" on "department"."objectId" = "profile"."department" 
        left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
        left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
        where "profile"."company" = 'pPZbxElQQo' and "profile"."department" = '${this.school}'
        and "profile"."SchoolMajor" = '${this.major.id}') as "PR"
    left join
    (select 
      max("majors"."majorid") as "majorid",
      max("majors"."planid") as "planid",
      max("majors"."name") as "name",
      max("lessons"."objectId") as "objectId",
      max("lessons"."title") as "title",
      max("lessons"."teacher") as "teacher"
    from
    (select 
      "schoolMajor"."objectId" as "majorid",
        "schoolMajor"."plan" as "planid",
      "schoolMajor"."name" as "name"
    from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
    left join (
      select 
        "lessonObjectId"."planid" as "planid",
        "lessonObjectId"."objectId" as "objectId" ,
          "lesson"."title" as "title" ,
        "teacher"."name" as "teacher" 
      from
          (select 
              "lessons"."lesson"::json->>'objectId' as "objectId",
          "lessons"."planid" as "planid"
          from (
          select 
                jsonb_array_elements("plan"."lessons") as "lesson",
            "plan"."objectId" as "planid"
                from "SchoolPlan" as "plan"
          left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
      left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
      left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
    ) as "lessons" on "lessons"."planid" = "majors"."planid"
    group by "majorid", "objectId"
    order by "majorid") as "M" on  "PR"."mid" = "M"."majorid"
    where "M"."objectId" = '${this.lesson}'
    ) as "PInfo"
    left join (
      SELECT 
      "R"."user" as "user",
      "R"."uid" as "uid",
      "R"."lid" as "lid",
      "R"."totalTime" as "totalTime",
      "R"."downCount" as "downCount",
      "totalCount"."total" as "total"
    from 
    (SELECT
            max("profile"."name")  as "user",
            max("profile"."objectId")  as "uid",
            max("lesson"."objectId") as "lid",
            sum("record"."time") as "totalTime",
            sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
          from "LessonRecord" as "record"
          left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
          left join "Department" as "Department" on "Department"."objectId" = "record"."department"
          left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
          left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
          left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
        where "record"."company" = 'pPZbxElQQo'
          group by "record"."user", "record"."lesson") as "R"
    left join 
    (select
        count(1) as "total",
        max("LessonArticle"."objectId") as "laid",
      max("LessonArticle"."lesson") as "lid"
      from "LessonArticle"
      left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
      where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
      group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
          ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`  
      }
      if(this.school && this.major && this.lesson && this.student ) {
        sql = `select
      "PInfo"."uid" as "uid",
      "PInfo"."mid" as "mid",
      "PInfo"."lid" as "lid",
      "PInfo"."user" as "user",
      "PInfo"."school" as "school",
      "PInfo"."major" as "major",
      "PInfo"."class" as "class",
      "PInfo"."title" as "title",
      "LRInfo"."totalTime" as "totalTime",
      "LRInfo"."downCount" as "downCount",
      "LRInfo"."total" as "total"
    from 
      (select 
        "PR"."pid" as "uid",
        "PR"."mid" as "mid",
        "PR"."name" as "user",
        "PR"."school" as "school",
        "PR"."major" as "major",
        "PR"."class" as "class",
        "M"."title" as "title",
        "M"."objectId" as "lid"
      from
        (select
          "profile"."objectId" as "pid",
          "profile"."name" as "name",
          "department"."name" as "school",
          "schoolMajor"."name" as "major",
          "schoolMajor"."objectId" as "mid",
          "schoolMajor"."plan" as "plan",
          "schoolClass"."name" as "class"
        from "Profile" as "profile"
        left join "Department" as "department" on "department"."objectId" = "profile"."department" 
        left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
        left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
        where "profile"."name" = '${this.student}' and "profile"."company" = 'pPZbxElQQo' and "profile"."department" = '${this.school}'
        and "profile"."SchoolMajor" = '${this.major.id}') as "PR"
    left join
    (select 
      max("majors"."majorid") as "majorid",
      max("majors"."planid") as "planid",
      max("majors"."name") as "name",
      max("lessons"."objectId") as "objectId",
      max("lessons"."title") as "title",
      max("lessons"."teacher") as "teacher"
    from
    (select 
      "schoolMajor"."objectId" as "majorid",
        "schoolMajor"."plan" as "planid",
      "schoolMajor"."name" as "name"
    from "SchoolMajor" as "schoolMajor" where "schoolMajor"."company" = 'pPZbxElQQo') as "majors"
    left join (
      select 
        "lessonObjectId"."planid" as "planid",
        "lessonObjectId"."objectId" as "objectId" ,
          "lesson"."title" as "title" ,
        "teacher"."name" as "teacher" 
      from
          (select 
              "lessons"."lesson"::json->>'objectId' as "objectId",
          "lessons"."planid" as "planid"
          from (
          select 
                jsonb_array_elements("plan"."lessons") as "lesson",
            "plan"."objectId" as "planid"
                from "SchoolPlan" as "plan"
          left  join "SchoolMajor" as "major" on "major"."plan" = "plan"."objectId" ) as "lessons") as "lessonObjectId"
      left join "Lesson" as "lesson" on "lessonObjectId"."objectId" =  "lesson"."objectId"
      left join "LessonTeacher" as "teacher" on  "lesson"."schoolTeacher" = "teacher"."objectId"
    ) as "lessons" on "lessons"."planid" = "majors"."planid"
    group by "majorid", "objectId"
    order by "majorid") as "M" on  "PR"."mid" = "M"."majorid"
    where "M"."objectId" = '${this.lesson}'
    ) as "PInfo"
    left join (
      SELECT 
      "R"."user" as "user",
      "R"."uid" as "uid",
      "R"."lid" as "lid",
      "R"."totalTime" as "totalTime",
      "R"."downCount" as "downCount",
      "totalCount"."total" as "total"
    from 
    (SELECT
            max("profile"."name")  as "user",
            max("profile"."objectId")  as "uid",
            max("lesson"."objectId") as "lid",
            sum("record"."time") as "totalTime",
            sum(case when "record"."status" = 2  then 1 else 0 end) as "downCount"
          from "LessonRecord" as "record"
          left join "Profile" as "profile" on "profile"."objectId" = "record"."user"
          left join "Department" as "Department" on "Department"."objectId" = "record"."department"
          left join "SchoolMajor" as "schoolMajor" on "schoolMajor"."objectId" = "profile"."SchoolMajor"
          left join "SchoolClass" as "schoolClass" on "schoolClass"."objectId" = "profile"."schoolClass"
          left join "Lesson" as "lesson" on "lesson"."objectId" = "record"."lesson"
        where "record"."company" = 'pPZbxElQQo'
          group by "record"."user", "record"."lesson") as "R"
    left join 
    (select
        count(1) as "total",
        max("LessonArticle"."objectId") as "laid",
      max("LessonArticle"."lesson") as "lid"
      from "LessonArticle"
      left join "Lesson" as "lesson" on "lesson"."objectId" = "LessonArticle"."lesson"
      where "LessonArticle"."parent" is not null and "LessonArticle"."company" = 'pPZbxElQQo'
      group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
          ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid"`

      }
    }
 
    this.searchAll(sql)
  }
  showTime(time) {
    if(time) {
      return (time/60).toFixed(2) + '分钟'
    } else {
      return "暂无"
    }
  }
  showStatus(data) {
    if(data.totalTime > 0 && (Number(data.downCount) < Number(data.total))) {
      return "学习中"
    }
    if(data.totalTime == 0 || data.totalTime == null) {
      return "未学习"
    }
    if((data.total == data.downCount) && data.downCount > 0) {
      return "已学完"
    }
  }
  showSchedule(data) {
    if(data.downCount == 0 || data.downCount == null) {
      return "暂无"
    } else {
      return ((Number(data.downCount)/Number(data.total))*100).toFixed(2) + "%"
    }
  }
  toDetail(uid,lid) {
    this.router.navigate(['/masterol-doctor/record-detail',{uid:uid,lid:lid}])
  }
  showStatusColor(data) {
    if(data.totalTime > 0 && (Number(data.downCount) < Number(data.total))) {
      return  '#fce603'
    }
    if(data.totalTime == 0 || data.totalTime == null) {
      return "red"
    }
    if((data.total == data.downCount) && data.downCount > 0) {
      return "#88f5da"
    }
  }
}