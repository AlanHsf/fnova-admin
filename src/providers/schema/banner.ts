let BannerSchemas: Schemas = {}
BannerSchemas.Banner = {
  className: "Banner",
  name:"首页轮播图",
  desc: "首页轮播图",
  apps: ['banner'],
  displayedOperators:["edit","delete"],
  displayedColumns:["image","desc","article","index","isEnabled"],
  fields: {
    image: {
      type: "String",
      name: "轮播图",
      // name: "轮播图(大小1400px*460px为最佳)",
      view: "edit-image",
    },
    desc: {
      type: "String",
      name: "描述"
    },
    article: {
      type: "Pointer",
      targetClass: "Article",
      targetType: "news",
      name: "链接文章",
    },
    url: {
      type: "String",
      name: "外部链接（选填）"
    },
    index: {
      type: "Number",
      name: "排序"
    },
    
    isEnabled: {
      type: "Boolean",
      name: "是否启用"
    },
    // title: {
    //   type: "String",
    //   name: "项目标题"
    // },
    // tag: {
    //   type: "Array",
    //   name: "项目标签"
    // },
    
    
   
  }
}


export {BannerSchemas}
