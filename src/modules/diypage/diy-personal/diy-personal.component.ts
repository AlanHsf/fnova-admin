import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as Parse from 'parse'
import { Router } from "@angular/router";
import { DiypageService } from '../diypage.service';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-diy-personal',
  templateUrl: './diy-personal.component.html',
  styleUrls: ['./diy-personal.component.scss']
})
export class DiyPersonalComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: string
  editType: string = 'style'
  @Output() delete = new EventEmitter<any>()
  constructor() { }
  routeFields: any = {};
  ngOnInit() {
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
