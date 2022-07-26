import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { global, authPayload, StorageService } from '../../services/common';
import { AppStore } from '../../app.store';
import { mainAction } from './actions';
import { contactAction } from '../contact/actions';
import { chatAction } from '../chat/actions';
import { md5 } from '../../services/tools';
import { Util } from '../../services/util';

@Component({
    selector: 'app-main',
    styleUrls: ['./main.component.scss'],
    templateUrl: './main.component.html'
})

export class MainComponent implements OnInit, OnDestroy {
     private mainStream$;
     global = global;
     listTab = 0;
     selfInfo: any = {
        show: false,
        info: {
            avatarUrl: ''
        },
        loading: false
    };
    // 用来标识更新信息成功
     updateSelfInfoFlag = false;
     createGroup = {
        show: false,
        display: false,
        list: []
    };
     createGroupNext = {
        show: false,
        display: false,
        info: {}
    };
     islogoutShow = false;
     isModifyPasswordShow = false;
     _searchUserResult = {
        isSearch: false,
        result: {
            singleArr: [],
            groupArr: []
        }
    };
    get searchUserResult(){
        return JSON.parse(JSON.stringify(this._searchUserResult))
    }
    set searchUserResult(v){
        this._searchUserResult = JSON.parse(JSON.stringify(v))
    }
     tipModal = {
        show: false,
        info: {
            title: '',
            tip: ''
        }
    };
     createSingleChat = {
        show: false,
        info: ''
    };
     blackMenu = {
        show: false,
        menu: []
    };
     chatMenu = {
        show: false,
        info: [
            {
                key: 0,
                name: '发起单聊'
            },
            {
                key: 1,
                name: '发起群聊'
            },
            {
                key: 2,
                name: '添加好友'
            },
            {
                key: 3,
                name: '加入公开群'
            }
        ]
    };
     settingMenu = {
        show: false,
        info: [
            {
                key: 0,
                name: '修改密码'
            },
            {
                key: 1,
                name: '黑名单列表'
            },
            {
                key: 2,
                name: '退出登录'
            }
        ]
    };
     conversationHover = {
        tip: '会话',
        position: {
            left: 56,
            top: 4
        },
        show: false
    };
     contactHover = {
        tip: '通讯录',
        position: {
            left: 56,
            top: 4
        },
        show: false
    };
     roomHover = {
        tip: '聊天室',
        position: {
            left: 56,
            top: 4
        },
        show: false
    };
     createHover = {
        tip: '创建',
        position: {
            left: 56,
            top: 4
        },
        show: false
    };
     moreHover = {
        tip: '更多',
        position: {
            left: 56,
            top: 4
        },
        show: false
    };
     logoutKick = {
        show: false,
        info: {
            title: '',
            tip: ''
        }
    };
     badge = {
        conversation: 0,
        contact: 0
    };
     createSingleOption = {
        title: '发起单聊',
        placeholder: '输入用户名查找'
    };
     enterPublicGroup = {
        show: false,
        info: {}
    };
     groupInfo = {
        show: false,
        info: {}
    };
     groupVerifyModal = {
        show: false
    };
     groupAvatarInfo = {
        show: false,
        info: {},
        src: '',
        filename: ''
    };
    constructor(
        private store$: Store<AppStore>,
        private storageService: StorageService,
        private router: Router
    ) {
        // pass
    }
    public ngOnInit() {
        // 初始化state，避免频繁切换用户时，store的数据依然还保留上一用户的状态
        this.store$.dispatch({
            type: mainAction.init,
            payload: null
        });
        this.subscribeStore();
        this.store$.dispatch({
            type: mainAction.getSelfInfo,
            payload: null
        });
        this.store$.dispatch({
            type: mainAction.blackMenu,
            payload: {
                show: false
            }
        });
    }
    public ngOnDestroy() {
        this.mainStream$.unsubscribe();
    }
    @HostListener('window:click')  onClickWindow() {
        this.settingMenu.show = false;
        this.chatMenu.show = false;
    }
    // 关闭窗口时存cookie，五分钟之内进入页面还可以免登陆
    @HostListener('window:beforeunload')  onBeforeunloadWindow() {
        let time = 5 * 60 * 1000;
        this.storageService.set(md5('afterFiveMinutes-username'), global.user, true, time);
        this.storageService.set(md5('afterFiveMinutes-password'), global.password, true, time);
    }
     subscribeStore() {
        this.mainStream$ = this.store$.select((state) => {
            let mainState = state['mainReducer'];
            let contactState = state['contactReducer'];
            this.stateChanged(mainState, contactState);
            return state;
        }).subscribe((state) => {
            // pass
        });
    }
     stateChanged(mainState, contactState) {
        switch (mainState.actionType) {
            case mainAction.init:
                this.init();
                break;
            case contactAction.selectContactItem:
                this.listTab = mainState.listTab;
                break;
            case mainAction.showSelfInfo:

            case mainAction.updateSelfInfo:
                this.selfInfo = mainState.selfInfo;
                this.store$.dispatch({
                    type: mainAction.updateSelfInfoFlag
                });
                break;
            case mainAction.updateSelfInfoFlag:
                this.updateSelfInfoFlag = !this.updateSelfInfoFlag;
                break;
            case mainAction.changeListTab:
                this.listTab = mainState.listTab;
                break;
            case mainAction.createGroupShow:
                this.createGroup = mainState.createGroup;
                this.createGroup.list = contactState.friendList;
                break;
            case mainAction.createGroupSuccess:
                this.listTab = mainState.listTab;
                this.createGroup = mainState.createGroup;
                break;
            case mainAction.createGroupNextShow:
                this.createGroupNext = mainState.createGroupNext;
                if (!this.createGroupNext.show) {
                    this.groupAvatarInfo = {
                        show: false,
                        info: {},
                        src: '',
                        filename: ''
                    };
                }
                break;
            case mainAction.modifyPasswordShow:
                this.isModifyPasswordShow = mainState.modifyPasswordShow.show;
                if (mainState.modifyPasswordShow.repeatLogin !== '') {
                    this.repeatLogin(mainState);
                }
                break;
            case chatAction.searchUserSuccess:
                this.searchUserResult = mainState.searchUserResult;
                break;
            case mainAction.selectSearchUser:
                this.listTab = mainState.listTab;
                this.searchUserResult = mainState.searchUserResult;
                break;
            case mainAction.selectSearchRoomUser:
                this.listTab = mainState.listTab;
                this.searchUserResult = mainState.searchUserResult;
                break;
            case mainAction.hideModalTip:

            case mainAction.showModalTip:

            case mainAction.deleteMemberSuccess:

            case mainAction.exitGroupSuccess:
                this.tipModal = mainState.tipModal;
                break;
            case mainAction.createSingleChatShow:
                this.createSingleChat = mainState.createSingleChat;
                break;
            case mainAction.createSingleChatSuccess:
                this.createSingleChat = mainState.createSingleChat;
                this.listTab = mainState.listTab;
                break;
            case mainAction.emptySingleChatTip:
                this.createSingleChat.info = mainState.createSingleChat.info;
                break;
            case mainAction.blackMenuSuccess:
                this.blackMenu = mainState.blackMenu;
                break;
            case mainAction.hideBlackMenu:
                this.blackMenu = mainState.blackMenu;
                break;
            case mainAction.delSingleBlack:
                this.blackMenu = mainState.blackMenu;
                break;
            case mainAction.delSingleBlackSuccess:
                this.blackMenu = mainState.blackMenu;
                break;
            case mainAction.logoutKickShow:
                this.logoutKick = mainState.logoutKick;
                break;
            case contactAction.dispatchContactUnreadNum:
                this.badge.contact = mainState.contactUnreadNum;
                break;
            case chatAction.dispatchConversationUnreadNum:
                this.badge.conversation = mainState.conversationUnreadNum;
                break;
            case chatAction.createOtherChat:
                this.listTab = mainState.listTab;
                break;
            case chatAction.changeHideAll:
                this.listTab = mainState.listTab;
                break;
            case mainAction.enterPublicGroupShow:
                this.enterPublicGroup = mainState.enterPublicGroup;
                break;
            case mainAction.searchPublicGroupSuccess:
                this.enterPublicGroup = mainState.enterPublicGroup;
                this.groupInfo = mainState.groupInfo;
                break;
            case mainAction.groupVerifyModal:
                this.groupVerifyModal = mainState.groupVerifyModal;
                break;
            default:
        }
    }
    // 修改密码后重新登录
     repeatLogin(mainState) {
        global.password = mainState.modifyPasswordShow.repeatLogin;
        let time = 5 * 60 * 1000;
        let usernameKey = md5('afterFiveMinutes-username');
        let passwordKey = md5('afterFiveMinutes-password');
        this.storageService.set(usernameKey, global.user, true, time);
        this.storageService.set(passwordKey, global.password, true, time);
        this.store$.dispatch({
            type: mainAction.login,
            payload: {
                username: global.user,
                password: global.password,
                md5: true
            }
        });
    }
    // 切换聊天面板和联系人面板
     changeListTab(index) {
        if (this.listTab !== index) {
            this.store$.dispatch({
                type: mainAction.changeListTab,
                payload: index
            });
        }
    }
    // 获取个人信息
     getSelfInfo(event) {
        this.store$.dispatch({
            type: mainAction.showSelfInfo,
            payload: {
                show: true,
                loading: false
            }
        });
    }
    // 个人信息模态框里传递的事件
     selfInfoEmit(newInfo) {
        if (!newInfo) {
            this.store$.dispatch({
                type: mainAction.showSelfInfo,
                payload: {
                    show: false,
                    loading: false
                }
            });
        }
        if (newInfo && newInfo.info) {
            this.store$.dispatch({
                type: mainAction.updateSelfInfo,
                payload: newInfo
            });
        }
    }
    // 显示创建群聊第一步
     createGroupEmit(info) {
        if (info && info.add) {
            this.store$.dispatch({
                type: mainAction.addGroupMember,
                payload: info
            });
        } else if (info && !info.add) {
            this.store$.dispatch({
                type: mainAction.createGroup,
                payload: info
            });
        } else {
            this.store$.dispatch({
                type: mainAction.createGroupShow,
                payload: {
                    show: false,
                    display: false,
                    info: {}
                }
            });
            this.store$.dispatch({
                type: mainAction.createGroupNextShow,
                payload: {
                    show: false,
                    display: false,
                    info: {}
                }
            });
        }
    }
    // 创建群聊第一步点击下一步
     nextCreateGroupEmit(groupInfo) {
        this.store$.dispatch({
            type: mainAction.createGroupShow,
            payload: {
                show: true,
                display: false,
                info: {}
            }
        });
        this.store$.dispatch({
            type: mainAction.createGroupNextShow,
            payload: {
                show: true,
                display: true,
                info: groupInfo
            }
        });
    }
    // 创建群聊第二步点击上一步
     createGroupPrevEmit() {
        this.store$.dispatch({
            type: mainAction.createGroupShow,
            payload: {
                show: true,
                display: true,
                info: {}
            }
        });
        this.store$.dispatch({
            type: mainAction.createGroupNextShow,
            payload: {
                show: true,
                display: false
            }
        });
    }
    // 关闭创建群聊第二步的模态框
     closeCreateGroupNextEmit() {
        this.store$.dispatch({
            type: mainAction.createGroupNextShow,
            payload: {
                show: false,
                display: false,
                info: {}
            }
        });
        this.store$.dispatch({
            type: mainAction.createGroupShow,
            payload: {
                show: false,
                display: false,
                info: {}
            }
        });
    }
    // 创建群聊点击完成
     completeCreateGroupEmit(groupInfo) {
        this.store$.dispatch({
            type: mainAction.createGroup,
            payload: groupInfo
        });
        this.store$.dispatch({
            type: mainAction.changeListTab,
            payload: 0
        });
    }
    // 修改密码
     modifyPasswordEmit(info) {
        if (info) {
            this.store$.dispatch({
                type: mainAction.modifyPassword,
                payload: info
            });
        } else {
            this.store$.dispatch({
                type: mainAction.modifyPasswordShow,
                payload: {
                    repeatLogin: '',
                    show: false
                }
            });
        }
    }
    // 搜索keyup事件
     searchUserEmit(searchInfo) {
        this.store$.dispatch({
            type: mainAction.searchUser,
            payload: searchInfo
        });
    }
    // 点击搜索结果
     selectUserResultEmit(item) {
        if (item.gid) {
            item.group = true;
            item.type = 4;
            item.key = item.gid;
        }
        this.store$.dispatch({
            type: mainAction.selectSearchUser,
            payload: item
        });
    }
     selectUserRoomResultEmit(item) {
        this.store$.dispatch({
            type: mainAction.selectSearchRoomUser,
            payload: item
        });
    }
    // 创建单聊/添加好友模态框确定取消按钮
     createSingleChatEmit(info) {
        // 点击取消
        if (!info) {
            this.store$.dispatch({
                type: mainAction.createSingleChatShow,
                payload: {
                    show: false,
                    info: ''
                }
            });
            // 点击确定 输入为空
        } else if (info.singleName === '') {
            let text = info.type === 'addFriend' ? '请输入要添加好友的用户名' : '请输入要单聊的用户名';
            this.store$.dispatch({
                type: mainAction.createSingleChatShow,
                payload: {
                    show: true,
                    info: text
                }
            });
            // 点击确定 如果单聊搜索到自己
        } else if (info.singleName === global.user) {
            this.store$.dispatch({
                type: mainAction.showSelfInfo,
                payload: {
                    show: true,
                    loading: false
                }
            });
            this.store$.dispatch({
                type: mainAction.createSingleChatShow,
                payload: {
                    show: false,
                    info: ''
                }
            });
            // 点击确定
        } else if (info.singleName) {
            this.store$.dispatch({
                type: mainAction.createSingleChatAction,
                payload: info
            });
        }
    }
    // 清空单聊模态框错误提示
     emptySingleChatTipEmit() {
        this.store$.dispatch({
            type: mainAction.emptySingleChatTip,
            payload: {
                info: ''
            }
        });
    }
    // 点击黑名单模态框确定按钮
     blackMenuConfirmEmit() {
        this.store$.dispatch({
            type: mainAction.hideBlackMenu,
            payload: {
                menu: [],
                show: false
            }
        });
    }
    // 加入黑名单列表
     delSingleBlackEmit(user) {
        this.store$.dispatch({
            type: mainAction.delSingleBlack,
            payload: user
        });
    }
     modalTipEmit(info) {
        // 提示模态框点击确定按钮
        if (info) {
            switch (info.actionType) {
                case mainAction.logoutShowConfirmModal:
                    this.store$.dispatch({
                        type: mainAction.logoutAction,
                        payload: null
                    });
                    break;
                case mainAction.addBlackListConfirmModal:
                    this.store$.dispatch({
                        type: mainAction.addBlackListAction,
                        payload: info.active
                    });
                    break;
                case mainAction.exitGroupConfirmModal:
                    this.store$.dispatch({
                        type: mainAction.exitGroupAction,
                        payload: info.groupInfo.gid
                    });
                    break;
                case mainAction.deleteMemberConfirmModal:
                    this.store$.dispatch({
                        type: mainAction.deleteMemberAction,
                        payload: {
                            deleteItem: info.deleteItem,
                            group: info.group
                        }
                    });
                    break;
                case mainAction.addSingleNoDisturbConfirmModal:
                    this.store$.dispatch({
                        type: mainAction.addSingleNoDisturbAction,
                        payload: info.active
                    });
                    break;
                case mainAction.deleteFriendConfirmModal:
                    this.store$.dispatch({
                        type: mainAction.deleteFriend,
                        payload: info.active
                    });
                    break;
                default:
                    this.store$.dispatch({
                        type: mainAction.hideModalTip,
                        payload: {
                            show: false,
                            info: {}
                        }
                    });
            }
            // 模态框点击取消按钮
        } else {
            this.store$.dispatch({
                type: mainAction.hideModalTip,
                payload: {
                    show: false,
                    info: {}
                }
            });
        }
    }
    // 点击左下角 创建按钮
     chatMenuShow(event) {
        event.stopPropagation();
        this.settingMenu.show = false;
        this.chatMenu.show = !this.chatMenu.show;
    }
     selectChatMenuItemEmit(item) {
        let type = '';
        switch (item.key) {
            case 0:
                this.createSingleOption = {
                    title: '发起单聊',
                    placeholder: '输入用户名查找'
                };
                this.store$.dispatch({
                    type: mainAction.createSingleChatShow,
                    payload: {
                        show: true,
                        info: ''
                    }
                });
                break;
            case 1:
                this.store$.dispatch({
                    type: mainAction.createGroupShow,
                    payload: {
                        show: true,
                        display: true,
                        info: {}
                    }
                });
                break;
            case 2:
                this.createSingleOption = {
                    title: '添加好友',
                    placeholder: '输入用户名'
                };
                this.store$.dispatch({
                    type: mainAction.createSingleChatShow,
                    payload: {
                        show: true,
                        info: ''
                    }
                });
                break;
            case 3:
                this.store$.dispatch({
                    type: mainAction.enterPublicGroupShow,
                    payload: {
                        show: true,
                        info: ''
                    }
                });
                break;
            default:
        }
        this.chatMenu.show = false;
    }
    // 点击左下角设置按钮
     settingMenuShow(event) {
        event.stopPropagation();
        this.chatMenu.show = false;
        this.settingMenu.show = !this.settingMenu.show;
    }
     selectSettingItemEmit(item) {
        switch (item.key) {
            case 0:
                this.store$.dispatch({
                    type: mainAction.modifyPasswordShow,
                    payload: {
                        repeatLogin: '',
                        show: true
                    }
                });
                break;
            case 1:
                this.store$.dispatch({
                    type: mainAction.blackMenu,
                    payload: {
                        show: true
                    }
                });
                break;
            case 2:
                // 展示全局的模态框
                this.store$.dispatch({
                    type: mainAction.showModalTip,
                    payload: {
                        show: true,
                        info: {
                            title: '退出',          // 模态框标题
                            tip: '确定要退出web jchat吗？',   // 模态框内容
                            actionType: mainAction.logoutShowConfirmModal// 哪种操作，点击确定时可以执行对应操作
                            // success: 1 / 2               // 成功的提示框/失败的提示框，1.5s后会自动消失
                        }
                    }
                });
                break;
            default:
        }
        this.settingMenu.show = false;
    }
    // 被其他设备登录踢
     logoutKickEmit(info) {
        // 重新登录
        if (info) {
            this.store$.dispatch({
                type: mainAction.login,
                payload: {
                    username: global.user,
                    password: global.password,
                    md5: true,
                    reload: true
                }
            });
            // 去登录页面
        } else {
            this.router.navigate(['/login']);
        }
    }
    // 选择图片出错
     selectImageErrorEmit(tip: string) {
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
     sendCardEmit(info) {
        this.store$.dispatch({
            type: mainAction.dispatchSendSelfCard,
            payload: info
        });
    }
     enterGroupComfirmEmit(value) {
        this.store$.dispatch({
            type: mainAction.searchPublicGroup,
            payload: value
        });
    }
    // 显示群组验证模态框
     applyEnterGroupEmit(groupInfo) {
        this.store$.dispatch({
            type: mainAction.groupVerifyModal,
            payload: {
                show: true
            }
        });
    }
    // 发送群组验证信息
     groupVerifyModalBtnEmit(verifyText) {
        this.store$.dispatch({
            type: mainAction.sendGroupVerifyMessage,
            payload: {
                info: this.groupInfo.info,
                text: verifyText
            }
        });
    }
    // 创建群聊选择头像
     changeCreateGroupAvatarEmit(file) {
        this.getImgObj(file.files[0]);
    }
    // 获取图片对象
     getImgObj(file) {
        let isNotImage = '选择的文件必须是图片';
        let imageTooSmall = '选择的图片宽或高的尺寸太小，请重新选择图片';
        Util.getAvatarImgObj(file,
            () => this.selectImageErrorEmit(isNotImage),
            () => this.selectImageErrorEmit(imageTooSmall),
            (that, pasteFile, img) => {
                this.groupAvatarInfo.info = {
                    src: that.result,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    pasteFile
                };
                this.groupAvatarInfo.src = that.result;
                this.groupAvatarInfo.show = true;
                this.groupAvatarInfo.filename = file.name;
            }
        );
    }
     groupAvatarEmit(groupInfo) {
        this.groupAvatarInfo = groupInfo;
    }
    // 搜索到已经在群里的群聊，点击发消息进入会话
     changeGroupConversationEmit(group) {
        this.store$.dispatch({
            type: contactAction.selectContactItem,
            payload: group
        });
        this.store$.dispatch({
            type: mainAction.changeListTab,
            payload: 0
        });
    }
    // 清空加入公开群的错误提示
     emptyEnterGroupTipEmit() {
        this.store$.dispatch({
            type: mainAction.enterPublicGroupShow,
            payload: {
                show: true,
                info: {
                    text: ''
                }
            }
        });
    }
     init() {
        this.listTab = 0;
        this.selfInfo = {
            show: false,
            info: {
                avatarUrl: ''
            },
            loading: false
        };
        // 用来标识更新信息成功
        this.updateSelfInfoFlag = false;
        this.createGroup = {
            show: false,
            display: false,
            list: []
        };
        this.createGroupNext = {
            show: false,
            display: false,
            info: {}
        };
        this.islogoutShow = false;
        this.isModifyPasswordShow = false;
        this.searchUserResult = {
            isSearch: false,
            result: {
                singleArr: [],
                groupArr: []
            }
        };
        this.tipModal = {
            show: false,
            info: {
                title: '',
                tip: ''
            }
        };
        this.createSingleChat = {
            show: false,
            info: ''
        };
        this.blackMenu = {
            show: false,
            menu: []
        };
        this.chatMenu = {
            show: false,
            info: [
                {
                    key: 0,
                    name: '发起单聊'
                },
                {
                    key: 1,
                    name: '发起群聊'
                },
                {
                    key: 2,
                    name: '添加好友'
                },
                {
                    key: 3,
                    name: '加入公开群'
                }
            ]
        };
        this.settingMenu = {
            show: false,
            info: [
                {
                    key: 0,
                    name: '修改密码'
                },
                {
                    key: 1,
                    name: '黑名单列表'
                },
                {
                    key: 2,
                    name: '退出登录'
                }
            ]
        };
        this.conversationHover = {
            tip: '会话',
            position: {
                left: 56,
                top: 4
            },
            show: false
        };
        this.contactHover = {
            tip: '通讯录',
            position: {
                left: 56,
                top: 4
            },
            show: false
        };
        this.roomHover = {
            tip: '聊天室',
            position: {
                left: 56,
                top: 4
            },
            show: false
        };
        this.createHover = {
            tip: '创建',
            position: {
                left: 56,
                top: 4
            },
            show: false
        };
        this.moreHover = {
            tip: '更多',
            position: {
                left: 56,
                top: 4
            },
            show: false
        };
        this.logoutKick = {
            show: false,
            info: {
                title: '',
                tip: ''
            }
        };
        this.badge = {
            conversation: 0,
            contact: 0
        };
        this.createSingleOption = {
            title: '发起单聊',
            placeholder: '输入用户名查找'
        };
        this.enterPublicGroup = {
            show: false,
            info: {}
        };
        this.groupInfo = {
            show: false,
            info: {}
        };
        this.groupVerifyModal = {
            show: false
        };
        this.groupAvatarInfo = {
            show: false,
            info: {},
            src: '',
            filename: ''
        };
    }
}
