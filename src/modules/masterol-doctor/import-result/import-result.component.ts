

import { Component, OnInit, ViewChild } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import * as XLSX from "xlsx";
import { HttpClient } from "@angular/common/http";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { Router, ActivatedRoute } from "@angular/router";
import { count, profile } from "console";
import { query } from "@angular/animations";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
  selector: "app-import-result",
  templateUrl: "./import-result.component.html",
  styleUrls: ["./import-result.component.scss"]
})
export class ImportResultComponent implements OnInit {
  constructor() {}
  public api: GridApi;
  public columnApi: ColumnApi;

  public sideBar: true;
  public rowData: any[];
  public columnDefs: any[];
  public rowCount: string;
  public defaultColDef: any = {
    editable: true, //单元表格是否可编辑
    enableRowGroup: true, // 允许分组
    enablePivot: true,
    enableValue: true,
    sortable: true, //开启排序
    resizable: true, //是否可以调整列大小，就是拖动改变列大小

    // filter: true, //开启刷选
    filter: "agTextColumnFilter",
    floatingFilter: true, // 显示过滤栏
    flex: 1,
    minWidth: 100
  };
  public columnTypes;
  public defaultColGroupDef;
  public topOptions = {
    suppressHorizontalScroll: false
  };
  isImport: boolean = false;
  groupHeaderHeight: any;
  headerHeight: any;
  floatingFiltersHeight: any;
  pivotGroupHeaderHeight: any;
  pivotHeaderHeight: any;
  ngOnInit() {
    let require = [
      { headerName: "姓名", field:"姓名", other: "name" },
      { headerName: "身份证号", field:"身份证号", other: "idcard" },
      { headerName: "科目一名称", field:"科目一名称", other: "subjectA" },
      { headerName: "科目一成绩", field:"科目一成绩", other: "subjectAGrade" },
      { headerName: "考试时间", field:"考试时间", other: "subjectATime" },
      { headerName: "合格编号", field:"合格编号", other: "subjectACode" },
      { headerName: "科目二名称", field:"科目二名称", other: "subjectB" },
      { headerName: "科目二成绩", field:"科目二成绩", other: "subjectBGrade" },
      { headerName: "考试时间", field:"考试时间", other: "subjectBTime" },
      { headerName: "合格编号", field:"合格编号", other: "subjectBCode" },
    ];
    this.columnDefs = [
      {
        headerName: "必填项(学生信息)",
        children: require
      }
    ];
    let tem = {};
    this.columnDefs.forEach(data => {
      tem[data.field] = "暂无";
    });
    this.rowData = [tem]
    this.groupHeaderHeight = 40;
    this.headerHeight = 40;
    this.floatingFiltersHeight = 40;
    this.pivotGroupHeaderHeight = 50;
    this.pivotHeaderHeight = 100;
  }
  // 文件拖拽
  handleDropOver(e, over) {
    e.preventDefault();
    e.stopPropagation();
  }

  // over之后执行
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.onFileChange(e);
  }
  data: any = [
    [1, 2],
    [3, 4]
  ];
  // 选择文件
  async onFileChange(evt: any) {
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(target, target.files.length)
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

      let keyAry = [];
      // 遍历json对象，获取每一列的键名 表头
      for (let key in this.data[1]) {
        keyAry.push(key);
      }
      let columnDefs: any = [];
      keyAry.forEach((element, index) => {
        columnDefs.push({ headerName: element, field: element });
      });
      // this.importColumnDefs[this.currentSchema] = columnDefs;
      this.columnDefs = [
        ...this.columnDefs,
        { headerName: "导入项", children: columnDefs }
      ];
      this.rowData = this.data;
      this.isImport = true
    //   this.SchemaDataMap[this.currentSchema] = this.data;

    //   this.importFields = keyAry;
    //   // this.staticsCount(data);
    //   this.importField[0] = this.importColumnDefs[this.currentSchema][0].filed;
    // };

      
    }
    reader.readAsBinaryString(target.files[0]);
      let drop = document.getElementById("dropBox");
      if (this.rowData.length >= 1) {
        drop.style.display = "none";
      }
  }


  count:any = 0
  isVisible:boolean = false
  async saveLine() {
    let count = 0;
    for (let j = 0; j < this.rowData.length; j++) {
      let profile: any = await this.getProfile(
        this.rowData[j]["身份证号"],
        this.rowData[j]["姓名"]
      );
      console.log(profile)
      for (let i = 0; i < this.columnDefs[0].children.length; i++) {
        if(this.rowData[j][this.columnDefs[0].children[i].field]) {
          
          profile.set(
            this.columnDefs[0].children[i].other,
            this.rowData[j][this.columnDefs[0].children[i].field].trim()
          );
        }
      }
      await profile.save().then(res => {
        if(res && res.id) {
          console.log(res)
          count += 1;
          this.count = count
        }
        if (count == this.rowData.length) {
          setTimeout( res => {
            this.isVisible = false
            this.isImport = false;
          }, 1000)
        }
      });
    }
  }


  async getProfile(idcard, name) {
    return new Promise(async (resolve, reject) => {
      let ExamGrade = new Parse.Query("ExamGrade");
      console.log(idcard, name);
      if(idcard) {
        idcard.trim()
      }
      if(name) {
        name.trim()
      }
      ExamGrade.equalTo("idcard", idcard);
      ExamGrade.equalTo("name", name);
      ExamGrade.first().then(res => {
        if(res && res.id) {
          resolve(res);
        } else {
          let P = Parse.Object.extend("ExamGrade");
          let p = new P();
          p.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: "pPZbxElQQo"
          });
          resolve(p);
        }
      })
    });
  }
}
