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
exports.StudyNavComponent = void 0;
var core_1 = require("@angular/core");
var Parse = require("parse");
var StudyNavComponent = /** @class */ (function () {
    function StudyNavComponent(router, activatedRoute) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.tabs = [
            {
                name: "我的学习",
                icon: "../../../assets/img/masterol/img/study.png"
            },
            {
                name: "考试计划",
                icon: "../../../assets/img/masterol/img/pyfa.png"
            },
            {
                name: "我的课表",
                icon: "../../../assets/img/masterol/img/kb.png"
            },
            // {
            //   name: "我的考试",
            //   icon: "../../../assets/img/masterol/img/test.png"
            // },
            {
                name: "我的成绩",
                icon: "../../../assets/img/masterol/img/cj.png"
            },
            {
                name: "我的论文",
                icon: "../../../assets/img/masterol/img/lw.png"
            },
            {
                name: "毕业档案",
                icon: "../../../assets/img/masterol/img/by.png"
            },
        ];
        this.pageType = 'detail';
    }
    // LessonId: any;
    StudyNavComponent.prototype.getLogo = function () {
        var _this = this;
        console.log(999999);
        var logo = localStorage.getItem('logo');
        if (logo) {
            this.logo = logo;
        }
        else {
            var queryLogo = new Parse.Query("Company");
            queryLogo.equalTo("objectId", localStorage.getItem('company'));
            // queryProfile.include("SchoolMajor");
            queryLogo.first().then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log(res);
                    if (res && res.id) {
                        logo = res.get('logo');
                        this.logo = logo;
                        console.log(this.logo);
                        localStorage.setItem('logo', this.logo);
                    }
                    return [2 /*return*/];
                });
            }); });
        }
        // let queryLogo = new Parse.Query("Company");
        // queryLogo.equalTo("objectId", 'pPZbxElQQo');
        // // queryProfile.include("SchoolMajor");
        // queryLogo.first().then(async res => {
        //   console.log(res)
        //   if (res && res.id) {
        //     this.logo = res.get('logo')
        //     console.log(this.logo)
        //   }
        // })
    };
    StudyNavComponent.prototype.ngOnInit = function () {
        this.getLogo();
        this.url = this.router.url.split(';');
        this.pathUrl = this.url[0];
        this.pathParam = this.url[1];
        if (!this.LessonId) {
            this.LessonId = localStorage.getItem("LessonId");
            // localStorage.getItem("LessonId",this.LessonId)
        }
        // this.activatedRoute.paramMap.subscribe(params => {
        //   console.log(params)
        //   let type = params.get('type');
        //   let lesson = params.get('lesson');
        //   if(type == "detail"){
        //     this.currentNav = 0
        //   }
        //   // if(type == "test" && )
        // });
        // console.log(this.pathUrl,this.pathParam)
        if (this.pathUrl == "/masterol-doctor/student-study/detail") {
            this.currentNav = 0;
            // console.log(this.currentNav)
            // console.log(this.pathUrl)
        }
        if (this.pathUrl == "/masterol-doctor/student-study/test" && this.pathParam == 'type=1') {
            this.currentNav = 1;
            // console.log(this.currentNav)
        }
        else if (this.pathUrl == "/masterol-doctor/student-study/test" && this.pathParam == 'type=2') {
            this.currentNav = 2;
            // console.log(this.currentNav)
        }
        this.getTestTitle();
    };
    StudyNavComponent.prototype.getTestTitle = function () {
        var _this = this;
        // console.log(this.LessonId)
        var query = new Parse.Query("Lesson");
        query.equalTo("objectId", this.LessonId);
        query.first().then(function (res) {
            var lesson = res;
            // console.log(lesson)
            if (lesson && lesson.id) {
                _this.title = lesson.get("title");
                // console.log(this.title)
            }
        });
    };
    // back(k){
    //   self.location.href="../../masterol " 
    // }
    StudyNavComponent.prototype.back = function () {
        this.router.navigate(["masterol/student-center"]);
    };
    // 跳转到测试页面   navigate跳转不能写路由相对路径 报错 
    StudyNavComponent.prototype.toTest = function (pageType, types) {
        // if (!types) {
        if (pageType == 'detail') {
            this.router.navigate(["masterol-doctor/student-study/detail"]);
            this.currentNav = 0;
            // console.log(123)
        }
        if (pageType == 'test') {
            this.router.navigate(["masterol-doctor/student-study/test", { type: types }]);
            this.currentNav = types;
        }
        // if (this.pathUrl == "/masterol/student-study/detail") {
        //   this.currentNav = 0
        //   console.log(this.currentNav)
        //   console.log(this.pathUrl)
        // }
        // }
        // console.log(this.currentNav)
        // this.router.navigate(["masterol/student-study/test", { type: types }])
    };
    StudyNavComponent.prototype.toHomeNav = function (i) {
        this.router.navigate(['masterol-doctor/student-center', { i: i }]);
    };
    __decorate([
        core_1.Input()
    ], StudyNavComponent.prototype, "LessonId");
    StudyNavComponent = __decorate([
        core_1.Component({
            selector: 'study-nav',
            templateUrl: './study-nav.component.html',
            styleUrls: ['./study-nav.component.scss']
        })
    ], StudyNavComponent);
    return StudyNavComponent;
}());
exports.StudyNavComponent = StudyNavComponent;
