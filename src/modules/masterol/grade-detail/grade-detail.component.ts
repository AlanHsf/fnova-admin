import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
interface DataItem {
  user: string;
  school: string;
  major: string;
  class: string;
  lesson: string;
  videoGrade:number;
  testScore: number;
  totalScore: number
}
@Component({
  selector: 'app-grade-detail',
  templateUrl: './grade-detail.component.html',
  styleUrls: ['./grade-detail.component.scss']
})
export class GradeDetailComponent implements OnInit {

  constructor(private activeRouter: ActivatedRoute,private http:HttpClient) { }
  records: any;
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
      title: '视频成绩',
      compare: (a: DataItem, b: DataItem) => a.videoGrade - b.videoGrade,
      priority: false,
      
    },
    {
      title: '考试成绩',
      compare: (a: DataItem, b: DataItem) => a.testScore - b.testScore,
      priority: false
    },
    {
      title: '总成绩(视频成绩40%, 考试成绩60%)',
      compare: null,
      priority: false
    }
  ];
  listOfData: DataItem[] = [];
  ngOnInit() {
    this.activeRouter.paramMap.subscribe( params => {
      console.log(params);
      let uid = params['params'].uid;
      this.getGradeDetail(uid)
    })
  }
  getGradeDetail(uid){
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select"; 
    let sql = `select 
		"PInfo"."uid" as "uid",
		"PInfo"."mid" as "mid",
		"PInfo"."user" as "user",
		"PInfo"."school" as "school",
		"PInfo"."major" as "major",
		"PInfo"."class" as "class",
		"PInfo"."title" as "title",
		"PInfo"."lid" as "lid",
		"GradeInfo"."videograde" as "videoGrade",
		"GradeInfo"."testgrade" as "testgrade"
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
		where "profile"."company" = 'pPZbxElQQo' and "profile"."objectId" = '${uid  }' ) as "PR"
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
left join (SELECT 
	"Credit"."uid" as "uid",
	"Credit"."lid" as "lid",
	"Credit"."videograde" as "videograde",
	"TestGread"."totalScore" as "testgrade"
from
(SELECT 
	"R"."uid" as "uid",
	"R"."lid" as "lid",
	"R"."test" as "sid",
	round((case when "totalCount"."total" is not null then ("R"."downCount"*100 / "totalCount"."total") else 0 end ),0) as "videograde"	
from 
(SELECT
        max("profile"."name")  as "user",
        max("profile"."objectId")  as "uid",
        max("lesson"."objectId") as "lid",
 		max("lesson"."credit") as "credit",
 		max("lesson"."lessonTest") as "test",
 		max("lesson"."title") as "lesson",
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
 ) as "Credit"
  left join (select 
 	"surveylog"."profile" as "uid",
 	"surveylog"."survey" as "sid",
 	(case when  "surveylog"."grade" is not null then "surveylog"."grade" else 0  end ) as "totalScore"
 from "SurveyLog" as "surveylog" where "surveylog"."company" = 'pPZbxElQQo') as "TestGread" on "TestGread"."uid" = "Credit"."uid" and "TestGread"."sid" = "Credit"."sid")
 as "GradeInfo" on "GradeInfo"."uid" = "PInfo"."uid" and "GradeInfo"."lid" = "PInfo"."lid"
 `
    this.http.post(baseurl, {sql: sql}).subscribe(res => {
      console.log(res)
      if(res["code"] == 200 && res["data"] ) {
        this.listOfData = res["data"]
      }
    })
  }
}
