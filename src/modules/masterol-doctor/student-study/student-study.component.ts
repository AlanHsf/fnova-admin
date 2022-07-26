import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-student-study',
  templateUrl: './student-study.component.html',
  styleUrls: ['./student-study.component.scss']
})
export class StudentStudyComponent implements OnInit {
  LessonId: any;
  
  constructor(private activatedRoute:ActivatedRoute,private router:Router) { }

  ngOnInit() {
    let url = this.router.url.split(';')
    let pathUrl = url[0];
    if(url[1]){
    this.LessonId = url[1].split('=')[1];
      
    }else {
      this.LessonId = localStorage.getItem("LessonId")
    }
    // console.log(this.LessonId)
    localStorage.setItem("LessonId",this.LessonId)
    // this.activatedRoute.paramMap.subscribe(param => {
    //   console.log(param)

    //   if(param.get('lesson')) {
    //     this.LessonId = param.get('lesson')
    //     localStorage.setItem('lessonId', param.get('lesson') )
    //   }else {
    //     console.log(param)
    //     this.LessonId = localStorage.getItem('lessonId')
    //     console.log(this.LessonId)
    //   }
    //   if(!this.LessonId){
    //     this.router.navigate(["masterol/student-center"]);
    //     return
    //   }
    // })
  }

}
