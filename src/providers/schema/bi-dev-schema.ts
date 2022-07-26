let BIDevSchema: Schemas = {};


BIDevSchema.BIDevSchema = {
  "className": "BIDevSchema",
  uniqueIndex: { className: 1 },
  "name": "BI开发者设计表",
  "desc": "开发者编辑表格",
  "apps": ["dev"],
  "displayedOperators": ["edit"],
  "displayedColumns": ["name", "schemaName", "category", "type", "requiredColumns",  "optionColumns"],
  'fields': {
    "schemaName": {
      "type": "String",
      "name": "表名"
    },
    category: {
      type: "Pointer",
      targetClass: "Category",
      targetType: "bischema",
      name: "类型",
    },
    "name": {
      "type": "String",
      "name": "中文名"
    },
    "type": {
       required: true,
      "type": "String",
      "name": "类型",
      "color": "blue",
      "view": "edit-select",
      default: "data",
      "options": [{ label: "数据", value: "data" }, { label: "基础", value: "base" }]
    },
    "uniqueIndex": {
      "type": "Object",
      "name": "唯一索引"
    },

    "desc": {
      "type": "String",
      "name": "描述"
    },
    "apps": {
      "type": "Array",
      "name": "相关应用"
    },
    "requiredColumns": {
      "type": "Array",
      "name": "必填项"
    },
    "optionColumns": {
      "type": "Array",
      "name": "选填项"
    },
    "fields": {
      "type": "Array",
      "view": "edit-fields",
      "name": "字段",
      "default": [
        {
          field: null,
          headerName: null,
          type: String,
          required: true,
          dateType: null
        }, {
          field: null,
          headerName: null,
          type: String,
          required: true,
          dateType: null
        },
      ]
    },
  }
}

BIDevSchema.BIDevReport = {
  "className": "BIDevReport",
  uniqueIndex: { className: 1 },
  "name": "BI报表设计表",
  "desc": "开发者编辑表格",
  "apps": ["dev"],
  "displayedOperators": ["edit", "delete"],
  "displayedColumns": ["name", "schemaName", "requiredColumns", "fields", "optionColumns"],
  'fields': {
    "schemaName": {
      "type": "String",
      "name": "表名"
    },
    category: {
      type: "Pointer",
      targetClass: "Category",
      targetType: "bischema",
      name: "类型",
    },
    "name": {
      "type": "String",
      "name": "中文名"
    },
    "fields": {
      "type": "Object",
      "name": "字段"
    },
    "status": {
      "type": "Boolean",
      "name": "状态",
      "view": "schema-status"
    },
    "uniqueIndex": {
      "type": "Object",
      "name": "唯一索引"
    },

    "desc": {
      "type": "String",
      "name": "描述"
    },
    "apps": {
      "type": "Array",
      "name": "相关应用"
    },
    "requiredColumns": {
      "type": "Array",
      "name": "必填项"
    },
    "optionColumns": {
      "type": "Array",
      "name": "选填项"
    },
  }
}






















// 销售订单表
BIDevSchema.BISalesOrder = {
  className: "BISalesOrder",
  name: "销售订单表",
  "desc": "销售订单明细表",
  "apps": ["dev"],
  "displayedOperators": ["edit", "delete"],
  "displayedColumns": ["name", "orderNum", "productName", "transactionTime", "price", "count"],
  'fields': {
    "name": {
      "type": "String",
      "name": "客户名称"
    },
    "orderNum": {
      "type": "String",
      "name": "订单编号"
    },
    "productName": {
      "type": "String",
      "name": "产品名称"
    },
    "spec": {
      "type": "String",
      "name": "规格型号"
    },
    "transactionTime": {
      "type": "String",
      "name": "成交时间"
    },
    "price": {
      "type": "Number",
      "name": "单价"
    },
    "count": {
      "type": "Number",
      "name": "数量"
    },
    "totalPrice": {
      "type": "Number",
      "name": "金额"
    },
    "receiptDate": {
      "type": "String",
      "name": "收货日期"
    }
  }
}

// 销售出货表
BIDevSchema.BISalesDeal = {
  className: "BISalesDeal",
  name: "销售出货表",
  desc: "销售出货明细表",
  "displayedOperators": ["edit", "delete"],
  "displayedColumns": ["name", "className", "desc", "status"],
  "fields": {
    "productName": {
      "type": "String",
      "name": "产品名称"
    },
    "deliveryDate": {
      "type": "String",
      "name": "发货日期"
    },
    "deliveryCount": {
      "type": "Number",
      "name": "发货数量"
    },
    "price": {
      "type": "Number",
      "name": "单价"
    },
    "consignee": {
      "type": "Number",
      "name": "收货单位"
    },
    "shipmentNum": {
      "type": "Number",
      "name": "发货编号"
    }
  }
}


// 销售发票表
BIDevSchema.BISalesBill = {
  className: "BISalesBill",
  name: "销售发票表",
  desc: "销售发票明细表",
  "displayedOperators": ["edit", "delete"],
  "displayedColumns": ["name", "className", "desc", "status"],
  "fields": {
    "billData": {
      "type": "String",
      "name": "开票日期"
    },
    "collectionDate": {
      "type": "String",
      "name": "收款日期"
    },
    "buyer": {
      "type": "String",
      "name": "购货单位"
    },
    "billNum": {
      "type": "Number",
      "name": "发票编号"
    },
    "productName": {
      "type": "String",
      "name": "产品名称"
    },
    "spec": {
      "type": "String",
      "name": "规格型号"
    },
     "price": {
      "type": "Number",
      "name": "单价"
    },
    "count": {
      "type": "Number",
      "name": "数量"
    },
    "totalPrice": {
      "type": "Number",
      "name": "金额"
    },  
  }
}

// 采购明细表
BIDevSchema.BIPurchaseDetail = {
  className: "BISalesOrder",
  name: "销售订单表",
  desc: "销售订单明细表",
  "displayedOperators": ["edit", "delete"],
  "displayedColumns": ["name", "className", "desc", "status"],
  "fields": {
    "supplier": {
      "type": "String",
      "name": "供应商"
    },
    "purchaseDate": {
      "type": "String",
      "name": "采购日期"
    }
  }
};


export { BIDevSchema };
