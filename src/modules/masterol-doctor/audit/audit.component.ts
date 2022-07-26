import { Component, OnInit } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import * as Parse from "parse";

@Component({
  selector: "app-audit",
  templateUrl: "./audit.component.html",
  styleUrls: ["./audit.component.scss"],
})
export class AuditComponent implements OnInit {
  tableHead: Array<any> = [
    "批次",
    "学号",
    "姓名",
    "身份证",
    "手机号",
    "性别",
    "学校",
    "专业",
    "学习中心",
    "已交学费",
    "学费交费凭据",
    "论文费",
    "论文费凭据",
    "服务费",
    "服务费凭据",
    "学费缴费发票",
    "论文费缴费发票",
    "是否开票",
    "开票",
    "审核",
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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getData();
  }

  async getData() {
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let sql = `select
                p."objectId",
                p."name",
                p."idcard",
                p."user",
                p."mobile",
                p."sex",
                p."batch",
                p."studentID",
                (select d."name" from "Department" as d where d."objectId"=p."department") as schoolname,
                (select d."name" from "Department" as d where d."objectId"=p."center") as centername,
                (select d."name" from "SchoolMajor" as d where d."objectId"=p."SchoolMajor") as major,
                (select pr."isFull" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as isfull,
                (select pr."tuitionProof" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as tuitionfeeproof,
                (select pr."serviceProof" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as servicefeeproof,
                (select pr."paperProof" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as paperfeeproof,
                (select pr."tuitionFee" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as tuitionfee,
                (select pr."serviceFee" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as servicefee,
                (select pr."paperFee" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as paperfee,
                (select pr."tuitionBill" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as "tuitionBill",
                (select pr."paperBill" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as "paperBill",
                (select pr."isBilling" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as "isBilling",
                (select pr."isCheck" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as "isCheck",
                (select pr."objectId" from "ProfileRecharge" as pr where pr."profile"=p."objectId") as "prId"
                from "Profile" as p
                where p."company"='${this.company}'`;
    this.http.post(baseurl, { sql: sql }).subscribe((res: any) => {
      console.log(res.data)
      this.allTableData = res.data;
      this.filterData = this.allTableData;
    });
  }

  /* 数据筛选 */
  getFilterData(type: string) {
    this.inputValue = "";
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

  /* 改变缴费状态 */
  async feeChange(pId, isFull) {
    let queryProfileRecharge = new Parse.Query("ProfileRecharge");
    queryProfileRecharge.equalTo("profile", pId);
    let prObj = await queryProfileRecharge.first();
    prObj.set("isFull", isFull);
    await prObj.save();
  }

  uploadProof(data) {
    this.overlyTableData = data;
    this.showEditFile = true;
  }

  /* 上传缴费凭证 */
  async handleOk(pId) {
    let queryProfileRecharge = new Parse.Query("ProfileRecharge");
    queryProfileRecharge.equalTo("profile", pId);
    let prObj = await queryProfileRecharge.first();
    prObj.set("tuitionBill", this.overlyTableData.tuitionBill);
    prObj.set("paperBill", this.overlyTableData.paperBill);
    // prObj.set("paperProof", this.overlyTableData.servicefeeproof);
    await prObj.save();
    this.showEditFile = false;
  }

  handleCancel() {
    this.showEditFile = false;
  }
  toggleSwitch(data){
    console.log(data)
    if(!data.prId) {
      alert('该用户还未上传缴费信息')
      return
    }
    let ProfileRecharge = new Parse.Query('ProfileRecharge')
    ProfileRecharge.get(data.prId).then(res => {
      console.log(res)
      if(data.isCheck) {
        res.set('isCheck', false )
        data.isCheck = false
      } else {
        res.set('isCheck', true )
        data.isCheck = true
      }
      res.save()
    })
  }
  // 查看发票
  checkBill(){

  }
}
