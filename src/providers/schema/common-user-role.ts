let UserRoleSchemas: Schemas = {}
UserRoleSchemas.User = {
  className: "_User",
  name:"用户",
  desc: "平台用户信息",
  apps: ['common'],
  managerOperators:["edit","add","delete"],
  displayedOperators:["edit"],
  displayedColumns:["realname","nickname","mobile","sex","username"],
  fields: {
    realname: {
      type: "String",
      name: "姓名"
    },
    mobile: {
      type: "String",
      name: "手机"
    },
    username: {
      type: "String",
      name: "账号"
    },
    password: {
      type: "String",
      view: "edit-password",
      disabled:false,
      name: "密码"
    },
    nickname: {
        type: "String",
        name: "昵称"
    },
    sex: {
      type: "String",
      name: "性别"
    },
    roles:{
      type: "Array",
      targetClass: "_Role",
      view:"pointer-array",
      name:"系统角色",
      desc:"普通用户留空即可"
    }
  }
}

UserRoleSchemas._Role = {
  className: "_Role",
  name:"角色",
  desc: "平台角色信息",
  apps: ['common'],
  managerOperators:["edit","add","delete"],
  displayedOperators:["edit","delete"],
  displayedColumns:["title","modules"],
  fields: {
    title:{
      type: "String",
      name: "角色名称",
    },
    modules: {
      type: "Array",
      name:"授权模块"
    },
    users: {
      name: "授权用户",
      type: "Relation",
      className: "_User"
    },
    name: {
      type: "String",
      name: "角色编码",
      show:false,
      // disabled: true
    }
  }
}

UserRoleSchemas.UserCertify = {
  className: "UserCertify",
  name:"证书认证",
  desc: "平台用户证书认证",
  apps: ['common'],
  managerOperators:["edit","add","delete"],
  displayedOperators:["edit"],
  displayedColumns:["type","idType","title","idNum","isVerified"],
  fields: {
    type: {
      type: "String",
      "view": "edit-select",
      default:"position",
      "options": [{label:"岗位证书",value:"position"},{label:"职称证书",value:"title"},{label:"学历证书",value:"education"}],
      name: "证书类型"
    },
    idType: {
      type: "String",
      name: "类型名称"
    },
    idNum: {
      type: "String",
      name: "证书编号"
    },
    title: {
      type: "String",
      name: "证书名称"
    },
    startDate: {
      type: "Date",
      name: "开始时间"
    },
    endDate: {
      type: "Date",
      name: "结束时间"
    },
    attachment: {
      type: "Array",
      name: "相关照片",
      view: "edit-image",
    },
    isVerified: {
        type: "Boolean",
        name: "是否认证"
    }, 
    profile: {
      type: "Pointer",
      targetClass: "Profile",
      name: "认证员工",
    },
    user: {
      type: "Pointer",
      targetClass: "_User",
      name: "微信账号",
    },
  }
}

UserRoleSchemas.UserGroup = {
  className: "UserGroup",
  name:"用户分组",
  desc: "用户分组",
  apps: ['vip'],
  managerOperators:["edit","add","delete"],
  displayedOperators:["edit"],
  displayedColumns:["name"],
  fields: {
    name: {
      type: "String",
      name: "等级名称"
    },
  }
}

UserRoleSchemas.UserLevel = {
  className: "UserLevel",
  name:"会员等级",
  desc: "会员等级",
  apps: ['vip'],
  managerOperators:["edit","add","delete"],
  displayedOperators:["edit"],
  displayedColumns:["name"],
  fields: {
    name: {
      type: "String",
      name: "等级名称"
    },
  }
}

UserRoleSchemas.UserVip = {
  className: "UserVip",
  name:"会员权限",
  desc: "会员权限",
  apps: ['vip'],
  managerOperators:["edit","add","delete"],
  displayedOperators:["edit"],
  displayedColumns:["user","level"],
  fields: {
    level: {
      type: "Pointer",
      targetClass: "UserLevel",
      name: "会员等级",
    },
    user: {
      type: "Pointer",
      targetClass: "_User",
      name: "用户账号",
    },
  }
}

export {UserRoleSchemas}
