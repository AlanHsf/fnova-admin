import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DatePipe } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import 'ag-grid-enterprise';
import JSZip from "jszip";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-degree-register',
  templateUrl: './degree-register.component.html',
  styleUrls: ['./degree-register.component.scss']
})
export class DegreeRegisterComponent implements OnInit {

  constructor(private message: NzMessageService, private cdRef: ChangeDetectorRef, private http: HttpClient, private modal: NzModalService,) { }
  // 表格上标题
  listOfColumn = [
    {
      title: '姓名',
      value: 'name',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '身份证号',
      value: 'idcard',
      type: 'String',
      compare: null,
      schemaAlia: 'Department'
    },
    {
      title: '准考证号',
      value: 'studentID',
      type: 'String',
      compare: null,
      schemaAlia: 'Department'
    },
    {
      title: '所属教学点',
      value: 'centerName',
      type: 'String',
      compare: null,
      schemaAlia: 'Department'
    },
    {
      title: '报读院校',
      value: 'school',
      type: 'String',
      compare: null
    },
    {
      title: '所属专业',
      value: 'majorName',
      type: 'String',
      compare: null,
      schemaAlia: 'depa2'
    },
    {
      title: '专业层次',
      value: 'education',
      type: 'String',
      compare: null,
      schemaAlia: 'depa2'
    },
    {
      title: '批次',
      value: 'batch',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '专业类别',
      value: 'identyType',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '报考语种',
      value: 'langCode',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '报名时间',
      value: 'signDate',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '是否培训',
      value: 'isTrain',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '上报',
      value: 'reportName',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
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
        this.department = null
        this.company = null;

        // 获取教学点对应的主考院校
        // this.getDepartmentByCenter()
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
    "grade"."objectId",
    "pro"."name",
    "pro"."idcard",
    "pro"."studentID",
    "center"."centerName",
    "pro"."school",
    "major"."majorName",
    "pro"."education",
    "pro"."batch",
    "pro"."identyType",
    "paper"."title",
    "grade"."signDate",
    "grade"."isTrain",
    "grade"."langCode"  `

    let fromSql = ` from 
      (select "objectId","profile","departments","school","center","major","signDate","isTrain","langCode","isReport","createdAt" 
          from "GradeInfo" where "company" = '1ErpDVc1u6' and "englishScore" is null and "majorScore" is null and "basicsScore" is null) as "grade"
    join "Profile" as "pro" on "pro"."objectId" = "grade"."profile"
    left join (select "objectId","name" as "depaName" from "Department") as "depa" on "depa"."objectId" = "grade"."school"
    left join (select "objectId","name" as "centerName" from "Department") as "center" on "center"."objectId" = "grade"."center"
    left join (select "objectId","name" as "majorName" from "SchoolMajor") as "major" on "major"."objectId" = "grade"."major"
    left join (select "objectId","title" from "PaperSubmit" where "type" = 'sign') as "paper" on "paper"."objectId" = "grade"."isReport"
    `

    let whereSql = ``
    if (this.centerId) {
      whereSql += ` where "grade"."departments" @> '[{ "objectId": "${this.centerId}"}]' `
    } else if (this.department && !this.centerId) {
      whereSql += ` where "grade"."departments" @> '[{ "objectId": "${this.department}"}]' `
    } else {
      whereSql += ` where 1 = 1 `
    }

    if (this.inputValue) {
      whereSql += ` and "${this.searchType.value}" like '%${this.inputValue}%' `
    }
    let orderSql = ` order by "grade"."createdAt" desc `
    let breakSql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`

    compleSql = selectSql + fromSql + whereSql + orderSql + breakSql
    console.log(compleSql);
    this.http
      .post(baseurl, { sql: compleSql })
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
      // 唯一性
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
      headerName: "专业名称(必填)",
      field: "专业名称(必填)",
      key: "studentID",
      type: "String",
      require: true
    },
    {
      headerName: "专业代码(必填)",
      field: "专业代码(必填)",
      key: "education",
      type: "String",
      require: true
    },
    {
      headerName: "课程名称(必填)",
      field: "课程名称(必填)",
      key: "education",
      type: "String",
      require: true
    },
    {
      headerName: "课程代码(必填)",
      field: "课程代码(必填)",
      key: "education",
      type: "String",
      require: true
    },
  ];
  async zipChange(e, file) {
    console.log(e, file)
    if (!this.object.excelFile && e) {
      this.message.error("请先上传Excel表格进行校验!")
      this.object.document = null;
      return
    }
    if (e && e.substring(e.lastIndexOf(".") + 1) != "zip" && e.substring(e.lastIndexOf(".") + 1) != "rar") {
      this.message.error("该上传仅支持zip, rar类型文件上传!")
      this.object.document = null;
      return
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


  object;
  // 添加, 修改的弹窗
  operatModal;
  profileId;
  // 编辑, 保存
  async operate(type, data?) {
    if (type == 'add') {
      this.object = {}
      this.object.centerName = this.centerName
      this.operatModal = true;
    }
    if (type == 'edit') {
      this.object = Object.assign({}, data);
      console.log(this.object);
      this.operatModal = true;
    }
    if (type == 'save') {
      console.log(this.profileId)

      let pro = new Parse.Query("Profile")
      pro.equalTo("objectId", this.profileId)
      pro.equalTo("isCross", true)
      pro.notEqualTo("isDeleted", true)
      let profile = await pro.first()
      if (!profile || !profile.id) {
        this.message.error("该用户信息不存在! ")
      }

      // 创建新数据
      let grade = Parse.Object.extend("GradeInfo");
      let gradeInfo = new grade();
      gradeInfo.set("batch", profile.get('batch'));
      gradeInfo.set("profile", {
        __type: "Pointer",
        className: "Profile",
        objectId: profile.id
      });
      gradeInfo.set("major", {
        __type: "Pointer",
        className: "SchoolMajor",
        objectId: profile.get('SchoolMajor').id
      });
      gradeInfo.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: "1ErpDVc1u6"
      });
      gradeInfo.set("school", {
        __type: "Pointer",
        className: "Department",
        objectId: profile.get('department').id
      });
      gradeInfo.set("center", {
        __type: "Pointer",
        className: "Department",
        objectId: this.centerId,
      });
      gradeInfo.set("departments", [
        {
          __type: "Pointer",
          className: "Department",
          objectId: profile.get('department').id
        },
        {
          __type: "Pointer",
          className: "Department",
          objectId: this.centerId,
        }
      ]);
      let res = await gradeInfo.save()
      console.log(res)
      
      this.getProfiles();

      this.message.success("保存成功! ");
      this.operatModal = false;
      this.profileId = null
    }

    if (type == 'delete') {
      console.log(data);
      if (!data) {
        this.message.error("待删除的数据id不能为空!")
        return
      }

      let grade = new Parse.Query("GradeInfo")
      let gradeInfo = await grade.get(data);
      if (gradeInfo && gradeInfo.id) {
        if(gradeInfo.get("isReport")){
          this.message.error("该数据信息已上报!")
        }else{
          await gradeInfo.destroy();
          this.message.success("删除成功!")
          this.getProfiles();
        }
      } else {
        this.message.error("该数据信息不存在!")
      }
    }

  }

  profileList;
  async changeProfile(e) {
    console.log(e)

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let compleSql = '';
    let selectSql = `select  "pro"."objectId", "name", "education" `
    let fromSql = ` from (select "objectId","name","education" from "Profile" where "company" = '1ErpDVc1u6' and "education" = '本科' and "departments" @> '[{ "objectId": "${this.centerId}"}]' and "isCross" is true and "isDeleted" is not true) as "pro"
      left join (select "profile" from "GradeInfo" where "company" = '1ErpDVc1u6') as "grade" on "pro"."objectId" = "grade"."profile"
      where "grade"."profile" is null `

    if (e) {
      fromSql = ` from (select "objectId","name","education" from "Profile" where "company" = '1ErpDVc1u6' and "education" = '本科' and "name" like '%${e}%' and "departments" @> '[{ "objectId": "${this.centerId}"}]' and "isCross" is true and "isDeleted" is not true) as "pro"
      left join (select "profile" from "GradeInfo" where "company" = '1ErpDVc1u6') as "grade" on "pro"."objectId" = "grade"."profile"
      where "grade"."profile" is null `
    }

    compleSql = selectSql + fromSql
    console.log(compleSql);
    this.http.post(baseurl, { sql: compleSql }).subscribe(async (res: any) => {
      console.log(res);
      if (res.code == 200) {
        if (res.data && res.data.length) {
          this.profileList = res.data;
          console.log(this.profileList)
        }
      } else {
        this.message.info("网络繁忙，数据获取失败")
      }
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
