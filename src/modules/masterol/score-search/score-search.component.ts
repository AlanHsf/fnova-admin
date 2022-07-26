import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse'
import { NzMessageService } from "ng-zorro-antd/message";
@Component({
  selector: "app-score-search",
  templateUrl: "./score-search.component.html",
  styleUrls: ["./score-search.component.scss"]
})
export class ScoreSearchComponent implements OnInit {
  constructor(private message: NzMessageService) {}
  name: any = "";
  studentNum: any = "";
  ngOnInit() { }
  profileId: any;
  async search() {
    if (!this.name) {
      this.message.create('error', "请输入学生姓名");
      return
    }
    if (!this.studentNum) {
      this.message.create("error", "请输入学生学号");
      return
    }
    let dapartmentId = localStorage.getItem("department");
    let company = localStorage.getItem('company')
    if (!dapartmentId) {
      let Profile = new Parse.Query("Profile");
      Profile.equalTo('company', company)
      Profile.equalTo('name', this.name)
      Profile.equalTo("studentID", this.studentNum);
      Profile.include("SchoolMajor");
      let profile = await Profile.first()
      if (profile && profile.id) {
        this.profileId = profile.id;
        console.log(profile, profile.get("SchoolMajor").get('plan'));
        this.getSchoolPlan(profile.get("SchoolMajor").get('plan'));
        this.getPaper(profile.id);
      }
    }

  }
  lessons: any;
  async getSchoolPlan(pid) {
    let SchoolPlan = new Parse.Query('SchoolPlan')
    SchoolPlan.include('lessons')
    let schoolPlan = await SchoolPlan.get(pid)
    if (schoolPlan && schoolPlan.id) {
      this.lessons = schoolPlan.get('lessons')
      console.log(this.lessons)
      this.lessons.forEach(lesson => {
        // let LessonRecord = new Parse.Query('LessonRecord')

      })
    }
  }
  paper
  async getPaper(pid) {
    let Paper = new Parse.Query('SchoolPaper')
    Paper.equalTo('profile', pid)
    Paper.include('teacher')
    let paper = await Paper.first()
    if (paper  && paper.id) {
      this.paper = paper
    }
  }
}
