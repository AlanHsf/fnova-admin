import * as Parse from "parse";
Parse.initialize("nova");
(Parse as any).serverURL = "https://server.fmode.cn/parse";

declare var qiniu: any;
import { Component, OnInit, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from "@angular/common/http"
// 图标
// import { NzIconService } from 'ng-zorro-antd/icon';
// import { AppStore, Column, Menu, Preview } from "../../../assets/img/icon/iocn.js"
// 七牛云上传相关
import { DatePipe } from '@angular/common';
import { from } from 'rxjs';
// https://developer.qiniu.com/kodo/sdk/1283/javascript
// http://jssdk-v2.demo.qiniu.io/

@Component({
    selector: 'nova-filemanager',
    templateUrl: './manager.component.html',
    styleUrls: ['./manager.component.scss']
})
export class NovaFileManagerComponent implements OnInit {
    local: any
    /** 标签组件 <Tag> EditImage
       @params url <string> 必填 单选绑定文件URL参数
       @params urls <string> 必填 多选绑定文件列表URL参数
       @params files <string> 必填 绑定文件列表参数
       @params dragdrop <boolean> 选填 是否支持拖拽上传
       @params multi <string> 选填 是否支持多文件选择
       @params mode <string> 选填 comp组件（默认） callback函数 page页面直接访问
       @params type <string> 选填 设置上传附件类型
       @params max_file_size <number> 选填 文件上传的最大体积 单位mb 默认 100 mb
       @params mimeLimit <string> 选填 image图片 video视频 <留空>不限
       **/
    @Input('url') _url: any = "";
    @Output('urlChange') onUrlChange = new EventEmitter<any>();
    get url(){
        return this._url;
    }
    set url(v){
        this.url = v
    }

    @Input('urls') _urls: any = "";
    get urls(){
        return this._urls;
    }
    set urls(v){
        this.urls = v
    }

    @Output('urlsChange') onUrlsChange = new EventEmitter<any>();

    @Input('files') _files: any = "";
    @Input() dragdrop: boolean = false;
    @Input() multi: boolean = false;
    @Input() mode: string;
    @Input('max_file_size') max_file_size: number = 400;
    @Input() type: string = "all"; // "空"仅显示附件列表无上传、image仅图片类型、attachment图片及文档类型
    @Output('filesChange') onFilesChange = new EventEmitter<any>();
    @Input('avatarType') avatarType: string = ''

    @Input() mimeLimit: any;

    fileView = "card" // card卡片模式 list列表模式
    fileCardWidth:number = 100 // 卡片宽度

    inputType: string = null
    uptoken: string
    domain: string
    progress: any = 0
    progressMap: any = {}
    uploadUrl;
    resume;
    selected: any = [] //已选择文件
    info: boolean = false //是否显示文件信息
    searchstr:string = ""
    attachSize:number = 20
    get files() {
        return this._files
    }
    set files(v: any) {
        this._files = v
    }


    /* ******************************************************************************* */
    /* 文件管理器相关逻辑 */
    /* ******************************************************************************* */
    // 统计空间使用情况
    spaceCount = {
        all: 0,
        image: 0,
        video: 0,
        music: 0,
        other: 0,

    }
    spaceMap = {
        "totalSize": 0,
        "totalCount": 0,
        "imageSize": 0,
        "imageCount": 0,
        "videoSize": 0,
        "videoCount": 0,
        "otherSize": 0,
        "otherCount": 0,
        "balance": 0
    }
    spaceLimit: Number = 1024 * 1024 * 1024; // 默认1GB
    spaceUnit: String = "GB"
    spaceBalance: Number = 1024 * 1024 * 1024
    spaceUsed: Number = 0;
    async loadSpaceCount() {
        let company = localStorage.getItem("company")
        let query = new Parse.Query("Company");
        query.select("configSpace")
        let comObj = await query.get(company);

        let limit = comObj.get("configSpace") && comObj.get("configSpace").limit;
        this.http.get(`https://server.fmode.cn/api/storage/space?c=${company}`).subscribe(data => {
            let result: any = data
            this.spaceMap = result.data;
            this.spaceLimit = this.getLimitBytes(limit);
            this.spaceUsed = this.spaceMap.totalSize;
        })
        return // 后台直接写统计接口
    }
    // 单位
    getLimitBytes(limit) {
        if (limit) {
            let num = Number(limit.slice(0, limit.length - 2))
            let unit: any = limit.slice(limit.length - 2)
            this.spaceUnit = unit;
            switch (unit) {
                case "EB":
                    unit = 1024 * 1024 * 1024 * 1024 * 1024 * 1024
                    break;
                case "PB":
                    unit = 1024 * 1024 * 1024 * 1024 * 1024
                    break;
                case "TB":
                    unit = 1024 * 1024 * 1024 * 1024
                    break;
                case "GB":
                    unit = 1024 * 1024 * 1024
                    break;
                case "MB":
                    unit = 1024 * 1024
                    break;
                case "KB":
                    unit = 1024
                    break;
                default:
                    break;
            }
            return num * unit
        }

    }
    // 各类文件预览
    isPreview:boolean = false;
    previewType:string
    previewFileId:string
    previewToken:string
    onPreviewCancel(){
        this.isPreview = false
        this.previewType = null
        this.previewFileId = null
        this.previewToken = null
    }


    imageExtend = [
        "png","jpg","jpeg","ico","gif", "JPG","PNG","JPEG","ICO","GIF"
    ]
    videoExtend = [
        "mp4","flv","avi"
    ]
    officeExtend = [
        "odt","docx","doc","wps","pdf",
        "ods","xlsx","xls","csv","tsv",
        "odp","pptx","ppt","zip"
    ]

    showFileEditor(file){
        if(file&&file.get&&file.get("name")){
        }else{
            return "file"
        }

        let name = file.get("name");
        let nameArray = name.split(".");
        let extend = nameArray.length>0?nameArray[nameArray.length-1]:""

        if(["odt","docx","doc","wps"].indexOf(extend)>-1){
            return "word"
        }
        if(["ods","xlsx","xls","csv","tsv"].indexOf(extend)>-1){
            return "excel"
        }
        if(["odp","pptx","ppt"].indexOf(extend)>-1){
            return "ppt"
        }
        if(["pdf"].indexOf(extend)>-1){
            return "pdf"
        }

        return extend
    }
    showFileType(file) {
        if(file&&file.get&&file.get("name")){
        }else{
            return "附件"
        }
        // 获取文件名及后缀
        let name = file.get("name");
        let nameArray = name.split(".");
        let extend = nameArray.length>0?nameArray[nameArray.length-1]:""
        if(this.imageExtend.indexOf(extend)>-1){
            return "图片"
        }

        if(this.videoExtend.indexOf(extend)>-1){
            return "视频"
        }

        if(this.officeExtend.indexOf(extend)>-1){
            return "文档"
        }
        return "附件"
    }

    previewAttachment(attach) {
        // 获取文件名及后缀
        let name = attach.get("name");
        let nameArray = name.split(".")
        let extend = nameArray.length>0?nameArray[nameArray.length-1]:""

        if(this.imageExtend.indexOf(extend)>-1){

        }

        if(this.videoExtend.indexOf(extend)>-1){

        }

        if(this.officeExtend.indexOf(extend)>-1){
            // Text documents (.odt, .docx, .doc)
            // Spreadsheets (.ods, .xlsx, .xls)
            // Presentations (.odp, .pptx, .ppt)

            // this.isPreview = true
            // this.previewType = "office"
            // this.previewFileId = attach.id

            window.open(`/office/viewer/${attach.id}`, 'newwindow', 'height=800, width=1024, top=0, left=0, toolbar=no, menubar=no, scrollbars=yes,resizable=yes,location=no, status=no')
        }
    }
    // 文件选择逻辑
    selectMap = {};
    selectArray(): Array<ParseObject> {
        if (!this.selectMap) return []

        return Object.values(this.selectMap);
    }
    selectAttachment(attach) {
        // 检测mime是否符合要求
        console.log(this.mimeLimit)
        if (this.mimeLimit) {
            if (!attach.get("mime").startsWith(this.mimeLimit)) {
                alert("文件类型不符，请重新选择");
                return
            }
        }
        // 添加至选择列表
        if (this.selectMap[attach.id]) {
            console.log(1111)
            delete this.selectMap[attach.id]
            let url = this.selectArray()
            console.log(url)
            if(this._url) {
                this.onUrlChange.emit()
            } else {
                this.onUrlsChange.emit(this.selectArray().map(item => item.get("url")))
            }
        } else {
            if (this.multi == false) {
                if (this.selectArray().length > 0) {
                    return // 超过一个不能选择
                }
            }
            this.selectMap[attach.id] = attach;
        }
    }


    // 删除
    delete(attach) {
        console.log(this._url)
        if(this._url) {
          let url = ""
          this.onUrlChange.emit(url);
        }
        if(this._urls && this._urls.length > 0 ) {
          console.log(this._urls)
        }
    }

    handleSelect() { // 返回选择结果
        let firstFile = this.selectArray()[0];
        let fileArray = this.selectArray();
        // 返回单选参数
        let url = this.selectArray()[0] && this.selectArray()[0].get("url") || ""
        // 返回多选参数
        this.onUrlChange.emit(url);
        console.log(this.selectArray().map(item => item.get("url")))

        this.onUrlsChange.emit(this.selectArray().map(item => item.get("url")));
        // 返回函数参数
        if (this.callbackByFunction) {
            this.callbackByFunction(firstFile, fileArray)
        }
        this.isVisible = false;
    }
    // 分类管理及文件上传逻辑
    categories = [];
    currentCategory;
    currentPathName;
    attachments = [];
    attachPageIndex = 1;
    attachTotal = 0;
    async loadCategory() {
        let query = new Parse.Query("Category")
        query.include("parent.parent.parent");
        query.equalTo("type", "folder")
        query.equalTo("company", localStorage.getItem("company"))
        query.find().then(data => {
            this.categories = data;
            this.cdRef.detectChanges();
        })
    }
    currentCate:string = ""
    async loadAttachment(cate?, mime?, name?) {
        console.log(cate)
        if(cate) {
            this.currentCate = cate.id
        }else {
            this.currentCate = null
        }

        let query = new Parse.Query("Attachment")
        query.equalTo("company", localStorage.getItem("company"))
        query.addDescending("createdAt");
        if (this.mimeLimit) {
            query.startsWith("mime", this.mimeLimit);
        }
        if (mime) {
            query.startsWith("mime", mime);
        }
        if(name) {
            query.contains("name", name);
        }
        if (cate) {
            query.equalTo("category", cate.id);
            this.currentCategory = cate;
        } else {
            this.currentCategory = undefined;
            this.currentPathName = "最新上传";
        }
        query.limit(20)
        this.attachTotal = await query.count();
        query.limit(this.attachSize);
        query.skip(this.attachSize * (this.attachPageIndex-1));
        query.find().then(data => {
            this.attachments = data;
            this.cdRef.detectChanges();
        })
    }
    search() {
        this.loadAttachment(null, null, this.searchstr)
    }

    // 分页
    nzPageIndexChange(e) {
        this.attachPageIndex = e
        console.log(e)
        this.loadAttachment()
    }
    // 文件上传Modal
    isUploader = false
    fileList = [];
    presentUpload() {
        if (this.spaceUsed > this.spaceLimit) {
            alert("您的空间已满，请联系维护人员。")
            return
        }
        this.fileList = [];
        if (this.uploader) {
            // this.uploader.destory();
        }
        this.hashid = this.uuid(); // 每次弹窗创建新的dom
        setTimeout(() => {
            this.local = window.location.pathname
            console.log(this.local)
            this.initUploaderAfterShow()
            this.listenToUploader()
        }, 500)
        this.isUploader = true
    }
    handleUploadOk() {
        this.isUploader = false
    }
    handleUploadCancel() {
        this.isUploader = false
    }
    // 文件夹编辑Modal
    isEditCateVisible = false;
    editCategory;
    editCateName = "";
    presentEditCate(cate?) {
        if (cate && cate.id) {
            this.editCategory = cate;
            this.editCateName = this.editCategory.get("name");
        } else {
            this.editCateName = ""
        }
        this.isEditCateVisible = true
    }
    async handleEditCateOk() {
        let Category = Parse.Object.extend("Category");
        let cate = new Category();
        if (this.editCategory) {
            cate = this.editCategory
        }
        cate.set("name", this.editCateName);
        cate.set("type", "folder");
        cate.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: localStorage.getItem("company")
        });
        cate = await cate.save();
        if (!this.editCategory && cate && cate.id) {
            this.categories.unshift(cate);
        }
        this.isEditCateVisible = false
        this.editCategory = undefined;
    }
    handleEditCateCancel() {
        this.isEditCateVisible = false
        this.editCategory = undefined;
    }


    /* ******************************************************************************* */
    /* 上传文件相关逻辑 */
    /* ******************************************************************************* */
    constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {
        // this.iconService.addIconLiteral('AppStore', AppStore);
        // this.iconService.addIconLiteral('Column', Column);
        // this.iconService.addIconLiteral('Menu', Menu);
        // this.iconService.addIconLiteral('Preview', Preview);
        this.mode = "comp"
        if(location.pathname.indexOf("cloud/manager")>-1){
            // 页面模式，屏幕更大，因此默认加载更多文件，图标显示更大比例
            // this.mode = "page";
            // this.fileCardWidth = 120;
            // this.attachSize = 30;
        }
    }

    ngOnInit() {
        console.log(this._urls)
        console.log(this._url)

        this.loadSpaceCount();
        if (this.avatarType == 'more') { //是否支持多文件上传
            this.multi = true
        }
        // console.log('mb',this.max_file_size)

        this.loadCategory();
        this.loadAttachment();
    }
    ngAfterViewInit() {
        // 从纯url地址中生成满足selectMap格式的图片
        setTimeout(() => {
            if (this._url) {
                this.createAttachmentFromUrl(this._url);
            }
            if (this._urls) {
                this._urls.forEach(uitem => {
                    this.createAttachmentFromUrl(uitem);
                })
            }
        }, 500)
    }
    initUploaderAfterShow() {
        if (this.files == undefined) {
            this.files = []
        }
        // 判断上传文件类型
        // console.log('上传', this.type)
        this.uploaderType()

        if (this.upable()) {
            this.getUptoken().then(async data => {
                console.log(data)
                this.uptoken = data.uptoken
                this.domain = data.domain
                this.max_file_size = data.max_file_size ? data.max_file_size : 400
                let config = {
                    useCdnDomain: true,
                    disableStatisticsReport: false,
                    retryCount: 6,
                    region: qiniu.region.z2
                }
                this.uploadUrl = await qiniu.getUploadUrl(config, this.uptoken);
                this.initUploader(data.uptoken, data.domain)
            })
        }
    }
    // 文件管理器
    isVisible = false;
    isConfirmLoading = false;
    callbackByFunction: any;
    showFileManager(options?, callback?) {
        this.selectMap = {}
        if (options) {
            this.mimeLimit = options.mime
            this.multi = options.multi
        }
        if (callback) {
            this.callbackByFunction = callback
            let dialogEl: any = document.getElementsByClassName("tox-tinymce-aux")[0]
            dialogEl.style.zIndex = 999;
        }
        this.isVisible = true;
    }
    createAttachmentFromUrl(url) {
        let Attachment = Parse.Object.extend("Attachment");
        let attachment = new Attachment();
        attachment.id = url;
        attachment.set("mime", "image")
        attachment.set("name", url);
        attachment.set("url", url);
        if(this.currentCate) {
            attachment.set("category", {
                __type: "Pointer",
                className: "Category",
                objectId: this.currentCate
            })
        }
        console.log(this.currentCate)
        this.selectMap[url] = attachment;
        console.log(this.selectMap)
        this.selectMap
        this.cdRef.detectChanges();
    }
    handleOk(): void {
        this.isConfirmLoading = true;
        setTimeout(() => {
            this.isVisible = false;
            this.isConfirmLoading = false;
        }, 3000);
    }

    handleCancel(): void {
        // 返回函数参数
        if (this.callbackByFunction) {
            this.callbackByFunction()
        }
        this.isVisible = false;
    }
    // 七牛云上传
    hashid: string = this.uuid();
    uploader: any  //uploader为实例化上传组件
    //uploader.files 为上传队列 将其赋值 [] 后 即可 再次上传相同文件
    mime_types = [{ title: "", extensions: "jpg,gif,png,bmp,jpeg" }]

    getUptoken() {
        return Parse.Cloud.run('qiniu_uptoken', {company: localStorage.getItem('company')})
    }
    checkFileType(url: string) {
        if (url && typeof url == "string") {
            if (url.endsWith("png")) { return "image" }
            if (url.endsWith("jpg")) { return "image" }
            if (url.endsWith("gif")) { return "image" }
        }
        return "file"
    }
    upable() {
        if (this.type == "") {
            return false
        } else {
            return true
        }
    }

    videoShowing: boolean = false;
    videoUrl: string;
    showFile(file) {
        // console.log(file)
        this.videoUrl = file;
        this.videoShowing = true;
    }
    closeShowModal() {
        this.videoShowing = false;
    }

    async saveAttachment(file) {

        let url = file.url
        if (url.startsWith("http")) {
        } else {
            url = this.domain + url
        }
        url = url.replace(/undefined\//, "");

        console.log("saveAttachment")
        console.log(url)
        console.log(file)
        // 检测文件是否存在
        let query = new Parse.Query("Attachment");
        query.equalTo("url", url);
        let attachment = await query.first();

        if (attachment && attachment.id) {
            console.error("该文件已存在，无需重复上传");
            return
        } else {
            let Attachment = Parse.Object.extend("Attachment")
            attachment = new Attachment();
            attachment.set("size", file.size)
            attachment.set("url", url)
            attachment.set("name", file.name)
            attachment.set("mime", file.type)
            attachment.set("company", {
                __type: "Pointer",
                className: "Company",
                objectId: localStorage.getItem("company")
            })
            if(this.currentCate) {
                attachment.set("category", {
                    __type: "Pointer",
                    className: "Category",
                    objectId: this.currentCate
                })
            }
            attachment.save().then(attach => {
                this.attachments.unshift(attach);
            })
        }
    }
    currentKey;
    setFiles(file: any) {
        if (file.url && this.currentKey) {
            if (file.size < this.chunk_size) {
                this.saveAttachment(file)
            } else {
                this.mkFileRequest(file, this.currentKey)
            }
        }
        this.progress = file.percent;
        this.dragdrop = false
        return
    }
    deleteFile(id) {
        this.files = undefined
    }
    listenToUploader() {
        document.addEventListener("uploader" + this.hashid + ".onprogress", (event: any) => {
            // this.setFiles(event.detail.file)
            // this.setFiles(event.detail.file.percent)
        }, false);
        document.addEventListener("uploader" + this.hashid + ".fileuploaded", (event: any) => {
            this.setFiles(event.detail.file)
        }, false);
    }
    uploaderType() {
        switch (this.type) {
            case "all":
                this.mime_types = [
                    { title: "Image files", extensions: "jpg,gif,png" }, // 限定jpg,gif,png后缀上传
                    {
                        title: "Attachment files",
                        extensions: "pdf,doc,docx,xls,md,txt,json,ppt,pptx,zip,rar"
                    }, // 限定pdf,doc,docx,xls,md,txt后缀上传
                    { title: "Video files", extensions: "mp4" }, // 限定flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4后缀格式上传
                    { title: "Music files", extensions: "mp3" } // mp3后缀格式上传
                ];
                break;
            case "image":
                this.mime_types = [
                    { title: "Image files", extensions: "jpg,gif,png" } // 限定jpg,gif,png后缀上传
                ];
                break;
            case "attachment":
                this.mime_types = [
                    { title: "Image files", extensions: "jpg,gif,png" }, // 限定jpg,gif,png后缀上传
                    {
                        title: "Attachment files",
                        extensions: "pdf,doc,docx,xls,md,txt,json,ppt,pptx"
                    }, // 限定pdf,doc,docx,xls,md,txt后缀上传
                    { title: "Zip files", extensions: "zip,7z,tar.gz,rar" } // 限定zip,7z,tar.gz,rar后缀上传
                ];
                break;
            case "video":
                this.mime_types = [
                    // { title: "Video files", extensions: "flv,mp4,avi" },
                    // { title: "Video files", extensions: "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4" }, // 限定flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4后缀格式上传
                    { title: "Video files", extensions: "mp4" } // 限定flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4后缀格式上传
                ];
                break;
            case "video":
                this.mime_types = [
                    { title: "Music files", extensions: "mp4" } // 限定mp3后缀格式上传
                ];
                break;
            default:
                break;
        }
    }
    getBelongId() {
        // 获取公司ID
        let id = window.localStorage.getItem("company")
        return id
    }

    initUploader(uptoken, domain) {
        console.log(111)
        let that = this
        let dirID = this.getBelongId()
        let hashid = this.hashid
        //引入Plupload 、qiniu.js后
        this.uploader = new plupload.Uploader({
            runtimes: 'html5,html4',    //上传模式,依次退化
            browse_button: 'pickfiles_button_' + this.hashid,       //上传选择的点选按钮，**必需**
            // uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            // uptoken: this.uptoken,
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
            container: 'dragdrop_container_' + this.hashid,           //上传区域DOM ID，默认是browser_button的父元素，
            filters: {
                max_file_size: this.max_file_size + 'mb',           //最大文件体积限制
                prevent_duplicates: true,
                mime_types: this.mime_types
            },
            max_retries: 3,                   //上传失败最大重试次数
            // dragdrop: this.dragdrop,                   //开启可拖曳上传
            // dragdrop: true,
            multi_selection: this.multi,
            drop_element: 'dragdrop_container_' + this.hashid,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: "4MB",                //分块上传时，每片的体积
            // auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            init: {
                // 'BeforeUpload': function (up, file) {

                //   // 每个文件上传前,处理相关的事情

                //   // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                //   // 该配置必须要在 unique_names: false , save_key: false 时才生效

                //   let today = new Date()
                //   let dp = new DatePipe("en")
                //   let key = "" + dirID + "/" + dp.transform(today, "yMMdd") + "/" + String(file.id).substr(20, 6)+dp.transform(today, "hhmmss") + /\.[^\.]+/.exec(file.name);
                //   // do something with key here
                //   that.putExtra.params["x:name"] = key.split(".")[0];
                //   // return key
                //   that.uploader.setOption({
                //     multipart: true,
                //     multipart_params: {
                //       token: uptoken,
                //       key:key
                //     }
                //   });
                // },
                'UploadProgress': function (up, file) {
                    // 每个文件上传时,处理相关的事情
                    let ev = new CustomEvent("uploader" + hashid + ".onprogress", { detail: { "up": up, "file": file } })
                    console.log(ev)
                    document.dispatchEvent(ev)
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

                    let domain = up.getOption('domain');
                    let res = JSON.parse(info.response);
                    let sourceLink = domain + "/" + res.key;
                    file.url = sourceLink;
                    let ev = new CustomEvent("uploader" + hashid + ".fileuploaded", { detail: { "up": up, "file": file, "info": info } });
                    document.dispatchEvent(ev);
                    console.log(that.files)
                },
                // 'Error': function (up, err, errTip) {
                //   console.log('失败', up, err, errTip)
                //   //上传出错时,处理相关的事情
                // },
                'UploadComplete': function () {
                    //队列文件处理完毕后,处理相关的事情
                    if (that.avatarType != 'more') {
                        that.uploader.files = ""
                    }
                }
            }
        });

        // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取

        // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
        this.uploader.init()

        this.uploader.bind("BeforeUpload", function (uploader, file) {
            let today = new Date()
            let dp = new DatePipe("en")
            let key = "" + dirID + "/" + dp.transform(today, "yMMdd") + "/" + String(file.id).substr(20, 6) + dp.transform(today, "hhmmss") + /\.[^\.]+/.exec(file.name);
            that.currentKey = key;

            that.putExtra.params["x:name"] = key.split(".")[0];
            let id = file.id;
            that.chunk_size = uploader.getOption("chunk_size");
            let directUpload = function () {
                let multipart_params_obj: any = {};

                multipart_params_obj.token = uptoken;
                // filterParams 返回符合自定义变量格式的数组，每个值为也为一个数组，包含变量名及变量值
                let customVarList = qiniu.filterParams(that.putExtra.params);
                for (let i = 0; i < customVarList.length; i++) {
                    let k = customVarList[i];
                    multipart_params_obj[k[0]] = k[1];
                }
                multipart_params_obj.key = key;
                uploader.setOption({
                    url: that.uploadUrl,
                    multipart: true,
                    multipart_params: multipart_params_obj
                });
            };

            let resumeUpload = function () {
                that.blockSize = that.chunk_size;
                that.initFileInfo(file);
                console.log(file)
                if (that.blockSize === 0) {
                    that.mkFileRequest(file, key)
                    uploader.stop()
                    return
                }
                that.resume = true;
                var multipart_params_obj = {};
                // 计算已上传的chunk数量
                var index = Math.floor(file.loaded / that.chunk_size);

                var headers = qiniu.getHeadersForChunkUpload(that.uptoken)
                // console.log("getHeadersForChunkUpload")
                // console.log(headers)
                // console.log(headers)
                // console.log(headers)
                uploader.setOption({
                    url: that.uploadUrl + "/mkblk/" + that.blockSize + `?name=${key}&chunk=4&chunks=6`,
                    multipart: false,
                    required_features: "chunks",
                    headers: {
                        Authorization: "UpToken " + that.uptoken
                    },
                    multipart_params: multipart_params_obj
                });
            };
            // 判断是否采取分片上传
            if (
                (uploader.runtime === "html5" || uploader.runtime === "flash") &&
                that.chunk_size
            ) {
                if (file.size < that.chunk_size) {
                    directUpload();
                } else {
                    resumeUpload();
                }
            } else {
                console.log(
                    "directUpload because file.size < chunk_size || is_android_weixin_or_qq()"
                );
                directUpload();
            }
        });


        this.uploader.bind('FilesAdded', function (up, files) {
            // plupload.each(files, function (file) {
            //   // 文件添加进队列后,处理相关的事情
            // });
            that.resume = false;
            that.chunk_size = that.uploader.getOption("chunk_size");
            console.log(that.chunk_size)
            console.log(up)
            that.fileList = files;
            console.log(files)
            //   that.cdRef.detectChanges();
            that.uploader.start();
        })


        this.uploader.bind("ChunkUploaded", function (up, file, info) {
            var res = JSON.parse(info.response);
            var leftSize = info.total - info.offset;
            var chunk_size = that.uploader.getOption && that.uploader.getOption("chunk_size");
            if (leftSize < chunk_size) {
                up.setOption({
                    url: that.uploadUrl + "/mkblk/" + leftSize
                });
            }
            up.setOption({
                headers: {
                    Authorization: "UpToken " + that.uptoken
                }
            });
            // 更新本地存储状态
            let localFileInfo = JSON.parse(localStorage.getItem(file.name)) || [];
            localFileInfo[that.indexCount] = {
                ctx: res.ctx,
                time: new Date().getTime(),
                offset: info.offset,
                percent: file.percent
            };
            that.indexCount++;
            localStorage.setItem(file.name, JSON.stringify(localFileInfo));
        });

        // 每个事件监听函数都会传入一些很有用的参数，
        // 我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
        this.uploader.bind("UploadProgress", function (uploader, file) {
            let id = file.id;
            // 更新进度条进度信息;
            let fileUploaded = file.loaded || 0;

            this.progress = file.percent;
            that.progressMap[id] = file.percent;

            let count = Math.ceil(file.size / uploader.getOption("chunk_size"));
            if (file.size > that.chunk_size) {
                that.updateChunkProgress(file, that.chunk_size, count);
            }
        });
        // this.uploader.refresh()
    }
    updateChunkProgress(file, chunk_size, count) {
        let that = this;
        let index = Math.ceil(file.loaded / chunk_size);
        let leftSize = file.loaded - chunk_size * (index - 1);
        if (index == count) {
            that.chunk_size = file.size - chunk_size * (index - 1);
        }
    }
    startUpload() {
        this.uploader.start();
    }
    private uuid() { // 确保多个plupload控件不冲突
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        let uuid = s.join("");
        return uuid;
    }
    mkFileRequest(file, key) {
        let that = this
        // 调用sdk的url构建函数
        let requestUrl = qiniu.createMkFileUrl(
            that.uploadUrl,
            file.size,
            key,
            that.putExtra
        );
        let ctx = []
        let id = file.id
        let local = JSON.parse(localStorage.getItem(file.name))
        if (local && local.length) {
            for (let i = 0; i < local.length; i++) {
                ctx.push(local[i].ctx)
            }
        }

        let headers = qiniu.getHeadersForMkFile(this.uptoken)
        this.http.post(
            requestUrl,
            ctx.join(","),
            {
                headers: headers
            }
        ).subscribe(mkres => {
            let mkresJson: any = mkres
            if (mkresJson && mkresJson.key) {
                this.progress = 100;

                file.url = this.domain + mkresJson.key
                this.saveAttachment(file)
            }
        })
        // $.ajax({url: requestUrl, type: "POST",  headers: headers, data: ctx.join(","), success: function(res){
        //   uploadFinish(res, file.name,board[id]);
        // }})
    }
    indexCount = 0;
    chunk_size;
    blockSize;
    putExtra = {
        fname: "",
        params: {},
        mimeType: null
    }
    initFileInfo(file) {
        let that = this;
        let localFileInfo = JSON.parse(localStorage.getItem(file.name)) || [];
        this.indexCount = 0;
        let length = localFileInfo.length
        if (length) {
            let clearStatus = false
            for (let i = 0; i < localFileInfo.length; i++) {
                this.indexCount++
                if (this.isExpired(localFileInfo[i].time)) {
                    clearStatus = true
                    localStorage.removeItem(file.name);
                    break;
                }
            }
            if (clearStatus) {
                this.indexCount = 0;
                return
            }
            file.loaded = localFileInfo[length - 1].offset;
            let leftSize = file.size - file.loaded;
            if (leftSize < that.chunk_size) {
                that.blockSize = leftSize
            }
            file.percent = localFileInfo[length - 1].percent;
            return
        } else {
            this.indexCount = 0
        }
    }

    isExpired(time) {
        let expireAt = time + 3600 * 24 * 1000;
        return new Date().getTime() > expireAt;
    }

    showAttach:ParseObject
    showInfo(attach) {
      this.info = true
      if(attach&&attach.get("name")){
        this.showAttach = attach;
      }
    }
}

