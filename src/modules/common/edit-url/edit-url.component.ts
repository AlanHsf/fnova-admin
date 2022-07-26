import {
  Component, OnInit, Input,
  Output,
  EventEmitter,
} from '@angular/core';
import * as Parse from "parse";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Component({
  selector: 'app-edit-url',
  templateUrl: './edit-url.component.html',
  styleUrls: ['./edit-url.component.scss']
})
export class EditUrlComponent implements OnInit {
  @Output("onUrlChange") onUrlChange = new EventEmitter<any>();
  @Input("url") url: any = "";
  constructor(private notification: NzNotificationService,) { }

  show: boolean = false;
  type: string = 'module'
  company: string = ""
  shopCate: any = []
  diypage: any = []
  goodsItem: any = []
  articleCate: any = []
  articleItem: any = []
  lessonCate: any = []
  lessonItem: any = []
  selectid: string = ""
  ngOnInit() {
    this.company = localStorage.getItem('company')
  }

  showModal() {
    this.show = true
  }

  handleOk(): void {
    this.show = false;
    this.onUrlChange.emit(this.url)
  }
  changeURL(e) {
    this.onUrlChange.emit(this.url)
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.show = false;
  }

  async changType(type) {
    this.type = type
    if (type == 'diypage') {
      await this.queryDiypage()
    }
    if (type == 'shop') {
      this.shopCate = await this.queryCategory('shop')
      await this.queryShopGoods()
    }

    if (type == 'article') {
      this.articleCate = await this.queryCategory('article')
      
      await this.queryArticle()
    }

    if (type == 'lesson') {
      this.lessonCate = await this.queryCategory('lesson')
      await this.queryLesson()
    }
  }

  changeUrl(url?) {
    if (url) {
      this.url = url
    } else {
      this.notification.create(
        "warning",
        "模块暂未开发",
        "模块正在测试中，敬请期待"
      );
    }
  }

  changeDiypageUrl(item) {
    this.url = "/nova-diypage/pages/index/index?id=" + item.id
  }


  async queryDiypage() {
    let DiyPage = new Parse.Query('DiyPage')
    DiyPage.equalTo('company', this.company)
    DiyPage.select('name')
    let diypage = await DiyPage.find()
    if (diypage) {
      this.diypage = diypage
    }
  }

  async queryCategory(type) {
    let Category = new Parse.Query('Category')
    Category.equalTo('type', type)
    Category.equalTo('company', this.company)
    Category.select('objectId', 'name')
    let cates = await Category.find()
    if (cates) {
      return cates
    }
  }

  async queryShopGoods(cid?, name?) {
    let ShopGoods = new Parse.Query('ShopGoods')
    ShopGoods.equalTo('company', this.company)
    if (cid) {
      ShopGoods.equalTo('category', cid)
    }
    if (name) {
      ShopGoods.contains('name', name)
    }
    ShopGoods.select('objectId', 'name')
    let goods = await ShopGoods.find()
    if (goods && goods.length > 0) {
      this.goodsItem = goods
    }
  }


  async queryArticle(cid?, name?) {
    let Article = new Parse.Query('Article')
    Article.equalTo('company', this.company)
    if (cid) {
      Article.equalTo('category', cid)
    }
    if (name) {
      Article.contains('title', name)
    }
    Article.select('objectId', 'title')
    let articles = await Article.find()
    if (articles && articles.length > 0) {
      this.articleItem = articles
      console.log(this.articleItem)
    }
  }


  async queryLesson(cid?, name?) {
    let Lesson = new Parse.Query('Lesson')
    Lesson.equalTo('company', this.company)
    if (cid) {
      Lesson.equalTo('category', cid)
    }
    if (name) {
      Lesson.contains('title', name)
    }
    let lessons = await Lesson.find()
    if (lessons && lessons.length > 0) {
      this.lessonItem = lessons
    }
  }

  selectCate(item, type) {
    console.log(item)
    this.selectid = item.id
    // 分类商品
    let url = ''
    console.log(type)

    if (type == 'shop') {
      url = `/nova-shop/pages/shop-list/index?title=${item.get('name')}&cid=${item.id}`
      this.queryShopGoods(item.id)

    }
    if (type == 'article') {
      url = `/common-page/pages/cates/article-list/index?title=${item.get('name')}&cid=${item.id}`
      this.queryArticle(item.id)
    }

    if (type == 'lesson') {
      this.queryLesson(item.id)

    }
    this.url = url

  }

  selectItem(item, type) {
    console.log(item)
    this.selectid = item.id
    // 单个商品
    let url = ''
    if (type == 'shop') {
      url = "/nova-shop/pages/shop-goods/goods-detail/index?id=" + item.id
    }
    if (type == 'article') {
      url = "/common-page/pages/cates/article-detail/index?aid=" + item.id
    }

    if (type == 'lesson') {

    }

    this.url = url
  }

}
