import * as Parse from "parse";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { APPCONFIG } from "../../config/config.xiyuan";
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: "root",
})
export class AppService {
  User: any = null;
  server: string;
  boyaAdmin: string;
  college: string;
  isCollapsed: boolean = false;
  config: any;
  constructor(private router: Router, private http: HttpClient, private message: NzMessageService) {
    // 加载基础服务器配置
    this.config = APPCONFIG;
    let sURL = localStorage.getItem("PARSE_SERVERURL");
    let novaURL = localStorage.getItem("NOVA_SERVERURL");
    let appId = localStorage.getItem("PARSE_APPID");
    if (sURL) { this.config.serverURL = sURL }
    if (appId) { this.config.appId = appId }
    if (novaURL) { this.config.novaURL = novaURL }
    if (this.config && this.config.appId) {
      (Parse as any).applicationId = this.config.appId;
      if (this.config.serverURL) {
        (Parse as any).serverURL = this.config.serverURL;
      }
      if (this.config && this.config.masterKey) {
        (Parse as any).masterKey = this.config.masterKey;
        if (location.hostname == "cloud.hamukj.cn") {
          (Parse as any).masterKey = "XiSAasdkqw";
        }
      }
    }
  }
  currentUser =null

  //get currentUser(): any {
  //  let currentUser =  Parse.User.current();
  //  if(currentUser) {
  //    return currentUser;

  //  }else {
  //    this.logout()
  //  }
  //}



  get loginPath(): string {
    let loginPath = localStorage.getItem("loginPath");
    return loginPath ? loginPath : "/user/login";
  }
  set loginPath(v: string) {
    localStorage.setItem("loginPath", v);
  }

  get company(): string {
    let com = localStorage.getItem("company");
    if (com) {
      return com;
    } else {
      Parse.User.logOut();
      this.router.navigate(['/user/login'])
    }
  }
  set company(v: string) {
    localStorage.setItem("company", v);
  }

  get department(): string {
    let depart = localStorage.getItem("department");
    if (depart) {
      return depart;
    } else {
      this.department = "5BEdrX6FTk";
      return "5BEdrX6FTk";
    }
  }
  set department(v: string) {
    localStorage.setItem("department", v);
  }


  get currentRole(): string {
    let role = localStorage.getItem("currentRole");
    if (role) {
      return role;
    } else {
      this.currentRole = "public";
      return "public";
    }
  }
  set currentRole(v: string) {
    localStorage.setItem("currentRole", v);
  }

  get rootPage(): string {
    let root = localStorage.getItem("rootPage");
    if (root) {
      return root;
    } else {
      this.rootPage = "/";
      return "/";
    }
  }
  set rootPage(v: string) {
    localStorage.setItem("rootPage", v);
  }


  /*
   * 系统全局设置参数
   * title 标题
   */
  get title(): string {
    let title = localStorage.getItem("title");
    return title ? title : "后台管理系统";
  }
  set title(v: string) {
    localStorage.setItem("title", v);
    document.title = v;
  }
  //授权路由
  get authRoutes(): any {
    let authRoute = localStorage.getItem("authRoutes");
    if (authRoute && authRoute != "undefined") {
      return JSON.parse(authRoute);
    } else {
      return [];
    }
  }
  set authRoutes(v: any) {
    localStorage.setItem("authRoutes", JSON.stringify(v));
  }

  get isLoggedIn() {
    let r = localStorage.getItem("isLoggedIn");
    return r;
  }
  set isLoggedIn(v) {
    localStorage.setItem("isLoggedIn", v);
  }

  // 授权模块
  get modules(): any {
    let modules = localStorage.getItem("modules");
    return modules ? JSON.parse(modules) : [];
  }
  set modules(v: any) {
    localStorage.setItem("modules", JSON.stringify(v));
  }

  setTitle(t) {
    this.title = t;
    document.title = this.title;
  }


  login(username, password) {
    this.loginPath = '/user/login'
    let loginOnline = new Promise((res, rej) => {
      Parse.User.logIn(username, password)
        .then((data) => {
          console.log(data)
          let sessionToken = data.get('sessionToken')
          this.manageLogin(sessionToken).then((loginData:any) => {
            this.modules = loginData.modules
            this.authRoutes = loginData.routes
            this.loginPath = '/user/login'
            this.company = loginData.company
            this.currentRole = loginData.currentRole
            this.rootPage = loginData.rootPage
            this.title = loginData.title
            this.currentUser = data
            this.isLoggedIn = "1"
            if(loginData.department) {
              this.department = loginData.department
            }
            let redirectUrl =loginData.rootPage ? loginData.rootPage.split(";") : []
            let items = {};
            redirectUrl.forEach((url, i) => {
              if (i > 0) {
                let item = url.split("=");
                items[item[0]] = item[1];
              }
            });
            console.log(this.currentUser)
            this.router.navigate([redirectUrl[0], items])
          })
        }).catch((err) => {
          console.error(err);
          rej({ message: "账号或密码错误" });
        });
    });
    return Promise.race([loginOnline]);
  }

  manageLogin(sessionToken) {
    return new Promise((resolve, reject) => {
      let baseurl = "https://test.fmode.cn/api/auth/admin_user";
      this.http.post(baseurl, { sessionToken: sessionToken })
        .subscribe(async (res: any) => {
          if (res.code == 200) {
            resolve(res.data)
          } else {
            this.message.info("网络繁忙，数据获取失败")
            reject(res)
          }
        })
    })
  }



  hangout() {
  }
  // 用户退出登录

  hasAccessAuth(module) {
    let modules = this.modules;
    if (modules.indexOf(module.path) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  moduleRouting: any = [];
  // 点击对应模块显示对应的
  async getRoute(id, routers?) {
    let Route = new Parse.Query("DevRoute");
    Route.equalTo("module", id);
    let routing = await Route.find();
    if (this.authRoutes && this.authRoutes.length > 0) {
      this.authRoutes.forEach((router) => {
        routing.forEach((r) => {
          if (router.objectId == r.id) {
            this.moduleRouting.push(r);
          }
        });
      });
    } else {
      this.moduleRouting = routing;
    }
  }

  // 退出登录
  logout() {
    Parse.User.logOut().then(() => {
      let loginPath = this.loginPath
      localStorage.clear();
      localStorage.removeItem('modules');
      localStorage.removeItem('authRoutes');
      localStorage.removeItem('department');
      localStorage.removeItem('currentRole');
      localStorage.setItem("loginPath", loginPath);
      this.moduleRouting = [];
      this.modules = []
      this.router.navigate([loginPath])
    });
  }
}
