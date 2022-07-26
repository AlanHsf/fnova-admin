import * as Parse from "parse";
import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss'],
  providers: [DatePipe]
})
export class RefundComponent implements OnInit {

  refundType: any = {
    saled: '售后退款',
    saling: '售中退款',
  }
  refundStatus: any = {
    buyer_apply: '申请退款',
    refund_settle: '结算完成',
    seller_approval: '同意退款',
    seller_reject: '拒绝退款',
  }
  constructor(
    private c: CoreService,
    private msg: NzMessageService,
    private modal: NzModalService
  ) { }
  ngOnInit() {
    this.getData()
  }
  list = [] //  列表数据源
  table: any = {
    count: 0,
    pageSize: 10,
    currentPage: 1,
    loading: false
  }
  filterParams: any = {
    roleMobile: Parse.User.current() && Parse.User.current().get('mobile'),
    // orderId: '0b3dc250166b11eaa7bbdbd0f539b5b9', //  测试
  }
  filterConfigJson() {
    return [
      [
        { lable: '创建时间 : ', type: 'date', field: 'dateBegin', value: '', clear: true },
        { lable: '~ ', type: 'date', field: 'dateEnd', value: '', clear: true },
        { lable: '车辆编号 : ', type: 'input', field: 'vehicleNumber', value: '', clear: true },
      ],
      [
        {
          lable: '退款类型 : ', option: [
            { lable: '全部', value: '' },
            { lable: '售后退款', value: 'saled' },
            { lable: '售中退款', value: 'saling' },
          ], type: 'select', field: 'refundType', value: '',
        },
        {
          lable: '退款状态 : ', option: [
            { lable: '全部', value: '' },
            { lable: '申请退款', value: 'buyer_apply' },
            { lable: '结算完成', value: 'refund_settle' },
            { lable: '同意退款', value: 'seller_approval' },
            { lable: '拒绝退款', value: 'seller_reject' },
          ], type: 'select', field: 'refundStatus', value: '',
        },
      ],
      [
        { lable: '退款单编号 : ', type: 'input', field: 'id', value: '', clear: true },
        { lable: '主订单编号 : ', type: 'input', field: 'orderId', value: '', clear: true },
        { lable: '子订单编号 : ', type: 'input', field: 'orderEntryId', value: '', clear: true },
      ],
      [
        { lable: '买家手机 : ', type: 'input', field: 'buyerMobile', value: '', clear: true },
        { lable: '卖家手机 : ', type: 'input', field: 'sellerMobile', value: '', clear: true },
      ],
      [
        { lable: '结算时间 : ', type: 'date', field: 'settleBegin', value: '', clear: true },
        { lable: '~　', type: 'date', field: 'settleEnd', value: '', clear: true },
      ]
    ]
  }
  filterConfig: Array<Array<any>> = [...this.filterConfigJson()]

  getData() {
    this.getTable()
    this.getTableCount()
  }
  getTable() {
    this.table.loading = true
    const url = this.c.web + 'order-refundTable'
    const params = {
      currentPage: this.table.currentPage,
      pageSize: this.table.pageSize,
      ...this.filterParams
    }
    this.c.get(url, params).then(data => {
      this.table.loading = false
      console.log(data);
      const temp: any = data
      this.list = temp.data
    })
  }
  getTableCount() {
    const url = this.c.web + 'order-refundTableCount'
    const params = {
      ...this.filterParams
    }
    this.c.get(url, params).then(data => {
      const temp: any = data
      this.table.count = temp.data
    })
  }
  filterChange(e) {
    Object.assign(this.filterParams, e)
  }
  search() {
    this.table.currentPage = 1
    this.getData()
  }
  refresh() {
    this.filterParams = {}
    this.filterConfig = [...this.filterConfigJson()]
    this.search()
  }
  //  退款单详情模态框
  detailM: boolean = false
  detail: any = {}
  openDetailM(item?) {
    this.detail = {}
    let url = this.c.web + 'order-refundDetail'
    const params = {
      id: item.id
    }
    this.c.get(url, params).then(data => {
      console.log(data)
      const temp: any = data
      if (!temp.data) return this.msg.error('未找到数据')
      this.detailM = true
      this.detail = temp.data
    })
  }
  //  同意退款或拒绝退款
  yesOrNo //  同意或拒绝 text
  refundM = false //  退款模态框
  refundObject: any = {}  //退款双向绑定
  openRefundM(e, yesOrNo) {
    this.yesOrNo = yesOrNo
    console.log(e);
    this.detail = {}
    let url = this.c.web + 'order-refundDetail'
    const params = {
      id: e.id
    }
    this.c.get(url, params).then(data => {
      console.log(data)
      const temp: any = data
      if (!temp.data) return this.msg.error('未找到数据')
      this.refundM = true
      this.detail = temp.data
    })
  }
  submitRefund() {
    let url = this.c.web + 'sumbmitRefund'
    const params = {
      id: this.detail.id,
      order_id: this.detail.orderId,
      remark: this.detail.remark,
      yesOrNo: +this.yesOrNo,
      ...this.c.op(),
    }
    console.log(params);
    this.c.post(url, params).then(data => {
      console.log(data);
      const temp: any = data
      if (temp.error) { return this.msg.error(temp.msg) }
      this.getData()
      this.refundM = false
      this.msg.success((this.yesOrNo ? '同意' : '拒绝') + '退款成功')
    })
  }
  settleRefundM = false //  退款结算
  openSettleRefund(item) {
    console.log(item);
    let ok = false
    let modal = this.modal.confirm({
      nzTitle: '你确认发起该笔退款单的结算？',
      nzStyle: {
        top: '100px'
      },
      nzOnOk: () => { ok = true }
    })
    modal.afterClose.subscribe(() => {
      if (ok) {
        console.log('退款结算');
        let url = this.c.web + 'settleRefund'
        const params = {
          id: item.id,
          order_id: item.orderId,
          ...this.c.op()
        }
        this.c.post(url, params).then(data => {
          console.log(data);
          const temp: any = data
          if (temp.error) { return this.msg.error(temp.msg) }
          if (temp[1].changedRows === 2) {
            this.getData()
            modal.close()
            this.msg.success('退款结算成功')
          }
        })
      }
    })
  }
}
