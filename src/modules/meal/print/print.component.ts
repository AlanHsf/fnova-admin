import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Parse from "parse"
import {  addNum } from "../server/count"
interface SearchItem {
  value: string,
  label: string
}
@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {

  @ViewChild("content") content;
  company = localStorage.getItem("company")
  orders: Array<any> = []
  selected = {
    value: 'name',
    label: '姓名'
  }
  displayedColumns: Array<SearchItem> = [
    {
      value: 'name',
      label: '姓名'
    },
    {
      value: 'mobile',
      label: '手机号'
    },
  ]
  searchInputText: string = ''
  dateOne: Array<any> = [];
  checkOptionsOne = [
    { label: '爱心老人', value: 'benefit', checked: true },
    { label: '普通会员', value: 'user' },
  ];
  name: string = ''
  mobile: string = ''
  startTime: string = '2022-1-1'
  endTime: string
  loading: boolean = false
  switchValue:boolean
  price:number = 0
  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loading = true
    let data = new Date(+ new Date().getTime() + 1000 * 60 * 60 * 24)
    this.endTime = this.formatDate(data)
    console.log(this.endTime);
    this.getFoodOrder()
  }

  formatDate(data: Date) {
    let year = data.getFullYear()
    let mon = data.getMonth() + 1
    let day = data.getDate()
    return `${year}-${mon}-${day}`
  }

  async getFoodOrder() {
    this.price = 0
    let types = this.checkOptionsOne.filter(item => item.checked)
    console.log(types);
    let strQl = '()'
    types.forEach((item, index) => {
      if (index < 1) {
        strQl = `${strQl.slice(0, 1)} pf."identyType" = '${item.value}' ${strQl.slice(-1)}`
      } else {
        strQl = `${strQl.slice(0, strQl.length - 2)} or pf."identyType" = '${item.value}' ${strQl.slice(-1)}`
      }
    })
    console.log(strQl, this.mobile, this.name, this.startTime, this.endTime);
    let sql = `SELECT fd."objectId" as id,fd."createdAt",fd.price,fd.address,fd."specMap",
      fd.post,fd."totalPrice",fd.discount,fd."orderImg",fd."tradeNo",
      pf.name,pf.mobile,pf.idcard,pf."identyType",pf.address,fd.foods,
      (ps.name) as post
      FROM "FoodOrder" as fd 
      join "Profile" as pf
      on fd."profile" = pf."objectId"
      left join "PostStation" as ps
      on ps."objectId" = fd.post
      WHERE fd.company = '${this.company}'
      ${types.length > 0 ? 'and' + strQl : ''}
      and pf.mobile like '${this.mobile}%'
      and pf.name like '%${this.name}%'
      and fd."createdAt" >= '${this.startTime}'
      and fd."createdAt" <= '${this.endTime}'
      and fd.foods is not null
      order by fd."createdAt" desc
      `
    console.log(sql);
    let that = this
    this.http.post('https://server.fmode.cn/api/novaql/select', { sql: sql })
      .subscribe(async response => {
        let res: any = response
        if (res.code == 200) {
          for (let index = 0; index < res.data.length; index++) {
            console.log(this.price,res.data[index].price)
            this.price = addNum(this.price,res.data[index].price)
            let fd = res.data[index].foods
            for (let i = 0; i < fd.length; i++) {
              const f = res.data[index].foods[i]
              let query = new Parse.Query("FoodSet")
              query.select("name")
              let forder = await query.get(f.objectId)
              let d = forder.toJSON()
              res.data[index].foods[i].name = d.name
              console.log(forder)
            }
          }
          console.log(res.data);
          that.orders = res.data
          that.loading = false
        }
    })
  }

  print() {
    console.log(123);
    let newChild = document.getElementsByClassName('content')[0]; //获取打印内容节点
    let newStr = newChild.innerHTML; //获取打印内容
    let pageStr = document.body.innerHTML; //保存原页面

    // let newWindow = window.open()
    // newWindow.document.title = "我要打印一些东西";
    // newWindow.document.body.innerHTML = pageStr;
    // newWindow.print(); //打印
    // newWindow.close()

    let body = document.getElementsByTagName('body')[0]
    let DomFirstChild: any = body.firstChild
    DomFirstChild.nextElementSibling.style.display = 'none'
    let cloneChild = newChild.cloneNode(true) //克隆打印节点
    body.appendChild(cloneChild)
    window.print(); //打印
    window.close()
    body.removeChild(cloneChild)
    DomFirstChild.nextElementSibling.style.display = 'unset'

    // document.body.innerHTML = newStr; //用打印区域替换原页面
    // document.body.innerHTML = pageStr; //还原页面
  }

  searchColNameChange(e) {
    this.selected = e
  }

  searchInputChange(e) {
    console.log(this.searchInputText)
  }

  onChangeOne(result: Date[]) {
    if (result.length < 2) {
      let data = new Date(+ new Date().getTime() + 1000 * 60 * 60 * 24)
      this.startTime = '2022-1-1'
      this.endTime = this.formatDate(data)
      return
    }
    this.startTime = this.formatDate(result[0])
    this.endTime = this.formatDate(result[1])
  }

  log(value: object[]): void {
    console.log(this.checkOptionsOne);
  }

  //精准查询
  onSelect() {
    this.loading = true
    this.name = ''
    this.mobile = ''
    this[this.selected.value] = this.searchInputText
    console.log('name:', this.name, 'mobile:', this.mobile);
    this.getFoodOrder()
  }
}
