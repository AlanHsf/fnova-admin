import * as Parse from "parse";
import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import "dhtmlx-scheduler";
import "dhtmlx-scheduler/codebase/locale/locale_cn";

import { AppService } from '../../../app/app.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild("scheduler_here",{static:true}) schedulerContainer: ElementRef;
  activities:Array<any>
  registers:Array<any>
  activity:any; // 当前事件相关活动
  period:any; // 当前事件时间段
  start_date:any; // 当前事件开始时间
  end_date:any; // 当前事件开始时间
  weekends= ["周日","周一","周二","周三","周四","周五","周六","周日"];
  ampm= {
    6:"上午",7:"上午",
    8: "上午", 9: "上午", 10: "上午", 11: "上午", 12: "上午",
    13: "下午", 14: "下午", 15: "下午", 16: "下午", 17: "下午", 
    18: "晚上",19: "晚上",20: "晚上",21: "晚上",22: "晚上",23: "晚上"
  };
  eventsData = [
      // {id: 2, start_date: "2017-09-03 00:00", end_date: "2017-09-03 13:00", text: "Event 2"},
  ];
  today = new Date()
  periodDetailModal = false;
  currentRole:string = "";
  company:any;
  constructor(
    public appServ: AppService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) { 
    this.currentRole = this.appServ.currentRole;
    this.company = {
      __type:"Pointer",
      className:"Company",
      objectId:localStorage.getItem("company")
    }
  }

  async ngOnInit() {
    scheduler.clearAll();

    let queryCate = new Parse.Query("Category");
    queryCate.select("name")
    queryCate.equalTo("company",localStorage.getItem("company"));
    queryCate.equalTo("type","activity");
    this.categories = await queryCate.find();

    this.loadAllData() 
  }

  categories = [];
  categoryCheckMap = {};
  updateCateChecked(citem): void {
    this.categoryCheckMap[citem.id] = this.categoryCheckMap[citem.id]?!this.categoryCheckMap[citem.id]:true
      
    this.activities.forEach(aitem=>{
      console.log(aitem.get("category")&&aitem.get("category").id)
      console.log(citem.id)
        if(aitem.get("category")&&aitem.get("category").id == citem.id){
          this.activityCheckMap[aitem.id] = this.categoryCheckMap[citem.id]
        }
    })

    this.loadActvityEvents();
  }
  activityCheckMap = {};
  updateSingleChecked(aitem): void {
    this.activityCheckMap[aitem.id] = this.activityCheckMap[aitem.id]?!this.activityCheckMap[aitem.id]:true
    this.loadActvityEvents();
  }

  loadAllData(){
    this.getActivityRegister().then(()=>{
      if(this.start_date){
        this.loadRegistersData()
      }
    })
    this.getActivityData().then(()=>{
      this.loadEventsData()
    })
  }
  // Modal signup function
  isVisible = false;
  isConfirmLoading = false;
  currentRegister:any;
  selectPointerList =[];
  searchPointer(ev){
    let searchString = String(ev)
    let className = "_User"
    let query = new Parse.Query(className);
    query.equalTo("company",this.company);
    // 根据字符串类型匹配合适的搜索方式
    if(searchString.startsWith("1")){
      query.startsWith("mobile",searchString)
    }else{
      query.startsWith("realname",searchString)
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
  showModal(): void {
    this.currentRegister = undefined;
    this.isVisible = true;
  }
  saveNewUser(){
    if(this.currentRegister&&this.currentRegister.id){
      let ActivityRegister = Parse.Object.extend("ActivityRegister")
      let newRegister = new ActivityRegister()
      newRegister.set("isAppend",true)
      newRegister.set("user",this.currentRegister)
      newRegister.set("startDate",this.start_date)
      newRegister.set("endDate",this.end_date)
      newRegister.set("serviceTime",(this.end_date-this.start_date)/1000/60/60)
      let company = this.appServ.company
      newRegister.set("company",{"__type":"Pointer","className":"Company","objectId":company})
      newRegister.set("activity",this.activity)
      newRegister.save().then(data=>{
        this.message.create('success',"报名成功！")
        // this.loadAllData()
        this.getActivityRegister().then(()=>{
          if(this.start_date){
            this.loadRegistersData()
          }
        })
        this.isVisible = false
      }).catch(err=>{
        this.message.create('error',err)
        this.isVisible = false
      })
    }else{
      this.message.create('warning',"请选择一个需要报名的用户。")
    }
  }
  deleteCheckIn(obj){
    this.modalService.confirm({
      nzTitle: '你确定要删除这条签到信息吗?',
      nzContent: '<b style="color: red;">请再次确认</b>',
      nzOkText: '确认',
      nzOkType: 'danger',
      nzCancelText: '取消',
      nzOnOk: () => {
        obj.destroy().then(data=>{
          this.loadCheckInLogs(this.activity)
          this.message.create('success',"删除成功！")
        })
      },
    });
  }

  deleteRegister(obj){
    this.modalService.confirm({
      nzTitle: '你确定要删除这条报名信息吗?',
      nzContent: '<b style="color: red;">请再次确认</b>',
      nzOkText: '确认',
      nzOkType: 'danger',
      nzCancelText: '取消',
      nzOnOk: () => {
        obj.destroy().then(data=>{
          // this.loadAllData()
          this.getActivityRegister().then(()=>{
            if(this.start_date){
              this.loadRegistersData()
            }
          })
          this.message.create('success',"删除成功！")
        })
      },
    });    
  }
  // End of Modal signup
  getActivityRegister(){
    return new Promise((res,rej)=>{
      let query = new Parse.Query("ActivityRegister");
      query.equalTo("company",this.company);
      let today = new Date();
      let thismonday = new Date(today.getFullYear(),today.getMonth(),today.getDate()-(today.getDay()==0?7:today.getDay())+1,0,0,0);
      if(this.start_date){
        query.equalTo("startDate",this.start_date)
      }else{
        query.greaterThanOrEqualTo("startDate", thismonday);

      }
      query.equalTo("activity",this.activity)
      query.notEqualTo("isDeleted",true)
      query.exists("user")
      query.include("user")
      query.include("checkedDevice")
      query.include("checkOutDevice")
      
      query.include("activity")
      query.find().then(data=>{
        // this.registers = data.sort((a,b)=> (a.id > b.id)?-1:1 )
        this.registers = data
        res(data)
      }).catch(err=>{
        rej(err)
      })
    })
  }

  displayRegisters = []
  loadRegistersData(){
    this.displayRegisters = this.registers || []
    // this.displayRegisters = this.registers.filter(item=>{
    //   let sameActivity = item.get("activity").id == this.activity.id;
    //   let sameDate =  item.get("startDate").getDate() == this.start_date.getDate();
    //   let sameHours =  item.get("startDate").getHours() == this.start_date.getHours();
    //   if(sameActivity&&sameDate&&sameHours){
    //     return item
    //   }
    // }) || []
  }
  displayCheckInLogs = []
  async loadCheckInLogs(activity){
    let query = new Parse.Query("CheckInLog")
    query.equalTo("activity",activity.toPointer())
    this.displayCheckInLogs = await query.find();
  }
  loadEventsData(){
    // https://docs.dhtmlx.com/scheduler/
    // 设置语言（中文）

    // 设置每日时间段
    scheduler.config.first_hour =7;
    scheduler.config.last_hour = 20;

    // 设置事件内容区域
    scheduler.templates.event_text = function(start,end,ev){
      return `活动名称：${ev.activity?ev.activity.get("title"):ev.text} <br>
              人数限制：${ev.period?ev.period.peopleMax:"无"} <br>
      `;
    };

    // 隐藏事件操作区域
    // https://docs.dhtmlx.com/scheduler/customizing_edit_select_bars.html
    scheduler.config.icons_select = []

    // 拦截日历交互事件
    scheduler.config.edit_on_create = false; // 关闭编辑及创建事件
    scheduler.showLightbox = function(id) {
      return true;
      // scheduler.startLightbox(id, document.getElementById("my_form"));
  };

    // scheduler.attachEvent("onClick", this.openPeriodDetail);
    (<any>scheduler).rootComponent = this;
   
      // 日历区域变化事件（翻页）
      scheduler.attachEvent("onViewChange", function (new_mode , new_date){
        //any custom logic here
        if(new_date != (<any>scheduler).rootComponent.today){
          console.log(new_date);
          (<any>scheduler).rootComponent.setToday(new_date);
          (<any>scheduler).rootComponent.loadActvityEvents();
        }

    })
    scheduler.attachEvent("onClick", function (id, e){ // 自定义双击事件
      //any custom logic here
      (<any>scheduler).rootComponent.openPeriodDetail(id);
      return true;
    });
    scheduler.attachEvent("onDblClick", function (id, e){ // 自定义双击事件
          //any custom logic here
          // console.log("onDblClick")
          return true;
    });

    // 渲染日历事件
    scheduler.init(this.schedulerContainer.nativeElement, this.today, "week");
    scheduler.parse(this.eventsData, "json");
  }
  loadActvityEvents(){
    this.getActivityData().then(()=>{
      this.loadEventsData()
    })
  }
  setToday(date){
    this.today = date
  }
  openPeriodDetail(id){
    let activity = scheduler.getEvent(id).activity
    let period = scheduler.getEvent(id).period
    let start_date = scheduler.getEvent(id).start_date
    let end_date = scheduler.getEvent(id).end_date

    this.activity = activity;
    this.period = period;
    this.start_date = start_date;
    this.end_date = end_date;
    
    if(activity.get("cycle")=="onetime"){
      this.periodDetailModal = true
      this.loadCheckInLogs(activity)
      
    }


    if(activity.get("cycle")=="weekly"){
      
      this.periodDetailModal = true
      // this.loadAllData()

      this.getActivityRegister().then(()=>{
        if(this.start_date){
          this.loadRegistersData()
        }
      })
    }
  }

  closePeriodDetail(){
    this.displayRegisters = [] // 清除页面渲染数据后，再关闭Drawer可提高渲染效率。
    this.displayCheckInLogs = [] // 清除页面渲染数据后，再关闭Drawer可提高渲染效率。
    this.periodDetailModal = false
  }
  getActivityData(){
    scheduler.clearAll();
    this.eventsData = [];

    return new Promise((res,rej)=>{
      let query = new Parse.Query("Activity");
      query.equalTo("company",this.company);
      query.equalTo("isEnabled",true)

      if(this.currentRole != "superadmin"){
        let current = Parse.User.current()
        query.equalTo("manager",current.toPointer())
      }
      query.find().then(data=>{
        this.activities = data
        
        // 若存在筛选条件，则加载已选择项目
        let selectKeys = Object.keys(this.activityCheckMap)
        let activities = this.activities
        if(selectKeys&&selectKeys.length>0){

          activities = this.activities.filter(aitem=>{
            let exists = selectKeys.find(key=>key==aitem.id);
            if(exists){
              return aitem
            }
          })
        }

        activities.forEach(act=>{
          // 获取单次会议活动开展时段，封装成Event
          if(act.get("cycle")=="onetime"){
            
            let start_date = act.get("startDate")
            if(act.get("checkDate")){
              start_date = act.get("checkDate")
            }
            let end_date = new Date(
              start_date.getFullYear(), start_date.getMonth(), start_date.getDate(),
              start_date.getHours()+2, start_date.getMinutes(),0
            );
            let event = {
              id: act.id+start_date.getDay()+start_date.getHours(),
              start_date: start_date,
              end_date: end_date,
              text:act.get("title"),
              activity: act,
              period: {
                day: start_date.getDay(),
                isEnabled: true,
                peopleMax: 0,
                timeFrom: start_date,
                timeTo: end_date
              },
              color:act.get("color")
            }

            this.eventsData.push(event)
          }
          // 获取周期性活动开展时段，封装成Event
          if(act.get("cycle") == "weekly"){

            let servicePeriodArray = act.get("servicePeriodArray")

            // if(servicePeriodArray&&servicePeriodArray.length>0){
            //   servicePeriodArray = [{"day":"1","timeTo":{"iso":"2019-10-18T04:00:24.490Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T00:00:24.490Z","__type":"Date"},"peopleMax":20},{"day":"1","timeTo":{"iso":"2019-10-18T09:00:25.272Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T06:00:25.272Z","__type":"Date"},"peopleMax":20},{"day":"1","timeTo":{"iso":"2019-10-18T12:00:25.779Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T10:00:25.779Z","__type":"Date"},"peopleMax":5},{"day":"2","timeTo":{"iso":"2019-10-18T04:00:19.686Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T00:00:19.686Z","__type":"Date"},"peopleMax":20},{"day":"2","timeTo":{"iso":"2019-10-18T09:00:20.016Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T06:00:20.015Z","__type":"Date"},"peopleMax":20},{"day":"2","timeTo":{"iso":"2019-10-18T12:00:20.300Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T10:00:20.300Z","__type":"Date"},"peopleMax":5},{"day":"3","timeTo":{"iso":"2019-10-18T04:00:06.198Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T00:00:06.197Z","__type":"Date"},"peopleMax":20},{"day":"3","timeTo":{"iso":"2019-10-18T09:00:07.011Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T06:00:07.011Z","__type":"Date"},"peopleMax":20},{"day":"3","timeTo":{"iso":"2019-10-18T12:00:07.570Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T10:00:07.570Z","__type":"Date"},"peopleMax":5},{"day":"4","timeTo":{"iso":"2019-10-18T04:00:52.760Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T00:00:52.760Z","__type":"Date"},"peopleMax":20},{"day":"4","timeTo":{"iso":"2019-10-18T09:00:54.082Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T06:00:54.082Z","__type":"Date"},"peopleMax":20},{"day":"4","timeTo":{"iso":"2019-10-18T12:00:54.666Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T10:00:54.666Z","__type":"Date"},"peopleMax":5},{"day":"5","timeTo":{"iso":"2019-10-18T04:00:55.300Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T00:00:55.300Z","__type":"Date"},"peopleMax":20},{"day":"5","timeTo":{"iso":"2019-10-18T09:00:55.799Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T06:00:55.799Z","__type":"Date"},"peopleMax":20},{"day":"5","timeTo":{"iso":"2019-10-18T12:00:56.270Z","__type":"Date"},"timeFrom":{"iso":"2019-10-18T10:00:56.270Z","__type":"Date"},"peopleMax":5}]
            //   servicePeriodArray.forEach(item=>{
            //     item.timeTo = new Date(item.timeTo.iso)
            //     item.timeFrom = new Date(item.timeFrom.iso)
            //   })
            // }
          // console.log(servicePeriodArray)
            servicePeriodArray.forEach(period=>{

              // 当前界面事件渲染
              // 本周事件渲染
              let start_date = new Date(
                this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - (this.today.getDay()?this.today.getDay():7) + Number(period.day),
                new Date(period.timeFrom).getHours(), new Date(period.timeFrom).getMinutes(),0
              );
              let end_date = new Date(
                this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - (this.today.getDay()?this.today.getDay():7) + Number(period.day),
                new Date(period.timeTo).getHours(), new Date(period.timeTo).getMinutes(),0
              );

              let event = {
                id: act.id+period.day+new Date(period.timeFrom).getHours(),
                start_date: start_date,
                end_date: end_date,
                text:act.get("title"),
                activity: act,
                period: period,
                color:act.get("color")
              }

              this.eventsData.push(event)

              // 上周事件渲染
              let pre_start_date = new Date(start_date.toString());pre_start_date.setDate(pre_start_date.getDate()-7);
              let pre_end_date = new Date(end_date.toString());pre_end_date.setDate(pre_end_date.getDate()-7);

              let pre_event = {
                id: "pre"+act.id+period.day+new Date(period.timeFrom).getHours(),
                start_date: pre_start_date,
                end_date: pre_end_date,
                text:act.get("title"),
                activity: act,
                period: period,
                color:act.get("color")
              }
              this.eventsData.push(pre_event)

              // 下周事件渲染
              let next_start_date = new Date(start_date.toString());next_start_date.setDate(next_start_date.getDate()+7);
              let next_end_date = new Date(end_date.toString());next_end_date.setDate(next_end_date.getDate()+7);

              let next_event = {
                id: "next"+act.id+period.day+new Date(period.timeFrom).getHours(),
                start_date: next_start_date,
                end_date: next_end_date,
                text:act.get("title"),
                activity: act,
                period: period,
                color:act.get("color")
              }
              this.eventsData.push(next_event)
            })
          }
        })
        res()
      }).catch(err=>{
        rej()
      })
    })
  }
  // Register编辑区域
  toggleSwitch(ev,obj,key){
    obj.set(key, ev) // ev即switch组件切换后的值
    obj.save()
  }
  batchComplete(){
    this.displayRegisters.forEach(reg=>{
      reg.set("isComplete",true)
      reg.save().then(data=>{
        reg = data
      })
    })
  }
  startEdit(obj,key, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = obj.id+key;
    this.editKey = key
    this.editData = obj.get(key)
    this.editObj = obj
  }
  editId: string | null;
  editKey:any;
  editData: any;
  editObj: any;
  @ViewChild(NzInputDirective, { static: false, read: ElementRef }) inputElement: ElementRef;

  @HostListener('window:click', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.editId && this.inputElement && this.inputElement.nativeElement !== e.target) {
      this.editObj.set(this.editKey,this.editData)
      this.editObj.save().then(()=>{
        this.loadRegistersData()
      })
      this.editId = null;
      this.editKey = null;
      this.editData = null;
      this.editObj = null;
    }
  }
  printRegisterData(){
    let printFixStyle = `
    html, body{
      margin:10px !important;
    }
    @page {
    size: A4 protrait;
    }
    table {
        width:100%;
        height:100%;
        text-align: center;   
        border-right: none!important; 
    }
    
    table,th,td /* 表格边框样式 */
    {
      border:0.5px solid black;
      height:33px;
    }
    .firstRow{
        text-align: center;
        font-size:28px;
        font-weight: bold;
    }
    `;
  
    let registerRow = ``
    // this.displayRegisters.sort((a,b)=>{
    //   return -1
    // })

    this.displayRegisters.forEach((register,index)=>{
  
      // let signDate = register.get("signDate")?register.get("signDate"):this.activity.get("signFromTo").from;
      let invoice = register.get("invoice")?register.get("invoice"):"none"
      let invoiceMap = {
        none:"未开票",
        plain:"普票",
        special:"专票"
      }
      registerRow += `
      <tr style="height:25.00pt;">
        <td>${index+1}</td>
        <td>${register.get("user").get("realname")?register.get("user").get("realname"):register.get("user").get("nickname")}</td>
        <td>${register.get("user").get("mobile")}</td>
        <td>${register.get("user").get("diyform")?(register.get("user").get("diyform").diykeshibumen || register.get("user").get("diyform").diydanwei) || "":""}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      `
    })
    
    let printHTML = `
    <h1 style="width:100%;text-align:center;">
      </h1>
    <table cellpadding="0" cellspacing="0">
                    <colgroup>
                        <col style="width:27.50pt;">
                        <col style="width:51.25pt;">
                        <col style="width:44.00pt;">
                        <col style="width:84.00pt;">
                        <col style="width:124.00pt;">
                        <col style="width:44.00pt;">
                        <col style="width:44.00pt;">
                        <col style="width:30.00pt;">
                        <col style="width:30.00pt;">
                        <col style="width:30.00pt;">
                        <col style="width:44.00pt;">
                    </colgroup>
                    <tbody>
                        <tr height="80" style="height:40.00pt;" class="firstRow">
                            <td colspan="13" class="et3" height="40">
                            ${this.start_date.getMonth()+1}月${this.start_date.getDate()}日${this.activity.get('title')}签到表（${this.ampm[this.period.timeFrom.getHours()]}）
                            </td>
                        </tr>
  
                        <tr style="height:40.00pt;">
                            <td height="40">                              序号                          </td>
                            <td>                              姓名                          </td>
                            <td>                              电话                          </td>
                            <td>                              科室                          </td>
                            <td>                              陪诊<br>地点                          </td>
                            <td>                              签到                          </td>
                            <td>                              签退                          </td>
                            <td>                              巡查1                          </td>
                            <td>                              巡查2                          </td>
                            <td>                              巡查3                          </td>
                            <td>                              备注                          </td>
                        </tr>
                    ${registerRow}
                    </tbody>
                </table>
    `;
  
    let printModal: any = window.open("",'newwindow',
      'toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
      printModal.document.body.innerHTML = `<style>${printFixStyle}</style>`+printHTML;
      printModal.print();
  }

}

