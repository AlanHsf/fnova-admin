import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Parse from "parse";
import { AuthService } from '../auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import {Router} from '@angular/router'

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  validateForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth:AuthService, private message: NzMessageService, private route: Router) { }

  company:string = "pPZbxElQQo"
  ngOnInit() {
    localStorage.setItem('hiddenMenu', 'true')
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    this.getRooms()
  }
  rooms:any
  async getRooms() {
    let Rooms = new Parse.Query('Room')
    Rooms.equalTo('company',this.company)
    let rooms = await Rooms.find()
    if(rooms && rooms.length > 0) {
      this.rooms = rooms
      console.log(this.rooms)
    }
  }
  isVisible:any = false
  async goLive(activeRoom){
    let user = Parse.User.current()
    if(!user) {
      this.isVisible = true
      return
    }
    if(!activeRoom.get('isLive')) {
      alert('主播正在赶来的路上')
      return
    }
    let isAuth = await this.authority(activeRoom.id)
    if(!isAuth) {
      alert('您暂无权限观看此直播')
      return
    } else {
      this.route.navigate(['./masterol-doctor/live-room', {rid:activeRoom.id}])
    }

  }
  handleCancel(){
    this.isVisible = false
  }
  submitForm(): void {
    console.log(this.validateForm.controls)
    let username = this.validateForm.controls.userName.value
    let password = this.validateForm.controls.password.value
    console.log(username, password)
    this.login(username, password)
  }

  login(username, password) {
    let currentUser: any;
    // 调用auth.service中的login方法
    //  setTimeout(function(){
    this.auth
      .login(username, password)
      .then(async data => {
        currentUser = Parse.User.current();
        console.log(currentUser);
        this.message.create("success", "登录成功");
        this.isVisible = false
      })
      .catch(err => {
        this.message.create("error", "错误的用户名或密码");
      });
  }

  ngAfterViewInit() {
    // 获取过程性考核试题
    // this.video = document.getElementById(this.videoPid);
  }
  // 权限
  async authority(rid){
   let User = Parse.User.current()
   let roomStudents = new Parse.Query('RoomStudents')
   roomStudents.equalTo('user', User.id)
   roomStudents.equalTo('room', rid)
   let student = await roomStudents.first()
   console.log(student)
   if(student && student.id){
      return true
    } else {
      return false
   }

  }

}
