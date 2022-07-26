import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as Parse from "parse"
var time

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  company = localStorage.getItem("company")
  prices: number
  date: any
  authPrice: number
  vipPrices: number
  Carve_up: number
  now_prices:number
  now_vipPrices:number
  now_authPrice:number


  ngOnInit() {
    time = setInterval(() => {
      this.date = new Date();
    }, 1000)
    this.getTrade()
    this.getUA()
  }

  ngOnDestroy(): void {
    clearInterval(time);
  }


  getTrade() {
    let sql = `select sum("totalPrice") as prices,
    (select sum("price") as prices from "LoveAuthLog"
    where "company" = '5zJu7Mxs4Q' and "isPay" is true) as authprice
    from "ShopOrder"
    where "company" = '${this.company}' and "isPay" is true
    `
    let that = this
    this.http.post('https://server.fmode.cn/api/novaql/select', { sql: sql })
      .subscribe(response => {
        let res: any = response
        if (res.code == 200) {
          console.log(res);
          that.prices = Number((that.addNum(res.data[0].prices, res.data[0].authprice)).toFixed(2))
          console.log(that.prices);
          that.vipPrices = res.data[0].prices
          that.authPrice = res.data[0].authprice
        }
      })
     
     let sql2 = `select sum("totalPrice") as prices,
     (select sum("price") as prices from "LoveAuthLog" where 
     "company" = '${this.company}' and "isPay" is true 
     and to_date("createdAt"::text,'yyyy-mm-dd')=current_date) as authprice
     from "ShopOrder"
     where "company" = '${this.company}' and "isPay" is true
     and to_date("createdAt"::text,'yyyy-mm-dd')=current_date` 
     this.http.post('https://server.fmode.cn/api/novaql/select', { sql: sql2 })
     .subscribe(response => {
       let res: any = response
       if (res.code == 200) {
         console.log(res);
         that.now_prices = Number((that.addNum(res.data[0].prices || 0, res.data[0].authprice || 0)).toFixed(2))
         console.log(that.prices);
         that.now_vipPrices = res.data[0].prices | 0
         that.now_authPrice = res.data[0].authprice | 0
       }
     })
  }

  //获取红娘分销
  getUA() {
    let sql = `select "objectId" as id,nickname,
    (select name from "UserAgentLevel" as ua where "_User"."agentLevel" = ua."objectId" ) as name
    from "_User" where "company" = '${this.company}' and "agentLevel" is not null`
    this.http.post('https://server.fmode.cn/api/novaql/select', { sql: sql }).subscribe((res: any) => {
      let that = this
      if (res.code == 200) {
        console.log(res.data);
        if (res.data.length > 0) {
          let arr = res.data
          let distribution = 0
          Promise.all(arr.map(async item => {
            await new Promise((resolve,rejcet)=>{
              this.http.post('https://server.fmode.cn/api/user/agent/income/shop', { uid: item.id })
              .subscribe((response: any) => {
                console.log(response);
                if(response && response.total){
                  distribution = Number(that.addNum(distribution, response.total).toFixed(2))
                }
                resolve(true)
              })
            })
            
          })).then(()=>{
            that.Carve_up = distribution
          })
        }
      }
    })

  }

  addNum(n1, n2) {
    var s1, s2, m;
    try {
      s1 = n1.toString().split(".")[1].length;
    }
    catch (e) {
      s1 = 0;
    }
    try {
      s2 = n2.toString().split(".")[1].length;
    }
    catch (e) {
      s2 = 0;
    }
    m = Math.pow(10, Math.max(s1, s2));
    return (n1 * m + n2 * m) / m;
  }

  accAdd(arg1, arg2) {
    let num1_befor = String(arg1).split('.')[0]
    let num1_atr = String(arg1).split('.')[1]
    let allNum1 = num1_befor + num1_atr
    if (num1_atr.length < 2) {
      allNum1 = num1_befor + num1_atr + '0'
    }

    let num2_befor = String(arg2).split('.')[0]
    let num2_atr = String(arg2).split('.')[1]
    let allNum2 = num2_befor + num2_atr
    if (num2_atr.length < 2) {
      allNum2 = num1_befor + num1_atr + '0'
    }

    let integer = Number(allNum1) + Number(allNum2)
    return Number(integer / 100)
  }

}
