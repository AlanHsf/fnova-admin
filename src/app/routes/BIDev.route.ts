import { AuthGuard } from "../auth.guard";

export const BIDevRoute = {
  path: "developer",
  loadChildren: () =>
    import("src/modules/developer/developer.module").then(
      mod => mod.DeveloperModule
    ),
  canActivate: [AuthGuard],
  data: {
    title: "BI开发者表格管理",
    icon: "home",
    nzOpen: true,
    subRoutes: [
      { pageUrl: "common/manage/BIDevSchema", title: "BI表格管理", icon: "book" },   
      { pageUrl: 'common/manage/Category', title:'BI类别管理', icon:'book',data:{equalTo:"type:bischema"} },
    ]
  }
};
