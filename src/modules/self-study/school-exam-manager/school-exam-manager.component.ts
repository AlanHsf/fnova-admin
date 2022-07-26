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

@Component({
  selector: 'app-school-exam-manager',
  templateUrl: './school-exam-manager.component.html',
  styleUrls: ['./school-exam-manager.component.scss'],
  providers: [DatePipe]
})
export class SchoolExamManagerComponent implements OnInit {

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
  dateValue;
  dateBacth;
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
      title: '层次',
      value: 'education',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '所属课程',
      value: 'title',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '类别',
      value: 'identyType',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '报考时间',
      value: 'signDate',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
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

          this.listOfColumn[11] = {
            title: '是否提交',
            value: 'isSubmit',
            type: 'String',
            compare: null,
            schemaAlia: 'pro'
          }

          this.listOfColumn[12] = {
            title: '操作',
            value: '',
            type: '',
            compare: null,
            schemaAlia: 'pro'
          }
        }else{
          this.listOfColumn[11] = {
            title: '操作',
            value: '',
            type: '',
            compare: null,
            schemaAlia: 'pro'
          }
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

    let selectSql = `select 
        "schoolExam"."objectId", 
        "pro"."name",
        "pro"."studentID",
        "pro"."idcard",
        "pro"."batch",
        "depa2"."centerName",
        "pro"."school",
        "major"."majorName",
        "pro"."education",
        "lesson"."title", 
        "pro"."identyType",
        "schoolExam"."signDate",
        "schoolExam"."isSubmit"  `

    let fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
              from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      join (select "objectId","profile","signDate","school","center","major","lesson","isSubmit" from "ProfileSchoolExam" where "company" = '1ErpDVc1u6') as "schoolExam" on "schoolExam"."profile" = "pro"."objectId"
      left join 
        (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on "schoolExam"."major" = "major"."objectId"
      left join 
        (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson"
          on "lesson"."objectId" = "schoolExam"."lesson" 
      left join 
        (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
          on "depa1"."objectId" = "schoolExam"."school"
      left join
        (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
          on "depa2"."objectId" = "schoolExam"."center"
     `

    // jsonb_array_elements("toMajor")::json->>'objectId' as "majorId" 
    // "departments" @> '[{ "objectId": "${this.centerId}"}]' and 
    console.log(this.centerId)
    if (this.centerId) {
      fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
              from "Profile" where "departments" @> '[{ "objectId": "${this.centerId}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      join (select "objectId","profile","signDate","school","center","major","lesson","isSubmit" from "ProfileSchoolExam" where "company" = '1ErpDVc1u6') as "schoolExam" on "schoolExam"."profile" = "pro"."objectId"
      left join 
        (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on "schoolExam"."major" = "major"."objectId"
      left join 
        (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson"
          on "lesson"."objectId" = "schoolExam"."lesson" 
      left join 
        (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
          on "depa1"."objectId" = "schoolExam"."school"
      left join
        (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
          on "depa2"."objectId" = "schoolExam"."center"
     `
    } else if (this.department) {
      fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
              from "Profile" where "departments" @> '[{ "objectId": "${this.department}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      join (select "objectId","profile","signDate","school","center","major","lesson","isSubmit" from "ProfileSchoolExam" where "company" = '1ErpDVc1u6' and "isSubmit" is true) as "schoolExam" on "schoolExam"."profile" = "pro"."objectId"
      left join 
        (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on "schoolExam"."major" = "major"."objectId"
      left join 
        (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson"
          on "lesson"."objectId" = "schoolExam"."lesson" 
      left join 
        (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
          on "depa1"."objectId" = "schoolExam"."school"
      left join
        (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
          on "depa2"."objectId" = "schoolExam"."center"
     `
    }

    let whereSql = ` where 1 = 1 `
    if (this.inputValue && this.inputValue.trim() != '') {
      whereSql += ` and "${this.searchType.value}" like  '%${this.inputValue}%' `
    }
    if(this.dateBacth && this.dateValue){
      let date = this.dateValue.trim() + this.dateBacth
      whereSql += ` and "signDate" = '${date}' `
    }

    let orderSql = ` order by "createdAt" desc `
    let breakSql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`

    compleSql = `${selectSql} ${fromSql} ${whereSql} `

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
    if(this.dateBacth && !this.dateValue){
      this.message.info("请填写年份!")
      return
    }
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

    if(type == 'submit'){
      console.log(data)

      let schoolExam = new Parse.Query("ProfileSchoolExam")
      schoolExam.get(data);
      let schoolExamInfo = await schoolExam.first()
      if(schoolExamInfo && schoolExamInfo.id ){
        if(schoolExamInfo.get("isSubmit")){
          this.message.error("该校考信息已提交!")
        }else{
          schoolExamInfo.set("isSubmit", true);
          await schoolExamInfo.save().then(res=>{
            console.log(res);
            this.getProfiles()
            this.message.success("修改成功!")
          }).catch(err=>{
            console.log(err)
            this.message.success("修改失败!")
          })
        }
      }else if(!schoolExamInfo){
        this.message.error("该校考信息不存在!")
      }
    }

    if(type == 'delete'){
      console.log(data)

      let schoolExam = new Parse.Query("ProfileSchoolExam")
      schoolExam.get(data);
      let schoolExamInfo = await schoolExam.first()
      if(schoolExamInfo && schoolExamInfo.id ){
        if(schoolExamInfo.get("isSubmit") && this.centerId){
          this.message.error("该校考信息已提交, 不能删除!")
        }else{
          await schoolExamInfo.destroy().then(res=>{
            console.log(res);
            this.getProfiles()
            this.message.success("删除成功!")
          }).catch(err=>{
            console.log(err)
            this.message.success("删除失败!")
          })
        }
      }else if(!schoolExamInfo){
        this.message.error("该校考信息不存在!")
      }
    }

  }

  // ag-grid 生命周期
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  exportData() {
    this.gridApi.exportDataAsExcel();
    // var spreadsheets: string[] = [];
    // console.log(this.gridApi)
    // this.gridApi.forEachNode((node, index) => {
    //   console.log(node,index)
    //   if (index % 100 === 0) {
    //     this.gridApi.deselectAll();
    //   }
    //   node.setSelected(true);
    //   if (index % 100 === 99) {
    //     spreadsheets.push(
    //       this.gridApi.getSheetDataForExcel({
    //         onlySelected: true
    //       })
    //     );
    //   }
    // });
    // // check if the last page was exported
    // if (this.gridApi.getSelectedNodes().length) {
    //   spreadsheets.push(
    //     this.gridApi.getSheetDataForExcel({
    //       onlySelected: true
    //     })!
    //   );
    //   this.gridApi.deselectAll();
    // }
    // this.gridApi.exportMultipleSheetsAsExcel({
    //   data: spreadsheets
    // });
  }
  ExportData: any = []
  getTotalStudents() {
    return new Promise(async (resolve, reject) => {
      let compleSql = ``
      let selectSql = `select 
        "schoolExam"."objectId", 
        "pro"."name",
        "pro"."studentID",
        "pro"."idcard",
        "pro"."batch",
        "depa2"."centerName",
        "pro"."school",
        "major"."majorName",
        "pro"."education",
        "lesson"."title", 
        "pro"."identyType",
        "schoolExam"."signDate",
        "schoolExam"."isSubmit"  `

      let fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
              from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      join (select "objectId","profile","signDate","school","center","major","lesson","isSubmit" from "ProfileSchoolExam" where "company" = '1ErpDVc1u6') as "schoolExam" on "schoolExam"."profile" = "pro"."objectId"
      left join 
        (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on "schoolExam"."major" = "major"."objectId"
      left join 
        (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson"
          on "lesson"."objectId" = "schoolExam"."lesson" 
      left join 
        (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
          on "depa1"."objectId" = "schoolExam"."school"
      left join
        (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
          on "depa2"."objectId" = "schoolExam"."center"
     `

      // jsonb_array_elements("toMajor")::json->>'objectId' as "majorId" 
      // "departments" @> '[{ "objectId": "${this.centerId}"}]' and 
      console.log(this.centerId)
      if (this.centerId) {
        fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
              from "Profile" where "departments" @> '[{ "objectId": "${this.centerId}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      join (select "objectId","profile","signDate","school","center","major","lesson","isSubmit" from "ProfileSchoolExam" where "company" = '1ErpDVc1u6') as "schoolExam" on "schoolExam"."profile" = "pro"."objectId"
      left join 
        (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on "schoolExam"."major" = "major"."objectId"
      left join 
        (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson"
          on "lesson"."objectId" = "schoolExam"."lesson" 
      left join 
        (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
          on "depa1"."objectId" = "schoolExam"."school"
      left join
        (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
          on "depa2"."objectId" = "schoolExam"."center"
     `
      } else if (this.department) {
        fromSql = ` from 
      (select "objectId","name","studentID","idcard","department","center","school","batch","identyType","education","SchoolMajor","createdAt" 
              from "Profile" where "departments" @> '[{ "objectId": "${this.department}"}]' and "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      join (select "objectId","profile","signDate","school","center","major","lesson","isSubmit" from "ProfileSchoolExam" where "company" = '1ErpDVc1u6' and "isSubmit" is true) as "schoolExam" on "schoolExam"."profile" = "pro"."objectId"
      left join 
        (select "objectId","name" as "majorName","type","types" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on "schoolExam"."major" = "major"."objectId"
      left join 
        (select "objectId","title" from "Lesson" where "company" = '1ErpDVc1u6') as "lesson"
          on "lesson"."objectId" = "schoolExam"."lesson" 
      left join 
        (select "objectId","name" as "depaName" from "Department" where "company" = '1ErpDVc1u6') as "depa1"
          on "depa1"."objectId" = "schoolExam"."school"
      left join
        (select "objectId","name" as "centerName" from "Department" where "company" = '1ErpDVc1u6' and "type" = 'training') as "depa2"
          on "depa2"."objectId" = "schoolExam"."center"
     `
      }

      let whereSql = ` where 1 = 1 `
      if (this.inputValue && this.inputValue.trim() != '') {
        whereSql += ` and "${this.searchType.value}" like  '%${this.inputValue}%' `
      }
      if(this.dateBacth && this.dateValue){
        let date = this.dateValue.trim() + this.dateBacth
        whereSql += ` and "signDate" = '${date}' `
      }

      compleSql = `${selectSql} ${fromSql} ${whereSql} `
      console.log(compleSql);

      this.novaSql(compleSql).then(data => {
        console.log(data);
        if (data && data.length) {
          let dataLen = data.length;
          for (let index = 0; index < dataLen; index++) {
            let item = data[index];
            // item.claBeginTime = this.dateFmt.transform(item.claBeginTime, 'yyyy/MM/dd HH:mm:ss')
            // item.signDate = this.dateFmt.transform(item.signDate, 'yyyy/MM/dd')
            item.studentID = item.studentID ? "'" + item.studentID : "";
            item.idcard = item.idcard ? "'" + item.idcard : "";
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
