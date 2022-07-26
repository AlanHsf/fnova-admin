import { Component, OnInit } from '@angular/core';
import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

@Component({
  selector: 'app-import-APIGCache',
  templateUrl: './import-APIGCache.component.html',
  styleUrls: ['./import-APIGCache.component.scss']
})
export class ImportAPIGCacheComponent implements OnInit {
  columnDefs = [
    {
      headerName: "姓名",
      field: "姓名"
    },
    {
      headerName: "身份证",
      field: "身份证"
    },
    {
      headerName: "性别",
      field: "性别"
    }
  ];
  constructor() { }
  groupHeaderHeight = 40;
  headerHeight = 40;
  floatingFiltersHeight = 40;
  pivotGroupHeaderHeight = 50;
  pivotHeaderHeight = 100;
  ngOnInit() {
    let tem = {}
    this.columnDefs.forEach(data => {
      tem[data.field] = "暂无";
    });
    this.rowData = [tem];
  }

  handleDropOver(e, over) {
    e.preventDefault();
    e.stopPropagation();
  }

  // over之后执行
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e);
    this.onFileChange(e);
  }


  data: any = [
    [1, 2],
    [3, 4]
  ];

  rowData: any = []
  async onFileChange(evt: any) {
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      let data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      this.rowData = data
      this.isImport = true;
      let drop = document.getElementById("dropBox");
      if (this.rowData.length >= 1) {
        drop.style.display = "none";
      }
    };

    console.log(this.rowData)
    reader.readAsBinaryString(target.files[0]);

  }
  isImport: boolean = false;
  count: number = 0
  saveLine() {
    console.log(1111)
    console.log(this.rowData)
    this.rowData.forEach(data => {
      let params = {
        cardNo: data['身份证'].trim(),
        realName: data['姓名'].trim(),
        sex: data['性别'].trim()
      }
      this.saveApig(params)
    })
  }
  async saveApig(params) {
    let APIGCache = Parse.Object.extend('APIGCache')
    let APIG = new APIGCache()
    let result = {
      reason: "成功",
      result: {
        isok: true,
        idcard: params.cardNo,
        realname: params.realName,
        sex: params.sex,
      },
      error_code: 0
    }

    APIG.set('api', {
      __type: 'Pointer',
      className: "APIG",
      objectId: "GHN0F1SOE3"
    })
    let p = {
      cardNo: params.cardNo,
      realName: params.realName,
    }
    APIG.set('params', p)
    APIG.set('result', result)
    APIG.set('type', "import")
    APIG.save().then(res => {
      console.log(res)
      this.count += 1
      console.log(this.count)
    })
  }
}
