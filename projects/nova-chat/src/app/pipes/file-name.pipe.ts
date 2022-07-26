import { Pipe, PipeTransform } from '@angular/core';
/**
 * 格式化长度过长的文件名（保留后缀名）
 */
@Pipe({
    name: 'fileName'
})

export class FileNamePipe implements PipeTransform {
    public transform(fileName: string, num: number): string {
        if (fileName.length <= num) {
            return fileName;
        }
        let index = fileName.lastIndexOf('.');
        let newName = '';
        if (index === -1) {
            if (fileName.length > num) {
                newName = fileName.substr(0, num - 3) + '...';
            } else {
                newName = fileName;
            }
        } else {
            let name = fileName.substring(0, index);
            let ext = fileName.substring(index);
            if (name.length > num - ext.length && num > 5 + ext.length) {
                let lastStr = name.substring(name.length - 2);
                let firstStr = name.substr(0, num - ext.length - 2 - 3);
                newName = `${firstStr}...${lastStr}${ext}`;
            } else if (num <= 5 + ext.length && num > ext.length + 2) {
                let n = name.substring(0, num - ext.length - 1);
                newName = `${n}..${ext}`;
            } else if (fileName.length > num) {
                newName = fileName.substring(0, num - 3) + '...';
            } else {
                newName = fileName;
            }
        }
        return newName;
    }
}
