let CommonSchemas: Schemas = {}
CommonSchemas.Company = {
  className: "Company",
  name:"公司账套",
  desc: "管理SaaS版，多公司账套账户",
  apps: ['common'],
  managerOperators:["edit","add","delete"],
  displayedOperators:["edit","delete"],
  displayedColumns:["name","modules"],
  fields: {
    name:{
      type: "String",
      name: "账套名称",
    },
    title:{
      type: "String",
      name: "系统名称",
    },
    rootPage:{
      type: "String",
      name: "默认首页",
    },
    uniacid:{
      type: "String",
      name: "微服务UNIACID",
    },
    modules: {
      type: "Array",
      name:"授权模块"
    },
    website:{
      type: "String",
      name: "官方网站",
    },
    superadmin: {
      type: "Array",
      targetClass: "User",
      view:"pointer-array",
      name: "超级管理员",
    },
    // superadmin:{
    //   name: "超级管理员",
    //   type: "Pointer",
    //   targetClass: "_User",
    // },
    users: {
      name: "其他管理员",
      type: "Array",
      view:"pointer-array",
      className: "User"
    },
    config:{
      view: "textarea",
      type: "Object",
      name: "参数配置",
    }
  }
}

CommonSchemas.Department = {
  //其中departid/manager/parentid为钉钉企业组织特有字段
  className: "Department",
  desc: "组织架构，公司各类组织部门。",
  name: "组织",
  displayedOperators:["edit","delete"],
  displayedColumns:["num","name","shortname"],
  apps: ['common'],
  fields: {
    type: {
      type: "String",
      name: "组织类型",
      default:"depart",
      view:"just-show"
    },
    num: {
      type: "String",
      name: "编号"
    },
    name: {
      type: "String",
      name: "名称"
    },
    shortname: {
      type: "String",
      name: "简称"
    },
    leader: {
      type: "Pointer",
      targetClass: "Profile",
      name: "部门领导"
    },
    peopleAll: {
      type: "Number",
      name: "部门人数"
    },
    parent: {
      type: "Pointer",
      targetClass: "Department",
      name: "上级组织"
    },
    "related": {
      "type": "Array",
      "targetClass": "Department",
      "view":"pointer-array",
      "name": "相关部门",
    },
    company: {
      type: "Pointer",
      targetClass: "Company",
      name: "所属公司"
    },
    "content": {
      "type": "String",
      "view": "editor-tinymce",
      "col": 24,
      "name": "部门详情",
    },
  }
}

CommonSchemas.DepartHistory = {
  className: "DepartHistory",
  desc: "该员工的工作经验、教育履历、社会组织等等记录",
  name: "经验履历",
  displayedOperators:["edit","delete"],
  displayedColumns:["num","name","shortname"],
  apps: ["organization"],
  fields: {
    type: {
      type: "String",
      name: "履历类型",
      "view": "edit-select",
      default:"work",
      "options": [{label:"工作经验",value:"work"},{label:"教育经历",value:"edu"},{label:"社会组织",value:"org"}],
    },
    user: {
      type: "Pointer",
      targetClass: "_User",
      name: "当前用户"
    },
    depart: {
      type: "Pointer",
      targetClass: "Department",
      name: "所在组织"
    },
    title: {
      type: "String",
      name: "头衔"
    },
    startDate: {
      type: "Date",
      name: "开始时间",
      view: "datetime"
    },
    endDate: {
      type: "Date",
      name: "结束时间",
      view: "datetime"
    },
    remark: {
      type: "String",
      name: "说明",
      view: "textarea"
    }
    // company: {
    //   type: "Pointer",
    //   targetClass: "Company",
    //   name: "所属公司"
    // }
  }
}

CommonSchemas.Profile = {
  className: "Profile",
  name: "档案",
  displayedOperators:["edit","delete"],
  displayedColumns:["name","mobile","position"],
  desc: "档案，员工简历及档案信息。",
  apps: ['hr'],
  fields: {
    state: {
      type: "String",
      name: "在职状态",
      view: "edit-select",
      options: ["在岗", "待岗", "离职","退聘","劳务派遣","借用","其他"]
    },
    workid: {
      type: "String",
      name: "员工编号"
    },
    name: {
      type: "String",
      name: "姓名"
    },
    idcard: {
      type: "String",
      name: "身份证"
    },
    tag: {
      type: "Array",
      name: "标签",
    },
    user: {
      type: "Pointer",
      targetClass: "_User",
      name: "所属用户",
      show: false
    },
    company: {
      type: "Pointer",
      targetClass: "Company",
      name: "所属公司",
    },
    department: {
      type: "Pointer",
      targetClass: "Department",
      name: "所属部门",
    },
    position: {
      type: "String",
      name: "岗位名称",
    },
    positionPart: {
      type: "String",
      name: "兼岗",
    },
    mobile: {
      type: "String",
      name: "手机",
    },
    tel: {
      type: "String",
      name: "电话",
    },
    email: {
      type: "String",
      name: "邮箱",
    },
    address: {
      type: "String",
      name: "详细住址",
    },
    nation: {
      type: "String",
      name: "民族",
    },
    cardtype: {
      type: "String",
      name: "证件类型",
      view: "edit-select",
      options: ["身份证", "因私护照", "因公护照", "香港永久性居民身份证", "澳门永久性居民身份证", "港澳来往内地通行证", "台湾来往内地通行证", "外国人永久居留证", "其他证件"]
    },
    cardnum: {
      type: "String",
      name: "证件号码",
    },
    education: {
      type: "String",
      name: "学历",
      view: "edit-select",
      options: ["不限","初中","高中", "本科", "硕士","博士","中专","大专","专科"]
    },
    eduType: {
      type: "String",
      name: "学历类型",
    },
    school: {
      type: "String",
      name: "毕业院校",
    },
    schoolMajor: {
      type: "String",
      name: "主专业",
    },
    marriage: {
      type: "String",
      name: "婚姻状态",
      view: "edit-select",
      options: ["未婚", "已婚", "离婚"]
    },
    sex: {
      type: "String",
      name: "性别",
      view: "edit-select",
      options: ["男", "女","不限"]
    },
    polity: {
      type: "String",
      name: "政治面貌",
    },
    // workDate: {
    //   type: "Date",
    //   name: "参加工作日期",
    //   view: "datetime"
    // },
    title: {
      type: "String",
      name: "职称",
    },
    roleName: {
      type: "String",
      name: "人员类型",
    },
    entryDate: {
      type: "Date",
      name: "入职日期",
      view: "datetime"
    },
    workingAge: {
      type: "Number",
      name: "司龄/工龄",
    },
    groupLeaderName: {
      type: "String",
      name: "考评小组",
    },
    attachment: {
      type: "Array",
      name: "附件",
      view: "anas-uploader"
    }
  }
}

CommonSchemas.Class = {
  //其中departid/manager/parentid为钉钉企业组织特有字段
  className: "Department",
  name: "班级",
  displayedOperators:["edit","delete"],
  displayedColumns:["name","parent","address"],
  desc: "班级，系统中各类组织。depart为企业内部组织，school为学校，class为班级。",
  apps: ['class'],
  fields: {
    type: {
      type: "String",
      name: "类型",
      default: "class",
      show: false
    },
    parent: {
      type: "Pointer",
      targetClass: "Department",
      name: "学校"
    },
    name: {
      type: "String",
      name: "班级"
    },
    book: {
      type: "Pointer",
      targetClass: "ArticleBook",
      name: "课程"
    },
    schedule: {
      type: "Array",
      name: "授课时间"
    },
    address: {
      type: "String",
      name: "授课地点"
    }
  }
}
// CommonSchemas.Timeline = {
//   className: "Timeline",
//   desc: "动态，用户操作及重要事件的动态记录。",
//   apps: ['common'],
//   fields: {
//     content_type: 12,
//     data_content_type: 39,
//     namespace: {
//       type: "String",
//       name: "相关域"
//       // "customer:6LaAMXS9"
//       // "profile:IzSxcSAA"
//     },
//     eventType: {
//       type: "String",
//       name: "事件类型"
//       // "hr.state.change"
//       // "crm.event.add"
//     },
//     assignedTo: {
//       type: "Pointer",
//       targetClass: "Profile",
//       name: "指派员工"
//     },
//     profile: {
//       type: "Pointer",
//       targetClass: "Profile",
//       name: "员工"
//     },
//     customer: {
//       type: "Pointer",
//       targetClass: "Customer",
//       name: "客户"
//     },
//     comment: {
//       type: "String",
//       name: "注释"
//     },
//     comment_html: {
//       type: "String",
//       name: "注释页面"
//     }
//   }
// }

CommonSchemas.DepartCert = {
  //其中departid/manager/parentid为钉钉企业组织特有字段
  className: "DepartCert",
  desc: "建筑项目人员挂证信息表。",
  name: "挂证关系",
  displayedOperators:["edit","delete"],
  displayedColumns:["departName","certName","name"],
  apps: ['common'],
  fields: {
    departName: {
      type: "String",
      name: "项目名称"
    },
    certName: {
      type: "String",
      name: "证件名称"
    },
    name: {
      type: "String",
      name: "挂证人员"
    },
    depart:{
      type: "Pointer",
      targetClass: "Department",
      name: "项目部门",
      show:false
    }
  }
}

CommonSchemas.DepartBuild = {
  //其中departid/manager/parentid为钉钉企业组织特有字段
  className: "DepartBuild",
  desc: "部门关联建筑项目信息，建筑项目详情记录。",
  name: "建筑项目",
  displayedOperators:["edit","delete"],
  displayedColumns:["departName","usage","buildArea","isStart"],
  apps: ['common'],
  fields: {
    unitName: {
      type: "String",
      name: "建设单位"
    },
    departName: {
      type: "String",
      name: "项目名称"
    },
    depart:{
      type: "Pointer",
      targetClass: "Department",
      name: "项目部门",
    },
    isStart: {
      type: "Boolean",
      name: "是否立项"
    },
    usage: {
      type: "String",
      name: "建筑用途"
    },
    workName: {
      type: "String",
      name: "施工单位"
    },
    workType: {
      type: "String",
      name: "发包方式"
    },
    buildArea: {
      type: "Number",
      name: "建筑面积"
    },
    buildUnit: {
      type: "Number",
      name: "单位工程"
    },
    buildSquarePre: {
      type: "Number",
      name: "预制装配式方量"
    },
    buildSquarePC: {
      type: "Number",
      name: "PC结构方料"
    },
    buildWeight: {
      type: "Number",
      name: "钢结构吨位"
    },
    buildLevel: {
      type: "String",
      name: "结构层数"
    },
    buildHeight: {
      type: "Number",
      name: "建筑高度"
    },
    buildDeep: {
      type: "Number",
      name: "基础埋深"
    },
    buildLength: {
      type: "Number",
      name: "区间长度"
    },
    buildQuality: {
      type: "String",
      name: "质量目标"
    },
    buildSafety: {
      type: "String",
      name: "安全文明"
    },
    realFromTo: {
      type: "Object",
      view: "date-from-to",
      name: "实际开竣工日期",
    },
    contFromTo: {
      type: "Object",
      view: "date-from-to",
      name: "合同开竣工日期",
    },
    delayReason: {
      type: "String",
      name: "延后原因",
      desc: "如与合同日期有延后的",
    },
    importantPlan: {
      type: "String",
      name: "重大节点计划",
    },
    importantIssue: {
      type: "String",
      name: "目前存在主要问题",
    },
    progressNow: {
      type: "String",
      name: "当前季度进度",
    },
    progressNext: {
      type: "String",
      name: "下一季度进度",
    },
    progressAndNext: {
      type: "String",
      name: "下下季度进度",
    },
    priceTotal: {
      type: "Number",
      name: "合同造价",
    },
    priceReport: {
      type: "Number",
      name: "已报施工产值",
    },
    priceReportSum: {
      type: "Number",
      name: "已报总产值",
    },
    pricePlan: {
      type: "Number",
      name: "20年可报施工产值",
    },
    pricePlanSum: {
      type: "Number",
      name: "20年可报总产值",
    },
    priceAnnual: {
      type: "Number",
      name: "跨年度施工产值",
    }   
  }
}

export {CommonSchemas}
