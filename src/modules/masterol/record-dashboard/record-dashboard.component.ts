import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as Parse from 'parse'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import 'ag-grid-enterprise';
interface DataItem {
    user: string;
    center: any;
    school: string;
    major: string;
    class: string;
    title: string;
    totalTime: any;
    total: any;
    downCount: any
}
@Component({
    selector: 'app-record-dashboard',
    templateUrl: './record-dashboard.component.html',
    styleUrls: ['./record-dashboard.component.scss']
})
export class RecordDashboardComponent implements OnInit {
    private gridApi;
    private gridColumnApi;
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
    listOfData: any = [];
    allOfData: DataItem[] = [];

    constructor(private http: HttpClient, private router: Router, 
        private message: NzMessageService, private cdRef: ChangeDetectorRef) { }
    company: any = "pPZbxElQQo"
    department: any;
    showSchool: boolean = true
    showCenter: boolean = true

    groupHeaderHeight = 40;
    headerHeight = 40;
    floatingFiltersHeight = 40;
    pivotGroupHeaderHeight = 50;
    pivotHeaderHeight = 100;

    isExport: boolean = false

    pageIndex: number = 1;
    pageSize: number = 50;
    columnDefs = [
        {
            headerName: "学生",
            field: "user"
        },
        {
            headerName: "学校",
            field: "school"
        },
        {
            headerName: "专业",
            field: "major",
        },
        {
            headerName: "班级",
            field: "class"
        },
        {
            headerName: "课程名陈",
            field: "title"
        },
        {
            headerName: "学习状态",
            field: "status"
        },
        {
            headerName: "学习进度",
            field: "progress"
        },
        {
            headerName: "学习时长",
            field: "time",
        }
    ];
    async ngOnInit() {
        if (localStorage.getItem('department')) {
            this.department = localStorage.getItem('department')
            let Department = new Parse.Query("Department")
            await Department.get(this.department).then(res => {
                if (res && res.id) {
                    if (res.get('category').id == 'erVPCmBAgt') { // 学校
                        this.showSchool = false
                        this.school = localStorage.getItem('department')
                        this.searchAll()
                    } else {
                        this.showCenter = false
                        this.centerId = localStorage.getItem('department')
                        this.searchAll()
                    }
                    this.changeSchool(res.get('school').id)
                } 
            })
        } else {
            this.searchAll()
        }
    
    }


    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        console.log(params)
    }
    centers: any = []
    filterLen: number
    isLoading: boolean = true;
    searchAll(csql?) { // 优化 是否有参数csql 来判断，有csql就不需要走if 判断
        this.isLoading = true;
        let where1 = `AND did = '${this.school}'`
        let where2 = `AND cid = '${this.centerId}'`
        let where3 = `AND mid = '${this.major}'`
        let where4 = `AND lid = '${this.lesson}'`
        let where5 = `AND "user" = '${this.student}'`
        let sql = `select *  from(select
            "PInfo"."did" as "did",
            "PInfo"."cid" as "cid",
            "PInfo"."uid" as "uid",
            "PInfo"."mid" as "mid",
            "PInfo"."lid" as "lid",
            "PInfo"."user" as "user",
            "PInfo"."school" as "school",
            "PInfo"."center" as "center",
            "PInfo"."major" as "major",
            "PInfo"."class" as "class",
            "PInfo"."title" as "title",
            "LRInfo"."totalTime" as "totalTime",
            "LRInfo"."downCount" as "downCount",
            "LRInfo"."total" as "total"
      from 
        (select 
            "PR"."did" as "did",
            "PR"."cid" as "cid",
            "PR"."pid" as "uid",
            "PR"."mid" as "mid",
            "PR"."name" as "user",
            "PR"."school" as "school",
            "PR"."center" as "center",
            "PR"."major" as "major",
            "PR"."class" as "class",
            "M"."title" as "title",
            "M"."objectId" as "lid"
        from
          (select
            "profile"."objectId" as "pid",
            "profile"."name" as "name",
            "department"."name" as "school",
            "department"."objectId" as "did",
            "center"."name" as "center",
            "center"."objectId" as "cid",
            "schoolMajor"."name" as "major",
            "schoolMajor"."objectId" as "mid",
            "schoolMajor"."plan" as "plan",
            "schoolClass"."name" as "class"
          from "Profile" as "profile"
          left join "Department" as "department" on "department"."objectId" = "profile"."department" 
          left join "Department" as "center" on "center"."objectId" = "profile"."center" 
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
       where "LessonArticle"."parent" is not null
       group by "LessonArticle"."lesson") as "totalCount" on "totalCount"."lid" = "R"."lid"
            ) as "LRInfo" on "LRInfo"."uid" = "PInfo"."uid" and "LRInfo"."lid" = "PInfo"."lid") as record
            WHERE uid is not null
            ${this.school ? where1 : ''}
            ${this.centerId ? where2 : ''}
            ${this.major ? where3 : ''}
            ${this.lesson ? where4 : ''}
            ${this.student ? where5 : ''}
            order by record."totalTime" asc
        `
        let limitsql = `limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`
        let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
        this.http.post(baseurl, { sql: sql + limitsql }).subscribe(async res => {
            if (res["code"] == 200 && res["data"]) {
                this.listOfData = res["data"]
                this.filterLen = await this.getCount(sql);
                this.isLoading = false;
            }
        })
    }
    
    async getCount(sql): Promise<number> {
        return new Promise((resolve, reject) => {
            let baseurl = "https://server.fmode.cn/api/novaql/select";
            let countSql = 'select count(*) from ' + '(' + sql + ')' + 'as totalCount'
            this.http
                .post(baseurl, { sql: countSql })
                .subscribe(async (res: any) => {
                    let count: number = 0;
                    if (res.code == 200) {
                        count = Number(res.data[0].count)
                        resolve(count) 
                    } else {
                        resolve(count)
                        this.message.info("网络繁忙，数据获取失败")
                    }
                })
        })

    }

    async pageChange(e) {
        this.pageIndex = e
        await this.searchAll()
        console.log(this.filterLen)
        this.cdRef.detectChanges();
    }
    async getCompany(did) {
        if (did) {
            let Department = new Parse.Query('Department')
            let department = await Department.get(did)
            if (department && department.id) {
                this.company = department.get('company').id
            }
        } else {
            this.company = localStorage.getItem('company')
        }

    }
    centerId: any = ''
    schools: any // 所有学校
    school: any // 选择的学校
    majors: any // 选择学校的所有专业
    major: string = ""// 选择的专业
    majorItem: string = ""// 选择的专业
    center: any // 选择的专业
    classes: any // 对应专业下面的所有班级
    class: any // 选择需要查看的班级
    lessons: any = [] // 对应专业的所有课程
    lesson: string = "" // 选择的课程
    lessonItem: string = "" // 选择的课程
    
    student: any
    async getCenter(e) {
        let Department = new Parse.Query('Department')
        Department.equalTo('company', 'pPZbxElQQo')
        Department.equalTo('category', 'O4c2FdAMkf')
        Department.limit(10)
        if (e) {
            Department.contains('name', e)
        }
        let centers = await Department.find()
        console.log(centers)
        if (centers && centers.length > 0) {
            this.centers = centers
        }
    }

    changeCenter(e) {
        console.log(e)
        this.centerId = e
        console.log(this.centerId)
    }

    getSchool(event?) {
        let Department = new Parse.Query('Department')
        Department.equalTo('category', 'erVPCmBAgt')
        Department.equalTo('company', 'pPZbxElQQo')
        if (event) {
            console.log(event)
            Department.contains('name', event)
        }

        Department.limit(10)
        Department.find().then(res => {
            console.log(res)
            this.schools = res
        })
    }

    async changeSchool(ev) {
        if (!ev) {
            this.major = null,
            this.lesson = null,
            this.majors = []
            this.lessons = []
            this.searchAll()
            return
        }
        this.school = ev
        this.getMajor(this.school)
    }

    async getMajor(ev?) {
        console.log(this.school)
        let SchoolMajor = new Parse.Query('SchoolMajor')
        SchoolMajor.include('plan')
        if (this.school) {
            SchoolMajor.equalTo('school', this.school)
        }
        SchoolMajor.equalTo('company', 'pPZbxElQQo')
        SchoolMajor.limit(10)
        if (ev) {
            SchoolMajor.contains('name', ev)
        }
        let schoolMajors = await SchoolMajor.find()
        if (schoolMajors && schoolMajors.length > 0) {
            this.majors = schoolMajors
        }
    }

    changeMajors(ev) {
        console.log(ev)
        if (ev) {
            console.log(this.major)
            this.major = ev.id
            let lessons = ev.get('plan').get('lessons')
            if (lessons && lessons.length > 0) {
                lessons.forEach(lesson => {
                    let Lesson = new Parse.Query('Lesson')
                    Lesson.get(lesson.id).then(res => {
                        if (res && res.id) {
                            this.lessons.push(res)
                        }
                    })
                });
            }
        }else {
            this.major = null
        }

    }

    async searchLesson(ev?) {
        console.log(this.school)
        let Lesson = new Parse.Query('Lesson')
        if (this.school) {
            Lesson.equalTo('school', this.school)
        }
        Lesson.limit(10)
        if (ev) {
            Lesson.contains('title', ev)
        }
        Lesson.equalTo('company', 'pPZbxElQQo')
        let lessons = await Lesson.find()
        if (lessons && lessons.length > 0) {
            this.lessons = lessons
        }
    }

    changeLesson(ev) {
        this.lesson = ev.id
    }
    // 查询
    search() {
        console.log(this.centerId, this.major, this.school, this.lesson, this.student)
        this.searchAll()
        return
    }
    showTime(time) {
        if (time) {
            return (time / 60).toFixed(2) + '分钟'
        } else {
            return "暂无"
        }
    }
    showStatus(data) {
        if (data.totalTime > 0 && (Number(data.downCount) < Number(data.total))) {
            return "学习中"
        }
        if (data.totalTime == 0 || data.totalTime == null) {
            return "未学习"
        }
        if ((data.total == data.downCount) && data.downCount > 0) {
            return "已学完"
        }
    }
    showSchedule(data) {
        if (data.downCount == 0 || data.downCount == null) {
            return "暂无"
        } else {
            return ((Number(data.downCount) / Number(data.total)) * 100).toFixed(2) + "%"
        }
    }
    toDetail(uid, lid) {
        this.router.navigate(['/masterol/record-detail', { uid: uid, lid: lid }])
    }
    showStatusColor(data) {
        if (data.totalTime > 0 && (Number(data.downCount) < Number(data.total))) {
            return '#fce603'
        }
        if (data.totalTime == 0 || data.totalTime == null) {
            return "red"
        }
        if ((data.total == data.downCount) && data.downCount > 0) {
            return "#88f5da"
        }
    }
    rowData: any = []
    export() {
        this.isExport = true
        this.listOfData.forEach(data => {
            let time;
            let status = '待学习'
            let progress = '0%'
            if (data.totalTime > 0 && (Number(data.downCount) < Number(data.total))) {
                time = (data.totalTime / 60).toFixed(2) + '分钟'
                status = '学习中'
                progress = (Number(data.downCount) / Number(data.total) * 100).toFixed(2) + '%'
            }
            if (data.totalTime == 0 || data.totalTime == null) {
                time = '暂无'
                status = '未学习'
                progress = '0%'
            }
            if ((data.total == data.downCount) && data.downCount > 0) {
                time = (data.totalTime / 60).toFixed(2) + '分钟'
                status = '已学完'
                progress = (Number(data.downCount) / Number(data.total) * 100) + '%'
            }
            let rData = {
                user: data.user,
                school: data.school,
                major: data.major,
                class: data.class,
                title: data.title,
                time: time,
                status: status,
                progress: progress
            }
            this.rowData.push(rData)
        })
    }
    back() {
        this.isExport = false
    }
    exportXsl() {
        this.gridApi.exportDataAsExcel();
    }
}