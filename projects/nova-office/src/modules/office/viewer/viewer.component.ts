// import * as Parse from 'parse'
import { Component, OnInit, Input } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'nova-office-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {

  locationOrigin: any
  scheme: any
  // serverHost:any = "http://192.168.14.121:7337/api/office"
  serverHost: any = "http://server.fmode.cn:17337/api/office" // WOPI Nova云服务外网地址
  serverHostLAN: any = "http://127.0.0.1:7337/api/office" // WOPI Nova云服务在Collabora Server局域网地址（即存储机地址）
  wopiClientHost: string = "http://server.fmode.cn:9980"
  targetUrl: SafeResourceUrl

  // 文件关键参数，文件ID/用户口令
  @Input("fileId") fileId: string;
  @Input("token") token: string;

  // 用户交互，加载等待
  loading: boolean = true
  is404: boolean = false

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.locationOrigin = window.location.origin;
    this.scheme = this.locationOrigin.startsWith('https') ? 'https' : 'http';
  }

  ngOnInit(): void {

    this.actRoute.paramMap.subscribe(async paramsMap => {
      let fileId = paramsMap.get("fileId");
      let token = paramsMap.get("token");
      if (!this.fileId) {
        this.fileId = fileId
      }
      if (!this.token) {
        this.token = token
      }
      console.log(this.fileId)
      console.log(this.token)
      if (this.fileId) {
        this.openFile()
      }
    })
  }

  // 根据checkFileAndRight，检查数据库内是否有该文件，且当前用户是否有权限
  // （注意）文件及用户权限判断，服务端也会根据token，同时校验，在wopi的get接口实现
  async checkFileAndRight(wopiSrc) {
    return new Promise((resolve, reject) => {
      let tokenParamStr = this.token ? `?token=${this.token}` : "";
      this.http.get(wopiSrc + tokenParamStr).subscribe(data => {
        resolve(data)
      }, error => {
        reject(error)
      })
    })
  }

  // 根据checkServerInfo，检查Collabora服务端是否正常
  async checkServerInfo() {
    return new Promise((resolve, reject) => {

      let wopiClientHost = this.wopiClientHost

      if (!wopiClientHost) {
        alert('No server address entered');
        return;
      }
      if (!wopiClientHost.startsWith('http')) {
        alert('Warning! You have to specify the scheme protocol too (http|https) for the server address.')
        return;
      }
      if (!wopiClientHost.startsWith(this.scheme + '://')) {
        alert('Collabora Online server address scheme does not match the current page url scheme');
        return;
      }


      this.http.get(this.serverHost + "/collaboraUrl?server=" + wopiClientHost).subscribe(resp => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })

  }

  async openFile() {

    // WOPISrc=http://server.fmode.cn:9981/wopi/files/1
    // 该接口由文档服务端发起，用于读取要编辑的文件信息
    // 因此，该接口必须是文档服务端可以访问的外网地址，或者其自身的内网地址

    let wopiSrc = this.serverHost + '/wopi/files/' + this.fileId;
    // let wopiSrc = "http://server.fmode.cn:9981" + '/wopi/files/1';
    /***
     * FAQ:用FRPC代理的端口访问存储机，WS报错：Connection Closed: 1001 error: cmd=load kind=docunloading
     * 解决方案：修改frpc.ini对应的nova-server配置，以便支持websockets代理转发规则
     * privilege_mode = true
     * type = http
     */

    let resp = await this.checkServerInfo();
    if (resp && resp['url']) {

      /***
       * URL可嵌入参数详解 https://sdk.collaboraonline.com/docs/How_to_integrate.html?highlight=iframe
       * 语言：lang=zh-cn
       * 密钥：access_token=xxxxxx
       */
      let wopiClientUrl = resp['url'];
      let tokenParamStr = this.token ? `access_token=${this.token}&` : "";
      let wopiUrl = wopiClientUrl + 'lang=zh-cn&' + tokenParamStr + 'WOPISrc=' + wopiSrc;


      let fileInfo: any
      try {
        fileInfo = await this.checkFileAndRight(wopiSrc);
      } catch (error) {
        this.is404 = true
        this.loading = false
      }

      // 若用户有权获取文件信息，则显示
      if (fileInfo && fileInfo.BaseFileName || fileInfo && fileInfo.Size) {
        // 设置iframe安全URL地址
        wopiUrl = wopiUrl.replace(this.serverHost, this.serverHostLAN)
        console.log(wopiUrl)
        this.targetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(wopiUrl);
        // 若存在文件，则通过PostMessage判断是否完成加载
        // this.loading = false // => onIframeLoaded
        // setTimeout(() => {
        // this.loading = false
        // }, 2000);
      } else {
        // 若不存在文件，则提示文件不存在
        this.is404 = true
        this.loading = false
      }

    }
  }
  onIframeLoaded(event) {
    console.log("onIframeLoaded");
    console.log(event);
    this.loading = false
  }
}
