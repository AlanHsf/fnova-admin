import { Component, OnInit } from '@angular/core';
import * as Parse from "parse";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  
  async ngOnInit() {
    this.activatedRoute.params.subscribe(param => {
      console.log(param)
      this.noticeId = param.newsId
      this.noticeType = param.type
    })
    await this.getFirstMessage(this.noticeId,this.noticeType)
  }

  activeIndex: any = 1
  company:any = localStorage.getItem("company");
  noticeId:any = ''
  noticeType:any = ""
  mInfo:any = null
  nInfo:any = null
  


  async getFirstMessage(noticeId,noticeType) {

    if(noticeType == "lesson") {
    // 找到课程提醒的第一条数据
    let noticeLog = new Parse.Query('NoticeLog')
    let res = await noticeLog.get(noticeId)
    if(res) {
      if(!res.get('isView')){
          res.set('isView', true)
          await res.save()
      }
      this.mInfo = res.toJSON()
      console.log(this.mInfo)
      } 
    }

    if(noticeType == "system") {
    // 找到站内通知的第一条数据
    let notice = new Parse.Query('Notice')
    notice.equalTo('company',this.company)
    notice.equalTo('type', 'system')
    notice.equalTo('objectId',noticeId)
    await notice.first().then(res => {
    if(res) {
      this.nInfo = res.toJSON()
      console.log(this.nInfo)
    } 
  })
    }

}

}
