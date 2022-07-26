import { AuthGuard } from "../auth.guard";

export const LeagueRoute = {
  path: "league",
  loadChildren: () =>
    import("src/modules/league/league.module").then((mod) => mod.LeagueModule),
  canActivate: [AuthGuard],
  data: {
    title: "区域代理",
    icon: "shop",
    nzOpen: true,
    subRoutes: [
      {
        pageUrl: "common/manage/UserLeague",
        title: "代理审核",
        icon: "ordered-list",
      },
      {
        pageUrl: "common/manage/UserLeagueLevel",
        title: "代理级别",
        icon: "ordered-list",
      },
      {
        pageUrl: "common/manage/UserLeagueStockLog",
        title: "库存记录",
        icon: "ordered-list",
      }
    ],
  },
};
