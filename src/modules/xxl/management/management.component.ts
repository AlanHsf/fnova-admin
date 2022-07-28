import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";

import * as Parse from "parse";
import { AppService } from "../../../app/app.service";
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private modal: NzModalService, private router: Router,
    private cdRef: ChangeDetectorRef, private http: HttpClient, private appServ: AppService) { }
    sid: string = ""
    uid: string = ""
    orderid:string = ""
    values: string = "家装公司"
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
        title: '户型',
        compare: null,
        priority: false
      },

      {
        title: '套内面积',
        compare: null,
        priority: false
      },
      // {
      //   title: '使用材料 ',
      //   compare: null,
      //   priority: false
      // },
      {
        title: '总金额',
        compare: null,
        priority: false
      }
      ,
      {
        title: '订单编号',
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
    let uid = data.objectId
    this.uid = uid
    this.data = data
this.orderid=data.order.objectId
  }
  occlude() {
    this.isVisible = false;
  }
  async handleOk() {
    this.isConfirmLoading = true;
    this.getDecorateOrder()
    let QuantityComplaint = new Parse.Query("QuantityComplaint")
    let quantityComplaint = await QuantityComplaint.get(this.uid)
    quantityComplaint.set("status", '200')
    await quantityComplaint.save()
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
  }
  async handleCancel() {
    let QuantityComplaint = new Parse.Query("QuantityComplaint")
    let quantityComplaint = await QuantityComplaint.get(this.uid)
    quantityComplaint.set("status", '201')
    await quantityComplaint.save()
    await this.getQuantityComplaint()
    this.isVisible = false;
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
    this.router.navigate(['xxl/details', { id }])
  }
  async switch(data) {
    console.log(data.status);
    let status = data.status
    let id = data.objectId
    let uid = data.order.objectId
    console.log(id, uid);
    let QuantityComplaint = new Parse.Query("QuantityComplaint")
    let quantityComplaint = await QuantityComplaint.get(id)
    if (status == true) {
      quantityComplaint.set("status", '202')
    }
    if (status == false) {
      quantityComplaint.set("status", '201')
    }
    await quantityComplaint.save()
    await this.getQuantityComplaint()
    await this.getDecorateOrder()
  }
  async getDecorateOrder() {
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.orderid)
    decorateOrder.set("status", 202)
    await decorateOrder.save()
  }
  async getQuantityComplaint() {
    let DecorateOrder = new Parse.Query("DecorateOrder");
    DecorateOrder.include('order')
    DecorateOrder.equalTo('company', '1DKnoHnZ0o');
    DecorateOrder.include('profile')
    DecorateOrder.ascending('status')
    DecorateOrder.lessThan('status',200)
    if (this.values == "家装公司") { DecorateOrder.contains('storeName', this.value) }
    if (this.values == "订单编号") { DecorateOrder.contains('orderNum', this.value) }
    if (!this.total) {
      this.total = await DecorateOrder.count()
      console.log(this.total);

    }
    DecorateOrder.skip((this.pageIndex - 1) * this.pageSize)
    DecorateOrder.limit(this.pageSize)


    let decorateOrder = await DecorateOrder.find()
    let order = []
    if (decorateOrder && decorateOrder.length) {
      decorateOrder.forEach((item) => {
        let list = item.toJSON()
        if (list.status == "100") {
          list.status = '待审核'
        }
        if (list.status == "200") {
          list.status = '家装公司审核中'
        }
        if (list.status == "300") {
          list.status = '已通过'
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
