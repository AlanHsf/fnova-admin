import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";
import { HttpClient } from "@angular/common/http";
import { PrintService } from "src/modules/service/print.service";
@Component({
  selector: "app-print-class",
  templateUrl: "./print-class.component.html",
  styleUrls: ["./print-class.component.scss"],
})
export class PrintClassComponent implements OnInit {
  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private mPrint: PrintService
  ) { }
  companyInfo: any; // 公司信息
  department: string; // 院校
  departName: string; // 院校名称
  cates: any; // 考点/函授站点
  recruit: any; // 当前报名计划
  user: any;
  company: any;
  pCompany: any;
  companyName: string;
  schClasses: any;
  type: any; // 打印表类型
  groupLen: number; // 一页数量  计算分页
  isConfirmLoading: boolean = false;
  examNumScope: string; //考场内考生准考证号范围区间  准考证号规则末尾为座位号时
  examNumConf: any; // 当前招生计划的准考证号生成规则
  langs: any[]; // 语种数组
  printSchoolTitle: string;
  isNanDa:boolean = true;

  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.department = localStorage.getItem("department");
      this.company = localStorage.getItem("company");
      this.user = Parse.User.current();
      console.log(this.user);
      console.log(this.company);
      if(this.company == 'EATkBGf8T9'){
        this.isNanDa = false
      }
      if (this.department && this.company) {
        let Company = new Parse.Query("Company");
        let company = await Company.get(this.company);
        this.companyName = company.get("name");
        this.pCompany = company.get("company").id;
      }
      this.companyInfo = await this.getCompany();
      let user = Parse.User.current();
      if (user && user.get("cates")) {
        this.cates = user.get("cates");
        console.log(this.cates);
        localStorage.setItem("cateId", this.cates[0].id);
      }
      let url = this.router.url.split(";");
      let para = "";
      if (url[1]) {
        para = url[1].split("=")[1];
      }
      console.log(para, typeof para);
      this.type = para;
      await this.getRecruit();
      this.getDepartName();
      this.initPrintData();
      if (this.type == "sclass") {
      }
    });
  }
  async getDepartName() {
    let Depart = new Parse.Query("Department");
    let depart = await Depart.get(this.department);
    this.departName = depart && depart.get("name");
  }
  async getCompany() {
    let Company = new Parse.Query("Company");
    let company = await Company.get(this.company);
    if (company && company.id) {
      console.log(company);
      return company;
    }
  }

  /* --------- 获取打印所需数据 begin ----------*/
  /*
    1. 获取所有考场
    2. 遍历考场获取单个考场下所有考生
    3. 考场结合考生信息拼接该考场座次表
    4. 各考场座次表数据整合
  */
  printLoading: boolean = true;
  totalCount: number = 0;
  currentIndex = 1;
  showAll = false;
  totalStu: number = 0;
  // 根据考场数量分别打印 每50个考场分页
  printType: string = 'batch'
  pageList: any = [
    { label: "1-50", value: 1 },
    { label: "51-100", value: 2 },
    { label: "101-150", value: 3 },
    { label: "151-200", value: 4 },
    { label: "201-250", value: 5 },
    { label: "251-300", value: 6 },
    { label: "301-350", value: 7 },
    { label: "351-400", value: 8 },
    { label: "401-450", value: 9 },
  ];
  selectData: any[] = this.pageList;// 打印方式切换时打印列表数据
  printIndex: number = 1;
  printLimit: number = 50;
  printTypeChange(event) {
    console.log(event)
    switch (event) {
      case 'batch':
        this.printLimit = 50;
        this.selectData = this.pageList;
        break;
      case 'single':
        this.printLimit = 1;
        this.selectData = this.schClasses;
        break;
      default:
        break;
    }
    this.printIndex = 1
    this.initPrintData(this.printIndex)
  }

  async initPrintData(event?) {
    this.totalStu = 0;
    this.printLoading = true;
    console.log(event)
    if (event) {
      this.printIndex = event;
    }
    console.log(event, this.printIndex, this.printLimit);
    let schClasses: any = await this.getSchClasses(
      this.printIndex,
      this.printLimit
    );
    console.log(schClasses);
    
    let schClaLen = schClasses.length;
    this.totalCount = 0; // 总页码
    for (let index = 0; index < schClaLen; index++) {
      let schClass = schClasses[index];
      let profiles = await this.getProfiles(schClass.id);
      let testNumber = schClass.get("testNumber");
      if (this.department == "UmjXxAjvBK") {
        schClass.testNumber =
          testNumber < 10
            ? "00" + testNumber
            : testNumber < 100
              ? "0" + testNumber
              : testNumber;
      } else {
        schClass.testNumber = testNumber < 10 ? "0" + testNumber : testNumber;
      }
      console.log(schClass.testNumber);
      /* 语种 */
      schClass.langName = [];
      let lang = schClass.get("lang").split(",");
      this.langs.forEach((item) => {
        if (lang.indexOf(item.code) != -1) {
          schClass.langName.push(item.name);
        }
      });
      let proLen = profiles.length;
      // 分组  考生数组 座位表25人一页 以25人进行分组  [[]]  头像表6人一组
      this.groupLen = this.type == "total" ? 25 : 6;
      let groupLen = this.groupLen;
      let pageCount = proLen / groupLen;
      let newArr = [];
      for (let index = 0; index < pageCount; index++) {
        let item = profiles.slice(index * groupLen, (index + 1) * groupLen);
        newArr.push(item);
      }
      schClass.students = newArr;
      schClass.pcount = Math.ceil((proLen || 0) / groupLen);
      schClass.beforeCount = this.totalCount;
      this.totalStu += proLen;
      // console.log(this.totalStu)
      // console.log(schClass.pcount)
      // console.log(schClass.beforeCount)
      this.totalCount += schClass.pcount;
      console.log(this.totalCount);
    }
    this.schClasses = schClasses;
    // 人数大于1千等待10秒
    let time = this.totalStu > 1000 ? 10000 : 5000;
    this.printLoading = false;
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isConfirmLoading = false;
    }, time);
    console.log(this.schClasses);
  }
  group(array, subGroupLength) {
    let index = 0;
    let newArray = [];

    while (index < array.length) {
      newArray.push(array.slice(index, (index += subGroupLength)));
    }
    console.log(newArray);

    return newArray;
  }
  beforePage(list, fieldname = "students", index, groupLength) {
    let totalCount = 0;
    list = list.slice(0, index);
    list.forEach((li) => {
      let count = li[fieldname].legnth || 0;
      let pCount = Math.ceil(count / groupLength);
      totalCount += pCount;
    });
    return totalCount;
  }
  totalPage(list, fieldname = "students", groupLength) {
    let totalCount = 0;
    list.forEach((li) => {
      let count = li[fieldname].legnth || 0;
      let pCount = Math.ceil(count / groupLength);
      totalCount += pCount;
    });
    return totalCount;
  }

  async getProfiles(classId, limit?) {
    let Students = new Parse.Query("Profile");
    Students.notEqualTo("isDeleted", true);
    Students.equalTo("company", this.pCompany);
    Students.equalTo("department", this.department);
    Students.equalTo("schoolClass", classId);
    Students.ascending("cardnum");
    if (limit) {
      Students.limit(limit);
    }
    Students.select("name", "workid", "idcard", "cardnum", "eduImage", "image");
    let students = await Students.find();
    if (students && students.length) {
      return students;
    } else {
      return [];
    }
  }
  async getRecruit() {
    let RecruitStudent = new Parse.Query("RecruitStudent");
    RecruitStudent.equalTo("isOpen", true);
    RecruitStudent.equalTo("department", this.department);
    let recruitStudent: any = await RecruitStudent.first();
    if (recruitStudent && recruitStudent.id) {
      console.log(recruitStudent);
      if(recruitStudent.get('config').pageConf.printSchoolTitle){
        this.printSchoolTitle = recruitStudent.get('config').pageConf.printSchoolTitle
      }
      this.recruit = recruitStudent;
      if (recruitStudent.get("config")["fieldConf"]) {
        let field = recruitStudent.get("config")["fieldConf"];
        if (field["lang"] && field["lang"]["isEnabled"]) {
          this.langs = field["lang"]["options"];
        }
        console.log(this.langs);
      }
      if (this.type == "sclass") {
        await this.getExamNumConf();
      }
    } else {
      this.message.error("未开启招生计划");
    }
  }

  async getExamNumConf() {
    let ruleConf = this.recruit.get("config")["ruleConf"];
    if (!ruleConf) {
      return;
    }
    console.log(this.recruit, ruleConf);
    this.examNumConf = ruleConf["examNumConf"];
  }
  async getSchClasses(index, limit?) {
    let SchClass = new Parse.Query("SchoolClass");
    SchClass.equalTo("company", this.pCompany);
    SchClass.equalTo("department", this.department);
    // let schClass2 = await SchClass.first();
    // console.log(schClass2);
    
    if (this.cates && this.cates.length) {
      let cateId = this.cates[0].id;
      console.log(cateId);
      SchClass.containedIn("cates", [
        {
          __type: "Pointer",
          className: "Category",
          objectId: cateId,
        },
      ]);
    }
    SchClass.ascending("testNumber");
    SchClass.addAscending("name");
    SchClass.addAscending("beginTime");
    console.log(index, limit);

    if (limit && index > 0) {
      SchClass.skip((index - 1) * limit);
    }
    SchClass.select('beginTime', 'endTime', 'lang', 'location', 'name', 'seating', 'testNumber','cates');
    SchClass.limit(limit || 4000);
    let schClasses = await SchClass.find();
    console.log(schClasses);
    if (schClasses && schClasses.length) {
      if (this.type != "sclass") {
        for (let index = 0; index < schClasses.length; index++) {
          let sclass: any = schClasses[index];
          console.log(sclass);
          
          let cateId;
          if (sclass.get("cates") && sclass.get("cates").length) {
            cateId = sclass.get("cates")[0];
            console.log(cateId);
            sclass.cateName = await this.getCateName(cateId);
          } else {
            sclass.cateName = this.companyName;
          }          
        }
      } else {
        if (this.department == "UmjXxAjvBK") {
          for (let index = 0; index < schClasses.length; index++) {
            let sclass: any = schClasses[index];
            let numScope = await this.getExamNumScope(sclass, this.examNumConf);
            console.log(numScope);
            sclass.examNumScope = numScope;
          }
        }
      }

      return schClasses;
    } else {
      return [];
    }
  }
  // 根据考场准考证号生成规则，生成考场准考证号
  getExamNumScope(sclass, examNumConf) {
    return new Promise(async (resolve, reject) => {
      let examNum = "";
      console.log(examNumConf);
      let numLen = Object.keys(examNumConf).length;
      console.log(numLen);

      for (let index = 0; index < numLen; index++) {
        let conf = examNumConf[index];
        console.log(conf);
        if (conf["isEnabled"]) {
          if (conf["className"]) {
            switch (conf["className"]) {
              case "Profile":
                switch (conf["type"]) {
                  case "String":
                    if (conf["field"] == "langCode") {

                      // let langs = sclass.get('lang').split(",")
                      // console.log(conf['field'], sclass.get(conf['lang']));
                      // examNum += sclass.get('lang') ? sclass.get('lang') : '';
                      examNum += "**";
                    }
                    break;
                  case "Pointer":
                    console.log(conf["field"]);
                    if (conf["field"] == "schoolClass") {
                      let num = sclass.get(conf["pointField"]);
                      if (num) {
                        examNum +=
                          num < 10 ? "00" + num : num < 100 ? "0" + num : num;
                      }
                    }
                    break;
                  default:
                    break;
                }
                break;
              case "RecruitStudent":
                console.log(this.recruit);
                if (this.recruit.get(conf["field"])) {
                  console.log(this.recruit.get(conf["field"]));
                  examNum += this.recruit.get(conf["field"])
                    ? this.recruit.get(conf["field"])
                    : "";
                }
                break;
              case "Company":
                console.log(this.companyInfo);
                if (this.companyInfo.get(conf["field"])) {
                  console.log(this.companyInfo.get(conf["field"]));
                  examNum += this.companyInfo.get(conf["field"])
                    ? this.companyInfo.get(conf["field"])
                    : "";
                }
                break;
              default:
                break;
            }
          } else {
            // 非数据库数据 如date
            if (conf["type"] == "date") {
              let date = this.getTime(null, conf["value"]);
              examNum += date;
            }
          }
        }
        if (index + 1 == numLen) {
          let seats = sclass.get("seating");
          let numScope = examNum + "01 ~ " + examNum + "" + seats;
          console.log(numScope);
          resolve(numScope);
        }
      }
    });
  }
  async getCateName(cateId) {
    let Cate = new Parse.Query("Category");
    Cate.equalTo("objectId", cateId);
    Cate.equalTo("type", "test");
    let cate = await Cate.first();
    console.log(cate);    
    if (cate && cate.id) {
      return cate.get("name");
    } else {
      return;
    }
  }
  /* --------- 获取打印所需数据 end ----------*/

  /* --------- 打印 begin ----------*/
  canvasPrint() { }
  print() {
    this.showAll = true;
    let type = this.type;
    console.log(type);
    switch (type) {
      case "total":
        // document.body.innerHTML =
        //   document.getElementById("print-total").innerHTML;
        // window.print();
        this.printPage("print-total")
        break;
      case "list":
        // document.body.innerHTML =
        //   document.getElementById("print-list").innerHTML;
        // window.print();
        this.printPage("print-list")

        break;
      case "sclass":
        // document.body.innerHTML =
        //   document.getElementById("print-sclass").innerHTML;
        // window.print();
        this.printPage("print-sclass")

        break;

      default:
        break;
    }
    // this.cdRef.detectChanges();
    // window.location.reload();
  }
  async printPage(printEl) {
    console.log(new Date().getSeconds())
    let status: any = await this.mPrint.Print({
      // documentTitle: `${this.config.stamp}-${this.profile.get("name")}`,// iframe网页标题 即打印时页眉处标题
      printdom: printEl,// 打印元素id名
      develop: false,// 调试时开启 显示iframe
      style: `@media print {@page {margin:0;size: auto;}}`// 传入样式
    })
    if (status) {
      this.showAll = false;
    }
  }
  /* --------- 打印 end ----------*/

  pageNum: number = 1;
  /* 分页跳转 */
  pageChange(way, data) {
    // type e
    // console.log(e);
    // this.currentIndex = e;
    switch (way) {
      case "arrow":
        if (data == "prev") {
          this.currentIndex > 1
            ? (this.currentIndex -= 1)
            : (this.currentIndex = 1);
          this.pageNum = this.currentIndex;
        } else {
          let total =
            this.type == "sclass" ? this.schClasses.length : this.totalCount;
          console.log(this.totalCount, this.schClasses.length, total);
          this.currentIndex < total
            ? (this.currentIndex += 1)
            : (this.currentIndex = total);
          this.pageNum = this.currentIndex;
        }
        break;
      case "num":
        console.log(data, this.pageNum);
        this.currentIndex = this.pageNum;
        console.log(this.currentIndex);
        break;
      default:
        break;
    }
  }

  /* 工具函数 */
  getTime(date, format) {
    if (!date) {
      date = new Date();
    }
    if (!format) {
      format = "YYYY";
    }
    let year = date.getFullYear();
    let month =
      date.getMonth() >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    switch (format) {
      case "YYYY-MM-DD":
        return year + "-" + month + "-" + day;
      case "YYYYMMDD":
        return year + month + day;
      case "YYYY":
        return year;
      case "YY":
        console.log(format, year);
        year = (year + "").substring(2);
        return year;
      default:
        break;
    }
  }
}
