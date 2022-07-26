import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
// wangEditor 参考：https://blog.csdn.net/weixin_30482383/article/details/96670860
import * as wangEditor from "node_modules/wangeditor/release/wangEditor.js";
// 文件管理器，函数调用
import { EditFileManagerComponent } from "../../../../../common/edit-filemanager/edit-filemanager.component";

interface Topic {
  index: number;
  title: string;
  options: any[];
  answer?: string;
  analy?: string;
  score?: number;
}
@Component({
  selector: "group-topic",
  templateUrl: "./group-topic.component.html",
  styleUrls: ["./group-topic.component.scss"],
})
export class GroupTopicComponent implements OnInit {
  @Output() queChange = new EventEmitter<any>();
  @Output() subQueChange: EventEmitter<any> = new EventEmitter<any>();
  @Input("que") _que: any;
  get que() {
    return this._que;
  }
  set que(v: any) {
    console.log(v);
    this._que = v;
    this.queChange.emit(v);
  }
  @Input("subQueData") _subQueData: any[];
  get subQueData() {
    return this._subQueData;
  }
  set subQueData(v: any) {
    console.log(v);
    this._subQueData = v;
    this.subQueChange.emit(v);
  }
  @Input() type: string = "add";
  @Input() subQueValue: string = ""; // 新增题目 小题 输入文本
  @ViewChild(EditFileManagerComponent, { static: false })
  editFilemanager: EditFileManagerComponent;

  // editor
  editor: any = null;
  editInitConfig: any = null;
  loadTinyMce: boolean = false;

  /* edit */
  editSubQue: boolean = false; // 小题编辑组件显示
  tempQue: any; // 编辑中的小题
  editIndex: number; // 编辑中小题index
  isEnable: boolean = true; // 按钮是否启用

  /* add */
  showEmp: boolean = false; // 例题展示
  letterArr: any[] = [
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
  ];
  constructor(
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef
  ) { }
  ngAfterViewInit() {
    setTimeout(() => {
      this.initEditor();
    }, 500);
  }
  // ngOnDestroy() {
  //   if (this.editor.destroy) {
  //     this.editor.destroy();
  //     this.editor = null;
  //   }
  // }
  ngOnInit(): void {
    console.log("group-topic");
    /* 进入包含editor页面 重新初始化 editor */
    // this.loadTinyMce = false;
    // this.loadTinyMce = true;
    // let that = this;
    // this.editInitConfig = {
    //   plugins:
    //     "code link lists advlist preview fullscreen table media quickbars", // image imagetools
    //   toolbar:
    //     "fullscreen preview | undo redo | bold italic | bullist numlist outdent indent | table |  code",
    //   // quickbars_image_toolbar:
    //   //   "alignleft aligncenter alignright | editimage imageoptions",
    //   // imagetools_toolbar:
    //   //   "rotateleft rotateright | flipv fliph | editimage imageoptions",
    //   // quickbars_selection_toolbar:
    //   //   "bold italic | formatselect | quicklink blockquote",
    //   language: "zh_CN",
    //   language_url: "/assets/js/tinymce/langs/zh_CN.js",
    //   menubar: false,
    //   statusbar: false,
    //   base_url: "/assets/js/tinymce/",
    //   // file_picker_types: "file image media",
    //   images_upload_url: "/assets/js/tinymce/",
    //   paste_data_images: true, // 粘贴时把内容里的图片自动上传
    //   images_file_types: "jpeg,jpg,png,gif,bmp,webp",
    //   paste_word_valid_elements: "*[*]", //word需要它
    //   paste_convert_word_fake_lists: false, // 插入word文档需要该属性
    //   // contextmenu: false,// 禁用富文本的右键菜单，使用浏览器自带的右键菜单
    //   file_picker_callback: (cb, value, meta) => {
    //     // let dialogEl:any = document.getElementsByClassName("tox-tinymce-aux")[0]
    //     // dialogEl.style.zIndex = 999;
    //     let options = {
    //       mime: "image",
    //       multi: false,
    //     };
    //     if (meta.filetype == "media") {
    //       options.mime = "video";
    //     }
    //     if (meta.filetype == "file") {
    //       options.mime = undefined;
    //     }

    //     that.editFilemanager.showFileManager(options, (file, files) => {
    //       let dialogEl2: any =
    //         document.getElementsByClassName("tox-tinymce-aux")[0];
    //       dialogEl2.style.zIndex = 1300;
    //       if (file && file.id) {
    //         // Provide file and text for the link dialog
    //         // if (meta.filetype == "file") {
    //         //   cb(file.get("url"), { text: file.get("name") });
    //         // }
    //         // // Provide image and alt text for the image dialog
    //         // if (meta.filetype == "image") {
    //         //   cb(file.get("url"), {
    //         //     title: file.get("name"),
    //         //     alt: file.get("name"),
    //         //   });
    //         // }
    //         // // Provide alternative source and posted for the media dialog
    //         // if (meta.filetype == "media") {
    //         //   // callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
    //         //   cb(file.get("url"), {
    //         //     title: file.get("name"),
    //         //     alt: file.get("name"),
    //         //   });
    //         // }
    //       }
    //     });
    //   },
    //   images_upload_handler: (blobInfo, success) => {
    //     console.log("blobInfo", blobInfo);

    //     let options = {
    //       mime: "image",
    //       multi: false,
    //     };
    //     setTimeout(function () {
    //       /* no matter what you upload, we will turn it into TinyMCE logo :)*/
    //       success("http://moxiecode.cachefly.net/tinymce/v9/images/logo.png");
    //     }, 2000);
    //     // that.editFilemanager.showFileManager(options, (file, files) => {
    //     //   let dialogEl2: any =
    //     //     document.getElementsByClassName("tox-tinymce-aux")[0];
    //     //   dialogEl2.style.zIndex = 1300;
    //     //   if (file && file.id) {
    //     //     // Provide file and text for the link dialog
    //     //     // if (meta.filetype == "file") {
    //     //     //   cb(file.get("url"), { text: file.get("name") });
    //     //     // }
    //     //     // // Provide image and alt text for the image dialog
    //     //     // if (meta.filetype == "image") {
    //     //     //   cb(file.get("url"), {
    //     //     //     title: file.get("name"),
    //     //     //     alt: file.get("name"),
    //     //     //   });
    //     //     // }
    //     //     // // Provide alternative source and posted for the media dialog
    //     //     // if (meta.filetype == "media") {
    //     //     //   // callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
    //     //     //   cb(file.get("url"), {
    //     //     //     title: file.get("name"),
    //     //     //     alt: file.get("name"),
    //     //     //   });
    //     //     // }
    //     //   }
    //     // });
    //   },
    //   uploadImages: (blobInfo, success) => {
    //     console.log("uploadImages", blobInfo);

    //     let options = {
    //       mime: "image",
    //       multi: false,
    //     };
    //     setTimeout(function () {
    //       /* no matter what you upload, we will turn it into TinyMCE logo :)*/
    //       success("http://moxiecode.cachefly.net/tinymce/v9/images/logo.png");
    //     }, 2000);
    //     // that.editFilemanager.showFileManager(options, (file, files) => {
    //     //   let dialogEl2: any =
    //     //     document.getElementsByClassName("tox-tinymce-aux")[0];
    //     //   dialogEl2.style.zIndex = 1300;
    //     //   if (file && file.id) {
    //     //     // Provide file and text for the link dialog
    //     //     // if (meta.filetype == "file") {
    //     //     //   cb(file.get("url"), { text: file.get("name") });
    //     //     // }
    //     //     // // Provide image and alt text for the image dialog
    //     //     // if (meta.filetype == "image") {
    //     //     //   cb(file.get("url"), {
    //     //     //     title: file.get("name"),
    //     //     //     alt: file.get("name"),
    //     //     //   });
    //     //     // }
    //     //     // // Provide alternative source and posted for the media dialog
    //     //     // if (meta.filetype == "media") {
    //     //     //   // callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
    //     //     //   cb(file.get("url"), {
    //     //     //     title: file.get("name"),
    //     //     //     alt: file.get("name"),
    //     //     //   });
    //     //     // }
    //     //   }
    //     // });
    //   },
    //   paste_preprocess: function (plugin, args) {
    //     console.log(args.content);
    //     args.content += " preprocess";
    //   },
    // };
    //   tinymce.activeEditor.uploadImages(function(success) {
    // $.post('ajax/post.php', tinymce.activeEditor.getContent()).done(function() {
    //   console.log("Uploaded images and posted content as an ajax request.");
    // });
    // });
  }

  /* ************** edit 编辑题目 ************** */
  async changeSubQue(type, que?, index?) {
    switch (type) {
      case "add":
        this.editIndex = null;
        this.tempQue = {
          options: [],
        };
        this.editSubQue = true;
        break;
      case "edit":
        // 小题切换时，更新editor视图
        if (this.tempQue && this.tempQue.objectId != que.objectId) {
          this.tempQue = null;
          this.editSubQue = false;
        }
        this.cdRef.detectChanges()
        this.tempQue = que;
        console.log(que);
        this.editIndex = index;
        this.editSubQue = true;
        break;
      case "cancel":
        this.tempQue = {
          options: [],
        };
        this.editIndex = null;
        this.editSubQue = false;
        break;
      case "save":
        console.log("save", this.isEnable);

        this.isEnable = false;

        console.log(this.editIndex);
        if (this.editIndex != null) {
          this.subQueData[this.editIndex] = this.tempQue;
        } else {
          let required = await this.requireSubQue();
          if (!required) {
            return;
          }
          this.tempQue["index"] = this.subQueData.length + 1;
          console.log(this.tempQue.inndex, this.editIndex);
          this.subQueData.push(this.tempQue);
        }
        this.editIndex = null;
        this.editSubQue = false;
        setTimeout(() => {
          this.isEnable = true;
        }, 1000);
        break;
      default:
        break;
    }
  }
  async requireSubQue() {
    if (this.tempQue == {}) {
      this.message.warning("请填写题目内容");
      return false;
    }
    if (!this.tempQue["title"] || this.tempQue["title"] == "") {
      this.message.warning("请填写题干");
      return false;
    }
    if (!this.tempQue["options"] || this.tempQue["options"].length < 2) {
      this.message.warning("题目选项不得少于两个");
      return false;
    }
    if (!this.tempQue["answer"] || this.tempQue["answer"] == "") {
      this.message.warning("请设置正确答案");
      return false;
    }
    if (!this.tempQue["score"]) {
      this.message.warning("请设置该题分值");
      return false;
    }
    return true;
  }
  delete(index) {
    this.subQueData.splice(index, 1);
    console.log(this.subQueData);
  }
  drop(event: CdkDragDrop<string[]>): void {
    console.log(event);
    moveItemInArray(this.subQueData, event.previousIndex, event.currentIndex);
    console.log(this.subQueData, event.previousIndex, event.currentIndex);
    this.subQueData.forEach((subQue, index) => subQue.index = (index + 1))
    console.log(this.subQueData);
  }
  /* ************** edit end ************** */

  /* ************** 文本处理 ************** */
  // 输入区文本处理
  changeVal(value) {
    console.log(value);
    /*     /((\d\.)([\s\S\n]*?)((?=\d\.)|($)))/g
       (\d\.) 匹配标题 数字.
       ([\S\n]*?) 匹配任意字符串 零或一次
       ((?=\d\.)|($)) 匹配下一个标题或局末，但不获取内容 */
    // let reg = /((\d+[.、]))([\s\S\n]*?)((?=(\d+[.、])|($)))/g;
    // let reg = /((\d*\；))([\s\S\n]*?)((?=(\d*\；)|($)))/g;
    let reg = /((\d*[\uff0c\uff1b]))([\s\S\n]*?)((?=(\d*[\uff0c\uff1b])|($)))/g;

    // let reg = /(((\d+[.、])|^(\d+[.、]))([\s\S\n]*?)((?=((\d+[.、])|^(\d+[.、])))|($)))/g;
    /*
      \d\.匹配标题序号
      \s => 空白字符串 \S => 非空白字符串 \n => 换行  ()分组 [a-zA-Z] => 大小写英文字母
      .* => 除\n外所有字符串 [：:] =>匹配特定符号
       */
    // let queStemReg = /(\d+[.、])([\s\S\n]*?)(?=([A-Z][.、]))/;// 题干匹配规则
    // let queStemReg = /(\d*\；)([\s\S\n]*?)(?=([A-Z][.、]))/;// 题干匹配规则
    let queStemReg = /(\d*[\uff0c\uff1b])([\s\S\n]*?)(?=([A-Z][.、]))/; // 题干匹配规则
    let queOptReg = /(([A-Z][.、])([\s\S\n]*?)((?=答案)|($)))/; // 选项匹配规则
    let letqueOptItemReg = /(([A-Z][.、])([\s\S\n]*?)((?=([A-Z][.、]))|($)))/g; // 单个选项匹配规则
    let queAswReg = /[答案][：:](.*)/; // 答案匹配规则
    let queAnalyReg = /[解析][：:](.*)/; // 解析匹配规则
    let queScoReg = /[分值][：:](.*)/; // 分数匹配规则
    let topics = value.match(reg);
    let subQueData: Topic[] = [];
    console.log(topics);
    if (topics && topics.length) {
      topics.forEach((topic, tIndex) => {
        console.log(topic);
        console.log(topic.match(queStemReg));
        let index;
        let title;
        let answer;
        let options;
        let options2: any[] = [];
        let analy;
        let score;
        subQueData[tIndex] = {
          index: null,
          title: null,
          options: null,
          answer: null,
          analy: null,
          score: null,
        };
        if (topic.match(queStemReg) && topic.match(queStemReg)[1]) {
          let stem = topic.match(queStemReg)[1].indexOf("，");
          let stem2 = topic.match(queStemReg)[1].indexOf("；");
          console.log(topic.match(queStemReg)[1], stem);
          if (stem != -1) {
            index = topic.match(queStemReg)[1].substring(0, stem).trim();
            console.log(index, stem);
          } else if (stem2 != -1) {
            index = topic.match(queStemReg)[1].substring(0, stem2).trim();
            console.log(index, stem2);
          }
          console.log(index);

          title = topic.match(queStemReg)[2].replace(/\n/g, "");
          subQueData[tIndex].index = Number(index);
          subQueData[tIndex].title = title;
        } else {
          delete subQueData[tIndex].title;
        }
        if (topic.match(queAswReg) && topic.match(queAswReg)[1]) {
          answer = topic.match(queAswReg)[1].replace(/\n/g, "");
          subQueData[tIndex].answer = answer;
        } else {
          delete subQueData[tIndex].answer;
        }
        if (topic.match(queScoReg) && topic.match(queScoReg)[1]) {
          score = topic.match(queScoReg)[1].replace(/\n/g, "").trim();
          subQueData[tIndex].score = score;
        } else {
          subQueData[tIndex].score = 0;
        }

        if (topic.match(queOptReg) && topic.match(queOptReg)[0]) {
          options = topic.match(queOptReg)[0].replace(/\n/g, "");
          console.log(options);
          options = options.match(letqueOptItemReg);
          options.forEach((option, index) => {
            option = option.replace(/\n/g, "");
            console.log(option);
            options2[index] = {
              check: null,
              label: null,
              value: null,
              grade: 0,
            };
            options2[index]["value"] = option.substring(2).trim();
            options2[index]["label"] = this.letterArr[index];
            if (answer == options2[index]["label"]) {
              options2[index]["check"] = true;
              options2[index]["grade"] = subQueData[tIndex].score;
            } else {
              options2[index]["check"] = false;
            }
          });
          subQueData[tIndex].options = options2;
        } else {
          delete subQueData[tIndex].options;
        }
        if (topic.match(queAnalyReg) && topic.match(queAnalyReg)[1]) {
          analy = topic.match(queAnalyReg)[1].replace(/\n/g, "");
          subQueData[tIndex].analy = analy;
        } else {
          delete subQueData[tIndex].analy;
        }

        console.log(topic, options, answer, index, title, analy);
        this.subQueData = subQueData;
        console.log(this.subQueData);
      });
    } else {
      this.subQueData = [];
    }
  }

  /* ************** 文本处理 END ************** */

  /* ************** 编辑器 wangEditor ************** */
  toolid: string;
  richid: string;
  initEditor() {
    let ts = new Date().getTime();
    this.toolid = "toolbar-group" + String(ts);
    this.richid = "richText-group" + String(ts);
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    this.cdRef.detectChanges();
    this.editor = new wangEditor(`#${this.toolid}`, `#${this.richid}`);
    this.setEditorConfig();
    this.editor.create();
    if (this.type == "edit") {
      this.editor.txt.html(this.que["title"]);
      
    }
  }
  // 设置富文本编辑器
  setEditorConfig() {
    this.editor.textElemId = this.que.objectId || "newgroup";
    this.editor.customConfig.zIndex = 100;
    // 菜单展示项配置
    this.editor.customConfig.menus = this.getMenuConfig();
    // 自定义配置颜色（字体颜色、背景色）
    this.editor.customConfig.colors = this.getColorConfig();
    // 配置编辑器内容改变触发方法
    this.editor.customConfig.onchange = this.editorContentChange;
  }
  // 设置可选颜色
  getColorConfig(): string[] {
    return [
      "#ffffff",
      "#000000",
      "#eeece0",
      "#1c487f",
      "#4d80bf",
      "#c24f4a",
      "#8baa4a",
      "#7b5ba1",
      "#46acc8",
      "#f9963b",
      "#0076B8",
      "#E2C08D",
      "#8EE153",
      "#B6001F",
    ];
  }
  // 获取显示菜单项
  getMenuConfig(): string[] {
    return [
      "bold", // 粗体
      "italic", // 斜体
      "underline", // 下划线
      "head", // 标题
      "fontName", // 字体
      "fontSize", // 字号
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "table", // 表格
      // "image", // 插入图片
      // 'video',  // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo", // 重复
    ];
  }
  // 富文本编辑器内容变化触发方法
  editorContentChange = (html) => {
    console.log(html);
    this.que["title"] = html;
  };

  /* ************** wangEditor END ************** */

  /* ************** 编辑器 TinyMCE ************** */

  // TinyMCE Uploader Function
  getEditInitOptions() {
    let that = this;
    return {
      plugins:
        "code link lists advlist preview fullscreen table image media quickbars imagetools",
      toolbar:
        "fullscreen preview | undo redo | bold italic | bullist numlist outdent indent | table |  code",
      quickbars_image_toolbar:
        "alignleft aligncenter alignright | editimage imageoptions",
      imagetools_toolbar:
        "rotateleft rotateright | flipv fliph | editimage imageoptions",
      quickbars_selection_toolbar:
        "bold italic | formatselect | quicklink blockquote",
      language: "zh_CN",
      language_url: "/assets/js/tinymce/langs/zh_CN.js",
      menubar: true,
      statusbar: true,
      base_url: "/assets/js/tinymce/",
      // file_picker_types: "file image media",
      file_picker_callback: (cb, value, meta) => {
        // let dialogEl:any = document.getElementsByClassName("tox-tinymce-aux")[0]
        // dialogEl.style.zIndex = 999;
        let options = {
          mime: "image",
          multi: false,
        };
        if (meta.filetype == "media") {
          options.mime = "video";
        }
        if (meta.filetype == "file") {
          options.mime = undefined;
        }

        that.editFilemanager.showFileManager(options, (file, files) => {
          let dialogEl2: any =
            document.getElementsByClassName("tox-tinymce-aux")[0];
          dialogEl2.style.zIndex = 1300;
          if (file && file.id) {
            // Provide file and text for the link dialog
            // if (meta.filetype == "file") {
            //   cb(file.get("url"), { text: file.get("name") });
            // }
            // // Provide image and alt text for the image dialog
            // if (meta.filetype == "image") {
            //   cb(file.get("url"), {
            //     title: file.get("name"),
            //     alt: file.get("name"),
            //   });
            // }
            // // Provide alternative source and posted for the media dialog
            // if (meta.filetype == "media") {
            //   // callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
            //   cb(file.get("url"), {
            //     title: file.get("name"),
            //     alt: file.get("name"),
            //   });
            // }
          }
        });
      },
    };
  }

  /* ************** TinyMCE END ************** */
}
