import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DiyStyleService } from '../diystyles.service';

@Component({
  selector: 'app-diy-guideline',
  templateUrl: './diy-guideline.component.html',
  styleUrls: ['./diy-guideline.component.scss']
})
export class DiyGuidelineComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: any
  @Output() delete = new EventEmitter<any>()
  editType: string = 'style'
  constructor(private styleServ: DiyStyleService) { }


  ngOnInit() {
  }
  deleteBlock() {
    this.delete.emit(this.index)
  }
  reset(block, field) {
    this.styleServ.reset(block, field)
  }



}
