import * as Parse from "parse";

import { Component, OnInit,ViewChild,ElementRef,Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"

import { HttpClient } from "@angular/common/http";
import { SpsService } from '../sps.service';

declare var any:any

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class SPSDashboardOverviewComponent implements OnInit {

  @Input("guildKey") guildKey:any

  guild:any = {};
  // countMap用法
  // 获得某个对象总数 countMap[className]
  // 获得某个对象某个字段总和 countMap[className:fieldName]
  // 按某字段分组后，获得某个对象某个字段总和 countMap[className:fieldName:groupId]
  countMap = {}
  mainnetMap:any = {
    dec_price:0,
    sps_price:0,
    season:{name:null,id:null},
  }

  selectedDateRange:any
  selectedDateRangeModel:any
  onDateRangePickerChange(ev) {
    this.selectedDateRange = {};
    this.selectedDateRange.from = ev[0];
    this.selectedDateRange.to = ev[1];
    this.ngOnInit();
  }

  players:any = []

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public spsServ: SpsService
  ) { 
    this.guild = this.spsServ.guild;
    
  }

  async ngOnInit() {
    setTimeout(()=>{
      this.refresh();
    },15*1000)
    this.refresh();
    this.loadMainnet();

    this.getMainnetStats("24h");
    this.getMainnetStats("month");

  }
  refresh(){
    this.activatedRoute.params.subscribe(async params => {
      if(params.guild&&params.pin){
        this.guild = await this.spsServ.guildAuth(params.guild,params.pin)
      }
      let guildid = params.guild
      if(this.guild&&this.guild.id){
        guildid = this.guild.id
      }
      let lgid = localStorage.getItem("META_GUILD");
      console.log(lgid)
      if(lgid){
        guildid = lgid
      }else{
        guildid = this.guildKey
      }
      this.players = await this.spsServ.loadPlayers({
        guild:guildid
      })
      // this.players = await this.spsServ.loadGuildPlayers(guildid);
    })
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

  async getMainnetStats(duration='24h'){
    let data = await this.spsServ.getMainnetStats(duration);
    Object.keys(data).forEach(key=>{
      this.mainnetMap[key] = data[key]
    })
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
 

  loadClass(className,searchValue?){
    let query = new Parse.Query(className)
    let searchCol = "title"

    // 设置Schema特定查询规则
    if(className=="Profile"){
      query.include("user")
      searchCol = "name"
    }
    if(className=="Project"){
      query.notEqualTo("isClosed",true);
    }
    if(className=="ProjectTask"){
      query.include(["project","assignee.user"])
      query.notEqualTo("isClosed",true);
      let innerQuery = new Parse.Query("Project");
      innerQuery.notEqualTo("isClosed",true);
      query.matchesQuery("project", innerQuery);
    }

    // 设置查询条件
    if(searchValue){
      query.contains(searchCol,searchValue);
    }
    query.equalTo("company",{__type:"Pointer",className:"Company",objectId:localStorage.getItem("company")})
    return query.find().then(data=>{
      console.log(data)
    })
  }

  searchMap={
    Miner:null,
    Project:null,
    NoteSpace:null,
    Profile:null,
  }


}
