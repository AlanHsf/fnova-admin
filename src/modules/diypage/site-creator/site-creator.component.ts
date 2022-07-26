import { Component, OnInit,ViewChild,TemplateRef } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import * as Parse from "parse";

@Component({
  selector: 'app-site-creator',
  templateUrl: './site-creator.component.html',
  styleUrls: ['./site-creator.component.scss']
})
export class SiteCreatorComponent implements OnInit {
  value = "ng";
  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { value: string };
    drawerRef: NzDrawerRef<string>;
  }>;
  // 页面布局控件相关
  drawer:any;   

  // 主题及页面相关信息
  themes:Array<any>;
  pages:Array<any>;
  blocksPanels = [
	{
		name:"布局",
		active:true,
		type:"layout",
		blocks:[
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`},
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`},
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`},
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`}
		]
	},
	{
		name:"布局",
		active:true,
		type:"layout",
		blocks:[
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`},
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`},
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`},
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`}
		]
	},
	{
		name:"布局",
		active:true,
		type:"layout",
		blocks:[
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`},
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`},
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`},
			{name:"整行",type:"row",html:`<div class="row" style="background:#CCC;min-height:200px"></div>`}
		]
	}
  ]

  // 当前加载页面信息
  htmlHeader:string;
  htmlFooter:string;
  htmlBlocks:Array<any>;
  htmlOutput:string;

  constructor(private drawerService: NzDrawerService) { 
    localStorage.setItem("hiddenMenu","true")
  }

  async ngOnInit() {
    // this.rendHTML()
	await this.loadThemes();
	this.openMenu();
  }

  async loadThemes(){
	let query = new Parse.Query("SiteTheme")
	this.themes = await query.find();
	console.log(this.themes)
  }

  openMenu(): void {
    const drawerRef = this.drawerService.create({
      // nzTitle: '站点编辑器',
      // nzFooter: 'Footer',
      nzPlacement:'right',
	  nzWidth:600,
      nzContent: this.drawerTemplate,
      nzContentParams: {
        value: this.value
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
    });

	this.drawer = drawerRef
  }

  closeMenu(): void {
	this.drawer.close();
    // this.visible = false;
  }

  // blue http://www.cssmoban.com/preview/index.html?url=http://106.12.254.207/cssthemes6/skk-0719-14/index.html&id=25999&tid=20125072756579&userdata=463009
  // app http://www.cssmoban.com/preview/index.html?url=http://106.12.254.207/cssthemes6/skk-0722-3/index.html&id=26089&tid=20125072756579
  // prigo http://www.cssmoban.com/preview/index.html?url=http://106.12.254.207/cssthemes6/skk-0723-6/index.html&id=26126&tid=20125072756579
  async rendHTML(theme?){
	this.pages = null
	let currentPage = null;

	if(theme){
		let query = new Parse.Query("SitePage");
		query.equalTo("theme",theme.id);
		this.pages = await query.find();
		currentPage = this.pages[0];
	}
	console.log(theme)
	console.log(this.pages)
	
	// 加载页面信息
	// 加载页头
    this.htmlHeader = ""
	if(theme){
		this.htmlHeader = theme.get("htmlHeader");
	}
	if(currentPage&&currentPage.get("htmlHeader")&&currentPage.get("htmlHeader").length>0){
		this.htmlHeader = currentPage.get("htmlHeader")
	}
	// 加载内容
    this.htmlBlocks = []
	if(currentPage){
		this.htmlBlocks = currentPage.get("blocks")
	}

	// 加载页脚
    this.htmlFooter = ""
	if(theme){
		this.htmlFooter = theme.get("htmlFooter")
	}
	if(currentPage&&currentPage.get("htmlFooter")&&currentPage.get("htmlFooter").length>0){
		this.htmlFooter = currentPage.get("htmlFooter")
	}
    this.htmlOutput = ``

	// 渲染页头
	// Insert Link to head
    let head = document.getElementsByTagName("head")[0]
    head.insertAdjacentHTML("beforeend",this.htmlHeader)

	// Insert Link to Head with El
	// let linkStr = this.htmlHeader
	// linkStr.replace(/<link.*href="([^"]*)".*>/g,(match,captureHref)=>{
	// 	let linkElement = document.createElement('link'); 
	// 	linkElement.setAttribute('rel', 'stylesheet');
	// 	linkElement.setAttribute('href', captureHref);
	// 	linkElement.onload = ()=>{
	// 		console.log(captureHref," loaded")
	// 	}
	// 	document.body.appendChild(linkElement); 
	// 	return ""
	// })


	// 渲染内容
    // let bodyarea = document.getElementById("bodyarea")
    // bodyarea.style.all = ""
    // bodyarea.classList.add("active")

    let htmlContent = ""
    this.htmlBlocks.forEach(block=>{
      htmlContent += block.html
    })

    this.htmlOutput = this.htmlHeader + htmlContent

	let bodyAreaEl = document.getElementsByClassName("bodyarea")[0]
	bodyAreaEl.innerHTML = this.htmlOutput;

	// 渲染页脚
    // let body = document.getElementsByTagName("body")[0]
    // body.insertAdjacentHTML("beforeend",this.htmlFooter)
	let scriptStr = this.htmlFooter
	scriptStr.replace(/<script.*src="([^"]*)".*script>/g,(match,captureSrc)=>{
		let scriptEl = document.createElement('script'); 
		scriptEl.src = captureSrc; 
		scriptEl.onload = ()=>{
			console.log(captureSrc," loaded")
		}
		document.body.appendChild(scriptEl); 
		return ""
	})

	this.pluginBlockSelect();
	this.pluginGridDragDrop();

	this.drawer.close();
  }


  pluginBlockSelect(){
	// 区块选择标记：
		// 内容区块 section? > .container .row > col-xx-xx 
		// 
  }
  pluginGridDragDrop(){
	let bodyAreaEl = document.getElementsByClassName("bodyarea")[0]
	bodyAreaEl.addEventListener("ondrop",ev=>{
		console.log(ev)
	})
	bodyAreaEl.addEventListener("ondragover",ev=>{
		console.log(ev)
	})
  }

}
