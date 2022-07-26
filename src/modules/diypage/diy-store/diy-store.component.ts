import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DiypageService } from '../diypage.service';
@Component({
  selector: 'app-diy-store',
  templateUrl: './diy-store.component.html',
  styleUrls: ['./diy-store.component.scss']
})
export class DiyStoreComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Output() delete = new EventEmitter<any>()
  @Input('type') type: string
  editType: string = 'style'
  radioValue = 'row1';
  gridStyle = {
    width: '100%',
    textAlign: 'center'
  };
  constructor(public diypageServ: DiypageService,) { }

  ngOnInit() {
    this.initSource();
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
  async initSource() {
    let list = await this.diypageServ.initSource(this.block)
    console.log(list)
    if (list.length > 0) {
      this.block.data.list = []
      list.forEach((shopStore, index) => {
        let item = null
        item = {
          storeName: shopStore.get('storeName'),
          address: shopStore.get('storeAddress'),
          cover: shopStore.get('cover'),
          logo: shopStore.get('logo'),
          allGoods: 99,
          salesGoods: 88,
        }

        console.log(item.allGoods);
        this.block.data.list.push(item)
      })

    }

  }
  saveFilter() {
    this.initSource()
  }
  objectMap(item) {
    return Object.keys(item)
  }
  typeChange(e) {
    this.editType = e
  }
  deleteFromArray(i) {
    let list = this.block.data.list
    console.log(list,'------')
    list.splice(i, 1)
    this.block.data.list = list
   
    
  }

  addmyfunction() {
    let list = this.block.data.list
    list.push({ text: list,switch:true });
    list = '';
  }
  deleteBlock() {
    this.delete.emit(this.index)
  }

  onChangRadio(vla) {
    console.log(vla);
  }
  srcChange(e) {
    console.log(e)
  }
}
