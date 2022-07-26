import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {ActivatedRoute} from '@angular/router';

declare var electron:any;
declare var ctrlReboot:any;

interface SMSDK {
  // SM.js
  Init(options?:any):Promise<any>;
  // splinterlands.js
  init(options?:any):Promise<any>;
  get_player():any;
  load_market():any
  get_market():any
  has_saved_login():any;
  login(usr?,pwd?):Promise<any>;
  group_collection():any;
  battle_history(player:any,limit:any):any;
  GuildBuilding:{
    new(a:any,b:any,c:any): any;
  };
  Guild:{
    new(gid:any): any;
  };
  get_settings():any;
}
declare var splinterlands:SMSDK;
declare var SM:SMSDK;
declare var steem:any;
declare var SSC:any;

@Component({
  selector: 'app-battlebot',
  templateUrl: './battlebot.component.html',
  styleUrls: ['./battlebot.component.scss']
})
export class BattlebotComponent implements OnInit {
  SM:any
  battleType="Practice"
  displayName="勇者"
  inputUser=null
  inputPwd=null
  player:any = {}
  nullplayer:any = {
    "timestamp": 1636811392980,
    "name": "yourname",
    "collection_power": 150, // 卡牌库战斗力
    "league": null, // 排位当前段位
    "next_tier": null, // 排位下一段位
    "season_max_league": 1,  // 排位最大段位
    "rating": 295, // 赛季当前积分
    "max_rating": 455, // 赛季最大积分
    "max_rank": 213929, // 赛季最大排名
    "balances": null, // 账户余额
    "quest": null, // 每日任务
    "guild": null, // 公会信息
    "token": null,
    "starter_pack_purchase": true,
    "join_date": null, // 注册时间
    "is_admin": false, "is_cs_admin": false, "is_team": false, "referred_by": null, "battles": 201, "wins": 103, "current_streak": 0, "longest_streak": 5, "champion_points": 0, "capture_rate": 9704, "last_reward_block": 59132467, "last_reward_time": "2021-11-13T06:39:10.249Z", "require_active_auth": true, "settings": {},
    "avatar_id": 13,    "_display_name": null,    "title_pre": null,    "title_post": null,    "adv_msg_sent": false,    "use_proxy": false,    "alt_name": null,    "email": null,    "messages": [],       "unrevealed_rewards": [],     
    "season_reward": null,
    "has_keys": true,
    "keys_available": null,
    "outstanding_match": null,
    "has_collection_power_changed": false,
    "_player_properties": {}
  }
  historyList=[]
  cardList=[]
  cardMap={}
  baseurlAI:any

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { 
    // window.alert=function(err){
    //   this.errorCheck(err)
    //   this.errorCheck(err)
    // } // 避免弹出错误导致界面停止运行，备用代码
    this.baseurlAI = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/metapunk/":"https://test.fmode.cn/api/metapunk/";

    this.logout();

    let now = String(new Date().getTime()).slice(10,)
    this.displayName = `勇者${now}`
    localStorage.setItem("hiddenMenu","true");
  }

  async getParams(){
    return new Promise((resolve,reject)=>{
      this.route.queryParams.subscribe(params=>{
        resolve(params)
      });
    })
  }
  async ngOnInit() {
    let params:any = await this.getParams();
    this.loginKey = params&&params.key || null
    this.loginPin = params&&params.pin || null
    await this.initScripts("/assets/metapunk/sps/md5.min.js");
    await this.initScripts("/assets/metapunk/sps/snapyr-sdk.min.js");
    await this.initScripts("/assets/metapunk/sps/splinterlands.min.js");
    splinterlands.load_market = ()=>{return}
    splinterlands.get_market = ()=>{return}
    this.SM = splinterlands;
    // await this.initScripts("/assets/metapunk/sps/SM.min.js");
    // await this.initScripts("/assets/metapunk/sps/web3.min.js");
    // await this.initScripts("/assets/metapunk/sps/libraries.min.js");
    setInterval(()=>{ // 极其特殊的情况，所有检测登录及重启函数错误，只有通过UI元素是否存在判断是否加载正常，若加载错误则重启
      console.log("checking load timeout:",document.getElementsByClassName("sps-logout").length)
      if(document.getElementsByClassName("sps-logout").length==0){
        this.reloadBot();
      }
    },50*1000)
    await this.initSMSDK();
    // let data = await this.historyAnalysis("toante513")
    // console.log(data);
    // await this.login()

    if(this.loginKey&&this.loginPin){ // 若参数完整则自动登录
      this.login();
    }
    this.initPlayerStatusInterval();
    
  }

  hasUserName:boolean = true;
  isDoneQuest:boolean = false;
  stopStartQuest = false;
  initPlayerStatusInterval(){
    if(this.isFatalError){
      return
    }
    setInterval(()=>{ // 每秒检测用户及战斗状况，并及时控制下阶段任务调度
      this.checkDoneQuest();
      this.checkUserName();
      this.checkNewQuest();
      this.checkSeasonRewards();
      this.goAutoBattle();
    },5000)

    setInterval(()=>{
      this.checkObjectKeyOK();
    },20*1000)

    // setInterval(()=>{ // 每30秒上报玩家数据，资产数据等
    //   this.reportPlayerData();
    // },60*1000)
  }
  async checkObjectKeyOK(){
    return // 暂时未找到哪个参数可以判断是否丢失KEY
    let wallet = await this.SM.get_player().get_wallets();
    console.log("KEY OK:",wallet)
    if(wallet&&wallet.length>0){

    }else{
      // this.reloadBot();
    }
  }
  async reportPlayerData(){
    console.log("每场战斗后，上报角色数据")
    await this.SM.get_player().refresh();
    let player = this.SM.get_player();
    let collections = await this.SM.group_collection();
    let ownCards = collections.filter(item=>item.player&&item.uid);
    ownCards = ownCards.map(item=>{return{
      id:item.card_detail_id,
      level:item.level,
      gold:item.gold,
      image_url:item.image_url,
      dec:item.dec
      // suggested_price:item.suggested_price(),
    }
    })

    this.playerReport(player,ownCards);
  }
  checkNewQuest(){

    /* 任务检测：任务详情获取
     * 
     */
    if(this.player.quest&&this.player.quest.id&&!this.player.quest.claim_trx_id&&!this.player.quest.details){
      // this.player.quest.refresh_quest(); // refresh 是重新刷新任务，而不是获取details
      this.player.refresh(); // 通过刷新用户，获取任务details信息
    }

    // 青铜阶段跳过Earth任务，或Earth时不强制任务优先
    let season = "76"
    if(this.player.quest&&this.player.quest.details&&season=="75"){ // 75赛季Earth弱势种族，自动跳过领新任务
      if(this.player.quest.details.objective.indexOf("Earth")>-1){
        if(this.player.quest.can_refresh){
          this.player.quest.refresh_quest();
          // this.SM.ops.refresh_quest();
        }
      }
    }

    if(season=="76"){
      // 76赛季Life弱势种族，Snipe是弱势队伍，自动跳过领新任务
      if(this.player.quest&&this.player.quest.details){ 
        if(this.player.quest.details.objective.indexOf("Life")>-1){
          if(this.player.quest.can_refresh){
            this.player.quest.refresh_quest();
            // this.SM.ops.refresh_quest();
          }
        }
      }

      // Snipe refresh
      if(this.player.quest&&this.player.quest.name.indexOf("High Priority Targets")>-1){
        if(this.player.quest.can_refresh){
          this.player.quest.refresh_quest();
        }
      }

      // Life refresh
      if(this.player.quest&&this.player.quest.name.indexOf("Defend the Borders")>-1){
        if(this.player.quest.can_refresh){
          this.player.quest.refresh_quest();
        }
      }

    }

    /* 任务检测：新任务领取
     * 复杂判定方式，已经改为直接通过can_start判断
     * if((this.nextQuestHour()<0&&this.player.quest.claim_trx_id) || this.player&&this.player.quest&&(!this.player.quest.details&&!this.player.quest.id)){
     */  
    if(!this.player.quest || this.player.quest&&this.player.quest.can_start){
      this.startQuest();
    }

    /* 任务检测：已完成任务奖励领取
    */
    if(this.player.quest&&this.player.quest.completed&&!this.player.quest.claim_trx_id){
      this.player.quest.claim_rewards();
    }
  }
  checkDoneQuest(){
    if(this.player&&this.player.quest){
      let questDone = (this.player.quest.completed_items/this.player.quest.total_items)>=1

      if(questDone&&!this.player.quest.claim_trx_id){
        this.claimQuestRewards()
      }
      let capRateDone = (this.player.capture_rate/100)<75
      let hasNextQuest = this.nextQuestHour()<0
      if(questDone&&capRateDone&&!hasNextQuest){
        this.isDoneQuest=true
        localStorage.setItem("PLAYER_STATUS","complete")
        return
      }else{
        this.isDoneQuest=false
        return
      }
    }
    this.isDoneQuest=false
  }

  loginErrorMsg = "该帐号未设置用户名！"
  checkUserName(){
    if(this.player&&this.player.token
      // (this.player.name.startsWith('apprentice_')||this.player.name.startsWith("initiate_")||this.player.name.startsWith("disciple_"))
      ){
        if(this.player.alt_name==null){
          this.loginErrorMsg = "该帐号未设置用户名！"
          this.hasUserName = false
          return
        }
        if(!this.player.quest.details&&!this.player.quest.id){
          console.log("该帐号未领首次任务！",this.player)
          this.loginErrorMsg = "该帐号未领首次任务！"
          this.hasUserName = false
          return
        }
        this.hasUserName = true;
        return
    }
    this.hasUserName = true
    return
  }

  loginKey:any = null
  loginPin:any = null
  loginMail:any = null
  loginName:any = null
  reloadBot(){
    // if(typeof ctrlReboot=="function"){
      // ctrlReboot();
    // }else{
      localStorage.clear();
      location.reload();
    // }
  }
  async login(){
    // let that = this;
    setTimeout(() => { // 25s 用户未登录成功，则重新登陆
      if(this.SM.get_player()&&this.SM.get_player().token){
      }else{
        this.reloadBot()
      }
    }, 25*1000);

    if(!this.loginKey||!this.loginPin){
      alert("未填写授权码")
      return
    }
    this.logout();

    let authData
    try{
      authData = await this.loginAuth(this.loginKey,this.loginPin)
    }catch(error){
      this.errorCheck(error.error&&error.error.mess || "授权失败。")
      return
    }
    if(authData&&authData.key) await this.loadPlayerInfo(authData.name,authData.key);
    return
  }

  logout(){
    if(this.SM&&this.SM._ws){
      this.SM.logout()
    }
    if(this.SM){
      this.SM._player = null;
      this.SM._collection = null;
    }
    
    localStorage.removeItem('splinterlands:username');
    localStorage.removeItem('splinterlands:key');

    // 清空玩家数据
    this.player = this.nullplayer;
    this.historyList = [];
    this.cardList = [];
  }
  
  /******************************************************
   * 玩家战斗状态：步骤条
   */
   autoBattleRanked=true; // 自动战斗是否开启
   index = 0;
   status = "rest"
   titleMap={
     0:"休息中",
     1:"战斗中",
     2:"学习中"
   }
   statusMap={
    0:"wait",
    1:"wait",
    2:"wait"
  }
  countMap={
    0:"00",
    1:"00",
    2:"00"
  }
   descMap={
     0:"zZzZ...",
     1:"想去冒险!",
     2:"学而时习~"
   }
   onIndexChange(event: number): void {
     this.index = event;
   }
   onStatusChange(event){
     this.status = event
     switch (event) {
      case "rest": // 休息中
         this.index = 0
         this.titleMap[0] = '休息中'
         this.descMap[0] = "zZzZ..."
      break;
       case "find": // 匹配中
         console.log("匹配中")
         this.index = 0
         this.titleMap[0] = '匹配中'
         this.descMap[0] = "哋！报上名来"
         this.sleep(120*1000,0,"asc")
         break;
      case "team": // 整备军队...
         console.log("整备军队...")
         this.index = 1
         this.descMap[1] = '整备军队...'
         break;
      case "fight": // 两军交战...
        this.index = 1
        this.descMap[1] = '两军交战...'
        this.sleep(180*1000,1,"asc")
         break;
      case "learn": // 学习中
        this.index = 2
        this.countMap[1] = '00'
        this.descMap[1] = '想去冒险!'
        this.SM.get_player().refresh();
        this.reportPlayerData();
          break;
       default:
         break;
     }
   }
  //  async refreshCaptureRate(){
  //   if (this.SM.has_saved_login()){
  //     let login_response = await this.savedLogin();
  //     this.player = login_response;
  //   }
  //  }
  
   goAutoBattle(start?){
    // 条件1：只有休息状态下，才可以发起排位请求
     if(this.status!="rest"){return}
     
    // 条件2：只有自动战斗为True是，才可以发起排位请求
     start = start || false
    if(start==true){
      this.autoBattleRanked=true
    }
    if(this.autoBattleRanked!=true){return}

    // 条件3：每日任务首先保证完成，其次判断剩余精力是否大于75%

    // 条件4：isFatalError，出现致命错误，停止重复排位
    if(this.isFatalError==true){return}

    if(!(this.player&&this.player.quest&&(this.player.quest.details||this.player.quest.id))){return}
    let questPercent = this.player.quest.completed_items/this.player.quest.total_items;
    // 判断每日任务是否完成，必须打；
    if(questPercent<1){
    }else{
      // this.claimQuestRewards(); //完成任务自动领奖励
    }
    
    // 任务完成时：判断捕获值是否大于75%，低于需要终止
    let crate = this.player.capture_rate/100
    if((questPercent>=1 && crate <75 )){
      return
    }

    console.log("can battle")
    this.battleRanked();
    return
   }
   cancelAutoBattle(){
     this.autoBattleRanked = false
   }
   checkProxy(){
    //  if(!this.player.starter_pack_purchase){
       this.player.use_proxy = false;
      //  this.SM._player.use_proxy = false;
    //  }
   }
  /******************************************************
   * 核心战斗过程：发起战斗、匹配敌人、组建战队、等待结果
   */
  battleMap = { // 根据MatchID来精准记录每场战斗的状态，避免wait和team时序冲突
    "oid":{
      status:"find" // find team wait finish
    }
  }
  async battleRanked(type="Ranked"){
    this.checkProxy();
    // this.startQuest();
    this.checkQuest();
    this.battleType = "Ranked"
    let matchInfo:any = await this.matchFind();
    let match = matchInfo.match;
    let exists = matchInfo.match;
    if(match){
      if(!this.battleMap[match.id]){this.battleMap[match.id] = {}}
      this.battleMap[match.id].status = "team"
      console.log("Match Info:",match);
      this.matchOverTime(match.id);
      this.matchWait(match.id);
      this.matchSubmitTeam(match.id,exists);
    }else{
      // match Exists监测不准确，需要等待2:30，共150s之后，继续比赛
      // this.sleep(150*1000)
      // this.goAutoBattle();
    }
  }
  async restoreAutoBattle(status,error){
    if(status=="find"){ // 匹配阶段出错，可以重新登录用户，恢复登录链接

    }

    if(status=="team"){ // 整队阶段出错，可以获取最近比赛，恢复比赛
      // 原因1：比赛提前结束，敌方投降，提交队伍报比赛已结束无法提交
      // 原因2：Key not found，登录信息缺失，提交队伍请求发起本身报错

    }

    // this.logout();
    // await this.login();
    // this.goAutoBattle();
  }
  async matchFind(){ 
    this.onStatusChange("find");
    this.loadCollections(); // 比赛前重新获取卡包uid，避免过期后排位自动投降（还有可能是其他问题造成）
    this.sleep(3000)
    /******************************************************** wait for a match for many minutes */
			try {

        // find时候，若发现已存在match时，则加载该match
        let existsMatch = await this.SM.get_match();
        console.log("EXITSMATCH:",existsMatch);
        if(existsMatch){
          console.log(`Match exists against @${existsMatch.opponent_player}!`);
          // console.log(existsMatch)
          return {match:existsMatch,exists:true}
        }else{
          console.log('Find match before...');
          let findresult = await this.SM.ops.find_match(this.battleType);
          console.log(findresult)
          console.log('Find match transaction submitted...');
          let match = await this.SM.wait_for_match();
          console.log(`Match found against @${match.opponent_player}!`);
          // console.log(match)
          return {match:match,exists:false}
        }

			} catch (err) {
       
        this.errorCheck(err)
        // this.errorCheck(err.error)
				console.log('Error: ' + err.error);
         /* ERROR:"error":"Key not found."
         * 原因是用户登录缓存出了问题，需要登出重新登陆，然后发起goAutoBattle
        */
        await this.restoreAutoBattle("find",err)
        return false
			}
  }
  async matchOverTime(matchId){
    await this.sleep(150*1000);
    if(this.battleMap[matchId].status!='finish'){
      this.battleMap[matchId].status = "finish"
      this.onStatusChange("rest")
    }
    return
  }
  async matchWait(matchId){ // 分析结果记录输赢即可，详细的比赛记录，可以通过BattleHistory查询

    let result = await this.SM.wait_for_result(); //**************************************** always waiting for many minutes util match done */
    this.onStatusChange("learn")
    
    console.log('Battle finished!');
    console.log(result);
    console.log(result.details);

    this.checkBattleError(result);
    if(result){
      // result.battle_queue_id_1
      // result.battle_queue_id_2
      this.battleMap[matchId].status = "finish"
    }
    console.log(this.battleMap)
    // console.log(result);
    if(result&&result.details&&result.details.team1){ // 过滤问题局
      let winner = result.winner;
      let t1player = result.details.team1.player
      let t2player = result.details.team2.player
      if(winner){ // 有胜负的战局，学习对手最近20场战斗
        let opponent_player = this.player.name==t1player?t1player:t2player
        this.teamLearn(opponent_player)
      }
    }
    this.historyList.pop();
    this.historyList.unshift(result);

    await this.sleep(this.RandomNum(20,40)*1000,2) // 学习反思时间，模拟真人操作，避免被封号
    this.onStatusChange("rest")
    /*
      winner: "lilryane"
      reward_dec: "0.000" // 奖励DEC
      mana_cap: 12 // 能量限制
      match_type: "Practice" // 比赛模式: Practice练习 Ranked排位
      details: // 战斗详情
        {
          winner:"xxx"
          loser:"xxx"
          mana_cap: 12 // 能量限制
          team1:
          team2: color  monsters summoner rating player
          round:[] // 回合详情
        }
    */

  }

  /*
    战斗场次中，卡牌的uid究竟怎么生成的，卡牌库应当以什么为准？
    1.卡牌库 /cards/get_details 0-350张卡牌
    2.战斗英雄 get_battle_summoners 获得英雄UID
    3.战斗士兵 uid从本次登录的loadCollections中映射读取
  */

  async matchSubmitTeam(matchId,exists){
      this.onStatusChange("team")

			let match = this.SM.get_match();

      // 对手种族分析：计算对手出场战队概率
      let opponentOptions = await this.historyAnalysis(match.opponent_player)
      // 注意！调用后端服务，获取最佳英雄阵营，再通过card_defails_id获取uid组成战队
      let owncards = this.cardList.filter(card=>card.uid).map(item=>String(item.card_detail_id))
      let summoners = this.SM.get_battle_summoners(match)
      let ownheros = summoners.map(item=>String(item.card_detail_id))

      let options:any = {
        owncards: owncards,
        ownheros:ownheros,
        type: this.battleType, // Practice训练 Ranked排位 Quest任务
        league: this.player.league&&this.player.league.id || 1, // 1青铜III，排位级别
        strategy: "machine", // 算法类型 machine机器学习 detect演绎推理 version版本答案
        mana_cap: match.mana_cap, // 能量限制
        opponent_player: match.opponent_player, // 竞争对手
        opponent_color: opponentOptions.color, // 主要种族
        opponent_summoner: String(opponentOptions.summoner) // 主要英雄
      }
      if(this.questOptions){
        options.quest = this.questOptions;
      }

      // 根据场次，查询可选英雄
      // let summoners = this.SM.get_battle_summoners(match)
			// let summoner = summoners[0];
      // 选择英雄：starter-5-VuELH
      // 注意！卡片Uid组成格式为：starter新手包-5详情序号-随机数（用户每次登录通过loadCollections获取）
			// let summoner_uid = summoner.uid

      // 根据英雄，查询可选士兵
			// let monsters = this.SM.get_battle_monsters(match, summoner_uid);
      // 选择士兵：starter-8-zhYE1 starter-64-8qfTG starter-158-Qjtu7 starter-1-WmGbZ starter-3-gZHJS
			// let monsters_uids = [monsters.uid];
      
      // console.log("Team Submit:",match,summoner_uid,monsters_uids)
      // return
			// ShowLoading();
      let result:any = await this.teamAI(options);
      // console.log(result)
      if(!(result&&result.best&&result.best.summoner)){
        this.errorCheck("缺少对战信息，AI无法组队，请及时人工组队")
      }

      if(!exists){ // 若为重启恢复比赛，需要立即提交队伍，以免错过机会
        await this.sleep(this.RandomNum(15,24)*1000,1) // 随机等待组队时间，模拟真人操作，避免被封号
      }

      /***********************************************************
       * TODO：避免抽到没有的牌，且确保角色独有卡牌组合可使用
       * 1.AI选取队伍中，包含帐号没有的卡牌怎么办？
       *   1.1 保存记录时后端标识纯starter新人卡组，避免抽到不存在卡牌
       * 2.有些高级帐号需要定制算法怎么办？
       *   2.1 传入该用户拥有卡牌ownCards（后端检索monsters被starter+ownCards集合包含）
       */
      // return // 等待组局接口完成后，再开放对战测试
      let sid = this.cardMap[result.best.summoner]&&this.cardMap[result.best.summoner].uid
      let mids = []
      result.best.monsters.forEach(mitem=>{
        if(this.cardMap[mitem]&&this.cardMap[mitem].uid){
          mids.push(this.cardMap[mitem].uid)
        }
      })
			try {
        // 具体写法，需要投降一次，查看前后match数据的变化字段进行判断
			  // let match = this.SM.get_match(); // 提交战队前，需要重新判断对手是否投降，避免重复提交
        // 目前解决办法，直接设置为报错信息不弹出Alert，跳过继续执行

        console.log(matchId)
        // if(this.battleMap[matchId].status=='team'){

          // setTimeout(() => { // 5秒后，如果还停留在提交状态，则重启客户端
          //   if(this.battleMap[matchId].status=='team'){
          //     this.reloadBot()
          //   }
          // }, 5000);

          console.log("开始提交对战队伍信息。")
          this.SM.ops.submit_team(match, sid, mids).then((data)=>{
            console.log("ok team:",data)
            this.onStatusChange("fight")
            console.log('Team Submitted...');
          }).catch(error=>{
            console.error("ttttttt")
            console.error(error)
            // return
            if(error&&error.error){
              if(error.error.indexOf("The specified battle has already been resolved")>-1){
                // this.reloadBot();
                this.onStatusChange("rest") // 排查中：rest可能导致帐号超时，提交空队伍
              }
            }

            if(error&&error.error){
              if(error.error.indexOf("Team has already been submitted for battle")>-1){
                this.onStatusChange("fight")
              }
            }
            this.errorCheck(error)
          });
        // }else{
        //   console.log("比赛已提前结束，无需重复提交队伍")
        // }
			} catch (e) {
        console.error("6666666666")
        console.error(e)
				this.errorCheck(e);
        /* ERROR:"error":"Key not found."
         * 原因是用户登录缓存出了问题，需要登出重新登陆，然后发起goAutoBattle
          // await this.restoreAutoBattle("team",e)
          * 由于发起战斗无法恢复帐号Key，因此需要重新reload页面，触发重新登陆
        */
      //  this.reloadBot();
			}
		// });
  }
  async loginAuth(key,pin){
    return new Promise((resolve,reject)=>{
      this.http.post(this.baseurlAI+"sps/authcheck", {key:key,pin:pin}).subscribe(res => {
        let data:any = res
        data = data&&data.data || {}
        resolve(data)
      },err=>{
        reject(err)
      })
    })
  }
  async playerReport(player,cards){
    if(player.quest&&player.quest.details){
      delete player.quest.details
    }
    console.log(player)
    console.log(cards)
    return new Promise((resolve,reject)=>{
      this.http.post(this.baseurlAI+"sps/player", {player:player,cards:cards}).subscribe(res => {
        let data:any = res
        data = data&&data.data || {}
        resolve(data)
      })
    })
  }
  async teamAI(options){
    return new Promise((resolve,reject)=>{
      this.http.post(this.baseurlAI+"sps/teamai", options).subscribe(res => {
        let data:any = res
        data = data&&data.data || {}
        resolve(data)
      })
    })
  }
  async teamLearn(player){
    return new Promise((resolve,reject)=>{
      this.http.post(this.baseurlAI+"sps/learnplayer", {
        player:this.player,
        limit:20
      }).subscribe(res => {
        let data:any = res
        data = data&&data.data || {}
        resolve(data)
      })
    })
  }
  async historyAnalysis(playerid){
    let historyList = await this.loadHistory(playerid,10)
    if(!historyList || !historyList.length || historyList.length==0){
      return {color:null,summoner:null}
    }
    let teams = []
    teams=teams.concat((historyList.filter(item=>item.details.team1&&item.details.team1.player==playerid)).map(item=>item.details.team1))
    teams=teams.concat((historyList.filter(item=>item.details.team2&&item.details.team2.player==playerid)).map(item=>item.details.team2))
    let color = this.majorityElement(teams.map(item=>item.color))
    let summoner = this.majorityElement(teams.map(item=>item.summoner.card_detail_id))
    return {
      color:color,
      summoner:summoner
    }
  }
  /**** 常用分析算法 **********************************************/
  majorityElement(nums) {
    let majority_element = null
    let count = 0
    for (let num of nums) {
      if (count == 0) {
        majority_element = num
      }
      if (num != majority_element) {
        count--
      } else {
        count++
      }
    }
    return majority_element
  }
  async sleep(time=1000,index?,order="desc"){
    console.log(`需要等待${time/1000}秒`)
    let startTime = new Date();
    let seconds = 1;
    let countdownInt = setInterval(()=>{
      // console.log((time/1000)-seconds)
      let now = new Date();
      if(index || index===0){
        if(this.index!=index){
          clearInterval(countdownInt)
          return
        }

        if(order=="asc"&&this.status=="find"&&index==0){
          if(((now.getTime() - startTime.getTime())/1000)>80){ // 匹配超过80秒，则重启机器人
            this.reloadBot();
          }
        }

        if(order=="desc"){
          // 倒计时
          this.countMap[index] = String((time/1000)-seconds)
        }else{
          // 正向计时
          this.countMap[index] = ((now.getTime() - startTime.getTime())/1000).toFixed(0)
        }
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

RandomNum(Min,Max){
  let Range = Max - Min;
  let Rand = Math.random();
  let num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}

  async loadHistory(player,limit=20){
    if(player&&player.name){
      player = player.name
    }
    let list = await this.SM.battle_history(player, limit)
    return list || []
  }
  
  
  /********************************************
   * 任务相关函数
   */
  questOptions:any = null
  async checkQuest(){
    if(!this.player){return}
    if(!this.player.quest || (!this.player.quest.id)){
      await this.startQuest();
    }
    if(!this.player.starter_pack_purchase){
      console.log("该帐号未购买新手卡包，无权限访问卡牌、任务等功能")
      return
    }
    let quest:any = this.player.quest
    
    let created_date = quest.created_date
    let isCreated = created_date?true:false;

    let claim_date = quest.claim_date;
    let isClaimed = claim_date?true:false;
    
    let rewards = quest.rewards;

    // 检查任务是否开始，若没有领取一个新任务
    if(!isCreated){
      quest = await this.startQuest()
      console.log("开始任务：",quest)
    }

    // 任务已开始，且未完成，则解析任务类型，影响抽卡策略
    if(!isClaimed && quest.details){
      let name = quest.name;
      let details = quest.details;
      let active = details.active;
      this.questOptions = details;
    }

    // 任务已完成，未领取，则开始领取任务奖励
    if(!isClaimed && rewards){
      quest = await this.claimQuestRewards();
      console.log("领取奖励：",quest)
    }

    // 奖励领取完成，则排位不加任务参数
    if(isClaimed){
      this.questOptions = null;
    }
    return
  }
  showQuest(){
    console.log(this.player.quest)
  }
  nextQuestHour(){
    if(this.player&&this.player.quest&&(this.player.quest.details||this.player.quest.id)){
      let now = new Date();
      let last = new Date(this.player.quest.created_date);
      let next = last.getTime() + (1000*60*60*24)
      return Math.floor((next - now.getTime()) / (1000*60*60))
    }else{
      return false
    }
  }
  async startQuest(){
    if(!this.player.quest.can_start){return}
    if(this.stopStartQuest){return}
    console.log("before StartQuest")
    await this.claimQuestRewards();
    let result
    try{
      result = await this.SM.ops.start_quest();
      this.SM.get_player().refresh();
      console.log("startQuest:",result)
    }catch(err){
      this.errorCheck(err);
      throw err;
    }
    return result
  }


  hasSeasonRewards:boolean = false // 是否有未领取赛季奖励
  async checkSeasonRewards(){
    if(this.player&&this.player.season_reward){
      let reward = this.player.season_reward;
      if(reward.reward_packs&&!reward.reward_claim_tx){
        this.hasSeasonRewards = true;
        this.claimSeasonRewards();
      }else{
        this.hasSeasonRewards = false;
      }
    }
  }
  async claimSeasonRewards(){
    this.SM.get_player();
    if(this.player&&this.player.season_reward&&this.player.season_reward.reward_packs&&!this.player.season_reward.claim_trx_id){
      try{
        await this.SM.get_player().season_reward.claim_rewards();
        this.SM.get_player().refresh();
      }catch(err){
        this.errorCheck(err)
      }
    }
  }
  async claimQuestRewards(){
    let isDone = (this.player.quest.completed_items/this.player.quest.total_items)>=1
    let isClaimed = ((this.player.quest.details||this.player.quest.id)&&this.player.quest.claim_trx_id)?true:false;
    if(isDone&&!isClaimed){
      let result
      try{
        result = await this.SM.get_player().quest.claim_rewards();
        this.SM.get_player().refresh();
        return result
      }catch(err){
        this.errorCheck(err)
        return
      }
    }
    return
  }
  async loadCollections(){
    if(!this.player.starter_pack_purchase){
      console.log("该帐号未购买新手卡包，无权限访问卡牌、任务等功能")
      // return
    }
			let collections = await this.SM.group_collection();
      // console.log(collections)
      this.cardList = collections;
      this.cardList.forEach(citem=>{
        if(citem&&citem.uid){
          this.cardMap[citem.card_detail_id]=citem;
        }
      })
      // console.log(this.cardList);
      return
  }
  loadingPlayer = true;
  async loadPlayerInfo(usr,key){
  
    let login_response = await this.checkLogin(usr,key);
    this.player = login_response;
    this.checkProxy();
    this.loadingPlayer = false;
    // console.log(login_response)


    if(login_response){
      let player = login_response

      let starter_pack_purchase = player.starter_pack_purchase
      
      console.log("Player Info:",player)
    
    if (player.guild) {
      // console.log(player.guild.render_crest(30));
      // console.log(player.guild.name);
      let guildHallBuilding = new this.SM.GuildBuilding(player.guild.id, 'guild_hall', player.guild.data);
      let testGuild = new this.SM.Guild(player.guild);
    }

    ['DEC', 'CREDITS', 'UNTAMED', 'BETA', 'ALPHA', 'ORB'].forEach(async token => {
      let balance = await player.get_balance(token);
    });

    console.log(
      `Season ends in: ${new Date(this.SM.get_settings().season.ends).getTime() - Date.now()}`
      )

    this.loginMail = this.player.email
    this.loginName = this.player.name
    this.loadCollections();
    this.checkQuest();
    this.historyList = await this.loadHistory(player);
    this.reportPlayerData(); // 首次登录上报数据
    }
  }

  async checkLogin(usr,pwd){
    let login_response

    if (this.SM.has_saved_login()){
      login_response = this.savedLogin();
    }

    if(!login_response){
      login_response = await this.SM.login(usr, pwd);
    }

    if (login_response.error) {
      this.errorCheck(login_response.error)
      return false;
    }else{
      if (!login_response.error){
        return login_response
      }
      return false;
    }
  }

  async initSMSDK(){
    // from official index.html head Config
    let Config = {
      api_url: 'https://api2.splinterlands.com',
      battle_api_url: 'https://battle.splinterlands.com',
      ws_url: 'wss://ws2.splinterlands.com',
      external_chain_api_url: 'https://ec-api.splinterlands.com',
      tx_broadcast_urls: ['https://broadcast.splinterlands.com', 'https://bcast.splinterlands.com'],
      asset_location: 'https://dstm6no41hr55.cloudfront.net/211109/',
      asset_location_backup: 'https://splinterlands.s3.amazonaws.com/211109/',
      tutorial_asset_location: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/tutorial/',
      card_image_url: 'https://d36mxiodymuqjm.cloudfront.net',
      SE_RPC_URL: 'https://api.steem-engine.net/rpc',
      HE_RPC_URL: 'https://api.hive-engine.com/rpc',
      version: "0.7.152",
      rpc_nodes: [
        // "https://api.hive.blog", "https://anyx.io", 
        "https://hived.splinterlands.com", "https://api.openhive.network"]
    }

    /* SM.js Init (official 2021113 version)
    // let handler = null;
		// 	let current_tournament = null;
		// 	steem.api.setOptions({ transport: 'http', uri: Config.rpc_nodes[0], url: Config.rpc_nodes[0], useAppbaseApi: true });
		// 	let ssc = new SSC(Config.SE_RPC_URL);
		// 	let ssc_he = new SSC(Config.HE_RPC_URL);
		// 	let asset_version = new Date().getTime();
		// 	// 需要本地存储：browser_id username
    //   // 需要依赖函数：generatePassword()
  	// 	SM.Init();
    */
		await this.SM.init(Config);
  }
  async savedLogin() {

    let login_response = await this.SM.login();

    if (!login_response.error){
      return login_response
    }
  }


  initScripts(src){
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
        //添加src属性值
        script.src= src;
        head.appendChild(script);
    })

  }

  isFatalError:boolean = false;
  errorTitle:string = "";
  errorDesc:string = "";
  errorCheck(error){
    console.log("errorCheck",error); // 针对特殊错误进行处理，如退出登录刷新页面等
    console.log("errorCheck",error.error); // 针对特殊错误进行处理，如退出登录刷新页面等
    if(error&&error.error&&error.error.startsWith('Rewards have already been claimed for the specified quest')){
      console.log("任务奖励已经领取，但是player数据未刷新，需要refresh")
      this.player.refresh();
    }


    if(error&&error.error&&error.error.indexOf('The specified battle has already been resolved')>-1){
      console.log("战斗已结束，休息后重新战斗")
      // this.onStatusChange("rest")

      // this.reloadBot();
      // this.reboot();
    }
    
    if(error&&error.error&&error.error.indexOf('already engaged in a match')>-1){
      console.log("该玩家已加入战斗，刷新恢复战斗")
      this.reloadBot();
      // this.reboot();
    }
 
    if(error&&error.error&&error.error.indexOf('already claimed their rewards from the specified season.')>-1){
      console.log("赛季奖励已经领取，但是player数据未刷新，需要reboot")
      // this.reloadBot();
      // this.reboot();
      this.player.refresh()
    }
 
    if(error&&typeof error=="string"&&error.indexOf("too many consecutive battles")>-1){
      console.log("too many consecutive battles:",error,JSON.stringify(error))
      // TODOLIST: 需要排查清楚，究竟什么情况导致了提交空队伍，然后修复，或者及时终止避免反复失败扣分
      // Unable to start a battle for 1 hour due to too many consecutive battles without submitting a team.
      this.isFatalError = true;
      this.errorTitle = "活力不足，需要重启";
      this.errorDesc = `需要等待一小时，在左侧重启\n注意：帐号必须完成Request Keys步骤！\n邮箱：${this.loginMail} 用户：${this.loginName}`; // 建议1小时之内无法继续排位
      this.logout();
      // this.reboot();
    }

    if(error&&typeof error=="string"&&error.indexOf("don't have enough Resource Credits")>-1){
      console.log("don't have enough Resource Credits:",error)
      // this.isFatalError = true;
      // this.errorTitle = "活力不足，需要重启";
      // this.errorDesc = `需要等待一小时，在左侧重启\n注意：帐号必须完成Request Keys步骤！\n邮箱：${this.loginMail} 用户：${this.loginName}`; // 建议1小时之内无法继续排位
      // this.logout();
      // this.reboot();
      // this.reloadBot(); // 会导致一直反复重启
    }


    if(
      (error&&typeof error=="string"&&(error.indexOf("Please try refreshing")>-1))
      ||
      (error&&error.error&&(error.error.indexOf("Please try refreshing")>-1))
      ){
        // reboot not until now, we can reload first
        this.reloadBot() 
      // this.isFatalError = true;
      // this.errorTitle = "网络请求超时！";
      // this.errorDesc = `请检查网络，等待10分钟重启。\n注意：帐号必须完成Request Keys步骤！\n邮箱：${this.loginMail} 用户：${this.loginName}`;
      // this.logout();
    }

    if(error&&error.error&&error.error.indexOf("Key not found")>-1){
      this.reloadBot()
      // this.isFatalError = true;
      // this.errorTitle = "帐号Keys未申请";
      // this.errorDesc = `注意：帐号必须完成Request Keys步骤！\n邮箱：${this.loginMail} 用户：${this.loginName}`;
      // this.logout();
    }

    if(error&&error.error&&error.error.indexOf("Must wait 23 hours and complete")>-1){
      // this.stopStartQuest = true; // 目前仅报错不影响战斗逻辑，也能正常领取新任务，因此暂时注释
    }

  }
  checkBattleError(battle){
    if(battle){
      let player1 = battle.player1.name;
      let type = battle&&battle.details&&battle.details.type;
      // let player2 = battle.player2.name
      let selfteamid = (this.player.name == player1)?"team1":"team2";
      let selfteam = battle.details[selfteamid];
      let isNullTeam = false;
      if(!selfteam){
        isNullTeam = true;
      }
      if(!(selfteam&&selfteam.monsters&&selfteam.monsters.length>0)){
        isNullTeam = true;
      }

      if(type&&(type=="Surrender")){ // 一方投降队伍，不算作空队伍
        isNullTeam = false
      }

      if(isNullTeam){
        this.isFatalError = true;
        this.errorTitle = "队形调整，需要重启";
        this.errorDesc = `需要等待半小时，在左侧重启。\n注意：帐号必须完成Request Keys步骤！\n邮箱：${this.loginMail} 用户：${this.loginName}`;
        this.logout();
      }
    }
  }

}
