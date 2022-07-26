import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DatePipe } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import 'ag-grid-enterprise';

@Component({
  selector: 'app-report-manager',
  templateUrl: './report-manager.component.html',
  styleUrls: ['./report-manager.component.scss']
})
export class ReportManagerComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private message: NzMessageService, private cdRef: ChangeDetectorRef, private http: HttpClient) { }

  // 表格上标题
  listOfColumn = [
    {
      title: '上报计划',
      value: 'subTitle',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '姓名',
      value: 'name',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '身份证号',
      value: 'idcard',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '论文标题',
      value: 'title',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '专业',
      value: 'majorName',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '所属院校',
      value: 'depaName',
      type: 'String',
      compare: null,
      schemaAlia: 'depa1'
    },
    {
      title: '教学点',
      value: 'centerName',
      type: 'String',
      compare: null,
      schemaAlia: 'depa2'
    },
    {
      title: '论文(pdf)',
      value: 'paper',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '论文(word)',
      value: 'document',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '查重报告',
      value: 'checkReport',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    // {
    //   title: '操作',
    //   value: '',
    //   type: '',
    //   compare: null,
    //   priority: false
    // }
  ];
  searchType: any = {};
  // 筛选
  inputValue: string;
  // 数据总量
  filterLen;
  // 查询数据
  filterData;
  isLoading;
  // 导出组件
  showExport: boolean = false;

  company;
  department;
  centerId;
  async ngOnInit(): Promise<void> {
    this.department = localStorage.getItem("department");
    this.company = localStorage.getItem("company");

    // 总后台登录: company有值,  department=null, centerId=null;
    // 主院校登录: company有值,  department有值, centerId=null;
    // 教学点登录: company=null,  department=null, centerId有值;
    if (this.department) {
      // 教学点
      let depa = new Parse.Query("Department")
      depa.equalTo("objectId", this.department);
      depa.equalTo("type", "training");
      let depaInfo = await depa.first()
      console.log(depaInfo)
      if (depaInfo && depaInfo.id) {
        this.centerId = depaInfo.id
        this.department = null
        this.company = null;
      }
    } else {
      this.centerId = null;
    }

    this.searchType = this.listOfColumn[0]
    this.getData();
    this.exportInit();
  }

  pageIndex: number = 1;
  pageSize: number = 10;
  async getData(skip?, inputVal?, filter?) {
    console.log(this.company, this.department)

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let compleSql = '';

    let selectSql = `select 
    "paper"."objectId",
    "pro"."name",
    "pro"."idcard",
    "paper"."title",
    "major"."majorName",
    "depa1"."depaName",
    "depa2"."centerName",
    "paper"."paper",
    "paper"."document",
    "paper"."checkReport",
    "submit"."subTitle" `

    let fromSql = ` from 
      (select "objectId","title","paper","document","checkReport","profile","department","departments","center","major","isReport","createdAt" from "SchoolPaper" where "company" = '1ErpDVc1u6' and ("isCross" is null or "isCross" is not true)) as "paper"
    left join 
      (select "objectId","name","idcard" from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true) as "pro"
        on "paper"."profile" = "pro"."objectId"
    left join (select "objectId","name" as "majorName" from "SchoolMajor") as "major" on "major"."objectId" = "paper"."major"
    left join (select "objectId","name" as "depaName" from "Department") as "depa1" on "depa1"."objectId" = "paper"."department"
    left join (select "objectId","name" as "centerName" from "Department") as "depa2" on "depa2"."objectId" = "paper"."center"
    join (select "objectId","title" as "subTitle","departments" from "PaperSubmit" where "company" = '1ErpDVc1u6' and "type" = 'paper' and "isReport" is true) as "submit" on "submit"."objectId" = "paper"."isReport"
    `
    let whereSql = ``
    if (this.centerId) {
      whereSql += ` where "paper"."departments" @> '[{ "objectId": "${this.centerId}"}]' and "submit"."departments" @> '[{ "objectId": "${this.centerId}"}]' `
    } else if (this.department) {
      whereSql += ` where "paper"."departments" @> '[{ "objectId": "${this.department}"}]' and "submit"."departments" @> '[{ "objectId": "${this.department}"}]' `
    } else {
      whereSql += ` where 1 = 1 `
    }

    if (this.inputValue && this.inputValue.trim() != '') {
      whereSql += ` and "${this.searchType.value}" like '%${this.inputValue}%' `
    }
    let orderSql = ` order by "paper"."createdAt" desc `
    let breakSql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`

    compleSql = selectSql + fromSql + whereSql + orderSql + breakSql
    console.log(compleSql);
    this.http
      .post(baseurl, { sql: compleSql })
      .subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          if (res.data && res.data.length) {
            let countSql = `select count(*) ${fromSql} ${whereSql}`
            console.log(countSql)
            this.filterLen = await this.getCount(countSql);
            this.filterData = res.data;
            this.cdRef.detectChanges();
            this.isLoading = false;
          } else {
            this.filterData = [];
            this.cdRef.detectChanges();
            this.filterLen = 0;
            this.isLoading = false;
          }
        } else {
          this.message.info("网络繁忙，数据获取失败")
        }
      })
    return
  }


  require: any = [];
  fileds: any;
  exportInit() {
    this.require = [];
    this.listOfColumn.forEach(col => {
      let headerName = col['title'];
      let field = col['value'];
      this.require.push({
        headerName,
        field,
      })
    });
  }
  gridApi;
  gridColumnApi;
  // ag-grid 生命周期
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  exportData() {
    this.gridApi.exportDataAsExcel();
  }
  ExportData: any = []
  getTotalStudents() {
    return new Promise(async (resolve, reject) => {
      let selectSql = `select 
      "paper"."objectId",
      "pro"."name",
      "pro"."idcard",
      "paper"."title",
      "major"."majorName",
      "depa1"."depaName",
      "depa2"."centerName",
      "paper"."paper",
      "paper"."document",
      "paper"."checkReport",
      "submit"."subTitle" `

      let fromSql = ` from 
        (select "objectId","title","paper","document","checkReport","profile","department","departments","center","major","isReport","createdAt" from "SchoolPaper" where "company" = '1ErpDVc1u6' and ("isCross" is null or "isCross" is not true)) as "paper"
      left join 
        (select "objectId","name","idcard" from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true) as "pro"
          on "paper"."profile" = "pro"."objectId"
      left join (select "objectId","name" as "majorName" from "SchoolMajor") as "major" on "major"."objectId" = "paper"."major"
      left join (select "objectId","name" as "depaName" from "Department") as "depa1" on "depa1"."objectId" = "paper"."department"
      left join (select "objectId","name" as "centerName" from "Department") as "depa2" on "depa2"."objectId" = "paper"."center"
      join (select "objectId","title" as "subTitle","departments" from "PaperSubmit" where "company" = '1ErpDVc1u6' and "isReport" is true) as "submit" on "submit"."objectId" = "paper"."isReport"
      `
      let whereSql = ``
      if (this.centerId) {
        whereSql += ` where "submit"."departments" @> '[{ "objectId": "${this.centerId}"}]' and "submit"."departments" @> '[{ "objectId": "${this.centerId}"}]' `
      } else if (this.department) {
        whereSql += ` where "submit"."departments" @> '[{ "objectId": "${this.department}"}]' and "submit"."departments" @> '[{ "objectId": "${this.department}"}]' `
      } else {
        whereSql += ` where 1 = 1 `
      }

      if (this.inputValue && this.inputValue.trim() != '') {
        whereSql += ` and "${this.searchType.value}" like '%${this.inputValue}%' `
      }
      let orderSql = ` order by "paper"."createdAt" desc `

      let compleSql = selectSql + fromSql + whereSql + orderSql
      console.log(compleSql);

      this.novaSql(compleSql).then(data => {
        console.log(data);
        if (data && data.length) {
          let dataLen = data.length;
          for (let index = 0; index < dataLen; index++) {
            let item = data[index];
            // item.claBeginTime = this.dateFmt.transform(item.claBeginTime, 'yyyy/MM/dd HH:mm:ss')
            // item.claEndTime = this.dateFmt.transform(item.claEndTime, 'yyyy/MM/dd HH:mm:ss')
            item.idcard = item.idcard ? "'" + item.idcard : "";
            if (index + 1 == dataLen) {
              resolve(data)
            }
          }
        } else {
          resolve([])
        }
      })
    })
  }
  // 导出函数 :
  async export() {
    this.ExportData = [];
    let data: any = await this.getTotalStudents();
    this.ExportData = data && data.length ? data : []
    this.showExport = true;
    console.log(this.ExportData)
  }

  // 选择条件名称
  searchTypeChange(e) {
    let index = this.listOfColumn.findIndex(item => item.value == e);
    console.log(e);
    if (index != -1) {
      this.searchType = this.listOfColumn[index];
      console.log(this.searchType)
    }
  }

  // 条件查询
  async searchStudent() {
    this.isLoading = true
    if (!this.inputValue) {
      // (this.filterLen as any) = await this.getCount();
      this.getData()
      return;
    }
    this.inputValue = this.inputValue.trim();
    await this.getData(null, this.inputValue)
    this.cdRef.detectChanges();
  }

  // 分页选择
  pageChange(e) {
    this.isLoading = true
    this.getData()
  }

  novaSql(sql): Promise<any> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
      this.http
        .post(baseurl, { sql: sql })
        .subscribe(async (res: any) => {
          console.log(res);
          if (res.code == 200) {
            resolve(res.data)
          } else {
            this.message.info("网络繁忙，数据获取失败")
            reject(res)
          }
        })
    })
  }
  async getCount(sql): Promise<number> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
      this.http
        .post(baseurl, { sql: sql })
        .subscribe(async (res: any) => {
          console.log(res);
          let count: number = 0;
          if (res.code == 200) {
            count = +res.data[0].count
            resolve(count)
          } else {
            this.message.info("网络繁忙，数据获取失败")
            resolve(count)
          }
        })
    })
  }

}
