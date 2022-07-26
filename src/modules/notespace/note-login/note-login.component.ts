import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../auth.service';
import * as Parse from "parse";
import { Router } from '@angular/router';
@Component({
  selector: 'app-note-login',
  templateUrl: './note-login.component.html',
  styleUrls: ['./note-login.component.scss']
})
export class NoteLoginComponent implements OnInit {
  nums = ['C', '6', 'Z', 't'];
  str = '';
  canvas: any;
  image: any;
  // 绘制验证码
  drawCode(str) {
    // this.resetCode()

    this.canvas = document.getElementById("verifyCanvas"); //获取HTML端画布
    var context: CanvasRenderingContext2D = this.canvas.getContext("2d"); //获取画布2D上下文
    context.fillStyle = "white"; //画布填充色
    context.fillRect(0, 0, this.canvas.width, this.canvas.height); //清空画布
    context.fillStyle = "cornflowerblue"; //设置字体颜色
    context.font = "25px Arial"; //设置字体
    var rand = new Array();
    var x = new Array();
    var y = new Array();
    for (var i = 0; i < 4; i++) {
      rand.push(rand[i]);
      rand[i] = this.nums[i]
      x[i] = i * 20 + 10;
      y[i] = Math.random() * 20 + 20;
      context.fillText(rand[i], x[i], y[i]);
    }
    str = rand.join('').toUpperCase();
    //画3条随机线
    for (var i = 0; i < 3; i++) {
      this.drawline(this.canvas, context);
    }

    // 画30个随机点
    for (var i = 0; i < 30; i++) {
      this.drawDot(this.canvas, context);
    }
    this.convertCanvasToImage(this.canvas);
    return str;
  }

  // 随机线
  drawline(canvas, context) {
    context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
    context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
    context.lineWidth = 0.5; //随机线宽
    context.strokeStyle = 'rgba(50,50,50,0.3)'; //随机线描边属性
    context.stroke(); //描边，即起点描到终点
  }
  // 随机点(所谓画点其实就是画1px像素的线，方法不再赘述)
  drawDot(canvas, context) {
    var px = Math.floor(Math.random() * canvas.width);
    var py = Math.floor(Math.random() * canvas.height);
    context.moveTo(px, py);
    context.lineTo(px + 1, py + 1);
    context.lineWidth = 0.2;
    context.stroke();

  }
  // 绘制图片
  convertCanvasToImage(canvas) {
    document.getElementById("verifyCanvas").style.display = "none";
    this.image = document.getElementById("code_img");
    this.image.src = canvas.toDataURL("image/png");
    return this.image;
  }






  // 登录
  // 登录验证表单对象
  validateForm!: FormGroup;
  // 用户名错误提示
  userErrorTip: any;
  // 密码错误提示
  passwordErrorTip: any;
  codeErrorTip: any
  // 用户名（手机号码）
  username: any;
  // 密码
  password: any;
  // code: '67de'
  //所有候选组成验证码的字符，当然也可以用中文的
  // 检测是否为学校学生

  // //绑定学籍验证表单对象
  // profileForm!: FormGroup;
  // // 姓名错误提示
  // nameErrorTip: any;
  // // 身份证号码错误提示
  // idcardErrorTip: any;

  // 注册
  registForm!: FormGroup;
  // 注册姓名错误提示
  registNameErrorTip: any;
  // 密码错误提示
  registIdcardErrorTip: any;
  //确认密码提示
  affirmIdcardErrorTip: any;
  //邀请码错误提示
  invitationErrorTip: any;
  // 注册姓名
  registName: any;
  // 注册密码
  registIdcard: any;
  //邀请码
  invitatio: any
  // 确认密码
  affirmIdcard: any;

  redirectUrl: any = localStorage.getItem("redirectUrl");
  // 点击登录按钮
  submitForm(value: { username: string; password: string; checkCode: string }): void {
    // localStorage.removeItem("user")
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.username = value.username;
    this.password = value.password;
    let checkCode = value.checkCode;
    // if (checkCode != this.code) {
    //   this.message.create("error", "密码或验证码错误");
    // } else {
      this.login();
    // }

    // this.showModal()
  }
  // 点击注册按钮
  registSubmitForm(value: { registName: string; registIdcard: string }): void {
    // localStorage.removeItem("user")
    for (const key in this.registForm.controls) {
      this.registForm.controls[key].markAsDirty();
      this.registForm.controls[key].updateValueAndValidity();
    }
    this.registName = value.registName;
    this.registIdcard = value.registIdcard;

    this.queryProfile();
  }
  login() {
    let profile: any;
    let currentUser: any;
    // 调用auth.service中的login方法
    //  setTimeout(function(){
    this.authServ
      .login(this.username, this.password)
      .then(async data => {
        currentUser = Parse.User.current();
        let allUrl
        if (currentUser && currentUser.url) {
          allUrl = currentUser.url
        }
        let url
        let datas: any;
        if (allUrl && allUrl.indexOf(';') > 0) {
          datas = {}
          console.log(123, allUrl)
          url = allUrl.split(';')
          console.log(url)
          url.forEach((value, index) => {
            if (index > 0) {
              console.log(1233, value)
              let p = value.split("=")
              let key = p[0]
              datas[key] = p[1]
              console.log(datas)
            }
          })
        }
        console.log(currentUser);
        if (datas) {
          this.router.navigate([url[0], datas]);
        } else {
          this.router.navigate([allUrl]);
        }

        // if (!profile || profile == undefined) {
        //   console.log(profile)
        //   // this.showModal()
        //   this.createMessage('error')
        // } else {
        //   // 如果有profile  直接跳转
        //   this.router.navigate([this.redirectUrl]);
        // }
      }).catch(err => {
        this.message.create("error", "错误的用户名或密码");
      }
      );

    // callback(data)
    //  },1000)
  }

  async queryProfile() {
    //查询user表是否存在该用户名，如果存在不允许同名注册
    let queryUser = new Parse.Query("User")
    queryUser.equalTo("username", this.registName)
    console.log(this.registName)
    // queryUser.equalTo("company","1AiWpTEDH9")
    let findUser = await queryUser.first()
    console.log(findUser)
    if (findUser && findUser.id) {
      this.message.error(`该用户名已被注册`);
    } else {
      let newUser = Parse.Object.extend("_User");
      let Users = new newUser()
      Users.set("username", this.registName);
      Users.set("password", this.registIdcard)
      Users.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: "1AiWpTEDH9"
      })
      Users.save().then(res => {
        if (res && res.id) {
          this.message.success(`注册成功`);
          console.log(this.registName + "注册成功")
        }
      })

    }
  }


  // 注册
  regist() { }
  createMessage(type: string): void {
    this.authServ.logout();
    this.message.create(type, `非学校用户，不允许登录`);
  }
  isVisible = false;
  isOkLoading = false;

  constructor(
    public authServ: AuthService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {
    this.validateForm = this.fb.group({
      // 加入验证的表单项 ： 初始值、 是否验证 调用的验证方法
      username: ["", [Validators.required], [this.userNameAsyncValidator]],
      password: ["", [Validators.required], [this.passwordAsyncValidator]],
      // initCode: [this.code ],
      // checkCode: ["", [Validators.required], [this.codeAsyncValidator]]
    });
    this.registForm = this.fb.group({
      // 加入验证的表单项 ： 初始值、 是否验证 调用的验证方法
      registName: ["", [Validators.required], [this.registNameAsyncValidator]],
      registIdcard: [
        "",
        [Validators.required],
        [this.registIdcardAsyncValidator]
      ],
      // 确认密码
      affirmIdcard: [
        "", [Validators.required], [this.affirmIdcardAsyncValidator]
      ],
      invitatio: [
        "", [Validators.required], [this.invitatioAsyncValidator]
      ]
    });
    // this.profileForm = this.fb.group({// 加入验证的表单项 ： 初始值、 是否验证 调用的验证方法
    //   name: ['', [Validators.required], [this.nameAsyncValidator]],
    //   idcard: ['', [Validators.required], [this.idcardAsyncValidator]],

    // });
  }

  // 登录 用户名（手机号码）验证
  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      let reg = /^1[345789]\d{9}$/;
      console.log(control.value);
      //判断是否是笔记注册用户
      let username = control.value;
      setTimeout(() => {
        if (username == undefined || username.trim() == "") {
          this.userErrorTip = "请输入用户名";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        observer.next(null);
        observer.complete();
      }, 1000);
    });
  // 登录 密码验证
  passwordAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      console.log(control.value);
      setTimeout(() => {
        let password = control.value;
        if (password == undefined || password.trim() == "") {
          this.passwordErrorTip = "请输入密码";
          observer.next({ error: true, duplicated: true });
          observer.complete();

          return;
        }
        if (password.length < 6 || password.length > 18) {
          this.passwordErrorTip = "密码长度不得小于6位或者大于18位数";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        observer.next(null);
        observer.complete();
      }, 1000);
    });

  codeAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      console.log(control.value);

      setTimeout(() => {
        let checkCode = control.value;
        if (checkCode == undefined || checkCode.trim() == "") {
          this.codeErrorTip = "请输入验证码";
          observer.next({ error: true, duplicated: true });
          observer.complete();

          return;
        }
        if (checkCode.length != 4) {
          this.codeErrorTip = "验证码长度不对";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        observer.next(null);
        observer.complete();
      }, 1000);
    });

  // 注册 密码验证
  registIdcardAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      let registIdcard = control.value;
      setTimeout(() => {
        if (registIdcard == undefined || registIdcard.trim() == "") {
          this.registIdcardErrorTip = "请输入密码";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        if (registIdcard.length < 8 || registIdcard.length > 18) {
          this.registIdcardErrorTip = "密码长度为8至18位";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        observer.next(null);
        observer.complete();
      }, 1000);
    });

  // 确认密码
  affirmIdcardAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        let affirmIdcard = control.value;
        if (affirmIdcard == undefined || affirmIdcard.trim() == "") {
          this.affirmIdcardErrorTip = "密码不一致";
          observer.next({ error: true, duplicated: true });
          observer.complete();

          return;
        }
        if (affirmIdcard != this.registIdcard) {
          this.affirmIdcardErrorTip = "密码不一致";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          console.log(this.registIdcard)
          console.log(affirmIdcard)
          return
        }
        observer.next(null);
        observer.complete();
      }, 1000);
    })

  //邀请码
  invitatioAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      let invitatio = control.value

      if (invitatio == undefined || invitatio.trim() == "") {
        this.affirmIdcardErrorTip = "邀请码不能为空";
        observer.next({ error: true, duplicated: true });
        observer.complete();
        return;
      }
      if (invitatio != "feima") {
        this.affirmIdcardErrorTip = "邀请码错误";
        observer.next({ error: true, duplicated: true });
        observer.complete();
        return
      }
      observer.next(null);
      observer.complete();
    })

  // 注册 账号验证
  registNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      console.log(control.value);
      setTimeout(() => {
        let registName = control.value;
        if (registName == undefined || registName.trim() == "") {
          this.registNameErrorTip = "请输入正确的账号名";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        observer.next(null);
        observer.complete();
      }, 1000);
    });

  // 绑定profile 姓名验证
  // nameAsyncValidator = (control: FormControl) =>
  //   new Observable((observer: Observer<ValidationErrors | null>) => {
  //     let name = control.value;
  //     setTimeout(() => {
  //       if (name == undefined || name.trim() == "") {
  //         this.nameErrorTip = "请输入姓名";
  //         observer.next({ error: true, duplicated: true });
  //         observer.complete();
  //         return
  //       }
  //       observer.next(null);
  //       observer.complete();
  //     }, 1000);
  //   });

  // 身份证号码验证
  // idcardAsyncValidator = (control: FormControl) =>
  //   new Observable((observer: Observer<ValidationErrors | null>) => {
  //     console.log(control.value)

  //     setTimeout(() => {
  //       let idcard = control.value;
  //       if (idcard == undefined || idcard.trim() == "") {
  //         this.idcardErrorTip = "请输入正确的身份证号码";
  //         observer.next({ error: true, duplicated: true });
  //         observer.complete();

  //         return;
  //       }
  //       if (/^\d{17}(\d|X|x)$/.test(idcard) === false) {
  //         this.idcardErrorTip = "请输入正确的身份证号码";
  //         observer.next({ error: true, duplicated: true });
  //         observer.complete();

  //         return;
  //       }
  //       observer.next(null);
  //       observer.complete();
  //     }, 1000);
  //   });
  code: any = ''
  ngOnInit(): void {
    this.creatCode()
  }
  creatCode() {
    this.code = ''
    let codeLength = 4;  //验证码的长度
    let codeChars = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ];
    for (let i = 0; i < codeLength; i++) {
      let charNum = Math.floor(Math.random() * 52)
      this.code += codeChars[charNum];
    }
  }
}
