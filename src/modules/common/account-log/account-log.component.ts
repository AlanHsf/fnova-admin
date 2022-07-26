import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as Parse from "parse";

interface DataItem {
  orderNum: number;
  count: number;
  price: number;
  totalPrice: number;
  status: number;

}
@Component({
  selector: 'app-account-log',
  templateUrl: './account-log.component.html',
  styleUrls: ['./account-log.component.scss']
})
export class AccountLogComponent implements OnInit {
  public orderNumber:number;
  public isVisible = false;
  public isOkLoading = false;

  public company: string;  //公司
  public listOfData: any = []
  pageIndex: number = 0;
  public currentItem: any = null

  
// 创建accountLog   // AccountLog 
// 订单编号 orderNumber  
// 订单类型 orderType，
// 支付类型  assetType 微信， 支付宝，余额，积分
// 支付账号fromAccount  => Account => User  ?  User,nickname  : fromName 
// 到账账号 targetAccount  => Account => User ? User,nickname : targetName
// 订单金额 assetCount 
// 订单备注 desc
// 交易时间 createdAt 
  listOfColumn = [
    {
      title: '订单编号',
      compare: null,
      priority: false
    },
    {
      title: '订单类型',
      compare: null,
      priority: false
    },
    {
      title: '支付类型',
      compare: null,
      priority: false
    },
    {
      title: '支付账号',
      compare: null,
      priority: false
    },
    {
      title: '到账账号',
      compare: null,
      priority: false
    },
    {
      title: '订单金额',
      compare: null,
      priority: false
    },
    {
      title: '订单备注',
      compare: null,
      priority: false
    },
    {
      title: '交易时间 ',
      compare: null,
      priority: false
    },
  ];
  pageSize: number = 20
  totalOrder: number = 0
  checked:boolean = true
  isLoading:boolean = true
  constructor(private modalService: NzModalService, private notification: NzNotificationService) { }
  log(value: string[]): void {
    console.log(value);
  }
  queryUserInfo(){
    //查询订单号
    if(this.orderNumber) {
      this.queryGoods()
    }
  }
  edit(item): void {
    this.currentItem = item;
    this.isVisible = true;
    console.log(item)
  }
  handleOk(): void {
   console.log('handleOk')
   this.isVisible = false;
    if (!this.isVisible) {
      this.currentItem = null;
    }
  }
  handleCancel(): void {
    console.log('handleCancel')
    this.isVisible = false;
    if (!this.isVisible) {
      this.currentItem = null;
    }
  }
  async ngOnInit() {
    // 公司id
    this.company = localStorage.getItem('company')
    await this.queryGoods()
  }
  callback(key) {
    console.log(key);
  }

  async pageChange(e) {
    console.log(e)
    this.pageIndex = e -1 ;
    console.log(e,'6666')
    this.queryGoods()

  }

  //全部商品
  async queryGoods() {
    let AccountLog = new Parse.Query("AccountLog");
    // AccountLog.include('fromAccount');
    AccountLog.include('fromAccount.user');
    // AccountLog.include('targetAccount');
    AccountLog.include('targetAccount.user.nickname');
    AccountLog.include('fromAccount.user.nickname');
    AccountLog.equalTo('company', this.company);
    if(this.orderNumber) {
      AccountLog.equalTo('orderNumber',this.orderNumber);
    }
    let count = await AccountLog.count()
    AccountLog.limit(20)
    AccountLog.skip(this.pageIndex * this.pageSize)
    let accountLog = await AccountLog.find()
    this.totalOrder = count
    let shopJSON = []
    accountLog.forEach(shop => {
      let log = shop.toJSON();
      shopJSON.push(log)
    })
    this.listOfData = shopJSON
    console.log(shopJSON)
    }

  //查询支付账号的User

}
