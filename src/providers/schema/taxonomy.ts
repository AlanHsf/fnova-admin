// 分类相关对象
let TaxonomySchemas: Schemas = {}
TaxonomySchemas.Category = {
  className: "Category",
  name:"分类",
  desc: "各种资源分类",
  apps: ['cms','project'],
  displayedOperators:["edit","delete"],
  managerOperators: ["edit","add","delete"],
  displayedColumns:["name","parent","isHome","isNavigation"],
  fields: {
    name: {
      type: "String",
      name: "分类名称"
    },
    name_en: {
      type: "String",
      name: "分类英文名称"
    },
    desc: {
      type: "String",
      name: "分类描述"
    },
    type: {
      type: "String",
      name: "分类类型"
    },
    parent: {
      type: "Pointer",
      targetClass: "Category",
      name: "上级分类",
    },
    index: {
      type: "Number",
      name: "排序",
      default: 0
    },
    // 应用相关配置
    isHome: {
      type: "Boolean",
      name: "是否首页"
    },
    isNavigation: {
      type: "Boolean",
      name: "是否导航"
    }
  }
}
export {TaxonomySchemas}
