"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SurveyComponent = void 0;
var core_1 = require("@angular/core");
var Parse = require("parse");
var SurveyComponent = /** @class */ (function () {
    function SurveyComponent(activatedRoute, router) {
        this.activatedRoute = activatedRoute;
        this.router = router;
        // 查找题目
        this.question = [];
        this.textItemScore = {};
        this.textTotal = 0;
        this.total = 0;
    }
    SurveyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.paramMap.subscribe(function (parmas) {
            var SurveyLog = new Parse.Query('SurveyLog');
            if (parmas.get('id')) {
                SurveyLog.get(parmas.get('id')).then(function (res) {
                    if (res && res.id) {
                        _this.surveyLog = res;
                        _this.total = ((_this.surveyLog.get('singleScore') && _this.surveyLog.get('singleScore') > 0) ? _this.surveyLog.get('singleScore') : 0) +
                            ((_this.surveyLog.get('multiScore') && _this.surveyLog.get('multiScore') > 0) ? _this.surveyLog.get('multiScore') : 0);
                        _this.answer = res.get('shortAnswer');
                        if (parmas.get('sid')) {
                            _this.queryQuestion(parmas.get('sid'));
                        }
                    }
                });
            }
        });
    };
    SurveyComponent.prototype.queryQuestion = function (sid) {
        var _this = this;
        var SurveyItem = new Parse.Query('SurveyItem');
        SurveyItem.equalTo('survey', sid);
        SurveyItem.equalTo('type', 'text');
        SurveyItem.descending('index');
        SurveyItem.find().then(function (res) {
            _this.question = res;
        });
    };
    // 失去焦点
    SurveyComponent.prototype.gradeChange = function (ev) {
        var score;
        if (this.textItemScore[ev]) {
            score = this.textItemScore[ev];
        }
        else {
            score = 0;
        }
        this.textTotal += score;
        this.total += score;
    };
    // 聚合焦点
    SurveyComponent.prototype.focusChange = function (id) {
        if (this.textItemScore[id]) {
            this.textTotal = this.textTotal - this.textItemScore[id];
            this.total = this.total - this.textItemScore[id];
        }
    };
    SurveyComponent.prototype.submit = function () {
        var _this = this;
        console.log(this.textItemScore, this.total, this.textTotal);
        var scoreMap = Object.keys(this.textItemScore);
        var answer = Object.keys(this.answer);
        if (scoreMap.length < answer.length) {
            alert('还有题没有评分,请完成所有题评分');
            return;
        }
        var SurveyLog = new Parse.Query('SurveyLog');
        SurveyLog.get(this.surveyLog.id).then(function (res) {
            res.set('textItemScore', _this.textItemScore);
            res.set('textScore', _this.textTotal);
            res.set('status', true);
            res.set('grade', _this.total);
            res.save().then(function (r) {
                // masterol/corrects-papers;rid=nU0yOjxXYU
                console.log(res);
                _this.router.navigate(['/masterol-doctor/corrects-papers', { rid: 'nU0yOjxXYU' }]);
            });
        });
    };
    SurveyComponent = __decorate([
        core_1.Component({
            selector: 'app-survey',
            templateUrl: './survey.component.html',
            styleUrls: ['./survey.component.scss']
        })
    ], SurveyComponent);
    return SurveyComponent;
}());
exports.SurveyComponent = SurveyComponent;
