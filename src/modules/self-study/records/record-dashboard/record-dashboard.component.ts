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
            title: '教学点',
            compare: null,
            priority: false
        },
        {
            title: '专业',
            compare: null,
            priority: false
        },
        {
            title: '层次',
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
    company: any = "1ErpDVc1u6";
    department: any;
    showSchool: boolean = true
    showCenter: boolean = true

    groupHeaderHeight = 40;
    headerHeight = 40;
    floatingFiltersHeight = 40;
    pivotGroupHeaderHeight = 50;
    pivotHeaderHeight = 100;

    isExport: boolean = false
    centerId: any;

    async ngOnInit() {
        if (localStorage.getItem('department')) {
            this.department = localStorage.getItem('department')
            let Department = new Parse.Query("Department")
            await Department.get(this.department).then(res => {
                if (res && res.id) {
                    if (res.get('type') != 'training') { // 学校
                        this.showSchool = false
                        this.centerId = null;
                        this.searchAll()
                    } else {
                        this.showCenter = false
                        this.centerId = res.id
                        this.department = null;
                        this.searchAll()
                    }
                    // this.changeSchool(res.get('school').id)
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

    pageIndex: number = 1;
    pageSize: number = 20;
    centers: any;
    filterLen: number
    isLoading: boolean = true;
    searchAll(csql?) { // 优化 是否有参数csql 来判断，有csql就不需要走if 判断
        this.isLoading = true;

        // 获取profile对应的专业,部门,教学点,课程信息
        let proSql = `select * from 
            (select "objectId","name","education","SchoolMajor","department","center" from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true) as "pro"
            left join (select "objectId" as "majorId","name" as "majorName" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major" on "major"."majorId" = "pro"."SchoolMajor"
            left join (select "objectId" as "depaId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "department" on "department"."depaId" = "pro"."department"
            left join (select "objectId" as "centerId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6') as "center" on "center"."centerId" = "pro"."center" `

        // 获取专业对应的课程信息
        let lesSql = `select "major"."majorId" as "majorId","lessonId","lessonName" from 
            (select "objectId" as "majorId" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
            join (select "objectId" as "lessonId","title" as "lessonName",jsonb_array_elements("toMajor")::json->>'objectId' as "majorId" from "Lesson") as "lesson" 
                on "lesson"."majorId" = "major"."majorId" `

        // 获取课程对应的学习时长,完成量
        let timeSql = `select "user","lesson", sum("time") as "totalTime", sum(CASE WHEN "status" = 2 THEN 1 ELSE 0 END) as "comCount"
            from "LessonRecord" where "company" = '1ErpDVc1u6' 
            group by "user", "lesson" `

        // 获取课程小节数
        let SectionSql = `select "lesson", count(1) as "sectionCount" from 
            (select "lesson" from "LessonArticle" where "parent" is not null) as "acticle" 
            group by "lesson" `

        let whereSql = `where 1 = 1`
        if (this.department) {
            whereSql += ` and "depaId" = '${this.department}'`
        }
        if (this.centerId) {
            whereSql += ` and "centerId" = '${this.centerId}'`
        }

        if (this.school) {
            whereSql += ` and "depaId" = '${this.school}'`
        }
        if (this.center) {
            whereSql += ` and "centerId" = '${this.center}'`
        }
        if (this.major) {
            whereSql += ` and "proInfo"."majorId" = '${this.major}'`
        }
        if (this.lesson) {
            whereSql += ` and "lessonId" = '${this.lesson}'`
        }
        if (this.studentName) {
            whereSql += ` and "name" like '%${this.studentName}%'`
        }

        let compleSql = `select * 
            from (${proSql}) as "proInfo"
            join (${lesSql}) as "lesson" on "proInfo"."SchoolMajor" = "lesson"."majorId"
            left join (${timeSql}) as "times" on "lesson"."lessonId" = "times"."lesson" and "times"."user" = "proInfo"."objectId"
            left join (${SectionSql}) as "section" on "section"."lesson" = "times"."lesson" ${whereSql}`

        let limitsql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`
        console.log(compleSql + limitsql)
        let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
        this.http.post(baseurl, { sql: compleSql + limitsql }).subscribe(async res => {
            console.log(res)
            if (res["code"] == 200 && res["data"]) {
                this.listOfData = res["data"]
                console.log(this.filterLen)
                this.filterLen = await this.getCount(compleSql);
                console.log(this.filterLen)
                this.isLoading = false;
            }
        })
    }


    async getCount(sql): Promise<number> {
        return new Promise((resolve, reject) => {
            let baseurl = "https://server.fmode.cn/api/novaql/select";
            let countSql = 'select count(*) from ' + '(' + sql + ')' + 'as totalCount'
            this.http.post(baseurl, { sql: countSql }).subscribe(async (res: any) => {
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

    // 分页选择
    pageChange(e) {
        console.log(e)
        this.isLoading = true
        this.searchAll()
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


    schoolList: any // 所有学校
    school: any // 选择的学校
    centerList: any; //所有教学点
    center: any;    // 选择的教学点
    majorList: any // 选择学校的所有专业
    major: string;// 选择的专业
    lessonList: any;// 对应专业的所有课程
    lesson: string; // 选择的课程
    studentName: any; // 学生姓名

    async changeSchool(ev) {
        if (!ev) {
            this.majorList = null;
            this.major = null;
            this.lessonList = null;
            this.lesson = null;
            this.school = null;
            this.searchAll()
            return
        }
        this.school = ev
        this.getMajor()
    }
    changeCenter(e) {
        if (!e) {
            this.majorList = null;
            this.major = null;
            this.lessonList = null;
            this.lesson = null;
            this.center = null;
            this.searchAll()
            return
        }
        this.center = e
        this.getMajor()
    }

    getSchool(event?) {
        let Department = new Parse.Query('Department')
        Department.equalTo('company', '1ErpDVc1u6')
        Department.notEqualTo('type', "training");
        if (event) {
            console.log(event)
            Department.contains('name', event)
        }
        // Department.limit(10)
        Department.find().then(res => {
            console.log(res)
            this.schoolList = res
        })
    }
    async getCenter(e?) {
        let Department = new Parse.Query('Department')
        Department.equalTo('company', '1ErpDVc1u6')
        Department.equalTo('type', "training");
        // Department.limit(10)
        console.log(e)
        if (e) {
            Department.contains('name', e)
        }
        Department.find().then(res => {
            console.log(res)
            this.centerList = res
        })
    }

    async getMajor(ev?) {
        let SchoolMajor = new Parse.Query('SchoolMajor')
        if (this.school) {
            SchoolMajor.containedIn('departments', [{
                __type: "Pointer",
                className: 'Department',
                objectId: this.school
            }])
        }
        if (this.center) {
            SchoolMajor.containedIn('departments', [{
                __type: "Pointer",
                className: 'Department',
                objectId: this.center
            }])
        }
        SchoolMajor.equalTo('company', '1ErpDVc1u6')
        // SchoolMajor.limit(10)
        console.log(ev)
        if (ev) {
            SchoolMajor.contains('name', ev)
        }
        let schoolMajors = await SchoolMajor.find()
        if (schoolMajors && schoolMajors.length > 0) {
            this.majorList = schoolMajors
        }
    }

    async changeMajors(ev) {
        console.log(ev)
        if (ev) {
            let lesson = new Parse.Query('Lesson')
            lesson.equalTo('company', '1ErpDVc1u6')
            lesson.containedIn('toMajor', [{
                __type: "Pointer",
                className: 'SchoolMajor',
                objectId: ev
            }])
            let lessons = await lesson.find()
            console.log(lessons)
            if (lessons && lessons.length > 0) {
                this.lessonList = lessons
            }else{
                this.lessonList = null;
            }
        } else {
            this.lessonList = null;
            this.majorList = null;
        }
    }

    async searchLesson(ev?) {
        console.log(this.major)
        if(this.major){
            let lesson = new Parse.Query('Lesson')
            lesson.equalTo('company', '1ErpDVc1u6')
            lesson.containedIn('toMajor', [{
                __type: "Pointer",
                className: 'SchoolMajor',
                objectId: this.major
            }])
            if (ev) {
                lesson.contains('title', ev)
            }
            // Lesson.limit(10)
            let lessons = await lesson.find()
            console.log(lessons)
            if (lessons && lessons.length > 0) {
                this.lessonList = lessons
            }else{
                this.lessonList = null;
            }
        }else{
            this.lessonList = null;
        }
        
    }

    changeLesson(ev) {
        this.lesson = ev
    }
    // 查询
    search() {
        console.log(this.school, this.center, this.major, this.lesson, this.studentName)
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
        if (data.totalTime > 0 && (Number(data.comCount) < Number(data.sectionCount))) {
            return "学习中"
        }
        if (data.totalTime == 0 || data.totalTime == null) {
            return "未学习"
        }
        if ((data.sectionCount == data.comCount) && data.comCount > 0) {
            return "已学完"
        }
    }
    showSchedule(data) {
        if (data.comCount == 0 || data.comCount == null) {
            return "暂无"
        } else {
            return ((Number(data.comCount) / Number(data.sectionCount)) * 100).toFixed(2) + "%"
        }
    }
    toDetail(uid, lid) {
        this.router.navigate(['/self-study/record-detail', { uid: uid, lid: lid }])
    }
    showStatusColor(data) {
        console.log(data.totalTime, data.comCount, data.sectionCount)
        if (data.totalTime > 0 && (Number(data.comCount) < Number(data.sectionCount))) {
            return '#fce603'
        }
        if (data.totalTime == 0 || data.totalTime == null) {
            return "red"
        }
        if ((data.sectionCount == data.comCount) && data.comCount > 0) {
            return "#88f5da"
        }
    }

    // 导出信息表头
    columnDefs = [
        {
            headerName: "学生",
            field: "name"
        },
        {
            headerName: "学校",
            field: "depaName"
        },
        {
            headerName: "教学点",
            field: "centerName"
        },
        {
            headerName: "专业",
            field: "majorName",
        },
        {
            headerName: "层次",
            field: "education"
        },
        {
            headerName: "课程名陈",
            field: "lessonName"
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
    rowData: any = []
    export() {
        this.isExport = true
        this.listOfData.forEach(data => {
            let time;
            let status = '待学习'
            let progress = '0%'
            if (data.totalTime > 0 && (Number(data.comCount) < Number(data.sectionCount))) {
                time = (data.totalTime / 60).toFixed(2) + '分钟'
                status = '学习中'
                progress = (Number(data.comCount) / Number(data.sectionCount) * 100).toFixed(2) + '%'
            }
            if (data.totalTime == 0 || data.totalTime == null) {
                time = '暂无'
                status = '未学习'
                progress = '0%'
            }
            if ((data.sectionCount == data.comCount) && data.comCount > 0) {
                time = (data.totalTime / 60).toFixed(2) + '分钟'
                status = '已学完'
                progress = (Number(data.comCount) / Number(data.sectionCount) * 100) + '%'
            }
            let rData = {
                name: data.name,
                depaName: data.depaName,
                centerName: data.centerName,
                majorName: data.majorName,
                education: data.education,
                lessonName: data.lessonName,
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