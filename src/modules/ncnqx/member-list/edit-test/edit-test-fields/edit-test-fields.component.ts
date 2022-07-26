import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'edit-test-fields',
  templateUrl: './edit-test-fields.component.html',
  styleUrls: ['./edit-test-fields.component.scss']
})
export class EditTestFieldsComponent implements OnInit {
  @Input() object: any;
  @Input() field: any;
  @Input() selectPointerMap: any = {};
  @Output() onPointerChange = new EventEmitter<any>();
  @Output() onSearchPointer = new EventEmitter<any>();
  constructor(render: Renderer2, eleRef: ElementRef) {
    render.addClass(eleRef.nativeElement, 'field-item-wrapper');
  }
  ngOnInit(): void {
  }
  pointerChange(ev, key) {
    this.onPointerChange.emit({ ev, key })
  }
  searchPointer(ev, field) {

    this.onSearchPointer.emit({ ev, field })
  }
}
