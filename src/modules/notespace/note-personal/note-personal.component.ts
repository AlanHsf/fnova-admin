import { Component, OnInit,ViewChild } from '@angular/core';
import * as Parse from "parse";
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
// import {EditImageComponent} from '../../common/edit-image/edit-image.component'
@Component({
  selector: 'app-note-personal',
  templateUrl: './note-personal.component.html',
  styleUrls: ['./note-personal.component.scss']
})
export class NotePersonalComponent implements OnInit {
  
  // @ViewChild(EditImageComponent,{static:true}) editNotespace: EditImageComponent;


  value: string;
  loading = false;
  avatarUrl?: string;
  userId:any = {

  }
  files:any = ''
  constructor(
    private msg: NzMessageService,
    private message: NzMessageService,
  ) { }
  ngOnInit() {
    this.FindUser()
   let user = Parse.User.current()
   this.files = user.get('avatar')
   console.log(user,  this.files)
  }

  async FindUser(){
    let user = Parse.User.current();
    console.log(user.toJSON())
    console.log(111)
    let data = new Parse.Query("_User")
    data.equalTo("objectId",user.id)
    let temp = await data.first()
    this.userId = temp.toJSON()
    console.log(this.userId)
  }
  //更改个人信息
  Resct(){
    console.log(this.userId.nickname,this.userId.mobile,this.userId.sex)
    let isUser = new Parse.Query("_User")
    isUser.equalTo("objectId",this.userId.objectId)
    isUser.first().then(res => {
     
        res.set("name",this.userId.name)
        res.set("mobile",this.userId.mobile)
        res.set("sex",this.userId.sex)
        res.set("email",this.userId.email)
        res.set("avatar",this.files)
        res.save().then(item=>{
          this.FindUser()
          this.message.success("修改成功")
        }).catch(err=>{
          this.message.create("error",'格式错误')
        })
        
      
    })
    
  }
}
