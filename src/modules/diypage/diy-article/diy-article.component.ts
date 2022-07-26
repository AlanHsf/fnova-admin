import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as Parse from 'parse'
import { DiypageService } from '../diypage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from "@angular/router";
import { DiyStyleService } from '../diystyles.service';

@Component({
  selector: 'app-diy-article',
  templateUrl: './diy-article.component.html',
  styleUrls: ['./diy-article.component.scss']
})
export class DiyArticleComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: string
  @Output() delete = new EventEmitter<any>()
  editType: string = 'style'
  selectPointerMap: any = {}
  constructor(public router: Router,
    public cdRef: ChangeDetectorRef,
    public diypageServ: DiypageService,
    private message: NzMessageService,
    private styleServ: DiyStyleService
  ) { }
  groupStyle: any;
  goodStyle: any;
  routeFields: any = {};// 文章管理
  classRouteId: string = 'toRZC9b3F2';// 商品管理routeId

  ngOnInit() {
    this.initData()
  }

  async initData() {
    let classRoute = await this.diypageServ.queryRoute(this.classRouteId)
    if (!classRoute || !classRoute.id) {
      this.message.error('schema指定路由错误');
    } else {
      classRoute.get('editFields')?.map(field => this.routeFields[field.key] = field);
    }
    console.log(classRoute, this.routeFields);
    this.initSource()
  }

  async initSource() {
    let list = await this.diypageServ.initSource(this.block)
    if (list.length) {
      this.block.data.list = []
      list.forEach((article, index) => {
        let item = null
        item = {
          image: article.get('image'),
          title: article.get('title'),
          tag: article.get('tag'),
          likeCount: article.get('likeCount') || 0,
          pageView: article.get('pageView') || 0,
          author_name: article.get('author_name'),
          url: "/nova-shop/pages/article/index?id=" + article.id,
        }
        this.block.data.list.push(item)
        console.log(this.block.data.list);
      })
    }
  }

  async searchPointer(e, item) {
    let Schame = new Parse.Query(item.className)
    let searchString
    if (e) {
      searchString = String(e);
      Schame.contains("name", searchString);
    }
    Schame.equalTo('company', localStorage.getItem('company'))
    if (item.filter) {
      item.filter.forEach(f => {
        Schame[f.fun](f.key, f.value)
      })
    }
    let schame = await Schame.find()
    if (schame && schame.length > 0) {
      this.selectPointerMap[item.key] = {
        options: schame,
        show: true
      }
      this.cdRef.detectChanges()
    }
    console.log(this.selectPointerMap)
  }
  deleteBlock() {
    this.delete.emit(this.index)
  }
  typeChange(e) {
    this.editType = e
  }

  objectMap(item) {
    return Object.keys(item)
  }
  addArticle() {
    this.router.navigate(["common/manage/ShopGoods", {
      rid: '3l2G5EfIye',
      equalTo: "types:goods",
      type: "back-diypage"
    }])
  }
  saveFilter() {
    this.initSource()
  }
  reset(block, field) {
    this.styleServ.reset(block, field)
  }

}
