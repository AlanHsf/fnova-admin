import { AuthGuard } from "../auth.guard";

export const QuestionRoute = {
  path: "question",
  // loadChildren: "src/pages/common/common.module#CommomPageModule",
  loadChildren: () =>
    import("src/modules/question/question.module").then(
      mod => mod.QuestionModule
    ),

  canActivate: [AuthGuard],
  data: {
    title: "职工问卷调查",
    icon: "book",
    nzOpen: true,
    subRoutes: [
      // { path: "dashboard", title: "数据总览", icon: "dashboard" },
      { pageUrl: "question/dashboard", title: "数据总览", icon: "dashboard" },
      { pageUrl: "common/manage/Question", title: "问卷调查", icon: "book" },
      { pageUrl: "question/detail", title: "数据详情", icon: "detail" },
      { pageUrl: "question/dashboardSatisficing", title: "满意度调查数据", icon: "detail" }
      // {
      //   pageUrl: "common/manage/SurveyLogTest",
      //   title: "调查结果",
      //   icon: "book"
      // }
    ]
  }
};
