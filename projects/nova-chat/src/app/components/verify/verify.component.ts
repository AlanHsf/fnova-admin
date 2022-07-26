import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'verify-component',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.scss']
})

export class VerifyComponent implements OnInit {
    @Input()
     verifyMessageList;
    @Input()
     verifyGroupList;
    @Input()
     verifyTab;
    @Input()
     groupVerifyUnreadNum;
    @Input()
     singleVerifyUnreadNum;
    @Output()
     isAgreeAddFriend: EventEmitter<any> = new EventEmitter();
    @Output()
     isAgreeEnterGroup: EventEmitter<any> = new EventEmitter();
    @Output()
     watchVerifyUser: EventEmitter<any> = new EventEmitter();
    @Output()
     watchGroupInfo: EventEmitter<any> = new EventEmitter();
    @Output()
     changeVerifyTab: EventEmitter<any> = new EventEmitter();
    @Output()
     watchApplyUser: EventEmitter<any> = new EventEmitter();
    @Output()
     watchInvitateUser: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     agreeAddFriend(message, type) {
        /**
         * 加好友验证信息 stateType
         * 0    收到好友邀请时，同意或者拒绝按钮显示
         * 1    点击拒绝按钮的loading状态
         * 2    点击同意时的loading状态
         * 3    显示已拒绝
         * 4    显示已同意
         * 5    显示同意了您的好友请求
         * 6    显示等待对方验证
         * 7    拒绝了您的请求
         */
        if (type === 'refuse') {
            message.stateType = 1;
        } else if (type === 'agree') {
            message.stateType = 2;
        }
        this.isAgreeAddFriend.emit(message);
    }
     verifyUser(message) {
        this.watchVerifyUser.emit(message);
    }
     changeVerifyTabAction(tab) {
        this.changeVerifyTab.emit(tab);
    }
     agreeEnterGroup(verifyGroup, type) {
        /**
         * 入群验证信息 stateType
         * 0    管理员或者群主收到入群邀请时，显示同意或者拒绝按钮
         * 1    点击拒绝按钮的loading状态
         * 2    点击同意时的loading状态
         * 3    显示已拒绝
         * 4    显示已同意
         * 5    拒绝了您的入群请求（自己申请被拒绝，自己收到的事件）
         * 6    拒绝了您的入群请求（邀请别人申请被拒绝，邀请人收到的事件）
         */
        if (type === 'refuse') {
            verifyGroup.stateType = 1;
        } else if (type === 'agree') {
            verifyGroup.stateType = 2;
        }
        this.isAgreeEnterGroup.emit(verifyGroup);
    }
     watchGroupInfoAction(verifyGroup) {
        this.watchGroupInfo.emit(verifyGroup);
    }
     watchApplyUserAction(verifyGroup) {
        this.watchApplyUser.emit(verifyGroup);
    }
     watchInvitateUserAction(verifyGroup) {
        this.watchInvitateUser.emit(verifyGroup);
    }
}
