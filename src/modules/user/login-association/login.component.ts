import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginAssociationComponent implements OnInit {

  teamname: string           //用户名
  password: string           //密码
  rempwd: boolean = false      //记住密码

  passwordVisible: boolean   //显示/隐藏密码
  constructor(
    private router: Router,
    private app: AppService,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    localStorage.clear()

    //this.app.hangout()
  }

  ngOnInit() {
  }

  loginWithAccessRight() {

    //localStorage.clear()
    //this.app.hangout()
    //return new Promise((res, rej) => {
    //  // 如果匹配到校园总帐号,直接登陆
    //  if (this.app.configs[this.teamname] && (this.app.configs[this.teamname].password === this.password)) {
    //    this.app.isLoggedIn = "1"
    //    this.app.uniacid = this.app.configs[this.teamname].uniacid
    //    this.app.modules = this.app.configs[this.teamname].modules
    //    this.app.setTitle(this.app.configs[this.teamname].title)
    //    this.app.company = this.app.configs[this.teamname].company
    //    this.app.currentRole = "admin"
    //    // this.app.company = "qvFWcjCvzH"

    //    if (this.app.configs[this.teamname].rootPage) {
    //      this.app.rootPage = this.app.configs[this.teamname].rootPage
    //    }

    //    this.router.navigate([this.app.redirectUrl]);
    //    res("OK")
    //    return
    //  } else {
    //    rej({ message: "账号或密码错误" })
    //  }

    //  // 如果匹配到社团总帐号,加载访问权限登录
    //  let company = 'qvFWcjCvzH'  // 南昌大学ID 之后需要改为变量
    //  let url = this.app.server + '/api/ndAssociation/headLogin?company=' + company + '&teamname=' + this.teamname + '&password=' + this.password
    //  this.http.get(url).subscribe(result => {
    //    let data: any = result

    //    if (data.code <= 0) {
    //      this.message.create('error', data.msg)
    //      rej({ message: "账号或密码错误" })

    //      return
    //    } else {
    //      this.app.isLoggedIn = "1"
    //      this.app.modules = ["association-member"]
    //      this.app.setTitle("社团协会信息管理系统")
    //      this.app.currentRole = "member"
    //      this.app.departmentName = this.teamname
    //      this.app.company = company
    //      this.app.department = data.data.department
    //      localStorage.setItem('审核状态', data.code)

    //      this.router.navigate(['association-manage/application']);
    //      if (data.code == 3) {
    //        this.message.create('success', data.msg)
    //      }else if(data.code == 2) {
    //        this.message.create('error', data.msg)
    //      }else{
    //        this.message.create('warning', data.msg)
    //      }
    //      res("OK")

    //    }
    //  })

    //})
  }

  con() {
    // let query = new Parse.Query('Department')
    // query.get('8zionGDJdT').then(data => {
    //   console.log(data)
    //   data.set('stutas', 3)
    //   Parse.Cloud.run("depart_save",{departJson:data.toJSON()}).then(data => {
    //     console.log(data)
    //   })
    // })
  }
  enter(e) {
    if (e.keyCode == 13) {
      this.loginWithAccessRight()
    }
  }
}
