import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
@Component({
  selector: 'detail-synthesize',
  templateUrl: './synthesize.component.html',
  styleUrls: ['./synthesize.component.less']
})
export class SynthesizeComponent implements OnInit {
  @Input() synthesizeIdArray: any;
  @Input() lessonStatus:any;
  SurveyLog:any = [];
  constructor(private router: Router, private message: NzMessageService) { }

  ngOnInit(): void {
    this.getTest()
  }
  test: any = [];
  async getTest(){
    if(this.synthesizeIdArray){
    let queryTest = new Parse.Query("Survey");
    queryTest.equalTo("objectId", this.synthesizeIdArray[0])
    queryTest.equalTo("isEnabled", true)
    queryTest.first().then(res => {
      if(res && res.id){
        this.test.push(res.toJSON())
        this.getSurveyLog(2)
      }
    })
    }
    // if(this.synthesizeIdArray.length > 0){
    //   for(let i = 0; i < this.synthesizeIdArray.length; i++){
    //     console.log(this.synthesizeIdArray)
    //       queryTest.equalTo("survey", this.synthesizeIdArray[i]);
    //       testItem = await queryTest.first()

    //       console.log(testItem)
    //       // this.synthesizeId.push(testItem.toJSON())
    //       // console.log(this.synthesizeId)
    //   }
      
    // }
    
    
  }

  getSurveyLog(type) {
    let currentUser = Parse.User.current();
   
     if (type == "2") {
      this.synthesizeIdArray.forEach(item => {
        // let queryLog = new Parse.Query("SurveyItemLog");
        // queryLog.equalTo("user", currentUser.id)
        // queryLog.equalTo("survey",  item)
        // queryLog.equalTo("company", "pPZbxElQQo")
        // queryLog.first().then(res =>{
        //   if(res &&res.id){
        //     this.SurveyLog.push(res)
        //     if(this.test && this.test.length>0 && this.SurveyLog && this.SurveyLog.length){
        //       this.test.forEach((stage,index) => {
        //         console.log(stage);
        //         if(this.SurveyLog[index] && stage.id == this.SurveyLog[index].get('survey').id){
        //           this.test[index].status = this.SurveyLog[index].get('status')
        //         }
        //       })
        //     }
        //   }else{
            let queryLog2 = new Parse.Query("SurveyLog");
            queryLog2.equalTo("user", currentUser.id)
            queryLog2.equalTo("survey",  item)
            queryLog2.equalTo("company", localStorage.getItem('company'))
            queryLog2.first().then(log2 =>{
              if(log2 && log2.id){
                this.SurveyLog.push(log2)
                if(this.test && this.test.length>0 && this.SurveyLog && this.SurveyLog.length){
                  this.test.forEach((stage,index) => {
                    if(this.SurveyLog[index] && stage.objectId == this.SurveyLog[index].get('survey').id){
                      if( this.SurveyLog[index].get('status') == false){
                        this.test[index].status = false
                        console.log(this.SurveyLog[index],stage.objectId,this.test[index].status);
                      }else if(this.SurveyLog[index].get('status')){
                        this.test[index].status = true
                      }else {
                        this.test[index].status  = undefined
                      }
                    }
                  })
                }
              }
 
            })
            
          // }
     
           
        // }
        // )
      })
     
    }



    // if(SurveyLog.)
  }
  // 跳转到测试页面
  toTest(types,id,content) {
    // if(!types && !id && !content){
    //   this.message.error('请先观看完视频')
    // }else {
      this.router.navigate(["/masterol/student-test", { type: types,id: id,content:content }])
    // }
  }
}
