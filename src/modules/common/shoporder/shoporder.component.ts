import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


import * as Parse from "parse";
interface DataItem {
  orderNum: number;
  count: number;
  price: number;
  totalPrice: number;
  status: number;

}

// 仅显示
// name 商品名称 orderNum 订单编号 price 实付金额 totalPrice 总金额
// isPay 支付状态  收货人姓名 收货地址 联系电话  createdAt 创建时间 updatedAt 更新时间 user => nickname购买用户
// 可修改
// status 订单状态 shipper 快递公司 trackingNumber 快递单号
@Component({
  selector: 'app-shoporder',
  templateUrl: './shoporder.component.html',
  styleUrls: ['./shoporder.component.scss']
})
export class ShoporderComponent implements OnInit {
  public width: any;
  public orderNumber:number
  public buyUser:string;
  public isVisible = false;
  public isOkLoading = false;
  public modelStatus:number;
  public company: string;  //公司
  public listOfData: any = []
  public pageIndex: number = 0;
  public currentItem: any = null;

//   待支付 100  支付成功 200   待发货  已发货 300 已送达 400 待退款 500 通过退款 601 退款驳回 602 退款成功 700 订单已完成 800
  tabs = ["全部", "待付款", "待发货", "待收货", "待评价", "申请退款", "申请退款完成", "驳回申请退款", "已完成"];
  listOfColumn = [
    {
      title: '商品名称',
      compare: null,
      priority: false
    },
    {
      title: '订单编号',
      compare: (a: DataItem, b: DataItem) => a.orderNum - b.orderNum,
      priority: 3
    },
    {
      title: '购买数量',
      compare: (a: DataItem, b: DataItem) => a.count - b.count,
      priority: 2
    },
    {
      title: '实际金额',
      compare: (a: DataItem, b: DataItem) => a.price - b.price,
      priority: 1
    },
    {
      title: '订单总价',
      compare: (a: DataItem, b: DataItem) => a.totalPrice - b.totalPrice,
      priority: 1
    },
    {
      title: '订单状态',
      compare: (a: DataItem, b: DataItem) => a.status - b.status,
      priority: 1
    },
    {
      title: '购买用户',
      compare: null,
      priority: 1
    },
    {
      title: '联系电话',
      compare: null,
      priority: 1
    },
    {
      title: '收货地址',
      compare: null,
      priority: 1
    },
    {
      title: '详细地址',
      compare: null,
      priority: 1
    },
    {
      title: '创建时间',
      compare: null,
      priority: 1
    },
    {
      title: '更新时间',
      compare: null,
      priority: 1
    },
    {
      title: '商品规格', // specMap : {}
      compare: null,
      priority: 1
    }
  ];
  statusOptions = [
      {value: 100, label:"待付款"},
      {value: 200, label:"待发货"},
      {value: 300, label:"待收货"},
      {value: 400, label:"待评价"},
      {value: 500, label:"退款中"},
      {value: 601, label:"通过退款"},
      {value: 602, label:"退款驳回"},
      {value: 700, label:"退款成功"},
      {value: 800, label:"订单已完成"},
  ]
  pageSize: number = 20
  totalOrder: number = 0
  isLoading:boolean = true
  status: number = 0
  type:string = ""
  checked : boolean = false
  constructor(private modalService: NzModalService,
    private notification: NzNotificationService,
    private activatedRoute: ActivatedRoute
  ) { }
  log(value: string[]): void {
    console.log(value);
  }
  statusInfo(item){
    this.modelStatus = item;
    console.log(this.modelStatus)
  }
  queryUserInfo(){
    //查询订单号
    if(this.orderNumber) {
      this.queryGoods(this.status)
    }
    //查询姓名
    if(this.buyUser) {
      this.queryGoods(this.status)
    }

  }
  detele(item): void {
    this.currentItem = item
    this.modalService.confirm({
      nzTitle: '确定删除' + this.currentItem.address.name,
      nzContent: '你确定要删除该' + this.currentItem.address.name + '及其相关信息吗？',
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOnOk: () => { // 确认删除
        this.confirmDel()
      },
      nzOnCancel: () => console.log("Cancel"),
    });
  }
  async confirmDel() {
    this.isOkLoading = true;
    let shopQuery = new Parse.Query("ShopOrder");
    let order = await shopQuery.get(this.currentItem.objectId)
    if (order && order.id) {
      await order.destroy()
      setTimeout(() => {
        this.isVisible = false;
        this.isOkLoading = false;
        this.currentItem = null
        this.notification.create(
          'success',
          '删除成功',
          '订单已删除成功'
        );
      }, 500);
      this.queryGoods(this.status)
    } else {
      this.notification.create(
        'error',
        '删除失败',
        '服务器繁忙，删除失败，请稍后重试'
      );
    }
  }
  edit(item): void {
    this.currentItem = item;
    this.isVisible = true;
    console.log(item)
  }
  async handleOk() {
    console.log(this.currentItem)
    let shopOrder = new Parse.Query("ShopOrder");
    let updateShop = await shopOrder.get(this.currentItem.objectId)
    if(this.currentItem.shipper && this.currentItem.trackingNumber) {
        updateShop.set('shipper',this.currentItem.shipper);
        updateShop.set('trackingNumber',this.currentItem.trackingNumber);
        if(this.currentItem.status < 400) {
            updateShop.set('status',300);
        }
    }
    
    let newData = await updateShop.save();
    console.log(this,newData)
    console.log(this.status)
    // await this.queryGoods(this.status)
    this.isVisible = false;
  }
  handleCancel(): void {
    this.isVisible = false;
    if (!this.isVisible) {
      this.currentItem = null;
    }
  }
  async ngOnInit() {
    // 公司id
    this.company = localStorage.getItem('company')
    this.activatedRoute.paramMap.subscribe(async param=> {
        let equalTo: any = param.get("equalTo");
        if (equalTo) {
          equalTo = equalTo.split(";");
          equalTo.forEach((e) => {
            e = e.split(":");
            if(e[0] == 'type') {
                this.type = e[1]
            }
          });
        }
        await this.queryGoods(this.status)
    })
   
  }
  callback(key) {
    console.log(key);
  }
  chooseTab(event) {
    console.log(event)
    let index = event.index
    if (index == 0) {
      this.status = 0   // 全部
    } else if (index == 1) {
      this.status = 100 // 代付款
    } else if (index == 2) {
      this.status = 200 // 待发货
    } else if (index == 3) {
      this.status = 300 // 待收货
    } else if (index == 4) {
      this.status = 400 // 待评价
    } else if (index == 5) {
      this.status = 500 // 申请退款
    } else if (index == 6) {
      this.status = 600 // 申请退款完成
    } else if (index == 7) {
      this.status = 700 // 驳回申请退款
    } else if (index == 8) {
      this.status = 800 // 已完成
    }
    this.queryGoods(this.status)
  }

  async pageChange(e) {
    this.pageIndex = e - 1;
    this.queryGoods(this.status)

  }

  //全部商品
  async queryGoods(status) {
    this.isLoading = true
    let ShopGoods = new Parse.Query("ShopOrder");
    ShopGoods.include('goods');
    ShopGoods.include('address');
    ShopGoods.equalTo('company', this.company);
    ShopGoods.ascending('createdAt')
    if(this.type) {
        ShopGoods.equalTo('type', this.type)
    }
    if (this.status != 0) {
      ShopGoods.equalTo('status', status)
    }
    if(this.orderNumber) {
      ShopGoods.equalTo('orderNum', this.orderNumber)
    }
    let count = await ShopGoods.count()
    ShopGoods.limit(20)
    ShopGoods.skip(this.pageIndex * this.pageSize)
    let shopGoods = await ShopGoods.find()
    this.totalOrder = count
    let shopJSON = []
    shopGoods.forEach(shop => {
      let log = shop.toJSON();
      shopJSON.push(log);
    })
    this.listOfData = shopJSON
    this.isLoading = false
    console.log(shopJSON)
    }

  showSpec(spec){
    if(spec) {
      let objArr = Object.keys(spec)
      let title = ''
      if (objArr && objArr.length > 0) {
          objArr.forEach((obj, index) => {
              if (objArr.length == index + 1) {
                  title += obj + ":" + spec[obj].value
              } else {
                  title += obj + ":" + spec[obj].value + '/'
              }
          })
      }
      return title
    }else {
      return "暂无"
    }
  }
}
