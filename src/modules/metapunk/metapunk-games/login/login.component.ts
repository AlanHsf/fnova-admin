import { Component, OnInit } from '@angular/core';
import { AuthService } from "../user/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as Parse from "parse";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  company:any
  active: any = 'login'
  tips: any = ''
  //登录
  loginInfo: any = {
    mobile: '',
    password: '',
    code: ''
  }
  // 注册
  registerInfo: any = {
    mobile: '',
    code: '',
    password: '',
    confirmPassword: '',
    invite: ''
  }
  // 忘记密码
  reset: any = {
    mobile: '',
    code: '',
    password: '',
    confirmPassword: ''
  }
  type: string = "password";
  spin:any = false
  //验证码
  vcode:string = ''
  success:boolean

  constructor(
    public authServ: AuthService,
    private router: Router,
    private http : HttpClient,
    private activatRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    localStorage.setItem("company", '6eH5QiIs8H')
    localStorage.setItem("APP_DEFAULT_COMPANY", '6eH5QiIs8H')
    this.company = localStorage.getItem('company')
    this.authServ.logout()
    this.activatRoute.paramMap.subscribe(async (params) => {
      let type = params.get('type')
      if(type) this.active = type
    })
  }

  onChang(value) {
    this.tips = ''
    this.success = false
    this.active = value
  }

  //登录
  async toLogin() {
    this.tips = ''
    let type = this.type
    if (type == 'password') {
      if (this.loginInfo.mobile == undefined || this.loginInfo.mobile == '') {
        this.tips = '请输入手机号'
        return
      }
      let a = /^1[3456789]\d{9}$/;
      console.log(this.loginInfo.mobile)
      if (!String(this.loginInfo.mobile).match(a)) {
        this.tips = '请填写正确手机号'
        return;
      }
      if (this.loginInfo.password == '' || this.loginInfo.password.trim == '') {
        this.tips = '请填写密码'
        return;
      }
      this.spin = true
      let company = localStorage.getItem("company");
      let User = new Parse.Query("_User")
      User.equalTo("company", company)
      User.equalTo("mobile", String(this.loginInfo.mobile))
      User.first().then(async res => {
        if (res && res.id) {
          console.log(res.get("username"))
          let username = res.get("username")
          this.authServ.login(username, this.loginInfo.password)
            .then(value => {
              setTimeout(() => {
                this.spin = false
                this.router.navigate([value['url']])
              }, 1500);
            })
            .catch(async err => {
              this.spin = false
              this.tips = err.message
            })
        } else {
          this.spin = false
          this.tips = '账户不存在'
        }
      })
    }
  }

  //获取验证码
  wait: number = 60;
  waitStatus: boolean = false;
  async sendVerifyCode(mobile) {
    this.tips = ''
    if (mobile == undefined) {
      this.tips = '请输入手机号'
      return;
    }
    let a = /^1[3456789]\d{9}$/;
    if (!String(mobile).match(a)) {
      this.tips = '请填写正确手机号'
      return;
    }
    let headers: HttpHeaders = new HttpHeaders({});
    headers.append("Content-Type", "application/json");
    headers.set('Access-Control-Allow-Origin','*')
    this.http
    .post("https://server.fmode.cn/api/apig/message", {
      company: this.company,
      mobile: String(mobile),
    },{headers})
    .subscribe((res: any) => {
      this.waitStatus = true;
      this.time();
      this.vcode = res.data.code
      this.success = true
      this.tips = '验证码已发送'
    })
  }
  time() {
    if (this.wait == 0) {
      this.waitStatus = false;
      this.wait = 60;
    } else {
      this.waitStatus = true;
      this.wait--;
      setTimeout(() => {
        this.time();
      }, 1000);
    }
  }


  //注册
  async onRegister() {
    this.success = false
    if (this.registerInfo.mobile == undefined) {
      this.tips = '请输入手机号'
      return;
    }
    let a = /^1[3456789]\d{9}$/;
    if (!String(this.registerInfo.mobile).match(a)) {
      this.tips = '请填写正确手机号'
      return;
    }
    if (this.registerInfo.code == undefined || this.registerInfo.code == '') {
      this.tips = '请输入验证码'
      return;
    }
    if (this.registerInfo.password == undefined || this.registerInfo.password.trim() == "") {
      this.tips = '请输入密码'
      return;
    }
    if (this.registerInfo.password.length < 6) {
      this.tips = '密码长度不得小于6位'
      return;
    }
    if (this.registerInfo.password.length.length > 20) {
      this.tips = '密码长度不得大于20位'
      return;
    }
    if (this.registerInfo.confirmPassword == undefined || this.registerInfo.confirmPassword.trim() == "") {
      this.tips = '请确认密码'
      return;
    }
    if (this.registerInfo.confirmPassword < 6 || this.registerInfo.password.trim() != this.registerInfo.confirmPassword.trim()) {
      this.tips = '密码不一致'
      return;
    }

    let data = this.registerInfo.invite ? {
      company: this.company,
      code: this.registerInfo.code,
      mobile:String(this.registerInfo.mobile),
      password: this.registerInfo.password,
      invite: this.registerInfo.invite
    }
      :
      {
        company: this.company,
        code: this.registerInfo.code,
        mobile: String(this.registerInfo.mobile),
        password: this.registerInfo.password
      }
    this.spin = true
    this.http
      .post(`https://server.fmode.cn/api/auth/register`, data).pipe(
        catchError(async (e) => { // 显示报错
          console.log(e);
          this.spin = false
          this.tips = e.error.mess
          return
        })
      ).subscribe(async (res: any) => {
        console.log(res)
        if (res && res.code == 200) {
          // this.tips = res.msg
          this.registerInfo = {
            mobile: '',
            code: '',
            password: '',
            confirmPassword: '',
            invite: ''
          }
          setTimeout(() => {
            this.spin = false
            this.success = true
            this.tips = '注册成功'
          }, 1000);
        } else {
          this.spin = false
          console.log(res);
          this.tips = '服务器繁忙！'
        }
      })
  }

  //重置密码
  async resetPassword(){
    this.success = false
    if (this.reset.mobile == undefined) {
      this.tips = '请输入手机号'
      return;
    }
    let a = /^1[3456789]\d{9}$/;
    if (!String(this.reset.mobile).match(a)) {
      this.tips = '请填写正确手机号'
      return;
    }
    if(this.reset.code == undefined || this.reset.code ==''){
      this.tips = '请输入验证码'
      return;
    }
    if (this.reset.password == undefined || this.reset.password.trim() == "") {
      this.tips = '请输入密码'
      return;
    }
    if (this.reset.password.length < 6) {
      this.tips = '密码长度不得小于6位'
      return;
    }
    if (this.reset.password.length.length > 20) {
      this.tips = '密码长度不得大于20位'
      return;
    }
    if (this.reset.confirmPassword == undefined || this.reset.confirmPassword.trim() == "") {
      this.tips = '请确认密码'
      return;
    }
    if (this.reset.confirmPassword < 6 || this.reset.password.trim() != this.reset.confirmPassword.trim()) {
      this.tips = '密码不一致'
      return;
    }
    let headers: HttpHeaders = new HttpHeaders({});
    headers.append("Content-Type", "application/json");
    headers.set('Access-Control-Allow-Origin','*')
    this.spin = true
    this.http
      .post(`https://server.fmode.cn/api/auth/reset_password`, {
        company:this.company,
        code:this.reset.code,
        mobile:String(this.reset.mobile),
        password:this.reset.password
      },{headers}).pipe(
        catchError(async (e) => { // 显示报错
          console.log(e)
          this.tips = e.error.mess
          return
        })
      ).subscribe(async(res: any) => {
          console.log(res)
          if(res&&res.code == 200) {
            setTimeout(() => {
              this.spin = false
              this.success = true
              this.tips = '修改密码成功'
            }, 1000);
          }else{
            console.log(res);
            this.spin = false
            this.tips = '服务器繁忙！'
          }
      })
  }
}
