import * as Parse from "parse";
import { ActivatedRoute, Router } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core"

// 看板依赖
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

// 甘特图文档：https://docs.dhtmlx.com/gantt/api__refs__gantt.html

import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import "dhtmlx-gantt";
// import { timingSafeEqual } from 'crypto';

// 对象编辑组件
import { EditObjectComponent } from "../../common/edit-object/edit-object.component";
import { EditNotespaceComponent } from "../../common/edit-notespace/edit-notespace.component";
import { NzModalService } from "ng-zorro-antd/modal";

import { AppService } from "../../../app/app.service";

@Component({
  selector: 'project-gantt',
  templateUrl: './project-gantt.component.html',
  // providers: [TaskService, LinkService],
  styleUrls: ['./project-gantt.component.scss']
})
export class ProjectGanttComponent implements OnInit {
  @ViewChild("gantt_here",{static:true}) ganttContainer: ElementRef;
  @ViewChild(MatAccordion,{static:true}) accordion: MatAccordion;
  @ViewChild(EditObjectComponent,{static:false}) editObject: EditObjectComponent;
  @ViewChild(EditNotespaceComponent,{static:false}) editNotespace: EditNotespaceComponent;

  imagelogo:string
  companyId:string
  projectId:string
  project:any
  kanbanLists = [{name:"待分配"},{name:"开发中"},{name:"测试中"},{name:"已完成"},{name:"已上线"}]
  kanbanLanes = [{name:"默认泳道",desc:"这是一个初始默认的泳道"}]

  kanbanMap:any
  initKanbanMap(){
    // 初始化列表清单
    let kanbanMap = {"待分配":[],"开发中":[],"测试中":[],"已完成":[],"已上线":[]}
    this.kanbanLists.forEach(list=>{
      if(!kanbanMap[list.name]){
        kanbanMap[list.name] = []
      }
    })
    console.log(kanbanMap)
    this.kanbanMap = kanbanMap;

    // 初始化泳道清单



    // 加载看板任务数据
    this.cdRef.detectChanges();
  }
  constructor(private route:ActivatedRoute,
    private cdRef:ChangeDetectorRef,
    private modalService: NzModalService,
    public appServ: AppService
    ) {
      this.appServ.isCollapsed = true;

  }
  tabIndex:Number // 默认tab页面
  // 初始化加载gantt图表区域
  async ngOnInit() {
    // this.companyId = "1AiWpTEDH9"
    this.companyId = localStorage.getItem("company")

    this.route.paramMap.subscribe(async params=>{

    this.projectId = params.get("projectId") || params.get("PobjectId")

    // 加载项目数据
    let qpro = new Parse.Query("Project");
    qpro.get(this.projectId).then( pro=>{
      this.project = pro;
      switch (pro.get("defaultTab")) {
        case "kanban":
          this.tabIndex = 0;
          break;
        case "gantt":
          this.tabIndex = 1;
          break;
        case "wiki":
          this.tabIndex = 2;
          break;
        default:
          break;
      }
    })

    // 加载看板数据
    this.initKanbanMap();

    // 初始化甘特图数据
    this.initGanttData();

    // 加载项目Wiki空间
    this.loadNoteSpace().then(data=>{}).catch(err=>{});
    });

  }

  initGanttData(){
    console.log("initGanttData")
    gantt.config.xml_date = "%Y-%m-%d %H:%i";

    // 定制：自定义本土语言
    this.loadLocaleConfig()
    this.loadOrderDragDrop()

    gantt.init(this.ganttContainer.nativeElement);
    
    this.loadTemplateStyle()
    this.loadDataProcessor()
    this.loadGanttData()
  }

  goEditTask(object,list?){
    if(object&&object.id){ // 编辑已存在对象
      this.editObject.setEditObject(object)
    } else { // 创建新的任务对象
      let ProjectTask =  Parse.Object.extend("ProjectTask")
      let task = new ProjectTask();
      task.set("project",{"__type":"Pointer","className":"Project","objectId":this.projectId})
      if(list){
        task.set("stateList",list.name)
      }
      
      this.editObject.setEditObject(task)
      this.editObject.onSavedCallBack((data)=>{
        this.kanbanMap[data.get("stateList")].push(data);
      });

    }
  }
  onTabChange(event){
    console.log(event);
    let index = event || (event&&event.index)
    if(index == 1){
      this.initGanttData();
      // this.loadGanttData();
    }
  }

  // 删除deleteModal相关变量
  isVisibleDeleteModal = false;
  showDeleteModal(list,object) {
    this.modalService.confirm({
      nzTitle: `删除`,
      nzContent: `<b style="color: red;">你确定要删除该对象及其相关信息吗？</b>`,
      nzOkText: "删除",
      nzOkType: "danger",
      nzOnOk: () => this.deleteObject(list,object),
      nzCancelText: "取消",
      nzOnCancel: () => console.log("Cancel")
    });
  }
  deleteObject(list,obj) {
    obj.destroy().then(() => {
      this.kanbanMap[list.name].forEach((el, i, arr) => {
        if (el.id == obj.id) {
          arr.splice(i, 1);
        }
      });
    });
  }
  // Feat 1: Kanban 看板函数
  

  async drop(event: CdkDragDrop<string[]>,list,lane) {
  

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(this.kanbanMap);
      console.log(this.kanbanLists);
      console.log(event);
      if(!event.container.data) {
        this.kanbanMap[list.name]=[];
        event.container.data = this.kanbanMap[list.name]
      };
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    console.log(event)
    console.log(list)
    let task:any = event.container.data[event.currentIndex]
    console.log(event.container.data[event.currentIndex])
    if(list){
      task.set("stateList",list.name);
    }
    if(lane){
      task.set("stateLane",lane.name);
    }
    task.save();

  }

  // Feat 2: Wiki 文档空间函数
  noteSpace:any
  async createNoteSpace(){
    // 检查是否存在，避免重复创建
    let exists = await this.loadNoteSpace();
    if(!exists){
    // 创建项目Wiki空间
    let NoteSpace = Parse.Object.extend("NoteSpace");
    let space = new NoteSpace();
    space.set("title",this.project.get("title")+"的Wiki空间")
    space.set("type","project")
    space.set("company", {"__type":"Pointer","className":"Company","objectId":this.companyId})
    space.set("project", {"__type":"Pointer","className":"Project","objectId":this.projectId})
    console.log(space)
    space.save().then(data=>{
      console.log(data)
      this.noteSpace = data
      this.editNotespace.setNoteSpace(this.noteSpace);
    })
  }
  }
  loadNoteSpace(){
    let that = this;
    console.log("loadNoteSpace")
    return new Promise((res,rej)=>{
      let query = new Parse.Query("NoteSpace");
      query.equalTo("company", {"__type":"Pointer","className":"Company","objectId":this.companyId});
      query.equalTo("project", {"__type":"Pointer","className":"Project","objectId":this.projectId});
      query.first().then((space)=>{
        console.log(space)
        if(space&&space.id){
          this.noteSpace = space;
          this.cdRef.detectChanges();
          that.editNotespace.setNoteSpace(this.noteSpace);
          res(space);
        }else{
          res(null)
        }
      }).catch((err)=>{
        console.error(err)
        res(null);
      })
  })

  }

  // Feat 3: Gantt 甘特图函数

  loadTemplateStyle(){
    // 定制甘特图界面样式
    // https://docs.dhtmlx.com/gantt/desktop__timeline_templates.html
    // 样式参考示例：
    // 完成情况：https://docs.dhtmlx.com/gantt/samples/04_customization/02_custom_tree.html
    // 任务类型：https://docs.dhtmlx.com/gantt/samples/04_customization/12_custom_task_type.html
    // 优先级样式：https://docs.dhtmlx.com/gantt/samples/04_customization/04_task_styles.html

    // 定制：左侧列表
    // 基础 https://docs.dhtmlx.com/gantt/api__gantt_columns_config.html
    // 定制 https://docs.dhtmlx.com/gantt/desktop__specifying_columns.html
    // 排序 https://docs.dhtmlx.com/gantt/desktop__sorting.html

    gantt.config.columns=[
      { "name": "text", "label":"任务名", "tree": true, "width": 156, "resize": true},
      // { "name": "start_date", "label":"开始时间", "align": "center", "resize": true, "width": 90, template:function(obj){
      //     let date = obj.start_date
      //     if(date&&date!=""){
      //       // t.get("startDate").Format("yyyy-MM-dd")
      //     }else{
      //       date = new Date();
      //     }
      //     return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      // }},
      { "name": "duration", "label":"预计天数", "align": "center", "width": 35},      
      { "name": "priority", "label":"优先级", "align": "center", "width": 35, template:function(obj){
        switch (obj.priority){
            case "normal":
                return "普通";
                break;
            case "high":
                return "高";
                break;
            default:
                return "低";
                break;
      }
      }},      
      // { "name": "owner", "label":"执行人", "align": "center", "width": 70},      
      { "name": "add", "width": 44, "min_width": 44, "max_width": 44}
    ];

    // 定制：右侧优先级样式
    gantt.templates.task_class  = function(start, end, task){
      let taskClass = ""

      switch (task.priority){
          case "low":
              taskClass += " gantt-priority-low";
              break;
          case "normal":
              taskClass += " gantt-priority-normal";
              break;
          case "high":
              taskClass += " gantt-priority-high";
              break;
      }
      switch (task.cate){
        case "requirement":
            taskClass += " gantt-cate-requirement";
            break;
        case "frontend":
            taskClass += " gantt-cate-frontend";
            break;
        case "backend":
            taskClass += " gantt-cate-backend";
            break;
        case "design":
            taskClass += " gantt-cate-design";
            break;
        case "testing":
            taskClass += " gantt-cate-testing";
            break;
    }
      if(task.parent==0||!task.parent){
        taskClass += " gantt-task-parent"
      }
      return taskClass
    };

      
    // 定制：弹出任务编辑框 https://docs.dhtmlx.com/gantt/desktop__edit_form.html

    let priorityOpts  = [
      { key: "low", label: '低' },
      { key: "normal", label: '普通' },
      { key: "high", label: '紧急' }
    ];
    let cateOpts = [
      { key: "requirement", label: '需求' },
      { key: "frontend", label: '前端' },
      { key: "backend", label: '数据' },
      { key: "design", label: '设计' },
      { key: "testing", label: '测试' }
    ]
    gantt.config.lightbox.sections=[
      {name:"description", height:70, map_to:"text", type:"textarea", focus:true},
      {name:"time",        height:32, map_to:"auto", type:"duration"},
      {name:"cate",    height:32, map_to:"cate", type:"select", options:cateOpts},
      {name:"priority",    height:32, map_to:"priority", type:"select", options:priorityOpts}
    ];

      gantt.config.min_column_width = 15;

      // 设置周末列样式
      gantt.templates.scale_cell_class = function(date){
        if(date.getDay()==0){
            return "gantt-column-weekend";
        }
      };
      (<any>gantt.templates).task_cell_class = function(task,date){
        if(date.getDay()==0){
            return "gantt-column-weekend";
        }
      };

    // 加载日排列样式
    this.changeScale("day")

  }

  changeScale(unit){
    if(unit=="day"){
      gantt.config.min_column_width = 10;
      gantt.config.scale_unit = "month";
      gantt.config.date_scale = "%Y年%m月";
      gantt.config.subscales = [
          {unit:"week", step:1, date:"%W周" },
          {unit:"day", step:1, date:"%d日" }
      ];
    }
    if(unit=="month"){

      gantt.config.scale_unit = "month";
      gantt.config.date_scale = "%Y年%m月";
      gantt.config.subscales = [
    ];
    }
    gantt.render();
  }
  isAllExpanded:Boolean = true
  expandAll(){
    this.isAllExpanded = !this.isAllExpanded
    if(this.isAllExpanded){
      gantt.eachTask(function(task){
        task.$open = false;
      });
      gantt.render();
    }else{
      gantt.eachTask(function(task){
        task.$open = true;
      });
      gantt.render();
    }

  }
  loadOrderDragDrop(){ 
    // 加载拖拽变更排序及父子分支 https://docs.dhtmlx.com/gantt/desktop__reordering_tasks.html
    // reordering tasks within the whole gantt
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = true;

    // 限制不能拖动的任务规则 https://docs.dhtmlx.com/gantt/desktop__dnd.html
  }
  loadDataProcessor(){
    const dp = gantt.createDataProcessor({
      task: {
          update: (data: GanttTask) => this.saveTask(data,false),
          create: (data: GanttTask) => this.saveTask(data,true),
          delete: (id) => this.removeTask(id)
      },
      link: {
          update: (data: GanttLink) => this.saveLink(data),
          create: (data: GanttLink) => this.saveLink(data),
          delete: (id) => this.removeLink(id)
      }
  });
  }

  // 获取并格式化图表展示数据
  displayTasks:GanttTask[] = []
  displayLinks:GanttLink[] = []
  listOfAllTask:ParseObject[] = []

  loadGanttData(){
    this.getProjectTask().then(data=>{
      // 渲染看板节点
      this.kanbanMap = {}
      data.forEach(t=>{
        let firstList =  this.kanbanLists[0].name;
        let firstLane =  this.kanbanLanes[0].name;
        let listExists = this.kanbanLists.find(l=>l.name==t.get("stateList"));
        let key = t.get("stateList") && listExists?t.get("stateList"):firstList;
        if(!this.kanbanMap[key]){
          this.kanbanMap[key] = []
        }
        this.kanbanMap[key].push(t);
      })
      // 渲染甘特图节点
      this.displayTasks = []
      this.displayLinks = []
      this.listOfAllTask = data
      data.forEach(t=>{
        if(t.get("startDate")){
          this.displayTasks.push({
            id:String(t.id),
            text:String(t.get("title")),
            start_date:t.get("startDate"),
            duration:Number(t.get("duration")?t.get("duration"):0),
            parent:t.get("parent")?t.get("parent").id:null,
            target:t.get("target"),
            progress:t.get("progress")?t.get("progress"):0,
            priority:t.get("priority")?t.get("priority"):"normal",
            cate:t.get("cate")?t.get("cate"):null,
            owner:t.get("owner")?t.get("owner"):"待分配"
          })
        }
      })
      
      gantt.clearAll()
      gantt.parse({data:this.displayTasks, links:this.displayLinks});

    })
  }

  getProjectTask(){
    let query = new Parse.Query("ProjectTask")
    if(this.companyId){
      query.equalTo("company", {"__type":"Pointer","className":"Company","objectId":this.companyId})
    }
    if(this.projectId){
      query.equalTo("project", {"__type":"Pointer","className":"Project","objectId":this.projectId})
    }
    return query.find()
  }

  // 图表内数据增删查改操作函数
  saveTask(data,isNew){
    console.log(data)
    let task = new Parse.Object("ProjectTask")
    if(!isNew) task.id = data.id
    task.set({
      title:data.text,
      startDate:new Date(data.start_date),
      duration:data.duration,
      progress:data.progress,
      priority:data.priority,
      cate:data.cate,
      target:data.target // 排序是通过ID进行识别的，因此新增String字段记录target值
    })
    if(this.companyId){
      task.set("company",{"__type":"Pointer","className":"Company","objectId":this.companyId})
    }
    if(this.projectId){
      task.set("project",{"__type":"Pointer","className":"Project","objectId":this.projectId})
    }
    if(data.parent!=0 && data.parent != null){
      task.set("parent",{"__type":"Pointer","className":"ProjectTask","objectId":data.parent})
    }else{
      task.set("parent",null)
    }
    task.save().then((t)=>{
      if(isNew){ // 修复任务对象ID为数据库objectId
        gantt.changeTaskId(data.id, t.id);
      }
    })
  }
  removeTask(id){
    let task = new Parse.Object("ProjectTask")
    task.id = id
    task.destroy()
  }
  saveLink(data){}
  removeLink(id){}

  // 导出功能操作函数
  exportExcel(){
    gantt.exportToExcel({
      name:"项目分解-甘特图.xlsx", 
      columns:[
          { id:"text",  header:"Title", width:150 },
          { id:"start_date",  header:"Start date", width:250, type:"date" }
      ],
      // server:"https://myapp.com/myexport/gantt",
      visual:true,
      cellColors:true
  });
  }
  loadLocaleConfig(){
    let locale:any = {
        date: {
            month_full: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            day_full: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            day_short: ["日", "一", "二", "三", "四", "五", "六"]
        },
        labels: {
            new_task: "新任务",
            dhx_cal_today_button: "今天",
            day_tab: "日",
            week_tab: "周",
            month_tab: "月",
            new_event: "新建日程",
            icon_save: "保存",
            icon_cancel: "关闭",
            icon_details: "详细",
            icon_edit: "编辑",
            icon_delete: "删除",
            confirm_closing: "请确认是否撤销修改!", //Your changes will be lost, are your sure?
            confirm_deleting: "是否永久删除?",

            section_description: "任务描述",
            section_time: "时间范围",
            section_type: "类型",
            section_priority: "优先级",
            section_cate: "工作分类",
    
            /* grid columns */
    
            column_wbs: "工作分解结构",
            column_text: "任务名",
            column_start_date: "开始时间",
            column_duration: "持续时间",
            column_add: "",
    
            /* link confirmation */
    
            link: "关联",
            confirm_link_deleting: "将被删除",
            link_start: " (开始)",
            link_end: " (结束)",
    
            type_task: "任务",
            type_project: "项目",
            type_milestone: "里程碑",
    
            minutes: "分钟",
            hours: "小时",
            days: "天",
            weeks: "周",
            months: "月",
            years: "年",
    
            /* message popup */
            message_ok: "OK",
            message_cancel: "关闭",
    
            /* constraints */
            section_constraint: "Constraint",
            constraint_type: "Constraint type",
            constraint_date: "Constraint date",
            asap: "As Soon As Possible",
            alap: "As Late As Possible",
            snet: "Start No Earlier Than",
            snlt: "Start No Later Than",
            fnet: "Finish No Earlier Than",
            fnlt: "Finish No Later Than",
            mso: "Must Start On",
            mfo: "Must Finish On",
    
            /* resource control */
            resources_filter_placeholder: "type to filter",
            resources_filter_label: "hide empty"
        }
    };
    gantt.locale = locale
}

}

export class GanttTask {
  id: string;
  start_date: string;
  text?: string;
  progress: number;
  duration: number;
  parent?: number;
  priority?: number;
  owner?: string[];
  [key:string]:any;
}
export class GanttLink {
  id: number;
  source: number;
  target: number;
  type: string;
}
