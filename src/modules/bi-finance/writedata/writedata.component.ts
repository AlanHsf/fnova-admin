import { Component, OnInit, ViewChild } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import * as XLSX from "xlsx";
import { HttpClient } from "@angular/common/http";
import * as Parse from "parse";
import "ag-grid-community";
// import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { Router, ActivatedRoute } from "@angular/router";
import { count } from "console";
import { async } from "@angular/core/testing";
import { query } from '@angular/animations';
import { NzModalService } from 'ng-zorro-antd/modal';

type AOA = any[][];
type CreateRangeChartParams = any;
@Component({
  selector: "app-writedata",
  templateUrl: "./writedata.component.html",
  styleUrls: ["./writedata.component.scss"]
})
export class WritedataComponent implements OnInit {
  // @ViewChild("agGrid") agGrid: AgGridAngular;

  public SchemaList: Array<any>; // 根据类别加载的基本表
  public SchemaDataMap: any = {}; // 各类表加载的数据源
  public currentSchema: any; // 当前表格操作的Schema的schemaName
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
    // alwaysShowVerticalScroll: true,
    // suppressColumnVirtualisation: false,
  };

  // private 表头高度设置
  private groupHeaderHeight;
  private headerHeight;
  private floatingFiltersHeight;
  private pivotGroupHeaderHeight;
  private pivotHeaderHeight;
  private immutableStore;
  private aggFuncs;
  isShow: Boolean = false;
  lineFileds: any = []; // BIDevSchema每张表对应的fileds
  fields: any; // 选填必填的表头
  field: any = []; // 所有表头的filed
  importFields: any;
  isReport: Boolean = false; // 生成报表的遮罩
  importField: any = [];
  data: any = [
    [1, 2],
    [3, 4]
  ];
  // wopts: XLSX.WritingOptions = { bookType: "xlsx", type: "array" };
  wopts: XLSX.WritingOptions = { bookType: "xlsx", type: "file" };
  fileName: string = "SheetJS.xlsx";
  importColumnDefs: any = {}; // 导入项表头
  RID: any; // 用户创建报表的Id
  cate: any;
  SID: any; // 基础表的ID
  sum: any = 0; // 求和
  dataMap: any = {}; //所有表的数据
  entering: Boolean = false;
  delete: Boolean = false;
  schema: any; // 需要删除表
  schemaIndex: any = 0; // 当前表在SchemaList下的下标
  synchronize: String = "未同步";
  tableType: String = "";
  companyId: any;
  reportType: any;
  selectedIndex: number;
  isVisible: Boolean = false;
  productionGroupBy: any[];
  isChoose: Boolean = false;
  groupBys: any = [];
  constructor(
    private modalService: NzModalService,
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.aggFuncs = {
      sum: sumFunction
    };
  }
  ngOnInit() {
    // 设置表格参数
    // 表头的高度参数
    this.groupHeaderHeight = 40;
    this.headerHeight = 40;
    this.floatingFiltersHeight = 40;
    this.pivotGroupHeaderHeight = 50;
    this.pivotHeaderHeight = 100;

    // 加载表格列表
    this.productionGroupBy = [
      {
        name: "产品",
        value: "productName"
      },
      {
        name: "物料类别(一级)",
        value: "materialTypeA"
      },
      {
        name: "物料类别(二级)",
        value: "materialTypeB"
      }
    ];
    this.route.paramMap.subscribe(async params => {
      
      this.cate = params.get("cate")
      this.RID = params.get("id");

      // reportDate =
      let user = Parse.User.current();
      this.companyId = user.get("company").id;
      let innerQuery = new Parse.Query("Category");
      innerQuery.equalTo("type", "bischema");
      innerQuery.equalTo("name", this.cate);
      let query = new Parse.Query("BIDevSchema");
      query.matchesQuery("category", innerQuery);
      let result = await query.find();
      let list = [];
      result.forEach(item => {
        if (item.get("type") == "data") {
          list.push(item);
        }
      });
      result.forEach(item => {
        if (item.get("type") == "base") {
          list.push(item);
        }
      });
      this.SchemaList = list;
      this.schema = this.SchemaList[0];
      this.selectedIndex = 1;
      this.queryBIDevSchema(this.SchemaList[0]); // 加载首张表的Schema结构
    });
  }
  loadTempData(schema) {
    let tmpObj = {};
    if (schema.get("requiredColumns")) {
      schema.get("requiredColumns").forEach(key => {
        tmpObj[key] = "暂无";
      });
    }

    if (
      !this.SchemaDataMap[schema.get("schemaName")] ||
      this.SchemaDataMap[schema.get("schemaName")].length < 1
    ) {
      this.SchemaDataMap[schema.get("schemaName")] = [tmpObj];
    }
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

  // 选择文件
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
      console.log(ws);

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
      this.importColumnDefs[this.currentSchema] = columnDefs;
      this.columnDefs = [
        ...this.columnDefs,
        { headerName: "导入项", children: columnDefs }
      ];
      this.rowData = this.data;
      this.SchemaDataMap[this.currentSchema] = this.data;

      this.importFields = keyAry;
      // this.staticsCount(data);
      this.importField[0] = this.importColumnDefs[this.currentSchema][0].filed;
    };

    reader.readAsBinaryString(target.files[0]);
    let drop = document.getElementById("dropBox");
    console.log(this.SchemaDataMap[this.currentSchema].length);
    // 拖拽区域的显示
    if (this.SchemaDataMap[this.currentSchema].length >= 1) {
      drop.style.display = "none";
    }
  }

  // getData() {}
  // 表格大小自适应
  onGridReady(params) {
    this.api = params.api;
    this.columnApi = params.columnApi;

    params.api.sizeColumnsToFit();
    // this.staticsCount();
  }
  staticsCount(data) {
    var count = 0;
    for (var i = 0; i < data.length; i++) {
      count = count + parseInt(data[i].数量);
    }
    var topRows = [{ 数量: count }];

    this.api.setPinnedTopRowData(topRows); //在顶部显示合计行
    this.api.setPinnedBottomRowData(topRows); //在底部显示合计行
  }

  // 错误数据处理
  numCellRenderer(params) {
    let value;
    if (Number(params.value)) {
      value = Number(params.value);
    } else if (params.value == undefined) {
      value = "";
    } else {
      value = params.value;
    }

    const eDivPercentBar = document.createElement("div");
    eDivPercentBar.className = "div-schemaname";
    eDivPercentBar.innerHTML = value;
    // console.log(typeof value);

    if (typeof value === "number" || value == "") {
      eDivPercentBar.style.backgroundColor = "yellow";
    } else {
      eDivPercentBar.style.backgroundColor = "#FFCDD2";
    }
    return eDivPercentBar;
  }
  //  导出
  export() {
    this.api.exportDataAsExcel({});
  }
  // 导入
  import() {
    let drop = document.getElementById("drop-box");
    console.log(123);
    if (drop.style.display == "none") {
      drop.style.display = "block";
    } else {
      drop.style.display = "none";
    }
  }

  async queryBIDevSchema(schema) {
    this.loadTempData(schema);

    this.currentSchema = schema.get("schemaName");
    // 切换表格导入遮罩的显示隐藏

    let BIReoprt = Parse.Object.extend("BIReport");
    // let Rid = await queryRId.find()
    let BIDevSchema = Parse.Object.extend("BIDevSchema");

    let queryBDS = new Parse.Query(BIDevSchema);
    queryBDS.equalTo("schemaName", this.currentSchema);

    let result = await queryBDS.first();
    this.SID = result.id;
    let require = result.get("requiredColumns");
    this.lineFileds = result.get("fields");
    let options = result.get("optionColumns");

    let type = result.get("type");
    this.tableType = type;
    let requireChildren: any = [],
      optionsChildren: any = [];
    if (require) {
      require.forEach(item => {
        let chartDataType = "series";
        if (("tmp" + item).indexOf("名") > 0) {
          chartDataType = "category";
        }
        let columnType = null,
          valueFormatter = null,
          valueParse = null;
        if (("tmp" + item).indexOf("价") > 0) {
          columnType = "numberColumn";
        }
        if (("tmp" + item).indexOf("额") > 0) {
          columnType = "numberColumn";
        }
        if (("tmp" + item).indexOf("数") > 0) {
          columnType = "numberColumn";
        }
        if (("tmp" + item).indexOf("量") > 0) {
          columnType = "numberColumn";
        }
        if (("tmp" + item).indexOf("量") > 0) {
          valueParse = numberValueParser;
          valueFormatter = currencyFormatter;
        }
        requireChildren.push({
          headerName: item,
          field: item
        }); // , pinned: "left"
      });
    }
    if (options) {
      options.forEach(item => {
        let chartDataType = "series";
        if (("tmp" + item).indexOf("名") > 0) {
          chartDataType = "category";
        }
        let columnType = null;
        if (("tmp" + item).indexOf("价") > 0) {
          columnType = "numberColumn";
        }
        if (("tmp" + item).indexOf("额") > 0) {
          columnType = "numberColumn";
        }
        if (("tmp" + item).indexOf("数") > 0) {
          columnType = "numberColumn";
        }
        if (("tmp" + item).indexOf("量") > 0) {
          columnType = "numberColumn";
        }
        optionsChildren.push({
          headerName: item,
          field: item
          // chartDataType: chartDataType
          // columnTypes: columnType
        });
      });
    }
    // 点击切换基础表，判断是否有数据，有则添加导入项，
    if (type == "data") {
      if (this.importColumnDefs[this.currentSchema]) {
        this.columnDefs = [
          {
            headerName: "必填项(生成图表必须填写的数据)",
            children: requireChildren
          },
          {
            headerName: "选填项(扩展更多的图表)",
            children: optionsChildren
          },
          {
            headerName: "导入项",
            children: this.importColumnDefs[this.currentSchema]
          }
        ];
      } else {
        this.columnDefs = [
          {
            headerName: "必填项(生成图表必须填写的数据)",
            children: requireChildren
          },
          {
            headerName: "选填项(扩展更多的图表)",
            children: optionsChildren
          }
        ];
      }
    } else {
      this.columnDefs = requireChildren;
    }
    // fields
    this.fields = [...requireChildren, ...optionsChildren];
    this.importField = [];
    this.fields.forEach((item, index) => {
      this.field[index] = item.field;
    });
    await this.loadingData();
    await this.showDorp();
  }
  // 加载数据表格数据
  async loadingData() {
    let newSchema = new Parse.Schema(this.currentSchema);
    newSchema.get().then(async () => {
      let queryData = new Parse.Query(this.currentSchema);
      let equalField: any, equalStr: any;
      if (this.tableType == "data") {
        equalField = "name";
        equalStr = this.RID + "_" + this.SID;
      } else if (this.tableType == "base") {
        equalField = "company";
        equalStr = this.companyId;
      }

      queryData.equalTo(equalField, equalStr);
      queryData.limit(100000);
      let result = await queryData.find();
      if (result.length > 0) {
        this.synchronize = "已同步";
        let rowData = [];
        let fields = this.lineFileds;
        result.forEach(item => {
          //转换
          let rowObj = {};
          fields.forEach(field => {
            let value: any;
            if (field.dateType == "Date") {
              let date = new Date(item.get(field.field));
              let year = date.getFullYear();
              let month = date.getMonth() + 1;
              let day = date.getDate();
              value = year + "/" + month + "/" + day;
            } else {
              value = item.get(field.field);
            }
            rowObj = { ...rowObj, [field.headerName]: value };
          });
          rowData.push(rowObj);
        });
        this.SchemaDataMap[this.currentSchema] = rowData;
      }
      await this.showDorp();
    });
    // }
  }
  // 拖拽区域的显示与隐藏
  showDorp() {
    // 是否显示拖拽区域
    let drop = document.getElementById("dropBox");
    if (this.SchemaDataMap[this.currentSchema].length > 1) {
      drop.style.display = "none";
    } else {
      drop.style.display = "block";
    }
  }
  async loadSchema(schema, i) {
    this.cdRef.detectChanges();
    this.schemaIndex = i;
    console.log(i);
    this.synchronize = "未同步";
    this.queryBIDevSchema(schema);
  }
  // 是否全部存完
  async isSaveAll() {
    let all: any = [];
    await this.SchemaList.reduce(async (p, item, index) => {
      console.log(item.get("schemaName"));
      let queryData = new Parse.Query(item.get("schemaName"));
      queryData.equalTo("name", this.RID + "_" + item.id);
      queryData.equalTo("company", this.companyId);
      let result: any = await queryData.count();
      if (result > 0) {
        all.push(true);
      } else {
        all.push(false);
      }
    }, 0);
    let isAll = all.every(item => item);
    if (!isAll) {
      this.isVisible = true;
    } else if (this.cate == "生产" || this.cate == "财务报表指标") {
      this.isChoose = true
    } else {
      this.onChart1();
    }
  }
// 报表指选择资产负债表的模版
  template:any
  make(): void {
    this.isVisible = false;
    this.onChart1();
  }

  cancelMake(): void {
    this.isVisible = false;
    this.isChoose = false;
  }

  // 生成报表 Generate reports
  async onChart1(groupBys?) {
    this.isReport = true;
    await this.cdRef.detectChanges();
    console.log(this.isReport);
    // let datas: any = [];
    let list = this.SchemaList;
    list.reduce(async (pre, cur, index, list) => {
      console.log(cur);
      for (const key in this.SchemaDataMap) {
        console.log(cur.get("schemaName"));
        if (
          cur.get("schemaName") == key &&
          this.SchemaDataMap[key].length > 1
        ) {
          console.log(cur);
          if (!localStorage.getItem(this.RID + "_" + cur.id)) {
            localStorage.setItem(
              this.RID + "_" + cur.id,
              JSON.stringify(this.SchemaDataMap[key])
            );
          }
        }
      }
    }, 0);
    setTimeout(async () => {
      await this.router.navigate([
        "finance/report",
        {
          Sid: this.SID,
          Rid: this.RID,
          cate: this.cate,
          currentSchema: this.currentSchema,
          groups: groupBys? groupBys: ''
        }
      ]);
      this.isReport = false;
    }, 1000);
  }
  // 选择分类
  // 确定groupBys
 
  confirmChoose() {
    if (this.cate == '生产' && this.groupBys.length < 1) {
      alert("请先选择分类")
      return
    }
    console.log(this.template)
    if (this.cate == "财务报表指标" && !this.template) {
      alert("请先选择模版");
      return;
    }
   
    if (this.cate == "财务报表指标") {
      this.onChart1(this.template)
    }
    if (this.cate == "生产") {
      this.onChart1(this.groupBys);
    }
     this.isChoose = false;
  }

  changeImportField(e, i) {
    this.importField[i] = e;
  }
  changeField(e) {
    this.field = e;
  }
  // 数据录入的弹出框
  enterData() {
    this.isShow = true;
    console.log(this.fields, this.importColumnDefs[this.currentSchema]);
    this.fields.forEach((item, index) => {
      if (this.importColumnDefs[this.currentSchema]) {
        let has = this.importColumnDefs[this.currentSchema].find(li => {
          return item.headerName == li.headerName;
        });
        if (has) {
          this.importField[index] = item.field;
        } else {
          this.importField[index] = "";
        }
      }
    });
    console.log(this.importField);
    this.cdRef.detectChanges();
  }
  handleCancel() {
    this.isShow = false;
    this.delete = false;
  }
  // 确认录入
  handleOk() {
    let fields = this.field,
      importField = this.importField;
    console.log(fields, importField);
    this.entering = true;
    console.log(this.api.forEachNode);
    this.api.forEachNode(node => {
      console.log(node);
      importField.reduce((p, field, i) => {
        node.data[field];
        if (field == fields[i]) {
          return;
        }
        if (
          node &&
          node.data &&
          node.data[field] &&
          node.data[field] != "" &&
          fields[i]
        ) {
          console.log(fields[i], field, node.data[field]);
          console.log(node.setDataValue(fields[i], node.data[field]));
          node.setDataValue(fields[i], node.data[field]);
        }
      }, 0);
    });
    this.cdRef.detectChanges();
    // this.entering = false;
    this.isShow = false;
  }
  // 删除错误表弹窗
  deleteTable() {
    this.delete = true;
  }
  // 选择需要删除的错误表
  chooseDelect(e) {
    this.schema = e;
  }
  // 确定删除
  async delectOk() {
    let key = this.RID + "_" + this.schema.id;
    let schemaName = this.schema.get("schemaName");
    localStorage.removeItem(key);
    let tmpObj = {};
    if (this.schema.get("requiredColumns")) {
      this.schema.get("requiredColumns").forEach(key => {
        tmpObj[key] = "暂无";
      });
    }
    // 删除线上数据
    let query = new Parse.Query(this.currentSchema);
    let list: any;
    if (this.tableType == "data") {
      query.equalTo("name", this.RID + "_" + this.SID);
      query.equalTo("company", this.companyId);
      query.limit(20000);
      list = await query.find();
    } else if (this.tableType == "base") {
      query.equalTo("company", this.companyId);
      query.limit(20000);
      list = await query.find();
    }
    console.log(list);
    Parse.Object.destroyAll(list).then(data => {
      console.log("删除成功");
    });
    this.SchemaDataMap[schemaName] = [tmpObj];
    let drop = document.getElementById("dropBox");
    this.synchronize = "未同步";
    drop.style.display = "block";
    this.delete = false;
  }

  read() {
    let BIReoprtData = Parse.Object.extend("BIReportData");
    let queryData = new Parse.Query(BIReoprtData);
    let result = queryData.find();
    console.log(result);
    let list: any = [];
    list = result;
    list.forEach(item => {
      item.get("rowData");
      console.log(item.get("rowData"));
    });
  }
  // 存线上
  async saveLine() {
    let data = this.SchemaDataMap[this.currentSchema];
    let fields = this.lineFileds;
    let newData: any = [];
    console.log(data);
    data.forEach(item => {
      let itemObj: any = {};
      for (const key in item) {
        fields.forEach(field => {
          let fieldKey = field.field;
          if (field.headerName == key) {
            itemObj = { ...itemObj, [fieldKey]: item[key] };
          }
        });
      }
      newData.push(itemObj);
    });
    let newSchema = new Parse.Schema(this.currentSchema);
    fields.forEach(async r => {
      if (r.dateType == "String") {
        newSchema.addString(r.field);
      } else if (r.dateType == "Number") {
        newSchema.addNumber(r.field);
      } else if (r.dateType == "Date") newSchema.addDate(r.field);
    });
    newSchema.addString("name"); // 存RID和SID组合的字段
    await newSchema
      .get()
      .then(async data => {
        // 线上存在表,更新数据schema
        console.log("已经存在该表");
        let result: any = await this.isSave();

        if (result.length > 0) {
          alert("该表已存入,请务重复存");
          return;
        }
        await this.setData(newData);
      })
      .catch(err => {
        // 线上不存在，创建新的schema
        newSchema.save().then(result => {
          console.log("保存完成");
          this.setData(newData);
        });
      });
    if ((this.synchronize = "未同步")) {
      this.synchronize = "已同步";
    }
  }
  // 存入数据
  setData(newData) {
    let list = [];
    let isHas: Boolean = true;
    let SetData = Parse.Object.extend(this.currentSchema);
    // make typeMap
    let typeMap = {};
    this.lineFileds.forEach(item => {
      typeMap[this.currentSchema + "/" + item.field] = item.dateType;
    });
    // end of make
    newData.reduce(async (p, c, i) => {
      let setData = new SetData();
      for (const key in c) {
        let type = typeMap[this.currentSchema + "/" + key];

        if (c[key] == "暂无") {
          isHas = false;
        }
        if (type == "String") {
          setData.set(key, c[key]);
        }
        if (type == "Number") {
          let reg = new RegExp(",", "g");
          let num = Number(c[key].replace(reg, ""));
          setData.set(key, num);
        }
        if (type == "Date") {
          let d: any;
          if (("tmp" + c[key]).indexOf("/") > 0) {
            d = c[key];
          } else if (("tmp" + c[key]).indexOf(".") > 0) {
            d = c[key].replace(/\./g, "/");
          } else {
            d = c[key];
          }

          let dete = new Date(d);

          setData.set(key, dete);
        }
      }
      setData.set("name", this.RID + "_" + this.SID);
      setData.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: this.companyId
      });

      list[i] = setData;
    }, 0);
    if (isHas) {
      Parse.Object.saveAll(list).then(list => {
        console.log(list);
      });
    }
  }
  // 查询改报表是否存入数据库
  async isSave() {
    let queryData = new Parse.Query(this.currentSchema);
    let result: any;
    if (this.tableType == "data") {
      queryData.equalTo("company", this.companyId);
      queryData.equalTo("name", this.RID + "_" + this.SID);
      result = await queryData.find();
    } else if (this.tableType == "base") {
      queryData.equalTo("company", this.companyId);
      queryData.equalTo("name", this.RID + "_" + this.SID);
      result = await queryData.find();
    }
    return result;
  }
}

// 格式化数据--转化为number类型
function formatNumber(number) {
  if (Number(number)) {
    // console.log(typeof (number * 1), number*1);

    return parseFloat(number);
  } else if (!number) {
    return "";
  } else {
    number;
  }
}
function currencyFormatter(params) {
  return formatNumber(params.value);
}
// 求和功能
function sumFunction(values) {
  var result = 0;
  values.forEach(function(value) {
    if (typeof value === "number") {
      result += value;
    }
  });
  console.log(result);
  return result;
}

function numberValueParser(params) {
  return Number(params.newValue);
}
