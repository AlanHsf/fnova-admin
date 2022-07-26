import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient } from "@angular/common/http";
import { NzMessageService } from 'ng-zorro-antd/message';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as Parse from "parse";
import { AppService } from "../../../app/app.service";
import * as fs from "fs";
interface DataItem {
  商品图片: string;
  购买用户: string;
  商品名称: number;
  订单编号: number;
  实际金额: number;
  评价星级: number;
  评价内容: string;
  评价图片: string;
}
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private modalService: NzModalService, private router: Router,
    private cdRef: ChangeDetectorRef, private http: HttpClient, private appServ: AppService) { }
  sid: string = ""
  values: string = "商品名称"
  value: string = ""
  order: any = []
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
  descend: string = ''
  listOfColumn = [
    {
      title: '商品图片',
      compare: null,
      priority: false
    },
    {
      title: '购买用户',
      compare: null,
      priority: false
    },
    {
      title: '商品名称',
      compare: null,
      priority: false
    },
    {
      title: '订单编号',
      compare: null,
      priority: false
    },
    {
      title: '实际金额',
      compare: null,
      priority: false
    }
    ,
    {
      title: '评价星级',
      compare: null,
      priority: false
    }
    ,
    {
      title: '评价内容',
      compare: null,
      priority: false
    }
    ,
    {
      title: '评价图片',
      compare: null,
      priority: false
    }

  ];
  ngOnInit() {
    this.activRoute.paramMap.subscribe(async params => {
      await this.getqueryOrder()

    })
  }
  searchColNameChange(ev) {
    console.log(ev);
    this.values = ev
    this.getqueryOrder()
  }
  search() {
    let values = this.values
    console.log(values, this.value);
    this.getqueryOrder()
  }
  goDetail(data) {
    let id = data.objectId
    console.log(data.objectId);
    this.router.navigate(['bzzb/Details', { id }])
  }
  
  async getqueryOrder() {
    let Order = new Parse.Query("Order");
    Order.include('store')
    Order.equalTo('company', 'rg4LL7toNt');
    Order.equalTo('type', 'goods');
    Order.include('address')
    Order.include('user')
    Order.include('tragetobject')
    Order.include('store')
    Order.exists('score')
    Order.doesNotExist('hiddenComment')
    if (!this.total) {await Order.count()
    }
    Order.skip((this.pageIndex - 1) * this.pageSize)
    Order.limit(this.pageSize)

    if (this.values == "订单编号") { Order.contains('orderNum', this.value) }
    if (this.values == "商品名称") { Order.contains('name', this.value) }
    if (this.values == "评价内容") { Order.contains('content', this.value) }
    if (this.values == "评价星级") { Order.contains('score', this.value) }
    let company = await Order.find()
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
      console.log(this.order, 123);
    }
  }
}