import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { dataProcessor } from 'gantt';

@Component({
  selector: 'app-myfunction',
  templateUrl: './myfunction.component.html',
  styleUrls: ['./myfunction.component.scss']
})
export class MyfunctionComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: string
  @Output() delete = new EventEmitter<any>();
  editType: string = 'style'

  constructor(public router: Router, public cdRef: ChangeDetectorRef) { }

  addmyfunction() {
    if (this.block.data.src == 'list') {
      this.block.data.list.push({
        backgroundimg: "https://b.yzcdn.cn/public_files/452a323d2e241275f3d894664dd3744f.png",
        name: "名称",
        switch: true,
        showIcon: true,
        url: ""
      })
    }
  }
  reset(field, type) {
    switch (type) {
      case "color":
        this.block.style[field] = "";
        break;
      case "margin":
        this.block.style[field] = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        };
        break;
      case "padding":
        this.block.style[field] = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        };
        break;
      default:
        break;
    }
  }
  onDelete(i) {
    let list = this.block.data.list
    list.splice(i, 1)
    this.block.data.list = list
  }

  ngOnInit(): void {
  }
  columnChange(e) {
    console.log(e);
  }
  deleteBlock() {
    this.delete.emit(this.index)
  }
  typeChange(e) {
    this.editType = e
  }
}
