import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kvarray',
  pure: false
})
@Injectable()
export class KvArray implements PipeTransform {
  /*
    Version 0.2 2017-03-21
    From Object to Array with key/value.
   */
  transform(value: any, ...args: any[]) {
    if (value && value.length) {
      return value
    } else {
      let keys = [];
      for (let key in value) {
        keys.push({ key: key, value: value[key] });
      }
      return keys;
    }
  }
}
