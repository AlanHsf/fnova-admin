import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import * as Parse from "parse";
import { DatePipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: "app-start",
  templateUrl: "./start.component.html",
  styleUrls: ["./start.component.scss"],
  providers: [DatePipe]
})
export class StartComponent implements OnInit {
  company: string = localStorage.getItem("company");
  department;
  survey: any;
  profile: any;
  exam: any;
  log: any;
  currentTime: any;
  beginTime: any;
  endTime: any
  begin: any;
  status: string;
  pageType: boolean;// 是否有开启的考试
  answerMap: any;// 答题记录
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dateFormat: DatePipe,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private message: NzMessageService,
    private modal: NzModalService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.currentTime = new Date();
      console.log(this.currentTime);
      this.department = localStorage.getItem("department");
      let profileId = localStorage.getItem("profileId");
      if (profileId) {
        await this.getProfile(profileId)
        this.initData()
      } else {
        this.router.navigate([`/english/login;did=${this.department}`]);
        return
      }
    });
  }
  async getProfile(profileId) {
    let Profile = new Parse.Query("Profile");
    Profile.equalTo("objectId", profileId);
    Profile.include("department");
    Profile.include("schoolClass");
    Profile.include("SchoolMajor");
    let profile = await Profile.first();
    if (profile && profile.id) {
      console.log(profile)
      let beginTime = profile.get('schoolClass').get('beginTime')
      let endTime = profile.get('schoolClass').get('endTime')
      this.beginTime = beginTime;
      this.endTime = endTime;
      console.log(beginTime, endTime);
      console.log(this.currentTime - beginTime);
      if (this.currentTime > endTime) {
        this.status = 'isEnd'
      }
      if (this.currentTime > beginTime && this.currentTime < endTime) {

        this.status = 'underway'

      }
      if (this.currentTime < beginTime) {
        this.status = 'waitStart'
      }
      this.begin = this.currentTime.setTime(beginTime.getTime());
      this.profile = profile.toJSON();
      this.profile.school = this.profile.department['name']
      localStorage.setItem("profile", JSON.stringify(profile.toJSON()))

    }
  }
  async initData() {
    this.exam = await this.getExam();
    if (!this.exam) {
      this.message.error("当前无开启考试")
      return
    }
    this.answerMap = await this.getAnswerMap()
    this.log = await this.getSurveyLog();
    this.loadSurvey(this.exam.survey);
  }
  async getExam() {
    let Exam = new Parse.Query("Exam");
    Exam.equalTo("isEnable", true);
    Exam.equalTo("company", this.profile.company.objectId);
    Exam.equalTo("department", this.department);
    Exam.include("survey");
    Exam.descending("updatedAt");
    let exam: any = await Exam.first();
    console.log(exam);
    if (exam && exam.id) {
      this.pageType = true;
      exam = exam.toJSON();
      return exam;
    } else {
      this.pageType = false;
      return false
    }
  }
  async getAnswerMap() {
    let Answer = new Parse.Query("SurveyAnswer");
    Answer.equalTo("exam", this.exam.objectId);
    Answer.equalTo("profile", this.profile.objectId)
    Answer.descending("updatedAt");
    let answer: any = await Answer.first();
    if (answer && answer.id) {
      return answer;
    }
  }
  async getSurveyLog() {
    let Log = new Parse.Query("SurveyLog");
    Log.equalTo("exam", this.exam.objectId);
    Log.equalTo("profile", this.profile.objectId)
    // Log.equalTo('user', user.id)
    Log.descending("updatedAt");
    let log: any = await Log.first();
    if (log && log.id) {
      return log;
    } else {
      return false;
    }
  }
  timeUp() {
    console.log(this.status);
    this.status = 'underway';
    this.cdRef.detectChanges();
    console.log(this.status);
  }
  async loadSurvey(surveys) {
    console.log(surveys);
    if (surveys && surveys.length) {
      surveys.forEach(survey => {
        console.log(survey.scate, this.profile.langCode);
        if (survey.scate == this.profile.langCode) {
          this.survey = survey;
        }
      });
    }

  }

  async toExam(params, e?) {
    let url = '/english/answer';

    if (!this.profile.schoolClass) {
      this.message.create("info", "未分配考场，无法进入考试")
      return
    }
    if (this.log && this.log.submitted) {
      this.message.create("info", "已提交该试卷，不能重复考试")
      return
    }
    let now: any = new Date();
    if (now > this.endTime) {
      this.message.error(`考试已结束`)
      this.status = 'isEnd'
      return
    }
    if (params.type == 'begin' && this.exam.enterTimeAuth) {
      let status = this.checkTimeOut(this.exam.enterTimeAuth)
      if (!status) {
        return
      }
    }

    if (e) {
      var el = e.srcElement || e.target; //target兼容Firefox
      this.FullScreen(el);
    }
    this.ngZone.run(() => {
      this.router.navigate([url, params]);
    })
  }
  // 检查是否超时
  checkTimeOut(enterTime) {
    let overtime = 1000 * 60 * enterTime
    console.log(this.currentTime, this.beginTime, overtime);
    let now: any = new Date()
    let beginTime: any = new Date(this.beginTime)
    if (now - beginTime > overtime) {
      let confirmModal = this.modal.info({
        nzTitle: null,
        nzContent: `已超过考试开始时间${enterTime}分钟,无法进入考试`,
        nzOnOk: () => {
          confirmModal.close()
        }
      });
      return false
    }
    return true
  }
  FullScreen(el) {
    // let isFullscreen = document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen;
    let isFullscreen = document.fullscreenElement;
    if (!isFullscreen) { //进入全屏,多重短路表达式
      (el.requestFullscreen && el.requestFullscreen()) ||
        (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
        (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el.msRequestFullscreen && el.msRequestFullscreen());

    }
  }

}
