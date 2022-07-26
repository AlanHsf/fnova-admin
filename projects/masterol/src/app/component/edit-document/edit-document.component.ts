import * as Parse from "parse";

import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
// 七牛云上传相关
import { DatePipe } from '@angular/common';
import { NzMessageService } from "ng-zorro-antd/message";



@Component({
  selector: "app-edit-document",
  templateUrl: "./edit-document.component.html",
  styleUrls: ["./edit-document.component.scss"]
})
export class EditDocumentComponent implements OnInit, OnChanges {
  local: any;
  /** 标签组件 <Tag> EditDocument
     @params files <Array> || <string> 必填 绑定文件列表参数
     @params dragdrop <boolean> 选填 是否支持拖拽上传
     @params multi <string> 选填 是否支持多文件上传
     @params type <string> 选填 设置上传附件类型
     @params max_file_size <number> 选填 文件上传的最大体积 单位mb 默认 100 mb
     **/
  @Input("files") _files: any;
  @Input("aid") aid: any;
  @Input("onUsed") onUsed: boolean = false;
  @Input() dragdrop: boolean = false;
  @Input() multi: boolean = false;
  @Input("max_file_size") max_file_size: number = 100;
  @Input() type: string = "attachment"; // "空"仅显示附件列表无上传、image仅图片类型、attachment图片及文档类型
  @Output("filesChange") onFilesChange = new EventEmitter<any>();
  @Output("aidChange") onAidChange = new EventEmitter<any>();
  @Output("filenameChange") filenameChange = new EventEmitter<any>();
  @Input("paperStatus") paperStatus: boolean;
  @Input("avatarType") avatarType: string = "";
  @Input("filename") _filename: any;

  inputType: string = null;
  uptoken: string;
  domain: string;
  qiuniuDomain: string;
  fileName: string;
  get files() {
    if (typeof this._files == "string") {
      this._files = [this._files];
    }
    return this._files || [];
  }
  async queryDomain() {
    let Company = new Parse.Query("Company");
    let company = await Company.get(localStorage.getItem("company"));
    if (company.get("configQiniu") && company.get("configQiniu").domain) {
      console.log(company.get("configQiniu").domain);
      this.qiuniuDomain = company.get("configQiniu").domain;
    } else {
      this.qiuniuDomain = "http://cloud.file.futurestack.cn/";
    }
    console.log(123, "nocompany", company);
  }
  set files(v: any) {
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
    if ((this.inputType = "string")) {
      this.onFilesChange.emit(v[0]);
    } else {
      this.onFilesChange.emit(v);
    }
  }
//   get 
  constructor(private message: NzMessageService) {
    this.local = window.location.pathname;
    this.listenToUploader();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.onUsed) {
      this.initEditorComp();
    }
  }
  ngOnInit() {
    this.queryDomain();
    if (this.avatarType == "more") {
      //是否支持多文件上传
      this.multi = true;
    }
    // console.log('mb',this.max_file_size)
    console.log(this._files);
  }
  ngAfterViewInit() {
    this.initEditorComp();
  }
  initEditorComp() {
    setTimeout(() => {
      if (this.files == undefined) {
        this.files = [];
      }
      // 判断上传文件类型
      // console.log('上传', this.type)
      this.uploaderType();

      if (this.upable()) {
        this.getUptoken().then(data => {
          // console.log(data)
          this.uptoken = data.uptoken;
          this.domain = data.domain;
          this.initUploader(data.uptoken, data.domain);
        });
      }
    }, 500);
  }
  // 七牛云上传
  hashid: string = this.uuid();
  uploader: any; //uploader为实例化上传组件
  //uploader.files 为上传队列 将其赋值 [] 后 即可 再次上传相同文件
  mime_types = [{ title: "", extensions: "jpg,gif,png,bmp,jpeg" }];

  getUptoken() {
    return Parse.Cloud.run("qiniu_uptoken");
  }
  checkFileType(url: string) {
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
  }
  upable() {
    if (this.type == "") {
      console.log(this.type);

      return false;
    } else {
      return true;
    }
  }

  imgShowing: boolean = false;
  imgUrl: string;
  showFile(file) {
    console.log(123);
    this.imgUrl = file;
    this.imgShowing = true;
  }
  closeShowModal() {
    this.imgShowing = false;
  }
  setFiles(file: any) {
    if ((this._files && this._files.length == 0) || this.multi) {
      if (file && file.url) {
        // this.files = this._files.concat(file.url)
        if (file.url.indexOf("undefined") >= 0) {
          console.log(file.url);

          this.files =
            (this.qiuniuDomain
              ? this.qiuniuDomain
              : "http://cloud.file.futurestack.cn/") +
            file.url.replace("undefined/", "");
          console.log(this.files);
        }
        this.dragdrop = false;
      }
    }

    return;
  }
  deleteFile(id) {
    let i: Number;
    this.files.find((el, index) => {
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
    console.log(this.files);
    this.initEditorComp();
  }
  listenToUploader() {
    document.addEventListener(
      "uploader" + this.hashid + ".onprogress",
      (event: any) => {
        this.setFiles(event.detail.file);
        this.setFiles(event.detail.file.percent);
      },
      false
    );
    document.addEventListener(
      "uploader" + this.hashid + ".fileuploaded",
      (event: any) => {
        this.setFiles(event.detail.file);
      },
      false
    );
  }
  times: any = 0;
  uploaderType() {
    this.times += 1;
    // if(this.times > 3){
    //   this.message.info('超过三次，过于频繁，请稍后再试')
    //   return
    // }else {
    switch (this.type) {
      case "image":
        this.mime_types = [
          { title: "Image files", extensions: "jpg,gif,png" } // 限定jpg,gif,png后缀上传
        ];
        break;
      case "attachment":
        this.mime_types = [
          // { title: "Image files", extensions: "jpg,gif,png" }, // 限定jpg,gif,png后缀上传
          {
            title: "Attachment files",
            extensions: "pdf,doc,docx,xls,md,txt,json"
          }, // 限定pdf,doc,docx,xls,md,txt后缀上传
          // { title: "Zip files", extensions: "zip,7z,tar.gz,rar" } // 限定zip,7z,tar.gz,rar后缀上传
        ];
        break;
      case "video":
        this.mime_types = [
          // { title: "Video files", extensions: "flv,mp4,avi" },
          {
            title: "Video files",
            extensions: "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4"
          } // 限定flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4后缀格式上传
        ];
        break;
      default:
        break;
    }
    // }
  }
  getBelongId() {
    // 获取公司ID
    let id = window.localStorage.getItem("company");
    return id;
  }

  initUploader(uptoken, domain) {
    console.log(123, this._files);
    let that = this;
    let dirID = this.getBelongId();
    let hashid = this.hashid;
    //引入Plupload 、qiniu.js后

    console.log(111)

    this.uploader = new plupload.Uploader({
      runtimes: "html5,html4", //上传模式,依次退化
      browse_button: "pickfiles_button_" + this.hashid, //上传选择的点选按钮，**必需**
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
      container: "dragdrop_container_" + this.hashid, //上传区域DOM ID，默认是browser_button的父元素，
      filters: {
        max_file_size: this.max_file_size + "mb", //最大文件体积限制
        prevent_duplicates: true,
        mime_types: this.mime_types
      },
      max_retries: 3, //上传失败最大重试次数
      // dragdrop: this.dragdrop,                   //开启可拖曳上传
      // dragdrop: true,
      multi_selection: this.multi,
      drop_element: "dragdrop_container_" + this.hashid, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
      chunk_size: "4mb", //分块上传时，每片的体积
      // auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
      init: {
        BeforeUpload: function(up, file) {
          if (that.avatarType == "more") {
            //支持多张上传时, 支持分次上传.
            that.files.push(file);
          } else {
            that.files = [];
          }
          // 每个文件上传前,处理相关的事情

          // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
          // 该配置必须要在 unique_names: false , save_key: false 时才生效

          let today = new Date();
          let dp = new DatePipe("en");
          let key =
            "" +
            dirID +
            "/" +
            dp.transform(today, "yMMdd") +
            "/" +
            String(file.id).substr(20, 6) +
            /\.[^\.]+/.exec(file.name);
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
        UploadProgress: function(up, file) {
          // 每个文件上传时,处理相关的事情
          let ev = new CustomEvent("uploader" + hashid + ".onprogress", {
            detail: { up: up, file: file }
          });
          document.dispatchEvent(ev);
        },
        FileUploaded: function(up, file, info) {
          console.log("成功", up, file, info);
          console.log(file.name);
          that.fileName = file.name;
          // 每个文件上传成功后,处理相关的事情
          // 其中 info 是文件上传成功后，服务端返回的json，形式如
          // {
          //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
          //    "key": "gogopher.jpg"
          //  }

          // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

          let domain = up.getOption("domain");
          let res = JSON.parse(info.response);
          let sourceLink = domain + "/" + res.key;
          file.url = sourceLink;
          let ev = new CustomEvent("uploader" + hashid + ".fileuploaded", {
            detail: { up: up, file: file, info: info }
          });
          document.dispatchEvent(ev);
          console.log(that.files, sourceLink);
          that.saveAttachment(file, that.files)
        },
        // 'Error': function (up, err, errTip) {
        //   console.log('失败', up, err, errTip)
        //   //上传出错时,处理相关的事情
        // },
        UploadComplete: function() {
          //队列文件处理完毕后,处理相关的事情
          if (that.avatarType != "more") {
            that.uploader.files = [];
          }
        }
      }
    });



    //domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取

    // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
   
    this.uploader.init();

    this.uploader.bind("FilesAdded", function(up, files) {
      // plupload.each(files, function (file) {
      //   // 文件添加进队列后,处理相关的事情
      // });
      that.uploader.start();
    });
    this.uploader.bind("FilesAdded", function(up, files) {});
    // this.uploader.refresh()
  }

  private uuid() {
    // 确保多个plupload控件不冲突

    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    let uuid = s.join("");
    return uuid;
  }


  saveAttachment(file, url) { 
      let company = localStorage.getItem('company')
      let Attachment = Parse.Object.extend('Attachment')
      console.log(file ,this.files,url)
      let attachment = new Attachment()
      attachment.set('size', file.size )
      attachment.set('name', file.name )
      attachment.set('mime', file.type )
      attachment.set('url', url[0] )
      attachment.set('company', {
            __type: 'Pointer',
            className: 'Company',
            objectId: company
        })
      attachment.save().then(res=> {
        console.log(res)
        this.aid = res.id
        this.onAidChange.emit(this.aid)
      })
  }
}
