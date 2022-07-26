let VolunteerSchemas: Schemas = {}


VolunteerSchemas.VolunteerProfile = {
  className: "VolunteerProfile",
  name:"志愿者档案",
  desc: "学员信息档案管理",
  apps: ['volunteer'],
  detailTitle:"证书",
  detailPage:"/volunteer/volunteer/detail",
  displayedOperators:["detail","edit","delete"],
  displayedColumns:["userid","name","depart","mobile","idcard","isVerified"],
  fields: {
    name: {
      type: "String",
      name: "姓名",
      required:true
    },
    idcard: {
      type: "String",
      name: "身份证号",
      required:true
    },
    userid: {
      type: "String",
      name: "志愿编号",
      required:true
    },
    depart: {
      type: "String",
      name: "部门/科室"
    },
    gender: {
      type: "String",
      name: "性别"
    },
    mobile: {
      type: "String",
      name: "联系方式"
    },
    education: {
      type: "String",
      name: "文化"
    },
    work: {
      type: "String",
      name: "工作单位"
    },
    signDate: {
      type: "Date",
      name: "报名日期"
    },
    isVerified: {
      type: "Boolean",
      name: "激活状态"
    },
  }
}


VolunteerSchemas.VolunteerGroup = {
  className: "VolunteerGroup",
  name:"小组",
  desc: "开设志愿者小组及报名审核",
  apps: ['volunteer'],
  detailTitle:"报名",
  detailPage:"/common/manage/Volunteer",
  displayedOperators:["detail","edit"],
  displayedColumns:[
    "name",
    "course","classNum",
    // "people","peopleMax",
    "signFromTo","checkinFromTo","faceFromTo"],
  order:{signFromTo:"descend"},
  fields: {
    name: {
      type: "String",
      name: "小组名称",
    },
    course: {
      type: "Pointer",
      targetClass: "VolunteerCourse",
      name: "培训课程",
    },
    classNum: {
      type: "String",
      name: "小组编号",
      // desc: "<区号+年份+课程+月份+期数> 示例：079119020701",
      required:true
    },
    // people: {
    //   type: "Number",
    //   name: "报名人数",
    //   disabled: true
    // },
    // peopleMax: {
    //   type: "Number",
    //   name: "招生人数"
    // },
    signFromTo: {
      type: "Object",
      view: "date-from-to",
      name: "报名日期"
    },
    checkinFromTo: {
      type: "Object",
      view: "date-from-to",
      name: "报到日期"
    },
    faceFromTo: {
      type: "Object",
      view: "date-from-to",
      name: "面授日期"
    },
    isVerified: {
      type: "Boolean",
      name: "审核状态"
    },
  }
}

  VolunteerSchemas.VolunteerCourse = {
    className: "VolunteerCourse",
    name:"课程",
    desc: "志愿者课程相关信息",
    apps: ['volunteer'],
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

export {VolunteerSchemas}
