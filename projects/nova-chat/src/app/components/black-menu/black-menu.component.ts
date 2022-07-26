import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'black-menu-component',
    templateUrl: './black-menu.component.html',
    styleUrls: ['./black-menu.component.scss']
})

export class BlackMenuComponent implements OnInit {
    @Input()
     menuInfo;
    @Output()
     blockMenuConfirm: EventEmitter<any> = new EventEmitter();
    @Output()
     delSingleBlack: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     blockMenuEmit() {
        this.blockMenuConfirm.emit();
    }
     delSingleBlackAction(item) {
        this.delSingleBlack.emit(item);
    }
}
