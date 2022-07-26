let NoteSchemas: any = {}
NoteSchemas.NoteSpace = {
  "className": "NoteSpace",
  "desc": "空间，协作空间",
  "apps": ['note'],
  displayedOperators:["edit","delete"],
  displayedColumns:["title","logo"],
  "fields": {
    "title": {
      "name":"空间名称",
      "type": "String"
    },
    
    "logo": {
      "name":"空间LOGO",
      "type": "String",
      "view":"edit-image"
    },
    "desc": {
        "name":"空间描述",
        "type": "String",
        "view":"textarea"
      },
    type: {
        "type": "String",
        "name": "空间类型",
        "desc": "选择要创建文档的类型",
        "color": "blue",
        "view": "edit-select",
        default:"document",
        "options": [{label:"笔记空间",value:"document"},{label:"项目WIKI",value:"project"}],
        required:true,
    },
    "project":{
        type: "Pointer",
        targetClass: "Project",
        name: "所属项目",
        condition:{
            type:"project"
        }
    }
  }
}
NoteSchemas.NotePad = {
  "className": "NotePad",
  "desc": "文档，协作面板",
  displayedColumns:["cover","title","tag","src"],
  displayedOperators:["edit","delete"],
  "apps": ['site'],
  "fields": {
    "title": {
        "type": "String",
        "name": "文档标题",
    },
    space:{
      type: "Pointer",
      targetClass: "NotePad",
      name:"所属空间",
      show:false,
    },
    type: {
        "type": "String",
        "name": "类型",
        "desc": "选择要创建文档的类型",
        "color": "blue",
        "view": "edit-select",
        default:"etherpad",
        "options": [{label:"协作文档",value:"etherpad"},{label:"MD文档",value:"markdown"}],
        required:true,
      },
    "tag": {
      "type": "Array",
      "name": "标签",
      "group": "normal",
    },
    "content": {
      "type": "String",
      "view": "editor-tinymce",
      "col": 24,
      "name": "各类型文档，实际内容存储位置",
      "group": "normal",
      show:false,
    },
    "isEnabled": {
      "type": "Boolean",
      "name": "启用",
      "group": "normal"
    },
    parent: {
      type: "Pointer",
      targetClass: "NotePad",
      name: "上级文档",
      show:false,
    },
    order:{
      "type": "String",
      "name": "节点排序",
      show:false
    }
  }
}

export {NoteSchemas}
