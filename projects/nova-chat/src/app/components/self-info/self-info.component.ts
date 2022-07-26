import {
    Component, Input, Output, EventEmitter,
    OnChanges, AfterViewInit, ViewChild
} from '@angular/core';
import { Util } from '../../services/util';

@Component({
    selector: 'self-info-component',
    templateUrl: './self-info.component.html',
    styleUrls: ['./self-info.component.scss']
})

export class SelfInfoComponent implements OnChanges {
    @ViewChild('selfAvatarImg')  selfAvatarImg;
    @ViewChild('selfAvatarInput')  selfAvatarInput;
    @Input()
     selfInfo;
    // 用来标识更新个人信息成功
    @Input()
     updateSelfInfoFlag;
    @Output()
     isShow: EventEmitter<any> = new EventEmitter();
    @Output()
     selectImageError: EventEmitter<any> = new EventEmitter();
    @Output()
     sendCard: EventEmitter<any> = new EventEmitter();
     isEdit = false;
     sexList = {
        active: {
            key: 1,
            name: '男'
        },
        list: [{
            key: 1,
            name: '男'
        }, {
            key: 2,
            name: '女'
        }, {
            key: 0,
            name: '保密'
        }],
        width: 160,
        show: false
    };
     newInfo = {
        signature: '',
        nickname: '',
        gender: 0,
        region: ''
    };
     newAvatar = {
        formData: {},
        url: ''
    };
     cameraShadow = true;
     infoMenu = {
        info: [
            {
                name: '发送名片',
                key: 0,
                isRight: false,
                show: true
            }
        ],
        show: false
    };
     avatarConfig = {
        info: {
            src: '',
            width: 0,
            height: 0,
            pasteFile: {}
        },
        show: false,
        formData: {},
        src: '',
        filename: '',
        title: '个人头像'
    };
    constructor() {
        // pass
    }
    public ngOnChanges(change) {
        this.newInfo.signature = this.selfInfo.info.signature;
        this.newInfo.nickname = this.selfInfo.info.nickname;
        this.newInfo.gender = this.selfInfo.info.gender;
        this.newInfo.region = this.selfInfo.info.region;
        this.sexActive();
        if (change.updateSelfInfoFlag) {
            this.isEdit = false;
        }
    }
     sexActive() {
        switch (this.selfInfo.info.gender) {
            case 0:
                this.sexList.active = {
                    key: 0,
                    name: '保密'
                };
                break;
            case 1:
                this.sexList.active = {
                    key: 1,
                    name: '男'
                };
                break;
            case 2:
                this.sexList.active = {
                    key: 2,
                    name: '女'
                };
                break;
            default:
        }
    }
    showMenu(event) {
        event.stopPropagation();
        this.infoMenu.show = !this.infoMenu.show;
    }
    hideSelect(event) {
        event.stopPropagation();
        this.sexList.show = false;
        this.infoMenu.show = false;
    }
     selectMenuItemEmit(ev?) {
        this.sendCard.emit(this.selfInfo.info);
    }
     selfCancel() {
        this.selfAvatarInput.nativeElement.value = '';
        this.isEdit = false;
        this.sexActive();
    }
     selfClose(event) {
        event.stopPropagation();
        this.isShow.emit();
    }
     signatureChange(event) {
        this.newInfo.signature = event.target.value;
    }
     nicknameChange(event) {
        this.newInfo.nickname = event.target.value;
    }
     regionChange(event) {
        this.newInfo.region = event.target.value;
    }
     selfConfirm() {
        let newInfo = {
            info: Object.assign({}, this.newInfo, { gender: this.sexList.active.key }),
            avatar: this.newAvatar
        };
        this.isShow.emit(newInfo);
    }
     selfAvatarChange() {
        this.getImgObj(this.selfAvatarInput.nativeElement.files[0]);
        this.selfAvatarInput.nativeElement.value = '';
    }
    // 获取图片对象
     getImgObj(file) {
        let isNotImage = '选择的文件必须是图片';
        let imageTooSmall = '选择的图片宽或高的尺寸太小，请重新选择图片';
        Util.getAvatarImgObj(file,
            () => this.selectImageError.emit(isNotImage),
            () => this.selectImageError.emit(imageTooSmall),
            (that, pasteFile, img) => {
                this.avatarConfig.info = {
                    src: that.result,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    pasteFile
                };
                this.avatarConfig.src = that.result;
                this.avatarConfig.show = true;
                this.avatarConfig.filename = file.name;
            }
        );
    }
     avatarConfirmEmit(avatarConfig) {
        this.newAvatar.formData = avatarConfig.formData;
        this.selfAvatarImg.nativeElement.src = avatarConfig.src;
        this.newAvatar.url = avatarConfig.src;
        this.cameraShadow = false;
    }
     toEdit() {
        this.isEdit = true;
        this.selfAvatarImg.nativeElement.src = this.selfInfo.info.avatarUrl;
    }
}
