let BIReportSchema: Schemas = {};

BIReportSchema.BIReport = {
  "className": "BIReport",
  detailTitle: "详情",
  detailPage: "/finance/dashboard",
  "name": "用户创建",
  "desc": "用户创建报表",
  "apps": ["dev"],
  "displayedOperators": ["edit", "delete", "detail"],
  "displayedColumns": ["name", "type", "date"],
  "fields": {
    'name': {
      required: true,
      "type": "String",
      "name": "创建报表的名称",
      "desc": "创建报表的名称",
    },
    company: {
      type: "Pointer",
      targetClass: "Company",
      name: "公司",
    },
    'type': {
      required: true,
      "type": "String",
      "name": "创建报表类型",
      "desc": "创建报表类型",
      "color": "blue",
      "view": "edit-select",
      default: "year",
      "options": [{ label: "年度", value: "year" }, { label: "季度", value: "quarter" }, { label: "月份", value: "month" }]
    },
    "date": {
      required: true,
      "type": "Object",
      "name": "时间范围",
      "desc": "报表的时间范围",
      "view": "date-from-to"
    }
  }
}


export { BIReportSchema };
