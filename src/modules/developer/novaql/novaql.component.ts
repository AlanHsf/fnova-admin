import * as Parse from "parse";

import { Component, OnInit } from '@angular/core';
import { Cloud } from '../../../providers/cloud';
import { ChangeDetectorRef,ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppService } from '../../../app/app.service';

import { EditObjectComponent } from "../../common/edit-object/edit-object.component";

// CodeMirror编辑器
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/search/match-highlighter';

@Component({
  selector: 'app-novaql',
  templateUrl: './novaql.component.html',
  styleUrls: ['./novaql.component.scss']
})
export class NovaqlComponent implements OnInit {
  @ViewChild(EditObjectComponent, { static: true }) editObject: EditObjectComponent;

  schemas:any = {}
  schemaList:Array<any> = []
  schemaListDisplay:Array<any> = []

  demos:Array<any> = []
  currentNqlCode:any
  content:String
  showEditor = true
  // CodeMirror Options at: https://codemirror.net/doc/manual.html#config
  cmOptions:any
  
  constructor(
    private cloud:Cloud,
    private cdRef: ChangeDetectorRef,
    private http:HttpClient,
    public appServ: AppService,
  ) {   
    this.appServ.isCollapsed = true;
  }


  refresh(){
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    this.refreshAllData()
  }

  tabHandler (cm) {
    const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
    cm.replaceSelection(spaces);
}

searchSchema(searchText){
  if(!searchText || searchText==""){
    this.schemaListDisplay = this.schemaList
  }else{
    this.schemaListDisplay = this.schemaList.filter(sitem=>("tmp"+sitem.schemaName).indexOf(searchText)>0)
  }
  this.refresh();
}

/**************************** NotePad 相关代码 **********************************/
isNoteShow:boolean = false
showNotePad(){
  this.isNoteShow = true
}

/**************************** Data OutPut 数据集显示相关代码 **********************************/
hasError:boolean = false;
errorMessage = "";
showCellContent(value){
  if(typeof value == "string" && value.length>10){
    return value.slice(0,10) + "...";
  }
  if(typeof value == "object"){
    return JSON.stringify(value);
  }
  return value
}
/**************************** NovaQL Code 案例库相关代码 **********************************/
titleEditMap = {}

NqlCodeTabs = [];
NqlSelectedIndex = 0;

dataTableHeaders = []
dataTableData = []

closeNqlTab({ index }: { index: number }): void {
  this.NqlCodeTabs.splice(index, 1);
  if(this.NqlCodeTabs.length==0){
    this.newNqlTab();
  }
}

newNqlTab(): void {
  let DevNqlCode = Parse.Object.extend("DevNqlCode");
  let nqlCode = new DevNqlCode();
  nqlCode.className = "DevNqlCode";
  nqlCode.set("title","Undefined Title");
  nqlCode.set("content",`SELECT * FROM "Article" LIMIT 5;`);
  this.NqlCodeTabs.push(nqlCode);
  this.setNqlCode(nqlCode);
}
async saveNqlCode(){
  await this.currentNqlCode.save();
  this.loadDevNqlCode();
}
editNqlCode(nql){
  this.editObject.setEditObject(nql);
}
runNqlCode(){
  this.hasError = false;
  this.errorMessage = "";
  let sql = this.content;
  // let params = [];
  this.http.post(localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select",{sql:sql},{
    headers:new HttpHeaders({
      "Content-Type":"application/json"
    }),
    withCredentials: false
  }).subscribe(result=>{
    if(result&&(result as any).code == 200){
      let data:any = (result as any).data;
      this.dataTableHeaders = Object.keys(data[0]);
      this.dataTableData = data;
    }
  },(err)=>{
    this.hasError = true;
    this.errorMessage = err.error.mess
  })
}
updateTitle(demo,title){
  demo.set("title",title);
}
updateContent(content){
  this.currentNqlCode.set("content",content);
  this.content = content;
}
doubleClickTab(tab){
  if(tab&&tab.id){
    this.titleEditMap[tab.id] = true
  }else{
    this.titleEditMap['new'] = true
  }
}
setNqlCode(demo,atNewTab?){
  let existsIndex = this.NqlCodeTabs.findIndex(titem=>titem.id == demo.id);
  if(atNewTab){
    if(existsIndex<0){
      this.NqlCodeTabs.push(demo);
    }
  }
  this.showEditor = false;
  this.currentNqlCode = demo;
  this.content = this.currentNqlCode.get('content');
  this.showEditor = true;
  if(existsIndex<0){
    this.NqlSelectedIndex = this.NqlCodeTabs.length;
  }else{
    this.NqlSelectedIndex = existsIndex;
  }
  this.cdRef.detectChanges();
}
async loadDevNqlCode(){
  let query = new Parse.Query("DevNqlCode");
  query.addDescending("updatedAt");
  this.demos = await query.find();
}
  async refreshAllData(){
    // 加载Schemas
    this.schemas = await this.cloud.getSchemas();
    let schemaList:Array<any> = Object.values(this.schemas);
    schemaList.sort((a,b)=>{
      if(a.schemaName.startsWith("_")){
        return -1
      }
      return a.schemaName>b.schemaName?1:-1
    });
    this.schemaList = schemaList
    this.schemaListDisplay = this.schemaList

    // 加载案例库
    this.loadDevNqlCode()

    // 初始SQL
    this.newNqlTab();

    // 加载编辑器配置
    // - options passed to the CodeMirror instance see http://codemirror.net/doc/manual.html#config
    this.cmOptions = {
      lineNumbers: true,
      mode: 'text/x-pgsql',
      theme: "monokai",
      // theme: "material",
      extraKeys: {
        // 'Ctrl': 'autocomplete', // 提示快捷键
        Tab: function (cm) {
            const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
            cm.replaceSelection(spaces);
        }
      }
  }

    // 加载查询数据
    this.listOfData = new Array(200).fill(0).map((_, index) => {
      return {
        id: index,
        name: `Edward King ${index}`,
        age: 32,
        address: `London, Park Lane no. ${index}`
      };
    });
    
    // 刷新页面数据
    this.refresh();
  }

  listOfData: Array<any> = [];
}
