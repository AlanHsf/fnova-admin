import { Component, OnInit } from '@angular/core';
import { NzMessageService } from "ng-zorro-antd/message";
import { DomSanitizer } from '@angular/platform-browser';

import * as Parse from "parse";
@Component({
  selector: 'app-student-question',
  templateUrl: './student-question.component.html',
  styleUrls: ['./student-question.component.scss']
})
export class StudentQuestionComponent implements OnInit {
  // 当前tab项索引
  current: number = 2;
  // 意见反馈子级tab项索引
  current2: number = 1;
  // 意见反馈类型
  fbType: string = '教学类';
  // 意见反馈内容
  feedbackContent: string = '';
  // 个人档案
  Profile: any = [];
  // 问题分栏
  questionstype: any = 'submitQuestions';
  companyId:any;
  // 常见问题文章列表
  articles: any = [];
  // 问题列表
  feedback: any = [];
  // 问题详情
  viewDetail: any = {};
  // 查看详情框是否显示
  viewDetailsWrap: boolean = false;
  //  常见问题详情
  viewCommon: any = {};
  viewCommonProblemWrap: boolean = false;
  constructor(
    private message: NzMessageService,
    private security:DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getProfile();
  }

  async getProfile() {
    let user = Parse.User.current();
    let queryProfile = new Parse.Query("Profile");
    queryProfile.equalTo("user", user.id);
    queryProfile.include("SchoolMajor");
    await queryProfile
      .first()
      .then(async (res) => {
        let profile: any = res;
        this.Profile = profile.toJSON();
        this.companyId = profile.get('company').id;
        this.getArticle();
        this.getFeedback(res.id);
      })
      .catch((err) => {
        if (err.toString().indexOf("209") != -1) {
          console.log(err.toString(), err.toString().indexOf("209"));
        }
      });
  }

  getArticle() {
    let queryArticle = new Parse.Query("Article");
    queryArticle.equalTo("company", this.companyId);
    queryArticle.equalTo("type", 'question');
    queryArticle.find().then(res => {
      if (res && res.length) {
        this.articles = res;
        console.log(this.articles);
      }
    });
  }

  commitFeedback() {
    let user = Parse.User.current();
    let company = localStorage.getItem("company")
    if (this.feedbackContent == '' || this.feedbackContent.trim() == '') {
      this.message.info("请先输入反馈意见")
    } else {
      let SaveFeedback = Parse.Object.extend("Feedback");
      let saveFeedback = new SaveFeedback();
      saveFeedback.set("profile", {
        __type: "Pointer",
        className: "Profile",
        objectId: this.Profile.objectId
      });
      saveFeedback.set("user", {
        __type: "Pointer",
        className: "_User",
        objectId: user.id
      });
      saveFeedback.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: company
      });
      saveFeedback.set("type", this.fbType);
      saveFeedback.set("content", this.feedbackContent);
      saveFeedback.save().then(() => {
        this.message.info("提交成功");
        this.feedbackContent = ''
      })
    }
  }

  getQuestions(type) {
    this.questionstype = type
  }

  getFeedback(id){
    let Feedback = new Parse.Query("Feedback");
    Feedback.equalTo("company", this.companyId);
    Feedback.equalTo("profile", id);
    Feedback.find().then(res => {
      if (res && res.length) {
        this.feedback = res;
        // console.log(this.feedback); 
      }
    })
  }
  
  getViewDetails(id){
    this.viewDetailsWrap = true
     let viewDetail = this.feedback
     viewDetail.map((res)=>{      
      if(res.id == id ){
      this.viewDetail = res
      console.log(this.viewDetail);
      }
    })
  }

  viewDetailsClose(){
    this.viewDetailsWrap = false
  }
  
  getCommonProblem(id){
    this.viewCommonProblemWrap = true;
    console.log(this.articles);
    let commonProblem = this.articles
    commonProblem.map((res)=>{      
      if(res.id == id ){
      this.viewCommon = res
      console.log(this.viewCommon);
      }
    })
    
  }
  
  commonProblemClose(){
    this.viewCommonProblemWrap = false;
  }
}
