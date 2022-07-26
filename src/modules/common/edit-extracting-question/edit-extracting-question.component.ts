import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import * as Parse from 'parse'
import { NzNotificationService } from "ng-zorro-antd/notification";
@Component({
  selector: 'edit-extracting-question',
  templateUrl: './edit-extracting-question.component.html',
  styleUrls: ['./edit-extracting-question.component.scss']
})
export class EditExtractingQuestionComponent implements OnInit {
  @Input("options") _options: any;
  @Input("surveyId") surveyId: string;
  @Input("survey") survey: any;
  @Output('filesChange') onFilesChange = new EventEmitter<any>();
  // @Output("options") options = new EventEmitter<any>();
  set options(v: any) {
    this.onFilesChange.emit(v)
  }
  company: any;
  constructor(
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    console.log(this.surveyId)
    console.log(this._options)
    this.company = localStorage.getItem("company")
    if (this.survey['options'] && this.survey['options'].length == 0) {
      this.survey['options'] = [
        {
          knowledge: "",
          count: "",
          complexity: {
            easy: "",
            normal: "",
            hard: ""
          }
        }
      ]
    }
    console.log(this.survey['options'])
    this.getKnowledges()
  }
  ngModelChange(ev, i) {
    this.onFilesChange.emit(this.survey)
  }
  show: boolean;
  knows: any;
  getKnowledges() {
    let data = this.survey;
    console.log(data);

    if (data && data.objectId) {
      this.show = true;
    } else {
      this.show = false;
    }
    if (this.show) {
      let knowledge = new Parse.Query("Knowledge")
      knowledge.equalTo("company", this.company)
      knowledge.equalTo("parent", undefined)
      knowledge.find().then(knows => {
        console.log(knows);
        if (knows && knows.length) {
          this.knows = knows
        } else {
          this.knows = []
        }
      })
    }
    // this.categories = data;
    // this.cdRef.detectChanges();
  }
  addOption() {
    // if (!this.survey.outline) {
    //   this.notification.create(
    //     "warning",
    //     "未选择考试大纲",
    //     "需要选择考试大纲来配置抽题规则"
    //   );
    //   return
    // }
    if (!this.survey.options) {
      this.survey.options = [{
        knowledge: "",
        count: "",
        complexity: {
          easy: "",
          normal: "",
          hard: ""
        }
      }]
    } else {
      this.survey['options'].push({
        knowledge: "",
        count: "",
        complexity: {
          easy: "",
          normal: "",
          hard: ""
        }
      })
    }
    console.log(this.survey['options']);
    this.getKnowledges()

  }
  deleteOption(item, i) {
    this.survey['options'].splice(i, 1)

  }

}
