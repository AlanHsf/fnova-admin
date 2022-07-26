import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";
import { AppService } from "../../../app/app.service";
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.scss']
})
export class OrderReviewComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private modal: NzModalService, private router: Router,
    private cdRef: ChangeDetectorRef,private appServ: AppService) { }
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
      title: '家装公司',
      compare: null,
      priority: false
    },
    {
      title: '工地地址',
      compare: null,
      priority: false
    },
    {
      title: '完工图片',
      compare: null,
      priority: false
    },
    {
      title: '订单编号',
      compare: null,
      priority: false
    },
    {
      title: '提交人员',
      compare: null,
      priority: false
    },
    {
      title: '联系电话',
      compare: null,
      priority: false
    },
    {
      title: '审核状态',
      compare: null,
      priority: false
    }

  ];

  isVisible: boolean = false;
  isConfirmLoading: boolean = false;
  ngOnInit(): void {
    this.getDecorateOrder()
  }
  showModal(data): void {
    this.isVisible = true;
    console.log(data);
    this.data = data
    this.orderid = data.objectId
  }
  occlude() {
    this.isVisible = false;
  }
  async handleOk() {
    this.isConfirmLoading = true;
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.orderid)
    decorateOrder.set("status", 500)
    await decorateOrder.save()
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
    this.getDecorateOrder()
  }
  async handleCancel() {
    console.log(this.OrderComplaintid);
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.orderid)
    decorateOrder.set("status", 300)
    await decorateOrder.save()
    await this.getDecorateOrder()
    this.isVisible = false;
    this.isConfirmLoading = false;
  }
  searchColNameChange(ev) {
    console.log(ev);
    this.values = ev
    this.getDecorateOrder()
  }
  search(event) {
    let values = this.values
    console.log(this.value);
    this.getDecorateOrder()
  }
  goDetail(data) {
    let id = data.objectId
    console.log(data.objectId);
    this.router.navigate(['xxl/orderdetail', { id }])
  }
  async getDecorateOrder() {
    let DecorateOrder = new Parse.Query("DecorateOrder");
    DecorateOrder.equalTo('company', '1DKnoHnZ0o');
    DecorateOrder.equalTo('status', 400);
    DecorateOrder.include('profile')
    DecorateOrder.ascending('status')
    if (!this.total) {
      this.total = await DecorateOrder.count()
      console.log(this.total);
    }
    DecorateOrder.skip((this.pageIndex - 1) * this.pageSize)
    DecorateOrder.limit(this.pageSize)
    if (this.values == "订单编号") { DecorateOrder.contains('orderNum', this.value) }
    let decorateOrder = await DecorateOrder.find()
    let order = []
    if (decorateOrder && decorateOrder.length) {
      decorateOrder.forEach((item) => {
        let list = item.toJSON()
        if (list.status == 400) {
          list.status = '待审核'
        }
        order.push(list)
      })
      this.order = order
      console.log(this.order);
      this.isLoading = false
    }
    if (decorateOrder && decorateOrder.length == 0) {
      this.order = null
      console.log(this.order, 123);
    }
  }
}
