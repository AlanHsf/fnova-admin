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
  login(idcard, workid ,department): Promise<any> {
    return new Promise((resolve, reject) => {
      idcard = idcard.trim();
      workid = workid.trim();
      if (idcard == '' || workid == '') {
        reject({ message: '请输入身份证号和准考证号' })
      }
      let Profile = new Parse.Query("Profile");
      Profile.equalTo("idcard", idcard);
      Profile.equalTo("workid", workid);
      Profile.equalTo("department", department);
      Profile.notEqualTo("isDeleted", true);
      Profile.include("department");
      Profile.include("schoolClass");
      Profile.include("SchoolMajor");
      Profile.first().then(profile => {
        if (profile && profile.id) {
          localStorage.setItem("profile", JSON.stringify(profile))
          localStorage.setItem("profileId", profile.id)
          localStorage.setItem("department", profile.get("department")?.id)
          // 如果直接进login页面，redirectUrl为undefined 导航至首页
          resolve(profile)
          this.redirectUrl = this.redirectUrl ? this.redirectUrl : "english/login"

          // if (profile.get("workid") == workid) {
          //   localStorage.setItem("profile", JSON.stringify(profile))
          //   localStorage.setItem("profileId", profile.id)
          //   localStorage.setItem("department", profile.get("department")?.id)
          //   // 如果直接进login页面，redirectUrl为undefined 导航至首页
          //   resolve(profile)
          //   this.redirectUrl = this.redirectUrl ? this.redirectUrl : "english/login"
          // } else {
          //   reject({ message: "请输入正确的准考证号" })
          // }
        } else {
          reject({ message: '无该考生档案' })
        }
      }).catch(err => {
        console.log(err);
        if (err.toString().indexOf('非该项目账套')) {
          reject({ message: "非该项目账套" })
          return
        }
      })
    })
  }
  logOut(): void {
    localStorage.removeItem("profileId");
    localStorage.removeItem("profile");
    this.router.navigate(["english/login", { did: localStorage.getItem("department") }]);
  }
}