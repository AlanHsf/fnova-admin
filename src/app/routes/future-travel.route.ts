import { AuthGuard } from "../auth.guard";

export const FutureTravelRoute = {
  path: "future-travel",
  loadChildren: () =>
    import("src/modules/future-travel/future-travel.module").then(
      mod => mod.FutureTravelModule
    ),

  canActivate: [AuthGuard],
  data: {
    title: "订单打印",
    icon: "book",
    nzOpen: true,
    subRoutes: [
      // { path: "dashboard", title: "数据总览", icon: "dashboard" },
      { pageUrl: "future-travel/receipt", title: "订单打印", icon: "book" },
      // {
      //   pageUrl: "common/manage/SurveyLogTest",
      //   title: "调查结果",
      //   icon: "book"
      // }
    ]
  }
};
