import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse'
import { Router } from '@angular/router'
interface DataItem {
  user: string; // 学生
  school: string;  // 学校
  lesson: string; // 课程
  survey: string; // 试卷
  edit:string  // 编辑
}
@Component({
  selector: 'app-corrects-papers',
  templateUrl: './corrects-papers.component.html',
  styleUrls: ['./corrects-papers.component.scss']
})
export class CorrectsPapersComponent implements OnInit {
  listOfColumn = [
    {
      title: '学生姓名',
      compare: null,
      priority: false
    },
    {
      title: '学校',
      compare: null,
      priority: false
    },
    {
      title: '课程',
      compare: null,
      priority: false
    },
    {
      title: '试卷',
      compare: null,
      priority: false
    },
    {
      title: '操作',
      compare: null,
      priority: false
    }
  ];
  listOfData: any = []
  constructor( private route:Router) { }
  schools:any;
  company: any ;
  school:any ;
  lessons:any ;
  lesson:any;
  ngOnInit() {
    this.company = localStorage.getItem('company')
    console.log(this.company)
    this.getSchool()
  }
  getSchool() {
    let Department = new Parse.Query('Department')
    if(this.company == 'pPZbxElQQo' ) {
      Department.equalTo('category', 'erVPCmBAgt')
    }
    Department.equalTo('company', this.company)
    Department.find().then(res => {
      console.log(res)
      this.schools = res
    })
  }
  async changeSchool(ev) {
    if(!ev) {
      this.lesson = null,
      this.lessons = []
      return
    }
    let Lesson = new Parse.Query('Lesson')
    Lesson.equalTo('departments',{
      __type: "Pointer",
      className: "Department",
      objectId: ev
    })
    Lesson.find().then(res => {
      console.log(res);
      this.lessons = res
    }) 
  }

  survey:any;
  showlesson:any;
  changeLesson(ev) {
    if(!ev) {
      this.lesson = null
      return
    }
    this.showlesson = Object.assign(ev, {})
    console.log(this.showlesson)
    let Lesson = new Parse.Query('Lesson')
    Lesson.include('survey')
    console.log(ev)
    Lesson.get(ev.id).then(res => {
      if(res && res.id && res.get('lessonTest')) {
        this.survey = res.get('lessonTest')
        console.log(res, this.survey)
      }
    })
  }
  // 根据学校和课程来查询试卷
  search(){
    if(!this.survey || !this.school) {
      alert('请选择需要批改试卷的学校和课程')
    }
    let SurveyLog = new Parse.Query('SurveyLog')
    // console.log(this.survey.id, this.school)
    SurveyLog.equalTo('survey', this.survey.id)
    SurveyLog.equalTo('department', this.school)
    SurveyLog.include('department')
    SurveyLog.include('profile')
    SurveyLog.include('survey')
    SurveyLog.find().then(res  => {
      console.log(res)
      this.listOfData = res
    })
  }
  // 批阅试卷
  perusal(data){
    console.log(data);
    this.route.navigate(['/masterol-doctor/survey', {id: data.id, sid: data.get('survey').id }])
  }
}
