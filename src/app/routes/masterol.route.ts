import { AuthGuard } from "../auth.guard";

export const MasterolRoute = {
  path: "masterol",
  loadChildren: () =>
    import("src/modules/masterol/masterol.module").then(mod => mod.MasterolModule),
  // canActivate: [AuthGuard],
  data: {
    title: "课程管理",
    icon: "file-text",
    nzOpen: true,
    subRoutes: [
    // { path: "test", title: "我的页面", icon: "book" }
      { pageUrl: "common/manage/Lesson", title: "课程管理", icon: "book" },
      { pageUrl: "common/manage/LessonArticle", title: "章节管理", icon: "book" },
    ]
  }
};
