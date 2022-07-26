import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../auth.service';
import * as Parse from "parse";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: "app-student-login",
  templateUrl: "./student-login.component.html",
  styleUrls: ["./student-login.component.scss"]
})
export class StudentLoginComponent implements OnInit {
  nums = ['C', '6', 'Z', 't'];
  str = '';
  canvas: any;
  image: any;
  constructor(
    public authServ: AuthService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.validateForm = this.fb.group({
      // 加入验证的表单项 ： 初始值、 是否验证 调用的验证方法
      username: ["", [Validators.required], [this.userNameAsyncValidator]],
      password: ["", [Validators.required], [this.passwordAsyncValidator]],
      // initCode: [this.code ],
      checkCode: ["", [Validators.required], [this.codeAsyncValidator]]
    });
    this.registForm = this.fb.group({
      // 加入验证的表单项 ： 初始值、 是否验证 调用的验证方法
      registName: ["", [Validators.required], [this.registNameAsyncValidator]],
      registIdcard: ["", [Validators.required], [this.registIdcardAsyncValidator]],
      regpassword: ["", [Validators.required], [this.regpasswordAsyncValidator]],
      confirmPassword: ["", [Validators.required], [this.confirmPasswordAsyncValidator]]
    });
    
  }
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
  // 注册姓名
  registName: any;
  // 注册身份证号码
  registIdcard: any;
  passwordVisible = false;
  passwordVisible2 = false;
  passwordVisible3 = false;

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


    let c = this.code.toLowerCase()
    
    let vc = checkCode.toLowerCase()
    
    if (c != vc) {
      this.message.create("error", "验证码错误");
    } else {
      this.login();
    }
  }
  // 点击注册按钮
  regpassword: any;
  confirmPassword: any;
  registSubmitForm(value: { registName: string; registIdcard: string, regpassword: string; confirmPassword: string }): void {
    // localStorage.removeItem("user")
    for (const key in this.registForm.controls) {
      this.registForm.controls[key].markAsDirty();
      this.registForm.controls[key].updateValueAndValidity();
    }
    this.registName = value.registName;
    this.registIdcard = value.registIdcard;
    this.regpassword = value.regpassword;
    this.confirmPassword = value.confirmPassword;

    this.queryProfile();
  }
  login() {
    let profile: any;
    let currentUser: any;
    console.log(this.username,this.password);
    
    // 调用auth.service中的login方法
    //  setTimeout(function(){
    this.authServ
      .authMobile(this.username, this.password)
      .then(async data => {
        currentUser = Parse.User.current();
        console.log(currentUser);
        let query = new Parse.Query("Profile");
        query.equalTo("user", currentUser.id);
        profile = await query.first();
        
        // let profileId = profile.__zone_symbol__value.id
        // 如果没有profile 弹窗 绑定profile
        console.log(data["url"]);
        
        if (profile && profile.id) {
          localStorage.setItem("profile", JSON.stringify(profile));
          // console.log(12345, data["url"], data);
        }
        this.message.success("登录成功")
        // this.router.navigate([data["url"]]);
        this.router.navigate(['masterol-doctor/student-center'])
      })
      .catch(err => {
        this.message.create("error", "错误的用户名或密码");
      });
    // callback(data)
    //  },1000)
  }
  // 查询该学生信息是否存在
  async queryProfile() {
    // 查询到的profile
    let registProfile;
    let queryProfile = new Parse.Query("Profile");
    queryProfile.equalTo("name", this.registName);
    queryProfile.equalTo("idcard", this.registIdcard);
    registProfile = await queryProfile.first();
    console.log(registProfile);
    // 如果有profile 根据profile的user寻找绑定的user
    if (registProfile && registProfile.id) {
      // 该profile是否指向了一个user
      let mobile = registProfile.get("mobile");
      if (!mobile) {
        this.message.info(`该用户缺少手机号`);
      }
      let userObject = registProfile.get("user");
      // 如果指向了一个user 说明该profile绑定了user  告诉客户号码XXXXXXX已经注册了 是否使用该电话号码登录
      if (userObject && userObject.id) {
        console.log(userObject);
        let queryUser = new Parse.Query("User");
        queryUser.equalTo("objectId", userObject.id);
        let user = await queryUser.first();
        console.log(user);
        this.message.info(`该账户已激活，使用手机号密码直接登录`);
      } else {
        // 查找这个用户存不存在，存在直接绑定登录，不存在注册
        let User = new Parse.Query('_User')
        User.equalTo("username", mobile);
        let user = await User.first()
        if (user && user.id) {
          registProfile.set("user", {
            __type: "Pointer",
            className: "_User",
            objectId: user.id
          });
          registProfile.save().then(res => {
            this.message.info(`该账户已激活，使用手机号密码直接登录`);
            return
          })
        } else {
           return Parse.User.signUp(
             registProfile.get("mobile"),
             this.regpassword,
             ""
           ).then(async res => {
             console.log(res);
             res.set("company", {
               __type: "Pointer",
               className: "Company",
               objectId: registProfile.get("company")
             });
             res.save();
             this.username = registProfile.get("mobile");
             this.password = this.regpassword;
             // 绑定profile的user
             registProfile.set("user", {
               __type: "Pointer",
               className: "_User",
               objectId: res.id
             });
             registProfile.save().then(result => {
               console.log(result);
               this.login();
             });
           });
        }
      }
    } else {
      // 如果没有profile 不是学校学生  报错 不让进
      this.createMessage("error");
    }
  }
  createMessage(type: string, text?: string): void {
    this.authServ.logout(null);
    if (text) {
      this.message.create(type, text);
    } else {
      this.message.create(type, `非学校用户，不允许登录`);
    }
  }
  isVisible = false;
  isOkLoading = false;

  
  async profileSet() {
    
  }

  // 登录 用户名（手机号码）验证
  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      let reg = /^1[3456789]\d{9}$/;
      // let reg2 = /^\d{17}(\d|X|x)$/;
      let username = control.value;
      setTimeout(() => {
        if (username == undefined || username.trim() == "") {
          this.userErrorTip = "请输入登录账号";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        if (!username.match(reg)) {
          this.userErrorTip = "请输入正确的登录账号";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        // if(username.length > 11){
        //   if (!username.match(reg2) ) {
        //     this.userErrorTip = "请输入正确的登录账号";
        //     observer.next({ error: true, duplicated: true });
        //     observer.complete();
        //     return;
        //   }
        // }else {
        // }

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
        if (password.length < 6) {
          this.passwordErrorTip = "密码长度不得小于6位";
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
      setTimeout(() => {
        let checkCode = control.value;
        if (checkCode == undefined || checkCode.trim() == "") {
          this.codeErrorTip = "请输入验证码";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        if (checkCode.length < 4) {
          this.codeErrorTip = "验证码长度不得小于4位";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        observer.next(null);
        observer.complete();
      }, 1000);
    });
  confirmPasswordErrorTip: any;
  regpasswordErrorTip: any;
  // 注册 身份证号码验证
  registIdcardAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      let registIdcard = control.value;
      setTimeout(() => {
        if (registIdcard == undefined || registIdcard.trim() == "") {
          this.registIdcardErrorTip = "请输入正确的身份证号码";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        if (/^\d{17}(\d|X|x)$/.test(registIdcard) === false) {
          this.registIdcardErrorTip = "请输入正确的身份证号码";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        observer.next(null);
        observer.complete();
      }, 1000);
    });
  // 注册 姓名验证
  registNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        let registName = control.value;
        if (registName == undefined || registName.trim() == "") {
          this.registNameErrorTip = "请输入姓名";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        this.registName = registName;
        observer.next(null);
        observer.complete();
      }, 1000);
    });
  // 注册密码验证
  regpasswordAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        let regpassword = control.value;
        if (regpassword == undefined || regpassword.trim() == "") {
          this.regpasswordErrorTip = "请输入密码";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        if (regpassword.length < 6) {
          this.regpasswordErrorTip = "密码长度不得小于6位";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        if (regpassword.length > 12) {
          this.regpasswordErrorTip = "密码长度不得大于12位";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        this.regpassword = regpassword
        observer.next(null);
        observer.complete();
      }, 1000);
    });
  // 注册 确认密码验证
  confirmPasswordAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        let confirmPassword = control.value;
        if (confirmPassword == undefined || confirmPassword.trim() == "") {
          this.confirmPasswordErrorTip = "请确认密码";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        if (confirmPassword != this.regpassword) {
          this.confirmPasswordErrorTip = "两次输入密码不一致，请重新输入";
          observer.next({ error: true, duplicated: true });
          observer.complete();
          return;
        }
        this.confirmPassword = confirmPassword;

        observer.next(null);
        observer.complete();
      }, 1000);
    });
  code: any = ''
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(parms => {
      if(parms.get('c')){
        localStorage.removeItem('logo')
        localStorage.setItem('company', parms.get('c'))
      }else {
        localStorage.setItem('company','ddPAWeIInO')

      }
    })
    this.creatCode();

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

