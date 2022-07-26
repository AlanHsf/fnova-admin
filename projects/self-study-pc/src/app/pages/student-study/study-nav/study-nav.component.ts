import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import * as Parse from "parse";
@Component({
  selector: 'study-nav',
  templateUrl: './study-nav.component.html',
  styleUrls: ['./study-nav.component.scss']
})
export class StudyNavComponent implements OnInit {
  currentNav: number;
  tabs = [
    {
      name: "我的学习",
      icon: "../../../assets/img/self-study/img/study.png",

    },
    {
      name: "考试计划",
      icon: "../../../assets/img/self-study/img/pyfa.png"
    },
    {
      name: "我的课表",
      icon: "../../../assets/img/self-study/img/kb.png"
    },
    // {
    //   name: "我的考试",
    //   icon: "../../../assets/img/self-study/img/test.png"
    // },
    {
      name: "我的成绩",
      icon: "../../../assets/img/self-study/img/cj.png"
    },
    {
      name: "我的论文",
      icon: "../../../assets/img/self-study/img/lw.png"
    },
    {
      name: "毕业档案",
      icon: "../../../assets/img/self-study/img/by.png"
    },
    // {
    //   name: "我的学籍",
    //   icon: "../../../assets/img/self-study/img/xj.png"
    // },
  ]
@Input() LessonId: any;
  constructor(private router: Router,private activatedRoute:ActivatedRoute,) { }
  url: any;
  pathUrl: any
  pathParam: any
  pageType: string = 'detail'
  title: any;
  logo:any;
  // LessonId: any;
  getLogo(){
    console.log(999999)
    let logo = localStorage.getItem('logo')
    if(logo){
      this.logo = logo
    }else {
      let queryLogo = new Parse.Query("Company");
      queryLogo.equalTo("objectId", localStorage.getItem('company'));
      // queryProfile.include("SchoolMajor");
      queryLogo.first().then(async res => {
        console.log(res)
        if (res && res.id) {
          logo = res.get('logo')
          this.logo = logo
          console.log(this.logo)
        localStorage.setItem('logo',this.logo)

        }
      })

    }
    // let queryLogo = new Parse.Query("Company");
    // queryLogo.equalTo("objectId", '1ErpDVc1u6');
    // // queryProfile.include("SchoolMajor");
    // queryLogo.first().then(async res => {
    //   console.log(res)
    //   if (res && res.id) {
    //     this.logo = res.get('logo')
    //     console.log(this.logo)
    //   }
    // })
  }
  ngOnInit() {
    this.getLogo()
    this.url = this.router.url.split(';')
    this.pathUrl = this.url[0]
    this.pathParam = this.url[1];
    

    if(!this.LessonId){
      this.LessonId = localStorage.getItem("LessonId")
      // localStorage.getItem("LessonId",this.LessonId)
    }
    // this.activatedRoute.paramMap.subscribe(params => {
    //   console.log(params)
    //   let type = params.get('type');
    //   let lesson = params.get('lesson');
    //   if(type == "detail"){
    //     this.currentNav = 0
    //   }
    //   // if(type == "test" && )
    // });
   
    
    // console.log(this.pathUrl,this.pathParam)
    if (this.pathUrl == "/self-study/student-study/detail") {

      this.currentNav = 0
      // console.log(this.currentNav)
      // console.log(this.pathUrl)

    } 
    if (this.pathUrl == "/self-study/student-study/test" && this.pathParam == 'type=1') {
      this.currentNav = 1
      // console.log(this.currentNav)


    } else if (this.pathUrl == "/self-study/student-study/test" && this.pathParam == 'type=2') {
      this.currentNav = 2
      // console.log(this.currentNav)

    }

    this.getTestTitle()
    
  }
  getTestTitle(){
    
    // console.log(this.LessonId)
    let query = new Parse.Query("Lesson");
    query.equalTo("objectId",this.LessonId);
    query.first().then(res => {
      let lesson = res;
      // console.log(lesson)

      if(lesson && lesson.id){
        this.title = lesson.get("title")
        // console.log(this.title)
      }

    })
  }
  // back(k){
  //   self.location.href="../../masterol " 
   
  // }

  back() {
    this.router.navigate(["self-study/student-center"]);
  }

  // 跳转到测试页面   navigate跳转不能写路由相对路径 报错 
  toTest(pageType,types?) {
    // if (!types) {
      if(pageType == 'detail') {
        this.router.navigate(["self-study/student-study/detail"])
        this.currentNav = 0
        // console.log(123)
      }
      if(pageType == 'test') {
          this.router.navigate(["self-study/student-study/test", { type: types}])
          this.currentNav = types
      }
     
      // if (this.pathUrl == "/self-study/student-study/detail") {

      //   this.currentNav = 0
      //   console.log(this.currentNav)
      //   console.log(this.pathUrl)

      // }
    // }


    // console.log(this.currentNav)
    // this.router.navigate(["self-study/student-study/test", { type: types }])


  }


  toHomeNav(i){
    this.router.navigate(['self-study/student-center',{i:i}])
  }
}
