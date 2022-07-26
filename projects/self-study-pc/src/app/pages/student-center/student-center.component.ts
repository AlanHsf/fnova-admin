import { Component, OnInit, Query, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";
import { HttpClient } from "@angular/common/http"; //引入http服务
import { DomSanitizer } from "@angular/platform-browser";
// import { DocumentService } from "../edit-document/document.service";
import { AuthService } from "../../services/auth.service";
import JSZip from "jszip";
import * as FileSaver from "file-saver";

@Component({
  selector: "app-student-center",
  templateUrl: "./student-center.component.html",
  styleUrls: ["./student-center.component.scss"]
})
export class StudentCenterComponent implements OnInit {
  ngAfterContentInit(): void {
    let table = document.querySelectorAll(".table table");
    let thead = document.querySelectorAll(".table table thead");
    let tr = document.querySelectorAll(".table table thead tr");
    let td = document.querySelectorAll(".table table thead tr td");
  }

  tabs = [
    {
      name: "我的学习",
      icon: "../../../assets/img/masterol/img/study.png"
    },
    {
      name: "专业计划",
      icon: "../../../assets/img/masterol/img/pyfa.png"
    },
    {
      name: "我的课表",
      icon: "../../../assets/img/masterol/img/kb.png"
    },
    {
      name: "我的成绩",
      icon: "../../../assets/img/masterol/img/cj.png"
    },
    {
      name: "我的论文",
      icon: "../../../assets/img/masterol/img/lw.png"
    },
    {
      name: "毕业档案",
      icon: "../../../assets/img/masterol/img/by.png"
    }
  ];

  // 已获学分
  score: number = 0;
  NewLessonRecordLog: any;
  LessonRecordLogs: any;
  LessonStatus: any;
  appcredit: any = 0;
  articles: any = [];
  articles2: any = [];
  Profile: any = [];
  // SchoolPlan: any = [];
  SchoolClass: any = [];
  SchoolTestlog: any = [];
  // 最新学分课堂
  Lesson: any = [];
  // 学分课堂课程回放
  oldLesson: any = [];
  logo: any;
  // 统考课堂最新课程
  examLesson: any = []
  // 统考课堂课程回放
  oldexamLesson: any = []
  // 学分课成绩
  resultLesson: any = []
  // 是否满足毕业条件
  graduation: boolean = false;
  Schoollesson: any = [];
  gradeIndex: number = 0;
  Department: any = [];
  schoolname: any;
  activeIndex: any = 0;
  // company
  companyID: any;
  // 免考申请列表
  exemptionList: any;
  // 免考详情
  exemptionOnly: any;
  // 显示添加免考
  viewExemptionWrap: boolean = false;
  viewExemptiondetailsWrap: boolean = false;
  // 按钮载入状态
  isLoadingOne = false;
  isLoadingTwo = false;
  isLoadingThree = false;
  indexChange(index) {
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
  // 开课结束时间
  lessonEndTime: any = "new";
  // 个人档案
  // 加入党派
  lessonType: any = "score"
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
  eduResume: any = [
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
  ];

  workResume: any = [
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
  ];

  selfIntroduction: "";
  listOfData = [];

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
    private sanitizer: DomSanitizer,
    // private fileService: DocumentService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) { }

  // 获取课程信息

  SchoolSingleScore: any = [];
  print: any = false;
  async submitInfo() {
    // this.print = true;
    let joinDetail = this.joinDetail;
    // let queryEdu = new Parse.Query("SchoolEduFile")
    let relation = this.relation;
    let eduResume = this.eduResume;
    let workResume = this.workResume;
    let reward = this.reward;
    let punish = this.punish;
    let selfIntroduction = this.selfIntroduction;
    let query = new Parse.Query("SchoolEduFile");
    let profileId = this.Profile.objectId;

    query.equalTo("profile", profileId);
    let eduFile: any = await query.first();
    if (eduFile && eduFile.id) {
      eduFile.set("joinDetail", joinDetail);
      eduFile.set("relation", relation);
      eduFile.set("eduResume", eduResume);
      eduFile.set("workResume", workResume);
      eduFile.set("reward", reward);
      eduFile.set("punish", punish);
      eduFile.set("selfIntroduction", selfIntroduction);
      eduFile.set("departments", this.Profile.departments);
      eduFile.save().then(res => {
        this.message.success("提交成功");
      });
    } else {
      let SchoolEduFile = Parse.Object.extend("SchoolEduFile");
      let schoolEduFile = new SchoolEduFile();
      schoolEduFile.set("joinDetail", joinDetail);
      schoolEduFile.set("relation", relation);
      schoolEduFile.set("eduResume", eduResume);
      schoolEduFile.set("workResume", workResume);
      schoolEduFile.set("reward", reward);
      schoolEduFile.set("punish", punish);
      schoolEduFile.set("selfIntroduction", selfIntroduction);
      schoolEduFile.set("profile", {
        __type: "Pointer",
        className: "Profile",
        objectId: profileId
      });
      schoolEduFile
        .save()
        .then(res => {
          this.message.success("提交成功");
        })
        .catch(err => {
          if (err.toString().indexOf("209") != -1) {
            this.sessionVisible = true;
            this.parseErr = err;
          }
        });
    }
  }
  changeTag(type) {
    this.lessonType = type
  }
  changeClassTime(type) {
    this.lessonEndTime = type
  }
  toPrint() {
    let bdhtml = window.document.body.innerHTML;
    let jubuData = document.getElementById("applicaForm").innerHTML;
    //把获取的 局部div内容赋给body标签, 相当于重置了 body里的内容
    window.document.body.innerHTML = jubuData;
    window.print();
  }
  async getEduFile() {
    let query = new Parse.Query("SchoolEduFile");
    let profileId = this.Profile.objectId;
    query.equalTo("profile", profileId);
    let eduFile: any = await query.first();
    if (eduFile && eduFile.id) {
      this.joinDetail = eduFile.get("joinDetail") || [];
      this.relation = eduFile.get("relation") || [];
      this.eduResume = eduFile.get("eduResume") || [];
      this.workResume = eduFile.get("workResume") || [];
      this.reward = eduFile.get("reward") || "";
      this.punish = eduFile.get("punish") || "";
      this.selfIntroduction = eduFile.get("selfIntroduction") || "";
    }
  }
  async goArticle(id, type) {
    console.log(id, type);
    this.router.navigate([
      `self-study/article-detail`,
      {
        newsId: id,
        type: type
      }
    ]);
  }

  getProfile() {
    let examLesson = []
    let oldexamLesson = []
    let user = Parse.User.current();
    let profileId = localStorage.getItem('profileId');

    let queryProfile = new Parse.Query("Profile");
    queryProfile.equalTo("user", user.id);
    queryProfile.equalTo("objectId", profileId);
    queryProfile.include("schoolClass");
    queryProfile.include("department");
    queryProfile.include("SchoolMajor");
    queryProfile.include("lessons");
    queryProfile
      .first()
      .then(res => {
        if (res && res.id) {
          if (res.get('lessons') && res.get('lessons').length > 0) {
            res.get('lessons').forEach(lesson => {
              if (lesson.get('status')) {
                if (lesson && lesson.get('endTime')) {
                  examLesson.push(lesson)
                  this.examLesson = examLesson
                } else {
                  oldexamLesson.push(lesson)
                  this.oldexamLesson = oldexamLesson
                }
              }
            });
          }
          this.Profile = res.toJSON();
          console.log(this.Profile);
          this.profileId = res.id;
          this.getMajors();
          this.getExemption();
          this.getGradeInfo();
          this.getDegreeApply();
          this.getArticle()
          let company = res.get("company").id;
          this.companyID = res.get("company").id;
          this.departmentId = res.get("department").id;
          this.departmentCenterId = res.get("center").id;
          this.getPaper();
          localStorage.setItem("company", company);
          localStorage.setItem("subCompany", this.Profile.department.subCompany.objectId);
          let id;
          if (res.get("schoolClass") && res.get("schoolClass").id) {
            id = res.get("schoolClass").id;
            this.getSchoolClass(id);
          }
          let profile: any = res;
          this.lessons = this.Profile.SchoolMajor.plan.lessons;
        }
      })
      .catch(err => {
        if (err.toString().indexOf("209") != -1) {
          this.sessionVisible = true;
          this.parseErr = err;
        }
      });
  }
  async getArticle() {
    let subCompany = localStorage.getItem("subCompany")
    let article = new Parse.Query("Article");
    article.equalTo("type", 'skill');
    article.equalTo("company", subCompany);
    article.equalTo("isEnabled", true);
    let articleList = await article.find()
    this.articles = articleList;


    article.equalTo("type", 'policy');
    let articleList2 = await article.find()
    this.articles2 = articleList2;
  }

  company = localStorage.getItem("company");
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let activeIndex = params.get("activeIndex");

      if (activeIndex) {
        this.activeIndex = activeIndex;
      }
      this.getProfile();
      this.getintext();
    });
  }

  getintext() {
    let tabletd;
    tabletd = document.getElementsByClassName("myPlan");
  }
  credits: any = 0; // 已获学分
  serverURL = "https://server.fmode.cn/api/masterol/";
  videoGrade: any; // 视频成绩
  sqlApi(result) {
    let profileId = this.profileId;
    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
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
      let data = res["data"];
      if (data && data.length == 0) {
        // 没有学习记录
        result.studyStatus = 0; // 待学习
      } else {
        let total;
        let count;
        data.forEach(d => {
          result.studyStatus = 1;
          if (d.isdown == 1) {
            // 在学习，已经学完的小节
            total = d.total;
            count = d.count;
            result.finish = ((d.count / d.total) * 100).toFixed(0);
            if (d.count == d.total) {
              result.studyStatus = 2;
            }
          } else {
            total = d.total;
          }
          if (!result.time) {
            result.time = 0;
          }
          result.time += Number(((d.time ? d.time : 0) / 60).toFixed(0));
        });
        // 学习进度
        result.total = total;
        result.done = count;
        // result.time = (time / 60).toFixed(0);
        if (result.finish == 100) {
          // 一门课程视频全部看完了获得学分
          result.credit = result.get("credit");
          if (!result.credit) {
            result.credit = 0;
          }
          this.credits += result.credit;
          this.score += result.credit;
        }

        if (!total || total == 0 || count == 0) {
          result.videoGrade = 0;
          result.videoGrade2 = 0;
        } else {
          // 视频成绩
          result.videoGrade = ((count / total) * 100).toFixed(0);
          result.videoGrade2 = ((count / total) * 100 * 0.4).toFixed(0);
          if (!result.videoGrade) {
            result.videoGrade2 = 0;
          }
        }
      }
    });
  }
  async getStatus(result) {
    this.score = 0;
    this.sqlApi(result);
    this.http
      .get(
        this.serverURL +
        "lessonSurvey?profileId=" +
        this.profileId +
        "&lessonId=" +
        result.id
      )
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
    // 本地测试
    // if (result.get("lessonTest") && this.profileId) {
    //   let querySurvey = new Parse.Query("SurveyLog");
    //   querySurvey.equalTo("survey", result.get("lessonTest").id);
    //   querySurvey.equalTo("profile", this.profileId);
    //   querySurvey.first().then(res => {
    //     if (res && res.id) {
    //       result.synProgress = res.get("grade");
    //       result.synProgress2 = (result.synProgress * 0.6).toFixed(0);
    //     }
    //   });
    // }
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

  getMajors() {
    if (this.Profile.SchoolMajor) {
      let query = new Parse.Query("SchoolMajor");
      query.equalTo("objectId", this.Profile.SchoolMajor.objectId);
      query.first().then(res => {
        if (res && res.id) {
          this.getLesson(res.id);
          this.Profile.major = res.get("name");
        }
      });
    } else {
      this.loading = false
    }
  }
  lowesterCredits: any; // 最低学分
  totalLesson: any = [];
  showSemester: boolean = false; // 是否显示开课学期
  loading: boolean = true  
  myDate = new Date();
  // 获取学分课堂
  getLesson(lessons) {
    let Lesson = [];
    let oldLesson = []
    if (lessons.length == 0) {
      this.loading = false
    }
    let query_1 = new Parse.Query("Lesson");
    query_1.containedIn('toMajor', [{
      __type: "Pointer",
      className: 'SchoolMajor',
      objectId: lessons
    }])

    // query_1.equalTo("status", true);
    query_1.find().then(async result => {
      if (result) {
        result.forEach(async(res: any) => {
          let count = await this.getLessonRecordLog(res);
          let item = await this.getStatus(res);
          item["times"] = count;
          if (item.get("semester")) {
            this.showSemester = true;
          }
          if(item.get("endTime") && this.myDate<item.get("endTime")){
            Lesson.push(item);
            console.log(item);
          }else{
            oldLesson.push(item);
          }
          let creditGrade = new Parse.Query("CreditGrade");
          creditGrade.equalTo("lesson", res.id);
          creditGrade.equalTo("idcard", this.Profile.idcard);
          creditGrade.find().then(async gredit => {
            if (gredit[0]) {
              res.grade = gredit[0].get("grade")
              res.type = gredit[0].get("type")
              if (res.grade && res.grade > 60) {
                this.graduation = true
              }
            }
          })
        })
        this.Lesson = result;
        this.oldLesson = oldLesson;
        this.loading = false
        this.resultLesson = result
        console.log(this.resultLesson);
      }
    });
  }

  estimatePass: boolean = true
  async getLessonRecordLog(result) {
    if (this.Profile.objectId) {
      let query2 = new Parse.Query("LessonRecordLog");
      let user = Parse.User.current();
      let userId = user.id;
      query2.equalTo("profile", this.Profile.objectId);
      query2.equalTo("user", userId);
      query2.equalTo("lesson", result.id);
      let log = await query2.first();
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

    if (this.profileId) {
      let query = new Parse.Query("LessonRecordLog");
      query.equalTo("lesson", id);
      query.equalTo("user", userId);
      query.equalTo("profile", this.profileId);
      query
        .first()
        .then(res => {
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
            saveLog.save();
          }
          this.router.navigate([
            `self-study/student-study/detail/`,
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
      this.eduResume.push({
        Period: "",
        schoolname: "",
        witness: ""
      });
    }

    if (type == "workResume") {
      this.workResume.push({
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
      if (this.eduResume.length <= 2) {
        this.message.info("数据只剩两行，无法继续删除");
      } else {
        this.eduResume.splice(this.eduResume.length - 1, 1);
      }
    }
    if (type == "workResume") {
      if (this.workResume.length <= 2) {
        this.message.info("数据只剩两行，无法继续删除");
      } else {
        this.workResume.splice(this.workResume.length - 1, 1);
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
  applicationTable: any;
  departmentId: any;
  departmentCenterId: any;
  // 论文数据
  paperInfo: any = {
    // 论文标题
    title: "",
    // 论文方向名称
    filename: "",
    // 论文方向描述
    desc: "",
    // 参考论题
    topic: "",
    // 论文word
    document: "",
    // content: "",
    // 论文pdf
    paper: "",
    // 上传论文重复比检测报告
    checkReport: "",
  };
  pctl: any = true;
  unified: any; // 统考状态
  async getScore() {
    this.resultLesson.forEach(lesson => {
      if (lesson.grade < 60 || !lesson.grade) {
        this.estimatePass = false
      }
    })
  }
  // 保存论文数据
  savePaper() {
    console.log(this.paperInfo);
    this.getScore();

    if (!this.estimatePass) {
      this.message.error("你有课程未通过");
      return;
    }
    if (this.paperInfo.title.trim() == "") {
      this.message.error("请填写论文名称");
      return;
    }
    if (this.paperInfo.document == [] ||
      !this.paperInfo.document ||
      this.paperInfo.document == "" ||
      this.paperInfo.document.trim() == ""
    ) {
      this.message.error("请上传论文word版本");
      return;
    }
    if (this.paperInfo.paper == [] ||
      !this.paperInfo.paper ||
      this.paperInfo.paper == "" ||
      this.paperInfo.paper.trim() == ""
    ) {
      this.message.error("请先上传论文Pdf版本");
      return;
    }
    if (this.paperInfo.checkReport == [] ||
      !this.paperInfo.checkReport ||
      this.paperInfo.checkReport == "" ||
      this.paperInfo.checkReport.trim() == ""
    ) {
      this.message.error("请先上传论文重复比检测报告");
      return;
    }
    this.pctl = false;
    this.isLoadingThree = true;
    let SavePaper = Parse.Object.extend("SchoolPaper");
    let savePaper = new SavePaper();
    savePaper.set("department", {
      __type: "Pointer",
      className: "Department",
      objectId: this.departmentId
    });
    savePaper.set("isCross", false);
    savePaper.set("title", this.paperInfo.title);
    savePaper.set("paper", this.paperInfo.paper);
    savePaper.set("document", this.paperInfo.document);
    savePaper.set("checkReport", this.paperInfo.checkReport);
    savePaper.set("major", {
      __type: "Pointer",
      className: "SchoolMajor",
      objectId: this.Profile.SchoolMajor.objectId
    });
    savePaper.set("center", {
      __type: "Pointer",
      className: "Department",
      objectId: this.departmentCenterId,
    });
    console.log(this.departmentCenterId);

    savePaper.set("company", {
      __type: "Pointer",
      className: "Company",
      objectId: this.Profile.company.objectId,
    });
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
      this.getPaper();
      this.isLoadingThree = false;      
    });
  }

  upload($event) { }
  // 专业申请表
  apply: any;
  // 论文是否已提交过
  paperStatus: any;
  documentType: any;
  checkReportType: any;
  paperType: any;
  getPaper() {
    let query = new Parse.Query("SchoolPaper");
    query.equalTo("profile", this.profileId);
    query.equalTo("department", this.departmentId);
    query.first().then(res => {
      if (res && res.id) {
        this.paperInfo = res.toJSON();
        if (this.paperInfo.document) {
          this.documentType =
            this.paperInfo.document.substring(this.paperInfo.document.lastIndexOf("."))
        }
        if (this.paperInfo.checkReport) {
          this.checkReportType =
            this.paperInfo.checkReport.substring(this.paperInfo.checkReport.lastIndexOf("."))
        }
        if (this.paperInfo.paper) {
          this.paperType =
            this.paperInfo.paper.substring(this.paperInfo.paper.lastIndexOf("."))
        }
        this.apply = res.get("apply");
        if (res.get("paper")) {
          this.paperStatus = true;
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
          this.paperInfo.document = null;
          this.cdRef.detectChanges();
        });
      } else {
      }
    });
  }

  files: any = []
  async download(value) {
    console.log(value)
    if (!value) {
      this.message.error("申请id不能为空!")
      return
    }
    let query = new Parse.Query("ExemptionApply");
    let queryInfo = await query.get(value)
    console.log(queryInfo)
    if (queryInfo && queryInfo.id) {
      let paper = queryInfo.toJSON()
      if (paper.gradImg) {
        let fileInfo: any = {};
        fileInfo.name = paper.name + "毕业证" + paper.gradImg.substring(paper.gradImg.lastIndexOf("."))
        fileInfo.url = paper.gradImg
        this.files.push(fileInfo)
      }
      if (paper.studImg) {
        let fileInfo: any = {};
        fileInfo.name = paper.name + "学籍表" + paper.studImg.substring(paper.studImg.lastIndexOf("."))
        fileInfo.url = paper.studImg
        this.files.push(fileInfo)
      }
      if (paper.certFile) {
        let fileInfo: any = {};
        fileInfo.name = paper.name + "申请表" + paper.certFile.substring(paper.certFile.lastIndexOf("."))
        fileInfo.url = paper.certFile
        this.files.push(fileInfo)
      }
      if (paper.applyFile) {
        let fileInfo: any = {};
        fileInfo.name = paper.name + "证书" + paper.applyFile.substring(paper.applyFile.lastIndexOf("."))
        fileInfo.url = paper.applyFile
        this.files.push(fileInfo)
      }

      if (this.files.length) {
        this.downloadFile(paper.name + "_免考文件");
      } else {
        this.message.error("没有需要下载的文件!")
        return
      }
    } else {
      this.message.error("该论文申请信息不存在!")
      return
    }
  }


  // 打包下载
  downloadFile(filename) {
    console.log(this.files)
    let zip = new JSZip();
    let folder = zip.folder('files');
    Promise.resolve().then(() => {
      return this.files.reduce((accumulator, item) => {
        return accumulator.then(() => fetch(item.url)
          .then(resp => resp.blob())
          .then(blob => folder.file(item.name, blob)))
      }, Promise.resolve())
    }).then(() => {
      folder.generateAsync({ type: "blob", compression: 'DEFLATE', compressionOptions: { level: 9 } }).then(content => FileSaver(content, filename + ".zip"));
    })
  }

  // 查找课程
  lessons: any;

  // 查看免考记录
  async getExemption() {
    let Exemption = new Parse.Query("ExemptionApply");
    Exemption.equalTo("profile", this.Profile.objectId);
    let exemption = await Exemption.find();
    this.exemptionList = exemption
  }

  // 显示添加免考弹窗
  showExemption() {
    this.exemptionApply.name = this.Profile.name
    this.exemptionApply.studentID = this.Profile.studentID
    this.exemptionApply.major = this.Profile.major
    this.viewExemptionWrap = true
  }

  // 隐藏添加免考弹窗
  hideExemption() {
    this.viewExemptionWrap = false
  }

  gradeType: any;
  studType: any;
  certType: any;
  applyType: any;
  exemptionApply: any = {
    name: "",
    studentID: "",
    lesson: "",
    major: "",
    gradImg: "",
    applyFile: "",
    certFile: "",
    studImg: "",
  }
  // 显示免考详情弹窗
  async showExemptiondetails(id) {
    this.viewExemptiondetailsWrap = true
    let Exemption = new Parse.Query("ExemptionApply");
    Exemption.equalTo("objectId", id);
    let exemption = await Exemption.find();
    this.exemptionOnly = exemption;
    let studImg = this.exemptionOnly[0].get('studImg')
    let certFile = this.exemptionOnly[0].get('certFile')
    let applyFile = this.exemptionOnly[0].get('applyFile')
    let gradeFile = this.exemptionOnly[0].get('gradeFile')
    if (gradeFile) {
      this.gradeType = gradeFile.substring(gradeFile.lastIndexOf("."))
    }
    if (studImg) {
      this.studType = studImg.substring(studImg.lastIndexOf("."))
    }
    if (certFile) {
      this.certType = certFile.substring(certFile.lastIndexOf("."))
    }
    if (applyFile) {
      this.applyType = applyFile.substring(applyFile.lastIndexOf("."))
    }
  }

  // 隐藏免考详情弹窗
  hideExemptiondetails() {
    this.viewExemptiondetailsWrap = false
  }

  // 新增免考记录
  addExemption() {
    this.exemptionList.forEach(element => {
      if (this.exemptionApply.lesson == element.get('lesson').id) {
        this.message.error("该课程已申请过免考，请勿重复申请！");
        throw new Error("该课程已申请过免考，请勿重复申请！")
      }
    });

    console.log(this.exemptionApply);

    if (this.exemptionApply.gradImg == [] ||
      !this.exemptionApply.gradImg ||
      this.exemptionApply.gradImg == "" ||
      this.exemptionApply.gradImg.trim() == ""
    ) {
      this.message.error("请上传毕业证");
      return;
    }
    if (this.exemptionApply.studImg == [] ||
      !this.exemptionApply.studImg ||
      this.exemptionApply.studImg == "" ||
      this.exemptionApply.studImg.trim() == ""
    ) {
      this.message.error("请上传学籍表文件");
      return;
    }
    if (this.exemptionApply.applyFile == [] ||
      !this.exemptionApply.applyFile ||
      this.exemptionApply.applyFile == "" ||
      this.exemptionApply.applyFile.trim() == ""
    ) {
      this.message.error("请上传申请表");
      return;
    }
    if (this.exemptionApply.certFile == [] ||
      !this.exemptionApply.certFile ||
      this.exemptionApply.certFile == "" ||
      this.exemptionApply.certFile.trim() == ""
    ) {
      this.message.error("请上传证书");
      return;
    }
    if (this.exemptionApply.name.trim() == "") {
      this.message.error("请选择免考课程名称");
      return;
    }
    if (this.exemptionApply.name.trim() == "") {
      this.message.error("请选择免考课程名称");
      return;
    }    
    this.isLoadingOne = true;
    let exemptionApply = Parse.Object.extend("ExemptionApply");
    let saveExemption = new exemptionApply();
    saveExemption.set("departments", [
      {
        __type: "Pointer",
        className: "Department",
        objectId: this.departmentId,
      },
      {
        __type: "Pointer",
        className: "Department",
        objectId: this.departmentCenterId,
      }
    ]);
    saveExemption.set("profile", {
      __type: "Pointer",
      className: "Profile",
      objectId: this.profileId
    });
    saveExemption.set("school", {
      __type: "Pointer",
      className: "Department",
      objectId: this.departmentId,
    });
    saveExemption.set("center", {
      __type: "Pointer",
      className: "Department",
      objectId: this.departmentCenterId,
    });
    saveExemption.set("major", {
      __type: "Pointer",
      className: "SchoolMajor",
      objectId: this.Profile.SchoolMajor.objectId
    });
    saveExemption.set("company", {
      __type: "Pointer",
      className: "Company",
      objectId: this.Profile.company.objectId,
    });
    saveExemption.set("lesson", {
      __type: "Pointer",
      className: "Lesson",
      objectId: this.exemptionApply.lesson,
    });
    saveExemption.set("name", this.exemptionApply.name);
    saveExemption.set("studentId", this.exemptionApply.studentID);
    saveExemption.set("gradImg", this.exemptionApply.gradImg);
    saveExemption.set("applyFile", this.exemptionApply.applyFile);
    saveExemption.set("studImg", this.exemptionApply.studImg);
    saveExemption.set("certFile", this.exemptionApply.certFile);
    saveExemption.set("status", '待审核');
    saveExemption.save().then(paper => {
      this.message.success("免考提交成功");
      this.hideExemptiondetails()
      this.isLoadingOne = false;
    });


  }

  GradeInfo: any = {
    basicsScore: '',
    englishScore: '',
    batch: '',
    gradeNumber: '',
    gradeFile: '',
    image: ''
  }
  isCross: boolean = false;
  isDegreeApply: boolean = false;
  // 查询学位成绩
  async getGradeInfo() {
    let GradeInfo = new Parse.Query("GradeInfo");
    GradeInfo.equalTo("profile", this.Profile.objectId);
    let gradeInfo = await GradeInfo.first();
    if (gradeInfo && gradeInfo.id) {
      this.GradeInfo.basicsScore = gradeInfo.get('basicsScore');
      this.GradeInfo.englishScore = gradeInfo.get('englishScore');
      this.GradeInfo.majorScore = gradeInfo.get('majorScore');
    }

    if (
      this.GradeInfo.basicsScore != undefined &&
      this.GradeInfo.englishScore != undefined &&
      this.GradeInfo.majorScore != undefined &&
      this.GradeInfo.basicsScore >= 60 &&
      this.GradeInfo.englishScore >= 60 &&
      this.GradeInfo.majorScore >= 60) {
      this.isCross = true
    }
  }
  // 查询是否已经提交过成绩
  async getDegreeApply() {
    let degreeApply = new Parse.Query("DegreeApply");
    degreeApply.equalTo("profile", this.Profile.objectId);
    let degreeApplyOnIn = await degreeApply.first();
    if (degreeApplyOnIn && degreeApplyOnIn.id) {
      this.isDegreeApply = true;
    }
  }
  // 学士学位申请
  getExemptionSubmit() {

    if (!this.isCross) {
      this.message.warning('您有学位课程没有通过,暂时不能申请学位')
      return
    }
    if (this.isDegreeApply) {
      this.message.warning('您已经提交过学位申请，请勿重复提交')
      return
    }
    this.GradeInfo.gradeNumber = this.GradeInfo.gradeNumber.trim();
    console.log(this.GradeInfo);
    if (this.GradeInfo.gradeNumber == '') {
      this.message.warning('请输入毕业证编号')
      return
    }
    if (this.GradeInfo.gradeFile == '') {
      this.message.warning('请上传毕业证书')
      return
    }
    if (this.GradeInfo.image == '') {
      this.message.warning('请上传2寸蓝底彩照')
      return
    }
    this.isLoadingTwo = true;
    let degreeApply = Parse.Object.extend("DegreeApply");
    let saveDegreeApply = new degreeApply();
    saveDegreeApply.set("profile", {
      __type: "Pointer",
      className: "Profile",
      objectId: this.profileId
    });
    saveDegreeApply.set("school", {
      __type: "Pointer",
      className: "Department",
      objectId: this.departmentId,
    });
    saveDegreeApply.set("center", {
      __type: "Pointer",
      className: "Department",
      objectId: this.departmentCenterId,
    });
    saveDegreeApply.set("major", {
      __type: "Pointer",
      className: "SchoolMajor",
      objectId: this.Profile.SchoolMajor.objectId
    });
    saveDegreeApply.set("company", {
      __type: "Pointer",
      className: "Company",
      objectId: this.Profile.company.objectId,
    });
    saveDegreeApply.set("idcard", this.Profile.idcard);
    saveDegreeApply.set("gradeFile", this.GradeInfo.gradeFile);
    saveDegreeApply.set("image", this.GradeInfo.image);
    saveDegreeApply.set("isCross", this.isCross);
    saveDegreeApply.set("name", this.Profile.name);
    saveDegreeApply.set("gradeNumber", this.GradeInfo.gradeNumber);
    saveDegreeApply.set("studentId", this.Profile.studentID);

    // return
    saveDegreeApply.save().then(paper => {
      this.message.success("免考提交成功");
      this.hideExemptiondetails()
      this.isLoadingTwo = false;
    });
  }
  getNone() {
    this.message.warning("暂未开通");
  }
}
