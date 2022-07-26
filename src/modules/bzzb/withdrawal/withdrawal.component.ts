import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient } from "@angular/common/http";
import { NzMessageService } from 'ng-zorro-antd/message';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as Parse from "parse";
import { AppService } from "../../../app/app.service";

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.scss']
})
export class WithdrawalComponent implements OnInit {

  constructor() { }
  pageType: string = 'comp';// 页面展示内容
  pageIndex: number = 1;
  pageSize: number = 10;
  isLoading: boolean = true;
  total: number = null;
  isOkLoading = false;
  values: string = "订单编号";
  value: string = "";
  list: any = [];

  ngOnInit(): void {
    this.getqueryOrder()
  }
  async goDetail(data) {
    console.log(data.isVerified);
    let id = data.objectId
    console.log(data.objectId);
    let UserAgentWithdraw = new Parse.Query("UserAgentWithdraw")
    let userAgentWithdraw = await UserAgentWithdraw.get(id)
    userAgentWithdraw.set("isVerified", data.isVerified)
    await userAgentWithdraw.save()
    await this.getqueryOrder()
  }
  async getqueryOrder() {
    let UserAgentWithdraw = new Parse.Query("UserAgentWithdraw");
    UserAgentWithdraw.include('user')
    UserAgentWithdraw.equalTo('company', 'rg4LL7toNt');
    UserAgentWithdraw.exists('info')
    UserAgentWithdraw.descending('createdAt')
    UserAgentWithdraw.skip((this.pageIndex - 1) * this.pageSize)
    UserAgentWithdraw.limit(this.pageSize)
    let userAgentWithdraw = await UserAgentWithdraw.find()
    if (!this.total) {
      this.total = await UserAgentWithdraw.count()
      console.log(this.total);
      
    }
    let order = []
    if (userAgentWithdraw && userAgentWithdraw.length) {
      userAgentWithdraw.forEach((item) => {
        order.push(item.toJSON())
      })
      this.list = order
      console.log(this.list);
      this.isLoading = false
    }
    if (userAgentWithdraw && userAgentWithdraw.length == 0) {
      this.list = null
      console.log(this.list, 123);
    }
  }
}
