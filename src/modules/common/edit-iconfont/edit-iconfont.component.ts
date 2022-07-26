import * as Parse from "parse";
declare var qiniu:any;
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
  selector: 'app-edit-iconfont',
  templateUrl: './edit-iconfont.component.html',
  styleUrls: ['./edit-iconfont.component.scss']
})
export class EditIconfontComponent implements OnInit {
  local: any
  /** 标签组件 <Tag> EditIconfont
     @params icon <string> 必填 图标字符
     @params svg <string> 选填 自定义SVG图标
     **/
  @Input('icon') icon: any = "";
  @Output('iconChange') onIconChange = new EventEmitter<any>();

  @Input('urls') _urls: any = "";
  @Output('urlsChange') onUrlsChange = new EventEmitter<any>();

  @Input('files') _files: any = "";
  @Input() dragdrop: boolean = false;
  @Input() multi: boolean = false;
  @Input() mode: string;
  @Input('max_file_size') max_file_size: number = 100;
  @Input() type: string = "all"; // "空"仅显示附件列表无上传、image仅图片类型、attachment图片及文档类型
  @Output('filesChange') onFilesChange = new EventEmitter<any>();
  @Input('avatarType') avatarType: string = ''

  @Input() mimeLimit:any;

  inputType:string = null
  uptoken:string
  domain:string
  progress:any = 0
  progressMap:any = {}
  uploadUrl;
  resume;
  selected:any = [] //已选择文件
  info:boolean = false //是否显示文件信息
  get files() {
    return this._files
  }
  set files(v:any) {
    this._files = v
  }
  currentPathName = ""
  displayIcons = []
  getIconFrontKeys(){
    return Object.keys(this.iconMap)
  }
  
  isSearching = false;
  searchText = "";
  searchIcon(str){
    console.log(str);
    this.isSearching = true;
    this.currentPathName = "搜索：" + str;
    this.displayIcons = this.iconList.filter(item=>("tmp"+item).indexOf(str)>0);
  }
  clearSearch(){
    this.searchText = "";
    this.isSearching = false;
    this.loadIconFront("方向性图标")
  }
  iconList = []
  iconMap = {
    "方向性图标":["step-backward","step-forward","fast-backward","fast-forward","shrink","arrows-alt","down","up","left","right","caret-up","caret-down","caret-left","caret-right","up-circle","down-circle","left-circle","right-circle","double-right","double-left","vertical-left","vertical-right","vertical-align-top","vertical-align-middle","vertical-align-bottom","forward","backward","rollback","enter","retweet","swap","swap-left","swap-right","arrow-up","arrow-down","arrow-left","arrow-right","play-circle","up-square","down-square","left-square","right-square","login","logout","menu-fold","menu-unfold","border-bottom","border-horizontal","border-inner","border-outer","border-left","border-right","border-top","border-verticle","pic-center","pic-left","pic-right","radius-bottomleft","radius-bottomright","radius-upleft","radius-upright","fullscreen","fullscreen-exit"],
    "提示建议性图标":["question","question-circle","plus","plus-circle","pause","pause-circle","minus","minus-circle","plus-square","minus-square","info","info-circle","exclamation","exclamation-circle","close","close-circle","close-square","check","check-circle","check-square","clock-circle","warning","issues-close","stop"],
    "编辑类图标":["edit","form","copy","scissor","delete","snippets","diff","highlight","align-center","align-left","align-right","bg-colors","bold","italic","underline","strikethrough","redo","undo","zoom-in","zoom-out","font-colors","font-size","line-height","dash","small-dash","sort-ascending","sort-descending","drag","ordered-list","unordered-list","radius-setting","column-width"],
    "数据类图标":["area-chart","pie-chart","bar-chart","dot-chart","line-chart","radar-chart","heat-map","fall","rise","stock","box-plot","fund","sliders"],
    "品牌和标识":["android","apple","windows","ie","chrome","github","aliwangwang","dingding","weibo-square","weibo-circle","taobao-circle","html5","weibo","twitter","wechat","youtube","alipay-circle","taobao","skype","qq","medium-workmark","gitlab","medium","linkedin","google-plus","dropbox","facebook","codepen","code-sandbox","amazon","google","codepen-circle","alipay","ant-design","ant-cloud","aliyun","zhihu","slack","slack-square","behance","behance-square","dribbble","dribbble-square","instagram","yuque","alibaba","yahoo","reddit","sketch"],
    "网站通用图标":["account-book","apartment","appstore","appstore-add","api","aim","barcode","audio-muted","bank","audit","block","bars","book","alert","bell","border","borderless-table","audio","bug","bulb","calendar","build","branches","car","calculator","camera","carry-out","clear","ci-circle","cloud-download","cloud","cloud-upload","cloud-server","code","ci","coffee","cloud-sync","cluster","column-height","comment","console-sql","compass","compress","container","credit-card","crown","dashboard","database","copyright-circle","delete-column","delete-row","deployment-unit","desktop","contacts","dingtalk","delivered-procedure","disconnect","dislike","dollar-circle","customer-service","download","copyright","dollar","control","ellipsis","environment","exception","expand-alt","euro","eye","experiment","field-number","expand","field-string","field-time","file-exclamation","euro-circle","field-binary","file-done","file-excel","file-gif","file-markdown","file-add","file-pdf","file-jpg","file-image","file","file-protect","file-sync","file-unknown","eye-invisible","file-text","export","file-search","file-word","file-zip","filter","flag","folder-add","fire","folder-view","folder","folder-open","fork","format-painter","function","fund-projection-screen","frown","fund-view","gift","gateway","gold","global","gif","funnel-plot","group","hdd","heart","hourglass","history","home","idcard","import","insert-row-above","insert-row-right","insurance","inbox","insert-row-below","insert-row-left","laptop","interaction","layout","key","like","line","link","loading","loading-3-quarters","lock","man","mail","mac-command","medicine-box","file-ppt","merge-cells","menu","message","mobile","money-collect","monitor","node-collapse","more","node-expand","notification","partition","paper-clip","node-index","percentage","number","pay-circle","phone","one-to-one","picture","play-square","pound-circle","meh","poweroff","printer","pound","profile","property-safety","pull-request","qrcode","read","reconciliation","red-envelope","reload","rest","robot","rotate-right","safety-certificate","rocket","rotate-left","pushpin","save","safety","schedule","search","security-scan","select","scan","shake","send","share-alt","shopping","shopping-cart","project","setting","skin","shop","sound","solution","star","split-cells","smile","subnode","sisternode","table","switcher","sync","tags","thunderbolt","team","to-top","transaction","trademark-circle","trademark","ungroup","trophy","tool","translation","unlock","user-add","user-delete","user","usb","user-switch","usergroup-add","usergroup-delete","tablet","video-camera-add","upload","video-camera","wallet","whats-app","wifi","woman","verified","tag"]
  }

  loadIconFront(key){
    this.currentPathName = key
    this.displayIcons = this.iconMap[key]
  }
  
  deleteIcon(){
    this.icon = undefined;
  }
  
  handleSelect(icon){ // 返回选择结果
    this.onIconChange.emit(icon);
    this.isVisible = false;
  }
  constructor(private http:HttpClient,private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
      this.loadIconFront("方向性图标");

      let list = []
      Object.values(this.iconMap).forEach(il=>{
        list = list.concat(il)
      });
      this.iconList = list;

  }
  // 文件管理器
  isVisible = false;
  isConfirmLoading = false;
  callbackByFunction:any;
  showIconfont(options?,callback?){
    this.isVisible = true;
  }
  
  handleCancel(): void {
    // 返回函数参数
    if(this.callbackByFunction){
      this.callbackByFunction()
    }
    this.isVisible = false;
  }

}

