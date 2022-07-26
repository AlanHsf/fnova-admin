let DiyPageSchemas: any = {};

DiyPageSchemas.DiyPage = {
  className: "DiyPage",
  name: "页面",
  desc: "创建自由编辑的手机页面。",
  detailTitle: "制作页面",
  detailPage: "/diypage/dashboard",
  displayedColumns: ["name", "isHome"],
  // qrUrl:"/diypage/page-view/${objectId}",
  qrUrl:
    "https://pwa.futurestack.cn/diypage/home;PclassName=DiyPage;PobjectId=${objectId}",
  displayedOperators: ["detail", "delete", "qrcode"],
  apps: ["diypage"],
  fields: {
    name: {
      type: "String",
      name: "页面名称",
    },
    isHome: {
      type: "Boolean",
      name: "是否首页",
    },
    titleBar: {
      type: "Object",
      name: "标题栏",
    },
    blocks: {
      type: "Array",
      name: "页面区块",
    },
  },
};

DiyPageSchemas.CompanyCard = {
  className: "CompanyCard",
  name: "页面",
  desc: "创建自由编辑的手机页面。",
  detailTitle: "制作页面",
  detailPage: "/diypage/dashboard",
  displayedColumns: ["name", "isHome"],
  // qrUrl:"/diypage/page-view/${objectId}",
  qrUrl:
    "https://pwa.futurestack.cn/diypage/home;PclassName=DiyPage;PobjectId=${objectId}",
  displayedOperators: ["detail", "delete", "qrcode"],
  apps: ["diypage"],
  fields: {
    name: {
      type: "String",
      name: "页面标题",
    },
    isHome: {
      type: "Boolean",
      name: "是否首页",
    },
    // titleBar: {
    //   type: "Object",
    //   name: "标题栏"
    // }
  },
};

export { DiyPageSchemas };
