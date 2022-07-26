import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import * as Parse from "parse"
import { AuthService } from '../../masterol/auth.service';
@Component({
  selector: 'english-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  // 测试类型  阶段 综合
  type: any;
  // 试卷id
  testId: string;
  // 页面显示内容  测试列表0  测试内容1 测试结果2
  public content: number = 0
  // 综合测试 id数组
  synthesizeIdArray: any;
  // 综合测试 试卷
  synthesizeTest: any;
  // 阶段测试 id数组
  stageIdArray: any;
  // 阶段测试 试卷
  stageTestArray: any = [];
  // 考试记录
  SurveyLog: any;
  constructor(private route: ActivatedRoute,public authService: AuthService) {

  }
  parseErr:any;
  handleOk(): void {
    setTimeout(() => {
      this.sessionVisible = false;
      this.authService.logout('notSession')
    }, 1000);
  }

  sessionVisible:boolean = false;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(params)
      this.type = params.get('type');
      let testId = params.get('id');
      let content = +params.get('content')
        this.content = content;
        this.testId = testId;
      
      console.log(this.type)

      if (!testId) {
        this.content = 0
      }
      let synthesizeIdArray = localStorage.getItem("synthesizeIdArray");
      synthesizeIdArray = JSON.parse(synthesizeIdArray)
      let stageIdArray = localStorage.getItem("stageIdArray");
      stageIdArray = JSON.parse(stageIdArray)
      console.log(synthesizeIdArray, stageIdArray)
      // 综合测试页面
      if (synthesizeIdArray && this.type == "2") {
        console.log(synthesizeIdArray)
        this.synthesizeIdArray = synthesizeIdArray
        let querySynthesize = new Parse.Query("Survey")
        querySynthesize.equalTo("objectId", synthesizeIdArray[0])
        console.log(synthesizeIdArray[0])
        querySynthesize.find().then(res => {
          let synthesizeTest = res
          this.synthesizeTest = synthesizeTest
          console.log(this.synthesizeTest)
          this.getSurveyLog("2")
        }).catch(err => {
          if (err.toString().indexOf('209') != -1) {
            console.log(err.toString(), err.toString().indexOf('209'));
            
            this.sessionVisible = true;
            this.parseErr = err
          }
    
        })
      
      }
      // 阶段测试页面
      if (stageIdArray && this.type == "1") {
        this.stageIdArray = stageIdArray
        
        for (let i = 0; i < stageIdArray.length; i++) {
          let queryStage = new Parse.Query("Survey")
          queryStage.equalTo("objectId", stageIdArray[i])
          queryStage.find().then(res => {
            this.stageTestArray = res
          }).catch(err => {
            if (err.toString().indexOf('209') != -1) {
              console.log(err.toString(), err.toString().indexOf('209'));
              this.authService.logout('notSession')
              this.sessionVisible = true;
              this.parseErr = err
            }
      
          })
        }
        this.getSurveyLog("1")
      }

    });
  }

  getSurveyLog(type) {
    let currentUser = Parse.User.current();
    console.log(currentUser.id)
    let queryLog = new Parse.Query("SurveyLog");
    if (type == "1") {
      this.stageIdArray.forEach( item => {
        queryLog.equalTo("user", currentUser.id)
        queryLog.equalTo("survey", item)
        queryLog.equalTo("company", localStorage.getItem('company'))
        queryLog.find().then(res => {
          this.SurveyLog = res
        })
        
      })
      console.log(this.stageTestArray)

      setTimeout(()=>{
        console.log(this.SurveyLog)
        this.stageTestArray.forEach((stage,index) => {
          if(this.SurveyLog[index] && stage.id == this.SurveyLog[index].get('survey').id){
            console.log(this.stageTestArray)
            this.stageTestArray[index].status = this.SurveyLog[index].get('status')
          }
          console.log(this.stageTestArray)
        })
      },500)
     
    } else if (type == "2") {
      this.synthesizeIdArray.forEach(item => {
        queryLog.equalTo("user", currentUser.id)
        queryLog.equalTo("survey", item)
        console.log(item)
        queryLog.equalTo("company", localStorage.getItem('company'))
        queryLog.find().then(res =>{
          this.SurveyLog = res
        }
        )
      })
      setTimeout(()=>{
        console.log(this.SurveyLog)
        this.synthesizeTest.forEach((stage,index) => {
          if(this.SurveyLog && this.SurveyLog.length > 0){
            if(this.SurveyLog[index].get('survey') && stage.id == this.SurveyLog[index].get('survey').id){
              console.log(this.synthesizeTest)
              this.synthesizeTest[index].status = this.SurveyLog[index].get('status')
            }
          }
          
          console.log(this.synthesizeTest)
        })
      },500)
    }



    // if(SurveyLog.)
  }
  // 开始测试
  beginTest(id,content) {
    if(content){
      this.content = content
    }else {
      this.content = 1
    }
   
    this.testId = id;
      localStorage.setItem("testId", this.testId)
      console.log(this.content)
  }
  // 接收子组件数据
  getStatus(content: number) {
    this.content = content

  }
  // 查看结果
  showResult() {
    this.content = 2
  }

}
