import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actions, Effect,createEffect,ofType } from '@ngrx/effects';
// import { toPayload } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { AppStore } from '../../../app.store';
import { roomAction } from '../actions';
import { appAction } from '../../../actions';
import { global, StorageService, authPayload, ApiService } from '../../../services/common';


// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catchError';
// import 'rxjs/add/operator/exhaustMap';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';

@Injectable()
export class RoomEffect {
    // 获取storage里的voice状态
    private getVoiceState$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(roomAction.getRoomVoiceState),
            map(result => (result as any).payload),
            switchMap(async (key:any) => {
                let voiceState = this.storageService.get(key);
                if (voiceState) {
                    this.store$.dispatch({
                        type: roomAction.getRoomVoiceStateSuccess,
                        payload: JSON.parse(voiceState)
                    });
                }
                return { type: '[room] get room voice state useless' };
            })
        )
    );
    // 更新storage里的voice状态
    private storageVoiceState$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(roomAction.storageVoiceState),
            map(result => (result as any).payload),
            switchMap(async (info:any) => {
                if (info.voiceStateKey && info.voiceState) {
                    this.storageService.set(info.voiceStateKey, JSON.stringify(info.voiceState));
                    this.store$.dispatch({
                        type: roomAction.getRoomVoiceStateSuccess,
                        payload: info.voiceState
                    });
                }
                return { type: '[room] storage room voice state useless' };
            })
        )
    );
    // 获取自己已经进入的聊天室列表，并一一退出
    private getSelfChatrooms$: Observable<Action> = createEffect(() =>this.actions$
        .pipe(ofType(roomAction.getSelfChatrooms),
        map(result => (result as any).payload),
        switchMap(async (payload) => {
            let data: any = await this.apiService.getSelfChatrooms();
            if (data.code) {
                this.errorFn(data);
            } else {
                let promises = [];
                for (let room of data.chat_rooms) {
                    let roomObj = {
                        id: room.id
                    };
                    let pro = this.apiService.exitChatroom(roomObj);
                    promises.push(pro);
                }
                await Promise.all(promises);
                this.store$.dispatch({
                    type: roomAction.exitAllChatroomsSuccess,
                    payload: null
                });
            }
            return { type: '[room] get self chatrooms useless' };
        })
        )
    );
    // 请求聊天室列表

    private getRoomList$: Observable<Action> = createEffect(() => this.actions$
        .pipe(ofType(roomAction.getRoomList),
        map(result => (result as any).payload),
        switchMap(async (payload:any) => {
            let roomsObj = {
                start: payload.start,
                appkey: payload.appkey
            };
            let data: any = await this.apiService.getAppkeyChatrooms(roomsObj);
            if (data.code) {
                this.errorFn(data);
            } else {
                this.store$.dispatch({
                    type: roomAction.getRoomListSuccess,
                    payload: data.result.rooms
                });
            }
            return { type: '[room] get room list useless' };
        })
        )
    );
    // 切换active聊天室，退出聊天室，请求聊天室详情
    private changeRoom$: Observable<Action> = createEffect(() =>this.actions$
        .pipe(ofType(roomAction.changeRoom),
        map(result => (result as any).payload),
        switchMap(async (payload:any) => {
            this.store$.dispatch({
                type: roomAction.changeRoomSuccess,
                payload: {
                    active: payload,
                    info: {}
                }
            });
            this.exitRoom(payload);
            let roomObj = {
                id: payload.id
            };
            let data: any = await this.apiService.getChatroomInfo(roomObj);
            if (data.code) {
                this.errorFn(data);
            } else {
                this.store$.dispatch({
                    type: roomAction.changeRoomSuccess,
                    payload: {
                        active: payload,
                        info: data.info
                    }
                });
            }
            return { type: '[room] change room useless' };
        })
        )
    );
    // 进入新的聊天室
    private enterRoom$: Observable<Action> = createEffect(() => this.actions$
        .pipe(ofType(roomAction.enterRoom),
        map(result => (result as any).payload),
        switchMap(async (payload:any) => {
            let roomObj = {
                id: payload.id
            };
            let data: any = await this.apiService.enterChatroom(roomObj);
            if (data.code) {
                if (data.code === 881507) {
                    this.store$.dispatch({
                        type: roomAction.enterRoomSuccess,
                        payload
                    });
                } else {
                    this.errorFn(data);
                    this.store$.dispatch({
                        type: roomAction.enterRoomError,
                        payload
                    });
                }
            } else {
                this.store$.dispatch({
                    type: roomAction.enterRoomSuccess,
                    payload
                });
            }
            return { type: '[room] enter room useless' };
        })
        )
    );
    // 退出聊天室
    private exitRoom$: Observable<Action> = createEffect(() => this.actions$
        .pipe(ofType(roomAction.exitRoom),
        map(result => (result as any).payload),
        switchMap(async (payload:any) => {
            if (payload.id) {
                this.exitRoom(payload);
            }
            return { type: '[room] exit room useless' };
        })   
        )
    );
    // 显示聊天室资料
    private showRoomInfomation$: Observable<Action> = createEffect(() =>this.actions$
        .pipe(ofType(roomAction.showRoomInfomation),
        map(result => (result as any).payload),
        switchMap(async (payload:any) => {
            let roomObj = {
                id: payload.id
            };
            let data: any = await this.apiService.getChatroomInfo(roomObj);
            if (data.code) {
                this.errorFn(data);
            } else {
                this.store$.dispatch({
                    type: roomAction.showRoomInfomationSuccess,
                    payload: {
                        show: true,
                        info: data.info
                    }
                });
            }
            return { type: '[room] show room infomation useless' };
        })
        )
    );
    // 收到新消息
    private receiveMessage$: Observable<Action> = createEffect(() => this.actions$
        .pipe(ofType(roomAction.receiveMessage),
        map(result => (result as any).payload),
        switchMap(async (payload:any) => {
            this.store$.dispatch({
                type: roomAction.receiveMessageSuccess,
                payload: payload.data
            });
            if (payload.data.content.msg_body.media_id) {
                let urlObj = { media_id: payload.data.content.msg_body.media_id };
                let data: any = await this.apiService.getResource(urlObj);
                if (data.code) {
                    payload.data.content.msg_body.media_url = '';
                } else {
                    payload.data.content.msg_body.media_url = data.url;
                }
                this.store$.dispatch({
                    type: roomAction.receiveMessageUrlSuccess,
                    payload: payload.data
                });
            }
            // 如果接收的是名片
            if (payload.data.content.msg_type === 'text' && payload.data.content.msg_body.extras &&
                payload.data.content.msg_body.extras.businessCard) {
                this.requestCardInfo(payload.data);
            }
            // 判断是否加载过这个用户的头像，加载过就直接使用本地的用户头像
            let username = payload.data.content.from_id !== global.user ?
                payload.data.content.from_id : payload.data.content.target_id;
            let flag = false;
            for (let message of payload.messageList) {
                let messageUsername = message.content.from_id !== global.user ?
                    message.content.from_id : message.content.target_id;
                if (username === messageUsername &&
                    (message.content.avatarUrl || message.content.avatarUrl === '')) {
                    payload.data.content.avatarUrl = message.content.avatarUrl;
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                let userObj = {
                    username
                };
                let data: any = await this.apiService.getUserInfo(userObj);
                if (!data.code && data.user_info.avatar !== '') {
                    let urlObj = { media_id: data.user_info.avatar };
                    let urlInfo: any = await this.apiService.getResource(urlObj);
                    if (!urlInfo.code) {
                        payload.data.content.avatarUrl = urlInfo.url;
                    }
                }
            }
            return { type: '[room] receive message useless' };
        })
        )
        );
    // 发送文本消息
    private sendTextMsg$: Observable<Action> = createEffect(() => this.actions$
        .pipe(ofType(roomAction.sendTextMsg),
        map(result => (result as any).payload),
        switchMap(async (payload:any) => {
            let msg: any = await this.apiService.sendChatroomMsg(payload.sendMsg);
            let newPayload: any = {
                localMsg: payload.localMsg,
                repeatSend: payload.repeatSend
            };
            if (msg.code) {
                payload.localMsg.success = 3;
                payload.localMsg.sendMsg = payload.sendMsg;
                this.errorFn(msg);
            } else {
                payload.localMsg.success = 2;
                newPayload.msg = msg;
            }
            this.store$.dispatch({
                type: roomAction.sendMsgComplete,
                payload: newPayload
            });
            return { type: '[room] send text msg useless' };
        }
        )
        )
    );
    // 发送文件消息
    private sendFileMsg$: Observable<Action> = createEffect(() => this.actions$
        .pipe(ofType(roomAction.sendFileMsg),
        map(result => (result as any).payload),
        switchMap(async (payload:any) => {
            let msg: any = await this.apiService.sendChatroomFile(payload.sendMsg);
            let newPayload: any = {
                localMsg: payload.localMsg,
                repeatSend: payload.repeatSend
            };
            if (msg.code) {
                payload.localMsg.success = 3;
                payload.localMsg.sendMsg = payload.sendMsg;
                this.errorFn(msg);
            } else {
                payload.localMsg.success = 2;
                newPayload.msg = msg;
            }
            this.store$.dispatch({
                type: roomAction.sendMsgComplete,
                payload: newPayload
            });
            return { type: '[room] send file msg useless' };
        })
        )
    );
    // 发送图片消息, 发送jpush表情
    private sendPicMsg$: Observable<Action> = createEffect(() => this.actions$
        .pipe(ofType(roomAction.sendPicMsg, roomAction.transmitPicMsg),
        map(result => (result as any).payload),
        switchMap(async (payload:any) => {
            let msg: any = await this.apiService.sendChatroomPic(payload.sendMsg);
            let newPayload: any = {
                localMsg: payload.localMsg,
                repeatSend: payload.repeatSend
            };
            if (msg.code) {
                payload.localMsg.success = 3;
                payload.localMsg.sendMsg = payload.sendMsg;
                this.errorFn(msg);
            } else {
                payload.localMsg.success = 2;
                newPayload.msg = msg;
            }
            this.store$.dispatch({
                type: roomAction.sendMsgComplete,
                payload: newPayload
            });
            return { type: '[room] send pic msg useless or transmit pic msg useless' };
        })
        )
    );
    constructor(
        private actions$: Actions,
        private store$: Store<AppStore>,
        private storageService: StorageService,
        private apiService: ApiService
    ) { }
    private errorFn(error) {
        this.store$.dispatch({
            type: appAction.errorApiTip,
            payload: error
        });
    }
    // 退出聊天室
    private async exitRoom(payload) {
        let roomObj = {
            id: payload.id
        };
        let data: any = await this.apiService.exitChatroom(roomObj);
        if (!data.code) {
            this.store$.dispatch({
                type: roomAction.exitRoomSuccess,
                payload: null
            });
        }
    }
    // 接收名片获取对方的信息
    private async requestCardInfo(data) {
        let userObj = {
            username: data.content.msg_body.extras.userName,
            appkey: authPayload.appkey
        };
        let otherInfo: any = await this.apiService.getUserInfo(userObj);
        if (!otherInfo.code) {
            data.content.msg_body.extras.nickName = otherInfo.user_info.nickname;
            if (otherInfo.user_info.avatar !== '') {
                let urlObj = { media_id: otherInfo.user_info.avatar };
                let urlInfo: any = await this.apiService.getResource(urlObj);
                if (!urlInfo.code) {
                    data.content.msg_body.extras.media_url = urlInfo.url;
                }
            }
        }
    }
};
