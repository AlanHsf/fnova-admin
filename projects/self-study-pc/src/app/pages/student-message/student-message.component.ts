import { Component, OnInit } from '@angular/core';
import * as Parse from "parse";
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http"; //引入http服务
import { resolve } from 'path';
import { type } from 'os';
import { rejects } from 'assert';

@Component({
  selector: 'app-student-message',
  templateUrl: './student-message.component.html',
  styleUrls: ['./student-message.component.scss']
})
export class StudentMessageComponent implements OnInit {

  constructor(
    private pagination: NzPaginationModule,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) { }

  noticeType: string = "all"
  sType:string = "all"
  nzPageSize: any = 5
  noticePageSize: any = 5
  AllPageIndex: any = 1 // 全部信息的页数
  AllPageSize: any = 4
  company: any = localStorage.getItem("company");
  noticeList_four: any = []  // 课程提醒每次渲染的总条数, 也是未读列表每页渲染的数据
  notification_four: any[]  // 站内提醒每次页面渲然的条数
  notReadList_four: any = []  // 未读消息的数量
  noticelist: any = []  // 全部信息


  async ngOnInit() {
    this.noticelist = await this.getAllmessage()
    this.caculate()
  }


  getAllmessage() {
   return new Promise((resolve, reject) => {
      let user = Parse.User.current().id
      let baseUrl = 'https://server.fmode.cn/api/novaql/select'
      let sql = `select 
        "notice"."objectId",
        "notice"."createdAt",
        "notice"."type",
        "notice"."title",
        "notice"."content",
        null as "noticeType",
        null as "params"
    from 
    "Notice" as "notice" where "notice"."company" = '${this.company}'
    union all select 
        "log"."objectId", 
        "log"."createdAt",
        "log"."type",
        null,
        null,
        "log"."noticeType",
        "log"."params"

    from "NoticeLog" as "log" where "log"."company" = '${this.company}' and "log"."viewer" = '${user}'
    order by "createdAt" desc
      limit 4 offset ${(this.pageIndexNotice - 1) * 4}`
      this.http.post(baseUrl, { sql: sql }).subscribe(res => {
        let data = res["data"];
        console.log(data)
        resolve(data)
      })
   })
  }

  Total: any = 0
  all: any = 0
  async caculate() {
    let Notice = new Parse.Query('NoticeLog')
    let Notifi = new Parse.Query('Notice')
    let user = Parse.User.current().id
    Notice.equalTo('viewer', user)
    Notice.equalTo('company', this.company)
    Notifi.equalTo('type', 'system')
    Notifi.equalTo('company', this.company)
    let count = await Notice.count()
    let count2 = await Notifi.count()
    this.Total = count + count2
    this.all = count + count2

  }
  pageIndex: any = 1
  // 课程提醒模块获取4条信息
  logCount: number = 0
  async getFourMessages(isView?) {
    this.noticelist = []
    let user = Parse.User.current().id
    console.log(user)
    let noticeLog = new Parse.Query('NoticeLog')
    noticeLog.equalTo('viewer', user)
    noticeLog.equalTo('company', this.company)
    if (isView) {
      noticeLog.notEqualTo('isView', true)
    }
    let count = await noticeLog.count()
    noticeLog.limit(this.nzPageSize)
    noticeLog.skip(this.nzPageSize * (this.pageIndexNotice - 1))
    let noticelog = await noticeLog.find()
    console.log(noticelog)
    if (noticelog && noticelog.length > 0) {
      let noticeList_1 = []
      noticelog.forEach(item => {
        noticeList_1.push(item.toJSON())
      })
      this.noticelist = noticeList_1
    }
    this.Total = count
    console.log(this.noticelist)
    console.log(this.logCount)
  }

  pageIndexNotice: any = 1  // 页数
  noticeCount: number = 0
  // 获取4条信息
  async getFourNotification() {
    this.noticelist = []
    let notice = new Parse.Query('Notice')
    notice.equalTo('type', 'system')
    notice.equalTo('company', this.company)
    let count = await notice.count()
    notice.limit(this.noticePageSize)
    notice.skip(this.noticePageSize * (this.pageIndexNotice - 1))
    let noticeResult = await notice.find()
    if (noticeResult && noticeResult.length > 0) {
      let noticeList_1 = []
      noticeResult.forEach(item => {
        noticeList_1.push(item.toJSON())
      })
      this.noticelist = noticeList_1
    }
    console.log(this.noticelist)
    this.Total = count
  }

  // 分页器回调函数--课程提醒
  async changePage(e) {
    console.log(e)
    this.pageIndexNotice = e
    if(this.noticeType == 'all') { 
      if(this.sType == "noread") {
        await this.getFourMessages(true)
      }else {
        this.noticelist = await this.getAllmessage()
      }
    }else if(this.noticeType == 'system') {
      await this.getFourNotification()
    }else if(this.noticeType == 'lesson') {
      await this.getFourMessages()
    }
  }

 


  

  getInfo(id, type) {
    console.log("点到了查看详情")
    console.log(id)
    this.router.navigate([
      `masterol/message-detail`,
      {
        newsId: id,
        type: type
      }
    ]);
  }

  //   async allReaded() {
  //     console.log('111')
  //     let user = Parse.User.current().id
  //     let noticeLog = new Parse.Query('NoticeLog')
  //     noticeLog.equalTo('viewer',user)
  //     noticeLog.equalTo('company',this.company)
  //     noticeLog.notEqualTo('isView',true)
  //     let noticelog = await noticeLog.find()
  //     // console.log(noticelog)
  //     let check = await this.prom(noticelog)
  //     if(check) {
  //       this.noticeList_1 = []
  //     }

  //   }

  //  prom(noticelog) {
  //    console.log('1111111')
  //    console.log(noticelog)
  //     return new Promise((resolve,reject) => {
  //       for(let i = 0; i<noticelog.length; i++) {
  //         noticelog[i].set('isView', true)
  //         noticelog[i].save()
  //         console.log(noticelog[i])
  //       }
  //       resolve(true)
  //     })
  //   }

  async switch1() {
    console.log('点到了全部消息')
    this.noticeType = "all"
    this.pageIndexNotice = 1
    this.noticelist = await this.getAllmessage()
    await this.caculate()
  }

  async switch2() {
    console.log('点到了站内通知')
    this.noticeType = "system"
    this.pageIndexNotice = 1
    await this.getFourNotification()
  }

  async switch3() {
    this.pageIndexNotice = 1
    console.log('点到了课程提醒')
    this.noticeType = "lesson"
    await this.getFourMessages()
    
  }

  async switch5() {
    this.pageIndexNotice = 1
    console.log('点到了全部')
    this.sType = "all"
    this.noticeType = "all"
    this.noticelist = await this.getAllmessage()
    await this.caculate()
  }

  switch6() {
    this.pageIndexNotice = 1
    console.log('点到了未读')
    this.sType = "noread"
    this.getFourMessages(true)
  }
}
