import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'switch-component',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss']
})

export class SwitchComponent implements OnInit {
    @Input()
     state;
    @Output()
     changeSwitch: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     changeSwitchAction() {
        this.changeSwitch.emit();
    }
}
