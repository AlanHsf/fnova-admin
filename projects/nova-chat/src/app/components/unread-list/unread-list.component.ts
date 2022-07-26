import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'unread-list-component',
    templateUrl: './unread-list.component.html',
    styleUrls: ['./unread-list.component.scss']
})

export class UnreadListComponent implements OnInit {
    @Input()
     unreadList;
    @Output()
     readListOtherInfo: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     closeModal() {
        this.unreadList.show = false;
    }
     watchOtherInfo(item) {
        this.readListOtherInfo.emit(item);
    }
}
