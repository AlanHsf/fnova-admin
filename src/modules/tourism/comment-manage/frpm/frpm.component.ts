import { Component, OnInit } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { NzMessageService } from "ng-zorro-antd/message";
import { RouterModule } from '@angular/router';
import { profile } from "console";
@Component({
  selector: 'app-frpm',
  templateUrl: './frpm.component.html',
  styleUrls: ['./frpm.component.scss']
})
export class FrpmComponent implements OnInit {
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
  gridApi;
  isOkLoading: boolean = true
  gridColumnApi;
  company;
  center;
  async ngOnInit() {
    if (localStorage.getItem('department')) {
      this.department = localStorage.getItem('department')
    }
    // 教学点
    // let depa = new Parse.Query("Department")
    // depa.equalTo("objectId", this.department);
    // depa.equalTo("type", "training");
    // let depaInfo = await depa.first()
    // console.log(depaInfo)
    // if (depaInfo && depaInfo.id) {
    //   this.center = depaInfo.id
    //   this.company = depaInfo.get("company").id
    //   this.department = ''
    //   this.getCenterDepaList()
    // }

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
        headerName: "民族",
        field: "民族",
        other: "nation",
        type: "String"
      },
      {
        headerName: "身份证号码",
        field: "身份证号码",
        other: "idcard",
        type: "String"
      },
      {
        headerName: "联系电话",
        field: "联系电话",
        other: "mobile",
        type: "String"
      },
      {
        headerName: "现居住地",
        field: "家庭住址",
        other: "address",
        type: "String"
      },

      // {
      //     headerName: "层次",
      //     field: "层次",
      //     other: "education",
      //     type: "String"
      // },
      // {
      //     headerName: "报读学校",
      //     field: "报读学校",
      //     other: "department",
      //     type: "Pointer",
      //     targetClass: "Department"
      // },
      // {
      //     headerName: "教学点",
      //     field: "教学点",
      //     other: "center",
      //     type: "Pointer",
      //     targetClass: "Department"
      // },
      // {
      //     headerName: "报考专业",
      //     field: "报考专业",
      //     other: "SchoolMajor",
      //     type: "Pointer",
      //     targetClass: "SchoolMajor"
      // },

      // {
      //     headerName: "籍贯",
      //     field: "籍贯",
      //     other: "nativePlace",
      //     type: "String"
      // },


    ];
    this.columnDefs = [
      {
        // headerName: "必填项(学生信息)",
        children: this.require,

      },


    ]; console.log(this.columnDefs)
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
  depaList;
  depaId;
  // async getCenterDepaList() {
  //   let department = new Parse.Query("Department")
  //   department.equalTo("company", "1ErpDVc1u6");
  //   department.notEqualTo("type", "training");
  //   let depaList = await department.find();
  //   console.log(depaList)
  //   if (depaList.length) {
  //     this.depaList = depaList
  //   }
  // }

  // 文件拖拽
  handleDropOver(e, over?) {
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
    // console.log(this.depaId)
    // if (this.center && !this.depaId) {
    //   this.message.error("请先选择院校!")
    //   return;
    // }

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
      console.log(XLSX)
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      console.log(this.data)

      let keyAry = [];
      // 遍历json对象，获取每一列的键名 表头
      for (let key in this.data[1]) {
        keyAry.push(key);
        console.log(keyAry);

      }
      let columnDefs: any = [];
      keyAry.forEach((element, index) => {
        columnDefs.push({ headerName: element, field: element });
      });

      this.columnDefs = [
        ...this.columnDefs,
        { headerName: "导入项", children: columnDefs }
      ];

      // 处理导入的数据getOnjectIdMap
      this.getOnjectIdMap(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
    let drop = document.getElementById("dropBox");
    if (this.rowData.length >= 1) {
      drop.style.display = "none";
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  exportData() {
    this.gridApi.exportDataAsExcel();
  }


  isImport: boolean = false;
  isDealData: boolean = false;
  async getOnjectIdMap(datas) {
    // 对数据的处理，以及错误查询
    this.isDealData = true
    console.log(1111, datas)
    datas.forEach((data, index) => {
      let map: any = {};
      this.require.forEach(async r => {
        if (r.other == 'mobile') {
          let mobile = data[r.field].trim()
          console.log(mobile);
          
        }
        if (r.other == 'idcard') {
          let idcard = data[r.field].trim()
        }
        if (r.other == 'name') {
          let name = data[r.field].trim()
        }
        if (r.other == 'sex') {
          let sex = data[r.field].trim()
        }
        if (r.other == 'nation') {
          let nation = data[r.field].trim()
        }
        if (r.other == 'address') {
          let address = data[r.field].trim()
        }
        // console.log([r.other]);
        
      // let TargetClass = new Parse.Query('profile');
      // TargetClass.equalTo("company", 'sHNeVwSaAg');
      // let target = await TargetClass.first();
        // if (r.type == "Pointer" && r.targetClass) {
        //     if (data[r.field]) {
                // let TargetClass = new Parse.Query('profile');
        //         TargetClass.equalTo("name", data[r.field].trim());
                // TargetClass.equalTo("company", 'sHNeVwSaAg');
        //         if (this.center && r.targetClass == 'Department' && r.headerName == "报读学校") {
        //             let depa = new Parse.Query("Department");
        //             let depaInfo = await depa.get(this.depaId);
        //             console.log(depaInfo, data[r.field])
        //             if (data[r.field] != depaInfo.get("name")) {
        //                 alert(data['姓名'] + '报名学校与现在院校不符!');
        //             }
        //         }
        //         if (r.targetClass == 'SchoolMajor' && this.department) {
        //             if (this.depaId) {
        //                 TargetClass.equalTo("school", this.depaId);
        //             } else {
        //                 TargetClass.equalTo("school", this.department);
        //             }
        //             TargetClass.equalTo("type", data["层次"]);
        //         }
        //         if (r.targetClass == 'Category' && this.department) {
        //             TargetClass.equalTo("department", this.department);
        //         }
        //         if (r.headerName == '教学点' && this.department) {
        //             TargetClass.equalTo("type", "training");
        //         }
        //         TargetClass.select('objectId')
                // let target = await TargetClass.first();

        //         if (target && target.id) {
                    // map[r.other] = target.id;
        //         } else {
                    // map[r.other] = null;
                    // this.isImport = false;
                    // alert(data['姓名'] + data[r.headerName] + ": " + data[r.field] + '填写错误!')
        //         }
        //     } else {
        //         this.isImport = false;
        //         alert(data['姓名'] + '[专业] 或 [教学点] 或 [所属学校] 未填写')
        //     }
        // }
      });

      this.objectIdMap[index] = map;
      // console.log(this.objectIdMap)
      if (this.objectIdMap.length == datas.length) {
        setTimeout(() => {
          this.isImport = true;
          this.isDealData = false
        }, 3000)
      }
    });
    console.log(datas);

    this.rowData = datas;
  }
  successData = []

  isVisible: boolean = false
  // 保存到数据库
  count: any = 0
  errCount: any = 0
  async saveLine() {
    this.isVisible = true
    let count = 0;
    for (let j = 0; j < this.rowData.length; j++) {
      console.log(this.rowData)
      if (this.objectIdMap[j].department && this.objectIdMap[j].center) {
        let profile: any = await this.getProfile(
          this.rowData[j]["身份证号"],
          this.rowData[j]["姓名"],
          this.rowData[j]["性别"],
          this.rowData[j]["民族"],
          this.rowData[j]["现居住地"],
          this.rowData[j]["联系电话"],
        );
        let departments = []
        for (let i = 0; i < this.columnDefs[0].children.length; i++) {
        //   if (this.columnDefs[0].children[i].type == "String") {
        //     if (this.rowData[j][this.columnDefs[0].children[i].field]) {
        //       profile.set(
        //         this.columnDefs[0].children[i].other,
        //         this.rowData[j][this.columnDefs[0].children[i].field].trim()
        //       );
              // console.log(this.rowData[j][this.columnDefs[0].children[i].field].trim());

        //     }
        //   }
        //   if (this.columnDefs[0].children[i].type == "Pointer") {
        //     if (
        //       this.objectIdMap &&
        //       this.objectIdMap[j] &&
        //       this.objectIdMap[j][this.columnDefs[0].children[i].other]
        //     ) {
        //       profile.set(this.columnDefs[0].children[i].other, {
        //         __type: "Pointer",
        //         className: this.columnDefs[0].children[i].targetClass,
        //         objectId: this.objectIdMap[j][this.columnDefs[0].children[i].other]
        //       });
        //       if (this.columnDefs[0].children[i].targetClass == 'Department') {
        //         departments.push({
        //           __type: "Pointer",
        //           className: this.columnDefs[0].children[i].targetClass,
        //           objectId: this.objectIdMap[j][this.columnDefs[0].children[i].other]
        //         })
        //       }
        //     }
        //   }
        //   if (this.columnDefs[0].children[i].type == "Boolean") {
        //     if (this.rowData[j][this.columnDefs[0].children[i].field] && this.rowData[j][this.columnDefs[0].children[i].field].trim() == '是') {
        //       profile.set(
        //         this.columnDefs[0].children[i].other,
        //         true
        //       );
        //     } else {
        //       profile.set(
        //         this.columnDefs[0].children[i].other,
        //         false
        //       );
        //     }
        //   }
        // }
        // profile.set('departments', departments)

        // let res = await profile.save()
        // if (res && res.id) {
        //   count += 1;
        //   this.count = count;
        //   this.successData.push({ id: res.id, idcard: res.get('idcard'), name: res.get('name') });
        // } else {
        //   this.errCount += 1
        //   this.errData.push({
        //     name: this.rowData[j]["姓名"],
        //     idcard: this.rowData[j]["身份证号"],
        //     res: '上传失败'
        //   })
        }

      }
    }
    console.log(this.errCount, count)
    if (count != this.rowData.length) {
      this.isVisible2 = true
      setTimeout(res => {
        this.isVisible = false
        this.isImport = false;
      }, 1000)
    } else {
      setTimeout(res => {
        this.isVisible = false
        this.isImport = false;
      }, 1000)
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
    var resArr = this.rowData.filter(item => {
      !set.includes(item['身份证号'])
    })
  }
  handleCancel() {
    this.isVisible2 = false;
  }
  async getProfile(idcard, name, address, mation, sex,mobile) {
    return new Promise(async (resolve, reject) => {
      let Profile = new Parse.Query("Profile");
      // if (idcard) {
      //   Profile.equalTo("idcard", idcard.trim());
      // }
      // if (name) {
      //   Profile.equalTo("name", name.trim());
      // }
      //  if (sex) {
      //   Profile.equalTo("name", sex.trim());
      // }
      // if (mation) {
      //   Profile.equalTo("name", mation.trim());
      // }
      // if (address) {
      //   Profile.equalTo("name", address.trim());
      // }
      // Profile.equalTo("company", "sHNeVwSaAg");

      // Profile.equalTo("SchoolMajor", major);
      // let profile = await Profile.first();
      // if (profile && profile.id) {
 

      //   resolve(profile);
      // } else {
      //   let P = Parse.Object.extend("Profile");
      //   let p = new P();
      //   p.set("company", {
      //     __type: "Pointer",
      //     className: "Company",
      //     objectId: "sHNeVwSaAg"
      //   });
      

      //   resolve(p);
      // }
    });
  }
}

