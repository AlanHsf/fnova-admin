import { query } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as Parse from "parse"

@Component({
  selector: 'test-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.less']
})
export class ResultComponent implements OnInit {
  @Input('testId') testId: any;
  @Input('type') type: any;
  tableData: any = [];
  surveyId: any;
  SurveyLog: any;
  Survey: any;
  SurveyItem: any;
  selectSimple: any = [];
  selectMutiple: any = [];
  selectTxt: any = [];
  selectAnswer: any = {};
  // 简答题记录
  // SurveyItemLog: any;
  // 简答题答案
  textAnswer: any = [];
  user: any;
  generateBig(index: number) {
    let i = 65 + index;
    return String.fromCharCode(i);
  }

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    console.log(this.testId)
    this.route.paramMap.subscribe(params => {
      console.log(params,11111)
      if (params.get('id')) {
        this.surveyId = params.get('id');
      } else {
        this.surveyId = this.testId
      }
      this.getSurvey(this.surveyId)
      
    });
  }
  getSurvey(id) {
    let queryLog = new Parse.Query("Survey");
    queryLog.equalTo("objectId", id)
    queryLog.first().then(res => {
      this.Survey = res
      console.log(this.Survey)
      this.getSurveyItem(res.id);

    })
  }
  getSurveyItem(id) {
    let queryLog = new Parse.Query("SurveyItem");
    queryLog.equalTo("survey", id)
    queryLog.find().then(res => {
      this.SurveyItem = res
      res.map(item => {
        // 单选题
        if (item.get('type') == "select-single") {
          this.selectSimple.push(item)
          
        }
        if (item.get('type') == "select-multiple") {
          this.selectMutiple.push(item)
        }
        if (item.get('type') == "text") {
          this.selectTxt.push(item)
        }
      })
      // let selectAnswer = this.selectAnswer
      //     if (selectAnswer) {
      //       let emptySingle;
      //       Object.keys(this.selectSimple).forEach(i => {
      //         if (!this.selectAnswer[i]) {
      //           console.log(this.selectAnswer[i])
      //           emptySingle[i] = this.selectSimple[i]
      //         }
      //       })
      //       console.log(emptySingle)
      //     }
      console.log(this.SurveyItem)
      console.log(this.selectSimple)
      console.log(this.selectMutiple)
      console.log(this.selectTxt)
    })
    this.getSurveyLog(this.surveyId)

  }
  getSurveyLog(id) {
    console.log(id)
    let currentUser = Parse.User.current();
    this.user = currentUser;
    console.log(this.user)
    let queryLog = new Parse.Query("SurveyLog");
    queryLog.equalTo("user", currentUser.id)
    queryLog.equalTo("survey", id)
    queryLog.equalTo("company", localStorage.getItem('company'))
    queryLog.include("profile")
    queryLog.include("user")
    queryLog.descending('createdAt')
    queryLog.first().then(res => {
      if(res && res.id){
        this.SurveyLog = res
      console.log(this.SurveyLog)
      this.selectAnswer = res.get("answer");
      this.textAnswer = res.get("shortAnswer")
      console.log(this.selectAnswer)
      this.tableData = []
      console.log(this.textAnswer)
      // this.tableData.push({name: '答对',key:'1',single: this.SurveyLog.get('singleRight'),multiple:this.SurveyLog.get('multiRight')})// text:this.SurveyItemLog.get('right')
      // this.tableData.push({name: '答错',key:'2',single: this.selectSimple.length - this.SurveyLog.get("singleRight"),multiple:this.selectMutiple.length - this.SurveyLog.get("multiRight")})// text: this.selectTxt.length - this.SurveyItemLog.get("right")
      this.tableData.push({name: '得分',key:'3',single: this.SurveyLog.get("singleScore"),multiple:this.SurveyLog.get("multiScore"),text:this.SurveyLog.get("textScore")})
      }
      // this.getSurveyItemLog(id)

    })

  }
  // 简答题 记录
  // getSurveyItemLog(id) {
  //   console.log(id)
  //   let profile = JSON.parse(localStorage.getItem("profile"))
  //   console.log(profile)
  //  if(profile){
  //   let profileId = profile.objectId
  //   let queryItemLog = new Parse.Query("SurveyItemLog");
  //   queryItemLog.equalTo("survey", id)
  //   queryItemLog.equalTo("company", "1ErpDVc1u6")
  //   queryItemLog.equalTo("profile", profileId)
  //   queryItemLog.first().then(res => {
  //     if(res && res.id){
  //       this.SurveyItemLog = res
  //     let grade = 0;
  //     if(this.SurveyItemLog.grade && this.SurveyItemLog.grade.length){
  //       this.SurveyItemLog.grade.forEach(item => {
  //         grade +=item
  //         console.log(item);
          
  //       } )
  //     }else {
  //       grade = 0
  //     }
  //     this.SurveyItemLog.score = grade 
  //     console.log(this.SurveyItemLog,grade)
  //     let textAnswer = res.get("answer")
  //     let keys = Object.keys(textAnswer)
  //     keys.forEach(i => {
  //       this.textAnswer[i] = textAnswer[i]
  //     })

     
  //     }

  //   })
  //  }
  // }
}
