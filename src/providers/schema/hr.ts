let HrSchemas: any = {}
HrSchemas.SalaryRule = {
  className: "SalaryRule",
  desc: "薪酬规则，各个公司定制各自薪酬项目及规则。",
  apps: ['hr'],
  fields: {
    name: {
      type: "String",
      name: "薪酬规则"
    },
    period: {
      type: "Object",
      name: "薪酬周期",
      example: {
        startMon: "上一月", //[上一月,当前月,下一月]
        startDay: "8",
        endMon: "当前月", //[上一月,当前月,下一月]
        endDay: "7",
      }
    },
    company: {
      type: "Pointer",
      targetClass: "Company",
      name: "公司"
    },
    comment: {
      type: "String",
      name: "备注"
    },
    item: {
      type: "Array",
      targetClass: "SalaryItem",
      name: "薪酬项目",
      default: [
        { name: "基础工资", remark: "底薪", type: "基础收入", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: true, isEdit: true, isInherit: true },
        { name: "岗位工资", remark: "职位工资", type: "基础收入", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: true, isEdit: true, isInherit: true },
        { name: "职务工资", remark: "", type: "基础收入", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: true, isEdit: true, isInherit: true },
        { name: "工龄工资", remark: "年功工资", type: "基础收入", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: true, isEdit: true, isInherit: true },

        { name: "岗位津贴", remark: "特种岗位、职业危害岗位、岗位技能、劳动津贴", type: "津贴补贴", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: false, isEdit: true, isInherit: false },
        { name: "出差补贴", remark: "", type: "津贴补贴", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: false, isEdit: true, isInherit: false },
        { name: "食宿补贴", remark: "伙食、夜宵、住房、安家、环境", type: "津贴补贴", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: false, isEdit: true, isInherit: false },
        { name: "交通补贴", remark: "", type: "津贴补贴", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: false, isEdit: true, isInherit: false },
        { name: "通讯补贴", remark: "", type: "津贴补贴", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: false, isEdit: true, isInherit: false },

        { name: "绩效工资", remark: "", type: "绩效收入", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: false, isEdit: true, isInherit: false },
        { name: "绩效工资标准", remark: "", type: "绩效收入", isStart: false, isIncome: false, isExpenditure: false, isTax: false, isChange: false, isEdit: true, isInherit: false },
        { name: "员工考核系数", remark: "", type: "绩效收入", isStart: false, isIncome: false, isExpenditure: false, isTax: false, isChange: false, isEdit: true, isInherit: false },

        { name: "月度奖金", remark: "", type: "奖金", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: false, isEdit: true, isInherit: false },

        { name: "养老保险", remark: "", type: "社保支出", isStart: true, isIncome: false, isExpenditure: true, isTax: false, isChange: false, isEdit: true, isInherit: true },
        { name: "医疗保险", remark: "", type: "社保支出", isStart: true, isIncome: false, isExpenditure: true, isTax: false, isChange: false, isEdit: true, isInherit: true },
        { name: "失业保险", remark: "", type: "社保支出", isStart: true, isIncome: false, isExpenditure: true, isTax: false, isChange: false, isEdit: true, isInherit: true },
        { name: "住房公积金", remark: "", type: "社保支出", isStart: true, isIncome: false, isExpenditure: true, isTax: false, isChange: false, isEdit: true, isInherit: true },
        { name: "其他保险", remark: "企业年金", type: "社保支出", isStart: true, isIncome: false, isExpenditure: true, isTax: false, isChange: false, isEdit: true, isInherit: false },

        { name: "考勤扣款", remark: "", type: "扣补项", isStart: true, isIncome: false, isExpenditure: true, isTax: false, isChange: false, isEdit: false, isInherit: false },
        { name: "其他扣款", remark: "伙食费代扣、住宿费代扣、物业费代扣、物品损坏、旅游扣款", type: "扣补项", isStart: true, isIncome: false, isExpenditure: true, isTax: false, isChange: false, isEdit: true, isInherit: false },
        { name: "加班费", remark: "", type: "扣补项", isStart: true, isIncome: true, isExpenditure: false, isTax: true, isChange: false, isEdit: true, isInherit: false },
        { name: "其他补款", remark: "", type: "扣补项", isStart: true, isIncome: true, isExpenditure: false, isTax: false, isChange: false, isEdit: true, isInherit: false },

        { name: "个人所得税", remark: "", type: "合计项", isStart: true, isIncome: false, isExpenditure: false, isTax: false, isChange: false, isEdit: false, isInherit: false },
        { name: "社保合计", remark: "", type: "合计项", isStart: true, isIncome: false, isExpenditure: false, isTax: false, isChange: false, isEdit: false, isInherit: false },
        { name: "应发工资", remark: "", type: "合计项", isStart: true, isIncome: false, isExpenditure: false, isTax: false, isChange: false, isEdit: false, isInherit: false },
        { name: "应纳税所得额", remark: "", type: "合计项", isStart: true, isIncome: false, isExpenditure: false, isTax: false, isChange: false, isEdit: false, isInherit: false },
        { name: "应扣合计", remark: "", type: "合计项", isStart: true, isIncome: false, isExpenditure: false, isTax: false, isChange: false, isEdit: false, isInherit: false },
        { name: "实发工资", remark: "", type: "合计项", isStart: true, isIncome: false, isExpenditure: false, isTax: false, isChange: false, isEdit: false, isInherit: false },

        { name: "实际出勤天数", remark: "", type: "其他", isStart: true, isIncome: false, isExpenditure: false, isTax: false, isChange: false, isEdit: true, isInherit: false },
      ]
    }
  }
}

HrSchemas.SalaryItem = {
  className: "SalaryItem",
  desc: "薪酬项目，各个公司薪酬项目结构。",
  apps: ['hr'],
  fields: {
    name: {
      type: "String",
      name: "项目名称"
    },
    remark: {
      type: "String",
      name: "备注"
    },
    type: {
      type: "String",
      name: "项目类型",
      view: "anas-edit-radio",
      options: ["基础收入", "津贴补贴", "绩效收入", "福利", "奖金", "社保支出", "扣补项", "合计项", "其他项"]
    },
    isStart: {
      type: "Boolean",
      name: "是否启用项",
      view: "anas-edit-radio"
    },
    isIncome: {
      type: "Boolean",
      name: "是否收入项",
      view: "anas-edit-radio"
    },
    isExpenditure: {
      type: "Boolean",
      name: "是否支出项",
      view: "anas-edit-radio"
    },
    isTax: {
      type: "Boolean",
      name: "是否计税项",
      view: "anas-edit-radio"
    },
    isChange: {
      type: "Boolean",
      name: "是否调薪项",
      view: "anas-edit-radio"
    },
    isEdit: {
      type: "Boolean",
      name: "是否编辑项",
      view: "anas-edit-radio"
    },
    isInherit: {
      type: "Boolean",
      name: "是否继承项",
      view: "anas-edit-radio"
    }
  }
}

HrSchemas.SalaryRoll = {
  className: "SalaryRoll",
  desc: "薪资核算，记录当月核算的工资单。",
  apps: ['hr'],
  fields: {
  }
}
HrSchemas.SalaryRollLog = {
  className: "SalaryRollLog",
  desc: "薪资记录，记录已发放结算的工资单。",
  apps: ['hr'],
  fields: {
  }
}
HrSchemas.Position = {
  className: "Position",
  desc: "职位，各部门职位信息。",
  apps: ['hr'],
  fields: {
    name: {
      type: "String",
      name: "职位名称",
    },
    department: {
      type: "Pointer",
      targetClass: "Department",
      name: "所属组织",
      view: "just-show"
    },
    duty: {
      type: "String",
      name: "职责说明",
    },
    requirement: {
      type: "String",
      name: "任职要求",
    },
    remark: {
      type: "String",
      name: "补充说明",
    },
    state: {
      type: "String",
      name: "当前状态",
      view: "anas-edit-radio",
      options: ["关闭", "在招", "满员"]
    },
    exp: {
      type: "String",
      name: "工作经验",
      view: "anas-edit-radio",
      options: ["不限", "应届", "1年以下", "1-3年", "2-5年", "5年以上"]
    },
    study: {
      type: "String",
      name: "学历",
      view: "anas-edit-radio",
      options: ["不限", "大专", "本科", "硕士及以上"]
    },
    sex: {
      type: "String",
      name: "性别",
      view: "anas-edit-radio",
      options: ["不限", "男", "女"]
    },
    attachment: {
      type: "Object",
      name: "附件",
      view: "anas-uploader"
    }
  }
}

export {HrSchemas}
