import { AuthGuard } from "../auth.guard";

export const DiyPageRoute = {
  path: "diypage",
  loadChildren: () =>
    import("src/modules/diypage/diypage.module").then(mod => mod.DiypageModule),
  canActivate: [AuthGuard],
  data: {
    title: "页面装修",
    icon: "file-text",
    nzOpen: true,
    subRoutes: [
      { pageUrl: "common/manage/DiyPage", title: "页面管理", icon: "book" },
      // { pageUrl: "common/manage/CompanyCard", title: "名片管理", icon: "book" },
      // { pageUrl: 'diypage/dashboard', title:'进行编辑', icon:'book' }
    ]
  }
};
