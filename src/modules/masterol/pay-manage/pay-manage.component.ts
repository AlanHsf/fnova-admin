import { Component, OnInit } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import * as Parse from 'parse'

@Component({
    selector: "app-pay-manage",
    templateUrl: "./pay-manage.component.html",
    styleUrls: ["./pay-manage.component.scss"],
})
export class PayManageComponent implements OnInit {
    tableHead: Array<any> = [
        "学员批次",
        "学员学号",
        "学员姓名",
        "学员性别",
        "身份证号",
        "手机号码",
        "电子邮箱",
        "报考学校",
        "所在学院",
        "报名专业",
        "学员籍贯",
        "工作单位",
        "学习中心",
        "学习中心备注",
        "学员班级",
        "班主任",
        "学员追踪",
        "前置授学位专业",
        "前置授学位时间",
        "学位证编号",
        "学历证编号",
        "材料是否通过审核",
        "报名时间",
        "是否现场确认",
        "是否需要统考辅导",
        "是否已开通统考辅导",
        "是否已开通学分课程",
        "服务年限",
        "班型",
        "统考教材邮寄情况",
        "统考外语是否通过",
        "统考综合是否通过",
        "应修学分",
        "已修学分",
        "是否缴清学费",
        "是否缴清服务费",
        "是否缴清论文指导费用",
        "是否欠费",
        "查看发票",
        //"状态"
    ];
    company: string = localStorage.getItem("company");
    allTableData: Array<any> = [];
    filterData: Array<any> = [];
    filterType: string;
    inputStudentID: String;
    department: any = localStorage.getItem('department')
    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.getData();
    }

    async getData() {
        let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
        let sql
        if (this.department) {
            sql = `select
        p."objectId",
        p."batch",
        p."studentID",
        p."name",
        p."sex",
        p."idcard",
        p."user",
        p."mobile",
        p."email",
        p."nativePlace",
        p."workUnit",
        p."centerDesc",
        p."entrySchool",
        p."serviceLength",
        p."desc",
        p."college",
        p."teacher",
        p."getTime",
        p."degreeNumber",
        p."diploma",
        p."isCross",
        p."singTime",
        p."tutoring",
        p."isBill",
        p."classType",
        p."mail",
        p."schoolMajor",
        p."lessons",
        p."studentType",
        p."identyType",
        exam."A" as "A",
        exam."B" as "B",
        "PR"."tuitionFee",
        "PR"."yetTuitionFee",
        "PR"."serviceFee",
        "PR"."yetServiceFee",
        "PR"."paperFee",
        "PR"."yetPaperFee",
        "PR"."isBilling",
        "PR"."isCheck",
        "PR"."isBack",
        "PR"."dueAmount",
                (select d."name" from "Department" as d where d."objectId"=p."department") as schoolname,
                (select d."name" from "SchoolMajor" as d where d."objectId"=p."SchoolMajor") as major,
                (select d."totalCredit" from "SchoolMajor" as d where d."objectId"=p."SchoolMajor") as "totalCredit",
                (select d."name" from "SchoolClass" as d where d."objectId"=p."schoolClass") as "class",
                (select d."name" from "Department" as d where d."objectId"=p."center") as centername
                from "Profile" as p
                LEFT JOIN  (select max("profile") as "pid", max("subjectAGrade") as "A" ,  max("subjectBGrade") as "B"  from "ExamGrade"  group by "profile") as exam on exam."pid" = P."objectId"
                LEFT JOIN (select "profile", "tuitionFee", "yetTuitionFee", "serviceFee", "yetServiceFee", "paperFee", "yetPaperFee", "isBilling","isBack", "isCheck", "dueAmount" from "ProfileRecharge") as  "PR" on "PR"."profile" = p."objectId"
                where p."company" = 'pPZbxElQQo' and p."department" = '${this.department}' and p."identyType" = '学员'`;
        } else {
            sql = `select
                p."objectId",
                p."batch",
                p."studentID",
                p."name",
                p."sex",
                p."idcard",
                p."user",
                p."mobile",
                p."email",
                p."nativePlace",
                p."workUnit",
                p."centerDesc",
                p."entrySchool",
                p."isCheck",
                p."serviceLength",
                p."desc",
                p."college",
                p."teacher",
                p."getTime",
                p."degreeNumber",
                p."diploma",
                p."isCross",
                p."singTime",
                p."isCheck",
                p."tutoring",
                p."isBill",
                p."classType",
                p."mail",
                p."schoolMajor",
                p."lessons",
                p."studentType",
                p."identyType",
                "PR"."tuitionFee",
                "PR"."yetTuitionFee",
                "PR"."serviceFee",
                "PR"."yetServiceFee",
                "PR"."paperFee",
                "PR"."yetPaperFee",
                "PR"."isBilling",
                "PR"."isCheck",
                "PR"."isBack",
                "PR"."dueAmount",
                exam."A" as "A",
	            exam."B" as "B",
                (select d."name" from "Department" as d where d."objectId"=p."department") as schoolname,
                (select d."name" from "SchoolMajor" as d where d."objectId"=p."SchoolMajor") as major,
                (select d."totalCredit" from "SchoolMajor" as d where d."objectId"=p."SchoolMajor") as "totalCredit",
                (select d."name" from "SchoolClass" as d where d."objectId"=p."schoolClass") as "class",
                (select d."name" from "Department" as d where d."objectId"=p."center") as centername
                from "Profile" as p
                LEFT JOIN  (select max("profile") as "pid", max("subjectAGrade") as "A" ,  max("subjectBGrade") as "B"  from "ExamGrade"  group by "profile") as exam on exam."pid" = P."objectId"
                LEFT JOIN (select "profile", "tuitionFee", "yetTuitionFee", "serviceFee", "yetServiceFee", "paperFee", "yetPaperFee", "isBilling","isBack", "isCheck", "dueAmount" from "ProfileRecharge") as  "PR" on "PR"."profile" = p."objectId"
                where p."company" = 'pPZbxElQQo' and p."identyType" = '学员'`;
        }
        this.http.post(baseurl, { sql: sql }).subscribe((res: any) => {
            this.allTableData = res.data;
            this.filterData = this.allTableData;
        });
    }

    getFilterData(type: string) {
        console.log(type);
        switch (type) {
            case "all":
                this.filterData = this.allTableData;
                break;
            case "paidIn":
                this.filterData = this.allTableData.filter((item) => {
                    return item.isfull;
                });
                break;
            case "noPay":
                this.filterData = this.allTableData;
                this.filterData = this.allTableData.filter((item) => {
                    return !item.isfull;
                });
                break;
        }
        this.filterType = type;
    }

    searchStudent() {
        if (!this.inputStudentID) {
            this.filterData = this.allTableData;
            return;
        }

        console.log(this.inputStudentID)
        this.filterData = this.allTableData.filter((item) => {
            console.log(1111)
            let str: any = ("tem" + item.name)
            return item.name && str.indexOf(this.inputStudentID) > 0;
        });
        console.log(this.filterData)
    }
    isVisible: boolean = false
    tuitionBill: any;
    paperBill: any;
    checkBill(data) {
        console.log(data)
        this.isVisible = true
        this.tuitionBill = data.tuitionBill
        this.paperBill = data.paaperBill
    }
    handleCancel() {
        this.isVisible = false
        this.isShowInfo = false
    }

    handleOk() {
        this.isVisible = false
        this.isShowInfo = false
    }


    isShowInfo: boolean = false
    studentInfo: any = {}
    showStudent(data) {
        this.isShowInfo = true
        this.studentInfo = data

        this.getExam(data.objectId)
        this.getCredit(data.objectId)
    }
    grades: any = [];
    async getExam(id) {
        let ExamGrade = new Parse.Query('ExamGrade')
        ExamGrade.equalTo('profile', id)
        let grade = await ExamGrade.find()
        console.log(grade)
        this.grades = grade
    }
    creditGrade: any = []
    async getCredit(id) {
        let ExamGrade = new Parse.Query('CreditGrade')
        ExamGrade.equalTo('profile', id)
        ExamGrade.include('lesson')
        let creditGrade = await ExamGrade.find()
        this.creditGrade = creditGrade
    }
}
