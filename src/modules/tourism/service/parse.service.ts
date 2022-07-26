import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse"
import { Observable } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
// select * from "ShopOrder" where "company"='sHNeVwSaAg'  and  to_date("createdAt"::text,'yyyy-mm-dd')=current_date
export class ParseService {
	company: string;
	constructor(private http: HttpClient, private message: NzMessageService) {
		this.company = localStorage.getItem("company")
		console.log(this.company);
	}

	/* 市级看板 旅客接待量 */
	async getCityPassengerData() {
		let sql = `select "C"."name" as "name", "C"."count" as "ccount", "Y"."count" as "ycount"
    from (select max("ShopStore"."storeName") as "name",count(*)  from  "RoomOrder"
      left join "ShopStore" on "ShopStore"."objectId" = "RoomOrder"."shopStore"
      left join "Company" on "ShopStore"."company" = "Company"."objectId"
        where  "Company"."company"='${this.company}'
        and "RoomOrder"."status" is not null
        and to_date("RoomOrder"."startTime"::text,'yyyy-mm-dd') <=current_date
        and to_date("RoomOrder"."endTime"::text,'yyyy-mm-dd') >=current_date
    group by "RoomOrder"."shopStore") as "C"
    full join
    (select max("ShopStore"."storeName") as "name",count(*)  from  "RoomOrder"
       left join "ShopStore" on "ShopStore"."objectId" = "RoomOrder"."shopStore"
      left join "Company" on "ShopStore"."company" = "Company"."objectId"
        where "Company"."company"='${this.company}'
        and "RoomOrder"."status" is not null
        and to_date("RoomOrder"."startTime"::text,'yyyy-mm-dd') <=current_date-1
        and to_date("RoomOrder"."endTime"::text,'yyyy-mm-dd') >=current_date-1
    group by "RoomOrder"."shopStore") as "Y" on "Y"."name" = "C"."name";`
		let data = await this.novaSql(sql)
		console.log(data);
		return data;
	}
	async getPassengerData() {
		let sql = `select "C"."name" as "name", "C"."count" as "ccount", "Y"."count" as "ycount"
    from (select max("ShopStore"."storeName") as "name",count(*)  from  "RoomOrder"
      left join "ShopStore" on "ShopStore"."objectId" = "RoomOrder"."shopStore"
        where  "RoomOrder"."company"='${this.company}'
        and "RoomOrder"."status" is not null
        and to_date("RoomOrder"."startTime"::text,'yyyy-mm-dd') <=current_date
        and to_date("RoomOrder"."endTime"::text,'yyyy-mm-dd') >=current_date
    group by "RoomOrder"."shopStore") as "C"
    full join
    (select max("ShopStore"."storeName") as "name",count(*)  from  "RoomOrder"
       left join "ShopStore" on "ShopStore"."objectId" = "RoomOrder"."shopStore"
        where  "RoomOrder"."company"='${this.company}'
        and "RoomOrder"."status" is not null
        and to_date("RoomOrder"."startTime"::text,'yyyy-mm-dd') <=current_date-1
        and to_date("RoomOrder"."endTime"::text,'yyyy-mm-dd') >=current_date-1
    group by "RoomOrder"."shopStore") as "Y" on "Y"."name" = "C"."name";`
		let data = await this.novaSql(sql)
		console.log(data);
		return data;
	}
	getPassengerMonitorData(pastday): Observable<any> {
		let company = this.company;
		return this.http.post(
			"https://test.fmode.cn/api/monitordata/travel-order-count",
			{ cid: company, pastday: pastday }
		).pipe(res => res)
	}
	/* 市级看板 年销售额 */
	async getCityYearsSalesData(year) {
		let sql = `select sum(a.sum),max(a.name) as "name",max(a.month) as "month" from (
      select sum("RoomOrder"."price"),"Department"."name",to_char("RoomOrder"."createdAt",'mm') as "month"  from  "RoomOrder"
      left join "ShopStore" on "ShopStore"."objectId"="RoomOrder"."shopStore"
      left join "Department" on "Department"."objectId"="ShopStore"."department"
      where "ShopStore"."company"='${this.company}' and to_char("RoomOrder"."createdAt",'yyyy')::int=${year}
      group by "Department"."name",to_char("RoomOrder"."createdAt",'mm')
      union all
      select sum("ShopOrder"."price"),"Department"."name",to_char("ShopOrder"."createdAt",'mm') as "month"  from  "ShopOrder"
      left join "ShopStore" on "ShopStore"."objectId"="ShopOrder"."shopStore"
      left join "Department" on "Department"."objectId"="ShopStore"."department"
      where "ShopStore"."company"='${this.company}' and to_char("ShopOrder"."createdAt",'yyyy')::int=${year}
      group by "Department"."name",to_char("ShopOrder"."createdAt",'mm')
      ) as a group by "name","month" `
		let data = await this.novaSql(sql)
		console.log(data);
		return data;
	}
	/* 年销售额 */
	async getYearsSalesData(year) {
		let sql = `select sum(a.sum),max(a.name) as "name",max(a.month) as "month" from (
    select sum("RoomOrder"."price"),"Department"."name",to_char("RoomOrder"."createdAt",'mm') as "month"  from  "RoomOrder"
    left join "ShopStore" on "ShopStore"."objectId"="RoomOrder"."shopStore"
    left join "Department" on "Department"."objectId"="ShopStore"."department"
    where "ShopStore"."company"='${this.company}' and to_char("RoomOrder"."createdAt",'yyyy')::int=${year}
    group by "Department"."name",to_char("RoomOrder"."createdAt",'mm')
    union all
    select sum("ShopOrder"."price"),"Department"."name",to_char("ShopOrder"."createdAt",'mm') as "month"  from  "ShopOrder"
    left join "ShopStore" on "ShopStore"."objectId"="ShopOrder"."shopStore"
    left join "Department" on "Department"."objectId"="ShopStore"."department"
    where "ShopStore"."company"='${this.company}' and to_char("ShopOrder"."createdAt",'yyyy')::int=${year}
    group by "Department"."name",to_char("ShopOrder"."createdAt",'mm')
    ) as a group by "name","month"`
		let data = await this.novaSql(sql)
		console.log(data);
		return data;
	}
	/* 市级看板 订单综合数据 */
	async getCityOrderAggregateData() {
		let sql = `select a."count",a."type" from ((select COUNT(*) as count, case "ShopStore"."type" when 'stay' then '民宿' end as "type"
     from "RoomOrder"
    left join "ShopStore" on "ShopStore"."objectId"="RoomOrder"."shopStore",
    (select * from "Company" where "company"='${this.company}')as company where company."objectId"="RoomOrder"."company"  and "RoomOrder"."status" is not null
     group by "ShopStore"."type"  )
    union all
    (select COUNT(*) as count, case "ShopStore"."type" when 'catering' then '餐饮' when 'shop' then '商超' end as "type"
     from "ShopOrder"
    left join "ShopStore" on "ShopStore"."objectId"="ShopOrder"."shopStore",
    (select * from "Company" where "company"='${this.company}')as company where company."objectId"="ShopOrder"."company" and "ShopOrder"."status" != 100
     group by "ShopStore"."type" ) )as  a `
		let data = await this.novaSql(sql)
		console.log(data);
		return data;
	}
	async getOrderAggregateData() {
		let sql = `select max(case when "type" ='catering' then '餐饮' else '民宿' end) as "type", 
		sum(case when "type" ='catering' then "count" else "roomCount" end ) as "count",
		sum(case when "type" = 'catering' then "totalPrice" else "roomTotalPrice" end ) as "totalPrice"
		from (select "objectId", "storeName","type",  
		case when "order"."count" is not null then "order"."count"  else 0 end   as "count", 
		case when "roomOrder"."count" is not null then "roomOrder"."count"  else 0 end   as "roomCount", 
		case when "order"."totalPrice" is not null then "order"."totalPrice"  else 0 end   as "totalPrice",
		case when "roomOrder"."totalPrice" is not null then "roomOrder"."totalPrice"  else 0 end   as "roomTotalPrice"
		from "ShopStore" as "store"
		left join (select max("shopStore") as "store", count("objectId") as "count", sum("price") as "totalPrice" from "ShopOrder" as "order"
		group by "shopStore") as "order" on "order"."store" = "store"."objectId"
		left join (select max("shopStore") as "store", count("objectId") as "count", sum("price") as "totalPrice" from "RoomOrder" as "order"
		
		group by "shopStore") as "roomOrder" on "roomOrder"."store" = "store"."objectId"
		
		where "company" = '${this.company}' and "type" <> 'shop'
		order by "count" desc, "roomCount" desc) as "totalOrder"
		group by "type"`
		
		
	// 	`select a."count",a."type" from ((select COUNT(*) as count,
    // case "ShopStore"."type" when 'stay' then '民宿' end as "type"
    //  from "RoomOrder"
    // left join "ShopStore" on "ShopStore"."objectId"="RoomOrder"."shopStore"
    // where "RoomOrder"."company"='${this.company}'  and "RoomOrder"."status" is not null
    //  group by "ShopStore"."type"  )
    // union all
    // (select COUNT(*) as count,
    // case "ShopStore"."type" when 'catering' then '餐饮' when 'shop' then '商超' end as "type"
    //  from "ShopOrder"
    // left join "ShopStore" on "ShopStore"."objectId"="ShopOrder"."shopStore"
    // where "ShopOrder"."company"='${this.company}' and "ShopOrder"."status" != 100
    //  group by "ShopStore"."type" ) )as  a `
		let data = await this.novaSql(sql)
		console.log(data);
		return data;
	}
	/* 市级看板 当日订单数据 */
	async getCityTodayOrdersData() {
		let sql = `(select "ShopStore"."storeName" as "name",
    case "ShopStore"."type" when 'stay' then '民宿' end as "type",
    "RoomOrder"."createdAt" from "RoomOrder"
    left join "ShopStore" on "ShopStore"."objectId"="RoomOrder"."shopStore",
    (select * from "Company" where "company"='${this.company}')as company where company."objectId"="RoomOrder"."company"
    and to_date("RoomOrder"."createdAt"::text,'yyyy-mm-dd')=current_date  and "RoomOrder"."status" is not null order by "RoomOrder"."createdAt" desc limit 2)
    union all
    (select "ShopStore"."storeName" as "name",
    case "ShopStore"."type" when 'catering' then '餐饮' when 'shop' then '商超' end as "type",
    "ShopOrder"."createdAt" from "ShopOrder"
    left join "ShopStore" on "ShopStore"."objectId"="ShopOrder"."shopStore",
    (select * from "Company" where "company"='${this.company}')as company where company."objectId"="ShopOrder"."company"
    -- 数据展示 临时注释 and to_date("ShopOrder"."createdAt"::text,'yyyy-mm-dd')=current_date  and "ShopOrder"."status" != 100 order by "ShopOrder"."createdAt" desc limit 2)
    `
		let data = await this.novaSql(sql)
		console.log(data);
		return data;
	}

	async getTodayOrdersData() {
		let sql = `select "order"."price", "store"."storeName", "order"."createdAt" from "ShopOrder" as "order"
		left join "ShopStore" as "store" on "store"."objectId" = "order"."shopStore"
		where "order"."company" = '${this.company}' and "order"."type" = 'meal'
		order by "createdAt" desc
		limit 50`
		let data = await this.novaSql(sql)
		return data;
	}

	/* 市级看板 各乡镇商户数数据 */
	async getCityMerchantsData() {
		let sql = `select count(*),max("Company"."name")
     from "ShopStore"
     left join "Company" on "Company"."objectId" = "ShopStore"."company"
     where "Company"."company"='${this.company}'
     group by "ShopStore"."company";`
		let data = await this.novaSql(sql)
		console.log(data);
		return data;
	}

	// 商户列表
	async getDepartMerchantsData() {
		let sql = `select "objectId", "storeName","type",  
		case when "order"."count" is not null then "order"."count"  else 0 end   as "count", 
		case when "roomOrder"."count" is not null then "roomOrder"."count"  else 0 end   as "roomCount", 
		case when "order"."totalPrice" is not null then "order"."totalPrice"  else 0 end   as "totalPrice",
		case when "roomOrder"."totalPrice" is not null then "roomOrder"."totalPrice"  else 0 end   as "roomTotalPrice"
		from "ShopStore" as "store"
		left join (select max("shopStore") as "store", count("objectId") as "count", sum("price") as "totalPrice" from "ShopOrder" as "order"
		group by "shopStore") as "order" on "order"."store" = "store"."objectId"
		left join (select max("shopStore") as "store", count("objectId") as "count", sum("price") as "totalPrice" from "RoomOrder" as "order"
		
		group by "shopStore") as "roomOrder" on "roomOrder"."store" = "store"."objectId"
		
		where "company" = '${this.company}' and "type" <> 'shop'
		order by "count" desc, "roomCount" desc`
		let data = await this.novaSql(sql)
		return data;
	}

	/* 店铺订单总览 */
	getShopsOrderOverview(pageIndex, pageSize, type) {
		

		let sql = `select
    max(row."objectId") as shopid,
    max(row."store") as store,
    max(row."type") as type,
    max(row."sum") as sumorder,
    max(row."cover") as cover,
    max( coalesce(row."sumprice",0) ) as sumprice -- coalesce(字段名,0) 该字段为空返回0
    from (
    (select
          store."objectId",max(store."storeName") as store ,max(store."cover") as cover ,
          max( case store."type"  when 'catering' then '餐饮' when 'shop'  then '商超' end) as type,
          count("ShopOrder"."objectId")as sum,sum("price")as sumprice
         from "ShopStore" as store
          left join "ShopOrder" on "ShopOrder"."shopStore"=store."objectId"
          where store."company"='${this.company}'   and  store."type" !='stay'  group by store."objectId" )
        union all
          (select
          store."objectId",max(store."storeName") as store ,max(store."cover") as cover ,
          max( case store."type" when 'stay' then '民宿' end) as type,
          count("RoomOrder"."objectId" )as sum,sum("price")as sumprice
        from "ShopStore" as store
          left join "RoomOrder" on "RoomOrder"."shopStore"=store."objectId"
          where store."company"='${this.company}' and  store."type" ='stay' group by store."objectId" )
    )as row   group by row."objectId",row."sum" order by row."sum" desc  offset ${(pageIndex - 1) * pageSize}  limit ${pageSize} ;`
		if (type == 'stay') {
			sql = `select
        store."objectId" as shopid,max(store."storeName") as store ,max(store."cover") as cover ,
        max( case store."type" when 'stay' then '民宿' end) as type,
        coalesce(count("RoomOrder"."objectId" ),0) as sumorder,sum(coalesce("price",0))  as sumprice
      from "ShopStore" as store
        left join "RoomOrder" on "RoomOrder"."shopStore"=store."objectId"
        where store."company"='${this.company}' and  store."type" ='stay' group by store."objectId"
        order by "sumorder" desc  offset ${(pageIndex - 1) * pageSize}  limit ${pageSize} `
		}
		if (type == 'shop' || type == 'catering') {
			sql = `select
      store."objectId" as shopid,max(store."storeName") as store ,max(store."cover") as cover ,
      max( case store."type"  when 'catering' then '餐饮' when 'shop'  then '商超' end) as type,
      coalesce(count("ShopOrder"."objectId" ),0) as sumorder, sum(coalesce("price",0))  as sumprice
     from "ShopStore" as store
      left join "ShopOrder" on "ShopOrder"."shopStore"=store."objectId"
      where store."company"='${this.company}'  and  store."type"='${type}'  group by store."objectId"
      order by "sumorder" desc  offset ${(pageIndex - 1) * pageSize}  limit ${pageSize} `
		}
		console.log(sql);
		return this.httpSql(sql).pipe(res => res)
	}
	async gettime(pageIndex, pageSize, type, startTime) {
		let sql = `select
		max(row."objectId") as shopid,
		max(row."store") as store,
		max(row."type") as type,
		max(row."sum") as sumorder,
		max(row."cover") as cover,
		max( coalesce(row."sumprice",0) ) as sumprice -- coalesce(字段名,0) 该字段为空返回0
		from (
		(select
			  store."objectId",max(store."storeName") as store ,max(store."cover") as cover ,
			  max( case store."type"  when 'catering' then '餐饮' when 'shop'  then '商超' end) as type,
			  count("ShopOrder"."objectId")as sum,sum("price")as sumprice
			 from "ShopStore" as store
			  left join "ShopOrder" on "ShopOrder"."shopStore"=store."objectId"
			  where store."company"='${this.company}' and store."createdAt" > '${startTime}' and  store."type" !='stay'  group by store."objectId" )
			union all
			  (select
			  store."objectId",max(store."storeName") as store ,max(store."cover") as cover ,
			  max( case store."type" when 'stay' then '民宿' end) as type,
			  count("RoomOrder"."objectId" )as sum,sum("price")as sumprice
			from "ShopStore" as store
			  left join "RoomOrder" on "RoomOrder"."shopStore"=store."objectId"
			  where store."company"='${this.company}' and  store."createdAt" > '${startTime}' and  store."type" ='stay' group by store."objectId" )
		)as row   group by row."objectId",row."sum" order by row."sum" desc  offset ${(pageIndex - 1) * pageSize}  limit ${pageSize} ;`
		if (type == 'stay') {
		  sql = `select
			store."objectId" as shopid,max(store."storeName") as store ,max(store."cover") as cover ,
			max( case store."type" when 'stay' then '民宿' end) as type,
			coalesce(count("RoomOrder"."objectId" ),0) as sumorder,sum(coalesce("price",0))  as sumprice
		  from "ShopStore" as store
			left join "RoomOrder" on "RoomOrder"."shopStore"=store."objectId"
			where store."company"='${this.company}' and  store."createdAt" > '${startTime}' and store."type" ='stay' group by store."objectId"
			order by "sumorder" desc  offset ${(pageIndex - 1) * pageSize}  limit ${pageSize} `
		}
		if (type == 'shop' || type == 'catering') {
		  sql = `select
		  store."objectId" as shopid,max(store."storeName") as store ,max(store."cover") as cover ,
		  max( case store."type"  when 'catering' then '餐饮' when 'shop'  then '商超' end) as type,
		  coalesce(count("ShopOrder"."objectId" ),0) as sumorder, sum(coalesce("price",0))  as sumprice
		 from "ShopStore" as store
		  left join "ShopOrder" on "ShopOrder"."shopStore"=store."objectId"
		  where store."company"='${this.company}' and store."createdAt" > '${startTime}' and  store."type"='${type}'  group by store."objectId"
		  order by "sumorder" desc  offset ${(pageIndex - 1) * pageSize}  limit ${pageSize} `
		}
		console.log(sql);
		return this.httpSql(sql).pipe(res => res)
	  }

	// 房间订单列表
	async getRoomOrder() {
		let sql = `select "order"."price", "store"."storeName", "order"."createdAt" from "RoomOrder" as "order"
		left join "ShopStore" as "store" on "store"."objectId" = "order"."shopStore"
		where "order"."company"='${this.company}'
		order by "createdAt" desc
		limit 50`
		let data = await this.novaSql(sql)
		return data
	}

	// 本月民宿营收
	async getMonthMealList(startTime, endTime) {
		let sql = `select to_char("createdAt", 'YYYY-MM-DD' ) as d,sum("price") as "totalPrice" from "ShopOrder" as "order"
		where "company"= 'sHNeVwSaAg' and "type" = 'meal' and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}' 
		group by d 
		order by d  asc`
		let data = await this.novaSql(sql)
		return data 
	}
	async getMonthRoomList(startTime, endTime) {
		let sql = `select to_char("createdAt", 'YYYY-MM-DD' ) as d,sum("price") as "totalPrice" from "RoomOrder" as "order"
		where "company"= 'sHNeVwSaAg' and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}' 
		group by d 
		order by d  asc`
		let data = await this.novaSql(sql)
		return data 
	}

	getShopCount(type) {
		let compSql = type ? ` and "type"='${type}'` : ''
		let sql = `select count(*) from "ShopStore" where "company"='${this.company}' ${compSql}`
		return this.httpSql(sql)
	}



	httpSql(sql, params = []) {
		let baseurl = "https://server.fmode.cn/api/novaql/select";
		return this.http.post(baseurl, { sql: sql, ...params })
	}


	novaSql(sql, params = []): Promise<any> {
		return new Promise((resolve, reject) => {
			let baseurl = "https://server.fmode.cn/api/novaql/select";
			this.http
				.post(baseurl, { sql: sql, ...params })
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

	async getDepartName() {
		let Depart = new Parse.Query("Department");
		Depart.equalTo("company", this.company)
		Depart.select("name")
		let departs = await Depart.find()
		departs = departs.map(depart => depart.get("name"))
		console.log(departs);
		return departs;
	}

	async getVillages() {
		let store = new Parse.Query("Department")
		store.equalTo("company", this.company)
		store.equalTo("type", "stay")
		let res = await store.find()
		return res;
	}




}
