import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objkeyarr'
})
@Injectable()
export class Objkeyarr implements PipeTransform {

  transform(obj: any): string[] {
    return Object.keys(obj)
  }
}
