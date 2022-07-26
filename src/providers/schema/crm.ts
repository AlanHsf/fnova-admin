let CrmSchemas: Schemas = {}
CrmSchemas.Customer = {
  className: "Customer",
  apps: ['crm'],
  name:"客户",
  displayedOperators:["edit","delete"],
  displayedColumns:["name","category","state","manager"],
  desc: "客户集合，企业客户填写企业名称。",
  fields: {
    avatar: {
      type: "String",
      name: "公司LOGO"
    },
    name: {
      type: "String",
      name: "客户名称",
      required: true
    },
    category: {
      type: "Pointer",
      targetClass: "Category",
      targetType: "customer",
      name: "客户类型",
    },
    tel: {
      type: "String",
      name: "电话"
    },
    mobile: {
      type: "String",
      name: "手机"
    },
    email: {
      type: "String",
      name: "邮箱"
    },
    website: {
      type: "String",
      name: "网址"
    },
    area: {
      type: "String",
      name: "地区"
    },
    address: {
      type: "String",
      name: "地址"
    },
    state: {
      type: "String",
      name: "跟进状态",
      view: "edit-radio",
      options: ['初访', '意向', '报价', '成交', '暂时搁置']
    },
    industry: {
      type: "String",
      name: "所属行业",
      view: "edit-radio",
      options: ['不选择', '服务', '金融', '电信', '教育', '高科技', '政府', '制造', '能源', '媒体', '娱乐', '咨询', '非盈利事业', '公共事业']
    },
    size: {
      type: "String",
      name: "人员规模",
      view: "edit-radio",
      options: ['<10人', '10-20人', '20-50人', '50-100人', '100-500人', '500人以上']
    },
    department: {
      type: "Pointer",
      targetClass: "Department",
      name: "所属部门"
    },
    manager: {
      type: "Pointer",
      targetClass: "Profile",
      name: "负责人",
    },
    collaborator: {
      type: "Array",
      name: "协作人"
    },
    inviter: {
      type: "Pointer",
      targetClass: "Contact",
      name: "介绍人",
      show: false
    },
    tag: {
      type: "Array",
      name: "标签",
      view: "edit-tag"
    },
    remark: {
      type: "String",
      name: "备注",
      view: "textarea"
    },
    attachment: {
      type: "Array",
      name: "附件",
      view: "edit-uploader"
    }
  }
}

CrmSchemas.Contact = {
  className: "Contact",
  desc: "联系人，客户公司的联系人信息。",
  apps: ['crm'],
  name:"联系人",
  displayedOperators:["edit","delete"],
  displayedColumns:["name","mobile","email","position"],
  fields: {
    name: {
      type: "String",
      name: "姓名",
      required: true
    },
    tel: {
      type: "String",
      name: "电话"
    },
    avatar: {
      type: "String",
      name: "头像"
    },
    customer: {
      type: "Pointer",
      targetClass: "Customer",
      name: "关联客户"
    },
    title: {
      type: "String",
      name: "称呼"
    },
    position: {
      type: "String",
      name: "职位"
    },
    email: {
      type: "String",
      name: "邮箱"
    },
    mobile: {
      type: "String",
      name: "手机"
    },
    address: {
      type: "String",
      name: "地址"
    },
    remark: {
      type: "String",
      name: "备注",
      view: "textarea"
    }
  }
}

CrmSchemas.Clue = {
  className: "Clue",
  desc: "线索，未关联客户的线索信息。",
  name:"线索",
  displayedOperators:["edit","delete"],
  displayedColumns:["title","name","mobile","state","nexttime","manager"],
  apps: ['crm'],
  fields: {
    title: {
      type: "String",
      name: "线索",
      required: true
    },
    name: {
      type: "String",
      name: "联系人"
    },
    tel: {
      type: "String",
      name: "电话"
    },
    mobile: {
      type: "String",
      name: "手机"
    },
    address: {
      type: "String",
      name: "地址"
    },
    state: {
      type: "String",
      name: "跟进状态",
      view: "edit-radio",
      options: ['初访', '意向', '报价', '成交', '暂时搁置']
    },
    nexttime: {
      type: "Date",
      name: "下次跟进时间",
      view: "datetime"
    },
    remark: {
      type: "String",
      name: "备注",
      view: "textarea"
    },
    manager: {
      type: "Pointer",
      targetClass: "Profile",
      name: "负责人",
    }
  }
}
CrmSchemas.Contract = {
  className: "Contract",
  desc: "合同，与客户签订的合同信息。",
  name:"合同",
  displayedOperators:["edit","delete"],
  displayedColumns:["title","opportunity","price","state","manager"],
  apps: ['crm'],
  fields: {
    title: {
      type: "String",
      name: "合同标题",
      required: true
    },
    opportunity: {
      type: "Pointer",
      targetClass: "Opportunity",
      name: "所属商机"
    },
    price: {
      type: "Number",
      name: "合同总金额"
    },
    startAt: {
      type: "Date",
      name: "合同开始日期",
      view: "datetime"
    },
    endAt: {
      type: "Date",
      name: "合同结束日期",
      view: "datetime"
    },
    state: {
      type: "String",
      name: "合同状态",
      view: "edit-radio",
      options: ['初访', '意向', '报价', '成交', '暂时搁置']
    },
    code: {
      type: "String",
      name: "合同编号"
    },
    // product: {
    //   type: "String",
    //   name: "关联产品",
    //   view: "edit-radio",
    //   options: ['门户建站', '微信定制', 'APP开发', '平台定制']
    // },
    customer: {
      type: "Pointer",
      targetClass: "Customer",
      name: "关联客户",
      view: "just-show"
    },
    remark: {
      type: "String",
      name: "备注",
      view: "textarea"
    },
    manager: {
      type: "Pointer",
      targetClass: "Profile",
      name: "负责人",
    }
  }
}
CrmSchemas.Opportunity = {
  className: "Opportunity",
  desc: "商机，关联客户的商机洽谈信息。",
  name:"商机",
  displayedOperators:["edit","delete"],
  displayedColumns:["title","price","signTime","state","manager"],
  apps: ['crm'],
  fields: {
    title: {
      type: "String",
      name: " 商机标题",
      required: true
    },
    customer: {
      type: "Pointer",
      targetClass: "Customer",
      name: "关联客户",
      view: "just-show"
    },
    price: {
      type: "Number",
      name: "预计销售金额"
    },
    signTime: {
      type: "Date",
      name: "预计签单日期",
      view: "datetime"
    },
    state: {
      type: "String",
      name: "销售状态/阶段",
      view: "edit-radio",
      options: ["初步接洽", "需求确定", "方案/报价", "谈判/合同", "赢单", "输单"]
    },
    product: {
      type: "Pointer",
      targetClass: "Product",
      name: "关联产品",
    },
    nexttime: {
      type: "Date",
      name: "下次跟进时间",
      view: "datetime"
    },
    remark: {
      type: "String",
      name: "备注",
      view: "textarea"
    },
    manager: {
      type: "Pointer",
      targetClass: "Profile",
      name: "负责人",
    },
    attachment: {
      type: "Array",
      name: "商机附件",
      view: "edit-uploader"
    }
  }
}
export {CrmSchemas}
