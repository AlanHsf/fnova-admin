"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SynthesizeComponent = void 0;
var core_1 = require("@angular/core");
var Parse = require("parse");
var SynthesizeComponent = /** @class */ (function () {
    function SynthesizeComponent(router, message) {
        this.router = router;
        this.message = message;
        this.SurveyLog = [];
        this.test = [];
    }
    SynthesizeComponent.prototype.ngOnInit = function () {
        this.getTest();
    };
    SynthesizeComponent.prototype.getTest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var testItem, queryTest;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.synthesizeIdArray) {
                    queryTest = new Parse.Query("Survey");
                    queryTest.equalTo("objectId", this.synthesizeIdArray[0]);
                    queryTest.first().then(function (res) {
                        if (res && res.id) {
                            _this.test.push(res.toJSON());
                            _this.getSurveyLog(2);
                        }
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    SynthesizeComponent.prototype.getSurveyLog = function (type) {
        var _this = this;
        var currentUser = Parse.User.current();
        if (type == "2") {
            this.synthesizeIdArray.forEach(function (item) {
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
                var queryLog2 = new Parse.Query("SurveyLog");
                queryLog2.equalTo("user", currentUser.id);
                queryLog2.equalTo("survey", item);
                queryLog2.equalTo("company", localStorage.getItem('company'));
                queryLog2.first().then(function (log2) {
                    if (log2 && log2.id) {
                        _this.SurveyLog.push(log2);
                        if (_this.test && _this.test.length > 0 && _this.SurveyLog && _this.SurveyLog.length) {
                            _this.test.forEach(function (stage, index) {
                                if (_this.SurveyLog[index] && stage.objectId == _this.SurveyLog[index].get('survey').id) {
                                    if (_this.SurveyLog[index].get('status') == false) {
                                        _this.test[index].status = false;
                                        console.log(_this.SurveyLog[index], stage.objectId, _this.test[index].status);
                                    }
                                    else if (_this.SurveyLog[index].get('status')) {
                                        _this.test[index].status = true;
                                    }
                                    else {
                                        _this.test[index].status = undefined;
                                    }
                                }
                            });
                        }
                    }
                });
                // }
                // }
                // )
            });
        }
        // if(SurveyLog.)
    };
    // 跳转到测试页面
    SynthesizeComponent.prototype.toTest = function (types, id, content) {
        // if(!types && !id && !content){
        //   this.message.error('请先观看完视频')
        // }else {
        this.router.navigate(["/masterol-doctor/student-test", { type: types, id: id, content: content }]);
        // }
    };
    __decorate([
        core_1.Input()
    ], SynthesizeComponent.prototype, "synthesizeIdArray");
    __decorate([
        core_1.Input()
    ], SynthesizeComponent.prototype, "lessonStatus");
    SynthesizeComponent = __decorate([
        core_1.Component({
            selector: 'detail-synthesize',
            templateUrl: './synthesize.component.html',
            styleUrls: ['./synthesize.component.less']
        })
    ], SynthesizeComponent);
    return SynthesizeComponent;
}());
exports.SynthesizeComponent = SynthesizeComponent;
