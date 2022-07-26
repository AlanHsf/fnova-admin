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
  selector: 'app-student-pay',
  templateUrl: './student-pay.component.html',
  styleUrls: ['./student-pay.component.scss'],
  providers: [DatePipe]
})
export class StudentPayComponent implements OnInit {

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
      title: '姓名',
      value: 'name',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '性别',
      value: 'sex',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    // {
    //   title: '学号',
    //   value: 'studentID',
    //   type: 'String',
    //   compare: null,
    //   schemaAlia: 'pro'
    // },
    {
      title: '身份证号',
      value: 'idcard',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '手机号',
      value: 'mobile',
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
      title: '报名校区',
      value: 'catename',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '语种名称',
      value: 'lang',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '学习形式',
      value: 'studenttypename',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '身份证头像',
      value: 'eduImage',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '证件照头像',
      value: 'image',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '缴费情况',
      value: 'ispaytype',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '操作',
      value: '',
      type: '',
      compare: null,
      priority: false
    }
    // {
    //   title: '考点',
    //   value: 'cates',
    //   type: 'Array',
    //   compare: null,
    //   priority: false
    // },
  ];
  exportListOfColumn = [
    {
      title: '姓名',
      value: 'name',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '性别',
      value: 'sex',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '学号',
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
      title: '手机号',
      value: 'mobile',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '电子邮箱',
      value: 'email',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '民族',
      value: 'nation',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '政治面貌',
      value: 'polity',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '毕业院校',
      value: 'school',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '通讯地址',
      value: 'address',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '出生日期',
      value: 'birthdate',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '邮政编码',
      value: 'postcode',
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
      title: '其他联系方式',
      value: 'tel',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '报名校区',
      value: 'catename',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '学制',
      value: 'education',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '地区',
      value: 'area',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '证件类型',
      value: 'cardtype',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '语种名称',
      value: 'lang',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '语种代码',
      value: 'langCode',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '学习形式',
      value: 'studenttypename',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '身份证头像',
      value: 'eduImage',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '生活照头像',
      value: 'image',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '缴费情况',
      value: 'ispaytype',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '考场',
      value: 'claName',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '准考证号',
      value: 'workid',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '身份类型',
      value: 'identyType',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '所属院校',
      value: 'depaName',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '关联院校',
      value: 'departments',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '报名序号',
      value: 'degreeNumber',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '座位号',
      value: 'cardnum',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '考场地点',
      value: 'location',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '考场详细地址',
      value: 'claAddress',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '考场号',
      value: 'serial',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '考试开始时间',
      value: 'claBeginTime',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '考试结束时间',
      value: 'claEndTime',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
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
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      let recruitId = params.get("recruit");
      if (recruitId) {
        this.recruitId = recruitId;
        this.department = localStorage.getItem("department");
        this.company = localStorage.getItem("company");
        if (this.department && this.company) {
          let Company = new Parse.Query("Company");
          let company = await Company.get(this.company);
          this.pCompany = company.get("company").id;
          this.cateId = localStorage.getItem("cateId")
          console.log(this.cateId)
        } else if (!this.department) {
          this.listOfColumn.splice(0, 0, {
            title: '院校',
            value: 'shortname',
            type: 'String',
            compare: null,
            schemaAlia: 'depart'
          })
          this.department = await this.getDepart(recruitId)
        }
        this.searchType = this.listOfColumn[0]
        await this.getCate()
        this.getDevRoute()
        this.getProfiles();
        // this.getCount()
        this.exportInit();
      }
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
    this.exportListOfColumn.forEach(col => {
      let headerName = col['title'];
      let field = col['value'];
      this.require.push({
        headerName,
        field,
      })
    });
  }

  pageIndex: number = 1;
  pageSize: number = 10;
  async getProfiles(skip?, inputVal?, filter?) {
    let pCompany = this.pCompany || this.company;
    let department = this.department;

    // let recruitInfo: any = this.getRecruitInfo(this.recruitId)
    // console.log(recruitInfo.beginTime)
    let beginTime
    let endTime
    let Recruit = new Parse.Query("RecruitStudent");
    let recruit = await Recruit.get(this.recruitId);
    if (recruit && recruit.id) {
      let recruitInfo = recruit.toJSON()
      beginTime = recruitInfo.beginTime.iso
      endTime = recruitInfo.endTime.iso
      console.log(beginTime, endTime)
    }

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let compleSql = '';

    let selectSql = `select distinct "pro"."objectId" , "pro"."name", "pro"."sex", "pro"."studentID", "pro"."idcard", "pro"."mobile", "pro"."lang",
    "pro"."SchoolMajor", "major"."name" as "majorName", "pro"."studentType" as "studenttype", "log"."objectId" as "logObjectId", "log"."isVerified", "log"."isback", "pro"."eduImage",
    "pro"."image", "pro"."createdAt", "cateOne"."name" as "cateonename", "cateTwo"."name" as "catetwoname", "pro"."cateOneObjectId", "pro"."cateTwoObjectId"
    `
    // left join
    // "Category" as "cate" on "cate"."objectId" = to_char("pro"."cates")
    let fromSql = ` from 
    (select "objectId", "name", "sex", "studentID", "idcard", "mobile", "lang", "SchoolMajor", "studentType", "eduImage", "image", "createdAt", "cates"::text::json->>0 as "cateOneObjectId", "cates"::text::json->>1 as "cateTwoObjectId" from "Profile" where "isDeleted" is not true and "company" = '${pCompany}' and "department" = '${department}' and "createdAt" >= '${beginTime}' and "createdAt" <= '${endTime}') as "pro"
    left join
    (select "objectId", "isVerified", "isback", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
      on substring("log"."orderId",2,10) = "pro"."objectId"
    left join
      (select "objectId", "name" from "SchoolMajor") as "major" on "major"."objectId" = "pro"."SchoolMajor" 
    left join
      (select "objectId", "name" from "Category") as "cateOne" on "cateOne"."objectId" = "pro"."cateOneObjectId"::json->>'objectId'
    left join
      (select "objectId", "name" from "Category") as "cateTwo" on "cateTwo"."objectId" = "pro"."cateTwoObjectId"::json->>'objectId'
      where "log"."objectId" is null `

    let unionSelectSql = `select distinct "pro"."objectId", "pro"."name", "pro"."sex", "pro"."studentID", "pro"."idcard", "pro"."mobile", "pro"."lang",
    "pro"."SchoolMajor", "major"."name" as "majorName", "pro"."studentType" as "studenttype", "log"."objectId" as "logObjectId", "log"."isVerified", "log"."isback", "pro"."eduImage",
    "pro"."image", "pro"."createdAt", "cateOne"."name" as "cateonename", "cateTwo"."name" as "catetwoname", "pro"."cateOneObjectId", "pro"."cateTwoObjectId" `

    let unionFromSql = ` from  
    (select "objectId", "isVerified", "isback", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
    left join
    (select "objectId", "name", "sex", "studentID", "idcard", "mobile", "lang", "SchoolMajor", "studentType", "image", "createdAt", "eduImage", "cates"::text::json->>0 as "cateOneObjectId", "cates"::text::json->>1 as "cateTwoObjectId" from "Profile" where "isDeleted" is not true and "company" = '${pCompany}' and "department" = '${department}') as "pro"
      on (substring("log"."orderId",2,10) = "pro"."objectId")
    left join
      (select "objectId", "name" from "SchoolMajor") as "major" on "major"."objectId" = "pro"."SchoolMajor"
    left join
      (select "objectId", "name" from "Category") as "cateOne" on "cateOne"."objectId" = "pro"."cateOneObjectId"::json->>'objectId'
    left join
      (select "objectId", "name" from "Category") as "cateTwo" on "cateTwo"."objectId" = "pro"."cateTwoObjectId"::json->>'objectId'
    `
    // "cates" @> '[{ "objectId": "${this.cateId}"}]' and
    console.log(this.cateId)
    if (this.cateId) {
      fromSql = ` from 
    (select "objectId", "name", "sex", "studentID", "idcard", "mobile", "lang", "SchoolMajor", "studentType", "eduImage", "image", "createdAt", "cates"::text::json->>0 as "cateOneObjectId", "cates"::text::json->>1 as "cateTwoObjectId" from "Profile" where "cates" @> '[{ "objectId": "${this.cateId}"}]' and "isDeleted" is not true and "company" = '${pCompany}' and "department" = '${department}' and "createdAt" >= '${beginTime}' and "createdAt" <= '${endTime}') as "pro"
    left join
    (select "objectId", "isVerified", "isback", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
      on substring("log"."orderId",2,10) = "pro"."objectId"
    left join
      (select "objectId", "name" from "SchoolMajor") as "major" on "major"."objectId" = "pro"."SchoolMajor" 
    left join
      (select "objectId", "name" from "Category") as "cateOne" on "cateOne"."objectId" = "pro"."cateOneObjectId"::json->>'objectId'
    left join
      (select "objectId", "name" from "Category") as "cateTwo" on "cateTwo"."objectId" = "pro"."cateTwoObjectId"::json->>'objectId'
      where "log"."objectId" is null `

      unionFromSql = ` from  
    (select "objectId", "isVerified", "isback", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
    left join
    (select "objectId", "name", "sex", "studentID", "idcard", "mobile", "lang", "SchoolMajor", "studentType", "image", "createdAt", "eduImage", "cates"::text::json->>0 as "cateOneObjectId", "cates"::text::json->>1 as "cateTwoObjectId" from "Profile" where "cates" @> '[{ "objectId": "${this.cateId}"}]' and "isDeleted" is not true and "company" = '${pCompany}' and "department" = '${department}') as "pro"
      on (substring("log"."orderId",2,10) = "pro"."objectId")
    left join
      (select "objectId", "name" from "SchoolMajor") as "major" on "major"."objectId" = "pro"."SchoolMajor"
    left join
      (select "objectId", "name" from "Category") as "cateOne" on "cateOne"."objectId" = "pro"."cateOneObjectId"::json->>'objectId'
    left join
      (select "objectId", "name" from "Category") as "cateTwo" on "cateTwo"."objectId" = "pro"."cateTwoObjectId"::json->>'objectId'
    `
    }

    let whereSql = ` where "d"."name" is not null `
    if (this.inputValue && this.inputValue.trim() != '') {
      whereSql += ` and "d"."${this.searchType.value}" like  '%${this.inputValue}%' `
    }

    let orderSql = `  order by "createdAt" desc `
    let breakSql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`

    compleSql =
      `select * from (
          select * ,
        CASE  
          WHEN "cateonename" is null and "catetwoname" is null THEN ''
          WHEN "cateonename" is not null and "catetwoname" is null THEN "cateonename"
          WHEN "cateonename" is not null and "catetwoname" is not null THEN concat_ws(' # ',cateonename,catetwoname)
        END catename,
        CASE  
          WHEN "isVerified" is not true and "isback" is not true THEN '未缴费'   
          WHEN "isVerified" is true and "isback" is not true THEN '已缴费'   
          WHEN "isVerified" is true and "isback" is true THEN '已退费'   
        END ispaytype,
        CASE  
          WHEN "studenttype" = 'curresTest' THEN '函授'   
          WHEN "studenttype" = 'selfTest' THEN '自考'   
          WHEN "studenttype" = 'adultTest' THEN '成考'   
          ELSE studenttype
        END studentTypeName
        from ( ${selectSql} ${fromSql} union all ${unionSelectSql}  ${unionFromSql} ) t 
      ) d ` + whereSql

    console.log(compleSql + orderSql + breakSql);
    this.http
      .post(baseurl, { sql: compleSql + orderSql + breakSql })
      .subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          if (res.data && res.data.length) {
            this.listOfData = res.data;
            // let countSql = `select count(*) ${fromSql}  ${whereSql}`
            let countSql = `select count(*) from ( ${compleSql} ) m `
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
      console.log(id, this.object);
      let Query = new Parse.Query("Profile");
      Query.notEqualTo("isDeleted", true);
      Query.equalTo("objectId", id);
      let query = await Query.first();
      console.log(id, query);
      console.log(this.object['eduImage'], this.object['image']);
      if (query && query.id) {
        if (!this.object['eduImage']) {
          query.unset("eduImage")
        } else {
          query.set("eduImage", this.object['eduImage'])
        }
        if (!this.object['image']) {
          query.unset("image")
        } else {
          query.set("image", this.object['image']);
        }
        let res = await query.save();
        if (res && res.id) {
          console.log(res)
          this.cdRef.detectChanges()
        }
        this.getProfiles()
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
      let company = this.company;
      let pCompany = this.pCompany || this.company;
      let department = this.department;

      let beginTime
      let endTime
      let Recruit = new Parse.Query("RecruitStudent");
      let recruit = await Recruit.get(this.recruitId);
      if (recruit && recruit.id) {
        let recruitInfo = recruit.toJSON()
        beginTime = recruitInfo.beginTime.iso
        endTime = recruitInfo.endTime.iso
        console.log(beginTime, endTime)
      }

      // 考场  所属院校  关联院校

      let compleSql = '';
      let selectSql = `select distinct "pro"."objectId" , "pro"."name", "pro"."sex", "pro"."studentID", "pro"."idcard", "pro"."mobile", "pro"."lang", "pro"."createdAt", "pro"."image",
    "pro"."SchoolMajor", "major"."name" as "majorName", "pro"."studentType" as "studenttype", "log"."objectId" as "logObjectId", "log"."isVerified", "log"."isback", "pro"."eduImage",
     "cateOne"."name" as "cateonename", "cateTwo"."name" as "catetwoname", "pro"."cateOneObjectId", "pro"."cateTwoObjectId", "pro"."degreeNumber", "pro"."workid", "pro"."email", "pro"."nation",
     "pro"."polity", "pro"."school", "pro"."address", "pro"."birthdate", "pro"."postcode", "pro"."tel", "pro"."education", "pro"."area", "pro"."cardtype", "pro"."langCode", "pro"."cardnum", "pro"."serial",
      "class"."name" as "claName","class"."location", "class"."address" as "claAddress", "class"."beginTime" as "claBeginTime", "class"."endTime" as "claEndTime", "depa"."name" as "depaName" `
      // left join 
      // "Category" as "cate" on "cate"."objectId" = to_char("pro"."cates")
      let fromSql = ` from 
    (select "objectId", "name", "sex", "studentID", "idcard", "mobile", "lang", "SchoolMajor", "studentType", "eduImage", "image", "createdAt", "degreeNumber", "workid", "email", "nation",
    "polity", "school", "address", "birthdate", "postcode", "tel", "education", "area", "cardtype", "langCode", "cardnum", "serial", "department", "schoolClass",
     "cates"::text::json->>0 as "cateOneObjectId", "cates"::text::json->>1 as "cateTwoObjectId" 
      from "Profile" where "isDeleted" is not true and "company" = '${pCompany}' and "department" = '${department}' and "createdAt" >= '${beginTime}' and "createdAt" <= '${endTime}') as "pro"
    left join
    (select "objectId", "isVerified", "isback", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
      on substring("log"."orderId",2,10) = "pro"."objectId"
    left join
      (select "objectId", "name", "address", "location", "beginTime", "endTime" from "SchoolClass") as "class" on "class"."objectId" = "pro"."schoolClass" 
    left join
      (select "objectId", "name" from "Department") as "depa" on "depa"."objectId" = "pro"."department" 
    left join
      (select "objectId", "name" from "SchoolMajor") as "major" on "major"."objectId" = "pro"."SchoolMajor" 
    left join
      (select "objectId", "name" from "Category") as "cateOne" on "cateOne"."objectId" = "pro"."cateOneObjectId"::json->>'objectId'
    left join
      (select "objectId", "name" from "Category") as "cateTwo" on "cateTwo"."objectId" = "pro"."cateTwoObjectId"::json->>'objectId'
      where "log"."objectId" is null  `

      // let unionSelectSql = `select distinct "pro"."objectId", "pro"."name", "pro"."sex", "pro"."studentID", "pro"."idcard", "pro"."mobile", "pro"."lang",
      // "pro"."SchoolMajor", "major"."name" as "majorName", "pro"."studentType" as "studenttype", "log"."objectId" as "logObjectId", "log"."isVerified", "log"."isback", "pro"."eduImage",
      // "pro"."image", "pro"."createdAt", "cateOne"."name" as "cateonename", "cateTwo"."name" as "catetwoname", "pro"."cateOneObjectId", "pro"."cateTwoObjectId" `

      let unionFromSql = ` from  
    (select "objectId", "isVerified", "isback", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
    left join
    (select "objectId", "name", "sex", "studentID", "idcard", "mobile", "lang", "SchoolMajor", "studentType", "eduImage", "image", "createdAt", "degreeNumber", "workid", "email", "nation",
    "polity", "school", "address", "birthdate", "postcode", "tel", "education", "area", "cardtype", "langCode", "cardnum", "serial", "department", "schoolClass",
     "cates"::text::json->>0 as "cateOneObjectId", "cates"::text::json->>1 as "cateTwoObjectId" 
      from "Profile" where "isDeleted" is not true and "company" = '${pCompany}' and "department" = '${department}') as "pro"
      on (substring("log"."orderId",2,10) = "pro"."objectId")
    left join
      (select "objectId", "name", "address", "location", "beginTime", "endTime" from "SchoolClass") as "class" on "class"."objectId" = "pro"."schoolClass" 
    left join
      (select "objectId", "name" from "Department") as "depa" on "depa"."objectId" = "pro"."department" 
    left join
      (select "objectId", "name" from "SchoolMajor") as "major" on "major"."objectId" = "pro"."SchoolMajor"
    left join
      (select "objectId", "name" from "Category") as "cateOne" on "cateOne"."objectId" = "pro"."cateOneObjectId"::json->>'objectId'
    left join
      (select "objectId", "name" from "Category") as "cateTwo" on "cateTwo"."objectId" = "pro"."cateTwoObjectId"::json->>'objectId'
    `
      // "cates" @> '[{ "objectId": "${this.cateId}"}]' and
      console.log(this.cateId)
      if (this.cateId) {
        fromSql = ` from 
    (select "objectId", "name", "sex", "studentID", "idcard", "mobile", "lang", "SchoolMajor", "studentType", "eduImage", "image", "createdAt", "degreeNumber", "workid", "email", "nation",
    "polity", "school", "address", "birthdate", "postcode", "tel", "education", "area", "cardtype", "langCode", "cardnum", "serial", "department", "schoolClass",
     "cates"::text::json->>0 as "cateOneObjectId", "cates"::text::json->>1 as "cateTwoObjectId" 
      from "Profile" where "cates" @> '[{ "objectId": "${this.cateId}"}]' and "isDeleted" is not true and "company" = '${pCompany}' and "department" = '${department}' and "createdAt" >= '${beginTime}' and "createdAt" <= '${endTime}') as "pro"
    left join
    (select "objectId", "isVerified", "isback", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
      on substring("log"."orderId",2,10) = "pro"."objectId"
    left join
      (select "objectId", "name", "address", "location", "beginTime", "endTime" from "SchoolClass") as "class" on "class"."objectId" = "pro"."schoolClass" 
    left join
      (select "objectId", "name" from "Department") as "depa" on "depa"."objectId" = "pro"."department" 
    left join
      (select "objectId", "name" from "SchoolMajor") as "major" on "major"."objectId" = "pro"."SchoolMajor" 
    left join
      (select "objectId", "name" from "Category") as "cateOne" on "cateOne"."objectId" = "pro"."cateOneObjectId"::json->>'objectId'
    left join
      (select "objectId", "name" from "Category") as "cateTwo" on "cateTwo"."objectId" = "pro"."cateTwoObjectId"::json->>'objectId'
      where "log"."objectId" is null `

        unionFromSql = ` from  
    (select "objectId", "isVerified", "isback", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
    left join
    (select "objectId", "name", "sex", "studentID", "idcard", "mobile", "lang", "SchoolMajor", "studentType", "eduImage", "image", "createdAt", "degreeNumber", "workid", "email", "nation",
    "polity", "school", "address", "birthdate", "postcode", "tel", "education", "area", "cardtype", "langCode", "cardnum", "serial", "department", "schoolClass",
     "cates"::text::json->>0 as "cateOneObjectId", "cates"::text::json->>1 as "cateTwoObjectId" 
      from "Profile" where "cates" @> '[{ "objectId": "${this.cateId}"}]' and "isDeleted" is not true and "company" = '${pCompany}' and "department" = '${department}') as "pro"
      on (substring("log"."orderId",2,10) = "pro"."objectId")
    left join
      (select "objectId", "name", "address", "location", "beginTime", "endTime" from "SchoolClass") as "class" on "class"."objectId" = "pro"."schoolClass" 
    left join
      (select "objectId", "name" from "Department") as "depa" on "depa"."objectId" = "pro"."department" 
    left join
      (select "objectId", "name" from "SchoolMajor") as "major" on "major"."objectId" = "pro"."SchoolMajor"
    left join
      (select "objectId", "name" from "Category") as "cateOne" on "cateOne"."objectId" = "pro"."cateOneObjectId"::json->>'objectId'
    left join
      (select "objectId", "name" from "Category") as "cateTwo" on "cateTwo"."objectId" = "pro"."cateTwoObjectId"::json->>'objectId'
    `
      }

      let whereSql = ` where "d"."name" is not null `
      if (this.inputValue && this.inputValue.trim() != '') {
        whereSql += ` and "d"."${this.searchType.value}" like  '%${this.inputValue}%' `
      }

      let orderSql = `  order by "createdAt" desc `
      let breakSql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`

      compleSql =
        `select * from (
          select * ,
        CASE  
          WHEN "cateonename" is null and "catetwoname" is null THEN ''
          WHEN "cateonename" is not null and "catetwoname" is null THEN "cateonename"
          WHEN "cateonename" is not null and "catetwoname" is not null THEN concat_ws(' # ',cateonename,catetwoname)
        END catename,
        CASE  
          WHEN "isVerified" is not true and "isback" is not true THEN '未缴费'   
          WHEN "isVerified" is true and "isback" is not true THEN '已缴费'   
          WHEN "isVerified" is true and "isback" is true THEN '已退费'   
        END ispaytype,
        CASE  
          WHEN "studenttype" = 'curresTest' THEN '函授'   
          WHEN "studenttype" = 'selfTest' THEN '自考'   
          WHEN "studenttype" = 'adultTest' THEN '成考'   
          ELSE studenttype
        END studentTypeName
        from ( ${selectSql} ${fromSql} union all ${selectSql}  ${unionFromSql} ) t 
      ) d ` + whereSql + orderSql

      console.log(compleSql);

      this.novaSql(compleSql).then(data => {
        console.log(data);
        if (data && data.length) {
          let dataLen = data.length;
          for (let index = 0; index < dataLen; index++) {
            let item = data[index];
            item.claBeginTime = this.dateFmt.transform(item.claBeginTime, 'yyyy/MM/dd HH:mm:ss')
            item.claEndTime = this.dateFmt.transform(item.claEndTime, 'yyyy/MM/dd HH:mm:ss')
            item.idcard = item.idcard ? "'" + item.idcard : "";
            item.workid = item.workid ? "'" + item.workid : "";
            item.degreeNumber = item.degreeNumber ? "'" + item.degreeNumber : item.degreeNumber;
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
