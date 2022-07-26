import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  OnInit,
  ChangeDetectorRef,
  DoCheck
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EChartOption } from "echarts";
import { query } from "@angular/animations";
import * as Parse from "parse";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { min } from "rxjs/operators";
import { title } from "process";
import { table, count } from "console";
import { chart, Legend } from "jscharting";
import { async } from "@angular/core/testing";
import { RaceOperator } from "rxjs/internal/observable/race";
import { Observable } from 'rxjs';

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"]
})
export class ReportComponent implements OnInit {
  objectKeys = Object.keys;
  public api: GridApi;
  public columnApi: ColumnApi;
  public columnTypes;
  public defaultColGroupDef;
  public topOptions = {
    suppressHorizontalScroll: false
    // alwaysShowVerticalScroll: true,
    // suppressColumnVirtualisation: false,
  };

  // private 表头高度设置
  public rowData: any = {};
  public columnDefs: {};
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

  // 切换的tab
  mainTab: any = [];
  secondaryTab: any = [];
  tags: any = [];
  tagName: String = "";

  sumMap: any;
  groupMap: any = {};
  groupAmountMap: any = {};

  //
  salesChartOption: any = [];
  budgetChartOption: any = [];
  collectionChartOption: any = [];
  salesCompletionRate: any = [];
  grossChartOption: any = [];

  RID: any;
  SID: any;
  companyId: any;
  categoryId: any;
  sidArr: any = [];
  SchemaList: any;
  currentSchema: any;
  data: any = {};
  allAmountArr: any = [];
  allCateArr: any = [];
  //用户选择
  isChooseUser: Boolean = false;
  userList: any = [];
  userId: any = "";
  pieData: any;
  productMap: any = {};
  totalMap: any = {};
  customMap: any = {};
  customAmountMap: any = {};
  isChooseChart: Boolean = false;
  isData: Boolean = false;
  isSales: Boolean = false;
  isBudget: Boolean = false;
  isCollection: Boolean = false;
  isGross: Boolean = false;
  changeChart: any = {};
  ReportArray: any = [];
  cockpitReportArray: Array<any>; //驾驶舱的数组
  ismake: Boolean = false;
  index: Number = 0;
  schemaListLen: any = 0;
  reportType: any; // 报表的类型， 是月份还是季度，还是年份
  fromDate: any; // 起始时间
  toDate: any; //结束时间
  year: any;
  month: any;
  hasReport: Boolean = false;
  groups: any = [];
  cate: any;
  CFS: any = [];
  BI: any = [];
  constructor(
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.CFS = [
      ["一、经营活动产生的现金流量：", null, null, null],
      ["销售商品、提供劳务收到的现金", 1, null, null],
      ["收到的税费返还", 2, null, null],
      ["收到的其他与经营活动有关的现金", 3, null, null],
      ["经营活动现金流入小计", null, null, null],
      ["购买商品、接受劳务支付的现金", 4, null, null],
      ["支付给职工以及为职工支付的现金", 5, null, null],
      ["支付的各项税费", 6, null, null],
      ["支付的其他与经营活动有关的现金", 7, null, null],
      ["经营活动现金流出小计", null, null, null],
      ["经营活动产生的现金流量净额", null, null, null],
      ["二、投资活动产生的现金流量：", null, null, null],
      ["收回投资所收到的现金", 8, null, null],
      ["取得投资收益所收到的现金", 9, null, null],
      ["处置固定资产、无形资产和其他长期资产收回的现金净额", 10, null, null],
      ["处置子公司及其他营业单位收到的现金净额", 11, null, null],
      ["收到的其他与投资活动有关的现金", 12, null, null],
      ["投资活动现金流入小计", null, null, null],
      ["购建固定资产、无形资产和其他长期资产所支付的现金", 13, null, null],
      ["投资所支付的现金", 14, null, null],
      ["取得子公司及其他营业单位支付的现金净额", 15, null, null],
      ["支付的其他与投资活动有关的现金", 16, null, null],
      ["投资活动现金流出小计", null, null, null],
      ["投资活动产生的现金流量净额", null, null, null],
      ["三、筹资活动产生的现金流量：", null, null, null],
      ["吸收投资收到的现金", 17, null, null],
      ["借款所收到的现金", 18, null, null],
      ["收到的其他与筹资活动有关的现金", 19, null, null],
      ["筹资活动现金流入小计", null, null, null],
      ["偿还债务所支付的现金", 20, null, null],
      ["分配股利、利润或偿付利息所支付的现金", 21, null, null],
      ["支付的其他与筹资活动有关的现金", 22, null, null],
      ["筹资活动现金流出小计", null, null, null],
      ["筹资活动产生的现金流量净额", null, null, null],
      ["四、汇率变动对现金及现金等价物的影响", 23, null, null],
      ["五、现金及现金等价物净增加额", null, null, null],
      ["加:期初现金及现金等价物余额", 24, null, null],
      ["六、期末现金及现金等价物余额", null, null, null]
    ];
    this.BI = [
      ["一、偿债能力分析", null],
      ["1.流动比率", null],
      ["2.速动比率", null],
      ["3.资产负债率", null],
      ["4.产权比率", null],
      ["5.已获利息倍数", null],
      ["6.或有负债比率", null],
      ["7.现金流动负债比", null],
      [null, null],
      ["二、营运能力分析", null],
      ["1.总资产周转率", null],
      ["2.流动资产周转率", null],
      ["3.应收账款周转率", null],
      ["4.存货周转率(次数)", null],
      [null, null],
      ["三、获利能力分析", null],
      ["销售毛利额(万元)", null],
      ["1.销售毛利率", null],
      ["2.销售净利率", null],
      ["3.总资产收益率", null],
      ["4.资产收益率", null],
      ["5.净资产收益率", null],
      ["6.成本费用利润率", null],
      ["7.资本收益率", null],
      [null, null],
      ["四、现金流量分析", null],
      ["1.现金流量比率", null],
      ["2.购货付现比率", null],
      ["3.全部资产现金回收率", null],
      ["4.现金到期债务比", null],
      [null, null],
      ["五、发展能力分析", null],
      ["1.资产增长率", null],
      ["2.销售增长率", null],
      ["3.营业利润增长率", null],
      ["4.净利润增长率", null],
      ["5.资本保值增值率", null],
      ["6.资本积累率", null],
      ["7.技术投入比率", null]
    ];
    this.tags = ["全部", "全部"];
    this.tagName = "全部-全部";
    this.columnDefs = {
      salesProduct: [
        { headerName: "物料编码", field: "materialCode" },
        { headerName: "物料名称", field: "materialName" },
        { headerName: "规格型号", field: "type" },
        { headerName: "销售金额（含税）", field: "price" },
        { headerName: "销售总额占比", field: "proportion" },
        { headerName: "计划销售金额", field: "planPrice" },
        { headerName: "完成率", field: "completion" }
      ],
      materialType1: [
        { headerName: "物料类别一级", field: "materialType" },
        { headerName: "销售金额（含税）", field: "price" },
        { headerName: "销售总额占比", field: "proportion" },
        { headerName: "计划销售金额", field: "planPrice" },
        { headerName: "完成率", field: "completion" }
      ],
      materialType2: [
        { headerName: "物料类别二级", field: "materialType" },
        { headerName: "销售金额（含税）", field: "price" },
        { headerName: "销售总额占比", field: "proportion" },
        { headerName: "计划销售金额", field: "planPrice" },
        { headerName: "完成率", field: "completion" }
      ],
      custom: [
        { headerName: "客户编码", field: "customCode" },
        { headerName: "客户名称", field: "customName" },
        { headerName: "销售金额（含税）", field: "price" },
        { headerName: "销售总额占比", field: "proportion" },
        { headerName: "计划销售金额", field: "planPrice" },
        { headerName: "完成率", field: "completion" }
      ],
      area: [
        { headerName: "区域", field: "area" },
        { headerName: "销售金额（含税）", field: "price" },
        { headerName: "销售总额占比", field: "proportion" },
        { headerName: "计划销售金额", field: "planPrice" },
        { headerName: "完成率", field: "completion" }
      ],
      department: [
        { headerName: "部门", field: "department" },
        { headerName: "销售金额（含税）", field: "price" },
        { headerName: "销售总额占比", field: "proportion" },
        { headerName: "计划销售金额", field: "planPrice" },
        { headerName: "完成率", field: "completion" }
      ],
      salesman: [
        { headerName: "业务员编码", field: "salesmanCode" },
        { headerName: "业务员", field: "salesman" },
        { headerName: "销售金额（含税）", field: "price" },
        { headerName: "销售总额占比", field: "proportion" },
        { headerName: "计划销售金额", field: "planPrice" },
        { headerName: "完成率", field: "completion" }
      ]
    };
    this.rowData = {
      salesProduct: [
        {
          materialCode: "暂无",
          materialName: "暂无",
          type: "暂无",
          price: "暂无",
          proportion: "暂无",
          planPrice: "暂无",
          completion: "暂无"
        }
      ],
      materialType1: [
        {
          materialType: "暂无",
          type: "暂无",
          price: "暂无",
          proportion: "暂无",
          planPrice: "暂无",
          completion: "暂无"
        }
      ],
      materialType2: [
        {
          materialType: "暂无",
          type: "暂无",
          price: "暂无",
          proportion: "暂无",
          planPrice: "暂无",
          completion: "暂无"
        }
      ],
      custom: [
        {
          customCode: "暂无",
          customName: "暂无",
          price: "暂无",
          proportion: "暂无",
          planPrice: "暂无",
          completion: "暂无"
        }
      ],
      area: [
        {
          area: "暂无",
          price: "暂无",
          proportion: "暂无",
          planPrice: "暂无",
          completion: "暂无"
        }
      ],
      department: [
        {
          part: "暂无",
          price: "暂无",
          proportion: "暂无",
          planPrice: "暂无",
          completion: "暂无"
        }
      ],
      salesman: [
        {
          salesmanCode: "暂无",
          salesman: "暂无",
          price: "暂无",
          proportion: "暂无",
          planPrice: "暂无",
          completion: "暂无"
        }
      ]
    };
    // 获取数据
    await this.activatedRoute.paramMap.subscribe(async params => {
      this.RID = params.get("Rid");
      this.SID = params.get("Sid");
      let cate = params.get("cate");
      this.cate = cate;
      if (cate == "生产") {
        let groups = params.get("groups");
        if (groups) {
          let sArr = groups.split(",");
          for (let i = 0; i < sArr.length; i++) {
            this.groups.push(sArr[i]);
          }
        }
      }

      // 获取当前用户
      let current = Parse.User.current();

      this.companyId = current.get("company").id;
      this.currentSchema = params.get("currentSchema");

      // 获取报表是月份报表还季度报表，还是年度， 以及时间跨度
      let BIReport = new Parse.Query("BIReport");
      BIReport.equalTo("objectId", this.RID);
      let report = await BIReport.first();
      this.reportType = report.get("type");
      let dateObj = report.get("date");
      this.fromDate = dateObj.from;
      this.toDate = dateObj.to;

      let fromDate = new Date(dateObj.from);
      this.year = fromDate.getFullYear();
      this.month = fromDate.getMonth() + 1;

      if (cate.length == 10) {
        // 从选择模版页面跳转过来
        this.categoryId = cate;
      } else {
        // 从数据录入页面跳转过来
        let Category = Parse.Object.extend("Category");
        let category = new Parse.Query(Category);
        category.equalTo("type", "bischema");
        category.equalTo("name", cate);
        let cates = await category.first();
        this.categoryId = cates.id;
      }

      // 加载当前模块表格与字段信息
      this.loadTableAndFiled();

      // 查修BIDevSchema
      let BIDevSchema = Parse.Object.extend("BIDevSchema");
      let query = new Parse.Query(BIDevSchema);
      query.equalTo("category", this.categoryId);
      let list = await query.find();
      this.schemaListLen = list.length;

      this.SchemaList = list;
      await this.queryReportArray();
      console.log(this.ReportArray);
      // 设置单位
      await this.setUnit();
      // 查询用户
      await this.queryUsers();
      if (this.ReportArray && this.ReportArray[0].dataArr.length > 0) {
        if (this.cate == "财务报表指标" || this.cate == 'dynMFtj3aH') {
          this.ReportArray.forEach(item => {
            if (item.name == '现金流量表') {
              this.CFS = item.dataArr
            }
            if (item.name == "经营指标") {
              this.BI = item.dataArr;
            }
          })
        }
        console.log
        return;
      }
      this.setTreeOption();
      // 数据查询
      // await this.SchemaList.reduce(async (p, c, index) => {
      //   let newData: any = [],
      //     key = c.get("schemaName");
      //   let fields: any;
      //   await this.fieldsFun(key).then(res => {
      //     fields = res;
      //   });
      //   let data: any;
      //   if (1 > 2) {
      //     data = JSON.parse(localStorage.getItem(this.RID + "_" + c.id));
      //     data.forEach(item => {
      //       let itemObj: any = {};
      //       for (const key in item) {
      //         fields.forEach(field => {
      //           let fieldKey = field.field;
      //           if (field.headerName == key) {
      //             itemObj = { ...itemObj, [fieldKey]: item[key] };
      //           }
      //         });
      //       }
      //       newData.push(itemObj);
      //     });
      //   } else {
      //     // 本地没有就取线上
      //     let queryData = new Parse.Query(key);
      //     queryData.equalTo("name", this.RID + "_" + c.id);
      //     queryData.limit(100000);
      //     let result = await queryData.find();
      //     if (result.length > 0) {
      //       let fields: any;
      //       await this.fieldsFun(key).then(res => {
      //         fields = res;
      //       });
      //       result.forEach(item => {
      //         //转换
      //         let rowObj = {};
      //         fields.forEach(filed => {
      //           rowObj = {
      //             ...rowObj,
      //             [filed.field]: item.get(filed.field)
      //           };
      //         });
      //         newData.push(rowObj);
      //       });
      //     }
      //   }
      //   this.index = index;
      //   dataObj = { ...dataObj, [key]: newData };
      //   this.data = dataObj;
      // }, 0);
      await this.salesAmount();
    });

    // const timer = await setInterval(async () => {
    //   if (
    //     this.ReportArray &&
    //     JSON.stringify(this.ReportArray[0].chartOption) != "{}"
    //   ) {
    //     clearInterval(timer);
    //     return;
    //   }
    //   let len: number = 0;
    //   for (const key in this.data) {





    
    //     len++;
    //   }
    //   if (len == this.schemaListLen) {
    //     await this.salesAmount();
    //     clearInterval(timer);
    //   }
    // }, 1000);
  }
  // 查询reportArry，
  async queryReportArray() {
    let BIReportDesign = Parse.Object.extend("BIReportDesign");
    let BIReportArray = Parse.Object.extend("BIReportArray");
    let queryBRD = new Parse.Query(BIReportDesign);
    let queryBRDdiy = new Parse.Query(BIReportDesign);
    let queryBA = new Parse.Query(BIReportArray);
    // 结果表
    queryBA.equalTo("category", this.categoryId);
    queryBA.equalTo("company", this.companyId);
    queryBA.equalTo("report", this.RID);
    // 系统设计表
    queryBRD.doesNotExist("company");
    queryBRD.equalTo("category", this.categoryId);
    queryBRDdiy.equalTo("company", {
      __type: "Pointer",
      className: "Company",
      objectId: this.companyId
    });
    queryBRDdiy.equalTo("category", this.categoryId);
    let result = await queryBRD.first();
    let resultdiy = await queryBRDdiy.first();
    let report = await queryBA.first();

    if (report) {
      this.ReportArray = await report.get("ReportArray");
      this.mainTab = await report.get("tags");
      // this.ReportArrayDiy = report.get("ReportArrayDiy");
      // this.tagsdiy = report.get("tagsDiy");
      let reportArrayDiy = await report.get("ReportArrayDiy");

      // 自定义图表
      if (reportArrayDiy != undefined && reportArrayDiy.length > 0) {
        this.ReportArrayDiy = reportArrayDiy;
      } else {
        if (resultdiy) {
          this.ReportArrayDiy = await resultdiy.get("ReportArray");
          this.tagsdiy = await resultdiy.get("tags");
        }
      }
      if (this.ReportArray) {
        this.ReportArray.forEach(item => {
          if (item.view == "bar" || item.view == "bar-y") {
            item.chartOption.series[0].itemStyle.normal = {
              color: function() {
                var colorList = [
                  "#ffc107",
                  "#00796b",
                  "#5367fc",
                  "#56a6d1",
                  "#2469aa",
                  "#df4d3b",
                  "#752091",
                  "#ff1d55",
                  "#009966",
                  "#FF9933"
                ];
                let index = Math.floor(Math.random() * 10);
                return colorList[index];
              }
            };
          }
          if (item.view == "bar-waterfall") {
            item.chartOption.series[1].itemStyle.normal = {
              color: function() {
                var colorList = [
                  "#ffc107",
                  "#00796b",
                  "#5367fc",
                  "#56a6d1",
                  "#2469aa",
                  "#df4d3b",
                  "#752091",
                  "#ff1d55",
                  "#009966",
                  "#FF9933"
                ];
                let index = Math.floor(Math.random() * 10);
                return colorList[index];
              }
            };
          }
        });
      } else {
        console.log(123);
        // 生产的设置了groups
        if (this.cate == "生产" && this.groups.length > 0) {
          let arr = await result.get("ReportArray");
          this.groups.forEach(item => {
            arr.forEach(a => {
              if (a.groupBy[0] == item) {
                this.ReportArray.push(a);
              }
            });
          });
        } else {
          this.ReportArray = await result.get("ReportArray");
          console.log(this.ReportArray);
        }
        this.mainTab = result.get("tags");
      }
    } else {
      if (this.cate == "生产" && this.groups.length > 0) {
        let arr = result.get("ReportArray");
        this.groups.forEach(item => {
          arr.forEach(a => {
            if (a.groupBy[0] == item) {
              this.ReportArray.push(a);
            }
          });
        });
      } else {
        this.ReportArray = await result.get("ReportArray");
      }
      this.mainTab = await result.get("tags");
      if (resultdiy) {
        this.ReportArrayDiy = await resultdiy.get("ReportArray");
        this.tagsdiy = await resultdiy.get("tags");
      }
    }
  }
  // 给设计好的自定义图表填充数据
  async setDataToDiyReport() {
    if (this.ReportArrayDiy) {
      this.ReportArrayDiy.reduce(async (p, item) => {
        if (
          !item.chartOption ||
          item.chartOption == null ||
          !item.data ||
          item.data == []
        ) {
          await this.loadEditPreview(item);
        }
      }, 0);
    }
  }
  diyTab() {
    this.setDataToDiyReport();
  }
  // 存设计好的ReportArray 存ReportArrayDesign
  tagsdiy: Array<any>;
  async saveReportArrayDiy() {
    let BIReportDesign = Parse.Object.extend("BIReportDesign");

    let saveBRDdiy = new Parse.Query(BIReportDesign);
    saveBRDdiy.equalTo("category", this.categoryId);
    saveBRDdiy.equalTo("company", this.companyId);
    let existsdiy = await saveBRDdiy.first();
    let reportDiy: any = [];
    if (this.ReportArrayDiy.length > 0) {
      this.ReportArrayDiy.forEach(item => {
        let copyItem = Object.assign({}, item);
        copyItem.data = [];
        copyItem.chartOption = null;
        reportDiy.push(copyItem);
      });
    }

    if (existsdiy && existsdiy.id) {
      existsdiy.set("ReportArray", reportDiy);
      existsdiy.save();
    } else {
      existsdiy = new BIReportDesign();
      existsdiy.set("tags", this.tagsdiy);
      existsdiy.set("category", {
        __type: "Pointer",
        className: "Category",
        objectId: this.categoryId
      });
      existsdiy.set("ReportArray", reportDiy);
      existsdiy.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: this.companyId
      });
      existsdiy.save();
    }
  }
  // 存设计好的ReportArray 存BIReportArray
  async saveReportArray() {
    let BIReportDesign = Parse.Object.extend("BIReportDesign");
    let saveBRD = new Parse.Query(BIReportDesign);
    saveBRD.doesNotExist("company");
    saveBRD.equalTo("category", this.categoryId);
    let exists = await saveBRD.first();

    let tags = [
      // 资产存货
      [
        { name: "全部", value: "all" },
        { name: "资产", value: "BIBaseAssetProject", tName: "采购额" }
      ],
      [
        { name: "全部", value: "all" },
        { name: "项目", value: "project" }
      ]
    ];
    // 查重
    if (!exists) {
      let saveRBD = new BIReportDesign();
      saveRBD.set("category", {
        __type: "Pointer",
        className: "Category",
        objectId: this.categoryId
      });
      saveRBD.set("tags", tags);
      saveRBD.set("ReportArray", this.ReportArrayDesgin);
      saveRBD
        .save()
        .then(async redata => {})
        .catch(async err => {});
    }
  }
  // 保存自定义报表
  async saveReportDiy() {
    // 存到BIReportArrayDesign
    await this.saveReportArrayDiy();
    // 存到BIReportArray中
    let QueryReportArray = Parse.Object.extend("BIReportArray");
    let reportSave = new QueryReportArray();
    let reportQuery = new Parse.Query(QueryReportArray);

    reportQuery.equalTo("company", this.companyId);
    reportQuery.equalTo("report", this.RID);
    reportQuery.equalTo("category", this.categoryId);
    let report = await reportQuery.first();

    // let reportArray: any = report.get("ReportArray");
    // reportArray.ReportArray = this.ReportArray;
    if (report) {
      report.set("tagsDiy", this.tagsdiy);
      report.set("ReportArrayDiy", this.ReportArrayDiy);
      report
        .save()
        .then(async redata => {
          alert("保存完成");
        })
        .catch(async err => {
          alert("保存失败，请稍后重试");
        });
    } else {
      reportSave.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: this.companyId
      });
      reportSave.set("report", {
        __type: "Pointer",
        className: "BIReport",
        objectId: this.RID
      });
      reportSave.set("category", {
        __type: "Pointer",
        className: "Category",
        objectId: this.categoryId
      });
      reportSave.set("tagsDiy", this.tagsdiy);
      reportSave.set("ReportArrayDiy", this.ReportArrayDiy);
      reportSave
        .save()
        .then(async redata => {
          alert("保存完成");
        })
        .catch(async err => {
          alert("保存失败，请稍后重试");
        });
    }
  }
  // 查询ReportArray
  ReportArrayDiy: Array<any> = [];
  chartOptionDiy: any;
  editReportChart: any = {
    name: "",
    type: "",
    table: [], // 关联数据表
    group: [], //
    tableColumn: [],
    columns: [{ type: null, value: null }],
    where: [], // 筛选条件
    data: [],
    sqltname: null,
    chartOption: null
  };
  reportTabsIndex: any;
  // 编辑editModal相关变量
  isVisibleEditModal = false;
  groupOptions = [];
  tableOptions = [];
  filedsOptions = [];
  // 预览自定义的图表
  async loadEditPreview(option?) {
    // 0. 分析报表设计参数
    let chart: any;
    if (option) {
      chart = option;
    } else {
      chart = this.editReportChart;
    }
    let className = chart.table[0];
    if (!chart.group[0]) {
      alert("请选择分组");
      return;
    }
    let group = chart.group[0].split("/")[1];
    let columns = chart.columns;
    if (chart.sqltname) {
      // 1. 复杂定制表，通过表名查询SQL后端接口数据
      let url =
        "https://server.fmode.cn/api/bi/table?tablename='长期资产分析表'";
      let headers: HttpHeaders = new HttpHeaders({});
      headers.append("Content-Type", "application/json");
      this.http.get(url, { headers: headers }).subscribe(res => {
        console.log(res);
      });
    } else {
      // 2. 基础统计表，从Parse后端获取分组聚合数据
      if (!className) {
        alert("请选择关联数据表");
      }
      let query = new Parse.Query(className);
      let pipelines = [];
      let groupline: any = {};
      groupline = {
        group: {
          objectId: `$${group}`
        }
      };

      columns.forEach(col => {
        if (!col.type || !col.value) {
          alert("请选择聚合表头的聚合方法，和聚合数据");
        }
        let cal = col.type.toLowerCase();
        groupline.group[col.value.split("/")[1]] = {};
        groupline.group[col.value.split("/")[1]][`$${cal}`] = `$${
          col.value.split("/")[1]
        }`;
      });
      pipelines.push(groupline);
      await query.aggregate(pipelines).then(data => {
        chart.data = data;
      });
      if (option) {
        await this.getGroupOptions(option);
        await this.showChartOptionDiy(option);
      } else {
        await this.showChartOptionDiy();
      }

      // await this.cdRef.detectChanges();
    }
  }
  // 对自定义的图表做数据转换，展示图表
  showChartOptionDiy(option?) {
    let chart: any;
    if (option) {
      chart = option;
    } else {
      chart = this.editReportChart;
    }

    let dataMap: any = {};
    let data1: any = [];
    let nameMap = {};
    let tableColumns = [];
    chart.columns.forEach(col => {
      this.groupOptions.forEach(item => {
        if (item.value == col.value) {
          nameMap[item.value.split("/")[1]] = item.label.split("/")[1];
          tableColumns.push(item.label.split("/")[1]);
        }
      });
    });
    chart.tableColumn = tableColumns;
    chart.data.forEach(item => {
      for (const key in item) {
        if (!item.objectId || item.objectId == null) {
          continue;
        }
        if (key == "objectId") {
          data1.push(item[key]);
        } else {
          if (!dataMap[key]) {
            dataMap[key] = [];
          }
          dataMap[key].push(item[key]);
        }
      }
    });
    if (!chart.type) {
      alert("请选择图标显示类型");
      return;
    }
    if (chart.type == "bar") {
      let series: any = [];
      const labelOption = {
        show: true,
        formatter: "{c}  {name|{a}}",
        rotate: 90,
        position: "insideBottom",
        align: "left",
        fontSize: 16,
        rich: {
          name: {
            color: "#fff",
            fontSize: 16
          }
        }
      };
      for (const key in dataMap) {
        let map = {};
        map = {
          name: nameMap[key],
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: dataMap[key]
        };
        series.push(map);
      }
      this.chartOptionDiy = {
        title: {
          text: chart.name,
          textStyle: {
            color: "#dcdcdc"
          }
        },
        color: ["#EEAD0E", "#56a6d1", "#2469aa", "#df4d3b"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["11213", "6788", "89988", "787878"]
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: data1,
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: "#fff"
            }
          }
        ],
        yAxis: {
          type: "value",
          color: "#fff",
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        grid: {
          left: "20",
          containLabel: true
        },
        series: series
      };
    } else if (chart.type == "pie") {
      let pieData = [];
      let legendData: any = [];
      chart.data.forEach(item => {
        let pieItem: any = {};

        for (const key in item) {
          if (key == "objectId") {
            pieItem.name = item[key];
            legendData.push(item[key]);
          } else {
            pieItem.value = item[key];
          }
        }
        pieData.push(pieItem);
      });
      this.chartOptionDiy = {
        title: {
          text: chart.name,
          left: "left",
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "right",
          data: legendData,
          textStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
    } else if (chart.type == "line") {
      let series: any = [];
      // const labelOption = {
      //   show: true,
      //   formatter: "{c}  {name|{a}}",
      //   rotate: 90,
      //   position: "insideBottom",
      //   align: "left",
      //   fontSize: 16,
      //   rich: {
      //     name: {
      //       color: "#fff",
      //       fontSize: 16
      //     }
      //   }
      // };
      let legendData = [];
      for (const key in dataMap) {
        let map = {};
        legendData.push(nameMap[key]);
        map = {
          name: nameMap[key],
          type: "line",
          barGap: 0,
          // label: labelOption,
          data: dataMap[key]
        };
        series.push(map);
      }
      this.chartOptionDiy = {
        title: {
          text: chart.name,
          left: "left",
          textStyle: {
            color: "#dcdcdc"
          }
        },
        legend: {
          left: "right",
          data: legendData
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data1,
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        grid: {
          left: "20",
          containLabel: true
        },
        series: series
      };
    }
    chart.chartOption = this.chartOptionDiy;
  }
  addDiyColumns() {
    if (!this.editReportChart.type) {
      alert("请先选择图表显示的类型");
      return;
    }
    if (this.editReportChart.type == "pie") {
      alert("饼图只能含有两组数据");
      return;
    }
    this.editReportChart.columns.push({ type: null, value: null });
  }
  async getGroupOptions(option?) {
    let chart: any;
    if (option) {
      chart = JSON.stringify(option);
    } else {
      chart = JSON.stringify(this.editReportChart);
    }
    chart = JSON.parse(chart);
    if (!chart.table) {
      return [];
    }
    let tnames = chart.table;

    let options = this.filedsOptions.filter(f => {
      let isShow = false;
      tnames.forEach(name => {
        if (f.value.startsWith(name)) {
          isShow = true;
        } else {
          isShow = false;
        }
      });
      if (isShow) {
        return f;
      }
    });
    this.groupOptions = options;
    console.log(this.groupOptions);
  }
  tableTypeOptions = [
    {
      value: "bar",
      label: "条形图"
    },
    {
      value: "pie",
      label: "饼图"
    },
    {
      value: "line",
      label: "折线图"
    },
    {
      value: "map",
      label: "地图"
    },
    {
      value: "table",
      label: "表格"
    }
  ];
  async loadTableAndFiled() {
    let query = new Parse.Query("BIDevSchema");
    query.equalTo("category", {
      __type: "Pointer",
      className: "Category",
      objectId: this.categoryId
    });
    let tables = await query.find();
    if (!tables) {
      return;
    }

    let tableOptions = [];
    let filedOptions = [];
    tables.forEach(t => {
      tableOptions.push({
        label: t.get("name"),
        value: t.get("schemaName")
      });
      if (!t.get("fields")) {
        return;
      }
      t.get("fields").forEach(f => {
        filedOptions.push({
          label: `${t.get("name")}/${f.headerName}`,
          value: `${t.get("schemaName")}/${f.field}`
        });
      });
    });
    this.tableOptions = tableOptions;
    this.filedsOptions = filedOptions;
  }
  addTagsDiy() {
    if (!this.tagsdiy) {
      this.tagsdiy = [];
    }
    this.tagsdiy.push([]);
  }
  deleteTagsDiy(i) {
    this.tagsdiy.splice(i, 1);
  }

  addReportDiy() {
    let rchart: any = {
      name: "",
      type: "",
      table: [], // 关联数据表
      group: [], // 分组方式
      columns: [{ type: null, value: null }],
      where: [], // 筛选条件
      dataArr: [],
      sqltname: null,
      chartOption: null
    };
    // this.ReportArray.push(rchart);
    // this.editReportChart = this.ReportArray[this.ReportArray.length - 1];
    this.editReportChart = rchart;
    this.isVisibleEditModal = true;
  }
  getJsonStr(json) {
    JSON.stringify(json);
  }
  editModalCanceled() {
    this.isVisibleEditModal = false;
  }
  editModalOK() {
    // let chart: any = JSON.stringify(this.editReportChart);
    // chart = JSON.parse(chart);
    // let chart = this.editReportChart;
    this.editReportChart.chartOption = this.chartOptionDiy;
    let chart: any = this.editReportChart;

    this.ReportArrayDiy.push(chart);
    this.isVisibleEditModal = false;
  }
  // 删除自定义图表
  deleteChartDiy(i) {
    this.ReportArrayDiy.splice(i, 1);
  }

  initData() {}
  async fieldsFun(key) {
    let BIDevSchema = Parse.Object.extend("BIDevSchema");
    let queryBDS = new Parse.Query(BIDevSchema);
    queryBDS.equalTo("schemaName", key);
    let result = await queryBDS.first();
    let fields = await result.get("fields");
    return fields;
  }

  // ag-grid
  onGridReady(params) {
    this.api = params.api;
    this.columnApi = params.columnApi;

    params.api.sizeColumnsToFit();
    // this.staticsCount();
  }
  // 处理数据

  async salesAmount() {
    let datas = this.data;
    await this.computed(datas);
  }

  // 饼图数据格式
  pieTypeFun(data1, data2) {
    let pieData: any = [];
    if (data1 instanceof Array) {
      data1.forEach((data, index) => {
        pieData.push({ value: data, name: data2[index] });
      });
    } else {
      return;
    }

    this.pieData = pieData;
    return this.pieData;
  }
  // 雷达图数据格式

  // 数组去重
  unique(arr) {
    return Array.from(new Set(arr));
  }

  ReportArrayDesgin: Array<any> = [
    {
      tags: ["资产", "项目"],
      name: "各项目长期资产增幅表",
      desc: "",
      view: "pie", // pie line
      groupBy: ["BIBaseAssetProject/projectA"],
      computed: "initAmount",
      aggregate: [
        {
          divide: "BIAssetChange.amount/BIBaseAssetProject.initAmount"
        }
      ],
      conditions: ["BIAssetChange.amount", "BIBaseAssetProject.initAmount"],
      chartOption: {}
    },
    {
      tags: ["资产", "项目"],
      name: "各项目长期资产占比图",
      desc: "",
      view: "pie", // pie line
      groupBy: ["BIBaseAssetProject/projectA"],
      computed: "initAmount",
      aggregate: [
        {
          divide: "(BIBaseAssetProject.initAmount+BIAssetChange.amount)/total"
        }
      ],
      conditions: ["BIAssetChange.amount", "BIBaseAssetProject.initAmount"],
      chartOption: {}
    }
  ];

  async tableMapReduce(datas, option) {
    if (option.groupBy) {
      let gname = "";
      option.groupBy.forEach(cate => {
        gname += cate + ";";
      });
      let computed = option.computed;
      if (computed) {
        gname += computed;
      }

      let groupCate = option.groupBy[0].split("/");
      let tname = groupCate[0];
      let cate = groupCate[1];
      for (const key in datas) {
        if (tname == key) {
          let data = datas[key];
          let group: any = [];
          data.forEach((item, index) => {
            if (item[cate]) {
              group.push(item[cate]);
            }
          });
          let newAmount: any = [];
          let count = 0,
            min = 0,
            max = 0;
          let newGroup = this.unique(group);
          newGroup.forEach(group => {
            let amount = 0;
            data.forEach((dt, index) => {
              if (dt[cate] == group) {
                if (dt[computed]) {
                  count = count + 1;
                  amount += Number(dt[computed]);

                  if (index == 0) {
                    max = dt[computed];
                    min = dt[computed];
                  } else {
                    max = max > dt[computed] ? max : dt[computed];
                    min = min < dt[computed] ? min : dt[computed];
                  }
                }
              }
            });
            newAmount.push(amount);
          });
          let sum = 0;
          newAmount.forEach(item => {
            sum += item;
          });
          this.groupAmountMap[gname] = {
            sum: newAmount,
            count: count,
            min: min,
            max: max,
            avg: (sum / count).toFixed(2)
          };
          this.groupMap[gname] = newGroup;
        }
      }
    }
  }
  sqlDataMap: any = {};
  async sqlMapReduce(option, index) {
    // let url = `https://server.fmode.cn/api/bi/table?c=${this.companyId}?rid${this.RID}?tablename=${option.sqlname}?date`;
    let url = `https://server.fmode.cn/api/bi/table?tablename=${option.sqlname}&month=${this.month}&year=${this.year}&type=${this.reportType}&company=${this.companyId}&rid=${this.RID}`;
    this.http.get(url).subscribe(
      res => {
        if (!this.sqlDataMap.hasOwnProperty(option.sqlname)) {
          this.sqlDataMap[option.sqlname] = res;
          console.log(res);
        }
        this.setSqlChartOption(option, index);
      },
      err => {
        console.log(err);
      }
    );
  }
  aggregateFun(option, item, d1, d2?, d3?) {
    if (option.view == "bar-label") {
      option.aggregate.forEach((agg, i) => {
        if (i == 0) {
          d1.push(item[agg]);
        } else if (i == 1) {
          d2.push(item[agg]);
        } else if (i == 2) {
          d3.push(item[agg]);
        }
      });
    } else {
      option.aggregate.forEach((agg, i) => {
        if (option.aggregate.length == 1) {
          d1.push(item[agg]);
        } else if (option.aggregate.length == 2) {
          if (i == 0) {
            d1.push(item[agg]);
          } else {
            d2.push(item[agg]);
          }
        }
      });
    }
  }

  // 各产品的各费用占比
  async productCost(option, i) {
    let d: any = [],
      d1: any = [];
    await this.sqlDataMap[option.sqlname].forEach(item => {
      if (option.groupBy.length == 1) {
        let agg: any = [];
        if (!d.includes(item[option.groupBy[0]])) {
          d.push(item[option.groupBy[0]]);
          option.aggregate.forEach(a => {
            agg.push(item[a]);
          });
        }
        if (agg && agg.length > 0) {
          d1.push(agg);
        }
      }
    });
    let name = option.name;
    let data = option.legend.data;
    let newOption = Object.assign({}, option);
    await d.forEach((item, index) => {
      if (index == 0) {
        option.name = name + "-" + item;
        console.log(option.name);
        console.log(d1[index]);
        option.chartOption = this.joinChartOption(option, data, d1[index]);
      } else {
        newOption.name = name + "-" + item;
        newOption.chartOption = this.joinChartOption(
          newOption,
          data,
          d1[index]
        );
        let optionObj = Object.assign({}, newOption);
        // reportArray.push(optionObj)
        this.ReportArray.push(optionObj);
        console.log(this.ReportArray);
      }
    });
    console.log(this.ReportArray);
  }

  async setSqlChartOption(option, index) {
    let data: any = [];
    let data1: any = [],
      data2: any = [],
      data3: any = [];

    if (option.groupBy) {
      let d: any = [],
        d1: any = [],
        d2: any = [],
        d3: any = [];
      if (option.view == "pie" && option.sqlname == "生产成本分析表") {
        await this.productCost(option, index);
        data = data1 = data2 = data3 = d = d1 = d2 = d3 = null;
      } else {
        this.sqlDataMap[option.sqlname].forEach(item => {
          // 根据两种来分类
          if (option.groupBy.length == 2 && !option.group) {
            if (item[option.groupBy[0]] == "其他") {
              d.push(item[option.groupBy[1]] + "-" + item[option.groupBy[0]]);
              this.aggregateFun(option, item, d1, d2, d3);
            } else {
              d.push(item[option.groupBy[0]]);
              this.aggregateFun(option, item, d1, d2, d3);
            }
          } else if (option.groupBy.length == 2 && option.group) {
            if (item[option.groupBy[1]] == option.group) {
              d.push(item[option.groupBy[0]]);
              this.aggregateFun(option, item, d1, d2, d3);
            }
          } else if (option.groupBy.length == 1) {
            d.push(item[option.groupBy[0]]);
            this.aggregateFun(option, item, d1, d2, d3);
          }
        });
        if (option.view == "pie") {
          d.forEach((item, idx) => {
            if (!data.includes(item)) {
              data.push(item);
              if (d2.length > 1) {
                data1.push(Number(d1[idx]) + Number(d2[idx]));
              } else {
                data1.push(Number(d1[idx]));
              }
            } else {
              let i = data.indexOf(item);
              data1[i] = Number(data1[i]) + Number(d1[idx]);
              if (d2.length > 0) {
                data1[i] = Number(data1[i]) + Number(d1[idx]) + Number(d2[idx]);
              }
            }
          });
        } else if (option.sqlname == "生产成本分析表") {
          d.forEach((item, idx) => {
            if (!data.includes(item)) {
              data.push(item);
              if (d3 && d3.length > 0) {
                data3.push(Number(d3[idx]));
                data2.push(Number(d2[idx]));
                data1.push(Number(d1[idx]));
              } else if (d2 && d2.length > 0) {
                data2.push(Number(d2[idx]));
                data1.push(Number(d1[idx]));
              } else {
                data1.push(Number(d1[idx]));
                (data3 = null), (data2 = null);
              }
            }
          });
        } else {
          d.forEach((item, idx) => {
            if (!data.includes(item)) {
              data.push(item);
              data1.push(Number(d1[idx]));
              if (d2) {
                data2.push(Number(d2[idx]));
              }
            } else {
              let i = data.indexOf(item);
              data1[i] = (Number(data1[i]) + Number(d1[idx])).toFixed(2);
              if (d2) {
                data2[i] = (Number(data2[i]) + Number(d2[idx])).toFixed(2);
              }
            }
          });
          if (option.view == "bar-negative") {
            console.log(data2);
          }
        }
      }
    }
    // 优化，传对象还是数组
    // console.log(data, data1, data2)
    if (data3 && data3.length > 0) {
      option.chartOption = this.joinChartOption(
        option,
        data,
        data1,
        data2,
        data3
      );
      option.dataArr = [data, data1, data2, data3];
    } else if (data2 && data2.length > 0) {
      option.chartOption = this.joinChartOption(option, data, data1, data2);
      option.dataArr = [data, data1, data2];
      data3 = null;
    } else if (data1 && data1.length > 0) {
      option.chartOption = this.joinChartOption(option, data, data1);
      option.dataArr = [data, data1];
      data2 = null;
    }

    // 现金流量表，财务指标
    if (!option.groupBy) {
      if (option.name == "现金流量表") {
        this.sqlDataMap[option.sqlname].forEach(item => {
          for (const key in item) {
            this.CFS.forEach(c => {
              if (c[0] == key) {
                c[2] = item[key];
              }
            });
          }
        });
        option.dataArr = this.CFS;
      }

      if (option.name == "经营指标") {
        let income: any = [],
          balance: any = [];
        if (option.dataTable) {
          await option.dataTable.reduce(async (p, item) => {
            // 查表的Id
            let schema = new Parse.Query("BIDevSchema");
            schema.equalTo("schemaName", item);
            const schemaName = await schema.first();
            const tId = schemaName.id;
            let query = new Parse.Query(item);
            query.equalTo("company", this.companyId);
            query.equalTo("name", this.RID + "_" + tId);
            const data = await query.find();
            if (item == "BIIncomeStatement") {
              income = data;
            }
            if (item == "BIBalanceSheet") {
              balance = data;
            }
          }, 0);
          await setTimeout(() => {
            this.indicators(income, balance, option);
            this.dupont(income, balance);
          },100) 
          option.dataArr = this.BI
        }
      }
    }
  }
  // 经营指标
  // data1 利润表， data2 是资产负债表
  
  indicators(data1, data2, option) {
    this.BI.forEach(item => {
      // 偿债能力分析
      if (item[0] == "1.流动比率") {
        let a: any, b: any;
        data2.forEach(d2 => {
          if (d2.get("asset") == "流动资产合计") {
            a = d2.get("endAmountAsset");
          }
          if (d2.get("netWorth") == "流动负债合计") {
            b = d2.get("endAmountDebt");
          }
        });
        item[1] = Number(a) / Number(b);
      }
      if (item[0] == "2.速动比率") {
        let a: any, b: any, c: any;
        data2.forEach(d2 => {
          if (d2.get("asset") == "流动资产合计") {
            a = d2.get("endAmountAsset");
          }
          if (d2.get("netWorth") == "流动负债合计") {
            b = d2.get("endAmountDebt");
          }
          if (d2.get("asset") == "存货") {
            c = d2.get("endAmountAsset");
          }
        });
        item[1] = (Number(a) - Number(c)) / Number(b);
      }
      if (item[0] == "3.资产负债率") {
        let a: any, b: any;
        data2.forEach(d2 => {
          if (d2.get("asset") == "资产总计") {
            a = d2.get("endAmountAsset");
          }
          if (d2.get("netWorth") == "负债合计") {
            b = d2.get("endAmountDebt");
          }
        });
        item[1] = ((Number(b) / Number(a)) * 100).toFixed(2) + "%";
      }
      if (item[0] == "4.产权比率") {
        let a: any, b: any;
        data2.forEach(d2 => {
          if (d2.get("netWorth") == "负债合计") {
            a = d2.get("endAmountDebt");
          }
          if (d2.get("netWorth") == "所有者权益(或股东权益)合计") {
            b = d2.get("endAmountDebt");
          }
        });
        item[1] = ((Number(a) / Number(b)) * 100).toFixed(2) + "%";
      }
      if (item[0] == "5.已获利息倍数") {
        let a: any, b: any, c: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "三、利润总额(亏损总额以“—”号填列)") {
            a = d1.get("currentAmount");
          }
          if (d1.get("project") == "其中：利息费用") {
            b = d1.get("currentAmount");
          }
          if (d1.get("project") == "其中：利息费用") {
            c = d1.get("currentAmount");
          }
        });
        item[1] = (Number(a) + Number(b) - Number(c)) / (Number(b) - Number(c));
      }
      if (item[0] == "6.或有负债比率") {
        let a: any, b: any;
        data2.forEach(d2 => {
          if (d2.get("netWorth") == "预计负债") {
            a = d2.get("endAmountDebt");
          }
          if (d2.get("netWorth") == "所有者权益(或股东权益)合计") {
            b = d2.get("endAmountDebt");
          }
        });
        item[1] = Number(a) / Number(b);
      }
      if (item[0] == "7.现金流动负债比") {
        let a: any, b: any;
        data2.forEach(d2 => {
          if (d2.get("netWorth") == "流动负债合计") {
            b = d2.get("endAmountDebt");
          }
          a = this.sqlDataMap[option.sqlname][0]["经营活动产生的现金流量净额"];
        });
        item[1] = Number(a) / Number(b);
      }
      // 运营能力分析
      if (item[0] == "1.总资产周转率") {
        let a: any, b: any, c: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "一、营业收入") {
            a = d1.get("currentAmount");
            console.log(d1);
          }
        });
        data2.forEach(d2 => {
          if (d2.get("asset") == "资产总计") {
            b = d2.get("endAmountAsset");
            c = d2.get("beginingBalanceAsset");
          }
        });
        item[1] = Number(a) / ((Number(b) + Number(c)) / 2);
        console.log(item, a, b, c);
      }
      if (item[0] == "2.流动资产周转率") {
        let a: any, b: any, c: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "一、营业收入") {
            a = d1.get("currentAmount");
          }
        });
        data2.forEach(d2 => {
          if (d2.get("asset") == "流动资产合计") {
            b = d2.get("endAmountAsset");
            c = d2.get("beginingBalanceAsset");
          }
        });
        item[1] = Number(a) / ((Number(b) + Number(c)) / 2);
      }
      if (item[0] == "3.应收账款周转率") {
        let a: any, b: any, c: any, d: any, f: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "一、营业收入") {
            a = d1.get("currentAmount");
          }
        });
        data2.forEach(d2 => {
          if (d2.get("asset") == "应收账款") {
            b = d2.get("endAmountAsset");
            c = d2.get("beginingBalanceAsset");
          }
          if (d2.get("asset") == "应收票据") {
            d = d2.get("endAmountAsset");
            f = d2.get("beginingBalanceAsset");
          }
        });
        item[1] =
          Number(a) / ((Number(b) + Number(c) + Number(d) + Number(f)) / 2);
      }
      if (item[0] == "4.存货周转率(次数)") {
        let a: any, b: any, c: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "减:营业成本") {
            a = d1.get("currentAmount");
          }
        });
        data2.forEach(d2 => {
          if (d2.get("asset") == "存货") {
            b = d2.get("endAmountAsset");
            c = d2.get("beginingBalanceAsset");
          }
        });
        item[1] = Number(a) / ((Number(b) + Number(c)) / 2);
      }
      // 获利能力分析
      if (item[0] == "销售毛利额(万元)") {
        let a: any, b: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "一、营业收入") {
            a = d1.get("currentAmount");
          }
          if (d1.get("project") == "减:营业成本") {
            b = d1.get("currentAmount");
          }
        });

        item[1] = Number(a) - Number(b);
        console.log(item, a, b);
      }
      if (item[0] == "1.销售毛利率") {
        let a: any, b: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "一、营业收入") {
            a = d1.get("currentAmount");
          }
          if (d1.get("project") == "减:营业成本") {
            b = d1.get("currentAmount");
          }
        });

        item[1] =
          (((Number(a) - Number(b)) / Number(a)) * 100).toFixed(2) + "%";
      }
      if (item[0] == "2.销售净利率") {
        let a: any, b: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "一、营业收入") {
            a = d1.get("currentAmount");
          }
          if (d1.get("project") == "四、净利润(净亏损以“—”号填列)") {
            b = d1.get("currentAmount");
          }
        });

        item[1] = ((Number(b) / Number(a)) * 100).toFixed(2) + "%";
      }
      if (item[0] == "3.总资产收益率") {
        let a: any, b: any, c: any, d: any, e: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "三、利润总额(亏损总额以“—”号填列)") {
            a = d1.get("currentAmount");
          }
          if (d1.get("project") == "其中：利息费用") {
            b = d1.get("currentAmount");
          }
          if (d1.get("project") == "利息收入") {
            c = d1.get("currentAmount");
          }
        });
        data2.forEach(d2 => {
          if (d2.get("asset") == "资产总计") {
            d = d2.get("endAmountAsset");
            e = d2.get("beginingBalanceAsset");
          }
        });
        item[1] =
          (
            ((Number(a) + Number(b) - Number(c)) /
              ((Number(d) + Number(e)) / 2)) *
            100
          ).toFixed(2) + "%";
      }
      if (item[0] == "4.资产收益率") {
        let a: any, b: any, c: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "四、净利润(净亏损以“—”号填列)") {
            a = d1.get("currentAmount");
          }
        });
        data2.forEach(d2 => {
          if (d2.get("asset") == "资产总计") {
            b = d2.get("endAmountAsset");
            c = d2.get("beginingBalanceAsset");
          }
        });
        item[1] = Number(a) / ((Number(b) + Number(c)) / 2);
        console.log(item, a, b);
      }
      if (item[0] == "5.净资产收益率") {
        let a: any, b: any, c: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "四、净利润(净亏损以“—”号填列)") {
            a = d1.get("currentAmount");
          }
        });
        data2.forEach(d2 => {
          if (d2.get("netWorth") == "所有者权益(或股东权益)合计") {
            b = d2.get("endAmountDebt");
            c = d2.get("beginingBalanceDebt");
          }
        });
        item[1] =
          ((Number(a) / (Number(b) + Number(c)) / 2) * 100).toFixed(2) + "%";
        console.log(item, a, b);
      }
      if (item[0] == "6.成本费用利润率") {
        let a: any = 0,
          b: any = 0;
        data1.forEach(d1 => {
          if (d1.get("project") == "四、净利润(净亏损以“—”号填列)") {
            a = d1.get("currentAmount");
          }
          if (
            d1.get("project") == "减:营业成本" ||
            d1.get("project") == "税金及附加" ||
            d1.get("project") == "销售费用" ||
            d1.get("project") == "管理费用" ||
            d1.get("project") == "研发费用" ||
            d1.get("project") == "财务费用"
          ) {
            b += Number(d1.get("currentAmount"));
          }
        });
        item[1] = Number(a) / Number(b);
        console.log(item, a, b);
      }
      if (item[0] == "7.资本收益率") {
        let a: any,
          b: any = 0,
          c: any;
        data1.forEach(d1 => {
          if (d1.get("project") == "四、净利润(净亏损以“—”号填列)") {
            a = d1.get("currentAmount");
          }
        });
        data2.forEach(d2 => {
          if (
            d2.get("netWorth") == "实收资本(或股本)" ||
            d2.get("netWorth") == "资本公积"
          ) {
            b +=
              Number(d2.get("beginingBalanceDebt")) +
              Number(d2.get("endAmountDebt"));
          }
        });
        item[1] = Number(a) / (Number(b) / 2);
        console.log(item, a, b);
      }
      // 现金流量分析
      if (item[0] == "1.现金流量比率") {
        let a: any, b: any;
        if (this.sqlDataMap[option.sqlname]) {
          a = this.sqlDataMap[option.sqlname][0]["经营活动产生的现金流量净额"];
        }
        data2.forEach(d2 => {
          if (d2.get("netWorth") == "流动负债合计") {
            b = d2.get("endAmountDebt");
          }
        });
        item[1] = ((Number(a) / Number(b)) * 100).toFixed(2) + "%";
      }
      if (item[0] == "2.购货付现比率") {
        let a: any, b: any;
        if (this.sqlDataMap[option.sqlname]) {
          a = this.sqlDataMap[option.sqlname][0][
            "购买商品、接受劳务支付的现金"
          ];
        }
        data1.forEach(d1 => {
          if (d1.get("project") == "减:营业成本") {
            b = d1.get("currentAmount");
          }
        });
        item[1] = ((Number(a) / Number(b)) * 100).toFixed(2) + "%";
      }
      if (item[0] == "3.全部资产现金回收率") {
        let a: any, b: any;
        if (this.sqlDataMap[option.sqlname]) {
          a = this.sqlDataMap[option.sqlname][0]["经营活动产生的现金流量净额"];
        }
        data2.forEach(d2 => {
          if (d2.get("asset") == "资产总计") {
            b = d2.get("endAmountAsset");
          }
        });
        item[1] = ((Number(a) / Number(b)) * 100).toFixed(2) + "%";
      }
      if (item[0] == "4.现金到期债务比") {
        let a: any,
          b: any = 0;
        if (this.sqlDataMap[option.sqlname]) {
          a = this.sqlDataMap[option.sqlname][0]["经营活动产生的现金流量净额"];
        }
        data2.forEach(d2 => {
          if (
            d2.get("netWorth") == "一年内到期的非流动负债" ||
            d2.get("netWorth") == "应付账款"
          ) {
            b += d2.get("endAmountDebt");
          }
        });
        item[1] = Number(a) / Number(b);
      }

      // 发展能力分析
      if (item[0] == "1.资产增长率") {
        let a: any,
          b: any = 0;
        data2.forEach(d2 => {
          if (d2.get("asset") == "资产总计") {
            a = d2.get("endAmountAsset");
            b = d2.get("beginingBalanceAsset");
          }
        });
        item[1] =
          (((Number(a) - Number(b)) / Number(b)) * 100).toFixed(2) + "%";
        console.log(item, a, b);
      }
      if (item[0] == "2.销售增长率") {
        let a: any,
          b: any = 0;
        data1.forEach(d1 => {
          if (d1.get("project") == "一、营业收入") {
            a = d1.get("currentAmount");
            b = d1.get("lastAmount");
          }
        });
        item[1] =
          (((Number(a) - Number(b)) / Number(b)) * 100).toFixed(2) + "%";
      }
      if (item[0] == "3.营业利润增长率") {
        let a: any,
          b: any = 0;
        data1.forEach(d1 => {
          if (d1.get("project") == "二、营业利润(亏损以“—”号填列)") {
            a = d1.get("currentAmount");
            b = d1.get("lastAmount");
          }
        });
        item[1] =
          (((Number(a) - Number(b)) / Number(b)) * 100).toFixed(2) + "%";
      }
      if (item[0] == "4.净利润增长率") {
        let a: any,
          b: any = 0;
        data1.forEach(d1 => {
          if (d1.get("project") == "四、净利润(净亏损以“—”号填列)") {
            a = d1.get("currentAmount");
            b = d1.get("lastAmount");
          }
        });
        item[1] =
          (((Number(a) - Number(b)) / Number(b)) * 100).toFixed(2) + "%";
      }
      if (item[0] == "5.资本保值增值率") {
        let a: any,
          b: any = 0;
        data2.forEach(d2 => {
          if (d2.get("netWorth") == "所有者权益(或股东权益)合计") {
            a = d2.get("endAmountDebt");
            b = d2.get("beginingBalanceDebt");
          }
        });
        item[1] = Number(a) / Number(b);
        console.log(a, b);
      }
      if (item[0] == "6.资本积累率") {
        let a: any,
          b: any = 0;
        data2.forEach(d2 => {
          if (d2.get("netWorth") == "所有者权益(或股东权益)合计") {
            a = d2.get("endAmountDebt");
            b = d2.get("beginingBalanceDebt");
          }
        });
        item[1] = (Number(a) - Number(b)) / Number(b);
      }
      if (item[0] == "7.技术投入比率") {
        let a: any,
          b: any = 0;
        data1.forEach(d1 => {
          if (d1.get("project") == "研发费用") {
            a = d1.get("currentAmount");
          }
          if (d1.get("project") == "一、营业收入") {
            b = d1.get("currentAmount");
          }
        });
        item[1] = Number(a) / Number(b);
        console.log(item, a, b);
      }
    });
  }
  // 杜邦分析
  dupont(data1, data2) {
    let netProfit: any, netIncome: any, totalAssetAvg: any, totalLiabilities: any, totalAsset: any;
    data1.forEach(d1 => {
      if (d1.get('project') == '四、净利润(净亏损以“—”号填列)') {
        netProfit = d1.get('currentAmount')
      }
      if (d1.get('project') == '一、营业收入') {
        netIncome = d1.get('currentAmount');
      }
    })
    data2.forEach(d2 => {
      if (d2.get('asset') == '资产总计') {
        totalAssetAvg = (Number(d2.get('endAmountAsset')) + Number(d2.get('beginingBalanceAsset'))) / 2;
        totalAsset = Number(d2.get("endAmountAsset")); 
      }
      if (d2.get("netWorth") == "负债合计") {
        totalLiabilities = d2.get('endAmountDebt')
      }
    })
    this.treeData = {
      name:
        "净资产收益率:\n" +
        (
          (netProfit / netIncome) *
          (netIncome / totalAssetAvg) *
          (1 / (1 - totalLiabilities / totalAsset))
        ).toFixed(2),
      children: [
        {
          name:
            "总资产净利率:\n" +
            ((netProfit / netIncome) * (netIncome / totalAssetAvg)).toFixed(2),
          children: [
            {
              name: "销售净利率:\n" + (netProfit / netIncome).toFixed(2),
              children: [
                { name: "净利润:\n" + netProfit, value: netProfit },
                { name: "÷" },
                { name: "主营业务收入净额:\n" + netIncome, value: netIncome }
              ]
            },
            {
              name: "X"
            },
            {
              name: "总资产周转率:\n" + (netIncome / totalAssetAvg).toFixed(2),
              children: [
                {
                  name: "主营业务收入净额: \n" + netIncome,
                  value: netIncome
                },
                { name: "÷" },
                {
                  name: "资产平均总额:\n" + totalAssetAvg,
                  value: totalAssetAvg
                }
              ]
            }
          ]
        },
        { name: "X" },
        {
          name:
            "权益乘数: \n" +
            (1 / (1 - totalLiabilities / totalAsset)).toFixed(2),
          children: [
            {
              name:
                "1÷(1-资产负债率): \n" +
                (1 / (1 - totalLiabilities / totalAsset)).toFixed(2),
              children: [
                {
                  name: "负债总额: \n" + totalLiabilities,
                  value: totalLiabilities
                },
                { name: "÷" },
                { name: "资产总额: \n" + totalAsset, value: totalAsset }
              ]
            }
          ]
        }
      ]
    };
    this.treeOption = {
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove"
      },
      series: [
        {
          type: "tree",
          name: "tree1",
          data: [this.treeData],

          top: "10%",
          left: "8%",
          bottom: "22%",
          right: "8%",

          symbol: "emptyCircle",
          orient: "vertical",

          // edgeShape: "polyline",
          // edgeForkPosition: "60%",
          initialTreeDepth: 3,

          lineStyle: {
            width: 2
          },

          label: {
            backgroundColor: "#fff",
            position: "left",
            lineHeight: 30,
            verticalAlign: "middle",
            align: "center",
            borderWidth: 2,
            borderColor: "black",
            padding: 5,
            fontSize: 20,
            rich: {
              
            }
          },

          leaves: {
            label: {
              position: "right",
              verticalAlign: "middle",
              align: "center",
              lineHeight: 30
            }
          },

          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    };
    // this.treeOption.series[0].data = [];
    console.log(this.treeOption.series[0]);
    this.cdRef.detectChanges()
  }
  // 拼接chartOption
  setChartOption(option) {
    let gname = "";
    if (option.groupBy) {
      option.groupBy.forEach(cate => {
        gname += cate + ";";
      });
      if (option.computed) {
        gname += option.computed;
      }
      let newAmount: any = [];
      for (const key in option.aggregate[0]) {
        // 减
        if (key == "subtract") {
          let tableArr = option.aggregate[0][key].split("-");
          // 减数
          let computed1 = tableArr[0].split(".")[1];
          // 被减数
          let computed2 = tableArr[1].split(".")[1];
          // 减数表名
          let reduction = tableArr[0].split(".")[0];
          // 被减数表名
          let minuend = tableArr[1].split(".")[0];
          // 需要被替换的表名
          let replaceTable = option.groupBy[0].split("/")[0];
          // 减数的gname
          let rGname = gname.replace(new RegExp(replaceTable, "g"), reduction);
          // 被减数的gname
          let mGname = gname.replace(new RegExp(replaceTable, "g"), minuend);
          rGname = rGname.replace(new RegExp(computed2, "g"), computed1);

          if (this.groupAmountMap[rGname].sum.length > 0) {
            let arr: any = [];
            this.groupMap[rGname].forEach((item, index) => {
              this.groupMap[mGname].forEach((m, i) => {
                if (item == m) {
                  arr.push(
                    this.groupAmountMap[mGname].sum[i]
                      ? this.groupAmountMap[mGname].sum[i]
                      : 0
                  );
                }
              });
            });

            arr.forEach((item, index) => {
              if (!arr[index] || item == "") {
                arr.splice(index, 1);
              }
            });

            this.groupAmountMap[rGname].sum.forEach((item, index) => {
              if (this.groupAmountMap[mGname]) {
                let value = item - arr[index];
                newAmount.push(value);
              }
            });
          }
        } // 除
        else if (key == "divide") {
          let tableArr = option.aggregate[0][key].split("/");
          if (tableArr[1] == "totalPrice") {
            this.groupAmountMap[gname].sum.forEach(item => {
              let value =
                (item /
                  this.groupAmountMap[gname].sum.reduce((a, b) => a + b)) *
                100;
              newAmount.push(value.toFixed(2));
            });
          } else {
            // 除数
            let computed1 = tableArr[0].split(".")[1];
            // 被除数
            let computed2 = tableArr[1].split(".")[1];
            // 除数表名
            let reduction = tableArr[0].split(".")[0];
            // 被除数的表名
            let minuend = tableArr[1].split(".")[0];
            // 需要被替换的表名
            let replaceTable = option.groupBy[0].split("/")[0];
            // 除数的gname
            let rGname = gname.replace(
              new RegExp(replaceTable, "g"),
              reduction
            );
            // 被除数的gname
            let mGname = gname.replace(new RegExp(replaceTable, "g"), minuend);
            mGname = mGname.replace(new RegExp(computed1, "g"), computed2);

            // 判断 this.groupAmountMap[gname].sum是否为空
            if (!this.groupAmountMap[rGname]) {
              this.otherTableReduce(gname, rGname, reduction, computed1);
            }
            if (
              JSON.stringify(this.groupAmountMap[rGname]) != "{}" &&
              this.groupAmountMap[rGname] != undefined
            ) {
              if (this.groupAmountMap[rGname].sum) {
                let arr: any = [];
                this.groupMap[rGname].forEach(item => {
                  this.groupMap[mGname].forEach((m, i) => {
                    if (item == m) {
                      arr.push(
                        this.groupAmountMap[mGname].sum[i]
                          ? this.groupAmountMap[mGname].sum[i]
                          : 0
                      );
                    }
                  });
                });
                this.groupAmountMap[rGname].sum.forEach((item, index) => {
                  if (this.groupAmountMap[mGname] != undefined) {
                    let value = (item / arr[index]) * 100;
                    newAmount.push(value.toFixed(2));
                  }
                });
              }
            }
          }
        } else {
          // 判断 this.groupAmountMap[gname].sum是否为空
          if (this.groupAmountMap[gname]) {
            newAmount = this.groupAmountMap[gname].sum;
          }
        }
      }
      let newGroup: any = [];
      if (newGroup) {
        newGroup = this.groupMap[gname];
      }
      if (newGroup && newAmount.length > 0) {
        option.chartOption = this.joinChartOption(option, newGroup, newAmount);
        option.dataArr = [newGroup, newAmount];
      }
    }
  }
  // 如果groupMap 和 groupAmountMap 不存在gname
  otherTableReduce(gname, rGname, tname, computed) {
    let cate = gname.split(";")[0].split("/")[1];
    if (this.data[tname]) {
      let data = this.data[tname];
      let group = [];
      data.forEach((item, index) => {
        if (item[cate]) {
          group.push(item[cate]);
        }
      });
      let newAmount: any = [];
      let count = 0,
        min = 0,
        max = 0;
      let newGroup = this.unique(group);

      newGroup.forEach(group => {
        let amount = 0;
        data.forEach((dt, index) => {
          if (dt[cate] == group) {
            if (dt[computed]) {
              count = count + 1;
              amount += Number(dt[computed]);

              if (index == 0) {
                max = dt[computed];
                min = dt[computed];
              } else {
                max = max > dt[computed] ? max : dt[computed];
                min = min < dt[computed] ? min : dt[computed];
              }
            }
          }
        });
        newAmount.push(amount);
      });
      let sum = 0;
      newAmount.forEach(item => {
        sum += item;
      });
      this.groupAmountMap[rGname] = {
        sum: newAmount,
        count: count,
        min: min,
        max: max,
        avg: (sum / count).toFixed(2)
      };
      this.groupMap[rGname] = newGroup;
    }
  }
  async computed(datas) {
    let reportArray = this.ReportArray;
    reportArray.reduce(async (p, option, index) => {
      if (option.sqlname) {
        // 后台有接口
        await this.sqlMapReduce(option, index);
      } else {
        await this.tableMapReduce(datas, option);
        await this.setChartOption(option);
      }
    }, 0);
  }
  valueFomatter(data) {
    if (Math.max(...data) > 10000) {
      return "{value}";
    } else {
      return "{value}";
    }
  }
  // 拼接chertOption
  toolbox: any = {
    show: true,
    orient: "vertical",
    left: "right",
    top: "center",
    feature: {
      //控制是否出现数据视图
      dataView: {
        show: true,
        readOnly: false
      },
      magicType: {
        show: true,
        //控制是否出现切换折线图和柱状图
        type: ["line", "bar"]
      },
      //还原按钮配置项
      restore: { show: true },
      //保存为图片配置项
      saveAsImage: { show: true }
    }
  };
  title(option) {
    return {
      text: option.name,
      left: "left",
      textStyle: {
        color: "#dcdcdc"
      }
    };
  }

  unit: any = [];
  // 设置单位
  setUnit() {
    this.ReportArray.forEach((item, index) => {
      this.unit.push("default" + index);
    });
  }
  // 单位切换
  unitChange(e, report, i, unit) {
    console.log(e, report, unit);
    if (
      ("tem" + report.name).indexOf("率") > 0 ||
      ("tem" + report.name).indexOf("增幅") > 0 ||
      ("tem" + report.name).indexOf("占比") > 0
    ) {
      alert("该图表不能切换单位");
      return;
    }
    // 默认
    if (e == "default" + i) {
      if (unit == "default" || unit == "default" + i) {
        return;
      }
      let series: any = report.chartOption.series;
      if (unit == "k" + i) {
        series.forEach((d, index) => {
          let data: any = [];
          d.data.forEach(item => {
            console.log(item);
            item = item * 1000;
            data.push(item);
          });
          series[index].data = data;
          if (
            series[index].hasOwnProperty("label") &&
            series[index].label.hasOwnProperty("formatter")
          ) {
            series[index].label.formatter = "{c}";
          }
        });
      } else if (unit == "w" + i) {
        series.forEach((d, index) => {
          let data: any = [];
          d.data.forEach(item => {
            console.log(item);
            item = item * 10000;
            data.push(item);
          });
          series[index].data = data;
          if (
            series[index].hasOwnProperty("label") &&
            series[index].label.hasOwnProperty("formatter")
          ) {
            series[index].label.formatter = "{c}";
          }
        });
      }
      report.chartOption.series = series;
      report.chartOptionNew = { series: series };
      this.cdRef.detectChanges();
    }
    // 以千为单位
    if (e == "k" + i) {
      if (unit == "k" + i) {
        return;
      }
      let series: any = report.chartOption.series;
      if (unit == "default" || unit == "default" + i) {
        series.forEach((d, index) => {
          let data: any = [];
          d.data.forEach(item => {
            item = (item / 1000).toFixed(2);
            data.push(item);
          });
          series[index].data = data;
          if (
            series[index].hasOwnProperty("label") &&
            series[index].label.hasOwnProperty("formatter")
          ) {
            series[index].label.formatter = "{c}K";
          }
        });
      } // 万 转 千
      else if (unit == "w" + i) {
        series.forEach((d, index) => {
          let data: any = [];
          d.data.forEach(item => {
            console.log(item);
            item = (item * 10).toFixed(2);
            data.push(item);
          });
          series[index].data = data;
          if (
            series[index].hasOwnProperty("label") &&
            series[index].label.hasOwnProperty("formatter")
          ) {
            series[index].label.formatter = "{c}K";
          }
        });
      }
      report.chartOption.series = series;
      report.chartOptionNew = { series: series };
      this.cdRef.detectChanges();
    }
    // 以万为单位
    if (e == "w" + i) {
      if (unit == "w" + i) {
        return;
      }
      let series: any = report.chartOption.series;
      //  默认转万
      if (unit == "default" || unit == "default" + i) {
        series.forEach((d, index) => {
          let data: any = [];
          d.data.forEach(item => {
            console.log(item);
            item = (item / 10000).toFixed(2);
            console.log(item);
            data.push(item);
          });
          series[index].data = data;
          if (
            series[index].hasOwnProperty("label") &&
            series[index].label.hasOwnProperty("formatter")
          ) {
            series[index].label.formatter = "{c}W";
          }
        });
      } // 由千转万
      else if (unit == "k" + i) {
        series.forEach((d, index) => {
          let data: any = [];
          d.data.forEach(item => {
            item = (item / 10).toFixed(2);
            data.push(item);
          });
          series[index].data = data;
          if (
            series[index].hasOwnProperty("label") &&
            series[index].label.hasOwnProperty("formatter")
          ) {
            series[index].label.formatter = "{c}W";
          }
        });
      }

      report.chartOption.series = series;
      report.chartOptionNew = { series: series };
      this.cdRef.detectChanges();
    }
  }
  blur(data, item) {
    data[2] = Number(item);
    this.CFS.forEach(c => {
      if (
        (c[0] == "五、现金及现金等价物净增加额" ||
          c[0] == "六、期末现金及现金等价物余额") &&
        data[0] == "四、汇率变动对现金及现金等价物的影响"
      ) {
        c[2] = Number(c[2]) + Number(item);
      }
      if (
        c[0] == "六、期末现金及现金等价物余额" &&
        data[0] == "加:期初现金及现金等价物余额"
      ) {
        c[2] = Number(c[2]) + Number(item);
      }
    });
    console.log(this.CFS);
    this.cdRef.detectChanges();
  }
  joinChartOption(option, data1, data2, data3?, data4?) {
    let chartOption: EChartOption = {};
    // 饼图
    if (option.view == "pie") {
      let r = Math.floor(Math.random() + 0.5);
      if (r == 0) {
        chartOption = {
          title: this.title(option),
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          toolbox: {
            show: true,
            orient: "vertical",
            left: "right",
            top: "center",
            feature: {
              //控制是否出现数据视图
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                //控制是否出现切换折线图和柱状图
                type: ["pie"]
              },
              //还原按钮配置项
              restore: { show: true },
              //保存为图片配置项
              saveAsImage: { show: true }
            }
          },
          color: [
            "#ffc107",
            "#00796b",
            "#5367fc",
            "#56a6d1",
            "#2469aa",
            "#df4d3b",
            "#752091",
            "#ff1d55",
            "#009966",
            "#FF9933"
          ],
          legend: {
            // orient: 'vertical',
            // top: 'middle',
            bottom: 10,
            left: "center",
            data: data1,
            textStyle: {
              color: "#eeeeee"
            }
          },
          series: [
            {
              type: "pie",
              radius: "55%",
              center: ["45%", "50%"],
              selectedMode: "single",
              data: this.pieTypeFun(data2, data1),

              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
      } else {
        chartOption = {
          title: {
            text: option.name,
            left: "left",
            textStyle: {
              color: "#fff"
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          toolbox: {
            show: true,
            orient: "vertical",
            left: "right",
            top: "center",
            feature: {
              //控制是否出现数据视图
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                //控制是否出现切换折线图和柱状图
                type: ["pie"]
              },
              //还原按钮配置项
              restore: { show: true },
              //保存为图片配置项
              saveAsImage: { show: true }
            }
          },
          color: [
            "#ffc107",
            "#00796b",
            "#5367fc",
            "#56a6d1",
            "#2469aa",
            "#df4d3b",
            "#752091",
            "#ff1d55",
            "#009966",
            "#FF9933"
          ],
          legend: {
            bottom: 10,
            left: "center",
            data: data1,
            textStyle: {
              color: "#eeeeee"
            }
          },
          series: [
            {
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center"
              },
              emphasis: {
                label: {
                  show: true,
                  // fontSize: "30",
                  fontWeight: "bold"
                }
              },
              labelLine: {
                show: false
              },
              data: this.pieTypeFun(data2, data1)
            }
          ]
        };
      }
    }
    // 柱状图
    else if (option.view == "bar") {
      let formatter =
        ("tem" + option.name).indexOf("率") > 0 ||
        ("tem" + option.name).indexOf("增幅") > 0 ||
        ("tem" + option.name).indexOf("占比") > 0
          ? "{c}%"
          : "{c}";
      let d1: any = [],
        d2: any = [];
      data1.forEach((item, i) => {
        //   if (data3) {
        //     if (data2[i] != 0 || data3[i] != 0) {
        //       d1.push(item);
        //       d2.push(data2[i]);
        //       d3.push(data3[i]);
        //     }
        //   } else
        if (data2[i] != 0) {
          d1.push(data1[i]);
          d2.push(data2[i]);
        }
      });
      chartOption = {
        title: this.title(option),
        tooltip: { trigger: "axis" },
        toolbox: this.toolbox,
        xAxis: {
          type: "category",
          data: d1,
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        grid: {
          left: "20",
          containLabel: true
        },
        series: [
          {
            data: d2,
            type: "bar",
            itemStyle: {
              normal: {
                color: function() {
                  var colorList = [
                    "#ffc107",
                    "#00796b",
                    "#5367fc",
                    "#56a6d1",
                    "#2469aa",
                    "#df4d3b",
                    "#752091",
                    "#ff1d55",
                    "#009966",
                    "#FF9933"
                  ];
                  let index = Math.floor(Math.random() * 10);
                  return colorList[index];
                }
              }
            },
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              formatter: formatter,
              textStyle: {
                //数值样式
                color: "#eee",
                fontSize: 16
              }
            }
          }
        ]
      };
    }
    // 折线图
    else if (option.view == "line") {
      let r = Math.floor(Math.random() + 0.5);
      if (r == 0) {
        chartOption = {
          title: {
            text: option.name,
            left: "left",
            textStyle: {
              color: "#dcdcdc"
            }
          },
          tooltip: { trigger: "axis" },
          toolbox: {
            show: true,
            orient: "vertical",
            left: "right",
            top: "center",
            feature: {
              //控制是否出现数据视图
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                //控制是否出现切换折线图和柱状图
                type: ["line", "bar"]
              },
              //还原按钮配置项
              restore: { show: true },
              //保存为图片配置项
              saveAsImage: { show: true }
            }
          },
          xAxis: {
            type: "category",
            data: data1,
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: "#fff"
            }
          },
          yAxis: {
            type: "value",
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: "#fff"
            }
          },
          grid: {
            left: "20",
            containLabel: true
          },
          series: [
            {
              data: data2,
              type: "line",
              lineStyle: {
                color: "",
                width: 5
              },
              itemStyle: {
                normal: {
                  color: function() {
                    var colorList = [
                      "#ffc107",
                      "#00796b",
                      "#5367fc",
                      "#56a6d1",
                      "#2469aa",
                      "#df4d3b",
                      "#752091",
                      "#ff1d55",
                      "#009966",
                      "#FF9933"
                    ];
                    let index = Math.floor(Math.random() * 10);
                    return colorList[index];
                  }
                }
              }
            }
          ]
        };
      } else {
        chartOption = {
          title: {
            text: option.name,
            left: "left",
            textStyle: {
              color: "#dcdcdc"
            }
          },
          tooltip: { trigger: "axis" },
          toolbox: {
            show: true,
            feature: {
              //控制是否出现数据视图
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                //控制是否出现切换折线图和柱状图
                type: ["line", "bar"]
              },
              //还原按钮配置项
              restore: { show: true },
              //保存为图片配置项
              saveAsImage: { show: true }
            }
          },
          xAxis: {
            type: "category",
            data: data1,
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: "#fff"
            }
          },
          yAxis: {
            type: "value",
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: "#fff"
            }
          },
          grid: {
            left: "20",
            containLabel: true
          },
          series: [
            {
              data: data2,
              type: "line",
              areaStyle: {},
              itemStyle: {
                normal: {
                  color: function() {
                    var colorList = [
                      "#ffc107",
                      "#00796b",
                      "#5367fc",
                      "#56a6d1",
                      "#2469aa",
                      "#df4d3b",
                      "#752091",
                      "#ff1d55",
                      "#009966",
                      "#FF9933"
                    ];
                    let index = Math.floor(Math.random() * 10);
                    return colorList[index];
                  }
                }
              }
            }
          ]
        };
      }
    }
    // 柱状瀑布图
    else if (option.view == "bar-waterfall") {
      let sum = data2.reduce((prev, cur) => {
        return Number(prev) + Number(cur);
      });

      let d1 = ["总计", ...data1];
      let d2 = [sum, ...data2];
      let d3 = [];
      for (let index = 0; index < data2.length; index++) {
        if (index == 0) {
          d3.push(sum - data2[index]);
        } else {
          d3.push(d3[index - 1] - data2[index]);
        }
      }
      d3.unshift("0");
      chartOption = {
        title: this.title(option),
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            var tar = params[1];
            return tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
          }
        },
        toolbox: this.toolbox,
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          splitLine: { show: false },
          data: d1,
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        series: [
          {
            name: "",
            type: "bar",
            stack: "总量",
            itemStyle: {
              barBorderColor: "rgba(0,0,0,0)",
              color: "rgba(0,0,0,0)"
            },
            emphasis: {
              itemStyle: {
                barBorderColor: "rgba(0,0,0,0)",
                color: "rgba(0,0,0,0)"
              }
            },
            data: d3
          },
          {
            name: "",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "inside",
              formatter: "{c}"
            },
            data: d2,
            itemStyle: {
              normal: {
                color: function() {
                  var colorList = [
                    "#ffc107",
                    "#00796b",
                    "#5367fc",
                    "#56a6d1",
                    "#2469aa",
                    "#df4d3b",
                    "#752091",
                    "#ff1d55",
                    "#009966",
                    "#FF9933"
                  ];
                  let index = Math.floor(Math.random() * 10);
                  return colorList[index];
                }
              }
            }
          }
        ]
      };
    }
    // 横向柱状图
    else if (option.view == "bar-y") {
      let formatter =
        ("tem" + option.name).indexOf("率") > 0 ||
        ("tem" + option.name).indexOf("增幅") > 0 ||
        ("tem" + option.name).indexOf("占比") > 0
          ? "{c}%"
          : "{c}";
      chartOption = {
        title: this.title(option),
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        toolbox: this.toolbox,
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        yAxis: {
          type: "category",
          data: data1,
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        series: [
          {
            type: "bar",
            data: data2,
            label: {
              show: true,
              position: "inside ",
              formatter: formatter
            },
            itemStyle: {
              normal: {
                color: this.colorFun
              }
            }
          }
        ]
      };
    }
    // 多维横向柱状图
    else if (option.view == "bars-y") {
      let formatter =
        ("tem" + option.name).indexOf("率") > 0 ||
        ("tem" + option.name).indexOf("增幅") > 0 ||
        ("tem" + option.name).indexOf("占比") > 0
          ? "{c}%"
          : "{c}";
      let d1: any = [],
        d2: any = [],
        d3: any = [];
      data1.forEach((item, i) => {
        if (data3) {
          if (data2[i] != 0 || data3[i] != 0) {
            d1.push(item);
            d2.push(data2[i]);
            d3.push(data3[i]);
          }
        } else if (data2[i] != 0) {
          d1.push(item);
          d2.push(data2[i]);
        }
      });
      chartOption = {
        title: this.title(option),
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: option.legend,
        toolbox: this.toolbox,
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        yAxis: {
          type: "category",
          data: data1,
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        series: [
          {
            name: option.legend.data[0],
            type: "bar",
            data: d2,
            label: {
              show: true,
              position: "insideLeft",
              formatter: formatter
            },
            itemStyle: {
              normal: {
                color: "#FF0000"
              }
            }
          },
          {
            name: option.legend.data[1],
            type: "bar",
            data: d3,
            label: {
              show: true,
              position: "insideLeft"
            },
            itemStyle: {
              normal: {
                color: "#EEAD0E"
              }
            }
          }
        ]
      };
    }
    // 正负柱状图
    else if (option.view == "bar-negative") {
      let d1: any = [],
        d2: any = [],
        d3: any = [];
      data1.forEach((item, i) => {
        if (data2[i] != 0 || data3[i] != 0) {
          d1.push(data1[i]);
          d2.push(data2[i]);
          d3.push(data3[i] > 0 ? -data3[i] : data3[i]);
        }
      });
      chartOption = {
        title: this.title(option),
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        toolbox: this.toolbox,
        legend: option.legend,
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "value",
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: "#fff"
            }
          }
        ],
        yAxis: [
          {
            type: "category",
            axisTick: {
              show: false
            },
            data: d1,
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: "#fff"
            }
          }
        ],
        series: [
          {
            name: option.legend.data[0],
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: " insideLeft"
            },
            data: d2,
            itemStyle: {
              normal: {
                color: "#2469aa"
              }
            }
          },
          {
            name: option.legend.data[1],
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "insideRight"
            },
            data: d3,
            itemStyle: {
              normal: {
                color: "#56a6d1"
              }
            }
          }
        ]
      };
    }
    // 多维纵向柱状图
    else if (option.view == "bar-label") {
      let formatter =
        ("tem" + option.name).indexOf("率") > 0 ||
        ("tem" + option.name).indexOf("增幅") > 0 ||
        ("tem" + option.name).indexOf("占比") > 0
          ? "{c}%"
          : "{c}";
      let series: any = [];
      if (data2) {
        let d = {
          name: option.legend.data[0],
          type: "bar",
          label: {
            show: true,
            position: "inside",
            formatter: formatter,
            align: "left",
            verticalAlign: "middle",

            rich: {
              name: {
                textBorderColor: "#fff"
              }
            }
          },
          data: data2
        };
        series.push(d);
      }
      if (data3) {
        let d = {
          name: option.legend.data[1],
          type: "bar",
          label: {
            show: true,
            position: "inside",
            align: "left",
            verticalAlign: "middle",
            formatter: formatter,
            rich: {
              name: {
                textBorderColor: "#fff"
              }
            }
          },
          data: data3
        };
        series.push(d);
      }
      if (data4) {
        let d = {
          name: option.legend.data[3],
          type: "bar",
          label: {
            show: true,
            position: "inside",
            formatter: formatter,
            align: "left",
            verticalAlign: "middle",
            rich: {
              name: {
                textBorderColor: "#fff"
              }
            }
          },
          data: data4
        };
        series.push(d);
      }
      chartOption = {
        title: {
          text: option.name,
          left: "left",
          textStyle: {
            color: "#dcdcdc"
          }
        },
        color: ["#e5323e", "#006699", "#4cabce"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "20",
          containLabel: true
        },
        legend: option.legend,
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: data1,
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: "#fff"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: "#fff"
            }
          }
        ],
        series: series
      };
    }

    return chartOption;
  }
  colorFun() {
    let colorList = [
      "#ffc107",
      "#00796b",
      "#5367fc",
      "#56a6d1",
      "#2469aa",
      "#df4d3b",
      "#752091",
      "#ff1d55",
      "#009966",
      "#FF9933"
    ];
    let index = Math.floor(Math.random() * 10);
    return colorList[index];
  }
  // 选择销售
  salesTab(t) {
    let tagsNameArr = this.tagName.split("-");
    this.tagName = t.name + "-" + tagsNameArr[1];
    this.tags[0] = t.name;
  }
  cateTab(t) {
    let tagsNameArr = this.tagName.split("-");
    this.tagName = tagsNameArr[0] + "-" + t.name;
    this.tags[1] = t.name;
  }

  tab(t) {
    let cate = ["部门", "区域", "业务员", "客户", "产品"];
    let data = this.allAmountArr;
    let chartOptionArr: any = [];
    if (t.value == "BISalesGross") {
      //
      let cateGrossArr = this.grossFun();
      data.forEach((item, index) => {
        let value = t.value;
        let chartOption: EChartOption = {};
        let title = "各" + cate[index] + "毛利";
        chartOption = {
          title: {
            text: title
          },
          xAxis: {
            type: "category",
            data: this.allCateArr[index].BISalesOrder
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "毛利额",
              data: cateGrossArr[index],
              type: "bar",
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    formatter: "{c}",
                    textStyle: {
                      //数值样式
                      color: "black",

                      fontSize: 16
                    }
                  }
                }
              }
            }
          ]
        };
        chartOptionArr.push(chartOption);
        // this.ReportArray.forEach(item => {
        //   if (item.name == title) {
        //     item.chartOption = chartOption;

        //   }
        // });
      });
    } else {
      data.forEach((item, index) => {
        let value = t.value;
        let chartOption: EChartOption = {};
        let title = "各" + cate[index] + t.tName;
        chartOption = {
          title: {
            text: title,
            left: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            // orient: 'vertical',
            // top: 'middle',
            bottom: 10,
            left: "center",
            data: this.allCateArr[index][value]
          },
          series: [
            {
              type: "pie",
              radius: "65%",
              center: ["50%", "50%"],
              selectedMode: "single",
              data: this.pieTypeFun(item[value], this.allCateArr[index][value]),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        chartOptionArr.push(chartOption);
        // this.ReportArray.forEach(item => {
        //   if (item.name == title) {
        //     item.chartOption = chartOption;

        //   }
        // });
      });
    }

    return chartOptionArr;
  }
  // 销售完成率
  completionRate() {
    let datas = this.allAmountArr,
      cate = ["部门", "区域", "业务员", "客户", "产品"],
      chartOptionArr: any = [],
      cateCompletionRate: any = [];
    datas.forEach(item => {
      let completionArr: any = [];
      if (!item.BISalesBudget) {
        return;
      }
      item.BISalesOrder.forEach((li, i) => {
        let rate: any = 0;
        rate = ((li / item.BISalesBudget[i]) * 100).toFixed(2);
        completionArr.push(rate);
      });
      cateCompletionRate.push(completionArr);
    });
    cateCompletionRate.forEach((item, index) => {
      let chartOption: EChartOption = {};
      let title = "各" + cate[index] + "销售完成率";
      chartOption = {
        title: {
          text: "各" + cate[index] + "销售完成率"
        },
        xAxis: {
          type: "category",
          data: this.allCateArr[index].BISalesOrder
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "完成率",
            data: item,
            type: "bar",
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  formatter: "{c}%",
                  textStyle: {
                    //数值样式
                    color: "black",
                    fontSize: 12
                  }
                }
              }
            }
          }
        ]
      };
      chartOptionArr.push(chartOption);
      // this.ReportArray.forEach(item => {
      //   if (item.name == title) {
      //     item.chartOption = chartOption;
      //   }
      // });
    });
    this.salesCompletionRate = chartOptionArr;
  }
  // 毛利
  grossFun() {
    let datas = this.allAmountArr,
      cateGrossArr: any = [];
    datas.forEach((item, index) => {
      let grossArr: any = [];
      if (!item.BISalesDeal) {
        return;
      }
      item.BISalesOrder.forEach((li, i) => {
        let gross: any = 0;
        gross = li - item.BISalesDeal[i];
        grossArr.push(gross);
      });

      cateGrossArr.push(grossArr);
    });
    return cateGrossArr;
  }
  // 毛利率
  grossRate() {}
  async isSaveReport() {
    let report = new Parse.Query("BIReportArray");
    report.equalTo("company", this.companyId);
    report.equalTo("company", this.companyId);
    report.equalTo("report", this.RID);
    report.equalTo("category", this.categoryId);
    let result = await report.first();
    if (!result) {
      await this.saveReport();
    } else {
      this.hasReport = true;
    }
  }
  confirmSave() {
    this.saveReport();
    this.hasReport = false;
  }
  cancelSave() {
    this.hasReport = false;
  }
  // 保存报表
  async saveReport() {
    let QueryReportArray = Parse.Object.extend("BIReportArray");
    let reportSave = new QueryReportArray();
    let reportQuery = new Parse.Query(QueryReportArray);

    reportQuery.equalTo("company", this.companyId);
    reportQuery.equalTo("report", this.RID);
    reportQuery.equalTo("category", this.categoryId);
    let report = await reportQuery.first();

    // let reportArray: any = report.get("ReportArray");
    // reportArray.ReportArray = this.ReportArray;
    if (report) {
      report.set("ReportArray", this.ReportArray);
      report.set("groupMap", this.groupMap);
      report.set("groupAmountMap", this.groupAmountMap);
      report.set("tags", this.mainTab);
      report
        .save()
        .then(async redata => {
          alert("保存完成");
        })
        .catch(async err => {
          alert("保存失败，请稍后重试");
        });
    } else {
      reportSave.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: this.companyId
      });
      reportSave.set("report", {
        __type: "Pointer",
        className: "BIReport",
        objectId: this.RID
      });
      reportSave.set("category", {
        __type: "Pointer",
        className: "Category",
        objectId: this.categoryId
      });
      reportSave.set("ReportArray", this.ReportArray);
      reportSave.set("groupMap", this.groupMap);
      reportSave.set("groupAmountMap", this.groupAmountMap);
      reportSave.set("tags", this.mainTab);
      reportSave
        .save()
        .then(async redata => {
          alert("保存完成");
        })
        .catch(async err => {
          alert("保存失败，请稍后重试");
        });
    }
    // await reportSave.set("ReportArray", this.ReportArray);

    // let category = new Parse.Query(Category);
  }
  // 用户查找
  async queryUsers() {
    let queryUser = Parse.Object.extend("User");
    let users = new Parse.Query(queryUser);
    users.equalTo("company", this.companyId);
    let result = await users.find();
    this.userList = result;
  }
  // 选择推送对象
  pushReport() {
    this.isChooseUser = true;
  }
  chooseUser(user) {
    // 查找用户

    this.userId = user.id;
    // 公司的id 6WwUcNianI"
    // 解决跨域 post 需要加上header
  }
  async reportOk() {
    if (!this.userId) {
      alert("请选择推送对象");
    }

    let headers: HttpHeaders = new HttpHeaders({});
    headers.append("Content-Type", "application/json");

    //
    let url = "https://server.fmode.cn/api/wechat/send/custom/news",
      data = {
        touser: this.userId,
        article: {
          title: "未来飞马八月财务报表",
          description: "您有一份新的报表，请查收！",
          url: `https://pwa.futurestack.cn/bi-report/bi-dashboard/;company=${this.companyId};RID=${this.RID}`,
          picurl: "assets/img/BI/report.jpg"
        }
      };
    await this.http.post(url, data, { headers: headers }).subscribe(res => {
      console.log(res, this.userId);
    });
    this.isChooseUser = false;
  }
  pushCancel() {
    this.isChooseUser = false;
  }
  // 过滤 ReportArray
  filterReportArray() {
    this.ReportArray.forEach(item => {
      // item.tags
    });
  }
  // 选择图标
  chooseChart(report) {
    this.isChooseChart = !this.isChooseChart;
    this.cdRef.detectChanges();

    this.changeChart = report;
  }
  // 切换图表
  bar() {
    let report = this.changeChart;
    report.view = "bar";

    this.setChartOption(report);
    this.isChooseChart = !this.isChooseChart;
  }
  line() {
    let report = this.changeChart;
    report.view = "line";

    this.setChartOption(report);
    this.isChooseChart = !this.isChooseChart;
  }
  lineArea() {
    let report = this.changeChart;
    report.view = "line";

    this.setChartOption(report);
    this.isChooseChart = !this.isChooseChart;
  }
  pie() {
    let report = this.changeChart;
    report.view = "pie";

    this.setChartOption(report);
    this.isChooseChart = !this.isChooseChart;
  }
  // 制作驾驶舱
  async makeCockpit() {
    let report = new Parse.Query("BIReportArray");
    report.equalTo("company", this.companyId);
    report.equalTo("report", this.RID);
    report.equalTo("category", this.categoryId);
    let result = await report.first();
    if (!result) {
      alert("请先保存报表");
      return;
    }
    await this.router.navigate([
      "finance/cockpit",
      {
        company: this.companyId,
        Rid: this.RID,
        cate: this.categoryId
      }
    ]);
  }
  treeOption: EChartOption;
  treeData: any;
  setTreeOption() {
    let data = {
      name: "净资产收益率",
      children: [
        {
          name: "总资产净利率",
          children: [
            {
              name: "销售净利率",
              children: [
                { name: "净利润", value: null },
                { name: "÷" },
                { name: "主营业务收入净额", value: null }
              ]
            },
            {
              name: "X"
            },
            {
              name: "总资产周转率",
              children: [
                { name: "主营业务收入净额", value: null },
                { name: "÷" },
                { name: "资产平均总额", value: null }
              ]
            }
          ]
        },
        { name: "X" },
        {
          name: "权益乘数",
          children: [
            {
              name: "1÷(1-资产负债率)",
              children: [
                { name: "负债总额", value: null },
                { name: "÷" },
                { name: "资产总额", value: null }
              ]
            }
          ]
        }
      ]
    };
    this.treeData = data
    let option: EChartOption = {
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove"
      },
      series: [
        {
          type: "tree",
          name: "tree1",
          data: [this.treeData],

          top: "10%",
          left: "8%",
          bottom: "22%",
          right: "8%",

          symbol: "emptyCircle",
          orient: "vertical",

          // edgeShape: "polyline",
          // edgeForkPosition: "60%",
          initialTreeDepth: 3,

          lineStyle: {
            width: 2
          },

          label: {
            backgroundColor: "#fff",
            position: "left",
            lineHeight: 30,
            verticalAlign: "middle",
            align: "center",
            borderWidth: 2,
            borderColor: "black",
            padding: 5,
            width: 50,
            fontSize: 20
          },

          leaves: {
            label: {
              position: "right",
              verticalAlign: "middle",
              align: "center",
              lineHeight: 30
            }
          },

          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    };
    this.treeOption = option;
  }
}


