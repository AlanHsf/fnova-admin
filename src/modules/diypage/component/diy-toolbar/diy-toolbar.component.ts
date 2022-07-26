import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-diy-toolbar',
    templateUrl: './diy-toolbar.component.html',
    styleUrls: ['./diy-toolbar.component.scss']
})
export class DiyToolbarComponent implements OnInit {

    constructor() { }
    @Input("editType") type: any
    @Output() onTypeChange = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();
    ngOnInit() {
        console.log(this.type)
    }


    typeChange(type) {
        console.log(type)
        this.onTypeChange.emit(type)
    }

    deleteBlock(){
        this.onDelete.emit()
    }

}
