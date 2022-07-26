import { Component, OnInit } from "@angular/core";
import * as Parse from "parse";

import { Router } from "@angular/router";

@Component({
  selector: "app-question-result",
  templateUrl: "./question-result.component.html",
  styleUrls: ["./question-result.component.scss"],
})
export class QuestionResultComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.querySurvey();
  }
  company: String;
  surveys: Array<any>;

  // 查找问卷
  async querySurvey() {
    this.company = localStorage.getItem("company");
    let Suervey = new Parse.Query("Question");
    Suervey.equalTo("company", this.company);
    let survey: Array<any> = await Suervey.find();
    for (let i = 0; i < survey.length; i++) {
      let submitCount = await this.getSubmitCount(survey[i].id);
      survey[i].submitCount = submitCount;
    }
    this.surveys = survey;
  }

  /* 获取问卷提交数量 */
  getSubmitCount(sId) {
    return new Promise((resolve, reject) => {
      let query = new Parse.Query("SurveyLogTest");
      query.equalTo("survey", sId);
      query.equalTo("company", this.company);
      query.count().then((res) => {
        resolve(res);
      });
    });
  }

  /* 跳转答题详情 */
  toDetail(sId) {
    this.router.navigate(["/question/result-detail"], {
      queryParams: {
        sId,
      },
    });
  }
}
