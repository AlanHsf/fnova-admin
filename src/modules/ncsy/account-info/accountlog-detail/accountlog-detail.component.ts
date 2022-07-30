import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Parse from "parse"
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-accountlog-detail',
  templateUrl: './accountlog-detail.component.html',
  styleUrls: ['./accountlog-detail.component.scss']
})
export class AccountlogDetailComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute,  private http: HttpClient, private message: NzMessageService,) {

  }
  name:string = ''
  accountid:string = ''
  pageSize:number = 10
  pageIndex:number = 1
  company:string = ''
  list:any = []
  loading:boolean = false
  total:any = 0
  tabIndex:number = 0
  credit:number = 0
  accountInfo:any = {}
  listOfColumn = [
    {
      title: '操作时间',
      compare: null,
      priority: false
    },
    {
      title: '详情',
      compare: null,
      priority: false
    },
    {
      title: '积分数量',
      compare: null,
      priority: false
    }

  ];
  ngOnInit() {
    this.company = localStorage.getItem('company')
    this.activRoute.paramMap.subscribe(async (parms) => {
      this.name = parms.get('name')
      this.accountid = parms.get('accountid')
      this.credit = Number(parms.get('credit'))
      console.log(parms, this.accountid)
      await this.getCreditLog()
      await this.getAccountInfo()
    })
  }

  async getAccountInfo() {
    let sql = `select  * from (select "fromAccount", sum("assetCount") as "cosnCredit" from "AccountLog"
    where "fromAccount" = '${this.accountid}'
    group by "fromAccount") as "cosn"
    left join (select "targetAccount", sum("assetCount") as "getCredit" from "AccountLog"
    where "targetAccount" = '${this.accountid}'
    group by "targetAccount") as "get" on "cosn"."fromAccount" = "get"."targetAccount"`
    return new Promise((resolve, reject) => {
      let baseurl = "https://server.fmode.cn/api/novaql/select";
      this.http.post(baseurl, {sql:sql})
        .subscribe(async (res: any) => {
          if (res.code == 200) {
            this.loading = false
            this.accountInfo = res.data[0]
          } else {
            this.message.info("网络繁忙，数据获取失败")
            reject(res)
          }
        })
    })

  }

  async getCreditLog() {
    this.loading = true
    let AccountLog = new Parse.Query('AccountLog')
    AccountLog.equalTo('company', this.company)
    AccountLog.equalTo('targetAccount', this.accountid)
    this.total = await AccountLog.count()
    AccountLog.limit(this.pageSize)
    AccountLog.skip(this.pageSize * (this.pageIndex -1))
    let accountLog = await AccountLog.find()
    this.list = accountLog
    this.loading =false
  }

  async consCreditLog() {
    this.loading = true
    let AccountLog = new Parse.Query('AccountLog')
    AccountLog.equalTo('company', this.company)
    AccountLog.equalTo('fromAccount', this.accountid)
    this.total = await AccountLog.count()
    AccountLog.limit(this.pageSize)
    AccountLog.skip(this.pageSize * (this.pageIndex -1))
    let accountLog = await AccountLog.find()
    this.list = accountLog
    this.loading =false
  }


  async changeTabs($event) {
    this.pageIndex = 1,
    this.pageSize = 10
    if(this.tabIndex == 0) {
      await  this.getCreditLog()
    }else {
     await  this.consCreditLog()
    }
  }
 async pageIndexChange(e) {
    if(this.tabIndex == 0) {
      await  this.getCreditLog()
    }else {
     await  this.consCreditLog()
    }

  }
  async pageSizeChange(e) {
    if(this.tabIndex == 0) {
      await  this.getCreditLog()
    }else {
     await  this.consCreditLog()
    }
  }


}
