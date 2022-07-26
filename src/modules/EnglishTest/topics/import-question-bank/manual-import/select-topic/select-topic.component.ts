import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import * as wangEditor from "node_modules/wangeditor/release/wangEditor.js";
@Component({
  selector: "select-topic",
  templateUrl: "./select-topic.component.html",
  styleUrls: ["./select-topic.component.scss"],
})
export class SelectTopicComponent implements OnInit {
  @Input() que: any;
  @Input() subQueData: string;
  @Input() type: string;
  editor: any = null;
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
    public cdRef: ChangeDetectorRef
  ) { }
  ngOnInit(): void { }
  ngAfterViewInit() {
    console.log("666", this.editor);
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
  addOption() {
    if (this.que["options"].length >= 20) {
      this.message.warning("选项范围不得超出20");
      return;
    }
    this.que["options"].push({
      label: this.letterArr[this.que["options"].length],
      check: false,
      value: null,
      grade: 0,
    });
    console.log(this.que);
  }
  checkOpt(e) {
    console.log(e);
  }

  /* ************** 编辑器 wangEditor ************** */
  toolid: string;
  richid: string;
  initEditor() {
    let ts = new Date().getTime();
    this.toolid = "toolbar-select" + String(ts);
    this.richid = "richText-select" + String(ts);
    console.log(ts, this.que);
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    this.cdRef.detectChanges();

    // this.editor = new wangEditor("#toolbar-container", "#richText-select");
    this.editor = new wangEditor(`#${this.toolid}`, `#${this.richid}`);
    this.setEditorConfig();
    // // 解决editor重复渲染问题
    // let content = document.getElementById("#richText-select");
    // console.log(content);
    // while (content.childNodes) {
    //   content.removeChild(content.firstChild);
    // }
    this.editor.create();
    console.log("55555", this.editor, this.que["title"]);
    if (this.que["title"]) {
      console.log(this.que["title"])
      this.editor.txt.html(this.que["title"]);
    }
  }
  // 设置富文本编辑器
  setEditorConfig() {
    this.editor.textElemId = this.que.objectId || "newselect";
    console.log(this.editor.id);

    // 菜单展示项配置
    this.editor.customConfig.menus = this.getMenuConfig();
    // 自定义配置颜色（字体颜色、背景色）
    this.editor.customConfig.colors = this.getColorConfig();
    this.editor.customConfig.zIndex = 100;
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
