import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as Parse from "parse";
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-exam-grade',
  templateUrl: './exam-grade.component.html',
  styleUrls: ['./exam-grade.component.scss']
})
export class ExamGradeComponent implements OnInit {

  constructor(private http : HttpClient, private message : NzMessageService,private cdRef: ChangeDetectorRef  ) { }
  tableHead: Array<any> = [
    "批次",
    "学号",
    "姓名",
    "身份证",
    "学校",
    "专业",
    "考试年份",
    "科目一名称",
    "科目一成绩",
    "合格编号",
    "考试时间",
    "科目二",
    "科目二成绩",
    "合格编号",
    "考试时间"
  ];
  company: string = localStorage.getItem("company");
  allTableData: Array<any> = [];
  filterData: Array<any> = [];
  filterType: string;
  inputValue: string;
  searchType: any = "name";
  proofUrl: string;
  showEditFile: Boolean = false;
  pageSize: number = 20;
  pageIndex: number = 1;
  filterLen: number
  isLoading: boolean = true;
  overlyTableData: any;
  school:string = ""
  center:string = ""
  department
  async ngOnInit() {
    if (localStorage.getItem('department')) {
        this.department = localStorage.getItem('department')
        let Department = new Parse.Query("Department")
        await Department.get(this.department).then(async res => {
            if (res && res.id) {
                if (res.get('category').id == 'erVPCmBAgt') { // 学校
                    this.school = localStorage.getItem('department')
                    
                } else {
                    this.center = localStorage.getItem('department')
                }
                await this.getGrade()
            } 
        })
    } else {
       await  this.getGrade()
    }
    
  }

  async getGrade() {
    this.isLoading = true

    let where1 =`AND "profile"."department" = '${this.school}'`
    let where2 =`AND "profile"."center" = '${this.center}'`
    let where3 =`AND "profile"."name" = '${this.name}'`
    let where4 =`AND "profile"."studentID" = '${this.studentID}'`
    let where5 =`AND "profile"."idcard" = '${this.idcard}'`
    let baseurl = "https://server.fmode.cn/api/novaql/select";
    let sql = `select "profile"."batch" as "batch",
		"profile"."studentID" as "studentID",
		"profile"."name" as "name",
		"profile"."idcard" as "idcard",
		"school"."name" as "schoolName",
		"schoolMajor"."name" as "major",
		"exam"."subjectA" as "subjectA",
        "exam"."year" as "year",
		"exam"."subjectAGrade" as "subjectAGrade",
		"exam"."subjectATime" as "subjectATime",
		"exam"."subjectACode" as "subjectACode",
		"exam"."subjectB" as "subjectB",
		"exam"."subjectBGrade" as "subjectBGrade",
		"exam"."subjectBTime" as "subjectBTime",
		"exam"."subjectBCode" as "subjectBCode"
from "Profile" as "profile"
left join "Department" as "school" on "profile"."department" = "school"."objectId"
left join "SchoolMajor" as "schoolMajor" on "profile"."SchoolMajor" = "schoolMajor"."objectId"
left join "ExamGrade" as "exam" on "exam"."name" = "profile"."name"  and  "exam"."idcard" = "profile"."idcard"
where "profile"."company" = 'pPZbxElQQo' and "profile"."identyType" = '学员' 
and "exam"."idcard" is not null
${this.school ? where1 : ''}
${this.center ? where2 : ''}
${this.name ? where3 : ''}
${this.studentID ? where4 : ''}
${this.idcard ? where5 : ''}
order by "subjectAGrade"`
let limitsql =  `limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`
    this.http.post(baseurl, { sql: sql + limitsql }).subscribe(async (res: any) => {
      console.log(res.data)
      this.filterData = res.data;
      this.filterLen = await this.getCount(sql);
      this.isLoading = false
    });
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
    await this.getGrade()
    console.log(this.filterLen)
    this.cdRef.detectChanges();
}

  provinceChange(e) {
    this.searchType = e;
    this.name = ""
    this.studentID = ""
    this.idcard = ""
    this.inputValue = ""
  }
  name:string = ""
  studentID:string = ""
  idcard:string = ""
  async searchStudent() {
    if(this.searchType == 'name') {
        this.name = this.inputValue
        this.studentID = null
        this.idcard = null
    }
    if(this.searchType == 'studentID') {
        this.studentID = this.inputValue
        this.idcard = null
        this.name = null
    }
    if(this.searchType == 'idcard') {
        this.idcard = this.inputValue
        this.name = null
        this.studentID = null
    }
    await this.getGrade()
  }
}
