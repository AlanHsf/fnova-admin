import { query } from '@angular/animations';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, Query, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { HttpClient } from '@angular/common/http';//引入http服务
import { DomSanitizer } from '@angular/platform-browser';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { DocumentService } from '../edit-document/document.service';
import { AuthService } from '../auth.service';
import { json } from 'gantt';
import { ResultComponent } from '../student-study/test/result/result.component';

@Component({
  selector: "app-student-center",
  templateUrl: "./student-center.component.html",
  styleUrls: ["./student-center.component.scss"]
})
export class StudentCenterComponent implements OnInit {
  userInfo: Parse.Object.ToJSON<Parse.Attributes> & Parse.JSONBaseAttributes;
  ngAfterContentInit(): void {
    let table = document.querySelectorAll(".table table");
    let thead = document.querySelectorAll(".table table thead");
    let tr = document.querySelectorAll(".table table thead tr");
    let td = document.querySelectorAll(".table table thead tr td");
    // table.classList.add("table1")
    // thead.classList.add("thead");
    // tr.classList.add("tr");
    // td.classList.add("td")
  }

  tabs = [
    {
      name: "我的学习",
      icon: "../../../assets/img/masterol/img/study.png"
    },
    {
      name: "培养计划",
      icon: "../../../assets/img/masterol/img/pyfa.png"
    },

    {
      name: "学术成果",
      icon: "../../../assets/img/masterol/img/lw.png"
    },
    {
      name: "我的论文",
      icon: "../../../assets/img/masterol/img/by.png"
    },
    {
      name: "个人档案",
      icon: "../../../assets/img/masterol/img/by.png"
    }
  ];


  index = 'First-content';

  // 已获学分
  score: number = 0;
  NewLessonRecordLog: any;
  LessonRecordLogs: any;
  LessonStatus: any;
  appcredit: any = 0;
  articles: any = [];
  Profile: any = [];
  SchoolPlan: any = [];
  SchoolClass: any = [];
  SchoolTestlog: any = [];
  Lesson: any;
  Schoollesson: any = [];
  gradeIndex: number = 0;
  Department: any = [];
  schoolname: any;
  activeIndex: any = 0;
  indexChange(index) {
    console.log(index)
    this.activeIndex = index;
    if (index == 4) {
      // this.getPaper();
    }
    if (index == 5) {
      // this.getEduFile();
    }
  }
  private Colment = 0;
  profileId: any;
  planTable: any;
  testTable: any;
  timeTable: any;
  // 个人档案
  // 加入党派
  joinDetail: any = [
    {
      joinTime: "",
      joinLocal: "",
      introducePerson: "",
      joinParty: "",
      becomeTime: ""
    },
    {
      joinTime: "",
      joinLocal: "",
      introducePerson: "",
      joinParty: "",
      becomeTime: ""
    }
  ];
  // 我的成绩 课程数组
  studyLesson: any = [];
  relation: any = [
    {
      filiation: "",
      name: "",
      sex: "",
      age: "",
      work: "",
      political: "",
      address: ""
    },
    {
      filiation: "",
      name: "",
      sex: "",
      age: "",
      work: "",
      political: "",
      address: ""
    }
  ];
  reward: "";
  punish: "";




  selfIntroduction: "";
  listOfData = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park"
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park"
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park"
    }
  ];

  current: any = 0;//步骤条状态
  isVerify: any = 'one';//步骤条状态


  //基本信息
  info: any = {
    name: '',//姓名
    sex: '',//性别
    region: '',//国家或地区
    nation: '',//民族
    place: '',//籍贯
    IDtype: '',//证件类型
    IDnumber: '',//证件号码
    politic: '',//政治面貌
    mobilePhone: '',//移动电话
    homePhone: '',//住宅电话
    workTime: '',//参加工作时间
    address: '',//家庭住址
    workUnit: '',//工作单位
    photo: [],//个人照片

  }
  // 学位信息
  otherInfo: any = {
    register: '',//注册ID
    year: '',//年度
    location: '',//学位授予单位所在省市地区
    grant: '',//授予单位
    degreeType: '',//学位类型
    degreeClass: '',//申请学位学科门类
    degreeName: '',//申请学位学科名称
    applicantType: '',//申请人类型
    applyDate: '',//网上学位申请年月
    unitLocation: '',//工作单位所在地
    unitName: '',//单位名称
    unitNature: '',//工作单位性质
    jobLevel: '',//行政职务级别
    techniqueLevel: '',//技术职务级别
    degreeReport: [],//学位认证报告
    academicReport: [],//学历认证报告
    learning: [],//学术成果
    periodical: [],//期刊收录
    eduResume: [
      {
        Period: "",
        schoolname: "",
        witness: ""
      },
      {
        Period: "",
        schoolname: "",
        witness: ""
      }
    ],//学习简历
    workResume: [
      {
        workPeriod: "",
        Workunit: "",
        job: "",
        voucher: ""
      },
      {
        workPeriod: "",
        Workunit: "",
        job: "",
        voucher: ""
      }
    ],//工作简历
    evaluation: '',//自我评价
  }

  degreeReport: any



  // private notice=false;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
    private sanitizer: DomSanitizer,
    private fileService: DocumentService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) { }



  // 步骤条
  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      case 3: {
        this.index = 'four-content';
        break;
      }
      case 4: {
        this.index = 'five-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  // 下一步
  next(): void {
    let info = this.info
    console.log(info);
    let phone = info.mobilePhone
    let IDcard = info.IDnumber
    let regs = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
    let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    for (let item in info) {
      console.log(info[item]);
      if (!info[item]) {
        this.message.error("请填写完整信息");
        return
      }
    }
    if (!reg.test(IDcard)) {
      this.message.error("身份证号格式错误");
      return
    }
    if (!regs.test(phone)) {
      this.message.error("手机号格式错误");
      return
    }

    this.current += 1;
    this.changeContent();

  }

  // 步骤条状态切换
  onIndexChange(event: number): void {
    console.log(event)
    this.current = event;
  }

  change(event) {
    console.log(event);

  }

  isCheck: any = 'wait-audit'
  getInfoCollection() {
    let company = localStorage.getItem("company");
    console.log(company);
    let user = Parse.User.current().id;
    let queryUser = new Parse.Query("User")
    queryUser.equalTo("objectId", user)
    queryUser.first().then(res => {
      if (res && res.id) {
        this.userInfo = res.toJSON()
        console.log(this.userInfo);
        let queryInfo = new Parse.Query("InfoCollection")
        queryInfo.equalTo("user", res.id)
        queryInfo.first().then(i => {
          if (i && i.id) {
            console.log(i.get("isVerify"));
            this.isCheck = i.get("isVerify")
            this.current = 2
          } else {
            this.current = 0
          }
        })
      }
    })
  }


  // 获取课程信息
  SchoolSingleScore: any = [];
  print: any = false;

  // 提交
  async submitInfo() {
    let otherInfo = this.otherInfo
    console.log(otherInfo);
    for (let item in otherInfo) {
      console.log(otherInfo[item]);
      if (!otherInfo[item]) {
        this.message.error("请填写完整信息");
        return
      }
    }
    let user = Parse.User.current().id;
    let queryD = new Parse.Query("Department")
    queryD.equalTo("subCompany", this.userInfo.school)
    let department = await queryD.first()
    let departmentId = department.id
    let companyId = department.get("company").id
    console.log(companyId);
    console.log(departmentId);
    let queryI = new Parse.Query("InfoCollection")
    queryI.equalTo("user", user)
    let info = await queryI.first()
    console.log(info);

    if (info && info.id) {
      info.set("department", {
        __type: "Pointer",
        className: "Department",
        objectId: departmentId
      });
      info.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: companyId
      });
      info.set("user", {
        __type: "Pointer",
        className: "_User",
        objectId: user
      });
      info.set("subCompany", {
        __type: "Pointer",
        className: "Company",
        objectId: this.userInfo.school
      });
      info.set("info", this.info)
      info.set("otherInfo", this.otherInfo)
      info.set("isVerify", "wait-audit")
      info.save().then(res => {
        this.message.success("提交成功");
        this.current = 2;
      })
    } else {
      let SaveInfo = Parse.Object.extend("InfoCollection");
      let saveInfo = new SaveInfo();
      saveInfo.set("department", {
        __type: "Pointer",
        className: "Department",
        objectId: departmentId
      });
      saveInfo.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: companyId
      });
      saveInfo.set("user", {
        __type: "Pointer",
        className: "_User",
        objectId: user
      });
      saveInfo.set("subCompany", {
        __type: "Pointer",
        className: "Company",
        objectId: this.userInfo.school
      });
      saveInfo.set("info", this.info)
      saveInfo.set("otherInfo", this.otherInfo)
      saveInfo.set("isVerify", "wait-audit")
      saveInfo.save().then(res => {
        console.log(res);
        this.message.success("提交成功");
        this.current = 2;
        this.isCheck = 'wait-audit';
      })
    }

  }
  toPrint() {
    let bdhtml = window.document.body.innerHTML;
    let jubuData = document.getElementById("applicaForm").innerHTML;
    //把获取的 局部div内容赋给body标签, 相当于重置了 body里的内容
    window.document.body.innerHTML = jubuData;
    window.print()
  }

  async getEduFile() {
    let query = new Parse.Query("SchoolEduFile");
    let profileId = this.Profile.objectId;
    query.equalTo("profile", profileId);
    let eduFile: any = await query.first();
    if (eduFile && eduFile.id) {
      this.joinDetail = eduFile.get("joinDetail") || [];
      this.relation = eduFile.get("relation") || [];
      this.otherInfo.eduResume = eduFile.get("eduResume") || [];
      this.otherInfo.workResume = eduFile.get("workResume") || [];
      this.reward = eduFile.get("reward") || "";
      this.punish = eduFile.get("punish") || "";
      this.selfIntroduction = eduFile.get("selfIntroduction") || "";
    }
  }
  goArticle(id) {
    window.open(`http://jxnu.cms.futurestack.cn/article/${id}`, "_blank");
  }
  logo: any;
  getProfile() {
    let user = Parse.User.current();
    let queryProfile = new Parse.Query("Profile");
    queryProfile.equalTo("user", user.id);
    queryProfile.include("schoolClass");
    queryProfile.include("department");
    queryProfile.include("SchoolMajor");
    queryProfile
      .first()
      .then(res => {
        if (res && res.id) {
          this.Profile = res.toJSON();
          this.profileId = res.id;
          this.getMajors();
          let company = res.get("company").id;
          this.departmentId = res.get("department").id;
          localStorage.setItem("company", company);
          console.log(company);

          let id;
          if (res.get("schoolClass") && res.get("schoolClass").id) {
            id = res.get("schoolClass").id;
            this.getSchoolClass(id);
          }
          let profile: any = res;
          this.getArticle(profile);
          this.lessons = this.Profile.SchoolMajor.plan.lessons
          console.log(this.lessons, this.Profile)
        }
      })
      .catch(err => {
        if (err.toString().indexOf("209") != -1) {
          this.sessionVisible = true;
          this.parseErr = err;
        }
      });
  }
  getArticle(profile) {
    profile.get("department").fetch().then(department => {
      let companyId;
      if (department.get("subCompany") && department.get("subCompany").id) {
        companyId = department.get("subCompany").id;
      }
      this.schoolname = companyId;
      let queryArticle = new Parse.Query("Article");
      queryArticle.equalTo("company", this.schoolname);
      queryArticle.limit(5);
      queryArticle.find().then(res => {
        if (res && res.length) {
          this.articles = res;
        }
      });
    });
  }
  // async getArticle() {
  //   let queryArticle = new Parse.Query("Article");
  //   queryArticle.equalTo("company", this.schoolname);
  //   queryArticle.limit(5)
  //   await queryArticle.find().then(res => {
  //     this.articles = res
  //   })

  // }
  company = localStorage.getItem('company')
  ngOnInit() {
    console.log(11111)
    this.activatedRoute.paramMap.subscribe(params => {
      let activeIndex = params.get("activeIndex");

      if (activeIndex) {
        this.activeIndex = activeIndex;
      }
      this.getProfile();
      this.getintext();
      this.getInfoCollection()
      this.getAcademic()
    });

    // this.getLesson()
    // this.getArticle()
  }

  getintext() {
    let tabletd;
    tabletd = document.getElementsByClassName("myPlan");
  }
  credits: any = 0;// 已获学分
  serverURL = "https://server.fmode.cn/api/masterol/";
  videoGrade: any;// 视频成绩
  sqlApi(result) {
    let profileId = this.profileId;
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let sql = `select 
    (select count(1) from "LessonArticle" where "LessonArticle"."lesson" = '${result.id}' AND "LessonArticle"."parent" is not null) as total,
    count(case when status = 2 then 1 else 0 end) as "count",
    (case when status = 2 then 1 else 0 end) as "isdown",
    sum(time) as "time"
   from (
     select  "LessonArticle"."objectId",
       max("LessonRecord"."user") as "user",
         (CASE WHEN max("LessonArticle"."parent")  is not null THEN 1 ELSE 0 END ) as "hasParent",
       max("LessonRecord"."status") as "status",
       count(1) over(PARTITION BY "LessonArticle"."objectId"),
       max("LessonRecord"."time") as "time",
       "LessonArticle"."objectId" as "articleId"
     from "LessonArticle"
     left join "LessonRecord" ON "LessonArticle"."objectId" = "LessonRecord"."lessonArticle"
   
     where "LessonArticle"."lesson" = '${result.id}'
     AND "LessonRecord"."user" = '${profileId}'
     group by "LessonArticle"."objectId"
   ) as LR
   group by LR."status"`;
    this.http.post(baseurl, { sql: sql }).subscribe(res => {
      let data = res['data'];
      if (data && data.length == 0) { // 没有学习记录
        result.studyStatus = 0 // 待学习
      } else {
        let total;
        let count;
        data.forEach(d => {
          result.studyStatus = 1
          if (d.isdown == 1) { // 在学习，已经学完的小节
            total = d.total
            count = d.count
            result.finish = ((d.count / d.total) * 100).toFixed(0);
            if (d.count == d.total) {
              result.studyStatus = 2
            }
          } else {
            total = d.total
          }
          if (!result.time) {
            result.time = 0
          }
          result.time += Number(((d.time ? d.time : 0) / 60).toFixed(0));
        });
        // 学习进度
        result.total = total;
        result.done = count;
        // result.time = (time / 60).toFixed(0);
        if (result.finish == 100) {// 一门课程视频全部看完了获得学分
          result.credit = result.get("credit");
          if (!result.credit) {
            result.credit = 0;
          }
          this.credits += result.credit;
          this.score += result.credit;
        }

        if (!total || (total == 0 || count == 0)) {
          result.videoGrade = 0;
          result.videoGrade2 = 0;
        } else {// 视频成绩
          result.videoGrade = ((count / total) * 100).toFixed(0);
          result.videoGrade2 = ((count / total) * 100 * 0.4).toFixed(0);
          if (!result.videoGrade) {
            result.videoGrade2 = 0;
          }
        }
      }
    })
  }
  async getStatus(result) {
    this.score = 0;
    this.sqlApi(result)
    // let user = Parse.User.current();

    // 课件学习进度
    // this.http.get(this.serverURL + "lesson?profileId=" + this.profileId + "&lessonId=" + result.id)
    //   .subscribe(res => {
    //     let status: any = res;
    //     status = status.data[0]
    //     result.done = status.done ? status.done : 0;
    //     result.total = status.total;

    //     result.finish = ((status.done / status.total) * 100).toFixed(0);
    //     if (result.finish = 100) {// 看完了获得学分
    //       this.credits += result.get("credit");
    //     }
    //     if (result.done == result.total) {
    //       result.credit = result.get("credit");
    //       if (!result.credit) {
    //         result.credit = 0;
    //       }
    //       this.score += result.get("credit");
    //     }
    //     if (!status.total) {
    //       result.videoGrade = 0;
    //     } else {
    //       if (status.total == 0 || status.done == 0) {
    //         result.videoGrade = 0;
    //         result.videoGrade2 = 0;
    //       } else {// 视频成绩
    //         result.videoGrade = ((status.done / status.total) * 100).toFixed(0);
    //         result.videoGrade2 = ((status.done / status.total) * 100 * 0.4).toFixed(0);
    //         if (!result.videoGrade) {
    //           result.videoGrade2 = 0;
    //         }
    //       }
    //     }
    //   });
    // 学习状态
    // this.http.get(this.serverURL + "lessonDetail?profileId=" + this.profileId + "&lessonId=" + result.id)
    //   .subscribe(res => {
    //     let data: any = res
    //     result.studyStatus = data.data.status;
    //     result.time = (data.data.time / 60).toFixed(0);
    //   });
    // 阶段测试进度
    this.http.get(this.serverURL + "lessonSurvey?profileId=" + this.profileId + "&lessonId=" + result.id)
      .subscribe(res => {
        let status: any = res;
        if (status && status.data[0]) {
          let count = status.count;
          let total = status.data[0].total;
          if (count && total) {
            // 阶段测试进度
            result.stageProgress = ((count / total) * 100).toFixed(0);
          }
        }
      });
    if (result.get("lessonTest") && this.profileId) {
      let querySurvey = new Parse.Query("SurveyLog");
      querySurvey.equalTo("survey", result.get("lessonTest").id);
      querySurvey.equalTo("profile", this.profileId);
      querySurvey.first().then(res => {
        if (res && res.id) {
          result.synProgress = res.get('grade');
          result.synProgress2 = (result.synProgress * 0.6).toFixed(0)
        }
      });
    }
    return result;
  }
  test: any = [];
  getSchoolClass(id) {
    if (id) {
      let query = new Parse.Query("SchoolClass");
      query.equalTo("objectId", id);
      query.first().then(res => {
        this.SchoolClass = res;
      });
    }
  }
  // async getSchoolTestlog(test) {
  //   let testItem;
  //   let test1 = [];
  //   let query = new Parse.Query("SchoolTestLog");
  //   if (test) {
  //     for (let i = 0; i < test.length; i++) {
  //       query.equalTo("objectId", test[i].id);

  //       testItem = await query.first();
  //       test1.push(testItem);
  //     }
  //   }

  //   this.SchoolTestlog = test1;
  // }

  getMajors() {
    let query = new Parse.Query("SchoolMajor");
    query.equalTo("objectId", this.Profile.SchoolMajor.objectId);
    query.first().then(res => {
      if (res && res.id) {
        this.getPlan(res.get("plan").id);
        this.Profile.major = res.get("name");
      }
    });
  }
  lowesterCredits: any;// 最低学分
  getPlan(id) {
    let query = new Parse.Query("SchoolPlan");
    query.equalTo("objectId", id);
    query.include('lessons')
    query.first().then(res => {
      if (res && res.id) {
        let lessons;
        if (res.get("lessons")) {
          lessons = res.get("lessons");
          this.lessons = lessons
          this.lowesterCredits = res.get('miniScore')
          this.getLesson(lessons);
        }
        this.SchoolPlan = res;
        this.planTable = this.sanitizer.bypassSecurityTrustHtml(
          res.get("planTable")
        );
        this.timeTable = this.sanitizer.bypassSecurityTrustHtml(
          res.get("timeTable")
        );
        this.testTable = this.sanitizer.bypassSecurityTrustHtml(
          res.get("testTable")
        );
      }
      this.getPaper();
      this.getEduFile();
    });
  }
  totalLesson: any = [];
  showSemester: boolean = false;// 是否显示开课学期
  getLesson(lessons) {
    let Lesson = [];
    for (let i = 0; i < lessons.length; i++) {
      let query_1 = new Parse.Query("Lesson");
      query_1.equalTo("objectId", lessons[i].id);
      query_1.first().then(async result => {
        if (result && result.id) {
          let count = await this.getLessonRecordLog(result);
          let item = await this.getStatus(result);
          item['times'] = count;
          if (item.get('semester')) {
            this.showSemester = true;
          }
          Lesson.push(item);
          this.Lesson = Lesson;
        }
      });
    }
  }
  async getLessonRecordLog(result) {
    if (this.Profile.objectId) {
      let query2 = new Parse.Query("LessonRecordLog");
      let user = Parse.User.current();
      let userId = user.id;
      query2.equalTo("profile", this.Profile.objectId);
      query2.equalTo("user", userId);
      query2.equalTo("lesson", result.id);
      let log = await query2.first()
      if (log && log.id) {
        return log.get("times");
      }
    }
  }

  setbgd(event) {
    let p = "";
    if ((event = 1)) {
      p = "RGBA(54, 153, 255, 1)";
    } else if ((event = 2)) {
      p = "RGBA(204, 229, 255, 1)";
    } else {
      p = "RGBA(170, 168, 168, 1)";
    }
    return { "background-color": p };
  }
  cat(index) {
    if (index == 0) {
      this.Colment = 0;
    } else if (index == 1) {
      this.Colment = 1;
    }
    // this.notice=false
  }

  // Noticenotice(){
  //   this.Colment=false;
  //   this.notice=true
  // }

  // 我的成绩 tab切换
  gradeTabControl(index) {
    if (index == 0) {
      this.gradeIndex = 0;
    } else if (index == 1) {
      this.gradeIndex == 1;
    }
  }
  // 跳转到学习页面
  toStudy(id) {
    let times;
    // let addTimes;
    let user = Parse.User.current();
    let userId = user.id;
    // this.Lesson.forEach(lesson => {
    //   if (lesson.id == id) {
    //     lesson.total > 0 ? addTimes = true : addTimes = false;
    //   }
    // })
    // if (addTimes) {
    if (this.profileId) {
      let query = new Parse.Query("LessonRecordLog");
      query.equalTo("lesson", id);
      query.equalTo("user", userId);
      query.equalTo("profile", this.profileId);
      query.first().then(res => {
        // 如果有学习记录   学习次数加1
        if (res && res.id) {
          let log = res;
          if (log.get("times")) {
            times = log.get("times") + 1;
          } else {
            times = 1;
          }
          log.set("times", times);
          log.save();
        } else {
          let company = localStorage.getItem("company");
          // 没有增加此课程学习记录
          let SaveLog = Parse.Object.extend("LessonRecordLog");
          let saveLog = new SaveLog();
          saveLog.set("lesson", {
            __type: "Pointer",
            className: "Lesson",
            objectId: id
          });
          saveLog.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: company
          });
          saveLog.set("user", {
            __type: "Pointer",
            className: "_User",
            objectId: userId
          });
          saveLog.set("profile", {
            __type: "Pointer",
            className: "Profile",
            objectId: this.profileId
          });
          // saveLog.set('departments', this.Profile.departments)
          saveLog.set("status", 1);
          saveLog.set("times", 1);
          saveLog.set("score", 0);
          saveLog.save()
        }
        this.router.navigate([
          `masterol-doctor/student-study/detail/`,
          {
            lesson: id
          }
        ]);
      })
        .catch(err => {
          if (err.toString().indexOf("209") != -1) {
            this.sessionVisible = true;
            this.parseErr = err;
          }
        });
    }
    // } 
    // else {
    //   this.message.create("info", "该课程尚未上传章节");
    // }

  }
  parseErr: any;
  handleOk(): void {
    setTimeout(() => {
      this.sessionVisible = false;
      this.authService.logout("notSession");
    }, 1000);
  }

  sessionVisible: boolean = false;
  // 毕业档案 新增一行
  addRow(type) {
    if (type == "relation") {
      this.relation.push({
        filiation: "",
        name: "",
        sex: "",
        age: "",
        work: "",
        political: "",
        address: ""
      });
    }
    if (type == "eduResume") {
      this.otherInfo.eduResume.push({
        Period: "",
        schoolname: "",
        witness: ""
      });
    }

    if (type == "workResume") {
      this.otherInfo.workResume.push({
        workPeriod: "",
        Workunit: "",
        job: "",
        voucher: ""
      });
    }
    if (type == "joinDetail") {
      this.joinDetail.push({
        joinTime: "",
        joinLocal: "",
        introducePerson: "",
        joinParty: "",
        becomeTime: ""
      });
    }
  }
  deleteRow(type) {
    if (type == "relation") {
      if (this.relation.length <= 2) {
        this.message.info("数据只剩两行，无法继续删除");
      } else {
        this.relation.splice(this.relation.length - 1, 1);
      }
    }
    if (type == "eduResume") {
      console.log(this.otherInfo.eduResume);

      if (this.otherInfo.eduResume.length <= 2) {
        this.message.info("数据只剩两行，无法继续删除");
      } else {
        this.otherInfo.eduResume.splice(this.otherInfo.eduResume.length - 1, 1);
      }
    }
    if (type == "workResume") {
      if (this.otherInfo.workResume.length <= 2) {
        this.message.info("数据只剩两行，无法继续删除");
      } else {
        this.otherInfo.workResume.splice(this.otherInfo.workResume.length - 1, 1);
      }
    }
    if (type == "joinDetail") {
      if (this.joinDetail.length <= 2) {
        this.message.info("数据只剩两行，无法继续删除");
      } else {
        this.joinDetail.splice(this.joinDetail.length - 1, 1);
      }
    }
  }
  // 论文
  paper: any;
  applicationTable: any;
  departmentId: any;
  // commitPaper() {
  //   if (this.paper) {

  //   } else {
  //     this.message.error('请先上传论文')
  //   }

  // }
  filename: any;
  // 论文数据
  paperInfo: any = {
    papername: '',
    filename: "",
    desc: "",
    topic: "",
    document: "",
    content: ""
  };
  pctl: any = true;
  unified: any;// 统考状态
  async getScore() {
    let query = new Parse.Query("SchoolScore")
    query.equalTo("user", this.profileId)
    query.equalTo("major", this.Profile.SchoolMajor.objectId)
    await query.first().then(score => {
      if (score.get('mutilScore') > 60 && score.get('englishScore') > 60) {
        this.unified = true;
      } else {
        this.unified = false;
      }
    })
  }
  // 保存论文数据
  savePaper() {
    this.getScore()
    if (!this.unified) {
      this.message.error("统考未通过");
      return;
    }
    if (this.credits < this.lowesterCredits) {
      this.message.error("学分未修满");
      return
    }
    if (
      this.paper == [] ||
      !this.paper ||
      this.paper == "" ||
      this.paper.trim() == ""
    ) {
      this.message.error("请先上传论文");
      return;
    }
    if (this.paperInfo.filename.trim() == "") {
      this.message.error("请填写论文方向名称");
      return;
    }
    if (this.paperInfo.desc.trim() == "") {
      this.message.error("请填写论文方向描述");
      return;
    }
    if (this.paperInfo.topic.trim() == "") {
      this.message.error("请填写参考论题");
      return;
    }
    if (this.paperInfo.document.trim() == "") {
      this.message.error("请填写参考文献");
      return;
    }
    this.pctl = false;
    let SavePaper = Parse.Object.extend("SchoolPaper");
    let savePaper = new SavePaper();
    savePaper.set("department", {
      __type: "Pointer",
      className: "Department",
      objectId: this.departmentId
    });
    savePaper.set("isCross", false)
    savePaper.set("content", this.paper);
    savePaper.set("filename", this.paperInfo.filename);
    savePaper.set("paper", this.paperInfo.papername);
    savePaper.set("desc", this.paperInfo.desc);
    savePaper.set("topic", this.paperInfo.topic);
    savePaper.set("document", this.paperInfo.document);
    savePaper.set("profile", {
      __type: "Pointer",
      className: "Profile",
      objectId: this.profileId
    });
    savePaper.set("user", {
      __type: "Pointer",
      className: "_User",
      objectId: Parse.User.current().id
    });
    savePaper.set("departments", this.Profile.departments);
    savePaper.save().then(paper => {
      this.message.success("论文提交成功");
      // setTimeout(() => {
      this.getPaper();
      // }, 1000);
      // this.
    });
  }

  upload($event) {
  }
  // 专业申请表
  apply: any;
  // 论文是否已提交过
  paperStatus: any;
  getPaper() {
    let query = new Parse.Query("SchoolPaper");
    query.equalTo("profile", this.profileId);
    query.equalTo("department", this.departmentId);
    query.first().then(res => {
      if (res && res.id) {
        this.paperInfo = res.toJSON();
        this.apply = res.get("apply");
        if (res.get("content")) {
          this.paper = res.get("content");
          this.paperStatus = true;
          this.filename = res.get("filename");
        } else {
          this.paperStatus = false;
        }
      }
    });
  }
  deletePaper() {
    let query = new Parse.Query("SchoolPaper");
    query.equalTo("profile", this.profileId);
    query.equalTo("department", this.departmentId);
    query.first().then(paper => {
      if (paper && paper.id) {
        paper.destroy().then(res => {
          this.message.success("论文删除成功");
          this.paperStatus = false;
          this.paper = null;
          this.cdRef.detectChanges();
        });
      } else {
      }
    });
  }
  // 2、 文件下载
  fileDownload(): void {
    let filename;
    let url;
    url = this.paperInfo.content
    filename = this.paperInfo.filename
    this.fileService.download(url).subscribe(blob => {
      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }


  // 查找课程
  lessons: any


  academic: any;// 学术成果
  acadeStatus: boolean;// 学术成果是否提交
  getAcademic() {
    let query = new Parse.Query("InfoCollection");
    query.equalTo("user", this.userInfo.objectId);
    query.equalTo("company", this.company);
    query.first().then(info => {
      this.acadeStatus = false;
      if (info && info.id) {
        if (!info.get('otherInfo')) {
          this.acadeStatus = false;
        } else {
          info.get('otherInfo')['learning'] ? this.acadeStatus = true : this.acadeStatus = false;
        }
      }
    });
  }
  commitAcademic() {
    let query = new Parse.Query("InfoCollection");
    query.equalTo("user", this.userInfo.objectId);
    query.equalTo("company", this.company);
    query.first().then(info => {
      this.acadeStatus = false;
      if (info && info.id) {
        if (!info.get('otherInfo')) {
          this.acadeStatus = false;
        } else {
          info.get('otherInfo')['learning'] ? this.acadeStatus = true : this.acadeStatus = false;
        }
      }
    });

  }
}

