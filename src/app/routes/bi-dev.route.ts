import { AuthGuard } from "../auth.guard";

export const BiDevRoute = {
  path: "finance",
  // loadChildren: "src/pages/common/common.module#CommomPageModule",
  loadChildren: () =>
    import("src/modules/bi-dev/bi-dev.module").then(mod => mod.BiDevModule),

  canActivate: [AuthGuard],
  data: {
    title: "开发BI",
    icon: "book",
    nzOpen: true,
    subRoutes: []
  }
};
