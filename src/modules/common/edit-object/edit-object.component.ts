import * as Parse from "parse";

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";


import { NzNotificationService } from "ng-zorro-antd/notification";


import { AppService } from "../../../app/app.service";
import { Cloud } from "../../../providers/cloud";

// Amap
import { AmapPlaceSearchService, AmapPlaceSearchWrapper } from "ngx-amap";

// 文件管理器，函数调用
import { NovaFileManagerComponent } from "../../../../projects/nova-office/src/modules/cloud/manager/manager.component";



@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-edit-object",
  templateUrl: "./edit-object.component.html",
  styleUrls: ["./edit-object.component.scss"],
})
export class EditObjectComponent implements OnInit {
  @ViewChild(NovaFileManagerComponent, { static: false })
  editFilemanager: NovaFileManagerComponent;
  @ViewChild(EditObjectComponent, { static: false })
  editObject: EditObjectComponent;
  /** 数据组件 <Data> EditObject
     @params object <ParseObject> 必填 绑定被编辑的对象
     @params isEditing <Boolean> 必填 是否启用编辑器
     @params schemaName <String> 必填 对象的结构范式
     @params defaultOptions <Object> 选填 对象预设属性条件
     @params isSelfChild <Boolean> 选填 是否在本组件引用本组件
     @event object <ParseObject> 必填 双向绑定被编辑的对象
     @event onSaved <ParseObject> 保存成功后触发
     **/
  @Input("isEditing") _isEditing: Boolean = false;
  eoType: any;
  get isEditing() {
    return this._isEditing;
  }
  set isEditing(v: any) {
    this._isEditing = v;
    this.onIsEditingChange.emit(v);
  }
  @Output("onSaved") onSaved = new EventEmitter<any>();
  @Output("isEditingChange") onIsEditingChange = new EventEmitter<any>();
  @Input("object") _object: any = {};
  @Output("objectChange") onObjectChange = new EventEmitter<any>();
  get object() {
    return this._object;
  }
  set object(v: any) {
    this._object = v;
    this.onObjectChange.emit(v);
  }
  @Input("current") _current: any;
  @Output("currentChange") oncurrentChange = new EventEmitter<any>();
  get current() {
    return this._current;
  }
  set current(v: any) {
    this._current = v;
    this.oncurrentChange.emit(v);
  }
  @Input("schemaName") schemaName: string;
  @Input("isSelfChild") isSelfChild: boolean = false;
  @Input("defaultOptions") defaultOptions: any = {};
  // Schema相关处理后变量
  Schema: any;
  className: string;
  typeName: string;
  Class: any;
  ceshi: any = "12212";
  // edit-bytes编辑组件缓存
  bytesValueMap = {};
  bytesUnitMap = {};
  bytesOnChange(key, type, ev) {
    let value = this.bytesValueMap[key] || 1;
    let unit = this.bytesUnitMap[key] || 1024 * 1024 * 1024 * 1024;
    this.object[key] = value * unit;
  }
  // 编辑组件缓存
  selectedDateRange: any = {};
  constructor(
    private amapPlaceSearch: AmapPlaceSearchService,
    private notification: NzNotificationService,
    public appServ: AppService,
    private cloud: Cloud,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) { }
  cid: any = "";
  otherFields: any; // 获取路由的editFields
  editTabs: any = ['基本信息'];
  // 抽题规则
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async (parms) => {
      console.log(parms);
      if (parms && parms.get("rid")) {
        let rid = parms.get("rid");
        let DevRoute = new Parse.Query("DevRoute");
        let route = await DevRoute.get(rid);
        if (route && route.id) {
          this.otherFields = route.get("editFields");
          if (route.get("editTabs") && route.get("editTabs").length > 0) {
            this.editTabs = route.get("editTabs");
            this.currentEditTab = this.editTabs[0];
          }
          this.otherFields.forEach((fieldItem) => {
            if (
              fieldItem.default &&
              (!this.object[fieldItem.key] ||
                this.object[fieldItem.key] == "")
            ) {
              this.object[fieldItem.key] = fieldItem.default;
            }
          });
          this.initSchemaAndFields();
        }
      }
    });
    this.cid = localStorage.getItem("company");
  }
  callbackAfterSave: any;
  setEditObject(parseObject, type?, isNew?) {
    this.eoType = type;
    this.otherFields = null;
    this.current = parseObject;
    this.schemaName = parseObject.className;
    let ojson = parseObject.toJSON();
    Object.keys(ojson).forEach((key) => {
      if (ojson[key].__type && ojson[key].__type == "Date") {
        ojson[key] = new Date(ojson[key].iso);
      }
    });
    this.object = ojson;
    this.Schema = ojson
    this.initSchemaAndFields(isNew);
    this.isEditing = true;
    console.log(this.otherFields, this.newFields)
  }

  currentEditTab: any;
  onEditTabChange(ev) {
    console.log(ev);
    this.currentEditTab = ev.tab.nzTitle;
  }
  checkEditTab(item) {
    if (
      (this.Schema.editTabs && this.Schema.editTabs.length > 0) ||
      (this.editTabs && this.editTabs.length > 0)
    ) {
      if (item.editTab && item.editTab == this.currentEditTab) {
        return true;
      }
      if (!item.editTab && "其他" == this.currentEditTab) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }
  // schema 和字段 初始化
  newFields: any;
  initSchemaAndFields(isNew?) {
    this.bytesValueMap = {};
    this.bytesUnitMap = {};
    let className = this.schemaName;
    if (this.defaultOptions.selectedDateRange) {
      this.selectedDateRange = this.defaultOptions.selectedDateRange;
    }
    if (className) {
      this.className = className;
      // 创建一个对象
      this.Class = Parse.Object.extend(this.className);
      this.Schema = this.cloud.schemas[this.className];

    }
    if (this.Schema) {

      if (this.eoType == "schema") {
        this.editTabs = ["基本信息", "字段信息"];
      } else if (this.eoType == "router") {
        this.editTabs = ["路由信息"];
      }
      if (!this.otherFields || this.className == "DevSchema") {
				this.otherFields = this.Schema.fieldsArray;
			}

      if (isNew) {
        this.newFields = this.Schema.fieldsArray;
        this.editTabs = this.Schema.editTabs;
      }
      this.Schema.fieldsArray.forEach((fieldItem) => {
        let newfield = Object.assign({}, fieldItem);
        if (fieldItem.view == "edit-bytes") {
          let bytes = this.object[fieldItem.key] || 1024 * 1024 * 1024;
          if (bytes >= 1024 && bytes < 1024 * 1024) {
            this.bytesValueMap[fieldItem.key] = bytes / 1024;
            // this.bytesUnitMap[fieldItem.key] = "KB"
            this.bytesUnitMap[fieldItem.key] = 1024;
          }
          if (bytes >= 1024 * 1024 && bytes < 1024 * 1024 * 1024) {
            this.bytesValueMap[fieldItem.key] = bytes / (1024 * 1024);
            // this.bytesUnitMap[fieldItem.key] = "MB"
            this.bytesUnitMap[fieldItem.key] = 1024 * 1024;
          }
          if (
            bytes >= 1024 * 1024 * 1024 &&
            bytes < 1024 * 1024 * 1024 * 1024
          ) {
            this.bytesValueMap[fieldItem.key] = bytes / (1024 * 1024 * 1024);
            // this.bytesUnitMap[fieldItem.key] = "GB"
            this.bytesUnitMap[fieldItem.key] = 1024 * 1024 * 1024;
          }
          if (
            bytes >= 1024 * 1024 * 1024 * 1024 &&
            bytes < 1024 * 1024 * 1024 * 1024 * 1024
          ) {
            console.log(bytes);
            this.bytesValueMap[fieldItem.key] =
              bytes / (1024 * 1024 * 1024 * 1024);
            // this.bytesUnitMap[fieldItem.key] = "TB"
            this.bytesUnitMap[fieldItem.key] = 1024 * 1024 * 1024 * 1024;
          }
          if (
            bytes >= 1024 * 1024 * 1024 * 1024 * 1024 &&
            bytes < 1024 * 1024 * 1024 * 1024 * 1024 * 1024
          ) {
            this.bytesValueMap[fieldItem.key] =
              bytes / (1024 * 1024 * 1024 * 1024 * 1024);
            // this.bytesUnitMap[fieldItem.key] = "PB"
            this.bytesUnitMap[fieldItem.key] = 1024 * 1024 * 1024 * 1024 * 1024;
          }
          if (
            bytes >= 1024 * 1024 * 1024 * 1024 * 1024 * 1024 &&
            bytes < 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024
          ) {
            this.bytesValueMap[fieldItem.key] =
              bytes / (1024 * 1024 * 1024 * 1024 * 1024 * 1024);
            // this.bytesUnitMap[fieldItem.key] = "EB"
            this.bytesUnitMap[fieldItem.key] =
              1024 * 1024 * 1024 * 1024 * 1024 * 1024;
          }
        }
        if (
          fieldItem.default &&
          (!this.object[fieldItem.key] || this.object[fieldItem.key] == "")
        ) {
          this.object[fieldItem.key] = JSON.parse(
            JSON.stringify(newfield.default)
          );
        }
        if (
          fieldItem.type == "Object" &&
          fieldItem.view == "json-object" &&
          fieldItem.jsonArr &&
          fieldItem.jsonArr.length > 0
        ) {
          let jsonObj = {};
          fieldItem.jsonArr.forEach((json) => {
            jsonObj[json.key] = this.object[fieldItem.key]
              ? this.object[fieldItem.key][json.key]
              : "";
          });
          this.object[fieldItem.key] = jsonObj;
        }
      });
    }
    this.cdRef.detectChanges();
  }
  // 取消与保存按钮触发事件
  editModalCanceled() {
    this.isEditing = false;
    this.newFields = null;
    this.isNew = null;
  }
  editModalOK() {
    this.newFields = null;
    this.isNew = null;
    this.save();
  }

  checkShow(show) {
    if (show != false) {
      return true;
    } else {
      return false;
    }
  }
  checkView(view) {
    if (view) {
      return view;
    } else {
      return "default";
    }
  }
  dropTagsList(event: CdkDragDrop<string[]>, object, key) {
    moveItemInArray(this.object[key], event.previousIndex, event.currentIndex);
  }
  checkCondition(fieldItem) {
    let isShow = true;
    if (!fieldItem) {
      return true;
    }
    let condition = fieldItem.condition;
    if (!condition) {
      isShow = true;
    } else {
      Object.keys(condition).forEach((conKey) => {
        if (this.object[conKey] == condition[conKey]) {
          isShow = true;
        } else {
          isShow = false;
        }
      });
    }
    return isShow;
  }

  onSavedCallBack(savecb) {
    this.savecbfun = savecb;
  }
  onblur(e) {
    this.object[e] = JSON.parse(this.object[e]);
  }
  onfocus(e) {
    this.object[e] = JSON.stringify(this.object[e]);
  }

  savecbfun: Function;
  // 数据保存方法
  async save() {
    let verified = true;
    let isTrue = true;
    console.log(this.object)
    let fieldsArray = this.newFields ? this.newFields : this.otherFields
    fieldsArray.filter((fieldItem) => {
      let key = fieldItem.key;
      // 必填字段
      if (fieldItem.required && fieldItem.required == true) {
        if (this.object[key] === "" || this.object[key] == undefined) {
          verified = false;
        }
      }
      // 所有拥有manager字段的对象，自动增加当前用户为管理员之一
      if (key == "manager") {
        if (!this.object[key] || this.object[key].length == 0) {
          if (this.appServ.currentRole != "superadmin") {
            let current = Parse.User.current();
            this.object[key] = {
              __type: "Pointer",
              className: "_User",
              objectId: current.id,
            };
          }
        }
      }
      // 去除空格
      if (fieldItem.type == "String") {
        if (this.object[key]) {
          console.log(key)
          this.object[key] = this.object[key] ? String(this.object[key]).trim() : "";
        }
      }
      // 需要正则匹配
      if (fieldItem.match) {
        let reg = new RegExp(fieldItem.match, "g");
        if (this.object[key]) {
          let res = reg.test(this.object[key]);
          if (!res) {
            this.notification.create(
              "warning",
              fieldItem.name + "不符合规则",
              "请检查填写字段是否符合要求"
            );
            isTrue = false;
            return;
          }
        }
      }
      if (fieldItem.type == "Array" && !fieldItem.targetClass) {
        console.log(key, this.object[key]);
        if (
          !this.object[key] ||
          this.object[key].length == 0 ||
          this.object[key] == "[]"
        ) {
          this.object[key] = [];
        }
      }
      if (fieldItem.type == "Array" && fieldItem.targetClass) {
        if (
          localStorage.getItem("department") &&
          fieldItem.targetClass == "Department" &&
          key == "departments" &&
          !this.object[key]
        ) {
          this.object[key] = [
            {
              __type: "Pointer",
              className: "Department",
              objectId: localStorage.getItem("department"),
            },
          ];
        }
        if (this.object[key] && this.object[key].length > 0) {
          this.object[key] = this.object[key].map((item) => {
            if (item.__type && item.__type != "Pointer") {
              return {
                __type: "Pointer",
                className: item.className,
                objectId: item.objectId,
              };
            } else {
              return item;
            }
          });
          console.log(this.object[key])
        } else {
          this.object[key] = [];
        }
      }
      if (key == "matchDepart") {
        if (this.object[key] && this.object[key].length > 0) {
          this.object["matchCount"] = this.object[key].length;
        }
      }
      if (fieldItem.type == "Number") {
        if (isNaN(this.object[key])) {
          this.object[key] = 0;
        }
        this.object[key] = Number(this.object[key]);
      }
      if (fieldItem.type == "Date") {
        if (this.object[key]) {
          this.object[key] = new Date(this.object[key]);
        }
      }
      if (fieldItem.type == "Boolean") {
        if (this.object[key] == true) {
          this.object[key] = true;
        } else if (this.object[key] == "false") {
          this.object[key] = true;
        }
      }
      if (fieldItem.view == "json") {
        if (this.object[key]) {
          this.object[key] = JSON.parse(this.object[key]);
        }
      }
      // pointer 类型 并且选择了对应的指针
      if (this.object[key] && fieldItem.type == "Pointer") {
        let pid = this.object[key].id || this.object[key].objectId;
        if (!(this.object[key].id || this.object[key].objectId)) {
          pid = this.current.get(key).id;
        }
        this.object[key] = {
          __type: "Pointer",
          className: fieldItem.targetClass,
          objectId: pid,
        };
      }
      // 部门 学校
      if (localStorage.getItem("department")) {
        if (
          fieldItem.targetClass == "Department" &&
          fieldItem.type == "Pointer" &&
          !this.object[key]
        ) {
          this.object[key] = {
            __type: "Pointer",
            className: "Department",
            objectId: localStorage.getItem("department"),
          };
        }
      }
    });
    if (!isTrue) {
      return;
    }
    // 若存在公司，设置该对象所属公司字段指针值
    if (this.className != "Company") {
      let company = localStorage.getItem("company"); // localStoreage里面的company
      console.log(company)
      if (localStorage.getItem("department")) {
        let Department = new Parse.Query("Department");
        console.log('Department')
        await Department.get(localStorage.getItem("department")).then((res) => {
          // 该账套属于Department 并且这个对象拥有departments字段，则该对象的company字段就是存总公司的objectId
          // 也就是这个department 对象的company字段的id
          console.log(res)
          if (res) {
            console.log(this.object["departments"])
            if (this.object["departments"]) {
              let departs = this.object["departments"];
              let isHave = false;
              departs.forEach((dep) => {
                if (dep.objectId == res.id) {
                  isHave = true;
                }
              });
              if (!isHave) {
                departs.push({
                  __type: "Pointer",
                  className: "Department",
                  objectId: res.id,
                });
              }
              this.object["departments"] = departs;
              if (res.get("company")) {
                this.object["company"] = {
                  __type: "Pointer",
                  className: "Company",
                  objectId: res.get("company").id,
                };
              } else {
                // 如果department对象company 对象company的值不存在则存该账套的companyid
                this.object["company"] = {
                  __type: "Pointer",
                  className: "Company",
                  objectId: company,
                };
              }
            } else {
              this.object["company"] = {
                __type: "Pointer",
                className: "Company",
                objectId: company,
              };
            }
          } else {
            this.object["company"] = {
              __type: "Pointer",
              className: "Company",
              objectId: company,
            };
          }
        });
      } else {
        this.object["company"] = {
          __type: "Pointer",
          className: "Company",
          objectId: company
        };
      }
    }
    if (this.className == "Company") {
      let company = this.appServ.company; // localStoreage里面的company
      this.object["company"] = {
        __type: "Pointer",
        className: "Company",
        objectId: company,
      };
    }
    // 添加对象预设限定条件 路由上面的equalTo 会改变对应object[key] 的值
    if (this.defaultOptions.equalTo) {
      Object.keys(this.defaultOptions.equalTo).forEach((key) => {
        if (this.defaultOptions.equalTo[key] == "true") {
          this.object[key] = true;
        } else if (this.defaultOptions.equalTo[key] == "false") {
          this.object[key] = false;
        } else {
          console.log(this.defaultOptions, this.object);
          if (
            this.defaultOptions.schema.fields[key].type == "Pointer" &&
            this.defaultOptions.schema.fields[key].targetClass
          ) {
            this.object[key] = {
              __type: "Pointer",
              className: this.defaultOptions.schema.fields[key].targetClass,
              objectId: this.defaultOptions.equalTo[key],
            };
          } else {
            this.object[key] = this.defaultOptions.equalTo[key];
          }
        }
      });
    }

    // 若有列表筛选指针，则默认字段为该指针值
    if (this.defaultOptions.PclassName) {

      this.object[this.defaultOptions.PfiledsKey] = {
        __type: "Pointer",
        className: this.defaultOptions.PclassName,
        objectId: this.defaultOptions.PobjectId,
      };
    }
    // 当对象类为User去除密码字段
    if (this.className == "User" && this.object.objectId) {
      delete this.object.password;
    }

    // 清除异常字段
    delete this.object["undefined"];

    // 设置对象参数并保存对象
    console.log(this.object)
    this.current.set(this.object);
    if (this.className == "_Role") {
      let titleCode = "";
      let title = this.object["title"];
      for (let index = 0; index < title.length; index++) {
        titleCode += title.charCodeAt(index).toString(16);
      }
      let name = `${this.appServ.company}_${titleCode}`;
      if (this.object["name"] && this.object["name"] != "") {
        name = this.object["name"];
      }
      let roleACL = new Parse.ACL();
      let role = new Parse.Role("Administrator", roleACL);
      (role as any).set("name", name);
      role.set("title", title);
      role.set("modules", this.object["modules"]);
      (role as any).set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: this.object["company"],
      });
      this.current = role;
    }
    /* End Of _Role */
    console.log(verified);
    if (verified) {
      let options: any = {};
      if (this.current.className == "_User") {
        Parse.Cloud.run('user_save', {
          userJson: this.current.toJSON()
        }).then((data) => {
          this.current = data;
          this.isEditing = false;
          this.object = {};
          this.onSaved.emit(data);
          if (this.savecbfun) {
            this.savecbfun(data);
          }
          this.savecbfun = null;
        }).catch((err) => {
          console.log("Error save:", err);
          this.notification.create(
            "error",
            "保存出错",
            err.message ? err.message : "保存出错"
          );
        });
      } else {
        this.current
          .save(null, options)
          .then((data) => {
            data.fetch().then((data) => {
              // console.log("OK save:", data)
              this.current = data;
              this.isEditing = false;
              this.object = {};
              this.onSaved.emit(data);
              if (this.savecbfun) {
                this.savecbfun(data);
              }
              this.savecbfun = null;
            });
          })
          .catch((err) => {
            console.log("Error save:", err);
            this.notification.create(
              "error",
              "保存出错",
              err.message ? err.message : "保存出错"
            );
          });
      }

    } else {
      this.notification.create(
        "warning",
        "信息填写不完整",
        "请检查填写字段是否符合要求。"
      );
    }
  }

  // 地图Amap相关函数变量 https://xieziyu.github.io/ngx-amap/#/home
  isVisibleAmap = false;
  amapInput = "";
  poiData: any = {};
  private _subscription: Subscription;
  private plugin: Promise<AmapPlaceSearchWrapper>;

  onMapReady(map) {
    // 构造地点查询 wrapper promise:
    this.plugin = this.amapPlaceSearch.of({
      pageSize: 5,
      pageIndex: 1,
      map: map,
      panel: "panel", // 结果列表将在此容器中进行展示。
      autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    });

    this.plugin.then((placeSearch) => {
      this._subscription = placeSearch.on("complete").subscribe((event) => { });
      this._subscription.add(
        placeSearch.on("selectChanged").subscribe((event) => {
          this.poiData = event.selected.data;
        })
      );
    });
  }
  searchAmap() {
    this.plugin
      .then((placeSearch) => placeSearch.search(this.amapInput))
      .then(() => { });
  }
  showModalAmap(): void {
    if (this.object.location) {
      this.amapInput = this.object.address;
      this.plugin
        .then((placeSearch) => placeSearch.search(this.object.address))
        .then(() => { });
    } else {
      this.amapInput = "";
      this.poiData = {};
    }
    this.isVisibleAmap = true;
  }

  handleOkAmap(): void {
    if (this.poiData != {} && this.amapInput != "") {
      let point = new Parse.GeoPoint({
        latitude: this.poiData.location.lat,
        longitude: this.poiData.location.lng,
      });
      this.object.location = point;
      this.object.address = this.poiData.name;
    }
    this.isVisibleAmap = false;
    this.amapInput = "";
    this.poiData = {};
  }

  handleCancelAmap(): void {
    this.isVisibleAmap = false;
    this.amapInput = "";
    this.poiData = {};
  }


  setCheck(obj, options, i, value?: Boolean) {
    if (obj.type == "select-single") {
      options.forEach((opt) => (opt.check = false));
      options[i].check = value;
    } else if (obj.type == "select-multiple") {
      options[i].check = !options[i].check;
    } else {
      options.forEach((opt) => (opt.check = false));
      options[i].check = value;
    }
  }
  setRequired(options, i, value: Boolean) {
    options[i].required = value;
  }
  deleteOption(options, i) {
    if (options.length > 1) {
      options.splice(i, 1);
    }
  }
  addOption(obj, options, key?) {
    if (!options) {
      options = []
    }
    console.log(1111, options)
    if (options.length <= 27) {
      options.push({
        check: false,
        value: null,
        label: this.getItemNum(options.length),
      });
    }
    // fieldItem.key
    this.object[key] = options
    console.log(obj)
  }
  getItemNum(i) {
    let NumMap = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    return NumMap[i];
  }
  // End of edit-survey-options
  // @editModal when type == Pointer
  // selectedPointer:any = {} // 用于Pointer选项暂存，key为<objectId.key>
  selectPointerList: Array<any> = []; // 用于Pointer选项暂存，key为<objectId.key>
  selectPointerMap = {}; // 用于Pointer选项暂存，key为<objectId.key>
  async searchPointer(ev, fieldItem) {
    let className = fieldItem.targetClass;
    let key = fieldItem.key;
    let searchString;
    if (ev) {
      searchString = String(ev);
    }
    let schema = this.cloud.schemas[className];
    let query = new Parse.Query(className);
    let subQuery = new Parse.Query(className);
    if (schema && schema.fieldsArray) {
      schema.fieldsArray.forEach((fitem) => {
        let targetClass = fitem.targetClass;
        if (targetClass) {
          query.include(fitem.key);
          subQuery.include(fitem.key);
        }
      });
    }

    // 各类对象手动输入搜索条件
    if (searchString) {
      switch (className) {
        case "_User":
          if (searchString.startsWith("1")) {
            query.contains("mobile", searchString);
            subQuery.contains("username", searchString);
          } else {
            query.contains("nickname", searchString);
            subQuery.contains("username", searchString);
          }
          break;
        case "User":
          if (searchString.startsWith("1")) {
            query.contains("mobile", searchString);
            subQuery.contains("username", searchString);
          } else {
            query.contains("nickname", searchString);
            subQuery.contains("username", searchString);
          }
          break;
        case "Lesson":
          query.contains("title", searchString);
          subQuery.contains("title", searchString);
          break;
        case "Article":
          query.contains("title", searchString);
          subQuery.contains("title", searchString);
          break;
        case "ShopStore":
          query.contains("storeName", searchString);
          subQuery.contains("storeName", searchString);
          break;
        default:
          query.contains("name", searchString);
          subQuery.contains("name", searchString);
          break;
      }
    }
    // 预设限定查询对象类型
    if (fieldItem.targetType) {
      query.equalTo("type", fieldItem.targetType);
      subQuery.equalTo("type", fieldItem.targetType);
    }
    if (this.defaultOptions.type) {
      query.equalTo("type", this.defaultOptions.type);
      subQuery.equalTo("type", this.defaultOptions.type);
    }

    // let company = this.appServ.company;
    // 根据departments字段来判别删选 如果departments字段就是赛选departments的数据，没有就根据company来赛选
    if (
      localStorage.getItem("department") &&
      schema.fields.departments &&
      schema.fields.departments.targetClass == "Department" &&
      schema.fields.departments.type == "Array"
    ) {
      query.containedIn("departments", [
        {
          __type: "Pointer",
          className: "Department",
          objectId: localStorage.getItem("department"),
        },
      ]);
      subQuery.containedIn("departments", [
        {
          __type: "Pointer",
          className: "Department",
          objectId: localStorage.getItem("department"),
        },
      ]);
    } else if (
      className == "Department" &&
      localStorage.getItem("department")
    ) {
      // 选择部门
      let Department = new Parse.Query("Department");
      Department.get(localStorage.getItem("department")).then((res) => {
        if (res && res.id && res.get("company")) {
          query.equalTo("company", {
            __type: "Pointer",
            className: "Company",
            objectId: res.get("company").id,
          });
          subQuery.equalTo("company", {
            __type: "Pointer",
            className: "Company",
            objectId: res.get("company").id,
          });
        }
      });
    } else if (this.cid) {
      query.equalTo("company", {
        __type: "Pointer",
        className: "Company",
        objectId: this.cid,
      });
      subQuery.equalTo("company", {
        __type: "Pointer",
        className: "Company",
        objectId: this.cid,
      });
    }
    if (this.object[key] && this.object[key].length > 0) {
      query.notContainedIn(
        "objectId",
        this.object[key].map((item) => item.id || item.objectId)
      );
      subQuery.notContainedIn(
        "objectId",
        this.object[key].map((item) => item.id || item.objectId)
      );
    }

    if (fieldItem.filters) {
      fieldItem.filters.forEach((filter) => {
        switch (filter.fun) {
          case "equalTo":
            query.equalTo(filter.key, filter.value);
            subQuery.equalTo(filter.key, filter.value);
            break;
          case "notEqualTo":
            query.notEqualTo(filter.key, filter.value);
            subQuery.notEqualTo(filter.key, filter.value);
            break;
          case "pobject":
            if (this.object[filter.value]) {
              query.equalTo(filter.targetField, this.object[filter.value].id);
              subQuery.equalTo(
                filter.targetField,
                this.object[filter.value].id
              );
            }
            break;
          case "searchFiled":
            query.contains(filter.value, searchString);
            break;
        }
      });
    }
    let mainQuery = Parse.Query.or(query, subQuery);
    mainQuery.limit(20);
    let data = await mainQuery.find();
    if (data && data.length > 0) {
      this.selectPointerMap[key] = data;
      this.cdRef.detectChanges();
    } else {
      this.selectPointerMap[key] = [];
      this.cdRef.detectChanges();
    }
  }
  isNew: any; //是否新建
  async newTargetClassObject(fitem) {
    if (!fitem.targetClass) {
      return;
    }
    // 创建新指针对象
    let TargetObject = Parse.Object.extend(fitem.targetClass);
    let targetObj = new TargetObject();
    console.log(targetObj);
    if (targetObj) {
      this.editObject.onSavedCallBack((data) => {
        // callbacks
      });
      let isNew = true;
      this.editObject.setEditObject(targetObj, null, isNew);
      this.isNew = true;
    }
  }

  onDateRangePickerChange(ev, object, key) {
    object[key] = {};
    object[key].from = ev[0];
    object[key].to = ev[1];
  }

  weekdays = [
    { label: "周一", value: "1" },
    { label: "周二", value: "2" },
    { label: "周三", value: "3" },
    { label: "周四", value: "4" },
    { label: "周五", value: "5" },
    { label: "周六", value: "6" },
    { label: "周日", value: "7" },
  ];

  addAttachment(object, key) {
    if (!this.object[key]) {
      this.object[key] = [{ name: "", url: "" }];
    } else {
      this.object[key].push({ name: "", url: "" });
    }
  }
  deleteAttachment(object, key, attach) {
    this.object[key].forEach(function (item, index, arr) {
      if (item.url == attach.url) {
        arr.splice(index, 1);
      }
    });
  }
  addPeriod(object, key) {
    if (!object[key]) {
      object[key] = [];
    }
    object[key].push({
      day: null,
      timeFrom: null,
      timeTo: null,
      peopleMax: null,
      isEnabled: true,
    });
  }
  deletePeriod(object, key, period) {
    let index = object[key].findIndex(
      (item) => item.day == period.day && item.timeFrom == period.timeFrom
    );
    if (index >= 0) {
      object[key].splice(index, 1);
    }
  }

  toggleSwitch(ev, obj, key) {
    obj[key] = ev;
  }

  getEditInitOptions() {
    let that = this;
    return {
      plugins:
        "code link lists advlist preview fullscreen table image media  imagetools  ",
      toolbar:
        "fullscreen preview | undo redo | bold italic | bullist numlist outdent indent | table | image media | code",
      quickbars_image_toolbar:
        "alignleft aligncenter alignright | editimage imageoptions",
      imagetools_toolbar:
        "rotateleft rotateright | flipv fliph | editimage imageoptions",
      quickbars_selection_toolbar:
        "bold italic | formatselect | quicklink blockquote",
      language: "zh_CN",
      language_url: "/assets/js/tinymce/langs/zh_CN.js",
      menubar: true,
      statusbar: true,
      base_url: "/assets/js/tinymce/",
      file_picker_types: "file image media",
      file_picker_callback: (cb, value, meta) => {
        let options = {
          mime: "image",
          multi: false,
        };
        if (meta.filetype == "media") {
          options.mime = "video";
        }
        if (meta.filetype == "file") {
          options.mime = undefined;
        }

        that.editFilemanager.showFileManager(options, (file, files) => {
          let dialogEl2: any =
            document.getElementsByClassName("tox-tinymce-aux")[0];
          dialogEl2.style.zIndex = 1300;
          if (file && file.id) {
            if (meta.filetype == "file") {
              cb(file.get("url"), { text: file.get("name") });
            }
            if (meta.filetype == "image") {
              cb(file.get("url"), {
                title: file.get("name"),
                alt: file.get("name"),
              });
            }
            if (meta.filetype == "media") {
              cb(file.get("url"), {
                title: file.get("name"),
                alt: file.get("name"),
              });
            }
          }
        });
      },
    };
  }

  showFields() {
    if (this.otherFields) {
      return this.otherFields;
    } else {
      return this.Schema.fieldsArray;
    }
  }
}
