import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";
import * as wangEditor from "node_modules/wangeditor/release/wangEditor.js";
// 文件管理器
// import E from "wangeditor";
@Component({
  selector: 'app-edit-object-editor',
  templateUrl: './edit-object-editor.component.html',
  styleUrls: ['./edit-object-editor.component.scss']
})
export class EditObjectEditorComponent implements OnInit {
  @Output() optionsChange = new EventEmitter<any>(true);
  @Input("object") _object: any;
  @Input("id") id: string = "";
  @Input("options") _options: any = {};
  @Input("fieldItem") _fieldItem: any;
  set options(v: any) {
    this.optionsChange.emit(v)
  }
  editor: any;
  constructor() { }

  ngOnInit(): void {
    console.log(this._object, this._options, this._fieldItem);
    // for (let index = 1; index < 7; index++) {
    //   this.editor = new wangEditor(`#toolbar-container${index}`, `#richText${index}`)
    // }
    this.editor = new wangEditor(`#toolbar-container`, `#richText`)
    this.setEditorConfig()
    // 注意，先配置 ，再执行 create()
    this.editor.create()
  }

  // this.editor.txt.html('<p>用 JS 设置的内容</p>')
  // editor.txt.text()

  // 设置富文本编辑器
  setEditorConfig() {
    // 设置编辑区域高度为 500px
    // editor.config.height = 500
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
      '#ffffff',
      '#000000',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#0076B8',
      '#E2C08D',
      '#8EE153',
      '#B6001F'
    ];
  }

  // 获取显示菜单项
  getMenuConfig(): string[] {
    return [
      'bold',  // 粗体
      'italic',  // 斜体
      'underline',  // 下划线
      'head',  // 标题
      'fontName',  // 字体
      'fontSize',  // 字号
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'table',  // 表格
      'image',  // 插入图片
      // 'video',  // 插入视频
      'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ];
  }


  addOption() {
    // if (!this.survey.outline) {
    //   this.notification.create(
    //     "warning",
    //     "未选择考试大纲",
    //     "需要选择考试大纲来配置抽题规则"
    //   );
    //   return
    // }
    if (!this._object.options) {
      this._object.options = [{
        "key": "",
        "label": "",
        "value": ""
      }]
    } else {
      this._object['options'].push({
        "key": "",
        "label": "",
        "value": ""
      })
    }
    console.log(this._object['options']);
    this.getArr()

  }
  getArr() {
    // this._fieldItem.jsonArr
  }
}
