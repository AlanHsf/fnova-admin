import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as Parse from 'parse'
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router'

@Component({
    selector: 'app-creatStock',
    templateUrl: './creatStock.component.html',
    styleUrls: ['./creatStock.component.scss']
})
export class CreatStockComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private message: NzMessageService,
        private route: Router
    ) {

    }
    orderID: string = '';
    mobile: string = '';
    inviteMobile: string = ''
    logs: any = []
    missingLogs: any = []
    List: any = []
    todayList: any = []
    company: any
    baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    ngOnInit() {
        this.company = localStorage.getItem('company')
        this.queryStockLog()
    }
    async queryStockLog() {
        let sql = `select
        "log"."user",
        "log"."orderID",
        count(*) as "totalcount",
        max("log"."shopStore") as store,
        max("log"."inviteMobile") as "inviteMobile",
        max("log"."mobile") as mobile,
        max("log"."count") "count",
        max("log"."term") as term,
        max("log"."title") as tilte,
        max("log"."totalPrice") as "totalPrice",
        max("log"."invite") as inviteid,
        max("log"."userLeagueLevel") as "userLeagueLevelId",
        max("log"."userLeagueLevelName") as "userLeagueLevel",
        max("log"."month") as lastmonth,
		min("log"."day") as "day",
        min("log"."month") as firstmonth,
        min("log"."year") as firstyear,
        max("log"."year") as lastyear,
        min("log"."orderDate") as "orderDate",
        min("log"."updatedAt") as "updatedAt",
        min("log"."orderDate") as lastdate,
        (case when  date_part('month',max("log"."orderDate")) = date_part('month',current_date) then true else false end) iscreated,
        (case when count(*) >= 12 then true else false end) isdone
        from (select 
                "stacklog"."user",
                "stacklog"."orderID",
                  "stacklog"."shopStore",
                  "stacklog"."isCross",
                  "stacklog"."term",
                  "stacklog"."title",
                  "stacklog"."mobile" as "inviteMobile",
                  "stacklog"."totalPrice",
                  "stacklog"."invite",
                  "stacklog"."count",
                  "stacklog"."userLeagueLevel",
                  "ULL"."name" as "userLeagueLevelName",
                  "ULL"."objectId" as "ulid",
                  "U"."mobile" as mobile,
                  date_part('year', ("orderDate")) as year,
                  date_part('month', ("orderDate")) as month,
			  	  date_part('day', ("orderDate")) as day,
                  "stacklog"."createdAt",
                  "stacklog"."updatedAt",
                  "stacklog"."orderDate"
        from "UserStockLog" as stacklog
        left join "_User" as "U" on "stacklog"."user" = "U"."objectId"
        left join "UserLeagueLevel" as "ULL" on "stacklog"."userLeagueLevel" = "ULL"."objectId"
             )as "log"
        group by "log"."user","log"."orderID"  
        order by  "orderDate" desc     
        `
        this.http.post(this.baseurl, { sql: sql }).subscribe((res: any) => {
            console.log(res.data)
            this.logs = res.data;
            this.filterData(res.data, 'all')
        });
    }
    isVisible: boolean = false
    currentStock: any;
    currentTerm: number = 0;
    currentIndex: number ;
    
    async confirmCreatStock(data, index) {
        // 已有十二条不创建， 今日已经创建了的不创建, 本月已经创建了的
        console.log(data)
        let tDate = new Date(new Date().setDate(1))
        this.currentTerm = Number(data.totalcount) + 1
        this.currentIndex = index
        let UserStockLog = new Parse.Query('UserStockLog')
        UserStockLog.equalTo('user', data.user)
        UserStockLog.equalTo('orderID', data.orderID)
        // let userStockLogs = await UserStockLog.count()
        UserStockLog.greaterThan('orderDate', tDate)
        let stockLog = await UserStockLog.first()
        console.log(data)
        if(data.difflog == 0 || !data.difflog) {
            this.createBasicMessage('error', '该订单暂无需要补充的铺机记录')
            return 
        }
        if (Number(data.totalcount) >= 12) {
            this.createBasicMessage('error', '该订单已有十二条记录')
            return
        } else if (stockLog && stockLog.id) {
            this.createBasicMessage('error', '本月铺机记录已生成')
            return
        } else {
            this.isVisible = true
            this.currentStock = data
        }
    }
    async creatStock(data) {
        let orderDate = new Date(data.orderDate)
        orderDate.setMonth(orderDate.getMonth() + Number(data.totalcount))
        console.log(orderDate)
        let UserStockLog = Parse.Object.extend('UserStockLog')
        let userStockLog = new UserStockLog()
        userStockLog.set('mobile', Number(data.inviteMobile))
        userStockLog.set('totalPrice', Number(data.totalPrice))
        userStockLog.set('orderID', data.orderID)
        userStockLog.set('term', Number(data.term))
        userStockLog.set('title', data.title)
        userStockLog.set('currentTerm', this.currentTerm)
        userStockLog.set('count', Number(data.count))
        userStockLog.set('isCross', false)
        userStockLog.set('orderDate', orderDate)
        userStockLog.set('company', {
            __type: "Pointer",
            className: "Company",
            objectId: this.company
        })
        userStockLog.set('user', {
            __type: "Pointer",
            className: "_User",
            objectId: data.user
        })
        userStockLog.set('invite', {
            __type: "Pointer",
            className: "_User",
            objectId: data.inviteid
        })
        if(data.store) {
            userStockLog.set('shopStore', {
                __type: "Pointer",
                className: "ShopStore",
                objectId: data.store
            })
        }
        
        userStockLog.set('userLeagueLevel', {
            __type: "Pointer",
            className: "UserLeagueLevel",
            objectId: data.userLeagueLevelId
        })
        let stockLog = await userStockLog.save()
        if (stockLog && stockLog.id) {
            this.createBasicMessage('success', '创建成功')
            // 创建成功，发送模板消息
            if(this.type == 'missing') {
                this.missingLogs[this.currentIndex].difflog -= 1
            } else {
                this.logs[this.currentIndex].difflog -= 1
            }
            data.diffLog -= 1
            this.isVisible = false
            this.currentStock.totalcount = Number(this.currentStock.totalcount) + 1
            if (this.type == 'today') {
                this.todayLog()
            }

        }

    }



    toStockDetail(data) {
        let uid = data.user
        let orderID = data.orderID
        this.route.navigate(['jiudaka/stock-detail', { rid: 'HMXCPsiAtC', uid: uid, orderID: orderID }])
    }

    type: string = 'all'
    todayLog() {
        this.type = 'today'
        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth() + 1
        let sql = `select * from 
        (select
            extract(day from  max("log"."createdAt")) as "day",
            extract(month from  max("log"."createdAt")) as "month",
            extract(year from  max("log"."createdAt")) as "year",
            max("log"."objectId") as "objectId",
            max("log"."user") as "user",
            min("log"."orderDate") as "orderDate",
            max("log"."createdAt") as "createdAt",
            min("log"."updatedAt") as "updatedAt",
            max("log"."shopStore") as "shopStore",
            count("log"."isCross") as "isCross",
            max("log"."orderID") as "orderID",
            max("log"."term") as "term",
            max("log"."title") as "title",
            max("log"."mobile") as "inviteMobile",
            max("log"."totalPrice") as "totalPrice",
            max("log"."invite") as "invite",
            max("log"."count") as "count",
            max("U"."mobile") as "mobile",
            max("ULL"."name") as "userLeagueLevel",
            count(1) as "totalcount",
            max("log"."shopStore") as "shopStore"
        from "UserStockLog"  as  "log" 
        left join "_User" as "U" on "log"."user" = "U"."objectId"
        left join "UserLeagueLevel" as "ULL" on "log"."userLeagueLevel" = "ULL"."objectId"
        where "log"."company" = 'yehZ4fpd6a' 
        group by "user" , "log"."orderID"
        order by  "createdAt" desc) as "logs"
        where "day" = ${day} and "month" != ${month}
        `
        this.http.post(this.baseurl, { sql: sql }).subscribe((res: any) => {
            console.log(res.data)
            this.logs = res.data;
        });
    }


    missingLog() {
        this.type = 'missing'
        let sql = `select
        "log"."user",
        "log"."orderID",
        count(*) as "totalcount",
        max("log"."shopStore") as store,
        max("log"."inviteMobile") as "inviteMobile",
        max("log"."mobile") as mobile,
        max("log"."count") "count",
        max("log"."term") as term,
        max("log"."title") as title,
        max("log"."totalPrice") as "totalPrice",
        max("log"."invite") as inviteid,
        max("log"."userLeagueLevel") as "userLeagueLevelId",
        max("log"."userLeagueLevelName") as "userLeagueLevel",
        max("log"."month") as lastmonth,
		min("log"."day") as "day",
        min("log"."month") as firstmonth,
        min("log"."year") as firstyear,
        max("log"."year") as lastyear,
        min("log"."orderDate") as "orderDate",
        min("log"."updatedAt") as "updatedAt",
        min("log"."orderDate") as lastdate,
        (case when  date_part('month',max("log"."orderDate")) = date_part('month',current_date) then true else false end) iscreated,
        (case when count(*) >= 12 then true else false end) isdone
        from (select 
                "stacklog"."user",
                "stacklog"."orderID",
                  "stacklog"."shopStore",
                  "stacklog"."isCross",
                  "stacklog"."term",
                  "stacklog"."title",
                  "stacklog"."mobile" as "inviteMobile",
                  "stacklog"."totalPrice",
                  "stacklog"."invite",
                  "stacklog"."count",
                  "stacklog"."userLeagueLevel",
                  "ULL"."name" as "userLeagueLevelName",
                  "ULL"."objectId" as "ulid",
                  "U"."mobile" as mobile,
                  date_part('year', ("orderDate")) as year,
                  date_part('month', ("orderDate")) as month,
			  	  date_part('day', ("orderDate")) as day,
                  "stacklog"."createdAt",
                  "stacklog"."updatedAt",
                  "stacklog"."orderDate"
        from "UserStockLog" as stacklog
        left join "_User" as "U" on "stacklog"."user" = "U"."objectId"
        left join "UserLeagueLevel" as "ULL" on "stacklog"."userLeagueLevel" = "ULL"."objectId"
             )as "log"
        group by "log"."user","log"."orderID"       
        `
        this.http.post(this.baseurl, { sql: sql }).subscribe((res: any) => {
            console.log(res.data)
            this.filterData(res.data, 'missing')
        });
    }


    filterData(data, type){
        let now = new Date()
        let month = now.getMonth() +1
        let day = now.getDate()
        let year = now.getFullYear()
        let missinglog  = []
        let log = []
        data.forEach(d => {
            let diffmonth
            let difflog
            if(d.firstyear == year) {
                diffmonth = Number(month+1) - Number(d.firstmonth)
            } else {
                diffmonth = (Number(month +1 + 12)) - Number(d.firstmonth)
            }
            d['diffmonth'] = diffmonth
            if(!d.iscreated && !d.isdone) {
                difflog = diffmonth - Number(d.totalcount)
                if(d.day > day ) {
                    difflog -=  1
                }
                if(difflog > 0) {
                    d['difflog'] = difflog
                    missinglog.push(d)
                }    
            }
            log.push(d)
        })
        if(type == 'missing') {
            this.missingLogs = missinglog
        }
        if(type == 'all') {
            this.logs = log
        }
    }

    allLog() {
        this.type = 'all'
        this.queryStockLog()
    }

    createBasicMessage(type, msg): void {
        this.message.create(type, msg);
    }


    handleCancel() {
        this.isVisible = false
    }
    handleOk() {
        this.creatStock(this.currentStock)
    }

    search() {
        let filterData = []
        // 只有OrderID
        if (!this.orderID && !this.mobile && !this.inviteMobile) {
            return
        }
        if (this.orderID && !this.mobile && !this.inviteMobile) {
            filterData = this.logs.filter((item) => {
                if (item.orderID) {
                    return item.orderID.search(this.orderID) != -1;
                }
            });
            console.log(filterData)
        }
        // mobile
        if (!this.orderID && this.mobile && !this.inviteMobile) {
            filterData = this.logs.filter((item) => {
                if (item.mobile) {
                    return item.mobile.search(this.mobile) != -1;
                }
            });
        }
        // inviteMobile
        if (!this.orderID && !this.mobile && this.inviteMobile) {
            filterData = this.logs.filter((item) => {
                if (item.inviteMobile) {
                    return item.mobile.search(this.inviteMobile) != -1;
                }
            });
        }
        // orderID mobile
        if (this.orderID && this.mobile && !this.inviteMobile) {
            filterData = this.logs.filter((item) => {
                if (item.orderID && item.mobile) {
                    return (item.orderID.search(this.orderID) != -1) && (item.mobile.search(this.mobile) != -1);
                }
            });
        }
        // orderID mobile inviteMobile
        if (this.orderID && this.mobile && this.inviteMobile) {
            filterData = this.logs.filter((item) => {
                if (item.orderID && item.mobile && item.inviteMobile) {
                    return (item.orderID.search(this.orderID) != -1) && (item.mobile.search(this.mobile) != -1) && (item.inviteMobile.search(this.inviteMobile) != -1);
                }
            });
        }
        // orderID  inviteMobile
        if (this.orderID && !this.mobile && this.inviteMobile) {
            filterData = this.logs.filter((item) => {
                if (item.orderID && item.mobile) {
                    return (item.orderID.search(this.orderID) != -1) && (item.inviteMobile.search(this.inviteMobile) != -1);
                }
            });
        }
        // inviteMobile
        if (!this.orderID && !this.mobile && this.inviteMobile) {
            filterData = this.logs.filter((item) => {
                if (item.orderID && item.mobile) {
                    return item.inviteMobile.search(this.inviteMobile) != -1;
                }
            });
        }
        this.logs = filterData
    }

    reset() {
        if (this.type == 'all') {
            this.allLog()
            console.log(111)
        }
        if (this.type == 'today') {
            this.todayLog()
        }
    }
    // 查询遗漏订单
}
