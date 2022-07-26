import * as Parse from "parse";

import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core"
import { Cloud } from "../../../providers/cloud"
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: "edit-schema-fields",
  templateUrl: "./edit-schema-fields.component.html",
  styleUrls: ["./edit-schema-fields.component.scss"]
})
export class EditSchemaFieldsComponent implements OnInit {
  @Input("fieldsArray") fieldsArray: Array<Field>;
  @Input("editTabs") editTabs: any;
  @Output() fieldsArrayChange = new EventEmitter<any>(true);
  @Input("displayedColumns") displayedColumns: Array<string>;
  @Output() displayedColumnsChange = new EventEmitter<any>(true);

  schemas: Array<any>;
  constructor(private cdRef: ChangeDetectorRef, public cloud: Cloud) {}
  colMarks = {
    // 6:'四分之一',
    12: "半格",
    // 18:'四分之三',
    24: "全格"
  };
  hasTargetClass(field) {
    let has: boolean = false;
    if (field.type == "Pointer" || field.type == "Relation") {
      has = true;
    }
    if (field.view == "pointer-array") {
      has = true;
    }
    return has;
  }
  getJson(field, key) {
    let json = field[key];
    if (json) {
      return JSON.stringify(json);
    } else {
      return "";
    }
  }
  setJson(field, key, str) {
    console.log(field[key], str);
    try {
      let json = JSON.parse(str);
      field[key] = json;
    } catch {
      field[key] = undefined;
    }
    console.log(field[key]);
  }
  cdRefresh() {
    this.cdRef.detectChanges();
  }
  dropFieldList(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fieldsArray, event.previousIndex, event.currentIndex);
  }
  setRequired(options, i, value: Boolean) {
    options[i].required = value;
  }
  deleteOption(options, i) {
    if (options.length > 1) {
      options.splice(i, 1);
    }
  }
  addOption(options) {
    if (!options) {
      options = [{ check: false, value: null }];
      this.cdRefresh();
    } else if (1 < options.length || options.length <= 27) {
      options.push({ check: false, value: null });
      this.cdRefresh();
    }
  }
  addSelectOpitem(field) {
    console.log(field);
    if (!field.options || field.options.length == 0) {
      field.options = [];
    }
    field.options.push({ label: "", value: "" });
    this.cdRefresh();
  }
  deleteSelectOpitem(field, opitem) {
    let index = field.options.indexOf(opitem);
    if (index > -1) {
      field.options.splice(index, 1);
    }
    this.cdRefresh();
  }
  ngOnInit() {
    this.cloud.getSchemas().then(data => {
      this.schemas = Object.values(data);
    });
    if (!this.fieldsArray) {
      this.fieldsArray = [
        {
          key: null,
          name: null,
          type: null,
          editTab: null,
          view: null
        }
      ];
    }
  }

    
    viewChange(e, field) {
        this
        if(e == 'json-object' && field.type == 'Object'){
            field.jsonArr = [{
                key: "",
                label: "",
                value: ""
            }]
        } else {
            field.jsonArr = null
        }
    }
    addJSONArr(field) {
        if(field && field['jsonArr']) {
            field.jsonArr.push({
                key: "",
                label: "",
                value: ""
            })
        } else {
            field['jsonArr'] = [
                {
                    key: "",
                    label: "",
                    value: ""
                }
            ]
        }
        
    }
    delJSONArr(index, field){
        if (field.jsonArr.length > 1) {
            field.jsonArr.splice(index, 1);
        }
    }
}
