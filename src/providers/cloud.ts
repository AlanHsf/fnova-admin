import * as Parse from "parse";

import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";

import "rxjs";

/** end of Data providers */
/** Import Schemas */
import { CommonSchemas } from "./schema/common";
import { DevSchemaSchemas } from "./schema/common-schema";
import { TaxonomySchemas } from "./schema/taxonomy";
import { AppSchemas } from "./schema/app";

import { CrmSchemas } from "./schema/crm";
import { ProjectSchemas } from "./schema/project";
import { ActivitySchemas } from "./schema/activity";
import { DeviceSchemas } from "./schema/device";

import { ShopSchemas } from "./schema/shop";
import { HrSchemas } from "./schema/hr";
import { SiteSchemas } from "./schema/site";
import { RoomSchemas } from "./schema/room";
import { HR360Schemas } from "./schema/hr360";
import { SurveySchemas } from "./schema/survey";
// Fjun 测试的问卷Schemas
import { QuestionSchemas } from "./schema/question";
import { LessonSchemas } from "./schema/lesson";
// import { SurveyDashboardSchemas } from "./schema/survey-dashboard";

import { MessageSchemas } from "./schema/message";
import { DepartmentSchemas } from "./schema/structure";
import { BannerSchemas } from "./schema/banner";
import { SchemaSchemas } from "./schema/schema";
import { OrgSchemas } from "./schema/org";

import { ProductPaperSchemas } from "./schema/product-paper";
import { XiaofangSchemas } from "./schema/xiaofang";
import { VolunteerSchemas } from "./schema/volunteer";
import { PipixiaSchemas } from "./schema/pipixia";

import { UserRoleSchemas } from "./schema/common-user-role";

//diypage Schema
import { DiyPageSchemas } from "./schema/diypage";
import { NoteSchemas } from "./schema/note"

// BI Schemas
import { BIDevSchema } from "./schema/bi-dev-schema";
import { BIReportSchema } from "./schema/bi-report";
/** end of Schemas */

import { APPCONFIG } from "config/config.xiyuan";

@Injectable({
  providedIn: "root",
})
export class Cloud {
  // 未修复服务
  events: any;
  storage: any;
  // 正式
  schemas: any = {};
  config: any;
  Profile = Parse.Object.extend("Profile");
  profiles: any = [];
  profile: any;
  certifys: any = [];
  certify: any;
  Department = Parse.Object.extend("Department");
  departments: any;
  queryProfile = new Parse.Query(this.Profile);
  queryDepartment = new Parse.Query(this.Department);
  commonACL = new Parse.ACL();

  current: any = {}; //存放当前应用访问的指定对象，如current.customer
  currentRole: string;

  Notify = Parse.Object.extend("Notify");
  UserNotify = Parse.Object.extend("UserNotify");
  notify: any = {
    //存放全局消息状态及通知列表
    newCount: 0, // 是否有新消息数量，0为暂无新消息
    announce: [],
    remind: [],
    message: {},
  };

  getRoles(): Array<any> {
    let roles: Array<any> = [];
    this.config.role.forEach((item) => {
      if (item.value != "admin" && item.value != "superadmin") {
        roles.push(item);
      }
    });
    return roles;
  }
  initinfo() {
    // 加载用户Profile、Department、CommonACL数据
    let currentUser = Parse.User.current();
    console.log("Important:", currentUser);
    if (currentUser) {
      return (<any>this.setProfile())
        .then((data) => {
          if (data === "stop") return;
          return this.setDepartment();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.logout("登录已超时，请重新登陆");
    }
  }

  login(user, type?, role?) {
    this.events.publish("data:loading", "正在登陆，请稍等...");
    if (role) {
      // 记录当前角色
      this.currentRole = role;
    }
    return Parse.User.logIn(user.username, user.password).then(
      (data) => {
        this.initinfo().then((data) => {
          this.events.publish("data:dismiss");
          this.events.publish("user:login", "登陆成功。", type);
        });
      },
      (err) => {
        this.events.publish("data:dismiss");
        this.logout(err.message);
      }
    );
  }

  loginoauth(type) {
    let url = "";
    let appid = "";
    let rurl = encodeURI("http://cloud.anasit.com:81/oauth/" + type);
    switch (type) {
      case "dingtalk":
        appid = "dingoan2xrcjrpoq7kglxs";
        url =
          "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" +
          appid +
          "&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" +
          rurl;
        // this.events.publish('browser:oauth', url)
        window.location.href = url;
        break;
      case "wechat":
        appid = "";
        url =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";
        // url = url + rurl
        // this.events.publish('browser:oauth', url)
        window.location.href = url;
        break;
      case "github":
        appid = "f5112fe065b0b4c8afa8";
        url =
          "https://github.com/login/oauth/authorize?client_id=" +
          appid +
          "&redirect_uri=" +
          rurl;
        // url = url + rurl
        // this.events.publish('browser:oauth', url)
        window.location.href = url;
        break;
      default:
        break;
    }
  }

  checkoauth(search) {
    let params = this.searchParse(search);
    let name = window.location.pathname;
    name = name.split("/")[2];
    let code = params["code"];
    // start Dingtalk oauth login
    Parse.Cloud.run("oauth_gettoken", {
      name: name,
      code: code,
    }).then((data) => {
      if (data.errcode != "0") {
        console.error("获取AccessToken失败");
        return;
      }
      let authData = {
        authData: {
          id: data.openid, // IMPORTANT: This key is a must because pare-server checks for it
          access_token: data.access_token,
          openId: data.openid,
          unionid: data.unionid,
          persistent_code: data.persistent_code,
        },
      };
      Parse.User.logInWith("dingtalk", authData).then(
        (user) => {
          console.log("钉钉快捷登陆成功", user);
        },
        (error) => {
          if (error.code === (<any>Parse.Error).INVALID_SESSION_TOKEN) {
            Parse.User.logOut();
          }
          console.error(error);
        }
      );
    });
    //end of Dingtalk Auth
  }
  searchParse(search) {
    let resultObj = {};
    if (search && search.length > 1) {
      search = search.substring(1);
      let items = search.split("&");
      for (let index = 0; index < items.length; index++) {
        if (!items[index]) {
          continue;
        }
        let kv = items[index].split("=");
        resultObj[kv[0]] = typeof kv[1] === "undefined" ? "" : kv[1];
      }
    }
    return resultObj;
  }

  loginWe7(uniacid): Promise<any> {
    let currentUser = Parse.User.current().toJSON();
    console.log("Important:", currentUser);
    let host = "w.anasit.com";
    let unicid = uniacid; // 23 慧惠家便利店
    // let user = {"mobile":"","password":""}
    let url = encodeURI(
      "http://" + host + "/app/index.php?i=" + unicid + "&c=auth&a=cloud_auth"
    );

    let header = new HttpHeaders();
    header.append("Content-Type", "application/json");
    header.append("Access-Control-Allow-Origin", "*");
    let options = {
      withCredentials: true,
      headers: header,
    };
    return this.http.post(url, currentUser, options).toPromise();
  }
  showLoginButton(): boolean {
    if (Parse.User.current()) {
      return false;
    } else {
      return true;
    }
  }
  checkLogin() {
    let currentUser = Parse.User.current();
    console.log("Important:", currentUser);
    if (currentUser) {
      this.initinfo();
    } else {
      this.logout("登录已超时，请重新登陆");
    }
  }
  checkCurrentRole() {
    if (this.currentRole == "admin" || this.currentRole == "superadmin") {
      if (this.departments && this.departments.length > 0) {
        // 若已登录，跳过检查
        return;
      }
      let currentUser = Parse.User.current();
      console.log("Important:", currentUser);
      console.log("Get CurrentUserRole:", currentUser);
      if (currentUser) {
        this.initinfo().then((data) => {
          if (this.profile && this.profile.get("isAdmin") == true) {
          } else {
            this.logout("您没有权限，请联系超级管理员。", "admin");
          }
        });
      } else {
        this.logout("登录已超时，请重新登陆", "admin");
      }
    } else if (this.currentRole != "public") {
      this.checkCertify(this.currentRole).then((data) => {
        let certs: any;
        if (data) {
          certs = data;
        } else {
          certs = [];
        }
        if (certs && certs.length && certs.length > 0) {
          this.certifys = data;
          this.certify = data[0];
        } else {
          this.logout("您没有权限，请提交身份认证。", "admin");
        }
      });
    } else {
    }
  }

  checkCertify(type = "teacher") {
    if (this.certify && this.certify.length > 0) {
      // 若已登录，跳过检查
      return;
    }
    let currentUser = Parse.User.current();
    console.log("Important:", currentUser);
    if (currentUser == null) {
      return this.logout("请登录");
    }
    let q = new Parse.Query("UserCertify");
    q.equalTo("type", type);
    q.equalTo("isVerified", true);
    q.equalTo("user", currentUser.toPointer());
    q.include("depart");
    return q.find().catch((err) => {
      console.error(err);
      // return
    });
  }

  logout(msg = "已注销", type?) {
    this.profile = undefined;
    this.profiles = undefined;
    this.certify = undefined;
    this.certifys = undefined;
    return Parse.User.logOut().then((data) => {
      this.events.publish("user:logout", msg, type);
    });
  }

  signup(user) {
    this.events.publish("data:loading", "正在注册，请稍等...");
    let newuser = new Parse.User();
    newuser.set("username", user.username);
    newuser.set("password", user.password);
    newuser.set("mobile", user.mobile);
    newuser.set("email", user.email);

    newuser.signUp(null).then(
      (data) => {
        this.events.publish("data:dismiss");
        this.events.publish("user:notify", "注册成功");
        this.login(user);
      },
      (err) => {
        console.error(err);
        this.events.publish("data:dismiss");
        this.events.publish("user:notify", err.message);
      }
    );
  }

  setProfile() {
    // 前置条件：用户登陆后可获取Parse.User.current();
    if (
      this.profile &&
      this.profile.get("user").id == Parse.User.current().id
    ) {
      let p = new Promise((resolve) => {
        resolve("stop");
      });
      return p;
    }
    this.queryProfile = new Parse.Query("Profile");
    this.queryProfile.include("user");
    this.queryProfile.include("department");
    this.queryProfile.include(["department.company"]);
    this.queryProfile.equalTo("user", Parse.User.current());
    return this.queryProfile
      .find()
      .then((data) => {
        if (data.length == 0) {
          // this.logout("您没有权限，请联系超级管理员。");
          console.log("未获取到Profile工作信息，为普通用户：", data);
        }
        // 设置部门信息
        this.profiles = data;
        this.profile = data[0];
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // 默认获取当前用户Profile,若有参数则查询目标用户Profile
  getProfile(user = Parse.User.current()) {
    this.checkLogin();
    if (user.id == Parse.User.current().id) {
      let p = new Promise((resolve) => {
        resolve(this.profile);
      });
      return p;
    } else {
      this.queryProfile = new Parse.Query(this.Profile);
      this.queryProfile.equalTo("user", user);
      this.queryProfile.equalTo("company", this.profile.get("company"));
      return this.queryProfile.first();
    }
  }

  setDefaultProfile(id) {
    this.profile = this.profiles[id];
  }

  setDepartment() {
    // 前置条件：获得档案信息
    this.queryDepartment = new Parse.Query(this.Department);
    if (!this.profiles[0]) return;
    this.queryDepartment.equalTo("company", this.profiles[0].get("company"));
    return this.queryDepartment
      .find()
      .then((data) => {
        let DepartList = {};
        let departs: any = data;
        departs.forEach((depart) => {
          DepartList[depart.get("departid")] = depart;
        });
        this.departments = DepartList;
        let p = new Promise((resolve) => {
          resolve("OK");
        });
        return p;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  schemasExtend(schemas) {
    for (let key in schemas) {
      if (this.schemas.hasOwnProperty(key)) continue; //有相同的属性则略过
      if(!schemas[key].fields){
        schemas[key].fields = {} // 若fields为空或undefined，则补为{}
      }

      // 用fieldsArray覆盖原fields
      if (
        schemas[key].fieldsArray &&
        schemas[key].fieldsArray.length > 0
      ) {
        schemas[key].fields = {};
        schemas[key].fieldsArray.forEach(fitem => {
          schemas[key].fields[fitem.key] = fitem;
        });
      }

      schemas[key].fields["company"] = {
        type: "Pointer",
        targetClass: "Company",
        name: "所属账套",
        show: false
      }; //所有对象补全company字段

      this.schemas[key] = schemas[key];
    }
    return this.schemas;
  }

  constructor(private http: HttpClient) {
    // 加载基础服务器配置
    this.config = APPCONFIG;

    let sURL = localStorage.getItem("PARSE_SERVERURL");
    let appId = localStorage.getItem("PARSE_APPID");
    if(sURL){ this.config.serverURL = sURL }
    if(appId){ this.config.appId = appId }

    if (this.config.appId) {
      Parse.initialize(this.config.appId);
      if (this.config.serverURL) {
        (Parse as any).serverURL = this.config.serverURL;
      }
      if (this.config.masterKey) {
        (Parse as any).masterKey = this.config.masterKey;
        if(location.hostname == "cloud.hamukj.cn"){
          (Parse as any).masterKey = "XiSAasdkqw";
        }
      }

    }

    this.getSchemas();
    this.skipLoginIfLogged();

    // 若已登录，则直接进入主界面

    // // 获取当前角色
    // this.storage.get("currentRole").then(data=>{
    //   if(data){
    //     this.currentRole = data
    //   }
    // }).catch(err=>{
    //   this.logout(null, 'admin')
    //   console.error(err)
    // })

    // // 加载用户Profile、Department、CommonACL数据
    // this.initinfo()
  }

  async getSchemas(){
    // 云端加载Schema
    if(this.schemas&&Object.keys(this.schemas).length>0){
      return this.schemas;
    }else{
      let query = new Parse.Query("DevSchema");

      query.limit(500);
      let schemaList = await query.find();
      let CloudSchema = {}
      schemaList.forEach(sitem=>{
        let json = sitem.toJSON();
        json.className = json.schemaName;
        CloudSchema[sitem.get("schemaName")] = json;
      })
      this.schemasExtend(CloudSchema);
      return this.schemas
    }
  }
  skipLoginIfLogged() {
    // 若用户未登录，返回
    let currentUser = Parse.User.current();
    if (!currentUser) return;

    // 若已登陆，判断是否权限超时
    let sessionToken = currentUser.get("sessionToken");
    Parse.User.become(sessionToken).then(
      function (user) {
        // this.events.publish("user:login")
      },
      function (error) {
        return;
      }
    );
  }
}
