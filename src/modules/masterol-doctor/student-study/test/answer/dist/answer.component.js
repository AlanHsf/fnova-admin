"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.AnswerComponent = void 0;
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var Parse = require("parse");
var AnswerComponent = /** @class */ (function () {
  function AnswerComponent(router, modal) {
    this.router = router;
    this.modal = modal;
    this.getStatus = new core_2.EventEmitter(); // 用 EventEmitter 和 output 装饰器配合使用 <string>指定类型变量
    // 答题状态  complete 已完成  uncomplete 未完成
    this.complete = true;
    this.uncomplete = false;
    this.testMap = {};
    this.label = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    this.totalScore = 0;
    this.right = 0;
    this.wrong = 0;
    this.empty = 0;
    // 试卷题目数组
    this.testItem = [];
    // 简答题答案集合
    this.textAnswerArray = {};
    this.isVisible = false;
    this.isVisible2 = false;
  }
  AnswerComponent.prototype.radioChange = function () {
    console.log(this.testMap);
  };
  AnswerComponent.prototype.checkboxChange = function (e, index, item) {
    // console.log(e, index)
    this.testMap[item.objectId] = e;
    // console.log(this.testMap)
  };
  // 交卷
  AnswerComponent.prototype.commit = function () {
    var topics = this.testMap.filter(function (topic) {
      if (topic) {
        return topic;
      }
    });
    var texts = this.textAnswerArray.filter(function (text) {
      if (text) {
        return text;
      }
    });
    if (this.testItem.length > topics.length + texts.length) {
      this.isVisible2 = true;
    } else {
      this.showModal();
      // this.content = 2;
    }
    // 向父组件广播数据
    // this.getStatus.emit(this.content)
  };
  // showModal(): void {
  //   this.isVisible = true;
  // }
  // handleOk(): void {
  //   console.log('Button ok clicked!');
  //   this.isVisible = false;
  //   this.saveLog()
  // }
  AnswerComponent.prototype.saveLog = function () {
    var _this = this;
    var singleTopic = this.test.singleTopic;
    var multipleTopic = this.test.multipleTopic;
    var testMap = this.testMap;
    // 正确答案对象
    var resultMap = {};
    var result = [];
    var singMap = {};
    var mutiMap = {};
    var scoreMap = {};
    var singScoreMap = {};
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
    singleTopic.forEach(function (item, index) {
      var singleCollectScore = [];
      item.options.forEach(function (item1, index1) {
        if (item1.check == true) {
          var scores = {
            grade: item1.grade,
            label: item1.label,
          };
          singleCollectScore.push(scores);
          singMap[item.objectId] = item1.label;
          singScoreMap[item.objectId] = singleCollectScore;
        }
      });
    });
    // 多选题
    multipleTopic.forEach(function (item, index) {
      var collect = [];
      var collectScore = [];
      item.options.forEach(function (item1, index1) {
        if (item1.check && item1.label) {
          var scores = {
            grade: item1.grade,
            label: item1.label,
          };
          collectScore.push(scores);
          collect.push(item1.label);
          scoreMap[item.objectId] = collectScore;
          mutiMap[item.objectId] = collect;
        }
      });
    });
    // let allMap = $.extend({}, singMap, mutiMap)
    var allMap = Object.assign(singMap, mutiMap);
    var totalScore = 0;
    var collectNumber = 0;
    var singleCollect = 0;
    var mutilCollect = 0;
    var singleScore = 0;
    var multiScore = 0;
    console.log(allMap);
    // console.log(allMap)
    Object.keys(testMap).forEach(function (tid) {
      // console.log(testMap[tid])
      if (testMap[tid] == allMap[tid]) {
        //
        // console.log(testMap[tid])
        //答对算分
        // console.log(true)
        collectNumber = collectNumber + 1;
        singleCollect = singleCollect + 1;
        singScoreMap[tid].forEach(function (item, index) {
          singleScore = item.grade + singleScore;
          totalScore = item.grade + totalScore;
        });
      } else {
        var c = _this.isContained(allMap[tid], testMap[tid]);
        console.log(c);
        if (c) {
          mutilCollect = mutilCollect + 1;
          collectNumber = collectNumber + 1;
          //多选提漏选
          // console.log(testMap[tid])
          // console.log(scoreMap[tid])
          scoreMap[tid].forEach(function (item, index) {
            testMap[tid].map(function (item1) {
              if (item.label == item1) {
                // console.log("多选提算分")
                // console.log(item.grade)
                multiScore = item.grade + multiScore;
                totalScore = item.grade + totalScore;
                // allScore = item.grade + allScore
              }
            });
          });
        }
      }
    });
    // 多选分数
    console.log("总分", totalScore);
    console.log("答对个数", collectNumber);
    console.log("单选正确个数", singleCollect);
    console.log("多选正确个数", mutilCollect);
    console.log("单选得分", singleScore);
    console.log("多选得分", multiScore);
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
    console.log("总分", totalScore);
    console.log("答对个数", collectNumber);
    console.log("单选正确个数", singleCollect);
    console.log("多选正确个数", mutilCollect);
    console.log("单选得分", singleScore);
    console.log("多选得分", multiScore);
    console.log(testMap);
    this.totalScore = totalScore;
    this.right = collectNumber;
    this.multiScore = multiScore;
    this.singleScore = singleScore;
    this.singleRight = singleScore;
    this.multiRight = mutilCollect;
    console.log("总分：" + this.totalScore, "正确个数" + this.right);
    // let useTime = this.startTime - this.deadline/this.time
    // console.log(this.startTime - this.deadline)
    // console.log(this.startTime)
    // console.log(this.deadline)
    // console.log(useTime)
    this.empty = this.testItem.length - Object.keys(this.testMap).length;
    this.wrong = Object.keys(this.testItem).length - this.right;
    var textCount = this.test.shortAnswerTopic.length;
    var currentUser = Parse.User.current();
    console.log(
      this.testItem.length,
      Object.keys(this.testMap).length,
      this.right,
      this.wrong
    );
    var profile = JSON.parse(localStorage.getItem("profile"));
    this.profile = profile;
    var company = profile.company.objectId;
    var department = profile.department.objectId;
    var profileId = profile.objectId;
    var SurveyLog = Parse.Object.extend("SurveyLog");
    var saveGradeLog = new SurveyLog();
    saveGradeLog.set("user", {
      __type: "Pointer",
      className: "_User",
      objectId: currentUser.id,
    });
    saveGradeLog.set("type", "exam2");
    saveGradeLog.set("survey", {
      __type: "Pointer",
      className: "Survey",
      objectId: this.testId,
    });
    // saveGradeLog.set("grade", this.totalScore)
    saveGradeLog.set("answer", this.testMap);
    saveGradeLog.set("shortAnswer", this.textAnswerArray); // 另建一个对象存放简答题答案、objectId
    saveGradeLog.set("right", this.right);
    saveGradeLog.set("wrong", this.wrong);
    saveGradeLog.set("multiScore", this.multiScore);
    saveGradeLog.set("singleScore", this.singleScore);
    saveGradeLog.set("textScore", 0);
    saveGradeLog.set("textItemScore", {});
    saveGradeLog.set("singleRight", this.singleRight);
    saveGradeLog.set("multiRight", this.multiRight);
    saveGradeLog.set("status", false);
    saveGradeLog.set("time", this.startTime - this.deadline);
    saveGradeLog.set("profile", {
      __type: "Pointer",
      className: "Profile",
      objectId: profileId,
    });
    saveGradeLog.set("department", {
      __type: "Pointer",
      className: "Department",
      objectId: department,
    });
    saveGradeLog.set("departments", this.profile.departments);
    saveGradeLog.set("company", {
      __type: "Pointer",
      className: "Company",
      objectId: company,
    });
    saveGradeLog.save();
  };
  AnswerComponent.prototype.showModal = function () {
    this.isVisible = true;
  };
  AnswerComponent.prototype.isContained = function (aa, bb) {
    if (
      !(aa instanceof Array) ||
      !(bb instanceof Array) ||
      aa.length < bb.length
    ) {
      return false;
    }
    var aaStr = aa.toString();
    for (var i = 0; i < bb.length; i++) {
      if (aaStr.indexOf(bb[i]) < 0) return false;
    }
    return true;
  };
  AnswerComponent.prototype.handleOk = function () {
    console.log("Button ok clicked!");
    this.isVisible = false;
    this.saveLog();
    this.router.navigate(["/masterol-doctor/student-study/detail"]);
  };
  AnswerComponent.prototype.handleCancel = function () {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  };
  AnswerComponent.prototype.ngOnInit = function () {
    if (this.testId) {
      localStorage.setItem("testId", this.testId);
    } else {
      this.testId = localStorage.getItem("testId");
    }
    this.getTest();
    // localStorage.setItem("content",JSON.stringify(this.content))
    this.totalScore = 0;
  };
  AnswerComponent.prototype.timeOut = function () {
    this.modal.warning({
      nzTitle: "答题超时",
      nzContent: "对不起已超时，答题已提交！！！",
    });
    // this.commit()
    this.saveLog();
  };
  AnswerComponent.prototype.getTest = function () {
    return __awaiter(this, void 0, void 0, function () {
      var queryTest;
      var _this = this;
      return __generator(this, function (_a) {
        if (this.testId) {
          queryTest = new Parse.Query("Survey");
          queryTest.equalTo("objectId", this.testId);
          queryTest.first().then(function (test) {
            if (test && test.id) {
              console.log(test);
              _this.test = test;
              _this.time = _this.test.get("time");
              _this.startTime = Date.now();
              _this.deadline = Date.now() + 1000 * 60 * _this.time;
              console.log(_this.deadline);
              _this.getTestItem();
            }
          });
        }
        return [2 /*return*/];
      });
    });
  };
  AnswerComponent.prototype.getSynthesizeTest = function () {
    return __awaiter(this, void 0, void 0, function () {
      var queryTest, surveyItem;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.testId) return [3 /*break*/, 2];
            queryTest = new Parse.Query("SurveyItem");
            queryTest.equalTo("survey", this.testId);
            return [4 /*yield*/, queryTest.find()];
          case 1:
            surveyItem = _a.sent();
            console.log(surveyItem);
            _a.label = 2;
          case 2:
            return [2 /*return*/];
        }
      });
    });
  };
  AnswerComponent.prototype.getTestItem = function () {
    return __awaiter(this, void 0, void 0, function () {
      var singleTopic, multipleTopic, shortAnswerTopic, testItem, queryTest, i;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            singleTopic = [];
            multipleTopic = [];
            shortAnswerTopic = [];
            testItem = this.testItem;
            queryTest = new Parse.Query("SurveyItem");
            queryTest.equalTo("survey", this.testId);
            return [4 /*yield*/, queryTest.find()];
          case 1:
            testItem = _a.sent();
            testItem = testItem.map(function (item) {
              return item.toJSON();
            });
            console.log(testItem);
            if (testItem.length > 0) {
              for (i = 0; i < testItem.length; i++) {
                // 单选题
                if (testItem[i].type == "select-single") {
                  singleTopic.push(testItem[i]);
                }
                if (testItem[i].type == "select-multiple") {
                  multipleTopic.push(testItem[i]);
                }
                if (testItem[i].type == "text") {
                  shortAnswerTopic.push(testItem[i]);
                }
              }
            }
            this.testItem = testItem;
            this.test.singleTopic = singleTopic;
            this.test.multipleTopic = multipleTopic;
            this.test.shortAnswerTopic = shortAnswerTopic;
            console.log(this.test.singleTopic);
            console.log(this.test.multipleTopic);
            console.log(this.test.shortAnswerTopic);
            return [2 /*return*/];
        }
      });
    });
  };
  __decorate([core_2.Input()], AnswerComponent.prototype, "content");
  __decorate([core_2.Input()], AnswerComponent.prototype, "testId");
  __decorate([core_2.Input()], AnswerComponent.prototype, "type");
  __decorate([core_1.Output()], AnswerComponent.prototype, "getStatus");
  AnswerComponent = __decorate(
    [
      core_2.Component({
        selector: "test-answer",
        templateUrl: "./answer.component.html",
        styleUrls: ["./answer.component.scss"],
      }),
    ],
    AnswerComponent
  );
  return AnswerComponent;
})();
exports.AnswerComponent = AnswerComponent;
