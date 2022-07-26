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
import { AuthService } from "src/modules/masterol/auth.service";
import { Md5 } from "ts-md5";
// 视频组件
import videojs, { VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.min.css";
import "videojs-contrib-hls";
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
    let user = Parse.User.current()
    localStorage.setItem('hiddenMenu', 'true')
    this.activeRoute.paramMap.subscribe(async param => {
      if(param && param.get('rid')){
        if(user && user.id ) {
            let RoomStudents = new Parse.Query('RoomStudents')
            RoomStudents.equalTo('room',param.get('rid'))
            RoomStudents.equalTo('user',user.id)
            let students = await RoomStudents.first()
            if(!students) {
                alert('您暂无该直播间的观看权限')
                this.route.navigate(['./masterol/live'])
                return 
            }
        } else {
            alert('您暂无该直播间的观看权限')
            this.route.navigate(['./masterol/live'])
            return
        }
        let playUrl = 'http://live.fmode.cn/bofang/'+ param.get('rid')+'.m3u8'
        this.playUrl = this.sanitizer.bypassSecurityTrustUrl(playUrl)
        videojs.options.flash.swf = 'https://cdn.bootcss.com/videojs-swf/5.4.1/video-js.swf';
        //my-player为页面video元素的id
        let player = videojs('my-player');
        this.playVideo(playUrl)
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


    vpid: any;
    player: any;
    safeType:any ;
    videoPid: any;
    async playVideo(videoUrl) {
    
    let that = this;
    
    let safeUrl = that.sanitizer.bypassSecurityTrustUrl(videoUrl);
    let options: VideoJsPlayerOptions = {
        controls: true,
        autoplay: false,
        techOrder: ["html5"],
        isFullscreen: true,
        sources: [
        {
            src: videoUrl,
            type: 'rtmp/flv'
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
    console.log(that.player)
    if (!that.player) {
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
    this.playUrl = vpid;
    console.log(vpid)
    let videoEl = document.getElementById(vpid);
    that.player = videojs(videoEl, options, function onPlayerReady() {
        videojs(vpid).controls = true;
        videojs(vpid).on("timeupdate", function () {
    });
    videojs(vpid).src([
        {
            src: videoUrl,
            type: that.safeType
          // withCredentials: true
            }
        ]);
        videojs(vpid).load();
        videojs(vpid).play();
        videojs(vpid).controls = true;
        console.log(videojs(vpid).controls)
      
      
    });
    
  }

}
