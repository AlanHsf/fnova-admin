let HR360Schemas: any = {}
HR360Schemas.Evaluation = {
  className: "Evaluation",
  name:"评比计划",
  detailTitle:"任务",
  detailPage:"/common/manage/EvaluationTask",
  qrUrl:"https://pwa.futurestack.cn/evaluation/${objectId};c=${company}",
  // typeName:{
  //   exam:"测试",
  //   survey:"问卷"
  // },
  "displayedColumns":["title","type","isEnabled"],
  "displayedOperators":["qrcode","detail","edit","delete"],
  "desc": "注意：所有当前会以校验日期抽取信息。",
  "apps": ['hr360'],
  "fields": {
    "title": {
      required:true,
      "type": "String",
      "name": "标题",
      "icon": "star"
    },
    "type": {
      required:true,
      "type": "String",
      "name": "类型",
      "view": "edit-select",
      default:"exam",
      "options": [{label:"季度考评",value:"quarter"},{label:"年度考评",value:"annual"},{label:"党建考评",value:"party"},{label:"部门考评",value:"depart"},]
    },
    "desc": {
      "type": "String",
      "name": "描述"
    },
    "isEnabled": {
      "type": "Boolean",
      "name": "启用"
    },
    // 评比基础参数设置
    "validDate": {
      type: "Date",
      desc:"档案基础信息、证书信息等，会以校验日期为节点从系统提取。",
      name: "校验日期"
    },
    // 评比问卷功能设置
    "survey": {
      "type": "Pointer",
      "desc": "选择考评所用问卷，留空则不计算问卷得分。",
      "targetClass": "Survey",
      "name": "评比问卷",
    },
    "scaleOptions":{ // 打分结果比例分布限制
      type:'Object',
      desc:`{
        "A": {
            "type": "lt",
            "value": "0.3"
        },
        "C": {
            "type": "gt",
            "value": "0.2"
        }
    }`,
      name:"分布比例"
    },
    "factorOptions":{ // 个人系数设置参数
      type:'Object',
      desc:`{
        "name": 1,
        "idcard": 1,
        "workid": 1,
    }`,
      name:"个人系数"
    }

}
}

HR360Schemas.EvaluationTask = {
  "className": "EvaluationTask",
  name:"评比任务",
  "displayedColumns":["profile","name","title","matchCount"],
  "displayedOperators":["edit","delete"],
  "apps": ['hr360'],
  "fields": {
    "evaluation": {
      "type": "Pointer",
      "targetClass": "Evaluation",
      "name": "所属评比",
    },
    "name":{
      "type": "String",
      "desc": "填写本次考评小组的名字",
      "name": "任务名称"
    },
    "profile": {
      "type": "Pointer",
      "targetClass": "Profile",
      "name": "考评人",
    },
    "title": {
      "type": "String",
      "name": "称号"
    },
    matchRule:{
      "type": "Array",
      "view": "edit-profile-match",
      "desc": "按此规则匹配受评人列表",
      "name": "匹配规则",
    },
    matchCount:{
      "type": "Number",
      name:"任务数量",
      show:false
    },
    matchDepart:{
      name: "参评部门",
      type: "Array",
      view:"pointer-array",
      targetClass: "Department",
      "desc":"选择被考评部门名单（限部门考评生效）"
    }
  }
}

HR360Schemas.EvaluationLog = {
  "className": "EvaluationLog",
  name:"评比成绩",
  "displayedColumns":["profile","score","isEnabled"],
  "displayedOperators":["edit","delete"],
  "apps": ['hr360'],
  "fields": {
    "evaluation": {
      "type": "Pointer",
      "targetClass": "Evaluation",
      "name": "所属评比",
    },
    "profile": {
      "type": "Pointer",
      "targetClass": "Profile",
      "name": "受评人",
    },
    "score": {
      "type": "Number",
      "name": "最终分数",
    },
    "baseScore": {
      "type": "Number",
      "name": "基础分数",
    },
    "surveyScore": {
      "type": "Number",
      "name": "问卷分数",
    },
    "up": {
      "type": "Object",
      "desc":"{count:2,score:90,sum:180,right:0.5}",
      "name": "上级打分",
    },
    "same": {
      "type": "Object",
      "desc":"{count:2,score:90,sum:180,right:0.3}",
      "name": "平级打分",
    },
    "down": {
      "type": "Object",
      "desc":"{count:2,score:90,sum:180,right:0.2}",
      "name": "下级打分",
    },
    "module":{
      "type": "Object",
      "desc":"{'组织能力':80,'执行能力':90,'遵守纪律':75}",
      "name": "模块分数",
    },
  }
}

export {HR360Schemas}
