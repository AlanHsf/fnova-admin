import { Injectable } from '@angular/core';
import * as Parse from "parse";
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;
  constructor(private router: Router,private message: NzMessageService) {

  }
  // login(): Observable<boolean> {
  //   return of(true).pipe(
  //     delay(1000),
  //     tap(val => this.isLoggedIn = true)
  //   );
  // }

   login(username, password) {
     return new Promise((resolve,reject)=>{
        
       Parse.User.logIn(username, password).then( data => {
        // 如果直接进login页面，redirectUrl为undefined 导航至首页
        let id = data.id;
        //判断是否是公司的笔记用户
        // let MyUserId = new Parse.Query("_User")
        // MyUserId.equalTo("username",username)
        // MyUserId.equalTo("company","1AiWpTEDH9")
        console.log(data)

        if(data.get("company") && data.get("company").id =="1AiWpTEDH9"){
          console.log(this.redirectUrl)
          // if(this.redirectUrl == undefined){
            this.redirectUrl = this.redirectUrl  ? this.redirectUrl : "notespace/note-center"
  
          // }
          // 此处使用localStorage存储 定向的url  存进去的时候，就已经走了外部的跳转路由函数 所以会报错  
          // localStorage.setItem("redirectUrl",this.redirectUrl)
          // this.router.navigate([this.redirectUrl]);
          data["url"] = this.redirectUrl
          console.log(123, data)
          resolve(data)
        }else{
          this.message.create("error", "非笔记用户");
        }
       
      }).catch(err => {
        console.error(err)
        reject({ message: "账号或密码错误" })
     })
    })
  }

  logout(): void {
    this.redirectUrl ="notespace/note-center";
    localStorage.removeItem('profile')
    Parse.User.logOut().then(user=>{
      this.router.navigate(["notespace/note-login"]);
    });
  }
}