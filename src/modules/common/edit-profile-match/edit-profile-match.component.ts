import * as Parse from "parse";

import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core"

@Component({
  selector: 'edit-profile-match',
  templateUrl: './edit-profile-match.component.html',
  styleUrls: ['./edit-profile-match.component.scss']
})
export class EditProfileMatchComponent implements OnInit {
  @Input("rules") rules:any = null;
  @Output() rulesChange = new EventEmitter<any>(true);
  @Input("count") count:any = 0;
  @Output() countChange = new EventEmitter<any>(true);
  @Input("profile") profile:any = null


  taskList:Array<any> = [];
  taskMap = {
    depart:[],
    departRefer:[],
    branch:[],
    leader:[],
  }

  showCount(type){
    switch (type) {
      case "all":
          return this.taskList.length;
        break;
      default:
          return this.taskMap[type]?this.taskMap[type].length:0
        break;
    }
  }

  formatterPercent = (value: number) => value;
  parserPercent = (value: string) => value;
  // formatterPercent = (value: number) => `${value*100} %`;
  // parserPercent = (value: string) => (Number(value.replace(' %', ''))/100);


  constructor(
    private cdRef:ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
  }
  changeTab(ev){
    console.log(ev)
  }

  isVisible = false;
  async showModal(){
    let query = new Parse.Query("Profile")
    query.include("department")
    this.profile = await query.get(this.profile.id);
    this.isVisible = true;

    console.log(this.profile)
    if(!this.rules || this.rules&&this.rules.length == 0){
      console.log("set default value")
      this.rules = [
        { type:"depart", title: "所在部门", isEnabled: false ,right:0.5,rightMap:{},excludeMap:{} },
        { type:"departRefer", title: "相关部门", isEnabled: false,right:0.5,rightMap:{},excludeMap:{} },
        { type:"branch", title: "分管条线", isEnabled: false,right:0.5,rightMap:{},excludeMap:{} },
        { type:"leader", title: "项目考评组", isEnabled: false,right:0.5,rightMap:{},excludeMap:{} },
        { type:"include", title: "指定人员", list:[], isEnabled: false,right:0.5,rightMap:{},excludeMap:{} },
      ]
    }

    // fullfill schema
    this.rules.forEach(rule=>{
      if(!rule.right){rule.right = 0.5}
      if(!rule.rightMap){rule.rightMap = {}}
      if(!rule.excludeMap){rule.excludeMap = {}}
      if(rule.list&&rule.list.length>0){
        rule.list.forEach(item=>{
          rule.rightMap[item.id] = item.right;
        })
      }
    })
    // let excludeIndex = this.rules.findIndex(item=>item.type=="exclude");
    // if(excludeIndex){
    //   this.rules.splice(excludeIndex,1)
    // }

    this.updateRules();
  }

  handleCancel(){
    this.isVisible = false;
  }

  async updateRules(){
    console.log(this.rules)
    this.taskList = await this.loadProfileByRules(this.rules,this.profile)
    for (let index = 0; index < this.rules.length; index++) {
      let rule = this.rules[index];
      if(rule.type!="exclude"){
        console.log(rule.type)
         this.taskMap[rule.type] = await this.loadProfileByRules(this.rules,this.profile,rule.type)
      }
    }

    this.taskMap['exclude'] = await this.loadProfileByRules(this.rules,this.profile,'exclude')
    console.log(this.taskMap)
  }

  saveRules(){
      this.rulesChange.emit(this.rules);
      this.countChange.emit(this.showCount('all'));
      this.isVisible = false;
      this.currentProfile = null;
      this.currentRight = 0.5
      this.isAdd = false
  }

  addExclude(rule,item){
    rule.excludeMap[item.id] = true
    this.updateRules()
  }
  delExclude(item){
    this.rules.forEach(rule=>{
      if(rule.excludeMap[item.id] == true){
        rule.excludeMap[item.id] = false
        delete rule.excludeMap[item.id]
      }
    })
    this.updateRules()
  }

  // 新用户补录方法
  isAdd = false;
  currentProfile:any;
  currentRight:any = 0.5;
  selectPointerList =[];
  searchPointer(ev){
    let searchString = String(ev)
    let className = "Profile"
    let query = new Parse.Query(className)
    // 根据字符串类型匹配合适的搜索方式
    if(searchString.startsWith("1")){
      query.startsWith("mobile",searchString)
    }else{
      query.startsWith("name",searchString)
    }
    // 所有对象限制为当前公司账套
    // let company = this.appServ.company
    // if(company){
    //   query.equalTo("company",{"__type":"Pointer","className":"Company","objectId":company})
    // }
    query.find().then(data=>{
      this.selectPointerList = data
    })
  }
  showAddModal(): void {
    this.currentProfile = undefined;
    this.isAdd = true;
  }
  delInclude(profile){
    this.inShow = false;
    let ruleIndex = this.rules.findIndex(item=>item.type=="include");
    let pindex = this.rules[ruleIndex].list.findIndex(item=>item.id==profile.id);
    this.rules[ruleIndex].list.splice(pindex,1);
    this.inShow = true;
    this.updateRules()
  }
  inShow = true;
  getIncludeRule(){
    if(this.rules){
      let ruleIndex = this.rules.findIndex(item=>item.type=="include");
      return this.rules[ruleIndex]
    }else{
      return { type:"include", title: "指定人员", list:[], isEnabled: false };
    }
  }
  addNewProfile(rule){
    if(this.currentProfile&&this.currentProfile.id){
      // let ruleIndex = this.rules.findIndex(item=>item.type=="include");
      let p = {
        id:this.currentProfile.id,
        name:this.currentProfile.get("name"),
        right:this.currentRight
      }
      // this.rules[ruleIndex].list.push(p)
      rule.list.push(p)
      console.log(rule)
    }
    this.updateRules();
  }


  // 按规则加载方法
    async loadProfileByRules(rules,profile,type?){
    let FinalList = []
    let excludeAll = []

    rules.forEach(rule=>{
      let query = new Parse.Query("Profile")
      query.notEqualTo("objectId",profile.id) // 不评价自己

      // 设置排除列表
      let excludeList = Object.keys(rule.excludeMap).map(key=>{if(rule.excludeMap[key]==true){return key}})
      query.notContainedIn("objectId",excludeList)
      excludeAll = excludeAll.concat(excludeList)

      // 增加不被考核状态
      query.notContainedIn("state", ["领导班子，不被考核", "后勤不参与考核","退聘，不参与考核","退聘，不参与考核","借用，不参与考核"]);

      // 增加指定职级条件
      if(rule.level){
        let rexLev = new RegExp(rule.level+"|temp")
        query.matches("level", rexLev, null);
      }
      console.log(type)
      console.log(rule.type)
      console.log((type?(rule.type==type):(true)))
      if(rule.isEnabled&&(type?(rule.type==type):(true))){
        if(rule.type=="depart"){
          let queryDepart = query
          queryDepart.equalTo("department",profile.get("department").toPointer())
          FinalList.push(queryDepart)
        }
        if(rule.type=="departRefer"){
          let queryRefer = query
          let related = profile.get("department").get("related");
          if(related){
            related.push(profile.get("department").toPointer())
          }else{
            related = [profile.get("department").toPointer()]
          }
          queryRefer.containedIn("department",related)
          FinalList.push(queryRefer)
        }
        if(rule.type=="branch"){
          let queryBranch = query;
          let branch = profile.get("branch") || ['空的占位条线']
          queryBranch.containedIn("roleName",branch)
          FinalList.push(queryBranch)
        }
        if(rule.type=="leader"){
            if(profile.get("groupLeaderName")&&profile.get("groupLeaderName")!="无"){
            let queryLeader = query
            queryLeader.equalTo("groupLeaderName",profile.get("groupLeaderName"))
            FinalList.push(queryLeader)
          }
        }
        if(rule.type=="include"){
          if(rule.list.length>0){
            // let queryInclude = query;
            let queryInclude = new Parse.Query("Profile");
            let includeList = rule.list.map(item=>item.id);
            console.log(includeList);
            queryInclude.containedIn("objectId",includeList)
            FinalList.push(queryInclude)
          }
        }
      }
    })

    if(type=="exclude"){
      if(excludeAll.length>0){
        let queryExclude = new Parse.Query("Profile")
        queryExclude.containedIn("objectId",excludeAll)
        FinalList.push(queryExclude)
      }else{
        return []
      }
    }

    if(FinalList.length>0){
      let FinalQuery = Parse.Query.or(...FinalList) // 数组解构成方法参数
      FinalQuery.include("user");
      return await FinalQuery.find();
    }else{
      return []
    }
  }
}
