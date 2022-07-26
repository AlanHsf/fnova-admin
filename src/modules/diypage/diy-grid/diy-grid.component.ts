import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Parse from 'parse'
import { Router } from "@angular/router";
import { DiyStyleService } from '../diystyles.service';

@Component({
  selector: 'app-diy-grid',
  templateUrl: './diy-grid.component.html',
  styleUrls: ['./diy-grid.component.scss']
})
export class DiyGridComponent implements OnInit {
  @Input('block') block: any
  @Input('index') index: any
  @Input('type') type: any
  @Output() delete = new EventEmitter<any>()
  editType = 'style'
  company: any
  grid: any = [];
  constructor(public router: Router, private styleServ: DiyStyleService) { }
  ngOnInit() {
    this.company = localStorage.getItem('company')
    console.log(this.company)
    console.log(this.block)
  }

  typeChange(e) {
    console.log(e)
    this.editType = e
  }
  reset(block, field) {
    this.styleServ.reset(block, field)
  }

  addIcon() {
    let count = this.block.data.list.length
    let gridCount = this.grid.length
    if (gridCount > count) {
      this.block.data.list.push({
        image: this.grid[count].get('icon'),
        name: this.grid[count].get('name'),
        url: this.grid[count].get('url')
      });
    } else {
      this.block.data.list.push({
        image: "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
        name: "菜单" + (count + 1),
        url: ""
      })
    }
  }
  onDelete(index) {
    let list = this.block.data.list
    list.splice(index, 1)
    this.block.data.list = list
  }

  deleteBlock() {
    console.log(this.index)
    this.delete.emit(this.index)
  }

  urlChange(e, index) {
    this.block.data.list[index].url = e
  }
}
