import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from "@angular/router";
import * as Parse from "parse"
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {

  constructor(private http: HttpClient, private message: NzMessageService, public router: Router, private i18n: NzI18nService) { }
  company: string = '';
  storeCount: Number = 0;
  DepartmentCount: Number = 0;
  ProfileCount: Number = 0;
  UserCount: Number = 0;
  year: any = 0
  month: any = 0
  date: any
  dayArr: any = []
  total: Number = 0.00
  completeOrder: Number = 0;
  undoneOrder: Number = 0;
  storeList: any = [];
  workList: any = [];
  async ngOnInit() {
    this.company = localStorage.getItem('company')
    let d = new Date();
    this.date = d
    let data = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    let day = data.getDate();
    this.year = d.getFullYear()
    this.month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)
    let dayArr = []
    for (let i = 0; i < day; i++) {
      if (i < 9) {
        dayArr.push("0" + (i + 1))
      } else {
        dayArr.push((i + 1))
      }

    }
    this.dayArr = dayArr
    let startTime = this.year + "-" + this.month + "-" + "01" + " 00:00:00"
    let endTime = this.year + "-" + this.month + "-" + dayArr.length + " 23:59:57"
    this.getShopStore()
    this.getDepartment()
    this.getProfile()
    this.getUser()
    await this.getTotal(startTime, endTime)
    await this.getcompleteOrder(startTime, endTime)
    await this.getStoreRate(startTime, endTime)
    await this.getWorkOrder(startTime, endTime)
  }
  async onChange(e) {
    console.log(e)
    let data = new Date(e.getFullYear(), e.getMonth() + 1, 0);
    let day = data.getDate();
    this.year = e.getFullYear()
    this.month = e.getMonth() + 1 > 9 ? e.getMonth() + 1 : "0" + (e.getMonth() + 1)
    let dayArr = []
    for (let i = 0; i < day; i++) {
      if (i < 9) {
        dayArr.push("0" + (i + 1))
      } else {
        dayArr.push((i + 1))
      }

    }
    this.dayArr = dayArr
    let startTime = this.year + "-" + this.month + "-" + "01" + " 00:00:00"
    let endTime = this.year + "-" + this.month + "-" + dayArr.length + " 23:59:57"
    await this.getTotal(startTime, endTime)
    await this.getcompleteOrder(startTime, endTime)
    await this.getStoreRate(startTime, endTime)
    await this.getWorkOrder(startTime, endTime)
  }
  async getShopStore() {
    let Store = new Parse.Query('ShopStore')
    Store.equalTo('company', this.company)
    // Store.equalTo('isVerified',true)
    let storeCount = await Store.count()
    this.storeCount = storeCount
  }
  async getDepartment() {
    let Department = new Parse.Query('Department')
    Department.equalTo('company', this.company)
    // Store.equalTo('isVerified',true)
    let DepartmentCount = await Department.count()
    this.DepartmentCount = DepartmentCount
  }
  async getProfile() {
    let Profile = new Parse.Query('Profile')
    Profile.equalTo('company', this.company)
    // Store.equalTo('isVerified',true)
    let ProfileCount = await Profile.count()
    this.ProfileCount = ProfileCount
  }
  async getUser() {
    let User = new Parse.Query('User')
    User.equalTo('company', this.company)
    // Store.equalTo('isVerified',true)
    let UserCount = await User.count()
    this.UserCount = UserCount
  }
  async getTotal(startTime, endTime) {
    let sql = `select sum("totalPrice") as "totalPrice" from "DecorateOrder" 
		where "company" = '${this.company}' and "status" > '700' 
		and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}'
		`
    let data = await this.novaSql(sql)
    if (data && data.length > 0) {
      this.total = data[0].totalPrice
    }
  
    
  }
  async getcompleteOrder(startTime, endTime) {
    let sql = `select count("objectId") as "count"from "DecorateOrder"
		where "company" = '${this.company}' and "status" = '800' 
		and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}'
		`
    let data = await this.novaSql(sql)
    console.log(data)
    if (data && data.length > 0) {
      console.log(data);
      this.completeOrder = data[0].count
    }
  }
  async getundoneOrder(startTime, endTime) {
    let sql = `select count('objectId') as "count", sum("totalPrice") as "totalPrice" from "DecorateOrder"
		where "company" = '${this.company}' and "status" < '400' 
		and "createdAt" > '${startTime}' and  "createdAt" < '${endTime}'
    `
    let data = await this.novaSql(sql)
    console.log(data)
    if (data && data.length > 0) {
      console.log(data);
      this.undoneOrder = data[0].count
    }
  }
  async getStoreRate(startTime, endTime) {
		let sql = `select max("S"."storeName") as "name" ,  count("O"."objectId") as "count", sum("O"."totalPrice") as "totalPrice"    from "DecorateOrder" as "O"
		left join "ShopStore" as "S" on "S"."objectId" = "O"."store" 
		where "O"."company" = '${this.company}'  and "O"."status"  <> '100'
		and "O"."createdAt" > '${startTime}' and  "O"."createdAt" < '${endTime}'
		group by "O"."store"
		order by "count"  desc 
		limit 10`
		let data = await this.novaSql(sql)
    console.log(data);
		if (data && data.length > 0) {
			this.storeList = data
		}
	}
  async getWorkOrder(startTime, endTime) {
		let sql = `select max("S"."name") as "name" ,  count("O"."objectId") as "count", sum("O"."salary") as "salary"    from "WorkOrder" as "O"
		left join "Profile" as "S" on "S"."objectId" = "O"."worker" 
		where "O"."company" = '${this.company}'  and "O"."status"  <> '100'
		and "O"."createdAt" > '${startTime}' and  "O"."createdAt" < '${endTime}'
		group by "O"."worker"
		order by "count"  desc 
		limit 10`
		let data = await this.novaSql(sql)
    console.log(data);
    
		if (data && data.length > 0) {
			this.workList = data
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
}
