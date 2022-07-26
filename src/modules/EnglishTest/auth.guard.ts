import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service'
import * as Parse from "parse";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // 当前路由url
    let url: string = state.url;
    // 调用checkLogin检查是否登录
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let did = localStorage.getItem("department");
    let currentUser = Parse.User.current();
    let defaultCompany;
    let company = localStorage.getItem("company");
    if (currentUser && currentUser.id) {
      (currentUser as any).objectId = currentUser.id;
    }
    if (currentUser && currentUser.get('company').id) {
      (currentUser as any).get('company').objectId = currentUser.get('company').id;
    }
    // 如果已登录当前公司账号,直接跳转当前路由 跳出该函数
    if (currentUser && (currentUser as any).objectId) {
      // 如果没有报名此次考试，没有考场  不能进入考试页面
      if (url.indexOf('/english/answer') != -1) {
        let profile = JSON.parse(localStorage.getItem("profile"));
        console.log(profile);
        if (profile && profile.schoolClass) {
          return true;
        } else {
          this.router.navigate(["/english/login", { did: did }]);
          return
        }
      }
      return true;
    }
    console.log(currentUser);

    // 否则重定向到login页面
    // console.log(this.authService.isLoggedIn)
    console.log(url);
    // this.authService.redirectUrl = (url == "/masterol/login"?undefined:url);  
    this.authService.redirectUrl = url;
    if (!currentUser) {
      this.router.navigate(["/english/login", { did: did }]);
    } else {
      this.router.navigate(["/english/login", { did: did }]);
    }
    return false
  }
}
