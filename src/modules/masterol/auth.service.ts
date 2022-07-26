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

   login(username, password) {
     return new Promise((resolve,reject)=>{
        
       Parse.User.logIn(username, password).then( data => {
        // 如果直接进login页面，redirectUrl为undefined 导航至首页
        let id = data.id;
        if(this.redirectUrl && this.redirectUrl.indexOf('masterol/student-center')){
          this.redirectUrl = "masterol/student-center"
        }
        
          this.redirectUrl = this.redirectUrl  ? this.redirectUrl : "masterol/student-center"
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
        this.router.navigate(["masterol/student-login", {c: cid }]);
      } else {
        this.router.navigate(["masterol/student-login"]);
      }
    }
    this.redirectUrl ="masterol/student-center";
    localStorage.removeItem('profile')
    Parse.User.logOut().then(user=>{
      if(localStorage.getItem('company') == 'sWojJgvO3B') {
        this.router.navigate(["masterol/student-login", {c: localStorage.getItem('company') }]);
      }
      this.router.navigate(["masterol/student-login"]);
    });
  }
}