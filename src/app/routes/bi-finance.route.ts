import { AuthGuard } from "../auth.guard";

export const BiFinanceRoute = {
  path: "finance",
  // loadChildren: "src/pages/common/common.module#CommomPageModule",
  loadChildren: () =>
    import("src/modules/bi-finance/bi-finance.module").then(
      mod => mod.BiFinanceModule
    ),

  canActivate: [AuthGuard],
  data: {
    title: "财务BI",
    icon: "book",
    nzOpen: true,
    subRoutes: [
      { pageUrl: "common/manage/BIReport", title: "创建报表", icon: "dashboard" },
      // { path: "finance/dashboard", title: "选择模版", icon: "dashboard" }, 
      // { path: "finance/enterdata", title: "录入数据", icon: "book" },
      // { path: "finance/report", title: "生成报表", icon: "book" },
      // { path: "finance/cockpit", title: "驾驶舱", icon: "book" },
    ]
  }
};
