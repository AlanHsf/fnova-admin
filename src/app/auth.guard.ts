import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from './app.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public appService: AppService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // return true;
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let isLoggedIn = this.appService.isLoggedIn
    console.log("isLoggedIn",isLoggedIn)
    if (isLoggedIn && isLoggedIn =="1") {
      return true
    }
    console.log("LoginPath:",this.appService.loginPath)
    this.router.navigate([this.appService.loginPath]);
    return false;
  }

}
