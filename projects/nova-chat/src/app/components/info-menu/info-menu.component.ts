import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
    selector: 'info-menu-component',
    templateUrl: './info-menu.component.html',
    styleUrls: ['./info-menu.component.scss']
})

export class InfoMenuComponent implements OnInit {
    @Input()
     menu;
    @Output()
     selectMenuItem: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     selectMenuItemAction(item) {
        this.selectMenuItem.emit(item);
    }
}
