import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ParseService } from '../service/parse.service';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Parse from "parse";
import { formatDate } from 'jscharting';
@Component({
  selector: 'app-shop-dashboard',
  templateUrl: './shop-dashboard.component.html',
  styleUrls: ['./shop-dashboard.component.scss']
})
export class ShopDashboardComponent implements OnInit {
  active = 0;
  company: string;
  pageIndex: number = 1;
  pageSize: number = 12;
  total: number = 0;
  price: number = 0;
  loading: boolean = true;
  shops: Array<any>;
  list: Array<any>;
  year: any = 0
  month: any = 0
  date: any
  startTime: string = '';
  dayArr: any = []
  type: Array<any> = [
    {
      name: '餐饮',
      value: 'catering'
    },
    {
      name: '民宿',
      value: 'stay'
    },
    {
      name: '商超',
      value: 'shop'
    },
  ];

  selectedType: string = '';
  pageSizeOptions: Array<any> = []
  today: Date;
  constructor(private http: HttpClient, private parseServ: ParseService, private message: NzMessageService, private router: Router) { this.company = localStorage.getItem("company") }

  ngOnInit(): void {
    let d = new Date();
    this.date = d
    let data = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
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
    let startTime = this.year + "-" + this.month + "-" + day + " 00:00:00"
    console.log(this.startTime);
    
    this.getCount()
    this.today = new Date();
    this.getShopsData()
    // this.gettime(startTime)
    this.pageSizeOptions = [...new Array(5).keys()].map((item, index) => { return this.pageSize * (index + 1) })
    console.log(this.pageSizeOptions);
    // this.getShopsOrderOverview(pageIndex, pageSize, type, startTime)
  }
  getCurrentDate(date) {
    formatDate(date, 'yyyy-MM-dd');
    console.log(formatDate);
  }
  typeChange(): void {
    this.pageIndex = 1;
    this.getCount()
    this.getShopsData()
  }
  getCount() {
    this.parseServ.getShopCount(this.selectedType).subscribe(res => {
      if (res['code'] != 200) {
        this.message.info("网络繁忙，数据获取失败,正在重试")
        setTimeout(() => {
          return this.parseServ.getShopCount(this.selectedType)
        }, 2000)
      }
      this.total = res['data'][0].count
      console.log(this.total);
    })

  }
  
  getShopsData() {
    this.parseServ.getShopsOrderOverview(this.pageIndex, this.pageSize, this.selectedType).subscribe(res => {
      console.log(res);

      if (res['code'] != 200) {
        return this.message.info("网络繁忙，数据获取失败")
      }
      console.log(res['data']);
      this.loading = false;
      this.shops = res['data']
    })

  }
  // async gettime(startTime) {
  //   console.log(startTime);
  //   (await (this.parseServ.gettime(this.pageIndex, this.pageSize, this.type, startTime))).subscribe(res => {
  //     console.log(res);

  //     if (res['code'] != 200) {
  //       return this.message.info("网络繁忙，数据获取失败")
  //     }
  //     console.log(res['data']);
  //     this.loading = false;
     
  //   })

  // }
 

  httpSql(sql, params = []) {
    let baseurl = "https://server.fmode.cn/api/novaql/select";
    return this.http.post(baseurl, { sql: sql, ...params })
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
  more(id) {
    this.router.navigate(['/common/manage/ShopOrder', { "equalTo": `shopStore:${id}` }])
  }
  pageSizeChange() {
    this.pageIndex = 1;
    this.getShopsData()
  }
}
