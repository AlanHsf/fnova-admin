import * as Parse from "parse";
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { CoreService } from 'src/app/core.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-vehicle-order',
  templateUrl: './vehicle-order.component.html',
  styleUrls: ['./vehicle-order.component.scss'],
  providers: [DatePipe]
})
export class VehicleOrderComponent implements OnInit {
  thead = ['订单编号', '车辆编号', '买家', '卖家', '金额(元)', '订单类型', '退款', '时间', '卖家备注', '操作']
  searchParam = { order_id: '', buyer_mobile: '', seller_mobile: '', vehicle_number: '', order_status: '' }
  constructor(
    private http: HttpClient,
    private router: Router,
    private c: CoreService,
    private msg: NzMessageService
  ) {
    this.getData()
  }
  orderType: any = {
    rent_temporary: '临时租车',
    rent_hour: '小时租车',
    rent_day: '按天租车',
    vehicle_sell: '出售车辆',
  }
  orderStatus: any = {
    INIT: '开锁操作',
    wait_completed: '等待完成',
    wait_pay: '等待付款',
    trade_success: '交易完成',
    settled: '结算完成',
  }
  refundType: any = {
    saled: '售后退款',
    saling: '售中退款',
  }
  refundStatus: any = {
    buyer_apply: '买家申请退款',
    refund_settle: '退款结算完成',
    seller_approval: '卖家同意退款',
    seller_reject: '卖家拒绝退款',
  }

  ngOnInit() {
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
    // orderStatus: 'settled', //  测试
    // id: '0b3dc250166b11eaa7bbdbd0f539b5b9',  //  测试
  }
  filterConfigJson() {
    return [
      [
        { lable: '创建时间 : ', type: 'date', field: 'dateBegin', value: '', clear: true },
        { lable: '~ ', type: 'date', field: 'dateEnd', value: '', clear: true },
        { lable: '车辆编号 : ', type: 'input', field: 'vehicleNumber', value: '', clear: true },
      ],
      [
        { lable: '订单编号 : ', type: 'input', field: 'id', value: '', clear: true },
        { lable: '买家手机 : ', type: 'input', field: 'buyerMobile', value: '', clear: true },
        { lable: '卖家手机 : ', type: 'input', field: 'sellerMobile', value: '', clear: true },
      ],
      [
        {
          lable: '订单类型 : ', option: [
            { lable: '全部', value: '' },
            ...Object.entries(this.orderType).map(item => {
              return { lable: item[1], value: item[0] }
            })
          ], type: 'select', field: 'orderType', value: '',
        },
        {
          lable: '订单状态 : ', option: [
            { lable: '全部', value: '' },
            ...Object.entries(this.orderStatus).map(item => {
              return { lable: item[1], value: item[0] }
            })
          ], type: 'select', field: 'orderStatus', value: '',
        }
      ]
      // [
      //   {
      //     lable: '退款类型 : ', option: [
      //       { lable: '全部', value: '' },
      //       { lable: '售后退款', value: 'saled' },
      //       { lable: '售中退款', value: 'saling' },
      //     ], type: 'select', field: 'refundType', value: '',
      //   },
      //   {
      //     lable: '退款状态 : ', option: [
      //       { lable: '全部', value: '' },
      //       { lable: '申请退款', value: 'buyer_apply' },
      //       { lable: '结算完成', value: 'refund_settle' },
      //       { lable: '同意退款', value: 'seller_approval' },
      //       { lable: '拒绝退款', value: 'seller_reject' },
      //     ], type: 'select', field: 'refundStatus', value: '',
      //   },
      // ],
      // [
      //   { lable: '结算时间 : ', type: 'date', field: 'settleBegin', value: '', clear: true },
      //   { lable: '~　', type: 'date', field: 'settleEnd', value: '', clear: true },
      // ]
    ]
  }
  filterConfig: Array<Array<any>> = [...this.filterConfigJson()]

  getData() {
    this.getTable()
    this.getTableCount()
  }
  getTableCount() {
    const url = this.c.web + 'order-orderTableCount'
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
  openDetailM(item) {
    this.detail = {}
    let url = this.c.web + 'order-orderDetail'
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

  //获取订单数据
  orders: any;

  getTable() {
    console.log(Parse.User.current());
    this.table.loading = true
    const url = this.c.web + 'order-orderTable'
    console.log(this.filterParams)
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
  // getOrderList() { // getTable替换该函数
  //   this.http.get('https://server.ncppx.com/api/pipixia/ppxmanage/getorder').subscribe(res => {
  //     console.log("订单数据", res);
  //     this.orders = res
  //   })
  // }

  //结束订单
  endOrder(e, w, q, r) {
    let pre = {
      order_id: e,
      order_type: w,
      gmt_create: q
    }
    console.log(pre);
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/endorder', pre).subscribe(res => {
      if (res['success']) {
        this.http.post('https://server.ncppx.com/api/pipixia/vehicle/Lock', { device_sn: r }).subscribe(res0 => {
          if (res0['success']) {
            this.http.post('https://server.ncppx.com/api/pipixia/vehicle/updataStatus', { device_sn: r, status: 0 }).subscribe(res1 => {
              if (res1['success']) {
                alert("结束成功")
                // this.getOrderList()
                this.getData()
              }
            })
          }
        })
      }
    })
  }

  //搜索
  // search() {
  //   console.log(this.searchParam);
  //   this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/searchOrder', this.searchParam).subscribe(res => {
  //     this.orders = res
  //   })
  // }

  visibles: any = false;
  orderDetail: any;
  open(e) {
    console.log(e);
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/chatOrder', { order_id: e }).subscribe(res => {
      console.log(res);
      this.orderDetail = res[0]
      console.log(">>>>", res[0]);

      this.visibles = true;

    })

  }
  close() {
    this.visibles = false;
  }

  setPayed(e) {
    let order_id = e
    let gmt_pay = this.formateDate(new Date())
    console.log(order_id, gmt_pay);
    this.http.post('https://server.ncppx.com/api/pipixia/vehicle/finishPayOrders', { order_id: order_id, gmt_pay: gmt_pay }).subscribe(res => {
      if (res['success']) {
        alert('设置成功')
      }
    })
  }
  //前往车辆控制
  // toControl(e) {
  //   console.log("<<<", e);
  //   this.router.navigateByUrl("pipixia-vehicle/control?id=" + e)
  // }
  // 批量结算
  settleAll() {
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/Settlement', {}).subscribe(res => {
      if (res['success']) {
        alert(res['msg'])
      }
    })
  }

  //单个结算
  settleOrder(e) {
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/Settlement', { order_id: e }).subscribe(res => {
      if (res['success']) {
        alert(res['msg'])
      }
    })
  }

  setDiscount(e, q, w) {
    console.log(e, q);
    let discount_fee = q * 100
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/setDiscont', { order_id: e, discount_fee: discount_fee, amount: w }).subscribe(res => {
      console.log(res);
      if (res['success']) {
        this.visibles = false;
        alert(res['msg'])
      } else {
        this.visibles = false;
        alert(res['msg'])
      }
    })
  }

  formateDate(datetime) {
    function addDateZero(num) {
      return (num < 10 ? "0" + num : num);
    }
    let d = new Date(datetime);
    let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
    return formatdatetime;
  }

  //  退款模态框
  refundM = false
  refundObject: any = {}
  openRefundM(e) {
    console.log(e);
    this.detail = {}
    let url = this.c.web + 'order-orderDetail'
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
  //  申请退款
  requestRefund() {
    if (!(this.refundObject.money > 0)) {
      return this.msg.warning('请填写正确的退款金额')
    }
    let op: any = Parse.User.current() || {}
    op = JSON.parse(JSON.stringify(op))
    console.log(op)
    const params: any = {
      order_id: this.detail.id,  //  订单id
      refund_fee: this.refundObject.money * 100, //退款金额 单位 分
      op_remarks: this.refundObject.remark, //  操作人备注
      op_id: op.objectId, //  操作人id
      op_mobile: op.mobile,  //  操作人手机号
      op_name: op.realname,  //  操作人姓名
      op_type: op.type, //  操作人类型

    }
    console.log(params);
    let url = this.c.web + 'requestRefund';
    this.c.post(url, params).then(data => {
      console.log(data)
      const temp: any = data
      if (temp.error) {
        return this.msg.error(temp.msg)
      }
      if (temp[1].affectedRows) {
        this.refundM = false
        this.getData()
        this.msg.success('申请退款成功')
      }
    })
  }

}
