let AppSchemas: Schemas = {}
AppSchemas.App = {
  className: "App",
  name:"应用",
  desc: "应用",
  apps: ['app'],
  displayedOperators:["edit","delete"],
  managerOperators:["edit"],
  displayedColumns:["appid","name","type","platform","version"],
  fields: {
    // 基础信息
    appid: {
        type: "String",
        name: "App ID（唯一）",
        required:true
    },
    name: {
      type: "String",
      name: "名称",
      required:true
    },
    icon: {
      view:"edit-image",
      type: "String",
      name: "LOGO图标",
      desc:"建议大小200 x 200px"
    },
    cover: {
        type: "Array",
        name: "预览封面",
        view: "edit-image",
        desc:"建议大小800 x 450px"
      },
    type: {
        "type": "String",
        "name": "类型",
        "view": "edit-select",
        "options": [
            {label:"应用",value:"app", desc:"已发布上线的应用"},
            {label:"模块",value:"module", desc:"具有完整功能的模块"},
            {label:"插件",value:"plugin", desc:"封装好的功能插件"}
        ],
        required:true,
    },
    platform:{
        type: "Array",
        name: "支持平台",
        "options": [
            {label:"微信小程序",value:"wxapp"},
            {label:"微信公众号",value:"wxh5"},
            {label:"网页应用",value:"pwa"},
            {label:"苹果应用",value:"ios"},
            {label:"安卓应用",value:"android"},
        ],
    },
    version: {
        type: "String",
        name: "版本",
    },
    desc: {
        type: "String",
        name: "描述",
    },
    category: {
      type: "Pointer",
      targetClass: "Category",
      targetType: "app",
      name: "所属分类",
    },
    // 志愿服务条例
    content: {
      "type": "String",
      "view": "editor-tinymce",
      "col": 24,
      "name": "详情介绍",
    },
    // 管理审核
    isEnabled: {
      type: "Boolean",
      name: "是否开启",
      default:false
    },
    apkUrl: {
        type: "String",
        name: "安卓APK地址",
    },
    itunesUrl: {
        type: "String",
        name: "苹果商店地址",
    },
    index: {
      type: "Number",
      name: "排序", //高位在前
      default: 0
    },
    splashOptions:{
        type: "Array",
        name: "启动页面",
        view: "edit-image",
        desc:"建议大小720 x 1280px"
    },
    tabOptions:{
        type: "Object",
        name: "导航按钮",
    },
    enabledOptions:{
        type: "Object",
        name: "功能开关",
    }
  }
}

export {AppSchemas}
