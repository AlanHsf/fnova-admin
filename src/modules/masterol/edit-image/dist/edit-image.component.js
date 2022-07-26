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
exports.EditImageComponent = void 0;
var Parse = require("parse");
var core_1 = require("@angular/core");
// 七牛云上传相关
var common_1 = require("@angular/common");
var EditImageComponent = /** @class */ (function () {
    function EditImageComponent() {
        this.dragdrop = false;
        this.multi = false;
        this.max_file_size = 100;
        this.type = "attachment"; // "空"仅显示附件列表无上传、image仅图片类型、attachment文档类型
        this.onFilesChange = new core_1.EventEmitter();
        this.avatarType = '';
        this.inputType = null;
        // 七牛云上传
        this.hashid = this.uuid();
        //uploader.files 为上传队列 将其赋值 [] 后 即可 再次上传相同文件
        this.mime_types = [{ title: "", extensions: "jpg,gif,png,bmp,jpeg" }];
        this.imgShowing = false;
        this.local = window.location.pathname;
        this.listenToUploader();
    }
    Object.defineProperty(EditImageComponent.prototype, "files", {
        get: function () {
            if (typeof this._files == "string") {
                this._files = [this._files];
            }
            return this._files || [];
        },
        set: function (v) {
            // 判断初始值，记录传入值类型
            if (!this.inputType) {
                this.inputType = typeof v;
            }
            // 判断初始值，若为字符串，则转化为数组
            if (typeof v == "string") {
                v = [v];
            }
            this._files = v;
            // 根据传入类型，返回不同类型的值
            if (this.inputType = "string") {
                this.onFilesChange.emit(v[0]);
            }
            else {
                this.onFilesChange.emit(v);
            }
        },
        enumerable: false,
        configurable: true
    });
    EditImageComponent.prototype.queryDomain = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Company, company;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Company = new Parse.Query('Company');
                        return [4 /*yield*/, Company.get(localStorage.getItem('company'))];
                    case 1:
                        company = _a.sent();
                        if (company.get("configQiniu") && company.get("configQiniu").domain) {
                            console.log(99999);
                            console.log(company.get("configQiniu").domain);
                            this.qiuniuDomain = company.get("configQiniu").domain;
                        }
                        else {
                            this.qiuniuDomain = 'http://cloud.file.futurestack.cn/';
                        }
                        console.log(123, "nocompany", company);
                        return [2 /*return*/];
                }
            });
        });
    };
    EditImageComponent.prototype.ngOnInit = function () {
        this.queryDomain();
        if (this.avatarType == 'more') { //是否支持多文件上传
            this.multi = true;
        }
        // console.log('mb',this.max_file_size)
        console.log(this._files);
    };
    EditImageComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.files == undefined) {
            this.files = [];
        }
        // 判断上传文件类型
        // console.log('上传', this.type)
        this.uploaderType();
        if (this.upable()) {
            this.getUptoken().then(function (data) {
                // console.log(data)
                _this.uptoken = data.uptoken;
                _this.domain = data.domain;
                _this.initUploader(data.uptoken, data.domain);
            });
        }
    };
    EditImageComponent.prototype.getUptoken = function () {
        return Parse.Cloud.run('qiniu_uptoken');
    };
    EditImageComponent.prototype.checkFileType = function (url) {
        if (url && typeof url == "string") {
            if (url.endsWith("png")) {
                return "image";
            }
            if (url.endsWith("jpg")) {
                return "image";
            }
            if (url.endsWith("gif")) {
                return "image";
            }
        }
        return "file";
    };
    EditImageComponent.prototype.upable = function () {
        if (this.type == "") {
            return false;
        }
        else {
            return true;
        }
    };
    EditImageComponent.prototype.showFile = function (file) {
        console.log(123);
        this.imgUrl = file;
        this.imgShowing = true;
    };
    EditImageComponent.prototype.closeShowModal = function () {
        this.imgShowing = false;
    };
    EditImageComponent.prototype.setFiles = function (file) {
        console.log(1213);
        if (this._files && this._files.length == 0 || this.multi) {
            if (file && file.url) {
                // this.files = this._files.concat(file.url)
                if (file.url.indexOf('undefined') >= 0) {
                    console.log(file.url);
                    this.files = (this.qiuniuDomain
                        ? this.qiuniuDomain
                        : "http://cloud.file.futurestack.cn/") +
                        file.url.replace("undefined/", "");
                    console.log(this.files);
                }
                this.dragdrop = false;
            }
        }
        return;
    };
    EditImageComponent.prototype.deleteFile = function (id) {
        var i;
        this.files.find(function (el, index) {
            if (el.id == id) {
                i = index;
                return el;
            }
        });
        if (i) {
            this.files.splice(i, 1);
        }
        if (i == 0) {
            this.files = [];
        }
    };
    EditImageComponent.prototype.listenToUploader = function () {
        var _this = this;
        console.log(123);
        document.addEventListener("uploader" + this.hashid + ".onprogress", function (event) {
            console.log(123);
            _this.setFiles(event.detail.file);
            _this.setFiles(event.detail.file.percent);
        }, false);
        document.addEventListener("uploader" + this.hashid + ".fileuploaded", function (event) {
            _this.setFiles(event.detail.file);
        }, false);
    };
    EditImageComponent.prototype.uploaderType = function () {
        console.log(1213);
        switch (this.type) {
            case "image":
                this.mime_types = [
                    { title: "Image files", extensions: "jpg,gif,png" },
                ];
                break;
            case "attachment":
                this.mime_types = [
                    // { title: "Image files", extensions: "jpg,gif,png" }, // 限定jpg,gif,png后缀上传
                    { title: "Attachment files", extensions: "pdf,doc,docx,xls,md,txt,json" },
                ];
                break;
            case "video":
                this.mime_types = [
                    // { title: "Video files", extensions: "flv,mp4,avi" },
                    { title: "Video files", extensions: "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4" },
                ];
                break;
            default:
                break;
        }
    };
    EditImageComponent.prototype.getBelongId = function () {
        // 获取公司ID
        var id = window.localStorage.getItem("company");
        return id;
    };
    EditImageComponent.prototype.initUploader = function (uptoken, domain) {
        console.log(123, this._files);
        var that = this;
        var dirID = this.getBelongId();
        var hashid = this.hashid;
        //引入Plupload 、qiniu.js后
        this.uploader = new plupload.Uploader({
            runtimes: 'html5,html4',
            browse_button: 'pickfiles_button_' + this.hashid,
            // uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            // uptoken: uptoken,
            url: "http://upload-z2.qiniup.com/",
            multipart_params: {
                // token从服务端获取，没有token无法上传
                token: uptoken
            },
            //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
            // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
            // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
            // domain: domain,   //bucket 域名，下载资源时用到，**必需**
            // get_new_uptoken: true,  //设置上传文件的时候是否每次都重新获取新的token
            container: 'dragdrop_container_' + this.hashid,
            filters: {
                max_file_size: this.max_file_size + 'mb',
                prevent_duplicates: true,
                mime_types: this.mime_types
            },
            max_retries: 3,
            // dragdrop: this.dragdrop,                   //开启可拖曳上传
            // dragdrop: true,
            multi_selection: this.multi,
            drop_element: 'dragdrop_container_' + this.hashid,
            chunk_size: '4mb',
            // auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            init: {
                'BeforeUpload': function (up, file) {
                    if (that.avatarType == 'more') { //支持多张上传时, 支持分次上传. 
                        that.files.push(file);
                    }
                    else {
                        that.files = [];
                    }
                    // 每个文件上传前,处理相关的事情
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                    var today = new Date();
                    var dp = new common_1.DatePipe("en");
                    var key = "" + dirID + "/" + dp.transform(today, "yMMdd") + "/" + String(file.id).substr(20, 6) + /\.[^\.]+/.exec(file.name);
                    // do something with key here
                    // return key
                    that.uploader.setOption({
                        // multipart: true,
                        multipart_params: {
                            token: uptoken,
                            key: key
                        }
                    });
                },
                'UploadProgress': function (up, file) {
                    // 每个文件上传时,处理相关的事情
                    var ev = new CustomEvent("uploader" + hashid + ".onprogress", { detail: { "up": up, "file": file } });
                    document.dispatchEvent(ev);
                },
                'FileUploaded': function (up, file, info) {
                    console.log('成功', up, file, info);
                    // 每个文件上传成功后,处理相关的事情
                    // 其中 info 是文件上传成功后，服务端返回的json，形式如
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                    // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                    var domain = up.getOption('domain');
                    var res = JSON.parse(info.response);
                    var sourceLink = domain + "/" + res.key;
                    file.url = sourceLink;
                    var ev = new CustomEvent("uploader" + hashid + ".fileuploaded", { detail: { "up": up, "file": file, "info": info } });
                    document.dispatchEvent(ev);
                    console.log(that.files);
                },
                // 'Error': function (up, err, errTip) {
                //   console.log('失败', up, err, errTip)
                //   //上传出错时,处理相关的事情
                // },
                'UploadComplete': function () {
                    //队列文件处理完毕后,处理相关的事情
                    if (that.avatarType != 'more') {
                        that.uploader.files = [];
                    }
                }
            }
        });
        // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
        // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
        this.uploader.init();
        this.uploader.bind('FilesAdded', function (up, files) {
            // plupload.each(files, function (file) {
            //   // 文件添加进队列后,处理相关的事情
            // });
            console.log(123);
            that.uploader.start();
        });
        this.uploader.bind('FilesAdded', function (up, files) {
        });
        // this.uploader.refresh()
    };
    EditImageComponent.prototype.uuid = function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    };
    __decorate([
        core_1.Input('files')
    ], EditImageComponent.prototype, "_files");
    __decorate([
        core_1.Input()
    ], EditImageComponent.prototype, "dragdrop");
    __decorate([
        core_1.Input()
    ], EditImageComponent.prototype, "multi");
    __decorate([
        core_1.Input('max_file_size')
    ], EditImageComponent.prototype, "max_file_size");
    __decorate([
        core_1.Input()
    ], EditImageComponent.prototype, "type");
    __decorate([
        core_1.Output('filesChange')
    ], EditImageComponent.prototype, "onFilesChange");
    __decorate([
        core_1.Input('avatarType')
    ], EditImageComponent.prototype, "avatarType");
    EditImageComponent = __decorate([
        core_1.Component({
            selector: 'app-edit-image',
            templateUrl: './edit-image.component.html',
            styleUrls: ['./edit-image.component.scss']
        })
    ], EditImageComponent);
    return EditImageComponent;
}());
exports.EditImageComponent = EditImageComponent;
