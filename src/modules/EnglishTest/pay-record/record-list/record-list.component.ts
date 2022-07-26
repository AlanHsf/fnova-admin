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
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.scss'],
  providers: [DatePipe]
})
export class RecordListComponent implements OnInit {
  constructor(private activRoute: ActivatedRoute, private message: NzMessageService, private cdRef: ChangeDetectorRef,
    private http: HttpClient, private dateFmt: DatePipe,) { }
  department: string;// 院校
  rowData: any = [];
  showExport: boolean = false;
  groupHeaderHeight = 40;
  headerHeight = 40;
  floatingFiltersHeight = 40;
  pivotGroupHeaderHeight = 50;
  pivotHeaderHeight = 100;
  gridApi;
  gridColumnApi;
  recruitId;

  listOfColumn = [
    {
      title: '缴费人',
      value: 'name',
      type: 'Date',
      schemaAlia: 'log',
      compare: null,
      priority: false
    },
    {
      title: '缴费時間',
      value: 'createdAt',
      type: 'String',
      schemaAlia: 'pro',
      compare: null,
      priority: false
    },
    {
      title: '缴费人电话',
      value: 'mobile',
      type: 'String',
      schemaAlia: 'pro',
      compare: null,
      priority: false
    },
    {
      title: '缴费说明',
      value: 'desc',
      type: 'String',
      schemaAlia: 'log',
      compare: null,
      priority: false
    },
    {
      title: '缴费备注',
      value: 'remark',
      type: 'String',
      schemaAlia: 'log',
      compare: null,
      priority: false
    },
    {
      title: '订单编号',
      value: 'orderId',
      type: 'String',
      schemaAlia: 'log',
      compare: null,
      priority: false
    },
    {
      title: '支付方式',
      value: 'type',
      type: 'String',
      schemaAlia: 'log',
      compare: null,
      priority: false
    },
    {
      title: '支付费用',
      value: 'assetCount',
      type: 'Number',
      schemaAlia: 'log',
      compare: null,
      priority: false

    },
    {
      title: '支付状态',
      value: 'status',
      type: 'String',
      schemaAlia: 'log',
      compare: null,
      priority: false

    },
    // {
    //   title: '操作',
    //   compare: null,
    //   priority: false
    // }
  ];
  company: any;
  pCompany: any;
  listOfData: any = [];
  filterData: any = [];
  filterType: string;
  filterLen: number;
  inputValue: string;
  searchType: any = {};
  isLoading: boolean = true;
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      let recruitId = params.get("recruit");
      console.log(recruitId)
      if (recruitId) {
        this.recruitId = recruitId
        this.department = localStorage.getItem("department");
        this.company = localStorage.getItem("company");
        if (this.department && this.company) {
          let Company = new Parse.Query("Company")
          let company = await Company.get(this.company)
          this.pCompany = company.get("company").id;
        }
        if (!this.department) {
          this.listOfColumn.splice(1, 0, {
            title: '院校',
            value: 'shortname',
            type: 'String',
            schemaAlia: 'depart',
            compare: null,
            priority: false
          })
        }
        this.searchType = this.listOfColumn[0]
        this.getAccountLogs();
        this.getExportData();
      }
    })
  }
  require: any = [];
  fileds: any;
  getExportData() {
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
  pageIndex: number = 1;
  pageSize: number = 20;
  async getAccountLogs() {

    let beginTime
    let endTime
    let Recruit = new Parse.Query("RecruitStudent");
    let recruit = await Recruit.get(this.recruitId);
    if (recruit && recruit.id) {
      let recruitInfo = recruit.toJSON()
      beginTime = recruitInfo.beginTime.iso
      endTime = recruitInfo.endTime.iso
      console.log(beginTime, endTime)
    }

    let company = this.pCompany || this.company;
    let sql = ''
    let selectSql = ''
    let searchSql = ''
    let orderSql = 'ORDER BY "log"."createdAt" DESC '
    console.log(this.searchType, this.inputValue);
    if (this.inputValue && this.inputValue.trim() != '') {
      if (this.searchType.value == 'status') {
        if(this.inputValue == "已支付"){
          searchSql = `and "log"."isVerified" is true and "log"."isback" is not true `
        }else if(this.inputValue == "未支付"){
          searchSql = `and "log"."isVerified" is not true and "log"."isback" is not true `
        }

      } else if (this.searchType.value == 'type') {
        if(this.inputValue.indexOf("微信") >= 0){
          searchSql = `and "log"."orderType" = '5beidD3ifA-wxsdk' `
        }else if(this.inputValue.indexOf("支付宝") >= 0){
          searchSql = `and "log"."orderType" = '5beidD3ifA-alisdk' `
        }else if(this.inputValue.indexOf("赢商通") >= 0){
          searchSql = `and "log"."orderType" like '5beidD3ifA-yst%' `
        }
        
      } else {
        searchSql = `and "${this.searchType.schemaAlia}"."${this.searchType.value}" like '%${this.inputValue}%'`
      }
    }
    
    if (this.department) {
      selectSql = `SELECT "log"."createdAt","log"."updatedAt", "log"."company","log"."isVerified","log"."isback","log"."desc","log"."orderNumber","log"."orderType","log"."orderId","log"."remark","log"."assetCount","pro"."mobile","pro"."name" `
      sql = ` from (select * from "Profile" where "isDeleted" is not true) as "pro" LEFT JOIN (select * from "AccountLog" where SUBSTRING("desc",1,10) ='${this.recruitId}') as "log" ON SUBSTRING("log"."orderId",2,10) = "pro"."objectId"
      WHERE "log"."company"='${company}'  and "log"."targetName"='${this.department}' and "log"."orderId" is not null `;
    } else {
      selectSql = `SELECT "log"."createdAt","depart"."shortname" as "shortname","log"."updatedAt", "log"."company","log"."isVerified","log"."isback","log"."desc","log"."orderNumber","log"."orderType","log"."orderId","log"."remark","log"."assetCount","pro"."mobile","pro"."name" `
      sql = ` from (select * from "Profile" where "isDeleted" is not true) as "pro" LEFT JOIN "AccountLog" as "log" ON SUBSTRING("log"."orderId",2,10) = "pro"."objectId"
      LEFT JOIN "Department" as "depart" ON "pro"."department" = "depart"."objectId"
      WHERE "log"."company"='${company}'  and "log"."orderId" is not null  `
    }
    let compleSql = selectSql + sql + searchSql + orderSql + `limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`
    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    this.http.post(baseurl, { sql: compleSql })
      .subscribe(async (res: any) => {
        console.log(res);
        let data: any = res.data;
        let dataLen = data.length;
        if (data && data.length) {
          console.log(data);
          for (let index = 0; index < dataLen; index++) {
            let item = data[index];
            data[index].createdAt = this.dateFormat(data[index].createdAt)
            if (item.orderType.indexOf("wxsdk") != -1) {
              item.type = '微信支付'
            }
            if (item.orderType.indexOf("alisdk") != -1) {
              item.type = '支付宝支付'
            }
            if (item.orderType.indexOf("ystPay") != -1) {
              item.type = '赢商通支付'
            }
            if (item.orderType.indexOf("cash") != -1) {
              item.type = '系统外支付'
            }
            if (!item.isVerified) {
              item.status = '未支付'
            } else {
              if (!item.isback) {
                item.status = '已支付'
              } else {
                item.status = '已退款'
              }
            }
            if (index + 1 == dataLen) {
              console.log(res);
              this.listOfData = data;
              this.filterData = data;
              let countSql = sql + searchSql;
              this.filterLen = await this.getCount(countSql);
              console.log(data);
              this.isLoading = false;
            }
          }
        } else {
          this.filterData = [];
          this.filterLen = 0;
          this.isLoading = false;
        }
      });
  }
  async getCount(sql): Promise<number> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
      let countSql = `select count(*)  ${sql} `;
      this.http
        .post(baseurl, { sql: countSql })
        .subscribe(async (res: any) => {
          console.log(res);
          let count: number = 0;
          if (res.code == 200) {
            count = res.data[0].count
            resolve(count)
          } else {
            resolve(count)
            this.message.info("网络繁忙，数据获取失败")
          }
        })
    })

  }
  dateFormat(time) {
    time = new Date(time);
    let Year = time.getFullYear();
    let Month = time.getMonth() + 1;
    let Day = time.getDate();
    let Hours = time.getHours();
    let Minutes = time.getMinutes();
    Hours = Hours == 0 ? '00' : (Hours < 10 ? '0' + Hours : Hours)
    Minutes = Minutes == 0 ? '00' : (Minutes < 10 ? '0' + Minutes : Minutes)
    time = Year + '/' + Month + '/' + Day + '  ' + Hours + ':' + Minutes;
    return time
  }
  searchTypeChange(e) {
    console.log(e);
    let index = this.listOfColumn.findIndex(item => item.value == e);
    console.log(e);
    if (index != -1) {
      this.searchType = this.listOfColumn[index];
    }
  }
  searchStudent() {
    this.inputValue = this.inputValue.trim();
    this.searchStudent()
    this.cdRef.detectChanges();
  }
  check(data, type) {
    if (type == 'delete') {
      data.set("company", null);
    }
    data.save().then(res => {
      console.log(res);
      this.filterData = this.filterData.filter((item: any) => { return item.id != data.id })
      this.cdRef.detectChanges();
    })
  }

  // ag-grid 生命周期
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  exportData() {
    this.gridApi.exportDataAsExcel();
  }
  // 导出函数 :
  async export() {
    this.rowData = [];
    this.rowData = await this.getExportHttp()
    this.showExport = true;
    console.log(this.rowData)
  }

  getExportHttp() {
    return new Promise((resolve, rejects) => {
      let company = this.pCompany || this.company;
      let sql = ''
      let selectSql = ''
      let searchSql = ''
      if (this.inputValue && this.inputValue.trim() != '') {
        searchSql = `and "${this.searchType.schemaAlia}"."${this.searchType.value}" like '%${this.inputValue}%'`
      }
      let orderSql = 'ORDER BY "log"."createdAt" DESC ';
      if (this.department) {
        selectSql = `SELECT "log"."createdAt","log"."updatedAt", "log"."company","log"."isVerified","log"."isback","log"."desc","log"."orderNumber","log"."orderType","log"."orderId","log"."remark","log"."assetCount","pro"."mobile","pro"."name" `
        sql = ` from (select * from "Profile" where "isDeleted" is not true) as "pro" LEFT JOIN (select * from "AccountLog" where SUBSTRING("desc",1,10) ='${this.recruitId}') as "log" ON SUBSTRING("log"."orderId",2,10) = "pro"."objectId"
      WHERE "log"."company"='${company}'  and "log"."targetName"='${this.department}' and "log"."orderId" is not null `;
      } else {
        selectSql = `SELECT "log"."createdAt","depart"."shortname" as "shortname","log"."updatedAt", "log"."company","log"."isVerified","log"."isback","log"."desc","log"."orderNumber","log"."orderType","log"."orderId","log"."remark","log"."assetCount","pro"."mobile","pro"."name" `
        sql = ` from (select * from "Profile" where "isDeleted" is not true) as "pro" LEFT JOIN "AccountLog" as "log" ON SUBSTRING("log"."orderId",2,10) = "pro"."objectId"
      LEFT JOIN "Department" as "depart" ON "pro"."department" = "depart"."objectId"
      WHERE "log"."company"='${company}'  and "log"."orderId" is not null  `
      }
      let compleSql = selectSql + sql + searchSql + orderSql;
      console.log();

      let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
      this.http.post(baseurl, { sql: compleSql })
        .subscribe(async (res: any) => {
          console.log(res);
          let data: any = res.data;
          let dataLen = data.length;
          if (data && dataLen) {
            console.log(data);
            for (let index = 0; index < dataLen; index++) {
              let item = data[index];
              item.createdAt = this.dateFmt.transform(item.createdAt, 'yyyy/MM/dd HH:mm:ss')
              if (item.orderType.indexOf("wxsdk") != -1) {
                item.type = '微信支付'
              }
              if (item.orderType.indexOf("alisdk") != -1) {
                item.type = '支付宝支付'
              }
              if (item.orderType.indexOf("ystPay") != -1) {
                item.type = '赢商通支付'
              }
              if (item.orderType.indexOf("cash") != -1) {
                item.type = '系统外支付'
              }
              if (!item.isVerified) {
                item.status = '未支付'
              } else {
                if (!item.isback) {
                  item.status = '已支付'
                } else {
                  item.status = '已退款'
                }
              }
              // if (index + 1 == dataLen) {
              //   console.log(res);
              //   this.listOfData = data;
              //   this.filterData = data;
              //   let countSql = sql + searchSql;
              //   this.filterLen = await this.getCount(countSql);
              //   console.log(data);
              //   this.isLoading = false;
              // }
            }
            resolve(data)
          } else {
            resolve(data)
          }
        });
    })
  }


}
