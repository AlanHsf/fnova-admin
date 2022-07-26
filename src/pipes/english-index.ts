import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'engIndex',
})
@Injectable()
export class EngIndex implements PipeTransform {
 /*
    Version 0.1 2017-07-12
   */
  transform(value: any) {
    let start:string = "A";
    let code = start.charCodeAt(0);
    let index = String.fromCharCode(code+value);
    return index;
  }
}