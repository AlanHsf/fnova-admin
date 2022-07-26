import { AuthGuard } from "../auth.guard";

export const XiyuanRoute = {
  path: "xiyuan",
  loadChildren: () =>
    import("src/modules/xiyuan/xiyuan.module").then(mod => mod.XiyuanModule),
  // canActivate: [AuthGuard],
  data: {
    title: "课程管理",
    icon: "file-text",
    nzOpen: true,
    subRoutes: [
    ]
  }
};
