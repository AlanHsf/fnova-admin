let SiteSchemas: any = {}
SiteSchemas.Site = {
  "className": "Site",
  "desc": "站点，系统注册站点管理。",
  "apps": ['site'],
  displayedOperators:["edit","delete"],
  displayedColumns:["title","domain","theme","company"],
  "fields": {
    "company": {
      "name":"所属公司",
      "type": "Pointer",
      "targetClass": "Company"
    },
    "title": {
      "name":"站点名称",
      "type": "String"
    },
    "logo": {
      "name":"站点LOGO",
      "type": "String"
    },
    "copyRight": {
      "name":"版权所属",
      "type": "String"
    },
    "poweredBy": {
      "name":"技术支持",
      "type": "String"
    },
    "theme": {
      "name":"主题模板",
      "type": "String"
    },
    "domain": {
      "name":"绑定域名",
      "type": "Array"
    },
    "appId": {
      "name":"云服务应用ID",
      "type": "String"
    },
    "serverURL": {
      "name":"云服务地址",
      "type": "String"
    }
  }
}
SiteSchemas.Article = {
  "className": "Article",
  "desc": "文章，各种内容存储类型，文章、问题、博客、书籍页面等。",
  displayedColumns:["cover","title","tag","src"],
  displayedOperators:["edit","delete"],
  "apps": ['site'],
  "fields": {
    "type": {
      "type": "String",
      "name": "文章类型",
      "view": "just-show",
      "group": "normal",
      "options": ["普通文章", "书籍文章"],
      show:false
    },
    "title": {
      "type": "String",
      "name": "文章标题",
      "group": "normal",
    },
    "category": {
      "type": "Pointer",
      "targetClass": "Category",
      "name": "所属分类",
      "group": "normal",
    },
    "tag": {
      "type": "Array",
      "name": "标签",
      "group": "normal",
    },
    "src": {
      "type": "String",
      "name": "文章来源",
      "group": "normal",
    },
    "desc": {
      "type": "String",
      "name": "文章摘要",
      "group": "normal",
    },
    "isBannerShow": {
      "type": "Boolean",
      "name": "分类顶部轮播",
      "group": "normal"
    },
    "cover": {
      "type": "Array",
      "name": "文章封面",
      "view": "image",
      "group": "normal",
    },
    "content": {
      "type": "String",
      "view": "editor-tinymce",
      "col": 24,
      "name": "文章内容",
      "group": "normal",
    },

    // "banner": {
    //   "type": "Array",
    //   "name": "轮播图封面",
    //   "view": "image",
    //   "group": "normal",
    // },
    // "bannerTag": {
    //   "type": "Array",
    //   "name": "轮播位置",
    //   "view": "select-multi",
    //   // "options": ['课堂首页','资讯首页', '创业', '就业', '生涯', '其他'],
    //   "options": ['课堂首页', '资讯首页'],
    //   "group": "normal",
    // },
    "author": {
      "type": "Pointer",
      "targetClass": "_User",
      "name": "作者",
      "group": "normal",
    },
    publishDate: {
      type: "Date",
      name: "发布时间"
    },
    "pageView": {
      "type": "Number",
      "name": "浏览次数",
      "group": "normal",
    },
    "commentCount": {
      "type": "Number",
      "name": "评论次数",
      "group": "normal",
    },
    "likeCount": {
      "type": "Number",
      "name": "点赞次数",
      "group": "normal",
    },
    "order": {
      "type": "Number",
      "name": "排序",
      "group": "normal",
    },
    "isEnabled": {
      "type": "Boolean",
      "name": "启用",
      "group": "normal"
    },
    "attachment": {
      "type": "Array",
      "name": "附件",
      "view": "file",
      "group": "normal",
    },
    "contentJson": {
      "show":false,
      "type": "Array",
      "view": "other",
      "group": "content",
      "name": "文章内容(文章内各节采用JSON形式存储)",
      "desc": "对象中序号表示详情中段落显示的顺序，0为最前",
      "default": [
        // { "type": "text", "value": "这个类型直接使用div标签展示" },
        // { "type": "img", "url": "图片URL", "value": "图片文件对象" },
        // { "type": "longimg", "cover": "长图封面图片对象", "url": "长图实际图片URL", "value": "长图实际图片对象" },
        // { "type": "video", "cover": "视频封面缩略图对象", "url": "mp4视频文件URL", "value": "mp4视频文件对象" }
      ]
    }
  }
}
SiteSchemas.ArticleLike = {
  "className": "ArticleLike",
  "desc": "赞同，分为喜欢、不喜欢两种方式。",
  "apps": ['site'],
  "fields": {
    "type": {
      "type": "Boolean",
      "name": "类型",
      "desc": "true<喜欢>/false<不喜欢>",
      "default": true
    },
    "user": {
      "type": "Pointer",
      "targetClass": "_User",
      "name": "关联用户",
    },
    "article": {
      "type": "Pointer",
      "targetClass": "Article",
      "name": "关联文章",
    }
  }
}
SiteSchemas.ArticleCollect = {
  "className": "ArticleCollect",
  "desc": "收藏，可将文章、问题、博客、书籍页面等收藏至自己的收藏夹中，默认收藏入【未分类】。",
  "apps": ['site'],
  "fields": {
    "name": {
      "type": "String",
      "name": "收藏夹名称",
      "default": ""
    },
    "user": {
      "type": "Pointer",
      "targetClass": "_User",
      "name": "关联用户",
    },
    "article": {
      "type": "Pointer",
      "targetClass": "Article",
      "name": "关联文章",
    }
  }
}

SiteSchemas.ArticleBook = {
  "className": "ArticleBook",
  "desc": "书籍",
  "apps": ['site'],
  "fields": {
    "title": {
      "type": "String",
      "view": "text",
      "name": "标题"
    },
    "desc": {
      "type": "String",
      "view": "text",
      "name": "详情"
    },
    "cover": {
      "type": "Array",
      "view": "edit-image",
      "name": "封面"
    },
    "order": {
      "type": "Number",
      "name": "排序"
    },
    "type": {
      "type": "String",
      "name": "类型",
      "view": "just-show",
      "options": ["book", "chapter", "page"]
    },
    "parent": {
      "type": "Pointer",
      "view": "just-show",
      "targetClass": "ArticleBook",
      "name": "关联",
    },
    "isLocked": {
      "type": "Boolean",
      "name": "是否加锁",
    },
    "isEnabled": {
      "type": "Boolean",
      "name": "是否发布",
    },
    "isVerifying": {
      "type": "Boolean",
      "name": "是否审核",
    },
  }
}
export {SiteSchemas}
