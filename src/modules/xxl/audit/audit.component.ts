import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import * as Parse from "parse";
@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private router: Router,
    private cdRef: ChangeDetectorRef) { }
  sid: string = ""
  qid: string = ""
  orderid:string = ""
  values: string = "是否审核"
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
  company: string = ''
  setOfCheckedId = new Set<number>();
  descend: string = ''
  listOfColumn = [
    {
      title: '所属订单',
      compare: null,
      priority: false
    },
    {
      title: '申述人员',
      compare: null,
      priority: false
    },
    {
      title: '申述原因',
      compare: null,
      priority: false
    },
    {
      title: '申述图片',
      compare: null,
      priority: false
    },
    {
      title: '增加材料费用',
      compare: null,
      priority: false
    },
    {
      title: '增加人工费用',
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
  ngOnInit() {
    this.company = localStorage.getItem('company')
    this.activRoute.paramMap.subscribe(async params => {
      await this.getQuantityComplaint()
    })
  }
  showModal(data): void {
    this.isVisible = true;
    this.qid = data.objectId
    this.data = data
    this.orderid=data.order.objectId
  }
  occlude() {
    this.isVisible = false;
    this.qid = null
    this.data = null
    this.orderid= null
  }
  async handleOk() {
    this.isConfirmLoading = true;
    this.getDecorateOrder()
    let QuantityComplaint = new Parse.Query("QuantityComplaint")
    let quantityComplaint = await QuantityComplaint.get(this.qid)
    quantityComplaint.set("status", '200')
    await quantityComplaint.save()
    await this.getQuantityComplaint()
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
      this.qid = null
      this.data = null
      this.orderid= null
    }, 500);
  }
  async handleCancel() {
    let QuantityComplaint = new Parse.Query("QuantityComplaint")
    let quantityComplaint = await QuantityComplaint.get(this.qid)
    quantityComplaint.set("status", '201')
    await quantityComplaint.save()
    await this.getQuantityComplaint()
    this.isVisible = false;
    this.qid = null
    this.data = null
    this.orderid= null
  }
  searchColNameChange(ev) {
    console.log(ev);
    this.values = ev
  }
  search(event) {
    let values = this.values
    console.log(this.value);
    this.getQuantityComplaint()
  }

  goDetail(data) {
    let id = data.objectId
    this.router.navigate(['xxl/detail', { id }])
  }

  async getDecorateOrder() {
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.orderid)
    decorateOrder.set("status", 202)
    await decorateOrder.save()
  }
  async getQuantityComplaint() {
    let QuantityComplaint = new Parse.Query("QuantityComplaint");
    QuantityComplaint.include('order')
    QuantityComplaint.equalTo('company', this.company);
    QuantityComplaint.include('profile')
    QuantityComplaint.ascending('status')
    if (!this.total) {
      this.total = await QuantityComplaint.count()
      console.log(this.total);
    }
    QuantityComplaint.skip((this.pageIndex - 1) * this.pageSize)
    QuantityComplaint.limit(this.pageSize)
    if (this.values == "是否申述") { QuantityComplaint.contains('status', this.value) }
    if (this.values == "申述原因") { QuantityComplaint.contains('reason', this.value) }
    let quantityComplaint = await QuantityComplaint.find()
    let order = []
    if (quantityComplaint && quantityComplaint.length) {
      quantityComplaint.forEach((item) => {
        let list = item.toJSON()

        order.push(list)
      })
      this.order = order
      this.isLoading = false
    }
    if (quantityComplaint && quantityComplaint.length == 0) {
      this.order = null
    }
  }

  isShowImage:boolean = false

  showImage(data) {
    this.data = data
    this.isShowImage = true
  }
  closeImage() {
    this.data = null
    this.isShowImage = false

  }
}



