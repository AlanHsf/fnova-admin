import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as Parse from "parse";
import { HttpClient } from "@angular/common/http";
import { NzMessageService } from "ng-zorro-antd/message";
declare var QRCode: any;
@Component({
  selector: "app-simple-apig-auth",
  templateUrl: "./simple-apig-auth.component.html",
  styleUrls: ["./simple-apig-auth.component.scss"],
})
export class SimpleApigAuthComponent implements OnInit {
  apigAuthId: any;
  apig: any;
  codeLink: string;
  company: any;
  department: any;
  user: any;
  tradeNo: string;

  index: number = 0;
  price: number = 0;

  count: number;
  oldCount: number;

  codeModal: boolean;
  sucessModal: boolean = false;
  timer: any; //定时器
  order:any  // 创建的待支付订单

  @ViewChild("custom", { static: false }) custom: any;

  constructor(private activRoute: ActivatedRoute, private http: HttpClient, private message: NzMessageService) { }
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe((params) => {
      this.apigAuthId = params.get("PobjectId");
      this.company = localStorage.getItem("company");
      this.department = localStorage.getItem("department");
      console.log(this.company);
      this.user = Parse.User.current();
      this.getAuth();
    });
  }

  async getAuth() {
    let url = 'https://test.fmode.cn/api/apig/getApig'
    this.http.post(url, { authid: this.apigAuthId }).subscribe((data: any) => {
      console.log(data)
      this.apig = data.data
    }, (err) => {
      this.message.error("网络错误,请稍后重试")
    })
  }

  changeRadio(index) {
    this.index = index;
  }

  async showCodeModal(type) {
    switch (type) {
      case 'wxpay':
        this.wxPay();
        break;
      default:
        break;
    }
  }

  async wxPay() {
    this.tradeNo = this.setTradeNo()
    console.log(this.company, this.tradeNo);
    let title = this.apig.title;
    let params = {
      "company": "1AiWpTEDH9",
      "out_trade_no": this.tradeNo,
      "total_fee": +this.apig.priceStep[this.index].price,
      "body": title + "接口充值"
    };
    try {
      let _this = this;
      Parse.Cloud.run("pay_code2", params).then(async (res) => {
        await this.setOrder('wxpay', params)
        let nonce_str = res.nonce_str;
        this.codeLink = res.code_url[0];
        this.codeModal = true;
        // 定时查询订单支付状态
        _this.timer = setInterval(function () {
          let info = {
            out_trade_no: _this.tradeNo,
            nonce_str: nonce_str,
            company: "1AiWpTEDH9"
          };
          console.log(info);
          Parse.Cloud.run("order_status2", info)
            .then(async (res) => {
              if (res.status && res.status[0] == "SUCCESS") {
                clearInterval(_this.timer);
                await _this.saveRecharge()
                _this.message.success("支付成功")
                _this.codeModal = false;
                _this.sucessModal = true;
              }
            })
            .catch((err) => {
            });
        }, 3000);
      });
    } catch (error) {
      alert(error);
    }
  }

  // 存支付记录
  async setOrder(type, params) {
    let url = 'https://test.fmode.cn/api/apig/created-apigorder'
    this.http.post(url,
      {
        fcompany: this.company,
        type: type,
        authid: this.apigAuthId,
        params: params,
        apigid: this.apig.objectId,
        oldCount: this.apig.count,
        count: this.apig.priceStep[this.index].count,
      }).subscribe((data: any) => {
        this.order = data.data
      }, (err) => {
        this.message.error("网络错误,订单创建失败")
      })
  }

  setTradeNo() {
    let now = new Date();
    let tradeNo =
      "C" + this.company +
      String(now.getFullYear()) +
      (now.getMonth() + 1) +
      now.getDate() +
      now.getHours() +
      now.getMinutes() +
      now.getSeconds() +
      now.getMilliseconds();
    return tradeNo;
  }


  cancelPush(type) {
    switch (type) {
      case "code":
        this.codeModal = false;
        clearInterval(this.timer);
        break;

      default:
        this.sucessModal = false;
        break;
    }
  }

  async saveRecharge() {
  let url = 'https://test.fmode.cn/api/apig/saveRecharge'
  this.http.post(url,
    {
      authComp: this.company,
      authid: this.apigAuthId,
      apigid: this.apig.objectId,
      oldCount: this.apig.count,
      count: this.apig.priceStep[this.index].count,
      orderid: this.order.id
    }).subscribe((data: any) => {
      console.log(data)
      this.apig = data.data
    }, (err) => {
      this.message.error("网络错误,请稍后重试")
    })
  }
}
