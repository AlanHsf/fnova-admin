import * as Parse from "parse";
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterAssociationComponent implements OnInit {

  teamname: string         //社团名
  password: string           //密码
  password2: string           //密码2
  position: string           //负责人职位
  username: string           //用户名
  phone: string                //手机号
  wechat: string                 //wechat号
  class: string    //  学院班级
  politicalStatus: string    //  政治面貌

  passwordVisible: boolean
  constructor(
    private fb: FormBuilder,
    private app: AppService,
    private http: HttpClient,
    private message: NzMessageService,
    private router: Router,

  ) {
    // this.app.server = 'http://localhost:3337'
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+86'],
      phoneNumber: [null, [Validators.required]],
      agree: [false]
    });
  }
  // 表单数据验证
  async formVerify() {
    if (!this.teamname || !this.teamname.trim()) {
      this.message.create('error', '请填写社团名称')
      return
    }
    // if (await this.teamnameVerify() > 0) {
    //   this.message.create('error', '该社团已注册')
    //   return
    // }
    if (!this.password || !this.password.trim()) {
      this.message.create('error', '请填写密码')
      return
    }
    if (this.password !== this.password2) {
      this.message.create('error', '两次密码不匹配')
      return
    }
    if (!this.position || !this.position.trim()) {
      this.message.create('error', '请填写负责人职位')
      return
    }
    if (!this.username || !this.username.trim()) {
      this.message.create('error', '请填写负责人姓名')
      return
    }
    if (!this.phone || !this.phone.trim()) {
      this.message.create('error', '请填写手机号')
      return
    }
    if (!this.wechat || !this.wechat.trim()) {
      this.message.create('error', '请填写wechat号码')
      return
    }
    if (!this.class || !this.class.trim()) {
      this.message.create('error', '请填写班级信息')
      return
    }
    if (!this.politicalStatus || !this.politicalStatus.trim()) {
      this.message.create('error', '请填写政治面貌')
      return
    }

    return true
  }

  // // 验证社团名称是否存在
  // async teamnameVerify() {
  //   let query = new Parse.Query('Department')
  //   query.equalTo('name', this.teamname.trim())
  //   return await query.count()

  // }

  // 注册
  async register() {
    //  1.表单验证
    if (!await this.formVerify()) {
      return
    }
    //  2.提交注册,新增数据
    let query = new Parse.Query("Department")
    query.get("sqjsrXsRER").then(data => {    // 插入objectId删除
      data=JSON.parse(JSON.stringify(data))
      let timp:any = data
      console.log(timp.canJoin)
      let object = {
        "name": this.teamname.trim(),
        "password": this.password,
        "status": 1,
        "canJoin":timp.canJoin,
        "headInfo": {
          "name": this.username,
          "position": this.position,
          "phone": this.phone,
          "wechat": this.wechat,
          "class": this.class,
          "politicalStatus": this.politicalStatus
        },
        "company": this.pointer("Company", 'qvFWcjCvzH')
      }

      let url = this.app.server + '/api/ndAssociation/headRegister'
      this.http.post(url, object).subscribe(data => {
        let temp: any = data
        console.log(temp)
        if (temp.status == "success") {
          //  注册成功,跳转登录
          this.message.loading(temp.msg + '正在跳转', { nzDuration: 2000 })
          setTimeout(() => {
            this.router.navigate(['user/login-association'])
          }, 2000);
        } else if (temp.status == "fail") {
          this.message.create('error', temp.msg)
        }
      })
    })
  }

  pointer(className, objectId) {
    return { "className": className, "objectId": objectId, "__type": "Pointer" }
  }

  validateForm: FormGroup;
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      console.log(this.validateForm.controls[i])
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => {
      this.validateForm.controls.checkPassword.updateValueAndValidity()
      console.log(1)
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }

  con() {
    console.log(this.validateForm)
  }

}
