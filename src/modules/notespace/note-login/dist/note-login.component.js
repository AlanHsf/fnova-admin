"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.NoteLoginComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var rxjs_1 = require("rxjs");
var Parse = require("parse");
var NoteLoginComponent = /** @class */ (function () {
    function NoteLoginComponent(authServ, fb, message, router) {
        var _this = this;
        this.authServ = authServ;
        this.fb = fb;
        this.message = message;
        this.router = router;
        this.nums = ['C', '6', 'Z', 't'];
        this.str = '';
        this.redirectUrl = localStorage.getItem("redirectUrl");
        this.isVisible = false;
        this.isOkLoading = false;
        // 登录 用户名（手机号码）验证
        this.userNameAsyncValidator = function (control) {
            return new rxjs_1.Observable(function (observer) {
                var reg = /^1[345789]\d{9}$/;
                console.log(control.value);
                //判断是否是笔记注册用户
                var username = control.value;
                setTimeout(function () {
                    if (username == undefined || username.trim() == "") {
                        _this.userErrorTip = "请输入用户名";
                        observer.next({ error: true, duplicated: true });
                        observer.complete();
                        return;
                    }
                    observer.next(null);
                    observer.complete();
                }, 1000);
            });
        };
        // 登录 密码验证
        this.passwordAsyncValidator = function (control) {
            return new rxjs_1.Observable(function (observer) {
                console.log(control.value);
                setTimeout(function () {
                    var password = control.value;
                    if (password == undefined || password.trim() == "") {
                        _this.passwordErrorTip = "请输入密码";
                        observer.next({ error: true, duplicated: true });
                        observer.complete();
                        return;
                    }
                    if (password.length < 6 || password.length > 18) {
                        _this.passwordErrorTip = "密码长度不得小于6位或者大于18位数";
                        observer.next({ error: true, duplicated: true });
                        observer.complete();
                        return;
                    }
                    observer.next(null);
                    observer.complete();
                }, 1000);
            });
        };
        this.codeAsyncValidator = function (control) {
            return new rxjs_1.Observable(function (observer) {
                console.log(control.value);
                setTimeout(function () {
                    var checkCode = control.value;
                    if (checkCode == undefined || checkCode.trim() == "") {
                        _this.codeErrorTip = "请输入验证码";
                        observer.next({ error: true, duplicated: true });
                        observer.complete();
                        return;
                    }
                    if (checkCode.length != 4) {
                        _this.codeErrorTip = "验证码长度不对";
                        observer.next({ error: true, duplicated: true });
                        observer.complete();
                        return;
                    }
                    observer.next(null);
                    observer.complete();
                }, 1000);
            });
        };
        // 注册 密码验证
        this.registIdcardAsyncValidator = function (control) {
            return new rxjs_1.Observable(function (observer) {
                var registIdcard = control.value;
                setTimeout(function () {
                    if (registIdcard == undefined || registIdcard.trim() == "") {
                        _this.registIdcardErrorTip = "请输入密码";
                        observer.next({ error: true, duplicated: true });
                        observer.complete();
                        return;
                    }
                    if (registIdcard.length < 8 || registIdcard.length > 18) {
                        _this.registIdcardErrorTip = "密码长度为8至18位";
                        observer.next({ error: true, duplicated: true });
                        observer.complete();
                        return;
                    }
                    observer.next(null);
                    observer.complete();
                }, 1000);
            });
        };
        // 确认密码
        this.affirmIdcardAsyncValidator = function (control) {
            return new rxjs_1.Observable(function (observer) {
                setTimeout(function () {
                    var affirmIdcard = control.value;
                    if (affirmIdcard == undefined || affirmIdcard.trim() == "") {
                        _this.affirmIdcardErrorTip = "密码不一致";
                        observer.next({ error: true, duplicated: true });
                        observer.complete();
                        return;
                    }
                    if (affirmIdcard != _this.registIdcard) {
                        _this.affirmIdcardErrorTip = "密码不一致";
                        observer.next({ error: true, duplicated: true });
                        observer.complete();
                        console.log(_this.registIdcard);
                        console.log(affirmIdcard);
                        return;
                    }
                    observer.next(null);
                    observer.complete();
                }, 1000);
            });
        };
        //邀请码
        this.invitatioAsyncValidator = function (control) {
            return new rxjs_1.Observable(function (observer) {
                var invitatio = control.value;
                if (invitatio == undefined || invitatio.trim() == "") {
                    _this.affirmIdcardErrorTip = "邀请码不能为空";
                    observer.next({ error: true, duplicated: true });
                    observer.complete();
                    return;
                }
                if (invitatio != "feima") {
                    _this.affirmIdcardErrorTip = "邀请码错误";
                    observer.next({ error: true, duplicated: true });
                    observer.complete();
                    return;
                }
                observer.next(null);
                observer.complete();
            });
        };
        // 注册 账号验证
        this.registNameAsyncValidator = function (control) {
            return new rxjs_1.Observable(function (observer) {
                console.log(control.value);
                setTimeout(function () {
                    var registName = control.value;
                    if (registName == undefined || registName.trim() == "") {
                        _this.registNameErrorTip = "请输入正确的账号名";
                        observer.next({ error: true, duplicated: true });
                        observer.complete();
                        return;
                    }
                    observer.next(null);
                    observer.complete();
                }, 1000);
            });
        };
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
        this.code = '';
        this.validateForm = this.fb.group({
            // 加入验证的表单项 ： 初始值、 是否验证 调用的验证方法
            username: ["", [forms_1.Validators.required], [this.userNameAsyncValidator]],
            password: ["", [forms_1.Validators.required], [this.passwordAsyncValidator]]
        });
        this.registForm = this.fb.group({
            // 加入验证的表单项 ： 初始值、 是否验证 调用的验证方法
            registName: ["", [forms_1.Validators.required], [this.registNameAsyncValidator]],
            registIdcard: [
                "",
                [forms_1.Validators.required],
                [this.registIdcardAsyncValidator]
            ],
            // 确认密码
            affirmIdcard: [
                "", [forms_1.Validators.required], [this.affirmIdcardAsyncValidator]
            ],
            invitatio: [
                "", [forms_1.Validators.required], [this.invitatioAsyncValidator]
            ]
        });
        // this.profileForm = this.fb.group({// 加入验证的表单项 ： 初始值、 是否验证 调用的验证方法
        //   name: ['', [Validators.required], [this.nameAsyncValidator]],
        //   idcard: ['', [Validators.required], [this.idcardAsyncValidator]],
        // });
    }
    // 绘制验证码
    NoteLoginComponent.prototype.drawCode = function (str) {
        // this.resetCode()
        this.canvas = document.getElementById("verifyCanvas"); //获取HTML端画布
        var context = this.canvas.getContext("2d"); //获取画布2D上下文
        context.fillStyle = "white"; //画布填充色
        context.fillRect(0, 0, this.canvas.width, this.canvas.height); //清空画布
        context.fillStyle = "cornflowerblue"; //设置字体颜色
        context.font = "25px Arial"; //设置字体
        var rand = new Array();
        var x = new Array();
        var y = new Array();
        for (var i = 0; i < 4; i++) {
            rand.push(rand[i]);
            rand[i] = this.nums[i];
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
    };
    // 随机线
    NoteLoginComponent.prototype.drawline = function (canvas, context) {
        context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
        context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
        context.lineWidth = 0.5; //随机线宽
        context.strokeStyle = 'rgba(50,50,50,0.3)'; //随机线描边属性
        context.stroke(); //描边，即起点描到终点
    };
    // 随机点(所谓画点其实就是画1px像素的线，方法不再赘述)
    NoteLoginComponent.prototype.drawDot = function (canvas, context) {
        var px = Math.floor(Math.random() * canvas.width);
        var py = Math.floor(Math.random() * canvas.height);
        context.moveTo(px, py);
        context.lineTo(px + 1, py + 1);
        context.lineWidth = 0.2;
        context.stroke();
    };
    // 绘制图片
    NoteLoginComponent.prototype.convertCanvasToImage = function (canvas) {
        document.getElementById("verifyCanvas").style.display = "none";
        this.image = document.getElementById("code_img");
        this.image.src = canvas.toDataURL("image/png");
        return this.image;
    };
    // 点击登录按钮
    NoteLoginComponent.prototype.submitForm = function (value) {
        // localStorage.removeItem("user")
        for (var key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
            this.validateForm.controls[key].updateValueAndValidity();
        }
        this.username = value.username;
        this.password = value.password;
        var checkCode = value.checkCode;
        // if (checkCode != this.code) {
        //   this.message.create("error", "密码或验证码错误");
        // } else {
        this.login();
        // }
        // this.showModal()
    };
    // 点击注册按钮
    NoteLoginComponent.prototype.registSubmitForm = function (value) {
        // localStorage.removeItem("user")
        for (var key in this.registForm.controls) {
            this.registForm.controls[key].markAsDirty();
            this.registForm.controls[key].updateValueAndValidity();
        }
        this.registName = value.registName;
        this.registIdcard = value.registIdcard;
        this.queryProfile();
    };
    NoteLoginComponent.prototype.login = function () {
        var _this = this;
        var profile;
        var currentUser;
        // 调用auth.service中的login方法
        //  setTimeout(function(){
        this.authServ
            .login(this.username, this.password)
            .then(function (data) { return __awaiter(_this, void 0, void 0, function () {
            var allUrl, url, datas;
            return __generator(this, function (_a) {
                currentUser = Parse.User.current();
                if (currentUser && currentUser.url) {
                    allUrl = currentUser.url;
                }
                if (allUrl && allUrl.indexOf(';') > 0) {
                    datas = {};
                    console.log(123, allUrl);
                    url = allUrl.split(';');
                    console.log(url);
                    url.forEach(function (value, index) {
                        if (index > 0) {
                            console.log(1233, value);
                            var p = value.split("=");
                            var key = p[0];
                            datas[key] = p[1];
                            console.log(datas);
                        }
                    });
                }
                console.log(currentUser);
                if (datas) {
                    this.router.navigate([url[0], datas]);
                }
                else {
                    this.router.navigate([allUrl]);
                }
                return [2 /*return*/];
            });
        }); })["catch"](function (err) {
            _this.message.create("error", "错误的用户名或密码");
        });
        // callback(data)
        //  },1000)
    };
    NoteLoginComponent.prototype.queryProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryUser, findUser, newUser, Users;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryUser = new Parse.Query("User");
                        queryUser.equalTo("username", this.registName);
                        console.log(this.registName);
                        return [4 /*yield*/, queryUser.first()];
                    case 1:
                        findUser = _a.sent();
                        console.log(findUser);
                        if (findUser && findUser.id) {
                            this.message.error("\u8BE5\u7528\u6237\u540D\u5DF2\u88AB\u6CE8\u518C");
                        }
                        else {
                            newUser = Parse.Object.extend("_User");
                            Users = new newUser();
                            Users.set("username", this.registName);
                            Users.set("password", this.registIdcard);
                            Users.set("company", {
                                __type: "Pointer",
                                className: "Company",
                                objectId: "1AiWpTEDH9"
                            });
                            Users.save().then(function (res) {
                                if (res && res.id) {
                                    _this.message.success("\u6CE8\u518C\u6210\u529F");
                                    console.log(_this.registName + "注册成功");
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // 注册
    NoteLoginComponent.prototype.regist = function () { };
    NoteLoginComponent.prototype.createMessage = function (type) {
        this.authServ.logout();
        this.message.create(type, "\u975E\u5B66\u6821\u7528\u6237\uFF0C\u4E0D\u5141\u8BB8\u767B\u5F55");
    };
    NoteLoginComponent.prototype.ngOnInit = function () {
        this.creatCode();
    };
    NoteLoginComponent.prototype.creatCode = function () {
        this.code = '';
        var codeLength = 4; //验证码的长度
        var codeChars = [
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
        for (var i = 0; i < codeLength; i++) {
            var charNum = Math.floor(Math.random() * 52);
            this.code += codeChars[charNum];
        }
    };
    NoteLoginComponent = __decorate([
        core_1.Component({
            selector: 'app-note-login',
            templateUrl: './note-login.component.html',
            styleUrls: ['./note-login.component.scss']
        })
    ], NoteLoginComponent);
    return NoteLoginComponent;
}());
exports.NoteLoginComponent = NoteLoginComponent;
