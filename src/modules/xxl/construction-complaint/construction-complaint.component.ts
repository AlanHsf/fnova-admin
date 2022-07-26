import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient } from "@angular/common/http";
import { NzMessageService } from 'ng-zorro-antd/message';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as Parse from "parse";
import { AppService } from "../../../app/app.service";
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-construction-complaint',
  templateUrl: './construction-complaint.component.html',
  styleUrls: ['./construction-complaint.component.scss']
})
export class ConstructionComplaintComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private modal: NzModalService, private router: Router,
    private cdRef: ChangeDetectorRef, private http: HttpClient, private appServ: AppService) { }
  sid: string = ""
  OrderComplaintid: string = ""
  orderid: string = ""
  values: string = "订单编号"
  value: string = ""
  order: any = []
  data: any = {}
  checked = false;
  indeterminate = false;
  pageType: string = 'comp';// 页面展示内容
  pageIndex: number = 1;
  pageSize: number = 10;
  isLoading: boolean = true;
  nzOkDanger: boolean = false;
  total: number = 0;
  isOkLoading = false;
  company: any
  setOfCheckedId = new Set<number>();
  descend: string = ''
  listOfColumn = [
    {
      title: '所属家装公司',
      compare: null,
      priority: false
    },
    {
      title: '工地地址',
      compare: null,
      priority: false
    },
    {
      title: '申诉原因',
      compare: null,
      priority: false
    },
    {
      title: '申诉图片',
      compare: null,
      priority: false
    },
    {
      title: '负责工种',
      compare: null,
      priority: false
    }
    ,
    {
      title: '订单编号',
      compare: null,
      priority: false
    }
    ,
    {
      title: '审核状态',
      compare: null,
      priority: false
    }



  ];

  isVisible: boolean = false;
  isConfirmLoading: boolean = false;
  ngOnInit(): void {
    this.getQuantityComplaint()
  }
  showModal(data): void {
    this.isVisible = true;
    console.log(data);
    this.OrderComplaintid = data.objectId
    this.data = data
    this.orderid = data.order.objectId
  }
  occlude() {
    this.isVisible = false;
  }
  async handleOk() {
    this.isConfirmLoading = true;
    let OrderComplaint = new Parse.Query("OrderComplaint")
    let orderComplaint = await OrderComplaint.get(this.OrderComplaintid)
    orderComplaint.set("status", 200)
    await orderComplaint.save()
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
    this.getDecorateOrder()
    this.getQuantityComplaint()
  }
  async handleCancel() {
    console.log(this.OrderComplaintid);
    
    let OrderComplaint = new Parse.Query("OrderComplaint")
    let orderComplaint = await OrderComplaint.get(this.OrderComplaintid)
    orderComplaint.set("status", 201)
    await orderComplaint.save()
    await this.DecorateOrder()
    await this.getQuantityComplaint()
    this.isVisible = false;
    this.isConfirmLoading = false;
  }
  async DecorateOrder() {
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.orderid)
    decorateOrder.set("status", 501)
    await decorateOrder.save()
  }
  searchColNameChange(ev) {
    console.log(ev);
    this.values = ev
    this.getQuantityComplaint()
  }
  search(event) {
    let values = this.values
    console.log(this.value);
    this.getQuantityComplaint()
  }
  image(f) {
    console.log(f);
  }
  goDetail(data) {
    let id = data.objectId
    console.log(data.objectId);
    this.router.navigate(['xxl/constructiondetail', { id }])
  }
  async getDecorateOrder() {
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.orderid)
    decorateOrder.set("status", 502)
    await decorateOrder.save()
  }
  async getQuantityComplaint() {
    let OrderComplaint = new Parse.Query("OrderComplaint");
    OrderComplaint.include('order')
    OrderComplaint.equalTo('company', '1DKnoHnZ0o');
    OrderComplaint.include('profile')
    OrderComplaint.ascending('status')
    if (!this.total) {
      this.total = await OrderComplaint.count()
      console.log(this.total);

    }
    OrderComplaint.skip((this.pageIndex - 1) * this.pageSize)
    OrderComplaint.limit(this.pageSize)
    if (this.values == "订单编号") { OrderComplaint.contains('orderNum', this.value) }
    let orderComplaint = await OrderComplaint.find()
    let order = []
    console.log(123);
    
    if (orderComplaint && orderComplaint.length) {
      orderComplaint.forEach((item) => {
        let list = item.toJSON()
        if (list.status == 100) {
          list.status = '待审核'
        }
        if (list.status == 200) {
          list.status = '修复中'
        }
        if (list.status == 201) {
          list.status = '已驳回'
        }
        if (list.status == 300) {
          list.status = '已修复'
        }
        order.push(list)
      })
      this.order = order
      console.log(this.order);
      this.isLoading = false
    }
    if (orderComplaint && orderComplaint.length == 0) {
      this.order = null
      console.log(this.order, 123);
    }
  }
}
