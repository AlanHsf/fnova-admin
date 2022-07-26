import {
    Component, OnInit, Input, Output, EventEmitter,
    OnChanges, DoCheck, HostListener, ViewChild
} from '@angular/core';
import { authPayload } from '../../services/common';

@Component({
    selector: 'other-info-component',
    templateUrl: './other-info.component.html',
    styleUrls: ['./other-info.component.scss']
})

export class OtherInfoComponent implements OnInit, OnChanges {
    @ViewChild('editMemoName') private editMemoName;
    @Input()
     otherInfo;
    @Input()
     changeOtherInfoFlag;
    @Output()
     isShow: EventEmitter<any> = new EventEmitter();
    @Output()
     changeSingleBlack: EventEmitter<any> = new EventEmitter();
    @Output()
     sendCard: EventEmitter<any> = new EventEmitter();
    @Output()
     changeSingleNoDisturb: EventEmitter<any> = new EventEmitter();
    @Output()
     addFriend: EventEmitter<any> = new EventEmitter();
    @Output()
     saveMemoName: EventEmitter<any> = new EventEmitter();
    @Output()
     deleteFriend: EventEmitter<any> = new EventEmitter();
    @Output()
     verifyUserBtn: EventEmitter<any> = new EventEmitter();
     editRmark = {
        tip: '修改备注名',
        position: {
            left: -28,
            top: 27
        },
        show: false
    };
     infoMenu = {
        info: [
            {
                name: '发送名片',
                key: 0,
                isRight: false,
                show: true
            },
            {
                name: '消息免打扰',
                key: 1,
                isRight: false,
                show: true
            },
            {
                name: '加入黑名单',
                key: 2,
                isRight: false,
                show: true
            },
            {
                name: '删除好友',
                key: 3,
                isRight: false,
                show: true
            }
        ],
        show: false
    };
     isEdit = false;
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
    public ngOnChanges() {
        this.infoMenu.info[1].isRight = this.otherInfo.info.noDisturb ? true : false;
        this.infoMenu.info[2].isRight = this.otherInfo.info.black ? true : false;
        if (this.otherInfo.info.infoType === 'watchOtherInfo' && !this.otherInfo.info.isFriend) {
            this.infoMenu.info[3].show = false;
        } else {
            this.infoMenu.info[3].show = true;
        }
    }
     saveMemoNameAction(event) {
        let value = event.target.value;
        this.saveMemoName.emit({
            name: this.otherInfo.info.name,
            memo_name: value,
            appkey: this.otherInfo.info.appkey
        });
        this.isEdit = false;
    }
     stopPropagation(event) {
        event.stopPropagation();
        this.infoMenu.show = false;
    }
     sendMsgBtn() {
        let user = {
            avatar: this.otherInfo.info.avatar,
            avatarUrl: this.otherInfo.info.avatarUrl,
            mtime: this.otherInfo.info.mtime,
            name: this.otherInfo.info.username,
            nickName: this.otherInfo.info.nickname,
            type: 3,
            appkey: this.otherInfo.info.appkey || authPayload.appkey
        };
        this.isShow.emit(user);
    }
     otherClose(event) {
        event.stopPropagation();
        this.isShow.emit(false);
    }
     addBlack() {
        this.changeSingleBlack.emit(this.otherInfo.info);
    }
     addFriendBtn() {
        this.addFriend.emit(this.otherInfo.info);
    }
     showMenu(event) {
        event.stopPropagation();
        this.infoMenu.show = !this.infoMenu.show;
    }
     selectMenuItemEmit(item) {
        switch (item.key) {
            case 0:
                this.sendCard.emit(this.otherInfo.info);
                break;
            case 1:
                this.changeSingleNoDisturb.emit(this.otherInfo.info);
                break;
            case 2:
                this.changeSingleBlack.emit(this.otherInfo.info);
                break;
            case 3:
                this.deleteFriend.emit(this.otherInfo.info);
                break;
            default:
        }
    }
    private editBtn() {
        this.isEdit = true;
        setTimeout(() => {
            this.editMemoName.nativeElement.focus();
        });
    }
    private verifyBtn(num) {
        this.otherInfo.info.stateType = num;
        this.verifyUserBtn.emit(this.otherInfo.info);
    }
}
