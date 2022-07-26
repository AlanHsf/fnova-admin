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
  selector: 'app-import-worker',
  templateUrl: './import-worker.component.html',
  styleUrls: ['./import-worker.component.scss']
})
export class ImportWorkerComponent implements OnInit {

  constructor(public cdRef: ChangeDetectorRef) { }
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
  company: string = localStorage.getItem('company')
  types: Array<object> = [
    {
      text: '导入职工信息',
      value: 'profile'
    },
    {
      text: '导入题目',
      value: 'survey'
    },
  ]
  showModel: boolean
  importType: string = 'profile'
  selectedValue: any
  surveys: Array<object> = []
  showTips: boolean

  ngOnInit() {
    //新增职工
    this.require = [
      {
        headerName: "部门",
        field: "部门",
        other: "branch",
        type: "String"
      },
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
        headerName: "工号",
        field: "工号",
        other: "id",
        type: "String"
      },
      {
        headerName: "手机号码",
        field: "手机号码",
        other: "mobile",
        type: "String"
      },
    ]

    this.columnDefs = [
      {
        headerName: "导入职工信息",
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

  onChangeType(item) {
    console.log(item.value, item.text);
    if (item.value == 'survey') {
      this.showModel = true
      this.getSurvey('')
      return
    }
    this.importType = item.value
    this.isImport = false
    this.require = [
      {
        headerName: "部门",
        field: "部门",
        other: "branch",
        type: "String"
      },
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
        headerName: "工号",
        field: "工号",
        other: "id",
        type: "String"
      },
      {
        headerName: "手机号码",
        field: "手机号码",
        other: "mobile",
        type: "String"
      },
    ]
    this.columnDefs = [
      {
        headerName: item.text,
        children: this.require
      }
    ];
  }

  onChangInput(e) {
    console.log(e);
    this.surveys = []
    this.getSurvey(e)
  }
  //关闭弹窗
  onClose() {
    this.showModel = false
    this.showTips = false
  }
  //确认
  onOkModel() {
    console.log(this.selectedValue)
    this.showTips = true
    if (this.selectedValue) {
      this.isImport = false
      this.importType = 'survey'
      // 导入题目
      this.require = [
        {
          headerName: "题目",
          field: "题目",
          other: "title",
          type: "String"
        },
        {
          headerName: "A",
          field: "A",
          other: "optionA",
          type: "String"
        },
        {
          headerName: "B",
          field: "B",
          other: "optionB",
          type: "String"
        },
        {
          headerName: "C",
          field: "C",
          other: "optionC",
          type: "String"
        },
        {
          headerName: "D",
          field: "D",
          other: "optionD",
          type: "String"
        },
        {
          headerName: "答案",
          field: "答案",
          other: "answer",
          type: "String"
        },
        // {
        //   headerName: "排序",
        //   field: "排序",
        //   other: "order",
        //   type: "Number"
        // },
      ];
      let current_survey: any[] = this.surveys.filter((item: any) => item.id == this.selectedValue)
      this.columnDefs = [
        {
          headerName: `导入题目到 '${current_survey[0].get('title')}'`,
          children: this.require
        }
      ];
      this.showModel = false
      this.showTips = false
    }
  }
  okChange() {
    this.showTips = false
  }

  async getSurvey(value: string) {
    let query = new Parse.Query("Survey")
    query.equalTo("company", this.company)
    query.contains('title', value)
    query.limit(100)
    let res = await query.find()
    res.forEach(item => {
      console.log(item);
      this.surveys.push(item)
    })
  }

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
        // if (r.type == "Pointer" && r.targetClass) {
        //   console.log(r.type, r.targetClass)
        //   if (data[r.field]) {
        //     let TargetClass = new Parse.Query(r.targetClass);
        //     TargetClass.equalTo("name", data[r.field].trim());
        //     let target = await TargetClass.first();
        //     if (target && target.id) {
        //       map[r.other] = target.id;
        //     } else {
        //       this.isImport = false;
        //       alert(data['学员姓名'] +'的'+ r.headerName + '错误, 或者该' + r.headerName + '未创建,请修改正确后重新上传')
        //     }
        //   }

        // }
      });
      this.objectIdMap[index] = map;
      if (this.objectIdMap.length == datas.length) {
        setTimeout(() => {
          this.isImport = true;
          this.isDealData = false
          // this.cdRef.detectChanges();
        }, 3000)
      }
    });
    this.rowData = datas;
    console.log(this.rowData)
  }
  isVisible: boolean = false
  // 保存到数据库
  count: any = 0
  async saveLine() {
    this.isVisible = true
    let count = 0;
    if (this.importType == 'profile') {
      for (let j = 0; j < this.rowData.length; j++) {
        //导入职工信息
        let branch = this.rowData[j]['部门'].split("/")
        console.log(branch);
        let Profile = Parse.Object.extend('Profile')
        let profile = new Profile()
        profile.set("name", this.rowData[j]['姓名'])
        profile.set("studentID", this.rowData[j]['工号'])
        profile.set("mobile", this.rowData[j]['手机号码'])
        profile.set("branch", branch)
        profile.set("sex", this.rowData[j]['性别'])
        profile.set('company', {
          __type: "Pointer",
          className: "Company",
          objectId: "668rM7MPii"
        })
        let rs = await profile.save()
        console.log('已上传', rs)
      }
    } else {
      for (let j = 0; j < this.rowData.length; j++) {
        // 导入题目
        let A = {
          check: false,
          label: "A",
          grade: null,
          value: this.rowData[j]['A']
        }
        let B = {
          check: false,
          grade: null,
          label: "B",
          value: this.rowData[j]['B']
        }
        let D, C
        if (this.rowData[j]['C']) {
          C = {
            check: false,
            grade: null,
            label: "C",
            value: this.rowData[j]['C']
          }
        }
        if (this.rowData[j]['D']) {
          D = {
            check: false,
            grade: null,
            label: "D",
            value: this.rowData[j]['D']
          }
        }
        switch (this.rowData[j]['答案']) {
          case 'A':
            A.check = true
            A.grade = 2
            break;
          case 'B':
            B.check = true
            B.grade = 2
            break;
          case 'C':
            C.check = true
            C.grade = 2
            break;
          case 'D':
            D.check = true
            D.grade = 2
            break;
        }
        let options = []
        if (this.rowData[j]['D']) {
          options.push(A, B, C, D)
        } else if (this.rowData[j]['C']) {
          options.push(A, B, C)
        } else {
          options.push(A, B)
        }
        console.log(j, this.rowData[j], this.rowData[j]['题目']);
        let surveyItem = Parse.Object.extend('SurveyItem')
        let suritem = new surveyItem()
        suritem.set("index", j + 1)
        suritem.set("score", 0)
        suritem.set("isEnabled", true)
        suritem.set("title", this.rowData[j]['题目'])
        suritem.set("survey", {
          __type: "Pointer",
          className: "Survey",
          objectId: this.selectedValue
        })
        suritem.set("type", "select-single")
        suritem.set("difficulty", "normal")
        suritem.set("options", options)
        suritem.set('company', {
          __type: "Pointer",
          className: "Company",
          objectId: this.company
        })
        let resLog = await suritem.save()
        console.log(resLog.toJSON() + '完成上传');
      }
    }
    this.isVisible = false
    this.isImport = false
  }
}
