let PipixiaSchemas: Schemas = {}
PipixiaSchemas.ppx_merch = {
  className: "ppx_merch",
  name: "商家",
  desc: "皮皮虾入住商家信息表",
  apps: ['pipixia'],
  displayedOperators: ["edit", 'delete'],
  managerOperators: ["edit", "delete"],
  displayedColumns: ["title", "category", "address", "location", "shopimgone", "shopimgtwo", "shopimgthree", "phonemun", "payed", "uid"],
  fields: {
    title: {
      type: "String",
      name: "商家名称"
    },
    category: {
      "type": "Pointer",
      "targetClass": "Category",
      "targetType": "merch",
      "name": "商家分类",
    },
    address: {
      type: "String",
      name: "详细地址",
      // show:false,
    },
    location: {
      type: "GeoPoint",
      name: "店铺位置",
      view: "edit-location"
    },
    shopimgone: {
      type: "String",
      name: "店铺环境1",
      // view: "edit-image",
    },
    shopimgtwo: {
      type: "String",
      name: "店铺环境2",
    },
    shopimgthree: {
      type: "String",
      name: "店铺环境3",
    },
    phonemun: {
      type: "String",
      name: "商家电话"
    },
    uid: {
      type: "String",
      name: "用户id",
      // show:false
    },
    payed: {
      type: 'Boolean',
      name: "是否支付"
    },
    isVerified: {
      type: "Boolean",
      name: "审核状态"
    },
  }
}

PipixiaSchemas.ppx_coupon = {
  className: "ppx_coupon",
  name: "优惠卷",
  desc: "皮皮虾商家优惠卷信息表",
  apps: ['pipixia'],
  displayedOperators: ["edit", 'delete'],
  managerOperators: ["edit", "delete"],
  displayedColumns: ["title", "startusing", "endusing", "typename", "priceone", "pricetwo", "publishnum", "mid", "status"],
  fields: {
    title: {
      type: "String",
      name: "优惠卷名称"
    },
    startusing: {
      type: "Date",
      name: "有效期开始时间"
    },
    endusing: {
      type: "Date",
      name: "有效期结束时间"
    },
    typename: {
      "type": "Pointer",
      "targetClass": "Category",
      "targetType": "coupon",
      "name": "优惠卷分类",
    },
    priceone: {
      type: "Number",
      name: "价格参数1",
      // show:false,
    },
    pricetwo: {
      type: "Number",
      name: "价格参数2",
    },
    publishnum: {
      type: "Number",
      name: "发布数量",
    },
    mid: {
      "type": "Pointer",
      "targetClass": "ppx_merch",
      "name": "商家",
      // show:false
    },
    status: {
      type: "String",
      name: "状态(0:未领完/1:已领完)",
    },
  }
}

PipixiaSchemas.ppx_couponUser = {
  className: "ppx_couponUser",
  name: "用户领卷表",
  desc: "皮皮虾用户优惠卷对照表",
  apps: ['pipixia'],
  displayedOperators: ["edit", 'delete'],
  managerOperators: ["edit", "delete"],
  displayedColumns: ["uid", "cid", "status"],
  fields: {
    uid: {
      type: "String",
      name: "用户"
    },
    cid: {
      "type": "Pointer",
      "targetClass": "ppx_coupon",
      "name": "优惠卷",
      // show:false
    },
    status: {
      type: "Number",
      name: "状态(0:已领取/1已核销)"
    },

  }
}

PipixiaSchemas.ppx_couponClert = {
  className: "ppx_couponClert",
  name: "核销员关系表",
  desc: "商家核销员关系对照表表",
  apps: ['pipixia'],
  displayedOperators: ["edit", 'delete'],
  managerOperators: ["edit", "delete"],
  displayedColumns: ["uid", "mid"],
  fields: {
    uid: {
      type: "String",
      name: "核销员"
    },
    mid: {
      "type": "Pointer",
      "targetClass": "ppx_merch",
      "name": "商家",
    },

  }
}

PipixiaSchemas.ppx_propaganda = {
  className: "ppx_propaganda",
  name: "宣传表",
  desc: "商家宣传管理表",
  apps: ['pipixia'],
  displayedOperators: ["edit", 'delete'],
  managerOperators: ["edit", "delete"],
  displayedColumns: ["propagandaImg", "mid", "view", "ifopen", "orders"],
  fields: {
    propagandaImg: {
      type: "String",
      name: "宣传图片"
    },
    mid: {
      "type": "Pointer",
      "targetClass": "ppx_merch",
      "name": "商家",
    },
    view: {
      "type": "Number",
      "name": "浏览量"
    },
    ifopen: {
      "type": "Boolean",
      "name": "是否使用"
    },
    orders: {
      "type": "Number",
      "name": "顺序"
    }
  }
}



PipixiaSchemas.ppx_merchpay = {
  className: "ppx_merchpay",
  name: "商家注册",
  desc: "设置商家注册金额",
  apps: ['pipixia'],
  displayedOperators: ["edit", 'delete'],
  managerOperators: ["edit","add","delete"],
  displayedColumns: ["price", "ifopen"],
  fields: {
    price: {
      type: "Number",
      name: "商家入驻费用"
    },
    ifopen: {
      "type": "Boolean",
      "name": "是否使用"
    }
  }
}

PipixiaSchemas.ppx_merchorder = {
  className: "ppx_merchorder",
  name: "商家注册订单",
  desc: "商家注册订单管理",
  apps: ['pipixia'],
  displayedOperators: ["edit", 'delete'],
  managerOperators: ["edit", "delete"],
  displayedColumns: ["name", "price", "orderid", "createdAt"],
  fields: {
    price: {
      type: "Number",
      name: "商家入驻费用"
    },
    name: {
      "type": "String",
      "name": "商家名称",
    },
    orderid: {
      "type": "String",
      "name": "订单号",
    },
    createdAt: {
      "type": "Date",
      "name": "创建时间"
    }

  }
}

export { PipixiaSchemas }
