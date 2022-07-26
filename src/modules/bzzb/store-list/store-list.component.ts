import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from "@angular/router";
import * as Parse from "parse"

@Component({
	selector: 'app-store-list',
	templateUrl: './store-list.component.html',
	styleUrls: ['./store-list.component.scss']
})
export class StoreListComponent implements OnInit {

	constructor(private http: HttpClient, private message: NzMessageService, public router: Router) { }
	pageIndex: number = 1;
	pageSize: number = 8;
	total: number = 0;
	loading: boolean = true;
	stores: Array<any>;
	company: string = ''
	pageSizeOptions:Array<any> =  [8, 12, 16, 20]
	async ngOnInit() {
		this.company = localStorage.getItem('company')
		await this.getCounts()
		await this.getStores()
	}


	async getStores() {
		let sql = `select "store"."objectId", "store"."storeName", "store"."cover",  "store"."mobile"  ,"S"."count",
		"S"."totalPrice", "user"."userCount"
      from "ShopStore" as "store"
      left join (select max("store") as "store", count('objectId') as "count", sum("totalPrice") as "totalPrice" from "Order"
      where "company" = '${this.company}' and  "type"='goods'
      group by "store") as "S" on "S"."store" = "store"."objectId"
	  left join (select max("store") as "store", count("objectId") as "userCount" from "_User"
	  where "agentLevel" is not null
	group by "store"
) as "user" on "user"."store" = "store"."objectId"
      where  "store"."company" = 'rg4LL7toNt'
      order by "S"."count" desc  offset ${(this.pageIndex - 1) * this.pageSize}  limit ${this.pageSize}`
	  let data = await this.novaSql(sql)
	  console.log(data)
	  if(data && data.length > 0) {
		  this.stores = data
		  for(let i = 0; i < this.stores.length ; i++){
			let earnings = await this.StoreEarnings(this.stores[i].objectId)
			this.stores[i].earnings = earnings
		  }

	  }
	  this.loading = false;

	}


	async StoreEarnings(id) {
		let sql = `select SUM(("incomeMapStore" -> '${id}' -> 'store-vip')::float) as "vip",
		SUM(("incomeMapStore" -> '${id}' -> 'store-wxpay')::float) as "wxpay",
		SUM(("incomeMapStore" -> '${id}' ->'store-balance-2200')::float) as "balance2200",
		SUM(("incomeMapStore" -> '${id}' -> 'store-balance-6900')::float) as "balance6900",
		SUM(("incomeMapStore" -> '${id}' -> 'store-balance-26000')::float) as "balance26000"
		from "Order"
		where company = '${this.company}' and "store" = '${id}' and "type"= 'goods' or "type" ='vip' and "status" <> '100' and "status" <> '700' and
		("incomeMapStore" -> '${id}') IS NOT NULL;`
		let data = await this.novaSql(sql)
		if(data && data.length > 0) {
			let eKey = Object.keys(data[0])
			let earningsc = 0
			eKey.forEach(key => {
				earningsc += data[0][key] ? Number(data[0][key]) :0
			})
			return earningsc
		}else {
			return 0
		}
	}

	async getCounts() {
		let Store = new Parse.Query('ShopStore')
		Store.equalTo('company', this.company)
		let count = await Store.count()
		this.total = count
	}

	toOrder(storeid) {

		this.router.navigate(["common/goods-order", {
			rid: 'hSJrTRbcm7',
			equalTo:'type:goods',
			storeid: storeid
		}])
	}

	toVip(sid) {
		this.router.navigate(["common/manage/_User", {
			rid: 'hSJrTRbcm7',
			equlaTo:"type:user",
			PclassName:"ShopStore",
			PobjectId:sid,
			notEqualTo:'agentLevel:undefined'
		}])
	}



	async pageSizeChange() {
		this.pageIndex = 1;
		await this.getStores()
	}

	async pageIndexChange() {
		this.getStores()
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
}
