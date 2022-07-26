import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";

@Component({
  selector: 'app-correct-list',
  templateUrl: './correct-list.component.html',
  styleUrls: ['./correct-list.component.scss']
})
export class CorrectListComponent implements OnInit {

  listOfColumn = [
    {
      title: '考试名称',
      compare: null,
      priority: false
    },
    {
      title: '考试试卷',
      compare: null,
      priority: false

    },
    {
      title: '考试总分',
      compare: null,
      priority: false

    },
    {
      title: '合格分数',
      compare: null,
      priority: false
    },
    {
      title: '抽题方式',
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
  constructor(private route: Router, private activRoute: ActivatedRoute) { }
  schools: any;
  company: any;
  school: any;
  lessons: any;
  lesson: any;
  department: any
  ngOnInit() {
    if (localStorage.getItem('department')) {
      this.department = localStorage.getItem('department')
    }
    this.company = localStorage.getItem('company')
    // 总后台
    console.log(this.department, this.company)
    if (!this.department) {
      this.listOfColumn = [
        {
          title: '所属院校',
          compare: null,
          priority: false
        },
        {
          title: '考试名称',
          compare: null,
          priority: false
        },
        {
          title: '考试试卷',
          compare: null,
          priority: false

        },
        {
          title: '考试总分',
          compare: null,
          priority: false

        },
        {
          title: '合格分数',
          compare: null,
          priority: false
        },
        {
          title: '抽题方式',
          compare: null,
          priority: false
        },
        {
          title: '操作',
          compare: null,
          priority: false
        }
      ];
    }
    this.search()
    console.log(this.company)
  }
  getSchool() {
    let Department = new Parse.Query('Department')
    Department.equalTo('company', this.company)
    Department.find().then(res => {
      console.log(res)
      this.schools = res;
      this.department ? (this.school = this.department) : (this.school = this.schools[0].id);
      this.search()
    })
  }
  async changeSchool(ev) {
    if (!ev) {
      this.lesson = null,
        this.lessons = []
      return
    }
  }

  survey: any;
  exam;
  showlesson: any;
  // 根据学校和课程来查询试卷
  search() {
    let Exam = new Parse.Query('Exam')
    if (this.department) {
      Exam.equalTo('department', this.department)
    }
    // Exam.equalTo('isEnable', true)
    Exam.include('department')
    // Exam.include('outline')
    Exam.include('survey')
    Exam.find().then(res => {
      console.log(res)
      if (res && res.length) {
        this.listOfData = res
        // let surveys = res.get("survey");
        // if (surveys && surveys.length) {
        //   this.listOfData = surveys
        // } else {
        //   this.listOfData = []
        // }
      }else {
        this.listOfData = []
      }
    })
  }
  // 批阅试卷
  perusal(data) {
    console.log(data);
    this.route.navigate(['/english/give-marker', { examId: data.id }])
  }
}
