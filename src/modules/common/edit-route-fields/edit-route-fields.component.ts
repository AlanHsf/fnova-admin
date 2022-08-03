import { Component, OnInit } from "@angular/core";
import { Input, Output, EventEmitter } from "@angular/core";
import * as Parse from "parse";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { label } from "jscharting";

@Component({
  selector: "edit-route-fields",
  templateUrl: "./edit-route-fields.component.html",
  styleUrls: ["./edit-route-fields.component.scss"],
})

export class EditRouteFieldsComponent implements OnInit {
  @Input() fieldsArray: Array<any>;
  @Input("editTabs") editTabs: any;
  @Input("object") _object: any;
  @Output() fieldsArrayChange = new EventEmitter<any>(true);
  @Input("displayedColumns") displayedColumns: Array<string>;
  @Output() displayedColumnsChange = new EventEmitter<any>(true);

  routerFields: any[];
  field: string;
  constructor() {}
  listOfOption: Array<{ label: string; value: string }> = [];
  //router: any;
  isShow: boolean = false;
  schemaName: any;
  _fieldsArray: any;
  router:string = ''
  // filedsArray: any;
  // 拿到
  typeView:any = {
    "String": [
      {
        value: "default",
        label: "默认文本输入"
      },
      {
        value: "textarea",
        label: "文本域输入"
      },
      {
        value: "edit-select",
        label: "单选框"
      },
      {
        value: "edit-filemanage",
        label: "文件管理器"
      },
      {
        value: "edit-tinymce",
        label: "富文本编辑器"
      },
      {
        value: "edit-iconfont",
        label: "富文本编辑器"
      }
    ],
    "Number": [
      {
        value: "default",
        label: "默认数字输入"
      },
      {
        value: "edit-select",
        label: "单选框"
      },
      {
        value: "edit-bytes",
        label: "字节输入框"
      }
    ],
    "Boolean": [
      {
        value: "default",
        label: "默认开关"
      },
      {
        value: "edit-select",
        label: "单选框"
      },
    ],
    "Array": [
      {value: "pointer-array",  label:"数组指针"},
      {value: "edit-attachment",  label:"文件管理器"},
      {value: "edit-modules-route", label:"模块路由编辑"},
      {value: "edit-route-fields", label:"路由字段编辑器"},
      {value: "edit-upgrade-rule", label:"升级规则编辑器"},
      {value: "edit-extracting-question",label:" 试卷抽屉规则"},
      {value: "edit-goods-service", label:"to商品服务"},
      {value: "edit-staff-ratio", label:"员工分红规则"},
      {value: " edit-vip-price",label:" 会员价格设置"},
      {value: "json", label:"json 编辑器 "}
    ],
    "Object": [
      {value: "edit-spec",  label:"规格属性编辑器"},
      {value: "date-from-to",  label:"日期范围选择"},
      {value: "json-object", label:"JSON对象编辑器"},
      {value: "edit-know-desc", label:" 题型详情编辑器"},
      {value: "period-from-to", label:"开展时间段编辑器"},
      {value: "edit-income-options",label:" 分销规则编辑器"},
      {value: "edit-income-ratio", label:"分销规则比例编辑"},
      {value: "json", label:"json 编辑器 "}
    ],
    "Date": [
      {value: "default",  label:"时间选择器"},
      {value: "datetime",  label:"时间选择器"}
    ]
  }



  async ngOnInit() {
    this.router = this._object.pageUrl;
    await this.getPageUrl()
  }

  async getPageUrl() {

    if (this.router && ("temp" + this.router).indexOf("common/manage/")) {
      this.isShow = true;
    }

    if (this.router) {
      this.schemaName = this.router.split("manage/")[1];
    }

    let Schema = new Parse.Query("DevSchema");
    if (this.schemaName) {
      Schema.equalTo("schemaName", this.schemaName);
      let schema = await Schema.first();
      this._fieldsArray = schema.get("fieldsArray");
      if (this._object.editFields && this._object.editFields.length > 0) {
        this.fieldsArray = this._object.editFields;
        this.fieldsArray.forEach((item, i) => {
          this._fieldsArray.forEach((other) => {
            if (item.key == other.key) {
              this.otherFileds[i] = other;
            }
          });
        });
      } else {
        this.fieldsArray = [
          {
            key: null,
            name: null,
            type: null,
            editTab: null,
            view: null,
          },
        ];
      }
    }
  }




  otherFileds: any = [];

  ngModelChange(ev, i) {
    this.fieldsArray[i] = Object.assign({}, ev);
    this.otherFileds[i] = Object.assign({}, ev);
    this.fieldsArrayChange.emit(this.fieldsArray);
  }
  // 添加选项
  addOption(fieldsArray) {
    fieldsArray.push({ value: "", label: "" });
  }

  deleteOption(fieldsArray, i) {
    if (fieldsArray.length > 0) {
      fieldsArray.splice(i, 1);
    }
  }
  dropFieldList(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fieldsArray, event.previousIndex, event.currentIndex);
    moveItemInArray(this.otherFileds, event.previousIndex, event.currentIndex);
  }

  selectViewOptipn(type) {
    return this.typeView[type] ? this.typeView[type] : []
  }

}
