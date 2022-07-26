import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Parse from 'parse'
import { Router } from "@angular/router";
import { DiyStyleService } from '../diystyles.service';

@Component({
  selector: 'app-diy-carousel',
  templateUrl: './diy-carousel.component.html',
  styleUrls: ['./diy-carousel.component.scss']
})
export class DiyCarouselComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: any
  @Output() delete = new EventEmitter<any>()
  constructor(public router: Router, private styleServ: DiyStyleService) { }
  editType: string = 'style'
  urls: any = []
  ngOnInit() {
    console.log(this.block.data)
    if (this.block.data.list) {
      this.block.data.list.forEach(li => {
        this.urls.push(li.image)
      });
    } else {
      this.block.data.list = []
    }
    //   this.queryBanner()
  }
  reset(block, field) {
    this.styleServ.reset(block, field)
  }

  async queryBanner() {
    let Banner = new Parse.Query('Banner')
    Banner.equalTo('company', localStorage.getItem('company'))
    let filterKeys = Object.keys(this.block.data.filter)
    filterKeys.forEach(key => {
      this.block.data.filter[key].forEach(e => {
        if (e.isOpen) {
          Banner[key](e.key, e.value)
        }
      })
    })

    let banner = await Banner.find()
    let bannerList = []
    if (banner && banner.length > 0) {
      banner.forEach(b => {
        let li = {
          image: b.get('image'),
          type: 'image'
        }
        bannerList.push(li)
      });
    }
    this.block.data.list = [...bannerList]
  }


  typeChange(e) {
    this.editType = e
  }
  saveList() {
    if (this.urls && this.urls.length > 0) {
      console.log(this.urls)
      this.urls.forEach((url, index) => {
        let li = {
          image: url,
          type: "image",
        }
        this.block.data.list[index] = li
      });
    }
    console.log(this.block.data.list)
  }
  deleteBlock() {
    this.delete.emit(this.index)
  }

  srcChange(e) {
    if (e == 'filter') {
      this.queryBanner()
    }
    if (e == "list") {
      this.saveList()
    }
  }
  objectMap(item) {
    return Object.keys(item)
  }

  addBanner() { // common/manage/Banner;rid=r0OsdkxYNe

    if (this.block.data.src == 'filter') {
      this.router.navigate(["common/manage/Banner", {
        rid: 'r0OsdkxYNe',
        type: "back-diypage"
      }])
    }

    if (this.block.data.src == 'list') {
      this.block.data.list.push({
        image: "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
        url: ""
      })
    }
  }
  onDelete(i) {
    let list = this.block.data.list
    list.splice(i, 1)
    this.block.data.list = list
  }
}
