import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

@Component({
  selector: 'app-surveyinfo',
  templateUrl: './surveyinfo.component.html',
  styleUrls: ['./surveyinfo.component.scss']
})
export class SurveyinfoComponent implements OnInit {
  constructor(private activRoute: ActivatedRoute, private router: Router, private message: NzMessageService, private cdRef: ChangeDetectorRef, private http: HttpClient) { }
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
      title: '试卷名称',
      value: 'title',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '所属院校',
      value: 'depaName',
      type: 'String',
      compare: null,
      schemaAlia: 'depa'
    },
    {
      title: '所属专业',
      value: 'majorName',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '层次',
      value: 'type',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '所属课程',
      value: 'lessonTitle',
      type: 'String',
      compare: null,
      schemaAlia: 'lesson'
    },
    {
      title: '所属章节',
      value: 'acticleTitle',
      type: 'String',
      compare: null,
      schemaAlia: 'act'
    },
    {
      title: '是否开启',
      value: 'isEnabled',
      type: 'Boolean',
      compare: null,
      schemaAlia: 'act'
    },
    {
      title: '操作',
      value: '',
      type: '',
      compare: null,
      priority: false
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
  center;
  async ngOnInit(): Promise<void> {
    this.department = localStorage.getItem("department");
    this.company = localStorage.getItem("company");

    if (this.department && this.company) {
      let Company = new Parse.Query("Company");
      let company = await Company.get(this.company);
      console.log(company)
      this.pCompany = company.get("company").id;

    }
    this.searchType = this.listOfColumn[0]
    this.getProfiles();



  }

  async getProfileSchema() {
    const mySchema = new Parse.Schema('Profile');
    let proSche: any = await mySchema.get();
    console.log(proSche);
    this.proField = proSche.fields;
  }

  pageIndex: number = 1;
  pageSize: number = 10;
  async getProfiles(skip?, inputVal?, filter?) {
    let company = this.pCompany || this.company;

    console.log(this.pCompany, this.company, this.department)

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let compleSql = '';

    let selectSql = `select 
    "sur"."objectId",
    "title",
    "isEnabled",
    "depaName",
    "majorName",
    "type",
    "lessonTitle",
    "lesson2Title",
    "acticleTitle",
    "majorId","lessonId","actId","lesId" `

    let fromSql = ` from (select "objectId","title","department","schoolMajor","isEnabled","createdAt"
          from "Survey" where "company" = '1ErpDVc1u6' and "department" = '${this.department}' and "isDeleted" is not true) as "sur"
      left join (select "objectId","name" as "depaName" from "Department") as "depa" on "depa"."objectId" = "sur"."department"
      left join (select "objectId" as "majorId","name" as "majorName","type" from "SchoolMajor") as "major" on "major"."majorId" = "sur"."schoolMajor"
      left join (select "objectId" as "lessonId","lessonTest","title" as "lessonTitle" from "Lesson") as "lesson" on "lesson"."lessonTest" = "sur"."objectId"
      left join (select "objectId" as "actId","test","lesson","title" as "acticleTitle" from "LessonArticle") as "act" on "act"."test" = "sur"."objectId"
      left join (select "objectId" as "lesId","title" as "lesson2Title" from "Lesson") as "lesson2" on "lesson2"."lesId" = "act"."lesson"
    `
    let whereSql = ` where 1 = 1 `
    if (this.searchType.type == 'Boolean') {
      if (this.inputValue == "开启") {
        whereSql += ` and "sur"."${this.searchType.value}" is true `
      } else if (this.inputValue == "关闭") {
        whereSql += ` and "sur"."${this.searchType.value}" is false `
      }
    } else if (this.inputValue && this.inputValue.trim() != '') {
      if (this.searchType.value == "lessonTitle") {
        whereSql += ` and "${this.searchType.value}" like '%${this.inputValue}%' or "lesson2Title" like '%${this.inputValue}%'`
      } else {
        whereSql += ` and "${this.searchType.value}" like '%${this.inputValue}%' `
      }

    }

    console.log(whereSql)

    let orderSql = ` order by "sur"."createdAt" desc `
    let breakSql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`

    compleSql = selectSql + fromSql + whereSql + orderSql + breakSql
    console.log(compleSql);
    this.http
      .post(baseurl, { sql: compleSql })
      .subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          if (res.data && res.data.length) {
            this.listOfData = res.data;
            let countSql = `select count(*) ${fromSql} ${whereSql}`
            console.log(countSql)
            this.filterLen = await this.getCount(countSql);
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

  // 获取专业
  majorList = [];
  async getSchoolMajor(e?) {
    console.log(e)
    this.majorList = []
    let major = new Parse.Query("SchoolMajor");
    major.equalTo("company", "1ErpDVc1u6");
    major.equalTo("school", this.department);
    if (e) {
      major.contains("name", e);
    }
    let majorInfo = await major.find();
    console.log(majorInfo)
    if (majorInfo && majorInfo.length) {
      for (let i = 0; i < majorInfo.length; i++) {
        this.majorList.push({
          objectId: majorInfo[i].id,
          name: majorInfo[i].get("name")
        })
      }
    }
  }
  changeMajors(e) {
    if (!e) {
      this.majorList = [];
      this.lessonList = [];
      this.chapterList = [];
      this.chapterId = null;
      this.object.majorId = null;
      this.object.lessonId = null;
      this.object.lesId = null;
    } else {
      this.getSchoolMajor()
    }
  }

  lessonList = [];
  async getLesson(value?) {
    console.log(value,this.object.majorId)
    if (!this.object.majorId) {
      this.message.error("请先选择专业信息! ")
      return
    }
    this.lessonList = []
    let lesson = new Parse.Query("Lesson");
    lesson.equalTo("company", "1ErpDVc1u6");
    lesson.equalTo("school", this.department);
    lesson.containedIn('toMajor', [{
      __type: "Pointer",
      className: 'SchoolMajor',
      objectId: this.object.majorId
    }])
    if(value && value != 'edit'){
      lesson.equalTo("lessonTest",null);
    }
    let lessonInfo = await lesson.find();
    console.log(lessonInfo)
    if (lessonInfo && lessonInfo.length) {
      for (let i = 0; i < lessonInfo.length; i++) {
        this.lessonList.push({
          objectId: lessonInfo[i].id,
          title: lessonInfo[i].get("title")
        })
      }
    }
  }
  changeLesson(e) {
    if (!e) {
      this.lessonList = [];
      this.chapterList = [];
      this.chapterId = null;
      this.object.lesId = null;
      this.object.lessonId = null;
    } else {
      this.getLesson()
    }
  }


  // 获取章
  chapterId;
  chapterList = []
  async getChapter(e?) {
    console.log(e, this.object.lessonId, this.object.lesId)
    if (!this.object.lessonId && !this.object.lesId) {
      this.message.error("请先选择课程信息! ")
      return
    }
    this.chapterList = []
    let lesson = new Parse.Query("LessonArticle");
    // lesson.equalTo("company", this.object.depaId);
    lesson.equalTo("parent", null);
    if(e && e != 'edit'){
      lesson.equalTo("test",null);
    }
    lesson.equalTo("lesson", this.object.lesId || this.object.lessonId)
    let lessonInfo = await lesson.find();
    console.log(lessonInfo)
    if (lessonInfo && lessonInfo.length) {
      for (let i = 0; i < lessonInfo.length; i++) {
        this.chapterList.push({
          objectId: lessonInfo[i].id,
          title: lessonInfo[i].get("title")
        })
      }
    }
  }
  changeChapter(e) {
    if (!e) {
      this.chapterList = [];
      this.chapterId = null;
    } else {
      this.getChapter()
    }
  }


  // 添加,修改标题
  addOfColumn = [
    {
      title: '标题',
      value: 'title',
      type: 'String'
    },
    {
      title: '专业',
      value: 'centerName',
      type: 'String'
    },
    {
      title: '课程',
      value: 'batch',
      type: 'String'
    },
    {
      title: '章',
      value: 'count',
      type: 'String'
    }
  ];
  operatModal;
  isConfirmLoading;

  oldLessonId;

  // 编辑, 保存
  async operate(type, data?) {
    if (type == 'add') {
      this.object = {}
      this.operatModal = true;
      this.chapterId = null;
      this.getSchoolMajor()
    }
    if (type == 'edit') {
      this.object = {}
      this.object = Object.assign({}, data);
      console.log(this.object);
      this.operatModal = true;
      this.chapterId = this.object.actId
      this.oldLessonId = null;
      if(this.object.lessonId){
        this.oldLessonId = this.object.lessonId
      }else if(this.object.lesId){
        this.oldLessonId = this.object.lesId
      }

      await this.getSchoolMajor()
      await this.getLesson('edit')
      await this.getChapter('edit')
    }
    if (type == 'save') {
      console.log(this.object)
      console.log(this.chapterId)
      if (!this.object.title) {
        this.message.error("请填写试卷名称! ")
        return
      }
      if (!this.object.majorId) {
        this.message.error("请选择专业信息! ")
        return
      }
      if (!this.object.lessonId && !this.object.lesId) {
        this.message.error("请填写课程信息! ")
        return
      }
      
      console.log(this.addOfColumn)
      console.log(this.object)

      // 创建新数据
      if (!this.object.objectId) {
        if(!this.chapterId){
          if (this.object.lesId) {
            let lesson = new Parse.Query("Lesson")
            lesson.equalTo("company", "1ErpDVc1u6");
            // lesson.equalTo("department", this.department);
            lesson.equalTo("objectId", this.object.lesId);
            let lesInfo = await lesson.first().catch(err => console.log(err))
            if (lesInfo && lesInfo.id) {
              if(lesInfo.get("lessonTest")){
                this.message.error("该课程信息已存在试卷! ")
                return
              }
            }
          } else if (this.object.lessonId) {
            let lesson = new Parse.Query("Lesson")
            lesson.equalTo("company", "1ErpDVc1u6");
            // lesson.equalTo("department", this.department);
            lesson.equalTo("objectId", this.object.lessonId);
            let lesInfo = await lesson.first().catch(err => console.log(err))
            if (lesInfo && lesInfo.id) {
              if(lesInfo.get("test")){
                this.message.error("该课程信息已存在试卷! ")
                return
              }
            }
          }
        }

        let paper = Parse.Object.extend("Survey");
        let paperInfo = new paper();
        paperInfo.set("title", this.object.title);
        paperInfo.set("isEnabled", true);
        paperInfo.set("type", "exam");

        paperInfo.set("departments", [
          {
            __type: "Pointer",
            className: "Department",
            objectId: this.department,
          }
        ]);
        paperInfo.set("schoolMajor", {
          __type: "Pointer",
          className: "SchoolMajor",
          objectId: this.object.majorId
        });
        paperInfo.set("department", {
          __type: "Pointer",
          className: "Department",
          objectId: this.department,
        });
        paperInfo.set("company", {
          __type: "Pointer",
          className: "Company",
          objectId: "1ErpDVc1u6"
        });
        
        let surveyRes = await paperInfo.save().catch((err) => console.log(err));
        console.log(surveyRes)

        // 保存题库对的课程或章节
        if (this.chapterId) {
          let query = new Parse.Query("LessonArticle")
          // query.equalTo("company", "1ErpDVc1u6");
          query.equalTo("objectId", this.chapterId);
          let actInfo = await query.first().catch(err => console.log(err))
          if (actInfo && actInfo.id) {
            actInfo.set("test", {
              __type: "Pointer",
              className: "Survey",
              objectId: surveyRes.id
            });
            let actRes = await actInfo.save()
            console.log(actRes)
          }
        } else {
          if (this.object.lesId) {
            let lesson = new Parse.Query("Lesson")
            lesson.equalTo("company", "1ErpDVc1u6");
            lesson.equalTo("school", this.department);
            lesson.equalTo("objectId", this.object.lesId);
            let lesInfo = await lesson.first().catch(err => console.log(err))
            if (lesInfo && lesInfo.id) {
              lesInfo.set("lessonTest",{
                __type: "Pointer",
                className: "Survey",
                objectId: surveyRes.id
              });
              let lessonRes = await lesInfo.save()
              console.log(lessonRes)
            }
          } else if (this.object.lessonId) {
            let lesson = new Parse.Query("Lesson")
            lesson.equalTo("company", "1ErpDVc1u6");
            lesson.equalTo("school", this.department);
            lesson.equalTo("objectId", this.object.lessonId);
            let lesInfo = await lesson.first().catch(err => console.log(err))
            if (lesInfo && lesInfo.id) {
              lesInfo.set("lessonTest",{
                __type: "Pointer",
                className: "Survey",
                objectId: surveyRes.id
              });
              let lessonRes = await lesInfo.save()
              console.log(lessonRes)
            }
          }
        }
        this.operatModal = false
        this.message.info("保存成功! ")
      } else if (this.object.objectId) {
        if(!this.chapterId){
          console.log(this.object.lesId, this.oldLessonId)
          if (this.object.lesId && this.oldLessonId && this.oldLessonId != this.object.lesId) {
            let lesson = new Parse.Query("Lesson")
            lesson.equalTo("company", "1ErpDVc1u6");
            lesson.equalTo("school", this.department);
            lesson.equalTo("objectId", this.object.lesId);
            let lesInfo = await lesson.first().catch(err => console.log(err))
            console.log(lesInfo)
            if (lesInfo && lesInfo.id) {
              if(lesInfo.get("lessonTest")){
                this.message.error("该课程信息已存在试卷! ")
                return
              }
            }
          } else if (this.object.lessonId && this.oldLessonId && this.oldLessonId != this.object.lessonId) {
            let lesson = new Parse.Query("Lesson")
            lesson.equalTo("company", "1ErpDVc1u6");
            lesson.equalTo("school", this.department);
            lesson.equalTo("objectId", this.object.lessonId);
            let lesInfo = await lesson.first().catch(err => console.log(err))
            if (lesInfo && lesInfo.id) {
              if(lesInfo.get("test")){
                this.message.error("该课程信息已存在试卷! ")
                return
              }
            }
          }
        }

        // 修改
        let paper = new Parse.Query("Survey")
        let paperInfo = await paper.get(this.object.objectId)
        paperInfo.set("title", this.object.title)
        paperInfo.set("schoolMajor", {
          __type: "Pointer",
          className: "SchoolMajor",
          objectId: this.object.majorId
        });
        let surveyRes: any = await paperInfo.save().catch((err) => console.log(err));
        console.log(surveyRes)

        // 清除课程中题库的关联
        let lesson = new Parse.Query("Lesson")
        lesson.equalTo("company", "1ErpDVc1u6");
        lesson.equalTo("school", this.department);
        lesson.equalTo("lessonTest", surveyRes.id);
        let lesInfo = await lesson.first().catch(err => console.log(err))
        if (lesInfo && lesInfo.id) {
          lesInfo.unset("lessonTest");
          let lessonRes = await lesInfo.save()
          console.log(lessonRes)
        }

        // 清除章节中题库的关联
        let query = new Parse.Query("LessonArticle")
        query.equalTo("company", "1ErpDVc1u6");
        query.equalTo("test", surveyRes.id);
        let actInfo = await query.first().catch(err => console.log(err))
        if (actInfo && actInfo.id) {
          actInfo.unset("test");
          let actRes = await actInfo.save()
          console.log(actRes)
        }

        // 保存题库对的课程或章节
        if (this.chapterId) {
          let query = new Parse.Query("LessonArticle")
          // query.equalTo("company", "1ErpDVc1u6");
          query.equalTo("objectId", this.chapterId);
          let actInfo = await query.first().catch(err => console.log(err))
          if (actInfo && actInfo.id) {
            actInfo.set("test", {
              __type: "Pointer",
              className: "Survey",
              objectId: surveyRes.id
            });
            let actRes = await actInfo.save()
            console.log(actRes)
          }
        } else {
          if (this.object.lesId) {
            let lesson = new Parse.Query("Lesson")
            lesson.equalTo("company", "1ErpDVc1u6");
            lesson.equalTo("school", this.department);
            lesson.equalTo("objectId", this.object.lesId);
            let lesInfo = await lesson.first().catch(err => console.log(err))
            if (lesInfo && lesInfo.id) {
              lesInfo.set("lessonTest",{
                __type: "Pointer",
                className: "Survey",
                objectId: surveyRes.id
              });
              let lessonRes = await lesInfo.save()
              console.log(lessonRes)
            }
          } else if (this.object.lessonId) {
            let lesson = new Parse.Query("Lesson")
            lesson.equalTo("company", "1ErpDVc1u6");
            lesson.equalTo("school", this.department);
            lesson.equalTo("objectId", this.object.lessonId);
            let lesInfo = await lesson.first().catch(err => console.log(err))
            if (lesInfo && lesInfo.id) {
              lesInfo.set("lessonTest",{
                __type: "Pointer",
                className: "Survey",
                objectId: surveyRes.id
              });
              let lessonRes = await lesInfo.save()
              console.log(lessonRes)
            }
          }
        }
        this.operatModal = false
        this.message.info("修改成功! ")
      } else {
        this.message.error("操作错误! ")
        return
      }

      this.getProfiles()
    }
    if(type == 'delete'){
      console.log(data)
      if(!data){
        this.message.error("试卷id不能为空! ")
        return
      }

      // 清除课程中题库的关联
      let lesson = new Parse.Query("Lesson")
      lesson.equalTo("company", "1ErpDVc1u6");
      lesson.equalTo("department", this.department);
      lesson.equalTo("lessonTest", data);
      let lesInfo = await lesson.first().catch(err => console.log(err))
      if (lesInfo && lesInfo.id) {
        lesInfo.unset("lessonTest");
        let lessonRes = await lesInfo.save()
        console.log(lessonRes)
      }

      // 清除章节中题库的关联
      let query = new Parse.Query("LessonArticle")
      query.equalTo("company", "1ErpDVc1u6");
      query.equalTo("test", data);
      let actInfo = await query.first().catch(err => console.log(err))
      if (actInfo && actInfo.id) {
        actInfo.unset("test");
        let actRes = await actInfo.save()
        console.log(actRes)
      }

      let survey = new Parse.Query("Survey");
      survey.equalTo("objectId", data);
      survey.notEqualTo("isDeleted", true);
      survey.equalTo("company", "1ErpDVc1u6");
      survey.equalTo("department",this.department);
      let surveyInfo = await survey.first().catch(err=>console.log(err))
      console.log(surveyInfo)
      if(surveyInfo && surveyInfo.id){
        surveyInfo.set("isDeleted", true);
        let res = await surveyInfo.save().catch(err=>console.log(err))
        console.log(res)
        this.message.info("删除成功! ")
      }
      this.getProfiles()
    }
  }


  // 跳转至题目详情
  toDetail(sid) {
    this.router.navigate(['/self-study/survey-detail', { sid: sid }])
  }

  pageChange(e) {
    this.isLoading = true
    this.getProfiles()
  }
  pageSizeChange(e) {
    console.log(e)
    this.pageSize = e;
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

  searchTypeChange(e) {
    let index = this.listOfColumn.findIndex(item => item.value == e);
    console.log(e);
    if (index != -1) {
      this.searchType = this.listOfColumn[index];
      console.log(this.searchType)
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
}