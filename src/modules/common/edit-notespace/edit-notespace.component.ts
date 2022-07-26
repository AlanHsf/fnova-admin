import * as Parse from "parse";

import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser"
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ChangeDetectorRef } from "@angular/core";
import { EditObjectComponent } from "../../common/edit-object/edit-object.component";
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { combineLatest } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { parse } from "path";
import { concatMap } from "rxjs/operators";
import { query } from "@angular/animations";
import { HttpClient,HttpHeaders } from "@angular/common/http"; //引入http服务

/**
 * File node data with nested structure.
 * Each node has a filename, and a type or a list of children.
 */
export class FileNode {
  order: string;
  objectId: string;
  data: ParseObject;
  type?: any;
  children?: FileNode[];
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  constructor(
    public expandable: boolean,
    public filename: string,
    public level: number,
    public type: any,
    public order: string,
    public data?: ParseObject
  ) { }
}

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
  }
}

/**
 * @title Tree with flat nodes
 */

@Component({
  selector: 'app-edit-notespace',
  templateUrl: './edit-notespace.component.html',
  styleUrls: ['./edit-notespace.component.scss'],
  providers: [FileDatabase]
})

export class EditNotespaceComponent implements OnInit {

  @Input("noteSpace") noteSpace: any;
  @ViewChild(EditObjectComponent, { static: true }) editObject: EditObjectComponent;


  // 文件夹存放类
  dataList: any = []
  currentIndex: any;

  getParentArtcile() {
    console.log(this.dataList.filter(item => !item.get("parent")))
    return this.dataList.filter(item => !item.get("parent"))
  }
  hasChildArticle(pid) {
    let children = this.dataList.find(item => {
      if (pid == (item.get("parent") && item.get("parent").id)) {
        return item
      }
    })
    if (children != undefined) {
      return true
    } else {
      return false
    }
  }
  getChildArticle(pid) {
    let children = this.dataList.filter(item => {
      if (pid == (item.get("parent") && item.get("parent").id)) {
        return item
      }
    })
    if (children != undefined) {
      return children
    } else {
      return false
    }
  }

  //文章
  articleList: any = [];


  // 添加标题
  newTitle: string;

  // 渲染文件夹
  dataAll: any = []

  padUrl: any;
  //要移动的title
  moveTile: string;
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  expandedNodeSet = new Set<string>();

  dragging = false;
  expandTimeout: any;
  expandDelay = 1000;

  isVisible = false;

  pSort: string
  selectedNoteType:string = "md"
  // 添加提示
  async showConfirm(id, title) {
    this.selectedNoteType = "md"
    console.log(id)
    console.log(this.currentIndex)

    console.log(title)
    if (id) {
      let noteId = this.noteId
      this.noteId = noteId
      let queryParent = new Parse.Query("NotePad")
      queryParent.equalTo("objectId", noteId)
      let delParent = await queryParent.first()
      console.log(delParent)
      if (delParent) {
        this.pSort = `“${delParent.get("title")}”`
      } else {
        this.pSort = '文件夹标题'
      }
    } else {
      this.pSort = '文件夹标题'
    }


    this.isVisible = true;

    // if (this.noteId != undefined) {
    //   let queryParent = new Parse.Query("NotePad")
    //   queryParent.equalTo("objectId", this.noteId)
    //   queryParent.doesNotExist("parent")
    //   let delParent = await queryParent.first()
    //   console.log(delParent)
    //   if (delParent) {
    //     this.pSort = `“${delParent.get("title")}”`
    //   }else{
    //     this.pSort = '文件夹标题'
    //   }
    // }else{
    //   this.pSort = '文件夹标题'
    // }
    // this.isVisible = true;
  }

  handleCancel(): void {
    console.log('已取消');
    this.isVisible = false;
  }

  // 添加
  async addFileNode() {
    if (this.newTitle == undefined || this.newTitle.trim() == '') {
      this.message.create('error', '请输入标题');
      return
    }

    if(!(this.selectedNoteType == "md" || this.selectedNoteType == "pad")){
      this.message.create('error', '暂不支持该笔记格式');
    }

    let NotePad = Parse.Object.extend("NotePad");
    let pad = new NotePad();
    pad.set("type",this.selectedNoteType);
    if (this.noteId != undefined) {
      let queryParent = new Parse.Query("NotePad")
      queryParent.equalTo("objectId", this.noteId)
      // queryParent.doesNotExist("parent")
      let delParent = await queryParent.first()
      console.log(delParent)
      if (delParent) {
        pad.set("parent", {
          __type: "Pointer",
          className: "NotePad",
          objectId: this.noteId,
        })
        console.log("成功添加子笔记")
      }
    }
    let companyId = this.noteSpace.get("company") && this.noteSpace.get("company").toPointer() || localStorage.getItem("company")
    pad.set("title", this.newTitle)
    if (companyId) {
      pad.set("company", companyId);
    }
    pad.set("space", this.noteSpace.toPointer());
    let queryPad = new Parse.Query("NotePad")
    queryPad.equalTo("space", this.noteSpace.toPointer())
    queryPad.equalTo("parent", undefined)
    let listPad = await queryPad.find()
    console.log(listPad.length)
    if (listPad && listPad.length > 0) {
      pad.set("order", listPad.length);
    } else {
      pad.set("order", 0)
    }
    pad = await pad.save();
    // let note: FileNode={
    //   order: "0",
    //   objectId:"Applications",
    //   data: pad,
    // }
    // let data = JSON.parse(JSON.stringify(this.database.data));
    // let data = this.database.data;
    // console.log(data);
    // data.unshift(note);
    // data = this.sortByOrder(data);
    // this.database.dataChange.next(data);
    // data[note.objectId] = note
    // this.dataSource.ne
    // 添加后，加载该篇新文档
    this.refreshSpace();
    this.goEditNotePad(pad, null);
    this.isVisible = false;
    this.message.create('success', '创建成功');
    this.newTitle = undefined
    console.log("添加成功")
    this.noteId = undefined
  }

  async setNoteSpace(noteSpace) {
    this.noteSpace = noteSpace;
    console.log("loadNotePads")
    await this.loadNotePads();
  }
  sortByOrder(data) {
    return data.sort((a, b) => a > b ? -1 : 1)
  }

  // 删除提示
  async showDeleteConfirm(id = null, title = null) {
    let noteId = this.noteId
    let queryParent = new Parse.Query("NotePad")
    queryParent.equalTo("objectId", noteId)
    let delParent = await queryParent.first()
    console.log(delParent)
    this.modal.confirm({
      nzTitle: `您确定要删除 "${delParent.get("title")}" 这条笔记吗?`,
      nzOkText: '删除',
      nzOnOk: () => this.delFileNode(noteId),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('取消删除')
    });
    this.noteId = undefined
  }

  // 删除
  async delFileNode(id) {

    let queryPad = new Parse.Query("NotePad")
    let delPadID = await queryPad.get(id)
    if (delPadID) {
      delPadID.destroy()
    }
    this.refreshSpace();
    this.message.create('success', '删除成功');
  }

  // 点击空白处清空当前笔记数据
  clear(event) {
    console.log(event)

  }

  //左侧拖拽排序功能
  drop1(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dataAll, event.previousIndex, event.currentIndex);
    console.log(this.dataAll)
    let prv = this.dataAll[event.previousIndex]
    let cur = this.dataAll[event.currentIndex]

    // 两者间所有对象重新排序
    let startIndex = (event.previousIndex < event.currentIndex) ? event.previousIndex : event.currentIndex;
    let endIndex = (event.previousIndex > event.currentIndex) ? event.previousIndex : event.currentIndex;
    let diff = startIndex == event.previousIndex ? 0 : -0;
    for (let index = startIndex; index < endIndex + 1; index++) {
      // if(index==event.previousIndex){continue}
      if (index == event.currentIndex) { continue }
      let padItem = this.dataAll[index];
      console.log(padItem.get("title"), index + diff)
      padItem.set("order", index + diff);
      padItem.save().then(data => { });

    }

    // 前者移动至指定序列
    // console.log(prv.get("title"),event.previousIndex+diff)
    // prv.set("order", event.previousIndex+diff)
    // prv.save().then(data=>{});

    console.log(cur.get("title"), event.currentIndex)
    cur.set("order", event.currentIndex)
    cur.save().then(data => { });
    console.log(this.getParentArtcile())
  }





  loadNotePads() {
    // return new Promise((res,rej)=>{
    let query = new Parse.Query("NotePad")
    query.equalTo("company", this.noteSpace.get("company").toPointer());
    query.equalTo("space", this.noteSpace.toPointer());
    query.ascending("order")
    query.find().then(data => {
      this.dataList = data;

      this.dataAll = this.getParentArtcile()
      if (this.dataAll && this.dataAll.length > 0) {
        this.goEditNotePad(this.dataAll[0], null);
        console.log(this.dataAll[0])
      }
    })
  }

  isMenuShow = true;
  menuShow() {
    this.isMenuShow = !this.isMenuShow
  }
  goEditNoteSpace() {
    this.editObject.setEditObject(this.noteSpace);
  }
  noteTitle: string

  // 当前点击获取的id
  noteId: string
  currentNote: any
  saveTitle(ev) {
    console.log(ev);
    this.currentNote.set("title", this.noteTitle);
    this.currentNote.save();
  }
  async goEditNotePad(node, event) {
    console.log(node, event)
    event ? event.cancelBubble = true : ""
    let notePad: any
    if (node && node.id) {
      notePad = node
    } else {
      notePad = node
    }

    if (notePad.id == (this.currentNote && this.currentNote.id)) {
      console.log("same")
      return
    };

    let current = Parse.User.current();
    this.padUrl = undefined;
    this.noteTitle = notePad.get("title");

    this.currentNote = notePad;
    this.cdRef.detectChanges();
    let type = this.currentNote.get("type") || "pad"

    let isAuthed = false;
    let padUrl
    if(type=="md"){
      isAuthed = await this.guardNovaMdAuth()
      padUrl = `https://md.fmode.cn/${notePad.id}`
    }
    if(type=="pad"){
      padUrl = `https://pad.fmode.cn/p/${notePad.id}?showChat=false&showLineNumbers=true&lang=zh-cn&noColors=true&userName=${current.get("nickname")}`
    }

    if(!isAuthed) return false

    this.padUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(padUrl);
    let hidetBox: any = document.getElementById("editBox")
    hidetBox.style.display = 'none'
  }

  // NovaMD用户模拟登录与监听逻辑
  hasNovaMdLogined = false;
  async guardNovaMdAuth(){

    if(!this.hasNovaMdLogined){
      // 同步用户
      let authData:any = await this.checkNovaMdUser()
      // 模拟登录
      if(authData&&authData.email){
        let loginData = await this.loginNovaMdUser(authData)
        console.log(loginData)
      }
    }
    // 同步文章
    await this.checkNovaMdNote()
    return true
  }
  async checkNovaMdNote(){
    let headers: HttpHeaders = new HttpHeaders({});
    headers.append("Content-Type", "application/json");
    let current = Parse.User.current();

    return new Promise((resolve,reject)=>{
      let url = "https://server.fmode.cn/api/note/novamd/note"
      let current = Parse.User.current();
      this.http.post(url,{
        uid:current.id,
        nid:this.currentNote.id,
        title:this.currentNote.get("title") || "新的笔记"
      },{ headers: headers }).subscribe(data=>{
        resolve(data);
      },err => {
        reject(err);
      })
    })
  }
  async checkNovaMdUser(){
    let headers: HttpHeaders = new HttpHeaders({});
    headers.append("Content-Type", "application/json");

    return new Promise((resolve,reject)=>{
      let url = "https://server.fmode.cn/api/note/novamd/auth"
      let current = Parse.User.current();
      this.http.post(url,{
        uid:current.id
      },{ headers: headers }).subscribe(data=>{
        let tempres:any = data;
        resolve(tempres&&tempres.data);
      },err => {
        reject(err);
      })
    })
  }



  async loginNovaMdUser(authData){
    let body = `email=${authData.email.replace("@","%40")}&password=${authData.password}`

    fetch("https://md.fmode.cn/login", {
        "credentials": "include",
        "headers": {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "referrer": "https://md.fmode.cn/",
        "body": body,
        "method": "POST",
        "mode": "cors"
    });
    this.hasNovaMdLogined = true
    return true
    let headers: HttpHeaders = new HttpHeaders({});
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
    headers.append("Accept-Language", "en-US,en;q=0.5");

    return new Promise((resolve,reject)=>{
      let url = "https://md.fmode.cn/login"

      this.http.post(url,body,{ 
        headers: headers 
      }).subscribe(data=>{
        this.hasNovaMdLogined = true
        resolve(data);
      },err => {
        reject(err);
      })
    })
  }

  database: FileDatabase;
  ngOnInit() {

    this.route.paramMap.subscribe(async params => {
      console.log("路由")
      let spaceId = params.get("PobjectId");
      console.log(spaceId)
      if (spaceId) {
        let query = new Parse.Query("NoteSpace");
        this.noteSpace = await query.get(spaceId);
        console.log(this.noteSpace);
        this.refreshSpace();
      }
    })

  }
  handlerDatas(arr) {
    let obj = {};
    arr.forEach((item, index) => {
      let { city } = item;
      if (!obj[city]) {
        obj[city] = {
          city,
          children: []
        }
      }
      obj[city].children.push(item);
    });
    let data = Object.values(obj); // 最终输出
    console.log(data)
  }
  ngAfterViewChecked(): void {
    let editBox: any = document.getElementById("editBox")
    document.onclick = function (e) {
      if (editBox) {
        editBox.style.display = "none"
      }
    }
    // let submenu:any = document.querySelectorAll(".submenu")
    // let editBox:any = document.getElementById("editBox")
    // let that = this
    // let i:any
    // document.onclick = function(e){
    //   editBox.style.display = "none"
    // }
    //     for(let i = 0; i< submenu.length;i++){
    //       let id = submenu[i].getAttribute("id")
    //       submenu[i].oncontextmenu = function(e){
    //         //阻止默认事件
    //         console.log(that.currentIndex)
    //         e.preventDefault();
    //         if(e.button==2){
    //           that.currentIndex = i
    //           console.log(that.currentIndex)
    //           console.log(e)
    //           editBox.style.top =e.pageY +'px'
    //           editBox.style.left = e.offsetX + 'px'
    //           editBox.style.display = 'block'
    //         }else{
    //           editBox.style.display = 'none'
    //         }

    //         //弹窗
    //         // that.showConfirm(id)
    //   }
    // }
  }
  async clickMenu(event, id) {
    event ? event.cancelBubble = true : ""
    console.log(id)
    let editBox: any = document.getElementById("editBox")
    this.noteId = id
    console.log(this.noteId)
    event.preventDefault();
    if (event.button == 2) {
      console.log(event)
      editBox.style.top = event.pageY + 'px'
      editBox.style.left = event.offsetX + 'px'
      editBox.style.display = 'block'
      let quetit = new Parse.Query("NotePad")
      let istitle = await quetit.get(id)
      this.moveTile = istitle.get("title")
    } else {
      editBox.style.display = 'none'
    }
  }
  refreshSpace() {
    if (this.noteSpace && this.noteSpace.id) {
      setTimeout(() => {
        this.loadNotePads();
      }, 500);
    }
  }
  //移动
  move(id, title) {
    console.log(id, title)
    console.log(this.noteId)
    if (id == null || title == null) {
      let goMove = new Parse.Query("NotePad")
      goMove.equalTo("objectId", this.noteId)
      goMove.first().then(res => {
        if (res && res.id) {
          res.set("parent", {
            __type: "Pointer",
            className: "NotePad",
            objectId: null,
          })
          res.save().then(rep => {
            this.message.success("已移至最上级")
            this.refreshSpace()
          })
        }
      })
      return
    }
    if (this.noteId && this.noteId != id) {
      let goMove = new Parse.Query("NotePad")
      goMove.equalTo("objectId", this.noteId)
      goMove.first().then(res => {
        if (res && res.id) {
          res.set("parent", {
            __type: "Pointer",
            className: "NotePad",
            objectId: id,
          })
          res.save().then(rep => {
            this.message.success("已移动至 " + title)
            this.refreshSpace()
          })
        }
      })
    }
  }

  expandMap = {}
  // 判断是否展开
  toggleExpand(node) {
    console.log(node)
    console.log(this.treeControl.isExpanded(node))
    if (this.expandMap[node.data.id]) {
      this.expandMap[node.data.id] = false;
    } else {
      this.expandMap[node.data.id] = true;
    }
    this.cdRef.detectChanges();
  }

  parentExpand(pid) {
    if (!pid) {
      return true
    }
    if (pid) {
      return this.expandMap[pid] || false;
    }
  };
  constructor(database: FileDatabase,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private modal: NzModalService,
    private message: NzMessageService,
    private http: HttpClient
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.database = database;
    this.database.dataChange.subscribe(data => this.rebuildTreeForData(data));

    // let data:Array<FileNode> = [
    //   {"objectId":"Applications","order":"0/0","children":[{"objectId":"Calendar","order":"0/0/0","type":"app"},{"objectId":"Chrome","order":"0/0/1","type":"app"},{"objectId":"Webstorm","order":"0/0/2","type":"app"}]},
    //   {"objectId":"Documents","order":"0/1","children":[{"objectId":"angular","order":"0/1/0","children":[{"objectId":"src","order":"0/1/0/0","children":[{"objectId":"compiler","order":"0/1/0/0/0","type":"ts"},{"objectId":"core","order":"0/1/0/0/1","type":"ts"}]}]},
    //   {"objectId":"material2","order":"0/1/1","children":[{"objectId":"src","order":"0/1/1/0","children":[{"objectId":"button","order":"0/1/1/0/0","type":"ts"},{"objectId":"checkbox","order":"0/1/1/0/1","type":"ts"},{"objectId":"input","order":"0/1/1/0/2","type":"ts"}]}]}]},
    //   {"objectId":"Downloads","order":"0/2","children":[{"objectId":"October","order":"0/2/0","type":"pdf"},{"objectId":"November","order":"0/2/1","type":"pdf"},{"objectId":"Tutorial","order":"0/2/2","type":"html"}]},{"objectId":"Pictures","order":"0/3","children":[{"objectId":"Photo Booth Library","order":"0/3/0","children":[{"objectId":"Contents","order":"0/3/0/0","type":"dir"},{"objectId":"Pictures","order":"0/3/0/1","type":"dir"}]},{"objectId":"Sun","order":"0/3/1","type":"png"},{"objectId":"Woods","order":"0/3/2","type":"jpg"}]}
    // ]
    // this.database.dataChange.next(data)
  }

  transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(!!node.children, node.objectId, level, node.type, node.order, node.data);
  }
  private _getLevel = (node: FileFlatNode) => node.level;
  private _isExpandable = (node: FileFlatNode) => node.expandable;
  private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);
  hasChild = (_: number, _nodeData: FileFlatNode) => {
    // _nodeData.expandable
    if (!_nodeData || !_nodeData.data) {
      return false
    }
    // 这个位置报错
    if (_nodeData.data.get("parent")) {
      return false
    } else {
      return true
    }
  };

  /**
   * This constructs an array of nodes that matches the DOM,
   * and calls rememberExpandedTreeNodes to persist expand state
   */
  visibleNodes(): FileNode[] {
    this.rememberExpandedTreeNodes(this.treeControl, this.expandedNodeSet);
    const result = [];

    function addExpandedChildren(node: FileNode, expanded: Set<string>) {
      result.push(node);
      if (expanded.has(node.order)) {
        node.children.map(child => addExpandedChildren(child, expanded));
      }
    }
    this.dataSource.data.forEach(node => {
      addExpandedChildren(node, this.expandedNodeSet);
    });
    return result;
  }

  /**
   * Handle the drop - here we rearrange the data based on the drop event,
   * then rebuild the tree.
   * */
  drop(event: CdkDragDrop<string[]>) {
    // console.log('origin/destination', event.previousIndex, event.currentIndex);

    // ignore drops outside of the tree
    if (!event.isPointerOverContainer) return;

    // construct a list of visible nodes, this will match the DOM.
    // the cdkDragDrop event.currentIndex jives with visible nodes.
    // it calls rememberExpandedTreeNodes to persist expand state
    const visibleNodes = this.visibleNodes();

    // deep clone the data source so we can mutate it
    const changedData = JSON.parse(JSON.stringify(this.dataSource.data));

    // recursive find function to find siblings of node
    function findNodeSiblings(arr: Array<any>, order: string): Array<any> {
      let result, subResult;
      arr.forEach(item => {
        if (item.order === order) {
          result = arr;
        } else if (item.children) {
          subResult = findNodeSiblings(item.children, order);
          if (subResult) result = subResult;
        }
      });
      return result;
    }

    // remove the node from its old place
    const node = event.item.data;
    const siblings = findNodeSiblings(changedData, node.order);
    const siblingIndex = siblings.findIndex(n => n.order === node.order);
    const nodeToInsert: FileNode = siblings.splice(siblingIndex, 1)[0];

    // determine where to insert the node
    const nodeAtDest = visibleNodes[event.currentIndex];
    if (nodeAtDest.order === nodeToInsert.order) return;

    // determine drop index relative to destination array
    let relativeIndex = event.currentIndex; // default if no parent
    const nodeAtDestFlatNode = this.treeControl.dataNodes.find(n => nodeAtDest.order === n.order);
    const parent = this.getParentNode(nodeAtDestFlatNode);
    if (parent) {
      const parentIndex = visibleNodes.findIndex(n => n.order === parent.order) + 1;
      relativeIndex = event.currentIndex - parentIndex;
    }
    // insert node
    const newSiblings = findNodeSiblings(changedData, nodeAtDest.order);
    if (!newSiblings) return;
    newSiblings.splice(relativeIndex, 0, nodeToInsert);

    // rebuild tree with mutated data
    this.rebuildTreeForData(changedData);
  }

  /**
   * Experimental - opening tree nodes as you drag over them
   */
  dragStart() {
    this.dragging = true;
  }
  dragEnd() {
    this.dragging = false;
  }
  dragHover(node: FileFlatNode) {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
      this.expandTimeout = setTimeout(() => {
        this.treeControl.expand(node);
      }, this.expandDelay);
    }
  }
  dragHoverEnd() {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
    }
  }

  /**
   * The following methods are for persisting the tree expand state
   * after being rebuilt
   */

  rebuildTreeForData(data: any) {
    this.rememberExpandedTreeNodes(this.treeControl, this.expandedNodeSet);
    this.dataSource.data = data;
    this.forgetMissingExpandedNodes(this.treeControl, this.expandedNodeSet);
    this.expandNodesById(this.treeControl.dataNodes, Array.from(this.expandedNodeSet));
  }

  private rememberExpandedTreeNodes(
    treeControl: FlatTreeControl<FileFlatNode>,
    expandedNodeSet: Set<string>
  ) {
    if (treeControl.dataNodes) {
      treeControl.dataNodes.forEach((node) => {
        if (treeControl.isExpandable(node) && treeControl.isExpanded(node)) {
          // capture latest expanded state
          expandedNodeSet.add(node.order);
        }
      });
    }
  }

  private forgetMissingExpandedNodes(
    treeControl: FlatTreeControl<FileFlatNode>,
    expandedNodeSet: Set<string>
  ) {
    if (treeControl.dataNodes) {
      expandedNodeSet.forEach((nodeId) => {
        // maintain expanded node state
        if (!treeControl.dataNodes.find((n) => n.order === nodeId)) {
          // if the tree doesn't have the previous node, remove it from the expanded list
          expandedNodeSet.delete(nodeId);
        }
      });
    }
  }

  private expandNodesById(flatNodes: FileFlatNode[], ids: string[]) {
    if (!flatNodes || flatNodes.length === 0) return;
    const idSet = new Set(ids);
    return flatNodes.forEach((node) => {
      if (idSet.has(node.order)) {
        this.treeControl.expand(node);
        let parent = this.getParentNode(node);
        while (parent) {
          this.treeControl.expand(parent);
          parent = this.getParentNode(parent);
        }
      }
    });
  }

  private getParentNode(node: FileFlatNode): FileFlatNode | null {
    const currentLevel = node.level;
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }




  //改后的parse数据
  notepasecefind() {
    let NotePad = new Parse.Query("NotePad")
    // let parents = []
    // let articleList = []
    // let dataList = []
    // let newArr = []
    // let tempArr = []
    // NotePad.equalTo("company",this.noteSpace.get("company").toPointer())
    // NotePad.equalTo("space", this.noteSpace.toPointer());
    // NotePad.equalTo("isEnabled",true)
    NotePad.ascending("order")
    // NotePad.include("NotePad")
    NotePad.find().then(res => {
      this.dataList = res
    })
    this.dataAll = this.getParentArtcile()
    console.log(9999999)
    console.log(this.dataAll)
    console.log(this.getParentArtcile())

  }
  clickItem(e) {
    console.log(e)
    console.log(this)
  }
  openArtcle(id: string) {
    // console.log(id)
    // let NotePad = new Parse.Query("NotePad")

    // NotePad.equalTo("parent",id)
    // NotePad.ascending("order")
    // NotePad.find().then(res=>{
    //   console.log(res)
    //   console.log('获取数据')

    //   if(this.articleList.length){
    //     return
    //   }
    //   res.forEach((item)=>{
    //     let item1 = item.toJSON()

    //     this.articleList.push(item1)
    //   })
    //   console.log(this.articleList)

    // })
  }


  //分享
  shareNote(evt) {
    let link = `https://note.fmode.cn/notespace/note-center;objectId=${this.noteSpace.id}`
    console.log('12334')
    let oInput = document.createElement("input");
    oInput.setAttribute("value", link);
    oInput.setAttribute('readonly', 'readonly');
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    oInput.setSelectionRange(0, 9999); // 解决复制不到内容的问题
    document.execCommand("copy"); // 执行浏览器复制命令
    oInput.className = "oInput";
    oInput.style.display = "none";
    this.message.success("复制成功，粘贴分享给好友")
  }

}
