import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient } from "@angular/common/http";
import { NzMessageService } from 'ng-zorro-antd/message';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as Parse from "parse";
import { AppService } from "../../../app/app.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private modalService: NzModalService, private router: Router,
    private cdRef: ChangeDetectorRef, private http: HttpClient, private appServ: AppService,private nzMessageService: NzMessageService) { }
  sid: string = ""
  values: string = "订单编号"
  value: string = ""
  order: any = []
  orderid: any = []
  foods: any = []
  specMap: any = {}
  checked = false;
  indeterminate = false;
  pageType: string = 'comp';// 页面展示内容
  pageIndex: number = 1;
  pageSize: number = 10;
  isLoading: boolean = true;
  total: number = 0;
  isOkLoading = false;
  company: any
  setOfCheckedId = new Set<number>();
  descend: string = '';
  isVisible = false;
  listOfColumn = [
    // {
    //   title: '商品图片',
    //   compare: null,
    //   priority: false
    // },
    {
      title: '购买用户',
      compare: null,
      priority: false
    },
    {
      title: '点餐数量',
      compare: null,
      priority: false
    },
    {
      title: '餐桌号',
      compare: null,
      priority: false
    },
    {
      title: '订单编号',
      compare: null,
      priority: false
    },
    {
      title: '下单时间',
      compare: null,
      priority: false
    },
    {
      title: '实际金额',
      compare: null,
      priority: false
    }
    ,


  ]
  ngOnInit(): void {
    this.getqueryOrder()
  }
  cancel(): void {
    this.nzMessageService.info('取消');
  }

  confirm(event): void {
    console.log(event);
    console.log(event.objectId);
    let id = event.objectId
    this.upDel(id)
    this.nzMessageService.info('删除成功');
  }
  showModal(event): void {
    console.log(event);
    this.orderid= event
    this.foods = event.foods;
    let specMap = event.specMap
    var arr = []
    for (let i in specMap) {
      arr.push(specMap[i])  //
    }
    this.specMap = arr;
    this.isVisible = true;
    console.log(this.orderid);
  }
  // deleteItem(event) {
  //   console.log(event.objectId);
  //   let id = event.objectId
  //   this.upDel(id)
  // }
  async upDel(id) {
    let FoodOrder = new Parse.Query('FoodOrder')
    let order = await FoodOrder.get(id)
    if (order && order.id) {
      console.log(order);
      await order.destroy()
    }
    this.getqueryOrder()
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  searchColNameChange(ev) {
    console.log(ev);
    this.values = ev
  }
  search() {
    let values = this.values
    console.log(values, this.value);
    this.getqueryOrder()
  }
  goDetail(data) {
    let id = data.objectId
    console.log(data.objectId);
    this.router.navigate(['toursim/details', { id }])
  }
  async getqueryOrder() {
    let FoodOrder = new Parse.Query("FoodOrder");
    FoodOrder.equalTo('company', 'sHNeVwSaAg');
    FoodOrder.include('address')
    FoodOrder.include('table')
    FoodOrder.include('user')
    FoodOrder.include('foods')
    // ShopOrder.exists('content')
    if (!this.total) {
      this.total = await FoodOrder.count()
    }
    FoodOrder.skip((this.pageIndex - 1) * this.pageSize)
    FoodOrder.limit(this.pageSize)

    if (this.values == "订单编号") { FoodOrder.contains('tradeNo', this.value) }

    if (this.values == "订单状态") { FoodOrder.contains('state', this.value) }
    let company = await FoodOrder.find()
    let order = []
    if (company && company.length) {
      company.forEach((item) => {
        order.push(item.toJSON())
      })
      this.order = order
      console.log(this.order);
      this.isLoading = false
    }
    if (company && company.length == 0) {
      this.order = null
      console.log(this.order.foods, 123);
    }
  }
}
