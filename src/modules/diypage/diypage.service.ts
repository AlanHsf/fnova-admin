import { Injectable } from '@angular/core';
import * as Parse from "parse";
@Injectable({
  providedIn: 'root'
})
export class DiypageService {

  constructor() { }
  /* 展示数据源 */
  async initSource(block) {
    if (block.data.src == 'filter') {
      let Schema = new Parse.Query(block.data.className)
      let filter = block.data.filter
      console.log(block, filter, block.data.className)
      Schema.equalTo('company', localStorage.getItem('company'))
      let keyArr = Object.keys(filter)
      console.log(keyArr)
      keyArr.forEach(key => {
        console.log(key)
        filter[key].forEach(f => {
          if (key == 'include') {
            console.log(f)
            Schema[key](f.key)
          }
          if (key != 'include') {
            if (f.type == "Boolean" && f.isOpen) {
              console.log(111, f)
              Schema[key](f.key, f.value)
            }
            if ((f.type == 'String' || f.type == 'select') && f.value) {
              Schema[key](f.key, f.value)
            }
            if (f.type == 'Pointer' && f.value) {
              Schema[key](f.key, f.value)
            }
            if (f.type == 'Array' && f.value && f.value.length > 0) {
              Schema[key](f.key, f.value)
            }
          }

        })
      });
      if (block.data.limit) {
        Schema.limit(block.data.limit)
      }
      console.log(Schema)
      let queryData = await Schema.find()
      console.log(queryData)
      return queryData;
    } else {
      return []
    }

  }
  /* id获取路由 */
  async queryRoute(id) {
    let queryRoute = new Parse.Query('DevRoute')
    return await queryRoute.get(id)
  }
  srcChange(e, block, type) {
    block[type] = e
  }


}
