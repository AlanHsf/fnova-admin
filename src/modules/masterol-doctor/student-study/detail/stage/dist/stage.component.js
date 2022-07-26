"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.StageComponent = void 0;
var core_1 = require("@angular/core");
var Parse = require("parse");
var StageComponent = /** @class */ (function () {
    function StageComponent(router) {
        this.router = router;
        this.test = [];
    }
    StageComponent.prototype.ngOnInit = function () {
        this.getTest();
        this.date = new Date();
    };
    StageComponent.prototype.getTest = function () {
        var _this = this;
        this.test = [];
        if (this.stageIdArray.length > 0) {
            for (var i = 0; i < this.stageIdArray.length; i++) {
                var queryTest = new Parse.Query("Survey");
                queryTest.equalTo("objectId", this.stageIdArray[i]);
                // queryTest.ascending("order");
                queryTest.first().then(function (testItem) {
                    _this.getSurveyLog(testItem);
                });
            }
            console.log(this.test);
        }
    };
    StageComponent.prototype.getSurveyLog = function (testItem) {
        var _this = this;
        var testItem2 = testItem.toJSON();
        this.test.push(testItem2);
        var currentUser = Parse.User.current();
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
        var queryLog = new Parse.Query("SurveyLog");
        queryLog.equalTo("user", currentUser.id);
        queryLog.equalTo("survey", testItem.id);
        console.log(testItem);
        queryLog.equalTo("company", localStorage.getItem('company'));
        queryLog.descending("updatedAt");
        queryLog.first().then(function (log) {
            if (log && log.id) {
                _this.test.forEach(function (titem, index) {
                    if (titem.objectId == testItem2.objectId) {
                        _this.test[index].status = log.get('status');
                        // console.log(this.test[index]);
                    }
                });
            }
        });
        // }
        // })
    };
    // 跳转到测试页面
    StageComponent.prototype.toTest = function (types, id, content) {
        this.router.navigate(["/masterol-doctor/student-test", { type: types, id: id, content: content }]);
    };
    __decorate([
        core_1.Input()
    ], StageComponent.prototype, "stageIdArray");
    StageComponent = __decorate([
        core_1.Component({
            selector: 'detail-stage',
            templateUrl: './stage.component.html',
            styleUrls: ['./stage.component.less']
        })
    ], StageComponent);
    return StageComponent;
}());
exports.StageComponent = StageComponent;
