import {
    Component, Input, Output, EventEmitter, ElementRef,
    AfterViewInit, OnInit, ViewChild
} from '@angular/core';

@Component({
    selector: 'enter-group-component',
    templateUrl: './enter-group.component.html',
    styleUrls: ['./enter-group.component.scss']
})

export class EnterGroupComponent implements OnInit, AfterViewInit {
    @ViewChild('enterGroupInput')  enterGroupInput;
    @Input()
     enterPublicGroup;
    @Output()
     enterGroupComfirm: EventEmitter<any> = new EventEmitter();
    @Output()
     emptyEnterGroupTip: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
    public ngAfterViewInit() {
        this.enterGroupInput.nativeElement.focus();
    }
     closeEnterGroup() {
        this.enterPublicGroup.show = false;
    }
     confirmEnterGroup(input) {
        if (input.value.length > 0) {
            this.enterGroupComfirm.emit(input.value);
        }
    }
     inputKeyup(event, input) {
        if (event.keyCode === 13) {
            this.confirmEnterGroup(input);
        } else {
            this.emptyEnterGroupTip.emit();
        }
    }
}
