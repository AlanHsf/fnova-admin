import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { routes } from './app-routing.module';
import { Router, NavigationExtras, ActivatedRoute, UrlSegment } from '@angular/router';
import { AppService } from './app.service';
import * as Parse from "parse";
import { HttpClient } from "@angular/common/http";
import { ThemeService } from './theme.service';
import { Location } from '@angular/common';


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  triggerTemplate: any;
  routing: any = routes;
  href: any;
  origin: any;
  app: any
  isLocalDevMode: boolean = false;
  isHidden: boolean = false
  routers: any = [];
  topRouters: any = [];
  currentUser: any
  authRouters: any
  isShowNtc: boolean;
  notice: any;
  styleId: any
  routeId: any
  constructor(
    private router: Router,
    public appServ: AppService,
    private cdRef: ChangeDetectorRef,
    private themeService: ThemeService,
    private http: HttpClient,
  ) {
    this.href = location.href;
    this.origin = location.origin
    if (
      window.location.hostname.startsWith("127") ||
      window.location.hostname.startsWith("local")
    ) {
      this.isLocalDevMode = true;
    }
    if (localStorage.getItem('hiddenMenu') && localStorage.getItem('hiddenMenu') == 'true') {
      this.isHidden = true
    } else {
      this.isHidden = false
    }
    this.currentUser = Parse.User.current();


  }

  modules: any = []


  async ngOnInit() {
    this.authRouters = localStorage.getItem('authRouters')
    this.appServ.currentUser = Parse.User.current();
    if (this.appServ.modules && this.appServ.modules.length > 0) {
      this.modules = this.appServ.modules;
      this.styleId = localStorage.getItem('moduleId') ? localStorage.getItem('moduleId') : this.modules[0].objectId
      this.routeId = localStorage.getItem('routeId') ? localStorage.getItem('routeId') : this.modules[0].objectId
      this.getRoute(this.styleId)
    }
    if (JSON.parse(localStorage.getItem("routers")) && JSON.parse(localStorage.getItem("routers")).length > 0
    ) {
      let router = JSON.parse(localStorage.getItem("routers"));
      this.topRouters = router;
    }
    if (this.isLocalDevMode) {
      this.getDevModule();
    }
    this.getNotice()
  }

  // 切换主题
  toggleTheme(): void {
    this.themeService.toggleTheme().then();
  }

  getRouterLink(m, r): string {
    if (r.pageUrl) {
      return r.pageUrl;
    } else {
      return "/" + m.path + "/" + r.path;
    }
  }

  // 路由跳转
  navToRoute(m, r?) {
    let extras: NavigationExtras = {};
    if (m.get('module') && m.get('module').id == "fgDXeagbMt" && this.notice && !this.notice.log) {// 消息通知模块激活后 消息提示图标隐藏
      this.notice.log = 1;
      let noticeIcon = document.getElementById("noticeIcon");
      if (noticeIcon) {
        noticeIcon.style.display = "none";
      }
    }
    if (!r) {
      let params: any = {};
      if (m.get("pageUrl").indexOf('http') != -1) {
        window.open(m.get("pageUrl"))
      } else if (m.get("data")) {
        params = m.get("data")
        params['rid'] = m.id
        this.router.navigate([m.get("pageUrl"), params]);
      } else {
        params.rid = m.id
        this.router.navigate([m.get("pageUrl"), params]);
      }
      let isHave = false;
      if (this.topRouters) {
        this.topRouters.forEach(router => {
          if (router.title == m.get("title")) {
            isHave = true;
          }
        });
      }
      if (!isHave) {
        this.topRouters.push({
          router: m.get("pageUrl"),
          title: m.get("title"),
          data: params
        });
      }
      localStorage.setItem("routers", JSON.stringify(this.topRouters));
      localStorage.setItem("moduleId", m.get('module').id);
      localStorage.setItem("routeId", m.id);
      return;
    }

    if (r.data) {
      extras.queryParams = r.data;
    }

    this.router.navigate([this.getRouterLink(m, r)], extras);
    let isHave = false;
    if (this.topRouters) {
      this.topRouters.forEach(router => {
        if (router.title == r.title) {
          isHave = true;
        }
      });
    }
    if (!isHave) {
      this.topRouters.push({
        router: this.getRouterLink(m, r),
        title: r.title
      });
    }
    localStorage.setItem("routers", JSON.stringify(this.topRouters));
    localStorage.setItem("moduleId", m.get('module').id);
    localStorage.setItem("routeId", m.id);
  }


  getNotice() {
    this.notice = {}
    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let sql = `select "Notice"."company","Notice"."targetCompany","Notice"."createdAt","Notice"."content" ,"Notice"."objectId"
            from "Notice"
        where "Notice"."company" = '1AiWpTEDH9' and "Notice"."targetCompany" = '5beidD3ifA'
        and not exists (select "objectId" from "NoticeLog" where "NoticeLog"."notice" = "Notice"."objectId" and
        "NoticeLog"."viewer"='ohlgItDtN1')
        order by "Notice"."createdAt" desc
        limit 1`
    this.http.post(baseurl, { sql: sql })
      .subscribe(async (res: any) => {
        let data: any = res.data;
        if (data && data.length) {
          this.notice = data[0]
        }
      });
  }
  cancelPush() {
    this.isShowNtc = false;
  }
  ngAfterContentInit() {
    this.cdRef.detectChanges();
  }


  devModule: any;
  getDevModule() {
    let Module = new Parse.Query("DevModule");
    Module.equalTo("module", "developer");
    Module.first().then(res => {
      if (res && res.id) {
        this.devModule = res;
      }
    });
  }

  getModules() {

    if (Parse.User.current()) {
      if (this.modules && this.modules.length > 0) {
        return this.modules
      }
      let modules = this.appServ && this.appServ.modules
      if (modules && modules.length > 0) {
        this.modules = modules
        this.type = this.modules[0].objectId
        return this.modules
      } else {
        return []
      }
    }
  }


  set type(val: string) {
    this.styleId = val;
    this.getRoute(val);
  }

  get type(): string {
      return this.styleId;
  }
  moreModule = []
  currentModule = "1"


  openOption() {
    let modules = this.modules
    let moreModule = modules.slice(6, modules.length)
    this.moreModule = moreModule
  }
  moduleChange(e) {
    this.styleId = e
    this.getRoute(e)
  }


  moduleRouting: any = [];
  async getRoute(id?) {
    let routing = [];
    this.moduleRouting = []
    this.styleId = id
    let Route = new Parse.Query("DevRoute");
    Route.equalTo("module", id);
    Route.ascending('index')
    routing = await Route.find();
    if (this.appServ.authRoutes && this.appServ.authRoutes.length > 0) {
      this.appServ.authRoutes.forEach(router => {
        routing.forEach(r => {
          if (router == r.id) {
            this.moduleRouting.push(r)
          }
        })
      });
    } else {
      this.moduleRouting = routing;
    }
  }

  setting() {
    this.router.navigate(["/setting"]);
  }
  toRouter(item) {
    this.router.navigate([item.router, item.data]);
  }

  // 关闭标签
  closeNav(title) {
    this.topRouters = this.topRouters.filter(item => {
      return item.title !== title;
    });
    localStorage.setItem("routers", JSON.stringify(this.topRouters));
  }


  logout() {
    this.moduleRouting = []
    this.modules = []
    this.moreModule = []
    this.topRouters = []
    this.appServ.logout()
  }



}
