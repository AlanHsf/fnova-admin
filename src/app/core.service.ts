import * as Parse from "parse";

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  domain = 'https://server.ncppx.com'
  web = ''
  constructor(
    private http: HttpClient
  ) {
    // this.domain = 'http://localhost:1337'
    this.setWeb()
  }
  setWeb() {
    this.web = this.domain + '/api/pipixia/ppxmanage/'
  }
  // http [get] 请求
  get(url: string, params?: Object, options?: Object) {
    return new Promise((resolve, reject) => {
      let httpParams = new HttpParams();
      if (params) {
        for (const key in params) {
          let value = params[key]
          if (value) {
            httpParams = httpParams.set(key, value);
          }
        }
      }
      this.http.get(url, { ...options, params: httpParams }).subscribe(data => { // 不带cookie
        // this.http.get(url, { params: httpParams, withCredentials: true }).subscribe(data => { // 带cookie
        let temp: any = data
        resolve(temp)
      },
        err => {
          reject(err)
        }
      )
    })
  }

  // http [post]请求
  post(url, params: Object = {}, options?: Object) {
    return new Promise((resolve, reject) => {
      this.http.post(url, params, options).subscribe(data => { // 不带cookie
        // this.http.get(url, { params: httpParams, withCredentials: true }).subscribe(data => { // 带cookie
        let temp: any = data
        resolve(temp)
      },
        err => {
          reject(err)
        }
      )
    })
  }
  // 递归深拷贝！
  clone(Obj) {
    var newObj;
    if (Obj instanceof Array) {
      newObj = [];  // 创建一个空的数组
      var i = Obj.length;
      while (i--) {
        newObj[i] = this.clone(Obj[i]);
      }
      return newObj;
    } else if (Obj instanceof Object) {
      newObj = {};  // 创建一个空对象
      for (var k in Obj) {  // 为这个对象添加新的属性
        newObj[k] = this.clone(Obj[k]);
      }
      return newObj;
    } else {
      return Obj;
    }
  }
  op() {
    let op: any = Parse.User.current() || {}
    op = JSON.parse(JSON.stringify(op))
    return {
      op_id: op.objectId, //  操作人id
      op_mobile: op.mobile,  //  操作人手机号
      op_name: op.realname,  //  操作人姓名
      op_type: op.type, //  操作人类型
    }
  }
}
