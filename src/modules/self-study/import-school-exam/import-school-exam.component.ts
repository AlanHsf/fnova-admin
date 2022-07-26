import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { NzModalService } from 'ng-zorro-antd/modal';
import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-import-school-exam',
  templateUrl: './import-school-exam.component.html',
  styleUrls: ['./import-school-exam.component.scss']
})
export class ImportSchoolExamComponent implements OnInit {

  public api: GridApi;
  public columnApi: ColumnApi;
  data: any;
  isLoadingTwo;
  columnDefs: any[] = [
    {
      headerName: "姓名(必填)",
      field: "姓名(必填)",
      key: "name",
      // 唯一性
      unique: false,
      type: "String",
      // 是否必填
      require: true
    },
    {
      headerName: "身份证号(必填)",
      field: "身份证号(必填)",
      key: "idcard",
      unique: false,
      type: "String",
      require: true
    },
    {
      headerName: "准考证号(必填)",
      field: "准考证号(必填)",
      key: "studentId",
      unique: false,
      type: "String",
      require: true
    },
    {
      headerName: "层次(必填)",
      field: "层次(必填)",
      key: "education",
      unique: false,
      type: "String",
      require: true
    },
    {
      headerName: "专业类别(必填)",
      field: "专业类别(必填)",
      key: "education",
      unique: false,
      type: "String",
      require: true
    },
    {
      headerName: "专业名称(必填)",
      field: "专业名称(必填)",
      key: "name",
      unique: false,
      type: "Pointer",
      require: true,
      targetClass: "SchoolMajor"
    },
    {
      headerName: "课程名称(必填)",
      field: "课程名称(必填)",
      key: "title",
      unique: false,
      type: "Pointer",
      require: true,
      targetClass: "Lesson"
    },
    {
      headerName: "报考时间(必填)",
      field: "报考时间(必填)",
      key: "signDate",
      unique: false,
      type: "String",
      require: true
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
    private modal: NzModalService,
    private message: NzMessageService,
    private http: HttpClient
  ) { }
  depaId: any;
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

    // 自考系统,登录进来department没有值
    // 院校. department存在值
    // 教学点, 

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
        let centerInfo = await this.getJXDDepartment()
        if (centerInfo) {
          let company = centerInfo.get("company")
          this.pCompany = centerInfo.get("company").id;
          this.companyInfo = centerInfo.get("subCompany")
          this.classExcTpl = this.companyInfo.get('config')?.schoolExamExcTpl
          console.log(this.classExcTpl, this.companyInfo);
          if (!this.classExcTpl) {
            this.classExcTpl = company.get("config")?.schoolExamExcTpl
          }
          this.departs = await this.getDeparts();
        } else {
          let departInfo = await this.getDepartment();
          if (departInfo) {
            let company = departInfo.get("company")
            this.pCompany = departInfo.get("company").id;
            this.companyInfo = departInfo.get("subCompany")
            this.classExcTpl = this.companyInfo.get('config')?.schoolExamExcTpl
            console.log(this.classExcTpl, this.companyInfo);
            if (!this.classExcTpl) {
              this.classExcTpl = company.get("config")?.schoolExamExcTpl
            }
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
  centerInfo;
  centerId;
  async getJXDDepartment() {
    let queryD = new Parse.Query("Department");
    queryD.include("company");
    queryD.include("subCompany");
    queryD.equalTo("company", "1ErpDVc1u6")
    queryD.equalTo("type", "training")
    queryD.equalTo("objectId", this.department);
    let res = await queryD.first();
    if (res && res.id) {
      console.log(res);
      this.centerInfo = res;
      this.centerId = res.id
      return res;
    }
  }

  /* **** excel上传 **** */
  handleDropOver(e, over?) {
    e.preventDefault();
    e.stopPropagation();
  }
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.onFileChange(e);
  }

  async onFileChange(evt: any) {
    console.log(this.pCompany, this.department, this.centerId, this.depaId)
    if (this.centerId && !this.depaId) {
      this.message.error("请先选择院校! ")
      return
    }
    if (!this.pCompany && !this.depaId) {
      this.message.error("请先选择院校! ")
      return
    }
    let exclData: any = [];
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(target, target.files.length);
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    console.log(reader);
    reader.readAsBinaryString(target.files[0]);
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      exclData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      console.log(exclData)

      let keyAry = [];
      // 遍历json对象，获取每一列的键名 表头
      for (let key in exclData[1]) {
        keyAry.push(key);
      }

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
      console.log(columns, datas)
      // 检查必填项是否存在
      for (let index = 0; index < datas.length; index++) {
        let item = datas[index];
        this.pointMap[index] = {}
        for (let dIndex = 0; dIndex < columns.length; dIndex++) {
          let column = columns[dIndex];
          /* 必填项无值 */
          let field = item[column.field]
          console.log(field)
          if (column.require && (!field || field.trim() == '')) {
            this.isImport = false;
            requireRef = this.modal.confirm({
              nzTitle: 'excel上传错误',
              nzContent: `必填项 ${column.field} 为空，请处理后上传`,
              nzCancelText: null,
            });
            resolve(false)
          }

          if (column.key == 'idcard' && item[column.field]) {
            let profile = new Parse.Query("Profile")
            profile.equalTo("idcard", item[column.field].trim())
            profile.equalTo("name", item["姓名(必填)"].trim())
            profile.equalTo("education", item["层次(必填)"].trim())
            profile.equalTo("studentID", item["准考证号(必填)"].trim())
            profile.equalTo("identyType", item["专业类别(必填)"]);
            profile.equalTo("company", "1ErpDVc1u6");
            if (this.depaId) {
              profile.containedIn('departments', [{
                __type: "Pointer",
                className: 'Department',
                objectId: this.depaId
              }])
            } else if (this.department) {
              profile.containedIn('departments', [{
                __type: "Pointer",
                className: 'Department',
                objectId: this.department
              }])
            }
            profile.equalTo("isCross", true);
            profile.notEqualTo("isDeleted", true);
            let profileInfo = await profile.first();
            console.log(profileInfo)
            if (!profileInfo) {
              console.log(profileInfo)
              this.isImport = false;
              requireRef = this.modal.confirm({
                nzTitle: 'excel上传错误',
                nzContent: `${column.field}: ${item["身份证号(必填)"].trim()} ，未查询到该学生信息，请处理后上传`,
                nzCancelText: null,
              });
              resolve(false)
            }else{
              let schoolExam = new Parse.Query("ProfileSchoolExam")
              schoolExam.equalTo("profile",profileInfo.id)
              schoolExam.equalTo("signDate",item["报考时间(必填)"])
              schoolExam.include("lesson")
              let schoolExamInfo = await schoolExam.first();
              if(schoolExamInfo && schoolExamInfo.id){
                if(item["课程名称(必填)"] == schoolExamInfo.get("lesson").get("title")){
                  this.isImport = false;
                  requireRef = this.modal.confirm({
                    nzTitle: 'excel上传错误',
                    nzContent: `${column.field}: ${item["身份证号(必填)"].trim()} ，该学生已报名校考，请处理后上传`,
                    nzCancelText: null,
                  });
                  resolve(false)
                }
              }
            }
          }

          // 检查Pointer指针类型对应数据是否存在
          if ((column.type == "Pointer" || column.type == "PointerArray") && column.targetClass) {
            console.log(column.type, '--------', column.targetClass, '--------', item, '--------', column.headerName);
            if (item[column.headerName] && item[column.headerName].trim() != '') {
              let TargetClass = new Parse.Query(column.targetClass.trim());
              TargetClass.equalTo(column.key, item[column.field].trim());
              TargetClass.equalTo("company", "1ErpDVc1u6");

              if (column.targetClass == "SchoolMajor") {
                console.log(column.targetClass, column.key, item[column.field].trim(), item["层次(必填)"])
                TargetClass.equalTo("type", item["层次(必填)"]);
                TargetClass.equalTo("types", item["专业类别(必填)"]);
                if (this.depaId) {
                  TargetClass.equalTo("school", this.depaId)
                } else {
                  TargetClass.equalTo("school", this.department)
                }
              }
              if (column.targetClass == "Lesson") {
                console.log(this.pointMap)
                if (this.depaId) {
                  TargetClass.equalTo("school", this.depaId)
                } else {
                  TargetClass.equalTo("school", this.department)
                }
                // TargetClass.equalTo("types", item["课程类型(必填)"]);
                // TargetClass.equalTo("isDeleted", true);
              }
              if (column.headerName == "教学点(必填)") {
                TargetClass.equalTo("type", "training");
              }

              let target = await TargetClass.first()
              if (target && target.id) {
                this.pointMap[index][column.targetClass] = target.id
              } else {
                this.isImport = false;
                // alert(
                //   item["姓名(必填)"] +
                //   "的" +
                //   column.headerName +
                //   "错误, " +
                //   item[column.headerName] +
                //   "未创建或错误,请修改正确后重新上传"
                // );

                requireRef = this.modal.confirm({
                  nzTitle: 'excel上传错误',
                  nzContent: `${item["姓名(必填)"]}的${column.headerName}错误, ${item[column.headerName]}未创建或错误, 请修改正确后重新上传`,
                  nzCancelText: null,
                });
                resolve(false)
              }
            }
          }

          console.log(index, columns.length, dIndex, datas.length)
          if (dIndex + 1 == columns.length && index + 1 == datas.length) {
            console.log('end');
            // setTimeout(() => {
            this.isImport = true;
            ref.close()
            resolve(true)
            // }, 1000);
          }
        }
      }
      ref.close()
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
      console.log(row)

      let profile = new Parse.Query("Profile")
      profile.equalTo("idcard", row["身份证号(必填)"].trim())
      profile.equalTo("name", row["姓名(必填)"].trim())
      profile.equalTo("education", row["层次(必填)"].trim())
      profile.equalTo("studentID", row["准考证号(必填)"].trim())
      profile.equalTo("identyType", row["专业类别(必填)"].trim())
      profile.equalTo("company", "1ErpDVc1u6");
      if (this.depaId) {
        profile.containedIn('departments', [{
          __type: "Pointer",
          className: 'Department',
          objectId: this.department
        }])
      } else if (this.department) {
        profile.containedIn('departments', [{
          __type: "Pointer",
          className: 'Department',
          objectId: this.department
        }])
      }
      profile.equalTo("isCross", true);
      profile.notEqualTo("isDeleted", true);
      let profileInfo = await profile.first();
      if (!profileInfo) {
        this.message.error(`${row["姓名(必填)"].trim()}${row["身份证号(必填)"]}, 该学生信息不存在, 保存失败!`)
        return
      }

      let major = new Parse.Query("SchoolMajor")
      if (this.depaId) {
        major.equalTo("school", this.depaId)
      } else if (this.department) {
        major.equalTo("school", this.department)
      }
      major.equalTo("name", row["专业名称(必填)"].trim())
      major.equalTo("type", row["层次(必填)"].trim())
      major.equalTo("company", "1ErpDVc1u6");
      let majorInfo = await major.first();
      if (!majorInfo) {
        this.message.error(`第${j + 1}行专业信息不存在, 保存失败!`)
        this.isLoadingTwo = false;
        return
      }

      let lesson = new Parse.Query("Lesson")
      if (this.depaId) {
        lesson.equalTo("school", this.depaId)
      } else if (this.department) {
        lesson.equalTo("school", this.department)
      }
      lesson.equalTo("title", row["课程名称(必填)"].trim())
      lesson.equalTo("company", "1ErpDVc1u6");
      let lessonInfo = await lesson.first();
      if (!lessonInfo) {
        this.message.error(`第${j + 1}行课程信息不存在, 保存失败!`)
        this.isLoadingTwo = false;
        return
      }

      let schoolexam = Parse.Object.extend("ProfileSchoolExam");
      let schoolExam = new schoolexam();
      schoolExam.set("signDate",row["报考时间(必填)"]);
      schoolExam.set("departments",profileInfo.get("departments"));
      schoolExam.set("profile", {
        __type: "Pointer",
        className: "Profile",
        objectId: profileInfo.id
      });
      schoolExam.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: "1ErpDVc1u6"
      });
      if (this.depaId) {
        schoolExam.set("school", {
          __type: "Pointer",
          className: "Department",
          objectId: this.depaId
        });
      } else if (this.department) {
        schoolExam.set("school", {
          __type: "Pointer",
          className: "Department",
          objectId: this.department
        });
      }
      schoolExam.set("center", {
        __type: "Pointer",
        className: "Department",
        objectId: profileInfo.get("center").id
      });
      schoolExam.set("major", {
        __type: "Pointer",
        className: "SchoolMajor",
        objectId: profileInfo.get("SchoolMajor").id
      });
      schoolExam.set("lesson", {
        __type: "Pointer",
        className: "Lesson",
        objectId: lessonInfo.id
      });
      if(!this.centerId){
        schoolExam.set("isSubmit",true);
      }

      count += 1;

      console.log(schoolExam)
      await schoolExam.save().then((res) => {
        if (res && res.id) {
          this.count++;
          console.log(res)
        } else {
          this.failData.push(row)
        }

        console.log(this.count, count, this.rowData.length)
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
    queryD.equalTo("company", "1ErpDVc1u6");
    queryD.notEqualTo("type", "training")
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
  async changeSchool(ev) {
    console.log(this.department)
    this.department = ev;
    console.log(this.department)
    let index = this.departs.findIndex((item) => item.id == ev);
    this.departInfo = this.departs[index];
    this.subCompany = this.departs[index].get("subCompany").id;
    this.getDepartment();
  }
}
