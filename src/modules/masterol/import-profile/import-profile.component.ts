import { Component, OnInit, ViewChild } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";

@Component({
  selector: 'app-import-profile',
  templateUrl: './import-profile.component.html',
  styleUrls: ['./import-profile.component.scss']
})
export class ImportProfileComponent implements OnInit {

  constructor(public cdRef: ChangeDetectorRef) {}
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
    this.require = [
      {
        headerName: "批次",
        field: "批次",
        other: "batch",
        type: "String"
      },
      {
        headerName: "学员姓名",
        field: "学员姓名",
        other: "name",
        type: "String"
      },
      {
        headerName: "学员性别",
        field: "学员性别",
        other: "sex",
        type: "String"
      },
      { headerName: "民族", field: "民族", other: "nation", type: "String" },
      {
        headerName: "报考院校",
        field: "所属学校",
        other: "department",
        type: "Pointer",
        targetClass: "Department"
      },
      {
        headerName: "专业",
        field: "我的专业",
        other: "SchoolMajor",
        type: "Pointer",
        targetClass: "SchoolMajor"
      },
      {
        headerName: "手机号码",
        field: "手机号码",
        other: "mobile",
        type: "String"
      },
      {
        headerName: "电子邮箱",
        field: "电子邮箱",
        other: "email",
        type: "String"
      },
      {
        headerName: "身份证号",
        field: "身份证号",
        other: "idcard",
        type: "String"
      },
      { headerName: "学位获取时间", field: "学位获取时间", other: "" },
      {
        headerName: "管理中心",
        field: "管理中心",
        other: "center",
        type: "Pointer",
        targetClass: "Department"
      },
      {
        headerName: "身份类型",
        field: "身份类型",
        other: "identyType",
        type: "String"
      },
      {
        headerName: "学员状态",
        field: "学员状态",
        other: "studentType",
        type: "String"
      },
      {
        headerName: "班级",
        field: "我的班级",
        other: "schoolClass",
        type: "Pointer",
        targetClass: "SchoolClass"
      },
      
      { headerName: "当前单位", field: "当前单位", other: "", type: "String" },
      { headerName: "业务员", field: "业务员", other: "", type: "String" },
      {
        headerName: "毕业学校",
        field: "毕业学校",
        other: "school",
        type: "String"
      },
      { headerName: "学位证编号", field: "学位证编号", other: "", type: "String" },
      { headerName: "学历证编号", field: "学历证编号", other: "", type: "String" },
      { headerName: "是否需要统考辅导", field: "是否需要统考辅导", other: "", type: "String" },
      { headerName: "业务员", field: "业务员", other: "", type: "String" },
    ];
    this.columnDefs = [
      {
        headerName: "必填项(学生信息)",
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
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(target, target.files.length)
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
  }
  isImport: boolean = false;
  isDealData: boolean = false;
  getOnjectIdMap(datas) {
    // 对数据的处理，以及错误查询
    this.isDealData = true
    // 导入数据循环遍历数据获取Pointer指针类型的objectId

    datas.forEach(async (data, index) => {
      let map: any = {};
      // 表头信息
      this.require.forEach(async r => {
        if (r.type == "Pointer" && r.targetClass) {
          console.log(r.type, r.targetClass)
          if (data[r.field]) {
            let TargetClass = new Parse.Query(r.targetClass);
            TargetClass.equalTo("name", data[r.field].trim());
            let target = await TargetClass.first();
            if (target && target.id) {
              map[r.other] = target.id;
            } else {
              this.isImport = false;
              alert(data['学员姓名'] +'的'+ r.headerName + '错误, 或者该' + r.headerName + '未创建,请修改正确后重新上传')
            }
          }
          
        }
      });
      this.objectIdMap[index] = map;
      if (this.objectIdMap.length == datas.length) {
        setTimeout(() => {
          this.isImport = true;
          this.isDealData = false
          // this.cdRef.detectChanges();
        },3000)
      }
    });
    this.rowData = datas;
    console.log(this.rowData)
  }
  isVisible:boolean = false
  // 保存到数据库
  count:any = 0
  async saveLine() {
    this.isVisible = true
    let count = 0;
    for (let j = 0; j < this.rowData.length; j++) {
      if (this.objectIdMap[j].SchoolMajor) {
        console.log(this.objectIdMap[j], this.rowData[j]);
        let profile: any = await this.getProfile(
          this.rowData[j]["身份证号"],
          this.objectIdMap[j].SchoolMajor
        );
        console.log(profile, this.objectIdMap[j].SchoolMajor);
        let departments = []
        for (let i = 0; i < this.columnDefs[0].children.length; i++) {
          if (this.columnDefs[0].children[i].type == "String") {
            if(this.rowData[j][this.columnDefs[0].children[i].field]) {
              console.log(this.columnDefs[0].children[i].other, this.rowData[j][this.columnDefs[0].children[i].field])
              profile.set(
                this.columnDefs[0].children[i].other,
                this.rowData[j][this.columnDefs[0].children[i].field].trim()
              );
            }
          }
          if (this.columnDefs[0].children[i].type == "Pointer") {
            console.log(this.objectIdMap, this.objectIdMap[j]);
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
              if(this.columnDefs[0].children[i].targetClass == 'Department') {
                departments.push({
                    __type: "Pointer",
                    className: this.columnDefs[0].children[i].targetClass,
                    objectId: this.objectIdMap[j][this.columnDefs[0].children[i].other]
                })
              }
            }
          }
        }
        profile.set('departments', departments)
        await profile.save().then(res => {
          if(res && res.id) {
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
    // this.rowData.forEach( async data => {
    //   let Profile = Parse.Object.extend("Profile");
    //   let profile = new Profile();
    //   for (let i = 0; i < this.columnDefs[0].children.length; i++) {
    //      if (this.columnDefs[0].children[i].type == "String") {
    //        profile.set(this.columnDefs[0].children[i].other, data[this.columnDefs[0].children[i].field]);
    //      }
    //     if (this.columnDefs[0].children[i].type == 'Pointer') {
    //       console.log(this.columnDefs[0].children[i].targetClass);
    //       let targetClass = new Parse.Query(
    //         this.columnDefs[0].children[i].targetClass
    //       );
    //       targetClass.equalTo("name", data[this.columnDefs[0].children[i].field]);
    //       let tObj = await targetClass.first();
    //       if (tObj && tObj.id) {
    //         console.log(
    //           tObj,
    //           this.columnDefs[0].children[i].other,
    //           this.columnDefs[0].children[i].targetClass
    //         );
    //         profile.set(this.columnDefs[0].children[i].other, {
    //           __type: "Pointer",
    //           className: this.columnDefs[0].children[i].targetClass,
    //           objectId: tObj.id
    //         });
    //         console.log(123);
    //       }
    //     }
    //   }

    //   console.log(1234)
    // });
  }
  async getProfile(idcard, major) {
    return new Promise(async (resolve, reject) => {
      let Profile = new Parse.Query("Profile");
      console.log(idcard, major);
      Profile.equalTo("idcard", idcard);
      Profile.equalTo("SchoolMajor", major);
      let profile = await Profile.first();
      if (profile && profile.id) {
        resolve(profile);
      } else {
        let P = Parse.Object.extend("Profile");
        let p = new P();
        p.set("company", {
          __type: "Pointer",
          className: "Company",
          objectId: "pPZbxElQQo"
        });
        resolve(p);
      }
    });
  }

}
