import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import * as Parse from "parse";
@Component({
  selector: "app-edit-file",
  templateUrl: "./edit-file.component.html",
  styleUrls: ["./edit-file.component.scss"],
})
export class EditFileComponent implements OnInit, OnChanges {
  /** 标签组件 <Tag> EditDocument
   @params files <Array> || <string> 必填 绑定文件列表参数
   @params dragdrop <boolean> 选填 是否支持拖拽上传
   @params multi <string> 选填 是否支持多文件上传
   @params type <string> 选填 设置上传附件类型
   @params max_file_size <number> 选填 文件上传的最大体积 单位mb 默认 100 mb
   **/
  @Input("files") _files: any;
  @Input("onUsed") onUsed: boolean = false;
  @Output("filesChange") onFilesChange = new EventEmitter<any>();
  // 实例化上传组件
  uploader: any;
  // 从服务端获取的token
  uptoken: any;
  //文件最大体积限制
  max_file_size: any;
  // 文件类型
  mime_types = [{ title: "", extensions: "jpg,gif,png,bmp,jpeg" }];
  // 是否支持上传多个文件
  multi: any = true;
  inputType: string = null;
  get files() {
    if (typeof this._files == "string") {
      this._files = [this._files];
    }
    return this._files || [];
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
  constructor() {}

  ngOnInit(): void {
    console.log(this._files);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.onUsed) {
      this.initEditorComp();
    }
  }
  domain: any;
  initEditorComp() {
    if (this.files == undefined) {
      this.files = [];
    }
    // 先获取到token再初始化上传组件
    this.getUptoken().then((data) => {
      this.uptoken = data.uptoken;
      this.domain = data.domain;
      // this.initUploader(data.uptoken, data.domain)
    });
  }

  //
  getUptoken() {
    return Parse.Cloud.run("qiniu_uptoken"); // 调用自定义qiniu_uptoken函数
  }
  // 七牛云上传
  hashid: string = this.uuid();
  initUploader(uptoken, domain) {
    let that = this;
    this.uploader = new plupload.Uploader({
      runtimes: "html5,html4", //上传模式,依次退化
      browse_button: "pickfiles_button_" + this.hashid, //触发文件选择对话框的按钮，为那个元素id
      url: '"http://upload-z2.qiniup.com/', //服务器端的上传页面地址
      // uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
      //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
      multipart_params: {
        // 上传时的附加参数，以键/值对的形式传入
        // token从服务端获取，没有token无法上传
        token: uptoken,
      },
      container: "dragdrop_container_" + this.hashid, //上传区域DOM ID，默认是browser_button的父元素，
      filters: {
        // 限制条件
        max_file_size: this.max_file_size + "mb", //文件最大体积限制
        prevent_duplicates: true, //不允许选取重复文件
        mime_types: this.mime_types, // 允许上传的文件类型
      },
      max_retries: 3, //上传失败最大重试次数
      multi_selection: this.multi, // 是否支持上传多个文件
      drop_element: "dragdrop_container_" + this.hashid, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
      chunk_size: "4mb", //分块上传时，每片的体积
      // // auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
      // init: {
      //   'BeforeUpload': function (up, file) {// 当队列中的某一个文件正要开始上传前触发 uploader为当前的plupload实例对象，file为触发此事件的文件对象
      //     if (that.multi) {  //支持多张上传时, 支持分次上传.
      //       that.files.push(file)
      //     } else {
      //       that.files = []
      //     }
      //     // 每个文件上传前,处理相关的事情

      //     // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
      //     // 该配置必须要在 unique_names: false , save_key: false 时才生效

      //     let today = new Date()
      //     let dp = new DatePipe("en")
      //     let key = "" + dirID + "/" + dp.transform(today, "yMMdd") + "/" + String(file.id).substr(20, 6) + /\.[^\.]+/.exec(file.name);
      //     // do something with key here
      //     // return key
      //     that.uploader.setOption({
      //       // multipart: true,
      //       multipart_params: {
      //         token: uptoken,
      //         key: key
      //       }
      //     });
      //   },
      //   'UploadProgress': function (up, file) {
      //     // 每个文件上传时,处理相关的事情
      //     let ev = new CustomEvent("uploader" + hashid + ".onprogress", { detail: { "up": up, "file": file } })
      //     document.dispatchEvent(ev)
      //   },
      //   'FileUploaded': function (up, file, info) {

      //     console.log('成功', up, file, info);
      //     that.fileName = file.name

      //     // 每个文件上传成功后,处理相关的事情
      //     // 其中 info 是文件上传成功后，服务端返回的json，形式如
      //     // {
      //     //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
      //     //    "key": "gogopher.jpg"
      //     //  }

      //     // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

      //     let domain = up.getOption('domain');
      //     let res = JSON.parse(info.response);
      //     let sourceLink = domain + "/" + res.key;
      //     file.url = sourceLink;
      //     let ev = new CustomEvent("uploader" + hashid + ".fileuploaded", { detail: { "up": up, "file": file, "info": info } });
      //     document.dispatchEvent(ev);
      //     console.log(that.files)
      //   },
      //   // 'Error': function (up, err, errTip) {
      //   //   console.log('失败', up, err, errTip)
      //   //   //上传出错时,处理相关的事情
      //   // },
      //   'UploadComplete': function () {
      //     //队列文件处理完毕后,处理相关的事情
      //     if (that.avatarType != 'more') {
      //       that.uploader.files = []
      //     }
      //   }
      // }

      //   flash_swf_url: 'js/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
      // silverlight_xap_url: 'js/Moxie.xap' //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
    });
  }
  upload() {}
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
}
