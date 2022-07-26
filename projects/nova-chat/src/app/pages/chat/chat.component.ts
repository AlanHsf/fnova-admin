import { Component, OnInit, ElementRef, HostListener, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { global, authPayload, StorageService } from '../../services/common';
import { AppStore } from '../../app.store';
import { chatAction } from './actions';
import { mainAction } from '../main/actions';
import { roomAction } from '../room/actions';
import { Util } from '../../services/util';
import { contactAction } from '../contact/actions';
import * as Push from 'push.js';

@Component({
    selector: 'chat-component',
    styleUrls: ['./chat.component.scss'],
    templateUrl: './chat.component.html'
})

export class ChatComponent implements OnInit, OnDestroy {
    @Input()
     hideAll;
     isLoadedSubject$ = new Subject();
     isLoaded$ = this.isLoadedSubject$.asObservable();
     isLoaded = false;
     chatStream$;
     conversationList = [];
     public messageList = [
        {
            key: 0,
            msgs: [],
            groupSetting: {
                groupInfo: {},
                memberList: []
            }
        }
    ];
    // get messageList(){
    //     return this._messageList
    //     // return JSON.parse(JSON.stringify(this._messageList))
    // }
    // set messageList(v){
    //     this._messageList = v;
    // }
     global = global;
    _active = {
        // 当前active的用户
        name: '',
        nickName: '',
        key: '',
        activeIndex: -1,
        type: 0,
        change: false,
        shield: false,
        appkey: ''
    };
    get active(){
        return JSON.parse(JSON.stringify(this._active))
    }
    set active(v){
        this._active = JSON.parse(JSON.stringify(v))
    }
     defaultPanelIsShow = true;
     otherInfo = {
        show: false,
        info: {
            name: '',
            appkey: '',
            avatarUrl: '',
            nickName: ''
        }
    };
     blackMenu = {
        show: false,
        menu: []
    };
     groupSetting = {
        groupInfo: {
            name: '',
            desc: '',
            gid: 0
        },
        memberList: [],
        active: {},
        show: false
    };
     msgKey = 1;
     groupDescription = {
        show: false,
        description: {}
    };
     selfInfo: any = {};
     isCacheArr = [];
     playVideoShow = {
        show: false,
        url: ''
    };
     eventArr = [];
     hasOffline = 0;
    // 其他操作触发滚动条到底部
     otherOptionScrollBottom = false;
    // 切换用户触发滚动条到底部
     changeActiveScrollBottom = false;
     windowIsFocus = true;
     newMessageNotice = {
        timer: null,
        num: 0
    };
     messageTransmit = {
        list: [],
        show: false,
        type: ''
    };
     transmitAllMsg = {
        content: {
            msg_type: '',
            from_id: '',
            target_id: ''
        },
        msgKey: -1,
        totalTransmitNum: 0,
        ctime_ms: 0,
        conversation_time_show: '',
        time_show: '',
        hasLoad: false,
        showMoreIcon: false,
        type: 0,
        key: 0,
        isTransmitMsg: true,
        msg_id: 0,
        unread_count: 0,
        msg_type: 0,
        success: 1
    };
     verifyModal = {
        info: {},
        show: false
    };
     changeOtherInfoFlag = false;
     sendBusinessCardCount = 0;
     groupAvatar = {
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
        title: '群组头像'
    };
     unreadList = {
        show: false,
        info: {
            read: [],
            unread: []
        },
        loading: false
    };
     isMySelf = false;
     noLoadedMessage = [];
     inputMessage = '';
     inputMessageTimer = null;
    constructor(
        private store$: Store<AppStore>,
        private storageService: StorageService,
        private elementRef: ElementRef,
        private titleService: Title
    ) { }
    public ngOnInit() {
        this.store$.dispatch({
            type: chatAction.init,
            payload: null
        });
        this.hasOffline = 0;
        this.subscribeStore();
        this.store$.dispatch({
            type: chatAction.getVoiceState,
            payload: `voiceState-${authPayload.appkey}-${global.user}`
        });
        global.JIM.onMsgReceive((data) => {
            if (!this.isLoaded) {
                this.noLoadedMessage.push(data);
                return;
            }
            this.receiveNewMessage(data);
        });
        // 异常断线监听
        global.JIM.onDisconnect(() => {
            // 定时器是为了解决火狐下刷新时先弹出断线提示
            setTimeout(() => {
                this.store$.dispatch({
                    type: mainAction.logoutKickShow,
                    payload: {
                        show: true,
                        info: {
                            title: '提示',
                            tip: '网络断线，请检查网络或重新登陆'
                        }
                    }
                });
            }, 2000);
        });
        // 监听在线事件消息
        global.JIM.onEventNotification((data) => {
            data.isOffline = false;
            if (!this.isLoaded) {
                this.eventArr.push(data);
            } else {
                this.asyncEvent(data);
            }
        });
        // 监听离线事件消息
        global.JIM.onSyncEvent((data) => {
            if (!this.isLoaded) {
                this.eventArr = data;
            } else {
                for (let item of data) {
                    item.isOffline = true;
                    this.asyncEvent(item);
                }
            }
        });
        // 多端在线清空会话未读数
        global.JIM.onMutiUnreadMsgUpdate((data) => {
            if (data.username) {
                data.name = data.username;
            }
            this.store$.dispatch({
                type: chatAction.emptyUnreadNumSyncEvent,
                payload: data
            });
        });
        // 离线业务消息监听，加载完会话数据之后才执行
        this.isLoaded$.subscribe((isLoaded) => {
            if (isLoaded) {
                for (let message of this.noLoadedMessage) {
                    this.receiveNewMessage(message);
                }
                this.noLoadedMessage = [];
                for (let item of this.eventArr) {
                    item.isOffline = true;
                    this.asyncEvent(item);
                }
                this.eventArr = [];
            }
        });
        // 离线消息同步监听
        global.JIM.onSyncConversation((data) => {
            // 限制只触发一次
            if (this.hasOffline === 0) {
                this.hasOffline++;
                this.store$.dispatch({
                    type: chatAction.getAllMessage,
                    payload: data
                });
            }
        });
        // 如果4秒内没有加载离线消息则手动触发
        setTimeout(() => {
            if (this.hasOffline === 0) {
                this.store$.dispatch({
                    type: chatAction.getAllMessage,
                    payload: []
                });
            }
        }, 4000);
        // 监听已读回执
        global.JIM.onMsgReceiptChange((data) => {
            this.store$.dispatch({
                type: chatAction.msgReceiptChangeEvent,
                payload: data
            });
        });
        // 监听同步的已读回执，用作补偿
        global.JIM.onSyncMsgReceipt((data) => {
            this.store$.dispatch({
                type: chatAction.msgReceiptChangeEvent,
                payload: data
            });
        });
        // 监听用户的信息变化，只有用户信息变化且发了消息的才会触发
        global.JIM.onUserInfUpdate((data) => {
            this.store$.dispatch({
                type: chatAction.userInfUpdateEvent,
                payload: data
            });
        });
        // 消息透传（正在输入）
        global.JIM.onTransMsgRec((data) => {
            if (data.from_username === this.active.name) {
                this.inputMessage = data.cmd;
                clearTimeout(this.inputMessageTimer);
                // 6s内没有新的透传消息，则清除正在输入
                this.inputMessageTimer = setTimeout(() => {
                    this.store$.dispatch({
                        type: chatAction.receiveInputMessage,
                        payload: false
                    });
                }, 6000);
                this.store$.dispatch({
                    type: chatAction.receiveInputMessage,
                    payload: true
                });
            }
        });
    }
    public ngOnDestroy() {
        this.chatStream$.unsubscribe();
        this.isLoadedSubject$.unsubscribe();
    }
    @HostListener('window:blur')  onBlurWindow() {
        this.windowIsFocus = false;
    }
    @HostListener('window:focus')  onFocusWindow() {
        this.windowIsFocus = true;
        this.newMessageNotice.num = 0;
    }
    // 切换标签页事件
    @HostListener('document:visibilitychange')  onChangeWindow() {
        const hiddenProperty = 'hidden' in document ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
                'mozHidden' in document ? 'mozHidden' : null;
        if (!document[hiddenProperty]) {
            this.windowIsFocus = true;
            this.newMessageNotice.num = 0;
        } else {
            this.windowIsFocus = false;
        }
    }
     subscribeStore() {
        this.chatStream$ = this.store$.select((state) => {
            const chatState = state['chatReducer'];
            const mainState = state['mainReducer'];
            this.stateChanged(chatState, mainState);
            return state;
        }).subscribe((state) => {
            // pass
        });
    }
     stateChanged(chatState, mainState) {
        chatState = JSON.parse(JSON.stringify(chatState));
        mainState = JSON.parse(JSON.stringify(mainState));
        let activeIndex = chatState.activePerson.activeIndex;
        let messageListActive = chatState.messageList[activeIndex];
        switch (chatState.actionType) {
            case chatAction.init:
                this.init();
                break;
            case chatAction.getFriendListSuccess:
                this.conversationList = chatState.conversation;
                this.dispatchFriendList(chatState);
                if (chatState.activePerson.activeIndex > 0) {
                    this.active = chatState.activePerson;
                }
                break;
            case chatAction.getConversationSuccess:
                this.conversationList = chatState.conversation;
                this.messageList = JSON.parse(JSON.stringify(chatState.messageList));
                this.dispatchConversationUnreadNum(chatState);
                if (chatState.isLoaded) {
                    this.isLoaded = chatState.isLoaded;
                    this.isLoadedSubject$.next(this.isLoaded);
                }
                break;
            case chatAction.receiveMessageSuccess:
                if (chatState.newMessageIsActive) {
                    this.emptyUnreadCount(chatState.unreadCount);
                    this.otherOptionScrollBottom = !this.otherOptionScrollBottom;
                }
                this.messageList = JSON.parse(JSON.stringify(chatState.messageList));
                if (!chatState.newMessageIsDisturb && !this.isMySelf) {
                    this.notification(chatState.newMessage);
                    this.dispatchConversationUnreadNum(chatState);
                }
                break;
            case chatAction.sendSingleMessage:

            case chatAction.sendGroupMessage:

            case chatAction.sendSinglePic:

            case chatAction.sendGroupPic:

            case chatAction.sendSingleFile:

            case chatAction.sendGroupFile:
                // 触发滚动条向下滚动
                this.otherOptionScrollBottom = !this.otherOptionScrollBottom;
                break;
            case chatAction.updateGroupInfoEventSuccess:
                if (activeIndex >= 0 && messageListActive && messageListActive.groupSetting) {
                    this.groupSetting = Object.assign({},
                        this.groupSetting, messageListActive.groupSetting);
                    this.groupSetting.active = this.active;
                }
                this.dispatchGroupList(chatState);
                // 触发滚动条向下滚动
                if (chatState.newMessageIsActive) {
                    this.otherOptionScrollBottom = !this.otherOptionScrollBottom;
                }
                break;
            case chatAction.sendMsgComplete:
                this.modalTipSendCardSuccess(chatState);
                break;
            case chatAction.changeActivePerson:

            case contactAction.selectContactItem:

            case mainAction.selectSearchUser:
                this.messageList = JSON.parse(JSON.stringify(chatState.messageList));
                this.changeActivePerson(chatState);
                this.defaultPanelIsShow = chatState.defaultPanelIsShow;
                this.emptyUnreadCount(chatState.unreadCount);
                this.dispatchConversationUnreadNum(chatState);
                break;
            case chatAction.addReceiptReportAction:
                if (chatState.readObj && chatState.readObj.msg_id.length > 0) {
                    this.store$.dispatch({
                        type: chatAction.addReceiptReport,
                        payload: chatState.readObj
                    });
                }
                break;
            case chatAction.saveDraft:
                this.messageList = JSON.parse(JSON.stringify(chatState.messageList));
                this.conversationList = chatState.conversation;
                break;
            case mainAction.searchUserSuccess:
                this.store$.dispatch({
                    type: chatAction.searchUserSuccess,
                    payload: chatState.searchUserResult
                });
                break;
            case chatAction.deleteConversationItem:
                this.defaultPanelIsShow = chatState.defaultPanelIsShow;
                this.closeGroupSettingEmit();
                this.dispatchFriendList(chatState);
                this.active = chatState.activePerson;
                this.dispatchConversationUnreadNum(chatState);
                break;
            case chatAction.watchOtherInfoSuccess:

            case chatAction.hideOtherInfo:

            case mainAction.createSingleChatSuccess:

            case contactAction.watchVerifyUserSuccess:
                this.otherInfo = chatState.otherInfo;
                break;
            case chatAction.groupSetting:
                if (activeIndex < 0) {
                    this.groupSetting.show = false;
                }
            case chatAction.groupInfo:
                if (activeIndex >= 0 && messageListActive && messageListActive.groupSetting) {
                    this.groupSetting = Object.assign({},
                        this.groupSetting, messageListActive.groupSetting);
                    this.groupSetting.active = this.active;
                }
                break;
            case mainAction.createGroupSuccess:
                this.messageList = JSON.parse(JSON.stringify(chatState.messageList));
                this.changeActivePerson(chatState);
                this.defaultPanelIsShow = chatState.defaultPanelIsShow;
                this.dispatchGroupList(chatState);
                break;
            case chatAction.createOtherChat:
                this.messageList = JSON.parse(JSON.stringify(chatState.messageList));
                this.changeActivePerson(chatState);
                this.defaultPanelIsShow = chatState.defaultPanelIsShow;
                this.emptyUnreadCount(chatState.unreadCount);
                this.unreadList.show = false;
                this.closeGroupSettingEmit();
                this.dispatchConversationUnreadNum(chatState);
                break;
            case mainAction.exitGroupSuccess:
                this.conversationList = chatState.conversation;
                this.defaultPanelIsShow = chatState.defaultPanelIsShow;
                this.closeGroupSettingEmit();
                this.active = chatState.activePerson;
                this.dispatchGroupList(chatState);
                this.dispatchConversationUnreadNum(chatState);
                break;
            case mainAction.addBlackListSuccess:
                this.conversationList = chatState.conversation;
                this.otherInfo = chatState.otherInfo;
                this.changeOtherInfoFlag = !this.changeOtherInfoFlag;
                break;
            case chatAction.groupDescription:
                this.groupDescription.show = chatState.groupDeacriptionShow;
                this.groupDescription.description =
                    Util.deepCopyObj(messageListActive.groupSetting.groupInfo);
                break;
            case mainAction.showSelfInfo:
                if (mainState.selfInfo.info) {
                    this.selfInfo = mainState.selfInfo.info;
                }
                break;
            case mainAction.addGroupMemberSuccess:
                this.groupSetting.memberList = messageListActive.groupSetting.memberList;
                break;
            case chatAction.changeGroupShieldSuccess:
                this.conversationList = chatState.conversation;
                this.active.shield = chatState.activePerson.shield;
                break;
            case chatAction.playVideoShow:
                this.playVideoShow = chatState.playVideoShow;
                break;
            // 群聊事件
            case chatAction.addGroupMembersEventSuccess:
                if (activeIndex >= 0 && messageListActive && messageListActive.groupSetting) {
                    this.groupSetting = Object.assign({},
                        this.groupSetting, messageListActive.groupSetting);
                }
                if (chatState.currentIsActive) {
                    this.otherOptionScrollBottom = !this.otherOptionScrollBottom;
                }
                this.dispatchGroupList(chatState);
                break;
            case chatAction.deleteGroupMembersEvent:
                this.dispatchGroupList(chatState);
                if (activeIndex >= 0 && messageListActive && messageListActive.groupSetting) {
                    this.groupSetting = Object.assign({},
                        this.groupSetting, messageListActive.groupSetting);
                }
                if (chatState.currentIsActive) {
                    this.otherOptionScrollBottom = !this.otherOptionScrollBottom;
                }
                break;
            case chatAction.updateGroupMembersEvent:

            case chatAction.exitGroupEvent:
                if (activeIndex >= 0 && messageListActive && messageListActive.groupSetting) {
                    this.groupSetting = Object.assign({},
                        this.groupSetting, messageListActive.groupSetting);
                }
                if (chatState.currentIsActive) {
                    this.otherOptionScrollBottom = !this.otherOptionScrollBottom;
                }
                break;
            case chatAction.createGroupSuccessEvent:
                this.conversationList = chatState.conversation;
                this.dispatchGroupList(chatState);
                break;
            case chatAction.msgRetractEvent:
                this.conversationList = chatState.conversation;
                this.messageList = JSON.parse(JSON.stringify(chatState.messageList));
                break;
            // 转发单聊文本消息
            case chatAction.transmitSingleMessage:

            // 转发单聊图片消息
            case chatAction.transmitSinglePic:

            // 转发单聊文件消息
            case chatAction.transmitSingleFile:

            // 转发群聊文本消息
            case chatAction.transmitGroupMessage:

            // 转发单聊图片消息
            case chatAction.transmitGroupPic:

            // 转发单聊文件消息
            case chatAction.transmitGroupFile:

            // 转发单聊位置
            case chatAction.transmitSingleLocation:

            // 转发群聊位置
            case chatAction.transmitGroupLocation:
                this.conversationList = chatState.conversation;
                break;
            case chatAction.emptyUnreadNumSyncEvent:
                this.conversationList = chatState.conversation;
                this.dispatchConversationUnreadNum(chatState);
                break;
            // 转发消息成功(如果全部成功则为成功，有一个用户失败则不成功，会提示相关信息)
            case chatAction.transmitMessageComplete:
                this.modalTipTransmitSuccess(chatState);
                break;
            case contactAction.agreeAddFriendSuccess:
                this.conversationList = chatState.conversation;
                this.dispatchFriendList(chatState);
                this.otherOptionScrollBottom = !this.otherOptionScrollBottom;
                break;
            case chatAction.friendReplyEventSuccess:
                this.otherInfo = chatState.otherInfo;
                this.changeOtherInfoFlag = !this.changeOtherInfoFlag;
                this.dispatchFriendList(chatState);
                this.otherOptionScrollBottom = !this.otherOptionScrollBottom;
                break;
            case chatAction.showVerifyModal:
                this.verifyModal = chatState.verifyModal;
                break;
            case chatAction.deleteSingleBlackSuccess:
                this.otherInfo = chatState.otherInfo;
                this.changeOtherInfoFlag = !this.changeOtherInfoFlag;
                break;
            case chatAction.changeGroupNoDisturbSuccess:
                this.dispatchConversationUnreadNum(chatState);
                break;
            case mainAction.addSingleNoDisturbSuccess:

            case chatAction.deleteSingleNoDisturbSuccess:
                this.dispatchConversationUnreadNum(chatState);
                this.otherInfo = chatState.otherInfo;
                this.changeOtherInfoFlag = !this.changeOtherInfoFlag;
                break;
            case chatAction.saveMemoNameSuccess:

            case chatAction.deleteFriendSyncEvent:

            case chatAction.addFriendSyncEvent:
                this.conversationList = chatState.conversation;
                this.changeOtherInfoFlag = !this.changeOtherInfoFlag;
                this.dispatchFriendList(chatState);
                break;
            case chatAction.userInfUpdateEventSuccess:
                this.dispatchFriendList(chatState);
                this.otherInfo.info = chatState.otherInfo.info;
                break;
            case mainAction.deleteFriendSuccess:
                this.dispatchFriendList(chatState);
                this.otherInfo = chatState.otherInfo;
                this.changeOtherInfoFlag = !this.changeOtherInfoFlag;
                this.conversationList = chatState.conversation;
                this.defaultPanelIsShow = chatState.defaultPanelIsShow;
                this.unreadList.show = false;
                break;
            case chatAction.addSingleBlackSyncEvent:

            case chatAction.deleteSingleBlackSyncEvent:
                this.changeOtherInfoFlag = !this.changeOtherInfoFlag;
                break;
            case chatAction.addSingleNoDisturbSyncEvent:

            case chatAction.deleteSingleNoDisturbSyncEvent:

            case chatAction.addGroupNoDisturbSyncEvent:

            case chatAction.deleteGroupNoDisturbSyncEvent:
                this.dispatchConversationUnreadNum(chatState);
                this.changeOtherInfoFlag = !this.changeOtherInfoFlag;
                break;
            case chatAction.conversationToTopSuccess:
                this.conversationList = chatState.conversation;
                break;
            case chatAction.watchUnreadList:
                this.unreadList = chatState.unreadList;
                break;
            case chatAction.watchUnreadListSuccess:
                this.unreadList = chatState.unreadList;
                break;
            case chatAction.msgReceiptChangeEvent:
                this.conversationList = chatState.conversation;
                break;
            case mainAction.dispatchSendSelfCard:
                this.sendCardEmit();
                break;
            case contactAction.getGroupListSuccess:
                this.dispatchGroupList(chatState);
                break;
            case roomAction.transmitAllMsg:
                this.msgTransmitEmit(chatState.roomTransmitMsg);
                break;
            case chatAction.receiveGroupInvitationEventSuccess:
                this.store$.dispatch({
                    type: chatAction.dispatchReceiveGroupInvitationEvent,
                    payload: chatState.receiveGroupInvitationEventObj
                });
                this.notification(chatState.receiveGroupInvitationEventObj);
                break;
            case chatAction.receiveGroupRefuseEventSuccess:
                this.store$.dispatch({
                    type: chatAction.dispatchReceiveGroupRefuseEvent,
                    payload: chatState.receiveGroupRefuseEventObj
                });
                this.notification(chatState.receiveGroupRefuseEventObj);
                break;
            case chatAction.addGroupMemberSilenceEvent:
                if (chatState.currentIsActive) {
                    // 触发滚动条向下滚动
                    this.otherOptionScrollBottom = !this.otherOptionScrollBottom;
                }
                break;
            case chatAction.deleteGroupMemberSilenceEvent:
                if (chatState.currentIsActive) {
                    // 触发滚动条向下滚动
                    this.otherOptionScrollBottom = !this.otherOptionScrollBottom;
                }
                break;
            default:
        }
    }
    // 传递会话列表总未读数
     dispatchConversationUnreadNum(chatState) {
        this.store$.dispatch({
            type: chatAction.dispatchConversationUnreadNum,
            payload: chatState.conversationUnreadNum
        });
    }
    // 传递群组列表
     dispatchGroupList(chatState) {
        this.store$.dispatch({
            type: chatAction.dispatchGroupList,
            payload: chatState.groupList
        });
    }
    // 传递好友列表
     dispatchFriendList(chatState) {
        this.store$.dispatch({
            type: chatAction.dispatchFriendList,
            payload: chatState.friendList
        });
    }
    // 清空未读数
     emptyUnreadCount(unread) {
        if (unread.type === 3 || unread.type === 4) {
            this.store$.dispatch({
                type: chatAction.emptyUnreadNum,
                payload: unread
            });
        }
    }
    // 收到新消息
     receiveNewMessage(data) {
        // 与用户名是feedback_开头的消息不做处理
        const feedbackReg = /^feedback_/g;
        if (data.messages[0].content.target_id.match(feedbackReg)) {
            return;
        }
        if (data.messages[0].content.from_id === global.user) {
            this.isMySelf = true;
            this.store$.dispatch({
                type: chatAction.syncReceiveMessage,
                payload: {
                    data
                }
            });
            return;
        } else {
            this.isMySelf = false;
        }
        // 群聊消息
        if (data.messages[0].msg_type === 4) {
            this.store$.dispatch({
                type: chatAction.receiveGroupMessage,
                payload: {
                    data,
                    conversation: this.conversationList,
                    messageList: this.messageList
                }
            });
            // 单聊消息
        } else {
            this.store$.dispatch({
                type: chatAction.receiveInputMessage,
                payload: false
            });
            this.store$.dispatch({
                type: chatAction.receiveSingleMessage,
                payload: {
                    data,
                    conversation: this.conversationList
                }
            });
        }
    }
    // 发送名片成功的提示
     modalTipSendCardSuccess(chatState) {
        const count = this.sendBusinessCardCount;
        if (count !== 0 && count === chatState.sendBusinessCardSuccess) {
            this.store$.dispatch({
                type: mainAction.showModalTip,
                payload: {
                    show: true,
                    info: {
                        title: '成功',          // 模态框标题
                        tip: '发送名片成功',   // 模态框内容
                        actionType: '[main] send business card success', // 哪种操作，点击确定时可以执行对应操作
                        success: 1              // 成功的提示框/失败的提示框，1.5s后会自动消失
                    }
                }
            });
        }
        this.sendBusinessCardCount = 0;
        this.store$.dispatch({
            type: chatAction.hideOtherInfo,
            payload: {
                show: false,
                info: {}
            }
        });
        this.store$.dispatch({
            type: mainAction.showSelfInfo,
            payload: {
                show: false,
                loading: false
            }
        });
    }
    // 转发消息成功的提示
     modalTipTransmitSuccess(chatState) {
        const count = this.transmitAllMsg.totalTransmitNum;
        if (count !== 0 && chatState.transmitSuccess === count) {
            this.store$.dispatch({
                type: mainAction.showModalTip,
                payload: {
                    show: true,
                    info: {
                        title: '成功',          // 模态框标题
                        tip: '转发成功',   // 模态框内容
                        actionType: '[main] transmit success', // 哪种操作，点击确定时可以执行对应操作
                        success: 1              // 成功的提示框/失败的提示框，1.5s后会自动消失
                    }
                }
            });
            this.transmitAllMsg.totalTransmitNum = 0;
        }
        if (chatState.transmitSuccess === 0) {
            this.transmitAllMsg.totalTransmitNum = 0;
        }
    }
    // 事件消息
     asyncEvent(data) {
        switch (data.event_type) {
            // 账号在其他地方登陆web jchat
            case 1:
                this.store$.dispatch({
                    type: mainAction.logoutKickShow,
                    payload: {
                        show: true,
                        info: {
                            title: '提示',
                            tip: '您的账号在其他设备登录'
                        }
                    }
                });
                break;
            // 密码被其他设备修改的同步事件
            case 2:
                this.store$.dispatch({
                    type: mainAction.logoutKickShow,
                    payload: {
                        show: true,
                        info: {
                            title: '提示',
                            tip: '您的密码已在其他设备修改，请重新登录',
                            hideRepeateLoginBtn: true
                        }
                    }
                });
                break;
            case 5:
                // 好友请求和应答事件
                this.store$.dispatch({
                    type: chatAction.friendEvent,
                    payload: data
                });
                this.notification(data);
                break;
            case 6:
                // 删除好友同步消息
                if (!data.isOffline) {
                    if (data.extra === 0) {
                        this.store$.dispatch({
                            type: chatAction.getFriendList,
                            payload: null
                        });
                    }
                }
                break;
            case 7:
                // 非客户端修改好友关系事件
                if (!data.isOffline) {
                    if (data.extra === 0) {
                        this.store$.dispatch({
                            type: chatAction.getFriendList,
                            payload: 'api'
                        });
                    }
                }
                break;
            case 8:
                // 创建群的事件
                if (data.from_username === '' && !data.isOffline) {
                    this.store$.dispatch({
                        type: chatAction.createGroupEvent,
                        payload: data
                    });
                }
                break;
            case 9:
                // 退群事件
                if (data.to_usernames[0].username !== global.user) {
                    this.store$.dispatch({
                        type: chatAction.exitGroupEvent,
                        payload: data
                    });
                } else {
                    this.store$.dispatch({
                        type: mainAction.exitGroupSuccess,
                        payload: {
                            item: {
                                type: 4,
                                name: data.group_name,
                                key: data.gid
                            }
                        }
                    });
                }
                break;
            case 10:
                // 添加群成员事件
                if (data.extra === 0 || data.extra === 1 || data.extra === 2) {
                    this.store$.dispatch({
                        type: chatAction.addGroupMembersEvent,
                        payload: data
                    });
                }
                break;
            case 11:
                // 删除群成员事件
                if (data.extra === 0) {
                    this.store$.dispatch({
                        type: chatAction.deleteGroupMembersEvent,
                        payload: data
                    });
                }
                break;
            case 12:
                // 更新群信息事件
                if (!data.isOffline) {
                    this.store$.dispatch({
                        type: chatAction.updateGroupInfoEvent,
                        payload: data
                    });
                }
                break;
            case 40:
                // 个人信息更新同步事件
                if (!data.isOffline) {
                    if (data.extra === 0) {
                        this.store$.dispatch({
                            type: mainAction.getSelfInfo,
                            payload: null
                        });
                    }
                }
            case 55:
                // 消息撤回事件，不考虑离线的消息撤回事件
                if (!data.isOffline) {
                    this.store$.dispatch({
                        type: chatAction.msgRetractEvent,
                        payload: data
                    });
                }
                break;
            // 群主或者管理员收到用户申请入群事件
            case 56:
                this.store$.dispatch({
                    type: chatAction.receiveGroupInvitationEvent,
                    payload: data
                });
                break;
            // 被拒绝入群
            case 57:
                this.store$.dispatch({
                    type: chatAction.receiveGroupRefuseEvent,
                    payload: data
                });
                break;
            case 65:
                if (!data.isOffline) {
                    // 禁言事件
                    if (data.extra === 1) {
                        this.store$.dispatch({
                            type: chatAction.addGroupMemberSilenceEvent,
                            payload: data
                        });
                        // 取消禁言事件
                    } else if (data.extra === 2) {
                        this.store$.dispatch({
                            type: chatAction.deleteGroupMemberSilenceEvent,
                            payload: data
                        });
                    }
                }
            case 100:
                // 好友列表更新同步事件
                if (!data.isOffline) {
                    this.updateFriendListSyncEvent(data);
                }
                break;
            case 101:
                // 添加黑名单同步事件
                if (!data.isOffline) {
                    if (data.extra === 1) {
                        this.store$.dispatch({
                            type: chatAction.addSingleBlackSyncEvent,
                            payload: data
                        });
                        this.store$.dispatch({
                            type: mainAction.blackMenu,
                            payload: {
                                show: null
                            }
                        });
                    } else if (data.extra === 2) {
                        this.store$.dispatch({
                            type: chatAction.deleteSingleBlackSyncEvent,
                            payload: data
                        });
                        this.store$.dispatch({
                            type: mainAction.blackMenu,
                            payload: {
                                show: null
                            }
                        });
                    }
                }
                break;
            case 102:
                // 免打扰同步事件
                if (!data.isOffline) {
                    this.updateNoDisturbSyncEvent(data);
                }
                break;
            case 103:
                // 屏蔽群消息的同步事件
                if (!data.isOffline) {
                    if (data.extra === 1) {
                        this.store$.dispatch({
                            type: chatAction.addGroupShieldSyncEvent,
                            payload: data
                        });
                    } else if (data.extra === 2) {
                        this.store$.dispatch({
                            type: chatAction.deleteGroupShieldSyncEvent,
                            payload: data
                        });
                    }
                }
                break;
            default:
        }
    }
    // 更新好友列表同步事件
     updateFriendListSyncEvent(data) {
        if (data.extra === 5) {
            this.store$.dispatch({
                type: chatAction.getFriendList,
                payload: null
            });
            this.store$.dispatch({
                type: chatAction.addFriendSyncEvent,
                payload: data
            });
        } else if (data.extra === 6) {
            this.store$.dispatch({
                type: chatAction.getFriendList,
                payload: null
            });
            this.store$.dispatch({
                type: chatAction.deleteFriendSyncEvent,
                payload: data
            });
        } else if (data.extra === 7) {
            this.store$.dispatch({
                type: chatAction.saveMemoNameSuccess,
                payload: data
            });
        }
    }
    // 更新免打扰同步事件
     updateNoDisturbSyncEvent(data) {
        switch (data.extra) {
            case 31:
                this.store$.dispatch({
                    type: chatAction.addSingleNoDisturbSyncEvent,
                    payload: data
                });
                break;
            case 32:
                this.store$.dispatch({
                    type: chatAction.deleteSingleNoDisturbSyncEvent,
                    payload: data
                });
                break;
            case 33:
                this.store$.dispatch({
                    type: chatAction.addGroupNoDisturbSyncEvent,
                    payload: data
                });
                break;
            case 34:
                this.store$.dispatch({
                    type: chatAction.deleteGroupNoDisturbSyncEvent,
                    payload: data
                });
                break;
            default:
        }
    }
    // 通知栏
     notification(newMessage) {
        if (!this.windowIsFocus) {
            let title = '';
            let body = '';
            // 好友验证消息
            if (newMessage.event_type === 5) {
                if (newMessage.extra === 1) {
                    title = '好友邀请';
                    body = `${newMessage.from_nickname || newMessage.from_username}申请添加您为好友`;
                } else if (newMessage.extra === 2) {
                    if (newMessage.return_code === 0) {
                        title = '同意好友申请';
                        body = `${newMessage.from_nickname || newMessage.from_username}同意了您的好友申请`;
                    } else {
                        title = '拒绝好友申请';
                        body = `${newMessage.from_nickname || newMessage.from_username}拒绝了您的好友申请`;
                    }
                }
                // 入群申请消息
            } else if (newMessage.event_type === 56) {
                title = '入群申请';
                if (newMessage.by_self) {
                    body = `${newMessage.from_memo_name || newMessage.from_nickname ||
                        newMessage.from_username} 申请入群 ${newMessage.group_name}`;
                } else {
                    let name = '';
                    for (let i = 0; i < newMessage.to_usernames.length; i++) {
                        name += newMessage.to_usernames[i].memo_name ||
                            newMessage.to_usernames[i].nickname ||
                            newMessage.to_usernames[i].username;
                        if (i >= 5) {
                            name += '等人';
                            break;
                        } else if (i !== newMessage.to_usernames.length - 1) {
                            name += '、';
                        }
                    }
                    body = `${newMessage.from_memo_name || newMessage.from_nickname ||
                        newMessage.from_username} 邀请 ${name} 入群 ${newMessage.group_name}`;
                }
                // 被拒绝入群消息
            } else if (newMessage.event_type === 57) {
                let name = newMessage.to_usernames[0].username === global.user ?
                    '您' : (newMessage.to_usernames[0].memo_name ||
                        newMessage.to_usernames[0].nickname ||
                        newMessage.to_usernames[0].username);
                title = '拒绝入群申请';
                body = `群组 ${newMessage.group_name} 拒绝了 ${name} 的入群申请`;
                // 普通消息
            } else {
                if (newMessage.msg_type === 4) {
                    title = newMessage.content.target_name || '群';
                    body += `${newMessage.content.memo_name ||
                        newMessage.content.from_name || newMessage.content.from_id}:`;
                } else {
                    title = newMessage.content.memo_name ||
                        newMessage.content.from_name || newMessage.content.from_id || ' ';
                }
                switch (newMessage.content.msg_type) {
                    case 'text':
                        body += newMessage.content.msg_body.text;
                        break;
                    case 'image':
                        body += '[图片]';
                        break;
                    case 'location':
                        body += '[位置]';
                        break;
                    case 'voice':
                        body += '[语音]';
                        break;
                    case 'file':
                        let extras = newMessage.content.msg_body.extras;
                        if (extras && extras.video) {
                            body += '[视频]';
                        } else {
                            body += '[文件]';
                        }
                        break;
                    default:
                        body += '消息';
                }
            }
            (Push as any).create(title, {
                body,
                icon: '../../../assets/images/notification-icon.png',
                timeout: 4000,
                onClick() {
                    window.focus();
                    this.close();
                }
            });
            this.newMessageNotice.num++;
            clearInterval(this.newMessageNotice.timer);
            this.newMessageNotice.timer = setInterval(() => {
                if (this.titleService.getTitle() === 'NovaChat - 飞马 IM Demo') {
                    this.titleService.setTitle(`jchat(${this.newMessageNotice.num})`);
                } else {
                    this.titleService.setTitle('NovaChat - 飞马 IM Demo');
                }
                if (this.newMessageNotice.num === 0) {
                    clearInterval(this.newMessageNotice.timer);
                    this.titleService.setTitle('NovaChat - 飞马 IM Demo');
                }
            }, 1000);
        }
    }
    // 更新当前对话用户信息
     changeActivePerson(chatState) {
        chatState = JSON.parse(JSON.stringify(chatState));

        this.inputMessage = '';
        this.store$.dispatch({
            type: chatAction.receiveInputMessage,
            payload: false
        });
        this.closeGroupSettingEmit();
        this.active = chatState.activePerson;
        this.emptyUnreadCount(this.active);
        this.changeActiveScrollBottom = !this.changeActiveScrollBottom;
        // 判断是否已经缓存
        if (this.isCacheArr.indexOf(this.active.key) === -1) {
            this.isCacheArr.push(this.active.key);
            this.store$.dispatch({
                type: chatAction.getSourceUrl,
                payload: {
                    active: this.active,
                    messageList: this.messageList,
                    loadingCount: 1 // 加载的页数
                }
            });
            if (this.active.type === 4) {
                this.store$.dispatch({
                    type: chatAction.getGroupMembers,
                    payload: this.active
                });
                // 获取messageList avatar url
                this.store$.dispatch({
                    type: chatAction.getMemberAvatarUrl,
                    payload: {
                        active: this.active,
                        messageList: this.messageList,
                        loadingCount: 1 // 加载的页数
                    }
                });
            } else {
                this.store$.dispatch({
                    type: chatAction.getSingleAvatarUrl,
                    payload: null
                });
            }
        }
    }
    // 切换当前对话用户
     selectTargetEmit(item) {
        const group = item.type === 4 && this.active.type === 4 &&
            Number(this.active.key) === Number(item.key);
        const single = item.type === 3 && this.active.type === 3 && this.active.name === item.name;
        if (group || single) {
            return;
        }
        this.store$.dispatch({
            type: chatAction.changeActivePerson,
            payload: {
                item,
                defaultPanelIsShow: false
            }
        });
    }
    // 滚动加载消息列表
     loadMoreEmit(num) {
        // num.loadingCount 滚动加载第几页的页数
        if (this.active.activeIndex < 0) {
            return;
        }
        this.store$.dispatch({
            type: chatAction.getSourceUrl,
            payload: {
                active: this.active,
                messageList: this.messageList,
                loadingCount: num.loadingCount
            }
        });
        if (this.active.type === 4) {
            this.store$.dispatch({
                type: chatAction.getMemberAvatarUrl,
                payload: {
                    active: this.active,
                    messageList: this.messageList,
                    loadingCount: num.loadingCount
                }
            });
        }
    }
    // 删除本地会话列表
     deleteConversationItemEmit(item) {
        this.store$.dispatch({
            type: chatAction.deleteConversationItem,
            payload: {
                item
            }
        });
    }
    // 发送文本消息
     sendMsgEmit(data, active?) {
        let activePerson = active || this.active;
        // repeatSend = true重发消息
        /**
         * success
         * 取值 状态
         * 1  正在发送
         * 2  发送成功
         * 3  发送失败
         */
        let msgs: any = {
            content: {
                msg_type: 'text',
                from_id: global.user,
                msg_body: {
                    text: data.content,
                    extras: data.localExtras
                }
            },
            ctime_ms: new Date().getTime(),
            success: 1,
            msgKey: this.msgKey++,
            unread_count: 0
        };

        console.log(activePerson)
        console.log(activePerson.type)
        console.log(msgs)
        // 转发消息失败重发单聊消息
        if (activePerson.type === 3 && data.repeatSend && data.isTransmitMsg) {
            this.store$.dispatch({
                type: chatAction.transmitSingleMessage,
                payload: {
                    msgs: data,
                    select: {
                        name: activePerson.name,
                        type: 3
                    },
                    key: activePerson.key
                }
            });
            // 转发消息失败重发群聊消息
        } else if (activePerson.type === 4 && data.repeatSend && data.isTransmitMsg) {
            this.store$.dispatch({
                type: chatAction.transmitGroupMessage,
                payload: {
                    msgs: data,
                    select: {
                        key: activePerson.key,
                        type: 4
                    },
                    key: activePerson.key
                }
            });
            // 发送单聊消息
        } else if (activePerson.type === 3 && !data.repeatSend) {
            let singleMsg: any = {
                target_username: activePerson.name,
                content: data.content,
                need_receipt: true
            };
            if (data.extras) {
                singleMsg.extras = data.extras;
            }
            msgs.singleMsg = singleMsg;
            msgs.msg_type = 3;
            this.store$.dispatch({
                type: chatAction.sendSingleMessage,
                payload: {
                    singleMsg,
                    key: activePerson.key,
                    msgs,
                    active: activePerson
                }
            });
            // 发送群组消息
        } else if (activePerson.type === 4 && !data.repeatSend) {
            let groupMsg: any = {
                target_gid: activePerson.key,
                content: data.content,
                need_receipt: true
            };
            if (data.extras) {
                groupMsg.extras = data.extras;
            }
            if (data.isAtAll) {
                groupMsg.at_list = [];
            } else if (data.atList && data.atList.length > 0) {
                groupMsg.at_list = data.atList;
            }
            msgs.groupMsg = groupMsg;
            msgs.msg_type = 4;
            this.store$.dispatch({
                type: chatAction.sendGroupMessage,
                payload: {
                    groupMsg,
                    key: activePerson.key,
                    msgs,
                    active: activePerson
                }
            });
            // 重发单聊消息
        } else if (activePerson.type === 3 && data.repeatSend) {
            this.store$.dispatch({
                type: chatAction.sendSingleMessage,
                payload: {
                    singleMsg: data.singleMsg,
                    key: activePerson.key,
                    msgs: data,
                    active: activePerson
                }
            });
            // 重发群聊消息
        } else if (activePerson.type === 4 && data.repeatSend) {
            this.store$.dispatch({
                type: chatAction.sendGroupMessage,
                payload: {
                    groupMsg: data.groupMsg,
                    key: activePerson.key,
                    msgs: data,
                    active: activePerson
                }
            });
        }
    }
    // 发送图片消息
     sendPicEmit(data) {
        const file = this.elementRef.nativeElement.querySelector('#sendPic');
        // repeatSend = true重发消息
        if (data.repeatSend && this.active.type === 3 && data.isTransmitMsg) {
            this.store$.dispatch({
                type: chatAction.transmitSinglePic,
                payload: {
                    msgs: data,
                    select: {
                        name: this.active.name,
                        type: 3
                    },
                    key: this.active.key
                }
            });
            return;
        } else if (data.repeatSend && this.active.type === 4 && data.isTransmitMsg) {
            this.store$.dispatch({
                type: chatAction.transmitGroupPic,
                payload: {
                    msgs: data,
                    select: {
                        key: this.active.key,
                        type: 4
                    },
                    key: this.active.key
                }
            });
            return;
        } else if (data.repeatSend && this.active.type === 3) {
            this.store$.dispatch({
                type: chatAction.sendSinglePic,
                payload: {
                    singlePicFormData: data.singlePicFormData,
                    key: this.active.key,
                    msgs: data,
                    active: this.active
                }
            });
            return;
        } else if (data.repeatSend && this.active.type === 4) {
            this.store$.dispatch({
                type: chatAction.sendGroupPic,
                payload: {
                    groupPicFormData: data.groupPicFormData,
                    key: this.active.key,
                    msgs: data,
                    active: this.active
                }
            });
            return;
        }
        // 粘贴图片发送
        if (data.type === 'paste') {
            this.sendPicContent(data.info, data.img);
            // 正常发送图片
        } else if (data.type === 'send') {
            const isNotImage = '选择的文件必须是图片';
            Util.imgReader(file,
                () => this.selectImageError(isNotImage),
                (value) => this.sendPicContent(value, data.img)
            );
            // 发送飞马熊表情
        } else if (data.type === 'jpushEmoji') {
            const msg = {
                content: {
                    from_id: global.user,
                    msg_type: 'image',
                    msg_body: data.jpushEmoji.body,
                    target_id: this.active.name
                },
                ctime_ms: new Date().getTime(),
                success: 1,
                msgKey: this.msgKey++,
                unread_count: 0,
                hasLoad: false,
                showMoreIcon: false,
                conversation_time_show: 'today',
                isTransmitMsg: true
            };
            const message = {
                select: this.active,
                msgs: msg,
                key: this.active.key
            };
            let type;
            if (this.active.type === 3) {
                type = chatAction.transmitSinglePic;
            } else if (this.active.type === 4) {
                type = chatAction.transmitGroupPic;
            }
            this.store$.dispatch({
                type,
                payload: message
            });
        }
    }
     sendPicContent(value, data) {
        let msgs: any = {
            content: {
                from_id: global.user,
                msg_type: 'image',
                msg_body: {
                    media_url: value.src,
                    width: value.width,
                    height: value.height
                }
            },
            ctime_ms: new Date().getTime(),
            success: 1,
            msgKey: this.msgKey++,
            unread_count: 0
        };
        // 发送单聊图片
        if (this.active.type === 3) {
            const singlePicFormData = {
                target_username: this.active.name,
                appkey: authPayload.appkey,
                image: data,
                need_receipt: true
            };
            msgs.singlePicFormData = singlePicFormData;
            msgs.msg_type = 3;
            this.store$.dispatch({
                type: chatAction.sendSinglePic,
                payload: {
                    singlePicFormData,
                    key: this.active.key,
                    msgs,
                    active: this.active
                }
            });
            // 发送群聊图片
        } else if (this.active.type === 4) {
            const groupPicFormData = {
                target_gid: this.active.key,
                image: data,
                need_receipt: true
            };
            msgs.groupPicFormData = groupPicFormData;
            msgs.msg_type = 4;
            this.store$.dispatch({
                type: chatAction.sendGroupPic,
                payload: {
                    groupPicFormData,
                    key: this.active.key,
                    msgs,
                    active: this.active
                }
            });
        }
    }
     sendFileEmit(data) {
        // 转发消息失败重发消息
        if (data.repeatSend && this.active.type === 3 && data.isTransmitMsg) {
            this.store$.dispatch({
                type: chatAction.transmitSingleFile,
                payload: {
                    msgs: data,
                    select: {
                        name: this.active.name,
                        type: 3
                    },
                    key: this.active.key
                }
            });
            return;
        } else if (data.repeatSend && this.active.type === 4 && data.isTransmitMsg) {
            this.store$.dispatch({
                type: chatAction.transmitGroupFile,
                payload: {
                    msgs: data,
                    select: {
                        key: this.active.key,
                        type: 4
                    },
                    key: this.active.key
                }
            });
            return;
        }
        // repeatSend = true重发消息
        let msgs;
        if (!data.repeatSend) {
            const ext = Util.getExt(data.fileData.name);
            msgs = {
                content: {
                    msg_type: 'file',
                    from_id: global.user,
                    from_name: this.selfInfo.nickname,
                    msg_body: {
                        fname: data.fileData.name,
                        fsize: data.fileData.size,
                        extras: {
                            fileSize: data.fileData.size,
                            fileType: ext
                        }
                    }
                },
                ctime_ms: new Date().getTime(),
                success: 1,
                msgKey: this.msgKey++,
                unread_count: 0
            };
        }
        // 发送单聊文件
        if (this.active.type === 3 && !data.repeatSend) {
            const ext = Util.getExt(data.fileData.name);
            const singleFile = {
                file: data.file,
                target_username: this.active.name,
                appkey: authPayload.appkey,
                extras: {
                    fileSize: data.fileData.size,
                    fileType: ext
                },
                need_receipt: true
            };
            msgs.singleFile = singleFile;
            msgs.msg_type = 3;
            this.store$.dispatch({
                type: chatAction.sendSingleFile,
                payload: {
                    key: this.active.key,
                    msgs,
                    singleFile,
                    active: this.active
                }
            });
            // 发送群组文件
        } else if (this.active.type === 4 && !data.repeatSend) {
            const ext = Util.getExt(data.fileData.name);
            const groupFile = {
                file: data.file,
                target_gid: this.active.key,
                extras: {
                    fileSize: data.fileData.size,
                    fileType: ext
                },
                need_receipt: true
            };
            msgs.groupFile = groupFile;
            msgs.msg_type = 4;
            this.store$.dispatch({
                type: chatAction.sendGroupFile,
                payload: {
                    key: this.active.key,
                    msgs,
                    groupFile,
                    active: this.active
                }
            });
        } else if (this.active.type === 3 && data.repeatSend) {
            this.store$.dispatch({
                type: chatAction.sendSingleFile,
                payload: {
                    key: this.active.key,
                    msgs: data,
                    singleFile: data.singleFile,
                    active: this.active
                }
            });
        } else if (this.active.type === 4 && data.repeatSend) {
            this.store$.dispatch({
                type: chatAction.sendGroupFile,
                payload: {
                    key: this.active.key,
                    msgs: data,
                    groupFile: data.groupFile,
                    active: this.active
                }
            });
        }
    }
    // 转发位置消息失败重发
     sendLocationEmit(data) {
        let type = '';
        let payload;
        if (this.active.type === 3) {
            type = chatAction.transmitSingleLocation;
            payload = {
                msgs: data,
                select: {
                    name: this.active.name,
                    type: 3
                },
                key: this.active.key
            };
        } else {
            type = chatAction.transmitGroupLocation;
            payload = {
                msgs: data,
                select: {
                    key: this.active.key,
                    type: 4
                },
                key: this.active.key
            };
        }
        this.store$.dispatch({
            type,
            payload
        });
    }
    // 保存草稿
     saveDraftEmit(tempArr) {
        this.store$.dispatch({
            type: chatAction.saveDraft,
            payload: tempArr
        });
    }
    // 查看用户信息
     watchOtherInfoEmit(info) {
        this.store$.dispatch({
            type: chatAction.watchOtherInfo,
            payload: info
        });
    }
    // 查看个人信息
     watchSelfInfoEmit() {
        this.store$.dispatch({
            type: mainAction.showSelfInfo,
            payload: {
                show: true
            }
        });
    }
    // 用户信息面板中，关闭面板或者建立单聊
     OtherInfoEmit(item) {
        if (item && item.name !== this.active.name) {
            this.store$.dispatch({
                type: chatAction.createOtherChat,
                payload: item
            });
        }
        // 切换到会话列表tab
        if (item) {
            this.store$.dispatch({
                type: chatAction.changeHideAll,
                payload: 0
            });
            this.store$.dispatch({
                type: mainAction.changeListTab,
                payload: 0
            });
        }
        this.store$.dispatch({
            type: chatAction.hideOtherInfo,
            payload: {
                show: false,
                info: {}
            }
        });
    }
    // 查看群设置
     groupSettingEmit() {
        const groupSetting = this.messageList[this.active.activeIndex].groupSetting;
        this.store$.dispatch({
            type: chatAction.groupSetting,
            payload: {
                active: this.active,
                show: true,
                // 是否已经请求过
                isCache: groupSetting && groupSetting.groupInfo,
                loading: true
            }
        });
    }
    // 关闭群设置
     closeGroupSettingEmit() {
        this.store$.dispatch({
            type: chatAction.groupSetting,
            payload: {
                show: false
            }
        });
    }
    // 退出群聊
     exitGroupEmit(groupInfo) {
        this.store$.dispatch({
            type: mainAction.showModalTip,
            payload: {
                show: true,
                info: {
                    groupInfo,
                    title: '退群',
                    tip: `确定要退出 ${groupInfo.name} 吗？`,
                    actionType: mainAction.exitGroupConfirmModal
                }
            }
        });
    }
    // 增加或者取消单聊黑名单
     changeSingleBlackEmit(otherInfo) {
        if (otherInfo.black) {
            this.store$.dispatch({
                type: chatAction.deleteSingleBlack,
                payload: otherInfo
            });
        } else {
            this.store$.dispatch({
                type: mainAction.showModalTip,
                payload: {
                    show: true,
                    info: {
                        active: otherInfo,
                        title: '加入黑名单',
                        tip: `确定将 ${otherInfo.memo_name || otherInfo.nickname
                            || otherInfo.username} 加入黑名单吗？`,
                        actionType: mainAction.addBlackListConfirmModal
                    }
                }
            });
        }
    }
    // 增加或者取消单聊免打扰
     changeSingleNoDisturbEmit(otherInfo) {
        if (otherInfo.noDisturb) {
            this.store$.dispatch({
                type: chatAction.deleteSingleNoDisturb,
                payload: otherInfo
            });
        } else {
            this.store$.dispatch({
                type: mainAction.showModalTip,
                payload: {
                    show: true,
                    info: {
                        active: otherInfo,
                        title: '消息免打扰',
                        tip: `确定将 ${otherInfo.memo_name || otherInfo.nickname
                            || otherInfo.username} 加入免打扰吗？`,
                        subTip: '设置之后正常接收消息，但无通知提示',
                        actionType: mainAction.addSingleNoDisturbConfirmModal
                    }
                }
            });
        }
    }
    // 删除群成员
     deleteMemberEmit(item) {
        this.store$.dispatch({
            type: mainAction.showModalTip,
            payload: {
                show: true,
                info: {
                    group: this.active,
                    deleteItem: item,
                    title: '删除群成员',
                    tip: `确定删除群成员 ${item.memo_name || item.nickName || item.username} 吗？`,
                    actionType: mainAction.deleteMemberConfirmModal
                }
            }
        });
    }
    // 显示群描述模态框
     modifyGroupDescriptionEmit() {
        this.store$.dispatch({
            type: chatAction.groupDescription,
            payload: {
                show: true
            }
        });
    }
    // 更新群信息
     updateGroupInfoEmit(newGroupInfo) {
        if (newGroupInfo) {
            this.store$.dispatch({
                type: chatAction.updateGroupInfo,
                payload: newGroupInfo
            });
        } else {
            this.store$.dispatch({
                type: chatAction.groupDescription,
                payload: {
                    show: false
                }
            });
        }
    }
    // 多人会话
     addGroupEmit() {
        this.store$.dispatch({
            type: mainAction.createGroupShow,
            payload: {
                show: true,
                display: true,
                info: {
                    activeSingle: this.active,
                    action: 'many',
                    selfInfo: this.selfInfo
                }
            }
        });
    }
    // 添加群成员
     addMemberEmit() {
        this.store$.dispatch({
            type: mainAction.createGroupShow,
            payload: {
                show: true,
                display: true,
                info: {
                    filter: this.groupSetting.memberList,
                    action: 'add',
                    activeGroup: this.active
                }
            }
        });
    }
    // 修改群名
     modifyGroupNameEmit(newGroupName) {
        const groupSetting = Object.assign({}, this.groupSetting.groupInfo,
            { name: newGroupName, actionType: 'modifyName' });
        this.store$.dispatch({
            type: chatAction.updateGroupInfo,
            payload: groupSetting
        });
    }
    // 显示视频模态框
     playVideoEmit(url) {
        this.store$.dispatch({
            type: chatAction.playVideoShow,
            payload: {
                url,
                show: true
            }
        });
    }
    // 关闭视频模态框
     closeVideoEmit() {
        this.store$.dispatch({
            type: chatAction.playVideoShow,
            payload: {
                url: '',
                show: false
            }
        });
    }
    // 消息撤回
     msgRetractEmit(item) {
        this.store$.dispatch({
            type: chatAction.msgRetract,
            payload: item
        });
    }
    // 转发消息或发送名片弹窗显示
     msgTransmitEmit(item) {
        this.messageTransmit.list = this.conversationList;
        this.messageTransmit.show = true;
        this.messageTransmit.type = 'msgTransmit';
        this.transmitAllMsg = Util.deepCopyObj(item);
    }
    // 转发消息或发送名片弹窗搜索
     searchMessageTransmitEmit(keywords) {
        this.store$.dispatch({
            type: chatAction.searchMessageTransmit,
            payload: keywords
        });
    }
    // 转发消息或发送名片
     confirmTransmitEmit(info) {
        if (info.type === 'sendCard') {
            this.sendCardConfirm(info);
        } else if (info.type === 'msgTransmit') {
            this.msgTransmitConfirm(info);
        }
    }
    // 发送名片发送模态框点击确定发送名片
     sendCardConfirm(info) {
        this.sendBusinessCardCount = 0;
        let newInfo;
        if (this.otherInfo.show) {
            newInfo = this.otherInfo.info;
        } else {
            if (this.selfInfo.username) {
                this.selfInfo.name = this.selfInfo.username;
            }
            if (this.selfInfo.nickname) {
                this.selfInfo.nickName = this.selfInfo.nickname;
            }
            newInfo = this.selfInfo;
        }
        for (let select of info.selectList) {
            const msg = {
                content: '推荐了一张名片',
                extras: {
                    userName: newInfo.name,
                    appKey: newInfo.appkey,
                    businessCard: 'businessCard'
                },
                localExtras: {
                    userName: newInfo.name,
                    appKey: newInfo.appkey,
                    businessCard: 'businessCard',
                    media_url: newInfo.avatarUrl,
                    nickName: newInfo.nickName
                }
            };
            this.sendBusinessCardCount++;
            this.sendMsgEmit(msg, select);
        }
    }
    // 消息面板发送名片
     businessCardSendEmit(user) {
        const msg = {
            content: '推荐了一张名片',
            extras: {
                userName: user.name,
                appKey: user.appkey,
                businessCard: 'businessCard'
            },
            localExtras: {
                userName: user.name,
                appKey: user.appkey,
                businessCard: 'businessCard',
                media_url: user.avatarUrl,
                nickName: user.nickName
            }
        };
        this.sendMsgEmit(msg);
    }
    // 消息转发（包括各种消息的转发）
     msgTransmitConfirm(info) {
        delete this.transmitAllMsg.msg_id;
        this.transmitAllMsg.msgKey = this.msgKey++;
        this.transmitAllMsg.totalTransmitNum = info.selectList.length;
        this.transmitAllMsg.ctime_ms = new Date().getTime();
        this.transmitAllMsg.conversation_time_show = 'today';
        this.transmitAllMsg.time_show = '';
        this.transmitAllMsg.showMoreIcon = false;
        this.transmitAllMsg.hasLoad = false;
        this.transmitAllMsg.content.from_id = global.user;
        this.transmitAllMsg.isTransmitMsg = true;
        this.transmitAllMsg.unread_count = 0;
        this.transmitAllMsg.success = 1;
        for (let item of info.selectList) {
            this.transmitAllMsg.content.target_id = item.name;
            this.transmitAllMsg.type = item.type;
            if (item.type === 3) {
                this.transmitAllMsg.msg_type = 3;
            } else {
                this.transmitAllMsg.msg_type = 4;
            }
            const data = {
                select: item,
                msgs: Util.deepCopyObj(this.transmitAllMsg),
                key: item.key,
                transmitMsg: true
            };
            let type = '';
            switch (this.transmitAllMsg.content.msg_type) {
                case 'text':
                    if (item.type === 3) {
                        type = chatAction.transmitSingleMessage;
                    } else {
                        type = chatAction.transmitGroupMessage;
                    }
                    break;
                case 'image':
                    if (item.type === 3) {
                        type = chatAction.transmitSinglePic;
                    } else {
                        type = chatAction.transmitGroupPic;
                    }
                    break;
                case 'file':
                    if (item.type === 3) {
                        type = chatAction.transmitSingleFile;
                    } else {
                        type = chatAction.transmitGroupFile;
                    }
                    break;
                case 'location':
                    if (item.type === 3) {
                        type = chatAction.transmitSingleLocation;
                    } else {
                        type = chatAction.transmitGroupLocation;
                    }
                    break;
                default:
            }
            this.store$.dispatch({
                type,
                payload: data
            });
        }
    }
    // 显示发送验证消息的模态框
     addFriendEmit(user) {
        this.store$.dispatch({
            type: chatAction.showVerifyModal,
            payload: {
                info: user,
                show: true
            }
        });
    }
    // 验证消息模态框的按钮
     verifyModalBtnEmit(verifyModalText) {
        const userInfo = Object.assign({}, this.verifyModal.info, { verifyModalText });
        this.store$.dispatch({
            type: chatAction.addFriendConfirm,
            payload: userInfo
        });
        this.store$.dispatch({
            type: chatAction.showVerifyModal,
            payload: {
                info: {},
                show: false
            }
        });
    }
    // 修改备注名
     saveMemoNameEmit(info) {
        this.store$.dispatch({
            type: chatAction.saveMemoName,
            payload: info
        });
    }
    // 删除好友
     deleteFriendEmit(info) {
        this.store$.dispatch({
            type: mainAction.showModalTip,
            payload: {
                show: true,
                info: {
                    active: info,
                    title: '删除好友',
                    tip: `确定删除好友 ${info.memo_name || info.nickName || info.name} 吗？`,
                    actionType: mainAction.deleteFriendConfirmModal
                }
            }
        });
    }
    // 显示发送名片的模态框
     sendCardEmit() {
        this.messageTransmit.list = this.conversationList;
        this.messageTransmit.show = true;
        this.messageTransmit.type = 'sendCard';
    }
    // 从对方信息中同意或者拒绝好友请求
     verifyUserBtnEmit(verifyUser) {
        this.store$.dispatch({
            type: chatAction.hideOtherInfo,
            payload: {
                show: false,
                info: {}
            }
        });
        this.store$.dispatch({
            type: contactAction.isAgreeAddFriend,
            payload: verifyUser
        });
    }
     updateGroupAvatarEmit(groupAvatarInput) {
        this.getImgObj(groupAvatarInput.files[0]);
        groupAvatarInput.value = '';
    }
    // 选择图片出错
     selectImageError(tip: string) {
        this.store$.dispatch({
            type: mainAction.showModalTip,
            payload: {
                show: true,
                info: {
                    title: '提示',
                    tip,
                    actionType: '[main] must be image',
                    cancel: true
                }
            }
        });
    }
    // 获取图片对象
     getImgObj(file) {
        const isNotImage = '选择的文件必须是图片';
        const imageTooSmall = '选择的图片宽或高的尺寸太小，请重新选择图片';
        Util.getAvatarImgObj(file,
            () => this.selectImageError(isNotImage),
            () => this.selectImageError(imageTooSmall),
            (that, pasteFile, img) => {
                this.groupAvatar.info = {
                    src: that.result,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    pasteFile
                };
                this.groupAvatar.src = that.result;
                this.groupAvatar.show = true;
                this.groupAvatar.filename = file.name;
            }
        );
    }
    // 修改群头像
     groupAvatarEmit(groupAvatarInfo) {
        const groupSetting = {
            gid: this.groupSetting.groupInfo.gid,
            avatar: groupAvatarInfo.formData,
            actionType: 'modifyGroupAvatar',
            src: groupAvatarInfo.src
        };
        this.store$.dispatch({
            type: chatAction.updateGroupInfo,
            payload: groupSetting
        });
    }
    // 会话置顶
     conversationToTopEmit(item) {
        if (item.key > 0) {
            this.store$.dispatch({
                type: chatAction.conversationToTop,
                payload: item
            });
        } else {
            this.store$.dispatch({
                type: chatAction.conversationToTopSuccess,
                payload: item
            });
        }
    }
    // 从未读列表查看对方资料
     readListOtherInfoEmit(info) {
        this.store$.dispatch({
            type: chatAction.watchOtherInfo,
            payload: info
        });
    }
    // 透传消息-正在输入
     inputMessageEmit(input) {
        this.store$.dispatch({
            type: chatAction.inputMessage,
            payload: {
                active: this.active,
                input
            }
        });
    }
    // 群成员禁言/取消禁言
     keepSilenceEmit(item) {
        if (item.keep_silence) {
            this.store$.dispatch({
                type: chatAction.deleteGroupMemberSilence,
                payload: {
                    active: this.active,
                    item
                }
            });
        } else {
            this.store$.dispatch({
                type: chatAction.addGroupMemberSilence,
                payload: {
                    active: this.active,
                    item
                }
            });
        }
    }
    // 初始化所有数据
     init() {
        this.isLoaded = false;
        this.conversationList = [];
        this.messageList = [
            {
                key: 0,
                msgs: [],
                groupSetting: {
                    groupInfo: {},
                    memberList: []
                }
            }
        ];
        this.global = global;
        this.active = {
            name: '',
            nickName: '',
            key: '',
            activeIndex: -1,
            type: 0,
            change: false,
            shield: false,
            appkey: ''
        };
        this.defaultPanelIsShow = true;
        this.otherInfo = {
            show: false,
            info: {
                name: '',
                appkey: '',
                avatarUrl: '',
                nickName: ''
            }
        };
        this.blackMenu = {
            show: false,
            menu: []
        };
        this.groupSetting = {
            groupInfo: {
                name: '',
                desc: '',
                gid: 0
            },
            memberList: [],
            active: {},
            show: false
        };
        this.msgKey = 1;
        this.groupDescription = {
            show: false,
            description: {}
        };
        this.selfInfo = {};
        this.isCacheArr = [];
        this.playVideoShow = {
            show: false,
            url: ''
        };
        this.eventArr = [];
        this.hasOffline = 0;
        this.otherOptionScrollBottom = false;
        this.changeActiveScrollBottom = false;
        this.windowIsFocus = true;
        this.newMessageNotice = {
            timer: null,
            num: 0
        };
        this.messageTransmit = {
            list: [],
            show: false,
            type: ''
        };
        this.transmitAllMsg = {
            content: {
                msg_type: '',
                from_id: '',
                target_id: ''
            },
            msgKey: -1,
            totalTransmitNum: 0,
            ctime_ms: 0,
            conversation_time_show: '',
            time_show: '',
            hasLoad: false,
            showMoreIcon: false,
            type: 0,
            key: 0,
            isTransmitMsg: true,
            msg_id: 0,
            unread_count: 0,
            msg_type: 0,
            success: 1
        };
        this.verifyModal = {
            info: {},
            show: false
        };
        this.changeOtherInfoFlag = false;
        this.sendBusinessCardCount = 0;
        this.groupAvatar = {
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
            title: '群组头像'
        };
        this.unreadList = {
            show: false,
            info: {
                read: [],
                unread: []
            },
            loading: false
        };
        this.isMySelf = false;
        this.noLoadedMessage = [];
        this.inputMessage = '';
        this.inputMessageTimer = null;
    }
}
