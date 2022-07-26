import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'linkman-list-component',
    templateUrl: './linkman-list.component.html',
    styleUrls: ['./linkman-list.component.scss']
})

export class LinkmanListComponent implements OnInit {
    @Input()
     friendLoading;
    @Input()
     friendList = [];
    @Input()
     set friendFlag (value) {
        this.checkFriendList();
    }
    @Output()
     selectLinkmanItemEmit: EventEmitter<any> = new EventEmitter();
     isEmpty = false;
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     checkFriendList() {
        let flag = true;
        for (let item of this.friendList) {
            if (item.data.length > 0) {
                this.isEmpty = true;
                flag = false;
                break;
            }
        }
        if (flag) {
            this.isEmpty = false;
        }
    }
     selectLinkmanItem(item) {
        item.type = 3;
        this.selectLinkmanItemEmit.emit(item);
    }
}
