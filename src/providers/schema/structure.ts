let DepartmentSchemas: any = {}
DepartmentSchemas.Department = {
  "className": "Department",
  "desc": "组织架构",
  "apps": ['common'],
  "fields": {
    "name": {
      "type": "String",
      "name": "部门名称"
    },
    "managers": {
      "type": "Array",
      "name": "部门主管"
    },
    "parent": {
      "type": "Pointer",
      "targetClass": "Department",
      "name": "上级部门",
      "view": "just-show"
    },
    "related": {
      "type": "Array",
      "targetClass": "Department",
      "view":"pointer-array",
      "name": "相关部门",
    },
    "type": {
      "type": "String",
      "name": "部门类型",
      "view": "just-show"
    },
    "order": {
      "type": "Number",
      "name": "部门顺序",
      "desc": "部门排列显示顺序"
    },
    //以下为：钉钉所需字段
    "deptManagerUseridList": {
      "type": "String",
      "name": "主管id列表",
      "desc": "钉钉部门管理员Userid列表，用于钉钉部门同步脚本",
      "show": false
    },
    "departid": {
      "type": "String",
      "name": "钉钉部门id",
      "desc": "钉钉部门id，用于钉钉部门同步脚本",
      "show": false
    },
    "parentid": {
      "type": "String",
      "name": "钉钉上级部门id",
      "desc": "钉钉上级部门id，用于钉钉部门同步脚本",
      "show": false
    }
  }
}
export {DepartmentSchemas}
