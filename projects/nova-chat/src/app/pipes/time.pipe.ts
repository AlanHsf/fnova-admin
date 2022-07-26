import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '../services/util';
/**
 * 将毫秒数转化固定的日期格式，为了解决angular2原生的date管道在IE11下的兼容问题
 */
@Pipe({
    name: 'time'
})

export class TimePipe implements PipeTransform {
    public transform(time: number, str: string): string {
        let t = new Date(time);
        let y = t.getFullYear();
        let mo = Util.doubleNumber(t.getMonth() + 1);
        let d = Util.doubleNumber(t.getDate());
        let h = Util.doubleNumber(t.getHours());
        let mi = Util.doubleNumber(t.getMinutes());
        let s = Util.doubleNumber(t.getSeconds());
        let newTime = '';
        let arr = str.split(' ');
        str = str.trim();
        // yy-MM-dd HH:mm
        if (arr.length === 2) {
            let arr2 = arr[0].split('-');
            if (arr2.length === 3) {
                newTime += (y + '-' + mo + '-' + d + ' ');
            } else if (arr2.length === 2) {
                newTime += (mo + '-' + d + ' ');
            }
            let arr3 = arr[1].split(':');
            if (arr3.length === 3) {
                newTime += (h + ':' + mi + ':' + s);
            } else if (arr3.length === 2) {
                newTime += (h + ':' + mi);
            }
            return (newTime);
            // HH:mm
        } else if (arr.length === 1) {
            if (arr[0].match(/:/g)) {
                let arr2 = arr[0].split(':');
                if (arr2.length === 3) {
                    newTime += (h + ':' + mi + ':' + s);
                } else if (arr2.length === 2) {
                    newTime += (h + ':' + mi);
                }
            } else if (arr[0].match(/-/g)) {
                let arr2 = arr[0].split('-');
                if (arr2.length === 3) {
                    newTime += (y + '-' + mo + '-' + d);
                } else if (arr2.length === 2) {
                    newTime += (mo + '-' + d);
                }
            }
            return newTime;
        } else {
            return time.toString();
        }
    }
}
