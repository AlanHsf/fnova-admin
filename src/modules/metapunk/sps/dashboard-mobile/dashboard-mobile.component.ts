import * as Parse from "parse";

import { Component, OnInit,ViewChild,ElementRef,ChangeDetectorRef } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';

import { HttpClient } from "@angular/common/http";
import { SpsService } from '../sps.service';

import { PlayerTableComponent } from '../player-table/player-table.component';

declare var any:any

@Component({
  selector: 'app-dashboard-mobile',
  templateUrl: './dashboard-mobile.component.html',
  styleUrls: ['./dashboard-mobile.component.scss']
})
export class SPSDashboardMobileComponent implements OnInit {

  guild:any = {};
  players:any = [];
  // countMap用法
  // 获得某个对象总数 countMap[className]
  // 获得某个对象某个字段总和 countMap[className:fieldName]
  // 按某字段分组后，获得某个对象某个字段总和 countMap[className:fieldName:groupId]
  countMap = {}
  playerRadioValue = "rating"
  guildRadioValue = "total"
  mainnetMap:any = {
    dec_price:0,
    sps_price:0,
    season:{name:null,id:null},
    PowerIn24H: "44.21 PiB",    ​
    activeMiners: 2942,    ​
    avgBlockRewardIn24h: 0,    ​
    avgBlockTime: 30.18,    ​
    avgBlocksReword: 24.405543151587718,    ​
    avgBlocksTipSet: 4.903597624869018,    ​
    avgGasPremium: 0.42159418732597076,    ​
    avgMessagesTipSet: 448.4271742927,    ​
    blockRewardIn24h: 0.0364,    ​
    currentBaseFee: 155134749,    ​
    currentBaseFeeStr: "0.1551 nanoFIL",    ​
    currentFil: 158388544,    ​
    currentPledgeCollateral: 0.17804807310210996,    ​
    currentPledgeCollateralTB: 5.697538339267519,    ​
    flowRate: 0.079194272,    ​
    flowTotal: "$11.75 billion",    ​
    gasIn32GB: 0.1973,    ​
    gasIn64GB: 0.1001,    ​
    newGasIn32GB: 0.1973,    ​
    newGasIn64GB: 0.1001,    ​
    newlyFilIn24h: 345322.51858944696,    ​
    newlyPowerCostIn32GB: 5.894816506028106,    ​
    newlyPowerCostIn64GB: 5.797648169348743,    ​
    newlyPowerPerFil: 5.894816506028106,    ​
    newlyPrice: 74.2,    ​
    oneDayMessages: 1283847,    ​
    percentChange: 5.87,    ​
    pledgeCollateral: 100924550.24379271,    ​
    sector32Gas: "0.6738 FIL",    ​
    sector64Gas: "0.3369 FIL",    ​
    sectorGas: 21057390910998690,    ​
    tipSetHeight: 1020542,    ​
    totalAccounts: 1176257,    ​
    totalBurnUp: 27395819,    ​
    totalFil: 2000000000,    ​
    totalPower: 9.052440582918052,    ​
    transferIn24H: 4585304,    ​
    updateAt: "2021-08-14T06:31:26.978Z",
  }
  poolMap={
    totalPower:0
  }

  selectedDateRange:any
  selectedDateRangeModel:any
  onDateRangePickerChange(ev) {
    this.selectedDateRange = {};
    this.selectedDateRange.from = ev[0];
    this.selectedDateRange.to = ev[1];
    this.ngOnInit();
  }


  constructor(
    private http: HttpClient,
    public spsServ: SpsService,
    private cdRef: ChangeDetectorRef,
    private drawerService: NzDrawerService

  ) { 
    this.guild = this.spsServ.guild;
    this.refreshPlayer();
    this.spsServ.loadGuilds();
  }

  async ngOnInit() {

    this.loadMainnet();
    this.getMainnetStats("24h");
    this.getMainnetStats("month");
  }
  mainnetPrice = {
    slp:0,
    eth:0,
    axs:0
  }
  marketStats:any = {
    last24Hours: {
      axieCount: 53554,
      count: 53608,
      volume: 4386137374738526575588,
      volumeUsd: 13593955.56
    }
  }
  recentlyList:any = []
  recentlySold:any = []

  showGuildPlayers = false;
  guildPlayers:any = [];
  closeGuildPlayers(){
    this.showGuildPlayers = false;
    this.guildPlayers = [];
  }
  async presentGuildPlayers(guild){
    console.log(guild)
    this.guildPlayers = await this.spsServ.loadPlayers({
      guild:guild.guild
    })
    this.openComponent()
    this.showGuildPlayers = true;
    // this.cdRef.detectChanges();
  }

  openComponent(): void {
    const drawerRef = this.drawerService.create<PlayerTableComponent, { value: string }, string>({
      nzTitle: '公会成员：',
      nzContent: PlayerTableComponent,
      nzPlacement:"bottom",
      nzClosable:true,
      nzHeight:"80vh",
      nzContentParams: {
        players: this.guildPlayers,
        pagination: false
      },
    });

    drawerRef.afterOpen.subscribe(() => {
    });

    drawerRef.afterClose.subscribe(data => {
      this.closeGuildPlayers()
    });
  }

  refreshGuilds(type?){
    type = type || this.guildRadioValue
    this.spsServ.loadGuilds({
      orderBy:type
    })
  }
  async refreshPlayer(type?){
    type = type || this.playerRadioValue
    this.players = await this.spsServ.loadPlayers({
      orderBy:type
    })
  }
  async getMainnetStats(duration='24h'){
    let data = await this.spsServ.getMainnetStats(duration);
    Object.keys(data).forEach(key=>{
      this.mainnetMap[key] = data[key]
    })
  }
  
  searchTabItem(p1,p2){

  }
  loadMainnet(){
    this.http.get("https://api2.splinterlands.com/settings").subscribe(result=>{
      let json:any = result
      console.log("MAINNET:",json)
      if(json&&json.account){
        this.mainnetMap = json
      }
    },error=>{
      console.error(error)
    })
  }
 

  loadCount(className){
    let query = new Parse.Query(className)
    query.equalTo("company",{__type:"Pointer",className:"Company",objectId:localStorage.getItem("company")})
    return query.count().then(data=>{
      this.countMap[className] = data
    })
  }
  loadColumnSum(className,fieldName,groupBy="objectId"){
    let that = this
    
    let querySum = new Parse.Query(className);
    querySum.equalTo("company",{__type:"Pointer",className:"Company",objectId:localStorage.getItem("company")});
    
    let pipeline:any = [
      // { project:{'MAX("objectId"),activity':1}},
      { group: { objectId: `$${groupBy}`, total: { $sum: `$${fieldName}` } }},
    ];
    if(this.selectedDateRange && this.selectedDateRange.from){
      console.log(this.selectedDateRange)
      pipeline.push({ match:{ startDate:{$gte:this.selectedDateRange.from,$lte:this.selectedDateRange.to} } }) // /node_modules/parse-server/lib/Adapters/Storage/Postgres/PostgresStorageAdapter.js // 修改：用hasgroup标记，出现group后，统一不加*
    }

    querySum = new Parse.Query(className);
    return (<any>(querySum.aggregate(pipeline))).then(function(results) {
      let total = 0
      console.log("sum")
      console.log(results)
      results.forEach(data=>{
        total += data.total ? data.total : 0
        that.countMap[`${className}:${fieldName}:${data.objectId}`] = data.total
      })

      that.countMap[`${className}:${fieldName}`] = total
      })
  }

  searchMap={
    Miner:null,
    Project:null,
    NoteSpace:null,
    Profile:null,
  }
  resetTabItem(className): void {
    this.searchMap[className] = null;
    // this.loadClass("ProjectTask");
    // this.search(i);
  }

}
