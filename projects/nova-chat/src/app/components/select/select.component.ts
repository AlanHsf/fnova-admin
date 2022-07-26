import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'select-component',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss']
})

export class SelectComponent implements OnInit {
    @Input()
    selectList;
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     showList(event) {
        event.stopPropagation();
        this.selectList.show = !this.selectList.show;
    }
     changeItemAction(item) {
        this.selectList.active = item;
    }
}
