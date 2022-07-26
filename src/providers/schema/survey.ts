let SurveySchemas: any = {}
SurveySchemas.Survey = {
  className: "Survey",
  name: "试卷",
  detailTitle: "题目",
  detailPage: "/common/manage/SurveyItem",
  // typeName:{
  //   exam:"测试",
  //   survey:"问卷"
  // },
  "displayedColumns": ["title", "type", "order", "isEnabled"],
  "displayedOperators": ["detail", "edit", "delete"],
  "desc": "试卷参与评分排行，问卷不评分仅做调查使用",
  "apps": ['survey'],
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
    /* 更多配置项——考试设置：
     * 考前校验密码：开启后，考生需填写正确的考试密码才能进入考试
     * 考试迟到限时：开启后，当考试已开始的时长超过迟到限时后，考生无法进入考试
     * 最短答题时长：开启后，考生开始答题后必须达到设置时长才能交卷
     * 防作弊功能：
     * * 切换页面超过__次强制交卷
     * * 答题时超过__秒没有新操作会强制交卷 
     * * 答题时随机拍照 
     * *  考前__分钟开始身份认证 
     */
    /* 更多配置项——成绩设置：
     * 显示成绩：考后显示成绩 批改后显示成绩
     * 查看试卷：显示正确答案和解析 不显示正确答案和解析
     * 显示击败百分比
     * 显示名次
     * 显示排行榜 
     * 显示批改评语 
     * 显示系统评语 
     * 微信红包 
     * 微信分享 
     * 考试结束语
     */
    "gradePass": {
      "type": "Number",
      "name": "分数线"
    },
  }
}

SurveySchemas.SurveyItem = {
  "className": "SurveyItem",
  name: "题目",
  "displayedColumns": ["title", "type", "isEnabled"],
  "displayedOperators": ["edit", "delete"],
  "desc": "题目",
  "apps": ['survey'],
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
    "type": {
      "type": "String",
      "name": "题目类型",
      "view": "edit-select",
      default: "select-single",
      "options": [{ label: "单选", value: "select-single" }]
    },
    "module": {
      "type": "Array",
      "desc": "统计是会按知识模块，统计模块得分分析数据。",
      "name": "hsdjfhwsjkdf",
    },
    "options": {
      "type": "Array",
      "name": "选项",
      "view": "edit-survey-options",
      "default": [
        { check: true, value: null, label: 'A' }, { check: false, value: null, label: 'B' }
      ]
    },
    // 输入
    "text": {
      "type": "Number",
      
    },
    "difficulty": {
      "type": "String",
      "name": "题目难度",
      "view": "edit-select",
      "default": "select-single",
      "options": [{ label: "简单", value: "easy" }, { label: "普通", value: "normal" }, { label: "困难", value: "hard" }]
    },
    "survey": {
      "type": "Pointer",
      "targetClass": "Survey",
      "name": "所属问卷",
    },
    "index": {
      "type": "Number",
      "name": "排序",
    },
    "isEnabled": {
      "type": "Boolean",
      "name": "启用"
    }
  }
}

SurveySchemas.SurveyLog = {
  "className": "SurveyLog",
  name: "答卷",
  "desc": "考生所提交的答卷",
  "apps": ['survey'],
  "fields": {

    "survey": {
      "type": "Pointer",
      "targetClass": "Survey",
      "name": "所属问卷",
      "view": "just-show"
    },

    "user": {
      "type": "Pointer",
      "targetClass": "_User",
      "name": "用户",
      "view": "just-show"
    },
    "answer": {
      "type": "Object",
      "name": "回答",
    },
    "quickAnswer": {
      "type": "String",
      "name": "快评选择结果",
    },
    "grade": {
      "type": "Number",
      "name": "分数",
    },
    "right": {
      "type": "Number",
      "name": "正确数",
    },
    "wrong": {
      "type": "Number",
      "name": "错误数",
    },
    "openid": {
      "type": "String",
      "name": "系统OPENID",
    }
  }
}
export { SurveySchemas }
