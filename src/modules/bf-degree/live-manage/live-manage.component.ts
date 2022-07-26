import { Component, OnInit } from "@angular/core";

import { NzMessageService } from "ng-zorro-antd/message";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import * as Parse from "parse";
import {Router} from '@angular/router'

@Component({
  selector: "app-live-manage",
  templateUrl: "./live-manage.component.html",
  styleUrls: ["./live-manage.component.scss"],
})
export class LiveManageComponent implements OnInit {
  company: string = localStorage.getItem("company");
  rooms: Array<any>;
  tempRooms: Array<any>;
  showEditRoom: Boolean = false;
  activeRoom: object; /* 选中的room*/
  teacherValue: string; /* 老师名称 */
  roomValue: string; /* 房间名称 */
  constructor(private message: NzMessageService, private route : Router, private http: HttpClient) {}

  ngOnInit() {
      this.loadRoom();
  }

  /* 加载直播房间 */
  async loadRoom() {
      let did = localStorage.getItem('department')
      let company = localStorage.getItem('company')
    let queryRoom = new Parse.Query("Room");
    queryRoom.equalTo("company", company);
    if(did) {
        queryRoom.equalTo("departments", {
            __type: 'Pointer',
            className: 'Department',
            objectId: did
        }); 
    }
    queryRoom.descending("createdAt");
    let results = await queryRoom.find();
    if(results && results.length > 0) {
      this.tempRooms = results;
      this.rooms = results;
    }
    
  }

  

  /* 编辑直播间信息 */
  editRoom(room) {
    this.showEditRoom = true;
    let activeRoom: any = room;
    this.activeRoom = activeRoom;
    let liveLog = new Parse.Query('LiveLog')
    liveLog.equalTo('room', room.id)
    liveLog.equalTo('isLive', true)
    liveLog.descending('startTime')
    liveLog.first().then(log => {
      if(log && log.id) {
        this.title = log.get('title')
        this.startTime = log.get('startTime')
        this.endTime = log.get('endTime')
      }
    })
    console.log(activeRoom)
  }

  onHideModal(type) {
    this.showEditRoom = false
    // this.rooms = this.tempRooms.map((item) => {
    //   let temp = item.toJSON();
    //   let liveDate: any = {
    //     year:"",
    //     month:"",
    //     date:"",
    //     hour:"",
    //     minute:""
    //   };
    //   if (temp.startTime && temp.startTime.iso) {
    //     let sDate = new Date(temp.startTime.iso);
    //     liveDate.year = sDate.getFullYear();
    //     liveDate.month = sDate.getMonth() + 1;
    //     liveDate.date = sDate.getDate();
    //     liveDate.hour = sDate.getHours();
    //     liveDate.minute = sDate.getMinutes();
    //   }
    //   temp.liveDate = liveDate;
    //   return temp;
    // });
  }

  title:any = '' //本次开播的标题
  startTime:any  // 本次开播的开始时间
  endTime:any  //本次开播结束时间
  // 开播
  async submit(room) {
    console.log(room)
    console.log(this.title, this.startTime, this.endTime)
    // 未开播
    let Room = new Parse.Query('Room')
    if(!room.get('isLive')) {
      room.get('isLive', true)
      this.notice(room.id, room.get("name"))
      Room.get(room.id).then(res => {
        if(res && res.id) {
          res.set("isLive", true)
          res.save()
            let LiveLog = Parse.Object.extend('LiveLog')
            let liveLog = new LiveLog()
            liveLog.set('room', {__type:'Pointer', className: 'Room', objectId: room.id})
            liveLog.set('company', {__type:'Pointer', className: 'Company', objectId: this.company})
            liveLog.set('title', this.title)
            liveLog.set('startTime', this.startTime)
            liveLog.set('endTime', this.endTime)
            liveLog.set('isLive', true)
            liveLog.save().then(res => {
                this.showEditRoom = false
            })
        }
      })
    } else { // 开播中
      Room.get(room.id).then( res => {
          room.get('isLive', false)
        if(res && res.id) {
          res.set("isLive", false)
          res.save().then(r => {
                let liveLog = new Parse.Query('LiveLog')
                liveLog.equalTo('isLive', true)
                liveLog.descending('startTime')
                liveLog.first().then(log => {
                if(log && log.id) {
                    log.set('endTime', this.endTime)
                    log.set('isLive', false)
                    log.save().then(res => {
                    console.log(res)
                })
                this.showEditRoom = false
              }
            })
          })
          
        }
      })
    }
  }
  // 通知
 async notice(id, lessonName) {
    let date = new Date()
    let year = date.getFullYear()
    let month = (date.getMonth() +1)  >= 10 ? (date.getMonth() +1) : ("0"+ (date.getMonth() +1))
    let day = date.getDate() >= 10 ? date.getDate() :("0"+ date.getDate())
    let hour = date.getHours() >= 10 ? date.getHours() : ("0"+ date.getHours())
    let min = date.getMinutes() >=10  ? date.getMinutes() : ("0" + date.getMinutes())
    let time = year + "-" + month + "-"  + day  +" " + hour + ":" + min
    console.log(time)
    let RoomStudents = new Parse.Query('RoomStudents')
    RoomStudents.equalTo('company', 'pPZbxElQQo')
    RoomStudents.equalTo('room',id)
    RoomStudents.include('user')
    RoomStudents.include('profile')
    let students = await RoomStudents.find()
    console.log("res")
    console.log(students)
    students.forEach((student, index) => {
      console.log(student)
      console.log(student.get('user').get('wxapp'), index)
      if(!student.get('user').get('wxapp')) {
        return
      }
      let openid = student.get('user').get('wxapp')['wxf5e64db49b44f395'].openid
      let name 
      if(student.get('profile') && student.get('profile').get('name')) {
        name = student.get('profile').get('name')
      } else if(student.get('user') && student.get('user').get('nickname')) {
        name = student.get('user').get('nickname')
      } else {
          name = "暂无"
      }
      
      if(!openid) {
        return
      }
      let companyId = "pPZbxElQQo"
      let url =`https://server.fmode.cn/api/wxapp/bofangMessage?openid=${openid}&companyId=${companyId}&name=${name}&lessonName=${lessonName}&address=一百分课堂小程序-直播课堂&time=${time}`;
      let headers: HttpHeaders = new HttpHeaders({});
      headers.append("Content-Type", "application/json");
      this.http.get(url, { headers: headers }).subscribe(res => {
        console.log(res);
      });
    })
    
  }

  members(id) {
    this.route.navigate(['degree/live-members', {PclassName: "Room",PobjectId:id}])
  }
  
}
