import { mainAction } from '../../main/actions';
import { chatAction } from '../actions';
import { roomAction } from '../../room/actions';
import { ChatStore } from '../stores/chat.store';
import { chatInit } from '../model';
import { contactAction } from '../../contact/actions';
import { global, authPayload } from '../../../services/common';
import { Util } from '../../../services/util';

export let chatReducer = (state: ChatStore = chatInit, { type, payload }) => {
    
    let stateTmp:any = {};
    if(state){
        Object.keys(state).forEach((key)=>{
            if(state[key]){
                let sdata:any
                try{
                    sdata = JSON.parse(JSON.stringify(state[key]))
                    stateTmp[key] = sdata

                }catch(error){
                    stateTmp[key] = state[key]
                }
            }
        })
        stateTmp.actionType = type;
        state = Object.assign({},stateTmp);
    }
        // state.actionType = type;

    if(payload){
        let payTmp:any = {}
        Object.keys(payload).forEach((key)=>{
            let pdata
            try{
                pdata = JSON.parse(JSON.stringify(payload[key]))
                payTmp[key] = pdata 

            }catch(error){
                payTmp[key] = payload[key] 
            }
        })
        payload = payTmp;
    }

    switch (type) {
        // 初始化state
        case chatAction.init:
            state = Util.deepCopyObj(chatInit);
            break;
        // 初始化会话列表
        case chatAction.getConversationSuccess:
            if (payload.storage) {
                state.conversation = payload.conversation;
                if (payload.messageList.length > 0) {
                    state.messageList = payload.messageList;
                }
                filterRecentMsg(state);
                filterAtList(state);
                state.isLoaded = true;
                completionMessageList(state);
            }
            if (payload.shield) {
                initGroupShield(state, payload.shield);
            }
            if (payload.noDisturb) {
                state.noDisturb = payload.noDisturb;
                initNoDisturb(state, payload.noDisturb);
            }
            if (state.friendList.length > 0) {
                filterConversationMemoName(state);
            }
            conversationUnreadNum(state);
            break;
        // 获取好友列表
        case chatAction.getFriendListSuccess:
            if (payload && payload.type) {
                compareFriendList(state, payload.friendList);
                state.friendList = payload.friendList;
            } else {
                state.friendList = payload;
            }
            filterFriendList(state, payload);
            if (state.conversation.length > 0) {
                filterConversationMemoName(state);
            }
            break;
        // 登陆后，离线消息同步消息列表
        case chatAction.getAllMessageSuccess:
            state.messageList = payload;
            state.imageViewer = filterImageViewer(state);
            break;
        // 接收消息
        case chatAction.receiveMessageSuccess:
            addMessage(state, payload);
            newMessageIsActive(state, payload);
            conversationUnreadNum(state);
            break;
        // 发送单聊文本消息
        case chatAction.sendSingleMessage:

        // 发送群组文本消息
        case chatAction.sendGroupMessage:

        // 发送单聊图片消息
        case chatAction.sendSinglePic:

        // 发送群组图片消息
        case chatAction.sendGroupPic:

        // 发送单聊文件消息
        case chatAction.sendSingleFile:

        // 发送群组文件消息
        case chatAction.sendGroupFile:
            // 判断是否是重发消息
            if (!payload.msgs.repeatSend) {
                addMessage(state, payload);
            }
            let extras = payload.msgs.content.msg_body.extras;
            if (extras && extras.businessCard) {
                state.sendBusinessCardSuccess = 0;
            }
            break;
        // 发送消息完成（包括所有类型的消息）
        case chatAction.sendMsgComplete:
            sendMsgComplete(state, payload);
            if (payload.msgs) {
                let bussinessExtras = payload.msgs.content.msg_body.extras;
                if (bussinessExtras && bussinessExtras.businessCard && payload.success !== 2) {
                    state.sendBusinessCardSuccess = 0;
                } else {
                    state.sendBusinessCardSuccess++;
                }
            }
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
            if (!payload.msgs.repeatSend) {
                state.transmitSuccess = 0;
                transmitMessage(state, payload);
                state.newMessage = payload.msgs;
            }
            break;
        // 转发消息完成
        case chatAction.transmitMessageComplete:
            sendMsgComplete(state, payload);
            if (payload.success !== 2) {
                state.transmitSuccess = 0;
            } else {
                state.transmitSuccess++;
            }
            break;
        // 切换当前会话用户
        case chatAction.changeActivePerson:
            clearVoiceTimer(state);
            state.activePerson = Util.deepCopyObj(payload.item);
            state.defaultPanelIsShow = payload.defaultPanelIsShow;
            emptyUnreadNum(state, payload.item);
            state.unreadCount = {
                key: state.activePerson.key,
                name: state.activePerson.name,
                type: state.activePerson.type
            };
            changeActivePerson(state);
            conversationUnreadNum(state);
            break;
        // 选择联系人
        case contactAction.selectContactItem:
        // 选择搜索出来的本地用户
        case mainAction.selectSearchUser:
            state.defaultPanelIsShow = false;
            clearVoiceTimer(state);
            selectUserResult(state, payload, 'search');
            changeActivePerson(state);
            emptyUnreadNum(state, payload);
            state.unreadCount = {
                key: state.activePerson.key,
                name: state.activePerson.name,
                type: state.activePerson.type
            };
            conversationUnreadNum(state);
            break;
        // 删除本地会话列表
        case chatAction.deleteConversationItem:
            showGroupSetting(state, false);
            deleteConversationItem(state, payload);
            conversationUnreadNum(state);
            break;
        // 保存草稿
        case chatAction.saveDraft:
            if (state.messageList[payload[1].activeIndex]) {
                state.messageList[payload[1].activeIndex].draft = payload[0];
            }
            for (let item of state.conversation) {
                if (Number(payload[1].key) === Number(item.key)) {
                    item.draft = payload[0];
                }
            }
            break;
        // 搜索本地用户
        case mainAction.searchUserSuccess:
            state.searchUserResult = searchUser(state, payload.keywords);
            if (payload.room) {
                state.searchUserResult.result.roomArr.push(payload.room);
            }
            break;
        // 消息转发的搜索用户
        case chatAction.searchMessageTransmit:
            state.messageTransmit.searchResult = searchUser(state, payload);
            break;
        // 成功查看别人的信息
        case chatAction.watchOtherInfoSuccess:
            payload.info.isFriend = filterFriend(state, payload.info);
            filterSingleBlack(state, payload.info);
            filterSingleNoDisturb(state, payload.info);
            state.otherInfo.info = payload.info;
            state.otherInfo.show = payload.show;
            break;
        // 隐藏别人的信息框
        case chatAction.hideOtherInfo:
            state.otherInfo = payload;
            break;
        // 获取群组信息
        case chatAction.groupInfo:
            initGroupInfo(state, payload);
            break;
        // 显示隐藏群组设置
        case chatAction.groupSetting:
            let msg = state.messageList[state.activePerson.activeIndex];
            if (msg && !msg.groupSetting) {
                state.messageList[state.activePerson.activeIndex] = Object.assign({}, msg,
                    { groupSetting: {} });
            }
            if (msg && payload.loading &&
                (!msg.groupSetting || (msg.groupSetting && !msg.groupSetting.groupInfo))) {
                state.messageList[state.activePerson.activeIndex].groupSetting.loading = true;
            }
            showGroupSetting(state, payload.show);
            break;
        // 创建单聊/添加好友
        case mainAction.createSingleChatSuccess:
            /**
             * info.showType
             * 1    发起单聊-非好友-非会话人
             * 2    发起单聊-好友
             * 3    发起单聊-非好友-会话人
             * 4    添加好友-非会话人
             * 5    添加好友-会话人
             * 6    查看资料-好友
             * 7    查看资料-非好友-会话人
             * 8    查看资料-非好友-非会话人
             */
            payload.isFriend = filterFriend(state, payload);
            filterSingleBlack(state, payload);
            filterSingleNoDisturb(state, payload);
            state.otherInfo.info = payload;
            state.otherInfo.show = true;
            break;
        // 从验证消息列表中查看对方的资料
        case contactAction.watchVerifyUserSuccess:
            payload.isFriend = filterFriend(state, payload);
            filterSingleBlack(state, payload);
            filterSingleNoDisturb(state, payload);
            state.otherInfo.info = payload;
            state.otherInfo.show = true;
            break;
        // 创建群组成功
        case mainAction.createGroupSuccess:
            clearVoiceTimer(state);
            state.activePerson = Util.deepCopyObj(payload);
            state.defaultPanelIsShow = false;
            selectUserResult(state, payload);
            changeActivePerson(state);
            state.groupList.push(payload);
            break;
        // 从用户的个人资料创建单聊联系人会话
        case chatAction.createOtherChat:
            showGroupSetting(state, false);
            clearVoiceTimer(state);
            if (payload.username) {
                payload.name = payload.username;
            }
            if (payload.nickname) {
                payload.nickName = payload.nickname;
            }
            state.defaultPanelIsShow = false;
            filterFriend(state, payload);
            selectUserResult(state, payload);
            state.activePerson = Util.deepCopyObj(payload);
            changeActivePerson(state);
            emptyUnreadNum(state, payload);
            state.unreadCount = {
                key: state.activePerson.key,
                name: state.activePerson.name,
                type: state.activePerson.type
            };
            conversationUnreadNum(state);
            break;
        // 获取群组列表成功
        case contactAction.getGroupListSuccess:
            state.groupList = payload;
            break;
        // 退群成功
        case mainAction.exitGroupSuccess:
            let isActive = (payload.item.name === state.activePerson.name &&
                payload.item.type === 3 && state.activePerson.type === 3) ||
                (payload.item.type === 4 &&
                    Number(payload.item.key) === Number(state.activePerson.key));
            if (isActive) {
                showGroupSetting(state, false);
                state.defaultPanelIsShow = true;
            }
            exitGroup(state, payload.item);
            deleteConversationItem(state, payload);
            conversationUnreadNum(state);
            break;
        // 加入黑名单成功
        case mainAction.addBlackListSuccess:
            state.otherInfo.info.black = true;
            updateBlackMenu(state, payload.deleteItem.item);
            break;
        // 更新群描述
        case chatAction.groupDescription:
            state.groupDeacriptionShow = payload.show;
            break;
        // 显示个人信息
        case mainAction.showSelfInfo:
            if (payload.info) {
                state.selfInfo.info = Object.assign({}, state.selfInfo.info, payload.info);
            }
            if (payload.avatar) {
                state.selfInfo.info.avatarUrl = payload.avatar.url;
            }
            break;
        // 获取用户信息头像url
        case chatAction.getSingleAvatarUrl:
            let msgs = state.messageList[state.activePerson.activeIndex].msgs;
            for (let item of msgs) {
                if (item.content.from_id !== global.user) {
                    item.content.avatarUrl = state.activePerson.avatarUrl;
                }
            }
            break;
        // 切换群屏蔽
        case chatAction.changeGroupShieldSuccess:
            changeGroupShield(state, payload);
            break;
        // 切换群组免打扰
        case chatAction.changeGroupNoDisturbSuccess:
            changeGroupNoDisturb(state, payload);
            conversationUnreadNum(state);
            break;
        // 群聊事件
        case chatAction.addGroupMembersEventSuccess:
            groupMembersEvent(state, payload, '被添加进群聊了');
            state.currentIsActive = currentIsActive(state, payload);
            for (let user of payload.to_usernames) {
                if (user.username === global.user) {
                    addToGroupList(state, payload);
                    break;
                }
            }
            break;
        // 更新群组成员事件
        case chatAction.updateGroupMembersEvent:
            updateGroupMembers(state, payload.eventData);
            break;
        // 删除群组成员
        case chatAction.deleteGroupMembersEvent:
            groupMembersEvent(state, payload, '被移出群聊了');
            state.currentIsActive = currentIsActive(state, payload);
            deleteGroupMembersEvent(state, payload);
            for (let user of payload.to_usernames) {
                if (user.username === global.user) {
                    exitGroup(state, payload);
                    break;
                }
            }
            break;
        // 退群事件
        case chatAction.exitGroupEvent:
            groupMembersEvent(state, payload, '退出群聊了');
            state.currentIsActive = currentIsActive(state, payload);
            deleteGroupMembersEvent(state, payload);
            break;
        // 更新群组信息成功事件
        case chatAction.updateGroupInfoEventSuccess:
            updateGroupInfoEventSuccess(state, payload);
            break;
        // 从localstorage获取已经播放的voice的列表
        case chatAction.getVoiceStateSuccess:
            state.voiceState = payload;
            break;
        // 显示视频模态框
        case chatAction.playVideoShow:
            state.playVideoShow = payload;
            break;
        // 创建群聊事件消息
        case chatAction.createGroupSuccessEvent:
            createGroupSuccessEvent(state, payload);
            break;
        // 消息撤回
        case chatAction.msgRetractEvent:
            msgRetract(state, payload);
            break;
        // 显示验证消息模态框
        case chatAction.showVerifyModal:
            state.verifyModal = payload;
            break;
        // 在黑名单列表中删除黑名单
        case mainAction.delSingleBlackSuccess:
            updateBlackMenu(state, payload);
            break;
        // 获取黑名单成功
        case mainAction.blackMenuSuccess:
            state.blackMenu = payload.menu;
            break;
        // 在个人资料中删除黑名单
        case chatAction.deleteSingleBlackSuccess:
            updateBlackMenu(state, payload);
            state.otherInfo.info.black = false;
            break;
        // 添加单聊用户免打扰成功
        case mainAction.addSingleNoDisturbSuccess:
            state.otherInfo.info.noDisturb = true;
            changeSingleNoDisturb(state, payload);
            conversationUnreadNum(state);
            break;
        // 删除单聊用户免打扰成功
        case chatAction.deleteSingleNoDisturbSuccess:
            state.otherInfo.info.noDisturb = false;
            changeSingleNoDisturb(state, payload);
            conversationUnreadNum(state);
            break;
        // 好友资料中保存备注名及备注名同步
        case chatAction.saveMemoNameSuccess:
            saveMemoNameSuccess(state, payload);
            break;
        // 删除好友同步事件
        case chatAction.deleteFriendSyncEvent:
            deleteFriendSyncEvent(state, payload);
            break;
        // 添加好友同步事件
        case chatAction.addFriendSyncEvent:
            for (let user of payload.to_usernames) {
                friendSyncEvent(state, user, true);
            }
            break;
        // 删除好友
        case mainAction.deleteFriendSuccess:
            otherInfoDeleteFriend(state, payload);
            break;
        // 同意添加好友
        case contactAction.agreeAddFriendSuccess:
            addNewFriendToConversation(state, payload, 'agree');
            break;
        // 好友应答成功事件
        case chatAction.friendReplyEventSuccess:
            // 如果在好友应答时正好打开了该好友的资料
            updateOtherInfo(state, payload);
            addNewFriendToConversation(state, payload, 'reply');
            break;
        // 加载图片预览没有加载的图片url
        case chatAction.loadViewerImageSuccess:
            state.viewerImageUrl = payload;
            break;
        // 聊天文件模态框显示隐藏
        case chatAction.msgFile:
            state.msgFile.show = payload.show;
            break;
        // 聊天文件显示成功
        case chatAction.msgFileSuccess:
            if (payload.isFirst) {
                state.messageList = payload.messageList;
                filterMsgFile(state, payload.type);
            }
            filterMsgFileImageViewer(state, payload.type);
            break;
        // 聊天文件中的文件中的图片加载成功
        case chatAction.fileImageLoad:
            fileImageLoad(state, payload);
            break;
        // 置顶成功
        case chatAction.conversationToTopSuccess:
            conversationToTop(state, payload);
            break;
        // 显示未读列表
        case chatAction.watchUnreadList:
            state.unreadList = {
                show: payload.show,
                info: {
                    read: [],
                    unread: []
                },
                loading: true
            };
            break;
        // 加载未读列表成功
        case chatAction.watchUnreadListSuccess:
            if (payload.info) {
                filterUnreadListMemoName(state, payload);
                state.unreadList.info.read = payload.info.read_list;
                state.unreadList.info.unread = payload.info.unread_list;
            }
            state.unreadList.loading = payload.loading;
            break;
        // 已读消息回执事件
        case chatAction.msgReceiptChangeEvent:
            msgReceiptChangeEvent(state, payload);
            break;
        // 上报消息已读
        case chatAction.addReceiptReportAction:
            state.readObj = filterReceiptReport(state, payload);
            break;
        // 清空未读数的同步事件
        case chatAction.emptyUnreadNumSyncEvent:
            emptyUnreadNumSyncEvent(state, payload);
            conversationUnreadNum(state);
            break;
        // 添加单聊免打扰同步事件
        case chatAction.addSingleNoDisturbSyncEvent:
            addSingleNoDisturbSyncEvent(state, payload);
            conversationUnreadNum(state);
            break;
        // 删除单聊免打扰同步事件
        case chatAction.deleteSingleNoDisturbSyncEvent:
            deleteSingleNoDisturbSyncEvent(state, payload);
            conversationUnreadNum(state);
            break;
        // 添加群组免打扰同步事件
        case chatAction.addGroupNoDisturbSyncEvent:
            addGroupNoDisturbSyncEvent(state, payload);
            conversationUnreadNum(state);
            break;
        // 删除群组免打扰同步事件
        case chatAction.deleteGroupNoDisturbSyncEvent:
            deleteGroupNoDisturbSyncEvent(state, payload);
            conversationUnreadNum(state);
            break;
        // 添加群组屏蔽同步事件
        case chatAction.addGroupShieldSyncEvent:
            addGroupShieldSyncEvent(state, payload);
            break;
        // 删除群组屏蔽同步事件
        case chatAction.deleteGroupShieldSyncEvent:
            deleteGroupShieldSyncEvent(state, payload);
            break;
        //  添加单聊黑名单同步事件
        case chatAction.addSingleBlackSyncEvent:
            singleBlackSyncEvent(state, payload, true);
            break;
        // 删除单聊黑名单同步事件
        case chatAction.deleteSingleBlackSyncEvent:
            singleBlackSyncEvent(state, payload, false);
            break;
        // 用户信息更新事件
        case chatAction.userInfUpdateEventSuccess:
            userInfUpdateEventSuccess(state, payload);
            break;
        // 创建群聊、多人会话、添加群成员搜索成功
        case chatAction.createGroupSearchComplete:
            state.createGroupSearch = searchSingleUser(state, payload);
            break;
        // 转发聊天室的消息
        case roomAction.transmitAllMsg:
            state.roomTransmitMsg = payload;
            break;
        // 收到正在输入的透传消息
        case chatAction.receiveInputMessage:
            state.isInput = payload;
            break;
        // 添加群成员禁言事件
        case chatAction.addGroupMemberSilenceEvent:
            addGroupMemberSilenceEvent(state, payload);
            state.currentIsActive = currentIsActive(state, payload);
            break;
        // 移除群成员禁言事件
        case chatAction.deleteGroupMemberSilenceEvent:
            deleteGroupMemberSilenceEvent(state, payload);
            state.currentIsActive = currentIsActive(state, payload);
            break;
        // 收到入群邀请事件
        case chatAction.receiveGroupInvitationEventSuccess:
            filterInvitationEventMeMoName(state, payload);
            state.receiveGroupInvitationEventObj = payload;
            break;
        // 收到被拒绝入群事件
        case chatAction.receiveGroupRefuseEventSuccess:
            filterInvitationEventMeMoName(state, payload);
            state.receiveGroupRefuseEventObj = payload;
            break;
        default:
    }
    return state;
};
// 登录时处理会话at提示
function filterAtList(state: ChatStore) {
    if (state.messageList.length > 0) {
        for (let conversation of state.conversation) {
            let num = conversation.unreadNum;
            if (num > 0) {
                for (let messageList of state.messageList) {
                    let group = messageList.type === 4 && conversation.type === 4 &&
                        Number(messageList.key) === Number(conversation.key);
                    if (messageList.msgs && messageList.msgs.length > 0 && group) {
                        let length = messageList.msgs.length;
                        for (let i = length - 1; i >= length - 1 - num && i >= 0; i--) {
                            let atUser = messageHasAtList(messageList.msgs[i].content.at_list);
                            if (atUser !== '') {
                                conversation.atUser = atUser;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
}
// 上报已读回执，防止漏报
function filterReceiptReport(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    if (payload.msg_id.length === 0) {
        return payload;
    }
    for (let messageList of state.messageList) {
        let group = messageList.type === 4 && payload.type === 4 &&
            Number(messageList.key) === Number(payload.gid);
        let single = messageList.type === 3 && payload.type === 3 &&
            messageList.name === payload.username;
        if (group || single) {
            for (let msgId of payload.msg_id) {
                for (let message of messageList.msgs) {
                    if (message.msg_id === msgId) {
                        message.hasRead = true;
                        break;
                    }
                }
            }
            for (let message of messageList.msgs) {
                if (message.msg_id === payload.msg_id[0]) {
                    for (let i = messageList.msgs.length - 1; i >= 0; i--) {
                        if (messageList.msgs[i].msg_id &&
                            messageList.msgs[i].msg_id !== payload.msg_id[0] &&
                            !messageList.msgs[i].hasRead &&
                            messageList.msgs[i].content.from_id !== global.user) {
                            messageList.msgs[i].hasRead = true;
                            payload.msg_id.push(messageList.msgs[i].msg_id);
                        }
                        if (messageList.msgs[i].msg_id === payload.msg_id[0]) {
                            break;
                        }
                    }
                    break;
                }
            }
            break;
        }
    }
    return payload;
}
// 处理好友列表数据
function filterFriendList(state: ChatStore, payload) {
    // console.log("filterFriendList")
    // console.log(payload)
    if(payload&&payload.length>0){
        for (let friend of payload) {
            if (friend.username && !friend.name) {
                friend.name = friend.username;
            }
            if (friend.nickname && !friend.nickName) {
                friend.nickName = friend.nickname;
            }
            friend.type = 3;
        }
    }

}
// 客户端修改好友关系，对比删除了哪个好友，将整个应用中该好友的备注名换成昵称或者用户名
function compareFriendList(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let friend of state.friendList) {
        let result = payload.filter((newFriend) => {
            return newFriend.username === friend.username && newFriend.appkey === friend.appkey;
        });
        if (result.length === 0 && friend.memo_name) {
            friend.memo_name = '';
            modifyOtherInfoMemoName(state, friend);
            modifyConversationMemoName(state, friend);
            modifyActiveMessageList(state, friend);
            if (state.activePerson.type === 3 && state.activePerson.name === friend.username &&
                state.activePerson.appkey === friend.appkey) {
                state.activePerson.memo_name = '';
            }
        }
    }
}
// 添加群到群组列表
function addToGroupList(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    state.groupList.push({
        appkey: payload.from_appkey,
        name: payload.group_name,
        gid: payload.gid,
        avatar: payload.avatar,
        avatarUrl: payload.avatarUrl || ''
    });
}
// 收到新消息，如果是当前会话，需要标识是否是当前会话
function newMessageIsActive(state, payload) {
    let singleFlag = Number(state.activePerson.key) === Number(state.newMessage.key)
        && state.newMessage.msg_type === 3 && state.activePerson.type === 3;
    let groupFlag = Number(state.activePerson.key) === Number(state.newMessage.key)
        && state.newMessage.msg_type === 4 && state.activePerson.type === 4;
    state.newMessageIsActive = (singleFlag || groupFlag) ? true : false;
}
// 保存备注名成功
function saveMemoNameSuccess(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let user of payload.to_usernames) {
        if (user.username) {
            user.name = user.username;
        }
        if (user.nickname) {
            user.nickName = user.nickname;
        }
        if (payload.description && payload.description.memo_name) {
            user.memo_name = payload.description.memo_name;
        }
        modifyOtherInfoMemoName(state, user);
        modifyFriendListMemoName(state, user);
        modifyConversationMemoName(state, user);
        modifyActiveMessageList(state, user);
    }
}
// 删除好友同步事件
function deleteFriendSyncEvent(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let user of payload.to_usernames) {
        user.name = user.username;
        user.nickName = user.nickname;
        modifyOtherInfoMemoName(state, user);
        modifyFriendListMemoName(state, user);
        modifyConversationMemoName(state, user);
        modifyActiveMessageList(state, user);
        friendSyncEvent(state, user, false);
    }
}
// 用户信息更新事件
function userInfUpdateEventSuccess(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let friend of state.friendList) {
        if (payload.name === friend.name) {
            friend.nickName = payload.nickName;
            friend.avatarUrl = payload.avatarUrl;
            break;
        }
    }
    for (let conversation of state.conversation) {
        if (conversation.type === 3 && conversation.name === payload.name) {
            conversation.nickName = payload.nickName;
            conversation.avatarUrl = payload.avatarUrl;
        }
        if (conversation.recentMsg && conversation.recentMsg.content.from_id === payload.name) {
            conversation.recentMsg.content.from_name = payload.nickName;
        }
    }
    for (let messageList of state.messageList) {
        for (let msg of messageList.msgs) {
            if (msg.content.from_id === payload.name) {
                msg.content.from_name = payload.nickName;
                msg.content.avatarUrl = payload.avatarUrl;
            }
        }
        if (messageList.groupSetting && messageList.groupSetting.memberList) {
            for (let member of messageList.groupSetting.memberList) {
                if (member.username === payload.name) {
                    member.avatarUrl = payload.avatarUrl;
                    member.nickName = payload.nickName;
                }
            }
        }
    }
    if (payload.name === state.otherInfo.info.name) {
        state.otherInfo.info = Object.assign({}, state.otherInfo.info, payload);
    }
}
// 好友关系同步事件
function friendSyncEvent(state: ChatStore, user, bool) {
    if (state.otherInfo.info.name === user.username &&
        state.otherInfo.info.appkey === user.appkey) {
        state.otherInfo.info.isFriend = bool;
    }
}
// 单聊黑名单同步事件
function singleBlackSyncEvent(state: ChatStore, payload, bool) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let addUser of payload.to_usernames) {
        if (addUser.username === state.otherInfo.info.name &&
            addUser.appkey === state.otherInfo.info.appkey) {
            state.otherInfo.info.black = bool;
        }
    }
}
// 添加群组屏蔽同步事件
function addGroupShieldSyncEvent(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    state.groupShield = state.groupShield.concat(payload.to_groups);
    for (let addGroup of payload.to_groups) {
        for (let conversation of state.conversation) {
            if (conversation.type === 4 && Number(addGroup.gid) === Number(conversation.key)) {
                conversation.shield = true;
                break;
            }
        }
        if (state.activePerson.type === 4 &&
            Number(state.activePerson.key) === Number(addGroup.gid)) {
            state.activePerson.shield = true;
        }
    }
}
// 删除群组屏蔽同步事件
function deleteGroupShieldSyncEvent(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let deleteGroup of payload.to_groups) {
        for (let conversation of state.conversation) {
            if (conversation.type === 4 && Number(deleteGroup.gid) === Number(conversation.key)) {
                conversation.shield = false;
                break;
            }
        }
        for (let i = 0; i < state.groupShield.length; i++) {
            if (Number(state.groupShield[i].gid) === Number(deleteGroup.gid)) {
                state.groupShield.splice(i, 1);
                break;
            }
        }
        if (state.activePerson.type === 4 &&
            Number(state.activePerson.key) === Number(deleteGroup.gid)) {
            state.activePerson.shield = false;
        }
    }
}
//  添加群组免打扰同步事件
function addGroupNoDisturbSyncEvent(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    state.noDisturb.groups = state.noDisturb.groups.concat(payload.to_groups);
    for (let addGroup of payload.to_groups) {
        addGroup.key = addGroup.gid;
        for (let conversation of state.conversation) {
            if (conversation.type === 4 && Number(conversation.key) === Number(addGroup.gid)) {
                conversation.noDisturb = true;
                break;
            }
        }
        if (state.activePerson.type === 4 &&
            Number(state.activePerson.key) === Number(addGroup.gid)) {
            state.activePerson.noDisturb = true;
        }
    }
}
// 删除群组免打扰同步事件
function deleteGroupNoDisturbSyncEvent(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let deleteGroup of payload.to_groups) {
        for (let i = 0; i < state.noDisturb.groups.length; i++) {
            if (Number(state.noDisturb.groups[i].gid) === Number(deleteGroup.gid)) {
                state.noDisturb.groups.splice(i, 1);
                break;
            }
        }
        for (let conversation of state.conversation) {
            if (conversation.type === 4 &&
                Number(conversation.key) === Number(deleteGroup.gid)) {
                conversation.noDisturb = false;
                break;
            }
        }
        if (state.activePerson.type === 4 &&
            Number(state.activePerson.key) === Number(deleteGroup.gid)) {
            state.activePerson.noDisturb = false;
        }
    }
}
// 删除单聊免打扰同步事件
function deleteSingleNoDisturbSyncEvent(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let deleteUser of payload.to_usernames) {
        for (let i = 0; i < state.noDisturb.users.length; i++) {
            if (deleteUser.appkey === state.noDisturb.users[i].appkey &&
                deleteUser.username === state.noDisturb.users[i].username) {
                state.noDisturb.users.splice(i, 1);
                break;
            }
        }
        for (let conversation of state.conversation) {
            if (conversation.type === 3 && conversation.appkey === deleteUser.appkey &&
                conversation.name === deleteUser.username) {
                conversation.noDisturb = false;
                break;
            }
        }
        if (state.activePerson.type === 3 && deleteUser.appkey === state.activePerson.appkey &&
            deleteUser.username === state.activePerson.name) {
            state.activePerson.noDisturb = false;
        }
        if (state.otherInfo.info.name === deleteUser.username &&
            deleteUser.appkey === state.otherInfo.info.appkey) {
            state.otherInfo.info.noDisturb = false;
        }
    }
}
// 添加单聊免打扰同步事件
function addSingleNoDisturbSyncEvent(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    state.noDisturb.users = state.noDisturb.users.concat(payload.to_usernames);
    for (let addUser of payload.to_usernames) {
        for (let conversation of state.conversation) {
            if (conversation.type === 3 && conversation.appkey === addUser.appkey &&
                conversation.name === addUser.username) {
                conversation.noDisturb = true;
                break;
            }
        }
        if (state.activePerson.type === 3 && addUser.appkey === state.activePerson.appkey &&
            addUser.username === state.activePerson.name) {
            state.activePerson.noDisturb = true;
        }
        if (state.otherInfo.info.name === addUser.username &&
            addUser.appkey === state.otherInfo.info.appkey) {
            state.otherInfo.info.noDisturb = true;
        }
    }
}
// 清空未读数同步事件
function emptyUnreadNumSyncEvent(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let conversation of state.conversation) {
        let group = conversation.type === 4 && payload.type === 4 &&
            (Number(conversation.key) === Number(payload.gid));
        let single = conversation.type === 3 && payload.type === 3 &&
            conversation.name === payload.name;
        if (group || single) {
            conversation.unreadNum = 0;
            break;
        }
    }
}
// 获取群组信息
function initGroupInfo(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    if (payload.groupInfo) {
        if (payload.groupInfo.name === '') {
            for (let conversation of state.conversation) {
                if (conversation.type === 4 &&
                    Number(conversation.key) === Number(payload.groupInfo.gid)) {
                    payload.groupInfo.name = conversation.name;
                    break;
                }
            }
        }
        for (let messageList of state.messageList) {
            if (messageList.type === 4 &&
                Number(messageList.key) === Number(payload.groupInfo.gid)) {
                if (!messageList.groupSetting) {
                    messageList.groupSetting = {};
                }
                messageList.groupSetting.groupInfo = payload.groupInfo;
                messageList.groupSetting.loading = false;
                break;
            }
        }
    }
    if (payload.memberList) {
        sortGroupMember(payload.memberList);
        for (let messageList of state.messageList) {
            if (messageList.type === 4 &&
                Number(messageList.key) === Number(payload.key)) {
                for (let member of payload.memberList) {
                    for (let friend of state.friendList) {
                        if (friend.name === member.username) {
                            member.memo_name = friend.memo_name;
                            Util.getMemo_nameFirstLetter(member);
                            break;
                        }
                    }
                }
                if (!messageList.groupSetting) {
                    messageList.groupSetting = {};
                }
                messageList.groupSetting.memberList = payload.memberList;
                break;
            }
        }
    }
}
// 处理未读列表备注名
function filterUnreadListMemoName(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let read of payload.info.read_list) {
        filterFriend(state, read);
    }
    for (let unread of payload.info.unread_list) {
        filterFriend(state, unread);
    }
}
// 更新群组信息事件
function updateGroupInfoEventSuccess(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    payload.eventData.key = payload.eventData.gid;
    payload.eventData.name = payload.eventData.username = payload.eventData.from_username;
    payload.eventData.nickName = payload.eventData.nickname = payload.eventData.from_nickname;
    filterFriend(state, payload.eventData);
    if (Number(payload.eventData.gid) === Number(state.activePerson.key)) {
        if (payload.groupInfo.name !== '') {
            state.activePerson.name = payload.groupInfo.name;
        }
        state.newMessageIsActive = true;
    } else {
        state.newMessageIsActive = false;
    }
    let item = null;
    let msg = {
        ctime_ms: payload.eventData.ctime_ms,
        msg_type: 5,
        content: {
            msg_body: {
                text: `${payload.eventData.memo_name ||
                    payload.eventData.nickName || payload.eventData.name || '管理员'}修改了群信息`
            },
            msg_type: 'event'
        },
        time_show: '',
        conversation_time_show: 'today'
    };
    for (let list of state.messageList) {
        if (list.type === 4 && Number(list.key) === Number(payload.eventData.key)) {
            if (list.msgs.length > 0) {
                if (Util.fiveMinutes(list.msgs[list.msgs.length - 1].ctime_ms,
                    payload.eventData.ctime_ms)) {
                    msg.time_show = 'today';
                }
            } else {
                msg.time_show = 'today';
            }
            list.msgs.push(msg);
            if (list.groupSetting && list.groupSetting.groupInfo) {
                let name;
                if (!payload.groupInfo.name || payload.groupInfo.name === '') {
                    name = list.groupSetting.groupInfo.name;
                }
                list.groupSetting.groupInfo = payload.groupInfo;
                if (name) {
                    list.groupSetting.groupInfo.name = name;
                }
            }
            break;
        }
    }
    for (let i = 0; i < state.conversation.length; i++) {
        if (state.conversation[i].type === 4 &&
            Number(state.conversation[i].key) === Number(payload.eventData.key)) {
            item = state.conversation.splice(i, 1)[0];
            if (payload.groupInfo.avatarUrl && payload.groupInfo.avatarUrl !== '') {
                item.avatarUrl = payload.groupInfo.avatarUrl;
            }
            if (payload.groupInfo.name !== '') {
                item.name = payload.groupInfo.name;
            }
            break;
        }
    }
    for (let group of state.groupList) {
        if (Number(payload.eventData.key) === Number(group.gid)) {
            if (payload.groupInfo.avatarUrl !== '') {
                group.avatarUrl = payload.groupInfo.avatarUrl;
            }
            if (payload.groupInfo.name !== '') {
                group.name = payload.groupInfo.name;
            }
        }
    }
    if (item === null) {
        item = payload.groupInfo;
        item.type = 4;
        state.messageList.push({
            key: payload.eventData.key,
            msgs: [
                msg
            ],
            type: 4
        });
    }
    item.recentMsg = msg;
    filterTopConversation(state, item);
}
// 已读事件监听
function msgReceiptChangeEvent(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    if (payload instanceof Array) {
        for (let item of payload) {
            msgReceiptChange(state, item);
        }
    } else {
        msgReceiptChange(state, payload);
    }
}
function msgReceiptChange(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let messageList of state.messageList) {
        if (payload.type === 3) {
            if (messageList.type === 3 && payload.username === messageList.name
                && payload.appkey === messageList.appkey) {
                updateUnreadCount(state, messageList, payload);
                for (let conversation of state.conversation) {
                    if (payload.type === 3 && conversation.type === 3 &&
                        payload.username === conversation.name &&
                        payload.appkey === conversation.appkey) {
                        emptyUnreadText(conversation, payload);
                    }
                }
            }
        } else if (payload.type === 4) {
            if (messageList.type === 4 && Number(payload.gid) === Number(messageList.key)) {
                updateUnreadCount(state, messageList, payload);
            }
        }
    }
}
// 更新未读数
function updateUnreadCount(state: ChatStore, messageList, payload) {
    for (let receipt of payload.receipt_msgs) {
        for (let i = messageList.msgs.length - 1; i >= 0; i--) {
            if (messageList.msgs[i].msg_id === receipt.msg_id) {
                if (messageList.msgs[i].unread_count > receipt.unread_count) {
                    messageList.msgs[i].unread_count = receipt.unread_count;
                }
                break;
            }
        }
    }
}
// 清空会话的未读标识
function emptyUnreadText(conversation, payload) {
    for (let receipt of payload.receipt_msgs) {
        if (conversation.recentMsg &&
            conversation.recentMsg.msg_id === receipt.msg_id) {
            conversation.recentMsg.unread_count = 0;
            break;
        }
    }
}
// 会话置顶和取消置顶
function conversationToTop(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let i = 0; i < state.conversation.length; i++) {
        if (Number(state.conversation[i].key) === Number(payload.key)) {
            let item = state.conversation.splice(i, 1)[0];
            if (item.extras && item.extras.top_time_ms) {
                delete item.extras.top_time_ms;
            } else {
                item.extras.top_time_ms = new Date().getTime();
            }
            filterTopConversation(state, item);
            break;
        }
    }
}
// 聊天文件中的文件中的图片加载成功
function fileImageLoad(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let message of state.msgFileImageViewer) {
        let msgIdFlag = payload.msg_id && message.msg_id === payload.msg_id;
        let msgKeyFlag = payload.msgKey && message.msgKey === payload.msgKey;
        if (msgIdFlag || msgKeyFlag) {
            message.width = payload.content.msg_body.width;
            message.height = payload.content.msg_body.height;
            break;
        }
    }
}
// 处理聊天文件中的图片预览对象
function filterMsgFileImageViewer(state: ChatStore, type: string) {
    state.msgFileImageViewer = [];
    for (let message of state.messageList[state.activePerson.activeIndex].msgs) {
        let fileType = '';
        if (message.content.msg_type === 'file') {
            if (message.content.msg_body.extras) {
                if (message.content.msg_body.extras.video) {
                    fileType = 'video';
                } else if (message.content.msg_body.extras.fileType) {
                    fileType = Util.sortByExt(message.content.msg_body.extras.fileType);
                } else {
                    fileType = 'other';
                }
            } else {
                fileType = 'other';
            }
        }
        if ((message.content.msg_type === 'image') || fileType === 'image') {
            state.msgFileImageViewer.push({
                src: message.content.msg_body.media_url,
                width: message.content.msg_body.width,
                height: message.content.msg_body.height,
                msgKey: message.msgKey,
                msg_id: message.msg_id
            });
        }
    }
    state.msgFileImageViewer.reverse();
}
// 处理聊天文件中的文件列表
function filterMsgFile(state: ChatStore, type: string) {
    let fileArr = [];
    let msgFile = [];
    for (let message of state.messageList[state.activePerson.activeIndex].msgs) {
        let fileType = '';
        if (message.content.msg_type === 'file') {
            if (message.content.msg_body.extras) {
                if (message.content.msg_body.extras.video) {
                    fileType = 'video';
                } else if (message.content.msg_body.extras.fileType) {
                    fileType = Util.sortByExt(message.content.msg_body.extras.fileType);
                } else {
                    fileType = 'other';
                }
            } else {
                fileType = 'other';
            }
        }
        if ((message.content.msg_type === type && type === 'image') || fileType === type) {
            fileArr.push(message);
            state.msgFileImageViewer.push({
                src: message.content.msg_body.media_url,
                width: message.content.msg_body.width,
                height: message.content.msg_body.height,
                msgKey: message.msgKey,
                msg_id: message.msg_id
            });
        }
    }
    for (let i = fileArr.length - 1; i >= 0; i--) {
        let time = new Date(fileArr[i].ctime_ms);
        let year = time.getFullYear();
        let month = Util.doubleNumber(time.getMonth() + 1);
        let flag = true;
        let showTime = year + '年' + month + '月';
        for (let item of msgFile) {
            if (item.time === showTime) {
                item.msgs.push(fileArr[i]);
                flag = false;
                break;
            }
        }
        if (flag) {
            msgFile.push({
                time: showTime,
                msgs: [fileArr[i]]
            });
        }
    }
    state.msgFile[type] = msgFile;
}
// 给会话列表和当前消息列表添加备注名
function filterConversationMemoName(state: ChatStore) {
    for (let conversation of state.conversation) {
        // console.log("filterConversationMemoName")
        // console.log(state.friendList)
        if(state.friendList&&state.friendList.length>0){
            for (let friend of state.friendList) {
                if (conversation.name === friend.name && conversation.type === 3) {
                    conversation.memo_name = friend.memo_name;
                }
                if (conversation.recentMsg && conversation.recentMsg.content.from_id === friend.name
                    && conversation.type === 4) {
                    conversation.recentMsg.content.memo_name = friend.memo_name;
                }
            }
        }

    }
    if (state.activePerson.activeIndex >= 0 && state.activePerson.type === 4
        && state.messageList[state.activePerson.activeIndex]) {
        for (let message of state.messageList[state.activePerson.activeIndex].msgs) {
            for (let friend of state.friendList) {
                if (message.content.from_id === friend.name) {
                    message.content.memo_name = friend.memo_name;
                }
            }
        }
    }
}
// 更新其他用户资料
function updateOtherInfo(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    if (payload.return_code === 0 && state.otherInfo.info.name === payload.from_username) {
        state.otherInfo.info.isFriend = true;
    }
}
// 用户资料中删除好友
function otherInfoDeleteFriend(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    if (state.otherInfo.info.name === payload.name) {
        state.otherInfo.info.isFriend = false;
        state.otherInfo.show = false;
    }
    let hasMemoName = false;
    for (let i = 0; i < state.friendList.length; i++) {
        if (state.friendList[i].name === payload.name) {
            if (state.friendList[i].memo_name && state.friendList[i].memo_name !== '') {
                hasMemoName = true;
            }
            state.friendList.splice(i, 1);
            break;
        }
    }
    for (let i = 0; i < state.conversation.length; i++) {
        if (state.conversation[i].name === payload.name && state.conversation[i].type === 3) {
            state.conversation.splice(i, 1);
            break;
        }
    }
    if (state.activePerson.name === payload.name && state.activePerson.type === 3) {
        state.defaultPanelIsShow = true;
    }
    if (hasMemoName) {
        for (let messageList of state.messageList) {
            if (messageList.type === 4) {
                for (let msg of messageList.msgs) {
                    if (msg.content.from_id === payload.name) {
                        msg.content.memo_name = '';
                    }
                }
                if (messageList.groupSetting && messageList.groupSetting.memberList) {
                    for (let member of messageList.groupSetting.memberList) {
                        if (member.username === payload.name) {
                            member.memo_name = '';
                            break;
                        }
                    }
                }
            }
        }
        for (let conversation of state.conversation) {
            if (conversation.type === 4 && conversation.recentMsg) {
                if (conversation.recentMsg.content.from_id === payload.name) {
                    conversation.recentMsg.content.memo_name = '';
                }
            }
        }
    }
}
// 修改会话列表的备注名
function modifyConversationMemoName(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let conversation of state.conversation) {
        if (conversation.name === payload.name && conversation.type === 3) {
            conversation.memo_name = payload.memo_name;
        }
        if (conversation.recentMsg &&
            conversation.recentMsg.content.from_id === payload.name) {
            conversation.recentMsg.content.memo_name = payload.memo_name;
        }
    }
    if (state.activePerson.type === 3 && state.activePerson.name === payload.name) {
        state.activePerson.memo_name = payload.memo_name;
    }
}
// 修改好友列表的备注名
function modifyFriendListMemoName(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let friend of state.friendList) {
        if (friend.name === payload.name) {
            friend.memo_name = payload.memo_name;
            break;
        }
    }
}
// 修改用户信息的备注名
function modifyOtherInfoMemoName(state: ChatStore, payload) {
    if (payload.name === state.otherInfo.info.name) {
        state.otherInfo.info.memo_name = payload.memo_name;
    }
}
// 当前会话有修改了备注的用户时，修改消息列表的备注和群成员的备注
function modifyActiveMessageList(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    if (state.activePerson.activeIndex > 0 && state.activePerson.type === 4) {
        let messageList = state.messageList[state.activePerson.activeIndex];
        let msgs = messageList.msgs;
        for (let message of msgs) {
            if (message.content.from_id === payload.name ||
                message.content.from_id === payload.username) {
                message.content.memo_name = payload.memo_name;
            }
        }
        if (messageList.groupSetting && messageList.groupSetting.memberList) {
            for (let member of messageList.groupSetting.memberList) {
                if (member.username === payload.name || member.username === payload.username) {
                    member.memo_name = payload.memo_name;
                    Util.getMemo_nameFirstLetter(member);
                }
            }
        }
    }
}
// 更新（增加或删除）黑名单列表里的用户
function updateBlackMenu(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    let flag = true;
    for (let i = 0; i < state.blackMenu.length; i++) {
        if (state.blackMenu[i].username === payload.username) {
            state.blackMenu.splice(i, 1);
            flag = false;
            break;
        }
    }
    if (flag) {
        state.blackMenu.push({
            username: payload.username,
            appkey: payload.appkey
        });
    }
}
// 判断用户是否是黑名单
function filterSingleBlack(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let black of state.blackMenu) {
        if (black.username === payload.name) {
            payload.black = true;
            break;
        }
    }
}
// 判断用户是否是免打扰
function filterSingleNoDisturb(state: ChatStore, payload) {
    for (let user of state.noDisturb.users) {
        if (user.username === payload.name) {
            payload.noDisturb = true;
            break;
        }
    }
}
// 判断是否是好友
function filterFriend(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    let result = state.friendList.filter((friend) => {
        return friend.name === payload.name || friend.name === payload.username
            || friend.name === payload.from_username;
    });
    if (result.length > 0) {
        payload.memo_name = result[0].memo_name;
    }
    return result.length > 0 ? true : false;
}
// 同意添加好友后添加好友到会话列表
function addNewFriendToConversation(state: ChatStore, payload, type) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    if (payload.return_code !== 0 && type !== 'agree') {
        return;
    }
    if (payload.from_username) {
        payload.name = payload.from_username;
        payload.username = payload.from_username;
        payload.nickName = payload.from_nickname;
        payload.nickname = payload.from_nickname;
    }
    if (state.activePerson.type === 3 && payload.from_username === state.activePerson.name) {
        state.newMessageIsActive = true;
    }
    let result = state.friendList.filter((friend) => {
        return friend.name === payload.name;
    });
    if (result.length === 0) {
        state.friendList.push(payload);
    }
    let item = null;
    let msg = {
        ctime_ms: payload.ctime_ms,
        msg_type: 5,
        content: {
            msg_body: {
                text: '已成功添加为好友'
            },
            msg_type: 'event'
        },
        time_show: '',
        conversation_time_show: Util.reducerDate(payload.ctime_ms)
    };
    for (let i = 0; i < state.conversation.length; i++) {
        if (state.conversation[i].type === 3 && state.conversation[i].name === payload.name) {
            for (let list of state.messageList) {
                if (state.conversation[i].name === list.name &&
                    state.conversation[i].appkey === list.appkey) {
                    if (list.msgs.length > 0) {
                        if (Util.fiveMinutes(list.msgs[list.msgs.length - 1].ctime_ms,
                            payload.ctime_ms)) {
                            msg.time_show = Util.reducerDate(payload.ctime_ms);
                        }
                    } else {
                        msg.time_show = Util.reducerDate(payload.ctime_ms);
                    }
                    list.msgs.push(msg);
                    break;
                }
            }
            if (!state.conversation[i].extras || !state.conversation[i].extras.top_time_ms) {
                item = state.conversation.splice(i, 1)[0];
            } else {
                state.conversation[i].recentMsg = msg;
                return;
            }
            break;
        }
    }
    if (item === null) {
        item = payload;
        state.messageList.push({
            msgs: [
                msg
            ],
            appkey: payload.appkey || authPayload.appkey,
            name: payload.name,
            type: 3
        });
        msg.time_show = Util.reducerDate(payload.ctime_ms);
    }
    item.recentMsg = msg;
    filterTopConversation(state, item);
}
// 退群
function exitGroup(state: ChatStore, item) {
    if (item.gid) {
        item.key = item.gid;
    }
    for (let i = 0; i < state.groupList.length; i++) {
        if (Number(state.groupList[i].gid) === Number(item.key)) {
            state.groupList.splice(i, 1);
            break;
        }
    }
}
// 隐藏群设置
function showGroupSetting(state: ChatStore, show) {
    if (state.activePerson.activeIndex >= 0) {
        let groupSetting = state.messageList[state.activePerson.activeIndex].groupSetting;
        if (groupSetting) {
            groupSetting.show = show;
        }
    }
}
// 判断当前用户是否是目标用户
function currentIsActive(state: ChatStore, payload) {
    return state.activePerson.type === 4 &&
        Number(state.activePerson.key) === Number(payload.gid) ? true : false;
}
// 消息撤回
function msgRetract(state: ChatStore, payload) {
    let name = '';
    let recentMsg = {};
    let index;
    let singleSendName = '';
    if (payload.type === 0 && payload.from_username === global.user) {
        singleSendName = payload.to_usernames[0].username;
    } else if (payload.type === 0) {
        singleSendName = payload.from_username;
    }
    for (let i = 0; i < state.conversation.length; i++) {
        let isGroup = payload.type === 1 && state.conversation[i].type === 4 &&
            Number(payload.from_gid) === Number(state.conversation[i].key);
        let isSingle = payload.type === 0 && state.conversation[i].type === 3 &&
            state.conversation[i].name === singleSendName;
        if (isGroup || isSingle) {
            let msgType = isGroup ? 4 : 3;
            if (payload.from_username === global.user) {
                name = '您';
            } else if (msgType === 4) {
                payload.name = payload.from_username;
                if (filterFriend(state, payload) && payload.memo_name && payload.memo_name !== '') {
                    name = payload.memo_name;
                } else if (payload.from_nickname && payload.from_nickname !== '') {
                    name = payload.from_nickname;
                } else {
                    name = payload.from_username;
                }
            } else if (msgType === 3) {
                name = '对方';
            }
            recentMsg = {
                ctime_ms: payload.ctime_ms,
                content: {
                    msg_body: {
                        text: `${name}撤回了一条消息`
                    },
                    msg_type: 'event'
                },
                conversation_time_show: Util.reducerDate(payload.ctime_ms),
                msg_type: msgType
            };
            payload.key = state.conversation[i].key;
            index = i;
            if (!state.conversation[i].extras || !state.conversation[i].extras.top_time_ms) {
                let item = state.conversation.splice(i, 1);
                index = filterTopConversation(state, item[0]);
            }
            break;
        }
    }
    for (let messageList of state.messageList) {
        let group = payload.type === 1 && messageList.type === 4 &&
            Number(payload.key) === Number(messageList.key);
        let single = payload.type === 0 && messageList.type === 3 &&
            singleSendName === messageList.name;
        if (single || group) {
            for (let i = 0; i < messageList.msgs.length; i++) {
                if (Number(messageList.msgs[i].msg_id) === Number(payload.msg_ids[0])) {
                    let eventMsg = {
                        ctime_ms: payload.ctime_ms,
                        msg_type: 5,
                        content: {
                            msg_body: {
                                text: `${name}撤回了一条消息`
                            }
                        },
                        time_show: ''
                    };
                    let item = messageList.msgs.splice(i, 1);
                    eventMsg.ctime_ms = item[0].ctime_ms;
                    messageList.msgs.splice(i, 0, eventMsg);
                    if (i === messageList.msgs.length - 1) {
                        state.conversation[index].recentMsg = recentMsg;
                    }
                    break;
                }
            }
            break;
        }
    }
}
// 删除群成员事件
function deleteGroupMembersEvent(state: ChatStore, payload) {
    for (let messageList of state.messageList) {
        if (messageList.type === 4 && Number(messageList.key) === Number(payload.gid)) {
            if (messageList.groupSetting && messageList.groupSetting.memberList) {
                let memberList = messageList.groupSetting.memberList;
                for (let user of payload.to_usernames) {
                    for (let i = 0; i < memberList.length; i++) {
                        if (user.username === memberList[i].username) {
                            memberList.splice(i, 1);
                            break;
                        }
                    }
                }
                if (payload.new_owner) {
                    for (let i = 0; i < memberList.length; i++) {
                        if (payload.new_owner.username === memberList[i].username) {
                            let item = memberList.splice(i, 1)[0];
                            item.flag = 1;
                            memberList.unshift(item);
                            break;
                        }
                    }
                }
            }
            break;
        }
    }
}
// 切换用户前清除语音的定时器
function clearVoiceTimer(state: ChatStore) {
    let activeIndex = state.activePerson.activeIndex;
    let activeMessageList = state.messageList[activeIndex];
    if (activeIndex < 0 || !activeMessageList) {
        return;
    }
    for (let msg of activeMessageList.msgs) {
        if (msg.content.msg_type === 'voice') {
            msg.content.playing = false;
        }
    }
}
// 被添加进群时更新群成员
function updateGroupMembers(state: ChatStore, eventData) {
    for (let messageList of state.messageList) {
        if (messageList.type === 4 &&
            Number(messageList.key) === Number(eventData.gid)) {
            if (messageList.groupSetting) {
                for (let user of eventData.to_usernames) {
                    user.flag = 0;
                }
                if (messageList.groupSetting.memberList) {
                    for (let user of eventData.to_usernames) {
                        let flag = true;
                        for (let member of messageList.groupSetting.memberList) {
                            if (user.username === member.username) {
                                flag = false;
                            }
                        }
                        if (flag) {
                            messageList.groupSetting.memberList.push(user);
                        }
                    }
                }
            }
            break;
        }
    }
}
// 接收到管理员建群时自动添加会话和消息
function createGroupSuccessEvent(state: ChatStore, payload) {
    let item = {
        key: payload.gid,
        name: payload.name,
        type: 4,
        unreadNum: 0,
        recentMsg: {
            ctime_ms: payload.ctime_ms,
            content: {
                msg_body: {
                    text: '创建群聊'
                },
                msg_type: 'event'
            },
            conversation_time_show: Util.reducerDate(payload.ctime_ms),
            msg_type: 4
        }
    };
    filterTopConversation(state, item);
    state.groupList.push({
        appkey: payload.from_appkey,
        name: payload.group_name,
        gid: payload.gid,
        avatar: payload.avatar,
        avatarUrl: payload.avatarUrl || ''
    });
    state.messageList.push({
        key: payload.gid,
        msgs: [
            {
                ctime_ms: payload.ctime_ms,
                msg_type: 5,
                content: {
                    msg_body: {
                        text: '创建群聊'
                    }
                },
                time_show: Util.reducerDate(payload.ctime_ms)
            }
        ],
        type: 4
    });
    if (payload.isOffline) {
        sortConversationByRecentMsg(state);
    }
}
// 给群聊事件添加最近一条聊天消息
function isRecentmsg(state: ChatStore, payload, addGroupOther, operation, index) {
    let flag = false;
    for (let messageList of state.messageList) {
        if (state.conversation[index].type === 4 &&
            Number(state.conversation[index].key) === Number(messageList.key)) {
            flag = true;
            let msg = messageList['msgs'];
            if (msg.length === 0 || payload.ctime_ms > msg[msg.length - 1].ctime_ms) {
                state.conversation[index].recentMsg = {
                    ctime_ms: payload.ctime_ms,
                    content: {
                        msg_body: {
                            text: addGroupOther + operation
                        },
                        msg_type: 'event'
                    },
                    conversation_time_show: Util.reducerDate(payload.ctime_ms),
                    msg_type: 4
                };
            }
            break;
        }
    }
    if (!flag) {
        state.conversation[index].recentMsg = {
            ctime_ms: payload.ctime_ms,
            content: {
                msg_body: {
                    text: addGroupOther + operation
                },
                msg_type: 'event'
            },
            conversation_time_show: Util.reducerDate(payload.ctime_ms),
            msg_type: 4
        };
    }
}
// 通过recentMsg去对conversation排序
function sortConversationByRecentMsg(state: ChatStore) {
    for (let conversation of state.conversation) {
        if (conversation.recentMsg) {
            conversation.lastMsgTime = conversation.recentMsg.ctime_ms;
        } else {
            conversation.lastMsgTime = 0;
        }
    }
    let len = state.conversation.length;
    let maxIndex;
    let temp;
    let topIndex = 0;
    for (let i = 0; i < len; i++) {
        if (!state.conversation[i].extras || !state.conversation[i].extras.top_time_ms) {
            topIndex = i;
            break;
        }
    }
    for (let i = topIndex; i < len - 1; i++) {
        maxIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (state.conversation[j].lastMsgTime >
                state.conversation[maxIndex].lastMsgTime) {
                maxIndex = j;
            }
        }
        temp = Util.deepCopyObj(state.conversation[i]);
        state.conversation[i] = Util.deepCopyObj(state.conversation[maxIndex]);
        state.conversation[maxIndex] = temp;
    }
}
// 被添加进群、移出群、退出群的事件
function groupMembersEvent(state: ChatStore, payload, operation) {
    for (let shield of state.groupShield) {
        if (Number(shield.gid) === Number(payload.gid)) {
            return;
        }
    }
    let usernames = payload.to_usernames;
    let addGroupOther = '';
    for (let user of usernames) {
        if (user.nickname) {
            user.nickName = user.nickname;
        }
        if (user.username) {
            user.name = user.username;
        }
        filterFriend(state, user);
        if (user.username === global.user) {
            addGroupOther = '您' + '、';
        } else {
            let name = '';
            if (filterFriend(state, user) && user.memo_name && user.memo_name !== '') {
                name = user.memo_name;
            } else if (user.nickname && user.nickname !== '') {
                name = user.nickname;
            } else {
                name = user.username;
            }
            addGroupOther += name + '、';
        }
    }
    if (addGroupOther.length > 0) {
        addGroupOther = addGroupOther.slice(0, addGroupOther.length - 1);
    }
    let flag1 = true;
    for (let i = 0; i < state.conversation.length; i++) {
        if (state.conversation[i].type === 4 &&
            Number(payload.gid) === Number(state.conversation[i].key)) {
            flag1 = false;
            let index = i;
            if (!state.conversation[i].extras || !state.conversation[i].extras.top_time_ms) {
                let item = state.conversation.splice(i, 1);
                index = filterTopConversation(state, item[0]);
            }
            isRecentmsg(state, payload, addGroupOther, operation, index);
            break;
        }
    }
    if (flag1) {
        for (let group of state.groupList) {
            if (Number(group.gid) === Number(payload.gid)) {
                let conversation = Util.deepCopyObj(group);
                conversation.type = 4;
                conversation.key = group.gid;
                conversation.unreadNum = 0;
                for (let noDisturbGroup of state.noDisturb.groups) {
                    if (Number(noDisturbGroup.gid) === Number(payload.gid)) {
                        conversation.noDisturb = true;
                        break;
                    }
                }
                let index = filterTopConversation(state, conversation);
                flag1 = false;
                isRecentmsg(state, payload, addGroupOther, operation, index);
                break;
            }
        }
    }
    // 对群组列表和会话列表中没有的群，并且是离线的事件消息，不做任何处理
    if (flag1 && payload.isOffline) {
        return;
    }
    if (flag1) {
        let conversation = {
            key: payload.gid,
            name: payload.name,
            type: 4,
            unreadNum: 0,
            avatarUrl: payload.avatarUrl,
            recentMsg: {
                ctime_ms: payload.ctime_ms,
                content: {
                    msg_body: {
                        text: addGroupOther + operation
                    },
                    msg_type: 'event'
                },
                conversation_time_show: Util.reducerDate(payload.ctime_ms),
                msg_type: 4
            }
        };
        // 如果群聊事件消息的群名和群头像不存在，去群组列表获取
        for (let group of state.groupList) {
            if (Number(group.gid) === Number(payload.gid)) {
                if (group.avatarUrl) {
                    conversation.avatarUrl = group.avatarUrl;
                }
                if (!payload.name || payload.name === '') {
                    conversation.name = group.name;
                }
                break;
            }
        }
        filterTopConversation(state, conversation);
    }
    // 重新对conversation排序
    if (payload.isOffline) {
        sortConversationByRecentMsg(state);
    }
    addEventMsgToMessageList(state, payload, addGroupOther, operation);
}
// 将群聊事件消息添加到消息列表
function addEventMsgToMessageList(state: ChatStore, payload, addGroupOther, operation) {
    let message = {
        ctime_ms: payload.ctime_ms,
        msg_type: 5,
        content: {
            msg_body: {
                text: addGroupOther + operation
            }
        },
        time_show: ''
    };
    let flag2 = true;
    for (let messageList of state.messageList) {
        if (Number(payload.gid) === Number(messageList.key)) {
            flag2 = false;
            let msgs = messageList.msgs;
            if (payload.isOffline) {
                if (msgs.length === 0) {
                    message.time_show = Util.reducerDate(payload.ctime_ms);
                    msgs.push(message);
                } else if (msgs[msgs.length - 1].ctime_ms < payload.ctime_ms) {
                    if (Util.fiveMinutes(msgs[msgs.length - 1].ctime_ms, payload.ctime_ms)) {
                        message.time_show = Util.reducerDate(payload.ctime_ms);
                    }
                    msgs.push(message);
                } else {
                    for (let j = 0; j < msgs.length - 1; j++) {
                        if (msgs[j].ctime_ms < payload.ctime_ms &&
                            payload.ctime_ms < msgs[j + 1].ctime_ms) {
                            if (Util.fiveMinutes(msgs[j].ctime_ms, payload.ctime_ms)) {
                                message.time_show = Util.reducerDate(payload.ctime_ms);
                            }
                            if (!Util.fiveMinutes(payload.ctime_ms, msgs[j + 1].ctime_ms)) {
                                messageList.msgs[j + 1].time_show = '';
                            }
                            messageList.msgs.splice(j + 1, 0, message);
                            break;
                        }
                    }
                }
            } else {
                if (msgs.length === 0 ||
                    Util.fiveMinutes(msgs[msgs.length - 1].ctime_ms, payload.ctime_ms)) {
                    message.time_show = Util.reducerDate(payload.ctime_ms);
                }
                msgs.push(message);
            }
            break;
        }
    }
    if (flag2) {
        message.time_show = Util.reducerDate(payload.ctime_ms);
        state.messageList.push({
            key: payload.gid,
            msgs: [message],
            type: 4
        });
    }
}
// 离线消息15天后消失，而会话列表依然存在，导致不一一对应，所以补全离线消息
function completionMessageList(state: ChatStore) {
    for (let conversation of state.conversation) {
        let flag = false;
        for (let messageList of state.messageList) {
            let group = messageList.type === 4 &&
                Number(conversation.key) === Number(messageList.key);
            let single = messageList.type === 3 &&
                conversation.name === messageList.name;
            if (group || single) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            if (conversation.type === 3) {
                state.messageList.push({
                    key: conversation.key,
                    msgs: [],
                    type: 3,
                    appkey: conversation.appkey,
                    name: conversation.name
                });
            } else if (conversation.type === 4) {
                state.messageList.push({
                    key: conversation.key,
                    msgs: [],
                    type: 4
                });
            }
        }
    }
}
// 切换单聊用户免打扰
function changeSingleNoDisturb(state: ChatStore, payload) {
    let flag = true;
    for (let i = 0; i < state.noDisturb.users.length; i++) {
        if (payload.name === state.noDisturb.users[i].username) {
            flag = false;
            state.noDisturb.users.splice(i, 1);
        }
    }
    if (flag) {
        state.noDisturb.users.push({
            username: payload.name,
            appkey: payload.appkey
        });
    }
    for (let conversation of state.conversation) {
        if (conversation.type === 3 && conversation.name === payload.name) {
            if (flag) {
                conversation.noDisturb = true;
            } else {
                conversation.noDisturb = false;
            }
            break;
        }
    }
}
// 初始化免打扰
function initNoDisturb(state: ChatStore, noDisturb) {
    for (let user of noDisturb.users) {
        for (let conversation of state.conversation) {
            if (conversation.type === 3 && user.username === conversation.name) {
                conversation.noDisturb = true;
                break;
            }
        }
    }
    for (let group of noDisturb.groups) {
        group.key = group.gid;
        for (let conversation of state.conversation) {
            if (conversation.type === 4 && Number(group.key) === Number(conversation.key)) {
                conversation.noDisturb = true;
                break;
            }
        }
    }
}
// 切换群免打扰
function changeGroupNoDisturb(state: ChatStore, payload) {
    for (let conversation of state.conversation) {
        let group = conversation.type === 4 && payload.type === 4 &&
            Number(payload.key) === Number(conversation.key);
        if (group) {
            conversation.noDisturb = !conversation.noDisturb;
            break;
        }
    }
    let flag = true;
    for (let i = 0; i < state.noDisturb.groups.length; i++) {
        if (Number(state.noDisturb.groups[i].key) === Number(payload.key)) {
            state.noDisturb.groups.splice(i, 1);
            flag = false;
            break;
        }
    }
    if (flag) {
        state.noDisturb.groups.push({
            key: Number(payload.key),
            name: payload.name,
            appkey: payload.appkey
        });
    }
}
// 初始化群屏蔽
function initGroupShield(state: ChatStore, shield) {
    for (let shieldItem of shield) {
        for (let conversation of state.conversation) {
            if (conversation.type === 4 && Number(shieldItem.gid) === Number(conversation.key)) {
                conversation.shield = true;
                break;
            }
        }
    }
    state.groupShield = shield;
}
// 切换群屏蔽
function changeGroupShield(state: ChatStore, payload) {
    for (let item of state.conversation) {
        if (item.type === 4 && Number(payload.key) === Number(item.key)) {
            item.shield = !item.shield;
            if (item.shield) {
                state.groupShield.push({
                    gid: item.key,
                    name: item.name
                });
            } else {
                for (let i = 0; i < state.groupShield.length; i++) {
                    if (item.type === 4 && Number(state.groupShield[i].gid) === Number(item.key)) {
                        state.groupShield.splice(i, 1);
                        break;
                    }
                }
            }
            break;
        }
    }
}
// 过滤出当前图片预览的数组
function filterImageViewer(state: ChatStore) {
    let messageList = state.messageList[state.activePerson.activeIndex];
    if (state.activePerson.activeIndex < 0 || !messageList || !messageList.msgs) {
        return [];
    }
    let imgResult = [];
    let msgs = messageList.msgs;
    for (let message of msgs) {
        let content = message.content;
        let jpushEmoji = (!content.msg_body.extras || !content.msg_body.extras.kLargeEmoticon
            || content.msg_body.extras.kLargeEmoticon !== 'kLargeEmoticon');
        if (content.msg_type === 'image' && jpushEmoji) {
            imgResult.push({
                mediaId: content.msg_body.media_id,
                src: content.msg_body.media_url,
                width: content.msg_body.width,
                height: content.msg_body.height,
                msg_id: message.msg_id
            });
        }
    }
    return imgResult;
}
// 切换当前会话用户
function changeActivePerson(state: ChatStore) {
    if (state.activePerson.type === 4 && state.activePerson.gid) {
        state.activePerson.key = state.activePerson.gid;
    }
    for (let i = 0; i < state.messageList.length; i++) {
        let group = state.activePerson.type === 4 && state.messageList[i].type === 4 &&
            Number(state.messageList[i].key) === Number(state.activePerson.key);
        let single = state.activePerson.type === 3 && state.messageList[i].type === 3 &&
            state.messageList[i].name === state.activePerson.name;
        if (group || single) {
            state.activePerson.activeIndex = i;
            break;
        }
    }
    let list = state.messageList[state.activePerson.activeIndex];
    for (let msg of list.msgs) {
        let video = (msg.content.msg_body.extras && msg.content.msg_body.extras.video);
        if (msg.content.msg_type === 'file' && video) {
            // audio 0 正在加载  1 加载完成  2 正在播放
            msg.content.load = 0;
            // 加载进度 0%
            msg.content.range = 0;
        } else if (msg.content.msg_type === 'voice') {
            // voice 播放时的动画
            msg.content.playing = false;
            msg.content.load = 0;
        }
        // 给群聊消息中的好友添加备注名
        // console.log("changeActivePerson")
        // console.log(state.friendList)
        if(state.friendList&&state.friendList.length>0){
            for (let friend of state.friendList) {
                if (friend.name === msg.content.from_id) {
                    msg.content.memo_name = friend.memo_name;
                    break;
                }
            }
        }
            // 初始化图片消息的loading状态
        if (msg.content.msg_type === 'image') {
            msg.content.msg_body.loading = false;
        }
    }
    // 给群成员中的好友添加备注名
    if (state.activePerson.type === 4 &&
        list && list.groupSetting && list.groupSetting.memberList) {
        for (let member of list.groupSetting.memberList) {
            for (let friend of state.friendList) {
                if (friend.name === member.username) {
                    member.memo_name = friend.memo_name;
                    Util.getMemo_nameFirstLetter(member);
                    break;
                }
            }
        }
    }
    // 初始化已读语音消息的状态
    for (let i = 0; i < state.voiceState.length; i++) {
        if (Number(state.voiceState[i].key) === Number(list.key)) {
            let flag = true;
            for (let msg of list.msgs) {
                if (Number(state.voiceState[i].msgId) === Number(msg.msg_id)) {
                    msg.content.havePlay = true;
                    flag = false;
                    break;
                }
            }
            if (flag) {
                state.voiceState.splice(i, 1);
            }
        }
    }
    state.imageViewer = filterImageViewer(state);
}
// 添加最近一条聊天消息
function filterRecentMsg(state: ChatStore) {
    state = JSON.parse(JSON.stringify(state)); // 去除object属性保护

    for (let conversation of state.conversation) {
        for (let messageList of state.messageList) {
            let group = conversation.type === 4 && messageList.type === 4 &&
                Number(conversation.key) === Number(messageList.key);
            let single = conversation.type === 3 && messageList.type === 3 &&
                conversation.name === messageList.name;
            if (group || single) {
                let msgs = messageList.msgs;
                if (msgs.length > 0) {
                    msgs[msgs.length - 1].conversation_time_show =
                        Util.reducerDate(msgs[msgs.length - 1].ctime_ms);
                    conversation.recentMsg = msgs[msgs.length - 1];
                }
                break;
            }
        }
    }
    sortConversationByRecentMsg(state);
}
// 将群主放在第一位
function sortGroupMember(memberList) {
    for (let i = 0; i < memberList.length; i++) {
        if (memberList[i].flag === 1) {
            let temp = memberList.splice(i, 1);
            memberList.unshift(temp[0]);
            break;
        }
    }
}
// 完成消息的发送接口的调用后，返回成功或者失败状态
function sendMsgComplete(state: ChatStore, payload) {
    // state = JSON.parse(JSON.stringify(state))
    // payload = JSON.parse(JSON.stringify(payload))
    if (payload.success === 2) {
        payload.msgs.success = 2;
        for (let conversation of state.conversation) {
            // 转发消息时没有key
            if (!payload.key) {
                if (payload.name === conversation.name) {
                    payload.key = conversation.key;
                    conversation.key = payload.msgs.key;
                }
                // 转发或者发送消息时key < 0
            } else if (Number(payload.key) < 0) {
                if (Number(payload.key) === Number(conversation.key)) {
                    conversation.key = payload.msgs.key;
                }
            }
            // 给recentMsg添加msg_id
            if (payload.type === 3 && payload.name === conversation.name &&
                conversation.type === 3) {
                payload.msgs.unread_count = 1;
                // console.log(conversation.recentMsg)
                // console.log(payload)
                if(conversation&&conversation.recentMsg){
                    payload.msgs.conversation_time_show =
                    conversation.recentMsg.conversation_time_show;
                    payload.msgs.ctime_ms = conversation.recentMsg.ctime_ms;
                }
                conversation.recentMsg = payload.msgs;
            }
        }
    }

    if(true){

    for (let messageList of Object.values(state.messageList)) {
        let group = payload.type === 4 && messageList.type === 4 &&
            Number(messageList.key) === Number(payload.key);
        let single = payload.type === 3 && messageList.type === 3 &&
            messageList.name === payload.name;
        if (group || single) {
            if (Number(payload.key) < 0 && payload.success === 2) {
                messageList.key = payload.msgs.key;
                if (Number(payload.key) === Number(state.activePerson.key)) {
                    state.activePerson.key = payload.msgs.key;
                }
            }
            let msgs = messageList.msgs;
            for (let j = msgs.length - 1; j >= 0; j--) {
                if (msgs[j].msgKey && Number(payload.msgKey) === Number(msgs[j].msgKey)) {
                    if (payload.msgs && payload.success === 2) {
                        let url = msgs[j].content.msg_body.media_url;
                        let localExtras = msgs[j].content.msg_body.extras;
                        if (url) {
                            payload.msgs.content.msg_body.media_url = url;
                        }
                        if (localExtras && localExtras.businessCard) {
                            payload.msgs.content.msg_body.extras.media_url = localExtras.media_url;
                            payload.msgs.content.msg_body.extras.nickName = localExtras.nickName;
                        }
                        delete msgs[j].msg_id;
                        let from_name = payload.msgs.content.from_name;
                        let nickname = msgs[j].content.from_name;
                        msgs[j] = Object.assign({}, msgs[j], payload.msgs);
                        if (!from_name) {
                            msgs[j].content.from_name = nickname;
                        }
                    }
                    msgs[j].success = payload.success;
                    return;
                }
            }
        }
    }
}

}
// 删除本地的会话列表
function deleteConversationItem(state: ChatStore, payload) {
    let itemKey = Number(payload.item.key);
    for (let i = 0; i < state.conversation.length; i++) {
        let conversationKey = Number(state.conversation[i].key);
        if (conversationKey === itemKey ||
            (state.conversation[i].name === payload.item.name &&
                payload.item.type === 3 && state.conversation[i].type === 3)) {
            state.conversation.splice(i, 1);
            break;
        }
    }
    let group = state.activePerson.type === 4 && payload.item.type === 4 &&
        itemKey === Number(state.activePerson.key);
    let single = state.activePerson.type === 3 && payload.item.type === 3 &&
        payload.item.name === state.activePerson.name;
    if (group || single) {
        state.defaultPanelIsShow = true;
        state.activePerson = {
            key: '0',
            name: '',
            nickName: '',
            activeIndex: -1,
            noDisturb: false,
            avatarUrl: '',
            shield: false,
            memo_name: '',
            appkey: ''
        };
    }
}
// 转发消息
function transmitMessage(state: ChatStore, payload) {
    payload.msgs.key = payload.select.key;
    let flag1 = true;
    let flag2 = true;
    for (let a = 0; a < state.conversation.length; a++) {
        let groupExist = payload.select.type === 4 && state.conversation[a].type === 4 &&
            Number(state.conversation[a].key) === Number(payload.select.key);
        let singleExist = payload.select.type === 3 && state.conversation[a].type === 3 &&
            state.conversation[a].name === payload.select.name;
        if (groupExist || singleExist) {
            flag1 = false;
            payload.select.conversation_time_show = 'today';
            state.conversation[a].recentMsg = payload.msgs;
            if (!state.conversation[a].extras || !state.conversation[a].extras.top_time_ms) {
                let item = state.conversation.splice(a, 1);
                filterTopConversation(state, item[0]);
            }
            break;
        }
    }
    for (let messageList of state.messageList) {
        let group = payload.select.type === 4 && messageList.type === 4 &&
            Number(messageList.key) === Number(payload.select.key);
        let single = payload.select.type === 3 && messageList.type === 3 &&
            messageList.name === payload.select.name;
        if (group || single) {
            flag2 = false;
            let msgs = messageList.msgs;
            if (msgs.length === 0 ||
                Util.fiveMinutes(msgs[msgs.length - 1].ctime_ms, payload.msgs.ctime_ms)) {
                payload.msgs.time_show = 'today';
            }
            msgs.push(payload.msgs);
            state.newMessage = payload.msgs;
            break;
        }
    }
    if (flag1 && payload.select.type === 3) {
        payload.select.conversation_time_show = 'today';
        payload.msgs.time_show = 'today';
        payload.select.recentMsg = payload.msgs;
        initConversation(state, payload.select);
        filterTopConversation(state, payload.select);
        if (flag2) {
            state.messageList.push({
                msgs: [payload.msgs],
                type: 3,
                name: payload.select.name,
                appkey: payload.select.appkey || authPayload.appkey
            });
        }
        state.newMessage = payload.msgs;
    } else if (flag1 && payload.select.type === 4) {
        payload.select.conversation_time_show = 'today';
        payload.msgs.time_show = 'today';
        payload.select.recentMsg = payload.msgs;
        initConversation(state, payload.select);
        filterTopConversation(state, payload.select);
        if (flag2) {
            state.messageList.push({
                key: payload.msgs.key,
                msgs: [payload.msgs],
                type: 4
            });
        }
        state.newMessage = payload.msgs;
    }
    // 更新imageViewer的数组
    if (payload.msgs.content.msg_type === 'image') {
        let isSingleMessage = payload.select.type === 3 && state.activePerson.type === 3 &&
            payload.select.name === state.activePerson.name;
        let isGroupMessage = payload.select.type === 4 && state.activePerson.type === 4 &&
            Number(payload.select.key) === Number(state.activePerson.key);
        if (isSingleMessage || isGroupMessage) {
            state.imageViewer.push({
                src: payload.msgs.content.msg_body.media_url,
                width: payload.msgs.content.msg_body.width,
                height: payload.msgs.content.msg_body.height,
                msgKey: payload.msgs.msgKey
            });
        }
    }
}
// 添加消息到消息面板
function addMessage(state: ChatStore, payload) {
    // 接收到别人的消息添加到消息列表/同步自己发送的消息
    if (payload.messages && payload.messages[0]) {
        let message = payload.messages[0];
        if (message.msg_type === 3) {
            let isMySelf = message.content.from_id !== global.user;
            message.content.name = isMySelf ? message.content.from_id : message.content.target_id;
            message.content.nickName =
                isMySelf ? message.content.from_name : message.content.target_name;
            message.content.appkey =
                isMySelf ? message.content.from_appkey : message.content.target_appkey;
        } else {
            message.content.name = message.content.from_id;
            message.content.nickName = message.content.from_name;
            message.content.appkey = message.content.from_appkey;
        }
        filterFriend(state, message.content);
        filterNewMessage(state, payload, message);
        let flag = false;
        // 如果发送人在会话列表里
        for (let a = 0; a < state.conversation.length; a++) {
            let groupMsg = message.msg_type === 4 && state.conversation[a].type === 4 &&
                Number(state.conversation[a].key) === Number(message.key);
            let singleMsg = message.msg_type === 3 && state.conversation[a].type === 3 &&
                state.conversation[a].name === message.content.name;
            if (groupMsg || singleMsg) {
                if (groupMsg && message.content.target_name === '') {
                    message.content.target_name = state.conversation[a].name;
                }
                let groupNoActive = message.msg_type === 4 &&
                    Number(state.activePerson.key) !== Number(message.key);
                let singleNoActive = message.msg_type === 3 &&
                    state.activePerson.name !== message.content.name;
                if (groupNoActive || singleNoActive) {
                    if (message.content.from_id !== global.user) {
                        if (!state.conversation[a].unreadNum) {
                            state.conversation[a].unreadNum = 1;
                        } else {
                            state.conversation[a].unreadNum++;
                        }
                    }
                    let atList = messageHasAtList(payload.messages[0].content.at_list);
                    if (atList !== '') {
                        state.conversation[a].atUser = atList;
                    }
                }
                flag = true;
                if (state.conversation[a].key < 0) {
                    let oldKey = Number(state.conversation[a].key);
                    if (oldKey === Number(state.activePerson.key)) {
                        state.activePerson.key = message.key;
                    }
                    state.conversation[a].key = message.key;
                    for (let messageList of state.messageList) {
                        if (oldKey === Number(messageList.key)) {
                            messageList.key = message.key;
                            break;
                        }
                    }
                }
                let index = a;
                if (!state.conversation[a].extras || !state.conversation[a].extras.top_time_ms) {
                    let item = state.conversation.splice(a, 1);
                    index = filterTopConversation(state, item[0]);
                }
                state.conversation[index].recentMsg = payload.messages[0];
                payload.messages[0].conversation_time_show = 'today';
                state.newMessageIsDisturb = state.conversation[index].noDisturb ? true : false;
                break;
            }
        }
        for (let messageList of state.messageList) {
            let groupMsg = message.msg_type === 4 && messageList.type === 4 &&
                Number(messageList.key) === Number(message.key);
            let singleMsg = message.msg_type === 3 && messageList.type === 3 &&
                messageList.name === message.content.name;
            if (groupMsg || singleMsg) {
                let msgs = messageList.msgs;
                if (msgs.length === 0 ||
                    Util.fiveMinutes(msgs[msgs.length - 1].ctime_ms, message.ctime_ms)) {
                    payload.messages[0].time_show = 'today';
                }
                msgs.push(payload.messages[0]);
                break;
            }
        }
        // 如果发送人不在会话列表里
        if (!flag) {
            addMessageUserNoConversation(state, payload, message);
        }
        state.newMessage = payload.messages[0];
    } else {
        // 自己发消息将消息添加到消息列表
        addMyselfMesssge(state, payload);
        // 清空会话草稿标志
        for (let conversation of state.conversation) {
            let single = payload.active.type === 3 && conversation.type === 3 &&
                payload.active.name === conversation.name;
            let group = payload.active.type === 4 && conversation.type === 4 &&
                Number(payload.active.key) === Number(conversation.key);
            if (single || group) {
                if (payload.msgs.content.msg_type === 'text') {
                    conversation.draft = '';
                }
                break;
            }
        }
    }
}
// 添加自己发的消息到消息面板
function addMyselfMesssge(state: ChatStore, payload) {

    let result = state.conversation.filter((item) => {
        let single = item.type === 3 && payload.active.type === 3 &&
            item.name === payload.active.name;
        let group = item.type === 4 && payload.active.type === 4 &&
            Number(item.key) === Number(payload.active.key);
        return single || group;
    });
    if (result.length === 0) {
        payload.active.extras = {};
        payload.msgs.conversation_time_show = 'today';
        payload.active.recentMsg = payload.msgs;
        let flag = true;
        if(true){
            for (let message of Object.values(state.messageList)) {
                let group = payload.active.type === 4 && message.type === 4 &&
                Number(payload.active.key) === Number(message.key);
                let single = payload.active.type === 3 && message.type === 3 &&
                payload.active.name === message.name;
                if (group || single) {
                    message.msgs.push(payload.msgs);
                    flag = false;
                    break;
                }
            }
        }
        if (flag && payload.active.type === 3) {

            state.messageList.push({
                msgs: [payload.msgs],
                type: 3,
                name: payload.active.name,
                appkey: payload.active.appkey || authPayload.appkey
            });
        } else if (flag && payload.active.type === 4) {

            state.messageList.push({
                msgs: [payload.msgs],
                type: 4,
                key: payload.active.key
            });
        }
        filterTopConversation(state, payload.active);
    } else {

        // 更新imageViewer的数组
        if (payload.msgs && payload.msgs.content.from_id === global.user
            && payload.msgs.content.msg_type === 'image') {
            let single = payload.active.type === 3 && state.activePerson.type === 3 &&
                payload.active.name === state.activePerson.name;
            let group = payload.active.type === 4 && state.activePerson.type === 4 &&
                Number(payload.active.key) === Number(state.activePerson.key);
            if (single || group) {
                state.imageViewer.push({
                    src: payload.msgs.content.msg_body.media_url,
                    width: payload.msgs.content.msg_body.width,
                    height: payload.msgs.content.msg_body.height,
                    msgKey: payload.msgs.msgKey
                });
            }
        }

        if(true){
            for (let messageList of Object.values(state.messageList)) {
                let single = payload.active.type === 3 && messageList.type === 3 &&
                    messageList.name === payload.active.name;
                let group = messageList.type === 4 && payload.active.type === 4 &&
                    Number(messageList.key) === Number(payload.key);
                if (single || group) {
                    let msgs = messageList.msgs;
                    if (msgs.length === 0 ||
                        Util.fiveMinutes(msgs[msgs.length - 1].ctime_ms, payload.msgs.ctime_ms)) {
                        payload.msgs.time_show = 'today';
                    }
                    msgs.push(payload.msgs);
                    state.newMessage = payload.msgs;
                    break;
                }
            }
        }
        // 将当前会话放在第一位
        for (let a = 0; a < state.conversation.length; a++) {
            let group = payload.active.type === 4 && state.conversation[a].type === 4 &&
                Number(state.conversation[a].key) === Number(payload.key);
            let single = payload.active.type === 3 && state.conversation[a].type === 3 &&
                state.conversation[a].name === payload.active.name;
            if (group || single) {
                payload.msgs.conversation_time_show = 'today';
                if (payload.msgs.msg_type === 3) {
                    payload.msgs.unread_count = 1;
                }
                state.conversation[a].recentMsg = payload.msgs;
                if (!state.conversation[a].extras || !state.conversation[a].extras.top_time_ms) {
                    let item = state.conversation.splice(a, 1);
                    filterTopConversation(state, item[0]);
                }
                break;
            }
        }
    }

}
// 处理新消息
function filterNewMessage(state: ChatStore, payload, message) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    message = JSON.parse(JSON.stringify(message))

    // 更新imageViewer的数组
    let isGroupMessage = message.msg_type === 4 && state.activePerson.type === 4 &&
        Number(message.key) === Number(state.activePerson.key);
    let isSingleMessage = message.msg_type === 3 && state.activePerson.type === 3 &&
        message.content.from_id === state.activePerson.name;
    let isImage = message.content.msg_type === 'image';
    if ((isGroupMessage || isSingleMessage) && isImage) {
        state.imageViewer.push({
            src: message.content.msg_body.media_url,
            width: message.content.msg_body.width,
            height: message.content.msg_body.height,
            msg_id: message.msg_id
        });
    }
    // 接收到语音初始化播放动画
    let isVoice = message.content.msg_type === 'voice';
    if (isVoice) {
        payload.messages[0].content.playing = false;
        payload.messages[0].content.havePlay = false;
        payload.messages[0].content.load = 0;
    }
    // 接收到小视频初始化loading
    let isVideo = message.content.msg_type === 'file' &&
        message.content.msg_body.extras &&
        message.content.msg_body.extras.video;
    if (isVideo) {
        payload.messages[0].content.load = 0;
        payload.messages[0].content.range = 0;
    }
}
// 新消息用户不在会话列表中
function addMessageUserNoConversation(state: ChatStore, payload, message) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    let msg;
    let conversationItem;
    if (message.msg_type === 3) {
        msg = {
            key: message.key,
            msgs: [
                message
            ],
            draft: '',
            content: message.content,
            type: 3,
            name: message.content.name,
            appkey: message.content.appkey
        };
        conversationItem = {
            avatar: '',
            avatarUrl: message.content.avatarUrl,
            key: message.key,
            mtime: message.ctime_ms,
            name: message.content.name,
            nickName: message.content.nickName,
            type: 3,
            unreadNum: message.content.from_id !== global.user ? 1 : 0,
            noDisturb: false,
            extras: {}
        };
        for (let user of state.noDisturb.users) {
            if (user.username === message.content.name) {
                conversationItem.noDisturb = true;
                state.newMessageIsDisturb = true;
                break;
            }
        }
    } else {
        // 如果新消息没群名，从群列表中获取
        if (!message.content.target_name || message.content.target_name.length === 0) {
            for (let group of state.groupList) {
                if (Number(group.gid) === Number(message.key)) {
                    message.content.target_name = group.name;
                    break;
                }
            }
        }
        msg = {
            key: message.key,
            msgs: [
                message
            ],
            draft: '',
            content: message.content,
            type: 4
        };
        let avatarUrl;
        for (let group of state.groupList) {
            if (Number(group.gid) === Number(message.key)) {
                avatarUrl = group.avatarUrl;
                break;
            }
        }
        conversationItem = {
            avatar: '',
            avatarUrl: avatarUrl || '',
            key: message.key,
            mtime: message.ctime_ms,
            name: message.content.target_name,
            type: 4,
            unreadNum: message.content.from_id !== global.user ? 1 : 0,
            noDisturb: false,
            extras: {}
        };
        for (let group of state.noDisturb.groups) {
            if (Number(group.key) === Number(message.key)) {
                conversationItem.noDisturb = true;
                state.newMessageIsDisturb = true;
                break;
            }
        }
    }
    if (!conversationItem.noDisturb) {
        state.newMessageIsDisturb = false;
    }
    payload.messages[0].conversation_time_show = 'today';
    payload.messages[0].time_show = 'today';
    state.newMessage = msg;
    state.messageList.push(msg);
    let index = filterTopConversation(state, conversationItem);
    state.conversation[index].recentMsg = payload.messages[0];
    let atList = messageHasAtList(payload.messages[0].content.at_list);
    if (atList !== '') {
        state.conversation[index].atUser = atList;
    }
}
// 添加会话列表中的@文本
function messageHasAtList(atList) {
    let atUser = '';
    if (atList && atList.length === 0) {
        atUser = '@所有成员';
    } else if (atList && atList.length > 0) {
        for (let atItem of atList) {
            if (atItem.username === global.user) {
                atUser = '有人@我';
                break;
            }
        }
    }
    return atUser;
}
// 搜索单聊或者好友
function searchSingleUser(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    let singleArr = [];
    // 查找最近联系人
    for (let item of state.conversation) {
        searchSingle(payload.keywords, singleArr, item);
    }
    // 查找好友
    for (let item of state.friendList) {
        searchSingle(payload.keywords, singleArr, item);
    }
    if (payload.result) {
        let item = singleArr.filter((single) => {
            return single.name === payload.result.name;
        });
        if (item.length === 0) {
            singleArr.push(payload.result);
        }
    }
    return singleArr;
}
// 搜索用户、群组
function searchUser(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    if (payload === '') {
        return {
            result: {
                groupArr: [],
                singleArr: [],
                roomArr: []
            },
            isSearch: false
        };
    }
    let singleArr = [];
    let groupArr = [];
    // 查找最近联系人
    for (let item of state.conversation) {
        searchSingle(payload, singleArr, item);
    }
    // 查找好友
    for (let item of state.friendList) {
        searchSingle(payload, singleArr, item);
    }
    // 查找群组
    for (let item of state.groupList) {
        let existGroup = (item.name.toLowerCase().indexOf(payload.toLowerCase()) !== -1);
        if (existGroup) {
            groupArr.push(item);
        }
    }
    return {
        result: {
            singleArr,
            groupArr,
            roomArr: []
        },
        isSearch: true
    };
}
// 搜索单聊用户或好友
function searchSingle(payload, singleArr, item) {
    let existMemoName = item.memo_name &&
        item.memo_name.toLowerCase().indexOf(payload.toLowerCase()) !== -1;
    let existNickName = item.nickName &&
        item.nickName.toLowerCase().indexOf(payload.toLowerCase()) !== -1;
    let existName = item.name &&
        item.name.toLowerCase().indexOf(payload.toLowerCase()) !== -1;
    let existSingle = item.type === 3;
    let isExist = singleArr.filter((single) => {
        return single.name === item.name;
    });
    if (isExist.length > 0) {
        return;
    }
    if (existSingle && (existMemoName || existNickName || existName)) {
        singleArr.push(item);
    }
}
// 选择搜索的用户、发起单聊
function selectUserResult(state: ChatStore, payload, type?: string) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    if (payload.gid) {
        payload.key = payload.gid;
    }
    let conversation = state.conversation;
    let flag = false;
    let index;
    for (let i = 0; i < conversation.length; i++) {
        let group = payload.type === 4 && conversation[i].type === 4 &&
            Number(conversation[i].key) === Number(payload.key);
        let single = payload.type === 3 && conversation[i].type === 3 &&
            conversation[i].name === payload.name;
        if (group || single) {
            index = i;
            payload.key = conversation[i].key;
            if (!conversation[i].extras || !conversation[i].extras.top_time_ms) {
                let item = conversation.splice(i, 1);
                index = filterTopConversation(state, item[0]);
            }
            if (!conversation[index].name) {
                conversation[index].name = payload.name;
                conversation[index].unreadNum = 0;
            }
            flag = true;
            break;
        }
    }
    let result = state.messageList.filter((item) => {
        let group = item.type === 4 && payload.type === 4 &&
            Number(item.key) === Number(payload.key);
        let single = payload.type === 3 && item.type === 3 && payload.name === item.name;
        return group || single;
    });
    if (result.length === 0) {
        if (payload.type === 3) {
            state.messageList.push({
                key: payload.key,
                msgs: [],
                type: 3,
                name: payload.name,
                appkey: payload.appkey || authPayload.appkey
            });
        } else if (payload.type === 4) {
            state.messageList.push({
                key: payload.key,
                msgs: [],
                type: 4
            });
        }
    }
    if (!flag) {
        initConversation(state, payload);
        if (result.length > 0 && result[0].msgs.length > 0) {
            payload.recentMsg = result[0].msgs[result[0].msgs.length - 1];
        }
        filterTopConversation(state, payload);
    }
    if (type === 'search' && index) {
        state.activePerson = Util.deepCopyObj(state.conversation[index]);
    } else if (type === 'search') {
        state.activePerson = Util.deepCopyObj(payload);
    }
}
// 创建会话时初始化会话
function initConversation(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    payload.extras = {};
    if (payload.type === 3) {
        let single = state.noDisturb.users.filter((item) => {
            return payload.name === item.username;
        });
        if (single.length !== 0) {
            payload.noDisturb = true;
        }
    } else if (payload.type === 4) {
        let group = state.noDisturb.groups.filter((item) => {
            return Number(payload.key) === Number(item.gid);
        });
        if (group.length !== 0) {
            payload.noDisturb = true;
        }
        let shield = state.groupShield.filter((item) => {
            return Number(item.gid) === Number(payload.key);
        });
        if (shield.length !== 0) {
            payload.shield = true;
        }
    }
}
// 切换当前会话时,清空未读消息数目
function emptyUnreadNum(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    state.readObj = [];
    for (let item of state.conversation) {
        let group = payload.type === 4 && item.type === 4 &&
            Number(item.key) === Number(payload.key);
        let single = payload.type === 3 && item.type === 3 && item.name === payload.name;
        if (group || single) {
            item.atUser = '';
            if (item.unreadNum) {
                item.unreadNum = 0;
            }
            break;
        }
    }
}
// 将会话插入到置顶会话之后
function filterTopConversation(state: ChatStore, item) {
    let flag = true;
    let index;
    for (let i = 0; i < state.conversation.length; i++) {
        if (!state.conversation[i].extras || !state.conversation[i].extras.top_time_ms) {
            state.conversation.splice(i, 0, item);
            index = i;
            flag = false;
            break;
        }
    }
    if (flag) {
        state.conversation.push(item);
        index = state.conversation.length - 1;
    }
    return index;
}
// 添加群成员禁言事件
function addGroupMemberSilenceEvent(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    changeGroupMemberSilence(state, payload, true, '被禁言');
}
// 取消群成员禁言事件
function deleteGroupMemberSilenceEvent(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    changeGroupMemberSilence(state, payload, false, '被解除禁言');
}
// 切换群成员禁言
function changeGroupMemberSilence(state: ChatStore, payload, silence: boolean, text: string) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let shield of state.groupShield) {
        if (Number(shield.gid) === Number(payload.gid)) {
            return;
        }
    }
    for (let messageList of state.messageList) {
        if (Number(payload.gid) === Number(messageList.key)) {
            if (messageList.groupSetting && messageList.groupSetting.memberList) {
                for (let user of payload.to_usernames) {
                    for (let member of messageList.groupSetting.memberList) {
                        if (member.username === user.username) {
                            member.keep_silence = silence;
                            break;
                        }
                    }
                }
            }
            break;
        }
    }
    for (let user of payload.to_usernames) {
        let name = user.nickname || user.username;
        for (let friend of state.friendList) {
            if (friend.name === user.username) {
                if (friend.memo_name) {
                    name = friend.memo_name;
                }
                break;
            }
        }
        let msg = {
            ctime_ms: payload.ctime_ms,
            msg_type: 5,
            content: {
                msg_body: {
                    text: `${name} ${text}`
                },
                msg_type: 'event'
            },
            time_show: '',
            conversation_time_show: Util.reducerDate(payload.ctime_ms)
        };
        let flag = false;
        for (let i = 0; i < state.conversation.length; i++) {
            if (state.conversation[i].type === 4 &&
                Number(state.conversation[i].key) === Number(payload.gid)) {
                state.conversation[i].recentMsg = msg;
                let item = state.conversation.splice(i, 1)[0];
                filterTopConversation(state, item);
                flag = true;
                for (let messageList of state.messageList) {
                    if (messageList.type === 4 &&
                        Number(messageList.key) === Number(payload.gid)) {
                        let msgs = messageList.msgs;
                        if (msgs.length > 0) {
                            if (Util.fiveMinutes(msgs[msgs.length - 1].ctime_ms,
                                payload.ctime_ms)) {
                                msg.time_show = Util.reducerDate(payload.ctime_ms);
                            }
                        } else {
                            msg.time_show = Util.reducerDate(payload.ctime_ms);
                        }
                        msgs.push(msg);
                        break;
                    }
                }
                break;
            }
        }
        if (!flag) {
            for (let group of state.groupList) {
                if (Number(group.gid) === Number(payload.gid)) {
                    let conversation = Util.deepCopyObj(group);
                    for (let noDisturbGroup of state.noDisturb.groups) {
                        if (Number(noDisturbGroup.gid) === Number(payload.gid)) {
                            conversation.noDisturb = true;
                            break;
                        }
                    }
                    conversation.type = 4;
                    conversation.recentMsg = msg;
                    if (conversation.gid) {
                        conversation.key = conversation.gid;
                    }
                    filterTopConversation(state, conversation);
                    let flag2 = false;
                    for (let messageList of state.messageList) {
                        if (messageList.type === 4 &&
                            Number(messageList.key) === Number(payload.gid)) {
                            let msgs = messageList.msgs;
                            if (msgs.length > 0) {
                                if (Util.fiveMinutes(msgs[msgs.length - 1].ctime_ms,
                                    payload.ctime_ms)) {
                                    msg.time_show = Util.reducerDate(payload.ctime_ms);
                                }
                            } else {
                                msg.time_show = Util.reducerDate(payload.ctime_ms);
                            }
                            flag2 = true;
                            msgs.push(msg);
                            break;
                        }
                    }
                    if (!flag2) {
                        msg.time_show = Util.reducerDate(payload.ctime_ms);
                        state.messageList.push({
                            key: payload.gid,
                            msgs: [
                                msg
                            ],
                            type: 4
                        });
                    }
                    break;
                }
            }
        }
    }
}
// 更新会话的未读总数
function conversationUnreadNum(state: ChatStore) {
    let count = 0;
    for (let conversation of state.conversation) {
        if (!conversation.noDisturb && conversation.unreadNum) {
            count += conversation.unreadNum;
        }
    }
    state.conversationUnreadNum = count;
}
//  给入群邀请的邀请者和被邀请者添加备注名
function filterInvitationEventMeMoName(state: ChatStore, payload) {
    state = JSON.parse(JSON.stringify(state))
    payload = JSON.parse(JSON.stringify(payload))
    for (let friend of state.friendList) {
        if (payload.from_username === friend.username && payload.from_appkey === friend.appkey) {
            if (friend.memo_name) {
                payload.from_memo_name = friend.memo_name;
            }
            break;
        }
    }
    for (let user of payload.to_usernames) {
        for (let friend of state.friendList) {
            if (user.username === friend.username && user.appkey === friend.appkey) {
                if (friend.memo_name) {
                    user.memo_name = friend.memo_name;
                }
                break;
            }
        }
    }
}
