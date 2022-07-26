import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-import-question-bank",
  templateUrl: "./import-question-bank.component.html",
  styleUrls: ["./import-question-bank.component.scss"],
})
export class ImportQuestionBankComponent implements OnInit {
  constructor(private activRoute: ActivatedRoute) {}
  tempSurveyId: string;
  ngOnInit() {
    this.activRoute.paramMap.subscribe((params) => {
      this.tempSurveyId = params.get("surveyId");
      if (params.get("type") && params.get("type") == "edit") {
        this.currentTab = 1;
      }
    });
  }
  /* tabs */
  tabs: Array<string> = ["批量导入", "手动录入"];
  currentTab: number = 0;
  onTabChange(e) {
    console.log(e);
    // this.currentTab = e.index;
  }

  /*
  词汇词法题必须存正确选项label到answer
  选择题组件 选项渲染依赖此字段
  */
}
