import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { NzModalService } from 'ng-zorro-antd/modal';
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { ActivatedRoute } from "@angular/router";
import { ImportExclService } from "../import-excl.service";
import { resolve } from "@angular/compiler-cli/src/ngtsc/file_system";
import { NzMessageService } from "ng-zorro-antd/message";


@Component({
  selector: "app-import-student",
  templateUrl: "./import-exam-room.component.html",
  styleUrls: ["./import-exam-room.component.scss"],
})
export class ImportExamRoomComponent implements OnInit {
  public api: GridApi;
  public columnApi: ColumnApi;
  data: any;
  isLoadingTwo;
  columnDefs: any[] = [
    {
      headerName: "所属考点",
      field: "所属考点",
      key: "cates",
      unique: false,
      type: "PointerArray",
      targetClass: "Category",
      targetField: "name",
      targetFilter: {
        equalTo: {
          'type': 'test'
        }
      },
      require: false
    },
    {
      headerName: "考场名称",
      field: "考场名称",
      key: "name",
      unique: true,
      type: "String",
      require: true
    },
    {
      headerName: "考场编号",
      field: "考场编号",
      key: "testNumber",
      unique: true,
      type: "Number",
      require: true
    },
    {
      headerName: "座位数",
      field: "座位数",
      key: "seating",
      unique: false,
      type: "Number",
      require: true
    },
    {
      headerName: "开始时间",
      field: "开始时间",
      key: "beginTime",
      unique: false,
      type: "Date",
      require: true
    },
    {
      headerName: "结束时间",
      field: "结束时间",
      key: "endTime",
      unique: false,
      type: "Date",
      require: true
    },
    {
      headerName: "语种",
      field: "语种",
      key: "lang",
      type: "String",
      unique: false,
      require: true
    },
    {
      headerName: "考试地点",
      field: "考试地点",
      key: "location",
      type: "String",
      require: true
    },
    {
      headerName: "详细地址",
      field: "详细地址",
      key: "address",
      type: "String",
      unique: false,
      require: true
    },
  ];
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
    private activRoute: ActivatedRoute,
    private importServ: ImportExclService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }
  department: any;
  company: any;
  pCompany: string;
  cate: any;
  departInfo: any;
  departs: any;
  subCompany: any;
  companyInfo: any;
  classExcTpl: string;
  pointMap: any = {}// 保存所有指针对应的id  key => name  {targetClass,id}  方便上传数据时 无需再次校对对应pointer
  uploadFailModal: boolean = false;
  failData: any[] = [];
  ngOnInit() {
    this.department = localStorage.getItem("department");
    this.company = localStorage.getItem("company");
    console.log(this.department,this.company,'---------');
    

    this.activRoute.paramMap.subscribe(async (params) => {
      if (!this.department) {
        this.columnDefs.splice(0, 0, {
          headerName: "所属院校",
          field: "所属院校",
          key: "department",
          type: "Pointer",
          targetClass: "Department"
        });
        this.departs = await this.getDeparts();
      } else {
        let departInfo = await this.getDepartment();
        if (departInfo) {
          let company = departInfo.get("company")
          this.pCompany = departInfo.get("company").id;
          this.companyInfo = departInfo.get("subCompany")
          this.classExcTpl = this.companyInfo.get('config')?.classExcTpl
          console.log(this.classExcTpl,this.companyInfo,this.classExcTpl);
          if (!this.classExcTpl) {
            this.classExcTpl = company.get("config")?.classExcTpl
          }
        }
      }
    });

    let tem = {};
    this.columnDefs.forEach((data) => {
      tem[data.field] = "";
    });
    this.rowData = [tem];
    this.groupHeaderHeight = 40;
    this.headerHeight = 40;
    this.floatingFiltersHeight = 40;
    this.pivotGroupHeaderHeight = 50;
    this.pivotHeaderHeight = 100;
  }
  async getDepartment() {
    let queryD = new Parse.Query("Department");
    queryD.include("company");
    queryD.include("subCompany");
    queryD.get(this.department);
    let res = await queryD.first();
    if (res && res.id) {
      console.log(res);
      this.departInfo = res;
      return res;
    }
  }



  /* **** excel上传 **** */
  handleDropOver(e, over?) {
    this.importServ.handleDropOver(e)
  }
  handleDrop(e) {
    this.importServ.handleDrop(e)
  }
  async onFileChange(e) {
    let exclData = await this.importServ.onFileChange(e)
    // let columnDefs = this.importServ.columnDefs;
    // let exclData = this.importServ.exclData;
    console.log(exclData, this.columnDefs);

    if (exclData.length) {
      // 处理导入的数据 错误检查
      let status = await this.getOnjectIdMap(this.columnDefs, exclData);
      console.log(status);
      if (status) {
        console.log(exclData, this.columnDefs);
        this.rowData = exclData;
        this.cdRef.detectChanges()
      }
    } else {
      this.message.error("无可导入数据")
    }
  }
  // 对数据的处理，以及错误查询   必填项/Pointer
  getOnjectIdMap(columns, datas) {
    return new Promise(async (resolve, reject) => {
      const ref = this.modal.confirm({
        nzTitle: '数据处理',
        nzContent: '数据处理,以及错误数据排查',
        nzClosable: false,
        nzMaskClosable: false,
        nzCancelText: null,
        nzOkText: null,
      });
      let requireRef;
      let repeatRef;
      // 检查必填项是否存在
      for (let index = 0; index < columns.length; index++) {
        let column = columns[index];
        for (let dIndex = 0; dIndex < datas.length; dIndex++) {
          let item = datas[dIndex];
          /* 必填项无值 */
          if (item[column.require] && item[column.field].trim() == '' && !requireRef) {
            this.isImport = false;
            requireRef = this.modal.confirm({
              nzTitle: 'excel上传错误',
              nzContent: `必填项 ${column.field}  ${dIndex + 1}行为空，请处理后上传`,
              nzCancelText: null,
            });
            resolve(false)
          }
          // 检查Pointer指针类型对应数据是否存在
          if ((column.type == "Pointer" || column.type == "PointerArray") && column.targetClass) {
            console.log(column.type,'--------', column.targetClass,'--------', item,'--------', column.headerName);
            if (item[column.headerName] && item[column.headerName].trim() != '') {
              let TargetClass = new Parse.Query(column.targetClass);
              TargetClass.equalTo(column.targetField, item[column.field].trim());
              let filter = column.targetFilter;
              if (filter && filter.equalTo) {// pointer数据查询条件
                let keys = Object.keys(filter.equalTo)
                keys.forEach(key => {
                  TargetClass.equalTo(key, filter.equalTo[key])
                })
              }
              TargetClass.first().then(target => {
                if (target && target.id) {
                  // 保存所有指针对应的id  key => name  {targetClass,id}
                  // this.pointMap[column.headerName] = {
                  //   target: column.targetClass,
                  //   id: target.id
                  // };
                  this.pointMap[dIndex] = {}
                  this.pointMap[dIndex][column.targetClass] = target.id
                } else {
                  this.isImport = false;
                  alert(
                    item["学员姓名"] +
                    "的" +
                    column.name +
                    "错误, 或者该" +
                    column.name +
                    "未创建,请修改正确后重新上传"
                  );
                  resolve(false)
                }
              })
            }
          }
          // 根据唯一值字段判断是否可以上传
          if (column.unique && !repeatRef) {
            console.log('unique');
            let TargetClass = new Parse.Query("SchoolClass");
            TargetClass.equalTo('department', this.department);
            TargetClass.equalTo(column.key, item[column.field].trim());
            let target = await TargetClass.first()
            console.log(target);
            console.log(this.department,item[column.field].trim(),'----------------------');
            
            if (target && target.id) {
              // 保存所有指针对应的id  key => name  {targetClass,id}
              repeatRef = this.modal.confirm({
                nzTitle: '重复上传',
                nzContent: `字段 ${column.field} 数据值不可重复，数据库已存在该值 请处理后上传： ${dIndex + 1}行`,
                nzCancelText: null,
              });
              this.isImport = false;
              resolve(false)
            }
          }
          if (index + 1 == columns.length && dIndex + 1 == datas.length) {
            console.log('end');
            // setTimeout(() => {
            this.isImport = true;
            ref.close()
            resolve(true)
            // }, 1000);
          }
        }
      }
    })
  }

  // 字符串转日期
  strToDate(strDate) {
    console.log(strDate);
    let s = strDate.replace(/-/g, "/");
    s = s.replace(/(\.\d+)?/g, "");
    console.log(s);
    let date = new Date(s);
    return date;
  }

  // 保存到数据库
  count: any = 0;
  async saveLine() {
    let process;
    let count = 0;
    this.isLoadingTwo = true;
    for (let j = 0; j < this.rowData.length; j++) {
      let row = this.rowData[j]
      let Class = Parse.Object.extend("SchoolClass");
      let sclass = new Class();
      row["开始时间"] = this.strToDate(row["开始时间"]);
      row["结束时间"] = this.strToDate(row["结束时间"]);
      for (let i = 0; i < this.columnDefs.length; i++) {
        let column = this.columnDefs[i]
        sclass.set("company", {
          __type: "Pointer",
          className: "Company",
          objectId: this.pCompany || this.company,
        });
        sclass.set("department", {
          __type: "Pointer",
          className: "Department",
          objectId: this.department,
        });
        sclass.set("departments", [{
          __type: "Pointer",
          className: "Department",
          objectId: this.department,
        }]);
        if (row[column.field] && row[column.field] != '') {
          switch (column.type) {
            case "Number":
              sclass.set(
                column.key,
                Number(row[column.field])
              );
              break;
            case "Date":
              console.log(row["开始时间"]);
              console.log(
                row[column.field]
              );
              sclass.set(
                column.key,
                row[column.field]
              );
              break;
            case "String":
              sclass.set(
                column.key,
                row[column.field].trim()
              );
              break;
            case "Pointer":

              break;
            case "PointerArray":
              if (column.key == "cates") {
                this.cate = await this.getCate(row["所属考点"]);
                sclass.set(column.key, [
                  {
                    __type: "Pointer",
                    className: "Category",
                    objectId: this.cate,
                  },// this.pointMap[i][column.targetClass]
                ]);
              }
              break;
            default:
              break;
          }
        }
      }
      count += 1;

      await sclass.save().then((res) => {
        if (res && res.id) {
          this.count += 1;
          console.log(res)
        } else {

          this.failData.push(row)
        }
        if (count == this.rowData.length) {
          this.isLoadingTwo = false

          if (this.count < count) {// 有数据未上传成功
            this.uploadFailModal = true;
            this.rowData = this.failData;
            return
          }

          process = this.modal.success({
            nzTitle: null,
            nzContent: `上传完成 ${this.count}/${this.rowData.length}`
          });

          this.count = 0
          // 全部上传成功
          setTimeout((res) => {
            this.isImport = false;
            this.message.success("上传成功")
            this.rowData = []
          }, 1000);
        }
      }).catch(err => {
        console.log(err);

        this.failData.push(row)
      })
    }
  }
  async getDepartByName(name) {
    let queryD = new Parse.Query("Department");
    queryD.equalTo("name", name);
    queryD.equalTo("company", this.pCompany || this.company);
    let res = await queryD.first();
    if (res && res.id) {
      console.log(res);
      return res.id;
    }
  }
  async getDeparts() {
    let queryD = new Parse.Query("Department");
    queryD.equalTo("company", this.company);
    let res = await queryD.find();
    console.log(this.company, res);
    if (res && res.length) {
      return res;
    }
  }
  async getCate(name) {
    let queryD = new Parse.Query("Category");
    queryD.equalTo("name", name);
    queryD.equalTo("type", 'test');
    queryD.equalTo("department", this.department);
    let res = await queryD.first();
    if (res && res.id) {
      console.log(res);
      return res.id;
    } else {
      return null
    }
  }
  async changeSchool(e) {
    this.department = e;
    let index = this.departs.findIndex((item) => item.id == e);
    this.departInfo = this.departs[index];
    this.subCompany = this.departs[index].get("subCompany").id;
    this.getDepartment();
  }
}
