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
import { Observable } from "rxjs";
import { findIndex, map } from "rxjs/operators";
import { eachParent } from "gantt";
import { resolve } from "path";
import { ImportExclService } from "../import-excl.service";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: 'app-import-basic-profile',
  templateUrl: './import-basic-profile.component.html',
  styleUrls: ['./import-basic-profile.component.scss']
})

export class ImportBasicProfileComponent implements OnInit {
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
    private activRoute: ActivatedRoute,
    private importServ: ImportExclService,
    private http: HttpClient
  ) { }
  department: any;
  departId: any;
  departs: any[];
  recruits: any;
  recruitId: string;
  recruit: any;
  company: any;
  excelTemplate: string; // excel模板
  proType: string;
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
          headerName: "姓名",
          field: "姓名",
          other: "name",
          type: "String",
        },
        {
          headerName: "性别",
          field: "性别",
          other: "sex",
          type: "String",
        },
        {
          headerName: "身份证号",
          field: "身份证号",
          other: "idcard",
          type: "String",
        },
        {
          headerName: "专业",
          field: "专业",
          other: "SchoolMajor",
          targetClass: "SchoolMajor",
          type: "Pointer",
        },
        {
          headerName: "考点",
          field: "考点",
          other: "site",
          targetClass: "Category",
          type: "Pointer",
        },
        {
          headerName: "函授站点",
          field: "函授站点",
          other: "examsite",
          targetClass: "Category",
          type: "Pointer",
        },
        {
          headerName: "类别",
          field: "类别",
          other: "studentType",
          type: "String",
        }
      ];
      this.columnDefs = [
        {
          headerName: "必填项(成绩信息)",
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
      this.getRecruit();
      this.excelTemplate = await this.getCompConfig();
      this.rowData = [tem];
      this.groupHeaderHeight = 60; // 统一设置表头高度和筛选区域高度
      this.headerHeight = 40; // 表头高度
      this.floatingFiltersHeight = 40; // 筛选区域高度
      this.pivotGroupHeaderHeight = 50;
      this.pivotHeaderHeight = 100;
    });
  }
  async getRecruit() {
    let Recruit = new Parse.Query("RecruitStudent");
    Recruit.equalTo("department", this.department);
    let recruits = await Recruit.find();
    if (recruits && recruits.length) {
      this.recruits = recruits;
      this.recruitId = recruits[0].id;
      this.recruit = recruits[0];
    }
  }
  async getCompConfig() {
    let queryClass = new Parse.Query("Company");
    let comp = await queryClass.get(this.pCompany || this.company);
    if (comp && comp.id && comp.get("config")) {
      return comp.get("config")["basicProfileExcTpl"];
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
    this.data = await this.importServ.onFileChange(evt)
    console.log(this.data, this.columnDefs);
    let keyAry = [];
    // 遍历json对象，获取每一列的键名 表头
    for (let key in this.data[0]) {
      keyAry.push(key);
    }
    let columnDefs: any = [];
    keyAry.forEach((element, index) => {
      columnDefs.push({ headerName: element, field: element });
    });
    console.log(columnDefs);

    this.columnDefs = [
      ...this.columnDefs,
      { headerName: "导入项", children: columnDefs },
    ];

    // 处理导入的数据
    this.getOnjectIdMap().then(datas => {

      if (datas) {
        this.rowData = datas;
        this.isImport = true;
        this.isDealData = false;
      }
    }).catch(err => {
      console.log(err);
    })


  }
  // async onFileChange2(evt: any) {
  //   let formData = await this.importServ.onFileChange2(evt)
  //   console.log(formData, this.columnDefs);
  //   let url = ''
  //   this.importServ.novaHttp(url,formData)
  //   // if (datas) {
  //   //   this.rowData = datas;
  //   //   this.isImport = true;
  //   //   this.isDealData = false;
  //   // }



  // }
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
  stop: boolean = false;
  // 对数据的处理，以及错误查询
  getOnjectIdMap(stop?) {

    return new Promise(async (resolve, reject) => {
      // 导入数据循环遍历数据获取Pointer指针类型的objectId
      let datas = this.data;
      if (datas && datas.length) {
        this.isDealData = true;
        for (let index = 0; index < datas.length; index++) {
          if (this.stop) {
            this.stop = false;
            this.breakPreCheck()
            return
          }
          console.log(index);
          const data = datas[index];
          let map: any = {};
          // 表头信息
          if (data['专业']) {
            let major = await this.getMajor(data)
            if (major && major.id) {
              // map[r.other] = target.id;
              datas[index]['major'] = major.id
            } else {
              this.preCheckErrTip(data, '专业')
              this.breakPreCheck()
              return
            }
          }
          if (data['考点']) {
            let cate = await this.getCate(data, '考点')
            if (cate && cate.id) {
              // map[r.other] = target.id;
              datas[index]['examsite'] = cate.id
            } else {
              this.preCheckErrTip(data, '考点')
              this.breakPreCheck()
              return
            }
          }
          if (data['函授站点']) {
            let cate2 = await this.getCate(data, '函授站点')
            if (cate2 && cate2.id) {
              // map[r.other] = target.id;
              datas[index]['site'] = cate2.id
            } else {
              this.preCheckErrTip(data, '函授站点')
              this.breakPreCheck()
              return
            }
          }
          this.objectIdMap[index] = map;
          if (index + 1 == datas.length) {
            console.log(this.rowData);
            resolve(datas)
            setTimeout(() => {
              this.isImport = true;
              this.isDealData = false;
            }, 1000);
          }
        }


      } else {
        resolve(false)
        this.message.error("无导入数据");
      }

    })

  }
  async getMajor(data) {
    let Major = new Parse.Query("SchoolMajor");
    Major.equalTo("name", data['专业'].trim());
    Major.equalTo("school", this.department);
    Major.equalTo("type", "adultTest");
    let major = await Major.first();
    return major;
  }
  async getCate(data, type) {
    let Cate = new Parse.Query("Category");
    Cate.equalTo("name", data[type].trim());
    Cate.equalTo("department", this.department);
    Cate.equalTo("showType", "school_area");
    if (type == '考点') {
      Cate.equalTo("type", "test");
    } else {
      Cate.notEqualTo("type", "test");
    }
    let cate = await Cate.first()
    return cate;
  }
  preCheckErrTip(data, type) {
    alert(`${data[type]}:${type}错误, 或者该${type}未创建,请修改正确后重新上传`);
  }
  breakPreCheck() {
    this.isImport = false;
    this.isDealData = false;
    this.rowData = null
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
    for (let j = 0; j < rowLen; j++) {
      item = rowData[j];
      let recruitId = this.recruitId;
      // let exam: any = await this.getExam(rowData[j]);
      if (this.end) {
        // 取消上传
        this.isVisible = false;
        this.compareData();
        return;
      }
      if (recruitId) {
        let Recruit = new Parse.Query("RecruitProfile");
        Recruit.equalTo("recruit", recruitId);
        Recruit.equalTo("department", this.department);
        Recruit.select("recruit");
        let recruit = await Recruit.first();
        if (!recruit || !recruit.id) {
          console.log(recruit);
          let Log = Parse.Object.extend("SurveyLog");
          recruit = new Log();
          recruit.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: this.pCompany,
          });
          recruit.set("department", {
            __type: "Pointer",
            className: "Department",
            objectId: this.department,
          });
          recruit.set("recruit", {
            __type: "Pointer",
            className: "RecruitStudent",
            objectId: recruitId,
          });
          /* logList.push(log);
          this.successData.push(rowData[j]); */
          let res = await recruit.save();
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
        // if (!profile) {
        //   this.errCount["答卷记录无对应考生档案"] += 1;
        // } else if (!profile.get("schoolClass")) {
        //   this.errCount["答卷记录所属考生未分配考场"] += 1;
        // }
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
  async setRecruitProfile() {
    let recruitId = this.recruitId
    let department = this.department;
    let ProfileList = [];
    let ErrorList = [];
    let recList = (await this.importServ.novaSelect(`select "objectId", "idcard" from "RecruitProfile" where  "recruit" ='${recruitId}' limit 50000   `) as any).data
    console.log(`已存在：${recList.length}条`);
    let recMap = {
    }
    for (let index = 0; index < recList.length; index++) {
      let ritem = recList[index];
      recMap[ritem["idcard"]] = true
    }
    console.log(`Map映射：${Object.keys(recMap).length}条`);
    this.rowData.forEach(item => {
      // for (let xlsindex = 0; xlsindex < data.length; xlsindex++) {
      //   let item = data[xlsindex];
      let idcard = item['身份证号'].trim() || null;
      let name = item['姓名'].trim() || '';
      if (!idcard) {
        ErrorList.push({ msg: "idcard不存在", item: item })
      }
      // if (idcard) {
      //   idcard = String(idcard)
      // }
      let existRec = recMap[idcard] || null
      let Profile = Parse.Object.extend("RecruitProfile");
      let profile = null;
      if (!idcard || existRec) {
        console.log(idcard)
      } else {
        profile = new Profile();
        let obj = {};
        // let keys = Object.keys(item);
        // keys.forEach(key=>{
        obj = item;
        // obj[key] = item[key];
        // })
        // for (let index = 0; index < keys.length; index++) {
        //   let key = keys[index];
        // }

        profile.set({
          "idcard": idcard,
          "name": name,
          // "type":type,
          "company": {
            "__type": "Pointer",
            "className": "Company",
            "objectId": this.pCompany
          },
          "type": this.proType,
          "department": {
            "__type": "Pointer",
            "className": "Department",
            "objectId": department
          },
          "recruit": {
            "__type": "Pointer",
            "className": "RecruitStudent",
            "objectId": recruitId
          },
          "sex": item['性别'],
          "SchoolMajor": {
            "__type": "Pointer",
            "className": "RecruitStudent",
            "objectId": item['major']
          },
          "site": {
            "__type": "Pointer",
            "className": "Category",
            "objectId": item['site']
          },
          "examsite": {
            "__type": "Pointer",
            "className": "Category",
            "objectId": item['examsite']
          },
          "data": obj
        })
        ProfileList.push(profile)
      }
    }) // end of forEach
    console.log(`错误数据，共${ErrorList.length}条`)
    console.log(ErrorList)
    console.log(`开始批量导入任务，共${ProfileList.length}条`)
    for (let index = 0; index < ProfileList.length; index += 100) {
      let saveList = []
      if (index + 100 < ProfileList.length) {
        saveList = ProfileList.slice(index, index + 100)
        console.log(saveList)
      } else {
        saveList = ProfileList.slice(index, ProfileList.length)
        console.log(saveList)

      }
      await Promise.all(saveList.map(sitem => sitem.save()));
      console.log(`已完成:${index}/${ProfileList.length}`)
    }
  }

  savePromise(profile) {
    return new Promise((resolve, reject) => {
      profile.save().then(res => {
        resolve(res)
      }).catch(err => {
        // errData.push(item)
        reject(err)
      })
    })
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
      case "recruit":
        if (e) {
          this.recruits.filter((recruit) => {
            if (recruit.id == e) {
              this.recruit = recruit;
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
