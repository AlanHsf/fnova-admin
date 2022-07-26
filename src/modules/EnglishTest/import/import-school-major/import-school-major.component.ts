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
  selector: 'app-import-school-major',
  templateUrl: './import-school-major.component.html',
  styleUrls: ['./import-school-major.component.scss']
})
export class ImportSchoolMajorComponent implements OnInit {
  public api: GridApi;
  public columnApi: ColumnApi;
  data: any;
  isLoadingTwo;
  columnDefs: any[] = [
    {
      headerName: "专业名称",
      field: "专业名称",
      key: "name",
      // 唯一性
      unique: false,
      type: "String",
      // 是否必填
      require: true
    },
    {
      headerName: "专业代码",
      field: "专业代码",
      key: "majorCode",
      unique: false,
      type: "String",
      require: true
    },
    {
      headerName: "专业类型",
      field: "专业类型",
      key: "type",
      unique: false,
      type: "Number",
      require: false
    },
    {
      headerName: "排序",
      field: "排序",
      key: "sort",
      unique: false,
      type: "Number",
      require: false
    }
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
    console.log(this.department, this.company, '---------');


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
          this.classExcTpl = this.companyInfo.get('config')?.schoolMajorExcTpl
          console.log(this.classExcTpl, this.companyInfo, this.classExcTpl);
          if (!this.classExcTpl) {
            this.classExcTpl = company.get("config")?.schoolMajorExcTpl
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
          console.log(item)
          let field = item[column.field]
          console.log(field)
          if (column.require && (!field || field.trim() == '') && !requireRef) {
            this.isImport = false;
            requireRef = this.modal.confirm({
              nzTitle: 'excel上传错误',
              nzContent: `必填项 ${column.field}  ${dIndex + 1}行为空，请处理后上传`,
              nzCancelText: null,
            });
            resolve(false)
          }
          if (column.key == 'type' && item[column.field] && !requireRef) {
            if (item[column.field].trim() != 1 && item[column.field].trim() != 2) {
              this.isImport = false;
              requireRef = this.modal.confirm({
                nzTitle: 'excel上传错误',
                nzContent: `${column.field}  ${dIndex + 1}行数据参数不正确，请处理后上传`,
                nzCancelText: null,
              });
              resolve(false)
            }
          }
          // 检查Pointer指针类型对应数据是否存在
          if ((column.type == "Pointer" || column.type == "PointerArray") && column.targetClass) {
            console.log(column.type, '--------', column.targetClass, '--------', item, '--------', column.headerName);
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
            let TargetClass = new Parse.Query("SchoolMajor");
            TargetClass.equalTo('department', this.department);
            TargetClass.equalTo(column.key, item[column.field].trim());
            let target = await TargetClass.first()
            console.log(target);
            console.log(this.department, item[column.field].trim(), '----------------------');

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
    let count = 0;
    let process;
    this.isLoadingTwo = true;
    for (let j = 0; j < this.rowData.length; j++) {
      let row = this.rowData[j]
      let category = Parse.Object.extend("SchoolMajor");
      let categoryInfo = new category();
      for (let i = 0; i < this.columnDefs.length; i++) {
        let column = this.columnDefs[i]
        categoryInfo.set("company", {
          __type: "Pointer",
          className: "Company",
          objectId: this.pCompany || this.company
        });
        categoryInfo.set("school", {
          __type: "Pointer",
          className: "Department",
          objectId: this.department,
        });
        categoryInfo.set("departments", 
        [
          {
            __type: "Pointer",
            className: "Department",
            objectId: this.department,
          },
        ]);

        categoryInfo.set("isEnabled", true);
        if (row[column.field] && row[column.field] != '') {
          switch (column.type) {
            case "Number":
              if (column.key == "type") {
                if (Number(row[column.field]) == 1) {
                  categoryInfo.set(
                    column.key,
                    "adultTest"
                  );
                } else if (Number(row[column.field]) == 2) {
                  categoryInfo.set(
                    column.key,
                    "selfTest"
                  );
                }
              }
              if (column.key == "sort") {
                categoryInfo.set(
                  column.key,
                  Number(row[column.field])
                );
              }

              break;
            case "String":
              categoryInfo.set(
                column.key,
                row[column.field].trim()
              );
              break;
            default:
              break;
          }
        }
      }
      count += 1;

      console.log(categoryInfo)

      await categoryInfo.save().then((res) => {
        if (res && res.id) {
          this.count++;
          console.log(res)
        } else {
          this.failData.push(row)
        }

        console.log(this.count ,count, this.rowData.length)
        if (count == this.rowData.length) {

          this.isLoadingTwo = false;

          if (this.count < count) {// 有数据未上传成功
            this.uploadFailModal = true;
            this.rowData = this.failData;
            return
          }


          process = this.modal.success({
            nzTitle: null,
            nzContent: `上传完成 ${this.count}/${this.rowData.length} `
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

  // async saveLine() {
  //   // 全部上传成功
  //   setTimeout((res) => {
  //     this.isImport = false;
  //     this.message.success("上传成功")
  //     this.rowData = []
  //   }, 1000);

  // }

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