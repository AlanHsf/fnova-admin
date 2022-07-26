import { AuthGuard } from "../auth.guard";

export const MasterolSecondRoute = {
  path: "masterol",
  loadChildren: () =>
    import("src/modules/masterol/masterol.module").then(mod => mod.MasterolModule),
  canActivate: [AuthGuard],
  data: {
    title: "第二课堂管理",
    icon: "file-text",
    nzOpen: true,
    subRoutes: [
      { pageUrl: "common/manage/SecondLesson", title: "课堂专业管理", icon: "book" },
      { pageUrl: "common/manage/SecondLessonType", title: "课堂分类管理", icon: "book" },
      { pageUrl: "common/manage/SecondLessonTypeDetail", title: "第二课堂详情管理", icon: "book" },
    ]
  }
};
