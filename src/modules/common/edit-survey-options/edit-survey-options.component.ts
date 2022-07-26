import { Input, Output, EventEmitter } from "@angular/core";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "edit-survey-options",
  templateUrl: "./edit-survey-options.component.html",
  styleUrls: ["./edit-survey-options.component.scss"]
})
export class EditSurveyOptionsComponent implements OnInit {
  @Output() optionsChange = new EventEmitter<any>(true);
  @Input("id") id: string = "objid";
  @Input("options") _options: any = {};

  get options() {
    if (this._options && this._options[this.id]) {
      return this._options[this.id];
    } else {
      return [];
    }
  }
  set options(v) {
    console.log("set:", v);
    if (!this._options) this._options = {};
    this._options[this.id] = v;
    this.optionsChange.emit(v);
  }

  constructor() {}

  ngOnInit() {
    console.log("init:", this.options);
    if (!this.options || (this.options && this.options.length == 0)) {
      this.options = [
        { check: true, value: "请填写内容", grade: 0 },
        { check: false, value: "请填写内容", grade: 0 }
      ];
    }
  }

  // Start of edit-survey-options
  setCheck(i, value: Boolean) {
    // if (this.options[i].check == false || ) {
    //   this.options[i].check = value;
    // } else {
    //   this.options[i].check = true;
    // }
    this.options[i].check = !this.options[i].check;
    console.log(this.options)
  }
  deleteOption(i) {
    if (this.options.length > 1) {
      this.options.splice(i, 1);
    }
  }
  addOption() {
    if (this.options.length <= 7) {
      this.options.push({ check: false, value: "请填写内容", grade: 0 });
    }
  }
  getItemNum(i) {
    let NumMap = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
    return NumMap[i];
  }
  // End of edit-survey-options
}
