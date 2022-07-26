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
import { NzMessageService } from "ng-zorro-antd/message";
import { ThemeService } from "src/app/theme.service";

@Component({
  selector: 'app-import-teacher',
  templateUrl: './import-teacher.component.html',
  styleUrls: ['./import-teacher.component.scss']
})
export class ImportTeacherComponent implements OnInit {

  constructor(public cdRef: ChangeDetectorRef, private message: NzMessageService) { }
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
  department: string = ""
  pCompany: string;
  ngOnInit() {
    this.department = localStorage.getItem('department') || ''
    if (this.department) {
      this.getDepartInfo()
    }
    // if(localStorage.getItem('department')) {
    //     this.department = localStorage.getItem('department')
    // }
    if (this.department) {
      this.require = [
        {
          headerName: "姓名",
          field: "姓名",
          other: "name",
          type: "String"
        },
        {
          headerName: "性别",
          field: "性别",
          other: "sex",
          type: "String"
        },
        {
          headerName: "身份证",
          field: "身份证",
          other: "idcard",
          type: "String"
        },
        {
          headerName: "电话号码",
          field: "电话号码",
          other: "mobile",
          type: "String"
        },


      ];
    } else {
      this.require = [
        {
          headerName: "姓名",
          field: "姓名",
          other: "name",
          type: "String"
        },
        {
          headerName: "性别",
          field: "性别",
          other: "sex",
          type: "String"
        },
        {
          headerName: "身份证",
          field: "身份证",
          other: "idcard",
          type: "String"
        },
        {
          headerName: "电话号码",
          field: "电话号码",
          other: "mobile",
          type: "String"
        },
        {
          headerName: "所属院校",
          field: "所属院校",
          other: "department",
          type: "Pointer"
        },

      ];
    }

    this.columnDefs = [
      {
        headerName: "必填项(老师信息)",
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
  async getDepartInfo() {
    let queryD = new Parse.Query("Department");
    let res = await queryD.get(this.department);
    if (res && res.id) {
      console.log(res);
      this.pCompany = res.get("company").id;
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
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    console.log(reader);
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
  }
  isImport: boolean = false;
  isDealData: boolean = false;
  async getOnjectIdMap(datas) {
    // 对数据的处理，以及错误查询
    this.isDealData = true
    // 导入数据循环遍历数据获取Pointer指针类型的objectId
    // for(let i = 0; i < datas.lengtth ; i++) {
    //     let map:any = {}
    //     for(let j = 0; j < this.require.length; j++  ) {
    //         if (this.require[j].other == 'mobile') {
    //             if (!datas[i][this.require[j].field]) {
    //               alert(datas[i]['学员姓名'] + '未填写手机号')
    //             }
    //             let mobile = datas[i][this.require[j].field].trim()
    //             let reg = new RegExp('^1[0-9]{10}$', 'g')
    //             let checkMobile = reg.test(mobile)
    //             if (!checkMobile) {
    //               this.isImport = false;
    //               alert(datas[i]['学员姓名'] + '手机号格式不正确')
    //             }
    //           }
    //         if (this.require[j].other == 'idcard') {
    //         if (!datas[i][this.require[j].field]) {
    //             this.isImport = false;
    //             alert(datas[i]['学员姓名'] + '身份证号未填写')
    //         }
    //         let idcard =  datas[i][this.require[j].field].trim()
    //         let reg = new RegExp('^[1-9][0-9]{16}[0-9Xx]$', 'g')
    //         let checkIdcard = reg.test(idcard)
    //         if (!checkIdcard) {
    //             this.isImport = false;
    //             this.isImport = false;
    //             alert(datas[i]['学员姓名'] + '身份证号格式不正确')
    //         }
    //         }
    //           if (this.require[j].type == "Pointer" && this.require[j].targetClass) {
    //             if (datas[i][this.require[j].field]) {
    //               let TargetClass = new Parse.Query(this.require[j].targetClass);
    //               TargetClass.equalTo("name", datas[i][this.require[j].field].trim());
    //               let target = await TargetClass.first();
    //               if (target && target.id) {
    //                 map[this.require[j].other] = target.id;
    //               } else {
    //                 map[this.require[j].other] = null;
    //               }
    //             }
    //         }
    //     }
    //     this.objectIdMap[i] = map;
    //     console.log(this.objectIdMap)
    //     if (this.objectIdMap.length == datas.length) {
    //         setTimeout(() => {
    //           this.isImport = true;
    //           this.isDealData = false
    //         }, 3000)
    //       }
    // }
    for (let index = 0; index < datas.length; index++) {
      let data = datas[index];
      let map: any = {};
      for (let index = 0; index < this.require.length; index++) {
        let r = this.require[index];
        if (r.other == 'mobile') {
          if (!data[r.field]) {
            alert(data['姓名'] + '未填写手机号')
            return
          }
          let mobile = data[r.field].trim()
          let reg = new RegExp('^1[0-9]{10}$', 'g')
          let checkMobile = reg.test(mobile)
          if (!checkMobile) {
            this.isImport = false;
            alert(data['姓名'] + '手机号格式不正确')
            return
          }
        }
        if (r.other == 'idcard') {
          if (!data[r.field]) {
            this.isImport = false;
            alert(data['姓名'] + '身份证号未填写')
            return
          }
          let idcard = data[r.field].trim()
          let reg = new RegExp('^[1-9][0-9]{16}[0-9Xx]$', 'g')
          let checkIdcard = reg.test(idcard)
          if (!checkIdcard) {
            this.isImport = false;
            this.isImport = false;
            alert(data['姓名'] + '身份证号格式不正确')
            return
          }
        }
        if (r.type == "Pointer" && r.targetClass) {
          if (data[r.field]) {
            let TargetClass = new Parse.Query(r.targetClass);
            TargetClass.equalTo("name", data[r.field].trim());
            // 学员专业以及学员班级
            // if(r.targetClass == 'SchoolClass' && this.department ) {
            //     TargetClass.equalTo("department", this.department);
            // }
            // if(r.targetClass == 'SchoolMajor' && this.department ) {
            //     console.log('专业')
            //     TargetClass.equalTo("school", this.department);
            // }
            let target = await TargetClass.first();
            console.log(target, r.targetClass, this.department)
            if (target && target.id) {
              map[r.other] = target.id;
            } else {
              map[r.other] = null;
            }
          }
        }
      }
      this.objectIdMap[index] = map;
      if (this.objectIdMap.length == datas.length) {
        setTimeout(() => {
          this.isImport = true;
          this.isDealData = false
        }, 10000)
      }
    }

    this.rowData = datas;
  }
  successData = []

  isVisible: boolean = false
  // 保存到数据库
  count: any = 0
  errCount: any = 0
  async saveLine(end?) {
    this.isVisible = true
    let count = 0;
    if (end) {
      this.isVisible = false
      return
    }
    for (let j = 0; j < this.rowData.length; j++) {
      console.log(this.rowData);

      console.log(this.objectIdMap[j].SchoolMajor)
      // if (this.objectIdMap[j].SchoolMajor) {
      let profile: any = await this.getProfile(
        this.rowData[j]["身份证"],
        this.rowData[j]["姓名"],
        this.objectIdMap[j].SchoolMajor
      );
      let departments = []


      if (this.department) {
        console.log(this.department);
        profile.set("department", {
          __type: "Pointer",
          className: "Department",
          objectId: this.department
        });
        profile.set('departments', [{
          __type: "Pointer",
          className: "Department",
          objectId: this.department
        }])
      } else {
        if (this.rowData[j]["所属院校"]) {
          let queryD = new Parse.Query("Department")
          queryD.equalTo("company", this.pCompany)
          queryD.equalTo("name", this.rowData[j]["所属院校"])
          let res = await queryD.first()
          console.log(res);
          if (res && res.id) {
            this.department = res.id
            profile.set("department", {
              __type: "Pointer",
              className: "Department",
              objectId: this.department
            });
            profile.set('departments', [{
              __type: "Pointer",
              className: "Department",
              objectId: this.department
            }])
          }
          console.log(this.department);
        }
      }
      for (let i = 0; i < this.columnDefs[0].children.length; i++) {
        if (this.columnDefs[0].children[i].type == "String") {
          if (this.rowData[j][this.columnDefs[0].children[i].field]) {
            profile.set(
              this.columnDefs[0].children[i].other,
              this.rowData[j][this.columnDefs[0].children[i].field].trim()
            );
          }
        }
        if (this.columnDefs[0].children[i].type == "Pointer") {
          if (
            this.objectIdMap &&
            this.objectIdMap[j] &&
            this.objectIdMap[j][this.columnDefs[0].children[i].other]
          ) {
            profile.set(this.columnDefs[0].children[i].other, {
              __type: "Pointer",
              className: this.columnDefs[0].children[i].targetClass,
              objectId: this.objectIdMap[j][this.columnDefs[0].children[i].other]
            });
            if (this.columnDefs[0].children[i].targetClass == 'Department') {
              departments.push({
                __type: "Pointer",
                className: this.columnDefs[0].children[i].targetClass,
                objectId: this.objectIdMap[j][this.columnDefs[0].children[i].other]
              })
            }
          }
        }
        if (this.columnDefs[0].children[i].type == "Boolean") {
          if (this.rowData[j][this.columnDefs[0].children[i].field] && this.rowData[j][this.columnDefs[0].children[i].field].trim() == '是') {
            profile.set(
              this.columnDefs[0].children[i].other,
              true
            );
          } else {
            profile.set(
              this.columnDefs[0].children[i].other,
              false
            );
          }
        }
        // 存助学中心， 和所属学校的 departments
      }


      if (this.end) {
        this.isVisible = false
        console.log(this.successData)
        this.isVisible2 = true
        this.compareData()
        return
      }
      let res = await profile.save()
      if (res && res.id) {
        console.log(res);

        count += 1;
        this.count = count;
        console.log(res)
        this.successData.push({ id: res.id, idcard: res.get('idcard'), name: res.get('name') });
      }

      if ((count + this.errCount) == this.rowData.length) {
        this.isVisible2 = true
        this.compareData()
        setTimeout(res => {
          this.isVisible = false
          this.isImport = false;
        }, 1000)
      }
      // } else {
      //     this.errCount += 1
      //     if ((count +this.errCount) == this.rowData.length) {
      //       this.isVisible2 = true
      //       this.compareData()
      //       setTimeout(res => {
      //         this.isVisible = false
      //         this.isImport = false;
      //       }, 1000)
      //     }
      //     continue
      // }
    }


  }
  end: boolean = false
  cancelPush() {
    this.end = true
  }
  isVisible2: boolean = false;
  errData: any = []
  async compareData() {
    var set = this.successData.map(item => item['idcard'])
    console.log(set)
    var resArr = this.rowData.filter(item => !set.includes(item['身份证']))
    console.log(resArr)
    if (resArr == []) {
      this.errData = resArr
    } else {
      this.isVisible = false;
      console.log('重新上传');
      this.errData = resArr
      this.rowData = resArr
    }
  }
  handleCancel() {
    this.isVisible2 = false;
  }
  async getProfile(idcard, name, major) {
    return new Promise(async (resolve, reject) => {
      let Profile = new Parse.Query("Profile");
      Profile.notEqualTo("isDeleted", true);
      if (idcard) {
        Profile.equalTo("idcard", idcard.trim());
      }
      if (name) {
        Profile.equalTo("name", name.trim());
      }
      Profile.equalTo("identyType", this.pCompany);
      Profile.equalTo("company", this.pCompany);
      // Profile.equalTo("SchoolMajor", major);
      let profile = await Profile.first();
      if (profile && profile.id) {
        resolve(profile);
      } else {
        let P = Parse.Object.extend("Profile");
        let p = new P();
        p.set("company", {
          __type: "Pointer",
          className: "Company",
          objectId: this.pCompany
        });
        p.set("isCross", true);
        p.set("identyType", "teacher");

        resolve(p);
      }
    });
  }

}
