import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Parse from 'parse'
import { DiyStyleService } from '../diystyles.service';

@Component({
  selector: 'app-diy-guidelist',
  templateUrl: './diy-guidelist.component.html',
  styleUrls: ['./diy-guidelist.component.scss']
})
export class DiyGuidelistComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: string
  @Output() delete = new EventEmitter<any>()
  editType: string = 'style'
  constructor(private styleServ: DiyStyleService) { }


  ngOnInit() {
  }

  reset(block, field) {
    this.styleServ.reset(block, field)
  }

  deleteBlock() {
    this.delete.emit(this.index)
  }
  typeChange(e) {
    this.editType = e
  }
  urlChange(e, index) {
    this.block.data.list[index].url = e
  }
}
