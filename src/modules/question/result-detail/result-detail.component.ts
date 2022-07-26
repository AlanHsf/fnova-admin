import { EChartOption } from "echarts";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as Parse from "parse";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-result-detail",
  templateUrl: "./result-detail.component.html",
  styleUrls: ["./result-detail.component.scss"],
  providers: [DatePipe],
})
export class ResultDetailComponent implements OnInit {
  sId: string;
  company: string;
  sItems: Array<any>;
  answers: Array<any>;
  qInfo: any;
  todayCount: any = 0;
  cuCharts: any = [];

  constructor(private aRoute: ActivatedRoute, private datePipe: DatePipe) {}

  ngOnInit() {
    this.company = localStorage.getItem("company");
    this.aRoute.queryParams.subscribe((params) => {
      this.sId = params.sId;
    });
    this.queryToDay();
    this.getQInfo(this.sId);
    this.getDetail(this.sId);
  }

  async getQInfo(sId) {
    let query = new Parse.Query("Question");
    query.equalTo("objectId", sId);
    query.equalTo("company", this.company);
    let qInfo = await query.first();
    this.qInfo = qInfo;
  }

  /* 获取问卷题目 */
  async getDetail(sId) {
    let query = new Parse.Query("QuestionItem");
    query.ascending("index");
    query.equalTo("qsurvey", sId);
    query.equalTo("company", this.company);
    let res: Array<any> = await query.find();
    res.forEach((item) => {
      item.checked = true;
      item.label = item.get("title");
    });
    this.sItems = res;
    this.getAnswer(sId);
  }

  /* 获取答题 */
  async getAnswer(sId) {
    let query = new Parse.Query("SurveyLogTest");
    query.include("user");
    query.equalTo("survey", sId);
    query.equalTo("company", this.company);
    query.limit(100000);
    let res = await query.find();
    let temp = [];
    res.forEach((item) => {
      temp.push(item.toJSON());
    });
    this.answers = temp;
    console.log(this.answers);
    console.log(this.sItems);
  }

  isDate(str) {
    if (!str) {
      return false;
    }
    if (str.toString().indexOf("+08:00") > 0) {
      return true;
    } else {
      return false;
    }
  }

  async queryToDay() {
    let date = new Date(new Date().toLocaleDateString());
    let SurveyTest = new Parse.Query("SurveyLogTest");
    SurveyTest.equalTo("survey", this.sId);
    SurveyTest.greaterThan("createdAt", date);
    this.todayCount = await SurveyTest.count();
  }

  // 展示答案
  showAnswer(answer) {
    if (!answer) {
      return "暂无";
    }
    if (
      answer.toString().indexOf("+08:00") > 0 &&
      answer.toString().indexOf("T")
    ) {
      return this.datePipe.transform(answer, "yyyy-MM-dd HH:mm:ss");
    } else if (typeof answer == "object") {
      return answer.value;
    } else if (answer === true) {
      return "是";
    } else if (answer === false) {
      return "否";
    } else {
      return answer;
    }
  }

  /* 生成条图表数据 */
  async loadBarChart() {
    let charts = {};
    let temp = this.sItems.filter((item) => {
      return item.checked;
    });
    for (let i = 0; i < temp.length; i++) {
      let item = temp[i];
      if (item.get("options").length > 1 && item.get("options")[0].value) {
        charts[item.label] = {};
        charts[item.label]["xAxisData"] = [];
        charts[item.label]["yAxisData"] = [];
        for (let j = 0; j < item.get("options").length; j++) {
          let data = item.get("options")[j];
          charts[item.label].xAxisData.push(data.value);
          let queryCount = new Parse.Query("SurveyLogTest");
          queryCount.equalTo("survey", this.sId);
          queryCount.equalTo(`answersMap.${item.id}`, data.value);
          queryCount.equalTo("company", this.company);
          queryCount.limit(100000);
          let count = await queryCount.count();
          charts[item.label]["yAxisData"].push(count);
        }
      }
    }

    let cuCharts = [];
    for (let k in charts) {
      let options: EChartOption = {
        tooltip: {},
        title: {
          text: k,
        },
        xAxis: {
          type: "category",
          data: charts[k].xAxisData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: charts[k].yAxisData,
            type: "bar",
            // showBackground: true,
            // itemStyle: {
            //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     { offset: 0, color: "#83bff6" },
            //     { offset: 0.5, color: "#188df0" },
            //     { offset: 1, color: "#188df0" },
            //   ]),
            // },
            // emphasis: {
            //   itemStyle: {
            //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       { offset: 0, color: "#2378f7" },
            //       { offset: 0.7, color: "#2378f7" },
            //       { offset: 1, color: "#83bff6" },
            //     ]),
            //   },
            // },
          },
        ],
      };
      cuCharts.push(options);
    }
    this.cuCharts = cuCharts;
  }
}
