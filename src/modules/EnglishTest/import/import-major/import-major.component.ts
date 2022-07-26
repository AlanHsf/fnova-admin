import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { NzMessageService } from "ng-zorro-antd/message";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-import-major',
  templateUrl: './import-major.component.html',
  styleUrls: ['./import-major.component.scss']
})

export class ImportMajorComponent implements OnInit {
  pCompany: string;
  public api: GridApi;
  public columnApi: ColumnApi;
  data: any;
  columnDefs: any[];
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
    // filter: true, //开启筛选
    filter: "agTextColumnFilter",
    floatingFilter: true, // 显示过滤栏
    flex: 1,
    minWidth: 100,
  };
  constructor(
    public cdRef: ChangeDetectorRef,
    private message: NzMessageService,
    private activRoute: ActivatedRoute
  ) { }
  department: any;
  departId: any;
  departs: any[];
  exams: any;
  examId: string;
  exam: any;
  company: any;
  excelTemplate: string; // excel模板
  ngOnInit() {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.department = localStorage.getItem("department")
        ? localStorage.getItem("department")
        : "";
      this.company = localStorage.getItem("company")
        ? localStorage.getItem("company")
        : "";
      this.require = [
        {
          headerName: "专业名称",
          field: "专业名称",
          other: "name",
          type: "String",
        },
        {
          headerName: "排序",
          field: "排序",
          other: "sort",
          type: "Number",
        },
        {
          headerName: "专业代码",
          field: "专业代码",
          other: "majorCode",
          type: "String",
        }
      ];
      this.columnDefs = [
        {
          headerName: "必填项(专业信息)",
          children: this.require,
        },
      ];
      let tem = {};
      this.require.forEach((data) => {
        tem[data.field] = "暂无";
      });
      if (this.department) {
        let Company = new Parse.Query("Company");
        let comp = await Company.get(this.company);
        this.pCompany = comp.get("company") && comp.get("company").id;
      } else {
        let Company = new Parse.Query("Company");
        let comp = await Company.get(this.company);
        await this.getDeparts(comp.id);
      }
      this.excelTemplate = await this.getCompConfig();
      this.rowData = [tem];
      this.groupHeaderHeight = 60; // 统一设置表头高度和筛选区域高度
      this.headerHeight = 40; // 表头高度
      this.floatingFiltersHeight = 40; // 筛选区域高度
      this.pivotGroupHeaderHeight = 50;
      this.pivotHeaderHeight = 100;
    });
  }

  async getCompConfig() {
    let queryClass = new Parse.Query("Company");
    let comp = await queryClass.get(this.pCompany || this.company);
    if (comp && comp.id && comp.get("config")) {
      return comp.get("config")["gradeExcTpl"];
    }
  }

  chooseType: boolean = false;
  surveyArr: any[];
  topicTypeArr: any[];
  surveyType: any;
  surveyTypeId: any;
  topicType: any;
  outlineId: any;
  tTypeId: any;
  showUpload: boolean;

  // 选择文件
  async onFileChange(evt: any) {
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
        // key = key.trim()
        console.log(key)
        keyAry.push(key);
      }
      let columnDefs: any = [];
      keyAry.forEach((element, index) => {
        columnDefs.push({ headerName: element, field: element });
      });
      console.log(columnDefs);
      this.columnDefs[0].children = columnDefs
      // this.columnDefs = [
      //   // ...this.columnDefs,
      //   // { headerName: "导入项", children: columnDefs },
      // ];
      console.log(this.columnDefs)

      // 处理导入的数据
      this.getOnjectIdMap(this.data);
      this.rowData = this.data;
    };
    reader.readAsBinaryString(target.files[0]);
    let drop = document.getElementById("dropBox");
    console.log(drop);

    // if (this.rowData.length >= 1) {
    //   drop.style.display = "none";
    // }
    this.isImport = true;
    this.isDealData = false;
  }

  // 文件拖拽
  handleDropOver(e, over?) {
    if (!this.outlineId || !this.tTypeId) {
      this.chooseType = true;
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  // over之后执行
  handleDrop(e) {
    if (!this.outlineId || !this.tTypeId) {
      this.chooseType = true;
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    this.onFileChange(e);
  }
  // 对数据的处理，以及错误查询
  getOnjectIdMap(datas) {
    // 导入数据循环遍历数据获取Pointer指针类型的objectId
    if (datas && datas.length) {
      this.isDealData = true;
      datas.forEach(async (data, index) => {
        let map: any = {};
        // 表头信息
        this.require.forEach(async (r) => {
          if (r.type == "Pointer" && r.targetClass) {
            console.log(r.type, r.targetClass);
            if (data[r.field]) {
              let TargetClass = new Parse.Query(r.targetClass);
              TargetClass.equalTo("name", data[r.field].trim());
              let target = await TargetClass.first();
              if (target && target.id) {
                map[r.other] = target.id;
              } else {
                this.isImport = false;
                alert(
                  data["专业"] +
                  "的" +
                  r.headerName +
                  "错误, 或者该" +
                  r.headerName +
                  "未创建,请修改正确后重新上传"
                );
              }
            }
          }
        });
        this.objectIdMap[index] = map;
        if (index + 1 == datas.length) {
          setTimeout(() => {
            this.isImport = true;
            this.isDealData = false;
            // this.cdRef.detectChanges();
          }, 1000);
        }
      });
    } else {
      this.message.error("无导入数据");
    }
    this.rowData = datas;
    console.log(this.rowData);
  }

  isVisible: boolean = false;
  // 保存到数据库
  count: any = 0;
  errCount: any = {};
  successData = [];
  // 保存到数据库
  async saveLine(end?) {
    this.end = false;
    this.isVisible = true;
    let count = 0;
    this.errCount = {
      count: 0,
      专业名称或代码重复: 0,
    };
    if (end) {
      this.isVisible = false;
      this.compareData();
      return;
    }
    let rowData = this.rowData;
    let rowLen = this.rowData.length;
    let item;
    let logList = [];
    for (let j = 0; j < rowLen; j++) {
      item = rowData[j];
      let major: any = await this.getMajor(rowData[j]);
      if (this.end) {
        // 取消上传
        this.isVisible = false;
        this.compareData();
        return;
      }
      if (major && major.id) {

      } else {
        major = await this.setMajor(rowData[j])
        this.successData.push(rowData[j]);
        count += 1;
        this.count += 1;
      }

      if (count + this.errCount.count == rowLen) {
        this.end = true;
        this.compareData();
        this.isVisible = false;
        this.isImport = false;
        continue;
      }
    }
  }
  async setMajor(data) {
    console.log(data)
    let Major = Parse.Object.extend("SchoolMajor");
    let major = new Major();
    major.set("company", {
      __type: "Pointer",
      className: "Company",
      objectId: this.pCompany,
    });
    major.set("school", {
      __type: "Pointer",
      className: "Department",
      objectId: this.department,
    });
    major.set("departments", [{
      __type: "Pointer",
      className: "Department",
      objectId: this.department,
    }]);
    major.set("name", data["专业名称"]);
    major.set("sort", +data["排序"]);
    major.set("majorCode", data["专业代码"]);
    let res = await major.save();
    console.log(res);

  }
  async complog(logList) {
    for (let index = 0; index < logList.length; index += 100) {
      let saveList = [];
      if (index + 100 < logList.length) {
        saveList = logList.slice(index, index + 100);
        console.log(saveList);
      } else {
        saveList = logList.slice(index, logList.length);
        console.log(saveList);
      }
      await Promise.all(
        saveList.map((sitem, tIndex) => {
          this.count += 1;
          sitem.save();
          // this.updateProfile(sitem.createdAt)
        })
      );
      console.log(`已分配:${index}/${logList.length}`);
    }

    this.isVisible = false;
    this.isImport = false;
    this.compareData();
  }
  getSurvey(surveys, langCode) {
    return new Promise((resolve, reject) => {
      surveys.filter((survey) => {
        if (survey.get("scate") == langCode) {
          resolve(survey);
        }
      });
    });
  }
  async getMajor(data) {
    return new Promise(async (resolve, reject) => {
      let Major1 = new Parse.Query("SchoolMajor");
      let Major2 = new Parse.Query("SchoolMajor");
      Major1.equalTo("department", this.department);
      Major2.equalTo("department", this.department);
      Major1.equalTo("name", data["专业名称"]);
      Major2.equalTo("majorCode", data["专业代码"]);
      let Major = Parse.Query.or(Major1, Major2)
      let major = await Major.first();
      if (major && major.id) {
        this.errCount["count"] += 1;
        this.errCount["专业名称或代码重复"] += 1;
        // 考生信息存在
        resolve(major);
      } else {
        resolve(false);
      }
    });
  }

  end: boolean = false;
  cancelPush() {
    this.end = true;
    this.isVisible = false;
  }

  isVisible2;
  errData; // 上传失败数据
  async compareData() {
    var set = this.successData.map((item) => item);
    console.log(set);
    var resArr = this.rowData.filter((item) => !set.includes(item));
    console.log(resArr);
    if (!resArr.length) {
      this.message.success("上传成功");
      console.log("全部上传成功");
      this.rowData = resArr;
    } else {
      this.count = 0;
      this.errCount = {};
      this.isVisible = false;
      this.isVisible2 = true;
      console.log("重新上传");
      this.errData = resArr;
      this.rowData = resArr;
      console.log(this.errData);
    }

    let back = document.getElementById("backBtn");
    if (this.rowData.length == 0) {
      back.style.display = "block";
    }
  }
  handleCancel() {
    this.successData = []
    this.errData = []
    this.isVisible2 = false;
  }
  changeType(type, e) {
    switch (type) {
      case "department":
        break;
      case "exam":
        if (e) {
          this.exams.filter((exam) => {
            if (exam.id == e) {
              this.exam = exam;
            }
          });
        }
        break;
      default:
        break;
    }
  }
  async getDeparts(compId) {
    let Depart = new Parse.Query("Depart");
    Depart.equalTo("company", compId);
    let departs = await Depart.find();
    if (departs && departs.length) {
      // 考生信息存在
      this.departs = departs;
      this.departId = departs[0].id;
    }
  }
}
