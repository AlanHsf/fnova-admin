import {
    Component, OnInit, Input, Output, EventEmitter,
    HostListener, AfterViewInit
} from '@angular/core';
import * as Clipboard from 'clipboard/dist/clipboard.min.js';

@Component({
    selector: 'message-menu-component',
    templateUrl: './message-menu.component.html',
    styleUrls: ['./message-menu.component.scss']
})

export class MessageMenuComponent implements OnInit, AfterViewInit {
    @Input()
     menu:any;
    @Output()
     selectMenuItem: EventEmitter<any> = new EventEmitter();
    @Output()
     menuItemEnter: EventEmitter<any> = new EventEmitter();
    @Output()
     menuItemLeave: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
    public ngAfterViewInit() {
        let clipboard = new Clipboard('.message-copy');
    }
     selectMenuItemAction(item) {
        this.selectMenuItem.emit(item);
    }
     itemEnter() {
        this.menu.show = true;
        this.menuItemEnter.emit();
    }
     itemLeave() {
        this.menu.show = false;
        this.menuItemLeave.emit();
    }
}
