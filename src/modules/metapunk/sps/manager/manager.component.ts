import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {ActivatedRoute} from '@angular/router';

import { DomSanitizer} from '@angular/platform-browser';
import { SpsService } from '../sps.service';
// import { ElectronService } from 'ngx-electron';

declare var electron:any;
declare var location:any;

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  isElectron = true;
  dark = true;
  iframeUrl = null;
  players:any = [
  ]
  statusMap={
    "new":"新玩家",
    "battle":"战斗中",
    "undone":"任务中",
    "done":"已完成",
    "warn":"已就绪",
    "complete":"已完成"
  }
  colorMap={
    "new":"#eb2f96",
    "battle":"#00BCD4",
    "done":"#52c41a",
    "undone":"#00BCD4",
    "complete":"#52c41a",
    "warn":"#eb2f96"
  }
  _electronService:any
  baseurlAI:any
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    public spsServ: SpsService
    // private _electronService: any// ElectronService
  ) { 
    // this.baseurlAI = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/metapunk/":"https://test.fmode.cn/api/metapunk/";
    this.baseurlAI = "https://test.fmode.cn/api/metapunk/";

    document.body.style.background = `url("assets/bg.jpg") center`;  
  }
  ngOnInit(){
    this.loginKey = localStorage.getItem("META_GUILD")
    this.loginPin = localStorage.getItem("META_GUILD_PIN")
    this.initElectronRender();
    setTimeout(()=>{
      if(this.loginKey&&this.loginPin){
        if(this.loginPin.indexOf("<")==-1){
          localStorage.setItem("META_GUILD",this.loginKey)
          localStorage.setItem("META_GUILD_PIN",this.loginPin)
          this.login();
        }
      }
    },1500)
  }

  isShowDashboard = true;
  isShowWindow = false;
  showDashboard(){
    // routerLink="/metapunk/sps/manager"
    this.hideAll()
    this.isShowDashboard = true
    this.isShowWindow = false
  }

  refreshInterval:any // 用于定时刷新players数据，间隔1秒
  restoreInterval:any // 用于定时恢复出错player数据，间隔5秒（防止过快识别错误）
  async initElectronRender(){
    // 每秒更新玩家战斗信息
    this.refreshInterval = setInterval(async ()=>{
      await this.loadPlayers();
    },1000)

    this.restoreInterval = setInterval(async ()=>{
      await this.restorePlayers();
    },10000)

    this.initScripts() // onload返回有问题，如果用await会导致后续脚本执行失败
    this.InfiniteAutoBattle()
  }

  async loadPlayers(){
    if(this.isReplacing){return}
    if(!this.guild){return}
    if(!this.isElectron) return;
    let players:any = await this.getPlayers();
    if(players.length > this.players.length){
      this.players = players
    }else{
      let playerMap = {}
      players&&players.forEach(player=>{
        playerMap[player.key]=player
      })
      this.players.forEach(player=>{
        if(playerMap[player.key]){
          let newdata = playerMap[player.key]
          Object.keys(newdata).forEach(key=>{
            player[key] = newdata[key];
          })
        }
      })
      this.cdRef.detectChanges();
    }
}
  async restorePlayers(){
    if(this.isReplacing){return};
    if(!this.players || this.players.length==0) {return};
    for (let index = 0; index < this.players.length; index++) {
      const player = this.players[index];
      if(player.status == "warn"&&this.isCreateAll){
        this.rebootPlayer(player,index);
      }
    }
  }

  async getPlayers(){
    return new Promise((resolve,reject)=>{
      if(electron) {
        setTimeout(() => {
          let players: any = electron.ipcRenderer.sendSync('getPlayers');
          resolve(players)
        }, 300);
      }else{
        resolve([])
      }
    })
  }
  async rebootPlayer(player,index,oldplayer?){
    let options:any = {
      player:player,
      index:index
    }
    if(oldplayer){
      options.oldplayer = oldplayer
    }
    await this.electronEvent("rebootPlayer",options)
    return
  }
  async createAllPlayersView(){
    await this.electronEvent("createAllPlayersView",{})
    return
  }
  async showPlayer(player,index){
    await this.electronEvent("showPlayer",{player:player,index:index})
    return
  }
  async closePlayer(player,index){
    await this.electronEvent("closePlayer",{player:player,index:index})
    return
  }
  async fullPlayer(player,index){
    this.hideAll();
    await this.electronEvent("fullPlayer",{player:player,index:index})
    return
  }
  async hidePlayer(player,index){
    await this.electronEvent("hidePlayer",{player:player,index:index})
    return
  }
  async showAll(){
    await this.electronEvent("showAllPlayers")
    return
  }
  async hideAll(){
    await this.electronEvent("hideAllPlayers")
    return
  }
  isCreateAll = false;
  async createAll(){
    await this.electronEvent("createAllPlayers")
    this.isCreateAll = true;
    return
  }

  async electronEvent(event,value=null){
    if(!this.isElectron)return
    return new Promise((resolve,reject)=>{
      if(electron) {
        setTimeout(() => {
          let data: any = electron.ipcRenderer.sendSync(event,value);
          this.loadPlayers();
          resolve(data)
        }, 300);
      }else{
        this.loadPlayers();
        resolve([])
      }
    })
  }


  goUrl(url){
    this.hideAll();
    this.isShowWindow = true;
    this.iframeUrl = this.safeUrl(url)
  }

  safeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  guild:any = null
  loginKey:any = null
  loginPin:any = null

  async login(){
    if(!this.loginKey||!this.loginPin){
      alert("该公会未获得授权码")
      return
    }
    // this.logout();

    let authData
    try{
      authData = await this.loginAuth(this.loginKey,this.loginPin)
    }catch(error){
      console.error(error.error&&error.error.mess || "授权失败。")
      localStorage.removeItem("META_GUILD")
      localStorage.removeItem("META_GUILD_PIN")
      return
    }
    this.guild = authData;
    this.players = this.guild.players
    localStorage.setItem("META_GUILD",this.guild.id)
    localStorage.setItem("META_GUILD_PIN",this.guild.key)

    console.log(this.guild)
    this.electronEvent("setGuild",this.guild)
    this.electronEvent("setPlayers",this.players)
    // if(authData&&authData.key) await this.loadPlayerInfo(authData.name,authData.key);
    return
  }
  async loginAuth(key,pin,type="total"){
    let limit = 10;
    if(type=="undone"){
      limit = 15;
    }
    return new Promise((resolve,reject)=>{
      this.http.post(this.baseurlAI+"sps/guildcheck", {key:key,pin:pin,type:type,limit:limit}).subscribe(res => {
        let data:any = res
        data = data&&data.data || {}
        this.spsServ.guild = data;
        resolve(data)
      },err=>{
        reject(err)
      })
    })
  }

  /************************************************************************/
  /*
   * 《无限自动战斗队列》
   * 1.程序启动时，默认加载10个玩家，点击开始战斗
   * 2.每5秒检测一遍，判断当前玩家是否有完成任务的
   * 3.若有完成任务的玩家，获取公会undone列表
   * 4.逐个替换新玩家至前者战斗序列
   */ 
  completeList = [] // 已完成的战斗序列位置
  undoneList = []
  isReplacing = false // 是否已经运行替换流程，如果有则不进行其他操作
  isUndoneSleep = false // 是否无队列玩家，需要休息5分钟，避免频繁发送网络请求
  async InfiniteAutoBattle(){
    setInterval(()=>{
      if(this.isReplacing){return}
      this.refreshCompList();
      this.refreshUndoneList();
      this.replaceBattleList();
    },30*1000)
  }
  refreshCompList(){
    if(this.isReplacing){return}
    if(this.players&&this.players.length<=0){return}

    let completeList = []
    this.players.forEach((item,index)=>{
      if(item.status=="complete"){
        completeList.push(index);
      }
    })
    
    this.completeList = completeList;

    console.log("completeList",this.completeList)
  }
  async refreshUndoneList(){
    if(this.isReplacing){return}
    if(this.isUndoneSleep){return}
    if(this.completeList.length<=0){return} // 完成队列中无空位，不从网络获取

    console.log("undoneList",this.undoneList)

    if(this.undoneList.length>0){return} // 等待队列中有玩家，不从网络获取

    // 获取最新公会数据，取10条未完成玩家
    let authData
    let players
    try{
      authData = await this.loginAuth(this.loginKey,this.loginPin,"undone")
    }catch(error){
      console.error(error.error&&error.error.mess || "授权失败。")
      return
    }
    this.guild = authData;
    // this.electronEvent("setGuild",this.guild)
    console.log(authData)
    players = authData.players;

    this.undoneList = players;
    // [已经弃用，之前有错误的查重逻辑]玩家数据查重，排除在当前队列中，未上报数据的
    // let existsMap = {}
    // this.players.forEach(item=>{existsMap[item.key]=item});
    // this.undoneList = players.filter(item=>{
    //   if(existsMap[item.key]){
    //     if(existsMap[item.key].status=="complete"){ // 已完成的老玩家可替换
    //       return true
    //     }else{
    //       return false
    //     }
    //   }else{            // 新玩家可替换
    //     return true
    //   }
    // });

    console.log("undoneList",this.undoneList)
    if(this.undoneList.length==0){ // 等待队列如果为空，则休息5分钟，再从网络获取
      this.isUndoneSleep = true;
      setTimeout(() => {
        this.isUndoneSleep = false;
      }, 60*5*1000);
      return
    }

  }
  async replaceBattleList(){
    
    if(this.isReplacing){return} // 开启：替换锁
    if(this.completeList.length<=0){return} // 开启：替换锁
    this.isReplacing = true;
    let completeList = this.completeList
    let undoneList = this.undoneList

    for (let index = 0; index < this.undoneList.length; index++) {
      let oldplayer

      // 检测是否有待战斗的玩家，并抽取一个准备开始
      if(undoneList.length==0){continue;}
      let player = undoneList.shift();

      /*************************
       * 情况一：等待玩家已经在队列中
       */
      // 检测该玩家是否已经在战斗中，如果是则不上榜
      let existsIndex = this.players.findIndex(item=>item.key==player.key)
      if(this.players[existsIndex]){ // 玩家已经存在时，判断是否完成
        if(this.players[existsIndex].status=="complete"){ // 玩家已存在，且已完成，则直接用自己替换自己
          oldplayer = JSON.parse(JSON.stringify(this.players[existsIndex]))
          this.replaceOnePlayer(oldplayer,player,existsIndex)
          continue;
        }else{
          // console.log("玩家已存在，且未完成")
          continue; // 玩家已存在，且未完成，则将自己从等待等列中移出，避免重复替换
        }
      }

      /*************************
       * 情况二：等待玩家是新玩家
       */
      // 检测是否有已完成的空位，并抽取一个已完成的空余位置
      if(!oldplayer){

        if(completeList.length==0){continue;}
        let emptyIndex = completeList.shift();
        // 替换this.players列表中，空余位置玩家数据

        if(this.players[emptyIndex]){
          oldplayer = JSON.parse(JSON.stringify(this.players[emptyIndex]))
        }
        this.replaceOnePlayer(oldplayer,player,emptyIndex)
      }
    }
    
    // 同步已删除空位的completeList数据至全局
    this.completeList = completeList;
    this.undoneList = undoneList;
    this.electronEvent("setPlayers",this.players)
    // 关闭：替换锁
    // this.showAll();
    this.isReplacing = false;
  }
  async replaceOnePlayer(oldplayer,player,emptyIndex){
    Object.keys(player).forEach(item=>{
      this.players[emptyIndex][item] = player[item]
    })
    // 重启窗口，用新玩家数据加载
    this.rebootPlayer(player,emptyIndex,oldplayer);
    // await this.sleep(10*1000)
  }

  /* end of InfiniteAutoBattle() ******************************************/
  /************************************************************************/
  
  async sleep(time=1000,order="desc"){
    console.log(`需要等待${time/1000}秒`)
    let startTime = new Date();
    let seconds = 1;
    let countdownInt = setInterval(()=>{
      // console.log((time/1000)-seconds)
      let now = new Date();

        if(order=="desc"){
          // 倒计时
          console.log(String((time/1000)-seconds))
        }else{
          // 正向计时
          console.log(((now.getTime() - startTime.getTime())/1000).toFixed(0))
        }
      seconds+=1
    },1000)

    return new Promise(resolve=>{
      setTimeout(() => {
        clearInterval(countdownInt);
        resolve(time);
      }, time);
    })
  }

  initScripts(){
    if(!this.isElectron)return
    return new Promise((resolve,reject)=>{
        //获取head的标签
        let head= document.getElementsByTagName('head')[0];
        //创建script标签
        let script= document.createElement('script');
        //属性赋值
        script.async = true;
        script.type= 'text/javascript';
        //下面为必要操作 否则将不能使用script标签中的内容
        script.onload = function() {
            resolve(null);
          };
          script.innerHTML = `
          var electron = null;

          if(!electron){
            var electron = require("electron");
          }
          `
        //添加src属性值
        // script.src= src;
        head.appendChild(script);
    })

  }

  closeWindow(){
    open(location, '_self').close();
    this.electronEvent("closeWindow")
  }

}
