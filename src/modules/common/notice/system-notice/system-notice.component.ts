import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";
import { HttpClient } from "@angular/common/http";
import { ParseDataSource } from '../../common-list/common-list-page';

@Component({
  selector: 'app-system-notice',
  templateUrl: './system-notice.component.html',
  styleUrls: ['./system-notice.component.scss']
})
export class SystemNoticeComponent implements OnInit {
  notices: any;
  notice: any;
  company: any;
  isShowNtc: boolean = false;
  newIcon: string;
  user: any;
  price: string;
  feima: string = '1AiWpTEDH9'
  constructor(private activRoute: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(() => {
      this.company = localStorage.getItem("company")
      console.log(this.company);
      this.user = Parse.User.current()
      this.newIcon = 'http://cloud.file.futurestack.cn/1AiWpTEDH9/20210702/19d9d1021058.png'
      if(this.user){
        this.getNotices();
      }
      this.notice = {}
    })
  }
  async getNotices() {
    this.notices = []
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
  console.log(this.company,this.user,);
  
 let sql = `select "Notice"."company","Notice"."targetCompany","Notice"."createdAt","Notice"."content", "Notice"."objectId", (select count(*) as "log" from "NoticeLog" where "NoticeLog"."notice" = "Notice"."objectId" and "NoticeLog"."viewer"= '${this.user.id}' group by "NoticeLog"."viewer" )  from "Notice" where "Notice"."company" = '${this.feima}' and "Notice"."targetCompany" = '${this.company}' order by "Notice"."createdAt" DESC `
    // select "Notice"."company","Notice"."targetCompany","Notice"."createdAt","Notice"."content" ,"Notice"."objectId",
    // (select count(*) as "log"  from "NoticeLog" where "NoticeLog"."notice" = "Notice"."objectId" and "NoticeLog"."viewer"= '${this.user}' group by "NoticeLog"."viewer" )  from "Notice" 
    // where "Notice"."company" = '1AiWpTEDH9' and "Notice"."targetCompany" = '5beidD3ifA' order by "Notice"."createdAt" DESC limit 1
    this.http.post(baseurl, { sql: sql })
      .subscribe(async (res: any) => {
        let data: any = res.data;
        console.log(data);
        this.notices = data;
      });
  }
  async setNoticeLog(noticeId) {
    console.log(noticeId);
    let Log = new Parse.Query("NoticeLog");
    Log.equalTo("notice", noticeId)
    Log.equalTo("company", this.company)
    Log.equalTo("viewer", this.user.toPointer())
    let log = await Log.first()
    console.log(log);
    if (!log || !log.id) {
      let NoticeLog = Parse.Object.extend("NoticeLog");
      let noticeLog = new NoticeLog();
      noticeLog.set("viewer", this.user.toPointer())
      noticeLog.set("notice", {
        __type: "Pointer",
        className: "Notice",
        objectId: noticeId,
      })
      noticeLog.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: this.company,
      })
      await noticeLog.save()
    }
  }
  showNotice(notice, noticeId) {
    this.notice = notice;
    console.log(this.notice);
    this.isShowNtc = true;
    this.setNoticeLog(noticeId);
    // this.codeLink = `${notice.objectId}`
    // this.wxPay()
  }

  cancelPush() {
    this.isShowNtc = false;
    this.getNotices()

  }
  async saveModule() {
      let cid = localStorage.getItem('company')
      let Module = new Parse.Query('DevModule')
      Module.limit(200)
      let module = await Module.find()
      let devModules = []
      module.forEach(item => {
        devModules.push({
            __type: "Pointer",
            className: 'DevModule',
            objectId: item.id
        })
      })
      console.log(devModules)
      let Company = new Parse.Query('Company')
      let company = await Company.get(cid)
      company.set('devModule', devModules )
      let c = await company.save()
      if(c) {
          console.log('成功')
      }
  }
  devmodule = [
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "3KNILWDley"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "QtOVaLOxg4"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "KGjaSKjwCL"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "joRdhljQ4O"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "FIhT4GcoFG"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "zZATaETOji"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "YPedjflQws"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "2HA00q89Tb"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "w2gDpShurD"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "m7LVKJvaeD"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "xUH2ekM8FD"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "8c0AAd4IoL"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "1fjx2moOoS"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "CPB303q74y"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "ubIxhXPWbD"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "L7iJJSNgEF"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "wBMNkZHeQN"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "Adj0RvQcG8"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "DtmDSELOOW"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "lHQ3kUmHyE"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "jRvPVcfEzX"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "zhRZPEnEx2"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "qiBTHZG6uI"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "hVjgH38SDy"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "cy0VhTXwIh"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "LpvBdYB1zF"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "YVFrUsfN7J"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "6UBhBAWHhE"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "GxsJzFDhEK"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "6nYm73VZpJ"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "h0BMQcnKtn"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "Rxpe8YkZBb"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "KIi3RC5OwO"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "PoY6j2DplE"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "3ybd0s50p4"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "meyDH3tUm2"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "BQqmMZXJkc"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "OY4R9zHKH9"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "XYifCyGqSy"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "JLiStcZ20Y"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "9jUmkPHFkt"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "spMDeAOWRE"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "WEfVmqEwB0"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "Coem6Zjbj9"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "sOQrjo4iE4"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "jtx61IMwTe"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "ZaJm6y2T1H"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "CaqONUOyDi"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "QcuxqRsnxZ"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "lXZH5gaJmq"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "z7h3A7t5zP"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "MhoRQtLP4D"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "1vMBDnSLv7"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "cr98V6Q3Jx"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "spFWK9Y9vS"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "GFnEmjonLc"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "IOoySUaI1s"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "9GTajBcAlB"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "STfqaTXYYJ"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "PajicmD8oL"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "N7OtdPxRZI"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "C9Nr25AXYy"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "ksXQMGN6Bj"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "lwWrMbTq2D"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "cFUk3L4HjX"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "R6ULgypNPG"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "LXLAgsDKJY"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "orI3w3D2Ab"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "3nOJDFCld8"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "mGMmCOkQBw"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "dibBEK15PD"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "kAlYI7ikya"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "CXdVgZHGxR"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "JS0wHULpr2"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "UZrHe37HfT"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "w9yMvh7wQB"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "QC9Osns9mU"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "8Hu9Y3vRJ1"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "BNPBOKDS6w"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "WonhVgpKLX"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "IRNfYqspQX"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "uJGZVPZVK0"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "Y7LNUNVAua"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "kBd5xVJkbx"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "3sD8fxyjbi"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "Z7yvdzhJY8"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "VWIhu2qPiN"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "gy4dQFUFq1"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "dgvHmBVl70"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "v7nRTLBDj3"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "3qxiCIgEVG"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "VYPn5sLMQA"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "azDlC5zvTc"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "YwaCtg8Jha"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "BFRkc3xowN"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "oEnVX3F3QX"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "lt5qNmyGQz"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "uHeB0lEbtL"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "w4JRGvjZ2M"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "G6bf4uFGAh"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "fgDXeagbMt"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "laTATUcazy"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "48edjbNypr"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "VP8p2ftcTi"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "DUsezk6ZTL"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "yK3YMOEkOe"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "ZEuMhHfLdh"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "sJ90Vp0HXN"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "31NJLVNCpD"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "rTRsxXtUSu"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "ieWf4HuLpT"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "5WdigColBK"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "wTOriPrZAZ"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "tL72qwMonD"
    },
    {
      "__type": "Pointer",
      "className": "DevModule",
      "objectId": "sEQkCEu3cq"
    }
  ]

}
