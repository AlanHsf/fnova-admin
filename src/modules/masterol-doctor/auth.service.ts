import { Injectable } from '@angular/core';
import * as Parse from "parse";
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;
  constructor(private router: Router) {

  }
  // login(): Observable<boolean> {
  //   return of(true).pipe(
  //     delay(1000),
  //     tap(val => this.isLoggedIn = true)
  //   );
  // }
  authMobile(mobile, password?,nickname?, code?, register?) {
    return new Promise((resolve, reject) => {
      let c = localStorage.getItem("company");
      console.log(c);
      return  Parse.Cloud.run("auth_mobile", { c: c, mobile: mobile, password: password, code: code, register: register,nickname:nickname }).then(authData => {
        // let current = Parse.User.current();
        // if(current && current.id){ // 当用户存在时候，只设置copenid，不直接登录
        //   return true;
        // }  
        if(authData && !authData.id){
          throw new Error(authData.message);
        }
        if(authData && authData.id){
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
              this.redirectUrl = this.redirectUrl ? this.redirectUrl : "masterol-doctor/student-center"
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
        // Code错误后抹除Code
        // let h = window.location;
        // window.history.pushState(null, null, h.protocol + "//" + h.hostname + h.pathname);
        // 跳转重新验证
        // this.clearReWechat(c);
        return false
      });
      
    })
  }
   login(username, password) {
     return new Promise((resolve,reject)=>{
        
       Parse.User.logIn(username, password).then( data => {
        // 如果直接进login页面，redirectUrl为undefined 导航至首页
        let id = data.id;

        console.log(id)
        console.log(this.redirectUrl)
        if(this.redirectUrl && this.redirectUrl.indexOf('masterol-doctor/student-center')){
          this.redirectUrl = "masterol-doctor/student-center"
        }
        // if(this.redirectUrl == undefined){
          this.redirectUrl = this.redirectUrl  ? this.redirectUrl : "masterol-doctor/student-center"
        // }
        // 此处使用localStorage存储 定向的url  存进去的时候，就已经走了外部的跳转路由函数 所以会报错  
        // localStorage.setItem("redirectUrl",this.redirectUrl)
        // this.router.navigate([this.redirectUrl]);
        data["url"] = this.redirectUrl
        resolve(data)
      }).catch(err => {
        console.error(err)
        reject({ message: "无此用户信息，请先在小程序登录" })
     })
    })
  }

  logout(type): void {
    localStorage.removeItem('profile')
    localStorage.removeItem('logo')
    let cid
    if(localStorage.getItem('company') == 'sWojJgvO3B') {
      cid = localStorage.getItem('company')
    }
    localStorage.removeItem('company')
    if(type == 'notSession'){
      if(cid) {
        this.router.navigate(["masterol-doctor/student-login", {c: cid }]);
      } else {
        this.router.navigate(["masterol-doctor/student-login"]);
      }
    }
    this.redirectUrl ="masterol-doctor/student-center";
    localStorage.removeItem('profile')
    Parse.User.logOut().then(user=>{
      if(localStorage.getItem('company') == 'sWojJgvO3B') {
        this.router.navigate(["masterol-doctor/student-login", {c: localStorage.getItem('company') }]);
      }
      this.router.navigate(["masterol-doctor/student-login"]);
    });
  }
}