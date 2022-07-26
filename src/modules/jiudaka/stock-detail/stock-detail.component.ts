import { Component, OnInit } from '@angular/core';

import  {ActivatedRoute} from '@angular/router'
import { uid } from 'gantt';
import * as Parse from 'parse'
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {

    constructor(    
            private activeRoute: ActivatedRoute,
            private message: NzMessageService
        ) {
        this.company = localStorage.getItem('company')
     }
    company:any
    logs:any = []
    ngOnInit() {
        this.activeRoute.paramMap.subscribe(async params => {
            console.log(params)
            let uid = params.get('uid') ? params.get('uid') : ''
            let orderID = params.get('orderID') ? params.get('orderID') : ''
            this.queryStocks(uid, orderID)
        })     
    }
    async queryStocks(uid?, orderID?) {
        let UserStockLog = new Parse.Query('UserStockLog')
        UserStockLog.equalTo('company', this.company)
        UserStockLog.descending('createdAt')
        if(uid) {
            UserStockLog.equalTo('user', uid)
        }
        if(orderID) {
            UserStockLog.equalTo('orderID', orderID)
        }
        
        UserStockLog.include('user')
        UserStockLog.include('userLeagueLevel')
        UserStockLog.include('invite')
        UserStockLog.limit(20000)
        let logs = await UserStockLog.find()
        this.logs = logs
    }

    async confirmIscross(data) {
        console.log(data)
        let id = data.id
        let UserStockLog = new Parse.Query('UserStockLog')
        let log = await UserStockLog.get(id)
        if(log && log.id) {
            log.set('isCross', true)
            log.save().then(res => {
                if(res && res.id) {
                    data = res
                    this.isVisible = false
                    this.createBasicMessage('success','审核成功')
                } else {
                    this.createBasicMessage('error','审核失败')
                }
            })
        }
    }

    isVisible:boolean = false
    currentStock:any
    confirm(data) {
        this.isVisible = true
        this.currentStock = data
    }
    deleteData:any
    isDelete:boolean = false
    delete(data){
        this.isDelete =true
        this.deleteData = data
    }

    handleCancel(){
        this.isVisible = false
        this.currentStock = null
    }
    handleOk() {
        this.confirmIscross(this.currentStock)
    }
    

    createBasicMessage(type,msg): void {
        this.message.create(type,msg);
    }
    deleteCancel() {
        this.deleteCancel = null
        this.isDelete = false
    }
    async confirmDelte() {
        let id = this.deleteData.id
        let UserStockLog = new Parse.Query('UserStockLog')
        let log = await UserStockLog.get(id)
        if(log && log.id) {
            log.destroy().then(res => {
                this.queryStocks()
                this.isDelete = false
                this.createBasicMessage('success', '删除成功')
            }).catch(err => {
                this.createBasicMessage('err', '删除失败')
            })
        }
    }
}
