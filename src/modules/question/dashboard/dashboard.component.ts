import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as Parse from "parse";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  id: any;
  questionArr: Array<any> = [];
  surveyLogArr: Array<any> = [];
  total: number = 0;
  todayArr: Array<any> = [];
  lenArr: Array<any> = [];
  constructor(public activatedRoute: ActivatedRoute, public router: Router) {}

  async ngOnInit() {
    //  请求Qustion
    // let Question = Parse.Object.extend("Question");
    // let queryQ = new Parse.Query(Question);
    // let result = await queryQ.find();
    // console.log(result);
    await this.queryQuestion();
    await this.queryQuestionItem(this.id);
    await this.querySurveyLogTest();
    await this.querySurveyLogTestCount();
    //  查SurveyLogTest
    // let SurveyLogTest = Parse.Object.extend("SurveyLogTest");
  }

  // 查询Question
  async queryQuestion() {
    let Question = Parse.Object.extend("Question");
    let queryQ = new Parse.Query(Question);
    let result = await queryQ.find();

    this.questionArr = result;
    console.log(this.questionArr);
  }
  // 查询题目
  async queryQuestionItem(id) {
    let QuestionItem = Parse.Object.extend("QuestionItem");
    let queryQI = new Parse.Query(QuestionItem);
    queryQI.equalTo("qsurvey", id);
    let result = await queryQI.find();
    console.log(result);
  }

  // 查询SurveyLogTest
  async querySurveyLogTest() {
    let SurveyLogTest = Parse.Object.extend("SurveyLogTest");
    let queryS = new Parse.Query(SurveyLogTest);
    queryS.limit(20000)
    let result = await queryS.find();
    this.surveyLogArr = result;
    this.total = result.length;
    let today = new Date();
    let toY = today.getFullYear();
    let toM = today.getMonth() + 1;
    let toD = today.getDate() + 1;
    let toYDM = toY + "-" + toM + "-" + toD;
    let arr: any = [];
    result.forEach(async item => {
      let updateTime = item.updatedAt;
      let upY = updateTime.getFullYear();
      let upM = updateTime.getMonth() + 1;
      let upD = updateTime.getDate() + 1;
      let upYMD = upY + "-" + upM + "-" + upD;
      if (toYDM == upYMD) {
        arr.push(item);
      }
    });
    this.todayArr = arr;
    arr = null;
    console.log(result[2].updatedAt);
    console.log(
      result,
      this.surveyLogArr.length,
      this.todayArr,
      this.todayArr.length
    );
    console.log(new Date());
  }
  // 刷新
  refreshAllData() {
    window.location.reload();
  }
  // 跳转到题目详情
  toQuestionItem(id) {
    this.router.navigate([
      `common/manage/QuestionItem`,
      {
        PclassName: "Question",
        PobjectId: id
      }
    ]);
  }
  // 跳转到问卷详情;
  toSurveyLog(id) {
    this.router.navigate(["question/detail"], {
      queryParams: {
        objectid: id
      }
    });
  }
  // 查询每个的问卷的提交量
  async querySurveyLogTestCount() {
    let len: number = 0;
    for (let i = 0; i < this.questionArr.length; i++) {
      let SurveyLogTest = Parse.Object.extend("SurveyLogTest");
      let queryS = new Parse.Query(SurveyLogTest);
      console.log(this.questionArr[i].id);
      queryS.equalTo("survey", this.questionArr[i].id);
      queryS.limit(20000)
      let result = await queryS.find();
      len = result.length;
      this.lenArr.push(len);
    }

    console.log(this.lenArr);
  }
}
