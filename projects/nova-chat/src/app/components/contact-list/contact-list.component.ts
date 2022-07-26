import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'contact-list-component',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss']
})

export class ContactListComponent implements OnInit {
    @Input()
     verifyUnreadNum;
     listIndex = 1;
    @Output()
     changeTab: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     changeList(index) {
        this.listIndex = index;
        this.changeTab.emit(index);
    }
}
