import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  items:Array<object> = [
    {
      title:'智慧关务服务平台',
      url:'/common/manage/WisdomShenbao;rid=QiobVqi4OR'
    },
    {
      title:'掌上物流应用平台',
      url:'/common/manage/WisdomCheliangBA;rid=K73mcwYF6L'
    },
    {
      title:'数字安防系统',
      url:'/common/manage/WisdomGoods;rid=aKhVtuRcQY'
    },
    {
      title:'运营管理中心',
      url:'/common/manage/WisdomShenpilc;rid=gWdq7nLaZ6'
    },
    {
      title:'网上办流程审批服务平台',
      url:'/wisdom/dashboard-security;type=safe;rid=G9vr2kItTV'
    },
  ]

  constructor() { }

  ngOnInit() {

  }
  
  toUrl(url) {
    console.log(url);
    window.location.href = url
  }
  openFullscreen() {
    /* 获取(<html>)元素以全屏显示页面 */
    const full: any = document.getElementById('content')
    if (full.RequestFullScreen) {
      full.RequestFullScreen()
      //兼容Firefox
    } else if (full.mozRequestFullScreen) {
      full.mozRequestFullScreen()
      //兼容Chrome, Safari and Opera等
    } else if (full.webkitRequestFullScreen) {
      full.webkitRequestFullScreen()
      //兼容IE/Edge
    } else if (full.msRequestFullscreen) {
      full.msRequestFullscreen()
    }
  }
}
