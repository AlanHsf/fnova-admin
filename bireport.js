// 资金
{
  [{
    "desc": "",
    "name": "各账户期初余额期末余额",
    "tags": [
      "账户",
      "余额"
    ],
    "view": "bar-y",
    "groupBy": [
      "accountName"
    ],
    "aggregate": [
      "initBalance",
      "endBalance"
    ],
    "conditions": [
      "accountName",
      "initBalance",
      "endBalance"
    ],
    "sqlname": "账户资金分析表",
    "legend": {
      "data": ["期初", "期末"],
      "textStyle": {
        "color": "#fff"
      }
    },
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各账户收入与支出",
    "tags": [
      "账户",
      "收入与支出"
    ],
    "view": "bar-negative",
    "groupBy": [
      "accountName"
    ],
    "aggregate": [
      "receive",
      "pay"
    ],
    "conditions": [
      "accountName",
      "receive",
      "pay"
    ],
    "legend": {
      "data": ["收入", "支出"],
      "textStyle": {
        "color": "#fff"
      }
    },
    "sqlname": "账户资金分析表",
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "本期流入与流出",
    "tags": [
      "项目",
      "流入流出"
    ],
    "view": "pie",
    "legend": {
      "data": [
        "流入",
        "流出"
      ],
      "textStyle": {
        "color": "#fff"
      }
    },
    "dataArr": [],
    "groupBy": [
      "projectA"
    ],
    "sqlname": "项目资金分析表",
    "aggregate": [
      "month_receive",
      "month_pay"
    ],
    "conditions": [
      "projectA",
      "month_receive",
      "month_pay"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "本年流入与流出",
    "tags": [
      "项目",
      "流入流出"
    ],
    "view": "pie",
    "legend": {
      "data": [
        "流入",
        "流出"
      ],
      "textStyle": {
        "color": "#fff"
      }
    },
    "dataArr": [],
    "groupBy": [
      "projectA"
    ],
    "sqlname": "项目资金分析表",
    "aggregate": [
      "year_receive",
      "year_pay"
    ],
    "conditions": [
      "projectA",
      "year_receive",
      "year_pay"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "流入类本其发生金额",
    "tags": [
      "项目",
      "本期发生金额"
    ],
    "view": "bar-y",
    "dataArr": [],
    "groupBy": [
      "projectC", "projectB", "projectA"
    ],
    "sqlname": "项目资金分析表",
    "aggregate": [
      "balance_month"
    ],
    "conditions": [
      "projectC", "projectB", "projectA", "balance_month"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "流出类本期发生金额",
    "tags": [
      "项目",
      "本期发生金额"
    ],
    "view": "bar-y",
    "dataArr": [],
    "groupBy": [
      "projectC", "projectB", "projectA"
    ],
    "sqlname": "项目资金分析表",
    "aggregate": [
      "balance_year"
    ],
    "conditions": [
      "projectC", "projectB", "projectA", "balance_year"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "流入类本年发生金额",
    "tags": [
      "项目",
      "本期发生金额"
    ],
    "view": "bar-y",
    "dataArr": [],
    "groupBy": [
      "projectC", "projectB", "projectA"
    ],
    "sqlname": "项目资金分析表",
    "aggregate": [
      "balance_year"
    ],
    "conditions": [
      "projectC", "projectB", "projectA", "balance_year"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "流出类本年发生金额",
    "tags": [
      "项目",
      "本期发生金额"
    ],
    "view": "bar-y",
    "dataArr": [],
    "groupBy": [
      "projectC", "projectB", "projectA"
    ],
    "sqlname": "项目资金分析表",
    "aggregate": [
      "balance_year"
    ],
    "conditions": [
      "projectC", "projectB", "projectA", "balance_year"
    ],
    "chartOption": {}
  }
  ]
}



// 资产存货
{
  [{
    "desc": "",
    "name": "各项目期初金额",
    "tags": [
      "项目",
      "期初金额"
    ],
    "view": "bar-y",
    "groupBy": [
      "projectB",
      "projectA"
    ],
    "aggregate": [
      "initAmount"
    ],
    "conditions": [
      "projectB",
      "initAmount"
    ],
    "sqlname": "长期资产分析表",
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各项目期末金额",
    "tags": [
      "项目",
      "期末金额"
    ],
    "view": "bar-y",
    "groupBy": [
      "projectB",
      "projectA"
    ],
    "aggregate": [
      "amountEnd"
    ],
    "conditions": [
      "projectB",
      "projectA",
      "amountEnd"
    ],
    "sqlname": "长期资产分析表",
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各项目本期增加减少",
    "tags": [
      "项目",
      "增加减少"
    ],
    "view": "bar-negative",
    "groupBy": [
      "projectB",
      "projectA"
    ],
    "aggregate": [
      "amountin",
      "anountde"
    ],
    "conditions": [
      "projectB",
      "projectA",
      "amountin",
      "anountde"
    ],

    "sqlname": "长期资产分析表",
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各项目累计折旧",
    "tags": [
      "项目",
      "折旧"
    ],
    "view": "bar-y",
    "groupBy": [
      "projectB",
      "projectA"
    ],
    "aggregate": [
      "depreciationEnd"
    ],
    "conditions": [
      "projectB",
      "projectA",
      "depreciationEnd"
    ],

    "sqlname": "长期资产分析表",
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各项增幅",
    "tags": [
      "项目",
      "增幅"
    ],
    "view": "bar",
    "groupBy": [
      "projectB",
      "projectA"
    ],
    "aggregate": [
      "growth"
    ],
    "conditions": [
      "projectB",
      "projectA",
      "growth"
    ],
    "sqlname": "长期资产分析表",
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各项目占比",
    "tags": [
      "项目",
      "增幅"
    ],
    "view": "bar",
    "groupBy": [
      "projectB",
      "projectA"
    ],
    "aggregate": [
      "percent"
    ],
    "conditions": [
      "projectB",
      "projectA",
      "percent"
    ],
    "sqlname": "长期资产分析表",
    "chartOption": {},
    "dataArr": []
  },

  {
    "desc": "",
    "name": "各项目净值",
    "tags": [
      "项目",
      "净值"
    ],
    "view": "bar",
    "groupBy": [
      "projectB",
      "projectA"
    ],
    "aggregate": [
      "worth"
    ],
    "conditions": [
      "projectB",
      "projectA",
      "worth"
    ],
    "sqlname": "长期资产分析表",
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "期初期末库存",
    "tags": [
      "项目",
      "库存"
    ],
    "view": "bar",
    "groupBy": [
      "type"
    ],
    "aggregate": [
      "initStock",
      "initStock"
    ],
    "conditions": [
      "type",
      "initStock"
    ],
    "sqlname": "存货分析表",
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "出入库金额",
    "tags": [
      "出库",
      "物料类别"
    ],
    "view": "bars-y",
    "groupBy": [
      "type"
    ],
    "aggregate": [
      "putStorage",
      "outStorage"
    ],
    "conditions": [
      "type",
      "putStorage",
      "outStorage"

    ],
    "legend": {
      "data": [
        "期初",
        "期末"
      ],
      "textStyle": {
        "color": "#fff"
      }
    },
    "sqlname": "项目资金分析表",
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "本期变动金额",
    "tags": [
      "变动",
      "物料类别"
    ],
    "view": "bar",
    "groupBy": [
      "type"
    ],
    "aggregate": [
      "change"
    ],
    "conditions": [
      "type",
      "change"

    ],
    "sqlname": "存货分析表",
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "期末金额的比重",
    "tags": [
      "期末",
      "物料类别"
    ],
    "view": "bar",
    "groupBy": [
      "type"
    ],
    "aggregate": [
      "end_percent"
    ],
    "conditions": [
      "type",
      "rate"
    ],
    "sqlname": "存货分析表",
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "本期变动金额比率",
    "tags": [
      "变动",
      "物料类别"
    ],
    "view": "pie",
    "groupBy": [
      "type"
    ],
    "aggregate": [
      "rate"
    ],
    "conditions": [
      "type",
      "rate"

    ],
    "sqlname": "存货分析表",
    "chartOption": {},
    "dataArr": []
  }

  ]
}


// {"name" : "材料"},{"name": "人工"}, {"name": "制造费用"}, {"name": "动力"}, {"name": "定额"}
// {
//   "name": "部门"
// }, {
//   "name": "产品"
// }, {
//   "name": "制造费用"
// }, {
//   "name": "动力"
// }, {
//   "name": "定额"
// }


// 销售
{
  [{
    "desc": "",
    "name": "各物料销售与计划销售",
    "tags": [
      "销售",
      "物料"
    ],
    "view": "bar-label",
    "sqlname": "销售预算分析表",
    "legend": {
      "data": [
        "销售额",
        "计划销售额"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "typeA"
    ],
    "dataArr": [],
    "aggregate": [
      "totalPrice",
      "planSalesAmount"
    ],
    "conditions": [
      "typeA",
      "totalPrice", "planSalesAmount"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各部门销售与计划销售",
    "tags": [
      "销售",
      "部门"
    ],
    "view": "bar-label",
    "sqlname": "销售预算分析表",
    "legend": {
      "data": [
        "销售额",
        "计划销售额"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "department"
    ],
    "dataArr": [],
    "aggregate": [
      "totalPrice",
      "planSalesAmount"
    ],
    "conditions": [
      "department",
      "totalPrice", "planSalesAmount"
    ]
  },

  {
    "desc": "",
    "name": "各客户销售与计划销售",
    "tags": [
      "销售",
      "客户"
    ],
    "view": "bar-label",
    "sqlname": "销售预算分析表",
    "legend": {
      "data": [
        "销售额",
        "计划销售额"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "customerName"
    ],
    "dataArr": [],
    "aggregate": [
      "totalPrice",
      "planSalesAmount"
    ],
    "conditions": [
      "customerName",
      "totalPrice", "planSalesAmount"
    ]
  },
  {
    "desc": "",
    "name": "各业务员销售与计划销售",
    "tags": [
      "销售",
      "业务员"
    ],
    "view": "bar-label",
    "sqlname": "销售预算分析表",
    "legend": {
      "data": [
        "销售额",
        "计划销售额"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "salesman"
    ],
    "dataArr": [],
    "aggregate": [
      "totalPrice",
      "planSalesAmount"
    ],
    "conditions": [
      "department",
      "totalPrice", "planSalesAmount"
    ]
  }, {
    "desc": "",
    "name": "各区域销售与计划销售",
    "tags": [
      "销售",
      "区域"
    ],
    "view": "bar-label",
    "sqlname": "销售预算分析表",
    "legend": {
      "data": [
        "销售额",
        "计划销售额"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "area"
    ],
    "dataArr": [],
    "aggregate": [
      "totalPrice",
      "planSalesAmount"
    ],
    "conditions": [
      "area",
      "totalPrice", "planSalesAmount"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各物料与销售占比",
    "tags": [
      "销售",
      "物料"
    ],
    "view": "pie",
    "sqlname": "销售预算分析表",
    "groupBy": [
      "typeA"
    ],
    "dataArr": [],
    "aggregate": [
      "salesPercent"
    ],
    "conditions": [
      "typeA",
      "salesPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各部门销售占比",
    "tags": [
      "销售",
      "部门"
    ],
    "view": "pie",
    "sqlname": "销售预算分析表",
    "groupBy": [
      "department"
    ],
    "dataArr": [],
    "aggregate": [
      "salesPercent"
    ],
    "conditions": [
      "department",
      "salesPercent"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各客户销售占比",
    "tags": [
      "销售",
      "客户"
    ],
    "view": "pie",
    "sqlname": "销售预算分析表",
    "groupBy": [
      "customerName"
    ],
    "dataArr": [],
    "aggregate": [
      "salesPercent"
    ],
    "conditions": [
      "customerName",
      "salesPercent"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各业务员销售占比",
    "tags": [
      "销售",
      "业务员"
    ],
    "view": "pie",
    "sqlname": "销售预算分析表",
    "groupBy": [
      "salesman"
    ],
    "dataArr": [],
    "aggregate": [
      "salesPercent"
    ],
    "conditions": [
      "salesman",
      "salesPercent"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各区域销售占比",
    "tags": [
      "销售",
      "区域"
    ],
    "view": "pie",
    "sqlname": "销售预算分析表",
    "groupBy": [
      "area"
    ],
    "dataArr": [],
    "aggregate": [
      "salesPercent"
    ],
    "conditions": [
      "area",
      "salesPercent"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各物料销售完成率",
    "tags": [
      "销售",
      "物料"
    ],
    "view": "pie",
    "sqlname": "销售预算分析表",
    "groupBy": [
      "typeA"
    ],
    "dataArr": [],
    "aggregate": [
      "salesPercent"
    ],
    "conditions": [
      "typeA",
      "complete"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各部门销售完成率",
    "tags": [
      "销售",
      "部门"
    ],
    "view": "pie",
    "sqlname": "销售预算分析表",
    "groupBy": [
      "department"
    ],
    "dataArr": [],
    "aggregate": [
      "salesPercent"
    ],
    "conditions": [
      "department",
      "complete"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各客户销售完成率",
    "tags": [
      "销售",
      "客户"
    ],
    "view": "pie",
    "sqlname": "销售预算分析表",
    "groupBy": [
      "customerName"
    ],
    "dataArr": [],
    "aggregate": [
      "salesPercent"
    ],
    "conditions": [
      "customerName",
      "complete"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各业务员销售完成率",
    "tags": [
      "销售",
      "业务员"
    ],
    "view": "pie",
    "sqlname": "销售预算分析表",
    "groupBy": [
      "salesman"
    ],
    "dataArr": [],
    "aggregate": [
      "salesPercent"
    ],
    "conditions": [
      "salesman",
      "complete"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各区域销售完成率",
    "tags": [
      "销售",
      "区域"
    ],
    "view": "pie",
    "sqlname": "销售预算分析表",
    "groupBy": [
      "area"
    ],
    "dataArr": [],
    "aggregate": [
      "salesPercent"
    ],
    "conditions": [
      "area",
      "complete"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各物料回款金额与计划回款金额",
    "tags": [
      "回款",
      "物料"
    ],
    "view": "bar-label",
    "sqlname": "销售回款分析表",
    "legend": {
      "data": [
        "回款金额",
        "计划回款金额"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "typeA"
    ],
    "dataArr": [],
    "aggregate": [
      "collectionAmount",
      "planSaleaAmount"
    ],
    "conditions": [
      "typeA",
      "collectionAmount",
      "planSaleaAmount"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各部门回款金额与计划回款金额",
    "tags": [
      "回款",
      "部门"
    ],
    "view": "bar-label",
    "sqlname": "销售回款分析表",
    "legend": {
      "data": [
        "回款金额",
        "计划回款金额"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "department"
    ],
    "dataArr": [],
    "aggregate": [
      "collectionAmount",
      "planSaleaAmount"
    ],
    "conditions": [
      "department",
      "collectionAmount",
      "planSaleaAmount"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各客户回款金额与计划回款金额",
    "tags": [
      "回款",
      "客户"
    ],
    "view": "bar-label",
    "sqlname": "销售回款分析表",
    "legend": {
      "data": [
        "回款金额",
        "计划回款金额"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "customName"
    ],
    "dataArr": [],
    "aggregate": [
      "collectionAmount",
      "planSaleaAmount"
    ],
    "conditions": [
      "customName",
      "collectionAmount",
      "planSaleaAmount"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各业务员回款金额与计划回款金额",
    "tags": [
      "回款",
      "业务员"
    ],
    "view": "bar-label",
    "sqlname": "销售回款分析表",
    "legend": {
      "data": [
        "回款金额",
        "计划回款金额"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "salesman"
    ],
    "dataArr": [],
    "aggregate": [
      "collectionAmount",
      "planSaleaAmount"
    ],
    "conditions": [
      "salesman",
      "collectionAmount",
      "planSaleaAmount"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各区域回款金额与计划回款金额",
    "tags": [
      "回款",
      "区域"
    ],
    "view": "bar-label",
    "sqlname": "销售回款分析表",
    "legend": {
      "data": [
        "回款金额",
        "计划回款金额"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "area"
    ],
    "dataArr": [],
    "aggregate": [
      "collectionAmount",
      "planSaleaAmount"
    ],
    "conditions": [
      "area",
      "collectionAmount",
      "planSaleaAmount"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各物料回款金额占比",
    "tags": [
      "回款",
      "物料"
    ],
    "view": "pie",
    "sqlname": "销售回款分析表",
    "groupBy": [
      "typeA"
    ],
    "dataArr": [],
    "aggregate": [
      "returnPercent"
    ],
    "conditions": [
      "typeA",
      "returnPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各部门回款金额占比",
    "tags": [
      "回款",
      "部门"
    ],
    "view": "pie",
    "sqlname": "销售回款分析表",
    "groupBy": [
      "department"
    ],
    "dataArr": [],
    "aggregate": [
      "returnPercent"
    ],
    "conditions": [
      "department",
      "returnPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各客户回款金额占比",
    "tags": [
      "回款",
      "客户"
    ],
    "view": "pie",
    "sqlname": "销售回款分析表",
    "groupBy": [
      "customName"
    ],
    "dataArr": [],
    "aggregate": [
      "returnPercent"
    ],
    "conditions": [
      "customName",
      "returnPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各业务员回款金额占比",
    "tags": [
      "回款",
      "业务员"
    ],
    "view": "pie",
    "sqlname": "销售回款分析表",
    "groupBy": [
      "salesman"
    ],
    "dataArr": [],
    "aggregate": [
      "returnPercent"
    ],
    "conditions": [
      "salesman",
      "returnPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各区域回款金额占比",
    "tags": [
      "回款",
      "区域"
    ],
    "view": "pie",
    "sqlname": "销售回款分析表",
    "groupBy": [
      "area"
    ],
    "dataArr": [],
    "aggregate": [
      "returnPercent"
    ],
    "conditions": [
      "area",
      "returnPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各物料回款完成率与回款率",
    "tags": [
      "回款",
      "物料"
    ],
    "view": "bar-label",
    "sqlname": "销售回款分析表",
    "legend": {
      "data": [
        "完成率",
        "回款率"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "typeA"
    ],
    "dataArr": [],
    "aggregate": [
      "complete",
      "returnRate"
    ],
    "conditions": [
      "typeA",
      "complete",
      "returnRate"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各部门回款完成率与回款率",
    "tags": [
      "回款",
      "部门"
    ],
    "view": "bar-label",
    "sqlname": "销售回款分析表",
    "legend": {
      "data": [
        "完成率",
        "回款率"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "department"
    ],
    "dataArr": [],
    "aggregate": [
      "complete",
      "returnRate"
    ],
    "conditions": [
      "department",
      "complete",
      "returnRate"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各客户回款完成率与回款率",
    "tags": [
      "回款",
      "客户"
    ],
    "view": "bar-label",
    "sqlname": "销售回款分析表",
    "legend": {
      "data": [
        "完成率",
        "回款率"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "customName"
    ],
    "dataArr": [],
    "aggregate": [
      "complete",
      "returnRate"
    ],
    "conditions": [
      "customName",
      "complete",
      "returnRate"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各业务员回款完成率与回款率",
    "tags": [
      "回款",
      "业务员"
    ],
    "view": "bar-label",
    "sqlname": "销售回款分析表",
    "legend": {
      "data": [
        "完成率",
        "回款率"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "salesman"
    ],
    "dataArr": [],
    "aggregate": [
      "complete",
      "returnRate"
    ],
    "conditions": [
      "salesman",
      "complete",
      "returnRate"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各区域回款完成率与回款率",
    "tags": [
      "回款",
      "区域"
    ],
    "view": "bar-label",
    "sqlname": "销售回款分析表",
    "legend": {
      "data": [
        "完成率",
        "回款率"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "groupBy": [
      "area"
    ],
    "dataArr": [],
    "aggregate": [
      "complete",
      "returnRate"
    ],
    "conditions": [
      "area",
      "complete",
      "returnRate"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各物料毛利",
    "tags": [
      "毛利",
      "物料"
    ],
    "view": "bar-waterfall",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "typeA"
    ],
    "dataArr": [],
    "aggregate": [
      "gross"
    ],
    "conditions": [
      "typeA",
      "gross"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各部门毛利",
    "tags": [
      "毛利",
      "部门"
    ],
    "view": "bar-waterfall",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "department"
    ],
    "dataArr": [],
    "aggregate": [
      "gross"
    ],
    "conditions": [
      "department",
      "gross"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各客户毛利",
    "tags": [
      "毛利",
      "客户"
    ],
    "view": "bar-waterfall",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "customName"
    ],
    "dataArr": [],
    "aggregate": [
      "gross"
    ],
    "conditions": [
      "customName",
      "gross"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各业务员毛利",
    "tags": [
      "毛利",
      "业务员"
    ],
    "view": "bar-waterfall",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "salesman"
    ],
    "dataArr": [],
    "aggregate": [
      "gross"
    ],
    "conditions": [
      "salesman",
      "gross"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各区域毛利",
    "tags": [
      "毛利",
      "区域"
    ],
    "view": "bar-waterfall",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "area"
    ],
    "dataArr": [],
    "aggregate": [
      "gross"
    ],
    "conditions": [
      "area",
      "gross"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各物料毛利占比",
    "tags": [
      "毛利",
      "物料"
    ],
    "view": "pie",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "typeA"
    ],
    "dataArr": [],
    "aggregate": [
      "grossRate"
    ],
    "conditions": [
      "typeA",
      "grossRate"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各部门毛利占比",
    "tags": [
      "毛利",
      "部门"
    ],
    "view": "pie",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "department"
    ],
    "dataArr": [],
    "aggregate": [
      "grossRate"
    ],
    "conditions": [
      "department",
      "grossRate"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各客户毛利占比",
    "tags": [
      "毛利",
      "客户"
    ],
    "view": "pie",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "customName"
    ],
    "dataArr": [],
    "aggregate": [
      "grossRate"
    ],
    "conditions": [
      "customName",
      "grossRate"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各业务员毛利占比",
    "tags": [
      "毛利",
      "业务员"
    ],
    "view": "pie",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "salesman"
    ],
    "dataArr": [],
    "aggregate": [
      "grossRate"
    ],
    "conditions": [
      "salesman",
      "grossRate"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各业务员毛利占比",
    "tags": [
      "毛利",
      "区域"
    ],
    "view": "pie",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "area"
    ],
    "dataArr": [],
    "aggregate": [
      "grossRate"
    ],
    "conditions": [
      "area",
      "grossRate"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各物料毛利率",
    "tags": [
      "毛利",
      "物料"
    ],
    "view": "bar",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "typeA"
    ],
    "dataArr": [],
    "aggregate": [
      "grossMargin"
    ],
    "conditions": [
      "typeA",
      "grossMargin"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各部门毛利率",
    "tags": [
      "毛利",
      "部门"
    ],
    "view": "bar",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "department"
    ],
    "dataArr": [],
    "aggregate": [
      "grossMargin"
    ],
    "conditions": [
      "department",
      "grossMargin"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各客户毛利率",
    "tags": [
      "毛利",
      "客户"
    ],
    "view": "bar",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "customName"
    ],
    "dataArr": [],
    "aggregate": [
      "grossMargin"
    ],
    "conditions": [
      "customName",
      "grossMargin"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各业务员毛利率",
    "tags": [
      "毛利",
      "业务员"
    ],
    "view": "bar",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "salesman"
    ],
    "dataArr": [],
    "aggregate": [
      "grossMargin"
    ],
    "conditions": [
      "salesman",
      "grossMargin"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "各区域毛利率",
    "tags": [
      "毛利",
      "区域"
    ],
    "view": "bar",
    "sqlname": "销售毛利分析表",
    "groupBy": [
      "area"
    ],
    "dataArr": [],
    "aggregate": [
      "grossMargin"
    ],
    "conditions": [
      "area",
      "grossMargin"
    ],
    "chartOption": {}
  }
  ]
}

// 采购
{
  [{
    "desc": "",
    "name": "各部门采购额",
    "tags": [
      "采购",
      "部门"
    ],
    "view": "pie",
    "groupBy": [
      "BIPurchaseOrder/department"
    ],
    "computed": "totalPrice",
    "aggregate": [{
      "sum": "BIPurchaseOrder.totalPrice"
    }],
    "conditions": [
      "BIPurchaseOrder.department",
      "BIPurchaseOrder.totalPrice"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各部门采购总额占比",
    "tags": [
      "采购",
      "部门"
    ],
    "view": "pie",
    "dataArr": [],
    "groupBy": [
      "BIPurchaseOrder/department"
    ],
    "computed": "totalPrice",
    "aggregate": [{
      "divide": "BIPurchaseOrder.totalPrice/totalPrice"
    }],
    "conditions": [
      "BIPurchaseOrder.department",
      "BIPurchaseOrder.totalPrice"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "各部门采购完成率",
    "tags": [
      "采购",
      "部门"
    ],
    "view": "bar",
    "groupBy": [
      "BIPurchaseOrder/department"
    ],
    "computed": "totalPrice",
    "aggregate": [{
      "divide": "BIPurchaseOrder.totalPrice/BIPurchaseBudget.planSalesAmount"
    }],
    "conditions": [
      "BIPurchaseOrder.department",
      "BIPurchaseOrder.totalPrice",
      "BIPurchaseBudget.planSalesAmount"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各物料采购金额",
    "tags": [
      "采购",
      "材料"
    ],
    "view": "pie",
    "groupBy": [
      "BIPurchaseOrder/materialCode",
      "BIPurchaseOrder/materialName",
      "BIPurchaseOrder/type"
    ],
    "computed": "totalPrice",
    "aggregate": [{
      "sum": "BIPurchaseOrder.totalPrice"
    }],
    "conditions": [
      "BIPurchaseOrder.materialCode",
      "BIPurchaseOrder.materialName",
      "BIPurchaseOrder.type",
      "BIPurchaseOrder.totalPrice"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各物料采购完成率",
    "tags": [
      "采购",
      "材料"
    ],
    "view": "bar",
    "groupBy": [
      "BIPurchaseOrder/materialCode",
      "BIPurchaseOrder/materialName",
      "BIPurchaseOrder/type"
    ],
    "computed": "totalPrice",
    "aggregate": [{
      "divide": "BIPurchaseOrder.totalPrice/BIPurchaseBudget.planSalesAmount"
    }],
    "conditions": [
      "BIPurchaseOrder.materialCode",
      "BIPurchaseOrder.materialName",
      "BIPurchaseOrder.type",
      "BIPurchaseOrder.totalPrice",
      "BIPurchaseBudget.planSalesAmount"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各供应商采购金额",
    "tags": [
      "采购",
      "供应商"
    ],
    "view": "bar",
    "groupBy": [
      "BIPurchaseOrder/customName",
      "BIPurchaseOrder/customCode"
    ],
    "computed": "totalPrice",
    "aggregate": [{
      "sum": "BIPurchaseOrder.totalPrice"
    }],
    "conditions": [
      "BIPurchaseOrder.customName",
      "BIPurchaseOrder.customCode",
      "BIPurchaseOrder.totalPrice"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各供应商采购完成率",
    "tags": [
      "采购",
      "供应商"
    ],
    "view": "bar",
    "groupBy": [
      "BIPurchaseOrder/customName",
      "BIPurchaseOrder/customCode"
    ],
    "computed": "totalPrice",
    "aggregate": [{
      "divide": "BIPurchaseOrder.totalPrice/BIPurchaseBudget.planSalesAmount"
    }],
    "conditions": [
      "BIPurchaseOrder/customName",
      "BIPurchaseOrder/customCode",
      "BIPurchaseOrder.totalPrice",
      "BIPurchaseBudget.planSalesAmount"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各部门计划采购金额",
    "tags": [
      "预算",
      "部门"
    ],
    "view": "bar",
    "groupBy": [
      "BIPurchaseBudget/department"
    ],
    "computed": "planSalesAmount",
    "aggregate": [{
      "sum": "BIPurchaseBudget.planSalesAmount"
    }],
    "conditions": [
      "BIPurchaseBudget.department",
      "BIPurchaseBudget.planSalesAmount"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各物料计划采购金额",
    "tags": [
      "预算",
      "材料"
    ],
    "view": "pie",
    "groupBy": [
      "BIPurchaseBudget/materialCode",
      "BIPurchaseBudget/materialName",
      "BIPurchaseBudget/type"
    ],
    "computed": "planSalesAmount",
    "aggregate": [{
      "sum": "BIPurchaseBudget.planSalesAmount"
    }],
    "conditions": [
      "BISalesBudget.materialCode",
      "BIPurchaseBudget.materialName",
      "BIPurchaseBudget.type",
      "BIPurchaseBudget.planSalesAmount"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各供应商计划采购金额",
    "tags": [
      "预算",
      "供应商"
    ],
    "view": "bar-waterfall",
    "groupBy": [
      "BIPurchaseBudget/customName",
      "BIPurchaseBudget/customCode"
    ],
    "computed": "planSalesAmount",
    "aggregate": [{
      "sum": "BIPurchaseBudget.planSalesAmount"
    }],
    "conditions": [
      "BIPurchaseBudget.customName",
      "BIPurchaseBudget/customCode",
      "BIPurchaseBudget.planSalesAmount"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各部门采购付款金额",
    "tags": [
      "付款",
      "部门"
    ],
    "view": "pie",
    "groupBy": [
      "BIPurchasePay/department"
    ],
    "computed": "payAmount",
    "aggregate": [{
      "sum": "BIPurchasePay.payAmount"
    }],
    "conditions": [
      "BIPurchasePay.department",
      "BIPurchasePay.payAmount"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各物料付款金额",
    "tags": [
      "付款",
      "材料"
    ],
    "view": "pie",
    "groupBy": [
      "BIPurchasePay/materialCode",
      "BIPurchasePay/materialName",
      "BIPurchasePay/type"
    ],
    "computed": "payAmount",
    "aggregate": [{
      "sum": "BIPurchasePay.payAmount"
    }],
    "conditions": [
      "BIPurchasePay.materialCode",
      "BIPurchasePay.materialName",
      "BIPurchasePay.type",
      "BIPurchasePay.payAmount"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各供应商付款金额",
    "tags": [
      "付款",
      "供应商"
    ],
    "view": "bar-waterfall",
    "groupBy": [
      "BIPurchasePay/customName",
      "BIPurchasePay/customCode"
    ],
    "computed": "payAmount",
    "aggregate": [{
      "sum": "BIPurchasePay.payAmount"
    }],
    "conditions": [
      "BIPurchasePay.customName",
      "BIPurchasePay.customCode",
      "BIPurchasePay.payAmount"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各部门回款完成率",
    "tags": [
      "付款",
      "部门"
    ],
    "view": "bar",
    "groupBy": [
      "BIPurchaseOrder/department"
    ],
    "computed": "totalPrice",
    "aggregate": [{
      "divide": "BIPurchasePay.payAmount/BIPurchaseOrder.totalPrice"
    }],
    "conditions": [
      "BIPurchaseOrder.department",
      "BIPurchaseOrder.totalPrice",
      "BIPurchaseBudget.planSalesAmount"
    ],
    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "各供应商付款完成率",
    "tags": [
      "付款",
      "供应商"
    ],
    "view": "bar",
    "groupBy": [
      "BIPurchaseOrder/customName",
      "BIPurchaseOrder/customCode"
    ],
    "computed": "totalPrice",
    "aggregate": [{
      "divide": "BIPurchasePay.payAmount/BIPurchaseOrder.totalPrice"
    }],
    "conditions": [
      "BIPurchasePay/customName",
      "BIPurchasePay/customCode",
      "BIPurchaseOrder.totalPrice",
      "BIPurchasePay.payAmount"
    ],
    "chartOption": {},
    "dataArr": []
  }
  ]
}

// 运营
{
  [{
    "desc": "",
    "name": "本年累计金额",
    "tags": [
      "税种",
      "税费金额"
    ],
    "view": "bar-y",
    "groupBy": [
      "taxType"
    ],
    "aggregate": [
      "currentYearAmount"
    ],
    "conditions": [
      "taxType",
      "currentYearAmount"
    ],
    "sqlname": "纳税分析表",

    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "上年同期累计金额",
    "tags": [
      "税种",
      "税费金额"
    ],
    "view": "bar-y",
    "groupBy": [
      "taxType"
    ],
    "aggregate": [
      "lastYearAmount"
    ],
    "conditions": [
      "taxType",
      "lastYearAmount"
    ],
    "sqlname": "纳税分析表",

    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "增幅",
    "tags": [
      "税种",
      "税费金额"
    ],
    "view": "bar-y",
    "groupBy": [
      "taxType"
    ],
    "aggregate": [
      "increasePercent"
    ],
    "conditions": [
      "taxType",
      "increasePercent"
    ],
    "sqlname": "纳税分析表",

    "chartOption": {},
    "dataArr": []
  }
  ]
}

// 生产
{
  [{
    "desc": "",
    "name": "本期完工产品总额",
    "tags": [
      "生产",
      "总额"
    ],
    "view": "bar-y",
    "groupBy": [
      "productName"
    ],
    "aggregate": [
      "completeSummation"
    ],
    "conditions": [
      "productName",
      "completeSummation"
    ],
    "sqlname": "生产成本分析表",

    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "本期完工产品直接材料占比",
    "tags": [
      "生产",
      "直接材料"
    ],
    "view": "bar-y",
    "groupBy": [
      "productName"
    ],
    "aggregate": [
      "completeAmountPercent"
    ],
    "conditions": [
      "productName",
      "completeAmountPercent"
    ],
    "sqlname": "生产成本分析表",

    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "本期完工产品人工占比",
    "tags": [
      "生产",
      "人工"
    ],
    "view": "bar-y",
    "groupBy": [
      "productName"
    ],
    "aggregate": [
      "completeArtificialPercent"
    ],
    "conditions": [
      "productName",
      "completeArtificialPercent"
    ],
    "sqlname": "生产成本分析表",

    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "本期完工产品制造费用占比",
    "tags": [
      "生产",
      "制造费用"
    ],
    "view": "bar",
    "groupBy": [
      "productName"
    ],
    "aggregate": [
      "completeManufacturingOverhead"
    ],
    "conditions": [
      "productName",
      "completeManufacturingOverhead"
    ],
    "sqlname": "生产成本分析表",

    "chartOption": {},
    "dataArr": []
  }, {
    "desc": "",
    "name": "本期完工产品动力占比",
    "tags": [
      "生产",
      "动力"
    ],
    "view": "bar",
    "groupBy": [
      "productName"
    ],
    "aggregate": [
      "completePowerPercent"
    ],
    "conditions": [
      "productName",
      "completePowerPercent"
    ],
    "sqlname": "生产成本分析表",

    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "本年完工产品总额",
    "tags": [
      "生产",
      "总额"
    ],
    "view": "bar-y",
    "groupBy": [
      "productName"
    ],
    "aggregate": [
      "currentYearSummation"
    ],
    "conditions": [
      "productName",
      "currentYearSummation"
    ],
    "sqlname": "生产成本分析表",

    "chartOption": {},
    "dataArr": []
  },
  {
    "desc": "",
    "name": "本年累计完工产品直接材料占比",
    "tags": [
      "生产",
      "直接材料"
    ],
    "view": "bar-y",
    "groupBy": [
      "productName"
    ],
    "aggregate": [
      "currentYearAmountPercent"
    ],
    "conditions": [
      "productName",
      "currentYearAmountPercent"
    ],
    "sqlname": "生产成本分析表",

    "chartOption": {},
    "dataArr": []
  }, {
    "desc": "",
    "name": "本期完工产品人工占比",
    "tags": [
      "生产",
      "人工"
    ],
    "view": "bar-y",
    "groupBy": [
      "productName"
    ],
    "aggregate": [
      "currentYearArtificialPercent"
    ],
    "conditions": [
      "productName",
      "currentYearArtificialPercent"
    ],
    "sqlname": "生产成本分析表",

    "chartOption": {},
    "dataArr": []
  }, {
    "desc": "",
    "name": "本期完工产品制造费用占比",
    "tags": [
      "生产",
      "制造费用"
    ],
    "view": "bar",
    "groupBy": [
      "productName"
    ],
    "aggregate": [
      "currentYearManufacturingOverheadPercent"
    ],
    "conditions": [
      "productName",
      "currentYearManufacturingOverheadPercent"
    ],
    "sqlname": "生产成本分析表",

    "chartOption": {},
    "dataArr": []
  }, {
    "desc": "",
    "name": "本期完工产品动力占比",
    "tags": [
      "生产",
      "动力"
    ],
    "view": "bar",
    "groupBy": [
      "productName"
    ],
    "aggregate": [
      "currentYearPowerPercent"
    ],
    "conditions": [
      "productName",
      "currentYearPowerPercent"
    ],
    "sqlname": "生产成本分析表",

    "chartOption": {},
    "dataArr": []
  }
  ]
}



// 生产
{
  [{
    "desc": "",
    "name": "本期完工产品总额",
    "tags": [
      "生产",
      "总额"
    ],
    "view": "bar-y",
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "completeSummation"
    ],
    "conditions": [
      "productName",
      "completeSummation"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "本期完工产品直接材料占比",
    "tags": [
      "生产",
      "直接材料"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "completeAmountPercent"
    ],
    "conditions": [
      "productName",
      "completeAmountPercent"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "本期完工产品人工占比",
    "tags": [
      "生产",
      "人工"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "completeArtificialPercent"
    ],
    "conditions": [
      "productName",
      "completeArtificialPercent"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "本期完工产品制造费用占比",
    "tags": [
      "生产",
      "制造费用"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "completeManufacturingOverhead"
    ],
    "conditions": [
      "productName",
      "completeManufacturingOverhead"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "本期完工产品动力占比",
    "tags": [
      "生产",
      "动力"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "completePowerPercent"
    ],
    "conditions": [
      "productName",
      "completePowerPercent"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "本年完工产品总额",
    "tags": [
      "生产",
      "总额"
    ],
    "view": "bar-y",
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "currentYearSummation"
    ],
    "conditions": [
      "productName",
      "currentYearSummation"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "本年累计完工产品直接材料占比",
    "tags": [
      "生产",
      "直接材料"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "currentYearAmountPercent"
    ],
    "conditions": [
      "productName",
      "currentYearAmountPercent"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "本期完工产品人工占比",
    "tags": [
      "生产",
      "人工"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "currentYearArtificialPercent"
    ],
    "conditions": [
      "productName",
      "currentYearArtificialPercent"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "本期完工产品制造费用占比",
    "tags": [
      "生产",
      "制造费用"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "currentYearManufacturingOverheadPercent"
    ],
    "conditions": [
      "productName",
      "currentYearManufacturingOverheadPercent"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "本期完工产品动力占比",
    "tags": [
      "生产",
      "动力"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "currentYearPowerPercent"
    ],
    "conditions": [
      "productName",
      "currentYearPowerPercent"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "定额本期本年单位成本对比表",
    "tags": [
      "生产",
      "动力"
    ],
    "view": "bar-label",
    "legend": {
      "data": [
        "定额",
        "本期",
        "本年"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "summation",
      "completeUnitSummation",
      "currentYearUnitSummation"
    ],
    "conditions": [
      "productName",
      "summation",
      "completeSummation",
      "currentYearSummation"
    ],
    "chartOption": {}
  },
  {
    "desc": "",
    "name": "本期完工产品总额",
    "tags": [
      "生产",
      "总额"
    ],
    "view": "bar-y",
    "dataArr": [],
    "groupBy": [
      "materialTypeA"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "completeSummation"
    ],
    "conditions": [
      "materialTypeA",
      "completeSummation"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "本期完工产品直接材料占比",
    "tags": [
      "生产",
      "直接材料"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "materialTypeA"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "completeAmountPercent"
    ],
    "conditions": [
      "materialTypeA",
      "completeAmountPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "本期完工产品人工占比",
    "tags": [
      "生产",
      "人工"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "materialTypeA"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "completeArtificialPercent"
    ],
    "conditions": [
      "materialTypeA",
      "completeArtificialPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "本期完工产品制造费用占比",
    "tags": [
      "生产",
      "制造费用"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "materialTypeA"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "completeManufacturingOverhead"
    ],
    "conditions": [
      "materialTypeA",
      "completeManufacturingOverhead"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "本期完工产品动力占比",
    "tags": [
      "生产",
      "动力"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "materialTypeA"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "completePowerPercent"
    ],
    "conditions": [
      "materialTypeA",
      "completePowerPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "本年完工产品总额",
    "tags": [
      "生产",
      "总额"
    ],
    "view": "bar-y",
    "dataArr": [],
    "groupBy": [
      "materialTypeA"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "currentYearSummation"
    ],
    "conditions": [
      "materialTypeA",
      "currentYearSummation"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "本年累计完工产品直接材料占比",
    "tags": [
      "生产",
      "直接材料"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "materialTypeA"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "currentYearAmountPercent"
    ],
    "conditions": [
      "materialTypeA",
      "currentYearAmountPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "本期完工产品人工占比",
    "tags": [
      "生产",
      "人工"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "materialTypeA"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "currentYearArtificialPercent"
    ],
    "conditions": [
      "materialTypeA",
      "currentYearArtificialPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "本期完工产品制造费用占比",
    "tags": [
      "生产",
      "制造费用"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "materialTypeA"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "currentYearManufacturingOverheadPercent"
    ],
    "conditions": [
      "materialTypeA",
      "currentYearManufacturingOverheadPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "本期完工产品动力占比",
    "tags": [
      "生产",
      "动力"
    ],
    "view": "bar",
    "dataArr": [],
    "groupBy": [
      "materialTypeA"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "currentYearPowerPercent"
    ],
    "conditions": [
      "materialTypeA",
      "currentYearPowerPercent"
    ],
    "chartOption": {}
  }, {
    "desc": "",
    "name": "定额本期本年单位成本对比表",
    "tags": [
      "生产",
      "动力"
    ],
    "view": "bar-label",
    "legend": {
      "data": [
        "定额",
        "本期",
        "本年"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "dataArr": [],
    "groupBy": [
      "materialTypeA"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "summation",
      "completeUnitSummation",
      "currentYearUnitSummation"
    ],
    "conditions": [
      "materialTypeA",
      "summation",
      "completeSummation",
      "currentYearSummation"
    ],
    "chartOption": {}
  },

  {
    "desc": "",
    "name": "本期各产品各费用占比",
    "tags": [
      "生产",
      "动力"
    ],
    "view": "pie",
    "legend": {
      "data": [
        "直接材料",
        "人工",
        "制造费用",
        "动力"
      ],
      "left": "center",
      "bottom": 10,
      "textStyle": {
        "color": "#fff"
      }
    },
    "dataArr": [],
    "groupBy": [
      "productName"
    ],
    "sqlname": "生产成本分析表",
    "aggregate": [
      "conpleteAmountPercent",
      "completeArtificial",
      "completeManufacturingOverheadPercent",
      "completePowerPercent"
    ],
    "conditions": [
      "productName",
      "conpleteAmountPercent",
      "completeArtificial",
      "completeManufacturingOverheadPercent",
      "completePowerPercent"
    ],
    "chartOption": {}
  }
  ]
}
// 报表指标
[
  {
    "desc": "",
    "name": "现金流量表",
    "view": "table",
    "dataArr": [],
    "sqlname": "现金流量表"
  }
]







[
  ['项目', '行次', '本年累计金额', '上年金额'],
  ['一、经营活动产生的现金流量：', null, null, null],
  ['销售商品、提供劳务收到的现金', 1, null, null],
  ['收到的税费返还', 2, null, null],
  ['收到的其他与经营活动有关的现金', 3, null, null],
  ['经营活动现金流入小计', null, null, null],
  ['购买商品、接受劳务支付的现金', 4, null, null],
  ['支付给职工以及为职工支付的现金', 5, null, null],
  ['支付的各项税费', 6, '资金报表!J32', null],
  ['支付的其他与经营活动有关的现金', 7, null, null],
  ['经营活动现金流出小计', null, null, null],
  ['经营活动产生的现金流量净额', null, null, null],
  ['二、投资活动产生的现金流量：', null, null, null],
  ['收回投资所收到的现金', 8, null, null],
  ['取得投资收益所收到的现金', 9, null, null],
  ['处置固定资产、无形资产和其他长期资产收回的现金净额', 10, null, null],
  ['处置子公司及其他营业单位收到的现金净额', 11, null, null],
  ['收到的其他与投资活动有关的现金', 12, null, null],
  ['投资活动现金流入小计', null, null, null],
  ['购建固定资产、无形资产和其他长期资产所支付的现金', 13, null, null],
  ['投资所支付的现金', 14, null, null],
  ['取得子公司及其他营业单位支付的现金净额', 15, null, null],
  ['支付的其他与投资活动有关的现金', 16, null, null],
  ['投资活动现金流出小计', null, null, null],
  ['投资活动产生的现金流量净额', null, null, null],
  ['三、筹资活动产生的现金流量：', null, null, null],
  ['吸收投资收到的现金', 17, null, null],
  ['借款所收到的现金', 18, null, null],
  ['收到的其他与筹资活动有关的现金', 19, null, null],
  ['筹资活动现金流入小计', null, null, null],
  ['偿还债务所支付的现金', 20, null, null],
  ['分配股利、利润或偿付利息所支付的现金', 21, null, null],
  ['支付的其他与筹资活动有关的现金', 22, null, null],
  ['筹资活动现金流出小计', null, null, null],
  ['筹资活动产生的现金流量净额', null, null, null],
  ['四、汇率变动对现金及现金等价物的影响', 23, null, null],
  ['五、现金及现金等价物净增加额', null, null, null],
  ['加:期初现金及现金等价物余额', 24, null, null],
  ['六、期末现金及现金等价物余额', null, null, null]
]

[
  ['一、偿债能力分析', null],
  ['1.流动比率＝流动资产÷流动负债', null],
  ['2.速动比率＝（流动资产－存货）÷流动负债', null],
  ['3.资产负债率＝（负债总额÷资产总额）×100%', null],
  ['4.产权比率=（负债总额 /股东权益）*100%', null],
  ['5.已获利息倍数=息税前利润 / 利息费用', null],
  ['6.或有负债比率＝或有负债余额/所有者权益总额', null],
  ['7.现金流动负债比=年经营活动现金净流量/期末流动负债', null],
  [null, null],
  ['二、营运能力分析', null],
  ['1. 总资产周转率＝主营业务收入÷总资产平均余额', null],
  ['2. 流动资产周转率＝主营业务收入÷流动资产平均余额', null],
  ['3. 应收账款周转率＝主营业务收入÷应收账款平均余额', null],
  ['4. 存货周转率（次数）=销售成本÷平均存货', null],
  [null, null],
  ['三、获利能力分析', null],
  ['销售毛利额(万元）＝主营业务收入－主营业务成本', null],
  ['1. 销售毛利率＝销售毛利额÷主营业务收入×100%', null],
  ['2. 销售净利率＝净利润÷主营业务收入×100%', null],
  ['3. 总资产收益率＝收益总额（息税前利润）÷平均资产总额×100%', null],
  ['4. 资产收益率＝净利润÷总资产平均余额', null],
  ['5. 净资产收益率=净利润/平均净资产×100%', null],
  ['6. 成本费用利润率＝利润总额/成本费用总额', null],
  ['7. 资本收益率＝净利润/平均资本（实收资本和资本公积年初年末平均数）', null],
  [null, null],
  ['四、现金流量分析', null],
  ['1. 现金流量比率＝经营活动现金净流量÷流动负债×100%', null],
  ['2. 购货付现比率=购买商品接受劳务支付的现金÷主营业务成本', null],
  ['3. 全部资产现金回收率=经营活动现金净流量 / 期末资产总额', null],
  ['4. 现金到期债务比=经营活动现金净流量/本期到期的债务（一年内到期的长期负债＋应付票据）', null],
  [null, null],
  ['五、发展能力分析', null],
  ['1.资产增长率=（本期资产增加额÷资产期初余额）×100% ', null],
  ['2.销售增长率=（本期营业收入增加额÷上期营业收入）×100% ', null],
  ['3.营业利润增长率=（本期营业利润增加额÷上期营业利润）×100% ', null],
  ['4.净利润增长率=（本期净利润增加额÷上期净利润）×100% ', null],
  ['5.资本保值增值率＝扣除客观因素年末所有者权益/年初所有者权益', null],
  ['6.资本积累率＝所有者权益增长率＝本年所有者权益增长额/年初所有者权益', null],
  ['7.技术投入比率＝本年科技支出/本年营业收入净额', null],
  [null, null],
  ['杜邦财务分析体系：(做图，具体取数面谈）', null],
  ['净资产收益率＝总资产净利率×权益乘数＝营业净利润（净利润/营业收入）×总资产周转率（营业收入/平均资产总额）×权益乘数（资产总额/所有者权益）', null]
]
