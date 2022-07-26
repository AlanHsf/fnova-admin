import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as Parse from "parse";
@Component({
  selector: 'app-refund-log',
  templateUrl: './refund-log.component.html',
  styleUrls: ['./refund-log.component.scss']
})
export class RefundLogComponent implements OnInit {

  refunds: Array<object> = []
  isLoading: boolean = true;
  type: string = "applycant";
  inputValue: string = "";
  counts: number = 0;
  counttwo: number = 0;
  countbo: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  department: string = "";
  profile: string = ""
  refund: any = {}// 当前操作的退费记录

  constructor(
    private message: NzMessageService,
    private http: HttpClient,
    private modal: NzModalService
  ) { }
  // 页面初始化
  ngOnInit(): void {
    // 获取数据
    this.department = localStorage.getItem("department")
    if (this.department) {
      this.getData()
    }


    // 搜索类型去掉是否缴费
    // 数据查询增加查询条件equalTo department
    // 已缴费 值更改  更改数据时  查找该申请记录profile对应考生的已缴费的缴费记录退费字段为true
    //     profile => Profile   AccountLog orderId字段包含Refund =>profile的objectId且isVerify 为true 的缴费记录改为 isback字段改为true
    // 美化页面

  }

  //已退费人数
  async count() {
    let queryRefund = new Parse.Query("Refund");
    if (this.inputValue && this.inputValue.trim() != '') {
      queryRefund.contains(this.type, this.inputValue);
    }
    queryRefund.equalTo("department", this.department);
    queryRefund.equalTo("isRefund", true)
    let counts = await queryRefund.count();
    this.counts = counts;
    console.log(counts)
  }

  async countbox() {
    let queryRefund = new Parse.Query("Refund");
    if (this.inputValue && this.inputValue.trim() != '') {
      queryRefund.contains(this.type, this.inputValue);
    }
    queryRefund.equalTo("department", this.department);
    let countbox = await queryRefund.count();
    this.countbo = countbox;
    console.log(countbox)
  }
  //未退费人数
  async countwo() {
    let queryRefund = new Parse.Query("Refund");
    if (this.inputValue && this.inputValue.trim() != '') {
      queryRefund.contains(this.type, this.inputValue);
    }
    queryRefund.equalTo("department", this.department);
    queryRefund.notEqualTo("isRefund", true)
    let counttwo = await queryRefund.count();
    this.counttwo = counttwo;
    console.log(counttwo)
  }
  async getData() {
    // 查询 退款记录数据
    let sql = `select "refund"."objectId",
    "refund"."applycant",
    "refund"."mobile",
    "refund"."recruitName",
    "refund"."price",
    "refund"."isRefund",
    "refund"."payType",
    "refund"."paylog",
    "refund"."remark",
    "log"."objectId" as "refundlog",
    "log"."status",
    "pro"."objectId" as "proObjectId"
    FROM "Refund" as "refund"
        left join "RefundLog" as "log" on "log"."refund" = "refund"."objectId"
        left join (select * from "Profile" where "isDeleted" is not true) as "pro"
          on "pro"."objectId" = "refund"."profile"
        WHERE "refund"."department" = '${this.department}'
        and (("pro"."objectId" is null and "refund"."isRefund" is not true) or ("pro"."objectId" is not null))
        and "refund"."${this.type}" like '%${this.inputValue}%'
    ORDER BY "log"."createdAt" limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`
    this.refunds = await this.novaSql(sql)
    // 申请退费人数
    this.countbox()
    // 已退费人数
    this.count()
    // 未退费人数
    this.countwo()
    console.log(this.refunds)

    // 由于表格数据更新后 视图不更新 所以获取数据后才显示表格
    this.isLoading = false
  }
  novaSql(sql): Promise<any> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
      this.http
        .post(baseurl, { sql: sql })
        .subscribe(async (res: any) => {
          console.log(res);
          if (res.code == 200) {
            resolve(res.data)
          } else {
            this.message.info("网络繁忙，数据获取失败")
            reject(res)
          }
        })
    })
  }
  async submit(data) {
    this.refund = data;
    console.log(data.isRefund)
    this.changeStatus(data.isRefund)
  }



  // 赢商通退费接口请求

  async requestRefund(data) {
    console.log(data);
    this.refund = data;
    let log = await this.getLog(data)// 支付记录
    console.log(log);
    if (log && log.id) {
      let req_seq = this.setRefundTradeNo(log)
      let params = {
        ori_seq: log.get("orderId"),
        price: log.get("assetCount"),
        req_seq,
        trans_seq: log.get("orderNumber")
      }
      let refundLog = await this.setRefundLog(params, data.objectId)
      if (refundLog && refundLog.id) {
        params['logId'] = refundLog.id
        this.requestYstRefund(data, params)
      } else {
        this.message.error("网络繁忙，请稍后重试")
      }

    }


  }
  async setRefundLog(params, refundId) {
    let RefundLog = Parse.Object.extend("RefundLog")
    let log = new RefundLog()
    log.set("refund", {
      className: "Refund",
      __type: "Pointer",
      objectId: refundId
    })
    log.set("figure", params.price)
    log.set("status", "W")
    log.set("orderNum", params.ori_seq)
    log.set("serialNum", params.trans_seq || '')
    log.set("refundNum", params.req_seq)
    return await log.save()




  }
  requestYstRefund(refund, logParam) {
    let { price, ori_seq, req_seq, trans_seq, logId } = logParam;
    // 接口所需参数
    let params = {
      request_type: "unitive_refund_request",// 请求类型
      req_seq,// 退费请求流水号
      refund_fee: price,// 退费金额
      ori_seq,// 原支付请求流水号
      trans_seq,// 赢商通交易单号
      reason: "测试",// 退款理由
      logId,// 退费记录id
    }
    console.log(params);

    let headers: HttpHeaders = new HttpHeaders({});
    headers.append("Content-Type", "application/json");
    let url = 'https://server.fmode.cn/api/ystpay/refund'
    this.http.post(url, params, { headers: headers })
      .subscribe(res => {
        let data = res['data'];
        console.log(data);
        if (data['result'] != 'Y') {
          return this.message.error(data['msg'])
        }
        this.message.success(data['msg'])
        switch (data['status']) {
          case 'S':
            // 订单记录修改为已退费状态
            this.changeStatus(true)
            refund.status = "S";
            break;
          case 'W':
            this.message.error("等待退款")
            break;
          case 'F':
            this.message.error("退款失败")
            break;
          default:
            break;
        }
      }, error => {
        console.log(error);
        let mess = error.error.mess;
        this.createModal(mess.msg || mess)
      });
  }
  async getLog(data) {
    let AccountLog = new Parse.Query('AccountLog')
    let res = await AccountLog.get(data.paylog)
    return res;
  }
  setRefundTradeNo(log) {
    let now = new Date()
    let tradeNo =
      'C' +
      log.get("fromName") +
      String(now.getFullYear()) +
      (now.getMonth() + 1) +
      now.getDate() +
      now.getHours() +
      now.getMinutes() +
      now.getSeconds() +
      now.getMilliseconds()
    return tradeNo
  }
  async changeStatus(status) {
    // 服务端已修改refundlog的status状态，还需需修改refund、accountlog状态
    await this.changeRefund(status)
    await this.changeAccLog(status)
    this.refund = null;
  }
  async changeRefund(status) {
    let Refund = new Parse.Query('Refund')
    let res = await Refund.get(this.refund.objectId)
    if (res && res.id) {
      res.set("isRefund", status)
      let datas = await res.save()
      console.log(datas)
    }
  }
  async changeAccLog(status) {
    let AccLog = new Parse.Query('AccountLog')
    let acclog = await AccLog.get(this.refund.paylog)
    if (acclog && acclog.id) {
      acclog.set("isback", status)
      let res = await acclog.save()
      console.log(res)
      this.message.success("订单状态修改成功")
    }
  }
  createModal(msg): void {
    const modal = this.modal.create({
      nzTitle: '提示',
      nzContent: msg,
      nzOnOk: () => modal.destroy(),
      nzOnCancel: () => modal.destroy(),
      nzCancelText: null,
      nzOkText: '确认',
      // nzClosable: false,
      nzMaskClosable: false,
      // nzOkText: null,
    });

  }
}
