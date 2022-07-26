import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { global } from '../../services/common';

@Component({
    selector: 'at-list-component',
    templateUrl: './at-list.component.html',
    styleUrls: ['./at-list.component.scss']
})

export class AtListComponent implements OnInit {
    @Input()
     atList;
    @Output()
     selectAtItem: EventEmitter<any> = new EventEmitter();
     global = global;
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     selectPerson(item, event) {
        this.selectAtItem.emit(item);
        event.stopPropagation();
    }
     stopPropagation(event) {
        event.stopPropagation();
    }
}
