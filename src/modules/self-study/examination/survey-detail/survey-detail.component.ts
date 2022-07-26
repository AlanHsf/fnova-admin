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
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrls: ['./survey-detail.component.scss']
})
export class SurveyDetailComponent implements OnInit {

  constructor(private activeRouter: ActivatedRoute, private router: Router, private message: NzMessageService, private cdRef: ChangeDetectorRef, private http: HttpClient) { }
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
      title: '题目',
      value: 'title',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '题目类型',
      value: 'type',
      type: 'String',
      compare: null,
      schemaAlia: 'depa'
    },
    {
      title: '分数',
      value: 'score',
      type: 'Number',
      compare: null,
      schemaAlia: 'depa'
    },
    {
      title: '启用',
      value: 'isEnabled',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '排序',
      value: 'index',
      type: 'Number',
      compare: null,
      schemaAlia: 'major'
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
  sid;
  async ngOnInit(): Promise<void> {
    this.activeRouter.paramMap.subscribe(params => {
      console.log(params);
      this.sid = params['params'].sid;
      if (this.sid) {
        this.searchType = this.listOfColumn[0]
        this.getProfiles()
      }
    })
  }

  async getProfileSchema() {
    const mySchema = new Parse.Schema('Profile');
    let proSche: any = await mySchema.get();
    console.log(proSche);
    this.proField = proSche.fields;
  }

  pageIndex: number = 1;
  pageSize: number = 10;
  async getProfiles(sid?, inputVal?, filter?) {

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let compleSql = '';

    let selectSql = `select 
    "objectId",
    "title",
    "score",
    "index",
    "isEnabled",
    "type",
    "difficulty",
    "knowledge",
    "options",
    "answer" `

    let fromSql = ` from "SurveyItem" where "company" = '1ErpDVc1u6' and "survey" = '${this.sid}' and "isDeleted" is not true `

    let whereSql = ` `
    if (this.searchType.type == 'Boolean') {
      if (this.inputValue == "开启") {
        whereSql += ` and "sur"."${this.searchType.value}" is true `
      } else if (this.inputValue == "关闭") {
        whereSql += ` and "sur"."${this.searchType.value}" is false `
      }
    }else if(this.searchType.type == 'Number'){
      whereSql += ` and "${this.searchType.value}" = ${this.inputValue} `
    } else if (this.inputValue && this.inputValue.trim() != '') {
      whereSql += ` and "${this.searchType.value}" like '%${this.inputValue}%' `
    }

    console.log(whereSql)

    let orderSql = ` order by "index" `
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


  // 查看详情
  toDetail(value){

  }

  // 是否开启
  async checkIsEnabled(value,id){
    console.log(value,id)

    let query = new Parse.Query("SurveyItem");
    let queryInfo = await query.get(id).catch(err => console.log(err))
    console.log(queryInfo)
    if(queryInfo && queryInfo.id){
      queryInfo.set("isEnabled", value);
      let res = await queryInfo.save().catch(err => console.log(err))
      console.log(res)
      this.message.info("修改成功! ")
    }
    // this.getProfiles()
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
      this.object = {
        answer: "",
        difficulty: "normal",
        index: 1,
        isEnabled: true,
        knowledge: null,
        options: [
          { check: false, grade: 1, label: 'A', value: '' },
          { check: false, grade: 1, label: 'B', value: '' },
          { check: false, grade: 1, label: 'C', value: '' },
          { check: false, grade: 1, label: 'D', value: '' }
        ],
        score: 1,
        title: "",
        type: "select-single"
      }
      this.operatModal = true;
      // this.chapterId = null;
      // this.getSchoolMajor()
    }
    if (type == 'edit') {
      this.object = Object.assign({}, data);
      console.log(this.object);
      this.operatModal = true;
    }
    if (type == 'save') {
      console.log(this.object)
      if (!this.object.title) {
        this.message.error("题目不能为空! ")
        return
      }
      if (!this.object.type) {
        this.message.error("题目类型不能为空! ")
        return
      }
      if (!this.object.score) {
        this.message.error("题目分值不能为空! ")
        return
      }
      if (!this.object.index) {
        this.message.error("排序不能为空! ")
        return
      }
      if (this.object.type != 'text') {
        if (!this.object.options.length || this.object.options.length == 0) {
          this.message.error("题目答案不能为空! ")
          return
        }
        let isValue = 0;
        for (let i = 0; i < this.object.options.length; i++) {
          if(this.object.options[i].value){
            isValue += 1;
          }
        }
        console.log(isValue)
        if(isValue < 4){
          this.message.error("题目答案选项请设置4个! ")
          return
        }
        if (this.object.type == 'select-single') {
          let optionCount: number = 0;
          for (let i = 0; i < this.object.options.length; i++) {
            if (this.object.options[i].check) {
              optionCount += 1;
            }
          }
          if (optionCount == 0) {
            this.message.error("请设置单选题目正确答案! ")
            return
          } else if (optionCount > 1) {
            this.message.error("单选题目正确答案请勿设置多个! ")
            return
          }
        } else if (this.object.type == 'select-multiple') {
          let optionCount: number = 0;
          for (let i = 0; i < this.object.options.length; i++) {
            if (this.object.options[i].check) {
              optionCount += 1;
            }
          }
          if (optionCount < 1) {
            this.message.error("请设置多选题目正确答案! ")
            return
          }
        }
      }

      // 设置分数 
      for (let i = 0; i < this.object.options.length; i++) {
        this.object.options[i].grade = this.object.score
      }

      console.log(this.object)

      //   // 创建新数据
      if (!this.object.objectId) {
        let paper = Parse.Object.extend("SurveyItem");
        let paperInfo = new paper();
        paperInfo.set("title", this.object.title)
        paperInfo.set("index", this.object.index)
        paperInfo.set("score", this.object.score)
        paperInfo.set("type", this.object.type)
        paperInfo.set("difficulty", "normal")
        paperInfo.set("isEnabled", true)
        paperInfo.set("options", this.object.options);
        if (this.object.answer && this.object.answer.trim()) {
          paperInfo.set("answer", this.object.answer.trim());
        }
        paperInfo.set("survey", {
            __type: "Pointer",
            className: "Survey",
            objectId: this.sid,
          });
        paperInfo.set("company", {
          __type: "Pointer",
          className: "Company",
          objectId: "1ErpDVc1u6"
        });
        let surveyRes = await paperInfo.save().catch((err) => console.log(err));
        console.log(surveyRes)

        this.operatModal = false
        this.message.info("保存成功! ")
      } else if (this.object.objectId) {

        // 修改
        let paper = new Parse.Query("SurveyItem")
        let paperInfo = await paper.get(this.object.objectId)
        paperInfo.set("title", this.object.title)
        paperInfo.set("index", this.object.index)
        paperInfo.set("score", this.object.score)
        paperInfo.set("type", this.object.type)
        paperInfo.set("difficulty", "normal")
        paperInfo.set("isEnabled", true)
        paperInfo.set("options", this.object.options);
        if (this.object.answer && this.object.answer.trim()) {
          paperInfo.set("answer", this.object.answer.trim());
        }
        let surveyRes: any = await paperInfo.save().catch((err) => console.log(err));
        console.log(surveyRes)

        this.operatModal = false
        this.message.info("修改成功! ")
      } else {
        this.message.error("操作错误! ")
        return
      }

      this.getProfiles()
    }
    if (type == 'delete') {
      console.log(data)
      if (!data) {
        this.message.error("题目id不能为空! ")
        return
      }

      let survey = new Parse.Query("SurveyItem");
      survey.equalTo("objectId", data);
      survey.notEqualTo("isDeleted", true);
      survey.equalTo("company", "1ErpDVc1u6");
      let surveyInfo = await survey.first().catch(err => console.log(err))
      console.log(surveyInfo)
      if (surveyInfo && surveyInfo.id) {
        surveyInfo.set("isDeleted", true);
        let res = await surveyInfo.save().catch(err => console.log(err))
        console.log(res)
        this.message.info("删除成功! ")
      }
      this.getProfiles()
    }
  }


  // 设置选项
  option(value) {
    console.log(value)
    if (!value) {
      this.message.error("请携带参数!")
      return
    }
    if (this.object.type == 'select-single') {
      switch (value) {
        case 'A':
          let opertionsA = this.object.options;
          if (!opertionsA[0].value) {
            this.message.error("请先填写答案!")
            return
          }
          opertionsA[0].check = true
          opertionsA[1].check = false
          opertionsA[2].check = false
          opertionsA[3].check = false
          this.object.options = opertionsA;
          break;
        case 'B':
          let opertionsB = this.object.options;
          if (!opertionsB[1].value) {
            this.message.error("请先填写答案!")
            return
          }
          opertionsB[0].check = false
          opertionsB[1].check = true
          opertionsB[2].check = false
          opertionsB[3].check = false
          this.object.options = opertionsB;
          break;
        case 'C':
          let opertionsC = this.object.options;
          if (!opertionsC[2].value) {
            this.message.error("请先填写答案!")
            return
          }
          opertionsC[0].check = false
          opertionsC[1].check = false
          opertionsC[2].check = true
          opertionsC[3].check = false
          this.object.options = opertionsC;
          break;
        case 'D':
          let opertionsD = this.object.options;
          if (!opertionsD[3].value) {
            this.message.error("请先填写答案!")
            return
          }
          opertionsD[0].check = false
          opertionsD[1].check = false
          opertionsD[2].check = false
          opertionsD[3].check = true
          this.object.options = opertionsD;
          break;
        default: ;
      }
      this.message.info("修改成功! ")
    } else if (this.object.type == 'select-multiple') {
      switch (value) {
        case 'A':
          if (!this.object.options[0].value) {
            this.message.error("请先填写答案!")
            return
          }
          this.object.options[0].check = true;
          break;
        case 'B':
          if (!this.object.options[1].value) {
            this.message.error("请先填写答案!")
            return
          }
          this.object.options[1].check = true;
          break;
        case 'C':
          if (!this.object.options[2].value) {
            this.message.error("请先填写答案!")
            return
          }
          this.object.options[2].check = true;
          break;
        case 'D':
          if (!this.object.options[3].value) {
            this.message.error("请先填写答案!")
            return
          }
          this.object.options[3].check = true;
          break;
        default: ;
      }
      this.message.info("修改成功! ")
    }
  }

  opertionType(value) {
    console.log(value)
    if (value == 'text') {
      this.object.options = []
    } else {
      if (this.object.options.length == 0) {
        this.object.options[0] = { check: false, grade: 1, label: 'A', value: '' };
        this.object.options[1] = { check: false, grade: 1, label: 'B', value: '' };
        this.object.options[2] = { check: false, grade: 1, label: 'C', value: '' };
        this.object.options[3] = { check: false, grade: 1, label: 'D', value: '' };
      } else if (value == 'select-single') {
        this.object.options[0].check = false;
        this.object.options[1].check = false;
        this.object.options[2].check = false;
        this.object.options[3].check = false;
      }
    }
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
