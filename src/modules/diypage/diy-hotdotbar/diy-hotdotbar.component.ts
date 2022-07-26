import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DiyStyleService } from '../diystyles.service';

@Component({
  selector: 'app-diy-hotdotbar',
  templateUrl: './diy-hotdotbar.component.html',
  styleUrls: ['./diy-hotdotbar.component.scss']
})
export class DiyHotdotbarComponent implements OnInit {
  @Input('block') block: any
  @Input('index') index: any
  @Input('type') type: string
  @Output() delete = new EventEmitter<any>()
  constructor(private styleServ: DiyStyleService) { }
  editType: string = 'style'

  ngOnInit() {
  }

  reset(block, field) {
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
