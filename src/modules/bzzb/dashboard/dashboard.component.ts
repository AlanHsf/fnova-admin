import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from "@angular/router";
import * as Parse from "parse"

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	constructor(private http: HttpClient, private message: NzMessageService, public router: Router) { }
	sellOptions: any = {}
	vipCount: number = 0
	userCount: number = 0
	storeCount: number = 0
	goodsCount: number = 0
	year: any = 0
	month: any = 0
	date:any 
	total: number = 0.00
	goodsList: any = [
	]
	storeList: any = [
	]
	vipData: any = {
		count: 0,
		totalPrice: 0.00
	}
	goodsOrder: any = {
		count: 0,
		totalPrice: 0.00
	}
	returnOrder:any = {
		count: 0,
		totalPrice: 0.00
	}
	rechargeData: any = {
		count: 0,
		totalPrice: 0.00
	}
	dayArr:any = []
	company: string = ''
	async ngOnInit() {
		this.company = localStorage.getItem('company')
		let d = new Date();
		this.date = d
		let data = new Date(d.getFullYear(), d.getMonth() + 1, 0);
		let day = data.getDate();
		this.year = d.getFullYear()
		this.month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() +1)
		let dayArr = []
		for (let i = 0; i < day; i++) {
			if(i< 9) {
				dayArr.push( "0"+(i + 1))
			}else{
				dayArr.push((i + 1))
			}
			
		}
		this.dayArr = dayArr
		let startTime = this.year + "-" + this.month + "-" + "01" + " 00:00:00" 
		let endTime = this.year + "-" + this.month + "-" + dayArr.length + " 23:59:57" 
		await this.getUser()
		await this.getStore()
		await this.getGoods()


		await this.getTotal(startTime,endTime )
		await this.getEveryDay(startTime,endTime)
		await this.getRecharge(startTime, endTime)
		await this.getVipPrice(startTime, endTime)
		await this.getOrder(startTime, endTime)
		await this.getReturnOrder(startTime, endTime)
		await this.getGoodsRate(startTime, endTime)
		await this.getStoreRate(startTime, endTime)
	}

	async onChange(e) {
		console.log(e)
		let data = new Date(e.getFullYear(), e.getMonth() + 1, 0);
		let day = data.getDate();
		this.year = e.getFullYear()
		this.month = e.getMonth() + 1 > 9 ? e.getMonth() + 1 : "0" + (e.getMonth() +1)
		let dayArr = []
		for (let i = 0; i < day; i++) {
			if(i< 9) {
				dayArr.push( "0"+(i + 1))
			}else{
				dayArr.push((i + 1))
			}
			
		}
		this.dayArr = dayArr
		let startTime = this.year + "-" + this.month + "-" + "01" + " 00:00:00" 
		let endTime = this.year + "-" + this.month + "-" + dayArr.length + " 23:59:57" 
		
		await this.getTotal(startTime,endTime )
		await this.getEveryDay(startTime,endTime)
		await this.getRecharge(startTime, endTime)
		await this.getVipPrice(startTime, endTime)
		await this.getOrder(startTime, endTime)
		await this.getReturnOrder(startTime, endTime)
		await this.getGoodsRate(startTime, endTime)
		await this.getStoreRate(startTime, endTime)
		await this.getEveryDay(startTime, endTime)
	}
	async getUser() {
		let User = new Parse.Query('_User')
		User.equalTo('company', this.company)
		let userCount = await User.count()
		User.exists('agentLevel')
		let vipCount = await User.count()
		console.log(userCount, vipCount)
		this.userCount = userCount
		this.vipCount = vipCount
	}

	async getStore() {
		let Store = new Parse.Query('ShopStore')
		Store.equalTo('company', this.company)
		// Store.equalTo('isVerified',true)
		let storeCount = await Store.count()
		this.storeCount = storeCount
	}

	async getGoods() {
		let ShopGoods = new Parse.Query('ShopGoods')
		ShopGoods.equalTo('company', this.company)
		let goodsCount = await ShopGoods.count()
		this.goodsCount = goodsCount
	}
	// 总数，
	async getTotal(startTime, endTime) {
		let sql = `select sum("totalPrice") as "totalPrice" from "Order" 
		where "company" = '${this.company}' and "status" <> '100' 
		and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}'
		`
		let data = await this.novaSql(sql)
		if (data && data.length > 0) {
			this.total = data[0].totalPrice
		}
	}
	async getEveryDay(startTime, endTime){
		let sql = `select max("objectId"), to_char("createdAt", 'YYYY-MM-DD' ) as d , sum("totalPrice") as "totalPrice", count("objectId") as "totalCount" from "Order"
		where "type" = 'goods' and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}' and
		"company" = '${this.company}' and "status" <> '100' 
		group by d 
		order by d  asc
		`
		let data = await this.novaSql(sql)
		let dayTotalPrice = []
		let dayTotalCount = []
		this.dayArr.forEach(day => {
			let date = this.year + '-' + this.month + '-' + day
			if(data && data.length > 0) {
				let item = data.find(item => {
					if(date == item.d) {
						return true
					}
				})
				if(item) {
					dayTotalPrice.push(item.totalPrice ? item.totalPrice : 0)
					dayTotalCount.push(item.totalCount ? item.totalCount: 0)
				}else {
					dayTotalPrice.push(0)
					dayTotalCount.push(0)
				}
			}else {
				dayTotalPrice.push(0)
				dayTotalCount.push(0)
			}
		})
		this.sellOptions = {
			title: {
				text: '订单概况',
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['订单数量', '订单金额']
			},
			toolbox: {
				show: true,
				feature: {
					dataView: { show: true, readOnly: false },
					magicType: { show: true, type: ['line', 'bar'] },
					restore: { show: true },
					saveAsImage: { show: true }
				}
			},
			calculable: true,
			xAxis: [
				{
					type: 'category',
					data: this.dayArr
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: [
				{
					name: '订单数量',
					type: 'bar',
					data: dayTotalCount,
					markPoint: {
						data: [
							{ type: 'max', name: 'Max' },
							{ type: 'min', name: 'Min' }
						]
					},
					markLine: {
						data: [{ type: 'average', name: 'Avg' }]
					},
					itemStyle: {
						normal: {
							color: "#75b52f",

						}
					},
				},
				{
					name: '订单金额',
					type: 'bar',
					data: dayTotalPrice,
					markPoint: {
						data: [
							{ type: 'max', name: 'Max' },
							{ type: 'min', name: 'Min' }
						]
					},
					markLine: {
						data: [{ type: 'average', name: 'Avg' }]
					},
					itemStyle: {
						normal: {
							color: "#78b6f3",

						}
					},
				}
			]
		};
	}
	// 充值
	async getRecharge(startTime, endTime) {
		let sql = `select count("objectId") as "count", sum("totalPrice") as "totalPrice" from "Order"
		where "company" = '${this.company}' and "type" = 'recharge'
		and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}'
		`
		let data = await this.novaSql(sql)
		if (data && data.length > 0) {
			this.rechargeData = data[0]
		}
	}
	// 会员
	async getVipPrice(startTime, endTime) {
		let sql = `select count('objectId') as "count", sum("totalPrice") as "totalPrice" from "Order"
		where "company" = '${this.company}' and "type" = 'vip' 
		and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}'
		`
		let data = await this.novaSql(sql)
		if (data && data.length > 0) {
			this.vipData = data[0]
		}
	}


	async getOrder(startTime, endTime) {
		let sql = `select count("objectId") as "count", sum("totalPrice") as "totalPrice" from "Order"
		where "company" = '${this.company}' and "type" = 'goods' and "status"  <> '100'
		and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}'
		`
		let data = await this.novaSql(sql)
		if (data && data.length > 0) {
			this.goodsOrder = data[0]
		}
	}
	

	async getReturnOrder(startTime, endTime) {
		let sql = `select count("objectId") as "count", sum("totalPrice") as "totalPrice" from "Order"
		where "company" = '${this.company}' and "type" = 'goods' and "status"  = '700'
		and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}'
		`
		let data = await this.novaSql(sql)
		console.log(data)
		if (data && data.length > 0) {
			this.returnOrder = data[0]
		}
	}

	async getGoodsRate(startTime, endTime) {
		let sql = `select max("name") as "name" , sum("totalPrice") as "totalPrice", count("objectId") as "count"   from "Order"
		where "company" = '${this.company}' and "type" = 'goods' and "status"  <> '100'
		and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}'
		group by "targetObject"
		order by  "totalPrice" , "count"desc 
		limit 10`
		let data = await this.novaSql(sql)
		if (data && data.length > 0) {
			this.goodsList = data
		}
	}

	async getStoreRate(startTime, endTime) {
		let sql = `select max("S"."storeName") as "name" ,  count("O"."objectId") as "count", sum("O"."totalPrice") as "totalPrice"    from "Order" as "O"
		left join "ShopStore" as "S" on "S"."objectId" = "O"."store" 
		where "O"."company" = '${this.company}' and "O"."type" = 'goods' and "O"."status"  <> '100'
		and "O"."createdAt" > '${startTime}' and  "O"."createdAt" < '${endTime}'
		group by "O"."store"
		order by "count"  desc 
		limit 10`
		let data = await this.novaSql(sql)
		if (data && data.length > 0) {
			this.storeList = data
		}
	}
	

	novaSql(sql): Promise<any> {
		return new Promise((resolve, reject) => {
			let baseurl = "https://server.fmode.cn/api/novaql/select";
			this.http.post(baseurl, { sql: sql, })
				.subscribe(async (res: any) => {
					if (res.code == 200) {
						resolve(res.data)
					} else {
						this.message.info("网络繁忙，数据获取失败")
						reject(res)
					}
				})
		})
	}
	toUser() { 
		this.router.navigate(["common/manage/_User", {
		  rid: 'qeJCIizZyD',
		  equalTo: "type:user",
		}])
	}

	toVip() { 
		this.router.navigate(["common/manage/UserVip", {
		  rid: 'hSJrTRbcm7',
		}])
	}
	toStore() {
		this.router.navigate(["common/manage/ShopStore", {
			rid: 'Zhc5DkJujA',
		}])
	}
	toGoods() {
		this.router.navigate(["common/manage/ShopGoods", {
			rid: 'jv2xOuinwI',
			equalTo: "types:goods",
		}])
	}

	toRechar() {
		this.router.navigate(["common/manage/Order", {
			rid: 'ebagNTAwb2',
			equalTo: "type:recharge",
		}])
	}
	toVipOrder() {
		this.router.navigate(["common/manage/Order", {
			rid: 'Tm89DmeNXa',
			equalTo: "type:vip",
		}])
	}

	toGoodsOrder(){
		this.router.navigate(["common/goods-order", {
			rid: 'jRs0OqWkls',
			equalTo: "type:goods",
		}])
	}

}
