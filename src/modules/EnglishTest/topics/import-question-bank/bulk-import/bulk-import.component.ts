import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Input, Output, EventEmitter } from "@angular/core";
import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
@Component({
  selector: "bulk-import",
  templateUrl: "./bulk-import.component.html",
  styleUrls: ["./bulk-import.component.scss"],
})
export class BulkImportComponent implements OnInit {
  @Input() tempSurveyId: string;
  public api: GridApi;
  public columnApi: ColumnApi;
  data: any;
  columnDefs: any[] = [];
  rowData: any;
  isDealData: boolean;
  require: any;
  isImport: boolean;
  objectIdMap: any = [];
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
  // 选择题检查区表头
  chooseColum: any[] = [
    {
      headerName: "题号",
      field: "题号",
      other: "index",
      type: "Number",
      require: true
    },
    {
      headerName: "题干（必填）",
      field: "题干（必填）",
      other: "title",
      type: "String",
      require: true
    },
    {
      headerName: "选项A",
      field: "选项A",
      other: "options",
      type: "ArrayItem",
    },
    {
      headerName: "选项B",
      field: "选项B",
      other: "options",
      type: "ArrayItem",
    },
    {
      headerName: "选项C",
      field: "选项C",
      other: "options",
      type: "ArrayItem",
    },
    {
      headerName: "选项D",
      field: "选项D",
      other: "options",
      type: "ArrayItem",
    },
    {
      headerName: "选项E",
      field: "选项E",
      other: "options",
      type: "ArrayItem",
    },
    {
      headerName: "选项F",
      field: "选项F",
      other: "options",
      type: "ArrayItem",
    },
    {
      headerName: "选项G",
      field: "选项G",
      other: "options",
      type: "ArrayItem",
    },
    {
      headerName: "选项H",
      field: "选项H",
      other: "options",
      type: "ArrayItem",
    },
    {
      headerName: "正确答案（必填）",
      field: "正确答案（必填）",
      other: "answer",
      type: "String",
    },
    {
      headerName: "分值",
      field: "分值",
      other: "score",
      type: "Number",
      require: true

    },
    {
      headerName: "解析",
      field: "解析",
      other: "answer",
      type: "String",
    },
    {
      headerName: "难度",
      field: "难度",
      other: "difficulty",
      type: "String",
      require: true

    },
  ];
  // 情景对话题检查区表头
  dialogColum: any[] = [
    {
      headerName: "题干（必填）",
      field: "题干（必填）",
      other: "title",
      type: "String",
    },
    {
      headerName: "正确答案（必填）",
      field: "正确答案（必填）",
      other: "answer",
      type: "String",
    },
    {
      headerName: "分值",
      field: "分值",
      other: "score",
      type: "Number",
    },
    {
      headerName: "难度",
      field: "难度",
      other: "difficulty",
      type: "String",
    },
  ];
  // 翻译题检查区表头
  translateColum: any[] = [
    {
      headerName: "题号",
      field: "题号",
      other: "index",
      type: "Number",
      require: true
    },
    {
      headerName: "题干（必填）",
      field: "题干（必填）",
      other: "title",
      type: "String",
    },
    {
      headerName: "正确答案（必填）",
      field: "正确答案（必填）",
      other: "answer",
      type: "String",
    },
    {
      headerName: "分值",
      field: "分值",
      other: "score",
      type: "Number",
    },
    {
      headerName: "难度",
      field: "难度",
      other: "difficulty",
      type: "String",
    },
  ];
  // 作文题检查区表头
  compositionColum: any[] = [
    {
      headerName: "题号",
      field: "题号",
      other: "index",
      type: "Number",
      require: true
    },
    {
      headerName: "题干（必填）",
      field: "题干（必填）",
      other: "title",
      type: "String",
    },
    {
      headerName: "正确答案（必填）",
      field: "正确答案（必填）",
      other: "answer",
      type: "String",
    },
    {
      headerName: "分值",
      field: "分值",
      other: "score",
      type: "Number",
    },
    {
      headerName: "难度",
      field: "难度",
      other: "difficulty",
      type: "String",
    },
  ];
  pointerMap: any = {};
  constructor(
    private activRoute: ActivatedRoute,
    public cdRef: ChangeDetectorRef,
    private message: NzMessageService,
    private modal: NzModalService,
  ) { }
  departs: any = [];
  department: any;
  departInfo: any;
  pCompany: any;
  company: any;
  topicComp: any; // 存储题目时存的company
  showMask: boolean = true; // 是否显示遮罩
  excelTemplate: string; // excel模板

  // 选择题库、题型
  chooseType: boolean = false;
  surveyArr: any[];
  topicTypeArr: any[];
  topicType: any;
  tTypeId: any;
  surveyType: any;
  surveyTypeId: any;
  // outlineId: any;
  checkImport: boolean;
  ngOnInit() {
    this.department = localStorage.getItem("department") || "";
    this.company = localStorage.getItem("company") || "";
    this.activRoute.paramMap.subscribe(async (params) => {


      if (!this.department) {
        await this.getDeparts();
      } else {
        await this.getDepartInfo();
        let surveyId = params.get("surveyId");
        this.reuseObj = {};
        this.errData = {};
        if (!surveyId) {
          this.chooseType = false;
          await this.getSurveys();
          return
        }
        let surveys = await this.getSurveys();
        surveys.forEach((survey) => {
          if (survey.id == surveyId) {
            this.surveyType = survey;
            this.chooseType = true;
            this.surveyTypeId = surveyId;
            this.surveyType = survey;
            this.isImport = false;
            this.checkImport = false;
            this.getTopicTypes();
          }
        });
      }
    });
    this.require = [
      {
        headerName: "父级题号",
        field: "父级题号",
        other: "parent",
        type: "Pointer",
      },
      {
        headerName: "题号",
        field: "题号",
        other: "index",
        type: "Number",
      },
      {
        headerName: "题干",
        field: "题干",
        other: "title",
        type: "String",
      },
      // {
      //   headerName: "题型",
      //   field: "题型",
      //   other: "type",
      //   type: "String",
      // },
      {
        headerName: "题型",
        field: "题型",
        other: "name",
        type: "String",
      },
      {
        headerName: "分数",
        field: "分数",
        other: "score",
        type: "Number",
      },

      {
        headerName: "答案",
        field: "答案",
        other: "answer",
        type: "String",
      },
      {
        headerName: "难度",
        field: "难度",
        other: "difficulty",
        type: "String",
      },
      {
        headerName: "选项1",
        field: "选项1",
        other: "options",
        type: "ArrayItem",
      },
      {
        headerName: "选项2",
        field: "选项2",
        other: "options",
        type: "ArrayItem",
      },
      {
        headerName: "选项3",
        field: "选项3",
        other: "options",
        type: "ArrayItem",
      },
      {
        headerName: "选项4",
        field: "选项4",
        other: "options",
        type: "ArrayItem",
      },
      {
        headerName: "选项5",
        field: "选项5",
        other: "options",
        type: "ArrayItem",
      },
      {
        headerName: "选项6",
        field: "选项6",
        other: "options",
        type: "ArrayItem",
      },
      {
        headerName: "选项7",
        field: "选项7",
        other: "options",
        type: "ArrayItem",
      },
    ];

    // this.columnDefs = [
    //   {
    //     headerName: "必填项(题目信息)",
    //     children: this.require,
    //   },
    // ]
    let tem = {};
    this.require.forEach((data) => {
      tem[data.field] = "暂无";
    });

    this.rowData = [tem];
    this.groupHeaderHeight = 40;
    this.headerHeight = 40;
    this.floatingFiltersHeight = 40;
    this.pivotGroupHeaderHeight = 50;
    this.pivotHeaderHeight = 100;
  }
  async getDepartInfo() {
    let queryD = new Parse.Query("Department");
    queryD.get(this.department);
    let res = await queryD.first();
    if (res && res.id) {
      console.log(res);
      this.departInfo = res;
      this.pCompany = res.get("company").id;
      this.excelTemplate = await this.getCompConfig();
      console.log(this.excelTemplate);
    }
  }
  async getDeparts() {
    let queryD = new Parse.Query("Department");
    queryD.equalTo("company", this.company);
    queryD.descending("num");
    let res = await queryD.find();
    if (res && res.length) {
      this.departs = res;
      this.departInfo = this.departs[0];
      let depart = this.departInfo;
      this.department = depart.id;
      this.excelTemplate = await this.getCompConfig();
      console.log(depart, this.excelTemplate);
      await this.getSurveys();
    }
  }
  async getCompConfig() {
    let comp;
    let queryClass = new Parse.Query("Company");
    console.log(this.pCompany);
    if (this.pCompany) {
      comp = await queryClass.get(this.company);
    } else {
      comp = await queryClass.get(this.departInfo.get("subCompany").id);
    }
    console.log(comp);
    if (comp && comp.id && comp.get("config")) {
      return comp.get("config")["topicExcTpl"];
    }
  }
  async getSurveys() {
    console.log("getSurveys", this.company, this.department);
    let TargetClass = new Parse.Query("Survey");
    TargetClass.equalTo("company", this.pCompany || this.company);
    TargetClass.equalTo("department", {
      __type: "Pointer",
      className: "Department",
      objectId: this.department,
    });
    let target = await TargetClass.find();
    console.log("target:" + target.length);
    if (target && target.length) {
      this.surveyArr = target;
      return this.surveyArr;
    }
  }
  async changeType(type, e) {
    switch (type) {
      case "depart":
        if (e) {
          this.department = e;
          let index = this.departs.findIndex((item) => item.id == e);
          this.departInfo = this.departs[index];
          this.excelTemplate = await this.getCompConfig();
          console.log(this.excelTemplate);
        }
        this.surveyType = null;
        this.surveyTypeId = null;
        this.getSurveys();
        break;

      case "survey":
        if (!e) {
          this.chooseType = false;
          return;
        }
        this.chooseType = true;
        this.surveyTypeId = e.id;
        this.topicComp = this.departInfo.get("subCompany").id;
        this.isImport = false;
        this.checkImport = false;
        console.log(this.topicComp);
        this.surveyType = e;
        this.getTopicTypes();
        break;
      default:
        break;
    }
  }
  tTypeName: string;
  tTypeNameArr: any[];
  async getTopicType() {
    let TargetClass = new Parse.Query("Knowledge");
    let target = await TargetClass.get(this.tTypeId);
    console.log("target:", target);
    if (target && target.id) {
      // this.excelTemplate = target.get("excelTemplate")
    } else {
    }
  }
  async getTopicTypes() {
    this.tTypeNameArr = [];
    let TargetClass = new Parse.Query("Knowledge");
    TargetClass.equalTo("company", this.topicComp);
    TargetClass.equalTo("parent", undefined);
    let target: any = await TargetClass.find();
    console.log("target:", target);
    if (target && target.length) {
      this.topicTypeArr = target;
      for (let index = 0; index < target.length; index++) {
        const topicType = target[index];
        this.tTypeNameArr.push(topicType.get("name"));
      }
    } else {
      this.topicTypeArr = [];
    }
  }
  showMessage(type, message, e) {
    this.message.create(type, message, e);
    console.log(this.checkImport);
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    return;
  }
  showUpload: boolean;

  dataLen: number;
  excelData: any; // excel总数据集合 {}
  sheetNameArr: any; // excel 工作表名数组
  // 选择文件
  async onFileChange(evt: any) {
    console.log("onFileChange");
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(target, target.files.length);
    if (target.files.length > 1) {
      this.message.error("不能选择多个文件上传");
      throw new Error("Cannot use multiple files");
    }
    const reader: FileReader = new FileReader();
    console.log(reader);
    reader.onload = async (e: any) => {
      this.columnDefs = [];
      this.excelData = {}; // excel json数据对象集合
      let tempData = {}
      /*
        1. excel数据转json  sheetName 工作表名  sheet  工作表内容
        excelData = {
          sheetName:sheet
        }
        2. 设置多表表头
      */
      //  1.excel数据转json
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      // excel工作表表名数组
      let sheetLen = wb.SheetNames.length;
      this.sheetNameArr = wb.SheetNames;
      this.dataLen = 0;
      for (let index = 0; index < sheetLen; index++) {
        const sheetName: string = wb.SheetNames[index];
        let correct = await this.checkSheetName(sheetName);
        if (!correct) {
          return;
        }
        // 未格式化的工作表内容
        const sheetXL: XLSX.WorkSheet = wb.Sheets[sheetName];
        console.log(sheetName, sheetXL);
        // 转换成json格式后的工作表内容
        const sheet: any = XLSX.utils.sheet_to_json(sheetXL);
        console.log(sheet);
        for (const item of sheet) {
          // 难度为空，默认为普通
          if (item["难度"] == "" || !item["难度"]) {
            item["难度"] = "普通";
          } else {
            item["难度"] = item["难度"].trim();
          }
          // if (item['解析'] == '' || !item['解析']) {
          //   item['解析'] = '暂无'
          // }
          this.dataLen += 1;
        }
        if (!sheet || !sheet.length) {
          return this.message.error("无可上传数据")
        }
        tempData[sheetName] = sheet;
        // 2. 设置表头
        // let columnDefs: any = [];
        // // 遍历json对象，获取每一列的键名 表头
        // for (let key in sheet[0]) {
        //   columnDefs.push({ headerName: key, field: key });
        // }
        // console.log(columnDefs);
        // 设置每个工作表对应的ag-grid表格表头  columnDefs => ag-grid 多表表头 数组集合
        let checkColum = [];
        switch (
        sheetName // 词汇词法题就是单选题
        ) {
          case "词汇词法题":
            checkColum = this.chooseColum;
            break;
          // case '多选题':
          //   checkColum = this.chooseColum;
          //   break;
          case "翻译":
            checkColum = this.translateColum;
            break;
          case "作文":
            checkColum = this.compositionColum;
            break;

          default:
            break;
        }
        console.log(checkColum);
        this.columnDefs.push([
          // {
          //   headerName: sheetName,
          //   children: [{ headerName: '检查区', children: checkColum }]
          // },
          // {
          //   headerName: sheetName,
          //   children: [{ headerName: '输入区', children: columnDefs }]
          // },
          {
            headerName: sheetName,
            children: checkColum,
          },
        ]);
        console.log(this.columnDefs);
        // 处理导入的数据
        // this.excelData = sheet;
        // this.getOnjectIdMap(sheet);
        let status = await this.getOnjectIdMap(tempData[sheetName], this.columnDefs[index]);
        if (!status) return
        console.log(index + 1, sheetLen, this.sheetNameArr);
        if (index + 1 == sheetLen) {
          this.excelData = tempData;
          console.log(this.excelData, this.columnDefs);
          // this.cdRef.detectChanges()
          this.isImport = true;
          this.isDealData = false;
          // 页面状态变更为检查导入数据
          this.checkImport = true;
        }
      }

    };
    console.log('reader');
    reader.readAsBinaryString(target.files[0]);
  }
  backUpload() {
    this.isImport = false;
    this.checkImport = false;
  }
  async checkSheetName(sheetName) {
    console.log(sheetName);
    let tNameArr = ["翻译", "作文", "词汇词法题"]; //  '多选题'
    let topicTypeArr = this.topicTypeArr;
    let correntSheetName = tNameArr.indexOf(sheetName);
    console.log(topicTypeArr, topicTypeArr.length);
    let correntTypeName = this.tTypeNameArr.indexOf(sheetName);
    console.log(correntTypeName, correntSheetName);
    if (correntSheetName != -1 && correntTypeName != -1) {
      return true;
    }
    if (correntSheetName == -1) {
      this.errMessage = `不支持题型${sheetName}的上传，请确认上传题型在翻译、作文、词汇词法题之中，上传excel工作表名称在'翻译'、'作文'、'词汇词法题'之中`;
      return false;
    }
    if (correntTypeName == -1) {
      this.errMessage = `该院校下未配置题型:${sheetName},请添加配置或在上传文件中删除该工作表`;
      return false;
    }
  }
  end: boolean = false;
  cancelPush() {
    this.saveLine(true);
    this.end = true;
  }
  isVisible2;
  errData: any = {};
  handleCancel() {
    this.isVisible2 = false;
    this.isImport = false;
    this.checkImport = false;
  }
  isVisible: boolean = false;
  // 保存到数据库
  count: any = 0;
  errCount: any = 0;
  successData = {};

  // 文件拖拽
  handleDropOver(e, over?) {
    if (!this.surveyTypeId || !this.tTypeId) {
      this.chooseType = true;
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  // over之后执行
  handleDrop(e) {
    if (!this.surveyTypeId || !this.tTypeId) {
      this.chooseType = true;
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    this.onFileChange(e);
  }

  getOnjectIdMap(datas, columns) {
    return new Promise(async (resolve, reject) => {
      console.log(datas);
      // 对数据的处理，以及错误查询
      this.isDealData = true;
      // 导入数据循环遍历数据获取Pointer指针类型的objectId
      console.log(datas, datas.length);
      let requireRef;
      for (let index = 0; index < datas.length; index++) {
        let data = datas[index];
        let map: any = {};
        // 表头信息
        for (let i = 0; i < columns[0].children.length; i++) {
          console.log(columns);
          let r = columns[0].children[i];
          /* 必填项无值 */
          if (r.require) {
            if (r.require && (!data[r.field] || data[r.field].trim() == '') && !requireRef) {
              this.isImport = false;
              this.isDealData = false;
              requireRef = this.modal.confirm({
                nzTitle: 'excel上传错误',
                nzContent: `${columns[0].headerName}:必填项 ${r.field}  ${index + 1}行为空,请处理后上传`,
                nzCancelText: null,
              });
              resolve(false)
            }
          }
          /* 题号查重 */
          if (r.field == '题号') {
            let status = await this.querySurveyItem(data[r.field])
            if (status && status.id) {
              this.message.error(`题号${data[r.field]}重复,请排查后重新上传`)
              resolve(false)
            }
          }
        }
        this.objectIdMap[index] = map;
        if (this.objectIdMap.length == datas.length) {
          resolve(this.objectIdMap)
        }
      }
    })

  }
  numArr: any = [];// 查询到的题号数组
  async querySurveyItem(num) {
    if (this.numArr.indexOf(num) != -1) {
      return false
    }
    console.log(num, this.department, this.surveyTypeId);
    try {
      let query = new Parse.Query("SurveyItem")
      query.equalTo('queNum', num)
      query.equalTo('company', this.departInfo.get("subCompany").id)
      query.equalTo('survey', this.surveyTypeId)
      let item = await query.first()
      this.numArr.push(num)
      return item
    } catch {
      this.message.error("网络错误，请稍后重试")
      return false
    }
  }
  errMessage: any; // 题型名称错误  上传excel工作表名称与该题库下名称不符 与设定名称不符
  // 保存到数据库
  async saveLine(end?, saveData?) {
    this.count = 0;
    this.isVisible = true;
    if (end) {
      this.compareData();
      return;
    }
    let totalData = this.excelData;
    let temp = {};
    let totalLen = Object.keys(totalData).length;
    let count = 0;
    for (let key in totalData) {
      if (this.end) break;
      count += 1;
      let res;
      this.reuseObj[key] = [];
      this.successData[key] = [];
      switch (key) {
        case "词汇词法题":
          res = await this.setChooseItems(totalData[key], key);
          console.log(res);
          if (res && res.length) {
            temp[key] = [...res];
          }
          break;
        /*  case '多选题':
           res = await this.setChooseItems(totalData[key], key);
           console.log(res);
           if (res && res.length) {
             temp[key] = [
               ...res
             ]
           }
           break; */
        case "翻译":
          res = await this.setTextItems(totalData[key], key);
          console.log(res);
          if (res && res.length) {
            temp[key] = [...res];
          }
          break;
        case "作文":
          res = await this.setTextItems(totalData[key], key);
          if (res && res.length) {
            console.log(res);
            temp[key] = [...res];
          }
          break;
        default:
          break;
      }
      if (count == totalLen) {
        this.end = true;
        this.compareData(temp);
      }
    }
  }
  notTypeVisible = false;
  async setChooseItems(data, key) {
    let tempArr = [];
    let cont = false;
    console.log(this.excelData, data);
    let dataLen = data.length;
    console.log(dataLen);
    if (dataLen) {
      let topicTypeArr = this.topicTypeArr;
      let topicId;
      for (let index = 0; index < topicTypeArr.length; index++) {
        const topicType = topicTypeArr[index];
        console.log(key, topicType.get("name"));
        if (key == topicType.get("name")) {
          topicId = topicType.id;
          console.log(topicType, topicId);
        }
        if (index + 1 == topicTypeArr.length) {
          cont = true;
        }
      }
      if (cont) {
        for (let index = 0; index < dataLen; index++) {
          const item = data[index];
          console.log(item);
          let sItem: any = await this.getSurveyItem(item, key);
          console.log(1, sItem);
          if (sItem) {
            sItem.set("knowledge", [
              {
                __type: "Pointer",
                className: "Knowledge",
                objectId: topicId,
              },
            ]);
            sItem.set("queNum", +item["题号"]);
            sItem.set("title", item["题干（必填）"]);
            // sItem.set("name", key)
            switch (item["难度"]) {
              case "简单":
                sItem.set("difficulty", "easy");
                break;
              case "普通":
                sItem.set("difficulty", "normal");
                break;
              case "困难":
                sItem.set("difficulty", "hard");
                break;
            }
            item["分值"] = Number(item["分值"]);
            sItem.set("score", item["分值"]);
            sItem.set("answer", item["正确答案（必填）"]);
            sItem.set("analy", item["解析"]);
            let options = [];
            if (item["选项A"] && item["选项A"].trim() != "") {
              options.push({
                check:
                  item["正确答案（必填）"].indexOf("A") != -1 ? true : false,
                grade:
                  item["正确答案（必填）"].indexOf("A") != -1
                    ? item["分值"]
                    : 0,
                label: "A",
                value: item["选项A"],
              });
            }
            if (item["选项B"] && item["选项B"].trim() != "") {
              options.push({
                check:
                  item["正确答案（必填）"].indexOf("B") != -1 ? true : false,
                grade:
                  item["正确答案（必填）"].indexOf("B") != -1
                    ? item["分值"]
                    : 0,
                label: "B",
                value: item["选项B"],
              });
            }
            if (item["选项C"] && item["选项C"].trim() != "") {
              options.push({
                check:
                  item["正确答案（必填）"].indexOf("C") != -1 ? true : false,
                grade:
                  item["正确答案（必填）"].indexOf("C") != -1
                    ? item["分值"]
                    : 0,
                label: "C",
                value: item["选项C"],
              });
            }
            if (item["选项D"] && item["选项D"].trim() != "") {
              options.push({
                check:
                  item["正确答案（必填）"].indexOf("D") != -1 ? true : false,
                grade:
                  item["正确答案（必填）"].indexOf("D") != -1
                    ? item["分值"]
                    : 0,
                label: "D",
                value: item["选项D"],
              });
            }
            if (item["选项E"] && item["选项E"].trim() != "") {
              options.push({
                check:
                  item["正确答案（必填）"].indexOf("E") != -1 ? true : false,
                grade:
                  item["正确答案（必填）"].indexOf("E") != -1
                    ? item["分值"]
                    : 0,
                label: "E",
                value: item["选项E"],
              });
            }
            if (item["选项F"] && item["选项F"].trim() != "") {
              options.push({
                check:
                  item["正确答案（必填）"].indexOf("F") != -1 ? true : false,
                grade:
                  item["正确答案（必填）"].indexOf("F") != -1
                    ? item["分值"]
                    : 0,
                label: "F",
                value: item["选项F"],
              });
            }
            if (item["选项G"] && item["选项G"].trim() != "") {
              options.push({
                check:
                  item["正确答案（必填）"].indexOf("G") != -1 ? true : false,
                grade:
                  item["正确答案（必填）"].indexOf("G") != -1
                    ? item["分值"]
                    : 0,
                label: "G",
                value: item["选项G"],
              });
            }
            if (item["选项H"] && item["选项H"].trim() != "") {
              options.push({
                check:
                  item["正确答案（必填）"].indexOf("H") != -1 ? true : false,
                grade:
                  item["正确答案（必填）"].indexOf("H") != -1
                    ? item["分值"]
                    : 0,
                label: "H",
                value: item["选项H"],
              });
            }
            sItem.set("options", options);
            let answer = item["正确答案（必填）"];
            if (answer.length > 1) {
              sItem.set("type", "multiple-single");
            } else {
              sItem.set("type", "select-single");
            }
            let sItemObj = await sItem.save();
            if (sItemObj && sItemObj.id) {
              console.log(sItemObj);
              this.count += 1;
              this.successData[key].push(item);
              tempArr.push(sItemObj);
            } else {
              this.errCount += 1;
            }
            if (index + 1 == dataLen) {
              return tempArr;
            }
          }
        }
      }
    }
  }
  async setTextItems(data, key) {
    let tempArr = [];
    let cont = false;
    console.log(this.excelData, data);
    let dataLen = data.length;
    if (dataLen) {
      let topicTypeArr = this.topicTypeArr;
      let topicId;
      for (let index = 0; index < topicTypeArr.length; index++) {
        const topicType = topicTypeArr[index];
        if (key == topicType.get("name")) {
          topicId = topicType.id;
          console.log(topicType, topicId);
        }
        if (index + 1 == topicTypeArr.length) {
          cont = true;
        }
      }
      if (cont) {
        for (let index = 0; index < dataLen; index++) {
          const item = data[index];
          let sItem: any = await this.getSurveyItem(item, key);
          if (sItem) {
            sItem.set("knowledge", [
              {
                __type: "Pointer",
                className: "Knowledge",
                objectId: topicId,
              },
            ]);
            // sItem.set("name", key)
            sItem.set("type", "text");
            sItem.set("queNum", +item["题号"]);
            sItem.set("title", item["题干（必填）"]);
            sItem.set("answer", item["正确答案（必填）"]);
            sItem.set("score", Number(item["分值"]));
            switch (item["难度"]) {
              case "简单":
                sItem.set("difficulty", "easy");
                break;
              case "普通":
                sItem.set("difficulty", "normal");
                break;
              case "困难":
                sItem.set("difficulty", "hard");
                break;
            }
            sItem.set("analy", item["解析"]);

            let sItemObj = await sItem.save();
            if (sItemObj && sItemObj.id) {
              console.log(sItemObj);
              this.count += 1;
              console.log(this.count);
              this.successData[key].push(item);
            } else {
              this.errCount += 1;
            }
            if (index + 1 == dataLen) {
              return tempArr;
            }
          }
        }
      }
    }
  }
  reuseObj: any = {};
  getSurveyItem(item?, key?) {
    return new Promise(async (resolve, reject) => {
      // let SurveyItem = new Parse.Query("SurveyItem");
      // let title = item["题干（必填）"];
      // if (title) {
      //   SurveyItem.equalTo("title", title.trim());
      //   let surveyItem = await SurveyItem.first();
      //   if (surveyItem && surveyItem.id) {
      //     this.reuseObj[key] = [...this.reuseObj[key], item];
      //     resolve(false);
      //   } else {
      let Class = Parse.Object.extend("SurveyItem");
      let sclass = new Class();
      sclass.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: this.topicComp,
      });
      sclass.set("survey", {
        __type: "Pointer",
        className: "Survey",
        objectId: this.surveyTypeId,
      });

      sclass.set("isEnabled", true);
      console.log("set");

      resolve(sclass);
      //   }
      // }
    });
  }
  reuseLen: number;
  errLen: number;
  // 上传失败数据
  async compareData(totalData?) {
    console.log(totalData);
    console.log(this.successData);
    // let tempSucArr;// 上传成功数组
    // let tempTotalArr;// 总数组
    // let reuseArr;// 重复未上传数组

    this.reuseLen = 0;
    this.errLen = 0;
    let ObjKeyArr = Object.keys(this.excelData);
    let totalKeyLen = ObjKeyArr.length;
    let noSucDataObj = {}; // 未上传成功集合
    let sucLen = 0;
    for (let index = 0; index < totalKeyLen; index++) {
      let key = ObjKeyArr[index];
      // if(index == 0){noSucDataObj[key]={};errDataObj[key]={}}
      var sucTitleArr = [];
      this.successData[key].forEach((item) => {
        console.log(item);
        sucTitleArr.push(item["题干（必填）"]);
      });
      console.log(this.excelData, sucTitleArr);

      if (sucTitleArr.length) {
        noSucDataObj[key] = this.excelData[key].filter(
          (item) => !sucTitleArr.includes(item["题干（必填）"])
        );
      } else {
        console.log(this.excelData[key]);
        noSucDataObj[key] = this.excelData[key];
      }
      var reuseTitleArr = this.reuseObj[key].map(
        (item) => item["题干（必填）"]
      );
      this.errData[key] = noSucDataObj[key].filter(
        (item) => !reuseTitleArr.includes(item["题干（必填）"])
      );
      console.log(
        reuseTitleArr,
        noSucDataObj[key],
        this.errData[key],
        this.errLen
      );

      sucLen += noSucDataObj[key].length;
      // this.reuseLen += this.reuseObj[key].length;
      this.errLen += this.errData[key].length;
      console.log(sucLen, this.errData[key]);
    }
    console.log(noSucDataObj, sucLen);
    if (!sucLen) {
      this.isVisible = false;
      this.excelData = {};
      this.isImport = false;
      this.checkImport = false;
      this.message.success("上传成功");
    } else {
      this.isVisible = false;
      this.excelData = this.errData;
      if (this.errLen) {// || this.reuseLen
        this.isVisible2 = true;
      }
    }
  }
  getLen(Obj) {
    let count = 0;
    let ctinue = false;
    let keyArr = Object.keys(Obj);
    let keyLen = keyArr.length;
    for (let index = 0; index < keyLen; index++) {
      const iArr = Obj[keyArr[index]];
      const arrLen = iArr.length;
      count += arrLen;
      if (index + 1 == keyLen) {
        ctinue = true;
      }
    }
    if (ctinue) {
      if ((count = 0)) {
        console.log(count);
        return false;
      } else {
        console.log(count);
        return count;
      }
    }
  }
}
