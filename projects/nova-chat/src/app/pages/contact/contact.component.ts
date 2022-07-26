import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStore } from '../../app.store';
import { contactAction } from './actions';
import { mainAction } from '../main/actions';
import { chatAction } from '../chat/actions';

@Component({
    selector: 'contact-component',
    styleUrls: ['./contact.component.scss'],
    templateUrl: './contact.component.html'
})

export class ContactComponent implements OnInit, OnDestroy {
     private contactStream$;
     groupList = [];
     tab = 1;
     friendList = [];
     verifyMessageList = [];
     verifyGroupList = [];
     verifyUnreadNum = 0;
     verifyTab = 0;
     groupVerifyUnreadNum = 0;
     singleVerifyUnreadNum = 0;
     groupLoading = false;
     friendLoading = false;
     friendFlag = false;
     groupFlag = false;
    constructor(
        private store$: Store<AppStore>
    ) {}
    public ngOnInit() {
        this.store$.dispatch({
            type: contactAction.init,
            payload: null
        });
        this.subscribeStore();
    }
    public ngOnDestroy() {
        this.contactStream$.unsubscribe();
    }
     subscribeStore() {
        this.contactStream$ = this.store$.select((state) => {
            let contactState = state['contactReducer'];
            this.stateChanged(contactState);
            return state;
        }).subscribe((state) => {
            // pass
        });
    }
     init() {
        this.groupList = [];
        this.tab = 1;
        this.friendList = [];
        this.verifyMessageList = [];
        this.verifyGroupList = [];
        this.verifyUnreadNum = 0;
        this.verifyTab = 0;
        this.groupVerifyUnreadNum = 0;
        this.singleVerifyUnreadNum = 0;
        this.groupLoading = false;
        this.friendLoading = false;
        this.friendFlag = false;
        this.groupFlag = false;
    }
     stateChanged(contactState) {
        switch (contactState.actionType) {
            case contactAction.init:
                this.init();
                break;
            case chatAction.getFriendList:
                this.groupLoading = contactState.groupLoading;
                break;
            case chatAction.dispatchGroupList:
                this.groupLoading = contactState.groupLoading;
                this.groupList = contactState.groupList;
                this.groupFlag = !this.groupFlag;
                break;
            case mainAction.changeListTab:
                this.verifyUnreadNum = contactState.verifyUnreadNum;
                this.groupVerifyUnreadNum = contactState.groupVerifyUnreadNum;
                this.singleVerifyUnreadNum = contactState.singleVerifyUnreadNum;
                this.dispatchContactUnreadNum(contactState);
                break;
            case contactAction.changeTab:
                this.tab = contactState.tab;
                this.verifyUnreadNum = contactState.verifyUnreadNum;
                this.groupVerifyUnreadNum = contactState.groupVerifyUnreadNum;
                this.singleVerifyUnreadNum = contactState.singleVerifyUnreadNum;
                this.dispatchContactUnreadNum(contactState);
                break;
            case chatAction.friendInvitationEventSuccess:
                this.verifyMessageList = contactState.verifyMessageList;
                this.verifyUnreadNum = contactState.verifyUnreadNum;
                this.groupVerifyUnreadNum = contactState.groupVerifyUnreadNum;
                this.singleVerifyUnreadNum = contactState.singleVerifyUnreadNum;
                this.dispatchContactUnreadNum(contactState);
                break;
            case chatAction.friendReplyEventSuccess:
                this.verifyMessageList = contactState.verifyMessageList;
                this.verifyUnreadNum = contactState.verifyUnreadNum;
                this.dispatchContactUnreadNum(contactState);
                break;
            case contactAction.getGroupList:
                this.friendLoading = contactState.friendLoading;
                break;
            case chatAction.dispatchFriendList:
                this.friendLoading = contactState.friendLoading;
                this.friendList = contactState.friendList;
                this.friendFlag = !this.friendFlag;
                break;
            case contactAction.refuseAddFriendSuccess:

            case chatAction.addFriendConfirm:

            case contactAction.addFriendError:

            case chatAction.addFriendSyncEvent:
                this.verifyMessageList = contactState.verifyMessageList;
                break;
            case chatAction.dispatchReceiveGroupInvitationEvent:
                this.dispatchContactUnreadNum(contactState);
                this.verifyGroupList = contactState.verifyGroupList;
                this.verifyUnreadNum = contactState.verifyUnreadNum;
                this.groupVerifyUnreadNum = contactState.groupVerifyUnreadNum;
                this.singleVerifyUnreadNum = contactState.singleVerifyUnreadNum;
                break;
            case contactAction.isAgreeEnterGroupSuccess:
                this.verifyGroupList = contactState.verifyGroupList;
                break;
            case contactAction.isAgreeEnterGroupError:
                this.verifyGroupList = contactState.verifyGroupList;
                break;
            case chatAction.dispatchReceiveGroupRefuseEvent:
                this.dispatchContactUnreadNum(contactState);
                this.verifyGroupList = contactState.verifyGroupList;
                this.verifyUnreadNum = contactState.verifyUnreadNum;
                this.groupVerifyUnreadNum = contactState.groupVerifyUnreadNum;
                this.singleVerifyUnreadNum = contactState.singleVerifyUnreadNum;
                break;
            case contactAction.changeVerifyTab:
                this.verifyTab = contactState.verifyTab;
                this.verifyUnreadNum = contactState.verifyUnreadNum;
                this.groupVerifyUnreadNum = contactState.groupVerifyUnreadNum;
                this.singleVerifyUnreadNum = contactState.singleVerifyUnreadNum;
                this.dispatchContactUnreadNum(contactState);
                break;
            default:
        }
    }
    // 传递联系人未读数
     dispatchContactUnreadNum(contactState) {
        this.store$.dispatch({
            type: contactAction.dispatchContactUnreadNum,
            payload: contactState.contactUnreadNum
        });
    }
    // 点击联系人
     selectContactItemEmit(item) {
        this.store$.dispatch({
            type: contactAction.selectContactItem,
            payload: item
        });
        this.store$.dispatch({
            type: mainAction.changeListTab,
            payload: 0
        });
    }
    // 切换联系人中的tab
     changeTabEmit(tab) {
        this.store$.dispatch({
            type: contactAction.changeTab,
            payload: tab
        });
    }
    // 同意或者拒绝好友请求
     isAgreeAddFriendEmit(message) {
        this.store$.dispatch({
            type: contactAction.isAgreeAddFriend,
            payload: message
        });
    }
    // 查看验证信息中的对方用户的资料
     watchVerifyUserEmit(message) {
        this.store$.dispatch({
            type: contactAction.watchVerifyUser,
            payload: message
        });
    }
    // 同意或者拒绝用户入群
     isAgreeEnterGroupEmit(groupVerify) {
        this.store$.dispatch({
            type: contactAction.isAgreeEnterGroup,
            payload: groupVerify
        });
    }
    // 查看验证信息的群组资料
     watchGroupInfoEmit(verifyGroup) {
        this.store$.dispatch({
            type: contactAction.watchGroupInfo,
            payload: verifyGroup
        });
    }
    // 切换验证信息的tab
     changeVerifyTabEmit(tab) {
        this.store$.dispatch({
            type: contactAction.changeVerifyTab,
            payload: tab
        });
    }
    // 查看申请者的用户资料
     watchApplyUserEmit(verifyGroup?) {
        let user = verifyGroup.to_usernames[0];
        let item = {
            avatar: user.avatar,
            name: user.username,
            username: user.username,
            avatarUrl: user.avatarUrl ? user.avatarUrl : '',
            infoType: 'watchOtherInfo',
            appkey: user.appkey
        };
        this.store$.dispatch({
            type: contactAction.watchGroupVerifyUser,
            payload: item
        });
    }
    // 查看邀请者的用户资料
     watchInvitateUserEmit(verifyGroup) {
        let item = {
            avatar: verifyGroup.media_id,
            name: verifyGroup.from_username,
            username: verifyGroup.from_username,
            infoType: 'watchOtherInfo',
            appkey: verifyGroup.from_appkey
        };
        this.store$.dispatch({
            type: contactAction.watchGroupVerifyUser,
            payload: item
        });
    }
}
