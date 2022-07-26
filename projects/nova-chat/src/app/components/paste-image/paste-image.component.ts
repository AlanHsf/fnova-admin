import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'paste-image-component',
    templateUrl: './paste-image.component.html',
    styleUrls: ['./paste-image.component.scss']
})

export class PasteImageComponent implements OnInit {
    @Input()
     pasteInfo;
    @Output()
     pasteImage: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     pasteModalAction(type?: string) {
        this.pasteInfo.show = false;
        if (type) {
            this.pasteImage.emit();
        }
    }
}
