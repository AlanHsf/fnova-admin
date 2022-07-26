let ActivitySchemas: Schemas = {}
ActivitySchemas.Activity = {
  className: "Activity",
  name:"活动",
  desc: "活动",
  qrUrl:"https://pwa.futurestack.cn/activity/${objectId};c=${company};auth=no",
  include:["devices","manager"],
  apps: ['activity'],
  displayedOperators:["qrcode","edit","delete"],
  managerOperators:["edit"],
  displayedColumns:["title","cycle","desc","surveyRequired","isEnabled"],
  fields: {
    // 基础信息
    title: {
      type: "String",
      name: "标题",
      required:true
    },
    logo: {
      view:"edit-image",
      type: "String",
      name: "LOGO",
      desc:"建议大小200 x 200px"
    },
    cycle: {
      "type": "String",
      "name": "周期",
      "desc": "设置单次活动或循环活动",
      "color": "blue",
      "view": "edit-select",
      default:"exam",
      "options": [{label:"单次",value:"onetime"},{label:"每周",value:"weekly"}],
      required:true,
    },
    // 报名要求
    // peopleMax: {
    //   type: "Number",
    //   name: "人数限制"
    // },
    desc: {
      type: "String",
      name: "活动描述"
    },
    surveyRequired: {
      type: "Pointer",
      targetClass: "Survey",
      name: "必修课程",
    },
    // 时间段（单次）
    startDate:{
      type: "Date",
      name: "开始时间",
      view: "datetime",
      condition:{
        cycle:"onetime"
      }
    },
    checkDate:{
      type: "Date",
      name: "签到时间",
      view: "datetime",
      condition:{
        cycle:"onetime"
      }
    },
    checkDiff:{
      type: "Number",
      name: "签到区间",
      desc: "默认15分钟前后开放签到",
      condition:{
        cycle:"onetime"
      }
    },
    // 时间段（每周）
    signFromTo: {
      type: "Object",
      view: "date-from-to",
      name: "报名时段（每周）",
      condition:{
        cycle:"weekly"
      }
    },
    startFromTo: {
      type: "Object",
      view: "date-from-to",
      name: "开展时段（每周）", 
      condition:{
        cycle:"weekly"
      }
    },
    refreshDate:{
      type: "Date",
      name: "刷新报名时间（每周）",
      view: "datetime",
      condition:{
        cycle:"weekly"
      }
    },
    // 时间段（每周） 
    signDayArray:{
      type: "Array",
      name: "报名日期（每周）",
      condition:{
        cycle:"weekly"
      },
      options: [{label:"周一",value:"1"},{label:"周二",value:"2"},{label:"周三",value:"3"},{label:"周四",value:"4"},{label:"周五",value:"5"},{label:"周六",value:"6"},{label:"周日",value:"0"}]
    },
    // signDayTime:{
    //   type: "Object",
    //   view: "date-from-to",
    //   options: [],
    //   name: "报名时间（每周）",
    // },
    servicePeriodArray: {
      type: "Array",
      view: "period-from-to",
      name: "开展时段（每周）",
      condition:{
        cycle:"weekly"
      },
      "col": 24,
    },
    // 活动信息
    location: {
      type: "GeoPoint",
      view: "edit-location",
      desc: "活动举办或签到位置",
      name: "活动位置"
    },
    address:{
      type:"String",
      name:"详细地址",
      show:false
    },
    devices: {
      type: "Array",
      targetClass: "Device",
      view:"pointer-array",
      name: "签到点",
    },
    tag: {
      type: "Array",
      name: "标签"
    },
    color: {
      type: "String",
      name: "主题色",
    },
    cover: {
      type: "Array",
      name: "封面",
      view: "edit-image",
      desc:"建议大小800 x 450px"
    },
    category: {
      type: "Pointer",
      targetClass: "Category",
      targetType: "activity",
      name: "分类",
    },
    // 志愿服务条例
    rule: {
      "type": "String",
      "view": "editor-tinymce",
      "col": 24,
      "name": "志愿服务条例",
    },
    // 管理审核
    isEnabled: {
      type: "Boolean",
      name: "是否开启",
      default:false
    },
    // manager: {
    //   type: "Pointer",
    //   targetClass: "_User",
    //   name: "项目管理员",
    // },
    manager: {
      type: "Array",
      targetClass: "User",
      view:"pointer-array",
      name: "项目管理员",
    },
    page: {
      type: "String",
      name: "自定义介绍页", //高位在前
    },
    index: {
      type: "Number",
      name: "排序", //高位在前
      default: 0
    }
  }
}

ActivitySchemas.ActivityRegister = {
  className: "ActivityRegister",
  name:"参与记录",
  desc: "参与记录",
  apps: ['activity'],
  displayedOperators:["edit","delete"],
  displayedColumns:["activity","user","serviceTime","startDate","endDate","isComplete"],
  fields: {
    activity: {
      type: "Pointer",
      targetClass: "Activity",
      name: "报名活动",
    },
    user: {
      type: "Pointer",
      targetClass: "_User",
      name: "报名人",
    },
    startDate: {
      type: "Date",
      name: "服务时间"
    },
    endDate: {
      type: "Date",
      name: "结束时间"
    },
    we7uid:{
      type: "String",
      name: "系统UID",
      disabled: true
    },
    openid:{
      type: "String",
      name: "系统OPENID",
      disabled: true
    },
    serviceTime:{
      type: "Number",
      name: "服务时长（小时）"
    },
    isLeader:{
      type: "Boolean",
      name:"是否组长"
    },
    isComplete:{
      type: "Boolean",
      name:"是否完成"
    },
    isAbsent:{
      type: "Boolean",
      name:"是否缺席"
    },
    isChecked:{
      type: "Boolean",
      name:"是否签到"
    },
    checkedAt: {
      type: "Date",
      name: "签到时间"
    },
    checkedDevice: {
      type: "Pointer",
      targetClass: "Device",
      name: "签到设备",
    },
    isCheckOut:{
      type: "Boolean",
      name:"是否签退"
    },
    checkOutAt: {
      type: "Date",
      name: "签退时间"
    },
    checkOutDevice: {
      type: "Pointer",
      targetClass: "Device",
      name: "签退设备",
    },
    isDeleted:{
      type: "Boolean",
      name:"是否取消"
    },
    isAppend:{
      type: "Boolean",
      name:"是否补录"
    },
    whyAbsent:{
      type: "String",
      name:"缺席原因"
    }
  }
}

export {ActivitySchemas}
