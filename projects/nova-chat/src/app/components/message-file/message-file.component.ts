import {
    Component, OnInit, Input, Output, EventEmitter,
    HostListener, ViewChild
} from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import * as download from 'downloadjs';
import { Util } from '../../services/util';

@Component({
    selector: 'message-file-component',
    templateUrl: './message-file.component.html',
    styleUrls: ['./message-file.component.scss']
})

export class MessageFileComponent implements OnInit {
    @ViewChild(PerfectScrollbarComponent)  componentScroll;
    @Input()
     msgFile;
    @Output()
     changeMsgFile: EventEmitter<any> = new EventEmitter();
    @Output()
     msgFileImageViewer: EventEmitter<any> = new EventEmitter();
    @Output()
     fileImageLoad: EventEmitter<any> = new EventEmitter();
     msgType = 'image';
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
    @HostListener('window:click')  onWindowClick() {
        this.msgFile.show = false;
        this.msgType = 'image';
    }
     closeMsgFile() {
        setTimeout(() => {
            this.msgType = 'image';
        }, 500);
        this.msgFile.show = false;
    }
     changeMsgFileAction(type) {
        this.msgType = type;
        this.changeMsgFile.emit(type);
    }
     avatarLoad(event, message) {
        Util.reduceAvatarSize(event);
        if (message.content.msg_type === 'file') {
            message.content.msg_body.width = event.target.naturalWidth;
            message.content.msg_body.height = event.target.naturalHeight;
            this.fileImageLoad.emit(message);
        }
    }
     stopPropagation(event) {
        event.stopPropagation();
    }
     fileDownload(url, event) {
        event.stopPropagation();
        // 为了兼容火狐下a链接下载，引入downloadjs
        download(url);
    }
     scrollY(type) {
        let titleHeight = 28;
        let imgHeight = 55;
        let containerPadding = 12 * 2;
        let otherHeight = 74;
        let top = this.componentScroll.directiveRef.geometry().y;
        let msgTop = 0;
        let preTop = 0;
        for (let file of this.msgFile[this.msgType]) {
            msgTop += titleHeight;
            if (this.msgType === 'image') {
                let imgCol = Math.ceil(file.msgs.length / 4);
                msgTop += imgCol * imgHeight + containerPadding;
            } else {
                msgTop += file.msgs.length * otherHeight;
            }
            if (top > preTop && top < msgTop) {
                file.position = 'absolute';
            } else {
                file.position = 'relative';
            }
            preTop = msgTop;
        }
    }
     imgViewer(message) {
        this.msgFileImageViewer.emit(message);
    }
}
