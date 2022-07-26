import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as Parse from 'parse'
import { Router } from "@angular/router";
import { DiypageService } from '../diypage.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-diy-lessongroup',
  templateUrl: './diy-lessongroup.component.html',
  styleUrls: ['./diy-lessongroup.component.scss']
})
export class DiyLessongroupComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: string
  @Output() delete = new EventEmitter<any>()
  editType: string = 'style'
  gridStyle = {
    width: '100%',
    textAlign: 'center'
  };
  routeFields: any = {};// 课程管理 路由字段配置
  classRouteId: string = 'oX2m0eSNRo';// 课程管理routeId
  constructor(public router: Router, public cdRef: ChangeDetectorRef, public diypageServ: DiypageService, private message: NzMessageService) { }

  ngOnInit() {
    this.initData()
    console.log(this.type);

  }
  srcChange(e, type) {
    console.log(e, typeof e);
    this.block[type] = e
  }
  reset(field, type) {
    switch (type) {
      case 'color':
        this.block.style[field] = ''
        break;
      case 'margin':
        this.block.style[field] = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
        break;
      case 'padding':
        this.block.style[field] = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
        break;
      default:
        break;
    }
  }
  selectPointerMap: any = {}
  async initData() {
    let classRoute = await this.diypageServ.queryRoute(this.classRouteId)
    if (!classRoute || !classRoute.id) {
      this.message.error('schema指定路由错误');
    } else {
      classRoute.get('editFields')?.map(field => this.routeFields[field.key] = field);
    }
    console.log(classRoute, this.routeFields);
    this.getList()
  }
  async getList() {
    let list = await this.diypageServ.initSource(this.block)
    if (list.length) {
      this.block.data.list = []
      list.forEach((goods, index) => {
        let item = null
        item = {
          image: goods.get('image'),
          name: goods.get('title'),
          teacherName: goods.get('teacher'),
          desc: goods.get('desc'),
          tag: goods.get('tag'),
          price: goods.get('price'),
          originalPrice: goods.get('originalPrice'),
          url: "/nova-shop/pages/shop-goods/goods-detail/index?id=" + goods.id,
        }
        this.block.data.list.push(item)
      })
    }
  }
  async initSource(init?) {
    let Lesson = new Parse.Query('Lesson')
    let filter = this.block.data.filter
    console.log(filter)
    let keyArr = Object.keys(filter)
    Lesson.equalTo('company', localStorage.getItem('company'))
    keyArr.forEach(key => {
      console.log(key)
     
      filter[key].forEach(f => {
        if (f.type == "Boolean" && f.isOpen) {
          console.log(111, f)
          Lesson[key](f.key, f.value)
        }
        if (f.type == 'String' && f.value) {
          Lesson[key](f.key, f.value)
        }
        if (f.type == 'Pointer' && f.value) {
          Lesson[key](f.key, f.value)
        }
        if (f.type == 'Array' && f.value && f.value.length > 0) {
          Lesson[key](f.key, f.value)
         
        }
      })
    });
    let shopGoods = await Lesson.find()
    console.log(shopGoods)
    if (shopGoods.length > 0) {
      this.block.data.list = []
      shopGoods.forEach((goods, index) => {
        let item = null
        item = {
          image: goods.get('image'),
          name: goods.get('name'),
          teacherName: goods.get('teacherName'),
          desc: goods.get('desc'),
          tag: goods.get('tag'),
          price: goods.get('price'),
          originalPrice: goods.get('originalPrice'),
          url: "/nova-shop/pages/shop-goods/goods-detail/index?id=" + goods.id,
        }
        this.block.data.list.push(item)
     
        
      })
    } else {
      if (!init) {
        this.block.data.list = [
          {
            "key": "status",
            "name": "是否上架",
            "value": true,
            "isOpen": true,
            "type": "Boolean"
          },
          {
            "key": "isHot",
            "name": "是否推荐",
            "value": true,
            "isOpen": false,
            "type": "Boolean"
          },
          {
            "key": "types",
            "name": "课程分类",
            "value": "",
            "type": "select"
          },
          {
            "key": "category",
            "name": "所属分类",
            "className": "Category",
            "value": "",
            "type": "Pointer"
          }
        ]
      }

    }

  }
  options = []
  async changeTypes(e) {
    let company = localStorage.getItem('company')
    let Schame = new Parse.Query('Lesson')
    Schame.equalTo('company', company)
    Schame.equalTo('types', e)
    Schame.descending('createdAt')
    Schame.limit(10)
    let Objects = await Schame.find()
    if (Objects && Objects.length > 0) {
      this.options = Objects
    }
    console.log(this.options)
  }
  async searchPointer(e, item) {
    let Schame = new Parse.Query(item.className)
    let searchString
    if (e) {
      searchString = String(e);
      Schame.contains("name", searchString);
    }
    if(item.filter) {
      item.filter.forEach(f => {
          Schame[f.fun](f.key, f.value)
      })
   }
    Schame.equalTo('company', localStorage.getItem('company'))
    Schame.select('name')
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
  objectMap(item) {
    return Object.keys(item)
  }
  addLesson() { // /common/manage/ShopGoods;equalTo=types:goods;rid=z2N3ajGw41
    this.router.navigate(["common/manage/Lesson", {
      rid: 'oX2m0eSNRo',
      // equalTo: "types:goods",
      type: "back-diypage"
    }])
  }
  saveFilter() {
    this.getList()
  }

  columnChange(e) {
    console.log(e);

    switch (e) {
      case 'one':
        this.block.showTeacher = "true"
        this.block.showButton = "true"
        this.block.showPrice = "true"
        this.block.style.width = 96
        this.block.style.height = 160
        this.block.style.margin = {
          top: 4,
          right: 0,
          bottom: 4,
          left: 5
        }
        this.block.style.padding = {
          top: 4,
          right: 10,
          bottom: 4,
          left: 10
        }
        this.block.style.imgwidth = 145
        this.block.style.imgheight = 134
        this.block.style.imgmarginRight = 10
        break;
      case 'two':
        this.block.showTeacher = "false"
        this.block.showButton = "false"
        this.block.showPrice = "false"
        this.block.style.width = 47
        this.block.style.height = 245
        this.block.style.margin = {
          top: 4,
          right: 5,
          bottom: 4,
          left: 5
        }
        this.block.style.padding = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
        this.block.style.imgwidth = 160
        this.block.style.imgheight = 160
        this.block.style.imgmarginRight = 0
        break;
      default:
        break;
    }

  }
  typeChange(e) {
    this.editType = e
  }
}
