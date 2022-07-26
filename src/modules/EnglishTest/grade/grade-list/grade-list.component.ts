import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NzMessageService } from "ng-zorro-antd/message";
import { ActivatedRoute, Router } from "@angular/router";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DatePipe } from "@angular/common";
import { promise } from "protractor";
@Component({
  selector: "app-grade-list",
  templateUrl: "./grade-list.component.html",
  styleUrls: ["./grade-list.component.scss"],
  providers: [DatePipe],
})
export class GradeListComponent implements OnInit {
  department: string; // 院校
  company: any;
  pCompany: any;
  cateId: string;
  examId: string;
  surveyId: string;
  surveys: any;
  survey: any;
  rule: any; //合格规则
  cate: any;
  cates: any;
  end: boolean = false; //结束操作
  underway: boolean = false; // 操作进行中
  gradePassArr: any[] = [];// 成绩合格的答卷id数组
  gradePassSql: string = '';// 成绩合格的答卷查询sql
  printLoading: boolean = false;// 成绩合格数据加载状态
  qualifiedLoading = false;
  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private dateFmt: DatePipe
  ) { }
  showExport: boolean = false;

  // 筛选
  inputValue: string;
  searchType: any = {};
  // 表格
  displayedColumns: Array<any> = [];
  listOfColumn = [
    {
      title: "考点",
      value: "cateName",
      type: "Array",
      compare: null,
      schemaAlia: "pro",
    },
    {
      title: "考生姓名",
      value: "name",
      type: "String",
      compare: null,
      schemaAlia: "pro",
    },
    {
      title: "身份证号",
      value: "idcard",
      type: "String",
      compare: null,
      schemaAlia: "pro",
    },
    {
      title: "准考证号",
      value: "examId",
      type: "String",
      compare: null,
      schemaAlia: "slog",
    },
    {
      title: "所属考试",
      value: "title",
      type: "String",
      compare: null,
      schemaAlia: "exam",
    },
    {
      title: "客观题得分",
      value: "objectiveScore",
      type: "Number",
      compare: null,
      schemaAlia: "slog",
    },
    {
      title: "主观题得分",
      value: "subjectiveScore",
      type: "Number",
      compare: null,
      schemaAlia: "slog",
    },
    {
      title: "考试总分",
      value: "grade",
      type: "Number",
      compare: null,
      schemaAlia: "slog",
    },
    {
      title: "学习形式",
      value: "studentType",
      type: "String",
      compare: null,
      schemaAlia: "pro",
    },
    {
      title: "合格编号",
      value: "certnum",
      type: "String",
      compare: null,
      schemaAlia: "slog",
    },
    {
      title: "操作",
      value: "",
      type: "",
      compare: null,
      priority: false,
    },
  ];
  listOfData: any = [];
  filterData: any = [];
  filterType: string;
  filterLen: number;
  isLoading: boolean = false;
  count: number;
  pageIndex: number = 1;
  pageSize: number = 20;

  // edit
  isVisibleEditModal: boolean = false;
  className: "Profile";
  proField: any;
  object: any;
  route: any; // devroute
  keys: any;
  editFields: any;
  operatModal = false;
  editData;
  operatStatus;
  // 导出
  require: any = [];
  fileds: any;
  exportLoading: boolean = false;
  exportCount: number = 0;
  exportSql: string;
  gridApi;
  gridColumnApi;
  exportList: any = [];
  groupHeaderHeight = 40;
  headerHeight = 40;
  floatingFiltersHeight = 40;
  pivotGroupHeaderHeight = 50;
  pivotHeaderHeight = 100;

  qualifiedList = [];

  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.department = localStorage.getItem("department");
      this.company = localStorage.getItem("company");
      this.examId = params.get("PobjectId");

      if (this.department && this.company) {
        let Company = new Parse.Query("Company");
        let company = await Company.get(this.company);
        this.pCompany = company.get("company").id;
      } else if (!this.department) {
        let Exam = new Parse.Query("Exam");
        let exam = await Exam.get(this.examId);
        this.department = exam.get("department").id;
      }
      this.searchType = this.listOfColumn[1];
      this.getSurveys();
      this.getCates();
      // this.getKnows()
      this.getData();
      this.getDevRoute();
      this.exportInit();
    });
  }
  async getSurveys() {
    let queryExam = new Parse.Query("Exam");
    queryExam.include("survey");
    let exam = await queryExam.get(this.examId);
    if (exam && exam.id) {
      this.surveys = exam.get("survey");
    }
  }
  knowMap: any = {};
  async getKnows() {
    let queryK = new Parse.Query("Knowledge");
    queryK.equalTo("department", this.department)
    queryK.select("type")
    let knows = await queryK.find();
    if (knows && knows.length) {
      knows.forEach(know => {
        this.knowMap[know.id] = know.get("type")
      })
    }
  }
  async getData() {

    // ruleId不存在未设置合格规则   存在   havePass判断
    this.isLoading = true;
    let company = this.pCompany || this.company;
    let selectSql = `SELECT  DISTINCT on ("slogId") "pro"."name","pro"."objectId" as "proId","slog"."examId","pro"."idcard","exam"."title","slog"."department",
    "slog"."objectId" as "slogId","slog"."singleScore","slog"."textScore","slog"."certnum","slog"."subjectiveScore","slog"."objectiveScore",
    "slog"."createdAt","slog"."shortAnswer","slog"."grade","slog"."status","pro"."cates","pro"."mobile","slog"."invalid", "pro"."studentType"  `;
    let fromSql = ` FROM  "SurveyLog" as "slog"
    left join (select * from "Exam" where "objectId" = '${this.examId}') as "exam" on "exam"."objectId" = "slog"."exam"
    inner join (select * from "Profile" where "isDeleted" is not true) as "pro" on "slog"."profile"="pro"."objectId" `;
    let whereSql = ` WHERE "slog"."objectId" is not null and "exam"."objectId" is not null `;
    let searchSql = "";
    let orderSql = ' ORDER BY "slogId" DESC ';
    let limitSql = `limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize
      })`;
    console.log(this.searchType, this.inputValue, this.cateId);
    if (this.cateId) {
      searchSql += ` and "pro"."cates" @> '[{ "objectId": "${this.cateId}"}]'`;
    }
    if (this.surveyId) {
      searchSql += ` and "slog"."survey" = '${this.surveyId}'  `;
      if (this.rule) {
        selectSql += `,"rule"."textScore" as "ruleTextScore","rule"."totalScore" as "ruletotalScore","rule"."objectId" as "ruleId"`;
        // ,case when "slog"."grade"> "rule"."totalScore"  then true else false end as havePass
        fromSql += ` left join "ExamPassRule" as "rule" on "rule"."exam"="exam"."objectId"`;
        searchSql += ` and "rule"."objectId" = '${this.rule.id}'  `;
      }
    }
    if (this.inputValue && this.inputValue.trim() != "") {
      switch (this.searchType.type) {
        // case 'Array':
        //   let cateId = await this.getCateIdByName(this.inputValue)
        //   searchSql += ` and "${this.searchType.schemaAlia}"."${this.searchType.value}" @> '[{ "objectId": "${cateId}"}]'`
        //   break;
        case "Number":
          searchSql += ` and "${this.searchType.schemaAlia}"."${this.searchType.value}"::text like '%${this.inputValue}%'`;
          break;
        default:
          searchSql += ` and "${this.searchType.schemaAlia}"."${this.searchType.value}" like '%${this.inputValue}%'`;
          break;
      }
    }
    // if (this.department) {
    selectSql += `,"depart"."objectId" as "departId"`;
    fromSql += ` LEFT JOIN "Department" as "depart" ON "slog"."department" = "depart"."objectId" `;
    whereSql += ` and "slog"."department"='${this.department}' `;
    // }
    let completSql = selectSql + fromSql + whereSql + searchSql + limitSql;
    let countSql = `select count(*) ` + fromSql + whereSql + searchSql;
    this.exportSql = selectSql + fromSql + whereSql + searchSql;
    let passbeginSql = `select * from (SELECT  DISTINCT on ("slogId") (case when ("slog"."grade">="rule"."totalScore" ) then (case when (
    ("rule"."textScore" >0 and "slog"."textScore" >="rule"."textScore") or ("rule"."textScore" is null or "rule"."textScore" =0)
    )then true else false end ) else false end) as "havePass","slog"."objectId" as "slogId", "pro"."objectId" as "proId" `;
    let passendSql = `)data where data."havePass" is true`;
    this.gradePassSql = passbeginSql + fromSql + whereSql + searchSql + passendSql;
    let data = await this.novaSql(completSql);
    this.filterLen = await this.getCount(countSql);
    if (data && data.length) {
      let dataLen = data.length;
      for (let index = 0; index < dataLen; index++) {
        let item = data[index];
        // 站点信息
        if (item.cates && item.cates != []) {
          let cate = await this.getCate(item.cates);
          item.cateId = cate && cate.id;
          item.cateName = cate && cate.get("name");
        }

        switch (item.studentType) {
          case "curresTest":
            item.studentType = "函授";
            break;
          case "selfTest":
            item.studentType = "自考";
            break;
          case "adultTest":
            item.studentType = "成考";
            break;
          default: ;
        }

        item.createdAt = this.dateFmt.transform(
          item.createdAt,
          "yyyy/MM/dd HH:mm:ss"
        );

        /* 客观/主观分数按题型类型区分 弃用   答卷批阅时自动计算*/
        /* item.answerMap['klist'].forEach(k => {
          if (this.knowMap[k.kid]) {
            if (!item[this.knowMap[k.kid]]) item[this.knowMap[k.kid]] = 0
            item[this.knowMap[k.kid]] += k.grade;
          }
        }) */

        if (this.rule) {
          await this.checkPass(item);
        }
        if (index + 1 == dataLen) {
          this.filterData = data;
          this.cdRef.detectChanges();
          this.isLoading = false;
        }
      }
    } else {
      this.filterData = [];
      this.cdRef.detectChanges();
      this.isLoading = false;
    }
    if (this.rule) {
      await this.initGradePassData()
    }
  }
  async initGradePassData() {
    this.gradePassArr = []
    this.printLoading = true;
    let list = [];
    list = await this.novaSql(this.gradePassSql);
    let listLen = list.length;
    for (let index = 0; index < listLen; index++) {
      this.gradePassArr.push(list[index].slogId);
      this.qualifiedList.push(list[index].proId)
      if (index + 1 == listLen) {
        this.printLoading = false;
      }
    }
  }
  async initExportData() {
    this.underway = true;
    let list = [];
    this.exportLoading = true;
    list = await this.novaSql(this.exportSql);
    let listLen = list.length;
    for (let index = 0; index < listLen; index++) {
      if (this.end) {
        this.end = false;
        this.exportLoading = false;
        return;
      }
      if (list[index].cates && list[index].cates != []) {
        let cate = await this.getCate(list[index].cates);
        list[index].cateId = cate && cate.id;
        list[index].cateName = cate && cate.get("name");
      }
      list[index].idcard = "`" + list[index].idcard;
      list[index].examId = "`" + list[index].examId;
      list[index].certnum = "`" + list[index].certnum;
      this.exportCount = index + 1;
      if (this.rule) {
        list[index].havePass = await this.checkPass(list[index]);
      }
      if (index + 1 == listLen) {
        this.exportList = list;
        this.exportLoading = false;
        this.showExport = true;
        this.underway = false;
      }
    }
  }
  checkPass(item) {
    if (item.invalid) {
      item.havePass = "成绩无效";
      return "成绩无效";
    }
    if (item.shortAnswer && item.shortAnswer != {} && !item.status) {
      // 有简答题 并且没有批改
      item.havePass = "待批阅";
      console.log("ddfffff");
      return "待批阅";
    }
    console.log(item)
    if (item.ruletotalScore) {
      if (item.grade >= item.ruletotalScore) {
        if (item.ruleTextScore) {
          if (item.subjectiveScore >= item.ruleTextScore) {
            item.havePass = "合格";
            return "合格";
          } else {
            item.havePass = "不合格";
            return "不合格";
          }
        }
        item.havePass = "合格";
        return "合格";
      } else {
        item.havePass = "不合格";
        return "不合格";
      }
    } else {
      item.havePass = "未设置合格规则";
      return "未设置合格规则";
    }
  }
  async toPage(type, data?) {
    switch (type) {
      case "analy":
        this.router.navigate([
          "english/grade-analy",
          { PclassName: "Exam", PobjectId: this.examId },
        ]);
        break;
      case "detail":
        // this.router.navigate(["english/surveylog-detail", { id: data.slogId }]);
        this.router.navigate(["english/print-surveylog", { id: data.slogId }]);
        break;
      case "passCert":
        let com: any = await this.getConfig()
        if (com.get("config") && com.get("config").gradePassCert) {
          this.router.navigate(["english/grade-passcert", { id: data.slogId }]);
        } else {
          this.message.info("未配置合格证参数")
        }
        break;
      case "passCerts":
        let com2: any = await this.getConfig()
        if (com2.get("config") && com2.get("config").gradePassCert) {
          this.router.navigate(["english/grade-passcert", { idArr: this.gradePassArr }]);
        } else {
          this.message.info("未配置合格证参数")
        }
        break;
      case "qualifiedNumber":
        this.qualifiedLoading = true
        let res = await this.getQualifiedNumber()
        console.log(res)
        if (res) {
          this.qualifiedLoading = false
          // 刷新页面
          await this.getData();
          this.message.info("生成完毕!")
        } else {
          this.qualifiedLoading = false
        }

        break;
      default:
        break;
    }
  }

  getQualifiedNumber() {
    return new Promise(async (resolve, reject) => {
      // 自然编号 取profile degreeNumber字段截取后4位
      if (!this.gradePassArr && !this.gradePassArr.length) {
        this.message.error("没有合格学生需要生成合格编号!")
        resolve(false)
        return
      }

      let surveyLog = new Parse.Query("SurveyLog");
      // surveyLog.select("objectId", "certnum");
      surveyLog.containedIn("objectId", this.gradePassArr)
      surveyLog.equalTo("certnum", null);
      let count = await surveyLog.count()
      console.log(count)
      if (!count || count == 0) {
        this.message.error("合格编号已生成, 请勿重复操作!")
        resolve(false)
        return
      } else {
        surveyLog.limit(count);
        let surveyLogInfo = await surveyLog.find()
        if (surveyLogInfo && surveyLogInfo.length) {
          this.gradePassArr = []
          for (let i = 0; i < surveyLogInfo.length; i++) {
            this.gradePassArr.push(surveyLogInfo[i].id)
          }
        }

        console.log(this.gradePassArr)
      }

      // 年份
      let now = new Date()
      let year = String(now.getFullYear())
      // department num字段
      let department = new Parse.Query("Department");
      department.select("objectId", "num");
      department.equalTo("objectId", this.department)
      let departmentInfo = await department.first();
      if (!departmentInfo || !departmentInfo.id) {
        this.message.error("生成失败!")
        resolve(false)
        return
      }
      let num = departmentInfo.get('num');
      // 3. 批次 exam batch字段
      let recruitStudent = new Parse.Query("RecruitStudent");
      recruitStudent.equalTo("isOpen", true);
      recruitStudent.equalTo("department", this.department);
      recruitStudent.select("objectId", "batch")
      let recruitStudentInfo = await recruitStudent.first()
      if (!recruitStudentInfo || !recruitStudentInfo.id) {
        this.message.error("暂没有开启的招生计划!")
        resolve(false)
        return
      }
      let batch = recruitStudentInfo.get('batch');
      for (let i = 0; i < this.gradePassArr.length; i++) {
        // for (let i = 0; i < 20; i++) {
        // 保存到 ServeyLog 表
        let surveyLog = new Parse.Query("SurveyLog")
        surveyLog.equalTo("objectId", this.gradePassArr[i])
        surveyLog.include("profile")
        let surveyLogInfo = await surveyLog.first()
        if (surveyLogInfo && surveyLogInfo.id) {
          // 修改前的数据
          console.log(surveyLogInfo.toJSON());

          let profileInfo = surveyLogInfo.get("profile");
          // 生成合格编号
          let qualifiedNumber = num + year + batch + profileInfo.get("workid").substring(profileInfo.get("workid").length - 4)
          console.log(qualifiedNumber)

          surveyLogInfo.set("certnum", qualifiedNumber)
          await surveyLogInfo.save()
        }
      }

      resolve('success')
      return

    });
  }



  async getConfig() {
    let queryCom = new Parse.Query("Company");
    let com = await queryCom.get(this.company);
    if (com && com.id) {
      return com;
    }
  }
  async changeGrade(data, type) {
    let log = await this.getSlog(data.slogId);
    switch (type) {
      // 成绩判定无效
      case "invalid":
        console.log(555);
        log.set("invalid", true);
        log.set("grade", 0);
        let saveLog = await log.save();
        if (saveLog && saveLog.id) {
          this.message.success("操作成功");
          this.cdRef.detectChanges();
          this.getData();
        } else {
          this.message.error("网络繁忙，请稍后重试");
        }
        break;
      // 撤销成绩判定无效
      case "backout":
        console.log(555);
        log.set("invalid", false);
        let grade = (log.get("singleScore") || 0) + (log.get("textScore") || 0)
        log.set("grade", grade);
        let saveLog2 = await log.save();
        if (saveLog2 && saveLog2.id) {
          this.message.success("操作成功");
          this.cdRef.detectChanges();
          this.getData();
        } else {
          this.message.error("网络繁忙，请稍后重试");
        }
        break;
      default:
        break;
    }
  }
  async getSlog(id) {
    let queryLog = new Parse.Query("SurveyLog");
    let log = await queryLog.get(id);
    if (log && log.id) {
      return log;
    }
  }
  edit(data) {
    this.editData = data;
    console.log(this.editFields);
    this.operatModal = true;
    console.log(this.editData);
  }
  departChange(e) {
    this.department = e;
    this.pageIndex = 1;
    this.getData();
  }
  pageChange(e) {
    this.getData();
  }
  // ag-grid 生命周期
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  async switchExport() {
    this.initExportData();
    // let list = this.exportList;
    // for (let index = 0; index < list.length; index++) {
    //   list[index].idcard = '`' + list[index].idcard;
    // }
  }

  /* -------- 弹窗 begin -------- */

  handleCancel() {
    this.operatModal = false;
  }
  async checked() {
    let editData = this.editData;
    let save;
    console.log(this.editData);
    let queryLog = new Parse.Query("SurveyLog");
    let log = await queryLog.get(editData.slogId);
    if (log && log.id) {
      log.set("objectiveScore", +editData.objectiveScore);
      log.set("subjectiveScore", +editData.subjectiveScore);
      log.set("grade", +editData.grade);
      save = await log.save().catch((err) => console.log(err));
      if (save && save.id) {
        console.log(save);
        this.message.success("保存成功");
        this.operatModal = false;
        this.getData();
      } else {
        this.message.success("保存失败");
      }
    }
  }

  /* -------- 弹窗 end -------- */

  export() {
    this.gridApi.exportDataAsExcel();
  }
  getExportData() { }
  searchTypeChange(e) {
    console.log(e);
    let index = this.listOfColumn.findIndex((item) => item.value == e);
    console.log(e);
    if (index != -1) {
      this.searchType = this.listOfColumn[index];
    }
  }
  cateChange(e) {
    console.log(e);
    this.cateId = e;
    this.pageIndex = 1;
    console.log(this.underway);
    if (this.underway) {
      this.end = true;
    }
    this.getData();
  }
  async surveyChange(e) {
    console.log(e);
    this.rule = null;
    this.survey = null;
    this.surveyId = e;
    if (this.underway) {
      this.end = true;
    }
    this.survey = this.surveys[this.surveys.findIndex((item) => item.id == e)];
    console.log(this.surveys, this.survey);
    if (this.survey) {
      this.rule = await this.getExamPassRule();
    }
    this.pageIndex = 1;
    this.getData();
  }
  async getExamPassRule() {
    let queryRule = new Parse.Query("ExamPassRule");
    console.log(this.examId);
    queryRule.equalTo("exam", this.examId);
    queryRule.equalTo("langCode", this.survey.get("scate"));
    let rule = await queryRule.first();
    console.log(rule);
    if (rule && rule.id) {
      return rule;
    }
  }
  async getCateIdByName(name) {
    let queryCate = new Parse.Query("Category");
    queryCate.fullText("name", name);
    queryCate.equalTo("department", this.department);
    queryCate.equalTo("type", "test");
    let cate = await queryCate.first();
    if (cate && cate.id) {
      return cate.id;
    }
  }
  exportInit() {
    // 最后一栏操作修改为成绩状态
    this.require = [];
    this.listOfColumn.forEach((col, index) => {
      let headerName = col["title"];
      let field = col["value"];
      if (index + 1 == this.listOfColumn.length) {
        headerName = "状态";
        field = "havePass";
      }
      this.require.push({
        headerName,
        field,
      });
    });
    console.log(this.require);
  }
  novaSql(sql): Promise<any> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL")
        ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select"
        : "https://server.fmode.cn/api/novaql/select";
      this.http.post(baseurl, { sql: sql }).subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          resolve(res.data);
        } else {
          this.message.info("网络繁忙，数据获取失败");
          reject(res);
        }
      });
    });
  }
  async getCates() {
    let queryCate = new Parse.Query("Category");
    queryCate.equalTo("showType", "school_area");
    queryCate.equalTo("type", "test");
    queryCate.equalTo("department", this.department);
    this.cates = await queryCate.find();
    console.log(this.cates);
  }
  async getDevRoute() {
    let Route = new Parse.Query("DevRoute");
    let route = await Route.get("BQsATBqIrE");
    this.route = route;
    let displayedColumns = route.get("displayedColumns");
    displayedColumns = displayedColumns.filter((item) => item != "cates");
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
  async getCount(sql): Promise<number> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL")
        ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select"
        : "https://server.fmode.cn/api/novaql/select";
      this.http.post(baseurl, { sql: sql }).subscribe(async (res: any) => {
        console.log(res);
        let count: number = 0;
        if (res.code == 200) {
          count = +res.data[0].count;
          resolve(count);
        } else {
          this.message.info("网络繁忙，数据获取失败");
          resolve(count);
        }
      });
    });
  }
  // 考生校区 array   考生考点
  // input  cates  pointerArray    output cate  object
  async getCate(cates) {
    for (let index = 0; index < cates.length; index++) {
      const item = cates[index];
      let queryCate = new Parse.Query("Category");
      let cate = await queryCate.get(item.objectId);
      if (cate && cate.id && cate.get("type") == "test") {
        return cate;
      }
    }
  }
  dateFormat(time) {
    time = new Date(time);
    let Year = time.getFullYear();
    let Month = time.getMonth() + 1;
    let Day = time.getDate();
    let Hours = time.getHours();
    let Minutes = time.getMinutes();
    Hours = Hours == 0 ? "00" : Hours < 10 ? "0" + Hours : Hours;
    Minutes = Minutes == 0 ? "00" : Minutes < 10 ? "0" + Minutes : Minutes;
    time = Year + "/" + Month + "/" + Day + "  " + Hours + ":" + Minutes;
    return time;
  }
}
