import { Component, OnInit } from "@angular/core";

import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-pay-manage",
  templateUrl: "./pay-manage.component.html",
  styleUrls: ["./pay-manage.component.scss"],
})
export class PayManageComponent implements OnInit {
  tableHead: Array<any> = [
    "批次",
    "学号",
    "姓名",
    "身份证",
    "手机号",
    "性别",
    "学校",
    "专业",
    "班级",
    "学员状态",
    "身份类型",
    "学习中心",
    "是否缴费",
    "查看发票"
  ];
  company: string = localStorage.getItem("company");
  allTableData: Array<any> = [];
  filterData: Array<any> = [];
  filterType: string;
  inputStudentID: String;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getData();
  }

  async getData() {
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let sql = `select 
                p."name",
                p."idcard",
                p."user",
                p."mobile",
                p."sex",
                p."batch",
                p."studentID",
                p."entrySchool",
                p."studentType",
                p."identyType",
                (select d."name" from "Department" as d where d."objectId"=p."department") as schoolname,
                (select d."name" from "SchoolMajor" as d where d."objectId"=p."SchoolMajor") as major,
                (select d."name" from "SchoolClass" as d where d."objectId"=p."schoolClass") as "class",
                (select d."name" from "Department" as d where d."objectId"=p."center") as centername,
                (select pr."isFull" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as "isFull",
                (select pr."isCheck" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as "isCheck",
                (select pr."isBilling" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as "isBilling",
                (select pr."tuitionBill" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as "tuitionBill",
                (select pr."paperBill" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as "paperBill"
                from "Profile" as p
                where p."company"='${this.company}'`;
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
    this.filterData = this.allTableData.filter((item) => {
      return item.studentID && item.studentID.indexOf(this.inputStudentID) > 0;
    });
  }
  isVisible:boolean = false
  tuitionBill:any;
  paperBill:any;
  checkBill(data){
    console.log(data)
    this.isVisible = true
    this.tuitionBill = data.tuitionBill
    this.paperBill = data.paaperBill
  }
  handleCancel(){
    this.isVisible = false
    this.isShowInfo = false
  }

  handleOk(){
    this.isVisible = false
    this.isShowInfo = false
  }


  isShowInfo:boolean = false
  studentInfo:any
  showStudent(data){
    this.isShowInfo = true
    this.studentInfo = data
  }
}
