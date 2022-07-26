let ShopSchemas: any = {};
// 对应人人商城 ims_ewei_shop_goods表，待检查完善

  // ShopSchemas.ShopGoods = {
  //   className:"ShopGoods",
  //   desc:"商品,小店售卖货物信息",
  //   app:["shop"],
  //   fields:{
  //     is_on_sale:{
  //       type:"Boolean",
  //       name:"是否售卖"
  //     },
  //     hot_sell:{
  //       type:"Boolean",
  //       name:"热卖"
  //     },
  //     name:{
  //       type:"String",
  //       name:"名称"
  //     },
  //     goods_number:{
  //       type:"Number",
  //       name:"商品数量"
  //     },


  //   }
  // }
ShopSchemas.ShopInfo = {
  className: "ShopInfo",
  name: "商家信息",
  desc: "商家的一些基本信息。",
  apps: ["shop"],
  displayedOperators:["edit","delete"],
  displayedColumns:["name","logo"],
  fields: {
    name: {
      type: "String",
      name: "商家名称",
    },
    logo:{
      type:"String",
      name:"logo",
      "view":"edit-image"
    },
    swiperImg:{
      type:"Array",
      name:"首页轮播图",
      "view":"edit-image"
    },
    // 活动信息
    location: {
      type: "GeoPoint",
      view: "edit-location",
      desc: "活动举办或签到位置",
      name: "活动位置"
    },
  }
}

ShopSchemas.ShopOrder = {
  className: "ShopOrder",
  name: "订单信息",
  desc: "订单的一些基本信息。",
  apps: ["shop"],
  displayedOperators:["edit","delete"],
  displayedColumns:["order_no","name"],
  fields: {
    order_no:{
      type:"String",
      name:"订单号"
    },
    name: {
      type: "String",
      name: "商品名称",
    },
    address: {
      type: "Pointer",
      targetClass: "ShopAddress",
      targetType: "full_region",
      name:"收货人地址"
    }
  }
}

ShopSchemas.ShopAddress = {
  className: "ShopAddress",
  name: "收货人地址",
  desc: "收货人的一些基本信息。",
  apps: ["shop"],
  displayedOperators:["edit","delete"],
  displayedColumns:["name","full_region"],
  fields: {
    name: {
      type: "String",
      name: "收货人名称",
    },
    full_region:{
      type:"String",
      name:"收货人地址",
    },
    mobile:{
      type:"String",
      name:"收货人手机号"
    }
  }
}

ShopSchemas.ShopGoods = {
  className: "ShopGoods",
  name: "商品",
  desc: "货物，商铺售卖货物信息。",
  apps: ["shop"],
  displayedOperators:["edit","delete"],
  displayedColumns:["name","index","tag","status","isRecom"],
  fields: {
    name: {
      type: "String",
      name: "名称",
    },
    subtitle: {
      type: "String",
      name: "副标题",
    },
    short: {
      type: "String",
      name: "短标题",
    },
    isRecom:{
      type:"Boolean",
      name:"是否推荐"
    },
    price: {
      type: "Number",
      name: "商品价格",
    },
    unit:{
      type:"String",
      name:"计量单位",
    },
    index: {
      type: "Number",
      name: "排序",
    },
    type: {
      type: "Array",
      name: "商品类型",
      view: "edit-select",
      options: ["实体商品", "虚拟商品", "虚拟物品(卡密)"],
    },
    tag: {
      "type": "Array",
      "name": "标签",
      "group": "normal",
    },
    cate: {
      type: "Pointer",
      targetClass: "Category",
      targetType: "goods",
      name: "所属分类",
    },
    property: {
      type: "Object",
      name: "商品属性",
      options: {
        isrecommand: "推荐",
        isnew: "新品",
        ishot: "热卖",
        issendfree: "包邮",
        isnodiscount: "不参与会员折扣",
      },
    },
   
    images: {
      type: "Array",
      name: "商品轮播图片",
      "view":"edit-image"
    },
    image:{
      type:"String",
      name:"商品首图",
      "view":"edit-image"
    },
    thumb_first: {
      type: "Boolean",
      name: "详情显示首图",
    },
    sales: {
      type: "Number",
      name: "已出售数",
    },
    // dispatchid: {
    //   type: "Pointer",
    //   targetClass: "ShopDispatch",
    //   name: "运费设置",
    // },
    area: {
      type: "String",
      name: "所在地",
    },
    cash: {
      type: "Boolean",
      name: "活动付款",
    },
    invoice: {
      type: "Boolean",
      name: "发票",
    },
    status: {
      type: "Boolean",
      name: "上架",
    },
    refund: {
      type: "Boolean",
      name: "是否支持退换货",
    },
    autoreceive: {
      type: "Number",
      name: "确认收货时间",
      help: "0读取系统设置 -1为不自动收货",
    },
    goodssn: {
      type: "String",
      name: "编码",
    },
    productsn: {
      type: "String",
      name: "条码",
    },
    weight: {
      type: "Number",
      name: "重量",
    },
    total: {
      type: "Number",
      name: "库存数",
    },
    totalcnf: {
      type: "String",
      name: "库存",
      view: "edit-select",
      options: [{label:"拍下减库存",value:"1"}, {label:"付款减库存",value:"2"}, {label:"永不减库存",value:"3"}],
    },
    parameter: {
      type: "String",
      name: "参数",
      subname: ["参数名称", "参数值"],
      view: "textarea",
    },
    details: {
      type: "String",
      name: "商品详情",
      "view": "editor-tinymce",
    },
    singlemaxpurchase: {
      type: "String",
      name: "单次最多购买",
    },
    singleminpurchase: {
      type: "String",
      name: "单次最少购买",
    },
    maxpurchase: {
      type: "String",
      name: "最多购买",
    },
    viplookacl: {
      type: "Array",
      name: "会员等级浏览权限",
      view: "edit-select",
      options: ["等级一", "等级二", "等级三"],
    },
    vippurchaseacl: {
      type: "Array",
      name: "会员等级购买权限",
      "targetClass": "UserLevel",
      "view":"pointer-array",
    },
    vipslookacl: {
      type: "Array",
      name: "会员组浏览权限",
      "targetClass": "UserGroup",
      "view":"pointer-array",
    },
    vipspurchaseacl: {
      type: "Array",
      name: "会员组购买权限",
      "targetClass": "UserGroup",
      "view":"pointer-array",
    },
    marketway: {
      type: "String",
      name: "促销方式",
    },
    returnsett: {
      type: "String",
      name: "满返设置",
    },
    Deductible: {
      type: "String",
      name: "抵扣设置",
    },
    packetcondition: {
      type: "String",
      name: "包邮条件",
    },
    vipdiscount: {
      type: "String",
      name: "会员折扣",
    },
    vipprice: {
      type: "String",
      name: "会员价",
    },
    ordernotice: {
      type: "String",
      name: "下单通知",
    },
    offlineverificatio: {
      type: "String",
      name: "线下核销",
    },
    storelogo: {
      type: "Object",
      name: "店铺LOGO",
      "view": "image",

    },
    storename: {
      type: "String",
      name: "店铺名称",
    },
    storedescribe: {
      type: "String",
      name: "店铺描述",
    },
    repeatpurchasediscount: {
      type: "Number",
      name: "重复购买折扣",
    },
    iscontinueuse: {
      type: "Boolean",
      name: "是否持续使用",
    },
    usecondition: {
      type: "String",
      name: "使用条件",
    },
    isusediscount: {
      type: "Boolean",
      name: "是否使用优惠",
    },
  },
};

export { ShopSchemas };
