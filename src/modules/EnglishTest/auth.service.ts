import { Injectable } from '@angular/core';
import * as Parse from "parse";
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;
  constructor(private router: Router, private message: NzMessageService) {
  }
  login(username, password) {
    return new Promise((resolve, reject) => {
      Parse.User.logIn(username, password).then(data => {
        // 如果直接进login页面，redirectUrl为undefined 导航至首页
        let id = data.id;
        console.log(data, data.get('company').id);

        let APP_DEFAULT_COMPANY = localStorage.getItem("APP_DEFAULT_COMPANY");
        if (data.get('company').id == APP_DEFAULT_COMPANY) {
          this.redirectUrl = this.redirectUrl ? this.redirectUrl : "musicpay/mc/home"
          data["url"] = this.redirectUrl
          console.log(data)
          resolve(data)
        } else {
          throw new Error('非该项目账套!');
        }

      }).catch(err => {
        if (err.toString().indexOf('非该项目账套')) {
          reject({ message: "非该项目账套" })
          return
        }
        reject({ message: "账号或密码错误" })


      })
    })
  }
  authMobile(mobile, password?, nickname?, code?, register?) {
    return new Promise((resolve, reject) => {
      let c = localStorage.getItem("company");
      console.log(c);
      return Parse.Cloud.run("auth_mobile", { c: c, mobile: mobile, password: password, code: code, register: register, nickname: nickname }).then(authData => {
        // let current = Parse.User.current();
        // if(current && current.id){ // 当用户存在时候，只设置copenid，不直接登录
        //   return true;
        // }
        console.log(authData);
        if (authData && !authData.id) {
          throw new Error(authData.message);
        }
        if (authData && authData.id) {
          let sessionToken = authData.get('sessionToken');
          return Parse.User.become(sessionToken).then(async data => {
            console.log(data)
            data.set("company", { "__type": "Pointer", "className": "Company", objectId: localStorage.getItem("company") });
            await data.save();
            // 成功登陆后，抹除code
            // let h = window.location;
            // window.history.pushState(null, null, h.protocol + "//" + h.hostname + h.pathname);
            // 登陆后，跳转至登陆前带参数地址
            // if(register){// 注册  退出登录状态
            //   this.logout()
            // }else {// 登录行为 登录 跳转页面
            this.redirectUrl = this.redirectUrl ? this.redirectUrl : "english/rule"
            data["url"] = this.redirectUrl
            resolve(data)
            // }

            return true
          }).catch(err => {
            console.log(err)
            // this.clearReWechat(c)
            return false
          })
        }


      }).catch(err => {
        reject(err)
        console.log(err.message)
        this.message.create("error", err.message)
        // Code错误后抹除Code
        // let h = window.location;
        // window.history.pushState(null, null, h.protocol + "//" + h.hostname + h.pathname);
        // 跳转重新验证
        // this.clearReWechat(c);
        return false
      });

    })
  }
  clearReWechat(cid) { // 清楚过期登录状态，重新登陆
    localStorage.clear(); // 清楚过期登录状态，重新登陆
    window.location.search = `c=${cid}`; // TODOLIST 此处需要通过循环清楚CODE，STATE等微信后缀，重新拼接用户的QueryParams
  }
  logout(type?): void {
    if (type == 'notSession') {
      localStorage.removeItem('profile')
      this.router.navigate(["musicpay/login"]);
    }
    this.redirectUrl = "musicpay/mc/home";
    Parse.User.logOut().then(user => {
      this.router.navigate(["musicpay/login"]);
    });
  }
}
