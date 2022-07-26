import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DiyStyleService } from '../diystyles.service';

@Component({
  selector: 'app-diy-search',
  templateUrl: './diy-search.component.html',
  styleUrls: ['./diy-search.component.scss']
})
export class DiySearchComponent implements OnInit {
  @Input("block") block: any
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input('index') index: any
  @Input('type') type: string
  @Output() delete = new EventEmitter<any>()
  constructor(private styleServ: DiyStyleService) { }
  editType: string = 'style'
  ngOnInit() {
    console.log(this.block)
  }

  reset(block, field) {
    console.log(block, field);
    this.styleServ.reset(block, field)
  }


  typeChange(e) {
    console.log(e)
    this.editType = e

  }
  deleteBlock() {
    this.delete.emit(this.index)
  }

}
