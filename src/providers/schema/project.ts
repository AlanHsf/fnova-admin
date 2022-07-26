let ProjectSchemas: Schemas = {}
ProjectSchemas.Project = {
  className: "Project",
  name:"项目",
  desc: "项目",
  detailTitle: "看板",
  detailPage: "/project/gantt",
  apps: ['project'],
  displayedOperators:["detail","edit","delete"],
  displayedColumns:["logo","title","tag","desc","projectManager","isStarted"],
  fields: {
    title: {
      type: "String",
      name: "项目标题"
    },
    defaultTab: {
      "type": "String",
      "name": "默认入口",
      "desc": "进入项目后，默认显示的功能入口",
      "color": "blue",
      "view": "edit-select",
      default:"kanban",
      "options": [{label:"看板",value:"kanban"},{label:"甘特图",value:"gantt"},{label:"文档（Wiki）",value:"wiki"}],
      required:true,
  },
    tag: {
      type: "Array",
      name: "项目标签"
    },
    desc: {
      type: "String",
      name: "项目描述"
    },
    price: {
      type: "Number",
      name: "项目金额"
    },
    received: {
      type: "Number",
      name: "已收金额"
    },
    uncollected: {
      type: "Number",
      name: "未收金额"
    },
    logo: {
      type: "String",
      name: "项目LOGO",
      view: "edit-image",
    },
    cover: {
      type: "Array",
      name: "项目封面",
      view: "edit-image",
      show:false
    },
    category: {
      type: "Pointer",
      targetClass: "Category",
      targetType: "project",
      name: "所属分类",
    },
    //客户委托相关信息
    customer:{
      type: "Pointer",
      targetClass: "Customer",
      name: "相关客户",
    },
    contact:{
      type: "Pointer",
      targetClass: "Contact",
      name: "相关联系人",
    },
    //项目相关日期
    isStarted: {
      type: "Boolean",
      name: "是否开始"
    },
    signedAt: {
      type: "Date",
      name: "签订日期",
    },
    startedAt: {
      type: "Date",
      name: "开工日期",
    },
    submitAt: {
      type: "Date",
      name: "交付日期",
    },
    expectAt: {
      type: "Date",
      name: "预计完成日期",
    },
    testAt: {
      type: "Date",
      name: "测试结束日期",
    },
     teamsize: {
      type: "Number",
      name: "项目组人数"
    },
    projectManager: {
      type: "Pointer",
      targetClass: "_User",
      name: "项目经理",
    },
    marketManager: {
      type: "Pointer",
      targetClass: "_User",
      name: "市场经理",
    },
   
  }
}

ProjectSchemas.ProjectTask = {
  className: "ProjectTask",
  name:"任务",
  desc: "任务",
  apps: ['project'],
  displayedOperators:["edit","delete"],
  displayedColumns:["title","tag","priority","deadline","assignee"],
  fields: {
    title: {
      type: "String",
      name: "任务标题"
    },
    tag: {
      type: "Array",
      name: "标签",
      view: "edit-tag",
    },
    priority: {
      type: "String",
      name: "优先级",
      view: "edit-select",
      "options": [{label:"较低",value:"lower",color:"green"},{label:"普通",value:"normal",color:"gray"},{label:"较高",value:"high",color:"orange"},{label:"最高",value:"highest",color:"red"}],
    },
    duration:{
      type: "Number",
      name: "预计耗时（H）"
    },
    deadline: {
      type: "Date",
      name: "截止时间"
    },
    assignee: {
      type: "Pointer",
      targetClass: "_User",
      name: "负责人",
    },
    stateList: {
      type: "String",
      name: "所属清单",
      show: false,
    },
    stateLane: {
      type: "String",
      name: "所属泳道",
      show: false,
    },
    desc: {
      "type": "String",
      "view": "editor-tinymce",
      "col": 24,
      "name": "任务详情",
    },
    startDate: {
      type: "Date",
      name: "开始日期（实际）"
    },
    endDate: {
      type: "Date",
      name: "结束日期（实际）"
    },
    relation:{
      type: "Pointer",
      targetClass: "ProjectTask",
      name: "关联任务",
    },
    category: {
      type: "Pointer",
      targetClass: "Category",
      targetType: "project-task",
      name: "任务类型",
    },
    index: {
      type: "Number",
      name: "排序",
    },
    owner: {
      type: "Pointer",
      targetClass: "_User",
      name: "创建人",
    },
    project: {
      type: "Pointer",
      targetClass: "Project",
      name: "所属项目",
    },
    parent: {
      type: "Pointer",
      targetClass: "ProjectTask",
      name: "上级任务",
    },
  }
}

ProjectSchemas.ProjectRequire = {
  className: "ProjectRequire",
  name:"需求",
  desc: "需求",
  apps: ['project'],
  displayedOperators:["edit","delete"],
  displayedColumns:["title","desc","project"],
  fields: {
    title: {
      type: "String",
      name: "需求名称"
    },
    project: {
      type: "Pointer",
      targetClass: "Project",
      name: "所属项目",
    },
    desc: {
      type: "String",
      name: "需求描述"
    },
    // price: {
    //   type: "Number",
    //   name: "需求报价"
    // },
    parent: {
      type: "Pointer",
      targetClass: "ProjectRequire",
      name: "上级需求",
    },
    // owner: {
    //   type: "Pointer",
    //   targetClass: "_User",
    //   name: "创建人",
    // },
    // assignee: {
    //   type: "Pointer",
    //   targetClass: "_User",
    //   name: "指派人",
    // }
  }
}
export {ProjectSchemas}
