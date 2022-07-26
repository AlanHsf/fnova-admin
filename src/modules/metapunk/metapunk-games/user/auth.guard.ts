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
   
    let currentUser = Parse.User.current();
    let defaultCompany;
    let APP_DEFAULT_COMPANY = localStorage.getItem("APP_DEFAULT_COMPANY");
    if (APP_DEFAULT_COMPANY) {
      defaultCompany = APP_DEFAULT_COMPANY;
    }
    if(currentUser && currentUser.id){
      (currentUser as any).objectId = currentUser.id;
      
    }
   if(currentUser && currentUser.get('company').id){
    (currentUser as any).get('company').objectId = currentUser.get('company').id;
   }
     // 如果已登录当前公司账号,直接跳转当前路由 跳出该函数
    if (currentUser&& (currentUser as any).objectId && currentUser.get('company').objectId == defaultCompany) { return true; }
console.log(currentUser);

    // 否则重定向到login页面
    // console.log(this.authService.isLoggedIn)
    console.log(url);
    // this.authService.redirectUrl = (url == "/masterol/login"?undefined:url);  
    this.authService.redirectUrl = url; 
    
    if (!defaultCompany) {
      this.router.navigate(["/metapunk/login",{c:APP_DEFAULT_COMPANY}]);
      // this.router.navigate(["/masterol/second-lesson", { c: "pPZbxElQQo"}]);
    } else {
      this.router.navigate(["/metapunk/login", { c: defaultCompany }]);
      // this.router.navigate(["/masterol/second-lesson", { c: defaultCompany }]);
    }
    return false
  }
}
