import * as Parse from "parse";

import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
  
  // countMap用法
  // 获得某个对象总数 countMap[className]
  // 获得某个对象某个字段总和 countMap[className:fieldName]
  // 按某字段分组后，获得某个对象某个字段总和 countMap[className:fieldName:groupId]
  countMap = {}

  // countMap用法
  // 获得某个对象数组 objectMap[className]
  objectMap = {}
  selectedDateRange:any
  selectedDateRangeModel:any
  onDateRangePickerChange(ev) {
    this.selectedDateRange = {};
    this.selectedDateRange.from = ev[0];
    this.selectedDateRange.to = ev[1];
    this.ngOnInit();
  }

  constructor() { 

  }

  ngOnInit() {
    this.countMap = {};
    this.loadCount("VolunteerProfile")
    this.loadCount("Activity") // 加载
    this.loadUserCount();

     // 根据activity分组，加载所有ActivityRegister服务记录的serviceTime总和
    this.loadActivityPie()
  }

  // 查询时长信息
  searchType:string = "realname";
  searchText:string;
  searchUser:any;
  searchInfo:any;
  timeLines = [];
  async searchRegisterLog(){
    this.searchUser = undefined
    this.searchInfo = {}
    if(!this.searchType || !this.searchText){
      return
    }
    let qUser = new Parse.Query("_User");
    qUser.equalTo(this.searchType,this.searchText);
    let user = await qUser.first();
    this.searchUser = user;
    console.log(user);

      return new Promise((res,rej)=>{
        let current = user
        if (!current) return
        let createTime = user.createdAt;
        // Load TimeLine
        let timeLines = []
        let serviceCount = 0;
        let serviceTime = 0;
        let deleteCount = 0;
        timeLines.push({
          time: createTime, // Date
          color: "orange", // String
          ampm: `${createTime.getMonth() + 1}月${createTime.getDate()}日`, // String
          title: "注册成为志愿者", // String
          message: `${current.get("nickname")}于${createTime.getFullYear()}年${createTime.getMonth() + 1}月${createTime.getDate()}日注册成为《幸福V银行》志愿者。`, // String
          badge: [] // Array<string>
        })

        let query1 = new Parse.Query("ActivityRegister")
        query1.equalTo("user",current)
        query1.include("activity")
        query1.limit(1000);
        let p1 = new Promise((res, rej) => { query1.find().then(data => { res(data) }).catch(err => { rej(err) }) })
        let query2 = new Parse.Query("SurveyLog")
        query2.equalTo("user", current)

        query2.include("survey")
        let p2 = new Promise((res, rej) => { query2.find().then(data => { res(data) }).catch(err => { rej(err) }) })

        return Promise.all([p1, p2]).then(result => {
          let regs:any = result[0]
          let logs:any = result[1]

          regs.forEach(reg => {
            let line = {};
            let isDeleted = reg.get("isDeleted")

            line["user"] = current;
            line["activity"] = reg.get('activity');
            line["time"] = reg.get("startDate");
            line["color"] = isDeleted ? "red" : "pink";
            line["ampm"] = `${reg.get("startDate").getFullYear()}年${reg.get("startDate").getMonth() + 1}月${reg.get("startDate").getDate()}日`;
            line["title"] = `${isDeleted ? "取消" : "参加"}“${reg.get("activity").get("title")}”志愿项目`;
            line["avatar"] = reg.get("activity").get("logo") || "https://common.file.futurestack.cn/images/wxapp/vbank/badge-default.png";
            line["serviceTime"] = reg.get("serviceTime");
            let isComplete = reg.get("isComplete");
            isComplete = isComplete ? isComplete:false
            if (isDeleted) {
              deleteCount += 1
            } else {
              if (isComplete) {
                serviceCount += 1
                serviceTime += reg.get("serviceTime")
              }
              console.log(isComplete)
              line["message"] = `${isComplete ? '获得' : "预计可获"}“幸福V银行”专用V点${reg.get("serviceTime")}个`;

            }
            line["badge"] = new Array(Math.ceil(reg.get("serviceTime"))).fill("https://common.file.futurestack.cn/images/wxapp/vbank/badge-default.png");
            console.log(line)
            timeLines.push(line);
          })

          logs.forEach(log => {
            let line = {};
            let isPass = log.get("grade") >= log.get("survey").get("gradePass");
            line["time"] = log.get("createdAt");
            line["color"] = isPass ? "green" : "orange";
            line["ampm"] = `${log.get("createdAt").getMonth() + 1} 月${log.get("createdAt").getDate()}日`;
            line["title"] = `参加“${log.get("survey").get("title")}”培训考试`;
            line["message"] = `总得分：${log.get("grade")}，${isPass ? '通过' : "未通过"}考试`;
            timeLines.push(line)
          })
          timeLines.sort((a, b) => { return a.time.getTime() > b.time.getTime() ? -1 : 1; });

          this.timeLines = timeLines;
          this.searchInfo = {
            deleteCount: deleteCount,
            serviceCount: serviceCount,
            serviceTime: serviceTime
          }
          res()
        }).catch(err=>{
          rej(err)
        })
      })
  }

  loadActivityPie(){
    this.loadColumnSum("ActivityRegister",'serviceTime',"activity").then(()=>{
      this.loadObjectData("Activity").then(()=>{
        this.showActivityPie()
      })
    })
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
  
  @ViewChild('activityPie',{static:true}) activityPie: ElementRef;
  loadObjectData(className){
    let query = new Parse.Query(className)
      query.equalTo("company",{
        __type:"Pointer",
        className:"Company",
        objectId:localStorage.getItem("company")
      });
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
    let data = this.objectMap["Activity"].filter(act=>this.countMap["ActivityRegister:serviceTime:"+act.id]).map(item=>{
          return {
          name:item.get("title"),
          value:this.countMap["ActivityRegister:serviceTime:"+item.id] || 0,
          color: item.get("color")||"cyan"
        }
  })
  data.sort((a,b)=>a>b?1:-1)

    let legend = data.map(item=>item.name)
    let option = {
          // title : {
            // text: '志愿活动总体情况概览',
            // subtext: '2017-至今',
            // x:'center'
          // },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                // bottom: '0%',
                top: '0%',
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
}
