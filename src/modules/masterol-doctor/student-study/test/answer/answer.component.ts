import { Output } from '@angular/core';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TileStyler } from '@angular/material/grid-list/tile-styler';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as Parse from "parse";
import { error } from 'protractor';

@Component({
  selector: 'test-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {
  // 通过@Input接受父组件传进的值、方法
  @Input() content: number;
  @Input() testId: string;
  @Input() type: string;
  @Output() getStatus = new EventEmitter<number>();// 用 EventEmitter 和 output 装饰器配合使用 <string>指定类型变量
  // 答题状态  complete 已完成  uncomplete 未完成
  complete: boolean = true;
  uncomplete: boolean = false;
  // 试卷信息
  test: any;
  // // 单选题集合
  // singleTopic: any = [];
  radioValue: ''
  testMap: any = {}
  label: any = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",]
  totalScore: number = 0;
  right: number = 0;
  wrong: number = 0;
  empty: number = 0;
  // 试卷题目数组
  testItem: any = [];
  time: any;
  startTime: any;
  deadline: any;
  multiScore: any;
  singleScore: any;
  multiRight: any;
  singleRight: any;
  // 简答题答案集合
  textAnswerArray: any = {}
  profile: any;
  radioChange() {
   
    console.log(this.testMap)
  }

  checkboxChange(e: Array<string>, index: number, item) {
    // console.log(e, index)
    this.testMap[item.objectId] = e
    // console.log(this.testMap)

  }
  // 交卷
  commit() {
    let topics = this.testMap.filter(topic => {
      if(topic){
        return topic;
      }
    });
    let texts = this.textAnswerArray.filter(text => {
      if(text){
        return text;
      }
    });
     if(this.testItem.length > ((topics.length) + texts.length)){
      this.isVisible2 = true;
     }else {
      this.showModal()
      // this.content = 2;
     }

    // 向父组件广播数据
    // this.getStatus.emit(this.content)

  }
  isVisible = false;
  isVisible2 = false;
  // showModal(): void {
  //   this.isVisible = true;
  // }

  // handleOk(): void {
  //   console.log('Button ok clicked!');
  //   this.isVisible = false;
  //   this.saveLog()

  // }
  saveLog() {
    let singleTopic = this.test.singleTopic
    let multipleTopic = this.test.multipleTopic
    let testMap = this.testMap;

    // 正确答案对象
    let resultMap = {}
    let result = []

    let singMap = {}
    let mutiMap = {}
    let scoreMap = {}
    let singScoreMap = {}
    // this.right = 0;
    // this.total = 0
    // // 计算分数
    // this.test.singleTopic.forEach((item, i) => {
    //   if (testMap[item.objectId]) {
    //     item.options.forEach(option => {
    //       if (option.label == testMap[item.objectId]) {
    //         this.total = this.total + option.grade
    //         if(option.grade > 0){
    //           this.right += 1;
    //         }
    //         console.log(this.right)
    //       }
    //     })
    //   }
    // })

    //  // 正确答案数组
    //  let resultMap = {}
    //  let result = []
    //  this.test.multipleTopic.forEach((item, i) => {
    //    if (testMap[item.objectId]) {
    //      console.log(item)
    //      result = item.options.filter(item => item.check);
    //      resultMap[item.objectId] = result

    //    }

    //  })

    //  Object.keys(testMap).forEach(tid => {
    //    console.log(tid)
    //    let selectArray = testMap[tid];
    //    console.log(resultMap[tid])
    //    console.log(resultMap)
    //    console.log(testMap)
    //    let rightArray = resultMap[tid];
    //    // 过滤掉单选答案
    //    if (rightArray && typeof resultMap[tid] != 'string') {
    //       let resultMap = {}
    // this.test.multipleTopic.forEach((item, i) => {
    //   let result = []
    //   if (testMap[item.objectId]) {
    //     result = item.options.filter(item => item.check);
    //     resultMap[item.objectId] = result
    //   }
    // })
    // console.log(resultMap)
    // Object.keys(resultMap).forEach(rid => {
    //   if(testMap[rid]) {
    //    if(testMap[rid].length > resultMap[rid].length) {
    //     console.log('选多了')
    //     return
    //    } else {
    //      let currentGrade = 0;
    //      let isError = false
    //     testMap[rid].forEach((r ) => {
    //       console.log(testMap[rid],r)
    //       let indexArr = []
    //       resultMap[rid].forEach(f => {
    //        if(r != f.label) {
    //          console.log(22222)
    //          testMap[rid].push('error')
    //          return
    //         }
    //       })
    //      })
    //      if(!isError) {
    //        this.right += 1
    //        this.total += currentGrade
    //        console.log(this.right, this.total)
    //      }
    //    }

    //   }




    // 计算分数


    // 单选题
    singleTopic.forEach((item, index) => {
      let singleCollectScore = []
      item.options.forEach((item1, index1) => {
        if (item1.check == true) {
          let scores = {
            grade: item1.grade,
            label: item1.label
          }
          singleCollectScore.push(scores)
          singMap[item.objectId] = item1.label
          singScoreMap[item.objectId] = singleCollectScore
        }
      })
    })
    // 多选题
    multipleTopic.forEach((item, index) => {
      let collect = []
      let collectScore = []

      item.options.forEach((item1, index1) => {
        if (item1.check && item1.label) {

          let scores = {
            grade: item1.grade,
            label: item1.label
          }
          collectScore.push(scores)
          collect.push(item1.label)


          scoreMap[item.objectId] = collectScore
          mutiMap[item.objectId] = collect

        }
      })
    })


    // let allMap = $.extend({}, singMap, mutiMap)

    let allMap = Object.assign(singMap, mutiMap)
    let totalScore = 0
    let collectNumber = 0
    let singleCollect = 0
    let mutilCollect = 0
    let singleScore = 0
    let multiScore = 0
    console.log(allMap)



    // console.log(allMap)
    Object.keys(testMap).forEach(tid => {
      // console.log(testMap[tid])
      if (testMap[tid] == allMap[tid]) {
        // 
        // console.log(testMap[tid])
        //答对算分
        // console.log(true)
        collectNumber = collectNumber + 1
        singleCollect = singleCollect + 1
        singScoreMap[tid].forEach((item, index) => {
          singleScore = item.grade + singleScore
          totalScore = item.grade + totalScore
        })
      } else {
        var c = this.isContained(allMap[tid], testMap[tid])
        console.log(c)

        if (c) {
          mutilCollect = mutilCollect + 1
          collectNumber = collectNumber + 1
          //多选提漏选
          // console.log(testMap[tid])
          // console.log(scoreMap[tid])
          scoreMap[tid].forEach((item, index) => {
            testMap[tid].map(item1 => {
              if (item.label == item1) {
                // console.log("多选提算分")
                // console.log(item.grade)
                multiScore = item.grade + multiScore
                totalScore = item.grade + totalScore
                // allScore = item.grade + allScore
              }
            })

          })
        }
      }
    })
    // 多选分数

    console.log('总分', totalScore)
    console.log("答对个数", collectNumber)
    console.log("单选正确个数", singleCollect)
    console.log("多选正确个数", mutilCollect)
    console.log("单选得分", singleScore)
    console.log("多选得分", multiScore)


    // Object.keys(testMap).forEach(tid => {
    //   console.log(tid)
    //   let selectArray = testMap[tid];
    //   console.log(resultMap[tid])
    //   let rightArray = resultMap[tid];
    //   console.log(rightArray)
    //   // 过滤掉单选答案
    //   if (rightArray && typeof resultMap[tid] != 'string') {
    //     let isright: boolean = false
    //     if(rightArray.length < testMap[tid]) {
    //       console.log('选多了')
    //       return
    //     } else{
    //       let error:boolean = true
    //       rightArray.forEach(right => {
    //         selectArray.forEach(sitem => {
    //           if(sitem != right.label){
    //             console.log(error)
    //             error =false
    //             console.log(error)
    //           }
    //         })
    //       })
    //       if(error) {
    //         console.log(error)
    //         rightArray.forEach(right => {
    //           console.log(selectArray)
    //             this.total += right.grade;
    //             console.log(right.grade)
    //         })
    //         this.right += 1
    //       }
    //       console.log(this.right)
    //     }
    //   }
    // })
    console.log('总分', totalScore)
    console.log("答对个数", collectNumber)
    console.log("单选正确个数", singleCollect)
    console.log("多选正确个数", mutilCollect)
    console.log("单选得分", singleScore)
    console.log("多选得分", multiScore)
    console.log(testMap)

    this.totalScore = totalScore
    this.right = collectNumber
    this.multiScore = multiScore
    this.singleScore = singleScore
    this.singleRight = singleScore
    this.multiRight = mutilCollect
    console.log('总分：' + this.totalScore, '正确个数' + this.right)
    // let useTime = this.startTime - this.deadline/this.time
    // console.log(this.startTime - this.deadline)
    // console.log(this.startTime)
    // console.log(this.deadline)
    // console.log(useTime)

    this.empty = this.testItem.length - Object.keys(this.testMap).length;
    this.wrong = Object.keys(this.testItem).length - this.right;
    let textCount = this.test.shortAnswerTopic.length
    let currentUser = Parse.User.current();

    console.log(this.testItem.length, Object.keys(this.testMap).length, this.right, this.wrong)
    let profile = JSON.parse(localStorage.getItem("profile"))
    this.profile = profile
    let company = profile.company.objectId;
    let department = profile.department.objectId;
    let profileId = profile.objectId;
    let SurveyLog = Parse.Object.extend("SurveyLog");
    let saveGradeLog = new SurveyLog();
    saveGradeLog.set("user", {
      __type: "Pointer",
      className: '_User',
      objectId: currentUser.id
    })
    saveGradeLog.set("type", "exam2")
    saveGradeLog.set("survey", { __type: "Pointer", className: "Survey", objectId: this.testId })
    // saveGradeLog.set("grade", this.totalScore)
    saveGradeLog.set("answer", this.testMap)
    saveGradeLog.set("shortAnswer", this.textAnswerArray)// 另建一个对象存放简答题答案、objectId
    saveGradeLog.set("right", this.right)
    saveGradeLog.set("wrong", this.wrong)
    saveGradeLog.set("multiScore", this.multiScore)
    saveGradeLog.set("singleScore", this.singleScore)
    saveGradeLog.set("textScore", 0)
    saveGradeLog.set("textItemScore", {})
    saveGradeLog.set("singleRight", this.singleRight)
    saveGradeLog.set("multiRight", this.multiRight)
    saveGradeLog.set("status", false)
    saveGradeLog.set("time", this.startTime - this.deadline)
    saveGradeLog.set("profile", {
      __type: 'Pointer',
      className: 'Profile',
      objectId: profileId
    })
    saveGradeLog.set("department", {
      __type: 'Pointer',
      className: 'Department',
      objectId: department
    })
    saveGradeLog.set("departments", this.profile.departments)
    saveGradeLog.set("company", {
      __type: 'Pointer',
      className: 'Company',
      objectId: company
    })
    saveGradeLog.save()


  }

  showModal(): void {
    this.isVisible = true;
  }
  isContained(aa, bb) {
    if (!(aa instanceof Array) || !(bb instanceof Array) || ((aa.length < bb.length))) {
      return false;
    }
    var aaStr = aa.toString();
    for (var i = 0; i < bb.length; i++) {
      if (aaStr.indexOf(bb[i]) < 0) return false;
    }
    return true;
  }


  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.saveLog()
    this.router.navigate(['/masterol-doctor/student-study/detail'])
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  constructor(private router: Router, private modal: NzModalService) { }

  ngOnInit(): void {

    if (this.testId) {
      localStorage.setItem('testId', this.testId)
    } else {
      this.testId = localStorage.getItem('testId')
    }
    this.getTest()
    // localStorage.setItem("content",JSON.stringify(this.content))
    this.totalScore = 0;


  }
  timeOut() {
    this.modal.warning({
      nzTitle: '答题超时',
      nzContent: '对不起已超时，答题已提交！！！'
    });
    // this.commit()
    this.saveLog()
  }
  async getTest() {
    if (this.testId) {
      let queryTest = new Parse.Query("Survey");
      queryTest.equalTo("objectId", this.testId);
      queryTest.first().then(test => {
        if (test && test.id) {
          console.log(test)
          this.test = test;
          this.time = this.test.get("time")
          this.startTime = Date.now()
          this.deadline = Date.now() + 1000 * 60 * this.time;
          console.log(this.deadline)
          this.getTestItem()
        }
      })

    }
  }
  async getSynthesizeTest() {
    if (this.testId) {
      // let query = new Parse.Query("Survey");
      // query.equalTo("objectId", this.testId);
      let queryTest = new Parse.Query('SurveyItem')
      queryTest.equalTo("survey", this.testId)
      let surveyItem = await queryTest.find()
      console.log(surveyItem)
    }
  }
  async getTestItem() {
    let singleTopic = [];
    let multipleTopic = [];
    let shortAnswerTopic = [];
    let testItem = this.testItem;
    let queryTest = new Parse.Query("SurveyItem");
    queryTest.equalTo("survey", this.testId);
    testItem = await queryTest.find();
    testItem = testItem.map(item => item.toJSON())
    console.log(testItem)
    if (testItem.length > 0) {
      for (let i = 0; i < testItem.length; i++) {
        // 单选题
        if (testItem[i].type == "select-single") {
          singleTopic.push(testItem[i])
        }
        if (testItem[i].type == "select-multiple") {
          multipleTopic.push(testItem[i])
        }
        if (testItem[i].type == "text") {
          shortAnswerTopic.push(testItem[i])
        }
      }
    }
    this.testItem = testItem
    this.test.singleTopic = singleTopic;
    this.test.multipleTopic = multipleTopic;
    this.test.shortAnswerTopic = shortAnswerTopic;
    console.log(this.test.singleTopic,)
    console.log(this.test.multipleTopic)
    console.log(this.test.shortAnswerTopic)
  }

}
