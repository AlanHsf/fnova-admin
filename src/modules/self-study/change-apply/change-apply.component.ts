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

// 异动审核

@Component({
  selector: 'app-change-apply',
  templateUrl: './change-apply.component.html',
  styleUrls: ['./change-apply.component.scss']
})
export class ChangeApplyComponent implements OnInit {

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
      title: '身份证号',
      value: 'idcard',
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
      title: '批次',
      value: 'batch',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '所属学院',
      value: 'depaName',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    
    {
      title: '教学点',
      value: 'centerName',
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
      title: '层次',
      value: 'education',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '异动类型',
      value: 'type',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '状态',
      value: 'status',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '操作',
      value: '',
      type: '',
      compare: null,
    }
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

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let compleSql = '';

    let selectSql = `select * `

    let fromSql = ` from 
      (select "objectId","profile","application","status","school","center","type","createdAt" from "ModifyApply" where "company" = '1ErpDVc1u6') as "apply"
      join 
        (select "objectId","name","idcard","studentID","SchoolMajor" from "Profile" where "company" = '1ErpDVc1u6') as "pro"
          on "apply"."profile" = "pro"."objectId"
      left join 
        (select "objectId","name" as "majorName" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on "major"."objectId" = "pro"."SchoolMajor"
      left join 
        (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa"
          on "depa"."objectId" = "apply"."department"
      left join
        (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "center"
          on "center"."objectId" = "apply"."center"
     `

    // "cates" @> '[{ "objectId": "${this.cateId}"}]' and
    console.log(this.centerId)
    if (this.centerId) {
      fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","batch","SchoolMajor","createdAt" from "Profile" where "departments" @> '[{ "objectId": "${this.centerId}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true) as "pro"
      left join 
        (select "objectId","name" as "majorName" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on "pro"."SchoolMajor" = "major"."objectId"
      join 
        (select "objectId","title",jsonb_array_elements("toMajor")::json->>'objectId' as "majorId" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson"
          on "lesson"."majorId" = "major"."objectId" 
      left join
        (select "objectId","name" as "gradeName","major","profile","lesson","grade","type" from "CreditGrade" where "company" = '1ErpDVc1u6') as "grade"
          on ("grade"."lesson" = "lesson"."objectId" and "grade"."major" = "major"."objectId" and "grade"."profile" = "pro"."objectId")
      left join 
        (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
          on "depa1"."objectId" = "pro"."department"
      left join
        (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
          on "depa2"."objectId" = "pro"."center"
     `
    } else if (this.department) {
      fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","batch","SchoolMajor","createdAt" from "Profile" where "departments" @> '[{ "objectId": "${this.department}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true) as "pro"
      left join 
        (select "objectId","name" as "majorName" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on "pro"."SchoolMajor" = "major"."objectId"
      join 
        (select "objectId","title",jsonb_array_elements("toMajor")::json->>'objectId' as "majorId" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson"
          on "lesson"."majorId" = "major"."objectId" 
      left join
        (select "objectId","name" as "gradeName","major","profile","lesson","grade","type" from "CreditGrade" where "company" = '1ErpDVc1u6') as "grade"
          on ("grade"."lesson" = "lesson"."objectId" and "grade"."major" = "major"."objectId" and "grade"."profile" = "pro"."objectId")
      left join 
        (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
          on "depa1"."objectId" = "pro"."department"
      left join
        (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
          on "depa2"."objectId" = "pro"."center"
     `
    }

    let whereSql = ` where 1 = 1 `
    if (this.inputValue && this.inputValue.trim() != '') {
      whereSql += ` and "${this.searchType.value}" like  '%${this.inputValue}%' `
    }

    let orderSql = ` order by "createdAt" desc `
    let breakSql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`

    compleSql = `select * from ( ${selectSql} ${fromSql} ) t  ${whereSql} `

    console.log(compleSql + orderSql + breakSql);
    this.http
      .post(baseurl, { sql: compleSql + orderSql + breakSql })
      .subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          if (res.data && res.data.length) {
            this.listOfData = res.data;
            let countSql = `select count(*) from ( ${compleSql} ) t`
            console.log(countSql)
            this.filterLen = await this.getCount(countSql);
            // this.filterData = this.checkData(res.data);
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
      let compleSql = ``
      let selectSql = `select *,
          CASE  
            WHEN "grade" >= 60 THEN "grade"||''
            WHEN "grade" < 60 THEN '不及格'
            WHEN "grade" is null THEN '无'
          END "gradeScore" `

      let fromSql = ` from 
        (select "objectId","name","studentID","idcard","department","center","batch","SchoolMajor","createdAt" from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true) as "pro"
        left join 
          (select "objectId","name" as "majorName" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
            on "pro"."SchoolMajor" = "major"."objectId"
        join 
          (select "objectId","title",jsonb_array_elements("toMajor")::json->>'objectId' as "majorId" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson"
            on "lesson"."majorId" = "major"."objectId" 
        left join
          (select "objectId","name" as "gradeName","major","profile","lesson","grade","type" from "CreditGrade" where "company" = '1ErpDVc1u6') as "grade"
            on ("grade"."lesson" = "lesson"."objectId" and "grade"."major" = "major"."objectId" and "grade"."profile" = "pro"."objectId")
        left join 
          (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
            on "depa1"."objectId" = "pro"."department"
        left join
          (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
            on "depa2"."objectId" = "pro"."center"
       `

      // "cates" @> '[{ "objectId": "${this.cateId}"}]' and
      console.log(this.centerId)
      if (this.centerId) {
        fromSql = ` from 
        (select "objectId","name","studentID","idcard","department","center","batch","SchoolMajor","createdAt" from "Profile" where "departments" @> '[{ "objectId": "${this.centerId}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true) as "pro"
        left join 
          (select "objectId","name" as "majorName" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
            on "pro"."SchoolMajor" = "major"."objectId"
        join 
          (select "objectId","title",jsonb_array_elements("toMajor")::json->>'objectId' as "majorId" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson"
            on "lesson"."majorId" = "major"."objectId" 
        left join
          (select "objectId","name" as "gradeName","major","profile","lesson","grade","type" from "CreditGrade" where "company" = '1ErpDVc1u6') as "grade"
            on ("grade"."lesson" = "lesson"."objectId" and "grade"."major" = "major"."objectId" and "grade"."profile" = "pro"."objectId")
        left join 
          (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
            on "depa1"."objectId" = "pro"."department"
        left join
          (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
            on "depa2"."objectId" = "pro"."center"
       `
      } else if (this.department) {
        fromSql = ` from 
        (select "objectId","name","studentID","idcard","department","center","batch","SchoolMajor","createdAt" from "Profile" where "departments" @> '[{ "objectId": "${this.department}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true) as "pro"
        left join 
          (select "objectId","name" as "majorName" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
            on "pro"."SchoolMajor" = "major"."objectId"
        join 
          (select "objectId","title",jsonb_array_elements("toMajor")::json->>'objectId' as "majorId" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson"
            on "lesson"."majorId" = "major"."objectId" 
        left join
          (select "objectId","name" as "gradeName","major","profile","lesson","grade","type" from "CreditGrade" where "company" = '1ErpDVc1u6') as "grade"
            on ("grade"."lesson" = "lesson"."objectId" and "grade"."major" = "major"."objectId" and "grade"."profile" = "pro"."objectId")
        left join 
          (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
            on "depa1"."objectId" = "pro"."department"
        left join
          (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
            on "depa2"."objectId" = "pro"."center"
       `
      }

      let whereSql = ` where 1 = 1 `
      if (this.inputValue && this.inputValue.trim() != '') {
        whereSql += ` and "${this.searchType.value}" like  '%${this.inputValue}%' `
      }

      compleSql = `select * from ( ${selectSql} ${fromSql} ) t  ${whereSql} `
      console.log(compleSql);

      this.novaSql(compleSql).then(data => {
        console.log(data);
        if (data && data.length) {
          let dataLen = data.length;
          for (let index = 0; index < dataLen; index++) {
            let item = data[index];
            // item.claBeginTime = this.dateFmt.transform(item.claBeginTime, 'yyyy/MM/dd HH:mm:ss')
            // item.claEndTime = this.dateFmt.transform(item.claEndTime, 'yyyy/MM/dd HH:mm:ss')
            item.studentID = item.studentID ? "'" + item.studentID : "";
            item.idcard = item.idcard ? "'" + item.idcard : "";
            item.grade = item.grade ? item.grade : "无";
            if (index + 1 == dataLen) {
              resolve(data)
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