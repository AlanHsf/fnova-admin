import { Component, Input, OnInit } from '@angular/core';
import * as Parse from "parse";

@Component({
  selector: 'detail-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.less']
})
export class TeacherComponent implements OnInit {
  @Input() LessonTeacherId:any;
  @Input() SchoolId:any;
  teacherInfo: any;

  constructor() {}
  async getTeacher(){
    // console.log(this.LessonTeacherId,this.SchoolId)
    let queryTeacher = new Parse.Query("LessonTeacher");
    if(this.LessonTeacherId && this.SchoolId){
      queryTeacher.equalTo("objectId",this.LessonTeacherId);
      // queryTeacher.equalTo("school",this.SchoolId);
      this.teacherInfo = await queryTeacher.first()
    // console.log(this.teacherInfo)

    }
    

  }
  ngOnInit(): void {
    this.getTeacher()
  }
}
