import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';

@Component({
    selector: 'tip-modal-component',
    templateUrl: './tip-modal.component.html',
    styleUrls: ['./tip-modal.component.scss']
})

export class TipModalComponent implements OnInit, DoCheck {
    @Input()
    info;
    @Output()
    modalTipEmit: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
    public ngDoCheck() {
        // 自动消失
        if (this.info && this.info.success) {
            setTimeout(() => {
                this.modalTipEmit.emit();
            }, 2000);
        }
    }
    stopPropagation(event) {
        event.stopPropagation();
    }
    modalTip(event, info?) {
        event.stopPropagation();
        if (info) {
            this.modalTipEmit.emit(info);
        } else {
            this.modalTipEmit.emit();
        }
    }
}
