import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as Parse from 'parse'
import { DiypageService } from '../diypage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from "@angular/router";
import { DiyStyleService } from '../diystyles.service';
@Component({
  selector: 'app-diy-seckill',
  templateUrl: './diy-seckill.component.html',
  styleUrls: ['./diy-seckill.component.scss']
})
export class DiySeckillComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: string
  @Output() delete = new EventEmitter<any>()
  editType: string = 'style'
  constructor(public cdRef: ChangeDetectorRef,
    public diypageServ: DiypageService,
    private message: NzMessageService,
    private styleServ: DiyStyleService
  ) { }


  async ngOnInit() {
    await this.initData()
  }
  async initData() {
    await this.initSource()
  }

  async initSource() {
    let list = await this.diypageServ.initSource(this.block)
    if (list.length) {
      this.block.data.list = []
      list.forEach((goods, index) => {
        let item = null
        item = {
          image: goods.get('goods').get('image'),
          name: goods.get('goods').get('name'),
          desc: goods.get('goods').get('desc'),
          price: goods.get('goods').get('costPrice'), //折扣价
          original: goods.get('goods').get('price'),
          total: goods.get('goods').get('total'),
          time: goods.get('endTime')
        }
        this.block.data.list.push(item)
        console.log(this.block.data.list);
      })
    }
  }

  deleteBlock() {
    this.delete.emit(this.index)
  }

  templateChange(e) {
    this.block.style.seckillMargin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
    this.block.style.seckillPadding = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
    switch (e) {

      case "template2":
        this.block.style.seckillWidth = 49
        break;
      case "template3":
        this.block.style.seckillWidth = 33
        break;
      case "template6":
        this.block.style.seckillWidth = 40
        break;

      default:
        this.block.style.seckillWidth = 100
        break;
    }
  }

  typeChange(e) {
    this.editType = e
  }
  showDiscount(original, price) {
    return (original - price).toFixed(2)
  }
  objectMap(item) {
    return Object.keys(item)
  }

  saveFilter() {
    this.initSource()
  }


  reset(block, field) {
    this.styleServ.reset(block, field)
  }

}
