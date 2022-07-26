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
  selector: 'app-cate-profile',
  templateUrl: './cate-profile.component.html',
  styleUrls: ['./cate-profile.component.scss']
})
export class CateProfileComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private message: NzMessageService, private cdRef: ChangeDetectorRef, private http: HttpClient) { }
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
  listExportOfColumn = [
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
      title: '考场位置',
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
    }
  ];
  listOfColumn = [
    // {
    //   title: '姓名',
    //   value: 'name',
    //   type: 'String',
    //   compare: null,
    //   priority: false
    // },
    // {
    //   title: '性别',
    //   value: 'sex',
    //   type: 'String',
    //   compare: null,
    //   priority: false
    // },
    // {
    //   title: '学号',
    //   value: 'studentID',
    //   type: 'String',
    //   compare: null,
    //   priority: false
    // },
    // {
    //   title: '身份证号',
    //   value: 'idcard',
    //   type: 'String',
    //   compare: null,
    //   priority: false
    // },
    // {
    //   title: '手机号码',
    //   value: 'mobile',
    //   type: 'String',
    //   compare: null,
    //   priority: false
    // },
    // {
    //   title: '所属专业',
    //   value: 'SchoolMajor',
    //   type: 'Pointer',
    //   compare: null,
    //   priority: false
    // },
    // {
    //   title: '考点',
    //   value: 'cates',
    //   type: 'Array',
    //   compare: null,
    //   priority: false
    // },
    // {
    //   title: '层次',
    //   value: '',
    //   type: 'Number',
    //   compare: null,
    //   priority: false

    // },

  ];
  listOfData: any = [];
  filterData: any = [];
  filterType: string;
  filterLen: number;
  isLoading: boolean = true;
  count: number;

  // 筛选
  inputValue: string;
  searchType: any = "name";
  // edit
  isVisibleEditModal: boolean = false;
  className: 'Profile';
  proField: any;
  object: any;
  route: any;// devroute
  keys: any;
  editFields: any;
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.department = localStorage.getItem("department");
      this.company = localStorage.getItem("company");
      if (this.department && this.company) {
        let Company = new Parse.Query("Company");
        let company = await Company.get(this.company);
        this.pCompany = company.get("company").id;
        let user = Parse.User.current();
        if (user && user.get("cates")) {
          this.cate = user.get("cates")[0]
          this.cateId = user.get("cates")[0].id
        }
        console.log(user)
      }
      // if (!this.department) {
      //   this.listOfColumn.splice(0, 0, {
      //     title: '院校',
      //     value: 'department',
      //     type: 'Pointer',
      //     compare: null,
      //     priority: false
      //   })
      // }
      await this.getDevRoute();
      this.getProfiles();
      this.getCount()
      this.getProfileSchema();
      this.getExportData();

      // this.compLog();
      // this.removeUser('UmjXxAjvBK')
      // this.bindUser('UmjXxAjvBK')
      // this.completeProfile()

    })
  }
  async bindUser(department) {
    let bindCount = 0;
    let Profile = new Parse.Query("Profile");
    Profile.notEqualTo("isDeleted", true);
    Profile.equalTo('department', department);
    // Profile.equalTo('company', this.pCompany);
    Profile.doesNotExist('user');
    Profile.exists('RecruitArray');
    Profile.include('user');
    Profile.select("idcard", "mobile", "user");
    Profile.limit(50000);
    let profiles = await Profile.find();
    console.log(profiles.length);
    for (let index = 0; index < profiles.length; index++) {
      let profile = profiles[index];
      let user = profile.get('user');
      let log = await this.getLog(profile.id)
      if (profile && !user && log) {
        let user = await this.getUser(profile.get("idcard"), profile.get("mobile"));
        if (user && user.id) {
          profile.set("user", {
            "className": "_User",
            "__type": "Pointer",
            "objectId": user.id
          });
          let data = await profile.save()
          if (data && data.id) {
            bindCount += 1;
            console.log(`已绑定：${bindCount}条`);
            console.log(profile.get("idcard"));
          }
        }
      }
    }
  }
  async getLog(id) {
    let AccountLog = new Parse.Query("AccountLog");
    AccountLog.equalTo('company', this.pCompany);
    AccountLog.contains('orderId', id);
    AccountLog.equalTo('isVerified', true);
    AccountLog.notEqualTo('isback', true);
    let log = await AccountLog.first();
    if (log && log.id) {
      return log;
    }
  }
  async getUser(idcard, mobile) {
    let createCount = 0;
    let User = new Parse.Query("_User");
    User.equalTo('company', this.pCompany);
    User.equalTo('idcard', idcard);
    User.contains('username', idcard);
    let user = await User.first();
    if (user && user.id) {
      return user;
    } else {
      let newUser = Parse.Object.extend("_User");
      let newuser = new newUser();
      newuser.set("username", this.pCompany + idcard)
      newuser.set("password", '123456')
      newuser.set("idcard", idcard)
      newuser.set("mobile", mobile)
      let news = await newuser.save(null, { useMasterKey: true });
      if (news && news.id) {
        createCount += 1;
        console.log(`已创建：${createCount}条`);
        console.log(idcard);
      }
    }
  }
  async removeUser(department) {
    /* 
    profile 和 user idcard 
      一致,无需修改
      不一致  解绑
        查找数据库中是否有对应idcard的user
          有  绑定
          无  创建 绑定 
    */
    let revCount = 0;
    let rightCount = 0;
    let Profile = new Parse.Query("Profile");
    Profile.notEqualTo("isDeleted", true);
    Profile.equalTo('department', department);
    // Profile.equalTo('company', this.pCompany);
    Profile.exists('user');
    Profile.include('user');
    Profile.select("idcard", "mobile", "user");
    Profile.limit(50000);
    let profiles = await Profile.find();
    console.log(`已存在：${profiles.length}条`, profiles);
    for (let index = 0; index < profiles.length; index++) {
      let profile = profiles[index];
      let user = profile.get('user');
      if (this.pCompany != profile.get("company")) {
        console.log(profile.get("company"));
      }
      if (user && user.get("idcard") && profile.get("idcard") != user.get("idcard")) {
        profile.set("user", null);
        let data = await profile.save();
        if (data && data.id) {
          revCount += 1;
          console.log(`已解绑：${revCount}条`);
        }
      } else {
        rightCount += 1;
        console.log(profile);
        console.log(`正确：${rightCount}条`);

      }
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
    for (let index = 0; index < editFields.length; index++) {
      const field = editFields[index];
      if (JSON.stringify(displayedColumns).indexOf(field['key']) != -1) {
        this.listOfColumn.push({
          title: field['name'],
          value: field['key'],
          type: field['type'],
          compare: null,
          priority: false
        })
      }
    }
    this.listOfColumn.splice(this.listOfColumn.length, 0, {
      title: '操作',
      value: '',
      type: '',
      compare: null,
      priority: false
    })

  }
  async getProfileSchema() {
    const mySchema = new Parse.Schema('Profile');
    let proSche: any = await mySchema.get();
    console.log(proSche);
    this.proField = proSche.fields;

  }
  require: any = [];
  fileds: any;
  getExportData() {
    this.require = [];
    this.listExportOfColumn.forEach(col => {
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
  async getProfiles(skip?, inputVal?) {
    let company = this.company;
    let pCompany = this.pCompany;
    let department = this.department;
    let Profile = new Parse.Query("Profile");
    Profile.notEqualTo("isDeleted", true);
    Profile.equalTo("department", department);
    Profile.equalTo("company", pCompany);
    Profile.include("SchoolMajor");
    Profile.descending("createdAt");
    if (this.cate) {
      console.log(this.cate)
      Profile.containedIn("cates", [{
        "className": "Category", "__type": "Pointer", "objectId": this.cate.id
      }]);
    }
    if (this.inputValue && this.inputValue.trim() != '') {
      Profile.contains(this.searchType, this.inputValue);
    }
    if (skip && this.pageSize > 0) {
      Profile.skip((this.pageIndex - 1) * this.pageSize);
    }
    Profile.limit(this.pageSize);
    let proArr:any = await Profile.find();
    if (proArr && proArr.length) {
      let proLen = proArr.length;
      for (let index = 0; index < proArr.length; index++) {
        let cates = proArr[index].get("cates");
        if (cates && cates[0]) {
          proArr[index].get("cates")[0] = await this.getCate(cates);
        }
        console.log(proArr[index])
        console.log(proArr[index].attributes.studentType)

        switch (proArr[index].get("studentType")) {
          case "curresTest":
            proArr[index].studentType = "函授";
            break;
          case "selfTest":
            proArr[index].studentType = "自考";
            break;
          case "adultTest":
            proArr[index].studentType = "成考";
            break;
          default:;
        }

        if (index + 1 == proLen) {
          this.listOfData = proArr;
          this.filterLen = await this.getCount();
          this.filterData = proArr;
          this.isLoading = false;
        }
      }
    } else {
      this.filterData = [];
      this.filterLen = 0;
      this.isLoading = false;
    }
    console.log(proArr);
    return

  }
  pageChange(e) {
    this.getProfiles(10)
  }
  async getCate(cates) {
    console.log(cates)
    let Category = new Parse.Query("Category");
    let cate = await Category.get(cates[0].id);
    if (cate && cate.id) {
      return cate;
    }
  }
  async getCount() {
    let Profile = new Parse.Query("Profile");
    Profile.notEqualTo("isDeleted", true);
    Profile.equalTo("department", this.department);
    Profile.equalTo("company", this.pCompany);
    if (this.cate) {
      Profile.containedIn("cates", [{
        "className": "Category", "__type": "Pointer", "objectId": this.cate.id
      }]);
    }
    if (this.inputValue && this.inputValue.trim() != '') {
      Profile.contains(this.searchType, this.inputValue);
    }
    let count = await Profile.count();
    return count;
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
    this.searchType = e;
  }
  async searchStudent() {
    if (!this.inputValue) {
      this.filterLen = await this.getCount();
      this.getProfiles()
      return;
    }
    this.inputValue = this.inputValue.trim();
    await this.getProfiles(null, this.inputValue)
    this.cdRef.detectChanges();
  }

  async operate(type, data?) {
    if (type == 'edit') {
      console.log(data.attributes);
      this.object = data.toJSON();
      console.log(this.object);
      this.isVisibleEditModal = true;
    }
    if (type == 'save') {
      this.isVisibleEditModal = false;
      // data.save().then(res => {
      //   console.log(res);
      //   this.filterData = this.filterData.filter((item: any) => { return item.id != data.id })
      //   this.cdRef.detectChanges();
      // })
    }

  }
  // 补充缴费数据
  async compLog() {
    console.log('开始');
    let Arr = [
      // "CCmLblwWIx0202192521950972",
      // "CvlAdve7lUc2021925211219968",
      // "CLAQLeyc5vY2021925211139547",
      // "CV3BJgdFz3y2021925211835840",
      // "C4KXET89W1m202192521202611",

      // "CkA9x1aPmU420219261115686",
      // "CA1qBMFSi7j202192685557789",
      // "Cj2qgCgchNk202192692148293",
      // "Cg7Q7zg5SH9202192610434607",
      // "C3RhPCYLIwT2021926104714763",
      // "CIiPBrtWNuA2021926114342925",
      // "COLTEBb85sh2021926123838577",
      // "CRj1Z5oGoMA2021926171335955",
      // "CHYkYAFLV4E202192618252265",
      // "C4mq6uSGaDP202192619391590",
      // "CHp9DFBELPq2021926211232277",
      // "CdIu4CMQcQS20219262364621",
      // "CRkx3JRgsrS202192783431889",
      // "CqyBkPDHJYf20219279465848",
      // "ClQrCwiDP4D2021927105211937",
      // "CPzsoqBB9FT202192712298109",
      // "CffLGFWKo8V2021927141422870",

      // "C6A6LddruCl202192810450258",
      // "CnWjnivbslW20219287508446",
      // "CCiInu2mNF52021927233858392",
      // "CVdLIyvIhBj202192722719201",
      // "CNwUaHaAnC9202192719313755",
      // "CKK9CTMXjtq2021927192646276",
      // "CVRPUgrzJMx2021927152511675",

      // "CvpsSDzZBtd202192414232740",
      // "Cesc6M1cJGp202192614504396",
      // "CNDso13Dt2s2021925103731609",
      // "CkKCchBVqGY202192510121610",
      // "CkXkjEqK2cb2021925102837968",
      // "CjoSaS9uSeI2021926154352209",
      // "Cn9zEoO6Ht62021927135425832",
      // "CqlXnqnHSwm202192716131310",
      // "CEIQJGj9UyD2021927201056738",
      // "Cp7qwzf4s2r2021924164022848",

      // "CXSRXJrojFK20219261312558",
      // "CjoSaS9uSeI2021926154354409",
      // "CTXgtUBhaOa202192413319861",
      // "CdWMyk6oiae202192719728115",
      // "CrbVdbEJ5sE202193016373974",
      // "CaDF8h9D6Xt2021930164253769",
      // "C4XcWBHGBVl2021924152726913",
      // "CsCVYZtKTNh202193015228363",
      // "CLUDxG9eD582021929155925849",
      // "CPGRjfhNTFS2021930133312373",
      // "CLX543ovwpi2021930154141561",
      // "CnjFxSybWXj202193019573383",
      // "C6lshJ3Qf6b2021929221359995",
      // "CPWMAwLgQ9v2021925121459135",
      // "CQSdTISeYDO20219271455961",
      // "CEWnXXDAS7I2021930193037149",

      // 支付宝已缴费
      // "CvlAdve7lUc2021925211219968",
      // "Cj2qgCgchNk202192692148293",
      // "CqyBkPDHJYf20219279465848",
      // "CLAQLeyc5vY2021925211139547",
      // "C4KXET89W1m20219252120261",
      // "CUfPJ88rnCi2021928114428785",
      // "CpOyFVv8m5h2021928134915244",
      // "C3RhPCYLIwT2021936164613960",
      // "C5O9SuO3cmg2021928185945556",
      // "CJBO0mIL7Te2021929939326",
      // "C4BoZ3RYCLZ2021928163433183",
      // "CThfOISG3cW20219300344473",
      // "CThfOISG3cW202193096992",

      // "CeOj3aIeTKq202193018259592",
      // "CqZCAt8fOKT20219301613191",
      // "CLzwk1QnMFv2021930115912173",
      // "ClRdTyCYQJk202193095936442",
      // "CHEuORCRHET202192918118877",
      // "CcbBVIMUfty2021929143940367",
      // "CmoYX78RBs7202192820252386",
      // "CE00rOS6BlU2021928194940433",
      // "Cx1W5jc2rwf2021928183151511",
      // "CRJkmJM3GEH2021928172241118",



      // 南昌大学
      // "CYiTAyg0xIo2021927161152128",
      // "CGQSqE2Vajm2021925194420815",
      // "CdprlBG0sYK202192715403518",
      // "CbUiDpZ6pX92021925192028632",
      // "CgzcxqbVOO5202192520348847",
      // "COMzQW408o92021925192939982",
      // "CoQmU00xvne202192492810777",
      // "CmlWt0av6eK2021925202626452",
      // "Co0CC8lBU0w20219252000215",
      // "CCMpqT3wX0o20219252014628",
      // "CO0EVAcBlEc2021926101016636",
      // "CG73gWvM5jd2021925205751125",
      // "CgQjYPUCz0x202192415352371",
      // "CyVlGzpCF98202192520150773",
      // "CUkE8X3S7vd202192519147551",
      // "ChsTM6bA0xB2021924224420911",
      // "CLYnc8c12YB2021925191922845",
      // "CVaJIBiz2cV202192520179500",
      // "CNvNERrWaFm202192682815366",
      // "CCk45PO4wFx202192622133993",
      // "CUx74RDJMkX2021925203023912",
      // "CJarndFpWXd2021925192216938",
      // "CmVu5rPmsKv2021925195728527",
      // "CnCLPE89c1E2021925195543873",
      // "CXPeBGMhHOH2021925194757109",
      // "C5vgehry7PR2021925194738797",
      // "CC7ftZ1kqNh2021925194144467",
      // "CA9WC5mNIZT2021925195146461",
      // "CGjh9NOHz2t2021925193850231",
      // "CY90xvzyCLW202192220465793",
      // "CfHHFaOEOEQ2021925195051244",
      // "CKBFC4AMx6n2021926211957326",
      // "CBCkUZok9g42021925202311963",
      // "CySHLS2Q0N620219252055016",
      // "CWCKdFLq7LS2021925203127549",
      // "CoDA4znBNxC20219252003490",
      // "Cec0ppr5n7W2021925191657797",
      // "CD3XkaN5PAI2021925191022319",
      // "CvDwtwpYAek20219252043977",
      // "CE3rexc0Hl8202192519537584",
      // "CGst2m64Het202192519154435",
      // "CklT5qEKGfN2021925194343599",
      // "CRuUGK1FGRa202192520131668",
      // "CvT2fcKPIhL2021925195831706",
      // "CtaiCaKSgoW2021925201533331",
      // "CnZh4ZmSnjX2021925193822241",
      // "C7f0fBBVyjF2021925195349872",
      // "CtsAf8xCWIT2021925195431875",
      // "C3Lj3mkFvcm2021925194652180",
      // "CPZecyd2Fum2021925192619223",
      // "CyBljVWi8GE2021925201947885",
      // "CRkN9eKcD742021925194317762",
      // "CSpQ4E2DrgG202192519542957",
      // "CXpEwmzfKka2021925194754706",
      // "C4pho9vrTJv202192519197913",
      // "CLagtwkZcRB2021925194827474",
      // "CqYeSCXV7gI202192519380101",
      // "C93sclr9FGe2021925195311443",
      // "Cjc2XPMGJbB202192519403580",
      // "CPuy3eMobLz2021925202337790",
      // "CN5Gh1i0XeM2021925203525149",
      // "CsBmiDh4JEN2021925205447120",
      // "CgPEwGY3EAJ202192520348662",
      // "CLytJko2nWI2021925205732269",
      // "Ce5E6MbRaRe202192520274695",
      // "CuLe8TRO9E82021925203532918",
      // "CVbrSEw2pNV2021925204456714",
      // "CkNsIEBoczv2021925202140342",
      // "CJvBAJb6vIp2021925194134857",
      // "Cm81nVxuutX2021925203018121",
      // "CGXZY8PZFtH202192520437631",
      // "CtaypCnCxHZ2021925194758994",
      // "Cd6kqGIJ9He202192520112783",
      // "CmAGKOnlPyD2021925205852681",
      // "CjA2vHnzCYL202192519139142",
      // "C4qQcr7WTrk2021925193740559",
      // "ChOz9TAI1Fh2021925192714151",
      // "C83GC6Eu80N2021925201751788",
      // "CV3Q11o4rAJ202192592553557",
      // "C8V0xVN2EZG2021923143139170",
      // "Cq0xuzztOzp2021922185541198",

      // "CnMYN72sd1b2021927161837496",
      // "C4pho9vrTJv202192519197913",
      // "CA9WC5mNIZT2021925195146461",

      // "CbRLYUDuKRG2021928141521341",
      // "C5vgehry7PR2021925194738797",
      // "CRm1GbRF4wx2021923141317311",
      // "C3kfTmyTe3D202192412042522",
      // "CjAKU77i9kf2021927104944120",
      // "CcjUNw33mjB202192963134",
      // "C7EYDtA3CcQ202192923244404"
      // "C0x25wcYPko2021929161713302",
      // "C0x25wcYPko2021929162023478",
      // "CF3DDc41dOl2021929172326440",
      // "CF3DDc41dOl202192916513981",
      // "CAW2K5mKpDM202192822454905",
      // "Ci7Cyozqs0x2021930102152298",
      // "CaMfYW0xHp42021927165645943",
      // "CGXZY8PZFtH2021926153432142",
      // "CzTsJkjg0LX2021928211414439",
      // "CUJXf0DKCDA2021929155338686",
      // "C3DCKbuuDFh2021929221224565",
      // "C0xlRO16fGk202193018137873",
      // "CzL64yW9yWn2021930132621164",
      // "CMoQHoNb0ie202193015514294",

    ];
    console.log(`待保存记录${Arr.length}条`);
    for (let index = 0; index < Arr.length; index++) {
      let tradeNo = Arr[index];
      // 南昌大学
      // await this.complete(tradeNo, '6wVCbfO3GM', "ystPay")// 南昌大学 6wVCbfO3GM 江西理工 3wAJlBgNH2
      // 江西理工
      // await this.complete(tradeNo, '3wAJlBgNH2', "alisdk")// 南昌大学 6wVCbfO3GM 江西理工 3wAJlBgNH2
      // await this.complete(tradeNo, '3wAJlBgNH2', "wxsdk")// 南昌大学 6wVCbfO3GM 江西理工 3wAJlBgNH2
    }
  }
  async complete(tradeNo, recruitId, orderType) {
    let profileId = tradeNo.substring(1, 11);
    console.log(profileId);
    try {
      let Profile = new Parse.Query("Profile");
      Profile.notEqualTo("isDeleted", true);
      Profile.equalTo("objectId", profileId);
      let profile = await Profile.first();
      if (profile && profile.id) {
        this.updataProfile(profile, recruitId)
        let log = await this.getAccLog(profile.get("department"), tradeNo);
        console.log(log)
        if (log && log.id) {
          log.set("isVerified", true);
          log.save();
        } else {
          let AccountLog = Parse.Object.extend("AccountLog");
          let accountLog = new AccountLog();
          accountLog.set("isVerified", true);
          accountLog.set("orderType", `5beidD3ifA-${orderType}`);
          accountLog.set("assetCount", 60);
          accountLog.set("orderId", tradeNo);
          accountLog.set("remark", profile.get("name") + profile.get("idcard"));
          accountLog.set("targetName", profile.get("department").id);
          accountLog.set("desc", `${recruitId}_学位外语报名缴费`);
          accountLog.set("orderNumber", tradeNo);
          accountLog.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: this.pCompany,
          });
          let accLog = await accountLog.save();
          console.log('生成支付订单')
          if (accLog && accLog.id) {
            console.log(accLog);
          } else {
            console.log(tradeNo);
          }
        }
      }
    } catch {
      console.log('无对应profile', tradeNo);
    }
  }
  async getAccLog(department, tradeNo) {
    let AccountLog = new Parse.Query("AccountLog");
    AccountLog.equalTo("targetName", department.id);
    AccountLog.equalTo("orderId", tradeNo);
    let log = await AccountLog.first();
    return log;
  }
  updataProfile(profile, recruitId) {
    let recArr;
    recArr = [
      {
        __type: "Pointer",
        className: "RecruitStudent",
        objectId: recruitId,
      }
    ];
    profile.set("RecruitArray", recArr)
    profile.save();
  }

  // ag-grid 生命周期
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  exportData() {
    this.gridApi.exportDataAsExcel();
  }
  // 导出函数 :
  exprotData;
  async export() {
    this.rowData = [];
    this.showExport = true;
    console.log(this.filterData);
    this.exprotData = await this.getTotalStudents();
    this.exprotData.forEach(data => {
      console.log(data);
      if (data) {
        this.rowData.push(data);
      }
    })
    console.log(this.rowData)
  }


  getTotalStudents() {
    return new Promise(async (resolve, reject) => {
      let company = this.company;
      let pCompany = this.pCompany || this.company;
      let department = this.department;

      let compleSql = '';
      let selectSql = `select distinct "pro"."objectId" , "pro"."name", "pro"."sex", "pro"."studentID", "pro"."idcard", "pro"."mobile", "pro"."lang", "pro"."createdAt", "pro"."image",
    "pro"."SchoolMajor", "major"."name" as "majorName", "pro"."studentType" as "studenttype", "pro"."eduImage",
     "cateOne"."name" as "cateonename", "cateTwo"."name" as "catetwoname", "pro"."cateOneObjectId", "pro"."cateTwoObjectId", "pro"."degreeNumber", "pro"."workid", "pro"."email", "pro"."nation",
     "pro"."polity", "pro"."school", "pro"."address", "pro"."birthdate", "pro"."postcode", "pro"."tel", "pro"."education", "pro"."area", "pro"."cardtype", "pro"."langCode", "pro"."cardnum", "pro"."serial",
      "class"."name" as "claName", "class"."address" as "claAddress", "depa"."name" as "depaName" `

    // left join
    // "Category" as "cate" on "cate"."objectId" = to_char("pro"."cates")
    let fromSql = ` from 
    (select "objectId", "name", "sex", "studentID", "idcard", "mobile", "lang", "SchoolMajor", "studentType", "eduImage", "image", "createdAt", "degreeNumber", "workid", "email", "nation",
    "polity", "school", "address", "birthdate", "postcode", "tel", "education", "area", "cardtype", "langCode", "cardnum", "serial", "department", "schoolClass",
     "cates"::text::json->>0 as "cateOneObjectId", "cates"::text::json->>1 as "cateTwoObjectId" 
      from "Profile" where "isDeleted" is not true and "company" = '${pCompany}' and "department" = '${department}') as "pro"
    left join
      (select "objectId", "name", "address" from "SchoolClass") as "class" on "class"."objectId" = "pro"."schoolClass" 
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
      from "Profile" where "cates" @> '[{ "objectId": "${this.cateId}"}]' and "isDeleted" is not true and "company" = '${pCompany}' and "department" = '${department}') as "pro"
    left join
      (select "objectId", "name", "address" from "SchoolClass") as "class" on "class"."objectId" = "pro"."schoolClass" 
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

    compleSql =
      `select * from (
          select * ,
        CASE  
          WHEN "cateonename" is null and "catetwoname" is null THEN ''
          WHEN "cateonename" is not null and "catetwoname" is null THEN "cateonename"
          WHEN "cateonename" is not null and "catetwoname" is not null THEN concat_ws(' # ',cateonename,catetwoname)
        END catename,
        CASE  
          WHEN "studenttype" = 'curresTest' THEN '函授'   
          WHEN "studenttype" = 'selfTest' THEN '自考'   
          WHEN "studenttype" = 'adultTest' THEN '成考'   
          ELSE studenttype
        END studentTypeName
        from ( ${selectSql} ${fromSql}) t 
      ) d ` + whereSql + orderSql

      console.log(compleSql);

      this.novaSql(compleSql).then(data => {
        console.log(data);
        if (data && data.length) {
          let dataLen = data.length;
          for (let index = 0; index < dataLen; index++) {
            let item = data[index];
            item.idcard = "'" + item.idcard;
            item.workid = item.workid ? "'" + item.workid : "";
            item.degreeNumber = item.degreeNumber ? "'" + item.degreeNumber : "";
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

  async setAccLog() {
    let proArr = [];
    let Arr = [
      // {idcard: "362330199709088791",  tradeNo: 'C8AxE0x1xEa2021923102723241',},
      // {idcard: "360726199704282611",  tradeNo: 'CvE6Nr0KKS8202192519528489',},
      // {idcard: "362322200112250923",  tradeNo: 'CCHqRHia4jC202192519246970'},
      // {idcard: "362227199702070026",  tradeNo: 'CBsa0xhabQl2021922171136339'},
      // {idcard: "362204199501167441",  tradeNo: 'Cdoi5DbapFH2021925194759313'},
      // {idcard: "360402199904224566",  tradeNo: 'Cu68lSJ6vcD2021925193155405'},
      // {idcard: "362322200203297540",  tradeNo: 'CC7ZP112XXK2021925195846547'},
      // {idcard: "131126199404210056",  tradeNo: 'CkehpM9aRwW2021925193331650'},
      // {idcard: "360721200001267240",  tradeNo: 'CAsGDoH4N8p202192520403211'},
      // {idcard: "362525199802263638",  tradeNo: 'COQrFHcSjxq20219251992827'},
      // {idcard: "360429199611071519",  tradeNo: 'CpjpmeXV3CY202192520561112'},
      // {idcard: "360429199810280014",  tradeNo: 'Cvs8BEyNTza2021925204527130'},
      // {idcard: "360122200109164212",  tradeNo: 'Cpd8bTxkutd2021925194824108'},
      // {idcard: "360981199812246146",  tradeNo: 'CIljjQYMKIx2021925204818710'},
      // {idcard: "362401199606232037",  tradeNo: 'C630tB7c5tR2021925204351651'},
      // {idcard: "360421199908044019",  tradeNo: 'CpiKF4YuaH020219252034508'},
      // {idcard: "362132198104260066",  tradeNo: 'CasEJnDNXfX20219252073911'},
      // {idcard: "362329199507134811",  tradeNo: 'CwkrXhtWegl202192519852366'},
      // {idcard: "360121199809263914",  tradeNo: 'CJoXLN6VtxX202192520118438'},
      // {idcard: "360721198511062819",tradeNo: 'C5FBApaboJR2021925193221780'},
      // {idcard: "362203199902225511",  tradeNo: 'CTneVHaAqgt2021925204915507'},
      // {idcard: "362401197806033615",  tradeNo: 'CjTMxFFYS8a2021925201227595'},
      // {idcard: "360782199608190136",  tradeNo: 'CFIQBecFB7b202192519381557'},
      // {idcard: "360702199808101327",  tradeNo: 'Cnp3wK0xOUo2021923182843862'},
      // {idcard: "360123199612012487",  tradeNo: 'CD0xubH51QO2021924134614716'},
      // {idcard: "362424199603015410",  tradeNo: 'C6vS0xpOkG3202192410417908'},
      // {idcard: "362329198904033059",  tradeNo: 'CxiIa8gO0xc2021923214859486'},
      // {idcard: "360427199011112740",  tradeNo: 'Csxff60xTjr2021925153449616'},
      // {idcard: "360111199706262545",  tradeNo: 'CboUxiWoCMb202192519531731'},
      // {idcard: "362326199812020344",  tradeNo: 'CkzZSlb0xWk2021923161934230'},
      // {idcard: "360103199711062222",  tradeNo: 'C8V0xVN2EZG20219227359646'},

      // {idcard:"36011119961123252X",tradeNo:'CRZOogLHRPl202192611413473'},
      // {idcard:"362201199810242821",tradeNo:'CVFSskcklNm2021925203941278'},
      // {idcard:"360734199706062436",tradeNo:'CN5Gh1i0XeM2021926171114942'},
      // {idcard:"362528200209301546",tradeNo:'CLagtwkZcRB2021925194748420'},
      // {idcard:"362524200407050025",tradeNo:'Cjc2XPMGJbB20219269114646'},
      // {idcard:"360124199107120643",tradeNo:'CklT5qEKGfN2021924185637482'},
      // {idcard:"362321200111130827",tradeNo:'CmVu5rPmsKv2021925195237897'},
      // {idcard:"360732199601092310",tradeNo:'CAH5OtvrIjQ2021925194627603'},
      // {idcard:"362422199406160050",tradeNo:'CDNoWm5bFwM202192610263250'},
      // {idcard:"362423200402096022",tradeNo:'CtNYYGld0xO2021925115455644'},
      // {idcard:"362324199104100068",tradeNo:'C5roqoVnmLG202192520419950'},
      // {idcard:"360735199008171260",tradeNo:'ChWZAXQnUFf2021925201153578'},
      // {idcard:"362525199602110020",tradeNo:'C70MLC8cym32021922103631210'},
      // {idcard:"360731199701220037",tradeNo:'C0hm0j5LXt22021925195036660'},
      // {idcard:"362430199710160020",tradeNo:'Csfrx28pDZp202192519539101'},
      // {idcard:"360827200208176729",tradeNo:'CLytJko2nWI202192523225978'},
      // {idcard:"362502199610221447",tradeNo:'C0Up0xwCIdB202192593944463'},
      // {idcard:"362425199706084028",tradeNo:'C0xHo6zF7ZK2021922202647761'},
      // {idcard:"362422200212297521",tradeNo:'CGOUTB9HZTu202192583350343'},
      // {idcard:"360481199708071019",tradeNo:'Cdwstbwj3QR202192520391851'},
      // {idcard:"362430200212040048",tradeNo:'CLBou7ZytdY20219269728423'},
      // {idcard:"360733199706305921",tradeNo:'C93Yx8LaFVC202192520133560'},
      // {idcard:"360721199807136447",tradeNo:'CjSUjRJG8xC2021925192437196'},

      // { idcard: "360481199708071019", tradeNo: 'Cdwstbwj3QR202192519950292' },
      // { idcard: "362430200212040048", tradeNo: 'CLBou7ZytdY2021925193939704' },
      // { idcard: "360733199706305921", tradeNo: 'C93Yx8LaFVC202192520133560' },
      // { idcard: "360721199807136447", tradeNo: 'CjSUjRJG8xC2021925192450746' },
      // { idcard: "360730199008150038", tradeNo: "Ce1SkJJcBNt2021925205148272" },
      // { idcard: "360122200101080022", tradeNo: "CZuLId5cbho20219251958142" },
      // { idcard: "360103199802170720", tradeNo: "CUYQGiFv0S62021925191943410" },
      // { idcard: "36012219980601541X", tradeNo: "Cv0D19Bto0x20219261955885" },
      // { idcard: "362302198203060521", tradeNo: "CZAD5uO0xvg2021926171655753" },
      // { idcard: "36233019980622090X", tradeNo: "CdTV0qSvv9V2021925202613297" },
      // { idcard: "362321199712010032", tradeNo: "CNFMpA8Pqcr2021925203931785" },
      // { idcard: "36112920030319332X", tradeNo: "C1G5I4VKEyk202192521027312" },

      // { idcard: "362227199708080014", tradeNo: "C2IXg8qV5ug2021925201750277" },
      // { idcard: "36232919841219258X", tradeNo: "CameHGjjSSo202192520418159" },
      // { idcard: "360726199603058629", tradeNo: "CAB7dxyHWva2021925205752644" },
      // { idcard: "152624199711162727", tradeNo: "CpIDeS738sG2021925194148642" },
      // { idcard: "360121199502204215", tradeNo: "CPNqE5bwoCU2021925193951397" },
      // { idcard: "360428199609122915", tradeNo: "CPo6cDRVSMk202192519404903" },





    ]
    console.log(Arr);
    for (let index = 0; index < Arr.length; index++) {
      const item = Arr[index];
      let Profile = new Parse.Query("Profile");
      Profile.notEqualTo("isDeleted", true);
      Profile.equalTo("department", '7vc9cp0JQS');
      Profile.equalTo("idcard", item.idcard);
      let profile = await Profile.first();
      console.log(profile)
      let recArr;
      recArr = [
        {
          __type: "Pointer",
          className: "RecruitStudent",
          objectId: "3wAJlBgNH2",//  南昌大学 6wVCbfO3GM 江西理工 3wAJlBgNH2
        }
      ];
      profile.set("RecruitArray", recArr)
      profile.save();
      if (item.tradeNo.indexOf(profile.id) != -1) {
        console.log(true);
        let log = await this.getAccLog(profile.get("department"), item.tradeNo)
        console.log(log)
        if (log && log.id) {
          log.set("isVerified", true);
          log.save();
        } else {
          let AccountLog = Parse.Object.extend("AccountLog");
          let accountLog = new AccountLog();
          accountLog.set("isVerified", true);
          accountLog.set("orderType", '5beidD3ifA-ystPay');
          accountLog.set("assetCount", 60);
          accountLog.set("orderId", item.tradeNo);
          accountLog.set("remark", profile.get("name") + profile.get("idcard"));
          accountLog.set("targetName", profile.get("department").id);
          accountLog.set("desc", "3wAJlBgNH2_学位外语报名缴费");
          accountLog.set("orderNumber", item.tradeNo);
          accountLog.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: this.pCompany,
          });
          let accLog = await accountLog.save();
          console.log('生成支付订单')
          if (accLog && accLog.id) {
            console.log(accLog);
          } else {
            console.log(item.idcard);
          }
        }
      }
      proArr.push(profile);
    }
    return
  }

  async getRpro() {
    let RecruitProfile = new Parse.Query("RecruitProfile")
    RecruitProfile.equalTo("company", this.pCompany)
    RecruitProfile.equalTo("department", '7vc9cp0JQS')
    RecruitProfile.equalTo("recruit", '3wAJlBgNH2')
    RecruitProfile.limit(10000)
    // RecruitProfile.endsWith("idcard", `/\s/`)

    let proArr = await RecruitProfile.find();
    console.log(proArr)
    proArr.forEach(pro => {
      console.log(pro.get("idcard"));
      if (pro.get("idcard")) {
        // pro.set("idcard", pro.get("idcard").trim());
        // pro.save()
      }
    })
  }

}
