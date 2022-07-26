import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
@Component({
  selector: 'app-apig-allot',
  templateUrl: './apig-allot.component.html',
  styleUrls: ['./apig-allot.component.scss']
})
export class ApigAllotComponent implements OnInit {
  constructor(private activeRoute: ActivatedRoute, private http: HttpClient, private message: NzMessageService
  ) { }
  company: string = '';
  apigs: any = [];
  authComp: string = '';
  api: string = '';
  apiInfo: any;
  count: number = 10;// 分配余量
  authCount: number = 0;// 接口剩余调用次数
  authInfo: any;// 接口权限
  rechargeAuth: any;// 待充值接口权限
  childComps: any = [];// 子公司
  loading: boolean = true;// 加载中
  allotModal: boolean = false;// 分配接口调用次数弹窗
  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(async (params) => {
      this.company = localStorage.getItem("company")
      this.authInfo = await this.getAuthById(params.get("PobjectId"))
      this.apiInfo = this.authInfo.get("api")
      this.api = this.authInfo.get("api").id
      this.childComps = await this.getChildComps(this.company)
    })
  }
  async getAuthById(id) {
    let APIGAuth = new Parse.Query("APIGAuth")
    APIGAuth.include("api")
    APIGAuth.get(id)
    return await APIGAuth.first()
  }
  async getChildComps(id) {
    let queryComp = new Parse.Query("Company")
    queryComp.equalTo("company", id)
    queryComp.select("name")
    let comps = await queryComp.find()
    if (comps && comps.length) {
      for (let index = 0; index < comps.length; index++) {
        let comp = comps[index];
        let auth = await this.getApigAuth(comp.id)
        comps[index]['auth'] = auth
      }
    }
    this.loading = false;
    return comps
  }
  async getAPIG() {
    let APIG = new Parse.Query("APIG")
    let apigs = await APIG.find()
    if (apigs && apigs.length) {
      this.apigs = apigs;
    }
  }
  /* 获取该公司可分配余量 */
  estAllotCount(comp) {
    let count = this.authInfo.get("count");
    if (count) {
      this.authComp = comp;
      this.allotModal = true;
    } else {
      this.message.error("当前可分配余量不足，请先充值")
    }
  }
  /* 分配接口余量 */
  async allotAPIGAuth() {
    /* 1、生成 ApigRecharge  */
    let recharge = await this.saveRecharge(this.company, this.authInfo, -this.count)
    let recharge2 = await this.saveRecharge(this.authComp, this.authComp['auth'], this.count)
    /* 2、修改主公司、被分配公司ApigAuth 余量    */
    if (recharge && recharge2) {
      this.authInfo.increment("count", -this.count)
      this.authInfo = await this.authInfo.save()
      let allotAuth = this.authComp['auth']
      allotAuth.increment("count", this.count)
      await allotAuth.save()
      this.message.success("分配成功")
      this.allotModal = false;
    }
  }
  async getApigAuth(authComp = this.authComp) {
    let Auth;
    Auth = new Parse.Query("APIGAuth")
    Auth.equalTo("company", authComp)
    Auth.equalTo("api", this.api)
    let auth = await Auth.first()
    if (auth && auth.id) {
      return auth;
    }
  }
  /* 生成接口调用权限 */
  async saveAuth(comp) {
    this.loading = true;
    let Auth = Parse.Object.extend("APIGAuth")
    let auth = new Auth()
    auth.set("count", 0)
    auth.set("noticeCount", 1000)
    auth.set("api", {
      className: "APIG",
      __type: "Pointer",
      objectId: this.api
    })
    auth.set("company", {
      className: "Company",
      __type: "Pointer",
      objectId: comp.id
    })
    auth.set("used", 0)
    comp['auth'] = await auth.save()
    this.loading = false;
  }
  /* 生成接口充值分配记录 */
  async saveRecharge(authComp, auth, count) {
    let Recharge = Parse.Object.extend("APIGRecharge")
    let recharge = new Recharge()
    recharge.set("company", {
      className: "Company",
      __type: "Pointer",
      objectId: this.company
    })
    recharge.set("apigauth", {
      className: "APIGAuth",
      __type: "Pointer",
      objectId: auth.id
    })
    recharge.set("authComp", {
      className: "Company",
      __type: "Pointer",
      objectId: authComp
    })
    recharge.set("api", {
      className: "APIG",
      __type: "Pointer",
      objectId: this.api
    })
    recharge.set("oldCount", auth.get("count"))
    recharge.set("rechargeCount", count)
    recharge.set("newCount", auth.get("count") + count)
    let data = await recharge.save()
    return data;

  }
}
