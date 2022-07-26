import { AuthGuard } from "../auth.guard";

export const FanstaskRoute = {
  path: "fanstask",
  loadChildren: () =>
    import("src/modules/fanstask/fanstask.module").then((mod) => mod.FanstaskModule),
  canActivate: [AuthGuard],
  data: {
    title: "直播任务",
    icon: "shop",
    nzOpen: true,
    subRoutes: [
      {
        pageUrl: "common/manage/FansTask",
        title: "已发任务",
        icon: "ordered-list",
      },
      {
        pageUrl: "common/manage/FansTaskLog",
        title: "任务审核",
        icon: "ordered-list",
      }   
    ],
  },
};
