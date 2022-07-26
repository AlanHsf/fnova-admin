import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../../app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  passwordVisible
  username: string = ''
  password: string = ''

  constructor(
    public message: NzMessageService,
    public appServ: AppService,
    private router: Router
  ) { 
    // localStorage.clear()
    this.appServ.hangout()
  }
  vCode:any;
  login() {
    
    let c = this.code.toLowerCase()
    if(!this.vCode) {
      this.message.create('error',"请输入的验证码")
      return
    }
    let vc = this.vCode.toLowerCase()
    if(vc != c) {
      this.message.create('error',"请输入正确验证码")
      return
    }
    this.username = this.username.trim();
    this.password = this.password.trim();
    // localStorage.clear() 
    this.appServ.hangout()
    this.appServ.login(this.username,this.password).then(data=> {
        
    }).catch(err=> {
      this.message.create('error', err.message)
    })
  }
  hostname:any
  ngOnInit() {
    this.hostname = localStorage.getItem("hostname")
    localStorage.removeItem('hiddenMenu')
    localStorage.removeItem('modules')
    localStorage.removeItem('routers')
    localStorage.removeItem('company')
    localStorage.removeItem('department')
    localStorage.removeItem('redirectUrl')
    localStorage.removeItem('rootPage')
    localStorage.removeItem('Parse/nova/currentUser')
    localStorage.removeItem('hiddenMenu')
    this.creatCode()
  }
  enter(e) {
    if (e.keyCode == 13) {
      this.login()
    }
  }
  code:any
  creatCode() {
    this.code = ''
    let codeLength = 4;  //验证码的长度
    let codeChars = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ];
    for (let i = 0; i < codeLength; i++) {
      let charNum = Math.floor(Math.random() * 52)
      this.code += codeChars[charNum];
    }
  }
}
