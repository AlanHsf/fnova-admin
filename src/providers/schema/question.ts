let QuestionSchemas: any = {}
QuestionSchemas.Question = {
  className: "Question",
  name: "试卷",
  detailTitle: "题目",
  detailPage: "/common/manage/QuestionItem",
  qrUrl:"https://pwa.futurestack.cn/question/${objectId};c=${company}",
  "displayedColumns": ["title", "type", "order", "isEnabled"],
  "displayedOperators": ["qrcode","detail", "edit", "delete"],
  "desc": "试卷参与评分排行，问卷不评分仅做调查使用",
  "apps": ['question'],
  "fields": {
    "title": {
      required: true,
      "type": "String",
      "name": "标题",
      "icon": "star"
    },
    "type": {
      required: true,
      "type": "String",
      "name": "类型",
      "desc": "试卷参与评分排行，问卷不评分",
      "color": "blue",
      "view": "edit-select",
      default: "exam",
      "options": [{ label: "问卷", value: "survey" }, { label: "试卷", value: "exam" }, { label: "快评", value: "quick" }]
    },
    "desc": {
      "type": "String",
      "name": "描述"
    },
    "time": {
      "type": "Number",
      "name": "答题时长",
      "desc": "不填写即为不限时",
      "default": 0,
    },
    "showType": {
      required: true,
      "type": "Number",
      "name": "显示类型",
      "desc": "试卷参与评分排行，问卷不评分",
      "color": "blue",
      "view": "edit-select",
      default: 1,
      "options": [{ label: "单页显示", value: 1 }, { label: "多页显示", value: 2 }]
    },
    "order": {
      "type": "Number",
      "name": "排序"
    },
    "itemCount": {
      "type": "Number",
      "name": "抽题数量"
    },
    "isEnabled": {
      "type": "Boolean",
      "name": "启用"
    },
    
    
    /*  快评问卷参数设置：
    */
    "quickOptions": {
      "type": "Array",
      "name": "快评选项",
      "view": "edit-survey-options",
      "default": [
        { check: true, value: "A", grade: 1.2 }, { check: true, value: "B", grade: 1.0 }, { check: true, value: "C", grade: 0.8 }
      ],
      condition: {
        type: "quick"
      }
    },
    
    "gradePass": {
      "type": "Number",
      "name": "分数线"
    },
    "printTep": {
      "type": "String",
      "view": "edit-template",
      "name": "打印模版编辑"
    },
  }
}

QuestionSchemas.QuestionItem = {
  "className": "QuestionItem",
  name: "题目",
  "displayedColumns": ["title", "type","index", "isEnabled"],
  "displayedOperators": ["edit", "delete"],
  "desc": "题目",
  "apps": ['question'],
  "fields": {
    "title": {
      required: true,
      "type": "String",
      "name": "题干",
      "desc": "这里填写题目描述",
      "view": "textarea"
    },
    "answer": {
      "type": "String",
      "name": "解析",
      "desc": "这里填写该问题对应的答案解释",
      "view": "textarea"
    },
    "desc": {
      "type": "String",
      "name": "描述",
      "desc": "这里填写该问题的具体描述",
      "view": "textarea"
    },
    "type": {
      "type": "String",
      "name": "题目类型",
      "view": "edit-select",
      default: "select-single",
      "options": [{ label: "单选", value: "select-single" }, { label: "多选", value: "select-multiple" }, { label: "输入", value: "text" }]
    },
    "module": {
      "type": "Array",
      "desc": "统计是会按知识模块，统计模块得分分析数据。",
      "name": "知识模块",
    },
    "options": {
      "type": "Array",
      "name": "选项",
      "view": "edit-survey-options",
      "default": [
        { check: true, value: null, label: 'A' }, { check: false, value: null, label: 'A' }
      ]
    },
    "difficulty": {
      "type": "String",
      "name": "题目难度",
      "view": "edit-select",
      "default": "select-single",
      "options": [{ label: "简单", value: "easy" }, { label: "普通", value: "normal" }, { label: "困难", value: "hard" }]
    },
    "qsurvey": {
      "type": "Pointer",
      "targetClass": "Question",
      "name": "所属问卷",
    },
    "index": {
      "type": "Number",
      "name": "排序",
    },
    "isEnabled": {
      "type": "Boolean",
      "name": "启用"
    },
    "isShowTable": {
      "type": "Boolean",
      "name": "是否显示表格"
    }
  }
},
  

  QuestionSchemas.SurveyLogTest = {
  "className": "SurveyLogTest",
  "name": "问卷结果",
  "displayedColumns": ["survey", "sex", "department","part"],
  "displayedOperators": ["detail","print", "edit", "delete"],
  "desc": "问卷显示结果显示",
  "apps": ['question'],
  "fields": {
    "survey": {
      "type": "Pointer",
      "targetClass": "Question",
      "name": "所属问卷",
      "view": "just-show"
    },
    "sex": {
      "type": "String",
      "name": "性别"
    },
    "name": {
      "type": "String",
      "name": "姓名"
    },
    "department": {
      "type": "String",
      "name": "科室"
    },
    "part": {
      "type": "String",
      "name": "岗位"
    },
    "answers": {
      "type": "Array",
      "name": "答案"
    },
    "grades": {
      "type": "Array",
      "name": "得分"
    },
    "userTime": {
      "type": "Number",
      "name": "使用时间"
    },
    "user": {
      "type": "Pointer",
      "targetClass": "_User",
      "name": "用户",
      "view": "just-show"
    },
    "area": {
      "type": "String",
      "name": "院区"
    },
    "technicalTitle": {
      "type": "String",
      "name": "职称"
    },
  }
}


export { QuestionSchemas }
