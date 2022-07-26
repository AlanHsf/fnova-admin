import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Parse from 'parse'
@Component({
  selector: 'app-diy-my',
  templateUrl: './diy-my.component.html',
  styleUrls: ['./diy-my.component.scss']
})
export class DiyMyComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: string
  @Output() delete = new EventEmitter<any>()
  editType: string = 'style'

  constructor() { }

  ngOnInit() {
  }

  deleteBlock() {
    this.delete.emit(this.index)
  }
  typeChange(e) {
    this.editType = e
  }
}
