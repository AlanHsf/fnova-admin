import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
// 文件管理器，函数调用
import { EditFileManagerComponent } from "../../../../../common/edit-filemanager/edit-filemanager.component";
import * as wangEditor from "node_modules/wangeditor/release/wangEditor.js";

@Component({
  selector: "text-topic",
  templateUrl: "./text-topic.component.html",
  styleUrls: ["./text-topic.component.scss"],
})
export class TextTopicComponent implements OnInit {
  @Input() que: any;
  @Input() type: string;
  constructor(private cdRef: ChangeDetectorRef) { }
  // editor
  @ViewChild(EditFileManagerComponent, { static: false })
  editFilemanager: EditFileManagerComponent;
  editor: any = null;
  editInitConfig: any = null;
  loadTinyMce: boolean = false;
  ngOnInit(): void {
    /* 进入包含editor页面 重新初始化 editor */
    // this.loadTinyMce = false;
    // this.loadTinyMce = true;
    // this.editInitConfig = {
    //   plugins:
    //     "code link lists advlist preview fullscreen table image media quickbars imagetools",
    //   toolbar:
    //     "fullscreen preview | undo redo | bold italic | bullist numlist outdent indent | table |  code",
    //   quickbars_image_toolbar:
    //     "alignleft aligncenter alignright | editimage imageoptions",
    //   imagetools_toolbar:
    //     "rotateleft rotateright | flipv fliph | editimage imageoptions",
    //   quickbars_selection_toolbar:
    //     "bold italic | formatselect | quicklink blockquote",
    //   language: "zh_CN",
    //   language_url: "/assets/js/tinymce/langs/zh_CN.js",
    //   menubar: true,
    //   statusbar: true,
    //   base_url: "/assets/js/tinymce/",
    // };
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.initEditor();
    }, 500);
  }
  ngOnDestroy() {
    if (this.editor.destroy) {
      this.editor.destroy();
      this.editor = null;
    }
  }
  // // TinyMCE Uploader Function
  getEditInitOptions() {
    console.log("tinymce init");
    let that = this;
    setTimeout(() => {
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
    }, 500);
  }

  /* ************** 编辑器 wangEditor ************** */
  toolid: string;
  richid: string;
  initEditor() {
    let ts = new Date().getTime();
    console.log(ts, this.editor);
    this.toolid = "toolbar-text" + String(ts);
    this.richid = "richText-text" + String(ts);
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    this.cdRef.detectChanges();
    this.editor = new wangEditor(`#${this.toolid}`, `#${this.richid}`);
    this.setEditorConfig();
    this.editor.create();
    console.log(this.editor);
    if (this.type == "edit") {
      this.editor.txt.html(this.que["title"]);
    }
  }
  // 设置富文本编辑器
  setEditorConfig() {
    this.editor.textElemId = this.que.objectId || "newtext";
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
}
