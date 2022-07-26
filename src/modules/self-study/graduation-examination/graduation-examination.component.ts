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


// 毕业审查
@Component({
  selector: 'app-graduation-examination',
  templateUrl: './graduation-examination.component.html',
  styleUrls: ['./graduation-examination.component.scss'],
  providers: [DatePipe]
})
export class GraduationExaminationComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private message: NzMessageService, private cdRef: ChangeDetectorRef, private http: HttpClient, private dateFmt: DatePipe) { }
  department: string;// 院校
  company: any;
  pCompany: any;
  cateId: string;
  cate: any;

  // ag-grid
  rowData: any = [];
  showExport: boolean = false;
  groupHeaderHeight = 40;
  headerHeight = 40;
  floatingFiltersHeight = 40;
  pivotGroupHeaderHeight = 50;
  pivotHeaderHeight = 100;
  gridApi;
  gridColumnApi;

  // 表格
  displayedColumns: Array<any> = [];
  // 表格上标题
  listOfColumn = [
    {
      title: '学员姓名',
      value: 'name',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '准考证号',
      value: 'studentID',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '身份证号',
      value: 'idcard',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '批次',
      value: 'batch',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '服务点',
      value: 'centerName',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '报读院校',
      value: 'school',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '所属专业',
      value: 'majorName',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '专业层次',
      value: 'education',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '毕业证编号',
      value: 'graduNumber',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '审查结果',
      value: 'isCheck',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    }
    // {
    //   title: '操作',
    //   value: '',
    //   type: '',
    //   compare: null,
    //   priority: false
    // }
  ];


  listOfData: any = [];
  filterData: any = [];
  filterType: string;
  filterLen: number;
  isLoading: boolean = true;
  count: number;

  // 筛选
  inputValue: string;
  searchType: any = {};
  // edit
  isVisibleEditModal: boolean = false;
  className: 'Profile';
  proField: any;
  object: any;
  route: any;// devroute
  keys: any;
  editFields: any;
  recruitId: string;// 招生计划id
  centerId;
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.department = localStorage.getItem("department");
      this.company = localStorage.getItem("company");

      if (this.department && this.company) {
        let Company = new Parse.Query("Company");
        let company = await Company.get(this.company);
        this.pCompany = company.get("company").id;
        this.cateId = localStorage.getItem("cateId")
        console.log(this.cateId)

        // 教学点, department为空, center
        let center = new Parse.Query("Department")
        center.equalTo("company", "1ErpDVc1u6");
        center.equalTo("objectId", this.department)
        center.equalTo("type", "training");
        let centerInfo = await center.first();
        console.log(centerInfo)
        if (centerInfo && centerInfo.id) {
          this.centerId = centerInfo.id;
          this.department = null;
        }

      } else if (!this.department) {
        // this.listOfColumn.splice(0, 0, {
        //   title: '院校',
        //   value: 'shortname',
        //   type: 'String',
        //   compare: null,
        //   schemaAlia: 'depart'
        // })
      }
      this.searchType = this.listOfColumn[0]
      await this.getCate()
      this.getDevRoute()
      this.getProfiles();
      // this.getCount()
      this.exportInit();
    })
  }
  async getDepart(recruitId) {
    let Recruit = new Parse.Query("RecruitStudent");
    let recruit = await Recruit.get(recruitId);
    if (recruit && recruit.id) {
      return recruit.get("department") && recruit.get("department").id
    }
  }

  async getDevRoute() {
    let Route = new Parse.Query("DevRoute");
    let route = await Route.get("BQsATBqIrE");
    this.route = route;
    let displayedColumns = route.get("displayedColumns");
    displayedColumns = displayedColumns.filter(item => item != 'cates')
    console.log(displayedColumns);
    let editFields = route.get("editFields");
    this.editFields = editFields;
    console.log(displayedColumns, editFields);
    // this.listOfColumn = []
    // for (let index = 0; index < editFields.length; index++) {
    //   const field = editFields[index];
    //   if (JSON.stringify(displayedColumns).indexOf(field['key']) != -1) {
    //     this.listOfColumn.push({
    //       title: field['name'],
    //       value: field['key'],
    //       type: field['type'],
    //       compare: null,
    //       priority: false
    //     })
    //   }
    // }
    // this.listOfColumn.splice(this.listOfColumn.length, 0, {
    //   title: '操作',
    //   value: '',
    //   type: '',
    //   compare: null,
    //   priority: false
    // })

  }
  async getProfileSchema() {
    const mySchema = new Parse.Schema('Profile');
    let proSche: any = await mySchema.get();
    console.log(proSche);
    this.proField = proSche.fields;
  }
  require: any = [];
  fileds: any;
  exportInit() {
    this.require = [];
    this.listOfColumn.forEach(col => {
      // this.exportListOfColumn.forEach(col => {
      let headerName = col['title'];
      let field = col['value'];
      this.require.push({
        headerName,
        field,
      })
    });
  }

  pageIndex: number = 1;
  pageSize: number = 20;
  async getProfiles(skip?, inputVal?, filter?) {
    let pCompany = this.pCompany || this.company;
    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    // let majorIds = []
    // let major = new Parse.Query("SchoolMajor")
    // major.equalTo("company", "1ErpDVc1u6");
    // major.equalTo("school", this.department);
    // let majorList = await major.find()
    // console.log(majorList)
    // if (majorList && majorList.length) {
    //   for (let i = 0; i < majorList.length; i++) {
    //     majorIds.push(majorList[i].id)
    //   }
    // }
    let proGroupByName: any = await this.getSchoolAppEdu()

    let compleSql = '';
    let selectSql = `select 
        "pro"."objectId", 
        "pro"."name",
        "pro"."studentID",
        "pro"."idcard",
        "pro"."batch",
        "grade"."grade",
        "pro"."school",
        "major"."majorName",
        "pro"."education",
        "lesson"."title"  `

    let fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
          from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      left join (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on ("pro"."SchoolMajor" = "major"."objectId" and "pro"."education" = "major"."type" and "pro"."identyType" = "major"."types")
      left join (select "lesson","major","majorType","examType" from "ExamPlan") as "plan" on ("major"."objectId" = "plan"."major" and "major"."types" = "plan"."majorType")
      left join (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson" on "lesson"."objectId" = "plan"."lesson" 
      left join (select "objectId","major","profile","lesson","grade","type" from "CreditGrade" where "company" = '1ErpDVc1u6') as "grade"
          on ("grade"."lesson" = "lesson"."objectId" and "grade"."major" = "major"."objectId" and "grade"."profile" = "pro"."objectId")
     `

    // jsonb_array_elements("toMajor")::json->>'objectId' as "majorId" 
    // "departments" @> '[{ "objectId": "${this.centerId}"}]' and 
    console.log(this.centerId)
    if (this.centerId) {
      fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
          from "Profile" where "departments" @> '[{ "objectId": "${this.centerId}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      left join (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on ("pro"."SchoolMajor" = "major"."objectId" and "pro"."education" = "major"."type" and "pro"."identyType" = "major"."types")
      left join (select "lesson","major","majorType","examType" from "ExamPlan") as "plan" on ("major"."objectId" = "plan"."major" and "major"."types" = "plan"."majorType")
      left join (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson" on "lesson"."objectId" = "plan"."lesson" 
      left join (select "objectId","major","profile","lesson","grade","type" from "CreditGrade" where "company" = '1ErpDVc1u6') as "grade"
          on ("grade"."lesson" = "lesson"."objectId" and "grade"."major" = "major"."objectId" and "grade"."profile" = "pro"."objectId")
     `
    } else if (this.department) {
      fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
          from "Profile" where "departments" @> '[{ "objectId": "${this.department}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      left join (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on ("pro"."SchoolMajor" = "major"."objectId" and "pro"."education" = "major"."type" and "pro"."identyType" = "major"."types")
      left join (select "lesson","major","majorType","examType" from "ExamPlan") as "plan" on ("major"."objectId" = "plan"."major" and "major"."types" = "plan"."majorType")
      left join (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson" on "lesson"."objectId" = "plan"."lesson" 
      left join (select "objectId","major","profile","lesson","grade","type" from "CreditGrade" where "company" = '1ErpDVc1u6') as "grade"
          on ("grade"."lesson" = "lesson"."objectId" and "grade"."major" = "major"."objectId" and "grade"."profile" = "pro"."objectId")
     `
    }

    compleSql = `${selectSql} ${fromSql}`
    this.http
      .post(baseurl, { sql: compleSql })
      .subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          if (res.data && res.data.length) {
            this.filterData = []
            this.listOfData = res.data;
            for (let i = 0; i < proGroupByName.length; i++) {
              let check = true
              if (proGroupByName[i].user) {
                if (!this.inputValue || (this.inputValue && this.inputValue.trim() && this.searchType.value == 'isCheck' && this.inputValue != '不符合' && this.inputValue != '符合')) {
                  proGroupByName[i].isCheck = "已毕业"
                  this.filterData.push(proGroupByName[i])
                }
              } else {
                for (let j = 0; j < this.listOfData.length; j++) {
                  if (proGroupByName[i].objectId == this.listOfData[j].objectId) {
                    if (this.listOfData[j].grade < 60) {
                      check = false
                    }
                  }
                }

                if (check) {
                  if (!this.inputValue || (this.inputValue && this.inputValue.trim() && this.searchType.value == 'isCheck' && this.inputValue == '符合')) {
                    proGroupByName[i].isCheck = "符合"
                    this.filterData.push(proGroupByName[i])
                  }
                } else {
                  if (!this.inputValue || (this.inputValue && this.inputValue.trim() && this.searchType.value == 'isCheck' && this.inputValue == '不符合')) {
                    proGroupByName[i].isCheck = "不符合"
                    this.filterData.push(proGroupByName[i])
                  }
                }
              }
            }

            this.filterLen = proGroupByName.length
            console.log(this.listOfData)
            console.log(this.filterData)
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


  getSchoolAppEdu() {
    return new Promise(async (resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
      let proCompleSql = '';
      let proSelectSql = `select 
        "pro"."objectId", 
        "pro"."name",
        "pro"."studentID",
        "pro"."idcard",
        "pro"."batch",
        "depa2"."centerName",
        "pro"."school",
        "major"."majorName",
        "pro"."education",
        "appedu"."user",
        "appedu"."graduNumber"  `
      let proFromSql = ` from 
    (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
        from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
    left join (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
        on ("pro"."SchoolMajor" = "major"."objectId" and "pro"."education" = "major"."type" and "pro"."identyType" = "major"."types")
    left join (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
        on "depa1"."objectId" = "pro"."department"
    left join (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
        on "depa2"."objectId" = "pro"."center"
    left join (select "user","graduNumber" from "SchoolAppEdu") as "appedu" on "appedu"."user" = "pro"."objectId"
   `
      console.log(this.centerId)
      if (this.centerId) {
        proFromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
          from "Profile" where "departments" @> '[{ "objectId": "${this.centerId}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      left join (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on ("pro"."SchoolMajor" = "major"."objectId" and "pro"."education" = "major"."type" and "pro"."identyType" = "major"."types")
      left join (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
          on "depa1"."objectId" = "pro"."department"
      left join (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
          on "depa2"."objectId" = "pro"."center"
      left join (select "user","graduNumber" from "SchoolAppEdu") as "appedu" on "appedu"."user" = "pro"."objectId"
     `
      } else if (this.department) {
        proFromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
          from "Profile" where "departments" @> '[{ "objectId": "${this.department}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      left join (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on ("pro"."SchoolMajor" = "major"."objectId" and "pro"."education" = "major"."type" and "pro"."identyType" = "major"."types")
      left join (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
          on "depa1"."objectId" = "pro"."department"
      left join (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
          on "depa2"."objectId" = "pro"."center"
      left join (select "user","graduNumber" from "SchoolAppEdu") as "appedu" on "appedu"."user" = "pro"."objectId"
     `
      }
      let whereSql = ` where 1 = 1 `
      if (this.inputValue && this.inputValue.trim() != '') {
        if (this.searchType.value == 'isCheck') {
          if (this.inputValue == "已毕业") {
            whereSql += ` and "user" is not null `
          }
        } else {
          whereSql += ` and "${this.searchType.value}" like  '%${this.inputValue}%' `
        }
      }
      let orderSql = ` order by "createdAt" desc `
      let breakSql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`
      proCompleSql = proSelectSql + proFromSql + whereSql + orderSql + breakSql
      console.log(proCompleSql);

      this.novaSql(proCompleSql).then(data => {
        console.log(data);
        if (data && data.length) {
          resolve(data)
        } else {
          resolve([])
        }
      })
    })
  }


  pageChange(e) {
    this.isLoading = true
    this.getProfiles()
  }
  async getCate() {
    let user = Parse.User.current();
    if (user && user.get("cates")) {
      let cates = user.get("cates")
      if (cates && cates.length) {
        cates.forEach(cate => {
          console.log(cate);
          this.cateId = cate.id
          console.log(this.cateId)
          if (cate.get("type") == 'test') {
            this.cateId = cate.id
            console.log(this.cateId)
          }

        });

      }
    }
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
  novaSql(sql): Promise<any> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
      this.http
        .post(baseurl, { sql: sql })
        .subscribe(async (res: any) => {
          console.log(res);
          if (res.code == 200) {
            resolve(res.data)
          } else {
            this.message.info("网络繁忙，数据获取失败")
            reject(res)
          }
        })
    })
  }
  dateFormat(time) {
    time = new Date(time);
    let Year = time.getFullYear();
    let Month = time.getMonth() + 1;
    let Day = time.getDate();
    let Hours = time.getHours();
    let Minutes = time.getMinutes();
    Hours = Hours == 0 ? '00' : (Hours < 10 ? '0' + Hours : Hours)
    Minutes = Minutes == 0 ? '00' : (Minutes < 10 ? '0' + Minutes : Minutes)
    time = Year + '/' + Month + '/' + Day + '  ' + Hours + ':' + Minutes;
    return time
  }
  searchTypeChange(e) {
    let index = this.listOfColumn.findIndex(item => item.value == e);
    console.log(e);
    if (index != -1) {
      this.searchType = this.listOfColumn[index];
    }
  }
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

  async operate(type, data?) {

    if (type == 'edit') {
      this.object = Object.assign({}, data);
      console.log(data.attributes);
      console.log(this.object);
      this.isVisibleEditModal = true;
    }
    if (type == 'save') {
      let id = this.object.objectId;
      console.log(id);
      let Query = new Parse.Query("Profile");
      Query.notEqualTo("isDeleted", true);
      Query.equalTo("objectId", id);
      let query = await Query.first();
      console.log(id, query);

      if (query && query.id) {
        query.set("eduImage", this.object['eduImage'])
        query.set("image", this.object['image']);
        let res = await query.save();
        if (res && res.id) {
          this.cdRef.detectChanges()
        }
        this.isVisibleEditModal = false;
      }
      // data.save().then(res => {
      //   console.log(res);
      //   this.filterData = this.filterData.filter((item: any) => { return item.id != data.id })
      //   this.cdRef.detectChanges();
      // })

    }

  }

  // ag-grid 生命周期
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  exportData() {
    this.gridApi.exportDataAsExcel();
  }
  ExportData: any = []
  getTotalStudents() {
    return new Promise(async (resolve, reject) => {
      let proGroupByName: any = await this.getSchoolAppEdu()

      let compleSql = '';
      let selectSql = `select 
        "pro"."objectId", 
        "pro"."name",
        "pro"."studentID",
        "pro"."idcard",
        "pro"."batch",
        "grade"."grade",
        "pro"."school",
        "major"."majorName",
        "pro"."education",
        "lesson"."title"  `

      let fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
          from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      left join (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on ("pro"."SchoolMajor" = "major"."objectId" and "pro"."education" = "major"."type" and "pro"."identyType" = "major"."types")
      left join (select "lesson","major","majorType","examType" from "ExamPlan") as "plan" on ("major"."objectId" = "plan"."major" and "major"."types" = "plan"."majorType")
      left join (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson" on "lesson"."objectId" = "plan"."lesson" 
      left join (select "objectId","major","profile","lesson","grade","type" from "CreditGrade" where "company" = '1ErpDVc1u6') as "grade"
          on ("grade"."lesson" = "lesson"."objectId" and "grade"."major" = "major"."objectId" and "grade"."profile" = "pro"."objectId")
     `

      // jsonb_array_elements("toMajor")::json->>'objectId' as "majorId" 
      // "departments" @> '[{ "objectId": "${this.centerId}"}]' and 
      console.log(this.centerId)
      if (this.centerId) {
        fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
          from "Profile" where "departments" @> '[{ "objectId": "${this.centerId}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      left join (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on ("pro"."SchoolMajor" = "major"."objectId" and "pro"."education" = "major"."type" and "pro"."identyType" = "major"."types")
      left join (select "lesson","major","majorType","examType" from "ExamPlan") as "plan" on ("major"."objectId" = "plan"."major" and "major"."types" = "plan"."majorType")
      left join (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson" on "lesson"."objectId" = "plan"."lesson" 
      left join (select "objectId","major","profile","lesson","grade","type" from "CreditGrade" where "company" = '1ErpDVc1u6') as "grade"
          on ("grade"."lesson" = "lesson"."objectId" and "grade"."major" = "major"."objectId" and "grade"."profile" = "pro"."objectId")
     `
      } else if (this.department) {
        fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
          from "Profile" where "departments" @> '[{ "objectId": "${this.department}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      left join (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on ("pro"."SchoolMajor" = "major"."objectId" and "pro"."education" = "major"."type" and "pro"."identyType" = "major"."types")
      left join (select "lesson","major","majorType","examType" from "ExamPlan") as "plan" on ("major"."objectId" = "plan"."major" and "major"."types" = "plan"."majorType")
      left join (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson" on "lesson"."objectId" = "plan"."lesson" 
      left join (select "objectId","major","profile","lesson","grade","type" from "CreditGrade" where "company" = '1ErpDVc1u6') as "grade"
          on ("grade"."lesson" = "lesson"."objectId" and "grade"."major" = "major"."objectId" and "grade"."profile" = "pro"."objectId")
     `
      }

      compleSql = `${selectSql} ${fromSql} `
      console.log(compleSql);

      this.novaSql(compleSql).then(data => {
        console.log(data);
        if (data && data.length) {
          let res = []
          for (let i = 0; i < proGroupByName.length; i++) {
            let check = true
            if (proGroupByName[i].user) {
              if (!this.inputValue || (this.inputValue && this.inputValue.trim() && this.searchType.value == 'isCheck' && this.inputValue != '不符合' && this.inputValue != '符合')) {
                proGroupByName[i].isCheck = "已毕业"
                res.push(proGroupByName[i])
              }
            } else {
              for (let j = 0; j < this.listOfData.length; j++) {
                if (proGroupByName[i].objectId == this.listOfData[j].objectId) {
                  if (this.listOfData[j].grade < 60) {
                    check = false
                  }
                }
              }

              if (check) {
                if (!this.inputValue || (this.inputValue && this.inputValue.trim() && this.searchType.value == 'isCheck' && this.inputValue == '符合')) {
                  proGroupByName[i].isCheck = "符合"
                  res.push(proGroupByName[i])
                }
              } else {
                if (!this.inputValue || (this.inputValue && this.inputValue.trim() && this.searchType.value == 'isCheck' && this.inputValue == '不符合')) {
                  proGroupByName[i].isCheck = "不符合"
                  res.push(proGroupByName[i])
                }
              }
            }
          }

          let dataLen = res.length;
          for (let index = 0; index < dataLen; index++) {
            let item = res[index];
            // item.claBeginTime = this.dateFmt.transform(item.claBeginTime, 'yyyy/MM/dd HH:mm:ss')
            // item.claEndTime = this.dateFmt.transform(item.claEndTime, 'yyyy/MM/dd HH:mm:ss')
            item.studentID = item.studentID ? "'" + item.studentID : "";
            item.idcard = item.idcard ? "'" + item.idcard : "";
            if (index + 1 == dataLen) {
              resolve(res)
            }
          }
        } else {
          resolve([])
        }
      })
    })
  }
  // 导出函数 :
  async export() {
    this.ExportData = [];
    let data: any = await this.getTotalStudents();
    this.ExportData = data && data.length ? data : []
    this.showExport = true;
    console.log(this.ExportData)
  }

}