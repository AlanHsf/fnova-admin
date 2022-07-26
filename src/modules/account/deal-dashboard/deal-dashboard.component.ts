import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import * as Parse from 'parse'

@Component({
  selector: "app-deal-dashboard",
  templateUrl: "./deal-dashboard.component.html",
  styleUrls: ["./deal-dashboard.component.scss"]
})
export class DealDashboardComponent implements OnInit {
  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.refreshAllData()
  }
  refreshAllData(){
    this.queryAccountPayCard();
    this.queryAccountPayWechat();
    this.querychuxue();
    this.queryxiaoka();
    this.queryxingxiu();
    this.queryTotal()
  }
  wechatRecharge: number = 0;
  cardRecharge: number = 0;
  async queryAccountPayCard() {
    let start = new Date(new Date().toLocaleDateString());
    let AccountPayCard = new Parse.Query("AccountLog");
    AccountPayCard.greaterThan("createdAt", start);
    AccountPayCard.equalTo("desc", "卡密充值");
    let payCard = await AccountPayCard.find();
    console.log(payCard);
    if (payCard) {
      payCard.forEach(item => {
        this.cardRecharge += item.get("assetCount");
      });
    }
    this.cdRef.detectChanges();
    console.log(this.wechatRecharge);
  }
  async queryAccountPayWechat() {
    let start = new Date(new Date().toLocaleDateString());
    let AccountWeChat = new Parse.Query("AccountLog");
    AccountWeChat.greaterThan("createdAt", start);
    AccountWeChat.equalTo("desc", "账户充值");
    let paywechat = await AccountWeChat.find();
    console.log(paywechat);
    if (paywechat) {
      paywechat.forEach(item => {
        this.wechatRecharge += item.get("assetCount");
      });
    }
    this.cdRef.detectChanges();
    console.log(this.wechatRecharge);
  }
  chuxueCount: number = 0;
  async querychuxue() {
    let start = new Date(new Date().toLocaleDateString());
    let LessonCardOrder = new Parse.Query("LessonCardOrder");
    LessonCardOrder.greaterThan("createdAt", start);
    LessonCardOrder.equalTo("price", 199);
    let lessonCardOrder = await LessonCardOrder.count();
    this.chuxueCount = lessonCardOrder;
  }
  xiaokaCount: number = 0;
  async queryxiaoka() {
    let start = new Date(new Date().toLocaleDateString());
    let LessonCardOrder = new Parse.Query("LessonCardOrder");
    LessonCardOrder.greaterThan("createdAt", start);
    LessonCardOrder.equalTo("price", 1000);
    let lessonCardOrder = await LessonCardOrder.count();
    this.xiaokaCount = lessonCardOrder;
  }

  xingxiuCount: number = 0;
  async queryxingxiu() {
    let start = new Date(new Date().toLocaleDateString());
    let LessonCardOrder = new Parse.Query("LessonCardOrder");
    LessonCardOrder.greaterThan("createdAt", start);
    LessonCardOrder.equalTo("price", 3000);
    let lessonCardOrder = await LessonCardOrder.count();
    this.xingxiuCount = lessonCardOrder;
  }
  // 查询总余额
  async queryTotal() {
    let Account = new Parse.Query('Account')
    Account.doesNotExist("balance");
    Account.select('balance')
    let account = await Account.find()
    console.log(account)
    // if(account)
  }
}
