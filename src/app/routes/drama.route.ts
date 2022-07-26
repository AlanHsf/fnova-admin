import { AuthGuard } from "../auth.guard";

export const DramaRoute = {
  path: "drama",
  loadChildren: () =>
    import("src/modules/bi-dev/drama/drama.module").then(mod => mod.DramaModule),
  canActivate: [AuthGuard],
  data: {
    title: "推理社",
    icon: "file-text",
    nzOpen: true,
    subRoutes: [
      { pageUrl: "common/manage/DramaShop",title:"门店管理",icon:"book"},
      { pageUrl: "common/manage/Drama", title: "剧本管理", icon: "book" },
      { pageUrl: "common/manage/DramaBusiness", title: "商圈管理", icon: "book" },
      { pageUrl: "common/manage/DramaAuth", title: "剧本授权管理", icon: "book" },
      { pageUrl: "common/manage/DramaHost", title: "主持人管理", icon: "book" },
      { pageUrl: "common/manage/DramaOrder", title: "预约列表管理", icon: "book" },
      { pageUrl: "common/manage/DramaRoom", title: "剧本房间管理", icon: "book" },
      { pageUrl: "common/manage/DramaPerson",title:"剧本角色管理",icon:"book" },
      {pageUrl:"common/manage/DramaShopOwner",title:"店长管理",icon:"book"}
    ]
  }
};
