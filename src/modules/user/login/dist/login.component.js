"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(message, appServ, router) {
        this.message = message;
        this.appServ = appServ;
        this.router = router;
        this.username = '';
        this.password = '';
        // localStorage.clear()
        this.appServ.hangout();
    }
    LoginComponent.prototype.login = function () {
        var _this = this;
        var c = this.code.toLowerCase();
        if (!this.vCode) {
            this.message.create('error', "请输入的验证码");
            return;
        }
        var vc = this.vCode.toLowerCase();
        if (vc != c) {
            this.message.create('error', "请输入正确验证码");
            return;
        }
        this.username = this.username.trim();
        this.password = this.password.trim();
        // localStorage.clear() 
        this.appServ.hangout();
        this.appServ.login(this.username, this.password).then(function (data) {
        })["catch"](function (err) {
            _this.message.create('error', err.message);
        });
    };
    LoginComponent.prototype.ngOnInit = function () {
        localStorage.removeItem('hiddenMenu');
        this.creatCode();
    };
    LoginComponent.prototype.enter = function (e) {
        if (e.keyCode == 13) {
            this.login();
        }
    };
    LoginComponent.prototype.creatCode = function () {
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
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
