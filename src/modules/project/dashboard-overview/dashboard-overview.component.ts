import * as Parse from "parse";

import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

import { EditObjectComponent } from "../../common/edit-object/edit-object.component";

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

  // countMap用法
  // 获得某个对象数组 objectMap[className]
  objectMap = {
    Project:[],
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
    public appServ: AppService
  ) { 
    this.appServ.isCollapsed = true; // 默认折叠左侧菜单
  }

  ngOnInit() {
    for (let i = 0; i < 100; i++) {
      this.listOfData.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London`
      });
    }

    this.countMap = {};
    this.loadCount("Project")
    this.loadCount("Profile")

    this.loadClass("Project");
    this.loadClass("Profile");
    this.loadClass("NoteSpace");
    this.loadClass("ProjectTask");
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
    Project:null,
    NoteSpace:null,
    Profile:null,
  }
  resetTabItem(className): void {
    this.searchMap[className] = null;
    this.loadClass("ProjectTask");
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
    this.loadClass("ProjectTask")
    // this.search(i);
  }

  search(i): void {
    this.listOfColumns[i].customFilter.visible = false;
    let sval = this.listOfColumns[i].customFilter.searchValue;
    this.objectMap["ProjectTask"] = this.objectMap["ProjectTask"].filter((item: ParseObject) => item.get("title").indexOf(sval) !== -1);
  }
  
  listOfColumns: ColumnItem[] = [
    {
      left:true,
      customFilter:{
        visible:false,
        searchValue:null,
        menu:null,
      },
      name: '名称',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [
      ],
      filterFn: (list: string[], item: ParseObject) => list.some(title => item.get("title").indexOf(title) !== -1)
    },
    {
      left:true,
      name: '优先级',
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
      name: '状态',
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
      name: '指派',
      sortFn: null,
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: '时长',
      sortFn: (a: ParseObject, b: ParseObject) => a.get('duration') - b.get('duration'), // 数字排序
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: '开始时间',
      sortFn: (a: ParseObject, b: ParseObject) => a.get('startDate') - b.get('startDate'), // 数字排序
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: '截止时间',
      sortFn: (a: ParseObject, b: ParseObject) => a.get('deadline') - b.get('deadline'), // 数字排序
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      right:true,
      name: '所属项目',
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
