import { profile } from 'console';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
@Component({
  selector: 'detail-synthesize',
  templateUrl: './synthesize.component.html',
  styleUrls: ['./synthesize.component.less']
})
export class SynthesizeComponent implements OnInit {
  @Input() synthesizeIdArray: any;
  @Input() lessonStatus: any;
  SurveyLog: any = [];
  constructor(private router: Router, private message: NzMessageService) { }

  ngOnInit(): void {
    this.getTest()
  }
  test: any = [];
  async getTest() {
    if (this.synthesizeIdArray) {
      this.synthesizeIdArray.forEach(element => {
        let queryTest = new Parse.Query("Survey");
        queryTest.equalTo("objectId", element)
        queryTest.equalTo("isEnabled", true)
        queryTest.first().then(res => {
          if (res && res.id) {
            this.test.push(res.toJSON())
            this.getSurveyLog(2)
          }
        })
      });
    }
  }

  getSurveyLog(type) {
    let currentUser = Parse.User.current();
    if (type == "2") {
      console.log(this.synthesizeIdArray)
      this.synthesizeIdArray.forEach(async item => {
        let queryLog2 = new Parse.Query("SurveyLog");
        let profileId = localStorage.getItem("profileId")
        queryLog2.equalTo("profile", profileId)
        queryLog2.equalTo("company", localStorage.getItem('company'))
        queryLog2.descending("createdAt")
        await queryLog2.find().then(log2 => {
          if (log2 && log2.length) {
            this.SurveyLog = []
            this.SurveyLog = log2
            console.log(this.test);
            if (this.test && this.test.length > 0 && this.SurveyLog && this.SurveyLog.length) {
              this.SurveyLog.forEach((log, index) => {
                console.log(log)
                if (log && item == log.get('survey').id) {
                  console.log(log.get('status'));
                  if (log.get('status')) {
                    this.test[index].status = true
                  } else {
                    this.test[index].status = false
                  }
                }
              })
            }
          }
        })
      })
    }
  }


  // 跳转到测试页面
  toTest(types, id, content) {
    this.router.navigate(["/self-study/student-test", { type: types, id: id, content: content }])
  }
}