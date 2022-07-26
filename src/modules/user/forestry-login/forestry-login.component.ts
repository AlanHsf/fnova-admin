import * as Parse from "parse";
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-forestry-login',
  templateUrl: './forestry-login.component.html',
  styleUrls: ['./forestry-login.component.scss']
})
export class ForestryLoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  passwordVisible: boolean   //显示/隐藏密码

  constructor
    (private router: Router,
      private app: AppService,
      private message: NzMessageService) {
    window.localStorage.clear()
  }
  adminArr: any = {
    dongbei: {
      password: 'dongbei123',
      match_place_value: '1'
    },
    beijing: {
      password: 'beijing123',
      match_place_value: '2'
    },
    xibei: {
      password: 'xibei123',
      match_place_value: '3'
    },
    nanjing: {
      password: 'nanjing123',
      match_place_value: '4'
    },
    fujian: {
      password: 'fujian123',
      match_place_value: '5'
    },
    huanan: {
      password: 'huanan123',
      match_place_value: '7'
    },
    liaoning: {
      password: 'liaoning123',
      match_place_value: '8'
    },
    guangxi: {
      password: 'guangxi123',
      match_place_value: '9'
    },
    yaoboyuan: {
      password: 'yaoboyuan123',
      match_place_value: '10'
    }
  }
  loginWithAccess() {
  //  return
  //  console.log(this.adminArr)
  //  if (this.app.configs[this.username] && (this.app.configs[this.username].password === this.password)) {
  //    // 总管理员登录
  //    this.app.setTitle(this.app.configs[this.username].title)
  //    this.app.modules = this.app.configs[this.username].modules
  //    this.app.isLoggedIn = "1"
  //    // this.app.company = '2D7H18tfjU'
  //    this.app.rootPage = this.app.configs[this.username].rootPage
  //    this.app.company = this.app.configs[this.username].company
  //    this.message.success("管理员登录")
  //    this.router.navigate([this.app.redirectUrl]);
  //  } else if (this.adminArr[this.username] && (this.adminArr[this.username].password === this.password)) {
  //    //  各赛点管理员登录
  //    console.log(this.adminArr[this.username].match_place_value)
  //    this.app.isLoggedIn = "1"
  //    this.app.modules = ["forestry-judge"]
  //    this.app.company = '2D7H18tfjU'
  //    this.app.setTitle("林业大赛管理系统")
  //    window.localStorage.setItem("match_place_admin", this.adminArr[this.username].match_place_value)
  //    this.router.navigate(['forestry-judge/enter-name-list']);
  //    this.message.success("登录成功")

  //  }
  //  else {
  //    new Parse.Query("Forestry_judge").equalTo("username", this.username).equalTo("password", this.password).select('username', '').first().then(data => {
  //      console.log(data)
  //      if (data) {
  //        this.app.isLoggedIn = "1"
  //        this.app.modules = ["forestry-judge"]
  //        this.app.setTitle("林业大赛管理系统")
  //        this.app.company = '2D7H18tfjU'
  //        window.localStorage.setItem("judge", data.id)

  //        this.router.navigate(['forestry-judge/enter-name-list']);
  //        this.message.success("登录成功")
  //      } else {
  //        this.message.error("账号密码不匹配")
  //      }
  //    })
  //  }
  }

  enter(e) {
    if (e.keyCode == 13) {
      this.loginWithAccess()
    }
  }
  ngOnInit() {
  }

}
