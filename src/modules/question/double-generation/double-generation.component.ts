import { Component, OnInit } from '@angular/core';
import * as Parse from "parse";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-double-generation',
  templateUrl: './double-generation.component.html',
  styleUrls: ['./double-generation.component.scss']
})
export class DoubleGenerationComponent implements OnInit {

  constructor(private http : HttpClient, private activatedRoute: ActivatedRoute) { }
  tableHead: Array<any> = [
    "姓名",
    "性别",
    "工号",
    "代表团",
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
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.aid = param.get("PobjectId");
      if (this.aid) {
        this.getData()
        this.queryLogCount()
      }
    })
    // this.getData()
  }


  async getData() {
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let sql = `select "profile"."name",
		"profile"."sex",
		"profile"."studentID",
		"profile"."tag",
		"Log"."objectId" as "lid"
    from "Profile" as "profile"
    left join "CheckInLog" as "Log" on "Log"."profile" = "profile"."objectId" and "Log"."activity" = '${this.aid}'
    where "profile"."company" = '${this.company}' and "profile"."tag" is not null 
    order by "lid"`;
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

