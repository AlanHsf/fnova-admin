import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showName'
})
@Injectable()
export class ShowName implements PipeTransform {
  /*
  Version 0.3 2017-08-15
  */
  transform(obj: any): string {
    let show = ""
    if (obj) {
      if (obj.id) {
        if (obj.__type && obj.__type == "Pointer") { // When Pointer return ""
          return show
        }
        if (obj.id && obj.id != "") {
          show = obj.id
        }
        if (obj.get("orderuuid") && obj.get("orderuuid") != "") {
          show = obj.get("orderuuid")
        }
        
        if (obj.get("username") && obj.get("username") != "") {
          show = obj.get("username")
        }
        if (obj.get("title") && obj.get("title") != "") {
          show = obj.get("title")
        }
        if (obj.get("nickname") && obj.get("nickname") != "") {
          show = obj.get("nickname")
        }
        if (obj.get("mobile") && obj.get("mobile") != "") {
          show = obj.get("mobile")
        }
        if (obj.get("realname") && obj.get("realname") != "") {
          show = obj.get("realname")
        }
        if ((obj.get("realname") && obj.get("realname") != "") && (obj.get("mobile") && obj.get("mobile") != "")) {
          show = obj.get("realname") + `(${obj.get("mobile")})`
        }
        if (obj.get("classNum") && obj.get("classNum") != "") {
          show = obj.get("course").get("title") + obj.get("classNum")
        }
       
        if (obj.get("name") && obj.get("name") != "") {
          show = obj.get("name")
        }

        if(obj.get('storeName')) {
            show = obj.get('storeName')
        }

      } else {
        if (obj["name"] && obj["name"] != "") {
          show = obj["name"]
        }
        if (obj["mobile"] && obj["mobile"] != "") {
          show = obj["mobile"]
        }
        if (obj["username"] && obj["username"] != "") {
          show = obj["name"]
        }
        if (obj["title"] && obj["title"] != "") {
          show = obj["title"]
        }
        if (obj["nickname"] && obj["nickname"] != "") {
          show = obj["nickname"]
        }
        if (obj["realname"] && obj["realname"] != "") {
          show = obj["realname"]
        }
        if ((obj["realname"] && obj["realname"] != "") && (obj["mobile"] && obj["mobile"] != "")) {
          show = obj["realname"] + `(${obj["mobile"]})`
        }
        if(obj['storeName']) {
            show = obj['storeName']
        }

      }
    }
    return show
  }
}
