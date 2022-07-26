let ProductPaperSchemas: Schemas = {}
/* 上进试卷Schema
ProductPaperSchemas.ProductPaper = {
  className: "ProductPaper",
  name: "产品",
  desc: "产品",
  include:["cate"],
  apps: ['product-paper'],
  displayedOperators:["edit","delete"],
  displayedColumns:["title","desc","cate"],
  fields: {
    cover: {
      type: "Array",
      name: "封面",
      view: "edit-image"
    },
    title: {
      type: "String",
      name: "产品名"
    },
    desc: {
      type: "String",
      name: "简介"
    },
    tag: {
      type: "Array",
      name: "标签",
      view: "anas-edit-tag"
    },
    tagDesc: {
      type: "String",
      name: "标签描述",
      view: "textarea-tinymce"
    },
    cate: {
      type: "Pointer",
      targetClass: "Category",
      targetType: "productPaper",
      name: "所属系列",
    },
    // categoryGrade: {
    //   type: "String",
    //   name: "年级",
    //   view: "anas-edit-radio",
    //   options: [ '高一', '高二', '高三', '初一', '初二', '初三','小学一年级', '小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级']
    // },
    // categorySubject: {
    //   type: "String",
    //   name: "科目",
    //   view: "anas-edit-radio",
    //   options: ['语文', '数学（文）', '数学（理）', '英语', '政治', '历史', '地理', '物理', '化学', '生物']
    // },
    // attachment: {
    //   type: "Array",
    //   name: "附件",
    //   view: "anas-edit-attachment",
    // },
    yuwen: {
      type: "Array",
      name: "上传语文样卷",
      view: "anas-edit-attachment",
    },
    shuxue: {
      type: "Array",
      name: "上传数学样卷",
      view: "anas-edit-attachment",
    },
    wenshu: {
      type: "Array",
      name: "上传文科数学样卷",
      view: "anas-edit-attachment",
    },
    lishu: {
      type: "Array",
      name: "上传理科数学样卷",
      view: "anas-edit-attachment",
    },
    yingyu: {
      type: "Array",
      name: "上传英语样卷",
      view: "anas-edit-attachment",
    },
    zhengzhi: {
      type: "Array",
      name: "上传政治样卷",
      view: "anas-edit-attachment",
    },
    lishi: {
      type: "Array",
      name: "上传历史样卷",
      view: "anas-edit-attachment",
    },
    dili: {
      type: "Array",
      name: "上传地理样卷",
      view: "anas-edit-attachment",
    },
    wuli: {
      type: "Array",
      name: "上传物理样卷",
      view: "anas-edit-attachment",
    },
    huaxue: {
      type: "Array",
      name: "上传化学样卷",
      view: "anas-edit-attachment",
    },
    shengwu: {
      type: "Array",
      name: "上传生物样卷",
      view: "anas-edit-attachment",
    },
    lizong: {
      type: "Array",
      name: "上传理综样卷",
      view: "anas-edit-attachment",
    },
    wenzong: {
      type: "Array",
      name: "上传文综样卷",
      view: "anas-edit-attachment",
    },
    productDescription: {
      type: "Array",
      name: "上传产品说明(pdf)",
      view: "anas-edit-attachment",
    },
  }
}
*/
export {ProductPaperSchemas}
