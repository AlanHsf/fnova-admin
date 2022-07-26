// 消息系统设计与实现「上篇」http://www.jianshu.com/p/f4d7827821f1
// 消息系统设计与实现「下篇」http://www.jianshu.com/p/6bf8166b291c
/* 提醒语言分析
someone = 提醒的触发者，或者发送者，标记为sender
do something = 提醒的动作，评论、喜欢、关注都属于一个动作，标记为action
something = 提醒的动作作用对象，这就具体到是哪一篇文章，标记为target
someone's = 提醒的动作作用对象的所有者，标记为targetOwner
*/
/* 消息的两种获取方式 Pull/Push
通告和提醒，适合使用拉取的方式，消息产生之后，会存在消息表中，用户在某一特定的时间根据自己关注问题的表进行消息的拉取，然后添加到自己的消息队列中，
信息，适合使用推的方式，在发送者建立一条信息之后，同时指定接收者，把消息添加到接收者的消息队列中。
*/
let MessageSchemas: any = {}
MessageSchemas.Notify = {
  /*
  比如消息：「小明喜欢了文章」
  则：

  target = 123,  // 文章ID
  targetType = 'article',  // 指明target所属类型是文章
  sender = 123456  // 小明ID
  action = 'like'
  */
  "className": "Notify",
  "desc": "通知，包括三种类型：通告Announce<保留30天> 提醒Remind<保留30天> 信息Message<暂为永久>。",
  "apps": ['message'],
  "fields": {
    "type": {
      "type": "String",
      "name": "消息类型",
      "default": "remind" //公告announce 提醒remind 私信message
    },
    "content": {
      "type": "String",
      "name": "消息内容",
    },
    "target": {
      "type": "String",
      "name": "目标的ID"
    },
    "targetType": {
      "type": "String",
      "name": "目标类型",
    },
    "action": {
      "type": "String",
      "name": "提醒信息的动作类型",
    },
    "sender": {
      "type": "Pointer",
      "targetClass": "_User",
      "name": "发送者的ID",
    }
  }
}

MessageSchemas.UserNotify = {
  /*
  UserNotify的创建，主要通过两个途径：
  1. 遍历订阅(Subscription)表拉取公告(Announce)和提醒(Remind)的时候创建
  2. 新建信息(Message)之后，立刻创建。
  */
  "className": "UserNotify",
  "desc": "用户通知关联，存储用户的消息队列，它关联一则提醒(Notify)的具体内容。",
  "apps": ['message'],
  "fields": {
    "isRead": {
      "type": "Boolean",
      "name": "是否阅读",
      "default": "remind" //公告announce 提醒remind 私信message
    },
    "user": {
      "type": "Pointer",
      "targetClass": "_User",
      "name": "用户消息所属者",
    },
    "notify": {
      "type": "Pointer",
      "targetClass": "Notify",
      "name": "关联的Notify",
    }
  }
}

MessageSchemas.Subcription = {
  /*
  如：「小明关注了产品A的评论」，数据表现为：
  target: 123,  // 产品A的ID
  targetType: 'product',
  action: 'comment',
  user: 123  // 小明的ID
  这样，产品A下产生的每一条评论，都会产生通知给小明了。
  */
  "className": "Subcription",
  "desc": "订阅，是从Notify表拉取消息到UserNotify的前提，用户首先订阅了某一个目标的某一个动作，在此之后产生这个目标的这个动作的消息，才会被通知到该用户。",
  "apps": ['message'],
  "fields": {
    "target": {
      "type": "String",
      "name": "目标的ID"
    },
    "targetType": {
      "type": "String",
      "name": "目标的类型",
    },
    "action": {
      "type": "String",
      "name": "提醒信息的动作类型",
    },
    "user": {
      "type": "Pointer",
      "targetClass": "_User",
      "name": "发送者的ID",
    }
  }
}

MessageSchemas.SubcriptionConfig = {
  "className": "SubcriptionConfig",
  "desc": "订阅设置，不同用户可能会有不一样的订阅习惯，在这个表中，用户可以统一针对某种动作进行是否订阅的设置。",
  "apps": ['message'],
  "fields": {
    "action": { // 全局默认使用 NotifyConfig中的defaultSubscriptionConfig
      "type": "Object",
      "name": "用户的设置"
    },
    "user": {
      "type": "Pointer",
      "targetClass": "_User",
      "name": "发送者的ID",
    }
  }
}

MessageSchemas.NotifyConfig = {
  /*
  在这套模型中，targetType、action是可以根据需求来扩展的，例如我们还可以增加多几个动作的提醒：like被喜欢、update被更新....诸如此类。
  */
  "className": "NotifyConfig",
  "desc": "消息设置，是从Notify表拉取消息到UserNotify的前提，用户首先订阅了某一个目标的某一个动作，在此之后产生这个目标的这个动作的消息，才会被通知到该用户。",
  "apps": ['message'],
  "fields": {
    "targetType": {
      "type": "Object",
      "name": "提醒关联的目标类型",
      "default": {
        PRODUCT: 'product',    // 产品
        POST: 'post'    // 文章
      }
    },
    "action": {
      "type": "Object",
      "name": "提醒关联的动作",
      "default": {
        COMMENT: 'comment',  // 评论
        LIKE: 'like',     // 喜欢
      }
    },
    "reasonAction": {
      "type": "Object",
      "name": "订阅原因对应订阅事件",
      "default": {
        'create_product': ['comment', 'like'],
        'like_product': ['comment'],
        'like_post': ['comment']
      }
    },
    "defaultSubscriptionConfig": {
      "type": "Object",
      "name": "默认订阅配置",
      "default": {
        'comment': true,    // 评论
        'like': true,    // 喜欢
      }
    }
  }
}

export {MessageSchemas}
