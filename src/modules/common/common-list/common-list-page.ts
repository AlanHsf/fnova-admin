import * as Parse from "parse";
import { ChangeDetectorRef } from "@angular/core";
import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

// 云数据相关依赖
import { Cloud } from "../../../providers/cloud";
// Ant 相关依赖
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";

import { DatePipe } from "@angular/common";
// CDK Table 相关依赖

import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs";

import { from } from "rxjs";
import { combineLatest } from "rxjs";

import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import { EditObjectComponent } from "../../common/edit-object/edit-object.component";
import {
  FormControl,
  Validators,
} from "@angular/forms";

// 全局服务
import { AppService } from "../../../app/app.service";
import { NzBytesPipe } from "ng-zorro-antd/pipes";

@Component({
  selector: "common-list",
  templateUrl: "common-list-page.html",
  styleUrls: ["./common-list-page.scss"],
  providers: [DatePipe, NzBytesPipe],
})
export class CommonListPage implements OnInit {
  @ViewChild(EditObjectComponent, { static: true })
  editObject: EditObjectComponent;
  checked: boolean = false;
  listOfSelection = [];
  alertCtrl: any;
  modalCtrl: any;
  nav: any;
  navParams: any = {};
  pageIndex: Number = 1;

  // 编辑editModal相关变量
  isVisibleEditModal = false;

  fileds: Array<any>;
  object: any = {}; // 当前对象的toJSON内容
  current: any; // 当前编辑的ParseObject实例对象

  hasCurrent: Boolean = false;
  now: Date;

  qrUrl: string;
  className: string;
  expand: boolean = false
  Class: any;
  Schema: any;
  fields: Array<any>;
  fieldsKeys: Array<any>;
  objs: Array<any> = []; // 实例化对象列表
  typeName: any = {};
  displayedOperators: any = []; // List 页面显示操作功能按钮列表
  managerOperators: any = []; // List 管理员可用操作功能按钮列表
  displayedColumns: any = []; // List 页面显示字段列表
  allColumns: any = []; // 包含第一列、最后一列

  company: any;
  @ViewChild("filter", { static: true }) filter: ElementRef;

  dataSource: ParseDataSource | null | any;
  otherFields: any;
  //搜索相关
  searchType: any;
  searchField: any;
  searchInputText: string = "";
  searchText: string;
  searchColName: string = "";
  // 导出相关
  isExport: boolean = false;
  showExport: boolean = false;

  devRouter: boolean = false;
  rid: string = ""; // 路由id

  // 功能页面属性
  detailPage: any = "class-detail-page"; // 对象查看/详情页面
  detailTitle: any = "详情"; // 对象查看/详情页面
  editPage: any = "class-edit"; // 对象编辑页面
  // 对象选择操作属性及方法
  selectList: any = {};

  // ag-grid 使用配置  start
  public defaultColGroupDef;
  public topOptions = {
    suppressHorizontalScroll: false,
  };
  public defaultColDef: any = {
    editable: true, //单元表格是否可编辑
    enableRowGroup: true, // 允许分组
    enablePivot: true,
    enableValue: true,
    sortable: true, //开启排序
    resizable: true, //是否可以调整列大小，就是拖动改变列大小

    filter: "agTextColumnFilter",
    floatingFilter: true, // 显示过滤栏
    flex: 1,
    minWidth: 100,
  };
  require = [];
  rowData: any;
  groupHeaderHeight: any;
  headerHeight: any;
  floatingFiltersHeight: any;
  pivotGroupHeaderHeight: any;
  pivotHeaderHeight: any;
  excelStyles: any = [
    {
      id: "stringType",
      alignment: {
        shrinkToFit: false,
        wrapText: true,
        dataType: "String",
      },
    },
  ];
  // ag-grid 参数配置结束

  constructor(
    private cloud: Cloud,
    public appServ: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private nzBytes: NzBytesPipe
  ) {
    if (
      window.location.hostname.startsWith("127") ||
      window.location.hostname.startsWith("local")
    ) {
      this.isLocalDevMode = true;
    }

    this.currentRole = this.appServ.currentRole;
    this.dataSource = {};

    combineLatest(this.route.paramMap, this.route.queryParamMap).subscribe(
      async (data) => {
        if (this.dataSource && this.dataSource.Pobject) {
          this.dataSource.Pobject = undefined;
          this.dataSource.PobjectId = undefined;
          this.dataSource.PclassName = undefined;
        }
        this.showExport = false;
        let params = data[0];
        let queryParams = data[1];
        /* 路由可得参数详解
         ** 路由参数
         schemaName，当前操作类名
         PclassName，筛选条件，所属对象指针类名
         PobjectId，筛选条件，所属对象指针ID值
         ** 限定条件
         equalTo，限制所操作数据与字段相等，如equalTo:{type:"project"}表示所有type为project字段
         ** Schema参数
         detailPage，指定详情页面，不填则使用common-detail
         detailTitle，指定详情按钮名称
         editPage，指定编辑页面，不填则使用common-edit
        */
        // 0.1.初始化对象类，及Schema结构
        let className = params.get("schemaName");
        if (className) {
          this.className = className;
          this.Class = Parse.Object.extend(this.className);
          let schemas = await this.cloud.getSchemas();
          this.Schema = schemas[this.className];
        }
        let rid = params.get("rid");
        if (rid) {
          if (window.location.hostname.startsWith("127") || location.hostname.startsWith("local")) {
            this.devRouter = true;
          }
          this.rid = rid;
          let Router = new Parse.Query("DevRoute");
          let router = await Router.get(rid);
          if (router && router.id) {
            this.headerTitle = router.get("title");
            this.isExport = router.get("export");
            this.qrUrl = router.get("qrUrl");

            this.addTitle = router.get("addTitle") ? router.get("addTitle") : '' // 添加按钮标题 ;

            this.detailTitle = router.get("detailTitle") ? router.get("detailTitle") : ''; // 详情按钮标题

            this.detailPage = router.get("detailPage") ? router.get("detailPage") : ''; // 详情按钮页面地址

            this.managerOperators = router.get("managerOperators") ? router.get("managerOperators") : []; // 管理员权限 ['edit','delete','detail']

            this.displayedOperators = router.get("displayedOperators") ? router.get("displayedOperators") : []; // 超级管理员工 ['add']

            console.log(this.displayedOperators)

            let displayedColumns = router.get("displayedColumns") ? router.get("displayedColumns") : []; // 表头展示字段

            let fileds = router.get("editFields") ? router.get("editFields") : []; // 路由授权字段

            let filedsMap: any = {};

            this.require = []; // 获取导出的表头

            if (fileds && fileds.length > 0) {
              fileds.forEach((filed) => {
                let key = filed.key;
                // 是否有父级是否显示展开按钮
                if (key == 'parent' && filed.type == 'Pointer' && filed.targetClass == className) {
                  this.expand = true;
                }
                filedsMap[key] = filed;
                this.require.push({
                  headerName: filed.name,
                  field: filed.key,
                  other: filed.key,
                  type: filed.type,
                  view: filed.view ? filed.view : "",
                  options: filed.options ? filed.options : [],
                  targetClass: filed.targetClass ? filed.targetClass : "",
                });
              });
            }
            this.displayedColumns = displayedColumns,
              this.fields = filedsMap
            if (this.Schema) {
              this.fieldsKeys = Object.keys(this.Schema.fields);
            }
            //this.initListBySchema();
          }
        } else {
          this.notification.create(
            "error",
            "缺少路由id",
            "缺少路由id"
          );
          return
        }
        // 加载Table数据源
        this.dataSource = new ParseDataSource(
          this.className,
          this.Schema,
          this.appServ,
          this.company
        );

        // 判断增加限定条件 常用过滤方法 equalTo， notEqualTo，exists， containedIn
        let queryArr = ['equalTo', 'notEqualTo', 'exists', 'containedIn']
        queryArr.forEach(fun => {
          if (params.get(fun)) {
            if (fun != 'containedIn') {
              params.get(fun).split(";").forEach((e) => {
                let eArr = e.split(":");
                this.dataSource[fun][eArr[0]] = eArr[1];
              })
            } else {
              let containedIn = JSON.parse(params.get(fun));
              let keys = Object.keys(containedIn);
              for (let index = 0; index < keys.length; index++) {
                let key = keys[index];
                this.dataSource.containedIn[key] = containedIn[key];
              }
            }
          }
        })

        this.searchColName = this.displayedColumns[0]; //搜索列名
        this.dataSource.searchColName = this.displayedColumns[0]; //搜索条件
        this.searchOption = null;
        this.searchType = this.displayedColumns[0] ? this.fields[this.displayedColumns[0]].type : "";
        this.searchField = this.fields[this.displayedColumns[0]];

        // 这个queryParams 传惨是否还有用
        let equalTo: any = queryParams.get("equalTo");
        if (equalTo) {
          equalTo = equalTo.split(";");
          equalTo.forEach((e) => {
            e = e.split(":");
            this.dataSource.equalTo[e[0]] = e[1];
          });
        }
        // 当含P指针参数时，查找该指针所属字段名
        let PclassName = params.get("PclassName");
        let PobjectId = params.get("PobjectId");
        let pageIndex = params.get("pageIndex");
        if (pageIndex) {
          this.pageIndex = Number(pageIndex);
        }
        if (PclassName) {
          this.dataSource.PclassName = PclassName;
          this.dataSource.PobjectId = PobjectId;
          console.log(this.fieldsKeys, this.fields);
          this.fieldsKeys.forEach((key) => {
            if (
              this.fields[key] &&
              this.fields[key].type == "Pointer" &&
              this.fields[key].targetClass == PclassName
            ) {
              this.dataSource.PfiledsKey = key;
            }
          });
          await this.getPobject();
        }
        // 当schema字段存在isDeleted 且当前路由管理员操作权限下有softDelete时  删除操作执行软删除 即当前数据不显示 isDeleted为true的字段
        if (this.isManagerOperatorEnabled('softDelete') && this.fieldsKeys.indexOf('isDeleted') != -1) {
          this.dataSource.notEqualTo["isDeleted"] = true;
        }
        this.dataSource.expand = this.expand
        this.dataSource.refresh();
      }
    );
  }

  async getPobject() {
    return new Promise(async (resolve, reject) => {
      let query = new Parse.Query(this.dataSource.PclassName);
      query.equalTo("objectId", this.dataSource.PobjectId);
      let schemas = await this.cloud.getSchemas();
      let schema = schemas[this.dataSource.PclassName];
      if (schema && schema.fieldsArray) {
        schema.fieldsArray.forEach((fitem) => {
          let targetClass = fitem.targetClass;
          if (targetClass) {
            query.include(fitem.key);
          }
        });
      }

      query.first().then((data) => {
        this.dataSource.Pobject = data;
        resolve(data);
      })
        .catch((err) => {
          reject(err);
        });
    });
  }

  type: any = ""

  ngOnInit() {
    this.searchOption = null;
    this.activatedRoute.paramMap.subscribe(async (parms) => {
      this.searchInputText = null
      if (parms && parms.get("rid")) {
        let rid = parms.get("rid");
        let type = parms.get("type")
        this.type = type
        let DevRoute = new Parse.Query("DevRoute");
        let route = await DevRoute.get(rid);
        if (route && route.id) {
          this.otherFields = route.get("editFields");
          this.otherFields.forEach((fieldItem) => {
            if (fieldItem.default && (!this.object[fieldItem.key] || this.object[fieldItem.key] == "")) {
              this.object[fieldItem.key] = fieldItem.default;
            }
          });
        }
      }
    });

    // 判断用登录 是不是department
    if (localStorage.getItem("department")) {
      let Department = new Parse.Query("Department");
      Department.get(localStorage.getItem("department")).then((res) => {
        if (res && res.id) {
          this.company = res.get("company");
        }
      });
    } else {
      this.company = localStorage.getItem("company");
    }
  }

  back() {
    window.history.back();
  }
  // 删除deleteModal相关变量
  isVisibleDeleteModal = false;
  showDeleteModal(object) {
    this.modalService.confirm({
      nzTitle: `删除${this.Schema ? this.Schema.name : ""}`,
      nzContent: `<b style="color: red;">你确定要删除该${this.Schema ? this.Schema.name : ""
        }及其相关信息吗？</b>`,
      nzOkText: "删除",
      nzOkType: "danger",
      nzOnOk: () => {
        // 如果该表有isDeleted字段  操作权限中有softDelete（软删除），删除操作将isDeleted字段值置为true
        console.log(this.fieldsKeys)
        if (this.isManagerOperatorEnabled('softDelete') && this.fieldsKeys.indexOf('isDeleted') != -1) {
          object.set("isDeleted", true)
          object
            .save()
            .then((data) => {
              data.fetch().then((data) => {
                this.current = data;
                this.object = {};
              });
            })
            .catch((err) => {
              console.log("Error save:", err);
              this.notification.create(
                "error",
                "操作失败",
                err.message ? err.message : "操作失败"
              );
            });
          this.dataSource.refresh()
          return
        }
        console.log(111)
        this.dataSource.destroy(object)
      },
      nzCancelText: "取消",
      nzOnCancel: () => console.log("Cancel"),
    });
  }

  deleteModalCanceled(ev) {
    this.isVisibleDeleteModal = false;
  }

  searchColNameChange(ev) {
    this.searchType = this.fields[ev].type;
    this.searchField = this.fields[ev];
    this.searchOption = null;
    this.searchInputText = null
    this.dataSource.searchText = null;
    this.dataSource.refresh();
  }

  // pointer 指针的搜索
  searchOption: any;
  searchPointer(ev, fieldItem) {
    let className = this.searchField.targetClass;
    let searchString;
    if (ev) {
      searchString = String(ev);
    }
    let schema = this.cloud.schemas[className];

    let query = new Parse.Query(className);
    if (schema && schema.fieldsArray) {
      schema.fieldsArray.forEach((fitem) => {
        let targetClass = fitem.targetClass;
        if (targetClass) {
          query.include(fitem.key);
        }
      });
    }
    // 各类对象手动输入搜索条件
    if (searchString) {
      switch (className) {
        case "_User":
          if (searchString.startsWith("1")) {
            query.contains("mobile", searchString);
          } else {
            query.contains("nickname", searchString);
          }
          break;
        case "User":
          if (searchString.startsWith("1")) {
            query.contains("mobile", searchString);
          } else {
            query.contains("nickname", searchString);
          }
          break;
        case "Lesson":
          query.startsWith("title", searchString);
          break;
        case "Department":
          query.startsWith("name", searchString);
          break;
        case "SchoolNmae":
          query.startsWith("name", searchString);
          break;
        case "SchoolMajor":
          query.startsWith("name", searchString);
          break;
        case "Article":
          query.startsWith("title", searchString);
          break;
        case "Lesson":
          query.startsWith("title", searchString);
          break;
        case "LessonArticle":
          query.startsWith("title", searchString);
          break;
        default:
          query.contains("name", searchString);
          break;
      }
    }
    let did = localStorage.getItem("department");
    if (did) {
      if (schema.fields["departments"]) {
        query.equalTo("departments", {
          __type: "Pointer",
          className: "Department",
          objectId: did,
        });
      }
    } else {
      query.equalTo("company", this.company);
    }

    query.limit(10);
    query.find().then((res) => {
      this.searchOption = res;
      console.log(res);
    });
    // 检测限制条件
    return;
  }

  seacherChange(ev) {
    if (ev && ev.id) {
      this.dataSource.searchText = ev.id;
    } else {
      this.dataSource.searchText = undefined;
    }
    this.dataSource.refresh();
  }

  showEditModal(object?, parent?) {
    this.now = new Date();
    console.log(this.Schema.className)
    this.Class = Parse.Object.extend(this.Schema.className);
    /* 检测传递参数是否存在
     ** 若存在，设置编辑对象为已存在对象，进入编辑对象
     ** 若不存在，创建新对象，进入新建对象
     */
    if (object && object.id) {
      this.object = object.toJSON();
      this.current = object;
      this.hasCurrent = true;
      this.dataSource.selectedDateRange = {};
      console.log(this.fieldsKeys)
      this.fieldsKeys.forEach((key) => {
        if (this.current.get(key)) {
          // 矫正参数携带的对象为Pointer指针形式
          if (this.Schema.fields[key].type == "Pointer") {
            this.object[key] = this.current.get(key);
          }
          // 矫正参数携带的对象为Date类型，无需转换
          if (this.Schema.fields[key].type == "Date") {
            this.object[key] = new Date(this.current.get(key));
          }
          // 矫正参数为date-from-to的对象
          if (this.Schema.fields[key].view == "date-from-to") {
            let from = this.current.get(key).from || "";
            let to = this.current.get(key).to || "";
            this.dataSource.selectedDateRange[key] = [from, to];
          }
          // 矫正参数为period-from-to的对象
          if (this.Schema.fields[key].view == "period-from-to") {
            this.object[key].forEach((period) => {
              if (period.timeFrom) {
                period.timeFrom = new Date(period.timeFrom.iso);
              }
              if (period.timeTo) {
                period.timeTo = new Date(period.timeTo.iso);
              }
            });
          }
        }
      });
    } else {
      //初始化新增对象
      this.current = new this.Class();
      this.object = this.current.toJSON();
      console.log(this.object, this.current);
      this.hasCurrent = false;
    }
    this.fieldsKeys.filter((key) => {
      // 如果筛选指针对象存在则赋值
      if (this.dataSource.Pobject) {
        if (this.Schema.fields[key].targetClass == this.dataSource.PclassName) {
          this.object[key] = this.dataSource.Pobject;
        }
      }

      // 当有父级参数则设置parent
      if (parent) {
        if (key == "parent") {
          this.object[key] = parent;
        }
      }

      // 检查各列，若不存在值，则设置默认值
      if (
        (this.Schema.fields[key].default ||
          this.Schema.fields[key].default == 0) &&
        !this.object[key]
      ) {
        this.object[key] = this.Schema.fields[key].default;
      }

      // 处理JSON对象数值
      if (this.Schema.fields[key].view == "json") {
        // if (this.object[key]) {
        //   this.object[key] = JSON.stringify(this.object[key]);
        //   console.log("JSON.stringify");
        //   console.log(this.object[key]);
        // }
      }
    });

    this.isVisibleEditModal = true;
  }

  // 对象集合属性
  searchInputChange(ev) {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.searchText = ev;
    this.dataSource.refresh();
  }


  typeChange(ev) {
    this.dataSource.type = ev.value;
    this.dataSource.refresh();
  }

  currentBook: any; // 所属书籍/章节，ArticleBook
  book: any;
  chapter: any;
  page: any;
  classSelectComponent: any = "class-select";
  bookTypes: any = {
    book: "书籍",
    chapter: "章节",
    page: "小节",
  };

  //开发者功能代码start
  //   Schems编辑
  async goEditDevSchema() {
    let query = new Parse.Query("DevSchema");
    query.equalTo("schemaName", this.className);
    let schema = await query.first();
    if (schema && schema.id) {
      this.editObject.onSavedCallBack((data) => {
        let SchemaMap = {};
        if (data && data.id) {
          let json = data.toJSON();
          json.className = json.schemaName;
          SchemaMap[json.className] = json;
          this.cloud.schemasExtend(SchemaMap);
          this.Schema = this.cloud.schemas[json.className];
          //this.initListBySchema();
        }
      });
      this.editObject.setEditObject(schema, "schema");
    }
  }
  //  Route编辑
  async goEditDevRouter() {
    let query = new Parse.Query("DevRoute");
    query.equalTo("objectId", this.rid);
    query.include("module");
    query.include("parent");
    let router = await query.first();
    if (router && router.id) {
      this.editObject.setEditObject(router, "router");
    }
  }
  //开发者功能代码end

  search() {
    this.refreshList();
  }

  reset() {
    // 重置筛选信息
    this.book = undefined;
    this.chapter = undefined;
    this.page = undefined;
    this.currentBook = undefined;

    this.sortState = {};

    this.dataSource.sortState = {};
    // 重置输入框
    this.searchColName = this.displayedColumns[0];
    this.searchText = "";
    this.dataSource.type = undefined;
    this.searchOption = null;
    this.dataSource.searchText = undefined;
    this.dataSource.refresh();
  }



  // 操作菜单功能属性及方法
  operatorChange(operator, obj) {
    switch (operator) {
      case "detail":
        this.detail({
          PclassName: obj.className,
          PobjectId: obj.id,
        });
        break;
      case "edit":
        this.showEditModal(obj);
        break;
      case "delete":
        this.showDeleteModal(obj);
        break;
      case "newchild":
        this.showEditModal(undefined, obj);
        break;
    }
  }

  // 表头排序操作
  sortState: any = {};
  sortData(key, ev) {
    if (this.sortState[key] == "descend") {
      this.sortState[key] = "";
      this.dataSource.sortState = this.sortState;
      return;
    }
    if (this.sortState[key] == "ascend") {
      this.sortState[key] = "descend";
    }

    if (!this.sortState[key] || this.sortState[key] == "") {
      this.sortState[key] = "ascend";
    }
    this.dataSource.sortState = this.sortState;
    this.dataSource.refresh();
  }
  headerTitle: any = "";
  addTitle: any = ""; // 添加按钮的名称 名称来源:若路由该路由里面有addTitle 则是addTitle，若没有则是对应Schema的name

  // 滚动加载属性
  isNeedInfiniteScroll: boolean = true;
  limit: number = 15;
  currentRole: string = "";
  isLocalDevMode: boolean = false;

  isManagerOperatorEnabled(op) {
    let operators = this.managerOperators;
    if (!operators) return false;
    let isEnabled = operators.find((item) => item == op);
    if (isEnabled) {
      return true;
    } else {
      return false;
    }
  }

  refreshList(type?) {
    this.dataSource.refresh();
  }


  // 跳转到路由配置的详情页面
  detail(params) {
    let detailPage =
      this.detailPage.indexOf(";") > 0
        ? this.detailPage.split(";")[0]
        : this.detailPage;
    if (this.detailPage.indexOf(";") > 0) {
      let parr = this.detailPage.split(";")[1].split("=");
      params["rid"] = parr[1];
    }
    this.router.navigate([detailPage, params]);
  }



  printSurvey(obj) {
    let url = this.cloud.config.homeURL + "/app/survey/paper/" + obj.id;
    let name = obj.get("title");
    let feats =
      "height=768, width=1024, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no";
    window.open(url, name, feats);
  }
  batchImport() {
    this.nav.push("common-import");
  }

  async exportData() {
    this.groupHeaderHeight = 40;
    this.headerHeight = 40;
    this.floatingFiltersHeight = 40;
    this.pivotGroupHeaderHeight = 50;
    this.pivotHeaderHeight = 100;
    this.showExport = true;
    let tem = {};
    console.log(this.require, this.fields);
    this.require.forEach((data) => {
      tem[data.field] = "暂无";
    });
    let query = await this.dataSource.getClassQuery();
    query.limit(30000);
    let queryData = await query.find();

    let regNum = new RegExp("[0-9]");
    if (queryData.length) {
      let data = [];
      for (let i = 0; i < queryData.length; i++) {
        let item = queryData[i].toJSON();
        if (item.idCard) {
          item.idCard = "'" + item.idCard;
        }
        this.require.forEach((r) => {
          if (r.type == "Pointer") {
            if (item[r.field] && item[r.field].className) {
              if (item[r.field].name) {
                item[r.field] = item[r.field].name;
              } else if (item[r.field].title) {
                item[r.field] = item[r.field].title;
              } else if (item[r.field].mobile) {
                item[r.field] = item[r.field].mobile;
              } else if (item[r.field].username) {
                item[r.field] = item[r.field].username;
              } else if (item[r.field].nickname) {
                item[r.field] = item[r.field].nickname;
              } else {
                item[r.field] = "暂无";
              }
            }
          }
          if (r.type == "Date") {
            if (r.view == "datetime") {
              if (item[r.field]) {
                console.log(item[r.field]);
                item[r.field] = this.datePipe.transform(
                  item[r.field].iso,
                  "yyyy-MM-dd HH:mm:ss"
                );
              } else {
                item[r.field] = "暂无";
              }
            } else {
              if (item[r.field]) {
                item[r.field] = this.datePipe.transform(
                  item[r.field].iso,
                  "yyyy-MM-dd"
                );
              } else {
                item[r.field] = "暂无";
              }
            }
          }
          if (r.view == "edit-select") {
            if (item[r.field]) {
              r.options.forEach((v) => {
                if (v.value == item[r.field]) {
                  item[r.field] = v.label;
                }
              });
            } else {
              item[r.field] = "暂无";
            }
          }
          if (r.type == "Number") {
            if (r.view == "edit-bytes") {
              item[r.field] = this.nzBytes.transform(
                item[r.field],
                0,
                "B",
                "TB"
              );
            }
          }
          if (r.type == "Array") {
            if (r.view == "pointer-array") {
              item[r.field] =
                item[r.field] &&
                item[r.field].length &&
                item[r.field]
                  .map((v) => {
                    return v.name
                      ? v.name
                      : v.title
                        ? v.title
                        : v.mobile
                          ? v.mobile
                          : v.username
                            ? v.username
                            : v.nickname
                              ? v.nickname
                              : "";
                  })
                  .join("、");
            }
          }
          if (r.type == 'String') {
            if (!item[r.field]) item[r.field] = '';
            if (item[r.field].length > 11 && regNum.test(item[r.field])) item[r.field] = "'" + item[r.field];
          }
        });

        data.push(item);
      }
      this.rowData = data;
    } else {
      this.rowData = tem;
    }
  }

  returnData() {
    this.showExport = false;
    this.dataSource.loading = false;
  }
}

// ParseDataSource 类
export class ParseDataSource {
  constructor(
    private className: string,
    private schema: any,
    public appServ: AppService,
    private company: any,
  ) {

  }

  listOfAllData: [] = [];
  listOfDisplayData: ParseObject[] = [];
  listOfChildData = {};
  mapOfChildrenNode: any = {};
  mapOfChildrenExpanded: any = {};

  expand: boolean = false
  // 加载子集数据

  type: string; //同一Class的不同type
  sortState: any = {};

  // 筛选指针对象属性
  PclassName: string;
  PfiledsKey: string;
  PobjectId: string;
  Pobject: any;

  // 分页预设条件
  loading = false;
  total = 200;
  pageSize = 20;

  onQueryParamsChange(params: any) {
    this.refresh();
  }
  // 预设限定条件
  pageIndex: number = 1;
  equalTo: any = {};
  containedIn: any = {};
  notEqualTo: any = {};
  exists: any = [];

  _searchColNameChange = new BehaviorSubject("");
  get searchColName(): string {
    return this._searchColNameChange.value;
  }
  set searchColName(value: string) {
    this._searchColNameChange.next(value);
  }

  _searchTextChange = new BehaviorSubject("");

  get searchText(): string {
    return this._searchTextChange.value;
  }
  set searchText(value: string) {
    this._searchTextChange.next(value);
  }

  dataChange: BehaviorSubject<Parse.Object[]> = new BehaviorSubject<
    Parse.Object[]
  >([]);



  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): BehaviorSubject<Parse.Object[]> {
    return this.dataChange;
  }

  disconnect() { }

  // For Parse
  getClassData(): Observable<Parse.Object[]> {
    let promise: Promise<Parse.Object[]> = new Promise((resolve, reject) => {
      this.getClassQuery()
        .find()
        .then((data) => {
          resolve(data);
        })
        .catch(() => {
          reject(reject);
        });
    });
    return from(promise);
  }

  // 重新加载
  async refresh() {
    let query = this.getClassQuery();
    this.total = await query.count();
    if (this.pageSize > 0) {
      query.skip((this.pageIndex - 1) * this.pageSize);
      query.limit(this.pageSize);
    }
    let data = await query.find()
    if (data) {
      this.listOfAllData = data;
      this.loadDisplayData();
      this.loading = false;
    }
  }

  // 数据加载
  loadDisplayData() {
    this.listOfChildData = {};
    this.listOfDisplayData = this.listOfAllData;
  }

  // 加载子集数据
  async loadChildrenData(data) {
    let query: any = new Parse.Query(this.className);
    query.equalTo("parent", data.id);
    this.listOfChildData[data.id] = await query.find();
  }

  // 获取当前路由下面的数据
  getClassQuery() {
    this.loading = true;
    let query: any = new Parse.Query(this.className);
    let subQuery: any = new Parse.Query(this.className);
    if (this.schema.include && this.schema.include.length > 0) {
      this.schema.include.forEach((key) => {
        query.include(key);
        subQuery.include(key);
      });
    }
    // 添加了搜索条件
    if (this.searchText && this.searchText.trim() != "") {
      this.searchText = this.searchText.replace(/(^\s+)|(\s+$)/g, "");
      let key = this.searchColName;
      if (!key || key == "") {
        key = "title";
      }

      if (this.schema.fields[key].type == "Pointer" && this.schema.fields[key].classname) {

      }
      if (this.schema.fields[key].type == "Number") {
        query.contains(key, this.searchText);
        subQuery.contains(key, this.searchText);
      } else {
        query.contains(key, this.searchText);
        subQuery.contains(key, this.searchText);
      }
    }
    // 添加对象预设限定条件
    if (this.equalTo) {
      Object.keys(this.equalTo).forEach((key) => {
        if (this.equalTo[key] == "false") {
          query.notEqualTo(key, true);
          subQuery.notEqualTo(key, true);
        } else if (this.equalTo[key] == "true") {
          query.equalTo(key, true);
          subQuery.equalTo(key, true);
        } else if (this.equalTo[key] == "undefined") {
          query.equalTo(key, undefined);
          subQuery.equalTo(key, undefined);
        } else {
          query.equalTo(key, this.equalTo[key]);
          subQuery.equalTo(key, this.equalTo[key]);
        }
      });
    }
    if (this.containedIn) {
      Object.keys(this.containedIn).forEach((key) => {
        console.log(this.containedIn[key]);

        query.containedIn(key, [this.containedIn[key]]);
        subQuery.containedIn(key, [this.containedIn[key]]);
      });
    }
    if (this.exists) {
      this.exists.forEach(key => {
        query.exists(key);
        subQuery.exists(key);
      })
    }

    if (this.notEqualTo) {
      Object.keys(this.notEqualTo).forEach((key) => {
        if (this.notEqualTo[key] == "undefined") {
          query.notEqualTo(key, null);
          subQuery.notEqualTo(key, null);
        } else {
          query.notEqualTo(key, this.notEqualTo[key]);
          subQuery.notEqualTo(key, this.notEqualTo[key]);
        }
      });
    }
    query.include("parent");
    query.include("parent.parent");
    query.include("parent.parent.parent");
    subQuery.include("parent");
    subQuery.include("parent.parent");
    subQuery.include("parent.parent.parent");
    if (this.schema.fields) {
      Object.keys(this.schema.fields).forEach((key) => {
        if (key == "parent") {
          query.doesNotExist(key);
          subQuery.doesNotExist(key);
        }
        let targetClass = this.schema.fields[key].targetClass;
        if (targetClass) {
          query.include(key);
          subQuery.include(key);
        }
        // 所有拥有manager字段的对象，自动增加管理员权限识别
        if (key == "manager") {
          if (this.appServ.currentRole != "superadmin") {
            let current = Parse.User.current();
            query.equalTo("manager", current.toPointer());
            subQuery.equalTo("manager", current.toPointer());
          }
        }
      });
    }
    // 表头有变动时，根据表头属性排序
    let sortKeys = Object.keys(this.sortState);
    if (sortKeys.length > 0) {
      sortKeys.forEach((key) => {
        if (this.sortState[key] == "ascend") {
          query.addAscending(key);
          subQuery.addAscending(key);
        }
        if (this.sortState[key] == "descend") {
          query.addDescending(key);
          subQuery.addDescending(key);
        }
      });
    } else {
      //表头无变动时，读取默认排序
      if (this.schema.order) {
        Object.keys(this.schema.order).forEach((key) => {
          if (this.schema.order[key] == "ascend") {
            query.addAscending(key);
            subQuery.addAscending(key);
          }
          if (this.schema.order[key] == "descend") {
            query.addDescending(key);
            subQuery.addDescending(key);
          }
        });
      } else {
        if (this.schema.fields["order"]) query.addAscending("order");
        if (this.schema.fields["type"]) query.addAscending("type");
        if (this.schema.fields["isEnabled"]) query.addDescending("isEnabled");
        if (this.schema.fields["index"]) query.addDescending("index");
        query.addDescending("updatedAt");

        if (this.schema.fields["order"]) subQuery.addAscending("order");
        if (this.schema.fields["type"]) subQuery.addAscending("type");
        if (this.schema.fields["isEnabled"])
          subQuery.addDescending("isEnabled");
        if (this.schema.fields["index"]) subQuery.addDescending("index");
        subQuery.addDescending("updatedAt");
      }
    }
    // 添加对象不同类型条件
    if (this.type) {
      query.equalTo("type", this.type);
      subQuery.equalTo("type", this.type);
    }
    // 当筛选条件有所属对象指针时
    if (this.PclassName) {
      query.equalTo(this.PfiledsKey, {
        __type: "Pointer",
        className: this.PclassName,
        objectId: this.PobjectId,
      });
      subQuery.equalTo(this.PfiledsKey, {
        __type: "Pointer",
        className: this.PclassName,
        objectId: this.PobjectId,
      });
    }

    // 当存在子公司权限，则在查询Company自有数据，同时查询subCompany共有数据
    let departmentId = localStorage.getItem("department");
    if (departmentId) {
      if (this.schema.fields["departments"]) {

        query.equalTo("departments",
          {
            __type: "Pointer",
            className: "Department",
            objectId: departmentId,
          }
        );
        subQuery.equalTo("departments", {
          __type: "Pointer",
          className: "Department",
          objectId: departmentId,
        });
      } else if (
        this.className != "Company" &&
        this.className != "Site" &&
        this.className != "DevSchema" &&
        this.className != "DevModule" &&
        this.className != "DevRoute" &&
        this.className != "CompanyModule" &&
        !this.PclassName
      ) {
        let company = this.appServ.company;
        // 非用户的对象仅关联一个公司 company字段等于指针
        query.equalTo("company", {
          __type: "Pointer",
          className: "Company",
          objectId: company,
        });
      }
    } else if (
      this.className != "Company" &&
      this.className != "Site" &&
      this.className != "DevSchema" &&
      this.className != "DevModule" &&
      this.className != "DevRoute" &&
      this.className != "CompanyModule" &&
      !this.PclassName
    ) {
      let company = this.company ? this.company : this.appServ.company;
      query.equalTo("company", {
        __type: "Pointer",
        className: "Company",
        objectId: company,
      });
    }
    return query;
  }


  // 数据删除
  async destroy(obj) {
    if (obj.className == '_User' || obj.className == 'User') {
      Parse.Cloud.run('user_destroy', {
        userid: obj.id
      }).then(() => {
        let list = this.dataChange.value;
        list.forEach((el, i, arr) => {
          if (el.id == obj.id) {
            arr.splice(i, 1);
          }
        });
        this.refresh();
      })
    } else {
      obj.destroy().then(() => {
        let list = this.dataChange.value;
        list.forEach((el, i, arr) => {
          if (el.id == obj.id) {
            arr.splice(i, 1);
          }
        });
        this.refresh();
      });
    }
  }
}
