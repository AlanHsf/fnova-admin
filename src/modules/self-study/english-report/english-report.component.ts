import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DatePipe } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import 'ag-grid-enterprise';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import JSZip from "jszip";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-english-report',
  templateUrl: './english-report.component.html',
  styleUrls: ['./english-report.component.scss']
})
export class EnglishReportComponent implements OnInit {

  constructor(private message: NzMessageService, private cdRef: ChangeDetectorRef, private http: HttpClient, private modal: NzModalService,) { }
  // 表格上标题
  listOfColumn = [
    {
      title: '标题',
      value: 'title',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '院校',
      value: 'depaName',
      type: 'String',
      compare: null,
      schemaAlia: 'Department'
    },
    {
      title: '教学点',
      value: 'centerName',
      type: 'String',
      compare: null,
      schemaAlia: 'Department'
    },
    {
      title: '批次',
      value: 'batch',
      type: 'String',
      compare: null,
      schemaAlia: 'depa2'
    },
    {
      title: '上报人数',
      value: 'count',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: 'excel文件',
      value: 'excelFile',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: 'zip文件',
      value: 'document',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    // {
    //   title: '是否下载',
    //   value: 'isDownload',
    //   type: 'String',
    //   compare: null,
    //   schemaAlia: 'apply'
    // },
    {
      title: '是否上报',
      value: 'isReport',
      type: 'Boolean',
      compare: null,
      schemaAlia: 'submit'
    },
    {
      title: '操作',
      value: '',
      type: '',
      compare: null,
      priority: false
    }
  ];
  //加载
  isLoading;
  // 编辑弹窗
  isVisibleEditModal;
  searchType: any = {};
  // 筛选
  inputValue: string;
  // 数据总量
  filterLen;
  // 查询数据
  filterData;
  // excel模板下载
  classExcTpl;
  // 导入excel弹窗
  isVisible


  department;
  company;
  centerId;
  centerName;
  async ngOnInit(): Promise<void> {
    this.department = localStorage.getItem("department");
    this.company = localStorage.getItem("company");

    // 总后台登录: company有值,  department=null, centerId=null;
    // 主院校登录: company有值,  department有值, centerId=null;
    // 教学点登录: company=null,  department=null, centerId有值;

    if (this.department) {
      // 教学点
      let depa = new Parse.Query("Department")
      depa.equalTo("objectId", this.department);
      depa.equalTo("type", "training");
      depa.include("company");
      let depaInfo = await depa.first()
      console.log(depaInfo)
      if (depaInfo && depaInfo.id) {
        this.centerId = depaInfo.id
        this.centerName = depaInfo.get("name")
        let company = depaInfo.get("company")
        this.classExcTpl = company.get("config")?.reportExcTpl
        this.department = null
        this.company = null;

        // 获取教学点对应的主考院校
        this.getDepartmentByCenter()
      } else {
        this.listOfColumn[7].title = "是否下载"
        this.listOfColumn[7].value = "isDownload"

        this.listOfColumn[8] = {
          title: '是否办理',
          value: 'isCheck',
          type: 'Boolean',
          compare: null,
          schemaAlia: 'submit'
        }
        this.listOfColumn[9] = {
          title: '办理时间',
          value: 'checkTime',
          type: 'String',
          compare: null,
          schemaAlia: 'submit'
        }
        this.listOfColumn[10] = {
          title: '操作',
          value: '',
          type: '',
          compare: null,
          priority: false
        }

      }
    } else {
      this.department = null
      this.centerId = null;
    }

    this.searchType = this.listOfColumn[0]
    this.getProfiles();
  }

  pageIndex: number = 1;
  pageSize: number = 10;
  async getProfiles(skip?, inputVal?, filter?) {
    console.log(this.company, this.department, this.centerId)

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let compleSql = '';

    let selectSql = `select 
    "submit"."objectId",
    "submit"."title",
    "submit"."count",
    "submit"."batch",
    "submit"."remark",
    "submit"."excelFile",
    "submit"."document",
    "submit"."isDownload",
    "submit"."isReport",
    "submit"."isCheck",
    "submit"."checkTime",
    "depa1"."objectId" as "depaObjectId",
    "depa1"."depaName",
    "depa2"."centerName" `

    let fromSql = ` from 
      (select "objectId","title","remark","count","batch","school","center","excelFile","document","isDownload","isReport","isCheck",to_char("checkTime", 'yyyy-MM-dd') as "checkTime","departments","createdAt" from "PaperSubmit" where "company" = '1ErpDVc1u6' and "type" = 'sign') as "submit"
    left join (select "objectId","name" as "depaName" from "Department") as "depa1" on "depa1"."objectId" = "submit"."school"
    left join (select "objectId","name" as "centerName" from "Department") as "depa2" on "depa2"."objectId" = "submit"."center"
    `
    let whereSql = ``
    if (this.centerId) {
      whereSql += ` where "submit"."departments" @> '[{ "objectId": "${this.centerId}"}]' `
    } else if (this.department && !this.centerId) {
      whereSql += ` where "submit"."departments" @> '[{ "objectId": "${this.department}"}]' and "submit"."isReport" is true `
    } else {
      whereSql += ` where 1 = 1 `
    }

    if (this.searchType.type == 'Boolean') {
      if (this.inputValue == "已上报" || this.inputValue == "已下载" || this.inputValue == "已办理") {
        whereSql += ` and "${this.searchType.schemaAlia}"."${this.searchType.value}" is true `
      } else if (this.inputValue == "未上报" || this.inputValue == "未下载" || this.inputValue == "未办理") {
        whereSql += ` and ("${this.searchType.schemaAlia}"."${this.searchType.value}" is null or "${this.searchType.schemaAlia}"."${this.searchType.value}" is false) `
      }
    } else if (this.inputValue && this.inputValue.trim() != '') {
      whereSql += ` and "${this.searchType.value}" like '%${this.inputValue}%' `
    }
    let orderSql = ` order by "submit"."createdAt" desc `
    let breakSql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`

    compleSql = selectSql + fromSql + whereSql + orderSql + breakSql
    console.log(compleSql);
    this.http.post(baseurl, { sql: compleSql })
      .subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          if (res.data && res.data.length) {
            let countSql = `select count(*) ${fromSql} ${whereSql}`
            console.log(countSql)
            this.filterLen = await this.getCount(countSql);
            this.filterData = res.data;
            this.cdRef.detectChanges();
            this.isLoading = false;
          } else {
            this.filterData = [];
            this.cdRef.detectChanges();
            this.filterLen = 0;
            this.isLoading = false;
          }
        } else {
          this.message.info("网络繁忙，数据获取失败")
        }
      })
    return
  }



  checkColumns: any[] = [
    {
      headerName: "姓名(必填)",
      field: "姓名(必填)",
      key: "name",
      type: "String",
      // 是否必填
      require: true
    },
    {
      headerName: "身份证号(必填)",
      field: "身份证号(必填)",
      key: "idcard",
      type: "String",
      require: true
    },
    {
      headerName: "准考证号(必填)",
      field: "准考证号(必填)",
      key: "education",
      type: "String",
      require: true
    },
    {
      headerName: "层次(必填)",
      field: "层次(必填)",
      key: "education",
      type: "String",
      require: true
    }
  ];
  async zipChange(e, file) {
    console.log(e, file)
    if (!this.object.excelFile && e) {
      this.message.error("请先上传Excel表格进行校验!")
      this.object.document = null;
      return
    }
    if (e.substring(e.lastIndexOf(".") + 1) != "zip" && e.substring(e.lastIndexOf(".") + 1) != "rar") {
      this.message.error("该上传仅支持zip, rar类型文件上传!")
      this.object.document = null;
      return
    }
  }
  async excelChange(e, file) {
    console.log(e, file)
    this.paperIds = [];
    if (!e) {
      // this.message.error("删除了excel文件!")
      this.emptyPaper()
      this.object.count = null;
      this.object.excelFile = null;
      return
    }
    await this.onFileChange(e)
  }
  paperIds = [];
  data: any = [];
  errData: Array<any> = [];
  async onFileChange(evt: any) {
    let that = this
    that.errData = []
    let exclData: any = [];
    var xhr = new XMLHttpRequest();
    xhr.open('GET', evt, true);
    xhr.responseType = 'blob'
    xhr.onload = async function (e) {
      let blob = this.response;
      console.log(e, blob)
      const reader: FileReader = new FileReader();
      console.log(reader);
      reader.readAsBinaryString(blob);
      reader.onload = async (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
        exclData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        console.log(exclData)
        that.data = exclData
        console.log(that.data)
        let count = exclData.length
        let idcardList: any = [];
        let repeatIdcard: any = []

        if (that.data.length) {
          console.log(exclData.length, that.data.length)
          // 校验身份证号是否存在重复
          for (let i = 0; i < exclData.length; i++) {
            let flag = false;
            if (idcardList.length == 0) {
              idcardList.push(exclData[i]["身份证号(必填)"])
            } else {
              for (let j = 0; j < idcardList.length; j++) {
                if (exclData[i]["身份证号(必填)"] == idcardList[j]) {
                  flag = true;
                }
              }
              if (flag) {
                if (repeatIdcard.length == 0) {
                  repeatIdcard.push({
                    name: exclData[i]["姓名(必填)"],
                    idcard: exclData[i]["身份证号(必填)"]
                  })
                } else {
                  repeatIdcard.push({
                    name: exclData[i]["姓名(必填)"],
                    idcard: exclData[i]["身份证号(必填)"]
                  })
                }
              } else {
                idcardList.push(exclData[i]["身份证号(必填)"])
              }
            }
          }
          console.log(idcardList)
          console.log(repeatIdcard)

          if (repeatIdcard.length > 0) {
            for (let i = 0; i < repeatIdcard.length; i++) {
              let msg = {
                num: ``,
                name: repeatIdcard[i].name,
                idcard: repeatIdcard[i].idcard,
                res: `身份证号存在重复, 请核查后上传! `
              }
              that.errData.push(msg)
            }

            // 清除excel文件路径
            that.object.excelFile = null;

            that.isVisible = true
            that.cdRef.detectChanges()
          } else {
            // 处理导入的数据 错误检查
            let flag = await that.getOnjectIdMap(that.checkColumns, that.data);
            console.log(flag, that.errData, that.errData[0], that.errData.length)
            if (!flag) {
              // 清除excel文件路径
              that.object.excelFile = null;

              that.isVisible = true
              that.cdRef.detectChanges()
            } else {
              let paperIds = []
              let inSql = '';
              for (let i = 0; i < idcardList.length; i++) {
                if (i == idcardList.length - 1) {
                  inSql += `'${idcardList[i]}'`
                } else {
                  inSql += `'${idcardList[i]}',`
                }
              }
              let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
              let paperSql = `select "pro"."objectId" as "proObjectId", "apply"."objectId" as "applyObjectId" from 
              (select "objectId" from "Profile" where "company" = '1ErpDVc1u6' and "department" = '${that.depaId}' and "center" = '${that.centerId}' and "education" = '本科' and "idcard" in (${inSql})) as "pro" 
              join (select "objectId","profile" from "GradeInfo" where "company" = '1ErpDVc1u6') as apply on "apply"."profile" = "pro"."objectId"`
              that.http.post(baseurl, { sql: paperSql }).subscribe(async (res: any) => {
                console.log(res);
                if (res.code == 200) {
                  if (res.data && res.data.length) {
                    for (let i = 0; i < res.data.length; i++) {
                      paperIds.push(res.data[i].applyObjectId)
                    }
                    console.log(paperIds)
                    that.paperIds = paperIds
                  }
                } else {
                  that.message.error("网络繁忙，数据获取失败")
                }
              })

              that.message.info("校验成功! ")
              that.object.count = count
            }
          }
        } else {
          that.message.error("无可导入数据")
        }
      }
    }
    await xhr.send()
  }

  // 对数据的处理，以及错误查询   必填项/Pointer
  async getOnjectIdMap(columns, datas) {
    return new Promise(async (resolve, reject) => {
      let errorNum = 0;
      const ref = this.modal.confirm({
        nzTitle: '数据处理',
        nzContent: '正在校验数据, 请稍后',
        nzClosable: false,
        nzMaskClosable: false,
        nzCancelText: null,
        nzOkText: null,
      });
      console.log(columns, datas)
      // 检查必填项是否存在
      for (let index = 0; index < datas.length; index++) {
        let item = datas[index];
        for (let dIndex = 0; dIndex < columns.length; dIndex++) {
          let column = columns[dIndex];
          /* 必填项无值 */
          let field = item[column.field]
          console.log(field)
          if (column.require && (!field || field.trim() == '')) {
            let msg = {
              num: "第" + index + 1 + "行",
              name: item["姓名(必填)"],
              idcard: item["身份证号(必填)"],
              res: `该${column.field}不能为空!`
            }
            this.errData.push(msg)
            errorNum++
          }
          if (column.key == 'idcard' && item[column.field]) {
            let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";

            // 校验该同学是否已经上报
            let sql = `select * from 
            (select "objectId","SchoolMajor" from "Profile" 
            where "name" = '${item["姓名(必填)"].trim()}' and "idcard" = '${item["身份证号(必填)"].trim()}' and "company" = '1ErpDVc1u6' and "department" = '${this.depaId}' and "center" = '${this.centerId}' and "isDeleted" is not true ) as "pro" 
            left join (select "profile","isReport" from "GradeInfo" where "company" = '1ErpDVc1u6') as "apply" on "apply"."profile" = "pro"."objectId" 
            left join (select "objectId" as "subObjectId","title" as "subTitle","isReport" as "subReport" from "PaperSubmit" where "company" = '1ErpDVc1u6' and "type" = 'sign' and "school" = '${this.depaId}' and "center" = '${this.centerId}') as "sub" on "sub"."subObjectId" = "apply"."isReport"`
            console.log(sql)
            this.http.post(baseurl, { sql: sql }).subscribe(async (res: any) => {
              console.log(res);
              if (res.code == 200) {
                if (res.data && res.data.length) {
                  if (res.data[0].isReport && res.data[0].subTitle) {
                    let msg = {
                      num: `第 ${index + 1} 行`,
                      name: item["姓名(必填)"],
                      idcard: item["身份证号(必填)"],
                      res: `该学生报名数据已存在标题为 [${res.data[0].subTitle}] 的上报计划中!`
                    }
                    this.errData.push(msg)
                    errorNum++
                  } else if (!res.data[0].profile) {
                    let msg = {
                      num: `第 ${index + 1} 行`,
                      name: item["姓名(必填)"],
                      idcard: item["身份证号(必填)"],
                      res: '该学生报名信息不存在!'
                    }
                    this.errData.push(msg)
                    errorNum++
                  }
                } else {
                  let msg = {
                    num: `第 ${index + 1} 行`,
                    name: item["姓名(必填)"],
                    idcard: item["身份证号(必填)"],
                    res: '该学生信息不存在!'
                  }
                  this.errData.push(msg)
                  errorNum++
                }
              } else {
                this.message.error("网络繁忙，数据获取失败")
              }
            })
          }
        }
      }
      setTimeout(res => {
        console.log(errorNum, this.errData, this.errData[0])
        ref.close()
        if (errorNum == 0) {
          resolve(true)
        } else {
          resolve(false)
        }
      }, 6000)
    });
  }

  async emptyPaper() {
    let paper = new Parse.Query("GradeInfo");
    paper.equalTo("company", "1ErpDVc1u6");
    paper.equalTo("isReport", this.object.objectId)
    let count = await paper.count()
    paper.limit(count)
    let paperList = await paper.find();
    console.log(paperList);
    if (paperList && paperList.length) {
      for (let i = 0; i < paperList.length; i++) {
        paperList[i].unset("isReport");
        let result = await paperList[i].save().catch(err => console.log(err))
        console.log(result)
      }
    }
  }

  handleCancel() {
    this.isVisible = false;
  }

  depaList: any[];
  async getDepartmentByCenter() {
    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let compleSql = '';
    let selectSql = `select  "objectId", "name" `
    let fromSql = ` from "Department" where "company" = '1ErpDVc1u6' 
       and "objectId" in (select distinct "department" from "Profile" where "company" = '1ErpDVc1u6' and "departments" @> '[{ "objectId": "${this.centerId}"}]' and "isDeleted" is not true ) `
    compleSql = selectSql + fromSql
    console.log(compleSql);
    this.http.post(baseurl, { sql: compleSql }).subscribe(async (res: any) => {
      console.log(res);
      if (res.code == 200) {
        if (res.data && res.data.length) {
          this.depaList = res.data;
          console.log(this.depaList)
        }
      } else {
        this.message.info("网络繁忙，数据获取失败")
      }
    })
  }

  // 上报
  async report(value) {
    if (!value) {
      this.message.error("上报计划id不能为空!")
      return
    }
    let paper = new Parse.Query("PaperSubmit")
    let paperInfo = await paper.get(value);
    console.log(paperInfo)
    if (paperInfo && paperInfo.id) {
      if (!paperInfo.get("excelFile")) {
        this.message.error("excel文件未上传, 上报失败!")
        return
      }
      if (!paperInfo.get("document")) {
        this.message.error("论文数据包未上传, 上报失败!")
        return
      }

      paperInfo.set("isReport", true);
      paperInfo.set("type", 'sign');
      let result = await paperInfo.save().catch(err => console.log(err))
      if (result && result.id) {
        console.log(result)
        this.message.info("上报成功! ")
      } else {
        this.message.info("上报失败! ")
      }
    }
    await this.getProfiles()
  }

  // 办理
  async handle(value) {
    if (!value) {
      this.message.error("上报计划id不能为空!")
      return
    }

    let paper = new Parse.Query("PaperSubmit")
    let paperInfo = await paper.get(value);
    console.log(paperInfo)
    if (paperInfo && paperInfo.id) {
      paperInfo.set("checkTime", new Date());
      paperInfo.set("isCheck", true);
      let result = await paperInfo.save().catch(err => console.log(err))
      if (result && result.id) {
        console.log(result)
        this.message.info("办理成功! ")
      } else {
        this.message.info("办理失败! ")
      }
    }
    await this.getProfiles()
  }


  // 添加,修改标题
  addOfColumn = [
    {
      title: '标题',
      value: 'title',
      type: 'String'
    },
    {
      title: '院校',
      value: 'depaName',
      type: 'List'
    },
    {
      title: '教学点',
      value: 'centerName',
      type: 'String'
    },
    {
      title: '批次',
      value: 'batch',
      type: 'String'
    },
    {
      title: '上报人数',
      value: 'count',
      type: 'String'
    }
  ];
  object;
  // 添加, 修改的弹窗
  operatModal;
  depaId;

  excelFile;
  zipFile;

  // 编辑, 保存
  async operate(type, data?) {
    if (type == 'add') {
      this.object = {}
      this.depaId = null;
      this.object.centerName = this.centerName
      this.operatModal = true;
    }
    if (type == 'edit') {
      this.object = Object.assign({}, data);
      console.log(this.object);
      this.depaId = this.object.depaObjectId
      this.operatModal = true;
    }
    if (type == 'save') {
      console.log(this.depaId)
      if (!this.depaId) {
        this.message.error("请选择上报院校! ")
        return
      }
      if (!this.object.title) {
        this.message.error("请填写上报标题! ")
        return
      }
      if (!this.object.batch) {
        this.message.error("请填写上报批次! ")
        return
      }
      console.log(this.addOfColumn)
      console.log(this.object)
      let result;

      // 创建新数据
      if (!this.object.objectId) {
        let paper = Parse.Object.extend("PaperSubmit");
        let paperInfo = new paper();
        this.listOfColumn.forEach((column) => {
          if (column.type && column.type != "") {
            if (column.value != "depaName" && column.value != "centerName") {
              paperInfo.set(column.value, this.object[column.value]);
            }
          }
        });
        paperInfo.set("type", "sign");
        paperInfo.set("company", {
          __type: "Pointer",
          className: "Company",
          objectId: "1ErpDVc1u6"
        });
        paperInfo.set("school", {
          __type: "Pointer",
          className: "Department",
          objectId: this.depaId,
        });
        paperInfo.set("center", {
          __type: "Pointer",
          className: "Department",
          objectId: this.centerId,
        });
        paperInfo.set("departments", [
          {
            __type: "Pointer",
            className: "Department",
            objectId: this.depaId,
          },
          {
            __type: "Pointer",
            className: "Department",
            objectId: this.centerId,
          }
        ]);
        result = await paperInfo.save().catch((err) => console.log(err));
      } else if (this.object.objectId) {
        // 修改
        let paper = new Parse.Query("PaperSubmit")
        let paperInfo = await paper.get(this.object.objectId)

        this.listOfColumn.forEach((column) => {
          if (column.type && column.type != "") {
            if (column.value != "depaName" && column.value != "centerName") {
              paperInfo.set(column.value, this.object[column.value] ? this.object[column.value] : null);
            }
          }
        });
        result = await paperInfo.save().catch((err) => console.log(err));
      } else {
        this.message.error("操作错误! ")
        return
      }
      if (result && result.id) {
        console.log(result);

        if (this.paperIds.length) {
          let paper = new Parse.Query("GradeInfo");
          paper.equalTo("company", "1ErpDVc1u6");
          paper.containedIn("objectId", this.paperIds);
          let count = await paper.count();
          paper.limit(count);
          let paperInfo = await paper.find()
          console.log(paperInfo)
          if (paperInfo && paperInfo.length) {
            for (let j = 0; j < paperInfo.length; j++) {
              paperInfo[j].set("isReport", result.id)
              let res = await paperInfo[j].save().catch(err => console.log(err))
              console.log(res)
            }
          }
        }

        this.message.success("保存成功! ");
        this.depaId = [];
        this.operatModal = false;
        this.getProfiles();
        this.cdRef.detectChanges();
      } else {
        this.message.error("保存失败! ");
      }
      // this.message.success("保存成功! ");
      // this.operatModal = false;
    }

    if (type == 'fileDownload') {
      const object = Object.assign({}, data);
      console.log(object);
      this.files = []
      if (object.excelFile) {
        let fileInfo: any = {};
        fileInfo.name = object.centerName + object.title + object.batch + "Excel文件" + object.excelFile.substring(object.excelFile.lastIndexOf("."))
        fileInfo.url = object.excelFile
        this.files.push(fileInfo)
      }
      if (object.document) {
        let fileInfo: any = {};
        fileInfo.name = object.centerName + object.title + object.batch + "论文数据包" + object.document.substring(object.document.lastIndexOf("."))
        fileInfo.url = object.document
        this.files.push(fileInfo)
      }

      if (this.files.length) {
        await this.downloadFile(object.centerName + object.title + object.batch);
        // this.batchDownload(object.name + object.idcard)

        if(this.department){
          let paper = new Parse.Query("PaperSubmit");
          let paperInfo = await paper.get(object.objectId)
          console.log(paperInfo)
          if (paperInfo && paperInfo.id) {
            paperInfo.set("isDownload", true)
            let applyData = await paperInfo.save();
            console.log(applyData)
  
            this.getProfiles()
          }
        }
        
      } else {
        this.message.error("没有需要下载的文件!")
        return
      }
    }
  }

  files: any = []
  // 打包下载
  downloadFile(filename) {
    const id = this.message.loading('文件数据较大, 稍等片刻(请勿刷新页面)!', { nzDuration: 0 }).messageId;
    console.log(this.files)
    let zip = new JSZip();
    let folder = zip.folder('files');
    Promise.resolve().then(() => {
      return this.files.reduce((accumulator, item) => {
        return accumulator.then(() => fetch(item.url)
          .then(resp => resp.blob())
          .then(blob => folder.file(item.name, blob)))
      }, Promise.resolve())
    }).then(() => {
      folder.generateAsync({ type: "blob", compression: 'DEFLATE', compressionOptions: { level: 9 } }).then(content => {
        FileSaver(content, filename + ".zip");
        this.message.remove(id);
        this.message.info("下载成功!")
      })
    })
  }



  // 选择条件名称
  searchTypeChange(e) {
    let index = this.listOfColumn.findIndex(item => item.value == e);
    console.log(e);
    if (index != -1) {
      this.searchType = this.listOfColumn[index];
      console.log(this.searchType)
    }
  }

  // 条件查询
  async searchStudent() {
    this.isLoading = true
    if (!this.inputValue) {
      // (this.filterLen as any) = await this.getCount();
      this.getProfiles()
      return;
    }
    this.inputValue = this.inputValue.trim();
    await this.getProfiles(null, this.inputValue)
    this.cdRef.detectChanges();
  }

  // 分页选择
  pageChange(e) {
    this.isLoading = true
    this.getProfiles()
  }

  async getCount(sql): Promise<number> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
      this.http
        .post(baseurl, { sql: sql })
        .subscribe(async (res: any) => {
          console.log(res);
          let count: number = 0;
          if (res.code == 200) {
            count = +res.data[0].count
            resolve(count)
          } else {
            this.message.info("网络繁忙，数据获取失败")
            resolve(count)
          }
        })
    })
  }
}

