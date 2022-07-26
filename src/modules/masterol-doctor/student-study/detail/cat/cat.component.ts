import { query } from "@angular/animations";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import * as Parse from "parse";
import { AuthService } from "src/modules/masterol-doctor/auth.service";
import { Md5 } from "ts-md5";
// 视频组件
import videojs, { VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.min.css";
import "videojs-contrib-hls";
// import "videojs-flash";
// 视频组件
// import videojs, { VideoJsPlayerOptions } from "video.js";
// import 'video.js/dist/video-js.min.css';
// import "videojs-contrib-hls";
// import "videojs-flash";
@Component({
  selector: "detail-cat",
  templateUrl: "./cat.component.html",
  styleUrls: ["./cat.component.less"]
})
export class CatComponent implements OnInit {
  // @Input() LessonArticle: any;
  @Input() lessonId: any;
  @ViewChild("videoBox", { static: true }) boxs: any;
  @ViewChild("videoContainer", { static: true }) videoContainer: any;
  constructor(
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private router: Router,
    private authServ: AuthService,
    private cdRef: ChangeDetectorRef
  ) {
   }
  recordMap={}
  preventTime = 0
  recordKeyCurrent
  async getRecordByKey(key,query?){
    console.log(key)
    if(this.recordMap[key] && this.recordMap[key].id){
      return this.recordMap[key]
    }else{
      if(query){
         return await query.first();
      }
    }
    return null;
  }
  article: any;
  section: any;
  videoPid: any;
  videoUrl: any;
  video: any;
  active: boolean = false;
  currentTime: any;
  lessonArticleId: any;
  playtime = 0;
  TimeSet = 0;
  compareTime: any = 0;
  videoArray: any;
  profile: any;
  isCollapsed = false;
  isBan: boolean = true;

  ngOnInit(): void {
    document.oncontextmenu =function () {return false; };
    console.log("2020-2-7")
    // this.cdRef.detectChanges()
    this.profile = JSON.parse(localStorage.getItem("profile"));
    this.article = [];
    this.section = [];
    this.getArticle();
    var myVideo = videojs("player-video", {
      bigPlayButton: true,
      textTrackDisplay: false,
      posterImage: false,
      errorDisplay: false
    });
    myVideo.play();

    // this.getcheckTestSurvey()
  }
  getUrl(url: string) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(url); // 获取安全链接
  }
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
  visibleTest = false;
  label: any = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  tips: any;
  vpid: any;
  radioChange() {
    console.log(this.surveyItem, this.surveyItem2);
  }
  // 确认答题
  drawcheckOption() {
    // this.surveyArray = this.surveyArray.filter(item => {
    //   return item.objectId !== this.surveyItem.objectId
    // })
    this.surveyItem.options.forEach(option => {
      if (option.grade !== 0) {
        if (option.label == this.surveyItem2) {
          this.visibleTest = false;
          videojs(this.vpid).play();
          this.surveyItem2 = "";
        } else {
          this.tips = "回答错误，请重新观看!";
          this.surveyItem2 = "";
          setTimeout(() => {
            this.router.navigate(["masterol-doctor/student-center"]);
          }, 1000);
        }
      }
    });
  }
  // 单个题目
  surveyItem;
  // 单个题目对比答案的副本
  surveyItem2;
  // 弹窗的时间点
  toTestTime = 0;
  // 记录上次弹窗时间和当前时间的时间段
  timeSpan;
  // 已经弹出过的题目数组
  testedArray = [];
  // mathSurveyItem(surveyArray) {
  //   // 随机取0到数组长度的一个值
  //   let i = Math.floor((Math.random() * surveyArray.length));
  //   // 如果之前弹出过题目  去重
  //   if (this.testedArray.length != 0) {
  //     for (let d = 0; d < this.testedArray.length; d++) {
  //       if (surveyArray[i] == this.testedArray[d]) {
  //         this.mathSurveyItem(surveyArray)
  //       } else {
  //         this.surveyItem = surveyArray[i].toJSON()
  //         this.testedArray.push(this.surveyItem)
  //       }
  //     }
  //   } else {
  //     this.surveyItem = surveyArray[i].toJSON()
  //     this.testedArray.push(this.surveyItem)
  //   }
  // }

  // 试卷题目数组
  surveyArray;
  // 进入页面时不自动播放，所以展示的第一个视频是可以直接点击的 控制进入页面后第一次点击video并且点击的是第一个视频就弹出验证弹窗
  videoPlay: any = false;

  videoClick() {
    // if (this.videoPlay == false && this.firstVideoUrl != '' && this.firstVideoUrl == this.videoUrl['changingThisBreaksApplicationSecurity']) {
    //   this.videoPlay = true
    //   this.drawOpen()
    // }
  }
  ngAfterViewInit() {
    // 获取过程性考核试题
    let querySurvey = new Parse.Query("SurveyItem");
    querySurvey.equalTo("survey", "M9Da5FE2aV");
    querySurvey.select("title", "options");
    querySurvey.find().then(surveyArray => {
      // this.surveyArray =
      let tmpArr = [];
      surveyArray.forEach(item => {
        let tmp = item.toJSON();
        tmpArr.push(tmp);
      });
      this.surveyArray = tmpArr;
      // this.surveyArray = surveyArray
      // that.mathSurveyItem(surveyArray)
    });
    // this.video = document.querySelector("#player-video")
    this.video = document.getElementById(this.videoPid);
    this.getArticle();
    // this.video.addEventListener('pause', function () {
    // })
  }
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  firstVideoUrl;
  // 获取章节数据
  async open(index){
    let aid = this.article[index].id
    let LessonArticle = new Parse.Query('LessonArticle')
    LessonArticle.equalTo('lesson', this.lessonId)
    LessonArticle.equalTo('parent', aid)
    LessonArticle.ascending("index")
    let sections =  await LessonArticle.find()
    if(sections && sections.length > 0) {
      sections.forEach(section =>{
        let queryLog = new Parse.Query('LessonRecord');
        queryLog.equalTo('lessonArticle', section.id );
        queryLog.equalTo('user', this.profile.objectId);
        queryLog.descending("time")
        queryLog.first().then(res => {
          if(res && res.id && res.get('status') == 2 ) {
            section['status'] =  '已学完'
          } else if(res && res.id && res.get('status') == 1) {
            section['status'] =  '在学习'
          } else{
            section['status'] =  '待学习'
          }
        })

      })
      this.article[index].sections = sections
    } else {
      let queryLog = new Parse.Query('LessonRecord');
        queryLog.equalTo('lessonArticle', this.article[index].id );
        queryLog.equalTo('user', this.profile.objectId);
        queryLog.descending("time")
        let sections = Object.assign({}, this.article[index])
        queryLog.first().then(res => {
          if(res && res.id && res.get('status') == 2 ) {
            sections['status'] =  '已学完'
          } else if(res && res.id && res.get('status') == 1) {
            sections['status'] =  '在学习'
          } else{
            sections['status'] =  '待学习'
          }
          this.article[index].sections = [sections]
        })
    }
  }


  async getArticle() {
    this.article = [];
    this.section = [];
    let LessonArticle = new Parse.Query('LessonArticle')
    LessonArticle.equalTo('lesson', this.lessonId)
    LessonArticle.equalTo('parent', undefined)
    LessonArticle.ascending("index")
    let article = await LessonArticle.find()
    this.article = article
    let index = 0
    let firstVideoUrl = "";
    this.open(index).then(res => {
      if (firstVideoUrl == "" && this.article[0].sections[0].get("videoUrl")) {
        if (this.article.length) {
          firstVideoUrl = this.article[0].sections[0].get("videoUrl");
        }
        this.firstVideoUrl = firstVideoUrl;
      }
      this.playVideo(firstVideoUrl, this.article[0].sections[0], this.df);
    })
    return
  }
  
  setbgd(event) {
    // console.log(event)
    let p = "";
    if ((event = "在学习")) {
      p = "RGBA(54, 153, 255, 1)";
    } else if ((event = "待学习")) {
      p = "RGBA(245, 0, 0, 1)";
    } else {
      p = "RGBA(170, 168, 168, 1)";
    }
    return { "color": p };
  }
  getArticleStatus(id) {
    // console.log(123456789)
    // return "1213"
    let queryLog = new Parse.Query('LessonRecord');
    queryLog.equalTo('lessonArticle', id);
    queryLog.equalTo('user', this.profile.objectId);
    queryLog.first().then(res => {
      if(res && res.id && res.get('status') == 2 ) {
        return  '已学完'
      } else if(res && res.id && res.get('status') == 1) {
        return '在学习'
      } else{
        return '待学习'
      }
    })
  }

  // 视频播放 弹窗
  visibleDraw = false;
  visibleDraw2 = false;
  df = true;
  drawOpen(): void {
    this.visibleDraw = true;
  }
  // 过程性检验
  // 开始验证
  verifyId: any;
  isVerifying: boolean = false;
  // 显示二维码 创建验证信息
  drawGetCode() {
    this.visibleDraw = false;
    this.visibleDraw2 = true;
    let QueryVerify = Parse.Object.extend("LessonVerify");
    let queryVerify = new QueryVerify();
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
    queryVerify.save().then(res => {
      this.verifyId = res.id;
    });

    this.isVerifying = true;
    setInterval(() => {
      this.getIsVerify();
    }, 3000);
    // this.video.play();
  }
  // 查询是否通过验证
  // 显示加载状态
  isSpinning = true;
  getIsVerify() {
    if (this.isVerifying) {
      let queryVerify2 = new Parse.Query("LessonVerify");
      queryVerify2.equalTo("section", this.lessonArticleId);
      queryVerify2.equalTo("objectId", this.verifyId);
      queryVerify2.first().then(res => {
        if (res && res.id) {
          if (res.get("verify") == true) {
            this.isSpinning = false;
            setTimeout(() => {
              this.isVerifying = false;
              this.visibleDraw2 = false;
              // clearInterval(this.int);
              videojs(this.vpid).play();
              this.isSpinning = true;
            }, 2000);
          }
        }
      });
    }
  }
  int: any;
  drawClose(): void {
    this.visibleDraw = false;
    this.router.navigate(["masterol-doctor/student-center"]);
  }
  drawClose2(): void {
    this.visibleDraw2 = false;
    this.router.navigate(["masterol-doctor/student-center"]);
  }

  // 直播间相关
  @ViewChild("livePlayer", { static: true }) livePlayer: ElementRef;
  player: any;
  safeUrl: any;
  safeType: any;
  isFirstPlay: any;
  // 课件连接
  link: any;
  recordTime: number = 0;
  async playVideo(videoUrl, section, df) {

    this.recordKeyCurrent = this.profile.objectId + section.id;
    if(!this.recordMap[this.recordKeyCurrent]){this.recordTime = 0}
    if (section) {
      this.link = section.get("attachment");
    }
    let parentArticleId = section.get("parent").id;
    let that = this;
    if (videoUrl.indexOf("m3u8") > 0 || videoUrl.indexOf("m3u") > 0) {
      that.safeType = "application/x-mpegURL";
    } else if (videoUrl.indexOf("mp4") > 0) {
      that.safeType = "video/mp4";
    } else {
      that.safeType = "rtmp/flv";
    }

    that.safeUrl = that.sanitizer.bypassSecurityTrustUrl(videoUrl);
    let options: VideoJsPlayerOptions = {
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
    let vpid = String(Md5.hashStr(videoUrl));
    this.vpid = vpid;
    videojs.getAllPlayers().forEach(vpls => {
      vpls.dispose();
    });
    if (that.player) {
      // 若已存在则重置
      videojs.getAllPlayers().forEach(vpls => {
        vpls.dispose();
      });
      that.player = null;
      document.getElementById("videoContainer").innerHTML = `
      <video  object-fit="scale-down" preload="metadata" 
      controls="true" autoplay="false"
      style="width:100%;"
          id="${vpid}" 
          class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9"
          playsinline="true" x-webkit-airplay="allow" webkit-playsinline playsinline x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          data-setup='{}'>
                <source src="${videoUrl}" type="${that.safeType}">
                <source src="${videoUrl}" type="${that.safeType}">
            <p class="vjs-no-js">
              To view this video please enable JavaScript, and consider upgrading to a
              web browser that
              <a href="https://videojs.com/html5-video-support/" target="_blank">
                supports HTML5 video
              </a>
            </p>
        </video>
        `;
    }
    this.videoPid = vpid;
    console.log("vpid", vpid);
    let videoEl = document.getElementById(vpid);
    that.player = videojs(videoEl, options, function onPlayerReady() {
      console.log("onPlayerReady", videojs(vpid));
      

      videojs(vpid).controls = true;
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
      videojs(vpid).on("timeupdate", function () {
        
        // console.log(videojs(vpid).currentTime(), that.toTestTime);
        if (that.visibleDraw || that.visibleDraw2 || that.visibleTest) {
          videojs(vpid).pause();
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

        that.currentTime = videojs(vpid).currentTime();
        let duration = videojs(vpid).duration();
     
        // 每10秒保存
        let nowSecond = new Date().getTime()/1000;
        let diffSecond = new Date().getTime()/1000 - that.preventTime;
        if(diffSecond<=10){ // 每两秒检查一次，用于过滤一秒内检查4次触发2次保存的情况
          return
        }
        that.preventTime = nowSecond
        // End of 每10秒保存

        if (that.currentTime > that.recordTime + 10) {
          console.log(that.currentTime,that.recordTime);
          console.log(that.recordTime);
          console.log(that.lessonArticleId);
          that.saveRecord(that.lessonArticleId, parentArticleId);
        }
        let pd = Number((duration * 0.95).toFixed(2));
        if (that.currentTime >= pd && that.profile) {
          let queryRecord = new Parse.Query("LessonRecord");
          queryRecord.descending("time");
          queryRecord.equalTo("lessonArticle", that.lessonArticleId);
          queryRecord.equalTo("user", that.profile.objectId);
          queryRecord.descending("time");
          that.getRecordByKey(that.recordKeyCurrent,queryRecord).then(record => {
            if(record && record.id){
              
              that.recordMap[record.get("user").id+record.get("lessonArticle").id] = record;
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
      videojs(vpid).src([
        {
          src: videoUrl,
          type: that.safeType
          // withCredentials: true
        }
      ]);
      videojs(vpid).load();
      // videojs(vpid).play();
      videojs(vpid).controls = true;
      // that.compareTime = 0
      that.active = true;
      let video = videojs(vpid);
      if (section) {
        that.lessonArticleId = section.id;
        console.log(section.id, that.profile.objectId);
        let queryRecord = new Parse.Query("LessonRecord");
        queryRecord.descending("time");
        queryRecord.equalTo("lessonArticle", section.id);
        queryRecord.equalTo("user", that.profile.objectId);
        that.getRecordByKey(that.recordKeyCurrent,queryRecord).then(queryFirst => {
          if (queryFirst && queryFirst.id && video && this.player) {
            that.recordMap[queryFirst.get("user").id+queryFirst.get("lessonArticle").id] = queryFirst;
            that.recordTime = queryFirst.get("time");
            
            if (queryFirst.get("status") != 2) {
              localStorage.setItem("remTime", videojs(vpid).currentTime());
              that.isBan = true;
            } else {
              that.isBan = false;
            }
            if (df) {
              console.log('that.recordKeyCurrent',that.recordKeyCurrent,that.recordTime);
              // setTimeout(() => {
                 console.log(that.recordTime)
                videojs(vpid).currentTime(that.recordTime);
                videojs(vpid).play();
                // that.drawOpen()
              // }, 500);
              // that.currentTime = that.recordTime;
            } else {
              setTimeout(() => {
                videojs(vpid).currentTime(that.recordTime);
                videojs(vpid).play();
                // that.drawOpen()
              }, 500);
            }
          }
        }).catch(err => {
          if (err.toString().indexOf("209") != -1) {
            this.sessionVisible = true;
            this.parseErr = err;
          }
        });
      }
    });


    videojs(vpid).currentTime = function currentTime(seconds) {
      if (typeof seconds !== 'undefined') {
        if (seconds < 0) {
          seconds = 0;
        }

          let goTime = seconds;
          console.log(that.currentTime)
          console.log(that.recordTime)
          if (seconds <= that.recordTime) {
            goTime = seconds;
          } else {
            //值比最大观看点的小 则允许跳转
            goTime = that.currentTime;
          }

        this.techCall_('setCurrentTime', goTime);
        return;
      }
  
      this.cache_.currentTime = this.techGet_('currentTime') || 0;
      return this.cache_.currentTime;
    };
    
    // videojs.use("*", function (player): any {
    //   return {
    //     // time 应该为 点击或拖动视频的值
    //     setCurrentTime: function (time) {
    //       console.log(time,that.recordTime,that.currentTime,"time");
          
    //       if (time <= that.recordTime) {
    //         return time;
    //       } else {
    //         //值比最大观看点的小 则允许跳转
    //         return that.currentTime;
    //       }
    //     }
    //   };
    // });
    // this.player.dispose();
    // videojs.log('Your player is ready!');
    // this.player.ready(()=>{
    // })
  }

  onPlayerTimeUpdate(vpid) { }
  // getLessonRecord(sectionId, parentArticleId) {
    
  //   this.saveRecord(sectionId, parentArticleId);
  // }

  ngOnDestroy() {
    this.recordTime = 0
    // this.cdRef.detectChanges()
    videojs.getAllPlayers().forEach(vpls => {
      vpls.dispose();
    });
    this.player = null;
    console.log('08ngOnDestroy执行了····');
  }
  async saveRecord(sectionId, parentArticleId) {
    let duration = videojs(this.vpid).duration();
    let profile = JSON.parse(localStorage.getItem("profile"));
    let video = videojs(this.vpid);
    let queryRecord;
    let times;
    queryRecord = new Parse.Query("LessonRecord");
    queryRecord.equalTo("user", profile.objectId);
    queryRecord.equalTo("lessonArticle", sectionId);
    queryRecord.descending("time");
    let queryFirst = await this.getRecordByKey(this.recordKeyCurrent,queryRecord).catch(err => {
      if (err.toString().indexOf("209") != -1) {
        this.sessionVisible = true;
        this.parseErr = err;
      }
    });
    if (queryFirst && queryFirst.get("times")) {
      times = queryFirst.get("times") + 1;
    } else {
      times = 1;
    }
    if (queryFirst && queryFirst.id) {
      this.recordMap[queryFirst.get("user").id+queryFirst.get("lessonArticle").id] = queryFirst;
      if (queryFirst.get("time")) {
        this.recordTime = queryFirst.get("time");
      } else {
        this.recordTime = 0;
      }
      if (queryFirst.get("status") != 2) {
        console.log(queryFirst.get("status"), "queryFirst.get(status)")
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
        console.log("before save")
        queryFirst.save().then(ree => {
          this.recordMap[ree.get("user").id+ree.get("lessonArticle").id] = ree;
        }).catch(err => {
          if (err.toString().indexOf("209") != -1) {
            this.sessionVisible = true;
            this.parseErr = err;
          }
        });
      }
    } else {
      let QueryRecord = Parse.Object.extend("LessonRecord");
      let queryrecord = new QueryRecord();
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
      queryrecord.save().then(ree => {
        this.recordMap[ree.get("user").id+ree.get("lessonArticle").id] = ree;
        console.log(ree, 333)
      }).catch(err => {
        if (err.toString().indexOf("209") != -1) {
          this.sessionVisible = true;
          this.parseErr = err;
        }
      });
    }
  }
  footerRender = () => "extra footer";
  parseErr: any;
  sessionVisible: boolean = false;
  handleOk(): void {
    setTimeout(() => {
      this.sessionVisible = false;
      this.authServ.logout("notSession");
    }, 1000);
  }
}
