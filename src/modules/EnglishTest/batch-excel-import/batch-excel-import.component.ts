import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

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
  selector: 'app-batch-excel-import',
  templateUrl: './batch-excel-import.component.html',
  styleUrls: ['./batch-excel-import.component.scss']
})
/*
数据结构：
  - 导入配置数据  config  config => condition 限制上传 []
  - 导入数据 rowData
页面结构：
  - 导入前：显示导入提示，下载导入模板，
  - excel文件上传后数据预览
    - 排查 excel内数据对比，数据是否限制上传，如果有，弹窗提示修改后再导入
    - 排查 字段type为pointer指针的，指针对应数据是否存在 不存在，弹窗提示修改后再导入
  - 点击上传按钮进行excel数据上传：
    - 上传时校验excel数据是否限制上传
      - config限制条件字段 与数据库对比排查是否限制上传，存入上传失败数组
      - 数据上传是否失败，存入上传失败数组
    - 排查后弹窗显示上传失败数据
  - 显示限制上传数据

*/

export class BatchExcelImportComponent implements OnInit {
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
    // filter: true, //开启刷选
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
  relateRouteId = 'l7v3B6FhL3'// 关联路由
  relateRoute: any;
  config = {}
  ngOnInit() {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.department = localStorage.getItem("department")
        ? localStorage.getItem("department")
        : "";
      this.company = localStorage.getItem("company")
        ? localStorage.getItem("company")
        : "";
      this.config = {
        relateSchema: 'Category',
        relateRoute: 'l7v3B6FhL3',
        excelTpl: '',
        condition: [
          {
            key: 'name',
            type: 'String',
            require: true
          },
          {
            key: 'name_en',
            type: 'String',
            require: true
          }
        ],
        title: '校区导入'

      }
      this.initAgGrid()
      if (this.department) {
        let Company = new Parse.Query("Company");
        let comp = await Company.get(this.company);
        this.pCompany = comp.get("company") && comp.get("company").id;
      } else {
        let Company = new Parse.Query("Company");
        let comp = await Company.get(this.company);
        await this.getDeparts(comp.id);
      }
      this.getExams();
      this.excelTemplate = await this.getCompConfig();
    });
  }
  async initAgGrid() {
    let route = await this.getRelateRoute()
    if (route && route.id) {
      this.relateRoute = route;
      this.require = this.getReqFromRelateRoute(route)
      this.columnDefs = [
        {
          headerName: "必填项(成绩信息)",
          children: this.require,
        },
      ];
      let tem = {};
      this.require?.forEach((data) => {
        tem[data.name] = "";
      });
      this.rowData = [tem];
      this.groupHeaderHeight = 60; // 统一设置表头高度和筛选区域高度
      this.headerHeight = 40; // 表头高度
      this.floatingFiltersHeight = 40; // 筛选区域高度
      this.pivotGroupHeaderHeight = 50;
      this.pivotHeaderHeight = 100;
    }

  }
  getReqFromRelateRoute(route) {
    let require = []
    if (route && route.id) {
      console.log(route)
      let fields = route.get("editFields")
      for (let index = 0; index < fields.length; index++) {
        let field = fields[index];
        require.push({
          key: field.key,
          type: field.type,
          name: field.name,
          headerName: field.name,
          require: field.require
        })
      }
      return require;
    }
  }
  async getRelateRoute() {
    let queryRoute = new Parse.Query("DevRoute");
    let route = await queryRoute.get(this.config['relateRoute']);
    return route
  }
  async getExams() {
    let Exam = new Parse.Query("Exam");
    Exam.equalTo("department", this.department);
    Exam.include("survey");
    let exams = await Exam.find();
    if (exams && exams.length) {
      this.exams = exams;
      this.examId = exams[0].id;
      this.exam = exams[0];
    }
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
        keyAry.push(key);
      }
      let columnDefs: any = [];
      keyAry.forEach((element, index) => {
        columnDefs.push({ headerName: element, name: element });
      });
      console.log(columnDefs);

      this.columnDefs = [
        ...this.columnDefs,
        { headerName: "导入项", children: columnDefs },
      ];

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
  // - 排查 excel内数据对比，数据是否限制上传，如果有，弹窗提示修改后再导入
  // - 排查 字段type为pointer指针的，指针对应数据是否存在 不存在，弹窗提示修改后再导入
  getOnjectIdMap(datas) {
    // 导入数据循环遍历数据获取Pointer指针类型的objectId
    if (datas && datas.length) {
      this.isDealData = true;
      let dataMap = {}
      datas.forEach(async (data, index) => {
        let map: any = {};
        // 表头信息
        let schema = this.config['relateSchema']
        let condition = this.config['condition']
        let condMap = {}
        // 限制条件Map集合 key 字段名
        condition.forEach(async cond => {
          condMap[cond.key] = cond
        });


        this.require.forEach(async (r) => {
          // router中字段与该限制条件字段
          if (r.key == condMap[r.key]) {
            dataMap[data[r.name]]
          }


          // condition.forEach(async cond => {
          //   let queryCond = new Parse.Query(schema);
          //   queryCond.equalTo(cond.key, data[r.name].trim());
          //   let satify = await queryCond.first();
          //   if (satify && satify.id) {
          //     map[r.key] = satify.id;
          //   }
          // });
          // if (r.type == "Pointer" && r.targetClass) {
          //   console.log(r.type, r.targetClass);
          //   if (data[r.name]) {
          //     let TargetClass = new Parse.Query(r.targetClass);
          //     TargetClass.equalTo("name", data[r.name].trim());
          //     let target = await TargetClass.first();
          //     if (target && target.id) {
          //       map[r.key] = target.id;
          //     } else {
          //       this.isImport = false;
          //       alert(
          //         data[r.name] +
          //         "的" +
          //         r.headerName +
          //         "错误, 或者该" +
          //         r.headerName +
          //         "未创建,请修改正确后重新上传"
          //       );
          //     }
          //   }
          // }



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
      考生已有答卷记录: 0,
      答卷记录无对应考生档案: 0,
      答卷记录所属考生未分配考场: 0,
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
    let exam = this.exam;
    console.log(exam);
    for (let j = 0; j < rowLen; j++) {
      item = rowData[j];
      let profile: any = await this.getProfile(rowData[j]);
      // let exam: any = await this.getExam(rowData[j]);
      if (this.end) {
        // 取消上传
        this.isVisible = false;
        this.compareData();
        return;
      }
      if (profile && exam && profile.get("schoolClass")) {
        let survey: any = await this.getSurvey(
          exam.get("survey"),
          profile.get("langCode")
        );
        let SurveyLog = new Parse.Query("SurveyLog");
        SurveyLog.equalTo("profile", profile.id);
        SurveyLog.equalTo("exam", exam.id);
        SurveyLog.equalTo("department", this.department);
        SurveyLog.select("exam");
        let log = await SurveyLog.first();
        if (!log || !log.id) {
          console.log(log);
          let Log = Parse.Object.extend("SurveyLog");
          log = new Log();
          log.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: this.pCompany,
          });
          log.set("profile", {
            __type: "Pointer",
            className: "Profile",
            objectId: profile.id,
          });
          log.set("user", {
            __type: "Pointer",
            className: "_User",
            objectId: profile.get("user").id,
          });
          log.set("department", {
            __type: "Pointer",
            className: "Department",
            objectId: this.department,
          });
          log.set("departments", [
            {
              __type: "Pointer",
              className: "Department",
              objectId: this.department,
            },
          ]);
          log.set("exam", {
            __type: "Pointer",
            className: "Exam",
            objectId: this.exam.id,
          });
          log.set("survey", {
            __type: "Pointer",
            className: "Survey",
            objectId: survey.id,
          });
          log.set("singleScore", Number(item["客观题得分"]));
          log.set("textScore", Number(item["主观题得分"]));
          log.set(
            "grade",
            Number(item["客观题得分"]) + Number(item["主观题得分"])
          );
          let beginTime = new Date(profile.get("schoolClass").get("beginTime"));
          let endTime = new Date(profile.get("schoolClass").get("endTime"));
          log.set("beginTime", beginTime);
          log.set("endTime", endTime);
          /* logList.push(log);
          this.successData.push(rowData[j]); */
          let res = await log.save();
          console.log(res);
          this.successData.push(rowData[j]);
          count += 1;
          this.count += 1;
          // for (let index = 0; index < logList.length; index += 100) {
          //   let saveList = [];
          //   if (index + 100 < logList.length) {
          //     saveList = logList.slice(index, index + 100);
          //     console.log(saveList);
          //   } else {
          //     saveList = logList.slice(index, logList.length);
          //     console.log(saveList);
          //   }
          //   await Promise.all(
          //     saveList.map((sitem, tIndex) => {
          //       this.count += 1;
          //       sitem.save();
          //       // this.updateProfile(sitem.createdAt)
          //     })
          //   );
          //   console.log(`已分配:${index}/${logList.length}`);
          // }
          if (count + this.errCount.count == rowLen) {
            this.end = true;
            this.compareData();
            this.isVisible = false;
            this.isImport = false;
            continue;
          }
        } else {
          this.errCount.count += 1;
          this.errCount["考生已有答卷记录"] += 1;
        }
      } else {
        this.errCount.count += 1;
        if (!profile) {
          this.errCount["答卷记录无对应考生档案"] += 1;
        } else if (!profile.get("schoolClass")) {
          this.errCount["答卷记录所属考生未分配考场"] += 1;
        }
        console.log(count + this.errCount.count);
        if (count + this.errCount.count == rowLen) {
          this.end = true;
          this.compareData();
          continue;
        }
        continue;
      }
    }
    this.complog(logList);
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
  async getProfile(data) {
    return new Promise(async (resolve, reject) => {
      let Profile = new Parse.Query("Profile");
      Profile.notEqualTo("isDeleted", true);
      Profile.equalTo("idcard", data["身份证号码"]);
      Profile.equalTo("name", data["考生姓名"]);
      // Profile.equalTo("isCross", true);
      Profile.equalTo("company", this.pCompany);
      Profile.equalTo("department", this.department);
      Profile.include("schoolClass");
      Profile.select("schoolClass", "langCode", "user");
      let profile = await Profile.first();
      if (profile && profile.id) {
        // 考生信息存在
        resolve(profile);
      } else {
        resolve(false);
      }
    });
  }
  async getExam(data) {
    return new Promise(async (resolve, reject) => {
      let Exam = new Parse.Query("Exam");
      Exam.equalTo("title", data["所属考试"]);
      Exam.equalTo("company", this.pCompany);
      Exam.equalTo("department", this.department);
      Exam.include("survey");
      let exam = await Exam.first();
      if (exam && exam.id) {
        // 考生信息存在
        resolve(exam);
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
