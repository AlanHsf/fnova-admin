import { Component, OnInit } from "@angular/core";
import { Input, Output, EventEmitter } from "@angular/core";
import * as Parse from "parse";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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
  router: any;
  isShow: boolean = false;
  schemaName: any;
  _fieldsArray: any;

  // filedsArray: any;
  // 拿到
  async ngOnInit() {
    this.router = this._object.pageUrl;
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
    // const children: Array<{ label: string; value: string }> = [];
    // for (let i = 10; i < 36; i++) {
    //   children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    // }
    // this.listOfOption = children;
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
}
