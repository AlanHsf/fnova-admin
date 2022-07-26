import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from "@angular/router";
;

@Component({
  selector: 'app-apig-list',
  templateUrl: './apig-list.component.html',
  styleUrls: ['./apig-list.component.scss']
})
export class ApigListComponent implements OnInit {

  constructor(private http:HttpClient,
    private message: NzMessageService,
    private activeRoute: ActivatedRoute,
    private router : Router) { }
  company:string = ""
  apigList = []
  isOpen:boolean = false
  openAPIG:any

  async ngOnInit() {
    this.company = localStorage.getItem('company')
    await this.getApigList()
  }
  async getApigList() {
    let url = 'https://test.fmode.cn/api/apig/list'
    this.http.post(url, {company:this.company}).subscribe((data:any) => {
      console.log(data)
      this.apigList = data.data
    },(err)=> {
      this.message.error("网络错误,请稍后重试")
    })
  }

  rechargeApig(data) {
    console.log(data)
    this.router.navigate(['/developer/simple-apigAuth',{
      PobjectId:data.aid
    }])
  }

  allotApig(data) {
    this.router.navigate(['/developer/apig-allot', {
      PobjectId:data.aid
    }])
  }

  //
  openApig(data) {
    this.isOpen = true
    this.openAPIG = data
  }

  cancleOpen() {
    this.isOpen = false
    this.openAPIG = null
  }

  confirmOpen() {
    let url = 'https://test.fmode.cn/api/apig/open'
    this.http.post(url, {company:this.company, apigId: this.openAPIG.objectId}).subscribe((data:any) => {
      console.log(data)
     if(data.code == 200){
      this.message.success("接口权限开通成功")
      this.isOpen = false
      this.openAPIG = null
      this.getApigList()
     }else {
      this.message.error("网络错误,开通失败")
      this.isOpen = false
      this.openAPIG = null
     }
    },(err)=> {
      this.message.error("网络错误,开通失败")
      this.isOpen = false
      this.openAPIG = null
    })
  }
}
