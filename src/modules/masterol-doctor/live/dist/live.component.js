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
exports.LiveComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var Parse = require("parse");
var LiveComponent = /** @class */ (function () {
    function LiveComponent(fb, auth, message, route) {
        this.fb = fb;
        this.auth = auth;
        this.message = message;
        this.route = route;
        this.company = "pPZbxElQQo";
        this.isVisible = false;
    }
    LiveComponent.prototype.ngOnInit = function () {
        localStorage.setItem('hiddenMenu', 'true');
        this.validateForm = this.fb.group({
            userName: [null, [forms_1.Validators.required]],
            password: [null, [forms_1.Validators.required]]
        });
        this.getRooms();
    };
    LiveComponent.prototype.getRooms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Rooms, rooms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Rooms = new Parse.Query('Room');
                        Rooms.equalTo('company', this.company);
                        return [4 /*yield*/, Rooms.find()];
                    case 1:
                        rooms = _a.sent();
                        if (rooms && rooms.length > 0) {
                            this.rooms = rooms;
                            console.log(this.rooms);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LiveComponent.prototype.goLive = function (activeRoom) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isAuth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = Parse.User.current();
                        if (!user) {
                            this.isVisible = true;
                            return [2 /*return*/];
                        }
                        if (!activeRoom.get('isLive')) {
                            alert('主播正在赶来的路上');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.authority(activeRoom.id)];
                    case 1:
                        isAuth = _a.sent();
                        if (!isAuth) {
                            alert('您暂无权限观看此直播');
                            return [2 /*return*/];
                        }
                        else {
                            this.route.navigate(['./masterol-doctor/live-room', { rid: activeRoom.id }]);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LiveComponent.prototype.handleCancel = function () {
        this.isVisible = false;
    };
    LiveComponent.prototype.submitForm = function () {
        console.log(this.validateForm.controls);
        var username = this.validateForm.controls.userName.value;
        var password = this.validateForm.controls.password.value;
        console.log(username, password);
        this.login(username, password);
    };
    LiveComponent.prototype.login = function (username, password) {
        var _this = this;
        var currentUser;
        // 调用auth.service中的login方法
        //  setTimeout(function(){
        this.auth
            .login(username, password)
            .then(function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                currentUser = Parse.User.current();
                console.log(currentUser);
                this.message.create("success", "登录成功");
                this.isVisible = false;
                return [2 /*return*/];
            });
        }); })["catch"](function (err) {
            _this.message.create("error", "错误的用户名或密码");
        });
    };
    LiveComponent.prototype.ngAfterViewInit = function () {
        // 获取过程性考核试题
        // this.video = document.getElementById(this.videoPid);
    };
    // 权限
    LiveComponent.prototype.authority = function (rid) {
        return __awaiter(this, void 0, void 0, function () {
            var User, roomStudents, student;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        User = Parse.User.current();
                        roomStudents = new Parse.Query('RoomStudents');
                        roomStudents.equalTo('user', User.id);
                        roomStudents.equalTo('room', rid);
                        return [4 /*yield*/, roomStudents.first()];
                    case 1:
                        student = _a.sent();
                        console.log(student);
                        if (student && student.id) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LiveComponent = __decorate([
        core_1.Component({
            selector: 'app-live',
            templateUrl: './live.component.html',
            styleUrls: ['./live.component.scss']
        })
    ], LiveComponent);
    return LiveComponent;
}());
exports.LiveComponent = LiveComponent;
