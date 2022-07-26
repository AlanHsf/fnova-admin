import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import * as Parse from 'parse'
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }
  answer:any
  surveyLog:any
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(parmas => {
        let SurveyLog = new Parse.Query('SurveyLog')
        if(parmas.get('id')) {
          SurveyLog.get(parmas.get('id')).then(res => {
            if(res && res.id) {
              this.surveyLog = res
              this.total = ((this.surveyLog.get('singleScore') && this.surveyLog.get('singleScore')> 0 ) ? this.surveyLog.get('singleScore') : 0 ) +
              ((this.surveyLog.get('multiScore') && this.surveyLog.get('multiScore')> 0 ) ? this.surveyLog.get('multiScore') : 0 ) 
              this.answer = res.get('shortAnswer')
              if(parmas.get('sid')) {
                this.queryQuestion(parmas.get('sid'))
              }
            }
          })
        }    
    })
  }
  // 查找题目
  question:any = []
  queryQuestion(sid) {
    let SurveyItem = new Parse.Query('SurveyItem')
    SurveyItem.equalTo('survey', sid)
    SurveyItem.equalTo('type', 'text')
    SurveyItem.descending('index')
    SurveyItem.find().then(res => {
      this.question = res
    })
  }

  textItemScore:any = {}
  textTotal:number = 0
  total:number = 0
  // 失去焦点
  gradeChange(ev){
    let score
    if(this.textItemScore[ev]) {
      score = this.textItemScore[ev]
    } else {
      score = 0
    }
    this.textTotal += score
    this.total += score
  }
  // 聚合焦点
  focusChange(id) {
    if(this.textItemScore[id]) {
      this.textTotal = this.textTotal - this.textItemScore[id]
      this.total = this.total - this.textItemScore[id]
    }
  }
  submit() {
    console.log(this.textItemScore, this.total, this.textTotal)
    let scoreMap =  Object.keys(this.textItemScore)
    let answer = Object.keys(this.answer)
    if(scoreMap.length < answer.length) {
      alert('还有题没有评分,请完成所有题评分')
      return
    }
    let SurveyLog = new Parse.Query('SurveyLog')
    SurveyLog.get(this.surveyLog.id).then(res => {
      res.set('textItemScore', this.textItemScore)
      res.set('textScore', this.textTotal)
      res.set('status', true)
      res.set('grade', this.total)
      res.save().then(r => {
        // masterol/corrects-papers;rid=nU0yOjxXYU
        console.log(res)
        this.router.navigate(['/masterol-doctor/corrects-papers', {rid: 'nU0yOjxXYU'}])
      })
    })
  }
  
}
