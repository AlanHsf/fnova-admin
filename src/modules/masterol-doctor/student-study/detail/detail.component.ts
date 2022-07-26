import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TileStyler } from '@angular/material/grid-list/tile-styler';
import { ActivatedRoute, Router } from "@angular/router"
import { json } from 'gantt';
import * as Parse from "parse"
import { CoreService } from 'src/app/core.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsCanDeactivateFn } from 'ng-zorro-antd/tabs';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'study-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public course = {
    picUrl:
      'https://10.idqqimg.com/qqcourse_logo_ng/ajNVdqHZLLDqdnwzosLuOakqUTib1I0JZ6bqMJFHaVdHgZ4sGbGjlaBTgJ5QeHVEMqH0qvibLqicmQ/600',
    name: '教育心理学',
    teacher: '张小丽',
    schedule: 30,
    class: 12.9,
    stage: 0,
    synthesize: 0
  };
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private router: Router,private authService: AuthService
  ) { }
  aIndex:any = 0;
  // 当前课程  objectId
  LessonId: any;
  // 当前课程
  Lesson: any;
  // 当前课程章节
  LessonArticle: any;
  // 当前课程 章
  Article: any = [];
  // 当前课程大纲
  LessonOutline: any;
  // 当前课程教师
  LessonTeacherName: any;
  // 当前课程教师id
  LessonTeacherId: any;
  // 当前课程所属学校id  
  SchoolId: any;
  // 当前课程各章节 阶段测试id
  stageIdArray: any = [];
  // 当前课程综合测试 id
  synthesizeIdArray: any = [];
  // 课程学习进度
  percent: any;
  // 已考阶段试卷数组
  doneStageArray: any = [];
  // 已考综合测试数组
  doneSynArray: any = [];
  // 阶段测试完成度
  stageDone: any;
  // 综合测试完成度
  synDone: any;
  myProfile:any;
  doneSyn: any;
  plainFooter = 'plain extra footer';
  footerRender = () => 'extra footer';
  ngOnInit() {
    this.getLesson()
  }
  parseErr:any;
  handleOk(): void {
    setTimeout(() => {
      this.sessionVisible = false;
      this.authService.logout('notSession')

    }, 1000);
  }

  sessionVisible:boolean = false;
  async getLesson() {
    // 获取objectId
    this.activatedRoute.paramMap.subscribe(param => {
      if (param.get('lesson')) {
        this.LessonId = param.get('lesson')
        localStorage.setItem('lessonId', param.get('lesson'))
      } else {
        this.LessonId = localStorage.getItem('lessonId')
      }
      if (!this.LessonId) {
        this.router.navigate(["masterol-doctor/student-center"]);
        return
      }

      // 查询该课程数据
      let queryLesson = new Parse.Query('Lesson');
      queryLesson.equalTo("company", localStorage.getItem('company'));
      // let a = ['学分']
      // queryLesson.containedIn("tag",a);
      queryLesson.equalTo("objectId", this.LessonId);
      queryLesson.first().then(data => {
        this.Lesson = data;
        this.cdRef.detectChanges();

        this.getOutline();
        this.getTeacher()
        this.getSchoolId();
        this.getTest2();
        // this.getLessonRecord()

      }).catch(err => {
        if (err.toString().indexOf('209') != -1) {
          console.log(err.toString(), err.toString().indexOf('209'));
          this.sessionVisible = true;
          this.parseErr = err
        }
  
      })
      this.getProgress()
      // 查询该课程章节
      let queryArticle = new Parse.Query('LessonArticle');
      // queryArticle.equalTo("company","SS");
      // let a = ['学分']
      // queryLesson.containedIn("tag",a);
      queryArticle.equalTo("lesson", this.LessonId);
      queryArticle.ascending("index")
      queryArticle.find().then(article => {
        this.LessonArticle = article;
        
        // let articles = article
        article.forEach(item => {
          // let index:number = item.get('index')
          // let b:number = 1;
          // article.sort(() =>{
          //  return index - b

          // })
          if (!item.get("parent")) {
            this.Article.push(item.toJSON());
          }
        })
        this.LessonArticle = article;

        this.getTest1()
      });
    })

  }
  lessonStatus:any; // 所有视频是否观看完毕
  getProgress() {
    let serverURL = 'https://server.fmode.cn/api/masterol/'

    let progress;
    this.myProfile = JSON.parse(localStorage.getItem("profile"))
    let profileId = JSON.parse(localStorage.getItem("profileId"))
    // let profileId = profile.objectId
    let querySurvey = new Parse.Query("Lesson")
    querySurvey.equalTo('objectId', this.LessonId)
    querySurvey.find().then(res => console.log(res))
    if(this.myProfile){
      this.http.get(serverURL + 'lesson?profileId=' + this.myProfile.objectId + '&lessonId=' + this.LessonId).subscribe(res => {
      let status: any = res;
        status = status.data[0];
        let done = status.done ? status.done : 0;
        let total = status.total;
        done == total?this.lessonStatus = true:this.lessonStatus = false;
      
      // if (progress.data[0].lesson != null) {
      //   this.percent = (progress.data[0].done / progress.data[0].total * 100).toFixed(0)
      // }

      // this.LessonStatus = status.data
      // this.LessonStatus.map((item, index) => {
      //   if (this.Lesson[index].id == item.lessson) {
      //     this.Lesson[index].done = item.done;
      //     this.Lesson[index].total = item.total;
      //   }

      // })
    })
    }
   


  }

  // 查询该课程大纲
  getOutline() {
    this.LessonOutline = this.Lesson.get("detail");

  }
  // 查询教师讯息
  getTeacher() {
    this.LessonTeacherName = this.Lesson.get("teacher")
    if (this.Lesson.get("schoolTeacher")) {
      this.LessonTeacherId = this.Lesson.get("schoolTeacher").id
    }

  }
  // 查询当前课程所属学校id
  getSchoolId() {
    this.SchoolId = this.Lesson.get("school").id
  }
  // 查找阶段测试试题
  getTest1() {
    let id;
    let done;
    this.Article.forEach(item => {
      if (item.test && item.test.objectId) {
        id = item.test.objectId
        this.stageIdArray.push(id)
        // 查找已完成试卷数组 1、
        let querySurvey = new Parse.Query("SurveyLog")
        querySurvey.equalTo('survey', id)
        querySurvey.find().then(res => {
          this.doneStageArray = res
     
          // 查找已完成试卷数组 2、
          if (this.doneStageArray.length > 0) {
            let doneArray = []
            this.doneStageArray.forEach(ditem => {
      

              if (ditem.get("status") != undefined && ditem.get("status") != null) {
                doneArray.push(ditem)

              }
            })
            this.doneStageArray = doneArray
            if (doneArray.length > 0) {
              this.stageDone = (this.doneStageArray.length / this.stageIdArray.length * 100).toFixed(0)

            }
          }
        })
      }

    })
    localStorage.setItem("stageIdArray", JSON.stringify(this.stageIdArray))
  }
  // 查找综合测试试题
  async getTest2() {
    if (this.Lesson.get("lessonTest")) {
      let id = this.Lesson.get("lessonTest").id;
      this.synthesizeIdArray.push(id);

      // 查找已完成试卷数组
      let querySurvey = new Parse.Query("SurveyLog")
      querySurvey.equalTo('survey', id)
      querySurvey.equalTo('profile', this.myProfile.objectId)
      querySurvey.first().then(res =>{
        if(res && res.id){
          if(res.get("status") != undefined){
            this.synDone = 100
          //   synDoneArray.push(res)
  
          }
        }

      })
      // querySurvey.find().then(res => {

      //   res.map(item => {
      //     if (item.get("status") != undefined) {
      //       this.doneSynArray.push(item)
      //     }
      //   })
      //   console.log(this.doneSynArray)
      //   if (this.doneSynArray && this.synthesizeIdArray) {
      //     this.synDone = (this.doneSynArray.length / this.synthesizeIdArray.length * 100).toFixed(0)

      //   }
      // })
      localStorage.setItem("synthesizeIdArray", JSON.stringify(this.synthesizeIdArray))

    }
  }

}
