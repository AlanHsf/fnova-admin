import { Component, OnInit } from '@angular/core';
import * as Parse from "parse";
import { Router } from '@angular/router';

@Component({
  selector: 'app-seting',
  templateUrl: './seting.component.html',
  styleUrls: ['./seting.component.scss']
})
export class SetingComponent implements OnInit {

  heigth: any = document.documentElement.clientHeight - 80
  mobile:string = '13407973043'
  device_name:any = 'RedmiBook ||'
  user: any 
  account:any
  qrcode1:string = 'https://file-ciuan.fmode.cn/wxqrcode.jpg'
  qrcode2:string = 'https://file-ciuan.fmode.cn/wxqrcode.jpg'

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
    this.user = Parse.User.current()
    this.getAccount()
  }

  getAccount(){
    let res = {
      total:120
    }
    this.account = res
  }

  toUrl(value){
    console.log(value);
    this.router.navigate(["/metapunk/login",{type:value}]);
  }
}
