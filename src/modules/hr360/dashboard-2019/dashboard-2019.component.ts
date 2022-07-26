import * as Parse from "parse";
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core"


@Component({
  selector: 'hr360-dashboard',
  templateUrl: './dashboard-2019.component.html',
  styleUrls: ['./dashboard-2019.component.scss']
})
export class Dashboard2019Component implements OnInit {
  
  // countMap用法
  // 获得某个对象总数 countMap[className]
  // 获得某个对象某个字段总和 countMap[className:fieldName]
  // 按某字段分组后，获得某个对象某个字段总和 countMap[className:fieldName:groupId]
  countMap = {}

  // countMap用法
  // 获得某个对象数组 objectMap[className]
  objectMap = {}

  topList = []; // 最终结果集
  showList = []; // 当前显示的结果集
  departs = []; // 部门结果集

  constructor(
    private cdRef:ChangeDetectorRef,
  ) { 
  }

  ngOnInit() {
    this.loadCount("Department")
    this.loadCount("Profile") // 加载
    this.loadCount("SurveyLog") // 加载
    // this.loadUserCount();
    this.loadTopList();
     // 根据activity分组，加载所有ActivityRegister服务记录的serviceTime总和
    // this.loadColumnSum("UserCertify",'count',"activity").then(()=>{
    //   this.loadObjectData("UserCertify").then(()=>{
    //     this.showActivityPie()
    //   })
    // })
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
        this.showList = this.topList.filter(item=>
          this.scoreMap[item.id]&&
          this.scoreMap[item.id]['up'].count >= 2&&
          this.scoreMap[item.id]['same'].count >= 2&&
          (this.scoreMap[item.id]['down'].count >= 2 || // 员没有下级
          item.get("level").slice(0,2) == "a7" ||
          item.get("level").slice(0,2) == "b6"
          )
        );
        break;
      case "评选中":
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
        break;
      case "无成绩":
        this.showList = this.topList.filter(item=>
          !(
            this.scoreMap[item.id]&&
            this.scoreMap[item.id]["score"]>0
            )
          );
        break;
      case "已完成":
        this.showList = this.topList.filter(item=>
            (
              this.taskMap[item.id]&&(
              this.taskMap[item.id]["up"]+this.taskMap[item.id]["same"]+this.taskMap[item.id]["down"]<=
              this.taskMap[item.id]["updone"]+this.taskMap[item.id]["samedone"]+this.taskMap[item.id]["downdone"]
              )
            )
          );
        break;
      case "进行中":
        this.showList = this.topList.filter(item=>
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
        this.showList = this.topList.filter(item=>
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
    querySLog.select("answer","grade","targetProfile","fromProfile")
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

      console.log(this.itemRightMap)
      console.log(this.scoreMap)

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
      this.loadAllTask(); // 接着加载任务结果
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
      console.log("sum")
      console.log(results)
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
  loadAllTask(){
    let pList = []
    this.topList.forEach(profile=>{
      if(profile.get("level")){
        pList.push(this.loadWorkScoreTasks(profile))
      }
    })
    Promise.all(pList).then(()=>{
      console.log(this.taskMap)
      this.isLoaded = true
    })
  }
  loadWorkScoreTasks(profile:Parse.Object){
    return new Promise((res,rej)=>{
    let workTasks = [] // 该用户需要评价的人员清单
    let surveyLogs = [] // 已打分的问卷清单
    let currentLev = profile.get("level")
    let finnalQuery:any

    // 查询类型：分管领导、平级、下级
    let query = new Parse.Query("Profile")
    // 排除自己
    query.notEqualTo("objectId",profile.id)
    // 排除不参与和不被考核的
    query.notContainedIn("state", ["领导班子，不被考核", "后勤不参与考核","退聘，不参与考核","退聘，不参与考核","借用，不参与考核"]);


    // a1a2抽取规则
    // ①b1，全部
    // ②a3.a4，全部
    // ③a5，按分管

    if(currentLev.indexOf("a1")>=0 || currentLev.indexOf("a2")>=0){
      // 抽取分管的a5，按照分管条线
      let queryA5 = new Parse.Query("Profile");
      queryA5.notEqualTo("objectId",profile.id)
      queryA5.startsWith("level","a5");
      queryA5.containedIn("roleName",profile.get("branch"))

      // 抽取分管的b2b3b4，按分管条线
      let queryB2 = new Parse.Query("Profile");
      queryB2.notEqualTo("objectId",profile.id)
      queryB2.startsWith("level","b2");
      queryB2.containedIn("roleName",profile.get("branch"))

      // 抽取A所有经理，不限制部门
      let rex = new RegExp("a3|a4")
      if(profile.get("name")=="何辉军"||profile.get("name")=="胡剑峰"||profile.get("name")=="佘清雅"){
        // 其中a2级别的需要何辉军给b1打分
        rex = new RegExp("b1|a3|a4")
      }
      query.matches("level", rex, null);

      finnalQuery = Parse.Query.or(query,queryA5,queryB2)
    }

    // a3a4抽取规则
    if(currentLev.indexOf("a3")>=0 || currentLev.indexOf("a4")>=0){

      // 抽取部门内的a5a6a7
      let queryA567 = new Parse.Query("Profile");
      queryA567.notEqualTo("objectId",profile.id)

      queryA567.equalTo("department",profile.get("department"))
      let rexA567 = new RegExp("a5|a6|a7")
      queryA567.matches("level", rexA567, null);

      // 抽取分管的b2b3b4，按分管条线
      let queryB2 = new Parse.Query("Profile");
      queryB2.notEqualTo("objectId",profile.id)
      queryB2.startsWith("level","b2");
      let branch = profile.get("branch") || ['空的占位条线']
      queryB2.containedIn("roleName",branch)

      // 抽取所有A经理，不限制部门
      let rex = new RegExp("a3|a4")
      if(profile.get("name")=="刘杰"){
        // 其中a3,a4级别的需要刘杰给b1打分
        rex = new RegExp("b1|a3|a4")
      }
      query.matches("level", rex, null);

      finnalQuery = Parse.Query.or(query,queryA567,queryB2)

      if(profile.get("name")=="蓝昊"){
        let queryHR = new Parse.Query("Profile");
        queryHR.equalTo("roleName","人事")
        finnalQuery = Parse.Query.or(query,queryA567,queryB2,queryHR)
      }
    }

    // a5a6a7抽取规则
    if(currentLev.indexOf("a5")>=0 || currentLev.indexOf("a6")>=0 || currentLev.indexOf("a7")>=0){
      // 抽取所有A经理/副经理，本部门
      query.equalTo("department",profile.get("department"))
      let rex = new RegExp("a3|a4|a5|temp")
      query.matches("level", rex, null);

      // 抽取所有A主管/员工，本部门及业务相关部门
      let queryA67 = new Parse.Query("Profile");
      queryA67.notEqualTo("objectId",profile.id)

      let related = profile.get("department").get("related");
      if(related){
        related.push(profile.get("department"))
      }else{
        related = [profile.get("department")]
      }
      queryA67.containedIn("department",related)
      let rexA67 = new RegExp("a6|a7|temp")
      queryA67.matches("level", rexA67, null);

      // 分公司内a5中任意两人考核（平级）；
      let queryA5 = new Parse.Query("Profile");
      queryA5.notEqualTo("objectId",profile.id);
      let rexA5 = new RegExp("a5|temp");
      queryA5.matches("level", rex, null);

      // 基础规则
      finnalQuery = Parse.Query.or(query,queryA67)

      // 优先规则：A5抽取分公司所有A5
      if(currentLev.indexOf("a5")>=0){ 
        finnalQuery = Parse.Query.or(query,queryA5,queryA67)
      }  
      // 优先规则：人事部门将党群a3作为上级打分
      if(profile.get("name")=="张一帆"||profile.get("name")=="刘思晗"){
        let queryHR = new Parse.Query("Profile");
        queryHR.equalTo("name","蓝昊")
        finnalQuery = Parse.Query.or(query,queryA67,queryHR)
      }

    }


    // b1抽取规则
    if(currentLev.indexOf("b1")>=0){
      // 根据项目考评组，抽取下级员工
      query.equalTo("groupLeaderName",profile.get("groupLeaderName"))
      let rex = new RegExp("b2|b3|b4|b5|b6")
      query.matches("level", rex, null);

      // 抽取平级的b1
      let queryB1 = new Parse.Query("Profile");
      queryB1.notEqualTo("objectId",profile.id)
      queryB1.startsWith("level","b1");

      finnalQuery = Parse.Query.or(query,queryB1)
    }

    // b234抽取规则
    if(currentLev.indexOf("b2")>=0||currentLev.indexOf("b3")>=0||currentLev.indexOf("b4")>=0){
      // 根据项目考评组，抽取下级员工
      query.equalTo("groupLeaderName",profile.get("groupLeaderName"))
      let rex = new RegExp("b1|b2|b3|b4|b5|b6")
      query.matches("level", rex, null);

      finnalQuery = Parse.Query.or(query)
    }


    // b56抽取规则
    if(currentLev.indexOf("b5")>=0||currentLev.indexOf("b6")>=0){
      // 根据项目考评组，抽取下级员工
      query.equalTo("groupLeaderName",profile.get("groupLeaderName"))
      let rex = new RegExp("b1|b2|b3|b4|b5|b6")
      query.matches("level", rex, null);

      finnalQuery = Parse.Query.or(query)
    }

    // 评选结果查询
    // let queryLog = new Parse.Query("SurveyLog")
    // queryLog.equalTo("fromProfile",profile.toPointer())
    // queryLog.equalTo("survey","kYEkeP6iC7")

    Promise.all([finnalQuery.find()]).then(result=>{
      workTasks = result[0]
      if(profile.id == "3EYo0N8SFj"){
        console.log(workTasks)
      }
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
      res()
      this.cdRef.detectChanges();
    }).catch(err=>{
      console.log(err);
      rej(err)
    })
  })
}

checkLevForTaskMap(p1,p2){
  let level = "up";
  let fromLev = p1.get("level").slice(0,2);
  let targetLev = p2.get("level").slice(0,2);

  if(fromLev < targetLev){ level = "down" }
  if(fromLev == targetLev){ level = "same" }
  if(fromLev > targetLev){ level = "up" }
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

  this.showList.forEach(p=>{
    jsonData.push({
      name:p.get("name"),
      depart:p.get("department")&&p.get("department").get("name"),
      leader:p.get("groupLeaderName"),
      done:this.taskMap[p.id]&&(this.taskMap[p.id]["updone"]+this.taskMap[p.id]["samedone"]+this.taskMap[p.id]["downdone"]),
      all:this.taskMap[p.id]&&(this.taskMap[p.id]["up"]+this.taskMap[p.id]["same"]+this.taskMap[p.id]["down"]),
      base:this.scoreMap[p.id]&&this.scoreMap[p.id].scoreBase,
      survey:this.scoreMap[p.id]&&this.scoreMap[p.id].scoreSurvey,
      from:this.scoreMap[p.id]&&`上级${this.scoreMap[p.id]['up'].count}人/平级${this.scoreMap[p.id]['same'].count}人/下级${this.scoreMap[p.id]['down'].count}人`,
      score:this.scoreMap[p.id]&&this.scoreMap[p.id].score,
      state:p.get("state"),
    })
  })

  //列标题
  let str = `<tr><td>姓名</td><td>部门</td><td>考评组</td>
  <td>打分（已完成）</td><td>打分（共计）</td>
  <td>基础分</td><td>评价分</td><td>评价人</td><td>总分</td>
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
      console.log(certs)
      console.log(titleString)

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
