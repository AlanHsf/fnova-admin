import * as Parse from "parse";

import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

import { EditObjectComponent } from "../../common/edit-object/edit-object.component";

import { HttpClient } from "@angular/common/http";
import { AppService } from "../../../app/app.service";

interface ColumnItem {
  name: string;
  left?: boolean;
  right?: boolean;
  customFilter?: any;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn | null;
}

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
  @ViewChild(EditObjectComponent,{static:false}) editObject: EditObjectComponent;
  
  listOfData = [];
  // countMap用法
  // 获得某个对象总数 countMap[className]
  // 获得某个对象某个字段总和 countMap[className:fieldName]
  // 按某字段分组后，获得某个对象某个字段总和 countMap[className:fieldName:groupId]
  countMap = {}
  mainnetMap = {
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

  // countMap用法
  // 获得某个对象数组 objectMap[className]
  objectMap = {
    Miner:[],
    ProjectTask:[],
    Profile:[],
    NoteSpace:[],
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
    public appServ: AppService,
    private http: HttpClient

  ) { 
    this.appServ.isCollapsed = true; // 默认折叠左侧菜单
  }

  async ngOnInit() {
    for (let i = 0; i < 100; i++) {
      this.listOfData.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London`
      });
    }

    this.loadMainnet();
    this.loadPoolInfo();
    this.countMap = {};
    // this.loadCount("Miner")
    this.loadCount("MinerOrder")
    this.loadMiner();
    
    this.loadMinerHarvestLog();
  }
  async loadMiner(){
    let query = new Parse.Query("Miner")
    query.equalTo("company",localStorage.getItem("company"))
    this.objectMap["Miner"] = await query.find();
  }
  
  async loadMinerHarvestLog(){
    let query = new Parse.Query("MinerHarvestLog")
    query.equalTo("company",localStorage.getItem("company"))
    query.descending("createdAt")
    query.include("order")
    query.include("miner")
    query.include("harvest")
    query.limit(50);
    let logs = await query.find();
    let now = new Date();
 
    logs.forEach(log=>{
      // log.set("daydone") = 
      console.log(log.get("date"));
      let date = log.get("date");
      date.setHours(24);
      date.setMinutes(0);
      date.setSeconds(0);
      let datediff = parseInt(String((now.getTime() - date.getTime())/1000/60/60/24));
      log.set("daydone",datediff);
      log.set("progress",parseInt(String((datediff/log.get("dailyDay"))*10000))/100 );
     })
     console.log(logs.length)
    this.objectMap["MinerHarvestLog"] = logs;
  }
  loadMainnet(){
    this.http.get("https://server.fmode.cn/api/lotus/mainnet").subscribe(result=>{
      let json:any = result
      if(json&&json.data){
        console.log(json.data)
        this.mainnetMap = json.data
      }
    })
  }
  loadPoolInfo(){
    let sql = `SELECT "Miner"."objectId",MAX("power") as power,MAX("minerId") as minerid from "Miner" LEFT JOIN "MinerHarvest" ON "Miner"."objectId"="MinerHarvest"."miner"
      GROUP BY "Miner"."objectId"
    ;`
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    this.http.post(baseurl, {sql: sql}).subscribe(res => {
        console.log(res)
        if(res["code"] == 200 && res["data"] ) {
          // this.listOfData = res["data"]
          let totalPower = 0
          res["data"].forEach(miner=>{
            if(!this.poolMap[miner.objectId]){this.poolMap[miner.objectId]={}}
            totalPower += miner.power
            this.poolMap[miner.objectId] = miner
          })
          this.poolMap.totalPower = totalPower
        }
        console.log(this.poolMap)
      })
  }
  
 
  current
  goEditObject(object){
    // object { id: xxx } / object ASDAKLSA
    if(object&&object.id){ // 编辑已存在对象
      this.editObject.setEditObject(object)
      this.editObject.onSavedCallBack((data)=>{
        if(data.get("isClosed")&&data.get("isClosed")==true){
          // 若对象被设置归档，则重新加载数据
          this.loadClass(data.className);
          if(data.className == "Project"){
            this.loadClass("ProjectTask");
          }
        }
        object = data;
      });
    }
  }
  goNewObject(className){
     // 创建新的任务对象
      let ObjectSchema =  Parse.Object.extend(className)
      let object = new ObjectSchema();
      // task.set("project",{"__type":"Pointer","className":"Project","objectId":object})
      this.editObject.setEditObject(object)
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
      this.objectMap[className] = data
      console.log(data)
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

  searchTabItem(className,sEvent): void {
    // let sval = this.searchMap[className];
    let sval = sEvent;
    this.loadClass(className,sval)
    // this.objectMap[className] = this.objectMap[className].filter((item: ParseObject) => item.get("title").indexOf(sval) !== -1);
  }


  /*****************************************************************************************/
  /**** 列表排序详情 */

  reset(i): void {
    this.listOfColumns[i].customFilter.searchValue = null;
    // this.loadClass("ProjectTask")
    // this.search(i);
  }

  search(i): void {
    this.listOfColumns[i].customFilter.visible = false;
    let sval = this.listOfColumns[i].customFilter.searchValue;
    this.objectMap["Miner"] = this.objectMap["Miner"].filter((item: ParseObject) => item.get("title").indexOf(sval) !== -1);
  }
  
  listOfColumns: ColumnItem[] = [
    {
      left:true,
      customFilter:{
        visible:false,
        searchValue:null,
        menu:null,
      },
      name: '矿机/订单',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [
      ],
      filterFn: (list: string[], item: ParseObject) => list.some(title => item.get("title").indexOf(title) !== -1)
    },
    {
      left:true,
      name: '状态',
      sortOrder: null,
      sortFn: (a: ParseObject, b: ParseObject) => {
        let ap = a.get('priority') || "lowest"
        let bp = b.get('priority') || "lowest"
        let priorityMap = {
          severity: 2,
          high: 1,
          normal: 0,
          lower: -1,
          lowest: -2
        }
        return priorityMap[bp] - priorityMap[ap]
      }, // 数字排序
      listOfFilter: [
        { text: '最高', value: 'severity' },
        { text: '较高', value: 'high' },
        { text: '普通', value: 'normal' },
        { text: '较低', value: 'lower' }
      ],
      filterFn: (list: any[], item: ParseObject) => list.some(priority => item.get("priority")&&item.get("priority").indexOf(priority) !== -1)
    },
    {
      left:true,
      name: '爆块/算力',
      sortFn: (a: ParseObject, b: ParseObject) => a.get("stateList")&&a.get("stateList").localeCompare(b.get("stateList")),
      sortOrder: null,
      listOfFilter: [
        { text: '待分配', value: '待分配' },
        { text: '开发中', value: '开发中' },
        { text: '测试中', value: '测试中' },
        { text: '已完成', value: '已完成' },
        { text: '已上线', value: '已上线' }
      ],
      filterFn: (list: any[], item: ParseObject) => list.some(stateList => item.get("stateList")&&item.get("stateList").indexOf(stateList) !== -1)
    },
    {
      name: '生效日期',
      sortFn: null,
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: '总收益',
      sortFn: (a: ParseObject, b: ParseObject) => a.get('duration') - b.get('duration'), // 数字排序
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: '直接收益',
      sortFn: (a: ParseObject, b: ParseObject) => a.get('startDate') - b.get('startDate'), // 数字排序
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: '线性收益',
      sortFn: (a: ParseObject, b: ParseObject) => a.get('deadline') - b.get('deadline'), // 数字排序
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      right:true,
      name: '服务费',
      sortFn: null,
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      right:true,
      name: '操作',
      sortFn: null,
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    }
  ];

}
