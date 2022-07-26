import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showImgPipe'
})
@Injectable()
export class ShowImg implements PipeTransform {
  /*
    Version 0.2 2017-03-21
   */
  transform(v: any): string {
    let url;
    if (typeof (v) == "string") {
      if ("temp" + v.indexOf("?")) {
        return v.split('?')[0]
      } else {
        return v;
      }
    }
    if (typeof (v) == "object") {
      if (v.length) {
        url = v[0].url
        if ("temp" + url.indexOf("?")) {
          return url.split("?")[0];
        } else {
          return url;
        }
      } else {
        for (let i in v) {
          url = v[i].url
        }
       if ("temp" + url.indexOf("?")) {
         return url.split("?")[0];
       } else {
         return url;
       }
      }
    }
  }
}
