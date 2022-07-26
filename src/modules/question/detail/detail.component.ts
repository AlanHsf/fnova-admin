import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ElementRef } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import * as Parse from "parse";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.css"],
})
export class DetailComponent implements OnInit {
  id: any;
  surveyLog: Array<any> = [];
  questions: Array<any> = [];
  answersMap: Array<any> = [];
  title: any = "";
  isPrint: boolean = false;
  tplModal?: NzModalRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private el: ElementRef,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) { }

  async ngOnInit() {
    await this.activatedRoute.queryParams.subscribe((queryParams) => {
      console.log(queryParams);
      this.id = queryParams.objectid;
      console.log(this.id);
    });
    await this.queryQuestion();
    await this.queryQuestionItem();
    await this.querySurveyLog();
  }
  // 查询题库
  async queryQuestion() {
    let Question = Parse.Object.extend("Question");
    let queryQ = new Parse.Query(Question);
    queryQ.equalTo("objectId", this.id);
    let result = await queryQ.first();
    if (result) {
      console.log(result);
      this.title = result.get("title");
    }
  }
  // 查询题目
  async queryQuestionItem() {
    let QuestionItem = Parse.Object.extend("QuestionItem");
    let queryQI = new Parse.Query(QuestionItem);
    queryQI.equalTo("qsurvey", this.id);
    queryQI.limit(100);
    let result = await queryQI.find();
    let compare = function (q1, q2) {
      let val1 = q1.get("index");
      let val2 = q2.get("index");
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    };
    result.sort(compare);
    console.log(result);
    this.questions = result;
  }

  // 查询surveyLogTest
  async querySurveyLog() {
    let SurveyLogTest = Parse.Object.extend("SurveyLogTest");
    let queryS = new Parse.Query(SurveyLogTest);
    queryS.descending("createdAt");
    queryS.equalTo("survey", this.id);
    queryS.limit(20000);
    let result = await queryS.find();
    console.log(result);
    let answers: any = [];
    let cleanSurveyLog: any = [];
    result.forEach((item) => {
      // item.get("answersMap");
      // let answerMap = item.get("answersMap");

      // let keys = Object.keys(answerMap);
      // console.log(keys);
      let answer = item.get("answersMap");
      if (answer != undefined && answer != {}) {
        answers.push(answer);
      }
    });
    console.log(answers);
    this.surveyLog = result;
    this.answersMap = answers;
  }
  //刷新
  refreshAllData() {

  }
  value: any
  //搜索
  async change(e) {
    console.log(e);
    let SurveyLogTest = Parse.Object.extend("SurveyLogTest");
    let queryS = new Parse.Query(SurveyLogTest);
    queryS.descending("createdAt");
    queryS.equalTo("survey", this.id);
    if(e){
      queryS.containedIn("answers",[e])
    }
    queryS.limit(20000);
    let result = await queryS.find();
    console.log(result);
    let answers: any = [];
    let cleanSurveyLog: any = [];
    result.forEach((item) => {
      // item.get("answersMap");
      // let answerMap = item.get("answersMap");

      // let keys = Object.keys(answerMap);
      // console.log(keys);
      let answer = item.get("answersMap");
      if (answer != undefined && answer != {}) {
        answers.push(answer);
      }
    });
    console.log(answers);
    this.surveyLog = result;
    this.answersMap = answers;
  }
  //设置已读
  upStatus(item){
    console.log(item)
    let SurveyLogTest = new Parse.Query("SurveyLogTest")
    SurveyLogTest.equalTo("objectId",item.id)
    SurveyLogTest.first().then(res=>{
      if(res && res.id){
        if(item.get("status") == true){
          res.set("status",null)
        }else{
          res.set("status",true)
        }
        res.save().then(rep=>{
          console.log('修改成功');
        })
      }
    })
  }
  async allStatus(state){
    console.log(state);
    let SurveyLogTest = Parse.Object.extend("SurveyLogTest");
    let queryS = new Parse.Query(SurveyLogTest);
    queryS.descending("createdAt");
    queryS.equalTo("survey", this.id);
    if(state){
      queryS.equalTo("status",true)
    }else{
      queryS.equalTo("status",undefined)
    }
    queryS.limit(20000);
    let result = await queryS.find();
    console.log(result);
    let answers: any = [];
    let cleanSurveyLog: any = [];
    result.forEach((item) => {
      // item.get("answersMap");
      // let answerMap = item.get("answersMap");

      // let keys = Object.keys(answerMap);
      // console.log(keys);
      let answer = item.get("answersMap");
      if (answer != undefined && answer != {}) {
        answers.push(answer);
      }
    });
    console.log(answers);
    this.surveyLog = result;
    this.answersMap = answers;
  }
  //  点击打印
  showPrint(item) {
    // 处理时间
    let index = item.get("answersMap")[this.questions[9].id].indexOf("T");
    let name = item.get("answersMap")[this.questions[0].id];
    let department = item.get("answersMap")[this.questions[6].id];
    let num = item.get("answersMap")[this.questions[7].id];
    console.log(num);
    let time = item.get("answersMap")[this.questions[9].id].substring(0, index);
    let operation = item.get("answersMap")[this.questions[10].id] ? "是" : "否";
    let money = item.get("answersMap")[this.questions[11].id];
    let template = `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style type="text/css" media=print>
    .noprint...{display : none }
  </style> 
  <title>文件打印</title>
  </head><body>
  <!--startprint-->
  <div style=" width: 100%; height:100%; background-color: rgba(ff,ff,ff, .5); z-index: 999;">
    <div style="width:210mm ; height: 270mm; background-color: #FFF; padding-left:
    10px; padding-top: 10px;">
    <table border="1" cellspacing="0" style="text-align: center;width: 180mm ; height: 240mm; z-index: 999;">
      <tr style="height: 40px;">
        <td colspan="2">职工姓名</td>
        <td colspan="4">${name}</td>
        <td colspan="2">住院科室</td>
        <td colspan="4">${department}</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">住院号</td>
        <td colspan="4">${num}</td>
        <td colspan="2">住院时间</td>
        <td colspan="4">${time}</td>
      </tr>
      <tr style="height: 60px;">
        <td colspan="2">病情诊断是否动手术</td>
        <td colspan="10">${operation}</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">慰问金额</td>
        <td colspan="10">${money}</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">工会小组长审批</td>
        <td colspan="10">_____年_____月_____日</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">工会副主席审批</td>
        <td colspan="10">_____年_____月_____日</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">工会主席审批</td>
       <td colspan="10">_____年_____月_____日</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">领款人签名</td>
        <td colspan="10">_____年_____月_____日</td>
      </tr>
    </table>
    <!--endprint-->
    <button class="noprint" id="print" onclick="print(event)" style="display: block; width: 80px; ; margin-top: 20px;  z-index: 1000;">打印</button>
  </div>
</div>
</body></html>`;
    let printModal: any = window.open(
      "",
      "newwindow",
      "width=900, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
    );
    printModal.document.body.innerHTML = template;
    this.isPrint = true;
  }
  // 查看详情
  showSurveyDetail(item) {
    let area = item.get("area");
    let department = item.get("department");
    let sex = item.get("sex");
    let part = item.get("part");
    let technicalTitle = item.get("technicalTitle");
    let education = item.get("education");
    let whole = item.get("grades")[6].whole;
    let salar = item.get("grades")[1].salar;
    let promotion = item.get("grades")[2].promotion;
    let work = item.get("grades")[3].work;
    let supervisor = item.get("grades")[4].supervisor;
    let sibling = item.get("grades")[5].sibling;
    let answers = item.get("answersMap"),
      questions = this.questions,
      answerArr: any = [];
    questions.forEach((item) => {
      for (const key in answers) {
        if (key == item.id) {
          answerArr.push(answers[key].value);
        }
      }
    });

    let template = ` 
    <table border="1" cellspacing="0" nzStyle="text-align: center;width: 100% ; ">
        <tr>
          <td colspan="2">院区</td>
          <td colspan="4">${area}</td>
          <td colspan="2">科室</td>
          <td colspan="4">${department}</td>
        </tr>
        <tr >
          <td colspan="2">性别</td>
          <td colspan="4">${sex}</td>
          <td colspan="2">岗位</td>
          <td colspan="4">${part}</td>
        </tr>
        <tr >
          <td colspan="2">职称</td>
          <td colspan="4">${technicalTitle}</td>
          <td colspan="2">最高学历</td>
          <td colspan="4">${education}</td>
        </tr>
        <tr>
          <td colspan="2">总体满意度</td>
          <td colspan="4">${whole}</td>
          <td colspan="2">薪资福利满意度</td>
          <td colspan="4">${salar}</td>
        </tr>
        <tr>
          <td colspan="2">发展晋升</td>
          <td colspan="4">${promotion}</td>
          <td colspan="2">工作环境及内容</td>
          <td colspan="4">${work}</td>
        </tr>
        <tr >
          <td colspan="2">上下级关系</td>
          <td colspan="4">${supervisor}</td>
          <td colspan="2">同级关系</td>
          <td colspan="4">${sibling}</td>
        </tr>
        <tr>
          <td colspan="2">第1题:${answerArr[0]}</td>
          <td colspan="2">第2题:${answerArr[1]}</td>
          <td colspan="2">第3题:${answerArr[2]}</td>
          <td colspan="2">第4题:${answerArr[3]}</td>
          <td colspan="2">第5题:${answerArr[4]}</td>
          <td colspan="2">第6题:${answerArr[5]}</td>
        </tr>
        <tr>
          <td colspan="2">第7题:${answerArr[6]}</td>
          <td colspan="2">第8题:${answerArr[7]}</td>
          <td colspan="2">第9题:${answerArr[8]}</td>
          <td colspan="2">第10题:${answerArr[9]}</td>
          <td colspan="2">第11题:${answerArr[10]}</td>
          <td colspan="2">第12题:${answerArr[11]}</td>
        </tr>
        <tr>
          <td colspan="2">第13题:${answerArr[12]}</td>
          <td colspan="2">第14题:${answerArr[13]}</td>
          <td colspan="2">第15题:${answerArr[14]}</td>
          <td colspan="2">第16题:${answerArr[15]}</td>
          <td colspan="2">第17题:${answerArr[16]}</td>
          <td colspan="2">第18题:${answerArr[17]}</td>
        </tr>
        <tr>
          <td colspan="2">第19题:${answerArr[18]}</td>
          <td colspan="2">第20题:${answerArr[19]}</td>
          <td colspan="2">第21题:${answerArr[20]}</td>
          <td colspan="2">第22题:${answerArr[21]}</td>
          <td colspan="2">第23题:${answerArr[22]}</td>
        </tr>
      </table>`;
    this.modal.confirm({
      nzWidth: "40%",
      nzTitle: "详情",
      nzContent: template,
      nzOkText: "关闭",
      nzCancelText: null,
      nzBodyStyle: {
        width: "100%",
        height: "100%",
        table: `{
          width: "100%"
        }`,
        tr: `{ width: "100%", height: "80px" }`,
      },
    });
  }
  showWDetail(item) {
    let index = item.get("answersMap")[this.questions[9].id].indexOf("T");
    let name = item.get("answersMap")[this.questions[0].id];
    let department = item.get("answersMap")[this.questions[6].id];
    let num = item.get("answersMap")[this.questions[7].id];
    console.log(num);
    let time = item.get("answersMap")[this.questions[9].id].substring(0, index);
    let operation = item.get("answersMap")[this.questions[10].id] ? "是" : "否";
    let money = item.get("answersMap")[this.questions[11].id];
    let template = `<table border="1" cellspacing="0" style="text-align: center;width: 100% ; height: 100%; z-index: 999;">
      <tr style="height: 40px;">
        <td colspan="2">职工姓名</td>
        <td colspan="4">${name}</td>
        <td colspan="2">住院科室</td>
        <td colspan="4">${department}</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">住院号</td>
        <td colspan="4">${num}</td>
        <td colspan="2">住院时间</td>
        <td colspan="4">${time}</td>
      </tr>
      <tr style="height: 60px;">
        <td colspan="2">病情诊断是否动手术</td>
        <td colspan="10">${operation}</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">慰问金额</td>
        <td colspan="10">${money}</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">工会小组长审批</td>
        <td colspan="10">_____年_____月_____日</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">工会副主席审批</td>
        <td colspan="10">_____年_____月_____日</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">工会主席审批</td>
       <td colspan="10">_____年_____月_____日</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">领款人签名</td>
        <td colspan="10">_____年_____月_____日</td>
      </tr>
    </table>`;
    this.modal.confirm({
      nzWidth: "40%",
      nzTitle: "详情",
      nzContent: template,
      nzOkText: "关闭",
      nzCancelText: null,
      nzBodyStyle: {
        width: "100%",
        table: `{
          width: "90%"
        }`,
        tr: `{ width: "90%", height: "80px" }`,
      },
    });
  }
  // 导出
  exportData() {
    let str =
      "<tr><td>职工姓名</td> <td>工号</td> <td>科室</td> <td>住院科室</td> <td>住院号</td> <td>住院时间</td> <td>病情诊断</td> <td>是否手术</td> <td>慰问金额</td> <td>小组长名称</td></tr>";
    for (let i = 0; i < this.surveyLog.length; i++) {
      let index = this.surveyLog[i]
        .get("answersMap")
      [this.questions[8].id].indexOf("T"),
        name = this.surveyLog[i].get("answersMap")[this.questions[0].id],
        // sex = this.surveyLog[i].get("answersMap")[this.questions[1].id],
        workNum = this.surveyLog[i].get("answersMap")[this.questions[3].id],
        dpt = this.surveyLog[i].get("answersMap")[this.questions[4].id],
        department = this.surveyLog[i].get("answersMap")[this.questions[5].id],
        num = this.surveyLog[i].get("answersMap")[this.questions[6].id],
        date = this.surveyLog[i]
          .get("answersMap")
        [this.questions[8].id].substring(0, index),
        detail = this.surveyLog[i].get("answersMap")[this.questions[7].id],
        operation = this.surveyLog[i].get("answersMap")[this.questions[9].id]
          ? "是"
          : "否",
        money = this.surveyLog[i].get("answersMap")[this.questions[10].id],
        teamNmae = this.surveyLog[i].get("answersMap")[this.questions[11].id];
      str += `<tr>
        <td>${name}</td>
        <td>${workNum}</td>
        <td>${dpt ? dpt : "未填写"}</td>
        <td>${department ? department : "未填写"}</td>
        <td>${num ? num : "未填写"}</td> 
        <td>${date}</td>
        <td>${detail ? detail : "未填写"}</td>
        <td>${operation}</td>
        <td>${money}</td> 
        <td>${teamNmae ? teamNmae : "未填写"}</td>
        </tr> `;
    }
    //Worksheet名
    let worksheet = "慰问金汇总表";
    let uri = "data:application/vnd.ms-excel;base64,";

    //下载的表格模板数据
    let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
    xmlns:x="urn:schemas-microsoft-com:office:excel" 
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
      <x:Name>${worksheet}</x:Name>
      <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
      </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head><body><table>${str}</table></body></html>`;
    //下载模板
    window.location.href = uri + this.base64(template);
  }
  //输出base64编码
  base64(s) {
    return window.btoa(unescape(encodeURIComponent(s)));
  }
}
