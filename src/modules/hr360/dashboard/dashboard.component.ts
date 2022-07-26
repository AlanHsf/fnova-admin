import * as Parse from "parse";
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core"


@Component({
  selector: 'hr360-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  // countMap用法
  // 获得某个对象总数 countMap[className]
  // 获得某个对象某个字段总和 countMap[className:fieldName]
  // 按某字段分组后，获得某个对象某个字段总和 countMap[className:fieldName:groupId]
  countMap = {}

  // countMap用法
  // 获得某个对象数组 objectMap[className]
  objectMap = {}

  topList = []; // 最终结果集
  taskList = []; // 打分任务集
  showList = []; // 当前显示的结果集
  departs = []; // 部门结果集
  evaluation:any;
  evaluations = [];
  evaluationTasks = [];

  constructor(
    private cdRef:ChangeDetectorRef,
  ) { 
  }

  evaluationType = "360" // quick survey
  async ngOnInit() {
    this.loadCount("Department")
    this.loadCount("Profile") // 加载
    this.loadCount("SurveyLog") // 加载
    this.loadUserCount();

    // 加载考评列表
    let querye = new Parse.Query("Evaluation");
    querye.include("survey");
    querye.descending("createdAt");
    this.evaluations = await querye.find();

    // 加载考评统计
    // this.loadEvaluation();

  }
  async loadEvaluation(evaluation?){
    if(!evaluation){
      // 开始加载考评绩效（Evaluation）默认为最新一个
      this.evaluation = this.evaluations[0];
    }else{
      this.evaluation = evaluation;
    }

    if(this.evaluation.get('survey').get("type")=="quick"){
      this.evaluationType = "quick"
    }

    // 开始加载考评任务（EvaluationTask）
    let queryet = new Parse.Query("EvaluationTask");
    if(this.evaluation.get("type")=="quarter"){
      queryet.include(["profile.department"]);
      queryet.equalTo("evaluation",this.evaluation.toPointer());
      this.evaluationTasks =  await queryet.find();
    } else if(this.evaluation.get("type")=="depart"){
    }


    // 开始加载考评结果（SurveyLog）
    let querySLog = new Parse.Query("SurveyLog");
    querySLog.limit(20000);
    // querySLog.include(["fromProfile","targetProfile"])
    querySLog.exists("fromProfile");

    if(this.evaluation.get("type")=="quarter"){
      querySLog.exists("targetProfile");
    }else if(this.evaluation.get("type")=="depart"){
      querySLog.ascending("updatedAt");
      querySLog.exists("targetDepartment");
      querySLog.include(["targetDepartment","fromProfile"])
    }

    querySLog.select("answer","grade","targetDepartment","targetProfile","fromProfile","quickAnswer");
    querySLog.equalTo("survey",this.evaluation.get("survey").toPointer());
    querySLog.equalTo("evaluation",this.evaluation.toPointer());
    let querySItem = new Parse.Query("SurveyItem");
    querySItem.limit(20000);
    querySItem.equalTo("survey",this.evaluation.get("survey").toPointer())

    this.surveyLogs = await querySLog.find();
    this.surveyItems = await querySItem.find();


    if(this.evaluation.get("type")=="quarter"){
          // 加载考评任务及打分关系，根据EvaluationTask，接着加载taskList和taskMap
          await this.loadAllTaskProfile(); 
          // this.loadTopList();
          // 开始计算最终成绩
          this.loadSurveyScore();
          this.showResult()
      }else if(this.evaluation.get("type")=="depart"){
        this.loadDepartScore();
    }
  }
  rightMap={}
  titleMap={}
  getFactor(profile){
    if(!profile){return 1}
    let tid = profile.id
    let tname = profile.get("name")
    let tidcard = profile.get("idcard")
    let factorOptions = this.evaluation.get("factorOptions");
    return factorOptions[tname] ||  factorOptions[tidcard] || factorOptions[tid]  || 1; // 从考评数据的系数参数中，根据个人姓名/身份证/工号进行匹配；
  }
  fixScore(v){
    if(v){
      return Number(v.toFixed(5))
    }else{
      return 0
    }
  }
  departScoreMap = {}
  departScoreList(){
    return Object.values(this.departScoreMap)
  }
  loadDepartScore(){
    this.surveyLogs.forEach(log=>{
      let depart = log.get("targetDepartment")
      let profile = log.get("fromProfile")
      if(!this.departScoreMap[depart.id]){
        this.departScoreMap[depart.id] = { name:"", scoreMap:{}}
      }
      this.departScoreMap[depart.id]['name'] = depart.get("name");
      this.departScoreMap[depart.id]['scoreMap'][profile.get('name')] = log.get("quickAnswer");
    })
    console.log(this.departScoreMap)
  }
  loadSurveyScore(){
    // 加载打分任务权重比例 this.rightMap[targetid][fromid]
    this.evaluationTasks.forEach(task=>{
      let fromid = task.get("profile").id;
      this.titleMap[fromid] = task.get("title")

      if(task.get("matchRule")){
        task.get("matchRule").forEach(rule=>{
          let rightMap = rule.rightMap;
          if(rightMap){
            Object.keys(rightMap).forEach(targetid=>{
              if(!this.rightMap[targetid]){this.rightMap[targetid]={}};
              this.rightMap[targetid][fromid] = rightMap[targetid];
            })
          }
        })
      }

    })

    // 加载所有问卷并计算
    this.surveyLogs.forEach(log=>{
      let tid = log.get("targetProfile") && log.get("targetProfile").id
      if(this.evaluation.get("type")=="depart"){
        tid = log.get("targetDepartment").id
      }
      let fid = log.get("fromProfile").id
      let fname = log.get("fromProfile").get("name")
      let right = (this.rightMap[tid] && this.rightMap[tid][fid]) || 1;
      let factor = this.getFactor(log.get("targetProfile"));
      if(this.evaluation.get("type")=="depart"){
        factor = 1
      }
      let score = log.get("grade");
      let grade = right * (score*100) / 100;
      if(!this.scoreMap[tid]){
        this.scoreMap[tid] = {}
      }
      if(this.scoreMap[tid]['scoreSurvey']){
        this.scoreMap[tid]['scoreSurvey'] += (grade)
      }else{
        this.scoreMap[tid]['scoreSurvey'] = (grade)
      }

      if(this.scoreMap[tid]['score']){
        this.scoreMap[tid]['score'] += (grade * factor)
      }else{
        this.scoreMap[tid]['score'] = (grade * factor)
      }

      if(!this.scoreMap[tid]['list']){
        this.scoreMap[tid]['list'] = [{name:fname,title:this.titleMap[fid],right:right,score:score}]
      }else{
        this.scoreMap[tid]['list'].push({name:fname,title:this.titleMap[fid],right:right,score:score})
      }
    })
    this.cdRef.detectChanges();
  }
  showType = "全部"
  departMap = {

  }
  leaderMap = {}
  leaderKeys(){
    return Object.keys(this.leaderMap).filter(name=>name!="无");
  }
  departCount(id){
    let members = this.showList.filter(item=>item.get("department").id == id)
    return members.length;
  }
  leaderCount(name){
    let members = this.showList.filter(item=>item.get("groupLeaderName") == name)
    return members.length;
  }
  refreshDepartMap(){
    this.departs.forEach(item=>{
      if(!this.departMap[item.id]) this.departMap[item.id] = {};
      this.departMap[item.id][this.showType] = this.departCount(item.id)
    })
    Object.keys(this.leaderMap).forEach(name=>{
      this.leaderMap[name][this.showType] = this.leaderCount(name)
    })
  }
  sortResult(type="score"){
    if(type=="score"){
      this.showList.sort((a,b)=>{
          if(!this.scoreMap[a.id] || !this.scoreMap[b.id]){
            return 1
          }
          if(Number(this.scoreMap[a.id]["score"])>Number(this.scoreMap[b.id]["score"])){
            return -1
          }else{
            return 1
          }
      });
    }

    if(type=="depart"){
      this.showList.sort((a,b)=>{
          if(a.get("level").slice(0,1)=="a"){
            return -1
          }
      });
      this.showList.sort((a,b)=>{
        if(a.get("level").slice(0,1)=="a" && b.get("level").slice(0,1)=="a"){
          if(a.get("department").id > b.get("department").id){
            return -1
          }else{
            return 1
          }
        }

        if(a.get("level").slice(0,1)=="b" && b.get("level").slice(0,1)=="b"){
          if(a.get("groupLeaderName") > b.get("groupLeaderName")){
            return -1
          }else{
            return 1
          }
        }
        return 1
      });

    }
  }
  searchName = null;
  searchList = [];
  searchResult(){
    if(this.searchName){
      this.searchList = this.showList.filter(item=>item.get("name") == this.searchName)
      this.cdRef.detectChanges();
    }
  }
  showResult(type="全部"){
    this.searchList = []
    this.showType = type;
    switch (type) {
      case "全部":
        this.showList = this.topList;
        break;
      case "已得分":
        if(this.evaluationType=="quick"){
          this.showList = this.topList.filter(item=>
            this.scoreMap[item.id].scoreSurvey
          );
        }
        if(this.evaluationType=="survey"){
          this.showList = this.topList.filter(item=>
            this.scoreMap[item.id]&&
            this.scoreMap[item.id]['up'].count >= 2&&
            this.scoreMap[item.id]['same'].count >= 2&&
            (this.scoreMap[item.id]['down'].count >= 2 || // 员没有下级
            item.get("level").slice(0,2) == "a7" ||
            item.get("level").slice(0,2) == "b6"
            )
          );
        }
        break;
      case "评选中":
          if(this.evaluationType=="quick"){
            this.showList = this.topList.filter(item=>
              !this.scoreMap[item.id].scoreSurvey
            );
          }
          if(this.evaluationType=="survey"){
                this.showList = this.topList.filter(item=>
                  !(this.scoreMap[item.id]&&
                  this.scoreMap[item.id]['up'].count >= 2&&
                  this.scoreMap[item.id]['same'].count >= 2&&
                  (this.scoreMap[item.id]['down'].count >= 2 || // 员没有下级
                  item.get("level").slice(0,2) == "a7" ||
                  item.get("level").slice(0,2) == "b6"
                  )&&(
                    this.scoreMap[item.id]&&
                    this.scoreMap[item.id]["score"]>0
                    )
                  )
              );
          }
        break;
      case "无成绩":
        if(this.evaluationType=="quick"){
          this.showList = this.topList.filter(item=>
            !this.scoreMap[item.id].scoreSurvey ||
            this.scoreMap[item.id].scoreSurvey == 0
          );
        }
        if(this.evaluationType=="survey"){
        this.showList = this.topList.filter(item=>
          !(
            this.scoreMap[item.id]&&
            this.scoreMap[item.id]["score"]>0
            )
          );
        }
        break;
      case "已完成":
        this.showList = this.taskList.filter(item=>
            (
              this.taskMap[item.id]&&(
              this.taskMap[item.id]["up"]+this.taskMap[item.id]["same"]+this.taskMap[item.id]["down"]<=
              this.taskMap[item.id]["updone"]+this.taskMap[item.id]["samedone"]+this.taskMap[item.id]["downdone"]
              )
            )
          );
        break;
      case "进行中":
        this.showList = this.taskList.filter(item=>
            (
              this.taskMap[item.id]&&(
              this.taskMap[item.id]["up"]+this.taskMap[item.id]["same"]+this.taskMap[item.id]["down"]>
              this.taskMap[item.id]["updone"]+this.taskMap[item.id]["samedone"]+this.taskMap[item.id]["downdone"]&&
              this.taskMap[item.id]["updone"]+this.taskMap[item.id]["samedone"]+this.taskMap[item.id]["downdone"]>0
              )
            )
          );
        break;
      case "未参与":
        this.showList = this.taskList.filter(item=>
            (
              !this.taskMap[item.id]||(
              this.taskMap[item.id]["updone"]+this.taskMap[item.id]["samedone"]+this.taskMap[item.id]["downdone"]
              == 0
              )
            )
          );
        break;
      default:
        break;
    }
    this.refreshDepartMap()
    if(type=="全部" || type=="已得分"){
      this.sortResult("score")
    }else{
      this.sortResult("depart")
    }
    this.cdRef.detectChanges();
  }
  surveyLogs = []
  surveyItems = []
  certifys = []
  showTodoModal(id){
    this.taskTodoId = id;
    this.taskTodoModal = true;
  }
  handleOk(): void {
    this.taskTodoModal = false;
  }
  handleCancel(): void {
    this.taskTodoModal = false;
  }
  taskTodoId = ""
  taskTodoModal = false
  taskMap = { // 是否完成打分任务
    /* <objectId> : {
      "up":0,
      "updone":0,
      "same":0,
      "samedone":0,
      "down":0,
      "downdone":0,
    }

    */
  }
  scoreMap = { // 是否被打分完成
    A:1,
    B:2,
    C:3,
    D:4,
    E:5,
    F:6,
    G:7,
  }
  itemRightMap={}
  itemTagMap={}
  isItemTagScoreLoaded = false
  loadItemTagScore(){  // 加载用户不同模块标签分数
      if(!this.isItemTagScoreLoaded){
      this.surveyLogs.forEach(log=>{
        let answerMap = log.get("answer")
          if(answerMap){
            Object.keys(answerMap).forEach(key=>{
              // 普通累加
              let itemScore = (this.scoreMap[answerMap[key]]);

              // 模块维度计分：各模块维度细节分数记录 this.scoreMap[pid+模块名]
              if(!this.scoreMap[log.get("targetProfile").id][this.itemTagMap[key]]){
                this.scoreMap[log.get("targetProfile").id][this.itemTagMap[key]] = 0
              }
              this.scoreMap[log.get("targetProfile").id][this.itemTagMap[key]] += itemScore
              // End of 模块计分
            })
          }
      });
      this.isItemTagScoreLoaded = true
    }
  }
  loadTopList(){
    let cid = window.localStorage.getItem("company")
    let queryProfile = new Parse.Query("Profile");
    queryProfile.limit(20000)
    queryProfile.include(["user","department"])
    queryProfile.equalTo("company",{
      __type:"Pointer",
      className:"Company",
      objectId:cid
    })
    let querySLog = new Parse.Query("SurveyLog");
    querySLog.limit(20000)
    // querySLog.include(["fromProfile","targetProfile"])
    querySLog.exists("targetProfile")
    querySLog.exists("fromProfile")
    querySLog.select("answer","grade","targetProfile","fromProfile","quickAnswer")
    querySLog.equalTo("survey",{
      __type:"Pointer",
      className:"Survey",
      objectId:"kYEkeP6iC7"
    })
    let querySItem = new Parse.Query("SurveyItem");
    querySItem.limit(20000)
    querySItem.equalTo("survey",{
      __type:"Pointer",
      className:"Survey",
      objectId:"kYEkeP6iC7"
    })
    let queryCert = new Parse.Query("UserCertify");
    queryCert.limit(20000)
    queryCert.exists("profile")
    queryCert.equalTo("company",{
      __type:"Pointer",
      className:"Company",
      objectId: localStorage.getItem("company")
    })
    let queryDepart = new Parse.Query("Department");
    queryDepart.limit(20000)
    queryDepart.containedIn("name",["分公司","总经办","党群工作部","人力资源部","财务管理部",
  "市场经营部","合约预算部","技术质量部","施工生产部","安全管理部"])
    queryDepart.equalTo("company",{
      __type:"Pointer",
      className:"Company",
      objectId: localStorage.getItem("company")
    })

    Promise.all([queryProfile.find(),querySLog.find(),querySItem.find(),queryCert.find(),queryDepart.find()]).then(async result=>{
      let profiles = result[0];
      this.topList = profiles;
      let slogs:any = result[1];
      this.surveyLogs = slogs;
      let sitems = result[2];
      let certs = result[3];
      this.certifys = result[3]
      let departs = result[4];
      this.departs = departs;

      // 题目加权：题目分数计算不同比例
      await sitems.forEach(item=>{
        let right = 0.1
        if(item.get("title").indexOf("沟通交往")>=0){ right = 0.2}
        if(item.get("title").indexOf("专业业务")>=0){ right = 0.2}
        if(item.get("title").indexOf("组织领导")>=0){ right = 0.2}
        this.itemRightMap[item.id] = right
        this.itemTagMap[item.id] = item.get("title").match(/【(.*)】/)["1"]
      })
      
      slogs.forEach(log=>{
        let answerMap = log.get("answer")
        let score = 0;

        // optimize: 已得到分数的，直接读取，无需计算
        if(log.get("grade")){
          score = log.get("grade")
        }else{
          Object.keys(answerMap).forEach(key=>{
            // // 加权计算
            // score = score + (this.scoreMap[answerMap[key]] * this.itemRightMap[key])
            // 普通累加
            let itemScore = (this.scoreMap[answerMap[key]]);
            score += itemScore
          })
          log.set("grade",score)
          log.save()
        }

        // 记录每个试卷分数
        this.scoreMap[log.id] = score

        // 分级加权计算最终成绩
        let fromProfile  = profiles.find(item=>item.id == log.get("fromProfile").id)
        let targetProfile  = profiles.find(item=>item.id == log.get("targetProfile").id)
        let fromLev = fromProfile.get("level").slice(0,2);
        let targetLev = targetProfile.get("level").slice(0,2);
        let targetId = targetProfile.id;
        let level = "up";
        if(!this.scoreMap[targetId]){ // 补充空值、权重
          this.scoreMap[targetId] = {
            scoreBase:0,scoreSurvey:0,certCount:0,
            count:0,
            up:{count:0,sum:0,right:0.5},
            same:{count:0,sum:0,right:0.3},
            down:{count:0,sum:0,right:0.2},
          }
          if(targetLev == "a3" || targetLev == "b1"){ // 补充空值、权重
            this.scoreMap[targetId] = {
              scoreBase:0,scoreSurvey:0,certCount:0,
              count:0,
              up:{count:0,sum:0,right:0.7},
              same:{count:0,sum:0,right:0.2},
              down:{count:0,sum:0,right:0.1},
            }
          }
        }
        if(fromLev < targetLev){ level = "up" }
        if(fromLev == targetLev){ level = "same" }
        if(fromLev > targetLev){ level = "down" }
        
        this.scoreMap[targetId][level].count += 1
        this.scoreMap[targetId].count += 1
        this.scoreMap[targetId][level].sum += score
      })


      // 核算证书数量，计算证书得分
      certs.forEach(cert=>{
        if(cert.get("type")=="position"){ // 仅计算岗位证书
          let profile = cert.get("profile")
          if(!this.scoreMap[profile.id]){
            this.scoreMap[profile.id] = {
            scoreBase:0,scoreSurvey:0,certCount:0,
            up:{count:0,sum:0,right:0.5},
            same:{count:0,sum:0,right:0.3},
            down:{count:0,sum:0,right:0.2},
          }

          }
          if(!this.scoreMap[profile.id]["certCount"]){
            this.scoreMap[profile.id]["certCount"] = 0
          }
          this.scoreMap[profile.id]["certCount"] += 1
        }
      })

      // 计算最终分数，并排序
      this.topList.sort((a,b)=>{
        // 预设领导Map统计数据
        this.leaderMap[a.get("groupLeaderName")] = {}
        this.leaderMap[b.get("groupLeaderName")] = {}

        if(!this.scoreMap[a.id] && !this.scoreMap[b.id]){
          return 1
        }
        if(this.scoreMap[a.id] && !this.scoreMap[b.id]){
          return -1
        }
        if(!this.scoreMap[a.id] && this.scoreMap[b.id]){
          return 1
        }

        // scoreBase 基础分计算
        let scoreBaseA = this.calScoreBaseByProfile(a)
        let scoreBaseB = this.calScoreBaseByProfile(b)
        this.scoreMap[a.id]["scoreBase"] = scoreBaseA.toFixed(2)
        this.scoreMap[b.id]["scoreBase"] = scoreBaseB.toFixed(2)


        // scoreSurvey 评价分计算
        // 平级评论为0时，将权重平均分配给上级下级
        let rightupa = this.scoreMap[a.id]["up"].right
        let rightsamea = this.scoreMap[a.id]["same"].right
        let rightdowna = this.scoreMap[a.id]["down"].right
        let rightupb = this.scoreMap[b.id]["up"].right
        let rightsameb = this.scoreMap[b.id]["same"].right
        let rightdownb = this.scoreMap[b.id]["down"].right
        if(!this.scoreMap[a.id]["same"].count){
          rightupa += rightsamea/2
          rightdowna += rightsamea/2
        }
        if(!this.scoreMap[b.id]["same"].count){
          rightupb += rightsameb/2
          rightdownb += rightsameb/2
        }

        // scoreSurvey A
          let scoreSurveyA = rightupa*this.scoreMap[a.id]["up"].sum/(this.scoreMap[a.id]["up"].count?this.scoreMap[a.id]["up"].count:1)
          scoreSurveyA +=  rightsamea*this.scoreMap[a.id]["same"].sum/(this.scoreMap[a.id]["same"].count?this.scoreMap[a.id]["same"].count:1)
          if(a.get("level").slice(0,2)=="a7" || a.get("level").slice(0,2)=="b6"){
            scoreSurveyA +=  rightdowna*this.scoreMap[a.id]["same"].sum/(this.scoreMap[a.id]["same"].count?this.scoreMap[a.id]["same"].count:1);
          }else{ // 不是员才有下级
            scoreSurveyA +=  rightdowna*this.scoreMap[a.id]["down"].sum/(this.scoreMap[a.id]["down"].count?this.scoreMap[a.id]["down"].count:1);
          }
          scoreSurveyA *= 0.7;

        // scoreSurvey B
          let scoreSurveyB = rightupb*this.scoreMap[b.id]["up"].sum/(this.scoreMap[b.id]["up"].count?this.scoreMap[b.id]["up"].count:1)
          scoreSurveyB +=  rightsameb*this.scoreMap[b.id]["same"].sum/(this.scoreMap[b.id]["same"].count?this.scoreMap[b.id]["same"].count:1)
          if(a.get("level").slice(0,2)=="a7" || a.get("level").slice(0,2)=="b6"){
            scoreSurveyB +=  rightdownb*this.scoreMap[b.id]["same"].sum/(this.scoreMap[b.id]["same"].count?this.scoreMap[b.id]["same"].count:1);
          }else{ // 不是员才有下级
            scoreSurveyB +=  rightdownb*this.scoreMap[b.id]["down"].sum/(this.scoreMap[b.id]["down"].count?this.scoreMap[b.id]["down"].count:1);
          }
          scoreSurveyB *= 0.7;
          this.scoreMap[a.id]["scoreSurvey"] = scoreSurveyA.toFixed(2)
          this.scoreMap[b.id]["scoreSurvey"] = scoreSurveyB.toFixed(2)

          this.scoreMap[a.id]["score"] = (scoreSurveyA+scoreBaseA).toFixed(2)
          this.scoreMap[b.id]["score"] = (scoreSurveyB+scoreBaseB).toFixed(2)

          if((scoreBaseA+scoreSurveyA)>(scoreBaseB+scoreSurveyB)){
            return -1
          }else{
            return 1
          }
      })
      this.showResult(); // 显示全部打分结果
    })
  }
  calScoreBaseByProfile(profile){
    // 学历
    let eduScore = 7;
    switch (profile.get("education")) {
      case "专科":
        eduScore = 8;
        break;
      case "本科":
        eduScore = 8.5;
        break;
      case "硕士":
        eduScore = 9;
        break;
      default:
        break;
    }
    // 职称 // 证书
    let titleScore = 3;
    let certScore = 3;

    if(this.scoreMap[profile.id]["certCount"]){
      certScore = 7.5
      if(this.scoreMap[profile.id]["certCount"]=2){
        certScore = 8
      }
      if(this.scoreMap[profile.id]["certCount"]=3){
        certScore = 8.5
      }
    }

    let titleLev = profile.get("titleLev")
    if(titleLev){
      if(titleLev.startsWith("初级")){
        titleScore = 8
        certScore = 8
      }
      if(titleLev.startsWith("中级")){
        titleScore = 8.5
        certScore = 8.5
      }
      if(titleLev.startsWith("高级")){
        titleScore = 9
        certScore = 9
      }
    }

    // 司龄
    let age = profile.get("workingAge");
    let ageScore = 2;
    if(age>5){ageScore=2.5}
    if(age>=10){ageScore=3}
    this.scoreMap[profile.id]["eduScore"] = titleScore
    this.scoreMap[profile.id]["titleScore"] = titleScore
    this.scoreMap[profile.id]["certScore"] = certScore
    this.scoreMap[profile.id]["ageScore"] = ageScore
    return eduScore+titleScore+certScore+ageScore
  }
  loadUserCount(){
    let query = new Parse.Query("VolunteerProfile")
    query.select("name")
    query.limit(1500)
    query.find().then(names=>{
      let queryU = new Parse.Query("_User")
      names = names.map(n=>n.get("name")?n.get("name"):"Ryan")
      queryU.notContainedIn("realname", names)
      queryU.count().then(count=>{
        this.countMap["newUser"] = count
      })
    })
  }

  loadCount(className){
    let query = new Parse.Query(className)
    if(className=="SurveyLog"){
      query.equalTo("type","survey")
    }else{
    let company = localStorage.getItem("company");
    query.equalTo("company",{"__type":"Pointer","className":"Company","objectId": company});
  }
    return query.count().then(data=>{
      this.countMap[className] = data
    })
  }
  loadColumnSum(className,fieldName,groupBy="objectId"){
    let that = this
    let querySum = new Parse.Query(className)

    let pipeline = [
      { group: { objectId: `$${groupBy}`, total: 1 } }
    ];

    querySum = new Parse.Query(className);
    return (<any>(querySum.aggregate(pipeline))).then(function(results) {
      let total = 0
      results.forEach(data=>{
        total += data.total
        that.countMap[`${className}:${fieldName}:${data.objectId}`] = data.total
      })

      that.countMap[`${className}:${fieldName}`] = total
      })
  }
  
  @ViewChild('activityPie',{static:true}) activityPie: ElementRef;
  loadObjectData(className){
    let query = new Parse.Query(className)
    // return new Promise((res,rej)=>{
      return query.find().then(data=>{
      this.objectMap[className] = data
      // res(data)
    })
  //   .catch(err=>{rej(err)})
  // })
  }
  showActivityPie(){
    let activityPie = (<any>echarts).init(this.activityPie.nativeElement,'light');
    let data = this.objectMap["UserCertify"].map(item=>{return {
      name:item.get("idType"),
      value:this.countMap["UserCertify:count:"+item.id],
      color: item.get("color")||"cyan"
    }
  })
  data.sort((a,b)=>a>b?1:-1)

    let legend = data.map(item=>item.name)
    let option = {
          title : {
            text: '志愿活动总体情况概览',
            subtext: '2017-至今',
            x:'center'
          },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                bottom: '0%',
                data: legend
            },
            series: [
                {
                    name:'服务时长',
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '13%'],
        
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                      {name:"总时长",value:this.countMap["ActivityRegister:serviceTime"],selected:false}
                    ]
                },
                {
                    name:'服务时长',
                    type:'pie',
                    radius: ['15%', '45%'],
                    // startAngle: 90,
                    minAngle: 40, // 扇区最小角度，解决过小Label重叠问题
                    // roseType: 'area',
                    labelLine: {
                      normal: {
                          smooth: 0.2,
                          length: 20,
                          length2: 10
                      }
                    },
                    label: {
                        normal: {
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}小时  {per|{d}%}  ',
                            backgroundColor: '#EEE',
                            borderColor: '#fff',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 14,
                                    lineHeight: 25
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        }
                    },
                    data:data
                }
            ]
        };
        activityPie.setOption(option);
  }

  // 抽取规则情况加载
  isLoaded:boolean = false
  async loadAllTaskProfile(){
    var profileMap = {}
    var tasklist = []
    
    for (let index = 0; index < this.evaluationTasks.length; index++) {
      let task = this.evaluationTasks[index];
      let profiles = []
      if(task.get("matchRule")){
          profiles = await this.loadProfileByRules(task.get("matchRule"),task.get("profile"));
      }
      profiles.forEach(p=>{profileMap[p.id]=p})
      tasklist.push(task.get("profile"))
      await this.loadWorkScoreTasks(task.get("profile"),profiles);
    }


    this.topList = Object.values(profileMap);
    this.taskList = tasklist;
    this.isLoaded = true
  }
  async loadWorkScoreTasks(profile:Parse.Object,workTasks){
      let surveyLogs = [] // 已打分的问卷清单
    
      surveyLogs = this.surveyLogs.filter(item=>(item as any).get("fromProfile").id == profile.id)
      if(!this.taskMap[profile.id]) {
          this.taskMap[profile.id]={
            "up":0,
            "updone":0,
            "same":0,
            "samedone":0,
            "down":0,
            "downdone":0,
            "todolist":[],
            "doneMap":{}
          }
      }
      workTasks.forEach(target=>{
        let level = this.checkLevForTaskMap(profile,target)
        this.taskMap[profile.id][level] += 1
        this.taskMap[profile.id]["todolist"].push({
          id:target.id,
          name:target.get("name")
        })
      })
      surveyLogs.forEach(log=>{
        let level = this.checkLevForTaskMap(profile,log.get("targetProfile"))
        this.taskMap[profile.id][level+"done"] += 1
        this.taskMap[profile.id]["doneMap"][log.get("targetProfile").id] = true
      })
      this.cdRef.detectChanges();
      return
}



  // 按规则加载方法
  async loadProfileByRules(rules,profile,type?){
    let FinalList = []
    let excludeAll = []

    if(!rules){
      alert("未配置考评规则，请配置后查看报告");
      return
    }
    rules.forEach(rule=>{
      let query = new Parse.Query("Profile");
      query.include("department");

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
            queryInclude.include("department");

            let includeList = rule.list.map(item=>item.id);
            queryInclude.containedIn("objectId",includeList)
            FinalList.push(queryInclude)
          }
        }
      }
    })

    if(type=="exclude"){
      if(excludeAll.length>0){
        let queryExclude = new Parse.Query("Profile");
        queryExclude.include("department");
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

checkLevForTaskMap(p1,p2){
  let level = "same";
  if(p1.get('level') && p2.get('level')){
    let fromLev = p1.get("level").slice(0,2);
    let targetLev = p2.get("level").slice(0,2);

    if(fromLev < targetLev){ level = "down" }
    if(fromLev == targetLev){ level = "same" }
    if(fromLev > targetLev){ level = "up" }
  }
  return level
}
checkLevForScoreMap(p1,p2){
  let level = "up";
  let fromLev = p1.get("level").slice(0,2);
  let targetLev = p2.get("level").slice(0,2);

  if(fromLev < targetLev){ level = "up" }
  if(fromLev == targetLev){ level = "same" }
  if(fromLev > targetLev){ level = "down" }
  return level
}
reports = []
loadReport(){
  if(this.reports.length==0){
    return new Promise((res,rej)=>{
      let query = new Parse.Query("Report")
      query.equalTo("annual","2019")
      query.exists("profile");
      query.limit(1000)
      query.equalTo("company",{__type:"Pointer",className:"Company",objectId:"FSvoOMOi5W"})
      query.find().then(data=>{
        this.reports = data
        res()
      })
    })
  }
  return
}
departHistorys = []
loadDepartHistory(){
  if(this.departHistorys.length==0){
    return new Promise((res,rej)=>{
      let query = new Parse.Query("DepartHistory")
      query.limit(2000);
      query.ascending("date")
      query.exists("date")
      query.find().then(data=>{
        this.departHistorys = data
        res()
      })
    })
  }
  return
}
async exportResult(){
  // export showList to xls
  //要导出的json数据
  const jsonData = []

  
  let fromHeader = "<td>评价人</td>"

  this.showList.forEach(p=>{ 
    console.log(this.evaluationType);
    let from = ""
    if(this.evaluationType == "quick"){
      let sMap = {}
      from = '<td></td><td></td><td></td><td></td><td></td>'
      fromHeader = "<td>经理</td><td>书记</td><td>分管领导</td><td>部门负责</td><td>项目经理</td>"
      if(this.scoreMap[p.id]){
        this.scoreMap[p.id].list.forEach(li=>{
            sMap[li.title] = this.fixScore(li.score);
            // from += `${li.name}:权重${li.right}-打分${li.score} |`
            console.log(li);
        })
        console.log(sMap);
        from = `${sMap['经理']||""}</td><td>${sMap['书记']||""}</td><td>${sMap['分管领导']||""}</td><td>${sMap['部门负责']||""}</td><td>${sMap['项目经理']||""}`;
      }
    }else{
      from = this.scoreMap[p.id]&&`上级${this.scoreMap[p.id]['up'].count || 0}人/平级${this.scoreMap[p.id]['same'].count || 0}人/下级${this.scoreMap[p.id]['down'].count || 0}人`;
    }

    jsonData.push({
      name:p.get("name"),
      depart:p.get("department")&&p.get("department").get("name"),
      factor:this.getFactor(p),
      leader:p.get("groupLeaderName"),
      done:this.taskMap[p.id]&&(this.taskMap[p.id]["updone"]+this.taskMap[p.id]["samedone"]+this.taskMap[p.id]["downdone"]),
      all:this.taskMap[p.id]&&(this.taskMap[p.id]["up"]+this.taskMap[p.id]["same"]+this.taskMap[p.id]["down"]),
      base:this.fixScore(this.scoreMap[p.id]&&this.scoreMap[p.id].scoreBase),
      survey:this.fixScore(this.scoreMap[p.id]&&this.scoreMap[p.id].scoreSurvey),
      from:from,
      score:this.fixScore(this.scoreMap[p.id]&&this.scoreMap[p.id].score),
      state:p.get("state"),
    })
  })

  //列标题
  let str = `<tr><td>姓名</td><td>部门</td><td>系数</td><td>考评组</td>
  <td>打分（已完成）</td><td>打分（共计）</td>
  <td>基础分</td><td>评价分</td>${fromHeader}<td>总分</td>
  <td>状态</td>
  </tr>`;
  //循环遍历，每行加入tr标签，每个单元格加td标签
  for(let i = 0 ; i < jsonData.length ; i++ ){
    str+='<tr>';
    for(let item in jsonData[i]){
        //增加\t为了不让表格显示科学计数法或者其他格式
        let content = jsonData[i][item]
        str+=`<td>${ content + '\t'}</td>`;     
    }
    str+='</tr>';
  }
  //Worksheet名
  let worksheet = 'Sheet1'
  let uri = 'data:application/vnd.ms-excel;base64,';

  str = str.replace(/undefined/g,"")

  //下载的表格模板数据
  let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
  xmlns:x="urn:schemas-microsoft-com:office:excel" 
  xmlns="http://www.w3.org/TR/REC-html40">
  <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${str}</table></body></html>`;

  //下载模板
  window.location.href = uri + this.base64(template)
}
//输出base64编码
 base64 (s) { return window.btoa(unescape(encodeURIComponent(s))) }

 async exportChartPdf(type,id){
   await this.loadReport();
   await this.loadDepartHistory();
   this.loadItemTagScore() // 加载模块成绩
   let profiles = []
   if(type == "depart"){
    profiles = this.topList.filter(item=>item.get("department").id == id);
   }else if(type=="leader"){
    profiles = this.topList.filter(item=>item.get("groupLeaderName") == id);
   }else if(type=="one"){
    profiles = [id]
   }

   // 优化技巧 animation: false 关闭动画，避免渲染卡顿
   let templateHead = `
      <meta charset="utf-8">
      <title>综合统计分析报告.pdf</title>
      <!-- 引入 echarts.js -->
      <script defer='defer' src="https://www.echartsjs.com/examples/vendors/echarts/echarts.min.js?_v_=1584687926098"></script>
      <style>
      @page {    size: A4 protrait;    margin: 20px 5px 25px 5px;}
      @media print {
          html, body { width: 210mm; height: 297mm; }
      }
      .onepage-no{ page-break-after:always; }
      </style>

      <script defer='defer'>
          var thisChart = {}
          var thisOptions = {}
      </script>

      <style>
          .report-info{
            margin-top:10mm;
            page-break-after: always;width: 92%;margin-left: 4%;
          }
          .report-info td{border:1px solid grey;text-align: center;padding:5px;}
          .report-info .title{font-weight: bold;font-size:22px;}
          .report-info .subtitle{font-weight: bold;font-size:22px;}
      </style>
   `;
   let templateReport = ``
    // 渲染性能测试（360个报告，直接卡死，等待5分钟）
    // 渲染性能测试（30个报告，等待4秒）
    profiles.forEach(async profile=>{
      // 开始拼接基础信息报表和年度总结
      let workDate = ""
      if(profile.get("workDate")){
        workDate = `${profile.get("workDate").getFullYear()}-${profile.get("workDate").getMonth()+1}-${profile.get("workDate").getDate()}`
      }

      let birthday = profile.get("idcard")
      birthday = `${birthday.slice(6,10)}-${birthday.slice(10,12)}-${birthday.slice(12,14)}`

      let certs = this.certifys.filter(item=>item.get("profile").id == profile.id)
      let positionString = ""
      let titleString = ""
      certs.forEach(item=>{
        if(item.get("type")=="position"){          positionString += item.get("idType") + "、"        }
        if(item.get("type")=="title"){          titleString += item.get("idType") + "、"        }
      })
      positionString = positionString.slice(0,positionString.length-1)
      titleString = titleString.slice(0,titleString.length-1)

      let report = this.reports.find(item=>item.get("profile").id == profile.id);

      let dhistorys = this.departHistorys.filter(item=>item.get("profile").id == profile.id);
      let hisString = ""
      let hisCount = 0
      dhistorys.forEach(his=>{
        hisCount +=1;
        hisString+= `<tr height="41" style="height:33px">
          <td colspan="2" x:num="42217">                ${his.get("date").slice(0,10)}            </td>
          <td colspan="3" x:str="">                ${his.get("remark")}            </td>
          <td colspan="2" x:str="">                ${his.get("position")}            </td>
      </tr>`
      })

      templateReport +=`
      <table class="report-info" cellpadding="0" cellspacing="0">
    <colgroup>
        <col width="102" style="width:82px"/><col width="126" style="width:101px"/><col width="65" style="width:52px"/><col width="160" style="width:128px"/><col width="90" style="width:72px"/><col width="161" style="width:129px"/><col width="76" style="width:61px"/><col width="147" style="width:118px"/>
    </colgroup>
    <tbody>
        <tr height="37" style="height:30px" class="firstRow">
            <td class="title" colspan="8">
                员工信息
            </td>
        </tr>
        <tr height="58" style="height:47px">
            <td height="47" x:str="" style="">                姓名            </td>
            <td x:str="">                ${profile.get("name")}            </td>
            <td x:str="">                性别            </td>
            <td x:str="">                ${profile.get("sex")}            </td>
            <td x:str="">                出生年月            </td>
            <td x:num="34012">                ${birthday}            </td>
            <td width="61" x:str="" style="">                进单位时间            </td>
            <td x:num="42217">                ${profile.get("entryDate").getFullYear()}-${profile.get("entryDate").getMonth()+1}-${profile.get("entryDate").getDate()}            </td>
        </tr>
        <tr height="58" style="height:47px">
            <td height="47" width="82" x:str="" style="">                参加工作时间            </td>
            <td x:num="41852">                ${workDate}            </td>
            <td x:str="">                学历            </td>
            <td x:str="">                ${profile.get("education")}（${profile.get("eduType")}）            </td>
            <td x:str="">                毕业院校            </td>
            <td x:str="">                ${profile.get("school")}            </td>
            <td x:str="">                专业            </td>
            <td x:str="">                ${profile.get("schoolMajor")||""}            </td>
        </tr>
        <tr height="58" style="height:47px">
            <td height="47" x:str="" style="">                部门/项目            </td>
            <td colspan="2" x:str="" style="border-right:1px solid #000000">                ${profile.get("department").get("name")}            </td>
            <td x:str="">                现岗位            </td>
            <td colspan="2" x:str="" style="border-right:1px solid #000000">                ${profile.get("position")||""}            </td>
            <td x:str="">                职称            </td>
            <td x:str="">                ${profile.get("title")||""}            </td>
        </tr>
        <tr height="58" style="height:47px">
            <td height="47" x:str="" style="">                岗位证书            </td>
            <td colspan="7" x:str="" style="border-right:1px solid #000000">                ${positionString}            </td>
        </tr>
        <tr height="58" style="height:47px">
            <td height="47" width="82" x:str="" style="">                （执）职业资格证书            </td>
            <td colspan="7" x:str="" style="border-right:1px solid #000000">                ${titleString}            </td>
        </tr>
        <tr height="41" style="height:33px">
            <td colspan="8" class="subtitle" style="vertical-align: middle;">                在职履历            </td>
        </tr>
        <tr height="41" style="height:33px">
            <td rowspan="${hisCount+2}" height="233" width="82" x:str="" style="border-bottom: 1px solid rgb(0, 0, 0);">
                本单位工作经历
            </td>
            <td colspan="2" x:str="">                年&nbsp;&nbsp; 月            </td>
            <td colspan="3" x:str="">                部门/项目            </td>
            <td colspan="2" x:str="">                岗&nbsp;&nbsp; 位            </td>
        </tr>
        ${hisString}
        <tr height="41" style="height:33px">
            <td colspan="2"></td>            <td colspan="3"></td>            <td colspan="2"></td>        
        </tr>
        <tr height="41" style="height:33px">
            <td colspan="8" class="subtitle" style="vertical-align: middle;">                年度总结（2019）            </td>
        </tr>
        <tr height="41" style="height:33px">
            <td colspan="8">${report&&report.get("content")}</td>
        </tr>
    </tbody>
</table>
      `

      // 开始拼接分数报表Chart渲染页面
     if(this.scoreMap[profile.id]&&(this.scoreMap[profile.id].scoreSurvey>0) && (this.scoreMap[profile.id].scoreBase>0)){

     templateReport += `
    <div id="profile-${profile.id}" class="onepage">
    <!-- profile title -->
    <div style="text-align: center;">
        <h1>${ profile.get("level").slice(0,1)=="a"?profile.get("department").get("name"):profile.get("groupLeaderName")+"项目组" }/${profile.get("name")}</h1>
        <h2>总分：${this.scoreMap[profile.id].score} | 基础分：${this.scoreMap[profile.id].scoreBase} | 评价分(${this.scoreMap[profile.id]['up'].count}/${this.scoreMap[profile.id]['same'].count}/${this.scoreMap[profile.id]['down'].count})：${this.scoreMap[profile.id].scoreSurvey}</h2>
    </div>
    <div id="profile-${profile.id}-brief" style="width: 100%;height:120mm;padding-left:5mm;margin-top:10mm;">
      <div id="profile-${profile.id}-level" style="width: 100mm;height:100%;float:left;"></div>
      <div id="profile-${profile.id}-base" style="width: 110mm;height:70%;float:left;"></div>
    </div>

    <div id="profile-${profile.id}-survey" style="width: 100%;height:130mm;padding-left:5mm;">
      <div id="profile-${profile.id}-survey-power" style="width: 100mm;height:100%;float:left;"></div>
      <div id="profile-${profile.id}-survey-mind" style="width: 110mm;height:80%;float:left;"></div>
    </div>

   
    

    <script defer='defer' type="text/javascript">
        // 基于准备好的dom，初始化echarts实例
        thisChart = echarts.init(document.getElementById('profile-${profile.id}-survey-power'));
        // 指定图表的配置项和数据
        thisOptions = {
            title: {
                text: '能力分值统计'
            },
            animation: false,
            tooltip: {},
            legend: {
                show:false,
                data: ['评价分析（雷达图）']
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#000',
                        padding: [3, 5]
                    }
                },
                indicator: [
                    { name: '组织领导能力', max: 20},
                    { name: '专业业务能力', max: 20},
                    { name: '沟通交往能力', max: 20},
                ]
            },
            series: [{
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                label:{
                    show:true,
                    position:[12,-12],
                    color:"#000",
                },
                // areaStyle: {normal: {}},
                data: [
                    {
                        value: [ ${Number((this.scoreMap[profile.id]["组织领导能力"]/this.scoreMap[profile.id]["count"]).toFixed(2))}, ${Number((this.scoreMap[profile.id]["专业业务能力"]/this.scoreMap[profile.id]["count"]).toFixed(2))}, ${Number((this.scoreMap[profile.id]["沟通交往能力"]/this.scoreMap[profile.id]["count"]).toFixed(2))} ],
                        name: '评价分析（雷达图）'
                    }
                ]
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        thisChart.setOption(thisOptions);
    </script>

    <script defer='defer' type="text/javascript">
        // 基于准备好的dom，初始化echarts实例
        thisChart = echarts.init(document.getElementById('profile-${profile.id}-survey-mind'));
        // 指定图表的配置项和数据
        thisOptions = {
            title: {
                text: '态度分值统计'
            },
            animation: false,
            tooltip: {},
            legend: {
                show:false,
                data: ['评价分析（雷达图）']
            },
            radar: {
                // shape: 'circle',
                radius:"55%",
                name: {
                    textStyle: {
                        color: '#000',
                        padding: [3, 5]
                    }
                },
                indicator: [
                    { name: '纪律性', max: 10},
                    { name: '责任心', max: 10},
                    { name: '敬业精神', max: 10},
                    { name: '团队协作', max: 10}
                ]
            },
            series: [{
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                label:{
                    show:true,
                    position:[12,-12],
                    color:"#000",
                },
                // areaStyle: {normal: {}},
                data: [
                    {
                        value: [${Number((this.scoreMap[profile.id]["纪律性"]/this.scoreMap[profile.id]["count"]).toFixed(2))}, ${Number((this.scoreMap[profile.id]["责任心"]/this.scoreMap[profile.id]["count"]).toFixed(2))}, 
                        ${Number((this.scoreMap[profile.id]["敬业精神"]/this.scoreMap[profile.id]["count"]).toFixed(2))}, ${Number((this.scoreMap[profile.id]["团队协作"]/this.scoreMap[profile.id]["count"]).toFixed(2))}],
                        name: '评价分析（雷达图）'
                    }
                ]
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        thisChart.setOption(thisOptions);
    </script>
    
    <script defer='defer' type="text/javascript">
        // 基于准备好的dom，初始化echarts实例
        thisChart = echarts.init(document.getElementById('profile-${profile.id}-level'));
        // 指定图表的配置项和数据
        thisOptions = {
            title: {
                text: '各级评分统计'
            },
            animation: false,
            tooltip: {},
            legend: {
                show:false,
                data: ['各级评分']
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#000',
                        padding: [3, 5]
                    }
                },
                indicator: [
                    { name: '上级', max: 100},
                    { name: '下级', max: 100},
                    { name: '平级', max: 100},
                ]
            },
            series: [{
                name: '各级评分',
                type: 'radar',
                label:{
                    show:true,
                    position:[12,-12],
                    color:"#000",
                },
                // areaStyle: {normal: {}},
                data: [
                    {
                        value: [${Number((this.scoreMap[profile.id]['up'].sum/this.scoreMap[profile.id]['up'].count).toFixed(2))}, ${Number((this.scoreMap[profile.id]['down'].sum/this.scoreMap[profile.id]['down'].count).toFixed(2))}, ${Number((this.scoreMap[profile.id]['same'].sum/this.scoreMap[profile.id]['same'].count).toFixed(2))}],
                        name: '各级评分'
                    }
                ]
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        thisChart.setOption(thisOptions);
    </script>
<script defer='defer' type="text/javascript">
    // 基于准备好的dom，初始化echarts实例
    thisChart = echarts.init(document.getElementById('profile-${profile.id}-base'));
    // 指定图表的配置项和数据
    thisOptions = {
        title: {
            text: '基础分值统计'
        },
        animation: false,
        tooltip: {},
        legend: {
            show:false,
            data:['分值']
        },
        xAxis: {
            data: ["工龄","学历","职称","证书"]
        },
        yAxis: {},
        series: [{
            name: '分值',
            type: 'bar',
            label: {
                show:true,
                position:"top"
            },
            data: [${this.scoreMap[profile.id]["ageScore"]}, ${this.scoreMap[profile.id]["eduScore"]}, 
            ${this.scoreMap[profile.id]["titleScore"]}, ${this.scoreMap[profile.id]["certScore"]}]
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    thisChart.setOption(thisOptions);
</script>
    </div>
`
}

   })

    let printModal: any = window.open("",'newwindow',
    'width=900, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');

    printModal.document.body.innerHTML = templateHead+templateReport;
    this.setHTMLWithScript(printModal,templateHead)
    this.setHTMLWithScript(printModal,templateReport)
    // printModal.print(); // 打开后自动打印
 }

 runScript(container,script){
  return new Promise((reslove, rejected) => {
    // 直接 document.head.appendChild(script) 是不会生效的，需要重新创建一个
    const newScript = document.createElement('script');
    // 获取 inline script
    newScript.innerHTML = script.innerHTML;
    // 存在 src 属性的话
    const src = script.getAttribute('src');
    if (src) newScript.setAttribute('src', src);

    // script 加载完成和错误处理
    newScript.onload = () => reslove();
    newScript.onerror = err => rejected();
    container.document.head.appendChild(newScript);
    container.document.head.removeChild(newScript);
    if (!src) {
        // 如果是 inline script 执行是同步的
        reslove();
    }
  })
}

setHTMLWithScript(container, rawHTML){
  container.document.innerHTML = rawHTML;
  const scripts = container.document.querySelectorAll('script');

  return Array.prototype.slice.apply(scripts).reduce((chain, script) => {
    return chain.then(() => this.runScript(container, script));
  }, Promise.resolve());
}
}
