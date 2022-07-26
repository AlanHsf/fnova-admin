import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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
    let profile = JSON.parse(localStorage.getItem("profile"))
    let company = localStorage.getItem("company");
    // 如果已登录当前公司账号,直接跳转当前路由 跳出该函数
    if (profile && profile.objectId && profile.department.objectId == did) {
      // 如果没有报名此次考试，没有考场  不能进入考试页面
      if (url.indexOf('/english/answer') != -1) {
        if (profile && profile.schoolClass) {
          return true;
        } else {
          this.router.navigate(["/english/login", { did: did }]);
          return false
        }
      }
      return true;
    } else {
      this.router.navigate(["/english/login", { did: did }]);
    }

    // 否则重定向到login页面
    console.log(url);
    this.authService.redirectUrl = url;
    return false
  }
}
