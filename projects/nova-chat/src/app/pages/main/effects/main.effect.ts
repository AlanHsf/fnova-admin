import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actions, Effect,createEffect,ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStore } from '../../../app.store';
import { mainAction } from '../actions';
import { chatAction } from '../../../pages/chat/actions';
import { catchError, exhaustMap, map, switchMap,filter } from 'rxjs/operators';

import {
    global,
    authPayload,
    ApiService,
    demoInitConfig,
    SignatureService
} from '../../../services/common';
import { md5 } from '../../../services/tools';
import { Util } from '../../../services/util';
import { appAction } from '../../../actions';
// import { create } from 'domain';

@Injectable()
export class MainEffect {
    // JIM初始化
    private jimInit$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(mainAction.jimInit),
            map(result => (result as any).payload),
            switchMap(async () => {
                let timestamp = new Date().getTime();
                let signature;
                // 前端生成签名
                if (authPayload.isFrontSignature) {
                    // 使用jchat demo自身的签名
                    if (authPayload.masterSecret.length === 0) {
                        signature = demoInitConfig.signature;
                        timestamp = demoInitConfig.timestamp;
                        // 开发者配置前端生成签名
                    } else {
                        signature = Util.createSignature(timestamp);
                    }
                } else {
                    // 服务端生成签名
                    let data = {
                        timestamp,
                        appkey: authPayload.appkey,
                        randomStr: authPayload.randomStr
                    };
                    signature = await this.signatureService.requestSignature(authPayload.signatureApiUrl, data);
                }
                let initObj = {
                    appkey: authPayload.appkey,
                    random_str: authPayload.randomStr,
                    signature,
                    timestamp,
                    flag: authPayload.flag
                };
                let data: any = await this.apiService.init(initObj);
                if (data.code) {
                    this.store$.dispatch({
                        type: appAction.errorApiTip,
                        payload: data
                    });
                    return { type: '[main] jim init useless' };
                } else {
                    return { type: mainAction.jimInitSuccess };
                }
            })
            )
    );
            // 获取个人信息
    private getSelfInfo$: Observable<Action> = createEffect(() => this.actions$
            .pipe(
                ofType(mainAction.getSelfInfo),
                map(result => (result as any).payload),
                switchMap(async (info) => {
                    let userInfoObj = {
                        username: global.user
                    };
                    let userInfo: any = await this.apiService.getUserInfo(userInfoObj);
                    if (userInfo.code) {
                        this.errorFn(userInfo);
                    } else if (!userInfo.user_info.avatar || userInfo.user_info.avatar === '') {
                        userInfo.user_info.avatarUrl = '';
                        this.store$.dispatch({
                            type: mainAction.showSelfInfo,
                            payload: {
                                info: userInfo.user_info,
                                show: false,
                                loading: false
                            }
                        });
                    } else {
                        let urlObj = {
                            media_id: userInfo.user_info.avatar
                        };
                        let urlInfo: any = await this.apiService.getResource(urlObj);
                        if (urlInfo.code) {
                            userInfo.user_info.avatarUrl = '';
                        } else {
                            userInfo.user_info.avatarUrl = urlInfo.url;
                        }
                        this.store$.dispatch({
                            type: mainAction.showSelfInfo,
                            payload: {
                                info: userInfo.user_info,
                                show: false,
                                loading: false
                            }
                        });
                    }
                    return { type: '[main] get selfInfo useless' };
                })
                )
    );
    // 退出登录
    private logoutAction$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(mainAction.logoutAction),
            map(result => (result as any).payload),
            switchMap(async () => {
                await this.apiService.loginOut();
                this.router.navigate(['/login']);
                return { type: '[main] login out useless' };
            })
        )
    );
    // 更新个人信息
    private updateSelfInfo$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(mainAction.updateSelfInfo),
            map(result => (result as any).payload),
            switchMap(async (self:any) => {
            let data: any = await this.apiService.updateSelfInfo(self.info);
            if (data.code) {
                this.errorFn(data);
                if (self.avatar && self.avatar.url) {
                    this.updateSelfAvatar(self);
                } else {
                    this.store$.dispatch({
                        type: mainAction.showSelfInfo,
                        payload: {
                            loading: false
                        }
                    });
                }
            } else {
                if (self.avatar && self.avatar.url) {
                    this.updateSelfAvatar(self);
                } else {
                    this.store$.dispatch({
                        type: mainAction.showSelfInfo,
                        payload: {
                            info: self.info,
                            loading: false
                        }
                    });
                    this.store$.dispatch({
                        type: mainAction.updateSelfInfoFlag
                    });
                }
            }
            return { type: '[main] update self info useless' };
        })
        )
    );
    // 创建群聊
    private createGroup$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(mainAction.createGroup),
            map(result => (result as any).payload),
            switchMap(async (groupInfo:any) => {
            let param: any = {
                group_name: groupInfo.groupName
            };
            if (groupInfo.isLimit) {
                param.is_limit = groupInfo.isLimit;
            }
            if (groupInfo.avatar) {
                param.avatar = groupInfo.avatar;
            }
            let data: any = await this.apiService.createGroup(param);
            if (data.code) {
                this.errorFn(data);
            } else {
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
                let groupObj = {
                    appkey: authPayload.appkey,
                    desc: data.group_description,
                    gid: data.gid,
                    mtime: data.ctime,
                    name: data.group_name,
                    type: 4,
                    avatarUrl: groupInfo.avatarUrl ? groupInfo.avatarUrl : ''
                };
                // 如果有其他成员
                if (groupInfo.memberUsernames.length > 0) {
                    let memberObj = {
                        gid: data.gid,
                        member_usernames: groupInfo.memberUsernames
                    };
                    let member: any = await this.apiService.addGroupMembers(memberObj);
                    if (member.code) {
                        this.errorFn(member);
                    } else {
                        this.store$.dispatch({
                            type: mainAction.createGroupSuccess,
                            payload: groupObj
                        });
                    }
                } else {
                    this.store$.dispatch({
                        type: mainAction.createGroupSuccess,
                        payload: groupObj
                    });
                }
            }
            return { type: '[main] create group useless' };
        })
        )
    );
    // 添加群聊成员
    private addGroupMember$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
        ofType(mainAction.addGroupMember),
        map(result => (result as any).payload),
        switchMap(async (info:any) => {
            let memberObj = {
                gid: info.activeGroup.key,
                member_usernames: info.memberUsernames
            };
            let data: any = await this.apiService.addGroupMembers(memberObj);
            if (data.code) {
                this.errorFn(data);
            } else {
                this.store$.dispatch({
                    type: mainAction.addGroupMemberSuccess,
                    payload: info.detailMember
                });
            }
            return { type: '[main] add group members useless' };
        })
        )
    );
    // 修改密码
    private modifyPassword$: Observable<Action> = createEffect(() => this.actions$
        .pipe(ofType(mainAction.modifyPassword),
        map(result => (result as any).payload),
        switchMap(async (passwordInfo:any) => {
            let passwordObj = {
                old_pwd: md5(passwordInfo.old_pwd),
                new_pwd: md5(passwordInfo.new_pwd),
                is_md5: true
            };
            let data: any = await this.apiService.updateSelfPwd(passwordObj);
            if (data.code) {
                this.errorFn(data);
            } else {
                this.apiService.loginOut();
                this.store$.dispatch({
                    type: mainAction.modifyPasswordShow,
                    payload: {
                        repeatLogin: md5(passwordInfo.new_pwd),
                        show: false
                    }
                });
                this.store$.dispatch({
                    type: mainAction.showModalTip,
                    payload: {
                        show: true,
                        info: {
                            title: '提示',
                            tip: '密码修改成功',
                            actionType: '[main] modify password alert',
                            success: 1// 1 代表成功 2代表失败
                        }
                    }
                });
            }
            return { type: '[main] modify password useless' };
        })
        )
    );
    // 创建单聊/添加好友
    private createSingleChatAction$: Observable<Action> = createEffect(()=> this.actions$
        .pipe(ofType(mainAction.createSingleChatAction),
        map(result => (result as any).payload),
        switchMap(async (info:any) => {
            let userObj = { username: info.singleName };
            let data: any = await this.apiService.getUserInfo(userObj);
            if (data.code) {
                if (data.code === 882002) {
                    this.store$.dispatch({
                        type: mainAction.createSingleChatShow,
                        payload: {
                            show: true,
                            info: '用户不存在'
                        }
                    });
                } else {
                    this.errorFn(data);
                }
            } else {
                let user = data.user_info;
                let item = {
                    avatar: user.avatar,
                    mtime: user.mtime,
                    name: user.username,
                    nickName: user.nickname,
                    username: user.username,
                    nickname: user.nickname,
                    type: 3,
                    signature: user.signature,
                    gender: user.gender,
                    region: user.region,
                    avatarUrl: '',
                    infoType: info.type
                };
                if (item.avatar !== '') {
                    let urlObj = { media_id: data.user_info.avatar };
                    let urlInfo: any = await this.apiService.getResource(urlObj);
                    if (urlInfo.code) {
                        item.avatarUrl = '';
                    } else {
                        item.avatarUrl = urlInfo.url;
                    }
                }
                this.store$.dispatch({
                    type: mainAction.createSingleChatSuccess,
                    payload: item
                });
            }
            return { type: '[main] create single chat action useless' };
        })
        )
    );
    // 创建群聊搜索联系人或者转发消息搜索联系人
    private createGroupSearchAction$: Observable<Action> = createEffect(()=> this.actions$
        .pipe(
        ofType(mainAction.createGroupSearchAction),
        map(result => (result as any).payload),
        switchMap(async (info:any) => {
            let userObj = {
                username: info.keywords
            };
            let userInfo: any = await this.apiService.getUserInfo(userObj);
            if (userInfo.code) {
                if (userInfo.code === 882002) {
                    this.searUserType(info, null, info.keywords);
                } else {
                    this.errorFn(userInfo);
                }
            } else {
                let user = userInfo.user_info;
                let item = {
                    avatar: '',
                    avatarUrl: '',
                    mtime: user.mtime,
                    name: user.username,
                    username: user.username,
                    nickName: user.nickname,
                    type: 3,
                    appkey: user.appkey
                };
                if (user.avatar !== '') {
                    let urlObj = {
                        media_id: user.avatar
                    };
                    let urlInfo: any = await this.apiService.getResource(urlObj);
                    if (!urlInfo.code) {
                        item.avatarUrl = urlInfo.url;
                    }
                }
                this.searUserType(info, item, info.keywords);
            }
            return { type: '[main] create group search action useless' };
        })
        )
        );
    // 获取黑名单列表
    private blackMenuShow$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
        ofType(mainAction.blackMenu),
        map(result => (result as any).payload),
        switchMap(async (isShow:any) => {
            let blackInfo: any = await this.apiService.getBlacks();
            if (blackInfo.code) {
                this.errorFn(blackInfo);
            } else {
                this.store$.dispatch({
                    type: mainAction.blackMenuSuccess,
                    payload: {
                        show: isShow.show,
                        menu: blackInfo.black_list
                    }
                });
                if (blackInfo.black_list.length > 0) {
                    for (let black of blackInfo.black_list) {
                        let urlObj = {
                            media_id: black.avatar
                        };
                        this.apiService.getResource(urlObj).then((urlInfo: any) => {
                            if (urlInfo.code) {
                                black.avatarUrl = '';
                            } else {
                                black.avatarUrl = urlInfo.url;
                            }
                        });
                    }
                }
            }
            return { type: '[main] black menu show useless' };
        })
        )
    );
    // 移出黑名单列表
    private delSingleBlack$: Observable<Action> = createEffect(()=> this.actions$
        .pipe(
        ofType(mainAction.delSingleBlack),
        map(result => (result as any).payload),
        switchMap(async (user:any) => {
            let blackObj = {
                member_usernames: [{
                    username: user.username,
                    appkey: authPayload.appkey
                }]
            };
            let blabkInfo: any = await this.apiService.delSingleBlacks(blackObj);
            if (blabkInfo.code) {
                this.errorFn(blabkInfo);
                this.store$.dispatch({
                    type: mainAction.delSingleBlackError,
                    payload: user
                });
            } else {
                this.store$.dispatch({
                    type: mainAction.delSingleBlackSuccess,
                    payload: user
                });
            }
            return { type: '[main] delete single black useless' };
        })
        )
    );
    // 加入黑名单
    private addBlackListAction$: Observable<Action> = createEffect(()=> this.actions$
    .pipe(
        ofType(mainAction.addBlackListAction),
        map(result => (result as any).payload),
        switchMap(async (active:any) => {
            let blackObj = {
                member_usernames: [{
                    username: active.name || active.username,
                    appkey: authPayload.appkey
                }]
            };
            let data: any = await this.apiService.addSingleBlacks(blackObj);
            if (data.code) {
                this.errorFn(data);
            } else {
                this.store$.dispatch({
                    type: mainAction.showModalTip,
                    payload: {
                        show: true,
                        info: {
                            title: '加入黑名单',
                            tip: '加入黑名单成功',
                            actionType: '[main] add single black useless',
                            success: 1
                        }
                    }
                });
                this.store$.dispatch({
                    type: mainAction.addBlackListSuccess,
                    payload: {
                        deleteItem: {
                            item: active
                        }
                    }
                });
            }
            return { type: '[main] add black list useless' };
        })
    )
    );
    // 退出群聊
    private exitGroupAction$: Observable<Action> = createEffect(()=> this.actions$
    .pipe(
        ofType(mainAction.exitGroupAction),
        map(result => (result as any).payload),
        filter((data:any) => {
            return data ? data : false;
        }),
        switchMap(async (gid) => {
            let groupObj = { gid };
            let groupInfo: any = await this.apiService.exitGroup(groupObj);
            if (groupInfo.code) {
                this.errorFn(groupInfo);
            } else {
                this.store$.dispatch({
                    type: mainAction.exitGroupSuccess,
                    payload: {
                        item: {
                            key: gid
                        }
                    }
                });
                this.store$.dispatch({
                    type: mainAction.showModalTip,
                    payload: {
                        show: false,
                        info: {
                            title: '',
                            tip: ''
                        }
                    }
                });
            }
            return { type: '[main] exit group useless' };
        })
        )
    );
    // 删除群聊成员
    private deleteMemberAction$: Observable<Action> = createEffect(()=> this.actions$
        .pipe(

            ofType(mainAction.deleteMemberAction),
            map(result => (result as any).payload),
            switchMap(async (info:any) => {
            let memberObj = {
                gid: info.group.key,
                member_usernames: [
                    { username: info.deleteItem.username }
                ]
            };
            let groupInfo: any = await this.apiService.delGroupMembers(memberObj);
            if (groupInfo.code) {
                this.errorFn(groupInfo);
            } else {
                this.store$.dispatch({
                    type: mainAction.showModalTip,
                    payload: {
                        show: false,
                        info: {
                            title: '',
                            tip: ''
                        }
                    }
                });
                this.store$.dispatch({
                    type: mainAction.deleteMemberSuccess,
                    payload: {
                        deleteItem: info.deleteItem,
                        group: info.group
                    }
                });
            }
            return { type: '[main] delete group member useless' };
        })
        )
    );
    // 被踢后重新登录
    private login$: Observable<Action> = createEffect(()=> this.actions$
    .pipe(
        ofType(mainAction.login),
        map(result => (result as any).payload),
        switchMap(async (val:any) => {
            let timestamp = new Date().getTime();
            let signature;
            if (authPayload.isFrontSignature) {
                if (authPayload.masterSecret.length === 0) {
                    signature = demoInitConfig.signature;
                    timestamp = demoInitConfig.timestamp;
                } else {
                    signature = Util.createSignature(timestamp);
                }
            } else {
                let data = {
                    timestamp,
                    appkey: authPayload.appkey,
                    randomStr: authPayload.randomStr
                };
                signature = await this.signatureService.requestSignature(authPayload.signatureApiUrl, data);
            }
            let initObj = {
                appkey: authPayload.appkey,
                random_str: authPayload.randomStr,
                signature,
                timestamp,
                flag: authPayload.flag
            };
            let data: any = await this.apiService.init(initObj);
            if (data.code) {
                this.errorFn(data);
            } else {
                let loginObj = {
                    username: val.username,
                    password: val.password,
                    is_md5: val.md5
                };
                let login: any = await this.apiService.login(loginObj);
                if (login.code) {
                    this.errorFn(login);
                } else {
                    if (val.reload) {
                        window.location.reload();
                    }
                }
            }
            return { type: '[main] login useless' };
        })
    )
    );
    // 用户资料中添加免打扰
    private addSingleNoDisturbAction$: Observable<Action> = createEffect(()=> this.actions$
    .pipe(
        ofType(mainAction.addSingleNoDisturbAction),
        map(result => (result as any).payload),
        switchMap(async (user:any) => {
            let userObj = {
                target_name: user.name
            };
            let data: any = await this.apiService.addSingleNoDisturb(userObj);
            if (data.code) {
                this.errorFn(data);
                this.store$.dispatch({
                    type: mainAction.hideModalTip,
                    payload: {
                        show: false,
                        info: {}
                    }
                });
            } else {
                this.store$.dispatch({
                    type: mainAction.showModalTip,
                    payload: {
                        show: true,
                        info: {
                            title: '添加消息免打扰',
                            tip: '添加消息免打扰成功',
                            actionType: '[main] add single no disturb action useless',
                            success: 1
                        }
                    }
                });
                this.store$.dispatch({
                    type: mainAction.addSingleNoDisturbSuccess,
                    payload: user
                });
            }
            return { type: '[main] add single no disturb action useless' };
        })
    )
    );
    // 删除好友
    private deleteFriend$: Observable<Action> = createEffect(()=> this.actions$
    .pipe(
        ofType(mainAction.deleteFriend),
        map(result => (result as any).payload),
        switchMap(async (user:any) => {
            let friendObj = {
                target_name: user.name
            };
            let data: any = await this.apiService.delFriend(friendObj);
            if (data.code) {
                this.errorFn(data);
            } else {
                this.store$.dispatch({
                    type: mainAction.showModalTip,
                    payload: {
                        show: true,
                        info: {
                            title: '删除好友',
                            tip: '删除好友成功',
                            actionType: '[main] delete friend success useless',
                            success: 1
                        }
                    }
                });
                this.store$.dispatch({
                    type: mainAction.deleteFriendSuccess,
                    payload: user
                });
            }
            return { type: '[main] delete friend useless' };
        })
    )
    );
    // 搜索聊天室
    private searchUser$: Observable<Action> = createEffect(()=> this.actions$
        .pipe(
        ofType(mainAction.searchUser),
        map(result => (result as any).payload),
        switchMap(async (payload) => {
            let info = null;
            if (!Number.isNaN(Number(payload))) {
                let roomObj = {
                    id: payload
                };
                let roomInfo: any = await this.apiService.getChatroomInfo(roomObj);
                if (!roomInfo.code) {
                    info = roomInfo.info;
                }
            }
            this.store$.dispatch({
                type: mainAction.searchUserSuccess,
                payload: {
                    room: info,
                    keywords: payload
                }
            });
            return { type: '[main] search user useless' };
        })
        )
    );
    // 搜索公开群群组资料
    private searchPublicGroup$: Observable<Action> = createEffect(()=> this.actions$
    .pipe(
        ofType(mainAction.searchPublicGroup),
        map(result => (result as any).payload),
        switchMap(async (gid) => {
            if (Number.isNaN(Number(gid))) {
                this.store$.dispatch({
                    type: mainAction.enterPublicGroupShow,
                    payload: {
                        show: true,
                        info: {
                            text: '群组ID由数字组成'
                        }
                    }
                });
                return { type: '[main] search public group useless' };
            }
            let groupObj = {
                gid
            };
            let data: any = await this.apiService.getGroupInfo(groupObj);
            if (data.code) {
                if (data.code === 882002) {
                    this.store$.dispatch({
                        type: mainAction.enterPublicGroupShow,
                        payload: {
                            show: true,
                            info: {
                                text: '未搜索到公开群'
                            }
                        }
                    });
                } else if (data.code === -2) {
                    this.errorFn(data);
                } else {
                    this.store$.dispatch({
                        type: mainAction.enterPublicGroupShow,
                        payload: {
                            show: true,
                            info: {
                                text: '查找公开群失败'
                            }
                        }
                    });
                }
            } else {
                if (data.group_info.group_type === 2) {
                    let promises = [];
                    if (data.group_info.avatar && data.group_info.avatar !== '') {
                        let urlObj = { media_id: data.group_info.avatar };
                        let pro1 = this.apiService.getResource(urlObj)
                            .then((urlInfo: any) => {
                                if (!urlInfo.code) {
                                    data.group_info.avatarUrl = urlInfo.url;
                                }
                            });
                        promises.push(pro1);
                    }
                    let pro2 = this.apiService.getGroupMembers(groupObj)
                        .then((groupList: any) => {
                            if (groupList.code === -2) {
                                this.errorFn(groupList);
                            } else if (groupList.code) {
                                this.store$.dispatch({
                                    type: mainAction.enterPublicGroupShow,
                                    payload: {
                                        show: true,
                                        info: {
                                            text: '查找公开群失败'
                                        }
                                    }
                                });
                            } else {
                                data.group_info.member_list_count = groupList.member_list.length;
                                for (let member of groupList.member_list) {
                                    if (member.flag === 1) {
                                        data.group_info.host = member;
                                    }
                                    if (member.username === global.user) {
                                        data.group_info.isMember = true;
                                    }
                                }
                            }
                        });
                    promises.push(pro2);
                    await Promise.all(promises);
                    this.store$.dispatch({
                        type: mainAction.searchPublicGroupSuccess,
                        payload: {
                            show: true,
                            info: data.group_info
                        }
                    });
                } else {
                    this.store$.dispatch({
                        type: mainAction.enterPublicGroupShow,
                        payload: {
                            show: true,
                            info: {
                                text: '未搜索到公开群'
                            }
                        }
                    });
                }
            }
            return { type: '[main] search public group useless' };
        })
    )
    );
    // 发送申请入群
    private sendGroupVerifyMessage$: Observable<Action> = createEffect(()=> this.actions$
    .pipe(
        ofType(mainAction.sendGroupVerifyMessage),
        map(result => (result as any).payload),
        switchMap(async (payload:any) => {
            let groupObj = {
                gid: payload.info.gid,
                reason: payload.text
            };
            let groupInfo: any = await this.apiService.joinGroup(groupObj);
            if (groupInfo.code) {
                this.errorFn(groupInfo);
            } else {
                this.store$.dispatch({
                    type: mainAction.showModalTip,
                    payload: {
                        show: true,
                        info: {
                            title: '发送成功',
                            tip: '入群申请已发送，请等待审核',
                            actionType: '[main] send verify group success',
                            success: 1
                        }
                    }
                });
                this.store$.dispatch({
                    type: mainAction.groupVerifyModal,
                    payload: {
                        show: false
                    }
                });
            }
            return { type: '[main] send group verify message useless' };
        })
    )
    );
    constructor(
        private actions$: Actions,
        private store$: Store<AppStore>,
        private router: Router,
        private apiService: ApiService,
        private signatureService: SignatureService
    ) { }
    private errorFn(error) {
        this.store$.dispatch({
            type: appAction.errorApiTip,
            payload: error
        });
    }
    private searUserType(info, item, keywords) {
        if (info.type === 'createGroup') {
            this.store$.dispatch({
                type: chatAction.createGroupSearchComplete,
                payload: {
                    result: item,
                    keywords
                }
            });
        }
    }
    // 更新个人头像
    private async updateSelfAvatar(self) {
        let avatarObj = { avatar: self.avatar.formData };
        let data: any = await this.apiService.updateSelfAvatar(avatarObj);
        if (data.code) {
            this.store$.dispatch({
                type: mainAction.showSelfInfo,
                payload: {
                    loading: false
                }
            });
            this.errorFn(data);
        } else {
            this.store$.dispatch({
                type: mainAction.showSelfInfo,
                payload: {
                    avatar: self.avatar,
                    info: self.info,
                    loading: false
                }
            });
            this.store$.dispatch({
                type: mainAction.updateSelfInfoFlag
            });
        }
    }
}
