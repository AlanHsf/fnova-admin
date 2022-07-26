let DevSchemaSchemas: Schemas = {}
DevSchemaSchemas.DevSchema = {
  className: "DevSchema",
  desc: "Schema开发管理数据集合",
  name: "Schema范式",
  displayedOperators: ["edit"],
  displayedColumns: ["schemaName", "name", "apps"],
  apps: ["system"],
  fieldsArray: [
    {
      key: "schemaName",
      type: "String",
      name: "类名/表名",
      desc: "统一大驼峰命名法，如：DevSchema"
    },
    {
      key: "name",
      type: "String",
      name: "别名",
      desc: "名称"
    },
    {
      key: "apps",
      type: "Array",
      name: "关联应用",
      desc: "填写关联需要该对象范式的应用简称，如：cms shop lesson等"
    },
    {
      key: "desc",
      type: "String",
      name: "描述"
    },
    {
      key: "displayedOperators",
      type: "Array",
      name: "显示操作按钮",
      desc: "显示在列表中的操作按钮，如：detail edit delete"
    },
    {
      key: "displayedColumns",
      type: "Array",
      name: "显示列表表头",
      desc: "显示在管理列表中的表头，必须是Fields中存在的。"
    },
    {
      key: "managerOperators",
      type: "Array",
      name: "管理员操作权限",
      desc: "管理员操作权限 add添加 edit编辑 delete删除。"
    },
    {
      key: "detailTitle",
      type: "String",
      name: "详情按钮别名",
      desc: "该对象详情页按钮，可以设置其他别名"
    },
    {
      key: "detailPage",
      type: "String",
      name: "详情跳转链接",
      desc: "用于跳转至自定义的详情页面（非公用模块）"
    },
    {
      key: "editPage",
      type: "String",
      name: "编辑跳转链接",
      desc: "用于跳转至自定义的编辑页面（非公用模块）"
    },
    {
      key: "qrUrl",
      type: "String",
      name: "二维码规则",
      desc: "填写此类对象二维码生成规则"
    },
    {
      key: "uniqueIndex",
      type: "Object",
      name: "唯一索引规则"
    },
    {
      key: "order",
      type: "Object",
      name: "默认排序方式",
      desc: "表单默认的数据加载排序方式"
    },
    {
      key: "typeName",
      type: "Array",
      name: "类型名称列表"
    },
    {
      key: "include",
      type: "Array",
      name: "include字段",
      desc: "需要加载内容的关联对象列表，指针及关联字段"
    },
    {
      key: "editTabs",
      type: "Array",
      name: "编辑分类",
      desc: "编辑对象字段所有分类"
    },
    // fields:{
    //     type: "Object",
    //     name: "字段规则",
    //     view:"edit-schema-fields"
    // }
    {
      key: "fieldsArray",
      type: "Array",
      name: "字段规则",
      col: 24,
      view: "edit-schema-fields"
    }
  ]
};

DevSchemaSchemas.DevModule = {
    className: "DevModule",
    desc: "功能模块集合",
    name: "Module功能模块",
    displayedOperators:["edit"],
    displayedColumns:["name","module","desc"],
    apps: ["system"],
    fieldsArray: [
      {
          key:"name",
          type: "String",
          name: "名称",
          desc: "模块的中文名称",
      },
      {
        key:"module",
        type: "String",
        name: "代码",
        desc: "短线命名法，具有唯一性，如：shop lesson等",
      },
      {
        key:"desc",
          type: "String",
          name: "描述",
      },
    ]
}

export {DevSchemaSchemas}
