import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import * as Parse from "parse";

@Component({
  selector: 'detail-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.less']
})
export class StageComponent implements OnInit {
  @Input() stageIdArray: any;// 试卷id 数组
  types: any;
  test: any = [];
  date: any;
  SurveyLog: any;
  ngOnInit(): void {
    this.getTest();
    this.date =  new Date() 
  }
  getTest(){
    this.test = []
    if(this.stageIdArray.length > 0){
      for(let i = 0; i < this.stageIdArray.length; i++){
        let queryTest = new Parse.Query("Survey");
          queryTest.equalTo("objectId", this.stageIdArray[i]);
          // queryTest.ascending("order");
          queryTest.first().then(testItem => {
            this.getSurveyLog(testItem)
          })
      }
      console.log(this.test);
      
      
    }
   
  }
  getSurveyLog(testItem) {
    let testItem2 = testItem.toJSON()
    this.test.push(testItem2)
    let currentUser = Parse.User.current();
        // let queryLog = new Parse.Query("SurveyItemLog");
        // queryLog.equalTo("user", currentUser.id)
        // queryLog.equalTo("survey", testItem.id)
        // console.log(testItem)
        // queryLog.equalTo("company", "pPZbxElQQo")
        // queryLog.descending("updatedAt");
        // queryLog.first().then(res => {
        //   if(res && res.id){
        //     let SurveyLog = res
        //     console.log(res);
        //     if(testItem.id == SurveyLog.get('survey').id){
        //       this.SurveyLog = SurveyLog
        //       testItem2.status = SurveyLog.get('status')
        //       this.test.forEach((titem,index) => {
        //         if(titem.objectId == testItem2.objectId){
        //           this.test[index] = testItem2
        //           console.log(this.test[index]);
                  
        //         }
        //       })
        //     }
        //   }else {
            let queryLog = new Parse.Query("SurveyLog");
            queryLog.equalTo("user", currentUser.id)
            queryLog.equalTo("survey", testItem.id)
            console.log(testItem)
            queryLog.equalTo("company", localStorage.getItem('company'))
            queryLog.descending("updatedAt");
            queryLog.first().then(log => {
              if(log && log.id){
                this.test.forEach((titem,index) => {
                  if(titem.objectId == testItem2.objectId){
                    this.test[index].status = log.get('status')
                    // console.log(this.test[index]);
                    
                  }
                })
              }
            })
          // }
        // })
      
  }
  
  constructor(private router: Router) { }

  // 跳转到测试页面
  toTest(types,id,content) {

    this.router.navigate(["/masterol-doctor/student-test", { type: types,id: id,content: content}])
  }

}
