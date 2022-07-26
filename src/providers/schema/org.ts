let OrgSchemas: Schemas = {}
OrgSchemas.Enterprise = {
  className: "Enterprise",
  apps: ['org'],
  name:"企业",
  displayedOperators:["edit","delete"],
  displayedColumns:["name","desc","mobile","industry"],
  desc: "入驻企业，入驻企业填写基本信息。",
  fields: {
    avatar: {
      type: "Array",
      name: "企业LOGO",
      view: "edit-image",
    },
    name: {
      type: "String",
      name: "企业名称",
      required: true
    },
    desc: {
      type: "String",
      name: "企业描述",
      view: "textarea"
    },
    category: {
      type: "Pointer",
      targetClass: "Category",
      targetType: "enterprise",
      name: "企业类型",
    },
    tel: {
      type: "String",
      name: "座机电话"
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
    industry: {
      type: "String",
      name: "所属行业",
      view: "anas-edit-radio",
      options: ['不选择', '服务', '金融', '电信', '教育', '高科技', '政府', '制造', '能源', '媒体', '娱乐', '咨询', '非盈利事业', '公共事业']
    },
    size: {
      type: "String",
      name: "人员规模",
      view: "anas-edit-radio",
      options: ['<10人', '10-20人', '20-50人', '50-100人', '100-500人', '500人以上']
    },
    tag: {
      type: "Array",
      name: "标签",
      view: "anas-edit-tag"
    },
    attachment: {
      type: "Object",
      name: "附件",
      view: "anas-uploader"
    }
  }
}

export {OrgSchemas}
