
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
import { Router, ActivatedRoute } from "@angular/router";
import * as Parse from "parse";
import { AuthService } from "src/modules/masterol-doctor/auth.service";
import { Md5 } from "ts-md5";
// 视频组件
import videojs, { VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.min.css";
import "videojs-contrib-hls";
// import { Route } from "_@angular_compiler@10.2.4@@angular/compiler/src/core";
@Component({
  selector: 'app-live-room',
  templateUrl: './live-room.component.html',
  styleUrls: ['./live-room.component.scss']
})
export class LiveRoomComponent implements OnInit {
  @ViewChild("videoBox", { static: true }) boxs: any;
  @ViewChild("videoContainer", { static: true }) videoContainer: any;
  constructor(private sanitizer: DomSanitizer,private route: Router,  private activeRoute:ActivatedRoute) { }
  rid:any
  playUrl:any
  ngOnInit() {
    localStorage.setItem('hiddenMenu', 'true')
    this.activeRoute.paramMap.subscribe(param => {
      if(param && param.get('rid')){
        let playUrl = 'rtmp://live.fmode.cn/bofang/'+ param.get('rid')
        this.playUrl = this.sanitizer.bypassSecurityTrustUrl(playUrl)
        videojs.options.flash.swf = 'https://cdn.bootcss.com/videojs-swf/5.4.1/video-js.swf';
        //my-player为页面video元素的id
        let player = videojs('my-player');
        //播放
        player.play();
        console.log(this.playUrl)
        this.rid =  param.get('rid')
        this.queryRoom()
      }
    })
  }
  room:any
  async queryRoom(){
    let Room = new Parse.Query('Room')
    let room = await Room.get(this.rid)
    this.room = room
  }


  // videojs(‘example_video_1′).ready(function() {

  //   this.play();
    
  //   });

}
