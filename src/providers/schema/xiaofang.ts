let XiaofangSchemas: Schemas = {}
XiaofangSchemas.Xiaofang_course = {
  className: "Xiaofang_course",
  name:"课程",
  desc: "消防课程相关信息",
  apps: ['xiaofang'],
  displayedOperators:["edit"],
  displayedColumns:["title","category","status","level","isVerified"],
  fields: {
    title: {
      type: "String",
      name: "课程名称"
    },
    category: {
      type: "String",
      name: "课程分类"
    },
    status: {
      type: "String",
      name: "课程状态"
    },
    level: {
      type: "String",
      name: "课程级别"
    },
    isVerified: {
      type: "Boolean",
      name: "审核状态"
    },
  }
}


XiaofangSchemas.Xiaofang_class = {
  className: "Xiaofang_class",
  name:"班级",
  desc: "开设班级及学员报名",
  apps: ['xiaofang'],
  detailTitle:"报名",
  detailPage:"/common/manage/Xiaofang_student",
  displayedOperators:["detail","edit"],
  displayedColumns:["course","classNum","peopleMax","signFromTo","faceFromTo"],
  order:{signFromTo:"descend"},
  fields: {
    course: {
      type: "Pointer",
      targetClass: "Xiaofang_course",
      name: "培训课程",
    },
    classNum: {
      type: "String",
      name: "班级编号",
      desc: "<区号+年份+课程+月份+期数> 示例：079119020701",
      required:true
    },
    signFromTo: {
      type: "Object",
      view: "date-from-to",
      name: "报名日期",
      required:true
    },
    faceFromTo: {
      type: "Object",
      view: "date-from-to",
      name: "面授日期",
      required:true
    },
    people: {
      type: "Number",
      name: "报名人数",
      disabled: true
    },
    peopleMax: {
      type: "Number",
      name: "招生人数"
    },
    checkinFromTo: {
      type: "Object",
      view: "date-from-to",
      name: "报到日期",
    },
    isVerified: {
      type: "Boolean",
      name: "审核状态"
    },
  }
}

XiaofangSchemas.Xiaofang_student = {
    className: "Xiaofang_student",
    name:"学员",
    desc: "学员信息档案管理",
    apps: ['xiaofang'],
    detailTitle:"证书",
    include:["class.course"],
    detailPage:"/xiaofang/student/detail",
    displayedOperators:["detail","edit","delete"],
    displayedColumns:["name","stuNum","work","gender","mobile","invoice","payee","certDate"],
    order:{stuNum:"ascend"},
    fields: {
      name: {
        type: "String",
        name: "姓名",
        required:true
      },
      class: {
        type: "Pointer",
        targetClass: "Xiaofang_class",
        name: "所属班级",
        required:true
      },
      idcard: {
        type: "String",
        name: "身份证号",
        required:true
      },
      stuNum: {
        type: "String",
        name: "学号",
        desc: "<报名序号> 示例：001 002 003 004",
        required:true
      },
      gender: {
        type: "String",
        name: "性别",
        required:true

      },
      mobile: {
        type: "String",
        name: "联系方式",
        required:true

      },
      education: {
        type: "String",
        name: "文化"
      },
      work: {
        type: "String",
        name: "工作单位"
      },
      invoice: {
        type: "String",
        name: "开票记录",
        "view": "edit-select",
        default:"none",
       "options": [{label:"未开票",value:"none"},{label:"普票",value:"plain"},{label:"专票",value:"special"}]
      },
      payee: {
        type: "String",
        name: "收款人"
      },
      signDate: {
        type: "Date",
        name: "报名日期"
      },
      certDate: {
        type: "Date",
        name: "证书发放日期"
      },
      certNum: {
        type: "String",
        name: "结业证书编号",
        desc: "学号的区号变为城市简称，示例：NC19020701003",
      },
      scoreTheoCompletion: {
        type: "Number",
        name: "理论结业成绩"
      },
      scorePracCompletion: {
        type: "Number",
        name: "实操结业成绩"
      },
      scoreTheoVerify: {
        type: "String",
        name: "理论鉴定成绩"
      },
      scorePracVerify: {
        type: "String",
        name: "实操鉴定成绩"
      }
    }
  }


export {XiaofangSchemas}
