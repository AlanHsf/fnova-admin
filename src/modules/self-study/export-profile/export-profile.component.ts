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
  selector: 'app-export-profile',
  templateUrl: './export-profile.component.html',
  styleUrls: ['./export-profile.component.scss'],
  providers: [DatePipe]
})
export class ExportProfileComponent implements OnInit {
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
      title: '学生类别',
      value: 'identyType',
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
      title: '报考专业',
      value: 'majorName',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '报考专业代码',
      value: 'majorCode',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '学生姓名',
      value: 'name',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '证件号码',
      value: 'idcard',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '户籍',
      value: 'state',
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
      title: '民族',
      value: 'nation',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '前置学历',
      value: 'positionPart',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '职业',
      value: 'position',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '电话',
      value: 'mobile',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '班级',
      value: 'classType',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
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
    this.require = [
      {
        headerName: '学生类别',
        field: 'identyType'
      },
      {
        headerName: '学生类别代码',
        field: 'identyTypeCode'
      },
      {
        headerName: '准考证号',
        field: 'studentID'
      },
      {
        headerName: '报考专业',
        field: 'majorName'
      },
      {
        headerName: '报考专业代码',
        field: 'majorCode'
      },
      {
        headerName: '学生姓名',
        field: 'name'
      },
      {
        headerName: '证件号码',
        field: 'idcard'
      },
      {
        headerName: '户籍',
        field: 'state'
      },
      {
        headerName: '户籍代码',
        field: 'stateCode'
      },
      {
        headerName: '政治面貌',
        field: 'polity'
      },
      {
        headerName: '政治面貌代码',
        field: 'polityCode'
      },
      {
        headerName: '民族',
        field: 'nation'
      },
      {
        headerName: '民族代码',
        field: 'nationCode'
      },
      {
        headerName: '前置学历',
        field: 'positionPart'
      },
      {
        headerName: '前置学历代码',
        field: 'positionPartCode'
      },
      {
        headerName: '职业',
        field: 'position'
      },
      {
        headerName: '职业代码',
        field: 'positionCode'
      },
      {
        headerName: '电话',
        field: 'mobile'
      },
      {
        headerName: '班级',
        field: 'classType'
      }
    ];
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

    let selectSql = `select *`

    let fromSql = ` from 
      (select "identyType","studentID","name","idcard","state","polity","nation","positionPart","position","mobile","classType","SchoolMajor","departments","createdAt" 
        from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      left join 
        (select "objectId","name" as "majorName","majorCode" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on "pro"."SchoolMajor" = "major"."objectId" `

    let whereSql = ` where 1 = 1 `
    if (this.department) {
      whereSql += ` and "pro"."departments" @> '[{ "objectId": "${this.department}"}]' `
    } else if (this.centerId) {
      whereSql += ` and "pro"."departments" @> '[{ "objectId": "${this.centerId}"}]' `
    }

    if (this.inputValue && this.inputValue.trim() != '') {
      whereSql += ` and "${this.searchType.value}" like  '%${this.inputValue}%' `
    }

    let orderSql = ` order by "pro"."createdAt" desc `
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
      let selectSql = `select *`

      let fromSql = ` from 
      (select "identyType","studentID","name","idcard","state","polity","nation","positionPart","position","mobile","classType","SchoolMajor","departments","createdAt" 
        from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      left join 
        (select "objectId","name" as "majorName","majorCode" from "SchoolMajor" where "company" = '1ErpDVc1u6') as "major"
          on "pro"."SchoolMajor" = "major"."objectId" `

      let whereSql = ` where 1 = 1 `
      if (this.department) {
        whereSql += ` and "pro"."departments" @> '[{ "objectId": "${this.department}"}]' `
      } else if (this.centerId) {
        whereSql += ` and "pro"."departments" @> '[{ "objectId": "${this.centerId}"}]' `
      }

      if (this.inputValue && this.inputValue.trim() != '') {
        whereSql += ` and "${this.searchType.value}" like  '%${this.inputValue}%' `
      }

      let orderSql = ` order by "pro"."createdAt" desc `

      compleSql = `${selectSql} ${fromSql} ${whereSql} ${orderSql} `
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
            // 类别
            item.identyTypeCode = item.identyType ? this.identTypeCheck(item.identyType) : "";
            //户籍
            item.stateCode = item.state ? this.stateCheck(item.state) : "";
            //面貌
            item.polityCode = item.state ? this.polityCheck(item.polity) : "";
            //民族
            item.nationCode = item.nation ? (item.nation.indexOf('族') == -1 ? this.nationCheck(item.nation) : this.nationCheck(item.nation.substring(0,item.nation.indexOf('族')))) : '' ;
            //学历
            item.positionPartCode = item.positionPart ? this.positionPartCheck(item.positionPart) : "";
            //职业
            item.positionCode = item.position ? this.positionCheck(item.position) : "";
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

  // 考生类型匹配
  identTypeCheck(value) {
    if (!value) {
      return
    }
    switch (value) {
      case "试点":
        return '2'
      case "衔接":
        return '3'
      case "二学历":
        return '4'
      default: ;
    }
  }
  // 户籍匹配
  stateCheck(value) {
    if (!value) {
      return
    }
    switch (value) {
      case "城镇":
        return '1'
      case "农村":
        return '2'
      default: ;
    }
  }
  // 面貌匹配
  polityCheck(value) {
    if (!value) {
      return
    }
    switch (value) {
      case "党员":
        return '1'
      case "团员":
        return '2'
      case "其他":
        return '3'
      default: ;
    }
  }
  // 民族匹配
  nationCheck(value) {
    console.log(value)
    if (!value) {
      return
    }
    if (value != '其他' && value != '外国血统' && value != '未采集') {
      return this.nationList.indexOf(value) + 1
    } else {
      switch (value) {
        case "其他":
          return "97";
        case "外国血统":
          return "98"
        case "未采集":
          return "255"
        default: ;
      }
    }
  }
  // 学历匹配
  positionPartCheck(value) {
    if (!value) {
      return
    }
    switch (value) {
      case "本科以上":
        return '1'
      case "本科":
        return '2'
      case "大专(专科)":
        return '3'
      case "中专(中校)":
        return '4'
      case "高中(职高)":
        return '5'
      case "初中及初中以下":
        return '6'
      default: ;
    }
  }
  // 职业匹配
  positionCheck(value) {
    if (!value) {
      return
    }
    switch (value) {
      case "中国共产党中央委员会和地方各级组":
        return '1'
      case "国家机关及其工作机构负责人":
        return '2'
      case "民主党派和社会团体及其工作机构负":
        return '3'
      case "事业单位负责人":
        return '4'
      case "企业负责人":
        return '5'
      case "军人":
        return '8'
      case "不便分类的其他从业人员":
        return '9'
      case "待业、失业及无业人员":
        return '10'
      case "科学研究人员":
        return '11'
      case "工程技术人员":
        return '13'
      case "农业技术人员":
        return '17'
      case "飞机和船舶技术人员":
        return '18'
      case "卫生专业技术人员":
        return '19'
      case "经济业务人员":
        return '21'
      case "金融业务人员":
        return '22'
      case "法律专业人员":
        return '23'
      case "教学人员":
        return '24'
      case "文学艺术工作人员":
        return '25'
      case "体育工作人员":
        return '26'
      case "新闻出版、文化工作人员":
        return '27'
      case "宗教职业者":
        return '28'
      case "其他专业技术人员":
        return '29'
      case "学生":
        return '30'
      case "行政办公人员":
        return '31'
      case "安全保卫和消防人员":
        return '32'
      case "邮政和电信业务人员":
        return '33'
      case "其他办事人员和有关人员":
        return '39'
      case "购销人员":
        return '41'
      case "仓储人员":
        return '42'
      case "餐饮服务人员":
        return '43'
      case "饭店、旅游及健身娱乐场所服务人员":
        return '44'
      case "运输服务人员":
        return '45'
      case "医疗卫生辅助服务人员":
        return '46'
      case "社会服务和居民生活服务人员":
        return '47'
      case "其他商业、服务业人员":
        return '49'
      case "种植业生产人员":
        return '51'
      case "林业生产及野生动植物保护人员":
        return '52'
      case "畜牧业生产人员":
        return '53'
      case "渔业生产人员":
        return '54'
      case "水利设施管理养护人员":
        return '55'
      case "其他农、林、牧、渔、水利业生产人":
        return '59'
      case "勘测及矿物开采人员":
        return '61'
      case "金属冶炼、轧制人员":
        return '62'
      case "化工产品生产人员":
        return '64'
      case "机械制造加工人员":
        return '66'
      case "机电产品装配人员":
        return '67'
      case "机械设备修理人员":
        return '71'
      case "电力设备安装、运行、检修及供电人":
        return '72'
      case "电子元器件与设备制造、装配、调试":
        return '73'
      case "橡胶和塑料制品生产人员":
        return '74'
      case "纺织、针织、印染人员":
        return '75'
      case "裁剪、缝纫和皮革、毛皮制品加工制":
        return '76'
      case "粮油、食品、饮料生产加工及饲料生":
        return '77'
      case "烟草及其制品加工人员":
        return '78'
      case "药品生产人员":
        return '79'
      case "木材加工、人造板生产、木制品制作":
        return '81'
      case "建筑材料生产加工人员":
        return '82'
      case "玻璃、陶瓷、搪瓷及其制品生产加工":
        return '83'
      case "广播影视制品制作、播放及文物保护":
        return '84'
      case "印刷人员":
        return '85'
      case "工艺、美术品制作人员":
        return '86'
      case "文化教育、体育用品制作人员":
        return '87'
      case "工程施工人员":
        return '88'
      case "运输设备操作人员及有关人员":
        return '91'
      case "环境监测与废物处理人员":
        return '92'
      case "检验、计量人员":
        return '93'
      case "其他生产、运输设备操作人员及有关":
        return '99'
      case "未采集":
        return '255'
      default: ;
    }
  }

  nationList = ["汉",
    "蒙古",
    "回",
    "藏",
    "维吾尔",
    "苗",
    "彝",
    "壮",
    "布依",
    "朝鲜",
    "满",
    "侗",
    "瑶",
    "白",
    "土家",
    "哈尼",
    "哈萨克",
    "傣",
    "黎",
    "傈僳",
    "佤",
    "畲",
    "高山",
    "拉祜",
    "水",
    "东乡",
    "纳西",
    "景颇",
    "柯尔克孜",
    "土",
    "达斡尔",
    "仫佬",
    "羌",
    "布朗",
    "撒拉",
    "毛难",
    "仡佬",
    "锡伯",
    "阿昌",
    "普米",
    "塔吉克",
    "怒",
    "乌孜别克",
    "俄罗斯",
    "鄂温克",
    "崩龙",
    "保安",
    "裕固",
    "京",
    "塔塔尔",
    "独龙",
    "鄂伦春",
    "赫哲",
    "门巴",
    "珞巴",
    "基诺",
    "其他",
    "外国血统",
    "未采集"]

}