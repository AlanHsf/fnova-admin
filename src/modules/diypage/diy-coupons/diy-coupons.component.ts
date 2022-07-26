import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { listenerCount } from 'cluster';

import * as Parse from 'parse'
import { DiypageService } from '../diypage.service';
@Component({
  selector: 'app-diy-coupons',
  templateUrl: './diy-coupons.component.html',
  styleUrls: ['./diy-coupons.component.scss']
})
export class DiyCouponsComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Output() delete = new EventEmitter<any>()
  @Input('type') type: string

  editType: string = 'style'
  selectPointerMap: any = {}
  radioValue = 'row1';
  gridStyle = {
    width: '100%',
    textAlign: 'center'
  };
  constructor(public cdRef: ChangeDetectorRef, public diypageServ: DiypageService,) { }

  async ngOnInit() {
    console.log(this.block);
    await this.initSource()
  }


  async initSource() {
    let list = await this.diypageServ.initSource(this.block)
    if (list.length) {
      this.block.data.list = []
      console.log(list)
      list.forEach((coupon, index) => {
        let item = null
        item = {
          discount: coupon.get('discount'),
          name: coupon.get('name'),
          type: coupon.get('type'),
        }
        this.block.data.list.push(item)
      })
      console.log(this.block.data.list)
    }
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
      case 'borderRadius':
        this.block.style[field] = 0
        break;

      default:
        break;
    }
  }
  typeChange(e) {
    this.editType = e
  }
  deleteBlock() {
    this.delete.emit(this.index)
  }

  objectMap(item) {
    return Object.keys(item)
  }

  async searchPointer(e, item) {
    let Schame = new Parse.Query(item.className)
    let searchString
    if (e) {
      searchString = String(e);
      Schame.contains("name", searchString);
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
  }

  onChangRadio(vla) {
    console.log(vla);
  }
  saveFilter() {
    this.initSource()
  }
}
