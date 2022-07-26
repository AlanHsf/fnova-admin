import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";
import { AppService } from "../../../app/app.service";

import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import "ag-grid-enterprise";

import * as XLSX from "xlsx";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";


// Parse.initialize("myAppId");
// (Parse as any).serverURL = "http://localhost:1337/parse";


@Component({
  selector: "app-a-complete-data",
  templateUrl: "./a-complete-data.component.html",
  styleUrls: ["./a-complete-data.component.scss"],
})
export class ACompleteDataComponent implements OnInit {
  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private appServ: AppService
  ) { }
  department: string; // 院校
  departments: any[] = [];
  company: any;
  pCompany: any;
  cateId: string;
  cate: any;
  data: any;
  profile: any;
  profiles: any = [];
  proCount: number = 0;
  loading: boolean = false;
  logList: any = [];
  tabIndex: number = 0;
  haveLogCount: number = 0;
  setLogCount: number = 0;
  recruit: any;
  recruitId: string;
  orderType: string = "";
  accountOrderId;
  accountLogInfo: any;

  alogs: any = []; // 缴费记录数组
  baseurl: string = "https://server.fmode.cn/api/novaql/select";
  // baseurl: string = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.pCompany = "5beidD3ifA";
      await this.getDepartments();
      /* 默认江西理工 */
      this.departChange("7vc9cp0JQS");
      this.recruitId = await this.getRecruit();
      console.log(this.department, this.recruit);
      this.getCates();
      /* 江西理工: recruit:3wAJlBgNH2 department:7vc9cp0JQS */
      // department 九江学院 O5KSjmL5Cl 江西理工 7vc9cp0JQS 西北师范 p2LLGFpQhQ 南昌大学：
      // recruit 九江学院 c64z6pADgX

      // this.company = "";
      let user = Parse.User.current();
      // if (user && user.get("cates")) {
      //   this.cate = user.get("cates")[0]
      // }

      // 题库
      this.getSurveyList()
    });

    this.exportInit();
    this.exportProfileClassInit()
  }

  async getDepartments() {
    this.departments = [];
    let Department = new Parse.Query("Department");
    Department.equalTo("company", this.pCompany);
    let departs = await Department.find();
    console.log(departs);
    if (departs && departs.length) {
      this.departments = departs;
    }
  }
  async tabChange(ev) {
    console.log(ev);
    if ((ev = 3)) {
      this.getSurveysByDepart();
    }
    this.tabIndex = ev;
    // this.department = this.;
    // this.recruitId = await this.getRecruit()
    // console.log(ev, this.recruitId);
  }
  async departChange(ev, company?) {
    this.department = ev;

    this.departments.forEach((item) => {
      if (item.id == ev) {
        console.log(item);
        this.company = item.get("subCompany") && item.get("subCompany").id;
      }
    });
    // this.company = company;
    this.recruitId = await this.getRecruit();
    this.queBank = null;

    this.profileCateList = []
    this.profileList = []

    this.getCates();
    this.getCatesIsEnabled()
  }
  async getRecruit() {
    let Recruit = new Parse.Query("RecruitStudent");
    Recruit.equalTo("department", this.department);
    Recruit.equalTo("isOpen", true);
    let recruit = await Recruit.first();
    if (recruit && recruit.id) {
      this.recruit = recruit;
      return recruit.id;
    } else {
      this.recruitId = "";
      this.recruit = null;
    }
  }
  // 文件拖拽
  handleDropOver(e, over?) {
    e.preventDefault();
    e.stopPropagation();
  }

  // over之后执行
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e);
    this.onFileChange(e);
  }
  // 选择文件
  async onFileChange(evt: any) {
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(data)
    console.log(target, target.files.length);
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    console.log(reader);
    reader.onload = (e: any) => {
      console.log(e);
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      let keyAry = [];
      // 遍历json对象，获取每一列的键名 表头
      for (let key in this.data[1]) {
        keyAry.push(key);
      }
      console.log(keyAry)
      console.log(this.data.length);
      let columnDefs: any = [];
      keyAry.forEach((element, index) => {
        columnDefs.push({ headerName: element, field: element });
      });
      console.log(this.data, columnDefs);
    };
    reader.readAsBinaryString(target.files[0]);
  }



  // 考生导入考场  按考场座位数截取数据时传入filterCount  当有filterCount时  只查无所属考场的考生档案
  async getProfiles(data = this.data, filterCount?) {
    this.proCount = 0;
    this.profiles = [];
    if (!data.length) {
      return this.message.error("无数据源");
    }
    let dataLen = data.length;
    console.log(data, dataLen);

    this.loading = true;
    let company = this.company;
    let pCompany = this.pCompany;
    let department = this.department;
    let proCount = 0;
    for (let index = 0; index < dataLen; index++) {
      let idcard =
        data[index]["身份证号"] ||
        data[index]["身份证号码"] ||
        data[index]["SFZH"] ||
        data[index]["证件号"];
      if (idcard) {
        let Profile = new Parse.Query("Profile");
        Profile.equalTo("idcard", idcard);
        Profile.equalTo("company", pCompany);
        Profile.equalTo("department", department);
        if (filterCount) {
          Profile.doesNotExist("schoolClass");
        }
        Profile.include("schoolClass");
        let profile = await Profile.first();
        if (profile && profile.id) {
          proCount += 1;
          this.proCount += 1;
          this.profiles.push(profile);
        } else {
          console.log(idcard);
        }
        // 考生导入考场  按考场座位数截取数据时传入filterCount  当有filterCount时  查到的无所属考场的考生档案达到filterCount时 中断
        if (filterCount && this.proCount >= filterCount) {
          this.loading = false;
          return;
        }
      } else {
        console.log(idcard, "表格表头不对应");
        break;
      }
      if (index + 1 == dataLen) {
        this.loading = false;
      }
    }
  }
  // 根据数据库档案补充缴费相关记录
  async complete() {
    // recruitId: 江西理工 3wAJlBgNH2
    let profiles = this.profiles;
    console.log(profiles);
    console.log("开始");
    console.log(`待排查记录${profiles.length}条`);
    let proLen = profiles.length;
    this.logList = [];
    this.loading = true;
    for (let index = 0; index < proLen; index++) {
      let profile = profiles[index];
      let tradeNo = await this.saveTradeNo(profile.id);

      try {
        /* 有缴费记录 不操作  无 生成 */
        let log = await this.getAccLog(profile.get("department"), profile.id);
        if (log && log.id) {
          this.haveLogCount += 1;
        } else {
          let AccountLog = Parse.Object.extend("AccountLog");
          let accountLog = new AccountLog();
          accountLog.set("isVerified", true);
          accountLog.set("orderType", `5beidD3ifA-${this.orderType}`);
          accountLog.set("assetCount", 60);
          accountLog.set("orderId", tradeNo);
          accountLog.set("remark", profile.get("name") + profile.get("idcard"));
          accountLog.set("targetName", profile.get("department").id);
          accountLog.set("desc", `${this.recruitId}_学位外语报名缴费`);
          accountLog.set("orderNumber", tradeNo);
          accountLog.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: this.pCompany,
          });
          this.logList.push(accountLog);
        }
      } catch {
        console.log("无对应profile", tradeNo);
      }
    }
    console.log("数据库已存在", this.haveLogCount, "条");
    this.loading = false;
  }
  async compLog(logList = this.logList) {
    for (let index = 0; index < logList.length; index += 100) {
      let saveList = [];
      if (index + 100 < logList.length) {
        saveList = logList.slice(index, index + 100);
        console.log(saveList);
      } else {
        saveList = logList.slice(index, logList.length);
        console.log(saveList);
      }
      await Promise.all(
        saveList.map((sitem) => {
          sitem.save();
          // this.updateProfile(sitem.createdAt)
        })
      );
      this.setLogCount = index;
      console.log(`已完成:${index}/${logList.length}`);
    }
  }
  // async updateProfile() {
  // let account = new Parse.Query("AccountLog");
  // account.equalTo("targetName", this.department);
  // account.equalTo("isVerified", true);
  // account.contains("desc", this.recruitId);
  // let count = await account.count();
  // if (!count) {
  //   count = 1
  // } else {
  //   count = count + 1;
  // }
  // console.log('num:', count);
  // let Profile = Parse.Object.extend("Profile");
  // let profile = new Profile();
  // profile.id = studentInfo.objectId;
  // let time = getNewTime();
  // console.log(time);
  // let num = (count / 1000000) + '';
  // num = num.substring(num.indexOf('.') + 1);
  // let degreeNumber = time + num;
  // profile.set('degreeNumber', degreeNumber);
  // profile.save().then(res => {
  //   studentInfo.degreeNumber = res.get('degreeNumber')
  //   console.log(res.get('degreeNumber'), '报名序号生成')
  // })
  // profile.set("degreeNumber", )
  // profile.save();
  // }
  /* 生成订单编号 */
  async saveTradeNo(proId) {
    let now = new Date();
    let tradeNo =
      "C" +
      proId +
      String(now.getFullYear()) +
      (now.getMonth() + 1) +
      now.getDate() +
      now.getHours() +
      now.getMinutes() +
      now.getSeconds() +
      now.getMilliseconds();
    return tradeNo;
  }

  async getAccLog(department, proId) {
    console.log(department.id)
    let AccountLog = new Parse.Query("AccountLog");
    AccountLog.equalTo("targetName", department.id);
    AccountLog.contains("orderId", proId);
    let log = await AccountLog.first();
    return log;
  }
  async bindUser() {
    let bindCount = 0;
    let Profile = new Parse.Query("Profile");
    Profile.equalTo("department", this.department);
    Profile.equalTo("company", this.pCompany);
    // Profile.doesNotExist('user');
    Profile.include("user");
    Profile.select("idcard", "mobile", "user");
    Profile.limit(50000);
    let profiles = await Profile.find();
    console.log(profiles.length);
    for (let index = 0; index < profiles.length; index++) {
      let profile = profiles[index];
      let user = profile.get("user");
      let log = await this.getLog(profile.id);
      if (profile && !user && log) {
        console.log(profile);
        let user = await this.getUser(
          profile.get("idcard"),
          profile.get("mobile")
        );
        if (user && user.id) {
          profile.set("user", {
            className: "_User",
            __type: "Pointer",
            objectId: user.id,
          });
          let data = await profile.save();
          if (data && data.id) {
            bindCount += 1;
            console.log(`已绑定：${bindCount}条`);
            // console.log(profile.get("idcard"));
          }
        }
      }
    }
  }
  async getLog(id) {
    let AccountLog = new Parse.Query("AccountLog");
    AccountLog.equalTo("company", this.pCompany);
    AccountLog.equalTo("targetName", this.department);
    AccountLog.contains("desc", this.recruitId);
    AccountLog.contains("orderId", id);
    AccountLog.equalTo("isVerified", true);
    AccountLog.notEqualTo("isback", true);
    let log = await AccountLog.first();
    if (log && log.id) {
      return log;
    }
  }
  async getUser(idcard, mobile) {
    let User = new Parse.Query("_User");
    // User.equalTo('company', this.pCompany);
    // User.equalTo('idcard', idcard);
    User.equalTo("username", this.pCompany + idcard);
    let user = await User.first();
    if (user && user.id) {
      user.set("idcard", idcard);
      user.set("mobile", mobile);
      user.set("company", {
        className: "Company",
        __type: "Pointer",
        objectId: this.pCompany,
      });
      let data = await user.save(null, { useMasterKey: true });
      return data;
    } else {
      let newUser = Parse.Object.extend("_User");
      let newuser = new newUser();
      newuser.set("username", this.pCompany + idcard);
      newuser.set("password", "123456");
      newuser.set("idcard", idcard);
      newuser.set("mobile", mobile);
      newuser.set("company", {
        className: "Company",
        __type: "Pointer",
        objectId: this.pCompany,
      });
      let news = await newuser.save(null, { useMasterKey: true });
      if (news && news.id) {
        return news;
      }
    }
  }
  async removeUser() {
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
    Profile.equalTo("department", this.department);
    Profile.equalTo("company", this.pCompany);
    Profile.exists("user");
    Profile.include("user");
    Profile.select("idcard", "mobile", "user", "department");
    Profile.limit(50000);
    let profiles = await Profile.find();
    console.log(`已存在：${profiles.length}条`, profiles);
    for (let index = 0; index < profiles.length; index++) {
      let profile = profiles[index];
      let user = profile.get("user");
      if (this.pCompany != profile.get("company")) {
        console.log(profile.get("company"));
      }
      if (
        user &&
        user.get("idcard") &&
        profile.get("idcard") != user.get("idcard")
      ) {
        profile.set("user", null);
        let data = await profile.save();
        if (data && data.id) {
          revCount += 1;
          console.log(`已解绑：${revCount}条`);
        }
      } else {
        rightCount += 1;
        // console.log(profile);
        // console.log(`正确：${rightCount}条`);
      }
    }
  }

  // 整合 recruitProfile 和 profile 数据
  /*
    1. 获取RecruitProfile数据
    2. 查找到该数据对应的profile
    3. RecruitProfile数据填充到profile
  */
  async completeProfile(department = this.department) {
    let pros = await this.getPros(department);
    let proLen = pros.length;
    console.log(`待整合数据${proLen}条`);
    let completedPro = [];
    let nohaveRecPro = [];
    if (pros.length && this.department == "7vc9cp0JQS") {
      for (let index = 0; index < proLen; index++) {
        let pro = pros[index];
        let idcard = pro.get("idcard");
        let name = pro.get("name");
        let recPro = await this.getRecPro(department, idcard, name);
        if (recPro && recPro.id) {
          let majorName =
            recPro.get("data")["专业名称"] ||
            recPro.get("data")["专业名"] ||
            recPro.get("data")["专业"];
          majorName = majorName ? majorName.trim() : majorName;
          let major = await this.getMajor(majorName);
          if (major && major.id) {
            if (!pro.get("SchoolMajor")) {
              pro.set("SchoolMajor", {
                __type: "Pointer",
                className: "SchoolMajor",
                objectId: major.id,
              });
            }
            console.log(pro, pro.get("cates"));
            if (
              (recPro.get("type") && recPro.get("type") == "自考") ||
              (recPro.get("data")["XXXS"] &&
                recPro.get("data")["XXXS"] != "函授")
            ) {
              if (!pro.get("studentType")) {
                pro.set("studentType", "自考");
              }
              let res = await pro.save();
              console.log("对应recprofile", res);
              completedPro.push(res);
            } else {
              if (!pro.get("studentType")) {
                pro.set("studentType", "函授");
              }
              let cateName =
                recPro.get("data")["函授站简称"] || recPro.get("data")["站点"];
              let cate = await this.getCate(cateName);
              if (cate && cate.id) {
                if (JSON.stringify(pro.get("cates")).indexOf(cate.id) != -1) {
                } else {
                  pro.set("cates", [
                    ...pro.get("cates"),
                    {
                      __type: "Pointer",
                      className: "Category",
                      objectId: cate.id,
                    },
                  ]);
                }

                let res = await pro.save();
                console.log("对应recprofile", res);
                completedPro.push(res);
              } else {
                console.log(pro, cateName);
              }
            }
            console.log(completedPro.length);
          } else {
            console.log("无对应major", recPro);

            break;
          }
        } else {
          nohaveRecPro.push(pro);
          console.log("未查找到对应recprofile");
        }
        if (index + 1 == proLen) {
          console.log(
            `已整合数据${completedPro.length}条，剩余${proLen - completedPro.length
            }数据未整合`
          );
          console.log(completedPro);
          console.log(`无对应recprofile数据${nohaveRecPro.length}条`);
          console.log(nohaveRecPro);
        }
      }
    }
  }
  // 从江理函数复制来的还没改
  async completeProfile3(department = this.department) {
    let pros = await this.getPros(department);
    let proLen = pros.length;
    console.log(`待整合数据${proLen}条`);
    let completedPro = [];
    let nohaveRecPro = [];
    if (pros.length && this.department == "O5KSjmL5Cl") {
      for (let index = 0; index < proLen; index++) {
        let pro = pros[index];
        let idcard = pro.get("idcard");
        let name = pro.get("name");
        let recPro = await this.getRecPro(department, idcard, name);
        if (recPro && recPro.id) {
          let majorName = recPro.get("data")["ZYMC"];
          majorName = majorName ? majorName.trim() : majorName;
          let major = await this.getMajor(majorName);
          if (major && major.id) {
            if (!pro.get("SchoolMajor")) {
              pro.set("SchoolMajor", {
                __type: "Pointer",
                className: "SchoolMajor",
                objectId: major.id,
              });
            }
            console.log(pro, pro.get("cates"));
            if (
              (recPro.get("type") && recPro.get("type") == "自考") ||
              (recPro.get("data")["XXXS"] &&
                recPro.get("data")["XXXS"] != "函授")
            ) {
              if (!pro.get("studentType")) {
                pro.set("studentType", "自考");
              }
              let res = await pro.save();
              console.log("对应recprofile", res);
              completedPro.push(res);
            } else {
              if (!pro.get("studentType")) {
                pro.set("studentType", "函授");
              }
              let cateName =
                recPro.get("data")["函授站简称"] || recPro.get("data")["站点"];
              let cate = await this.getCate(cateName);
              if (cate && cate.id) {
                if (JSON.stringify(pro.get("cates")).indexOf(cate.id) != -1) {
                } else {
                  pro.set("cates", [
                    ...pro.get("cates"),
                    {
                      __type: "Pointer",
                      className: "Category",
                      objectId: cate.id,
                    },
                  ]);
                }
                let res = await pro.save();
                console.log("对应recprofile", res);
                completedPro.push(res);
              } else {
                console.log(pro, cateName);
              }
            }
            console.log(completedPro.length);
          } else {
            console.log("无对应major", recPro);
            break;
          }
        } else {
          nohaveRecPro.push(pro);
          console.log("未查找到对应recprofile");
        }
        if (index + 1 == proLen) {
          console.log(
            `已整合数据${completedPro.length}条，剩余${proLen - completedPro.length
            }数据未整合`
          );
          console.log(completedPro);
          console.log(`无对应recprofile数据${nohaveRecPro.length}条`);
          console.log(nohaveRecPro);
        }
      }
    }
  }
  // 九江学院考点不在基础数据库中在新提供的表中 需分开合并
  async completeProfile2(department = this.department) {
    let catePros;
    let count = 0;
    if (department == "O5KSjmL5Cl") {
      catePros = this.data;
      console.log(this.data);
      let proLen = catePros.length;
      console.log(`待整合数据${proLen}条`);
      let completedPro = [];
      if (catePros.length) {
        for (let index = 0; index < proLen; index++) {
          let exclPro = catePros[index];
          let idcard = exclPro["SFZH"] ? exclPro["SFZH"].trim() : "";
          let majorName = exclPro["ZYMC"];
          majorName = majorName ? majorName.trim() : majorName;
          let cateName = exclPro["ZD"];
          let sex = exclPro["XB"];
          let pro: any = await this.getPro(idcard);

          let major = await this.getMajor(majorName);
          if (pro && pro.id) {
            if (major) {
              if (!pro.get("SchoolMajor")) {
                pro.set("SchoolMajor", {
                  __type: "Pointer",
                  className: "SchoolMajor",
                  objectId: major.id,
                });
              }
            } else {
              console.log(pro, major);
              return;
            }
            let cate = await this.getCate(cateName, "test");
            if (cate && cate.id) {
              pro.set("cates", [
                {
                  __type: "Pointer",
                  className: "Category",
                  objectId: cate.id,
                },
              ]);
              pro.set("sex", sex);
              count += 1;
              let res = await pro.save();
              console.log("生成profile", count, "条");
              completedPro.push(res);
            } else {
              console.log(pro, cateName);
              return;
            }
          } else {
            console.log("无对应profile：", idcard);
          }
        }
        console.log(`整合成功数据${completedPro.length}条`);
      }
    }
  }
  async getRecPro(department, idcard, name) {
    let RecruitProfile = new Parse.Query("RecruitProfile");
    RecruitProfile.equalTo("department", department);
    RecruitProfile.equalTo("idcard", idcard);
    RecruitProfile.equalTo("name", name);
    let recPro = await RecruitProfile.first();
    if (recPro && recPro.id) {
      return recPro;
    } else {
      return false;
    }
  }
  async getPros(department) {
    let Profile = new Parse.Query("Profile");
    Profile.equalTo("department", department);
    // Profile.doesNotExist("SchoolMajor");
    Profile.limit(4000);
    let pros = await Profile.find();
    if (pros && pros.length) {
      return pros;
    }
    {
      return [];
    }
  }
  async getPro(idcard) {
    let Profile = new Parse.Query("Profile");
    Profile.equalTo("idcard", idcard);
    Profile.equalTo("company", this.pCompany);
    Profile.equalTo("department", this.department);
    // Profile.doesNotExist("SchoolMajor");
    let pro = await Profile.first();
    if (pro && pro.id) {
      return pro;
    }
    {
      return false;
    }
  }
  async getMajor(majorName) {
    let SchoolMajor = new Parse.Query("SchoolMajor");
    SchoolMajor.equalTo("school", this.department);
    SchoolMajor.equalTo("name", majorName);
    let major = await SchoolMajor.first();
    if (major && major.id) {
      return major;
    }
    {
      return false;
    }
  }
  async getCate(cateName, type?) {
    let Categoroy = new Parse.Query("Category");
    Categoroy.equalTo("department", this.department);
    Categoroy.equalTo("name", cateName);
    if (type && type == "test") {
      Categoroy.equalTo("type", "test");
    } else {
      Categoroy.notEqualTo("type", "test");
    }
    let cate = await Categoroy.first();
    if (cate && cate.id) {
      return cate;
    }
    {
      return false;
    }
  }


  /* 单条数据补充 */
  idcard: string;
  profileData: any = [];
  errMsg: string;
  searchLoading: boolean = false;
  logs: any[] = []; // 考生已缴费记录
  ModalVisible: boolean = false;
  modalTitle: string;
  tradeNo: string;
  listOfColumn: Array<any> = [
    {
      title: "姓名",
      key: "name",
      type: "string",
    },
    {
      title: "身份证号",
      key: "idcard",
      type: "string",
    },
    {
      title: "手机号码",
      key: "mobile",
      type: "number",
    },
    {
      title: "考点",
      key: "cates",
      type: "PointerArray",
    },
    {
      title: "考试账户",
      key: "user",
      type: "Pointer",
    },
    {
      title: "缴费记录",
      key: "desc",
      className: "AccountLog",
      type: "Pointer",
    },
    {
      title: "操作",
      key: "",
      type: "",
    },
  ];

  accountListOfColumn = [
    {
      title: '缴费時間',
      value: 'createdAt',
      type: 'Date',
      schemaAlia: 'log',
      compare: null,
      priority: false
    },
    {
      title: '缴费说明',
      value: 'desc',
      type: 'String',
      schemaAlia: 'log',
      compare: null,
      priority: false
    },
    {
      title: '订单编号',
      value: 'orderId',
      type: 'String',
      schemaAlia: 'log',
      compare: null,
      priority: false
    },
    {
      title: '支付方式',
      value: 'type',
      type: 'String',
      schemaAlia: 'log',
      compare: null,
      priority: false
    },
    {
      title: '支付费用',
      value: 'assetCount',
      type: 'Number',
      schemaAlia: 'log',
      compare: null,
      priority: false

    },
    {
      title: '支付状态',
      value: 'payType',
      type: 'String',
      schemaAlia: 'log',
      compare: null,
      priority: false
    },
    {
      title: '缴费备注',
      value: 'remark',
      type: 'String',
      schemaAlia: 'log',
      compare: null,
      priority: false
    },
    {
      title: '操作',
      compare: null,
      priority: false
    }
  ];
  async setProfiles() {
    console.log("begin set");
    let pros = this.data;
    let proLen = pros.length;
    let count = 0;
    let updateCount = 0;
    let addCount = 0;
    console.log(pros);
    for (let index = 0; index < proLen; index++) {
      let pro = pros[index];
      let idcard = pro["证件号"];
      if (!idcard) {
        console.log("身份证号", pro["证件号"], "不存在");
        this.message.error(`身份证号 ${pro["证件号"]} 不存在`);
        return;
      }
      let data = await this.getPro(idcard);
      let major = await this.getMajor(pro["专业"]);
      let cate = await this.getCate(pro["考试地点"], "test");
      if (!major) {
        console.log("专业", pro["专业"], "不存在");
        this.message.error(`专业 ${pro["专业"]} 不存在`);
        return;
      }
      if (!cate) {
        console.log("考点", pro["考试地点"], "不存在");
        this.message.error(`考点 ${pro["考试地点"]} 不存在`);
        return;
      }
      if (data) {
        data.set({
          SchoolMajor: major.toPointer(),
          departments: [
            {
              __type: "Pointer",
              className: "Department",
              objectId: this.department,
            },
          ],
          cates: [
            // ...data.get("cates"),
            {
              __type: "Pointer",
              className: "Category",
              objectId: cate.id,
            },
          ],
        });
        let upRes = await data.save();
        if (upRes && upRes.id) {
          updateCount += 1;
          count += 1;
          console.log(count);
        } else {
          console.log(data);
          return;
        }
      } else {
        let Profile = Parse.Object.extend("Profile");
        let profile = new Profile();
        let birthdate =
          idcard.slice(6, 10) +
          "-" +
          idcard.slice(10, 12) +
          "-" +
          idcard.slice(12, 14);
        profile.set({
          idcard: idcard,
          birthdate: birthdate,
          sex: pro["性别"],
          name: pro["姓名"],
          mobile: pro["联系方式"],
          SchoolMajor: major.toPointer(),
          // "type":type,
          company: {
            __type: "Pointer",
            className: "Company",
            objectId: this.pCompany,
          },
          department: {
            __type: "Pointer",
            className: "Department",
            objectId: this.department,
          },
          departments: [
            {
              __type: "Pointer",
              className: "Department",
              objectId: this.department,
            },
          ],
          cates: [
            {
              __type: "Pointer",
              className: "Category",
              objectId: cate.id,
            },
          ],
        });
        let res = await profile.save();
        if (res && res.id) {
          addCount += 1;
          count += 1;
          console.log(count);
        } else {
          console.log(data);
          return;
        }
      }
    }
    console.log(updateCount, addCount);
  }
  async getProfile() {
    this.profileData = [];
    this.logs = [];
    this.searchLoading = true;
    let Profile = new Parse.Query("Profile");
    Profile.equalTo("idcard", this.idcard);
    Profile.equalTo("company", this.pCompany);
    Profile.equalTo("department", this.department);
    Profile.include("cates");
    Profile.include("user");
    let profile = await Profile.first();
    if (profile && profile.id) {
      this.profile = profile;
      let user = profile.get("user");
      if (user && user.get("username")) {
        profile["user"] = user;
      }
      if (profile.get("cates")) {
        let cates = profile.get("cates");
        cates.forEach((cate) => {
          if (cate.get("type") == "test") {
            profile["cate"] = cate;
          }
        });
      }
      this.profileData[0] = profile;
      this.cdRef.detectChanges();
    } else {
      this.errMsg = "查找不到该考生";
    }
    this.searchLoading = false;
  }

  async getAccountLog() {
    console.log(this.accountOrderId)

    let accountLog = new Parse.Query("AccountLog");
    accountLog.contains("orderId", this.accountOrderId);
    // accountLog.notEqualTo("isVerified", true);
    // accountLog.notEqualTo("isback", true);
    let accountLogInfo = await accountLog.first()
    if (accountLogInfo && accountLogInfo.id) {
      this.accountLogInfo = accountLogInfo.toJSON()

      if (!this.accountLogInfo.isVerified && !this.accountLogInfo.isback) {
        this.accountLogInfo.payType = "未缴费"
      } else if (this.accountLogInfo.isVerified && !this.accountLogInfo.isback) {
        this.accountLogInfo.payType = "已缴费"
      } else if (this.accountLogInfo.isVerified && this.accountLogInfo.isback) {
        this.accountLogInfo.payType = "已退费"
      }

    } else {
      this.errMsg = "查找不到该缴费记录";
    }
    console.log(accountLogInfo)
  }

  // 支付状态修改为已支付
  async updatePayLog(orderId) {
    console.log(orderId)

    // 修改 AccountLog 
    let accountLog = new Parse.Query("AccountLog");
    accountLog.equalTo("orderId", orderId);
    accountLog.notEqualTo("isVerified", true);
    accountLog.notEqualTo("isback", true);
    let accountLogInfo = await accountLog.first()
    console.log(accountLogInfo)
    if (accountLogInfo && accountLogInfo.id) {
      // 修改状态
      accountLogInfo.set("isVerified", true);
      accountLogInfo.save().then(async account => {
        console.log(account)

        let profile = new Parse.Query('Profile')
        // profile.equalTo('idcard', "360103198810195456")
        profile.equalTo('idcard', accountLogInfo.get("remark").substring(accountLogInfo.get("remark").length - 18))

        profile.notEqualTo("isDeleted", true);
        let profileInfo = await profile.first()
        console.log(profileInfo)
        if (profileInfo && profileInfo.id) {

          // 生成 _User表信息
          let queryUser = new Parse.Query('_User')
          queryUser.equalTo('idcard', profileInfo.get('idcard'))
          let userInfo = await queryUser.first()
          console.log(userInfo)
          if (userInfo && userInfo.id) {
            console.log(userInfo)

            this.getApplyNum(orderId, profileInfo.get("department").id).then((applyNum) => {
              // 修改 profile 
              profileInfo.set("user", {
                "className": "_User",
                "__type": "Pointer",
                "objectId": userInfo.id
              });
              profileInfo.set('isPay', '已缴费')
              profileInfo.set('degreeNumber', applyNum)
              profileInfo.save().then((res: any) => {
                console.log(res)
              }).catch(err => {
                this.errMsg = "修改失败";
                console.log(err)
                return
              })
            }).catch(err => {
              this.errMsg = "生成报名序号失败";
              console.log(err)
              return
            })

          } else {
            let profileData = profileInfo.toJSON()

            const User = Parse.Object.extend("_User");
            const user = new User();

            user.set("mobile", profileData.mobile);
            user.set("username", this.company + profileData.idcard);
            user.set("idcard", profileData.idcard);
            user.set("name", profileData.name);
            user.set("company", {
              "className": "Company",
              "__type": "Pointer",
              "objectId": this.company
            });
            user.save().then((res: any) => {

              this.getApplyNum(orderId, profileInfo.get("department").id).then((applyNum) => {
                // 修改 profile 
                profileInfo.set("user", {
                  "className": "_User",
                  "__type": "Pointer",
                  "objectId": userInfo.id
                });
                profileInfo.set('isPay', '已缴费')
                profileInfo.set('degreeNumber', applyNum)
                profileInfo.save().then((res: any) => {
                  console.log(res)
                }).catch(err => {
                  console.log(err)
                  return
                })
              }).catch(err => {
                this.errMsg = "生成报名序号失败";
                console.log(err)
                return
              })

            }).catch(err => {
              this.errMsg = "修改失败";
              console.log(err)
              return
            })
          }
        }
      }).catch(err => {
        this.errMsg = "修改失败";
        console.log(err)
        return
      })
    } else {
      this.errMsg = "修改失败";
    }
  }

  // 生成报名序号
  async getApplyNum(orderId, depaId) {
    return new Promise((resolve, reject) => {
      let account = new Parse.Query('AccountLog')
      account.equalTo('isVerified', true)
      // department.id
      account.equalTo('targetName', depaId)
      // 招生计划id
      account.contains('desc', this.recruitId)

      account.count().then((count) => {
        if (!count) {
          count = 1
        } else {
          count = count + 1
        }
        console.log('num:', count)
        let time = this.getNewTime()
        console.log(time)
        let num = count / 1000000 + ''
        num = num.substring(num.indexOf('.') + 1)
        num = num.padEnd(6, num)
        let degreeNumber = time + num
        console.log(degreeNumber)
        resolve(degreeNumber)
      })
    })
  }
  /* 获取当前时间 */
  getNewTime() {
    let year = new Date().getFullYear()
    let month =
      new Date().getMonth() >= 10
        ? new Date().getMonth() + 1
        : '0' + (new Date().getMonth() + 1)
    let day =
      new Date().getDate() >= 10
        ? new Date().getDate()
        : '0' + new Date().getDate()
    return year + "" + month + day
  }


  async singleOperat(type, data) {
    switch (type) {
      /* 检查缴费记录 */
      case "checklog":
        this.logs = await this.getPayLog(data);
        console.log(this.logs);
        // this.profileData = []
        this.cdRef.detectChanges();

        break;
      case "setUser":
        let user = await this.setUser(data);
        this.cdRef.detectChanges();
        this.getProfile();
        break;
      case "logback":
        let AccountLog = new Parse.Query("AccountLog");
        let log = await AccountLog.get(data.id);
        log.set("isback", true);
        log.save();
        this.cdRef.detectChanges();
        this.getProfile();
        break;
      default:
        break;
    }
  }
  async getPayLog(data) {
    let arr = [];
    let AccountLog = new Parse.Query("AccountLog");
    AccountLog.equalTo("targetName", this.department);
    AccountLog.contains("desc", this.recruitId);
    AccountLog.contains("orderId", data.id);
    AccountLog.equalTo("isVerified", true);
    AccountLog.notEqualTo("isback", true);
    let logs = await AccountLog.find();
    console.log(logs);
    if (logs && logs.length) {
      // logs.forEach(log => {
      //   // arr.push({
      //   //   id:log.id,
      //   //   desc: log.get("desc"),
      //   //   orderId: log.get("orderId")
      //   // })

      // })
      // this.alogs = arr;
      return logs;
    } else {
      return [];
    }
  }
  // 南大 ystPay 以弹窗方式 输入支付方式 tradeNo 进行补充
  async setPayLog() {
    if (!this.orderType || this.orderType == "") {
      this.message.error("未填写支付方式");
      return;
    }
    if (!this.tradeNo || this.tradeNo == "") {
      this.tradeNo = this.getTradeNo();
    }
    let profile = this.profileData[0];
    let AccountLog = Parse.Object.extend("AccountLog");
    let accountLog = new AccountLog();
    accountLog.set("isVerified", true);
    accountLog.set("orderType", `5beidD3ifA-${this.orderType}`);
    accountLog.set("assetCount", 60);
    accountLog.set("orderId", this.tradeNo);
    accountLog.set("remark", profile.get("name") + profile.get("idcard"));
    accountLog.set("targetName", profile.get("department").id);
    accountLog.set("desc", `${this.recruitId}_学位外语报名缴费`);
    accountLog.set("orderNumber", this.tradeNo);
    accountLog.set("company", {
      __type: "Pointer",
      className: "Company",
      objectId: this.pCompany,
    });
    let log = await accountLog.save();
    if (log && log.id) {
      console.log(log);
      this.message.success("缴费记录创建成功");
      this.setProNumber(log.toJSON());
    }
    this.tradeNo = "";
    this.orderType = "";
    this.ModalVisible = false;
  }
  async setProNumber(log = this.alogs[0]) {
    let AccountLog = new Parse.Query("AccountLog");
    AccountLog.equalTo("targetName", this.department);
    AccountLog.contains("desc", this.recruitId);
    AccountLog.equalTo("isVerified", true);
    let index = await AccountLog.count();
    let time = new Date(log.createdAt);
    let numDate =
      time.getFullYear() +
      "" +
      (time.getMonth() + 1 < 10
        ? "0" + (time.getMonth() + 1)
        : time.getMonth() + 1) +
      "" +
      (time.getDate() < 10 ? "0" + time.getDate() : time.getDate());
    let num = index / 1000000 + "";
    num = num.substring(num.indexOf(".") + 1); // 末尾为0的数字会把零去掉了，需要使用padEnd在尾部补全位数。
    num = num.padEnd(6, num);
    let degreeNumber = numDate + num;

    this.profile.set("degreeNumber", degreeNumber);
    let pro = await this.profile.save();
    console.log(pro);
    if (pro && pro.id) {
      this.message.success("degreeNumber生成成功");
    }
  }
  getTradeNo() {
    let tradeNo = "";
    let now = new Date();
    tradeNo =
      "C" +
      this.profileData[0].id +
      String(now.getFullYear()) +
      (now.getMonth() + 1) +
      now.getDate() +
      now.getHours() +
      now.getMinutes() +
      now.getSeconds() +
      now.getMilliseconds();
    return tradeNo;
  }
  async setUser(data) {
    let user = await this.getUser(data.get("idcard"), data.get("mobile"));
    if (user && user.id) {
      data.set("user", {
        className: "_User",
        __type: "Pointer",
        objectId: user.id,
      });
      let res = await data.save();
      if (res && res.id) {
        this.message.success("创建成功");
      }
    }
  }

  /* topic-check 抽题流程检查 */
  stepIndex: number = 0;
  surveys: any[] = [];
  knows: any[] = [];
  sglTopics: any[] = [];
  textTopics: any[] = [];
  compTopics: any[] = [];
  getSurveys() {
    this.knows = [];
    let baseurl = this.baseurl;
    let sql = `select jsonb_array_elements("exam"."survey")::json->>'objectId' as "sid" from (select * from "Exam"
    where "company"='${this.pCompany}' and "department"='${this.department}' and "isEnable"=true) as "exam";`;
    this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
      let code: any = res.code;
      let data: any = res.data;
      console.log(data);
      if (code == 200) {
        this.surveys = data;
      } else {
        console.log(res);
        this.message.error("请求失败");
      }
      this.searchLoading = false;
    });
  }
  checkKnowledges() { }
  repeatLoading: boolean = false;
  repeatCheck() {
    this.repeatLoading = true;
  }
  /* 当前题库数组下属于各题型题目数量和题目 */
  getKnowItemCount() {
    this.knows = [];
    let baseurl = this.baseurl;
    let sidArr = this.surveys.map((survey) => survey.sid);
    let sql = `select "knowledge",count("objectId") from "SurveyItem"
    where position("survey" in ('${sidArr}')) > 0 and "parent" is null  group by "knowledge"`;
    this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
      let code: any = res.code;
      let data: any = res.data;
      console.log(data);
      if (code == 200) {
        for (let index = 0; index < data.length; index++) {
          let know = data[index];
          let id = know.knowledge[0].objectId;
          let Knowledge = new Parse.Query("Knowledge");
          let query = await Knowledge.get(id);
          if (query && query.id) {
            this.knows.push({
              kid: query.id,
              knowledge: query.get("name"),
              count: know.count,
            });
          }
        }
        console.log(this.knows);
      } else {
        console.log(res);
        this.message.error("请求失败");
      }
      this.searchLoading = false;
    });
  }
  checkType() {
    // 获取题型名称
    this.knows.forEach((know) => {
      let knowName = know.knowledge;
      let kid = know.kid;
      if (knowName == "词汇词法题") {
        this.checkSingleTopic(know);
      }
      if (knowName == "作文" || knowName == "翻译") {
        this.checkTextTopic(know);
      }
      if (
        knowName == "情景对话题" ||
        knowName == "翻译（选择题）" ||
        knowName == "阅读理解题"
      ) {
        this.checkCompTopic(know);
      }
    });
  }
  checkSingleTopic(know) {
    know.topics = [];
    know.crtTopics = [];
    know.errTopics = [];
    let baseurl = this.baseurl;
    let sidArr = [];
    // this.surveys.map(survey => survey.sid) ["RW3yW1ylDo","RW3yW1ylDo"]
    // this.surveys.map(survey => survey.sid).join() "RW3yW1ylDo,RW3yW1ylDo"
    sidArr = this.surveys.map((survey) => survey.sid);
    let sidStrs = JSON.stringify(sidArr).replace(/'/g, '"');
    console.log(sidStrs);
    // and type ='select-single'      and "parent" is null
    // and "isEnabled"=true
    let sql = `select * from "SurveyItem"
    where position("survey" in ('${sidArr}')) > 0  and "type"='select-single'
     and "knowledge"='[{"className":"Knowledge","__type":"Pointer","objectId":"${know.kid}"}]' `;
    console.log(sql);
    this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
      let code: any = res.code;
      let data: any = res.data;
      console.log(data);
      if (code == 200) {
        know.topics = data;
        let difficult = "easynormalhard";
        data.forEach((sgl) => {
          let chekOpts: boolean = this.checkOptions(sgl);
          if (sgl["parent"]) {
            sgl.errTips = "有父级题目";
          }
          if (!sgl["answer"]) {
            sgl.errTips = "未设置答案";
          }
          if (!sgl["score"]) {
            sgl.errTips = "未设置分数";
          }
          if (
            !sgl["difficulty"] ||
            difficult.indexOf(sgl["difficulty"]) == -1
          ) {
            sgl.errTips = "未设置难度";
          }
          if (!sgl["title"]) {
            sgl.errTips = "未设置题干";
          }
          if (!chekOpts) {
            sgl.errTips = "选项设置错误";
          }
          if (
            !sgl["parent"] &&
            sgl["answer"] &&
            sgl["score"] &&
            sgl["difficulty"] &&
            sgl["title"] &&
            chekOpts
          ) {
            know.crtTopics.push(sgl);
          } else {
            know.errTopics.push(sgl);
          }
        });
      } else {
        console.log(res);
        this.message.error("请求失败");
      }
      this.searchLoading = false;
    });
  }
  checkTextTopic(know) {
    know.topics = [];
    know.crtTopics = [];
    know.errTopics = [];
    let baseurl = this.baseurl;
    let sidArr = [];
    sidArr = this.surveys.map((survey) => survey.sid);
    let sidStrs = JSON.stringify(sidArr).replace(/'/g, '"');
    console.log(sidStrs);
    //      and "parent" is null
    // and "isEnabled"=true and type ='text'
    let sql = `select * from "SurveyItem"
    where position("survey" in ('${sidArr}')) > 0  and "type"='text'
     and "knowledge"='[{"className":"Knowledge","__type":"Pointer","objectId":"${know.kid}"}]' `;
    console.log(sql);
    this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
      let code: any = res.code;
      let data: any = res.data;
      console.log(data);
      if (code == 200) {
        know.topics = data;
        data.forEach((sgl) => {
          if (sgl["parent"]) {
            sgl.errTips = "有父级题目";
          }
          if (!sgl["score"]) {
            sgl.errTips = "未设置分数";
          }
          if (!sgl["difficulty"]) {
            sgl.errTips = "未设置难度";
          }
          if (!sgl["title"]) {
            sgl.errTips = "未设置题干";
          }
          if (
            !sgl["parent"] &&
            sgl["score"] &&
            sgl["difficulty"] &&
            sgl["title"]
          ) {
            know.crtTopics.push(sgl);
          } else {
            know.errTopics.push(sgl);
          }
        });
      } else {
        console.log(res);
        this.message.error("请求失败");
      }
      this.searchLoading = false;
    });
  }
  checkCompTopic(know) {
    know.topics = [];
    know.crtTopics = [];
    know.errTopics = [];
    let baseurl = this.baseurl;
    let sidArr = [];
    sidArr = this.surveys.map((survey) => survey.sid);
    let sidStrs = JSON.stringify(sidArr).replace(/'/g, '"');
    console.log(sidStrs);
    // and "isEnabled"=true and "parent" is null and "type"='complex'
    let sql = `select * from "SurveyItem"
    where position("survey" in ('${sidArr}')) > 0
     and "knowledge"='[{"className":"Knowledge","__type":"Pointer","objectId":"${know.kid}"}]' `;
    console.log(sql);
    this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
      let code: any = res.code;
      let data: any = res.data;
      console.log(data);
      if (code == 200) {
        know.topics = data;
        know.haveChildMap = {};
        know.SurveyItemCollection = {};
        know.errTopics = [];
        know.crtTopics = [];
        // data.forEach(item => {know.SurveyItemCollection[item.objectId] = item;})
        for (let index = 0; index < data.length; index++) {
          let item = data[index];
          know.SurveyItemCollection[item.objectId] = item;
          let parent = item.parent;
          if (parent) {
            if (!know.haveChildMap[parent]) {
              know.haveChildMap[parent] = [];
            }
            know.haveChildMap[parent].push(item);
            // if (!know.SurveyItemCollection[parent] || !know.SurveyItemCollection[parent].children) {
            //   console.log(Object.keys(data)[parent]);
            //   know.SurveyItemCollection[parent] = Object.keys(data)[parent]
            //   know.SurveyItemCollection[parent].children = []
            // }
            // know.SurveyItemCollection[parent].children.push(item.objectId);
          } else {
          }
        }
        // know.errCount = 0;
        // know.corCount = 0;
        // setTimeout(() => {
        let mapKeys = Object.keys(know.haveChildMap);
        for (let index = 0; index < mapKeys.length; index++) {
          let key = mapKeys[index];
          let childrenList = know.haveChildMap[key];
          let itemInfo = know.SurveyItemCollection[key];
          let difficult = "easynormalhard";
          for (let cIndex = 0; cIndex < childrenList.length; cIndex++) {
            let cItem = childrenList[cIndex];
            let chekOpts: boolean = this.checkOptions(cItem);
            // know.SurveyItemCollection[key] 父级题目存在的子级题目才加入错误数组
            if (
              know.SurveyItemCollection[key] &&
              (!cItem["difficulty"] ||
                difficult.indexOf(itemInfo["difficulty"]) == -1 ||
                !cItem["title"] ||
                !cItem["score"] ||
                !chekOpts)
            ) {
              // know.errCount += 1;
              let obj = {
                errMsg: "",
                objectId: cItem.objectId,
                parent: key,
              };
              if (
                !cItem["difficulty"] ||
                difficult.indexOf(itemInfo["difficulty"]) == -1
              ) {
                obj.errMsg += "难度未设置";
              }
              if (!cItem["title"]) {
                obj.errMsg += "题干为空";
              }
              if (!cItem["score"]) {
                obj.errMsg += "分数未设置";
              }
              if (!cItem["score"]) {
                obj.errMsg += "分数未设置";
              }
              if (!chekOpts) {
                obj.errMsg += "选项设置错误";
              }

              if (obj.errMsg == "") {
                know.crtTopics.push({
                  objectId: key,
                });
              }
              know.errTopics.push(obj);
            }
          }

          // || !itemInfo || !itemInfo["difficulty"] || !itemInfo["title"] || !itemInfo["score"]
          // 存在并且是父级题目
          if (!childrenList && itemInfo) {
            // know.errCount += 1;
            let obj = {
              errMsg: "",
              objectId: key,
            };
            // if (!childrenList.length) {
            //   obj.errMsg += '无子题目';
            // }
            // if (!itemInfo) {
            //   obj.errMsg += '不存在';
            // } else {
            if (
              !itemInfo["difficulty"] ||
              difficult.indexOf(itemInfo["difficulty"]) == -1
            ) {
              obj.errMsg += "难度错误";
            }
            if (!itemInfo["title"] || itemInfo["title"].trim() == "") {
              obj.errMsg += "题干为空";
            }
            if (!itemInfo["score"]) {
              obj.errMsg += "分数未设置";
            }
            if (obj.errMsg == "") {
              know.crtTopics.push({
                objectId: key,
              });
            }
            // }

            know.errTopics.push(obj);
          } else {
            // know.corCount += 1;
          }
        }
        let collects = know.SurveyItemCollection;
        let collectKeys = Object.keys(collects);

        for (let kIndex = 0; kIndex < collectKeys.length; kIndex++) {
          let key = collectKeys[kIndex];
          if (!know.haveChildMap[key] && collects[key].type == "complex") {
            let obj = {
              errMsg: "无子题目",
              objectId: key,
            };
            know.errTopics.push(obj);
          }
        }
        // }, 5000)
        // data.forEach(item => {
        // if(!know.SurveyItemCollection[item.objectId]){know.SurveyItemCollection[item.objectId] = item;}

        // })
        console.log(know.haveChildMap, know.SurveyItemCollection);
        // Object.keys(know.haveChildMap).forEach(key=>{
        //   let childs = know.haveChildMap[key]
        //   if(childs&&childs.length){
        //     childs.forEach(citem=>{
        //       let chekOpts: boolean = this.checkOptions(citem)
        //       if(!chekOpts || !citem["difficulty"] || !citem["title"] || !citem["score"]){
        //         // 方便页面遍历显示
        //         if(!know.SurveyMapCollection[key].err){know.SurveyMapCollection[key].err=true;}
        //         if(!know.SurveyMapCollection[key].errtips){know.SurveyMapCollection[key].errtips='!chekOpts || !citem["difficulty"] || !citem["title"] || !citem["score"]'}
        //         if(!know.SurveyMapCollection[citem.objectId].err){know.SurveyMapCollection[citem.objectId].err=true;}
        //         if(!know.SurveyMapCollection[citem.objectId].errtips){know.SurveyMapCollection[citem.objectId].errtips='!chekOpts || !citem["difficulty"] || !citem["title"] || !citem["score"]';}
        //       }
        //     })
        //   }
        // })
        console.log(know);
      } else {
        console.log(res);
        this.message.error("请求失败");
      }
      this.searchLoading = false;
    });
  }
  checkOptions(sgl) {
    let haveCorrt = false;
    let options = sgl.options;
    if (options && options.length > 2) {
      let valueStr = {}; // 判断选项内容是否重复
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        let value = option.value ? option.value.trim() : "";
        if (!option.label || !value || value == "") {
          return false;
        }
        if (value != "" && valueStr[value]) {
          return false;
        }
        valueStr[value] = "true";
        if (option.check && option.grade) {
          // && option.label != sgl.answer
          haveCorrt = true;
        }
      }
      if (!haveCorrt) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  /* test-check 考生考试流程检查 */
  noUserArr = [];
  errUserArr = [];
  noClassArr = [];
  noImageArr = [];
  getProfilesHayPay() {
    this.noUserArr = [];
    this.errUserArr = [];
    this.profiles = [];
    this.noUserArr = [];
    this.searchLoading = true;
    let baseurl = this.baseurl;
    console.log(this.department);

    try {
      let sql = `select "pro"."objectId" as "id","pro"."name","pro"."idcard","pro"."mobile","pro"."user","pro"."schoolClass","pro"."eduImage","pro"."image"
      from "Profile"as "pro"
      left join "AccountLog" as "log" on SUBSTRING("log"."orderId",2,10) = "pro"."objectId"
      left join "_User" as "user" on "pro"."user" = "user"."objectId"
      where "pro"."company"='${this.pCompany}' and "pro"."department"='${this.department}'
      and "log"."isVerified"=true and "log"."isback" is not true`;
      this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
        let code: any = res.code;
        let data: any = res.data;
        console.log(data);
        if (code == 200) {
          this.cdRef.detectChanges();
          this.profiles = data;
        } else {
          console.log(res);
          this.message.error("请求失败");
        }
        this.searchLoading = false;
      });
    } catch (err) {
      this.searchLoading = false;
      console.log(err);
    }
  }
  getUsersByProfile() {
    this.noUserArr = [];
    this.errUserArr = [];
    this.noClassArr = [];
    this.noImageArr = [];
    // let nohave:number = 0;
    let correct = 0;
    let error = 0;
    this.profiles.forEach(async (profile) => {
      let user = profile.user;
      let schoolClass = profile.schoolClass;
      let image = profile.image;
      let eduImage = profile.eduImage;
      console.log(user);
      if (user) {
        // let Query = new Parse.Query("_User");
        // let query = await Query.get(user);
        // if (query && query.id) {
        //   if (query.get("username") == (this.pCompany + profile.id) && query.get("idcard") == profile.idcard) {
        //     correct += 1;
        //   } else {
        //     this.errUserArr.push(profile);
        //   }
        // } else {
        //   this.errUserArr.push(profile);
        // }
      } else {
        // nohave += 1;
        this.noUserArr.push(profile);
      }
      if (!schoolClass) {
        this.noClassArr.push(profile);
      }
      if (!image || !eduImage) {
        this.noImageArr.push(profile);
      }
    });
  }
  async setUserByProfiles() {
    let count = 0;
    let arr = this.noUserArr;
    for (let index = 0; index < arr.length; index++) {
      let pro = arr[index];
      let user = await this.getUser(pro.idcard, pro.mobile);
      if (user && user.id) {
        let res = await this.changeProfile(pro.id, user.id);
        if (res && res.id) {
          count += 1;
        }
      }
      if (index + 1 == arr.length) {
        console.log("已绑定", count, "条");
      }
    }
  }
  async changeProfile(proId, userId) {
    let Query = new Parse.Query("Profile");
    let query = await Query.get(proId);
    if (query && query.id) {
      query.set("user", {
        className: "_User",
        __type: "Pointer",
        objectId: userId,
      });
      let res = await query.save();
      return res;
    }
  }
  async removeUserByProfiles() {
    let revCount = 0;
    let errArr = this.errUserArr;
    for (let index = 0; index < errArr.length; index++) {
      let pro = errArr[index];
      let Query = new Parse.Query("Profile");
      let query = await Query.get(pro.id);
      if (query && query.id) {
        query.set("user", null);
        let res = await query.save();
        if (res && res.id) {
          revCount += 1;
        }
        if (index + 1 == errArr.length) {
          console.log("已解绑", revCount, "条");
        }
      }
    }
  }

  /* 题库复制 */
  queBankArr: any[]; // 题库源数组
  queBank: any; // 题库源
  copyDepart: any; // 待复制院校
  copyQueBank: any; // 待复制题库
  async getSurveysByDepart() {
    console.log("quebank");
    this.queBankArr = [];
    let Survey = new Parse.Query("Survey");
    Survey.equalTo("company", this.pCompany);
    Survey.equalTo("department", this.department);
    let surveys = await Survey.find();
    console.log(surveys);
    if (surveys && surveys.length) {
      this.queBankArr = surveys;
    }
  }
  async queBankChange(ev) {
    // this.queBank = ev;
    // this.recruitId = await this.getRecruit()
    // console.log(ev, this.recruitId);
  }
  departChange2(ev) {
    // this.copyDepart = ev;
  }
  copySurvey() { }

  /* 导入考场 */
  sClass: any;
  sClasses: any[] = [];
  cates: any[] = [];
  sClassId: string = "";
  sclProLen: number = 0;
  proData: any[] = [];

  /* 表格 */
  checked: boolean = false;
  indeterminate: boolean = false;
  sclassColumn: Array<any> = [
    {
      title: "姓名",
      key: "name",
      type: "string",
    },
    {
      title: "身份证号",
      key: "idcard",
      type: "string",
    },
    {
      title: "考场",
      key: "cates",
      type: "PointerArray",
    },
  ];
  setOfChecked = new Set<any>();
  async sClassChange(ev) {
    let sclas = this.sClasses;
    for (let index = 0; index < sclas.length; index++) {
      let sclass = sclas[index];
      if (sclass.id == ev) {
        this.sClass = sclass;
        await this.getSclassPros();
      }
    }
  }
  async getCates() {
    console.log(this.company, this.department);
    let Cates = new Parse.Query("Category");
    Cates.equalTo("company", this.company);
    Cates.equalTo("department", this.department);
    Cates.equalTo("showType", "school_area");
    Cates.equalTo("type", "test");
    let cates = await Cates.find();
    console.log(cates);
    if (cates && cates.length) {
      this.cates = cates;
    }
  }
  catesIsEnabled: any[] = [];
  async getCatesIsEnabled() {
    console.log(this.company, this.department);
    let Cates = new Parse.Query("Category");
    Cates.equalTo("company", this.company);
    Cates.equalTo("department", this.department);
    Cates.equalTo("showType", "school_area");
    Cates.equalTo("type", "test");
    Cates.equalTo("isEnabled", true);
    let cates = await Cates.find();
    console.log(cates);
    if (cates && cates.length) {
      this.catesIsEnabled = cates;
    }
  }

  cateChange(ev) {
    this.cates.forEach((cate) => {
      if (cate.id == ev) {
        this.cate = cate;
        // this.getClasses();
      }
    });
  }
  async getClasses() {
    let SClass = new Parse.Query("SchoolClass");
    SClass.equalTo("company", this.pCompany);
    SClass.equalTo("department", this.department);
    SClass.containedIn("cates", [
      {
        __type: "Pointer",
        className: "Category",
        objectId: this.cateId,
      },
    ]);
    let sClass = await SClass.find();
    console.log(sClass, this.cateId);
    if (sClass && sClass.length) {
      this.sClasses = sClass;
    }
  }
  async getSclassPros() {
    let Profile = new Parse.Query("Profile");
    Profile.equalTo("company", this.pCompany);
    Profile.equalTo("department", this.department);
    Profile.equalTo("schoolClass", {
      __type: "Pointer",
      className: "SchoolClass",
      objectId: this.sClassId,
    });
    let prolen = await Profile.count();
    this.sclProLen = prolen;
  }
  async setSclass() {
    let sclProLen = this.sclProLen;
    let pros = Array.from(this.setOfChecked);
    console.log(pros);
    let proLen = pros.length;
    if (!proLen) {
      this.message.info(`未选择考生`);
    }
    if (proLen > this.sClass.get("seating") - sclProLen) {
      this.message.error(`考生数量超出该考场座位数`);
      return;
    }
    this.loading = true;
    let pCount = 0;
    for (let index = 0; index < pros.length; index++) {
      let pro = pros[index];
      pro.set("schoolClass", {
        __type: "Pointer",
        className: "SchoolClass",
        objectId: this.sClassId,
      });
      let num = index + 1 < 10 ? "0" + (index + 1) : "" + (index + 1);
      pro.set("cardnum", num);
      let res = await pro.save();
      if (res && res.id) {
        pCount += 1;
      }
      if (index + 1 == proLen) {
        console.log(pCount);
        this.message.info(`${pCount}位考生导入该考场`);
        this.profiles = [];
        this.getSclassPros();
      }
    }
  }

  /* 表格项选择 */
  onItemChecked(data: any, checked: boolean): void {
    console.log(data, checked);
    if (checked) {
      if (!this.setOfChecked.has(data)) {
        this.setOfChecked.add(data);
        // this.proData.push(data)
      }
    } else {
      if (this.setOfChecked.has(data)) {
        this.setOfChecked.delete(data);
        // this.proData.slice(index,1)
      }
    }
    console.log(this.setOfChecked);
  }

  onAllChecked(checked: boolean): void {
    console.log(checked);
    if (checked) {
      this.setOfChecked = new Set(this.profiles);
    } else {
      this.setOfChecked.clear();
    }
    console.log(this.setOfChecked);
  }

  /* 导出 */
  export(type) {
    switch (type) {
      case "complex":
        //     let data = JSON.stringify()
        //     const a = document.createElement("a");
        //     let blob = new Blob([data]);
        //     const objectUrl = URL.createObjectURL(blob);
        //     a.href = objectUrl;
        //     a.download = `组合题错误题目.json`;
        //     a.click();
        //     a.remove()
        //     URL.revokeObjectURL(objectUrl);
        break;

      default:
        break;
    }
  }

  /*     // department
  //九江学院 O5KSjmL5Cl 江西理工 7vc9cp0JQS 西北师范 p2LLGFpQhQ
  // recruit
  // 九江学院 c64z6pADgX 江西理工 3wAJlBgNH2 西北师范 Fa0BmXpjmj
  async setRecruitProfile(data, recruit = '3wAJlBgNH2', department = '7vc9cp0JQS') {
    let ProfileList = [];
    let ErrorList = [];
    let Rec = new Parse.Query("RecruitProfile");
    Rec.equalTo('recruit', recruit);
    Rec.select("objectId", "idcard");
    Rec.limit(50000);
    let recList = await Rec.find();
    console.log(`已存在：${recList.length}条`);
    let recMap = {
    }

    for (let index = 0; index < recList.length; index++) {
      let ritem = recList[index];
      recMap[ritem.get("idcard")] = true
    }

    console.log(`Map映射：${Object.keys(recMap).length}条`);

    data.forEach(item => {
      // for (let xlsindex = 0; xlsindex < data.length; xlsindex++) {
      //   let item = data[xlsindex];
      let idcard = item['SFZH'] || null;
      let name = item['XM'] || '';
      // let type = item['站点']?item['站点']: '';
      if (!idcard) {
        idcard = item['身份证号'] ? item['身份证号'].trim() : null;
        name = item['姓名'] ? item['姓名'].trim() : '';
      }
      if (!idcard) {
        ErrorList.push({ msg: "idcard不存在", item: item })
      }
      if (idcard) {
        idcard = String(idcard)
      }
      let existRec = recMap[idcard] || null
      let Profile = Parse.Object.extend("RecruitProfile");
      let profile = null;
      if (!idcard || existRec) {
        console.log(idcard)
      } else {
        profile = new Profile();
        let obj = {};
        // let keys = Object.keys(item);
        // keys.forEach(key=>{
        obj = item;
        // obj[key] = item[key];
        // })
        // for (let index = 0; index < keys.length; index++) {
        //   let key = keys[index];
        // }

        profile.set({
          "idcard": idcard,
          "name": name,
          // "type":type,
          "company": {
            "__type": "Pointer",
            "className": "Company",
            "objectId": '5beidD3ifA'
          },
          "department": {
            "__type": "Pointer",
            "className": "Department",
            "objectId": department
          },
          "recruit": {
            "__type": "Pointer",
            "className": "RecruitStudent",
            "objectId": recruit
          },
          "data": obj
        })
        ProfileList.push(profile)
      }
    }) // end of forEach
    console.log(`错误数据，共${ErrorList.length}条`)
    console.log(ErrorList)
    console.log(`开始批量导入任务，共${ProfileList.length}条`)
    for (let index = 0; index < ProfileList.length; index += 100) {
      let saveList = []
      if (index + 100 < ProfileList.length) {
        saveList = ProfileList.slice(index, index + 100)
        console.log(saveList)
      } else {
        saveList = ProfileList.slice(index, ProfileList.length)
        console.log(saveList)

      }
      await Promise.all(saveList.map(sitem => sitem.save()));
      console.log(`已完成:${index}/${ProfileList.length}`)
    }
  }

  savePromise(profile) {
    return new Promise((resolve, reject) => {
      profile.save().then(res => {
        resolve(res)
      }).catch(err => {
        // errData.push(item)
        reject(err)
      })
    })
  } */



  /**   院校生成已缴费状态记录(批量)    **/

  // 数据
  profileList = [];
  // excel导入的条数
  dataLen;
  // 数据库profile数据条数
  profileCount;
  // 支付记录已处在的订单编号
  accountLogList = [];
  listOfAccountColumn = [
    {
      title: '姓名',
      value: 'name',
      compare: null,
      priority: false
    },
    {
      title: '身份证号',
      value: 'idcard',
      compare: null,
      priority: false
    },
    {
      title: '手机号',
      value: 'mobile',
      compare: null,
      priority: false
    },
    {
      title: '报名序号',
      value: 'degreeNumber',
      compare: null,
      priority: false
    },
    {
      title: '学习形式',
      value: 'studentType',
      compare: null,
      priority: false
    },
    {
      title: '缴费单号',
      value: 'orderId',
      compare: null,
      priority: false
    },
    {
      title: '缴费状态',
      value: 'payType',
      compare: null,
      priority: false
    },
    {
      title: '缴费备注',
      value: 'remark',
      compare: null,
      priority: false
    }
  ];
  idcardList: any = []
  // 院校批量生成支付记录选择文件
  onFileChangeAccountLog(evt: any) {
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(data)
    console.log(target, target.files.length);
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    console.log(reader);
    reader.onload = async (e: any) => {
      console.log(e);
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      this.idcardList = []
      for (let i = 0; i < this.data.length; i++) {
        this.idcardList.push(this.data[i].idcard)
      }
      this.dataLen = this.data.length
      console.log(this.idcardList)

      await this.getProfileInfo()

      console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  async getProfileInfo() {
    let recruitStudent = new Parse.Query("RecruitStudent");
    let recruitStudentInfo = await recruitStudent.get(this.recruitId)
    console.log(recruitStudentInfo)
    if (recruitStudentInfo && recruitStudentInfo.id) {

      // let profile = new Parse.Query("Profile");
      // console.log(this.department)
      // profile.equalTo("department", recruitStudentInfo.get('department'))
      // profile.containedIn("idcard", idcardList);
      // profile.notEqualTo("isDeleted", true);
      // let count = await profile.count()
      // console.log(count)
      // profile.limit(count)
      // let profileList = await profile.find()

      let depaId = recruitStudentInfo.get('department').id
      console.log(depaId)

      let inSql = '';
      for (let i = 0; i < this.idcardList.length; i++) {
        if (i == this.idcardList.length - 1) {
          inSql += `'${this.idcardList[i]}'`
        } else {
          inSql += `'${this.idcardList[i]}',`
        }
      }

      let sql = `select * from "Profile" where "isDeleted" is not true and "department" = '${depaId}'
      and "idcard" in (${inSql}) `

      console.log(sql)
      let profileList = await this.novaSql(sql)

      console.log(profileList)
      if (profileList && profileList.length) {
        this.profileList = profileList
        this.profileCount = this.profileList.length
      }
      console.log(this.profileCount)
      return profileList
    }
  }


  async saveAccountLog(check) {
    console.log(this.profileList);
    console.log("开始");
    console.log(`待排查记录${this.profileList.length}条`);
    let proLen = this.profileList.length;
    let logList = [];
    this.haveLogCount = 0;
    this.loading = true;
    for (let index = 0; index < proLen; index++) {
      let profile = this.profileList[index];
      console.log(profile)
      let tradeNo = await this.saveTradeNo(profile.objectId);
      try {
        /* 有缴费记录 不操作  无 生成 */
        let log = await this.getAccountLogs(profile.department, profile.objectId);
        if (log && log.id) {
          // if (false) {
          this.haveLogCount += 1;
          this.accountLogList.push(log.get("orderId"))
        } else {
          let AccountLog = Parse.Object.extend("AccountLog");
          let accountLog = new AccountLog();
          accountLog.set("isVerified", true);
          accountLog.set("orderType", `5beidD3ifA-wxsdk`);
          accountLog.set("assetCount", 60);
          accountLog.set("orderId", tradeNo);
          accountLog.set("remark", profile.name + profile.idcard);
          accountLog.set("targetName", profile.department);
          accountLog.set("desc", `${this.recruitId}_学位外语报名缴费`);
          accountLog.set("orderNumber", tradeNo);
          accountLog.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: this.pCompany,
          });
          logList.push(accountLog);

          if (check && check == 'generate') {
            // 保存
            let accountLogInfo = await accountLog.save()
            console.log(accountLogInfo)
            if (accountLogInfo && accountLogInfo.id) {

              this.getApplyNum(tradeNo, profile.department).then(async (applyNum) => {
                // profile修改
                let profile = new Parse.Query("Profile");
                profile.notEqualTo("isDeleted", true);
                profile.equalTo("objectId", this.profileList[index].objectId)
                profile.equalTo("department", this.profileList[index].department)
                let profileInfo = await profile.first()
                console.log(profileInfo)
                if (profileInfo && profileInfo.id) {

                  profileInfo.set('isPay', '已缴费')
                  profileInfo.set('degreeNumber', applyNum)
                  profileInfo.save().then((res: any) => {
                    console.log(res)

                    this.profileList[index].degreeNumber = applyNum
                    this.profileList[index].orderId = accountLogInfo.get('orderId')
                    this.profileList[index].remark = accountLogInfo.get('remark')
                    this.profileList[index].payType = '已缴费'

                  }).catch(err => {
                    console.log(err)
                    return
                  })
                }
              })
            }
          }
        }
      } catch {
        console.log("无对应profile", tradeNo);
      }
    }
    console.log("处理完毕")
    console.log("数据库已存在", this.haveLogCount, "条", this.accountLogList);
    console.log(logList)
    console.log(this.profileList)
    this.loading = false;
  }

  async getProfileIsPay() {
    console.log(this.recruitId)
    if (!this.recruitId) {
      console.log("专项计划id不能为空");
      return
    }
    let depaId;
    let recruitStudent = new Parse.Query("RecruitStudent");
    let recruitStudentInfo = await recruitStudent.get(this.recruitId)
    console.log(recruitStudentInfo)
    if (recruitStudentInfo && recruitStudentInfo.id) {
      depaId = recruitStudentInfo.get('department').id
      console.log(depaId)
    }

    let sql = `select distinct "pro"."objectId", "pro"."name", "pro"."idcard", "pro"."mobile", "pro"."degreeNumber", "pro"."createdAt", "pro"."studentType", "pro"."department"  from 
    (select * from "AccountLog" where "desc" like '${this.recruitId}%' and "isVerified" is true and "isback" is not true) as "log"
    left join (select * from "Profile" where "department" = '${depaId}' and "isDeleted" is not true) as "pro"
      on substring("log"."orderId",2,10) = "pro"."objectId"
      where "pro"."objectId" is not null
      order by "pro"."createdAt"
    `
    console.log(sql)
    let profileList = await this.novaSql(sql)

    console.log(profileList)
    if (profileList && profileList.length) {
      this.profileList = profileList
      this.profileCount = this.profileList.length
    }
    console.log(this.profileCount)
    return profileList
  }

  async sortDegreeNumber() {
    if (this.profileList.length == 0) {
      console.log("报名考生不能为空");
      return
    }

    let count = 0
    let time = this.getNewTime()
    console.log(time)

    for (let i = 0; i < this.profileList.length; i++) {
      let profile = new Parse.Query("Profile");
      profile.equalTo('idcard', this.profileList[i].idcard)
      profile.notEqualTo("isDeleted", true);
      profile.equalTo("department", this.profileList[i].department);
      let profileInfo = await profile.first()
      console.log(profileInfo)
      if (profileInfo && profileInfo.id) {
        count += 1;
        let number = count + ''
        number = number.padStart(6, '0')
        console.log(time + number)
        profileInfo.set('degreeNumber', time + number)
        profileInfo.save().then(res => {
          console.log(res)
        })
      }
    }
    console.log("处理完毕")
    await this.getProfileIsPay()
  }

  async getAccountLogs(department, proId) {
    console.log(department)
    let AccountLog = new Parse.Query("AccountLog");
    AccountLog.equalTo("targetName", department);
    AccountLog.contains("orderId", proId);
    AccountLog.contains("desc", this.recruitId);
    AccountLog.equalTo("isVerified", true)
    AccountLog.notEqualTo("isback", true)
    let log = await AccountLog.first();
    return log;
  }

  ExportData = [];
  showExport;
  gridApi;
  gridColumnApi;
  require: any = [];
  fileds: any;
  exportInit() {
    this.require = [];
    this.listOfAccountColumn.forEach(col => {
      let headerName = col['title'];
      let field = col['value'];
      this.require.push({
        headerName,
        field,
      })
    });
    console.log(require)
  }
  // 导出函数 :
  async exportExcel() {
    this.ExportData = [];
    let data: any = await this.getProfileInfo();
    this.ExportData = data && data.length ? data : []
    this.showExport = true;
    console.log(this.ExportData)
  }
  // ag-grid 生命周期
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  exportData() {
    this.gridApi.exportDataAsExcel();
  }

  studentTypeId;
  // 修改学习形式
  async updateStudentType() {
    console.log(this.studentTypeId)
    if (!this.studentTypeId) {
      console.log("请先选择学习形式");
      return;
    }

    if (this.profileList.length > 0) {

      for (let i = 0; i < this.profileList.length; i++) {
        let profile = new Parse.Query("Profile");
        profile.equalTo("idcard", this.profileList[i].idcard);
        profile.notEqualTo("isDeleted", true);
        profile.equalTo("department", this.profileList[i].department)
        let profileInfo = await profile.first()
        console.log(profileInfo);
        if (profileInfo && profileInfo.id) {

          if (this.studentTypeId != profileInfo.get("studentType")) {
            profileInfo.set("studentType", this.studentTypeId)
            profileInfo.save().then((res: any) => {
              console.log(res)

              this.profileList[i].studentType = this.studentTypeId;

            }).catch(err => {
              console.log(err)
              return
            })
          }

        }
      }
      console.log("处理完毕")
    } else {
      console.log("考生信息不存在");
      return;
    }
  }

  // 退费
  async refund() {

    // 获取专项计划信息
    // let recruit = new Parse.Query("RecruitStudent")
    // let recruitInfo = await recruit.get(this.recruitId)
    // console.log(recruitInfo)

    console.log(this.profileList)
    for (let i = 0; i < this.profileList.length; i++) {

      // 查询出缴费记录
      let account = new Parse.Query("AccountLog")
      account.equalTo("company", "5beidD3ifA")
      account.contains("desc", this.recruitId)
      account.equalTo("isVerified", true)
      account.notEqualTo("isback", true)
      account.contains("orderId", this.profileList[i].objectId)
      let accountInfo = await account.first()
      console.log(accountInfo)
      if (accountInfo && accountInfo.id) {

        let res = await accountInfo.destroy()
        console.log(res)

      }
    }
  }


  /**  考生修改报名考点   **/
  profileCateList: any = [];
  listOfCatesColumn = [
    {
      title: '姓名',
      value: 'name',
    },
    {
      title: '性别',
      value: 'sex',
    },
    {
      title: '身份证号',
      value: 'idcard',
    },
    {
      title: '手机号',
      value: '',
    },
    {
      title: '专业',
      value: '',
    },
    {
      title: '报名考点',
      value: 'name',
    }
  ];
  onFileChangeCates(evt: any) {
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(data)
    console.log(target, target.files.length);
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    console.log(reader);
    reader.onload = async (e: any) => {
      console.log(e);
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      this.idcardList = []
      for (let i = 0; i < this.data.length; i++) {
        this.idcardList.push(this.data[i].idcard)
      }
      this.dataLen = this.data.length
      console.log(this.idcardList)

      await this.getProfileInfoCate()

      console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  async getProfileInfoCate() {
    let recruitStudent = new Parse.Query("RecruitStudent");
    let recruitStudentInfo = await recruitStudent.get(this.recruitId)
    console.log(recruitStudentInfo)
    if (recruitStudentInfo && recruitStudentInfo.id) {
      console.log(recruitStudentInfo.get('department').id)
      let departmentId = recruitStudentInfo.get('department').id

      let inSql = '';
      for (let i = 0; i < this.idcardList.length; i++) {
        if (i == this.idcardList.length - 1) {
          inSql += `'${this.idcardList[i]}'`
        } else {
          inSql += `'${this.idcardList[i]}',`
        }
      }

      // 查询 退款记录数据
      let sql = `select distinct "pro"."objectId" , "pro"."name", "pro"."sex", "pro"."studentID", "pro"."idcard", "pro"."mobile", "pro"."lang", "pro"."SchoolMajor", "major"."name" as "majorName",
    "pro"."studentType" as "studenttype", "cateOne"."name" as "cateonename", "cateTwo"."name" as "catetwoname", "pro"."cateOneObjectId", "pro"."cateTwoObjectId"
    from 
    (select *,"cates"::text::json->>0 as "cateOneObjectId", "cates"::text::json->>1 as "cateTwoObjectId" from "Profile" 
        where "isDeleted" is not true and "department" = '${departmentId}' and "idcard" in (${inSql}) ) as "pro"
    left join "SchoolMajor" as "major" on "major"."objectId" = "pro"."SchoolMajor" 
    left join
      "Category" as "cateOne" on "cateOne"."objectId" = "pro"."cateOneObjectId"::json->>'objectId'
    left join
      (select * from "Category") as "cateTwo" on "cateTwo"."objectId" = "pro"."cateTwoObjectId"::json->>'objectId'
    `
      console.log(sql)
      let profileDatas = await this.novaSql(sql)

      console.log(profileDatas)
      if (profileDatas && profileDatas.length) {
        this.profileCateList = profileDatas
        this.profileCount = profileDatas.length
      }
      console.log(this.profileCount, this.profileCateList)
      return this.profileCateList
    }
  }

  async updateCates() {
    console.log(this.cateId)
    if (!this.cateId) {
      console.log("考点id不能为空");
      return
    }

    for (let i = 0; i < this.profileCateList.length; i++) {
      let profile = new Parse.Query("Profile")
      profile.equalTo("objectId", this.profileCateList[i].objectId);
      profile.notEqualTo("isDeleted", true);
      profile.include("cates")
      let profileInfo = await profile.first()
      console.log(profileInfo)
      if (profileInfo && profileInfo.id) {

        if (this.profileCateList[i].catetwoname) {
          console.log(await this.getCategory(this.profileCateList[i].catetwoname))
          if (await this.getCategory(this.profileCateList[i].catetwoname)) {
            console.log(profileInfo.get("cates")[0].id)
            profileInfo.set("cates", [
              {
                __type: "Pointer",
                className: "Category",
                objectId: profileInfo.get("cates")[0].id
              },
              {
                __type: "Pointer",
                className: "Category",
                objectId: this.cateId
              }
            ]);
          } else {
            if (await this.getCategory(this.profileCateList[i].cateonename)) {
              console.log(profileInfo.get("cates")[1].id)
              profileInfo.set("cates", [
                {
                  __type: "Pointer",
                  className: "Category",
                  objectId: this.cateId
                },
                {
                  __type: "Pointer",
                  className: "Category",
                  objectId: profileInfo.get("cates")[1].id
                }
              ]);
            }
          }
        } else {
          if (!this.profileCateList[i].cateonename || await this.getCategory(this.profileCateList[i].cateonename)) {
            profileInfo.set("cates", [
              {
                __type: "Pointer",
                className: "Category",
                objectId: this.cateId
              }
            ]);
          }
        }
        let profileData = await profileInfo.save()
        console.log(profileData)
      }
    }
    this.getProfileInfoCate()
  }

  async getCategory(value) {
    let category = new Parse.Query("Category")
    category.equalTo("name", value);
    category.equalTo("showType", "school_area");
    // category.equalTo("isEnabled", true);
    category.equalTo("type", 'test');
    let categoryInfo = await category.first()
    console.log(categoryInfo)
    return categoryInfo && categoryInfo.id ? true : false
  }


  /**               保存报名审核基础考生数据(批量)                      **/
  recruitProfileList: any = [];
  listOfRecruitProfileColumn = [
    {
      title: '姓名',
      value: 'name',
    },
    {
      title: '性别',
      value: 'sex',
    },
   
    {
      title: '身份证号',
      value: 'idcard',
    },
    {
      title: '联系电话',
      value: 'mobile',
    },
    {
      title: '所属专业',
      value: 'schoolMajor',
    },
    {
      title: '考点',
      value: 'cate',
    },
    {
      title: '学习形式',
      value: 'studentType',
    },
    {
      title: '专项计划',
      value: 'recruit',
    },
    {
      title: 'DATA',
      value: 'data',
    }
  ];
  recruitProfileCount;
  onFileChangeRecruitProfile(evt: any) {
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(data)
    console.log(target, target.files.length);
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    console.log(reader);
    reader.onload = async (e: any) => {
      console.log(e);
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      this.idcardList = []
      for (let i = 0; i < this.data.length; i++) {
        this.idcardList.push(this.data[i]["身份证号"].trim())

        let recruitProfile: any = {}
        recruitProfile.name = this.data[i]["姓名"].trim()
        recruitProfile.sex = this.data[i]["性别"].trim()
        recruitProfile.idcard = this.data[i]["身份证号"].trim()
        // recruitProfile.schoolMajor = this.data[i]["所属专业"].trim()
        // recruitProfile.cate = this.data[i]["考点"].trim()
        recruitProfile.studentType = this.data[i]["学习形式"].trim()

        if (this.data[i]["民族"]) {
          recruitProfile.nation = this.data[i]["民族"].trim()
          recruitProfile.mobile = this.data[i]["联系电话"].trim()
        }


        this.recruitProfileList.push(recruitProfile)
      }
      this.recruitProfileCount = this.recruitProfileList.length
      this.dataLen = this.data.length
      console.log(this.recruitProfileCount)
      console.log(this.idcardList)
      console.log(this.data);
      console.log(this.recruitProfileList);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  recruitProCount;
  async checkProfile() {
    let recruitStudent = new Parse.Query("RecruitStudent");
    let recruitStudentInfo = await recruitStudent.get(this.recruitId)
    console.log(recruitStudentInfo)
    if (recruitStudentInfo && recruitStudentInfo.id) {
      console.log(recruitStudentInfo.get('department').id)
      let departmentId = recruitStudentInfo.get('department').id

      let profile = new Parse.Query("Profile")
      profile.notEqualTo("isDeleted", true);
      // profile.equalTo("department", departmentId)
      profile.containedIn("idcard", this.idcardList);
      profile.equalTo("type", "testsystem")
      let pCount = await profile.count()
      profile.limit(pCount)
      let proflieList = await profile.find();
      console.log(proflieList)
      if (proflieList && proflieList.length) {
        this.profileCount = proflieList.length
      }

      let recruitProfile = new Parse.Query("RecruitProfile")
      recruitProfile.equalTo("recruit", this.recruitId);
      recruitProfile.equalTo("department", departmentId)
      recruitProfile.containedIn("idcard", this.idcardList);
      let count = await recruitProfile.count()
      recruitProfile.limit(count)
      let recruitProfileList = await recruitProfile.find();
      console.log(recruitProfileList)
      if (recruitProfileList && recruitProfileList.length) {
        this.recruitProCount = recruitProfileList.length
      }
    }
  }
  number;
  totalCount;
  async saveRecruitProfile() {
    let recruitStudent = new Parse.Query("RecruitStudent");
    let recruitStudentInfo = await recruitStudent.get(this.recruitId)
    console.log(recruitStudentInfo)
    if (recruitStudentInfo && recruitStudentInfo.id) {
      console.log(recruitStudentInfo.get('department').id)
      let departmentId = recruitStudentInfo.get('department').id

      let RecruitProfile = Parse.Object.extend("RecruitProfile");

      this.totalCount = this.recruitProfileList.length
      for (let i = 0; i < this.recruitProfileList.length; i++) {
        this.number = i + 1;
        let recruitProfile = new RecruitProfile();
        // let majorInfo = await this.getMajorInfo(this.recruitProfileList[i].schoolMajor, departmentId)
        // console.log(majorInfo)
        // let cateInfo = await this.getCategoryInfo(this.recruitProfileList[i].cate, departmentId)
        // console.log(cateInfo)

        // recruitProfile.set("SchoolMajor", {
        //   __type: "Pointer",
        //   className: "RecruitStudent",
        //   objectId: majorInfo.id,
        // })
        recruitProfile.set("sex", this.recruitProfileList[i].sex);
        // recruitProfile.set("site", {
        //   __type: "Pointer",
        //   className: "Category",
        //   objectId: cateInfo.id,
        // })
        recruitProfile.set("name", this.recruitProfileList[i].name);
        recruitProfile.set("idcard", this.recruitProfileList[i].idcard);
        recruitProfile.set("department", {
          __type: "Pointer",
          className: "Department",
          objectId: departmentId,
        });

        recruitProfile.set("data", {
          "site": "",
          "major": "",
          "专业": "",
          "姓名": this.recruitProfileList[i].name,
          "性别": this.recruitProfileList[i].sex,
          "类别": this.recruitProfileList[i].studentType,
          "函授站点": "",
          "身份证号": this.recruitProfileList[i].idcard
        });

        switch (this.recruitProfileList[i].studentType) {
          case "函授":
            this.recruitProfileList[i].studentType = "curresTest"
            break;
          case "自考":
            this.recruitProfileList[i].studentType = "selfTest"
            break;
          case "成考":
            this.recruitProfileList[i].studentType = "adultTest"
            break;
          default: ;
        }

        recruitProfile.set("type", this.recruitProfileList[i].studentType);
        recruitProfile.set("company", {
          __type: "Pointer",
          className: "Company",
          objectId: "5beidD3ifA",
        })
        recruitProfile.set("recruit", {
          __type: "Pointer",
          className: "RecruitStudent",
          objectId: this.recruitId,
        })

        await recruitProfile.save()
      }

      await this.getRecruitProfile()

    }
  }

  async saveProfile() {
    let recruitStudent = new Parse.Query("RecruitStudent");
    let recruitStudentInfo = await recruitStudent.get(this.recruitId)
    console.log(recruitStudentInfo)
    if (recruitStudentInfo && recruitStudentInfo.id) {
      console.log(recruitStudentInfo.get('department').id)
      let departmentId = recruitStudentInfo.get('department').id

      let profile = Parse.Object.extend("Profile");

      for (let i = 0; i < this.recruitProfileList.length; i++) {
        let profileInfo = new profile();
        let majorInfo = await this.getMajorInfo(this.recruitProfileList[i].schoolMajor, departmentId)
        console.log(majorInfo)
        let cateInfo = await this.getCategoryInfo(this.recruitProfileList[i].cate, departmentId)
        console.log(cateInfo)
        profileInfo.set("departments", [
          {
            __type: "Pointer",
            className: "Department",
            objectId: "uTlynQoh1n"
          }
        ]);
        profileInfo.set("mobile", this.recruitProfileList[i].mobile);
        profileInfo.set("cates", [
          {
            __type: "Pointer",
            className: "Category",
            objectId: "YWEPdqVUZB"
          }
        ])
        profileInfo.set("SchoolMajor", {
          __type: "Pointer",
          className: "SchoolMajor",
          objectId: majorInfo.id
        })
        profileInfo.set("sex", this.recruitProfileList[i].sex);
        profileInfo.set("nation", this.recruitProfileList[i].nation);
        profileInfo.set("name", this.recruitProfileList[i].name);
        profileInfo.set("idcard", this.recruitProfileList[i].idcard);
        profileInfo.set("lang", "英语");
        profileInfo.set("langCode", "01");
        profileInfo.set("type", "testsystem");
        profileInfo.set("department", {
          __type: "Pointer",
          className: "Department",
          objectId: "uTlynQoh1n"
        });

        switch (this.recruitProfileList[i].studentType) {
          case "函授":
            this.recruitProfileList[i].studentType = "curresTest"
            break;
          case "自考":
            this.recruitProfileList[i].studentType = "selfTest"
            break;
          case "成考":
            this.recruitProfileList[i].studentType = "adultTest"
            break;
          default: ;
        }

        profileInfo.set("studentType", this.recruitProfileList[i].studentType);
        profileInfo.set("company", {
          __type: "Pointer",
          className: "Company",
          objectId: "5beidD3ifA",
        })
        profileInfo.save().then(data => {
          console.log(data)
        }).catch(err => {
          console.log(err)
          this.message.error("保存失败!")
          return
        })

      }
      this.message.info("保存成功!")
      // this.getRecruitProfile()
    }
  }


  async getRecruitProfile() {
    // if (!this.studentTypeId) {
    //   this.message.error("学习形式为空!");
    //   return
    // }

    let recruitStudent = new Parse.Query("RecruitStudent");
    let recruitStudentInfo = await recruitStudent.get(this.recruitId)
    console.log(recruitStudentInfo)
    if (recruitStudentInfo && recruitStudentInfo.id) {
      console.log(recruitStudentInfo.get('department').id)
      let departmentId = recruitStudentInfo.get('department').id

      let sql = `select "objectId", "name", "sex", "idcard", "SchoolMajor" as "schoolMajor", "site" as "cate", "data", "type" as "studentType", "recruit", "department", "company", "createdAt"
      from "RecruitProfile" 
      where "department" = '${departmentId}' and "recruit" = '${this.recruitId}'`

      //  and "type" = '${this.studentTypeId}' 

      let orderSql = ` order by "createdAt" desc `

      console.log(sql + orderSql)
      let recruitProfileInfo = await this.novaSql(sql + orderSql)

      console.log(recruitProfileInfo)
      this.recruitProfileCount = recruitProfileInfo.length
      this.recruitProfileList = recruitProfileInfo
    }
  }

  // 不存在专业
  defectMajorSet = []
  defectCateSet = []
  async checkSchoolCate() {
    let majorSet = []
    let cateSet = []

    this.defectMajorSet = []
    this.defectCateSet = []

    let recruitStudent = new Parse.Query("RecruitStudent");
    let recruitStudentInfo = await recruitStudent.get(this.recruitId)
    console.log(recruitStudentInfo)
    if (recruitStudentInfo && recruitStudentInfo.id) {
      console.log(recruitStudentInfo.get('department').id)
      let departmentId = recruitStudentInfo.get('department').id

      for (let i = 0; i < this.recruitProfileList.length; i++) {
        if (majorSet.length < 1) {
          majorSet.push(this.recruitProfileList[i].schoolMajor)
          let schoolMajorInfo = await this.getMajorInfo(this.recruitProfileList[i].schoolMajor, departmentId)
          console.log(schoolMajorInfo)
          if (!schoolMajorInfo) {
            this.defectMajorSet.push(this.recruitProfileList[i].schoolMajor)
          }
        } else {
          let flag = true
          for (let j = 0; j < majorSet.length; j++) {
            if (majorSet[j] == this.recruitProfileList[i].schoolMajor) {
              flag = false
            }
          }
          if (flag) {
            majorSet.push(this.recruitProfileList[i].schoolMajor)
            let schoolMajorInfo = await this.getMajorInfo(this.recruitProfileList[i].schoolMajor, departmentId)
            console.log(schoolMajorInfo)
            if (!schoolMajorInfo) {
              this.defectMajorSet.push(this.recruitProfileList[i].schoolMajor)
            }
          }
        }

        if (cateSet.length < 1) {
          cateSet.push(this.recruitProfileList[i].cate)
          let categoryInfo = await this.getCategoryInfo(this.recruitProfileList[i].cate, departmentId)
          console.log(categoryInfo)
          if (!categoryInfo) {
            this.defectCateSet.push(this.recruitProfileList[i].cate)
          }
        } else {
          let flag = true
          for (let j = 0; j < cateSet.length; j++) {
            if (cateSet[j] == this.recruitProfileList[i].cate) {
              flag = false
            }
          }
          if (flag) {
            cateSet.push(this.recruitProfileList[i].cate)
            let categoryInfo = await this.getCategoryInfo(this.recruitProfileList[i].cate, departmentId)
            console.log(categoryInfo)
            if (!categoryInfo) {
              this.defectCateSet.push(this.recruitProfileList[i].cate)
            }
          }
        }
      }
      console.log(majorSet)
      console.log(cateSet)
      console.log(this.defectMajorSet)
      console.log(this.defectCateSet)
    }
  }

  async getMajorInfo(name, depaId) {
    console.log(this.studentTypeId)
    if (!this.studentTypeId) {
      this.message.error("学习形式为空!");
      return
    }
    let schoolMajor = new Parse.Query("SchoolMajor")
    schoolMajor.equalTo("name", name)
    schoolMajor.equalTo("school", depaId)
    schoolMajor.equalTo("type", this.studentTypeId)
    schoolMajor.equalTo("isEnabled", true)
    let schoolMajorInfo = await schoolMajor.first();
    console.log(schoolMajorInfo)
    return schoolMajorInfo && schoolMajorInfo.id ? schoolMajorInfo : null
  }

  async getCategoryInfo(name, depaId) {
    console.log(name, depaId)
    let category = new Parse.Query("Category")
    category.equalTo("name", name)
    category.equalTo("department", depaId)
    // category.equalTo("type", "test")
    category.equalTo("showType", "school_area")
    category.equalTo("isEnabled", true)
    let categoryInfo = await category.first();
    console.log(categoryInfo)
    return categoryInfo && categoryInfo.id ? categoryInfo : null
  }

  /*处理院校profile信息逻辑删除 */
  schoolProfile: any;
  recoveryProList: any;
  xbRProfile: any;

  /**               九江学院添加站点信息(批量)                      **/
  profileCatesList: any = [];
  listOfProfileCatesColumn = [
    {
      title: '姓名',
      value: 'name',
    },
    {
      title: '身份证号',
      value: 'idcard',
    },
    {
      title: '站点名称',
      value: 'cate1Name',
    },
    {
      title: '站点代码',
      value: 'cate1Code',
    },
    {
      title: '考点名称',
      value: 'cate2Name',
    },
    {
      title: '考点代码',
      value: 'cate2Code',
    },
  ];
  profileCatesCount;
  onFileChangeProfileCates(evt: any) {
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(data)
    console.log(target, target.files.length);
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    console.log(reader);
    reader.onload = async (e: any) => {
      console.log(e);
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      this.idcardList = []
      for (let i = 0; i < this.data.length; i++) {
        this.idcardList.push(this.data[i]["身份证号"].trim())

        let recruitProfile: any = {}
        recruitProfile.name = this.data[i]["姓名"].trim()
        recruitProfile.cate1Code = this.data[i]["站点代码"].trim()
        recruitProfile.idcard = this.data[i]["身份证号"].trim()

        this.profileCatesList.push(recruitProfile)
      }
      this.profileCatesCount = this.profileCatesList.length
      console.log(this.profileCatesCount)
      console.log(this.idcardList)
      console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  twoCatesList = [];
  async batchHandle() {
    if (!this.idcardList.length) {
      this.message.error("身份证号信息没有数据!")
      return;
    }
    let departmentId;
    let recruitStudent = new Parse.Query("RecruitStudent");
    let recruitStudentInfo = await recruitStudent.get(this.recruitId)
    console.log(recruitStudentInfo)
    if (recruitStudentInfo && recruitStudentInfo.id) {
      console.log(recruitStudentInfo.get('department').id)
      departmentId = recruitStudentInfo.get('department').id
    }

    if (departmentId) {
      for (let i = 0; i < this.profileCatesList.length; i++) {
        let profile = new Parse.Query("Profile");
        profile.equalTo("department", departmentId);
        profile.equalTo("idcard", this.profileCatesList[i].idcard);
        profile.notEqualTo("isDeleted", true);
        let profileInfo = await profile.first();
        console.log(profileInfo)
        if (profileInfo && profileInfo.id) {
          console.log(profileInfo.get("cates"))
          if (!profileInfo.get("cates") || profileInfo.get("cates").length == 0) {
            let catesId = await this.getCatesByCateCode(this.profileCatesList[i].cate1Code, departmentId);
            console.log(catesId)
            if (catesId) {
              profileInfo.set("cates", [
                {
                  __type: "Pointer",
                  className: "Category",
                  objectId: catesId
                }
              ]);

              let res = await profileInfo.save().catch(err => console.log(err))
              console.log(res)
            }
          }
          else if (profileInfo.get("cates") && profileInfo.get("cates").length == 1) {
            let catesId = await this.getCatesByCateCode(this.profileCatesList[i].cate1Code, departmentId);
            console.log(catesId)
            if (catesId) {
              profileInfo.set("cates", [
                {
                  __type: "Pointer",
                  className: "Category",
                  objectId: catesId
                },
                {
                  __type: "Pointer",
                  className: "Category",
                  objectId: profileInfo.get("cates")[0].id
                }
              ]);

              let res = await profileInfo.save().catch(err => console.log(err))
              console.log(res)
            }
          }
          else {
            this.twoCatesList.push(profileInfo)
          }
        }
      }
      this.message.info("修改成功!");
      console.log(this.twoCatesList)
      this.getProfileList()
    } else {
      this.message.error("请先选择院校!")
      return;
    }
  }

  async getCatesByCateCode(cateCode, depaId) {
    console.log(cateCode, depaId)
    let category = new Parse.Query("Category")
    category.equalTo("name_en", cateCode);
    category.equalTo("showType", "school_area");
    category.equalTo("department", depaId);
    // category.equalTo("isEnabled", true);
    category.notEqualTo("type", 'test');
    let categoryInfo = await category.first()
    console.log(categoryInfo)
    return categoryInfo && categoryInfo.id ? categoryInfo.id : null
  }

  // 查询院校profile信息，除去新疆考点的其他profile
  async getSchoolProfile() {
    let baseurl = this.baseurl;
    let sql = `select "objectId" from "Profile" where "company" = '5beidD3ifA' and "isDeleted" is not true and "department" = '${this.department}'
    and "objectId" not in (
    select "Profile"."objectId" from "Profile" join "AccountLog"  
    on SUBSTRING("AccountLog"."orderId",2,10) = "Profile"."objectId"
    where "Profile"."department" = '${this.department}' 
    and "Profile"."isDeleted"  is not true
    and "Profile"."cates" @> '[{ "objectId": "BoEtIDHQ9Z"}]'
    and "AccountLog"."desc" like '${this.recruitId}%' 
    and "AccountLog"."isVerified"=true and "AccountLog"."isback" is not true
    )`;
    this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
      if (res.data && res.data.length > 0) {
        this.schoolProfile = res.data
        console.log(res.data);
      }
    })
  }

  // 软删除
  async delSchoolProfile() {
    // 这个baseurl只有查询权限，没有修改权限，sql无效
    // let baseurl = this.baseurl;
    // console.log(this.schoolProfile);
    // // let sql = `update "Profile" set  "isDeleted" = true  where "objectId" in '${this.schoolProfile}'`;
    // let sql = `update "Profile" set  "isDeleted" = true  where "objectId" in ('5yQzUlW7ay','MWL2k2oetY','zreJBm3kvP')`;
    // this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
    //   if(res && res.lenght > 0){
    //     console.log(res);
    //     this.schoolProfile = res
    //   }
    // })
    let profileId = []
    for (let i = 0; i < this.schoolProfile.length; i++) {
      profileId.push(this.schoolProfile[i].objectId)
    }
    console.log(profileId);

    let pro = new Parse.Query("Profile");
    pro.containedIn("objectId", profileId);
    let count = await pro.count()
    pro.limit(count)
    let profileList = await pro.find()

    if (profileList && profileList.length) {
      for (let i = 0; i < profileList.length; i++) {
        if (profileList[i].id == 'sQeh9uTACe') {
        } else {
          profileList[i].set("isDeleted", true)
          let res = await profileList[i].save()
          console.log(res)
        }
      }
    }
  }

  // 查询院校profile信息，只要通过准考证的
  async getRecoveryProfile() {
    let baseurl = this.baseurl;
    let sql = `select "Profile"."objectId","Profile"."name","ExamPassRule"."totalScore" as "examTotalScore","SurveyLog"."grade"
    from "Profile" join "SurveyLog" 
    on ("SurveyLog"."profile" = "Profile"."objectId" )
    join "ExamPassRule" on 
   ( "SurveyLog"."exam" = "ExamPassRule"."exam"
    and "Profile"."langCode" = "ExamPassRule"."langCode")
    where "Profile"."department" = '${this.department}' 
    and "Profile"."isDeleted"  is true
    and "ExamPassRule"."objectId" in ('VQL8hPBmmR','SoeUR3zUFD','WXWFPeIPA9','UzvAv6VqI9')
    and "SurveyLog"."grade" >=  "ExamPassRule"."totalScore"
    `
    this.http.post(baseurl, { sql }).subscribe(async (res: any) => {
      if (res.data && res.data.length > 0) {
        console.log(res.data);
        this.recoveryProList = res.data
      }
    })
  }

  // 合格证的信息不做软删除，恢复数据
  async recoveryProfile() {
    let profileId = []
    for (let i = 0; i < this.recoveryProList.length; i++) {
      profileId.push(this.recoveryProList[i].objectId)
    }
    console.log(profileId);

    let pro = new Parse.Query("Profile");
    pro.containedIn("objectId", profileId);
    let count = await pro.count()
    pro.limit(count)
    let profileList = await pro.find()
    console.log(profileList);

    if (profileList && profileList.length) {
      for (let i = 0; i < profileList.length; i++) {
        if (profileList[i].id == 'sQeh9uTACe') {
        } else {
          profileList[i].set("isDeleted", false)
          let res = await profileList[i].save()
          console.log(res)
        }
      }
    }
  }

  async getProfileList(value?) {
    let recruitStudent = new Parse.Query("RecruitStudent");
    let recruitStudentInfo = await recruitStudent.get(this.recruitId)
    console.log(recruitStudentInfo)
    if (recruitStudentInfo && recruitStudentInfo.id) {
      console.log(recruitStudentInfo.get('department').id)
      let departmentId = recruitStudentInfo.get('department').id

      let sql;

      if (value) {
        let inSql = await this.getInSql();

        sql = `select "name","idcard","updatedAt" from 
        (select distinct "name","idcard","updatedAt" from "Profile" 
            where "company" = '5beidD3ifA' and "department" = '${departmentId}' and "isDeleted" is not true and "idcard" in (${inSql}) ) as "pro"
        `
      } else {
        sql = `select "name","idcard","cate1Name","cate1Code","cate2Name","cate2Code","updatedAt" from 
        (select "name","idcard","updatedAt",jsonb_array_elements("cates")::json->>'objectId' as "cateId" from "Profile" 
            where "company" = '5beidD3ifA' and "department" = '${departmentId}' and "isDeleted" is not true ) as "pro"
        left join (select "objectId","name" as "cate1Name","name_en" as "cate1Code" from "Category" where "type" is null) as "cate1" on "cate1"."objectId" = "pro"."cateId"
        left join (select "objectId","name" as "cate2Name","name_en" as "cate2Code" from "Category" where "type" = 'test') as "cate2" on "cate2"."objectId" = "pro"."cateId"
        `
      }

      let orderSql = ` order by "updatedAt" desc `

      console.log(sql + orderSql)
      let profileInfo = await this.novaSql(sql + orderSql)

      console.log(profileInfo)
      this.profileCatesCount = profileInfo.length
      if (value) {
        let data = this.profileCatesList;
        this.profileCatesList = []
        for (let i = 0; i < profileInfo.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (profileInfo[i].idcard == data[j].idcard) {
              this.profileCatesList.push(data[j])
            }
          }
        }
      } else {
        this.profileCatesList = profileInfo
      }
      console.log(this.profileCatesList.length)
    }
  }

  getInSql() {
    let inSql = ``;
    for (let i = 0; i < this.profileCatesList.length; i++) {
      if (i == this.profileCatesList.length - 1) {
        inSql += `'${this.profileCatesList[i].idcard}'`
      } else {
        inSql += `'${this.profileCatesList[i].idcard}',`
      }
    }
    console.log(inSql)
    return inSql;
  }



  /*****         题库复制         *****/
  surveyId;
  surveyList: any[] = [];
  async getSurveyList() {
    console.log(this.company, this.pCompany, this.department);
    let survey = new Parse.Query("Survey");
    survey.equalTo("company", this.pCompany);
    survey.equalTo("department", this.department);
    survey.equalTo("type", "exam");
    survey.notEqualTo("isDeleted", true);
    let surveys = await survey.find();
    console.log(surveys);
    if (surveys && surveys.length) {
      this.surveyList = surveys;
    }
  }


  /*******************分配考场(区分上午/下午)*******************/
  pageIndex: number = 1;
  pageSize: number = 20;
  schoolClassList: any = [];
  schoolClassCount;
  profileClassList: any = [];
  profileClassCount;
  listOfProfileClassColumn = [
    {
      title: '姓名',
      value: 'name',
    },
    {
      title: '身份证号',
      value: 'idcard',
    },
    {
      title: '考试时间',
      value: 'classTime',
    }
  ];
  // 查询院校profile信息，除去新疆考点的其他profile
  async getRecruitProfile2() {
    let RecruitProfile = new Parse.Query("RecruitProfile");
    // 西北师范大学的基础数据库
    RecruitProfile.equalTo("department", 'p2LLGFpQhQ');
    let count = await RecruitProfile.count();
    RecruitProfile.limit(count)//22155
    let RProfile = await RecruitProfile.find();
    console.log(RProfile);
    this.xbRProfile = RProfile
  }


  // 删除基础数据库信息
  async delRecruitProfile() {
    let profileId = []
    for (let i = 0; i < this.xbRProfile.length; i++) {
      profileId.push(this.xbRProfile[i].id)
    }
    console.log(profileId);

    let pro = new Parse.Query("RecruitProfile");
    pro.containedIn("objectId", profileId);
    let count = await pro.count()
    pro.limit(count)
    let rProfileList = await pro.find()

    if (rProfileList && rProfileList.length) {
      for (let i = 0; i < rProfileList.length; i++) {
        // for (let i = 0; i < 3; i++) {
        rProfileList[i].destroy().then(res => {
          console.log(rProfileList[i]);
          console.log("删除成功");          
        }).catch(err=>{
          console.log(err);          
          console.log(rProfileList[i]);
          console.log("失败");
          return
        });
      }
    }
  }



  onFileChangeSchoolClass(evt: any) {
    this.profileClassList = []
    this.schoolClassList = []
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(data)
    console.log(target, target.files.length);
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    console.log(reader);
    reader.onload = async (e: any) => {
      console.log(e);
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      for (let i = 0; i < this.data.length; i++) {

        let recruitProfile: any = {}
        recruitProfile.name = this.data[i]["姓名"].trim()
        recruitProfile.idcard = this.data[i]["身份证号"].trim()
        recruitProfile.classTime = this.data[i]["考试时间"].trim()

        this.profileClassList.push(recruitProfile)
      }
      this.profileClassCount = this.profileClassList.length
      console.log(this.profileClassCount)
      console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // 获取考场信息
  async getSchoolClass() {
    this.profileClassList = []
    this.listOfProfileClassColumn = [
      {
        title: '考场名称',
        value: 'name',
      },
      {
        title: '考场编号',
        value: 'idcard',
      },
      {
        title: '考生数/座位数',
        value: 'cate1Name',
      },
      {
        title: '开始时间',
        value: 'cate1Name',
      },
      {
        title: '结束时间',
        value: 'cate1Name',
      }
    ]

    let selectSql = `select * from `
    let formSql = ` "SchoolClass" where "company" = '${this.pCompany || this.company}' and "department" = '${this.department}'`;
    let orderSql = `  order by "beginTime","name" `
    let breakSql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`

    console.log(selectSql + formSql + orderSql + breakSql);
    let profileList = await this.novaSql(selectSql + formSql + orderSql + breakSql)

    if (profileList && profileList.length) {
      /* 获取各个考场已导入考生数 */
      for (let index = 0; index < profileList.length; index++) {
        let pros = await this.getStudents(profileList[index].objectId);
        profileList[index].count = (pros && pros.length) || 0;
      }
    }
    this.schoolClassList = profileList
    let countSql = `select count(*) from ${formSql} `
    console.log(countSql)
    this.schoolClassCount = await this.getCount(countSql);
    console.log(this.schoolClassList)

  }
  async getStudents(id) {
    let Profile = new Parse.Query("Profile");
    Profile.notEqualTo("isDeleted", true);
    Profile.equalTo("department", this.department);
    Profile.equalTo("company", this.pCompany || this.company);
    Profile.equalTo("schoolClass", id);
    Profile.ascending("cardnum");
    let pros = await Profile.find();
    if (pros && pros.length) {
      return pros;
    }
  }
  pageChange(e) {
    // this.isLoading = true
    this.getSchoolClass()
  }

  checkProfileNumber;
  proIdcards = []
  // 考生校验
  async checkPro() {
    console.log(this.profileClassList)
    if (!this.profileClassList || !this.profileClassList.length) {
      this.message.error("请先导入考生信息!")
      return
    }


    for (let i = 0; i < this.profileClassList.length; i++) {
      this.proIdcards.push(this.profileClassList[i].idcard)
    }
    console.log(this.proIdcards)

    console.log(this.department)

    let pro = new Parse.Query("Profile")
    pro.equalTo("company", "5beidD3ifA")
    pro.equalTo("department", this.department)
    pro.containedIn("idcard", this.proIdcards)
    pro.notEqualTo("isDeleted", true)
    let count = await pro.count()
    pro.limit(count)
    let profileList = await pro.find()
    console.log(profileList)
    if (profileList && profileList.length) {
      this.checkProfileNumber = profileList.length
    }
  }

  exportProfileClassInit() {
    this.require = [];
    this.listOfProfileClassColumn.forEach(col => {
      let headerName = col['title'];
      let field = col['value'];
      this.require.push({
        headerName,
        field,
      })
    });
    console.log(require)
  }
  // 导出函数 :
  async exportProfileExcel() {
    this.ExportData = [];
    let data: any = await this.getProfileClass();
    this.ExportData = data && data.length ? data : []
    this.showExport = true;
    console.log(this.ExportData)
  }

  async getProfileClass() {
    console.log(this.proIdcards)
    let inSql = '';
    for (let i = 0; i < this.proIdcards.length; i++) {
      if (i == this.proIdcards.length - 1) {
        inSql += `'${this.proIdcards[i]}'`
      } else {
        inSql += `'${this.proIdcards[i]}',`
      }
    }

    // let sql = `select * from "Profile" where "company" = '5beidD3ifA' and "isDeleted" is not true and "department" = '${this.department}'
    //   and "idcard" in (${inSql}) `

    let sql = `select * from 
      (select * from "Profile" where "company" = '5beidD3ifA' and "isDeleted" is not true and "department" = '${this.department}' and "idcard" in (${inSql}) ) as "pro"
    join (select * from "AccountLog" where "isVerified" is true and "isback" is not true and "desc" like '%${this.recruitId}%' )  as "log" 
      on SUBSTRING("log"."orderId",2,10) = "pro"."objectId" `

    console.log(sql)
    let profileList = await this.novaSql(sql)
    if (profileList && profileList.length) {
      for (let index = 0; index < profileList.length; index++) {
        let item = profileList[index];
        item.idcard = item.idcard ? "'" + item.idcard : "";
        if (index + 1 == profileList.length) {
          return profileList
        }
      }
    }
  }

  // 校验用户是否缴费
  async checkProAccount() {
    console.log(this.proIdcards)
    let inSql = '';
    for (let i = 0; i < this.proIdcards.length; i++) {
      if (i == this.proIdcards.length - 1) {
        inSql += `'${this.proIdcards[i]}'`
      } else {
        inSql += `'${this.proIdcards[i]}',`
      }
    }

    let sql = `select * from 
      (select * from "Profile" where "company" = '5beidD3ifA' and "isDeleted" is not true and "department" = '${this.department}' and "idcard" in (${inSql}) ) as "pro"
    join (select * from "AccountLog" where "isVerified" is true and "isback" is not true and "desc" like '%${this.recruitId}%' )  as "log" 
      on SUBSTRING("log"."orderId",2,10) = "pro"."objectId" `

    console.log(sql)
    let profileList = await this.novaSql(sql)
    if (profileList && profileList.length) {
      this.checkProfileNumber = profileList.length
    }
  }


  // 智能分配
  async distribution() {
    this.loading = true;

    // 获取到所有学生
    console.log(this.profileClassList)

    // 获取到所有考场
    console.log(this.schoolClassList)

    if (!this.profileClassList) {
      this.message.error("请先获取前置信息在进行分配! ")
      return
    }

    let ambeginTime = "2022-07-10 09:07:00"
    let amendTime = "2022-07-10 11:07:00"
    let pmbeginTime = "2022-07-10 02:07:00"
    let pmendTime = "2022-07-10 04:07:00"

    // 考场 和 考生进行区分
    let amSchoolClassList = []
    let pmSchoolClassList = []
    let amSelectSql = `select * from "SchoolClass" 
          where "company" = '${this.pCompany || this.company}' and "department" = '${this.department}' 
          and to_char("beginTime", 'yyyy-MM-dd HH:mm:ss') = '${ambeginTime}' and to_char("endTime", 'yyyy-MM-dd HH:mm:ss') = '${amendTime}'
          order by "beginTime","name" `
    console.log(amSelectSql)
    amSchoolClassList = await this.novaSql(amSelectSql)

    let pmSelectSql = `select * from "SchoolClass" 
          where "company" = '${this.pCompany || this.company}' and "department" = '${this.department}'
          and to_char("beginTime", 'yyyy-MM-dd HH:mm:ss') = '${pmbeginTime}' and to_char("endTime", 'yyyy-MM-dd HH:mm:ss') = '${pmendTime}'
          order by "beginTime","name" `
    console.log(pmSelectSql)
    pmSchoolClassList = await this.novaSql(pmSelectSql)


    let amProfileList = []
    let pmProfileList = []
    let otherProfileList = []
    for (let i = 0; i < this.profileClassList.length; i++) {
      if (this.profileClassList[i].classTime == '7月10日上午9:00-11:00') {
        amProfileList.push(this.profileClassList[i])
      } else if (this.profileClassList[i].classTime == '7月10日下午14:30-16:30') {
        pmProfileList.push(this.profileClassList[i])
      } else {
        otherProfileList.push(this.profileClassList[i])
      }
    }

    console.log(amSchoolClassList)
    console.log(pmSchoolClassList)
    console.log(amProfileList)
    console.log(pmProfileList)
    console.log(otherProfileList)

    let ruleConf = this.recruit && this.recruit.get("config")["ruleConf"];
    let examNumConf = ruleConf["examNumConf"];
    console.log(this.recruit)
    console.log(ruleConf)
    console.log(examNumConf)

    let query = new Parse.Query("Company")
    let companyInfo = await query.get(this.company);
    console.log(companyInfo)

    // 分配上午
    for (let j = 0; j < amSchoolClassList.length; j++) {
      let classNumber: number = 30;
      if (j * 30 >= amProfileList.length) {
        break;
      }
      for (let i = j * 30; i < amProfileList.length; i++) {
        let Profile = new Parse.Query("Profile");
        Profile.notEqualTo("isDeleted", true);
        Profile.equalTo("idcard", amProfileList[i].idcard)
        Profile.equalTo("name", amProfileList[i].name)
        Profile.equalTo("company", "5beidD3ifA")
        Profile.equalTo("department", "UmjXxAjvBK")
        let pro = await Profile.first()
        if (pro && pro.id) {
          pro.set("schoolClass", {
            className: "SchoolClass",
            __type: "Pointer",
            objectId: amSchoolClassList[j].objectId
          });
          let count = 30 - classNumber;
          let seat = count + 1 >= 10 ? "" + (count + 1) : "0" + (count + 1);
          pro.set("cardnum", seat);
          pro.set("location", amSchoolClassList[j].address);
          pro.set("serial", amSchoolClassList[j].testNumber + '');
          console.log(seat);

          let res = await pro.save();
          console.log(res)

          let examNum = await this.getExamNum(
            res,
            examNumConf,
            res.get("cardnum"),
            amSchoolClassList[j],
            companyInfo
          ); //seat 座位号
          console.log(examNum);
          res.set("workid", examNum); // 当前时间加考场号 座位号
          await res.save();

        }
        classNumber--
        if (classNumber == 0) {
          break;
        }
      }
    }

    // 分配下午
    for (let j = 0; j < pmSchoolClassList.length; j++) {
      let classNumber: number = 30;
      if (j * 30 >= pmProfileList.length) {
        break;
      }
      for (let i = j * 30; i < pmProfileList.length; i++) {
        let Profile = new Parse.Query("Profile");
        Profile.notEqualTo("isDeleted", true);
        Profile.equalTo("idcard", pmProfileList[i].idcard)
        Profile.equalTo("name", pmProfileList[i].name)
        Profile.equalTo("company", "5beidD3ifA")
        Profile.equalTo("department", "UmjXxAjvBK")
        let pro = await Profile.first()
        if (pro && pro.id) {
          pro.set("schoolClass", {
            className: "SchoolClass",
            __type: "Pointer",
            objectId: pmSchoolClassList[j].objectId
          });
          let count = 30 - classNumber;
          let seat = count + 1 >= 10 ? "" + (count + 1) : "0" + (count + 1);
          pro.set("cardnum", seat);
          pro.set("location", pmSchoolClassList[j].address);
          pro.set("serial", pmSchoolClassList[j].testNumber + '');
          console.log(seat);
          let res = await pro.save();
          console.log(res)

          let examNum = await this.getExamNum(
            res,
            examNumConf,
            res.get("cardnum"),
            pmSchoolClassList[j],
            companyInfo
          ); //seat 座位号
          console.log(examNum);
          res.set("workid", examNum); // 当前时间加考场号 座位号
          await res.save();

        }
        classNumber--
        if (classNumber == 0) {
          break;
        }
      }
    }

    this.loading = false
  }


  async getClassCount(classId) {
    let profile: any = new Parse.Query("Profile");
    profile.notEqualTo("isDeleted", true);
    profile.equalTo("schoolClass", classId);
    profile.equalTo("department", "UmjXxAjvBK");
    profile.equalTo("department", "5beidD3ifA");
    let count = await profile.count();
    return count;
  }

  getExamNum(profile, examNumConf, seat, schoolClass, companyInfo) {
    return new Promise(async (resolve, reject) => {
      let examNum = "";
      let numLen = examNumConf.length;
      try {
        for (let index = 0; index < numLen; index++) {
          let conf = examNumConf[index];
          if (conf.isEnabled) {
            if (conf["className"]) {
              switch (conf["className"]) {
                case "Profile":
                  switch (conf["type"]) {
                    case "String":
                      if (conf["field"] == "degreeNumber") {
                        // 报名序号后4位
                        let numLen = profile.get("degreeNumber").length;
                        let num = profile
                          .get("degreeNumber")
                          .substring(numLen - 5, numLen);
                        examNum += num;
                      } else if (conf["field"] == "cardnum") {
                        examNum += seat;
                      } else {
                        examNum += profile.get(conf["field"])
                          ? profile.get(conf["field"])
                          : "";
                      }
                      break;
                    case "Number":
                      if (profile.get(conf["field"])) {
                        examNum += profile.get(conf["field"]);
                      }
                      break;
                    // 所属报名站点代码
                    case "Array":
                      if (
                        conf["field"] == "cates" &&
                        profile.get(conf["field"]) &&
                        profile.get("cates").length
                      ) {
                        let name_en = "";
                        if (profile.get("cates")[0]) {
                          let namealias = profile
                            .get("cates")[0]
                            .get("name_en");
                          if (namealias) {
                            name_en = namealias;
                          } else {
                            name_en = await this.getNameEn(
                              profile.get("cates")[0].id
                            );
                          }
                        }
                        examNum += name_en;
                      }
                      break;
                    // 所属考场编号
                    case "Pointer":
                      if (
                        profile.get(conf["field"]) &&
                        conf["field"] == "schoolClass"
                      ) {
                        if (schoolClass.testNumber) {
                          let classNum = schoolClass.testNumber;

                          if (this.department == "UmjXxAjvBK") {
                            examNum +=
                              classNum < 10
                                ? "00" + classNum
                                : classNum < 100
                                  ? "0" + classNum
                                  : classNum;
                          } else {
                            examNum +=
                              classNum < 10 ? "0" + classNum : classNum;
                          }
                        }
                      }
                      break;
                    default:
                      break;
                  }

                  break;
                case "RecruitStudent":
                  if (this.recruit.get(conf["field"])) {
                    examNum += this.recruit.get(conf["field"])
                      ? this.recruit.get(conf["field"])
                      : "";
                  }
                  break;
                case "Company":
                  if (companyInfo.get(conf["field"])) {
                    examNum += companyInfo.get(conf["field"])
                      ? companyInfo.get(conf["field"])
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
            resolve(examNum);
          }
        }
      } catch (err) {
        console.log(err)
        this.message.error("准考证号生成错误,请检查准考证号生成规则");
      }
    });
  }

  async getNameEn(cateId) {
    let Category: any = new Parse.Query("Category");
    let cate = await Category.get(cateId);
    if (cate && cate.id) {
      return cate.get("name_en");
    } else {
      return "";
    }
  }
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
        year = (year + "").substring(2);
        return year;
      default:
        break;
    }
  }

  // 查看需排查考场内的考生
  async getProfileClassInfo() {

    this.profileClassList = []

    console.log(this.proIdcards)
    let inSql = '';
    for (let i = 0; i < this.proIdcards.length; i++) {
      if (i == this.proIdcards.length - 1) {
        inSql += `'${this.proIdcards[i]}'`
      } else {
        inSql += `'${this.proIdcards[i]}',`
      }
    }

    // left join (select "name" as "className","objectId" from "SchoolClass") as "class" on "class"."objectId" = "pro"."schoolClass" where "className" is null

    let sql = `select * from 
      (select "name","idcard","schoolClass","objectId" from "Profile" where "company" = '5beidD3ifA' and "isDeleted" is not true and "department" = '${this.department}' 
        and ("schoolClass" is not null or "cardnum" is not null or "location" is not null or "serial" is not null or "workid" is not null) and "idcard" in (${inSql}) ) as "pro"
    join (select * from "AccountLog" where "isVerified" is true and "isback" is not true and "desc" like '%${this.recruitId}%' )  as "log" 
      on SUBSTRING("log"."orderId",2,10) = "pro"."objectId" 
      `

    console.log(sql)
    let profileList = await this.novaSql(sql)
    if (profileList && profileList.length) {
      this.checkProfileNumber = profileList.length
      this.profileClassList = profileList
    }

  }

  // 清空考场内考生信息
  async emptyProfileClassInfo() {
    console.log(this.profileClassList)
    if (!this.profileClassList || !this.profileClassList.length) {
      this.message.error("请先导入前置信息!")
      return
    }

    for (let i = 0; i < this.profileClassList.length; i++) {
      let pro = new Parse.Query("Profile");
      pro.equalTo("company", "5beidD3ifA")
      pro.equalTo("department", "UmjXxAjvBK")
      pro.equalTo("name", this.profileClassList[i].name)
      pro.equalTo("idcard", this.profileClassList[i].idcard)
      pro.notEqualTo("isDeleted", true)
      let profile = await pro.first();
      console.log(profile)
      if (profile && profile.id) {
        profile.unset("schoolClass");
        profile.unset("cardnum");
        profile.unset("workid");
        profile.unset("location");
        profile.unset("serial");
        let res = await profile.save();
        console.log(res)
      }
    }
    this.message.success("处理成功! ")
  }


  num;
  testNumber;
  // 生成准考证号
  async generateWorkId() {
    let ambeginTime = "2022-07-10 09:07:00"
    let amendTime = "2022-07-10 11:07:00"
    let pmbeginTime = "2022-07-10 02:07:00"
    let pmendTime = "2022-07-10 04:07:00"

    // 考场 和 考生进行区分
    let amSchoolClassList = []
    let pmSchoolClassList = []
    let amSelectSql = `select * from 
    "Profile" where "company" = '5beidD3ifA' and "department" = 'UmjXxAjvBK' and "isDeleted" is not true and "schoolClass" in 
    (select "objectId" from "SchoolClass" 
    where "company" = '5beidD3ifA' and "department" = 'UmjXxAjvBK' 
    and to_char("beginTime", 'yyyy-MM-dd HH:mm:ss') = '${ambeginTime}' and to_char("endTime", 'yyyy-MM-dd HH:mm:ss') = '${amendTime}'
    order by "beginTime","name" limit 1) `
    console.log(amSelectSql)
    amSchoolClassList = await this.novaSql(amSelectSql)

    let pmSelectSql = `select * from 
    "Profile" where "company" = '5beidD3ifA' and "department" = 'UmjXxAjvBK' and "isDeleted" is not true and "schoolClass" in 
    (select "objectId" from "SchoolClass" 
    where "company" = '5beidD3ifA' and "department" = 'UmjXxAjvBK' 
    and to_char("beginTime", 'yyyy-MM-dd HH:mm:ss') = '${pmbeginTime}' and to_char("endTime", 'yyyy-MM-dd HH:mm:ss') = '${pmendTime}'
    order by "beginTime","name" limit 1) `
    console.log(pmSelectSql)
    pmSchoolClassList = await this.novaSql(pmSelectSql)

    console.log(amSchoolClassList.length)
    console.log(pmSchoolClassList.length)

    // for(let i = 0; i < amSchoolClassList.length; i++){
    //   let query = new Parse.Query("Profile")
    //   let pro = await query.get(amSchoolClassList[i].objectId)
    //   console.log(pro)
    //   if(pro && pro.id){
    //     let work = pro.get("workid");
    //     let cardnum = pro.get("cardnum");
    //     let workid:string = work.substring(0,7) + "101001" + cardnum
    //     console.log(workid)
    //     pro.set("workid", workid)
    //     let profile = await pro.save()
    //     console.log(profile)
    //   }
    // }

    this.testNumber = pmSchoolClassList.length
    for (let i = 0; i < pmSchoolClassList.length; i++) {
      this.num = i + 1
      let query = new Parse.Query("Profile")
      let pro = await query.get(pmSchoolClassList[i].objectId)
      console.log(pro)
      if (pro && pro.id) {
        let work = pro.get("workid");
        let cardnum = pro.get("cardnum");
        let workid: string = work.substring(0, 7) + "201001" + cardnum
        console.log(workid)
        pro.set("workid", workid)
        let profile = await pro.save()
        console.log(profile)
      }
    }

    this.message.success("生成成功! ")
  }

  /**********************院校已缴费记录排查**********************/


  // 微信缴费数量
  wxCount;
  // 支付宝缴费数量
  aliCount;

  schoolAccountList: any = [];;
  schoolAccountNumber;
  listOfSchoolAccountColumn = [
    {
      title: '姓名',
      value: 'name',
    },
    {
      title: '身份证号',
      value: 'idcard',
    },
    {
      title: '手机号',
      value: 'mobile',
    },
    {
      title: '支付单号',
      value: 'orderId',
    },
    {
      title: '备注',
      value: 'remake',
    }
  ]

  // 获取出院校缴费记录(微信, 支付宝)
  async getSchoolAccountLog() {

    console.log(this.department)

    // 获取院校缴费记录信息(微信, 支付宝)
    // let sql = `select "orderType", count(*) from 
    // (select "orderType" from 
    //   (select "objectId" from "Profile" where "company" = '5beidD3ifA' and "department" = '${this.department}' and "isDeleted" is not true) as "pro"
    // right join (select "orderId","orderType" from "AccountLog" where "isVerified" is true and "isback" is not true and "desc" like '%${this.recruitId}%') as "log"
    //       on SUBSTRING("log"."orderId",2,10) = "pro"."objectId") as "t"
    //       group by "orderType"
    //   `


    let sql = `select "name","idcard","mobile","orderId","remark" from 
      (select "objectId","name","idcard","mobile" from "Profile" where "company" = '5beidD3ifA' and "department" = '${this.department}' and "isDeleted" is not true) as "pro"
    right join (select "orderId","orderType","remark" from "AccountLog" where "isVerified" is true and "isback" is not true and "desc" like '%${this.recruitId}%') as "log"
          on SUBSTRING("log"."orderId",2,10) = "pro"."objectId"
    where "name" is null
      `

    console.log(sql)
    let account = await this.novaSql(sql)
    console.log(account)
    if (account && account.length) {
      this.schoolAccountNumber = account.length
      this.schoolAccountList = account
    }
    console.log(this.schoolAccountList)

  }

  accountOrderIds: any = []
  onFileChangeSchoolAccountLog(evt: any) {
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(data)
    console.log(target, target.files.length);
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    console.log(reader);
    reader.onload = async (e: any) => {
      console.log(e);
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      this.accountOrderIds = []
      for (let i = 0; i < this.data.length; i++) {
        this.accountOrderIds.push(this.data[i].orderId)
      }
      this.dataLen = this.data.length
      console.log(this.accountOrderIds)

      // await this.getEmptyAccountLog()

      console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }


  async getEmptyAccountLog() {

    console.log(this.accountOrderIds)

    let sql = `select "orderId","remark" from 
      (select "objectId" from "Profile" where "company" = '5beidD3ifA' and ("department" = 'uTlynQoh1n' or "department" = '7vc9cp0JQS') and "isDeleted" is not true) as "pro"
    join (select "orderId","remark" from "AccountLog" where "orderType" = '5beidD3ifA-wxsdk' and  "isVerified" is true and "isback" is not true and ("desc" = 'Bxb1AFCohJ_学位外语报名缴费' or "desc" = 'YF0jMzOfGU_学位外语报名缴费')) as "log"
          on SUBSTRING("log"."orderId",2,10) = "pro"."objectId"
      `

      //  to_char("createdAt",'yyyyMMdd') >= '20220320' and to_char("createdAt",'yyyyMMdd') <= '20220422' and 

    console.log(sql)
    let account = await this.novaSql(sql)
    console.log(account)
    for(let i = 0; i < this.accountOrderIds.length; i++){
      let check = false
      for(let j = 0; j < account.length; j++){
        if(account[j].orderId == this.accountOrderIds[i]){
          check = true
          break;
        }
      }

      if(!check){
        this.schoolAccountList.push(this.accountOrderIds[i])   
      }
    }

    // for(let i = 0; i < account.length; i++){
    //   let check = false
    //   for(let j = 0; j < this.accountOrderIds.length; j++){
    //     if(account[i].orderId == this.accountOrderIds[j]){
    //       check = true
    //       break;
    //     }
    //   }

    //   if(!check){
    //     this.schoolAccountList.push(account[i])   
    //   }
    // }

    console.log(this.schoolAccountList)
    
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
