import { Component, OnInit, ViewChild } from '@angular/core';
import * as Parse from "parse";
import { GameService } from '../game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild("recommend") recommend;
  @ViewChild("games") games;
  @ViewChild("store") store;
  @ViewChild("hyperspace") hyperspace;

  isVisible: boolean //显示弹窗
  active: number = 2
  options: any = [
    {
      title: '推荐',
    },
    {
      title: '游戏库',
    },
    {
      title: '超级空间',
    },
    {
      title: '玩家',
    },
    {
      title: '竞技场',
    },
    {
      title: '商店',
    },
  ]
  user: any
  wxCode: any = 'https://file-ciuan.fmode.cn/wxqrcode.jpg'

  state: boolean  //设备连接状态
  showDevice: boolean

  tabs: any = [
    {
      title: 'USB连接(建议)',
      type: 'usb',
      tips: `
        1.打开Quest设备设置，连接与本机相同网络WIFI；
        2.插入USB连接本机(PC)；
        3.在Quest设备弹窗中点击同意（授权）；
        4.点击连接。
      `
    },
    {
      title: 'IP地址连接',
      type: 'code',
      tips: `
        1.打开Quest设备设置，打开WIFI连接，连接与本机(PC)相同路由器网络；
        2.Quest设备点击已连接的WIFI网络，点进最下方高级查看当前网络连接的IP地址；
        3.在下方输入IP地址，点击连接。
      `
    },
  ]
  activeDevices: any = this.tabs[0]
  ipCOde: any
  msg: any //返回错误提示

  loading: boolean
  showClose:boolean

  constructor(
    public gameServ: GameService,
  ) { }

  async ngOnInit() {
    this.user = Parse.User.current()
    await this.gameServ.initElectronRender();
    this.updataDevice()
  }
  onChang(i) {
    this.active = i
    switch (this.active) {
      case 0:
        this.recommend && this.recommend.changComopnonets()
        break;
      case 1:
        this.games && this.games.changComopnonets()
        break;
      case 2:
        this.hyperspace && this.hyperspace.changComopnonets()
        break;
      case 5:
        this.store && this.store.changComopnonets()
        break;
    }

  }

  wxShow() {
    this.isVisible = true
  }


  handleCancel() {
    this.isVisible = false;
    this.showDevice = false
    this.showClose = false
  }

  onClose() {
    this.showClose = true
  }

  closeWin(){
    this.gameServ.closeWin()
  }

  //更新设备状态
  updataDevice() {
    let adbState = this.gameServ.adbDevices() //设备连接状态
    this.state = adbState
    if (!this.state) {
      this.showDevice = true
    }
  }

  changSteta(steta:boolean){
    console.log(steta);
    if(steta){
      this.state = false
    }
  }

  time: any //防抖

  async devicesConnect(value) {
    this.loading = true
    console.log(value);
    this.time && clearTimeout(this.time)
    this.time = setTimeout(() => {
      if (value == 'code' && (!this.ipCOde || this.ipCOde == '')) {
        this.msg = '请输入正确的IP地址'
        this.loading = false
        return
      }
      let connectSteta = this.gameServ.adbConnect(value, this.ipCOde)
      this.state = connectSteta.type
      if (this.state) {
        this.msg = ''
        this.loading = false
        this.showDevice = false
      } else {
        this.loading = false
        this.msg = value == 'code' ? '连接失败' : '连接失败，请检查Quest设备是否已打开开发者模式和连接相同网络，并且同意始终允许操作！'
      }
    }, 500);
  }

  onChangTab(item) {
    this.activeDevices = item
    this.ipCOde = ''
    this.msg = ''
  }
}
