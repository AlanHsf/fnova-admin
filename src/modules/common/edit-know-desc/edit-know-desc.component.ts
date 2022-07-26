import { Input, Output, EventEmitter } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import * as wangEditor from "node_modules/wangeditor/release/wangEditor.js";
// 文件管理器
// import E from "wangeditor";
@Component({
  selector: "app-edit-know-desc",
  templateUrl: "./edit-know-desc.component.html",
  styleUrls: ["./edit-know-desc.component.scss"],
})
export class EditKnowDescComponent implements OnInit {
  @Output() optionsChange = new EventEmitter<any>(true);
  @Input("object") _object: any;
  @Input("id") id: string = "";
  @Input("options") _options: any = {};
  @Input("fieldItem") _fieldItem: any;
  set options(v: any) {
    this.optionsChange.emit(v);
  }
  editor: any;
  editorType: string = "";
  constructor() { }

  ngOnInit(): void {
    console.log(this._object, this._options, this._fieldItem, this.status);
    // for (let index = 1; index < 7; index++) {
    //   this.editor = new wangEditor(`#toolbar-container${index}`, `#richText${index}`)
    // }
  }
  initEditor() {
    this.editor = new wangEditor("#toolbar-container", "#richText");
    // 设置编辑区域高度为 200px
    // this.editor.config.height = 200
    this.setEditorConfig();
    // 注意，先配置 ，再执行 create()
    this.editor.create();
  }
  // this.editor.txt.html('<p>用 JS 设置的内容</p>')
  // editor.txt.text()

  // 设置富文本编辑器
  setEditorConfig() {
    // this.editor.config.placeholder = '';
    // this.editor.config.focus = false
    // 菜单展示项配置
    this.editor.customConfig.menus = this.getMenuConfig();
    // 使用 base64 保存图片
    // this.editor.customConfig.uploadImgShowBase64 = true;
    // 自定义配置颜色（字体颜色、背景色）
    this.editor.customConfig.colors = this.getColorConfig();
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

  addOption(type, data) {
    // if (!this.survey.outline) {
    //   this.notification.create(
    //     "warning",
    //     "未选择考试大纲",
    //     "需要选择考试大纲来配置抽题规则"
    //   );
    //   return
    // }
    if (type && type == "edit") {
      this.editorType = "edit";
      this.status = "edit";
      this.option = data;
      this.showEditor = true;
      setTimeout(() => {
        this.initEditor();
        this.editor.txt.html(this._object[this._fieldItem.key][data.key]);
      }, 500);

      return;
    }
    this.editorType = "add";
    if (!this._object[this._fieldItem.key]) {
      this._object[this._fieldItem.key] = {};
    }
    // if (!this._object[this._fieldItem.key]) {
    //   this._object.options = [{
    //     "key": "",
    //     "label": "",
    //     "value": "",
    //   }]
    // } else {
    //   this._object[this._fieldItem.key].push({
    //     "key": "",
    //     "label": "",
    //     "value": "",
    //   })
    // }
    console.log(this._object[this._fieldItem.key]);
    this.getArr();
  }
  showEditor: boolean = false; // 显示编辑器
  // 暂无值的项
  selectArr = [];
  status: string = "";
  option: any = {
    key: "",
    value: "",
  }; // 当前编辑项

  // 获取值为空的项
  getArr() {
    this.selectArr = [];
    console.log(this._fieldItem.jsonArr);
    if (this._fieldItem && this._fieldItem.jsonArr) {
      this.selectArr = this._fieldItem.jsonArr.filter((item) => {
        let option = this._object[this._fieldItem.key][item.key];
        console.log(this._object[this._fieldItem.key], item.key, option);
        if (!option || option.value == "") {
          return item;
        }
      });
      console.log(this.selectArr);
      this.status = "edit";
    }
  }

  keyChange(e) {
    console.log(e);
    this.option =
      this.selectArr[this.selectArr.findIndex((item) => item.key == e)];
    console.log(this.option);
    this.showEditor = true;
    this.initEditor();
  }

  editoOptions() {
    let value = this.editor.txt.html();
    console.log(value, this._fieldItem.key, this.option.key);
    if (!this._object[this._fieldItem.key]) {
      this._object[this._fieldItem.key] = {};
    }
    this._object[this._fieldItem.key][this.option.key] = value;
    console.log(this._object[this._fieldItem.key]);
    this.option = {};
    this.status = null;
    // this.editor.destroy()
    this.editor = null;
    this.editorType = "";

    // if(!this._object[this._fieldItem.key] || !this._object[this._fieldItem.key].length){// 题型详情未设置值
    //   this._object[this._fieldItem.key][this.option.key]=value;
    // }else {
    //   if(this._object[this._fieldItem.key][this.option.key]){// 该语种题型详情已存在
    //     this._object[this._fieldItem.key][this.option.key] = value;
    //   }else{
    //     this._object[this._fieldItem.key][this.option.key]= value;
    //   }
    // }
  }
}
