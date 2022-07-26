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
  
  constructor(public authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // 当前路由url
      let url: string = state.url;
      // 调用checkLogin检查是否登录
      return this.checkLogin(url);
  }
  checkLogin(url: string): boolean {
    // 如果已登录,直接跳转当前路由 跳出该函数
    let currentUser = Parse.User.current();
    if (currentUser&&currentUser.id) { return true; }
    // 否则重定向到login页面
    // console.log(this.authService.isLoggedIn)
    this.authService.redirectUrl = url;
    this.router.navigate(['/masterol-doctor/student-login']);
    return false
  }

}
