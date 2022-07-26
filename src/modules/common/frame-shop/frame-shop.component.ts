import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { catchError } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { resolve } from 'dns';

@Component({
  selector: 'app-frame-shop',
  templateUrl: './frame-shop.component.html',
  styleUrls: ['./frame-shop.component.scss']
})
export class FrameShopComponent implements OnInit {
  /*
   * 基于IFrame的人人商城快捷访问组件
   *
   *
  */
  hostUrl:string
  targetUrl:SafeResourceUrl

  /* 检测微擎连接状态
  */

 isWe7Login:boolean
 we7user = {
   username:"vbank",
   password:"Vbank777"
 }

  constructor(private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient,
    ) { 
    this.hostUrl = location.origin
    if(location.hostname == "localhost"){
      this.hostUrl = "https://cloud.futurestack.cn"
    }
    this.route.paramMap.subscribe(params=>{

      this.loginWe7Window().then(data=>{

        let r = params.get("shopRoute");

        let shopUrl = this.hostUrl + '/weadmin/web/index.php?c=site&a=entry&m=future_shopv2&do=web'
        let shopRoute = ''
        if(r && r !=''){
          shopRoute = `&r=${r}`;
        }
        let rawUrl = shopUrl + shopRoute;
        this.targetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);

      })
      // this.loginWe7()

      

    })
    
  }

  ngOnInit() {
  }

  loginWe7Window(){
    return new Promise((res,rej)=>{
        
      if(window.localStorage.getItem("isShopLogged")){
        return res(true)
      }
      let loginUrl =  this.hostUrl + "/weadmin/web/novalogin.ctrl.php?username=vbank&password=Vbank777&referer=/web/nova.html?type=login";
      let loginWin:any = window.open('about:blank',"_blank","top=200, left=400, width=200,height=100,location=no,status=no,scrollbars=no,menubar=no,titlebar=no,toolbar=no");
      loginWin.location.href = loginUrl;
      setTimeout(()=>{
        loginWin.close();
        window.localStorage.setItem("isShopLogged","true")
        return res(loginWin.closed)
      }, 3000)
    })
    
  }

}
