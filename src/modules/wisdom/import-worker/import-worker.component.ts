import { Component, OnInit, ViewChild } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-import-worker',
  templateUrl: './import-worker.component.html',
  styleUrls: ['./import-worker.component.scss']
})
export class ImportWorkerComponent implements OnInit {

  constructor(
    public cdRef: ChangeDetectorRef, 
    private message: NzMessageService
  ) { }
  public api: GridApi;
  public columnApi: ColumnApi;

  public sideBar: true;
  public rowData: any = [];
  public columnDefs: any = [];
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
  groupHeaderHeight: any;
  headerHeight: any;
  floatingFiltersHeight: any;
  pivotGroupHeaderHeight: any;
  pivotHeaderHeight: any;
  objectIdMap: any = []; // 存每一条数据的Pointer指针的objectId
  require: any = [];
  ngOnInit() {

    //导入生物科技考生成绩
    this.require = [
      {
        headerName: "物料名称",
        field: "物料名称",
        other: "name",
        type: "String"
      },
      {
        headerName: "库存数量",
        field: "库存数量",
        other: "stock",
        type: "Number"
      },
      {
        headerName: "录入单位",
        field: "录入单位",
        other: "ssgs",
        type: "String"
      },
      {
        headerName: "主管关区",
        field: "主管关区",
        other: "zggq",
        type: "String"
      },
      {
        headerName: "商品编码",
        field: "商品编码",
        other: "goods_id",
        type: "String"
      },
      {
        headerName: "单件毛重",
        field: "单件毛重",
        other: "weight",
        type: "Number"
      },
    ]

    this.columnDefs = [
      {
        headerName: "Excel导入",
        children: this.require
      }
    ];
    let tem = {};
    this.require.forEach(data => {
      tem[data.field] = "暂无";
    });
    this.rowData = [tem];
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
    console.log(e);
    this.onFileChange(e);
  }
  data: any = [
    [1, 2],
    [3, 4]
  ];
  // 选择文件
  async onFileChange(evt: any) {
    this.isDealData = true
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    console.log(reader);
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      console.log(this.data);

      let keyAry = [];
      // 遍历json对象，获取每一列的键名 表头
      for (let key in this.data[1]) {
        keyAry.push(key);
      }
      let columnDefs: any = [];
      keyAry.forEach((element, index) => {
        columnDefs.push({ headerName: element, field: element });
      });

      this.columnDefs = [
        ...this.columnDefs,
        { headerName: "导入项", children: columnDefs }
      ];

      // 处理导入的数据
      this.getOnjectIdMap(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
    let drop = document.getElementById("dropBox");
    if (this.rowData.length >= 1) {
      drop.style.display = "none";
    }
    setTimeout(() => {
      this.isDealData = false
    }, 1500);
  }
  isImport: boolean = false;
  isDealData: boolean = false;

  getOnjectIdMap(datas) {
    this.rowData = datas;
    this.isImport = true
    console.log(this.rowData)
  }

  company: string = localStorage.getItem("company")
  isVisible: boolean = false
  // 保存到数据库
  count: any = 0
  async saveLine() {
    console.log('准备上传');
    this.isVisible = true
    let count = 0;
    for (let j = 0; j < this.rowData.length; j++) {
      let Profile = Parse.Object.extend('WisdomStoke')
      let profile = new Profile()
      profile.set("name", this.rowData[j]['物料名称'])
      profile.set("stock", +this.rowData[j]['库存数量'])
      profile.set("ssgs", this.rowData[j]['录入单位'])
      profile.set("zggq", this.rowData[j]['主管关区'])
      profile.set("goods_id", this.rowData[j]['商品编码'])
      profile.set("weight", + this.rowData[j]['单件毛重'])
      profile.set('company', {
        __type: "Pointer",
        className: "Company",
        objectId: this.company
      })
      let rs = await profile.save()
      console.log('已上传', rs)
    }
    this.message.success(`导入完成,共￥{this.rowData.length}条数据`);
    console.log('上传成功');
    setTimeout(() => {
     this.isVisible = false
    }, 2000);
  }

}
