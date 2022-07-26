let SchemaSchemas: Schemas = {}
/*
SchemaSchemas._SCHEMA = {
  className: "_SCHEMA",
  uniqueIndex:{"className":1},
  name:"数据模式",
  desc: "数据库集合的结构与模式",
  apps: ['dev'],
  displayedOperators:["edit","delete"],
  displayedColumns:["name","className","desc","status"],
  fields: {
    className: {
      type: "String",
      name: "类名",
    },
    name: {
      type: "String",
      name: "中文名",
    },
    fields:{
      type:"Object",
      view:"schema-fileds",
      name:"字段"
    },
    status:{
      type: "Boolean",
      name: "状态",
      view:"schema-status"
    },
    uniqueIndex:{
      type:"Object",
      name:"唯一索引"
    },

    desc: {
      type: "String",
      name: "描述"
    },
    apps: {
      type: "Array",
      name: "相关应用",
    },
    include: {
      type: "Array",
      name: "包含字段",
    },
    displayedColumns: {
      type: "Array",
      name: "列表显示字段"
    },
    displayedOperators: {
      type: "Array",
      name: "列表显示操作"
    },
  }
}
*/

export {SchemaSchemas}
