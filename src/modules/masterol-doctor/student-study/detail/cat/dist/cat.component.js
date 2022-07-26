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
exports.CatComponent = void 0;
var core_1 = require("@angular/core");
var Parse = require("parse");
var ts_md5_1 = require("ts-md5");
// 视频组件
var video_js_1 = require("video.js");
require("video.js/dist/video-js.min.css");
require("videojs-contrib-hls");
// import "videojs-flash";
// 视频组件
// import videojs, { VideoJsPlayerOptions } from "video.js";
// import 'video.js/dist/video-js.min.css';
// import "videojs-contrib-hls";
// import "videojs-flash";
var CatComponent = /** @class */ (function () {
    function CatComponent(sanitizer, el, router, authServ, cdRef) {
        this.sanitizer = sanitizer;
        this.el = el;
        this.router = router;
        this.authServ = authServ;
        this.cdRef = cdRef;
        this.recordMap = {};
        this.preventTime = 0;
        this.active = false;
        this.playtime = 0;
        this.TimeSet = 0;
        this.compareTime = 0;
        this.isCollapsed = false;
        this.isBan = true;
        // checkSurveyArray: any = [];
        // checkSurveyArray2: any = [];
        // getcheckTestSurvey() {
        //   let querySurvey = new Parse.Query("SurveyItem");
        //   querySurvey.equalTo("survey", 'M9Da5FE2aV')
        //   querySurvey.select("title", 'options')
        //   querySurvey.find().then(surveyArray => {
        //     surveyArray.forEach(item => {
        //       let id = item.id
        //       let item2 = item.toJSON()
        //       this.checkSurveyArray[id] = item2
        //       this.checkSurveyArray2[id] = item2
        //     })
        //   })
        // }
        // 过程性考核
        // 开始考核
        // drawTestOpen(): void {
        //   this.visibleTest = true;
        // }
        this.visibleTest = false;
        this.label = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        // 弹窗的时间点
        this.toTestTime = 0;
        // 已经弹出过的题目数组
        this.testedArray = [];
        // 进入页面时不自动播放，所以展示的第一个视频是可以直接点击的 控制进入页面后第一次点击video并且点击的是第一个视频就弹出验证弹窗
        this.videoPlay = false;
        // 视频播放 弹窗
        this.visibleDraw = false;
        this.visibleDraw2 = false;
        this.df = true;
        this.isVerifying = false;
        // 查询是否通过验证
        // 显示加载状态
        this.isSpinning = true;
        this.recordTime = 0;
        this.footerRender = function () { return "extra footer"; };
        this.sessionVisible = false;
    }
    CatComponent.prototype.getRecordByKey = function (key, query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(key);
                        if (!(this.recordMap[key] && this.recordMap[key].id)) return [3 /*break*/, 1];
                        return [2 /*return*/, this.recordMap[key]];
                    case 1:
                        if (!query) return [3 /*break*/, 3];
                        return [4 /*yield*/, query.first()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    CatComponent.prototype.ngOnInit = function () {
        console.log("2020-2-7");
        // this.cdRef.detectChanges()
        document.oncontextmenu =function () {return false; };
        this.profile = JSON.parse(localStorage.getItem("profile"));
        this.article = [];
        this.section = [];
        this.getArticle();
        var myVideo = video_js_1["default"]("player-video", {
            bigPlayButton: true,
            textTrackDisplay: false,
            posterImage: false,
            errorDisplay: false
        });
        myVideo.play();
        // this.getcheckTestSurvey()
    };
    CatComponent.prototype.getUrl = function (url) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(url); // 获取安全链接
    };
    CatComponent.prototype.radioChange = function () {
        console.log(this.surveyItem, this.surveyItem2);
    };
    // 确认答题
    CatComponent.prototype.drawcheckOption = function () {
        var _this = this;
        // this.surveyArray = this.surveyArray.filter(item => {
        //   return item.objectId !== this.surveyItem.objectId
        // })
        this.surveyItem.options.forEach(function (option) {
            if (option.grade !== 0) {
                if (option.label == _this.surveyItem2) {
                    _this.visibleTest = false;
                    video_js_1["default"](_this.vpid).play();
                    _this.surveyItem2 = "";
                }
                else {
                    _this.tips = "回答错误，请重新观看!";
                    _this.surveyItem2 = "";
                    setTimeout(function () {
                        _this.router.navigate(["masterol-doctor/student-center"]);
                    }, 1000);
                }
            }
        });
    };
    CatComponent.prototype.videoClick = function () {
        // if (this.videoPlay == false && this.firstVideoUrl != '' && this.firstVideoUrl == this.videoUrl['changingThisBreaksApplicationSecurity']) {
        //   this.videoPlay = true
        //   this.drawOpen()
        // }
    };
    CatComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // 获取过程性考核试题
        var querySurvey = new Parse.Query("SurveyItem");
        querySurvey.equalTo("survey", "M9Da5FE2aV");
        querySurvey.select("title", "options");
        querySurvey.find().then(function (surveyArray) {
            // this.surveyArray =
            var tmpArr = [];
            surveyArray.forEach(function (item) {
                var tmp = item.toJSON();
                tmpArr.push(tmp);
            });
            _this.surveyArray = tmpArr;
            // this.surveyArray = surveyArray
            // that.mathSurveyItem(surveyArray)
        });
        // this.video = document.querySelector("#player-video")
        this.video = document.getElementById(this.videoPid);
        this.getArticle();
        // this.video.addEventListener('pause', function () {
        // })
    };
    CatComponent.prototype.toggleCollapsed = function () {
        this.isCollapsed = !this.isCollapsed;
    };
    // 获取章节数据
    CatComponent.prototype.open = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var aid, LessonArticle, sections, queryLog, sections_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        aid = this.article[index].id;
                        LessonArticle = new Parse.Query('LessonArticle');
                        LessonArticle.equalTo('lesson', this.lessonId);
                        LessonArticle.equalTo('parent', aid);
                        LessonArticle.ascending("index");
                        return [4 /*yield*/, LessonArticle.find()];
                    case 1:
                        sections = _a.sent();
                        if (sections && sections.length > 0) {
                            sections.forEach(function (section) {
                                var queryLog = new Parse.Query('LessonRecord');
                                queryLog.equalTo('lessonArticle', section.id);
                                queryLog.equalTo('user', _this.profile.objectId);
                                queryLog.descending("time");
                                queryLog.first().then(function (res) {
                                    if (res && res.id && res.get('status') == 2) {
                                        section['status'] = '已学完';
                                    }
                                    else if (res && res.id && res.get('status') == 1) {
                                        section['status'] = '在学习';
                                    }
                                    else {
                                        section['status'] = '待学习';
                                    }
                                });
                            });
                            this.article[index].sections = sections;
                        }
                        else {
                            queryLog = new Parse.Query('LessonRecord');
                            queryLog.equalTo('lessonArticle', this.article[index].id);
                            queryLog.equalTo('user', this.profile.objectId);
                            queryLog.descending("time");
                            sections_1 = Object.assign({}, this.article[index]);
                            queryLog.first().then(function (res) {
                                if (res && res.id && res.get('status') == 2) {
                                    sections_1['status'] = '已学完';
                                }
                                else if (res && res.id && res.get('status') == 1) {
                                    sections_1['status'] = '在学习';
                                }
                                else {
                                    sections_1['status'] = '待学习';
                                }
                                _this.article[index].sections = [sections_1];
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CatComponent.prototype.getArticle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var LessonArticle, article, index, firstVideoUrl;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.article = [];
                        this.section = [];
                        LessonArticle = new Parse.Query('LessonArticle');
                        LessonArticle.equalTo('lesson', this.lessonId);
                        LessonArticle.equalTo('parent', undefined);
                        LessonArticle.ascending("index");
                        return [4 /*yield*/, LessonArticle.find()];
                    case 1:
                        article = _a.sent();
                        this.article = article;
                        index = 0;
                        firstVideoUrl = "";
                        this.open(index).then(function (res) {
                            if (firstVideoUrl == "" && _this.article[0].sections[0].get("videoUrl")) {
                                if (_this.article.length) {
                                    firstVideoUrl = _this.article[0].sections[0].get("videoUrl");
                                }
                                _this.firstVideoUrl = firstVideoUrl;
                            }
                            _this.playVideo(firstVideoUrl, _this.article[0].sections[0], _this.df);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CatComponent.prototype.setbgd = function (event) {
        // console.log(event)
        var p = "";
        if ((event = "在学习")) {
            p = "RGBA(54, 153, 255, 1)";
        }
        else if ((event = "待学习")) {
            p = "RGBA(245, 0, 0, 1)";
        }
        else {
            p = "RGBA(170, 168, 168, 1)";
        }
        return { "color": p };
    };
    CatComponent.prototype.getArticleStatus = function (id) {
        // console.log(123456789)
        // return "1213"
        var queryLog = new Parse.Query('LessonRecord');
        queryLog.equalTo('lessonArticle', id);
        queryLog.equalTo('user', this.profile.objectId);
        queryLog.first().then(function (res) {
            if (res && res.id && res.get('status') == 2) {
                return '已学完';
            }
            else if (res && res.id && res.get('status') == 1) {
                return '在学习';
            }
            else {
                return '待学习';
            }
        });
    };
    CatComponent.prototype.drawOpen = function () {
        this.visibleDraw = true;
    };
    // 显示二维码 创建验证信息
    CatComponent.prototype.drawGetCode = function () {
        var _this = this;
        this.visibleDraw = false;
        this.visibleDraw2 = true;
        var QueryVerify = Parse.Object.extend("LessonVerify");
        var queryVerify = new QueryVerify();
        queryVerify.set("profile", {
            __type: "Pointer",
            className: "Profile",
            objectId: this.profile.id
        });
        queryVerify.set("departments", this.profile.departments);
        queryVerify.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: this.profile.company.objectId
        });
        queryVerify.set("section", {
            __type: "Pointer",
            className: "LessonArticle",
            objectId: this.lessonArticleId
        });
        queryVerify.set("verify", false);
        queryVerify.save().then(function (res) {
            _this.verifyId = res.id;
        });
        this.isVerifying = true;
        setInterval(function () {
            _this.getIsVerify();
        }, 3000);
        // this.video.play();
    };
    CatComponent.prototype.getIsVerify = function () {
        var _this = this;
        if (this.isVerifying) {
            var queryVerify2 = new Parse.Query("LessonVerify");
            queryVerify2.equalTo("section", this.lessonArticleId);
            queryVerify2.equalTo("objectId", this.verifyId);
            queryVerify2.first().then(function (res) {
                if (res && res.id) {
                    if (res.get("verify") == true) {
                        _this.isSpinning = false;
                        setTimeout(function () {
                            _this.isVerifying = false;
                            _this.visibleDraw2 = false;
                            // clearInterval(this.int);
                            video_js_1["default"](_this.vpid).play();
                            _this.isSpinning = true;
                        }, 2000);
                    }
                }
            });
        }
    };
    CatComponent.prototype.drawClose = function () {
        this.visibleDraw = false;
        this.router.navigate(["masterol-doctor/student-center"]);
    };
    CatComponent.prototype.drawClose2 = function () {
        this.visibleDraw2 = false;
        this.router.navigate(["masterol-doctor/student-center"]);
    };
    CatComponent.prototype.playVideo = function (videoUrl, section, df) {
        return __awaiter(this, void 0, void 0, function () {
            var parentArticleId, that, options, vpid, videoEl;
            return __generator(this, function (_a) {
                this.recordKeyCurrent = this.profile.objectId + section.id;
                if (!this.recordMap[this.recordKeyCurrent]) {
                    this.recordTime = 0;
                }
                if (section) {
                    this.link = section.get("attachment");
                }
                parentArticleId = section.get("parent").id;
                that = this;
                if (videoUrl.indexOf("m3u8") > 0 || videoUrl.indexOf("m3u") > 0) {
                    that.safeType = "application/x-mpegURL";
                }
                else if (videoUrl.indexOf("mp4") > 0) {
                    that.safeType = "video/mp4";
                }
                else {
                    that.safeType = "rtmp/flv";
                }
                that.safeUrl = that.sanitizer.bypassSecurityTrustUrl(videoUrl);
                options = {
                    controls: true,
                    autoplay: false,
                    techOrder: ["html5"],
                    isFullscreen: true,
                    sources: [
                        {
                            src: videoUrl,
                            type: that.safeType
                        }
                    ],
                    html5: {
                        hls: {
                        // withCredentials: true
                        }
                    }
                };
                vpid = String(ts_md5_1.Md5.hashStr(videoUrl));
                this.vpid = vpid;
                video_js_1["default"].getAllPlayers().forEach(function (vpls) {
                    vpls.dispose();
                });
                if (that.player) {
                    // 若已存在则重置
                    video_js_1["default"].getAllPlayers().forEach(function (vpls) {
                        vpls.dispose();
                    });
                    that.player = null;
                    document.getElementById("videoContainer").innerHTML = "\n      <video  object-fit=\"scale-down\" preload=\"metadata\" \n      controls=\"true\" autoplay=\"false\"\n      style=\"width:100%;\"\n          id=\"" + vpid + "\" \n          class=\"video-js vjs-default-skin vjs-big-play-centered vjs-16-9\"\n          playsinline=\"true\" x-webkit-airplay=\"allow\" webkit-playsinline playsinline x5-video-player-type=\"h5\"\n          x5-video-player-fullscreen=\"true\"\n          data-setup='{}'>\n                <source src=\"" + videoUrl + "\" type=\"" + that.safeType + "\">\n                <source src=\"" + videoUrl + "\" type=\"" + that.safeType + "\">\n            <p class=\"vjs-no-js\">\n              To view this video please enable JavaScript, and consider upgrading to a\n              web browser that\n              <a href=\"https://videojs.com/html5-video-support/\" target=\"_blank\">\n                supports HTML5 video\n              </a>\n            </p>\n        </video>\n        ";
                }
                this.videoPid = vpid;
                console.log("vpid", vpid);
                videoEl = document.getElementById(vpid);
                that.player = video_js_1["default"](videoEl, options, function onPlayerReady() {
                    var _this = this;
                    console.log("onPlayerReady", video_js_1["default"](vpid));
                    video_js_1["default"](vpid).controls = true;
                    // videojs(vpid).currentTime(that.recordTime);
                    // 弹出人脸识别
                    // var isMousedown = false;
                    // resetTime = videojs(vpid).currentTime();
                    // videojs(vpid).on("pause", function () {
                    //   if (isMousedown == false) {
                    //     resetTime = videojs(vpid).currentTime();
                    //   }
                    // });
                    // videojs(vpid).on("play", function (e) {
                    //   isMousedown = false;
                    //   that.currentTime = videojs(vpid).currentTime();
                    //   if (that.currentTime - resetTime > 2) {
                    //     videojs(vpid).currentTime(resetTime);
                    //     // that.compareTime = that.currentTime;
                    //   } else {
                    //     videojs(vpid).currentTime(that.currentTime);
                    //   };
                    // console.log(that.videoUrl)
                    // console.log(that.firstVideoUrl)
                    // console.log(that.videoUrl['changingThisBreaksApplicationSecurity'])
                    // if (that.videoPlay == false && that.firstVideoUrl != '' && that.firstVideoUrl == that.videoUrl['changingThisBreaksApplicationSecurity']) {
                    //   that.videoPlay = true
                    //   that.drawOpen()
                    // }
                    // })
                    // 根据时间更新弹出过程检测题目、更新观看时长记录
                    video_js_1["default"](vpid).on("timeupdate", function () {
                        // console.log(videojs(vpid).currentTime(), that.toTestTime);
                        if (that.visibleDraw || that.visibleDraw2 || that.visibleTest) {
                            video_js_1["default"](vpid).pause();
                        }
                        // if (5 < videojs(vpid).currentTime() && videojs(vpid).currentTime() < 6 || 305 < videojs(vpid).currentTime() && videojs(vpid).currentTime() < 306 || 3599 < videojs(vpid).currentTime() && videojs(vpid).currentTime() < 3600) {
                        //   that.timeSpan = videojs(vpid).currentTime() - that.toTestTime
                        //   that.toTestTime = videojs(vpid).currentTime()
                        //   if (that.timeSpan < 1) {
                        //     return
                        //   } else {
                        //     let i = Math.floor((Math.random() * that.surveyArray.length));
                        //     console.log(i)
                        //     that.surveyItem = that.surveyArray[i]
                        //     // 视频未换源  过程性考核试题去重
                        //     //、、、
                        //     let lastUrl = localStorage.getItem('lastUrl')
                        //     if (lastUrl && lastUrl == that.videoUrl && that.surveyArray.length > 0 && that.surveyItem) {
                        //       that.surveyArray = that.surveyArray.filter(item => {
                        //         return item.objectId !== that.surveyItem.objectId
                        //       })
                        //     }
                        //     localStorage.setItem('lastUrl', that.videoUrl);
                        //     //、、、
                        //     if (that.surveyArray.length < 1) {
                        //       that.visibleTest = false;
                        //     } else {
                        //       that.visibleTest = true;
                        //       videojs(vpid).pause();
                        //     }
                        //   }
                        // }
                        that.currentTime = video_js_1["default"](vpid).currentTime();
                        var duration = video_js_1["default"](vpid).duration();
                        // 每10秒保存
                        var nowSecond = new Date().getTime() / 1000;
                        var diffSecond = new Date().getTime() / 1000 - that.preventTime;
                        if (diffSecond <= 10) { // 每两秒检查一次，用于过滤一秒内检查4次触发2次保存的情况
                            return;
                        }
                        that.preventTime = nowSecond;
                        // End of 每10秒保存
                        if (that.currentTime > that.recordTime + 10) {
                            console.log(that.currentTime, that.recordTime);
                            console.log(that.recordTime);
                            console.log(that.lessonArticleId);
                            that.saveRecord(that.lessonArticleId, parentArticleId);
                        }
                        var pd = Number((duration * 0.95).toFixed(2));
                        if (that.currentTime >= pd && that.profile) {
                            var queryRecord = new Parse.Query("LessonRecord");
                            queryRecord.descending("time");
                            queryRecord.equalTo("lessonArticle", that.lessonArticleId);
                            queryRecord.equalTo("user", that.profile.objectId);
                            queryRecord.descending("time");
                            that.getRecordByKey(that.recordKeyCurrent, queryRecord).then(function (record) {
                                if (record && record.id) {
                                    that.recordMap[record.get("user").id + record.get("lessonArticle").id] = record;
                                }
                                if (record && record.get("status") != 2) {
                                    record.set("status", 2);
                                    record.set("time", duration);
                                    record.set("percent", 100);
                                    record.save();
                                }
                            });
                        }
                        // 禁止拖动进度条
                        // resetTime = localStorage.getItem('remTime')
                        // if (that.isBan) {
                        //   if (resetTime > 0) {
                        //     if (that.currentTime - resetTime > 2 && that.currentTime > that.recordTime) {
                        //       videojs(vpid).currentTime(resetTime);
                        //       that.compareTime = resetTime;
                        //       console.log(
                        //         videojs(vpid).currentTime(Number(resetTime)),
                        //         that.compareTime,
                        //         resetTime
                        //       );
                        //     } else {
                        //       resetTime = videojs(vpid).currentTime()
                        //     }
                        //   }
                        // }
                        // localStorage.setItem('remTime', that.currentTime);
                    });
                    video_js_1["default"](vpid).src([
                        {
                            src: videoUrl,
                            type: that.safeType
                            // withCredentials: true
                        }
                    ]);
                    video_js_1["default"](vpid).load();
                    // videojs(vpid).play();
                    video_js_1["default"](vpid).controls = true;
                    // that.compareTime = 0
                    that.active = true;
                    var video = video_js_1["default"](vpid);
                    if (section) {
                        that.lessonArticleId = section.id;
                        console.log(section.id, that.profile.objectId);
                        var queryRecord = new Parse.Query("LessonRecord");
                        queryRecord.descending("time");
                        queryRecord.equalTo("lessonArticle", section.id);
                        queryRecord.equalTo("user", that.profile.objectId);
                        that.getRecordByKey(that.recordKeyCurrent, queryRecord).then(function (queryFirst) {
                            if (queryFirst && queryFirst.id && video && _this.player) {
                                that.recordMap[queryFirst.get("user").id + queryFirst.get("lessonArticle").id] = queryFirst;
                                that.recordTime = queryFirst.get("time");
                                if (queryFirst.get("status") != 2) {
                                    localStorage.setItem("remTime", video_js_1["default"](vpid).currentTime());
                                    that.isBan = true;
                                }
                                else {
                                    that.isBan = false;
                                }
                                if (df) {
                                    console.log('that.recordKeyCurrent', that.recordKeyCurrent, that.recordTime);
                                    // setTimeout(() => {
                                    console.log(that.recordTime);
                                    video_js_1["default"](vpid).currentTime(that.recordTime);
                                    video_js_1["default"](vpid).play();
                                    // that.drawOpen()
                                    // }, 500);
                                    // that.currentTime = that.recordTime;
                                }
                                else {
                                    setTimeout(function () {
                                        video_js_1["default"](vpid).currentTime(that.recordTime);
                                        video_js_1["default"](vpid).play();
                                        // that.drawOpen()
                                    }, 500);
                                }
                            }
                        })["catch"](function (err) {
                            if (err.toString().indexOf("209") != -1) {
                                _this.sessionVisible = true;
                                _this.parseErr = err;
                            }
                        });
                    }
                });
                video_js_1["default"](vpid).currentTime = function currentTime(seconds) {
                    if (typeof seconds !== 'undefined') {
                        if (seconds < 0) {
                            seconds = 0;
                        }
                        var goTime = seconds;
                        console.log(that.currentTime);
                        console.log(that.recordTime);
                        if (seconds <= that.recordTime) {
                            goTime = seconds;
                        }
                        else {
                            //值比最大观看点的小 则允许跳转
                            goTime = that.currentTime;
                        }
                        this.techCall_('setCurrentTime', goTime);
                        return;
                    }
                    this.cache_.currentTime = this.techGet_('currentTime') || 0;
                    return this.cache_.currentTime;
                };
                return [2 /*return*/];
            });
        });
    };
    CatComponent.prototype.onPlayerTimeUpdate = function (vpid) { };
    // getLessonRecord(sectionId, parentArticleId) {
    //   this.saveRecord(sectionId, parentArticleId);
    // }
    CatComponent.prototype.ngOnDestroy = function () {
        this.recordTime = 0;
        // this.cdRef.detectChanges()
        video_js_1["default"].getAllPlayers().forEach(function (vpls) {
            vpls.dispose();
        });
        this.player = null;
        console.log('08ngOnDestroy执行了····');
    };
    CatComponent.prototype.saveRecord = function (sectionId, parentArticleId) {
        return __awaiter(this, void 0, void 0, function () {
            var duration, profile, video, queryRecord, times, queryFirst, QueryRecord, queryrecord;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        duration = video_js_1["default"](this.vpid).duration();
                        profile = JSON.parse(localStorage.getItem("profile"));
                        video = video_js_1["default"](this.vpid);
                        queryRecord = new Parse.Query("LessonRecord");
                        queryRecord.equalTo("user", profile.objectId);
                        queryRecord.equalTo("lessonArticle", sectionId);
                        queryRecord.descending("time");
                        return [4 /*yield*/, this.getRecordByKey(this.recordKeyCurrent, queryRecord)["catch"](function (err) {
                                if (err.toString().indexOf("209") != -1) {
                                    _this.sessionVisible = true;
                                    _this.parseErr = err;
                                }
                            })];
                    case 1:
                        queryFirst = _a.sent();
                        if (queryFirst && queryFirst.get("times")) {
                            times = queryFirst.get("times") + 1;
                        }
                        else {
                            times = 1;
                        }
                        if (queryFirst && queryFirst.id) {
                            this.recordMap[queryFirst.get("user").id + queryFirst.get("lessonArticle").id] = queryFirst;
                            if (queryFirst.get("time")) {
                                this.recordTime = queryFirst.get("time");
                            }
                            else {
                                this.recordTime = 0;
                            }
                            if (queryFirst.get("status") != 2) {
                                console.log(queryFirst.get("status"), "queryFirst.get(status)");
                                queryFirst.set("times", times);
                                if (!queryFirst.get("user")) {
                                    queryFirst.set("user", {
                                        __type: "Pointer",
                                        className: "Profile",
                                        objectId: profile.objectId
                                    });
                                }
                                if (!queryFirst.get("company")) {
                                    queryFirst.set("company", {
                                        __type: "Pointer",
                                        className: "Company",
                                        objectId: profile.company.objectId
                                    });
                                }
                                if (!queryFirst.get("department")) {
                                    queryFirst.set("department", {
                                        __type: "Pointer",
                                        className: "Department",
                                        objectId: profile.department.objectId
                                    });
                                }
                                if (!queryFirst.get("lesson")) {
                                    queryFirst.set("lesson", {
                                        __type: "Pointer",
                                        className: "Lesson",
                                        objectId: this.lessonId
                                    });
                                }
                                if (!queryFirst.get("major")) {
                                    if (this.profile.SchoolMajor && this.profile.SchoolMajor.objectId) {
                                        queryFirst.set("major", {
                                            __type: "Pointer",
                                            className: "SchoolMajor",
                                            objectId: this.profile.SchoolMajor.objectId
                                        });
                                    }
                                }
                                if (!queryFirst.get("class")) {
                                    if (this.profile.schoolClass && this.profile.schoolClass.objectId) {
                                        queryFirst.set("class", {
                                            __type: "Pointer",
                                            className: "SchoolClass",
                                            objectId: this.profile.schoolClass.objectId
                                        });
                                    }
                                }
                                if (!queryFirst.get("chapter")) {
                                    queryFirst.set("chapter", {
                                        __type: "Pointer",
                                        className: "LessonArticle",
                                        objectId: parentArticleId
                                    });
                                }
                                if (!queryFirst.get("allTime")) {
                                    queryFirst.set("allTime", duration);
                                }
                                if (!queryFirst.get("lessonArticle")) {
                                    queryFirst.set("lessonArticle", {
                                        __type: "Pointer",
                                        className: "LessonArticle",
                                        objectId: sectionId
                                    });
                                }
                                if (!queryFirst.get("departments")) {
                                    queryFirst.set("departments", this.profile.departments);
                                }
                                if (video && this.currentTime > queryFirst.get("time")) {
                                    queryFirst.set("time", this.currentTime);
                                }
                                queryFirst.set("times", times);
                                queryFirst.set("allTime", duration);
                                console.log("before save");
                                queryFirst.save().then(function (ree) {
                                    _this.recordMap[ree.get("user").id + ree.get("lessonArticle").id] = ree;
                                })["catch"](function (err) {
                                    if (err.toString().indexOf("209") != -1) {
                                        _this.sessionVisible = true;
                                        _this.parseErr = err;
                                    }
                                });
                            }
                        }
                        else {
                            QueryRecord = Parse.Object.extend("LessonRecord");
                            queryrecord = new QueryRecord();
                            queryrecord.set("times", times);
                            queryrecord.set("time", 0);
                            queryrecord.set("user", {
                                __type: "Pointer",
                                className: "Profile",
                                objectId: profile.objectId
                            });
                            queryrecord.set("major", {
                                __type: "Pointer",
                                className: "SchoolMajor",
                                objectId: this.profile.SchoolMajor.objectId
                            });
                            queryrecord.set("class", {
                                __type: "Pointer",
                                className: "SchoolClass",
                                objectId: this.profile.schoolClass.objectId
                            });
                            queryrecord.set("company", {
                                __type: "Pointer",
                                className: "Company",
                                objectId: profile.company.objectId
                            });
                            queryrecord.set("lesson", {
                                __type: "Pointer",
                                className: "Lesson",
                                objectId: this.lessonId
                            });
                            queryrecord.set("chapter", {
                                __type: "Pointer",
                                className: "LessonArticle",
                                objectId: parentArticleId
                            });
                            queryrecord.set("department", {
                                __type: "Pointer",
                                className: "Department",
                                objectId: profile.department.objectId
                            });
                            queryrecord.set("lessonArticle", {
                                __type: "Pointer",
                                className: "LessonArticle",
                                objectId: sectionId
                            });
                            queryrecord.set("allTime", duration);
                            queryrecord.set("departments", this.profile.departments);
                            // queryrecord.set('allTime',this.section[0].id);
                            queryrecord.set("status", 1);
                            queryrecord.save().then(function (ree) {
                                _this.recordMap[ree.get("user").id + ree.get("lessonArticle").id] = ree;
                                console.log(ree, 333);
                            })["catch"](function (err) {
                                if (err.toString().indexOf("209") != -1) {
                                    _this.sessionVisible = true;
                                    _this.parseErr = err;
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CatComponent.prototype.handleOk = function () {
        var _this = this;
        setTimeout(function () {
            _this.sessionVisible = false;
            _this.authServ.logout("notSession");
        }, 1000);
    };
    __decorate([
        core_1.Input()
    ], CatComponent.prototype, "lessonId");
    __decorate([
        core_1.ViewChild("videoBox", { static: true })
    ], CatComponent.prototype, "boxs");
    __decorate([
        core_1.ViewChild("videoContainer", { static: true })
    ], CatComponent.prototype, "videoContainer");
    __decorate([
        core_1.ViewChild("livePlayer", { static: true })
    ], CatComponent.prototype, "livePlayer");
    CatComponent = __decorate([
        core_1.Component({
            selector: "detail-cat",
            templateUrl: "./cat.component.html",
            styleUrls: ["./cat.component.less"]
        })
    ], CatComponent);
    return CatComponent;
}());
exports.CatComponent = CatComponent;
