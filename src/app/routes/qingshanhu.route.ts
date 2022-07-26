import { AuthGuard } from "../auth.guard";

export const QingShanHuRoute = {
  path: "qingshanhu",
  loadChildren: () =>
    import("src/modules/qingshanhu/qingshanhu.module").then(
      mod => mod.QingshanhuModule
    ),

  canActivate: [AuthGuard],
  data: {
    title: "活动签到",
    icon: "book",
    nzOpen: true,
    subRoutes: [
      // { path: "dashboard", title: "数据总览", icon: "dashboard" },
      { pageUrl: "qingshanhu/checkInResult", title: "签到结果", icon: "book" },
      // {
      //   pageUrl: "common/manage/SurveyLogTest",
      //   title: "调查结果",
      //   icon: "book"
      // }
    ]
  }
};
