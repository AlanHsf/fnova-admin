import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { ImportExclService } from "../import-excl.service";
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";
@Component({
  selector: 'app-import-category',
  templateUrl: './import-category.component.html',
  styleUrls: ['./import-category.component.scss']
})
export class ImportCategoryComponent implements OnInit {
  public api: GridApi;
  public columnApi: ColumnApi;
  data: any;
  columnDefs: any[] = [
    {
      headerName: '站点名称',
      field: "站点名称",
      key: 'name',
      unique: true,
      type: "String",
      require: true
    },
    {
      headerName: "站点代码",
      field: "站点代码",
      key: "name_en",
      unique: true,
      type: "String",
      require: true
    },
    {
      headerName: "分类类型",
      field: "分类类型",
      key: "type",
      unique: false,
      type: "String",
      require: true
    },
    {
      headerName: "排序",
      field: "排序",
      key: "index",
      type: "Number",
      unique: true,
      require: true
    },
  ];
  rowData: any;
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
        console.log(departInfo,'---------');
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
    console.log(this.pCompany,'pCompany',this.company,'company',this.department,'department')

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
          // type:站点类型：     如果是test就考点  不是就为站点 
          // type  name 站点类型和站点名称相同时，
          // 根据唯一值字段判断是否可以上传
          if (column.unique && !repeatRef) {
            console.log(column.unique,'unique');
            let Category = new Parse.Query("Category");
            Category.equalTo('department', this.department);
            console.log(column,'-----',item);
            Category.equalTo(column.key, item[column.field].trim());
            console.log(column.key, item[column.field],item["分类类型"]);
            Category.equalTo("type", item["分类类型"].trim());
            let target = await Category.first()
            console.log(target,'--------')
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

// 保存到数据库
count: any = 0;
async saveLine() {
  let process;
  let count = 0;
  for (let j = 0; j < this.rowData.length; j++) {
    let row = this.rowData[j];
    let Class = Parse.Object.extend("Category");
    let sclass = new Class();
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
      sclass.set("showType", "school_area");
      if (row[column.field] && row[column.field] != '') {
        switch (column.type) {
          case "Number":
            sclass.set(
              column.key,
              Number(row[column.field])
            );
            break;
          case "String":
            sclass.set(
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

    await sclass.save().then((res) => {
      if (res && res.id) {
        this.count += 1;
        process = this.modal.create({
          nzTitle: null,
          nzContent: `${this.count}/${this.rowData.length} 上传中`,
          nzClosable: false,
          nzMaskClosable: false,
          nzCancelText: null,
          nzOkText: null,
        });
      } else {
        this.failData.push(row)
      }
      if (count == this.rowData.length) {
        process.close()
        if (this.count < count) {// 有数据未上传成功
          this.uploadFailModal = true;
          this.rowData = this.failData;
          return
        }
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