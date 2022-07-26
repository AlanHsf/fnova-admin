import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from "@angular/router";

interface DataItem {
	fromAccount: string;
	targetAccount: string;
	orderNumber: string;
	assetType: string;
	orderType: string;
	assetCount: number;
	createdAt: string
}



@Component({
	selector: 'app-account-log',
	templateUrl: './account-log.component.html',
	styleUrls: ['./account-log.component.scss']
})
export class AccountLogComponent implements OnInit {

	constructor(private http: HttpClient, private message: NzMessageService, public router: Router) { }
	listOfColumn = [
		{
		  title: 'fromAccount',
		  value: '支出账户',
		  compare: null,
		  priority: false
		},
		{
		  title: 'targetAccount',
		  value: '到账账户',
		  compare: null,
		  priority: 3
		},
		{
		  title: 'orderNumber',
		  value: '订单编号',
		  compare: null
		},
		{
			title: 'assetType',
			value: '资金类型',
			compare: null
		},
		{
			title: 'orderType',
			value: '订单类型',
			compare: null
		},
		{
			title: 'assetCount',
			value: '资金金额',
			compare: null,
		},
		{
			title: 'createdAt',
			value: '订单时间',
			compare: null
		}
	];

	listOfData: DataItem[] = [
		
	];
	pageSize = 10 // 每页显示的数量
	pageIndex = 1 // 当前是第几页，当前是第一页
	total:any = 0
	async ngOnInit() {
		this.listOfData = await this.getLog()
	}
	async getLog() {
		let sql = `select "log"."objectId" as "lid",
			"log"."orderNumber" as "orderNumber",
			"log"."assetType" as "assetType",
			"log"."assetCount" as "assetCount",
			"log"."orderType" as "orderType",
			"log"."fromName" as "fromName",
			"log"."targetName" as "targetName",
			"log"."createdAt" as "createdAt",
			"fromAccount"."mobile" as "fmobile",
			"fromAccount"."nickname" as "fnickname",
			"fromAccount"."username" as "fusername",
			"targetAccount"."mobile" as "tmobile",
			"targetAccount"."nickname" as "tnickname",
			"targetAccount"."username" as "tusername"
		from "AccountLog"  as "log"
		left join (select "A"."objectId" as "account" , 
			"U"."mobile" as "mobile",
			"U"."nickname" as "nickname", 
			"U"."username" as "username",
			"U"."objectId" as "uid" from "Account" as "A"
		left join "_User" as "U"  on "U"."objectId" = "A"."user"
		where "U"."objectId" is not null) as "fromAccount" on "fromAccount"."account" = "log"."fromAccount"
		left join (select "A"."objectId" as "account" , 
			"U"."mobile" as "mobile",
			"U"."nickname" as "nickname", 
			"U"."username" as "username",
			"U"."objectId" as "uid" from "Account" as "A"
		left join "_User" as "U"  on "U"."objectId" = "A"."user"
		where "U"."objectId" is not null) as "targetAccount" on "targetAccount"."account" = "log"."targetAccount"
		where "company" = 'rg4LL7toNt'
		order by "log"."createdAt" desc
		 
		`
		let limitsql = `limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`
		let count = await this.novaSql(sql)
		if(count && count.length > 0) {
			this.total = count.length
		}
		let data = await this.novaSql(sql + limitsql)
		if(data && data.length > 0) {
			console.log(data)
			return data
		}else {
			return []
		}

	}

	async changeIndex(e) {
		console.log(e)
		this.pageIndex = e
		console.log(this.pageIndex)
		this.listOfData = await this.getLog()
	}


	novaSql(sql): Promise<any> {
		return new Promise((resolve, reject) => {
			let baseurl = "https://server.fmode.cn/api/novaql/select";
			this.http
				.post(baseurl, { sql: sql, })
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

	showFromName(data) {
		if(data.fmobile) {
			return data.fmobile
		}else if(data.fnickname) {
			return data.fnickname
		}else if(data.fusername) {
			return data.fusername
		}else if(data.fromName == 'system') {
			return "系统平台"
		}else {
			return "系统平台"
		}
	}

	showtargetName(data) {
		if(data.tmobile) {
			return data.tmobile
		}else if(data.tnickname) {
			return data.tnickname
		}else if(data.tusername) {
			return data.tusername
		}else if(data.targetName == 'system') {
			return "系统平台"
		}else {
			return "系统平台"
		}
	}

	showAssetType(data) {
		if(data.assetType == 'balance') {
			return "余额"
		}else if(data.assetType == 'wxpay') {
			return "微信支付"
		}else {
			return "其他"
		}
	}

	showOrderType(data) {
		if(data.orderType == 'recharge-balance') {
			return "余额充值余额"
		}else if(data.orderType == 'recharge-wxpay') {
			return "微信支付充值余额"
		}else if(data.orderType == 'shopgoods-balance') {
			return "余额支付购买商品"
		}else if(data.orderType == 'shopgoods-wxpay') {
			return "微信支付购买商品"
		}else if(data.orderType == 'vip-wxpay') {
			return "微信支付开通会员"
		}else if(data.orderType == 'vip-wxpay') {
			return "余额支付开通会员"
		}else {
			return "其他"
		}
	}

}
