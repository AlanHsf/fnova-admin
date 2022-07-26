import { HttpClient } from '@angular/common/http';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import * as XLSX from "xlsx";

@Injectable({
  providedIn: 'root'
})
export class ImportExclService {

  constructor(private http: HttpClient) { }
  // 文件拖拽
  handleDropOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // over之后执行
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.onFileChange(e);
  }
  exclData: any;
  columnDefs: any[] = [];
  // 选择文件
  onFileChange(evt: any): Promise<[]> {
    let exclData: any;
    // let columnDefs: any[] = [];
    return new Promise((resolve, reject) => {
      /* wire up file reader */
      let target: DataTransfer = <DataTransfer>evt.dataTransfer,
        data: any;
      if (!target) {
        target = <DataTransfer>evt.target;
      }
      console.log(target, target.files.length);
      if (target.files.length !== 1) throw new Error("Cannot use multiple files");
      const reader: FileReader = new FileReader();
      console.log(reader);
      reader.readAsBinaryString(target.files[0]);
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        exclData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        console.log(exclData)

        let keyAry = [];
        // 遍历json对象，获取每一列的键名 表头
        for (let key in exclData[1]) {
          keyAry.push(key);
        }
        // keyAry.forEach((element, index) => {
        //   columnDefs.push({ name: element, field: element });
        // });
        // console.log(columnDefs);
        resolve(exclData)
      };

      // this.exclData = exclData;
      // this.columnDefs = columnDefs;

    })
  }
  novaSelect(sql) {
    let baseurl = localStorage.getItem("NOVA_SERVERURL")
      ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select"
      : "https://server.fmode.cn/api/novaql/select";
    return new Promise((resolve) => {
      this.http.post(baseurl, { sql: sql }).subscribe(async (res: any) => {
        resolve(res);
      });
    });
  }
  novaHttp(url, params) {
    return new Promise((resolve, reject) => {
      let baseurl = 'https://server.fmode.cn/api/';
      url = baseurl + url
      this.http.post(url, params).subscribe((res: any) => {
        resolve(res);
      });
    })
  }

  onFileChange2(evt: any): Promise<{}> {
    let exclData: any;
    // let columnDefs: any[] = [];
    return new Promise((resolve, reject) => {
      /* wire up file reader */
      let target: DataTransfer = <DataTransfer>evt.dataTransfer,
        data: any;
      if (!target) {
        target = <DataTransfer>evt.target;
      }
      console.log(target, target.files.length);
      if (target.files.length !== 1) throw new Error("Cannot use multiple files");
      const reader: FileReader = new FileReader();
      console.log(reader);


      reader.readAsBinaryString(target.files[0]);
      const formData = new FormData(target.files[0] as any)
      resolve(formData)
      // reader.onload = (e: any) => {

      //   // const bstr: string = e.target.result;
      //   // const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      //   // const wsname: string = wb.SheetNames[0];
      //   // const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      //   // exclData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      //   console.log(e)
      //   resolve(e)
      // };

      // this.exclData = exclData;
      // this.columnDefs = columnDefs;

    })
  }
}
