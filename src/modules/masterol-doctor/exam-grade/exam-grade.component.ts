import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as Parse from "parse";

@Component({
  selector: 'app-exam-grade',
  templateUrl: './exam-grade.component.html',
  styleUrls: ['./exam-grade.component.scss']
})
export class ExamGradeComponent implements OnInit {

  constructor(private http : HttpClient ) { }
  tableHead: Array<any> = [
    "批次",
    "学号",
    "姓名",
    "身份证",
    "学校",
    "专业",
    "科目一",
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
  inputValue: String;
  searchType: any = "studentID";
  proofUrl: string;
  showEditFile: Boolean = false;
  pageSize: Number = 10;
  pageIndex: Number = 1;
  overlyTableData: any;
  ngOnInit() {
    this.getGrade()
  }

  async getGrade() {
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let sql = `select "profile"."batch" as "batch",
		"profile"."studentID" as "studentID",
		"profile"."name" as "name",
		"profile"."idcard" as "idcard",
		"school"."name" as "schoolName",
		"schoolMajor"."name" as "major",
		"exam"."subjectA" as "subjectA",
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
where "profile"."company" = 'pPZbxElQQo' and "profile"."identyType" = '学员' and "exam"."idcard" is not null
order by "subjectAGrade"`

    this.http.post(baseurl, { sql: sql }).subscribe((res: any) => {
      console.log(res.data)
      this.allTableData = res.data;
      this.filterData = this.allTableData;
    });
  }

  provinceChange(e) {
    this.searchType = e;
  }
  searchStudent() {
    if (!this.inputValue) {
      this.filterData = this.allTableData;
      return;
    }
    console.log(this.searchType, this.inputValue);
    this.filterData = this.allTableData.filter((item: any) => {
      return (
        item[this.searchType] &&
        item[this.searchType].indexOf(this.inputValue) > -1
      );
    });
  }
}
