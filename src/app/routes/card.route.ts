import { AuthGuard } from "../auth.guard";

export const CardRoute = {
  path: "card",
  loadChildren: "src/modules/card/card.module#CardModule",
  canActivate: [AuthGuard],
  data: {
    title: "社群管理",
    icon: "file-text",
    nzOpen: true,
    subRoutes: [
      { pageUrl: "common/manage/Card", title: "名片管理", icon: "book" }
    ]
  }
};
