let LessonSchemas: any = {};

// 课程列表
LessonSchemas.Lesson = {
  className: "Lesson",
  name: "课程",
  desc: "管理您的课程信息",
  apps: ["lesson"],
  displayedOperators: ["detail", "edit", "delete"],
  displayedColumns: ["title", "price", "sort", "tag", "status"],
  detailTitle: "章节管理",
  detailPage: "common/manage/LessonArticle",
  fields: {
    types:{
        "name": "分类",
        "type": "String",
        "view": "edit-select",
        "options": [
          {
            "label": "学分",
            "value": "score"
          },
          {
            "label": "统考",
            "value": "test"
          }
        ]
    },
    title: {
      type: "String",
      name: "标题",
    },
    price: {
      type: "Number",
      name: "价格",
    },
    credit: {
      type: "Number",
      name: "学分",
    },
    time: {
      type: "Date",
      name: "开课时间",
    },
    detail: {
      type: "String",
      name: "详情",
      view: "editor-tinymce",
      col: 24,
    },
    type: {
      type: "Pointer",
      name: "类型",
      targetClass: "Category",
      targetType: "lesson",
    },
    teacher: {
      type: "String",
      name: "讲师",
    },
    teacherImg:{
      type:"String",
      name:'讲师头像',
      view:"edit-image"
    },
    image: {
      type: "String",
      name: "封面图",
      view: "edit-image",
    },
    images: {
      type: "Array",
      name: "图片列表",
      view: "edit-image",
    },
    area: {
      type: "String",
      name: "所在地",
    },
    status: {
      type: "Boolean",
      name: "上架",
    },
    total: {
      type: "Number",
      name: "库存数",
    },
    sale: {
      type: "Number",
      name: "已出售数",
    },
    tag: {
      type: "Array",
      name: "标签",
      group: "normal",
    },
    singleMaxPurchase: {
      type: "String",
      name: "单次最多购买",
    },
    singleMinPurchase: {
      type: "String",
      name: "单次最少购买",
    },
    maxPurchase: {
      type: "String",
      name: "最多购买",
    },
    sort: {
      type: "Number",
      name: "排序",
    },
  },
};

// 课程详情 目录,章节
LessonSchemas.LessonArticle = {
  className: "LessonArticle",
  name: "章节",
  desc: "管理文章章节信息",
  apps: ["lesson"],
  displayedOperators: ["edit", "delete"],
  displayedColumns: ["title", "type", "parent"],
  fields: {
    lesson: {
      type: "Pointer",
      targetClass: "Lesson",
      name: "所属课程",
    },
    parent: {
      type: "Pointer",
      targetClass: "LessonArticle",
      name: "上级章节",
    },
    title: {
      type: "String",
      name: "标题",
    },
    desc: {
      type: "String",
      name: "描述",
    },
    watch:{
      type:"Number",
      name:"视频观看状态,0(未观看)1(正在看)2(已看完)"
    },
    type: {
      type: "String",
      name: "类型",
      desc: "设置该章节内容类型",
      color: "blue",
      view: "edit-select",
      default: "exam",
      options: [
        { label: "图文", value: "article" },
        { label: "视频", value: "video" },
        { label: "音频", value: "audio" },
      ],
      required: true,
    },
    audioUrl: {
      type: "String",
      name: "音频地址",
      condition: {
        type: "audio",
      },
    },
    videoUrl: {
      type: "String",
      name: "视频地址",
      condition: {
        type: "video",
      },
    },
    content: {
      name: "章节内容",
      type: "String",
      view: "editor-tinymce",
      col: 24,
    },
    isEnabled: {
      name: "是否开启",
      type: "Boolean",
    },
  },
};
// 课程订单
LessonSchemas.LessonOrder = {
  className: "LessonOrder",
  desc: "课程订单",
  apps: ["lesson"],
  displayedOperators: ["edit", "delete"],
  displayedColumns: ["name", "price", "sort", "tag", "status"],
  fields: {
    lesson: {
      type: "Pointer",
      targetClass: "Lesson",
      name: "相关课程",
    },
    price: {
      type: "Number",
      name: "金额",
    },
    credit: {
      type: "Number",
      name: "学分",
    },
    status: {
      type: "Number",
      name: "状态",
    },
    payType: {
      type: "Number",
      name: "支付方式",
    },
    user: {
      type: "Pointer",
      targetClass: "_User",
      name: "购买用户",
    },
  },
};
// 学习记录
LessonSchemas.LessonRecord = {
  className: "LessonRecord",
  desc: "课程表",
  apps: ["lesson"],
  displayedOperators: ["edit", "delete"],
  displayedColumns: ["lesson", "user", "time"],
  fields: {
    lesson: {
      type: "Pointer",
      targetClass: "Lesson",
      name: "课程",
    },
    lessonArticle: {
      type: "Pointer",
      targetClass: "LessonArticle",
      name: "所学章节",
    },
    user: {
      type: "Pointer",
      targetClass: "_User",
      name: "用户",
    },
    time: {
      type: "Number",
      name: "时长",
    },
  },
};

// 课程老师
LessonSchemas.LessonTeacher = {
  className: "LessonTeacher",
  desc: "课程老师",
  apps: ["lesson"],
  displayedOperators: ["edit", "delete"],
  displayedColumns: ["name", "phone", "isVerify"],
  fields: {
    name: {
      type: "String",
      name: "老师称呼",
    },
    phone: {
      type: "String",
      name: "手机",
    },
    user: {
      type: "Pointer",
      name: "用户",
      targetClass: "_User",
    },
    isVerify: {
      type: "Boolean",
      name: "审核通过",
    },
  },
};

export { LessonSchemas };
