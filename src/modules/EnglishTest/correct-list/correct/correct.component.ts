import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
import { fromEvent, Observable, Observer, of } from 'rxjs';

@Component({
  selector: 'app-correct',
  templateUrl: './correct.component.html',
  styleUrls: ['./correct.component.scss']
})
export class CorrectComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private message: NzMessageService) { }
  answer: any;
  surveyLog: any;
  scoreLen: any;
  singleScore: number;
  multiScore: number;
  selectScore: number;
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(parmas => {
      let SurveyLog = new Parse.Query('SurveyLog')
      if (parmas.get('id')) {
        SurveyLog.get(parmas.get('id')).then(res => {
          console.log(res);
          if (res && res.id) {
            this.surveyLog = res
            this.getKonwLedges()
            this.singleScore = this.surveyLog && this.surveyLog.get('singleScore') || 0;
            this.multiScore = this.surveyLog && this.surveyLog.get('multiScore') || 0;
            this.selectScore = this.singleScore + this.multiScore;
            // this.total = this.selectScore;
            this.answer = res.get('shortAnswer');
            this.getAnswer()
            if (parmas.get('sid')) {
              this.queryQuestion();
            }
          }
        })
      }
    })
  }
  // 查找题目
  questions: any = []
  async queryQuestion() {
    console.log(this.answer);
    let keys = Object.keys(this.answer);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let SurveyItem = new Parse.Query('SurveyItem')
      let surveyItem = await SurveyItem.get(key);
      console.log(surveyItem);
      if (surveyItem && surveyItem.id) {
        this.questions.push(surveyItem);
      }
      // SurveyItem.equalTo('type', 'text')
      // SurveyItem.descending('index')
    }
    console.log(this.questions);
  }

  textItemScore: any = {}
  textTotal: Observable<number> = of(0);
  total: number = 0;
  scoreChange(e, item) {
    this.textItemScore[item.id] = e;
    if (e > item.get("score")) {
      this.textItemScore[item.id] = item.get("score")
    }
    /* 单个题目、题型算分 */
    this.answerMap.klist.map(k => {
      let map = { k: null }
      k.tlist.map(t => {
        if (t.tid == item.id) {
          t.grade = e
        }
        if (!map[k]) map[k] = 0
        map[k] += t.grade
        return t
      })
      if (map[k]) k.grade = map[k];
      return k
    })
    this.textTotal = new Observable<number>((observer: Observer<number>) => {
      let total = 0;
      let scoreMap = this.textItemScore;
      let keys = Object.keys(this.textItemScore);
      for (let index = 0; index < keys.length; index++) {
        let key = keys[index];
        total += scoreMap[key] || 0;
      }
      observer.next(total)
    });
    this.textTotal.subscribe(textScore => {
      this.total = this.selectScore + textScore
      this.answerMap.text = textScore
      this.answerMap.total = this.answerMap.select + this.answerMap.text;
    })
    console.log(this.textTotal, this.total);

  }
  async submit() {
    console.log(this.textItemScore, this.total, this.textTotal)
    let scoreMap = Object.keys(this.textItemScore)
    let answer = Object.keys(this.answer)
    if (scoreMap.length < answer.length) {
      this.message.error('还有题没有评分,请完成所有题评分')
      return
    }
    await this.setAnswer()
    await this.setLog()

    // this.router.navigate(['/ english/surveylogs', { PclassName:Exam;PobjectId=7oEGugIUIG }])
  }
  // 获取题型
  knowsMap: any = {}
  async getKonwLedges() {
    let Knowledge = new Parse.Query("Knowledge");
    Knowledge.equalTo("department", this.surveyLog.get("department")?.id);
    Knowledge.select("type")
    let knows = await Knowledge.find();
    if (knows && knows.length) {
      knows.forEach(know => {
        this.knowsMap[know.id] = know.get("type")
      })
    }
  }
  async setLog() {
    let subjectiveScore = 0;
    let objectiveScore = 0;
    this.answerMap['klist'].forEach(k => {
      if (this.knowsMap[k.kid]) {
        switch (this.knowsMap[k.kid]) {
          case 'subjective':
            subjectiveScore += Number(k.grade)
            break;
          case 'objective':
            objectiveScore += Number(k.grade)
            break;
          default:
            break;
        }
      }
    })
    let SurveyLog = new Parse.Query('SurveyLog')
    let log = await SurveyLog.get(this.surveyLog.id)
    log.set('textItemScore', this.textItemScore)
    log.set('textScore', this.answerMap.text)
    log.set("subjectiveScore", subjectiveScore)
    log.set("objectiveScore", objectiveScore)
    log.set('status', true)
    log.set('grade', this.total)
    let logres = await log.save()
    console.log(logres)
    if (log && log.id) {
      this.message.success("评分完成")
      window.history.back()
    } else {
      this.message.error("网络繁忙，请稍后重试")
    }
  }
  answerMap: any;
  surveyAnswer: any;
  async getAnswer() {
    let SurveyAnswer = new Parse.Query('SurveyAnswer')
    SurveyAnswer.equalTo("exam", this.surveyLog.get("exam")?.id)
    SurveyAnswer.equalTo("profile", this.surveyLog.get("profile")?.id)
    let answer = await SurveyAnswer.first()
    this.surveyAnswer = answer
    this.answerMap = answer.get("answerMap")
  }
  async setAnswer() {
    this.surveyAnswer.set('answerMap', this.answerMap)
    let logres = await this.surveyAnswer.save()
    console.log(logres)
  }


}
