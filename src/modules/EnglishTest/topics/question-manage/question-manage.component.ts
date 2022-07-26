import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as Parse from "parse";
import { NzMessageService } from "ng-zorro-antd/message";
import { HttpClient } from "@angular/common/http";

export interface TreeNodeInterface {
  objectId: string;
  name?: string;
  title?: string;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  checked?: boolean;
  className?: string;
  level?: number;
}

@Component({
  selector: "app-question-manage",
  templateUrl: "./question-manage.component.html",
  styleUrls: ["./question-manage.component.scss"],
})
export class QuestionManageComponent implements OnInit {
  pCompany: string;
  surveys: any;
  survey: any; // 当前选中题库
  company: string;
  subCompany: string;
  department: string;
  departInfo: any;
  departs: any;
  loading: boolean = false;

  topicTypeArr: Array<any>; // 当前题型数组
  knows: any = [];
  topicType: string; // 当前题型
  surveyId: string;
  typeId: string;
  listOfMapData: TreeNodeInterface[] = []; // 表格数据
  mapOfExpandedData: { [objectId: string]: TreeNodeInterface[] } = {};

  AllChecked: boolean = false; // 全选
  setOfCheckedId = new Set<number>();

  showTable: boolean = false;
  expandSet = new Set<number>();
  currentType: any; // 选中题型

  // 筛选
  searchValue: string;
  searchType: any = {};
  // 表格
  displayedColumns: Array<any> = [];
  listOfData: any = [];
  filterData: any = [];
  filterType: string;
  filterLen: number;
  isLoading: boolean = false;
  count: number;
  pageIndex: number = 1;
  pageSize: number = 15;
  // 表头
  listOfColumn = [
    {
      title: "序号",
      compare: null,
      priority: false,
    },
    {
      title: "试题内容",
    },
    {
      title: "所属题库",
    },
    {
      title: "所属题型",
    },
    {
      title: "题目类型",
    },
    {
      title: "难度",
      compare: null,
      priority: false,
    },
    {
      title: "启用",
    },
    {
      title: "创建人",
    },
    {
      title: "创建时间",
      compare: null,
      priority: false,
    },
    // {
    //   title: '操作',
    //   compare: null,
    //   priority: false
    // }
  ];
  constructor(
    private route: Router,
    private activRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private message: NzMessageService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      let company = localStorage.getItem("company");
      this.department = localStorage.getItem("department");
      if (!this.department) {
        this.company = company;
        this.departs = await this.getDeparts();
        if(this.departs && this.departs.length > 0) {
          this.departInfo = this.departs[0];
          this.department = this.departs[0]?.id;
          this.subCompany = this.departs[0]?.get("subCompany");
        }
        
      } else {
        this.departInfo = await this.getDepart();
        this.company = company;
        this.pCompany = this.departInfo.get("company")?.id;
      }
      this.surveys = [];
      console.log(this.departInfo);

      await this.initData();
    });
  }
  async getDeparts() {
    let queryD = new Parse.Query("Department");
    queryD.equalTo("company", this.company);
    let res = await queryD.find();
    if (res && res.length) {
      return res;
    }
  }
  async getDepart() {
    let queryD = new Parse.Query("Department");
    queryD.get(this.department);
    let res = await queryD.first();
    if (res && res.id) {
      console.log(res);
      return res;
    }
  }
  async initData() {
    this.loading = true;
    let knows = await this.getKnows();
    this.knows = knows;
    let surveys = await this.getSurveys();
    console.log(knows, surveys);
    this.surveys = surveys;
    surveys.forEach((survey) => {
      survey.children = knows;
      survey.expand = false;
      survey.checked = false;
      survey.level = 1;
    });
    this.listOfMapData = this.surveys;
    this.listOfMapData.forEach((item) => {
      this.mapOfExpandedData[item.objectId] = this.convertTreeToList(item);
    });
    console.log(this.listOfMapData);
    this.showTable = true;
    this.loading = false;
    console.log(this.surveys);
    // let surveyLen = this.surveys.length;
    // for (let index = 0; index < surveyLen; index++) {
    //   let survey = this.surveys[index];
    //   let className = this.surveys[index].className;
    //   this.surveys[index] = this.surveys[index].toJSON();
    //   this.surveys[index].children = await this.getTopicTypes();
    //   this.surveys[index].expand = false;
    //   this.surveys[index].checked = false;
    //   // this.surveys[index].level = 1;
    //   this.surveys[index].className = className;
    //   if (index + 1 == surveyLen) {
    //     this.listOfMapData = this.surveys;
    //     console.log(this.listOfMapData);
    //     this.listOfMapData.forEach((item) => {
    //       this.mapOfExpandedData[item.objectId] = this.convertTreeToList(item);
    //     });
    //     console.log(this.listOfMapData);
    //     this.showTable = true;
    //   }
    // }
  }
  async getKnows() {
    let sql;
    let department = this.department;
    if (department) {
      sql = `select * from "Knowledge" where "department"='${department}'`;
    }else {
      sql = `select * from "Knowledge" where "company"='${this.company}'`;
    }
    let knows = await this.novaSql(sql);
    return knows;
  }
  async getSurveys() {
    let company = this.pCompany || this.company;
    let sql = `select * from "Survey" where "company"='${company}' and "isDeleted" is not true`;
    if (this.department) {
      sql += ` and "department"='${this.department}' `;
    }
    let surveys = await this.novaSql(sql);
    return surveys;
  }
  async getTopics() {
    let company = this.pCompany || this.company;
    let selectSql = `select * from "Survey" where "company"='${company}' `;
    let fromSql = ` FROM  "SurveyLog" as "slog"
    left join "Exam" as "exam" on "exam"."objectId" = "slog"."exam"
    left join (select * from "Profile" where "isDeleted" is not true) as "pro" on "slog"."profile"="pro"."objectId"`;
    let whereSql = ` WHERE   "slog"."objectId" is not null`;
    let searchSql = "";
    let orderSql = ' ORDER BY "slogId" DESC ';
    let limitSql = `limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize
      })`;
    selectSql += `,"depart"."objectId" as "departId"`;
    fromSql += ` LEFT JOIN "Department" as "depart" ON "slog"."department" = "depart"."objectId" `;
    whereSql += ` and "slog"."department"='${this.department}' `;

    let completSql = selectSql + fromSql + whereSql + searchSql + limitSql;
    let countSql = `select count(*) ` + fromSql + whereSql + searchSql;

    let sql = `select * from "Survey" where "company"=''`;
    let data = await this.novaSql(completSql);
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
  async getTopicTypes() {
    let topicTypeArr = [];
    let TargetClass = new Parse.Query("Knowledge");
    TargetClass.equalTo("company", this.company);
    TargetClass.equalTo("parent", undefined);
    let target = await TargetClass.find();
    console.log("target:" + target.length);
    if (target && target.length) {
      let tTypes: any = target;
      for (let tType of tTypes) {
        let className = tType.className;
        tType = tType.toJSON();
        tType.checked = false;
        tType.expand = false;
        // tType.level = 2;
        tType.className = className;

        // await this.getTopicType(tType.objectId)
        topicTypeArr.push(tType);
      }
    } else {
      topicTypeArr = [];
    }
    // this.topicType = ''

    return topicTypeArr;
  }

  async getKnowName(id) {
    let Know = new Parse.Query("Knowledge");
    let know = await Know.get(id);
    console.log(know);

    if (know && know.id) {
      return know.get("name");
    } else {
      return "";
    }
  }
  // 表格
  collapse(
    array: TreeNodeInterface[],
    data: TreeNodeInterface,
    $event: boolean
  ): void {
    console.log(array, data, $event);
    if (!$event) {
      if (data.children) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.objectId === d.objectId)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
    if ($event) {
      if (data.children) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.objectId === d.objectId)!;
          target.expand = true;
          this.collapse(array, target, true);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 1, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            ...node.children[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }

    return array;
  }

  visitNode(
    node: TreeNodeInterface,
    hashMap: { [objectId: string]: boolean },
    array: TreeNodeInterface[]
  ): void {
    if (!hashMap[node.objectId]) {
      hashMap[node.objectId] = true;
      array.push(node);
    }
  }

  /* cheked相关函数 */
  /* begin cheked */
  indeterminate = false;
  listOfCurrentPageData: readonly any[] = [];
  // updateCheckedSet(id: string, checked: boolean): void {
  //   if (checked) {
  //     console.log(this.setOfCheckedId);

  //     this.setOfCheckedId.add(id);
  //   } else {
  //     console.log(this.setOfCheckedId);

  //     this.setOfCheckedId.delete(id);
  //   }
  // }
  // onItemChecked(id: string, checked: boolean): void {
  //   console.log(id,checked);

  //   this.updateCheckedSet(id, checked);
  //   this.refreshCheckedStatus();
  // }
  onAllChecked(value: boolean): void {
    console.log("select all 2");
    this.listOfMapData.forEach((item) => {
      item.checked = this.AllChecked;
    });
    console.log(this.AllChecked);
    // this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    // this.refreshCheckedStatus();
  }
  onItemChecked(id, e) {
    console.log(id, e);
    // let allChecked = true;
    if (e == false) {
      this.AllChecked = false;
    }
    this.listOfMapData.forEach((data) => {
      if (data.objectId == id) {
        console.log(data);
        data.checked == e;
      }
      // if(data.checked == false){
      //   allChecked = false;
      // }
    });
    // setTimeout(() => {
    //   console.log(allChecked);
    //   this.AllChecked = allChecked;
    // }, 500)
  }
  // onAllChecked(checked: boolean): void {
  //   this.listOfCurrentPageData
  //     .filter(({ disabled }) => !disabled)
  //     .forEach(({ id }) => this.updateCheckedSet(id, checked));
  //   this.refreshCheckedStatus();
  // }
  // refreshCheckedStatus(): void {
  //   const listOfEnabledData = this.listOfMapData;
  //   this.AllChecked = listOfEnabledData.every(({ objectId }) => this.setOfCheckedId.has(objectId));
  //   this.indeterminate = listOfEnabledData.some(({ objectId }) => this.setOfCheckedId.has(objectId)) && !this.AllChecked;
  // }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  /* end cheked */
  // 选中题库 表格显示题库、题型 选中题型 表格显示题型 试题
  async changeTableData(type, event, index, survey?) {
    this.showTable = false;
    console.log(index, survey);
    // if(typeof event == ){
    //   event.cancelBubble=true
    // }
    switch (type) {
      case "survey":
        this.surveyId = survey.objectId;
        this.survey = survey;
        survey.expand = !survey.expand;
        // this.surveys[index].expand = !this.surveys[index].expand;
        this.listOfMapData = this.surveys;
        console.log(this.listOfMapData);
        // this.listOfMapData[index].expand = !this.listOfMapData[index].expand;
        break;
      case "know":
        this.surveyId = survey.objectId;
        this.survey = survey;
        this.typeId = survey.children[index].objectId;
        this.currentType = survey.children[index];
        this.currentType.checked = false;
        this.currentType.expand = true;
        await this.getTableData("know", survey.children[index]);
        this.pageIndex = 1;
        break;
      case "changeType":
        // this.surveyId =  survey.objectId;
        // this.typeId =  survey.children[index].objectId;

        break;
      default:
        break;
    }

    this.showTable = true;
    this.cdRef.detectChanges();
  }
  tableDataChange(event) {
    console.log(666, event);
  }
  async getTableData(type, data?) {
    console.log(type, data);
    let tableData: any = [];
    let sql = "";
    let countData;
    switch (type) {
      case "know":
        tableData = await this.getTopicArr("SurveyItem", data.objectId);
        sql = `select count(*)
        from "SurveyItem"
        where "parent" is null and "isDeleted" is not true and "survey" = '${this.surveyId}'and "knowledge" @> '[{"objectId":"${data.objectId}"}]'`;
        countData = await this.novaSql(sql);
        this.listOfMapData = [...tableData];
        this.listOfMapData.forEach((item) => {
          this.mapOfExpandedData[item.objectId] = this.convertTreeToList(item);
        });
        this.filterLen = countData[0].count;
        console.log(this.listOfMapData, this.filterLen);

        break;

      case "search":
        if (!this.searchValue || this.searchValue.trim() == "") {
          return;
        }
        tableData = await this.getTopicArr("SurveyItem", null, "search");
        sql = `select count(*)
            from "SurveyItem"
            where "parent" is null and "title" like '%${this.searchValue}%'  and "isDeleted" is not true and "company"='${this.company}'`;
        countData = await this.novaSql(sql);
        this.listOfMapData = [...tableData];
        this.listOfMapData.forEach((item) => {
          this.mapOfExpandedData[item.objectId] = this.convertTreeToList(item);
        });
        this.filterLen = countData[0].count;
        console.log(this.listOfMapData, this.filterLen);

        break;

      default:
        break;
    }
  }
  async getTopicArr(className, knowId, type?) {
    return new Promise((resolve, reject) => {
      let sql = "";
      let topicArr = [];
      if (type && type == "search") {
        this.survey = null;
        this.currentType = null;
        console.log(this.searchValue)
        // let searchValue = this.searchValue.replace(/'|"|“|”|‘|’/g, "%")
        let searchValue = this.searchValue.replace(/['"“”‘’]/g, "%")// 无效
        // let searchValue = JSON.stringify(this.searchValue)
        console.log(searchValue)
        let typeArrStr = (this.knows.map(item => `'${item.objectId}'`).toString());
        console.log(typeArrStr)
        sql = `with recursive rel_tree as (
      (select "sItem"."parent","sItem"."title","survey"."objectId" as "sId","survey"."title" as "sTitle","sItem"."objectId","sItem"."company","sItem"."createdAt","sItem"."score","sItem"."isEnabled","sItem"."isDeleted","sItem"."type","sItem"."survey","sItem"."difficulty","sItem"."index","sItem"."knowledge","sItem"."queNum",jsonb_array_elements("sItem"."knowledge")::json->>'objectId' as "kid2","survey"."isDeleted" as "sdel"
      from "SurveyItem" as "sItem"
   left join "Survey" as "survey" on "survey"."objectId"="sItem"."survey"
      where "sItem"."parent" is null and "sItem"."isDeleted" is not true
      and "survey"."objectId" is not null and "survey"."isDeleted" is not true  -- 所属题库数据存在且非已删除状态
       and "sItem"."title" like '%${searchValue}%' and "sItem"."company"='${this.company}'  order by "sItem"."createdAt" desc
--         and "know"."objectId" is  null  as "kid",
limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})  )
        union all
        select c."parent",c."title","survey"."objectId" as "sId","survey"."title" as "sTitle",c."objectId",c."company",c."createdAt",c."score",c."isEnabled",c."isDeleted",c."type",c."survey",c."difficulty",c."index",c."knowledge",c."queNum",jsonb_array_elements(c."knowledge")::json->>'objectId' as "kid2","survey"."isDeleted" as "sdel"
        from "SurveyItem" c  left join "Survey" as "survey" on "survey"."objectId"=c."survey"
          join rel_tree p on c."parent" = p."objectId")
     select "parent","title","sId","objectId","company","createdAt","score","isEnabled","isDeleted","type","survey","sTitle","difficulty","index","knowledge","queNum","kid2","sdel"
     from rel_tree`;

      } else {
        sql = `with recursive rel_tree as (
        (select "parent","title","objectId","company","createdAt","score","isEnabled","isDeleted","type","difficulty","index","knowledge","queNum"
        from "SurveyItem"
        where "parent" is null and "isDeleted" is not true and "survey" = '${this.surveyId
          }'and "knowledge" @> '[{"objectId":"${knowId}"}]' order by "createdAt" desc
        limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize
          }))
        union all
        select c."parent",c."title",c."objectId",c."company",c."createdAt",c."score",c."isEnabled",c."isDeleted",c."type",c."difficulty",c."index",c."knowledge",c."queNum"
        from "SurveyItem" c
          join rel_tree p on c."parent" = p."objectId"
     )
     select "parent","title","objectId","company","createdAt","score","isEnabled","isDeleted","type","difficulty","index","knowledge","queNum"
     from rel_tree`;
      }

      this.novaSql(sql).then((topics) => {
        if (topics && topics.length) {
          let topicMap = {};
          topics.forEach((topic, index) => {
            if (!topic.parent) {
              topic.title = topic.title.replace(/<[^>]+>/g, " ");
              topic.checked = false;
              topic.expand = true;
              topic.className = className;
              if (type == "search") {
                if (!topic.kid2) {

                }
              }
              topicMap[topic.objectId] = topic;
            }
          });
          topics.forEach((topic) => {
            if (topic.parent && topicMap[topic.parent]) {
              topic.checked = false;
              topic.expand = true;
              topic.className = className;
              if (!topicMap[topic.parent].children) {
                topicMap[topic.parent].children = [];
              }
              topicMap[topic.parent].children.push(topic);
            }
          });
          let keys = Object.keys(topicMap);
          for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            topicMap[key].num = index;
            topicArr.push(topicMap[key]);
          }
        }
        console.log(topicArr);
        resolve(topicArr);
      });
    });
  }
  async changeSurvey(ev) {
    this.topicTypeArr = [];
    console.log(ev);

    if (!ev) {
      this.survey = null;
      return;
    }

    this.survey = await this.getSurvey(ev);
    this.topicTypeArr = await this.getTopicTypes();
  }
  async getSurvey(id) {
    let Survey = new Parse.Query("Survey");
    let survey = await Survey.get(id);
    return survey;
  }
  // 根据题库来查询题型
  search() {
    this.getTopicTypes();
  }
  toPage(item?, type?) {
    if (type == "survey") {
      this.route.navigate(["common/manage/Survey", { rid: "MX0G8l4uOE" }]);
      return;
    }
    if (item) {
      console.log(item);
      this.route.navigate([
        "english/manual-import-topic",
        { rid: "SePue8hrDT", surveyId: item.objectId },
      ]);
      return;
    }
    this.route.navigate([
      "english/import-question-bank",
      { rid: "SePue8hrDT", surveyId: this.surveyId },
    ]);
  }
  /* 题目启用开关 */
  async toggleSwitch(ev, obj, key) {
    let queryTopic = new Parse.Query("SurveyItem");
    let topic = await queryTopic.get(obj.objectId);
    topic.set(key, ev);
    topic
      .save()
      .then((data) => {
        obj = data.toJSON();
      })
      .catch((err) => {
        this.message.create(
          "error",
          "保存出错",
          err.message ? err.message : "保存出错"
        );
      });
  }

  batchDelete() { }
  WarnVisible = false;
  warnMessage;
  warnType;
  deleteObj;
  async delete(item) {
    console.log(item);
    this.deleteObj = item;
    switch (item.className) {
      case "Survey":
        this.WarnVisible = true;
        this.warnType = "survey";
        this.warnMessage =
          "删除该题库，该题库下所有题目会一并删除，请谨慎操作。确认删除该题库？";
        break;
      case "Knowledge":
        this.WarnVisible = true;
        this.warnType = "tType";
        this.warnMessage =
          "删除该题型，该题型所有题目会一并删除，请谨慎操作。确认删除该题型？";
        break;
      case "SurveyItem":
        this.WarnVisible = true;
        this.warnType = "surveyItem";
        this.warnMessage = "确认删除该题目？";
        break;

      default:
        break;
    }
  }
  async deleteItem() {
    let item = this.deleteObj;
    let Item = new Parse.Query(item.className);
    let sItem = await Item.get(item.objectId);
    sItem.set("isDeleted", true);
    let delObj = await sItem.save()
    if (delObj && delObj.id) {
      switch (item.className) {
        case 'Survey':
          await this.deleteSurveyItem(item.objectId, item.className);
          break;
        case 'SurveyItem':
          if (!item.parent) {
            await this.deleteSubItem(item.objectId, item.className);
          }
          break;
        default:
          break;
      }
      this.message.success("操作成功");
      this.listOfMapData = [...this.listOfMapData];
      this.listOfMapData.forEach((item) => {
        this.mapOfExpandedData[item.objectId] = this.convertTreeToList(item);
        this.cdRef.detectChanges();
      });
    } else {
      this.message.error("操作失败");
    }
  }
  async deleteSurveyItem(sId, className) {

  }
  async deleteSubItem(pId, className) {
    let Items = new Parse.Query(className);
    Items.equalTo("parent", pId);
    let sItem = await Items.find();
    if (sItem && sItem.length) {
      sItem.forEach((item) => {
        item.set("isDeleted", true);
        item.save().then((res) => {
          console.log(res);
        });
      });
    }
  }
  warnCancel() {
    this.WarnVisible = false;
  }
  warnEnter() {
    this.WarnVisible = false;
    this.deleteItem();
  }
  edit(type, item) {
    console.log(item);
    switch (type) {
      case "topic":
        let editParams = {
          type: "edit",
          surveyId: item.sId || this.surveyId,
          tTypeId: item.knowledge[0].objectId,
          topicId: item.objectId,
        };
        this.route.navigate([
          "english/manual-import-topic",
          { rid: "SePue8hrDT", ...editParams },
        ]);

        break;

      default:
        break;
    }
  }
}
