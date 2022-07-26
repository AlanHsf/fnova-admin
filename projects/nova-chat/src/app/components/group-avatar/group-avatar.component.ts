import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Util } from '../../services/util';
import '../../../assets/static/js/cropper.min.css';
import '../../services/tools/canvas-to-blob.js';
import '../../../assets/static/js/cropper.min.js';
declare let Cropper:any

@Component({
    selector: 'group-avatar-component',
    templateUrl: './group-avatar.component.html',
    styleUrls: ['./group-avatar.component.scss']
})

export class GroupAvatarComponent implements OnInit {
    @ViewChild('cropperImg')  cropperImg;
    @Input()
     groupAvatarInfo;
    @Output()
     groupAvatar: EventEmitter<any> = new EventEmitter();
     cropper;
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     cropperImgLoad() {
        this.cropper = new Cropper(this.cropperImg.nativeElement, {
            aspectRatio: 1 / 1,
            zoomable: false,
            rotatable: false,
            viewMode: 1,
            minCropBoxWidth: 30
        });
    }
     modalAction(event, type?) {
        event.stopPropagation();
        if (type === 'confirm') {
            let canvas = this.cropper.getCroppedCanvas({
                width: 100,
                height: 100,
                imageSmoothingQuality: 'low'
            });
            if (canvas.toBlob) {
                canvas.toBlob((blob) => {
                    let formData = new FormData();
                    formData.append(this.groupAvatarInfo.filename, blob,
                        this.groupAvatarInfo.filename);
                    let ext = Util.getExt(this.groupAvatarInfo.filename) || 'png';
                    this.groupAvatarInfo.formData = formData;
                    this.groupAvatarInfo.src = canvas.toDataURL(`image/${ext}`, 1);
                    this.groupAvatar.emit(this.groupAvatarInfo);
                    this.groupAvatarInfo.show = false;
                }, '');
            }
        } else {
            this.groupAvatarInfo.show = false;
        }
    }
     stopPropagation(event) {
        event.stopPropagation();
    }
}
