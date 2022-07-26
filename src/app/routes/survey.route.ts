import { AuthGuard } from "../auth.guard";

export const SurveyRoute = {
  path: "survey",
  loadChildren: "src/pages/common/common.module#CommomPageModule",
  canActivate: [AuthGuard],
  data: {
    title: "考试管理",
    icon: "book",
    nzOpen: true,
    subRoutes: [
      { pageUrl: "common/manage/Survey", title: "试卷管理", icon: "book" }
    ]
  }
};
