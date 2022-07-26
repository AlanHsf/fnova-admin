import { Injectable } from '@angular/core';
import * as Parse from "parse";
import { Md5 } from "ts-md5";

Parse.initialize("nova");
(Parse as any).serverURL = "https://server.fmode.cn/parse";
Parse.enableLocalDatastore();
declare let JMessage: any;
@Injectable({
    providedIn: 'root',
})
export class JIMService {
    JIMData: any = {
        convers: [],
        messages: {},
    };
    onlineMsgCount: any = {}
    events = {};
    isLoggedIn = false;
    appkey = 'ddb2388ff7af7e4a67451cc4'
    secret = '0fb1212b1b92e15df85089bc'
    JIM = new JMessage({
        // debug : true
    });
    redirectUrl: string;
    constructor() {
    }
    async initJMessage() {
        console.log(1111)
        let isInit = await this.checkInit()
        let isLogin = await this.checkLogin()
        if (isInit && isLogin) {
            // 登录成功后获取离线消息及对话信息
            await new Promise((resolve, reject) => {
                this.JIM.onSyncConversation(function (data) {
                    console.log(data)
                    data.forEach(chat => {
                        chat.msgs.forEach(msg => {
                            this.cacheMessage(msg)
                        })
                    })
                    resolve(true)
                });
            });
            return true
        } else {
            let ms = 5000;
            await new Promise(resolve => setTimeout(resolve, ms)); // 等待5秒
            console.log("JMessage 监听事件启动失败，5s重连一次");
            return await this.initJMessage();
        }
    }
    async checkInit() {
        console.log(this.JIM)
        if (this.JIM.isInit()) {
            return true
        }
        let isInit = await new Promise((resolve, reject) => {
            let appkey = this.appkey;
            let secret = this.secret;
            let random_str = "022cd9fd995849b58b3ef0e943421ed9";
            let timestamp = String(new Date().getTime())
            let signature = String(Md5.hashStr(`appkey=${appkey}&timestamp=${timestamp}&random_str=${random_str}&key=${secret}`))
            this.JIM.init({
                "appkey": appkey,
                "random_str": random_str,
                "signature": signature,
                "timestamp": timestamp,
                "flag": 1 //	是否启用消息记录漫游，默认 0 否，1 是
            }).onSuccess(function (data) {
                resolve(true)
            }).onFail(function (data) {
                reject(false)
            });
        })
        if (isInit) {
            this.JIM.onDisconnect(() => { // 断开自动重连
                console.log("onDisconnect reInit")
                this.checkInit(); // with checkInit && checkLogin
            })
            return true
        } else {
            let ms = 5000;
            await new Promise(resolve => setTimeout(resolve, ms)); // 等待5秒
            console.log("JMessage 连接初始化失败，5s重连一次");
            return await this.checkInit();
        }
    }

    async checkLogin() {
        if (this.JIM.isLogin()) {
            return true
        }
        let current = Parse.User.current()
        let isInit = await this.checkInit();

        if (isInit && current) { // JIM 初始化，且Parse登陆后，才可以登陆JMessage
            let username = current.id // 直接用_User的objectId
            let password = current.id
            let isLogin = await new Promise((resolve, reject) => {
                this.JIM.login({
                    'username': username,
                    'password': password
                }).onSuccess(function (data) {
                    console.log(data)
                    resolve(data)
                }).onFail(function (error) {
                    console.log(error)
                    if (error.code == 880103) { // 用户不存在
                        this.JIM.register({
                            'username': username,
                            'password': password
                        }).onSuccess(function (data) {
                            resolve(data)
                        }).onFail(function (data) {
                            reject(false)
                        });
                    } else {
                        reject(false)
                    }
                })
            })

            if (isLogin) {
                if (current) {
                    // 更新用户信息
                    let gender = 0
                    if (current.get("sex") == "男") gender = 1;
                    if (current.get("sex") == "女") gender = 2;
                    this.JIM.updateSelfInfo({
                        'nickname': current.get("nickname") ? current.get("nickname") : current.get("nickname"),
                        'gender': gender,
                        'region': current.get("province") + current.get("city"),
                        'extras': { 'avatar': current.get('avatar') }
                    }).onSuccess(function (data) {
                    }).onFail(function (data) {
                    });
                }
                // initJMessage()
                return true
            } else {
                await new Promise(resolve => setTimeout(resolve, 10)); // 等待5秒
                console.log("JMessage 登陆失败，5s重连一次");
                return await this.checkLogin();
            }
        }
    }

    async sendMessage(user, contant) {
        if (!this.JIM.isLogin()) {
            await this.checkLogin()
        }
        let that = this
        await this.JIM.sendSingleMsg({
            'target_username': user,
            'content': contant
        }).onSuccess(function (data) {
            console.log(data)
            // that.cacheMessage(data)
            // 发送成功，保存MessageLog
        }).onFail(function (data) {
            console.log(data)
        }).onTimeout(function (data) {
            console.log(data)
            if (data.response_timeout) {
            } else {
            }
        }).onAck(function (data) {
            console.log(data)
        });
    }


    async cacheMessage(msg) {
        msg.msg_level = msg.msg_level == 0 ? 'normal' : ""
        let MessageLog = Parse.Object.extend("MessageLog")
        let query = new Parse.Query(MessageLog);
        query.equalTo("msg_id", msg.msg_id)
        
        query.fromLocalDatastore();  // Remark：部分实际存储对象在 _default 外，因此用自带的本地查询query查重可能会有问题
        let exists = await query.first();
        if (!exists) {
            let messagelog = new MessageLog(msg)
            messagelog.set("msg_id", msg.msg_id)
            messagelog.set("company", {
                __type: "Pointer",
                className: "Company",
                objectId: localStorage.getItem('company')
            })
            if (messagelog.get("content")["target_type"] == "single") {
                console.log(messagelog)
                messagelog.save().then(onlinemsg => {
                    onlinemsg.pin()
                })
            } else {
                messagelog.pin();
            }
        }
    }


    //获取会话列表
    async jimGetConversations() {
        return new Promise((resolve, reject) => {
            if (this.JIM.isLogin()) {
                this.JIM.getConversation().onSuccess(async (data) => {
                    let conversP = []
                    var unread_msg_total = 0
                    if (data && data.conversations) {
                        data.conversations.forEach(item => {
                            conversP.push(new Promise((res) => {
                                if (item.type = 3) { // 个人会话，需补全用户信息
                                    let type = null;
                                    if (item.username.split("_").length < 2) {
                                        type = "username"
                                    }
                                    return this.getUserCache(item.username, null, type).then((userjson: any) => {
                                        if (userjson) {
                                            let nickname = String(userjson.nickname).replace(/\?/g, "")
                                            item.targetId = userjson.objectId;
                                            let unread_msg_count = this.onlineMsgCount[item.targetId] || 0;
                                            if (item.unread_msg_count) {
                                                unread_msg_count = item.unread_msg_count;
                                            }
                                            unread_msg_total += unread_msg_count;

                                            item.userinfo = userjson;
                                            item.type = "single";
                                            item.nickname = nickname;
                                            item.avatar = userjson.avatar;
                                            item.switch = 'off'
                                            item.timestring = this.getDateDiff(item.mtime);
                                            item.content = '最新消息：' + item.timestring;
                                            item.timestring = "咨询";
                                            item.unread_msg_count = unread_msg_count;
                                        }
                                        res(item)
                                    })
                                }
                            }))
                        })
                    }
                    let conversations = await Promise.all(conversP)
                    this.emit("onAllUnReadChange", { count: unread_msg_total })
                    this.JIMData.convers = conversations;
                    this.emit("getConversations", conversations);
                    resolve(true);

                })
            } else {
                reject(false)
            }
        })
    }


    async startMsgReceive() {
        console.log("=======startMsgReceive Event=======")
        let isInit = await this.checkInit();
        let isLogin = await this.checkLogin();

        if (isInit && isLogin) {
            return await this.jimOnMsgReceive()
        } else {
            let ms = 5000;
            await new Promise(resolve => setTimeout(resolve, ms)); // 等待5秒
            return await this.startMsgReceive()
        }
    }



    async jimOnMsgReceive() {
        let that = this
        return new Promise((resolve, reject) => {
            this.JIM.onMsgReceive(function (data) { // 仅监听，非回调，不需要等待执行
                console.log(data)
                let emitDdata = this.emit("onMsgReceive", data.messages)

                data.messages.forEach(msg => {
                    console.log(msg)
                    that.cacheMessage(msg) // 离线缓存所有浏览和发送过的消息
                    // Count 记录在线收到，未统计到未读消息的消息数
                    if (!this.onlineMsgCount[msg.from_username]) {
                        this.onlineMsgCount[msg.from_username] = 1
                    } else {
                        this.onlineMsgCount[msg.from_username] += 1
                    }
                })
                that.jimGetConversations();
            });
            resolve(true);
        });
    }


    // 
    async getUserCache(user_jid, userid, type) {
        return new Promise((res, rej) => {
            let objectId = user_jid;
            if (userid) { objectId = userid };
            let _User = Parse.Object.extend("_User")
            let queryL = new Parse.Query(_User);
            queryL.fromLocalDatastore();
            // 加载系统预置账号
            if (user_jid == "yipaopao") {
                objectId = "bYF0Kf2dor";
            }
            //
            let userjson: any = localStorage.getItem(`Parse_LDS__User_${objectId}`);
            if (userjson) {
                userjson = userjson[0]
                res(userjson)
            } else {
                queryL.get(objectId).then(exists => {

                    userjson = exists.toJSON()
                    res(userjson)
                }).catch(err => {
                    let query = new Parse.Query(_User);
                    query.equalTo("objectId", objectId)
                    query.first().then(onlineuser => {
                        if (onlineuser) {
                            onlineuser.pin();
                            userjson = onlineuser.toJSON()
                            res(userjson)
                        } else {
                            res(null)
                        }
                    })
                })
            }
        })
    }

    async jimOnSyncConversation() {
        let that = this
        this.JIM.onSyncConversation((data: any) => {
            that.emit("onMsgReceive", data.msgs)
            console.log(1111111111111, data)
            data[0].msgs.forEach(msg => {
                if (msg) {
                    that.cacheMessage(msg) // 离线缓存所有浏览和发送过的消息
                }
            })
            that.jimGetConversations();
        });
        return true
    }


    getDateDiff(dateTimeStamp) {
        // 时间字符串转时间戳
        let timestamp = new Date(dateTimeStamp).getTime();
        let minute = 1000 * 60;
        let hour = minute * 60;
        let day = hour * 24;
        let halfamonth = day * 15;
        let month = day * 30;
        let year = day * 365;
        let now = new Date().getTime();
        let diffValue = now - timestamp;
        let result;
        if (diffValue < 0) {
            return;
        }
        let yearC = (diffValue / year);
        let monthC = diffValue / month;
        let weekC = diffValue / (7 * day);
        let dayC = diffValue / day;
        let hourC = diffValue / hour;
        let minC = diffValue / minute;
        if (yearC >= 1) {
            result = "" + parseInt(String(yearC)) + "年前";
        } else if (monthC >= 1) {
            result = "" + parseInt(String(monthC)) + "月前";
        } else if (weekC >= 1) {
            result = "" + parseInt(String(weekC)) + "周前";
        } else if (dayC >= 1) {
            result = "" + parseInt(String(dayC)) + "天前";
        } else if (hourC >= 1) {
            result = "" + parseInt(String(hourC)) + "小时前";
        } else if (minC >= 1) {
            result = "" + parseInt(String(minC)) + "分钟前";
        } else
            result = "刚刚";
        return result;
    }

    emit(name, data) {
        var callbacks = this.events[name];
        if (Array.isArray(callbacks)) {
            callbacks.map((tuple) => {
                var self = tuple[0];
                var callback = tuple[1];
                if (callback && callback.call) {
                    callback.call(self, data);
                }
            })
        }
    }
}