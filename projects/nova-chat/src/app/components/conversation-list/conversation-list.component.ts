import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { global } from '../../services/common';

@Component({
    selector: 'conversation-list-component',
    templateUrl: './conversation-list.component.html',
    styleUrls: ['./conversation-list.component.scss']
})

export class ConversationListComponent implements OnInit {
    @Input()
     conversationList;
    @Input()
     active;
    @Output()
     changeActive: EventEmitter<any> = new EventEmitter();
    @Output()
     deleteConversationItem: EventEmitter<any> = new EventEmitter();
    @Output()
     conversationToTop: EventEmitter<any> = new EventEmitter();
     global = global;
     topPosition:any = {
        left: 0,
        top: 0,
        show: false,
        item: {}
    };
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
    @HostListener('window:click')  onClickWindow() {
        this.topPosition.show = false;
    }
     selectTarget(item) {
        this.changeActive.emit(item);
    }
     deleteThis(event, item) {
        event.stopPropagation();
        this.deleteConversationItem.emit(item);
    }
     contextmenu(event, item) {
        this.topPosition = {
            top: event.clientY,
            left: event.clientX,
            show: true,
            item
        };
        return false;
    }
     conversationToTopAction() {
        this.conversationToTop.emit(this.topPosition.item);
    }
}
