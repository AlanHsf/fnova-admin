import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Parse from "parse";
import { GameService } from '../game.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent implements OnInit {
  @Input() id: string
  @Output() private outer = new EventEmitter()
  heigth: any = document.documentElement.clientHeight - 80
  options: any = [
    '排行榜',
    '游戏介绍'
  ]
  topActive: any = '排行榜'
  game: any //游戏
  isPlay: boolean = false
  ranking_options: any = [
    '店铺排行',
    '全国排行'
  ]
  rankingActive: any = '店铺排行'

  roster: any //排行榜名单


  swper: any = []//轮播指示点图片
  swperActive: number = 0 //当前轮播图指示点索引

  marginLeft: any = (document.documentElement.clientWidth * .2)  //所有游戏向右偏移像素
  showModel: any

  schedule: number = 0//下载进度 %制
  install: any = 'success' //是否安装 默认安装
  loading: any
  time: any
  timeMsg: string
  processTimeOut:any
  len:any
  downIngSize:any

  constructor(
    private http: HttpClient,
    public gameServ: GameService,
  ) { }

  ngOnInit() {
    console.log(this.id);
    this.id && this.getGame()
    this.getRanking()
  }

  ngOnDestroy(): void {
    this.processTimeOut && clearTimeout(this.processTimeOut)
  }

  async getGame() {
    let query = new Parse.Query("MetaGame")
    let req = await query.get(this.id)
    console.log(req);
    let res = req.toJSON()
    this.game = res
    let arr = []
    arr.push(...res.images)
    arr.splice(0, 0, res.image)
    this.swper = arr
    let bcondition = await this.gameServ.adbBcondition(this.game.package)
    this.states = bcondition.type
    if (bcondition.msg == '未启动游戏') {
      let process = await this.gameServ.downIng(this.game.apk)
      if (process && process['progress'] && process['downIngSize']) {
        this.install = false
        this.stop = process['state'] == 'stop' ? true : false
        this.downProcess()
      }
      return
    }
    bcondition.break && this.outer.emit(true)
    if(bcondition.more)  this.showModel = bcondition.msg
  }

  getRanking() {
    let res = [
      {
        username: '未来VR玩家 13231312412',
        avatar: 'https://file-cloud.fmode.cn/avatar-mtpc.jpg',
        number: 23,
        winning: 89
      },
      {
        username: '南昌彭于晏',
        avatar: 'https://file-cloud.fmode.cn/avatar-mtpc.jpg',
        number: 23,
        winning: 89
      },
      {
        username: '高玩VR大师级',
        avatar: 'https://file-cloud.fmode.cn/avatar-mtpc.jpg',
        number: 23,
        winning: 89
      },
      {
        username: 'GGt',
        avatar: 'https://file-cloud.fmode.cn/avatar-mtpc.jpg',
        number: 232,
        winning: 89
      },
      {
        username: '南昌彭于晏',
        avatar: 'https://file-cloud.fmode.cn/avatar-mtpc.jpg',
        number: 23,
        winning: 89
      },
      {
        username: '高玩VR大师级',
        avatar: 'https://file-cloud.fmode.cn/avatar-mtpc.jpg',
        number: 23,
        winning: 89
      },
      {
        username: 'GGt',
        avatar: 'https://file-cloud.fmode.cn/avatar-mtpc.jpg',
        number: 232,
        winning: 89
      },
      {
        username: '你的小可爱',
        avatar: 'https://file-cloud.fmode.cn/avatar-mtpc.jpg',
        number: 23,
        winning: 89
      },
    ]
    this.roster = res
  }

  //轮播图指示点回调
  chang(e) {
    console.log(e);
  }

  //切换轮播图索引
  onChangGame(index, dom) {
    console.log(index);
    this.swperActive = index
    this.marginLeft = (document.documentElement.clientWidth * .2) - 200 * index
    dom.goTo(index)
    if (index == 0) {
      this.isPlay = false
    } else {
      this.isPlay = true
    }
  }

  //切换排行榜&游戏结束
  onChangeTop(title) {
    console.log(title);
    this.topActive = title
  }

  handleCancel() {
    this.showModel = ''
  }

  //1.start:待启动 2.success启动成功 3.fail启动失败 4.null未安装游戏、未找到游戏（待下载）
  states: any = 'start'

  //启动游戏
  startGame() {
    let adbInstruct
    //启动游戏
    this.loading = true
    this.time && clearTimeout(this.time)
    this.time = setTimeout(async () => {
      if (this.states == 'start') {
        this.timeMsg = '正在检查安装包'
        adbInstruct = await this.gameServ.startApp(this.game.package)
        this.states = adbInstruct.type
        if (this.states != 'success') {
          this.showModel = adbInstruct.msg
          adbInstruct.break && this.outer.emit(true)
          if (this.states == 'null') {
            let isApk = await this.gameServ.getApk(this.game.apkUrl, this.game.apk)
            console.log('isApk:' + isApk);
            //已存在安装包 直接安装
            if (isApk != 'no') {
              this.install = false
              this.stop = true
              this.downProcess()
            }
            this.timeMsg = ''
          }
          this.loading = false
          this.timeMsg = '游戏已启动'
        }
        this.loading = false
        this.timeMsg = ''
        return
      }
      //关闭游戏
      adbInstruct = this.gameServ.stopPackage(this.game.package)
      this.states = adbInstruct.type
      if (adbInstruct.type != 'start') {
        this.showModel = adbInstruct.msg
        adbInstruct.break && this.outer.emit(true)
      }
      this.loading = false
    }, 500);
  }

  //下载游戏
  async downloadGame() {
    if (this.schedule != 0) {
      return
    }
    this.install = false
    // this.loading = true

    this.loading == true ? this.loading = false : ''

    await this.gameServ.downloadAPK(this.game.apkUrl, this.game.apk)
    this.downProcess()

    // this.downloadFile(this.game.apkUrl, this.game.apk)
  }

  //获取下载进度详情
  async downProcess() {
    let process = await this.gameServ.downIng(this.game.apk)
    if (process && process['progress'] && process['downIngSize']) {
      this.schedule = Number(process['progress'])
      let downSize = Number(process['downIngSize']) || null
      let lenSize = Number(process['len']) || null
      this.downIngSize = Math.floor(downSize/1024) > 0 ? (downSize/1024).toFixed(2) + 'GB' : downSize + 'MB' || null
      if(!this.len) this.len = Math.floor(lenSize/1024) > 0 ? (lenSize/1024).toFixed(2) + 'GB' : lenSize + 'MB' || null
    }
    if (process && process['state'] == 'downing') {
      this.processTimeOut = setTimeout(() => {
        this.downProcess()
      }, 1000);
    }
  }

  stop:boolean = false

  //暂停下载
  async stopDown() {
    if(this.stop){
      await this.gameServ.downloadAPK(this.game.apkUrl, this.game.apk)
      this.downProcess()
      this.stop = false
    }else{
      let stop = await this.gameServ.stopDownload(this.game.apk)
      console.log('暂停：:' + stop);
      this.stop = true
    }
  }

  //安装游戏
  installApk() {
    this.loading = true
    this.timeMsg = '正在发送数据包,安装过程可能需要5-10分钟！'
    this.time && clearTimeout(this.time)
    this.time = setTimeout(async () => {
      let apkInstall = await this.gameServ.adbInstall(this.game.apk)
      this.loading = false
      this.timeMsg = ''
      if (apkInstall.type == 'start') {
        this.states = apkInstall.type
        this.install = 'success'
        return
      }
      this.showModel = apkInstall.msg
      apkInstall.break && this.outer.emit(true)
    }, 500);
  }

  async downloadFile(fileUrl, fileName) {
    let blob = await this.getBlob(fileUrl);
    this.saveFile(blob, fileName);
  }

  getBlob(fileUrl) {
    let _this = this
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', fileUrl, true);
      //监听进度事件
      xhr.addEventListener(
        'progress',
        function (evt) {
          if (evt.lengthComputable) {
            let percentComplete = evt.loaded / evt.total;
            // percentage是当前下载进度，可根据自己的需求自行处理
            let percentage = percentComplete * 100;
            _this.schedule = parseInt('' + percentage)
            _this.loading == true ? _this.loading = false : ''
            if (percentage == 100) {
              console.log('下载完成');
            }
          }
        },
        false
      );
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        }
      };
      xhr.send();
    });
  }

  saveFile(blob, fileName) {
    const link = document.createElement('a');
    const body = document.querySelector('body');

    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    // fix Firefox
    link.style.display = 'none';
    body.appendChild(link);

    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  }

}
