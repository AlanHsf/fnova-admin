let RoomSchemas: any = {}


RoomSchemas.Room = {
  "className": "Room",
  "desc": "社群，填写直播信息、课程信息等。",
  displayedColumns:["name","desc","tag","state","isEnabled"],
  qrUrl:"https://pwa.futurestack.cn/chat/session/${objectId};c=${company};roomid=${roomid}",
  displayedOperators:["qrcode","edit","delete"],
  "apps": ['site'],
  "fields": {
    "name": {
      "type": "String",
      "name": "社群名称",
    },
    "desc": {
      "type": "String",
      "name": "社群描述",
      "group": "normal",
    },
    "state":{
      "type": "Boolean",
      "name": "是否开启",
    },
    "content": {
      "type": "String",
      "view": "editor-tinymce",
      "col": 24,
      "name": "社群介绍",
    },
    "owner": {
      "type": "Pointer",
      "targetClass": "User",
      "name": "群主",
    },
    managers: {
      type: "Array",
      targetClass: "User",
      view:"pointer-array",
      name: "管理员",
    },
    "liveUrl": {
      "type": "String",
      desc:"来自直播平台的m3u8流地址",
      "name": "直播流地址",
    },
    "roomid": {
      "type": "String",
      desc:"来自极光IM的聊天室ID",
      "name": "群聊ID",
    },
    "lessonid": {
      "type": "String",
      desc:"来自未来课堂模块课程id",
      "name": "课程ID",
    },
    "category": {
      "type": "Pointer",
      "targetClass": "Category",
      targetType: "room",
      "name": "社群分类",
    },
    "tag": {
      "type": "Array",
      "name": "标签",
      "group": "normal",
    },
    "avatar": {
      "type": "String",
      "name": "社群头像",
      "view": "edit-image",
    },
    "cover": {
      "type": "String",
      "name": "社群封面",
      "view": "edit-image",
    },
    "isEnabled": {
      "type": "Boolean",
      "name": "启用",
      "group": "normal"
    }
  }
}

export {RoomSchemas}
