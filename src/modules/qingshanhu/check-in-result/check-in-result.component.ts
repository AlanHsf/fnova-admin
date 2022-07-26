import { Component, OnInit } from '@angular/core';
import * as Parse from "parse";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-check-in-result',
  templateUrl: './check-in-result.component.html',
  styleUrls: ['./check-in-result.component.scss']
})
export class CheckInResultComponent implements OnInit {

  constructor(private http : HttpClient, private activatedRoute: ActivatedRoute) { }

  tableHead: Array<any> = [
    "姓名",
    "手机号",
    "是否签到"
  ];

  company: string = localStorage.getItem("company");
  allTableData: Array<any> = [];
  filterData: Array<any> = [];
  filterType: string;
  inputValue: String;
  searchType: any = "studentID";
  proofUrl: string;
  showEditFile: Boolean = false;
  pageSize: Number = 20;
  pageIndex: Number = 1;
  overlyTableData: any;
  aid:any
  count:number = 0
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.aid = param.get("PobjectId");
      if (this.aid) {
        this.getData()
        this.queryLogCount()
      }
    })
  }
  async getData() {
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let  sql = `SELECT 
    "CertifyLog"."realname","CertifyLog"."mobile",
    "CheckInLog"."createdAt"
    FROM "ActivityRegister"
    left join "CheckInLog" on "ActivityRegister"."activity" = "CheckInLog"."activity" 
    and "ActivityRegister"."user" = "CheckInLog"."user"
    left join "CertifyLog" on "ActivityRegister"."user" = "CertifyLog"."user"
    and "CertifyLog"."type" = 'auth'
    where "ActivityRegister"."activity" = '${this.aid}' and "ActivityRegister"."company" = '${this.company}'`
    this.http.post(baseurl, { sql: sql }).subscribe((res: any) => {
      console.log(res.data)
      this.allTableData = res.data;
      this.filterData = this.allTableData;
    });
  }
  async queryLogCount(){
    let CheckInLog = new Parse.Query('CheckInLog')
    CheckInLog.equalTo('activity', this.aid)
    let count = await CheckInLog.count()
    this.count = count
    console.log(count)
  }

}
