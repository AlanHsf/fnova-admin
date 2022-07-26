import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.scss']
})
export class AgGridComponent implements OnInit {
  @Input() gridData: string;// 表格数据
  @Input() columnDefs: any[];// 列定义数组
  @Input() require: any[];// 列定义数组中  单列设置
  @Input() width: number;// 宽度
  @Input() height: number;// 高度

  gridOptions: any = {};

  groupHeaderHeight: number;
  headerHeight: number;
  floatingFiltersHeight: number;
  pivotGroupHeaderHeight: number;
  pivotHeaderHeight: number;

  public defaultColGroupDef;
  public topOptions = {
    suppressHorizontalScroll: false,
  };
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
    minWidth: 100,
  };
  constructor() {
    // this.columnDefs = [
    //   {
    //     headerName: "必填项(学生信息)",
    //     children: this.require,
    //   },
    // ];
    // this.rowData = [tem];
    this.groupHeaderHeight = 40;
    this.headerHeight = 40;
    this.floatingFiltersHeight = 40;
    this.pivotGroupHeaderHeight = 50;
    this.pivotHeaderHeight = 100;

  }

  ngOnInit(): void {
    //将列和数据赋给gridOptions
    this.gridOptions = {
      rowHeight: 30, //设置行高为30px,默认情况下是25px
      columnDefs: this.columnDefs,
      rowData: this.gridData,
      defaultColDef: {
        editable: true,//单元表格是否可编辑
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true, //开启排序
        resizable: true,//是否可以调整列大小，就是拖动改变列大小
        filter: true  //开启刷选
      },
      pagination: true,  //开启分页（前端分页）
      paginationAutoPageSize: true, //根据网页高度自动分页（前端分页）
      //**************设置置顶行样式**********
      getRowStyle: function (params) {
        if (params.node.rowPinned) {
          return { 'font-weight': 'bold', 'color': 'red' };
        }
      },
    };
  }

}
