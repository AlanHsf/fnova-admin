import {
    Component, OnInit, Input, Output, EventEmitter,
    HostListener, ElementRef
} from '@angular/core';
import { Util } from '../../services/util';
import { imgRouter, jpushRouter } from '../../services/common';

@Component({
    selector: 'emoji-component',
    templateUrl: './emoji.component.html',
    styleUrls: ['./emoji.component.scss']
})

export class EmojiComponent implements OnInit {
    @Input()
     emojiInfo;
    @Output()
     jpushEmojiSelect: EventEmitter<any> = new EventEmitter();
     imgRouter = imgRouter;
     jpushRouter = jpushRouter;
     tab = 0;
    constructor(
        private elementRef: ElementRef
    ) { }
    public ngOnInit() {
        // pass
    }
    @HostListener('window:click')  onClick() {
        if (this.emojiInfo.show) {
            this.emojiInfo.show = false;
        }
    }
     stopPropagation(event) {
        event.stopPropagation();
    }
     emojiSelectAction(idName) {
        let contentId = document.getElementById(this.emojiInfo.contentId);
        let insertHtml = this.elementRef.nativeElement.querySelector('#' + idName).innerHTML;
        insertHtml = insertHtml.replace('width="22', 'width="18');
        Util.insertAtCursor(contentId, insertHtml, false);
        this.emojiInfo.show = false;
    }
     changeTab(event, index) {
        this.tab = index;
    }
     jpushEmojiSelectAction(jpushEmoji) {
        this.emojiInfo.show = false;
        this.jpushEmojiSelect.emit(jpushEmoji);
    }
}
