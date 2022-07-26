import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as Parse from 'parse'
import { Router } from "@angular/router";
import { DiypageService } from '../diypage.service';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-diy-shop',
  templateUrl: './diy-shop.component.html',
  styleUrls: ['./diy-shop.component.scss']
})
export class DiyShopComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: string
  @Output() delete = new EventEmitter<any>()
  editType: string = 'style'
  selectPointerMap: any = {}
  constructor(public router: Router, public cdRef: ChangeDetectorRef, public diypageServ: DiypageService, private message: NzMessageService) { }
  groupStyle: any;
  goodStyle: any;
  routeFields: any = {};// 商品管理 路由字段配置
  classRouteId: string = '3l2G5EfIye';// 商品管理routeId
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
    console.log(this.block)
    if (list.length) {
      this.block.data.list = []
      list.forEach((goods, index) => {
        let item = null
        item = {
          image: goods.get('image'),
          name: goods.get('name'),
          desc: goods.get('desc'),
          tag: goods.get('tag'),
          price: goods.get('price'),
          sales: goods.get('sales'),
          originalPrice: goods.get('originalPrice'),
          url: "/nova-shop/pages/shop-goods/goods-detail/index?id=" + goods.id,
        }
        this.block.data.list.push(item)
      })
    }
    console.log(456, this.block.data.list)
  }
  initStyle() {
    this.groupStyle = {
      'background-color': this.block.style.background,
      margin: this.block.style.areaMargin.top + 'px ' +
        this.block.style.areaMargin.right + 'px ' +
        this.block.style.areaMargin.bottom + 'px ' +
        this.block.style.areaMargin.left + 'px'
    }
    this.goodStyle = {
      'background-color': this.block.style.shopBackground,
      width: this.block.style.width + '%',
      height: this.block.style.height + 'px',
      'border-radius': this.block.style.borderRadius + 'px',
      margin:
        this.block.style.margin.top + 'px' +
        this.block.style.margin.right + 'px' +
        this.block.style.margin.bottom + 'px' +
        this.block.style.margin.left + 'px',
      padding:
        this.block.style.padding.top + 'px' +
        this.block.style.padding.right + 'px' +
        this.block.style.padding.bottom + 'px' +
        this.block.style.padding.left + 'px'
    }
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

  async searchPointer(e, item) {
    let Schame = new Parse.Query(item.className)
    let searchString
    if (e) {
      searchString = String(e);
      Schame.contains("name", searchString);
    }
    if (item.filter) {
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
    console.log(123, this.selectPointerMap)
  }
  deleteBlock() {
    this.delete.emit(this.index)
  }
  typeChange(e) {
    this.editType = e
  }
  columnChange(e) {
    console.log(e);
    switch (e) {
      case 'one':
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
  objectMap(item) {
    return Object.keys(item)
  }
  addShop() { // /common/manage/ShopGoods;equalTo=types:goods;rid=z2N3ajGw41
    this.router.navigate(["common/manage/ShopGoods", {
      rid: '3l2G5EfIye',
      equalTo: "types:goods",
      type: "back-diypage"
    }])
  }
  saveFilter() {
    this.initSource()
  }
}
