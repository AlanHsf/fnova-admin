import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Parse from 'parse'
import { DiyStyleService } from '../diystyles.service';

@Component({
  selector: 'app-diy-multipleimg',
  templateUrl: './diy-multipleimg.component.html',
  styleUrls: ['./diy-multipleimg.component.scss']
})
export class DiyMultipleimgComponent implements OnInit {

  constructor(private styleServ: DiyStyleService) { }
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: any
  @Output() delete = new EventEmitter<any>()
  editType: string = 'style'
  ngOnInit() {
    console.log(this.block)
  }

  options = []
  async changeclassName(e) {
    let company = localStorage.getItem('company')
    let Schame = new Parse.Query(e)
    Schame.equalTo('company', company)
    Schame.descending('createdAt')
    Schame.limit(10)
    let Objects = await Schame.find()
    if (Objects && Objects.length > 0) {
      this.options = Objects
    }
    console.log(this.options)
  }

  deleteBlock() {
    this.delete.emit(this.index)
  }
  typeChange(e) {
    this.editType = e
  }

  async searchPointer(e, item) {
    let company = localStorage.getItem('company')
    let Schame = new Parse.Query(item.className)
    Schame.equalTo('company', company)
    Schame.descending('createdAt')
    if (e) {
      if (item.className == 'ShopGoods') {
        Schame.equalTo('name', e)
      } else {
        Schame.equalTo('title', e)
      }
    }

    Schame.limit(10)
    let Objects = await Schame.find()
    if (Objects && Objects.length > 0) {
      this.options = Objects
    }
  }

  changeObject(e, item, options?) {
    // item.name: e
    console.log(e, item, options)
    let index = options.findIndex(item => item.id == e);
    item.objectId = e
    console.log(e, item.objectId)
    if (item.className == 'ShopGoods') {
      item.name = options[index].get('name')
    } else {
      item.name = options[index].get('title')
    }
  }
  reset(block, field) {
    this.styleServ.reset(block, field)
  }

}
