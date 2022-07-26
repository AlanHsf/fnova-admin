import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-diy-account',
  templateUrl: './diy-account.component.html',
  styleUrls: ['./diy-account.component.scss']
})
export class DiyAccountComponent implements OnInit {

  @Input("block") block: any;
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input("index") index: any;
  @Input("type") type: string;
  @Output() delete = new EventEmitter<any>();
  editType: string = "style";
  deleteBlock() {
    this.delete.emit(this.index);
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
  lineChange(e) {
    console.log(e);

  }
  constructor(public cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  typeChange(e) {
    this.editType = e;
  }
}
